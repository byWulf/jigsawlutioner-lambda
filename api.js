const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

function getFormattedDate() {
    let date = new Date();

    let str = '';
    str += (date.getHours() < 10 ? '0' : '') + date.getHours() + ':';
    str += (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':';
    str += (date.getSeconds() < 10 ? '0' : '') + date.getSeconds() + '.';
    str += (date.getMilliseconds() < 100 ? '0' : '') + (date.getMilliseconds() < 10 ? '0' : '') + date.getMilliseconds();

    return str;
}

// Loading config
const configFile = __dirname + '/api_conf.json';
if (!fs.existsSync(configFile)) {
    throw new Error('api_conf.json not found. Please see the api_conf.json.dist template for usage.')
}

const config = JSON.parse(fs.readFileSync(configFile));
if (!config) {
    throw new Error('api_conf.json invalid.');
}
if (!config.port) {
    throw new Error('api_conf.json does not contain port.');
}
if (!config.apiKey) {
    throw new Error('api_conf.json does not contain apiKey.');
}

// Starting server
const app = express();
app.use(bodyParser.json());

let callCounter = 0;
app.post('/api/v1/:endpoint', (request, response) => {
    const lambda = require('jigsawlutioner');
    const lambdaMappings = {
        'parseimage': lambda.parseImage,
        'findexistingpieceindex': lambda.findExistingPieceIndex,
        'getplacements': lambda.getPlacements,
    };

    if (request.header('x-api-key') !== config.apiKey) {
        response.sendStatus(403);
        return;
    }
    if (typeof lambdaMappings[request.params.endpoint] === 'undefined') {
        response.sendStatus(404);
        return;
    }

    callCounter++;
    console.log('[' + getFormattedDate() + '] #' + callCounter + ' - Got request for endpoint "' + request.params.endpoint + '"');
    lambdaMappings[request.params.endpoint](request.body, null, (err, result) => {
        console.log('[' + getFormattedDate() + '] #' + callCounter + ' - Sending response for endpoint "' + request.params.endpoint + '"');
        response.send(result);
    });
});
app.get('/healthcheck', (request, response) => {
    response.send('ok.');
});

app.listen(config.port, () => {
    console.log('API server started on port ' + config.port + '.');
});