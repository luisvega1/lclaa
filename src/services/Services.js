import axios from "axios";

const ENDPOINT = "http://192.241.146.9/api/";

const requestFunction = async (method, url, body) => {
    const response = await axios[method](url, body).then( (response) => {
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