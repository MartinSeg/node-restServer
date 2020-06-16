const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Usuario = require("../models/usuario");
const { verificaToken, verificaAdmin_role } = require("../middlewares/autenticacion");
const app = express();

app.get("/usuario", verificaToken, (req, res) => {
  
  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  Usuario.find({ estado: true }, "nombre email role estado google img")
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({ ok: false, err });
      }

      Usuario.countDocuments({ estado: true }, (err, count) => {
        res.json({ ok: true, registros_activos: count, usuarios });
      });
    });
});

app.post("/usuario", [verificaToken, verificaAdmin_role] , (req, res) => {
  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }

    res.status(200).send({ ok: true, usuario: usuarioDB });
  });
});

app.put("/usuario/:id", [verificaToken, verificaAdmin_role], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({ ok: false, err });
      }

      res.json({ ok: true, usuarioActualizado: usuarioDB });
    }
  );
});

app.delete("/usuario/:id", [verificaToken, verificaAdmin_role], (req, res) => {
  let id = req.params.id;

  Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true },
    ( err, usuarioBorrado ) => {
      if (err) {
        return res.status(400).json({ ok: false, err:{message: " no existe tal ID"} });
      }

      if (!usuarioBorrado) {
        return res.json({
          ok: false,
          err: { message: "Usuario no encontrado" },
        });
      }

      res.json({ ok: true, usuarioBorrado });
    }
  );
});

module.exports = app;
