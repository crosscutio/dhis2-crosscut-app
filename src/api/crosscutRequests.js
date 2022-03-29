import ky from 'ky'
import { fetchGeoJSON, fetchCurrentAttributes } from './requests';
import { getToken } from '../services/JWTManager'
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
        // check to see if catchment has been published
        // currently has name and id from DHIS2 (will need to check a different way)
        const catchmentsPublished = await fetchCurrentAttributes()
        console.log(catchmentsPublished)

        const statuses = {
            "READY": "Ready",
            "PUBLISHED": "Publish",
            "UNPUBLISH": "Unpublish"
        }
        // filter out jobs that aren't site-based
        const siteBasedJobs = resp.jobs.filter((job) => job.algorithm === "site-based")
        
        siteBasedJobs.map((job) => {
            job.status = "Ready"
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
        console.log(geojson)
    
// need name, lat, lng, csv
        // const resp = await ky.post(url, {
        //     json,
        //     mode: "cors",
        //     headers: {
        //       authorization: getToken(),
        //     },
        // })
        // console.log(resp)
        console.log(json)
    } catch (err) {
        throw err
    }
}

export const deleteCatchmentJob = async (id) => {
    const url = `${CROSSCUT_API}/catchment-jobs/${id}`
    try {
        const resp = await ky.delete(url, {
            mode: "cors",
            headers: {
              authorization: getToken(),
            },
        })
        console.log(resp)
    } catch (err) {
        throw err
    }
}
