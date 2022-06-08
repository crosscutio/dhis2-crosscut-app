import ky from 'ky'
import { fetchCurrentAttributes, fetchValidPoints } from './requests';
import { getToken } from '../services/JWTManager'
import papaparse from "papaparse"
import { getCrossCutBaseUrl } from './apiConfig';
import i18n from '../locales/index.js'

const baseURL = getCrossCutBaseUrl()

export const fetchCatchmentJobs = async () => {
    const url = `${baseURL}/catchment-jobs`;
    try {
        const resp = await ky(url, {
          mode: "cors",
          headers: {
            authorization: getToken(),
          },
        }).json()

        const statuses = {
            "SUCCESS": i18n.t("Ready"),
            "PUBLISHED": i18n.t("Published"),
            "PENDING": i18n.t("Pending"),
            "FAILURE": i18n.t("Failed")
        }
        // filter out jobs that aren't site-based
        const siteBasedJobs = resp.jobs.filter((job) => job.algorithm === "site-based")
        siteBasedJobs.sort((a,b) => {
            if (a.id > b.id) return -1
            if (a.id < b.id) return 1
            return 0
        })

        const allAttributes = await fetchCurrentAttributes()
        // TODO: add error handling

        siteBasedJobs.map(async (job) => {
            job.date = job.date === undefined ? "" : job.date.split("T")[0]

            if (job.status === "SUCCESS") {
                job.status = statuses[job.status]

                if (job.properties !== null) {
                    const attribute = job.properties.find((prop) => prop.field === "attributeId")

                    const detail = job.properties.find((prop) => prop.field === "dhisFormInputs")

                    if (detail !== undefined) {
                        job.jobDetails = detail.value
                    }

                    if (attribute !== undefined) {
                        const found = allAttributes.find((att) => att.id === attribute.value)

                        // if the attribute is in DHIS2 and in Crosscut then show the published status
                        if (attribute !== undefined && found !== undefined) {
                            job.status = statuses["PUBLISHED"]
                            job.attributeId = attribute.value
                        // if the attribute is not in DHIS2 but in Crosscut then remove the attribute from Crosscut
                        } else if (attribute !== undefined && found === undefined) {
                            if (job.properties.length === 1) {
                                job.properties = null
                           } else if (job.properties.length > 1) {
                               job.properties = job.properties.filter((prop) => prop.field !== "attributeId")
                           }
                            await updateCatchmentItem(job.id, { field: "attributeId" })
                        }
                    }
                   
                }
            }

            if (job.status === "PENDING") {
                job.status = statuses[job.status]
            }
            
            if (job.status === "FAILURE") {
                job.status = statuses[job.status]
            }
        })
        return siteBasedJobs
    } catch (err) {
        throw err
    }
}

