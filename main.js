const express = require("express");
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const app = express();

const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json(), cors());

// Routes
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(require("./routes/routes.js"));

const port = 5000
app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
});