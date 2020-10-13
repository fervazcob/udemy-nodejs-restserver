const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Configuraciones
require("dotenv").config();
require("./config/config.js");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Habilitando el contenido estático
app.use(express.static(path.resolve(__dirname, "../public")));

// Rutas
app.use(require("./routes/index"));

app.listen(process.env.PORT, () => {
  console.log(`Servidor ejecutandose en el puerto ${process.env.PORT}`);
});
