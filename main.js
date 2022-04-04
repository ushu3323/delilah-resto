const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookie_session = require('cookie-session');
const passport = require('./src/auth/passport');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const config = require('./src/config');
const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();

app.use(cors(), helmet(), express.json());
app.use(cookie_session({
    name: 'session',
    keys: config.session.keys,
    maxAge: config.session.cookie.age,
    secure: config.session.cookie.secure,
}));
app.use(passport.initialize(), passport.session());
app.use(morgan('dev'));

// Error handler
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).json({ msg: "Ha ocurrido un error interno", error: true });
})

// Routes
app.use("/auth", require("./src/auth/routes/auth.routes"));
app.use("/users", require("./src/user/routes/users.routes"));
app.use("/orders", require('./src/order/routes/orders.routes'))
app.use("/products", require("./src/product/routes/products.routes"));
app.use("/paymentmethods", require("./src/paymentMethod/routes/paymentMethod.routes"));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Homepage
app.get("/", (req,res) =>{
    res.send('\
        <h2>Servicio de gestion de pedidos del restaurante "Delilah Restó"</h2>\
        <p>Porfavor, dirigase a <a href="/docs">/docs</a> para mas informacion acerca de como usar esta API :)</p>'
    );
});
app.use((req,res,next) => {
    res.status(404).json({ msg: `No se ha encontrado una ruta con nombre '${req.url}'`, error: true });
});

app.listen(config.server.port, () => {
    console.log(`Listening at port: ${config.server.port}`);
});

module.exports = app;