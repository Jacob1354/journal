import express from 'express';
import { access, existsSync, readFile } from 'node:fs'
import { constants } from 'node:fs/promises';
import { extname } from 'node:path';
import { SERVER_HOST, SERVER_PORT } from './server_const.js';


const app = express();


const MIME_type = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
};

app.get('/', async (req, res, next) => {
    res.redirect("/signin.html");
});

app.post('/signin', (req, res) => {

});

app.post('/signup', (req, res) => {

});

app.use(express.static("public"));


app.listen(SERVER_PORT, () => {
  console.log(`Server listening on http://${SERVER_HOST}:${SERVER_PORT}/`)
})