import express from 'express';
import { ERR_MSG_SERVER_ERR, ERR_MSG_SIGN_IN_INVALID_USER, ERR_MSG_UNAVAILABLE_USERNAME, HTML_DAY_PATH, HTML_SIGNIN_PATH, HTML_SIGNUP_PATH, SERVER_HOST, SERVER_PORT } from './server_const.js';
import { JournalServer } from './journal_server.js';
import cookieParser from 'cookie-parser';
import { User } from '../shared/data/user.js';
import { UnavailableUsername } from './dao/auth_dao.js';
import { InvalidPassword, UserNotFound } from './services/auth_sevice.js';


const app = express();
const journal_srv = new JournalServer();

app.use(express.static("public"));
app.use(express.static("shared"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get('/', async (req, res, next) => {
    res.redirect("/signin");
});

app.get('/signup', (req, res) => {
    res.redirect(HTML_SIGNUP_PATH);
});

app.get('/signin', (req, res) => {
    if(req.cookies["session"]) {
        const user = journal_srv.auth_service.authenticate_session(req.cookies["session"]);
        res.redirect(HTML_DAY_PATH);
    } else {
        res.redirect(HTML_SIGNIN_PATH);
    }
});

app.post('/signup', async (req, res) => {
    try {
        await journal_srv.auth_service.signup_user(new User(req.body));
        res.status(200).end();
    } catch (err) {
        if(err instanceof UnavailableUsername)
            res.status(400).send(ERR_MSG_UNAVAILABLE_USERNAME);
        else
            res.status(500).send(ERR_MSG_SERVER_ERR);
    }
});

app.post('/signin', async (req, res) => {
    try {
        const session_cookie = await journal_srv.auth_service.signin_user(new User(req.body));
        res.setHeader("Set-Cookie", String(session_cookie));
        res.status(200).end();
    } catch (err) {
        if(err instanceof UserNotFound || err instanceof InvalidPassword)
            res.status(400).send(ERR_MSG_SIGN_IN_INVALID_USER);
        else
            res.status(500).send(ERR_MSG_SERVER_ERR);
    }
});
//TODO cookie class, change page once signed in



const server = app.listen(SERVER_PORT, () => {
    console.log(`Server listening on http://${SERVER_HOST}:${SERVER_PORT}/`);
})

server.on("close", (err) => {
    console.log("closing server");
    if(err) console.log(err);
    journal_srv.close();
});

process.on("SIGINT", () => server.close());