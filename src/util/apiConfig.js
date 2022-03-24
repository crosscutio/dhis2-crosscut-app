import axios from 'axios'

const apiUrl = "https://play.dhis2.org/dev/api/38"

const api = axios.create( {
    baseURL: apiUrl
})

api.interceptors.request.use(
    async (options) => {
        options.headers["Authorization"] = `Basic ${btoa("admin:district")}`
        return options
    }, 
    (error) => {
        console.log("request error: ", error)
        return Promise.reject(error)
    }
)

export default api