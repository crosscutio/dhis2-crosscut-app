import { config } from 'd2'

export const getBaseURL = () => {
    let baseURL

    let apiUrls = {
        // development: "https://play.dhis2.org/dev/api/38",
        development: "http://localhost:8080/api",
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
    Authorization: `Basic ${btoa("admin:district")}`, 
    // headers: { Authorization: `Basic ${btoa("admin:district")}`}, 
    "Content-Type": "application/json",
    credentials: "include",
}

export const getCrossCutBaseUrl = () => {
    let baseURL

    let apiUrls = {
        development: "https://api-staging.app.crosscut.io",
        production: "https://api-production.app.crosscut.io"
    }   
    
    if(window.location.hostname === "localhost") {
        baseURL = apiUrls.development
    } else {
        baseURL = apiUrls.production
    }
    return baseURL
}