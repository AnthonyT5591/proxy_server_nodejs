const express = require('express');
const https = require('https')
var cors = require('cors');
var privateData = require('./secret.json');
// Create Express Server
const app = express();

// Configuration
const PORT = privateData.Port;
const HOST = privateData.Host;

// Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
app.use(cors());
app.options('*', cors());

// Authorization
app.use('', (req, res, next) => {
    if (req.headers.authorization == privateData.AuthKey) {
        next();
    } else {
        res.sendStatus(403);
    }
});

// parse request body as json
app.use(express.json())

app.get('/send_proxy', (req, res) => {
    let response = '';

    // send Dynamic token based on request, useful for multiple games
    let token = req.headers.tokentype
    let options = {
        headers: {}
    }
    options.headers[token] = req.headers.key;

    passThroughReq = https.request(req.headers.url, options, result => {
        result.on('data', d => {
            response += d;
        });
        result.on('end', function (d) {
            res.json(response); // send json once data is finshed being read
        });
    })
    passThroughReq.on('error', error => {
        console.error(error)
    })
    passThroughReq.end()
})

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service.');
});