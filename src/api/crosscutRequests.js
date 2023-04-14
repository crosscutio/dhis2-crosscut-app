import ky from 'ky';
import { fetchCurrentAttributes, fetchValidPoints } from './requests';
import { getToken } from '../services/JWTManager';
import papaparse from 'papaparse';
import { getCrossCutBaseUrl } from './apiConfig';
import i18n from '../locales/index.js';

const baseURL = getCrossCutBaseUrl();

export const fetchCatchmentJobs = async () => {
  const url = `${baseURL}/catchment-jobs`;
  try {
    const resp = await ky(url, {
      mode: 'cors',
      headers: {
        authorization: getToken(),
      },
    }).json();

    const statuses = {
      SUCCESS: i18n.t('Ready'),
      PUBLISHED: i18n.t('Published'),
      PENDING: i18n.t('Pending'),
      FAILURE: i18n.t('Failed'),
    };
    // filter out jobs that aren't site-based
    const siteBasedJobs = resp.jobs.filter(
      (job) => job.algorithm === 'site-based'
    );
    siteBasedJobs.sort((a, b) => {
      if (a.id > b.id) return -1;
      if (a.id < b.id) return 1;
      return 0;
    });

    const allAttributes = await fetchCurrentAttributes();
    // TODO: add error handling

    siteBasedJobs.map(async (job) => {
      job.date = job.date === undefined ? '' : job.date.split('T')[0];

      if (job.status === 'SUCCESS') {
        job.status = statuses[job.status];

        if (job.properties !== null) {
          const attribute = job.properties.find(
            (prop) => prop.field === 'attributeId'
          );

          const detail = job.properties.find(
            (prop) => prop.field === 'dhisFormInputs'
          );

          if (detail !== undefined) {
            job.jobDetails = detail.value;
          }

          if (attribute !== undefined) {
            const found = allAttributes.find(
              (att) => att.id === attribute.value
            );

            // if the attribute is in DHIS2 and in Crosscut then show the published status
            if (attribute !== undefined && found !== undefined) {
              job.status = statuses['PUBLISHED'];
              job.attributeId = attribute.value;
              // if the attribute is not in DHIS2 but in Crosscut then remove the attribute from Crosscut
            } else if (attribute !== undefined && found === undefined) {
              if (job.properties.length === 1) {
                job.properties = null;
              } else if (job.properties.length > 1) {
                job.properties = job.properties.filter(
                  (prop) => prop.field !== 'attributeId'
                );
              }
              await updateCatchmentItem(job.id, {
                field: 'attributeId',
              });
            }
          }
        }
      }

      if (job.status === 'PENDING') {
        job.status = statuses[job.status];
      }

      if (job.status === 'FAILURE') {
        job.status = statuses[job.status];
      }
    });
    return siteBasedJobs;
  } catch (err) {
    throw err;
  }
};

export const createCatchmentJob = async (body) => {
  try {
    const levelId = body.level;
    const groupId = body.group;

    let data = null;
    let csv = body.csv;
    // csv wouldn't be an empty string if the user had errors and cleared them
    // the csv should get passed in to be used
    if (csv === '') {
      data = await fetchValidPoints(levelId, groupId);
      // no sites were found
      if (data.length === 0) {
        throw { response: { message: 'No Content', status: 204 } };
      }
      data = data.map((d) => {
        d['orgUnitId'] = d.id;
        delete d.id;
        return d;
      });
      csv = papaparse.unparse(data);
    } else {
      csv = papaparse.unparse(body.csv);
    }
    const json = {
      fields: {
        lat: 'lat',
        lng: 'long',
        name: 'name',
      },
      name: body.name,
      country: body.country,
      csv,
      algorithm: 'site-based',
    };

    const verify_url = `${baseURL}/catchment-jobs/verify`;

    // define how big each "chunk" of sites should be
    const CHUNK_SIZE = 1000;

    // break CSV into smaller rows, broken by CRLF or LF
    const rows = json.csv.replace(/\r\n/g, '\n').split('\n');

    // define one header row
    const headerRow = rows[0];

    // create an array of promises
    const chunkWaits = [];

    // break the CSV into chunks of CHUNK_SIZE sites at a time
    // start at 1 to skip the header row
    for (let i = 1; i < rows.length; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE);
      const joinedChunk = chunk.join('\n');

      // add header row
      json.csv = `${headerRow}\n${joinedChunk}`;
      json.idStart = i - 1; // start at 0 for first chunk for the ID (ignore header row)

      // add the verify promise to the array of promises
      chunkWaits.push(
        ky
          .post(verify_url, {
            timeout: 31 * 1000, // have ky kill the request after 30 seconds
            json,
            headers: {
              authorization: getToken(),
            },
          })
          .json()
      );
    }

    // perform a site validation for all chunks in parallel
    // and wait for all of them to finish (Promise.all fast fails)
    const chunkResponses = await Promise.allSettled(chunkWaits);

    // use these variables to keep track of results while iterating
    // through the chunk responses
    const validCsv = [];
    let validCsvToAdd = null;
    let invalidCsvToAdd = null;
    let errorEncountered = false;
    let exceptionCaught = null;
    let errorHeaderRowAdded = false;
    let errorCsv = '';

    // process each of the responses
    for (const chunkResponse of chunkResponses) {
      // check to see if validation failed or not
      if (chunkResponse.status === 'fulfilled') {
        // get the valid csv and the csv with empty error message column from response
        validCsvToAdd = chunkResponse.value.validCsv;
        invalidCsvToAdd = chunkResponse.value.csvDetails;
      } else {
        errorEncountered = true;
        exceptionCaught = JSON.parse(
          await chunkResponse.reason.response.text()
        ); // overwrite with the most recent error
        invalidCsvToAdd = exceptionCaught.csvDetails;
      }

      // keep building the invalid csv to return even if no errors have been found
      // otherwise valid sites might not be included in the full error csv
      // displayed to the user
      if (invalidCsvToAdd !== null) {
        // turn into an array separated by new lines
        const errorRows = invalidCsvToAdd.replace(/\r\n/g, '\n').split('\n');

        let sliceStart = 1; // default to skip the header

        // add the error header row (with the error message header) for the very first row
        if (!errorHeaderRowAdded) {
          sliceStart = 0; // don't skip the header this time
          errorHeaderRowAdded = true;
        }

        // turn the rows back into a string joined by a newline
        const chunkCsvError = errorRows
          .slice(sliceStart, errorRows.length)
          .join('\n');

        // append the additional errors
        errorCsv = `${errorCsv}${chunkCsvError}`;
      } // end processing invalidCsvToAdd

      // continue to build the validCsv until an error is encountered
      if (validCsvToAdd !== null && errorEncountered === false) {
        validCsv.push(...validCsvToAdd);
      }
    } // end for each chunk response

    // if there's an error, return it back to the caller with the latest csv
    if (errorEncountered) {
      exceptionCaught.csv = errorCsv; // overwrite the response with the combined errors
      throw exceptionCaught; // make CreateSiteBasedCatchment show errors to user
    } else {
      // save the full valid CSV to use in creating the catchment job and proceed
      json.csv = validCsv;
    } // end if error encountered

    const create_url = `${baseURL}/catchment-jobs`;
    const catchment = await ky
      .post(create_url, {
        json,
        mode: 'cors',
        headers: {
          authorization: getToken(),
        },
      })
      .json();

    await updateCatchmentItem(catchment.id, {
      field: 'dhisFormInputs',
      value: { levelId, groupId },
    });
  } catch (err) {
    throw err;
  }
};

