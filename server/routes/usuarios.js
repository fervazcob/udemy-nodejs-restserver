const express = require("express");
const app = express();

const bcrypt = require("bcrypt");

const _ = require("underscore");

const Usuario = require("../models/usuarios");

app.get("/usuario", function (req, res) {

  let from = Number(req.query.from) - 1 || 0,
    limit = Number(req.query.limit) || 5;

  const mongooseOpts = {
    limit,
    skip: from,
  }

  const fieldsReturned = ["name", "email", "img", "role", "status"];

  Usuario.find({ status: true }, fieldsReturned, mongooseOpts)
    .exec()
    .then(async (usuarios) => {

      const count = await Usuario.countDocuments({ status: true });

      res.json({
        ok: true,
        usuarios,
        count,
      });

    })
    .catch(err => res.status(400).json({
      ok: false,
      err
    }));

});

app.post("/usuario", function (req, res) {
  let { body } = req;

  const usuario = new Usuario({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    return res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;

  const listFilter = [
    "name",
    "email",
    "img",
    // "role",
    "status",
  ];
  let body = _.pick(req.body, listFilter);

  const mongooseOptions = {
    new: true,
    runValidators: true
  }

  Usuario.findByIdAndUpdate(id, body, mongooseOptions)
    .then(usuarioDB => res.json(usuarioDB))
    .catch(err => res.status(400).json({
      ok: false,
      err,
    }));
});

app.delete("/usuario/:id", function (req, res) {

  let id = req.params.id;

  const mongooseOpts = {
    new: true,
    runValidators: true
  }

  const eliminarUsuario = { status: false };

  Usuario.findByIdAndUpdate(id, eliminarUsuario, mongooseOpts)
    .then(usuarioBorrado => {

      if (usuarioBorrado === null) {
        return res.status(400).json({
          ok: false,
          err: {
            msg: "El documento no se encontró"
          }
        });
      }

      return res.json({
        ok: true,
        usuarioBorrado
      });
    })
    .catch(err => res.status(400).json({
      ok: false,
      err
    }));

  // Usuario.findByIdAndRemove(id)
  //   .then(usuarioBorrado => {

  //     if (usuarioBorrado === null) {
  //       return res.status(400).json({
  //         ok: true,
  //         err: { msg: "El documento no se encontró" }
  //       });
  //     }

  //     return res.json({
  //       ok: true,
  //       usuarioBorrado,
  //     });
  //   })
  //   .catch(err => res.status(400).json({
  //     ok: false,
  //     err,
  //   }));
});

module.exports = app;
