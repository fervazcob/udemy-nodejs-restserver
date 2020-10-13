const express = require('express');

const {
  verificaToken,
  verificaRoleAdmin,
} = require('../middleware/autenticacion');
const Producto = require('../models/productos');

const app = express();

/**
 * TODO:
 *
 * * Obtener todos los productos {Solo usuarios identificados}
 *  * Popular con el usuario y la categoria
 *  - paginarlo
 * - Obtener un producto por ID {Solo usuarios identificados}
 *  + Popular con el usuario y la categoria
 * - Crear un producto {Solo administradores}
 * - Actualizar un producto usando un ID {Solo administradores}
 * - Borrar un producto usando un ID (no borrar fisicamente solo
 * deshabilitarlo) {Solo administradores}
 */

/**
 * Obtiene un listado de todos los productos
 */

app.get('/productos', verificaToken, (req, res) => {
  let from = Number(req.query.from) - 1 || 0,
    limit = Number(req.query.limit) || 5;

  const mongooseOpts = {
    limit,
    skip: from,
  };

  Producto.find({ disponible: true }, {}, mongooseOpts)
    .populate('usuario', 'name email')
    .populate('categoria', 'descripcion')
    .exec()
    .then((productosDB) => {
      return res.json({
        ok: true,
        productos: productosDB,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        err,
      });
    });
});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
  let termino = req.params.termino;

  let regex = RegExp(termino, 'i');

  Producto.find({ descripcion: regex })
    .exec()
    .then((productosDB) => res.json({ ok: true, productos: productosDB }))
    .catch((err) => res.status(400).json({ true: false, err }));
});

/**
 * Obtiene el detalle de un producto
 */

app.get('/producto/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id)
    .populate('usuario', 'name email')
    .populate('categoria', 'descripcion')
    .then((productoDB) => res.json({ ok: true, producto: productoDB }))
    .catch((err) => res.status(400).json({ ok: false, err }));
});

/**
 * Crea un producto
 */

app.post('/producto', [verificaToken, verificaRoleAdmin], (req, res) => {
  const { body } = req;
  const newProducto = {
    ...body,
    usuario: req.usuario._id,
  };

  const producto = new Producto(newProducto);

  producto
    .save()
    .then((productoDB) => res.json({ ok: true, producto: productoDB }))
    .catch((err) => res.status(400).json({ ok: false, err }));
});

/**
 * Actualiza un producto
 */

app.put('/producto/:id', [verificaToken, verificaRoleAdmin], (req, res) => {
  let id = req.params.id;
  const { body } = req;

  const updateProducto = {
    ...body,
  };

  Producto.findByIdAndUpdate(id, updateProducto, { new: true })
    .exec()
    .then((productoDB) => res.json({ ok: true, producto: productoDB }))
    .catch((err) => res.status(400).json({ ok: false, err }));
});

/**
 * Elimina un producto
 */

app.delete('/producto/:id', [verificaToken, verificaRoleAdmin], (req, res) => {
  let id = req.params.id;

  Producto.findByIdAndUpdate(id, { disponible: false }, { new: true })
    .exec()
    .then((productoDB) => res.json({ ok: true, producto: productoDB }))
    .catch((err) => res.status(400).json({ ok: false, err }));
});

module.exports = app;
