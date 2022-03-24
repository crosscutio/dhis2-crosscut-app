import { config } from 'd2';

const getJsonResponse = async response => {
    const string = await response.text();
    const json = string === '' ? undefined : JSON.parse(string);
    return json;
};

export const apiFetch = async (url, method, body) => {
    const options = {
        headers: {
            'Content-Type': 'application/json', // Default API response
        },
    };

    options.credentials = 'include';

    if (method && body) {
        options.method = method;

        if (isString(body)) {
            options.headers['Content-Type'] = 'text/html';
            options.body = body;
        } else if (isObject(body)) {
            options.body = JSON.stringify(body);
        }
    }

    // TODO: Better error handling
    return fetch(encodeURI(config.baseUrl + url), options)
        .then(response =>
            ['POST', 'PUT', 'PATCH'].includes(method)
                ? response
                : getJsonResponse(response)
        )
        .catch(error => console.log('Error: ', error)); // eslint-disable-line
};