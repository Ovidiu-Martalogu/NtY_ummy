// server.mjs
import { createServer } from 'node:http';
import config from './config.js';


const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!\n');
});
// starts a simple http server locally on port from config.js
server.listen(config.serverPort, '127.0.0.1', () => {
    console.log(`Listening on 127.0.0.1:${config.serverPort}`);
});
// run with `node server.mjs`