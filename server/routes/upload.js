const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');

const { verificaToken } = require('../middleware/autenticacion');
const Usuario = require('../models/usuarios');
const Producto = require('../models/productos');

const app = express();

app.use(fileUpload());

app.put('/uploads/:type/:id', verificaToken, async (req, res) => {
  let type = req.params.type;
  let id = req.params.id;
  const file = !req.files ? {} : req.files.file;

  const confirm = await uploadFileAndUpdateDB({ type, id, file });

  res.json({ confirm });
});

const uploadFileAndUpdateDB = async (opts) => {
  if (
    typeof opts !== 'object' ||
    !Object.keys(opts).includes('type') ||
    !Object.keys(opts).includes('id') ||
    !Object.keys(opts).includes('file')
  ) {
    return {
      status: false,
      message:
        'Las opciones deben de ser enviadas en un objeto y con este formato { type: " ", id: " ", file: { } }',
    };
  }

  const Models = { Usuario, Producto };

  if (!Object.keys(Models).includes(opts.type)) {
    return {
      status: false,
      message: 'El tipo de modelo que quieres actualizar no existe',
    };
  }

  let model;

  try {
    model = await Models[opts.type].findById(opts.id).exec();
  } catch (err) {
    model = { status: false, message: err };
  }

  if (model.hasOwnProperty('status') && !model.status) {
    return {
      status: false,
      message: 'El ID que quieres actualizar no existe',
    };
  }

  const verifiedImg = verifyTypeImg(opts.file, opts.id);

  if (verifiedImg.hasOwnProperty('status') && !verifiedImg.status) {
    return verifiedImg;
  }

  let pathUpload = `${__dirname}/../../uploads/${opts.type.toLowerCase()}s`;

  let oldImg = model.img;

  let imgMoved = await moveImg(
    opts.file,
    path.resolve(pathUpload, verifiedImg.fileName)
  );

  if (!imgMoved.status) {
    return imgMoved;
  }

  deleteImg(path.resolve(pathUpload, oldImg));

  return await updateRecord(model, verifiedImg.fileName);
};

const verifyTypeImg = (file, id) => {
  if (Object.keys(file).length === 0) {
    return {
      status: false,
      message: 'No adjuntaste ninguna imágen',
    };
  }

  let fileType = file['mimetype'].split('/')[1];

  const validImages = ['jpg', 'jpeg', 'png', 'gif', 'svg'];

  if (!validImages.includes(fileType)) {
    return {
      status: false,
      message:
        'El formato del archivo no es un tipo valido ("jpg", "jpeg", "png", "gif", "svg")',
    };
  }

  let randomName = Math.floor(Math.random() * 10000);
  let fileName = `${id}-${new Date().getTime()}-${randomName}.${fileType}`;

  return { fileType, fileName };
};

const deleteImg = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const moveImg = async (file, filePath) => {
  console.log(filePath);
  try {
    await file.mv(filePath);

    return {
      status: true,
      message: 'Se subió el archivo con exito',
    };
  } catch (err) {
    return {
      status: false,
      message: 'No se pudo subir el archivo',
      err,
    };
  }
};

const updateRecord = (model, fileName) => {
  model.img = fileName;

  try {
    model.save();

    return {
      status: true,
      message: 'Se actualizo exitosamente el registro',
    };
  } catch (err) {
    return {
      status: false,
      message: 'No se actualizo el registro',
    };
  }
};

module.exports = app;
