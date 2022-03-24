import { config } from 'd2';

const getJsonResponse = async (response) => {
    const string = await response.text();
    const json = string === '' ? undefined : JSON.parse(string);
    return json;
};

export const apiFetch = async (url, method, body) => {
    const options = {
        headers: {
            'Content-Type': 'application/json', // Default API response
            Authorization: `Basic ${btoa("admin:district")}`,
        },
    };
    options.credentials = 'include';

    if (method && body) {
        options.method = method;
        if (typeof body === "string") {
            options.headers['Content-Type'] = 'text/html';
            options.body = body;
        } else if (typeof body === "object") {
            options.body = JSON.stringify(body);
        }
    }
    fetch(`${config.baseUrl}${url}`, options).then(response => JSON.parse(response)).then(data => console.log(data))
    // TODO: Better error handling
    // return fetch(encodeURI(config.baseUrl + url), options)
    //     .then(response =>
    //         response.json()
    //         // ['POST', 'PUT', 'PATCH'].includes(method)
    //         //     ? response
    //         //     : getJsonResponse(response)
    //     ).then(data => console.log(data))
    //     .catch(error => console.log('Error: ', error)); // eslint-disable-line
};