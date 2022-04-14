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
        // check to see if catchment has been published to update the status
        // currently has name and id from DHIS2 (will need to check a different way)
        const catchmentsPublished = await fetchCurrentAttributes()

        // TODO: check for published catchments to update the status
        // the different statues to display
        const statuses = {
            "SUCCESS": i18n.t("Ready"),
            "PUBLISHED": i18n.t("Publish"),
            "UNPUBLISH": i18n.t("Unpublish"),
            "PENDING": i18n.t("Pending")
        }
        // filter out jobs that aren't site-based
        const siteBasedJobs = resp.jobs.filter((job) => job.algorithm === "site-based")
        
        siteBasedJobs.map((job) => {
            if (job.status === "SUCCESS") {
                job.status = statuses[job.status]
            }
            if (job.status === "PENDING") {
                job.status = statuses[job.status]
            }
            job.date = job.date === undefined ? "" : job.date.split("T")[0]
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
        csv = papaparse.unparse(data)
    } else {
        csv = papaparse.unparse(body.csv)
    }

    const json = {
        fields: {
            lat: "lat",
            lng: "long",
            name: "name"
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