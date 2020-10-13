const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuarios");

app.post("/login", async (req, res) => {
  let { body } = req;

  let usuario = await Usuario.findOne({ email: body.email });

  if (!!usuario) {
    let match = bcrypt.compareSync(body.password, usuario.password);

    if (match) {
      return res.json({
        ok: true,
        msg: "Bienvenido a la matrix",
        token: jwt.sign({ usuario }, process.env.HASH, {
          expiresIn: Number(process.env.TOKEN_EXPIRATION),
        }),
      });
    } else {
      return res.status(401).json({
        ok: false,
        msg: "Tus credenciales no son validas",
      });
    }
  } else {
    return res.status(401).json({
      ok: false,
      msg: "Tus credenciales no son validas",
    });
  }
});

// Configuraciones de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  const { name, email, picture } = payload;

  return {
    name,
    email,
    img: picture,
    google: true,
    role: 'USER_ROLE'
  };
}

app.post("/google", async (req, res) => {
  const user = await verify(req.body.idtoken).catch((err) => {
    return res.status(403).json({
      ok: false,
      err,
    });
  });

  Usuario.findOne({ email: user.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (usuarioDB === null) {
      const usuario = new Usuario(user);

      usuario.save((err, newUsuario) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        return res.json({
          ok: true,
          newUsuario,
        });
      });
    } else {
      return res.json({
        ok: true,
        msg: "Bienvenido a la matrix",
        token: jwt.sign({usuario: usuarioDB}, process.env.HASH, {
          expiresIn: Number(process.env.TOKEN_EXPIRATION),
        }),
      });
    }
  });
});

module.exports = app;
