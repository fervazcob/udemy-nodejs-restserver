const jwt = require("jsonwebtoken");


const verificaToken = (req, res, next) => {

    let token = req.get("token");

    jwt.verify(token, process.env.HASH, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            });
        }

        req.usuario = decode.usuario;

        next();

    });

};

const verificaRoleAdmin = (req, res, next) => {

    if (req.usuario.role !== "ADMIN_ROLE") {
        return res.status(401).json({
            ok: false,
            err: {
                message: "No estas autorizado para ejecutar esta acción"
            }
        });
    }

    next();

};


module.exports = {
    verificaToken,
    verificaRoleAdmin,
};

