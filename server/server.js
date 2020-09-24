require("dotenv").config();
require("./config/config");

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require("./routes/usuarios"));

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const password = process.env.DBPASSWORD,
  dbname = process.env.DBNAME;

const url = `mongodb+srv://cafe_system:${password}@wezck.ui81d.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(url, mongooseOptions)
  .then(() => console.log("Base de datos ONLINE"))
  .catch(err => console.error(err));

app.listen(process.env.PORT, () => {
  console.log(`Servidor ejecutandose en el puerto ${process.env.PORT}`);
});
