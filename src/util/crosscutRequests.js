import axios from 'axios'
import { fetchGeoJSON } from './requests';
const CROSSCUT_API = "https://qwui27io74.execute-api.us-east-1.amazonaws.com";

// need to store token somewhere (HTTP COOKIE)

export const fetchCatchmentJobs = async (token) => {
    const url = `${CROSSCUT_API}/catchment-jobs`;
    try {
        const resp = await axios.get(url, {
          mode: "cors",
          headers: {
            authorization: token,
          },
        })
        return resp.data.jobs
    } catch (err) {
        throw err
    }
}

export const createCatchmentJob = async (token, json) => {
    const url = `${CROSSCUT_API}/catchment-jobs`
    try {
        const id = json.level
        const sites = await fetchGeoJSON(id)
        console.log(sites)
    

        // const resp = await axios.post(url, {
        //     json,
        //     mode: "cors",
        //     headers: {
        //       authorization: token,
        //     },
        // })
        // console.log(resp)
        console.log(json)
    } catch (err) {
        throw err
    }
}

export const deleteCatchmentJob = async (token, id) => {
    const url = `${CROSSCUT_API}/catchment-jobs/${id}`
    try {
        const resp = await axios.delete(url, {
            mode: "cors",
            headers: {
              authorization: token,
            },
        })
        console.log(resp)
    } catch (err) {
        throw err
    }
}
