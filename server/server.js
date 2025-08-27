import express from 'express';
import { ERR_MSG_SERVER_ERR, ERR_MSG_SIGN_IN_INVALID_USER, ERR_MSG_UNAVAILABLE_USERNAME, HTML_DAY_PATH, HTML_SIGNIN_PATH, HTML_SIGNUP_PATH, SERVER_HOST, SERVER_PORT } from './server_const.js';
import { JournalServer } from './journal_server.js';
import cookieParser from 'cookie-parser';
import { User } from '../shared/data/user.js';
import { InvalidSession, UnavailableUsername } from './dao/auth_dao.js';
import { InvalidPassword, UserNotFound } from './services/auth_sevice.js';
import path from 'node:path';
import { Day } from '../shared/data/day.js';
const __dirname = import.meta.dirname;


const app = express();
const journal_srv = new JournalServer();

app.use(express.static("public"));
app.use("/shared", express.static("shared"));
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

app.get('/day', (req, res) => {
    const user = journal_srv.authenticate_session(req.cookies["session"], res);
    if(user == null) {
        try {
            res.sendFile(path.join(__dirname, "..", "public", "html", "day.html"));
        } catch(err) {
            res.status(500).send(ERR_MSG_SERVER_ERR);
        }
    }
});

app.get('/day/:day-:month-:year', (req, res) => {
    res.send(JSON.stringify(new Day().prepare_json_obj()));
});

app.post('/day/:day-:month-:year', (req, res) => {
    
});



const server = app.listen(SERVER_PORT, () => {
    console.log(`Server listening on http://${SERVER_HOST}:${SERVER_PORT}/`);
})

server.on("close", (err) => {
    console.log("closing server");
    if(err) console.log(err);
    try {
        journal_srv.close();
    } catch(err) {
        console.log(err);
    }
});

process.on("SIGINT", () => server.close());