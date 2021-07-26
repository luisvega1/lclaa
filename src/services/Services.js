import axios from "axios";

export const ENDPOINT = "http://192.241.146.9/api/";
export const FILES_ENDPOINT = "http://192.241.146.9";

const sessionToken = () => (
    JSON.parse(sessionStorage.getItem("USERSESSION")) ? JSON.parse(sessionStorage.getItem("USERSESSION")).token : false
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

//ADMINISTRATORS
export const newAdministrator = async  (admin) => {
    return await requestFunction('post', `${ENDPOINT}admins`, admin)
}

export const getAdministrators = async () => {
    return await requestFunction('get', `${ENDPOINT}admins`);
}

export const deleteAdministrator = async (id) => {
    return await requestFunction('delete', `${ENDPOINT}admins/${id}`);
}

export const getAdministrator = async (id) => {
    return await requestFunction('get', `${ENDPOINT}admins/${id}`);
}

export const updateAdministrator = async  (admin,id) => {
    return await requestFunction('put', `${ENDPOINT}admins/${id}`, admin)
}

//SPONSORS
export const newSponsor = async  (sponsor) => {
    return await requestFunction('post', `${ENDPOINT}sponsors`, sponsor)
}

export const getSponsors = async () => {
    return await requestFunction('get', `${ENDPOINT}sponsors`);
}

export const deleteSponsor = async (id) => {
    return await requestFunction('delete', `${ENDPOINT}sponsors/${id}`);
}

export const getSponsor = async (id) => {
    return await requestFunction('get', `${ENDPOINT}sponsors/${id}`);
}

export const updateSponsor = async  (sponsor,id) => {
    return await requestFunction('put', `${ENDPOINT}sponsors/${id}`, sponsor)
}

//EVENTS
export const newEvent = async  (event) => {
    return await requestFunction('post', `${ENDPOINT}events`, event)
}

export const getEvents = async () => {
    return await requestFunction('get', `${ENDPOINT}events`);
}

export const deleteEvent = async (id) => {
    return await requestFunction('delete', `${ENDPOINT}events/${id}`);
}

export const getEvent = async (id) => {
    return await requestFunction('get', `${ENDPOINT}events/${id}`);
}

export const updateEvent = async  (event,id) => {
    return await requestFunction('put', `${ENDPOINT}events/${id}`, event)
}

//EXPOSITIONS
export const newExposition = async  (exposition) => {
    return await requestFunction('post', `${ENDPOINT}expositions`, exposition)
}

export const getExpositions = async () => {
    return await requestFunction('get', `${ENDPOINT}expositions`);
}

export const deleteExposition = async (id) => {
    return await requestFunction('delete', `${ENDPOINT}expositions/${id}`);
}

export const getExposition = async (id) => {
    return await requestFunction('get', `${ENDPOINT}expositions/${id}`);
}

export const updateExposition = async  (exposition,id) => {
    return await requestFunction('put', `${ENDPOINT}expositions/${id}`, exposition)
}