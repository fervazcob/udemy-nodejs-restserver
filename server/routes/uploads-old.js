const { json } = require('body-parser');
const express = require('express');
const upload = require('express-fileupload');

const Usuarios = require('../models/usuarios');
const Productos = require('../models/productos');

const app = express();

const validTypes = ['usuarios', 'productos'];
const imgExtensions = ['jpg', 'png', 'gif', 'jpeg'];

app.use(upload());

app.put('/uploads/:tipo/:id', (req, res) => {
  let tipo = validTypes.includes(req.params.tipo) ? req.params.tipo : '';
  let id = req.params.id;

  if (!req.files.file || Object.keys(req.files.file).length === 0) {
    return res.status(400).json({
      ok: false,
      message: 'No se adjunto ningún archivo',
    });
  }

  uploadImg(tipo, id, req.files.file, res);
});

const uploadImg = async (tipo, id, file, res) => {
  let fileType = file['mimetype'].split('/')[1];
  let moveStatus;

  if (!imgExtensions.includes(fileType)) {
    return res
      .status(400)
      .json({ ok: false, message: `${file}: El formato no es valido.` });
  }

  switch (tipo) {
    case validTypes[0]: // usuarios
      moveStatus = await moveFile(file, fileType, tipo, id);

      if (moveStatus.status) {
        Usuarios.findByIdAndUpdate(
          { _id: id },
          { img: `${moveStatus.fileName}` }
        )
          .exec()
          .then()
          .catch((err) => res.status(400).json({ ok: false, err }));

        return res.json({
          ok: true,
          message: 'Se subió el archivo correctamente',
        });
      } else {
        return res.stats(400).json({ ok: true, err: moveStatus.err });
      }

    case validTypes[1]: // productos
      moveStatus = await moveFile(file, fileType, tipo, id);

      if (moveStatus.status) {
        Productos.findByIdAndUpdate(
          { _id: id },
          { img: `${moveStatus.fileName}` }
        )
          .exec()
          .then()
          .catch((err) => res.status(400).json({ ok: false, err }));

        return res.json({
          ok: true,
          message: 'Se subió el archivo correctamente',
        });
      } else {
        return res.stats(400).json({ ok: true, err: moveStatus.err });
      }

    default:
      return res
        .status(400)
        .json({ ok: false, message: `${tipo}: No es valido.` });
  }
};

const moveFile = (file, fileType, tipo, id) => {
  let fileNameRandom = Math.floor(Math.random() * 10000),
    fileName = `${id}-${new Date().getTime()}-${fileNameRandom}.${fileType}`;

  return new Promise((res, rej) => {
    file
      .mv(`uploads/${tipo}/${fileName}`)
      .then(() => {
        res({ status: true, fileName });
      })
      .catch((err) => {
        rej({ status: false, err });
      });
  });
};

module.exports = app;
