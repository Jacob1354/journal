import express from 'express';
import { access, exists, existsSync, readFile } from 'node:fs'
import { constants } from 'node:fs/promises';
import { extname } from 'node:path';

const app = express();
const host = "127.0.0.1";
const port = 3000;

const MIME_type = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
};

app.get('/', async (req, res, next) => {
    await readFile("./day.html", "utf8", (err, data) => {
        if(err) throw err;
        res.send(data);
    });;
});

app.use(async (req, res, next) => {
    const referer = req.headers["referer"] || '';
    const path = "." + req.url;
    const ext = extname(path);
    if(!referer.includes(host) || access(path, constants.F_OK, (err) => err)) {
        res.status(404).send("404 - Ressource not found");
    }
    else {
        await readFile(path, "utf8", (err, data) => {
            if(err) throw err;
            console.log(path);
            res.set('Content-type', MIME_type[ext]);
            res.send(data);
        })
    }
});


app.listen(port, () => {
  console.log(`Server listening on http://${host}:${port}/`)
})