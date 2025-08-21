import express from 'express';
import { HTML_DAY_PATH, HTML_SIGNIN_PATH, HTML_SIGNUP_PATH, SERVER_HOST, SERVER_PORT } from './server_const.js';
import { JournalServer } from './journal_server.js';
import cookieParser from 'cookie-parser';


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

app.post('/signup', (req, res) => {
    console.log("sign in");

});

app.post('/signin', (req, res) => {
    console.log("sign up");
});




const server = app.listen(SERVER_PORT, () => {
    console.log(`Server listening on http://${SERVER_HOST}:${SERVER_PORT}/`);
})

server.on("close", (err) => {
    console.log("closing server");
    if(err) console.log(err);
    journal_srv.close();
});

process.on("SIGINT", () => server.close());