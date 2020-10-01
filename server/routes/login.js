const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
                token: jwt.sign({ usuario }, process.env.HASH, { expiresIn: Number(process.env.TOKEN_EXPIRATION) }),
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
            msg: "Tus credenciales no son validas"
        });
    }
});


module.exports = app;