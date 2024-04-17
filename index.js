import { createServer } from 'node:http';
import {default as extract} from './extractor.js';
import {default as queue} from './queue.js';

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
    let url = new URL(req.url, `https://${req.headers.host}`);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    if (url.pathname === '/get-html') {
        let parseUrl = url.searchParams.get('url');
        if (!parseUrl) {
            res.statusCode = 404;
            res.end('URL NOT FOUND');
        } else {
            queue(async () => {
                return await extract(parseUrl);
            }, (html, errMsg = null) => {
                if (errMsg) {
                    res.statusCode = 500;
                    res.end(errMsg);
                } else {
                    res.end(html);
                }
            });
        }
    } else {
        res.end('undefined route');
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
