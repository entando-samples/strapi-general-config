import axios from "axios";
const appUrl = `${process.env.REACT_APP_PUBLIC_URL}`;

export const saveStrapiConfiguration = async (data) => {
    const url = `${appUrl}`;
    const result = await axios.post(url, data, addAuthorizationRequestConfig())
        .then((res) => {
            return res;
        }).catch((e) => {
            return e;
        })
        return errorCheck(result);
}

export const getStrapiConfiguration = async () => {
    const url = `${appUrl}`;
    const result = await axios.get(url, addAuthorizationRequestConfig())
        .then((res) => {
            return res;
        }).catch((e) => {
            return e;
        });
        return errorCheck(result);
}

export const addAuthorizationRequestConfig = (config = {}, defaultBearer = 'Bearer') => {
    let defaultOptions = getDefaultOptions(defaultBearer);
    return {
        ...config,
        ...defaultOptions
    }
}

const getDefaultOptions = (defaultBearer) => {
    const token = getKeycloakToken()
    if (!token) { return {} }
    return {
        headers: {
            Authorization: `${defaultBearer} ${token}`,
        },
    }
}

const getKeycloakToken = () => {
    return ''; // only for local test
    if (window && window.entando && window.entando.keycloak && window.entando.keycloak.authenticated) {
        return window.entando.keycloak.token
    } else {
        return localStorage.getItem('token');
    }
}

const errorCheck = (data) => {
    let isError = false
    if (data.hasOwnProperty("toJSON") && data.toJSON().name === "Error") {
        isError = true
    }
    return {
        data,
        isError,
    }
}