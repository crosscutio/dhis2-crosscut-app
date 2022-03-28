import ky from 'ky'
import { fetchGeoJSON } from './requests';
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
        return resp.jobs
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
