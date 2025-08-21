import express from 'express';
import { SERVER_HOST, SERVER_PORT } from './server_const.js';
import { JournalServer } from './journal_server.js';


const app = express();
const journal_srv = new JournalServer();

app.get('/', async (req, res, next) => {
    res.redirect("/html/signin.html");
});

app.post('/signin', (req, res) => {

});

app.post('/signup', (req, res) => {

});

app.use(express.static("public"));


const server = app.listen(SERVER_PORT, () => {
  console.log(`Server listening on http://${SERVER_HOST}:${SERVER_PORT}/`);
})

server.on("close", (err) => {
  console.log("closing server");
  if(err) console.log(err);
  journal_srv.close();
});

process.on("SIGINT", () => server.close());