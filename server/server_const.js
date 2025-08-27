export const SERVER_HOST = "127.0.0.1";
export const SERVER_PORT = 3000;
export const DB_NAME = "journaldb.db";

export const SQL_AUTH_SETUP_PATH = "./server/db_scripts/auth_setup.sql";
export const SQL_JOURNAL_SETUP_PATH = "./server/db_scripts/journal_setup.sql";

export const HTML_PAGES_PATH = "/html/";
export const HTML_DAY_PATH = HTML_PAGES_PATH + "day.html";
export const HTML_SIGNIN_PATH = HTML_PAGES_PATH + "signin.html";
export const HTML_SIGNUP_PATH = HTML_PAGES_PATH + "signup.html";

export const ERR_MSG_UNAVAILABLE_USERNAME = "Sorry, this username is already taken. Please choose another one";
export const ERR_MSG_SERVER_ERR = "Sorry, an error occured. Please try again";
export const ERR_MSG_SIGN_IN_INVALID_USER = 
    "Oops, since like you've entered the wrong username or the wrong password."
    + "Please try again";
export const ERR_MSG_MUST_BE_LOGGED = "Seems like you're trying to access data for which you must be logged";

export class InternalServerError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InternalServerError";
    }
}