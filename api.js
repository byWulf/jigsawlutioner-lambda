const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

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

    lambdaMappings[request.params.endpoint](request.body, null, (err, result) => {
        response.send(result);
    });
});

app.listen(config.port, () => {
    console.log('API server started on port ' + config.port + '.');
});