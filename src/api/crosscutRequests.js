import ky from 'ky'
import { fetchGeoJSON, fetchCurrentAttributes, fetchValidPoints } from './requests';
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

        siteBasedJobs.map(async (job) => {
            job.date = job.date === undefined ? "" : job.date.split("T")[0]

            if (job.status === "SUCCESS") {
                job.status = statuses[job.status]

                if (job.properties !== null) {
                    const attribute = job.properties.find((prop) => prop.field === "attributeId")
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
    const url = `${baseURL}/catchment-jobs`
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
            return { error: { message: "No Content", status: 204 } } 
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

    // TODO: there needs to be a way to save the fields they chose (levels and groups)
    await ky.post(url, {
        json,
        mode: "cors",
        headers: {
            authorization: getToken(),
        },
    })    
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