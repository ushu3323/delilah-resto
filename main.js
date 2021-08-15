const express = require("express");
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

const usersRoute = require("./routes/users.routes");
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json(), cors());

const logger = (req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}]`, req.method, req.path)
    next();
}

// Routes
app.use(logger)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(usersRoute);

const port = 5000;
app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
});