export const createCatchmentJob = async (body) => {
    try {
        const levelId = body.level
        const groupId = body.group

        let data = null
        let csv = body.csv
        // csv wouldn't be an empty string if the user had errors and cleared them
        // the csv should get passed in to be used
        if (csv === "") {
            data = await fetchValidPoints(levelId, groupId)
            // no sites were found
            if (data.length === 0) {
                throw { response: { message: "No Content", status: 204 } } 
            }
            data = data.map((d) => {
                d["orgUnitId"] = d.id
                delete d.id
                return d
            })
            csv = papaparse.unparse(data)
        } else {
            csv = papaparse.unparse(body.csv)
        }
        const json = {
            fields: {
                lat: "lat",
                lng: "long",
                name: "name",
            },
            name: body.name,
            country: body.country,
            csv,
            algorithm: "site-based"
        }

        const verify_url = `${baseURL}/catchment-jobs/verify`;

        // define how big each "chunk" of sites should be
        let CHUNK_SIZE = 1000;
  
        // break CSV into smaller rows, broken by CRLF or LF
        const rows = json.csv.replace(/\r\n/g, "\n").split("\n");
  
        // define one header row
        const header_row = rows[0];
  
        // create an array of promises
        const chunk_waits = [];
  
        // break the CSV into chunks of CHUNK_SIZE sites at a time
        for (let i = 1; i < rows.length; i += CHUNK_SIZE) {
          const chunk = rows.slice(i, i + CHUNK_SIZE);
          const joined_chunk = chunk.join("\n");
  
          // add header row
          json.csv = `${header_row}\n${joined_chunk}`;
          json.id_start = i - 1; // start at 0 for first chunk for the ID (ignore header row)
  
          // add the verify promise to the array of promises
          chunk_waits.push(
            ky
              .post(verify_url, {
                timeout: 31 * 1000, // have ky kill the request after 30 seconds
                json,
                mode: "cors",
                headers: {
                    authorization: getToken(),
                },
              })
              .json()
          );
        }
  
        // perform a site validation for all chunks in parallel
        // and wait for all of them to finish (Promise.all fast fails)
        const chunk_responses = await Promise.allSettled(chunk_waits);
  
        // use these variables to keep track of results while iterating
        // through the chunk responses
        let valid_csv = [];
        let valid_csv_to_add = null;
        let invalid_csv_to_add = null;
        let error_encountered = false;
        let exception_caught = null;
        let error_header_row_added = false;
        let error_csv = "";
  
        // process each of the responses
        for (const chunk_response of chunk_responses) {
          // check to see if validation failed or not
          if (chunk_response.status === "fulfilled") {
            // get the valid csv and the csv with empty error message column from response
            valid_csv_to_add = chunk_response.value.valid_csv;
            invalid_csv_to_add = chunk_response.value.csv_details;
          } else {
            error_encountered = true;
            exception_caught = JSON.parse(
              await chunk_response.reason.response.text()
            ); // overwrite with the most recent error
            invalid_csv_to_add = exception_caught.csv_details;
          }
  
          // keep building the invalid csv to return even if no errors have been found
          // otherwise valid sites might not be included in the full error csv
          // displayed to the user
          if (invalid_csv_to_add !== null) {
            // turn into an array separated by new lines
            const error_rows = invalid_csv_to_add
              .replace(/\r\n/g, "\n")
              .split("\n");
  
            let slice_start = 1; // default to skip the header
  
            // add the error header row (with the error message header) for the very first row
            if (!error_header_row_added) {
              slice_start = 0; // don't skip the header this time
              error_header_row_added = true;
            }
  
            // turn the rows back into a string joined by a newline
            const chunk_csv_error = error_rows
              .slice(slice_start, error_rows.length)
              .join("\n");
  
            // append the additional errors
            error_csv = `${error_csv}${chunk_csv_error}`;
          } // end processing invalid_csv_to_add
  
          // continue to build the valid_csv until an error is encountered
          if (valid_csv_to_add !== null && error_encountered === false) {
            valid_csv.push(...valid_csv_to_add);
          }
        } // end for each chunk response
  
        // if there's an error, return it back to the caller with the latest csv
        if (error_encountered) {
          exception_caught.csv = error_csv; // overwrite the response with the combined errors
          throw exception_caught; // make CreateSiteBasedCatchment show errors to user
        } else {
          // save the full valid CSV to use in creating the catchment job and proceed
          json.csv = valid_csv;
        } // end if error encountered

        const create_url = `${baseURL}/catchment-jobs`
        const catchment = await ky.post(create_url, {
            json,
            mode: "cors",
            headers: {
                authorization: getToken(),
            },
        }).json()  

        await updateCatchmentItem(catchment.id, { field: "dhisFormInputs", value: { levelId, groupId } }) 
    } catch (err) {
        throw err
    }  
}

export const deleteCatchmentJob = async (id) => {
    const url = `${baseURL}/catchment-jobs/${id}`
    try {
        await ky.delete(url, {
            mode: "cors",
            headers: {
              authorization: getToken(),
            },
        })
    } catch (err) {
        throw err
    }
}

export const fetchSupportedBoundaries = async () => {
    const boundaryVerion = "v3"
    const url = `${baseURL}/boundaries/${boundaryVerion}`
    try {
        const resp = await ky(url, {
            mode: "cors",
            headers: {
                authorization: getToken(),
            }
        }).json()
       
        return resp.boundaryList.filter((bound) => bound.featureFlags.includes("all")).filter((bound) => bound.entireCountry === true).sort((a,b) => {
            if (a.countryName > b.countryName) return 1
            if (a.countryName < b.countryName) return -1
            return 0
        })
    } catch (err) {
        throw err
    }
}

export const getCatchmentGeoJSON = async (id) => {
    const url = `${baseURL}/catchment-jobs/${id}/geojson`
    try {
        const resp = await ky(url, {
            mode: "cors",
            headers: {
                authorization: getToken(),
            }
        }).json()

        return resp.features
    } catch (err) {
        throw err
    }
}

export const updateCatchmentItem = async (id, json) => {
    const url = `${baseURL}/catchment-jobs/${id}/item`
    try {
        const resp = await ky.put(url, {
            json,
            mode: "cors",
            headers: {
                authorization: getToken()
            }
        }).json()
        return resp
    } catch (err) {
        throw err
    }
}

export const getCatchmentJobAttributeId = async (id) => {
    const url = `${baseURL}/catchment-jobs/${id}`
    try {
        const resp = await ky(url, {
            mode: "cors",
            headers: {
                authorization: getToken()
            }
        }).json()
        
        return resp.properties.find((prop) => prop.field === "attributeId")
    } catch (err) {
        throw err
    }
}

export const getCatchmentJob = async (id) => {
    const url = `${baseURL}/catchment-jobs/${id}`
    try {
        const resp = await ky(url, {
            mode: "cors",
            headers: {
                authorization: getToken()
            }
        }).json()
        
        return resp
    } catch (err) {
        throw err
    }
}