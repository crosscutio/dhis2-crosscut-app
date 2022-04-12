import ky from 'ky'
import { fetchGeoJSON, fetchCurrentAttributes } from './requests';
import { getToken } from '../services/JWTManager'
// TO-DO: use crosscut created url
const CROSSCUT_API = "https://qwui27io74.execute-api.us-east-1.amazonaws.com";

export const fetchCatchmentJobs = async () => {
    const url = `${CROSSCUT_API}/catchment-jobs`;
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
            "READY": "Ready",
            "PUBLISHED": "Publish",
            "UNPUBLISH": "Unpublish"
        }
        // filter out jobs that aren't site-based
        const siteBasedJobs = resp.jobs.filter((job) => job.algorithm === "site-based")
        
        siteBasedJobs.map((job) => {
            if (job.status === "SUCCESS") {
                job.status = "Ready"
            }
            job.date = job.date === undefined ? "" : job.date.split("T")[0]
        })
        return siteBasedJobs
    } catch (err) {
        throw err
    }
}

export const createCatchmentJob = async (json) => {
    const url = `${CROSSCUT_API}/catchment-jobs`
    try {
        const id = json.level
        const geojson = await fetchGeoJSON(id)
    
        // TO-DO: needs name, lat, lng, csv
        // const resp = await ky.post(url, {
        //     json,
        //     mode: "cors",
        //     headers: {
        //       authorization: getToken(),
        //     },
        // })       
    } catch (err) {
        throw err
    }
}

export const deleteCatchmentJob = async (id) => {
    const url = `${CROSSCUT_API}/catchment-jobs/${id}`
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
