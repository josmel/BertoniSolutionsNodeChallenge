
const url = require('url');
const crypto = require('crypto');
const hash = crypto.createHash('md5');

let start_time = new Date().getTime();

exports.testRequest = function (req, res) {
    body = '';

    req.on('data', function (chunk) {
        body += chunk;

    });

    req.on('end', function () {

        postBody = JSON.parse(body);

        computedSignature = hash.update(postBody.toString()).digest("hex");
        var response = {
            "host": req.headers.host,
            "hash": computedSignature,
            "time": new Date().getTime() - start_time,
            "size": req.headers['content-length']
        };
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    });
};

exports.sampleRequest = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    var name = 'World';
    if (reqUrl.query.name) {
        name = reqUrl.query.name
    }

    var response = {
        "host": req.headers.host,
        "stats": {
            "active": process._getActiveRequests(),
            "max_payload": "",
            "average_payload": "",
            "average_time_per_mb": ""
        }
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
};

exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
};