const express = require('express');
const {
  verificaToken,
  verificaRoleAdmin,
} = require('../middleware/autenticacion');
const Categoria = require('../models/categorias');

const app = express();

/**
 * Enlista todas las categorias, requiere estar identificado el usuario
 */

app.get('/categorias', verificaToken, (req, res) => {
  Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'name email')
    .exec()
    .then((categorias) => {
      return res.json({
        ok: true,
        categorias,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        err,
      });
    });
});

/**
 * Enlista una sola categoria, requiere estar identificado el usuario
 */

app.get('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id)
    .exec()
    .then((categoriaDB) => {
      return res.json({
        ok: true,
        categoria: categoriaDB,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        err,
      });
    });
});

/**
 * Crea una categoria, necesita estar identificado el usuario y requiere
 * ser administrador
 */

app.post('/categoria', [verificaToken, verificaRoleAdmin], (req, res) => {
  let { body } = req;

  const categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria
    .save()
    .then((categoriaDB) => {
      return res.json({
        ok: true,
        categoria: categoriaDB,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        err,
      });
    });
});

/**
 * Actualiza una categoria pasando un id como parametro y una descripción
 * por el body de la consulta
 */

app.put('/categoria/:id', [verificaToken, verificaRoleAdmin], (req, res) => {
  let id = req.params.id;
  let { descripcion } = req.body;

  const mongooseOptions = {
    new: true,
    runValidators: true,
  };

  Categoria.findByIdAndUpdate(id, { descripcion }, mongooseOptions)
    .exec()
    .then((categoriaDB) => {
      return res.json({
        ok: true,
        categoria: categoriaDB,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        err,
      });
    });
});

/**
 * Elimina fisicamente una categoria pasando un id como parametro
 */

app.delete('/categoria/:id', [verificaToken, verificaRoleAdmin], (req, res) => {
  let id = req.params.id;

  Categoria.findByIdAndRemove(id)
    .exec()
    .then((categoriaDB) => {
      return res.json({
        ok: true,
        categoria: categoriaDB,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        err,
      });
    });
});

module.exports = app;
