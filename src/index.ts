require('dotenv').config()
const express = require('express');

const {kofiIntegrationHandler} = require("./integrations/kofi");

const app = express();
app.use(express.json({ type: '*/*' }));

app.post('/integrations/kofi', kofiIntegrationHandler);

app.listen(3000, () => {
    console.log(`Yo Mana server listening on port 3000`);
});
