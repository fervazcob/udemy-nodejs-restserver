const fs = require('fs');
const path = require('path');

const express = require('express');

const { verificaTokenImagen } = require('../middleware/autenticacion');

const app = express();

app.get('/imagen/:tipo/:imagen', verificaTokenImagen, (req, res) => {
  let tipo = req.params.tipo;
  let imagen = req.params.imagen;

  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo.toLowerCase()}s/${imagen}`
  );
  let pathNoImagen = path.resolve(__dirname, `../assets/no-image.jpg`);

  if (!fs.existsSync(pathImagen)) res.sendFile(pathNoImagen);

  res.sendFile(pathImagen);
});

module.exports = app;

//""
