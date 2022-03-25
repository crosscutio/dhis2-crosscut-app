import axios from 'axios'

const CROSSCUT_API = "https://qwui27io74.execute-api.us-east-1.amazonaws.com";

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
