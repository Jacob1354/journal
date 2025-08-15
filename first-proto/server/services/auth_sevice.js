import { AuthDAO } from "../dao/auth_dao";

export class AuthService {
    #auth_dao;
    constructor() {
        this.#auth_dao = new AuthDAO();
    }

    signup_user(user) {
        let is_successful = false;
        return is_successful;
    }

    signin_user(user) {
        const new_cookie = "TODO";
        return new_cookie;
    }

    authenticate_session(session) {
        
    }
}

export class UnavailableUsername extends Error {
    constructor(msg) {
        super(msg);
        this.name = "UnavailableUsername";
    }
}

export class InvalidUser extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidUser";
    }
}