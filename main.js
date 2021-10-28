const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const config = require('./src/config');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json(), cors(), helmet());
// app.use(morgan('tiny'));

// Routes
app.use("/users", require("./src/user/routes/users.routes"));
app.use("/orders", require('./src/order/routes/orders.routes'))
app.use("/products", require("./src/product/routes/products.routes"));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Homepage
app.get("/", (req,res) =>{
    res.send('\
        <h2>Servicio de gestion de pedidos del restaurante "Delilah Restó"</h2>\
        <p>Porfavor, dirigase a <a href="/docs">/docs</a> para mas informacion acerca de como usar esta API</p>'
    );
});

// Error handler
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ msg: "Ha ocurrido un error interno", error: true });
});

app.listen(config.server.port, () => {
    console.log(`Listening at port: ${config.server.port}`);
});

module.exports = app;