export const options = {
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    credentials: "include",
    timeout: '60000'
}

export const getCrossCutBaseUrl = () => {
    let baseURL

    let apiUrls = {
        development: "https://api-staging.app.crosscut.io",
        production: "https://api-production.app.crosscut.io"
    }   
    
    if (window.location.hostname === "localhost") {
        baseURL = apiUrls.development
    } else {
        baseURL = apiUrls.production
    }
    return baseURL
}