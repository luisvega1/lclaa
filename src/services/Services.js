import axios from "axios";

export const ENDPOINT = "https://app.lclaa.org/api/";
export const FILES_ENDPOINT = "https://app.lclaa.org";

const sessionToken = () => (
    JSON.parse(sessionStorage.getItem("USERSESSION")) ? JSON.parse(sessionStorage.getItem("USERSESSION")).token : false
);

const requestFunction = async (method, url, body) => {
    const headers = sessionToken() ? { 'Token': sessionToken(), 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
    const options = {
        method,
        url,
        data: JSON.stringify(body),
        headers
    }

    try {
        const response = await axios(options);
        return {error: false, data: response.data};
    } catch (error) {
        let errorMessages = [];
        const errors = error.response.data;
        for(let error in errors){
            if(Array.isArray(errors[error])){
                errorMessages.push(`${errors[error][0]}, `);
            }else{
                errorMessages.push(`${errors[error]}, `);
            }
        }
        throw {error: true, data: "".concat(errorMessages)}
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

//EVENT FILES
export const newFile = async  (file) => {
    return await requestFunction('post', `${ENDPOINT}event_files`, file)
}

export const getFiles = async () => {
    return await requestFunction('get', `${ENDPOINT}event_files`);
}

export const deleteFile = async (id) => {
    return await requestFunction('delete', `${ENDPOINT}event_files/${id}`);
}

export const getFile = async (id) => {
    return await requestFunction('get', `${ENDPOINT}event_files/${id}`);
}

export const updateFile = async  (file,id) => {
    return await requestFunction('put', `${ENDPOINT}event_files/${id}`, file)
}

//INSCRIPTIONS
export const getInscriptions = async () => {
    return await requestFunction('get', `${ENDPOINT}inscriptions`);
}

//CHECKERS
export const newChecker = async  (checker) => {
    return await requestFunction('post', `${ENDPOINT}checkers`, checker)
}

export const getCheckers = async () => {
    return await requestFunction('get', `${ENDPOINT}checkers`);
}

export const deleteChecker = async (id) => {
    return await requestFunction('delete', `${ENDPOINT}checkers/${id}`);
}

export const getChecker = async (id) => {
    return await requestFunction('get', `${ENDPOINT}checkers/${id}`);
}

export const updateChecker = async  (checker,id) => {
    return await requestFunction('put', `${ENDPOINT}checkers/${id}`, checker)
}

//CLIENTS
export const newClient = async  (client) => {
    return await requestFunction('post', `${ENDPOINT}clients`, client)
}

export const getClients = async () => {
    return await requestFunction('get', `${ENDPOINT}clients`);
}

export const deleteClient = async (id) => {
    return await requestFunction('delete', `${ENDPOINT}clients/${id}`);
}

export const getClient = async (id) => {
    return await requestFunction('get', `${ENDPOINT}clients/${id}`);
}

export const updateClient = async  (client,id) => {
    return await requestFunction('put', `${ENDPOINT}clients/${id}`, client)
}

//Notifications
export const newNotification = async  (notification) => {
    return await requestFunction('post', `${ENDPOINT}notifications`, notification)
}

export const getNotifications = async () => {
    return await requestFunction('get', `${ENDPOINT}notifications`);
}

export const deleteNotification = async (id) => {
    return await requestFunction('delete', `${ENDPOINT}notifications/${id}`);
}

export const getNotifications = async (id) => {
    return await requestFunction('get', `${ENDPOINT}notifications/${id}`);
}

export const updateNotifications = async  (notification,id) => {
    return await requestFunction('put', `${ENDPOINT}notifications/${id}`, notification)
}