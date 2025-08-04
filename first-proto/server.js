import express from 'express';
import { access, existsSync, readFile } from 'node:fs'
import { constants } from 'node:fs/promises';
import { extname } from 'node:path';
import { SERVER_HOST, SERVER_PORT } from './server_const.js';
import { get_client_from_pool, load_db_pool } from './db_interation.js';


const app = express();


const MIME_type = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
};

app.get('/', async (req, res, next) => {
    await readFile("./day.html", "utf8", (err, data) => {
        if(err) throw err;
        res.send(data);
    });

});

app.use(async (req, res, next) => {
    const referer = req.headers["referer"] || '';
    const path = "." + req.url;
    const ext = extname(path);
    if(!referer.includes(SERVER_HOST) || access(path, constants.F_OK, (err) => err)) {
        res.status(404).send("404 - Ressource not found");
    }
    else {
        await readFile(path, "utf8", (err, data) => {
            if(err) throw err;
            res.set('Content-type', MIME_type[ext]);
            res.send(data);
        })
    }
});


app.listen(SERVER_PORT, () => {
  console.log(`Server listening on http://${SERVER_HOST}:${SERVER_PORT}/`)
})