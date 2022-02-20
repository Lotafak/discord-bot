require('dotenv').config()
const logger = require('winston');
const express = require('express');

const {kofiIntegrationHandler} = require("./modules/kofi");
const { client } = require('./discord');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

const app = express();
app.use(express.json({ type: '*/*' }));

app.post('/integrations/kofi', kofiIntegrationHandler);

app.listen(3000, () => {
    logger.info(`Yo Mana server listening on port 3000`);
});

client.login(process.env.TOKEN);
