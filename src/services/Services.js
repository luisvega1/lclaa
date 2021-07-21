import axios from "axios";

export const ENDPOINT = "http://192.241.146.9/api/";
export const FILES_ENDPOINT = "http://192.241.146.9";

const sessionToken = JSON.parse(sessionStorage.getItem("USERSESSION")) ? JSON.parse(sessionStorage.getItem("USERSESSION")).token : null;

const requestFunction = async (method, url, body) => {
    console.log(body);
    const requestOptions = {
        method: method,
        url: url,
        body: body,
        headers: sessionToken ? { 'token': sessionToken, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
    }
    const response = await axios(requestOptions).then( (response) => {
        return response;
    }).catch( (error) => {
        return error.response;
    });
    switch (response.status) {
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

export const newSpeaker = async  (speaker) => {
    return await requestFunction('post', `${ENDPOINT}speakers`, speaker)
}