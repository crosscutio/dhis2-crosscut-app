import { config } from 'd2'

const auth = `Basic ${btoa("admin:district")}`

export const getBaseURL = () => {
    let baseURL

    let apiUrls = {
        development: "https://play.dhis2.org/dev/api/37",
        // development: "http://localhost:8080/api",
        production: config.baseUrl
    }   
    
    if(window.location.hostname === "localhost") {
        baseURL = apiUrls.development
    } else {
        baseURL = apiUrls.production
    }
    return baseURL
}

export const options = {
    headers: { authorization: auth },
    "Content-Type": "application/json",
    credentials: "include",
}