export const deleteCatchmentJob = async (id) => {
  const url = `${baseURL}/catchment-jobs/${id}`;
  try {
    await ky.delete(url, {
      mode: 'cors',
      headers: {
        authorization: getToken(),
      },
    });
  } catch (err) {
    throw err;
  }
};

export const fetchSupportedBoundaries = async () => {
  const boundaryVerion = 'v3';
  const url = `${baseURL}/boundaries/${boundaryVerion}`;
  try {
    const resp = await ky(url, {
      mode: 'cors',
      headers: {
        authorization: getToken(),
      },
    }).json();
    // sort/organize the boundary list
    const boundaryList = Object.values(resp.boundaryList);

    const entireCountries = boundaryList.filter(
      (boundary) => boundary.entireCountry === true
    );

    const partialCountries = boundaryList.filter(
      (boundary) => boundary.entireCountry === false
    );

    const countries = [];
    entireCountries.forEach((country) => {
      countries.push({
        name: country.countryName,
        id: country.id,
        areas: [],
        featureFlags: country.featureFlags,
        minPopulation: country.minPopulation,
      });
    });

    partialCountries.forEach((country) => {
      const found = countries.find((item) => item.name === country.countryName);
      if (found !== undefined) {
        // add an entry for the entire country
        if (found.id !== undefined) {
          found['areas'].push({
            name: 'Entire Country',
            id: found.id,
            featureFlags: found.featureFlags,
            minPopulation: found.minPopulation,
          });
          found.id = undefined;
        }
        found['areas'].push({
          name: country.areaName,
          id: country.id,
          featureFlags: country.featureFlags,
          minPopulation: country.minPopulation,
        });
      } else {
        countries.push({
          name: country.countryName,
          areas: [
            {
              name: country.areaName,
              id: country.id,
              featureFlags: country.featureFlags,
              minPopulation: country.minPopulation,
            },
          ],
        });
      }
    });

    // sort country areas alphabetically
    countries.forEach((country) => {
      country.areas.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    });

    // sort countries alphabetically
    countries.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    return countries;
    // console.log(resp.boundaryList);
    // return (
    //   resp.boundaryList
    //     .filter((bound) => bound.featureFlags.includes('all'))
    //     // .filter((bound) => bound.entireCountry === true)
    //     .sort((a, b) => {
    //       if (a.countryName > b.countryName) return 1;
    //       if (a.countryName < b.countryName) return -1;
    //       return 0;
    //     })
    // );
  } catch (err) {
    throw err;
  }
};

export const getCatchmentGeoJSON = async (id) => {
  const url = `${baseURL}/catchment-jobs/${id}/geojson`;
  try {
    const resp = await ky(url, {
      mode: 'cors',
      headers: {
        authorization: getToken(),
      },
    }).json();

    return resp.features;
  } catch (err) {
    throw err;
  }
};

export const updateCatchmentItem = async (id, json) => {
  const url = `${baseURL}/catchment-jobs/${id}/item`;
  try {
    const resp = await ky
      .put(url, {
        json,
        mode: 'cors',
        headers: {
          authorization: getToken(),
        },
      })
      .json();
    return resp;
  } catch (err) {
    throw err;
  }
};

export const getCatchmentJobAttributeId = async (id) => {
  const url = `${baseURL}/catchment-jobs/${id}`;
  try {
    const resp = await ky(url, {
      mode: 'cors',
      headers: {
        authorization: getToken(),
      },
    }).json();

    return resp.properties.find((prop) => prop.field === 'attributeId');
  } catch (err) {
    throw err;
  }
};

export const getCatchmentJob = async (id) => {
  const url = `${baseURL}/catchment-jobs/${id}`;
  try {
    const resp = await ky(url, {
      mode: 'cors',
      headers: {
        authorization: getToken(),
      },
    }).json();

    return resp;
  } catch (err) {
    throw err;
  }
};
