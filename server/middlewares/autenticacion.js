const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

let verificaToken = (req, res, next) => {
  let token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "token no valido",
        },
      });
    }

    req.usuario = decoded.usuario;

    next();
  });
};

let verificaAdmin_role = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role !== "ADMIN_ROLE") {
    return res.status(401).json({
      ok: false,
      err: {
        message: "El usuario no es Administrador",
      },
    });
  }

  next();
};

let verificaTokenImg = (req, res, next) => {

  let token = req.query.token;

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "token no valido",
        },
      });
    }

    req.usuario = decoded.usuario;

    next();
  });
}
module.exports = { verificaToken, verificaAdmin_role , verificaTokenImg};
