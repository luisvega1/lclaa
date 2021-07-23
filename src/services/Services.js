import axios from "axios";

export const ENDPOINT = "http://192.241.146.9/api/";
export const FILES_ENDPOINT = "http://192.241.146.9";

const sessionToken = () => (
    JSON.parse(sessionStorage.getItem("USERSESSION")) ? JSON.parse(sessionStorage.getItem("USERSESSION")).token : null
);

const requestFunction = async (method, url, body) => {
    const headers = sessionToken() ? { 'token': sessionToken(), 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
    const response = await axios[method](url,body, {headers: headers});
    switch (response.status) {
        //RESPONSE CREACION CORRECTA
        case 201:
            return {error: false, data: response.data};

        //RESPONSE CORRECTO
        case 200:
            return {error: false, data: response.data};
        
        //RESPONSE 401 NO AUTORIZADO
        case 401:
            return {error: true, data: response.data};

        //OTRO CASO POR DEFINIR
        default:
            break;
    }
};

export const login = async ({email, password}) => {
    return await requestFunction('post', `${ENDPOINT}sessions` , {email, password});
}

export const logout = async () => {
    const session = JSON.parse(sessionStorage.getItem("USERSESSION"));
    return await requestFunction('delete', `${ENDPOINT}sessions/${session.token}`);
}

//SPEAKERS
export const newSpeaker = async  (speaker) => {
    return await requestFunction('post', `${ENDPOINT}speakers`, speaker)
}

export const getSpeakers = async () => {
    return await requestFunction('get', `${ENDPOINT}speakers`);
}

export const deleteSpeaker = async (id) => {
    return await requestFunction('delete', `${ENDPOINT}speakers/${id}`);
}

export const getSpeaker = async (id) => {
    return await requestFunction('get', `${ENDPOINT}speakers/${id}`);
}

export const updateSpeaker = async  (speaker,id) => {
    return await requestFunction('patch', `${ENDPOINT}speakers/${id}`, speaker)
}