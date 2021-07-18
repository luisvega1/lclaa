class Auth {
    constructor() {
        const session = JSON.parse(sessionStorage.getItem('USERSESSION'));
        session ? this.authenticated = true : this.authenticated = false;
    }

    login = async (user) => {
        await sessionStorage.setItem('USERSESSION',JSON.stringify(user));
        this.authenticated = true;
    }

    logout = async () => {
        this.authenticated = false;
    }

    isAuthenticated = () => {
        return this.authenticated;
    }
}

export default new Auth(); 