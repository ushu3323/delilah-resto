const express = require("express");
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const config = require('./config');

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

// Routes
const usersRoute = require("./routes/users.routes");
const ordersRoute = require('./routes/orders.routes');
const productsRoute = require("./routes/products.routes");

const logger = (req, res, next) => {
    const date = new Date();
    console.log(`[${date.toLocaleTimeString()}]`, req.method, req.path);
    next();
}

app.use(express.json(), cors());
app.use(logger);

// Routes

// Homepage like route
app.get("/", (req,res) =>{
    res.send("<h2>Servicio de gestion de pedidos del restaurante \"Delilah Restó\"</h2><p>Porfavor, dirigase a /docs para mas informacion acerca de como usar esta API</p>");
});

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(usersRoute, ordersRoute, productsRoute);


app.listen(config.node.port, () => {
    console.log(`Listening at port: ${config.node.port}`);
});