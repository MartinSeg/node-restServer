const express = require("express");
const Categoria = require("../models/categoria");
const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");
const app = express();

app.get("/categoria", verificaToken, (req, res) => {
  let usuario = req.usuario;

  Categoria.find()
    .sort("descripcion")
    .populate("usuario", "nombre email")
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({ ok: true, categorias });
    });
});

app.get("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "ID no valido",
        },
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

app.post("/categoria", verificaToken, (req, res) => {
  let body = req.body;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

app.put("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Categoria.findByIdAndUpdate(
    id,
    { descripcion: body.descripcion },
    { new: true, runValidators: true },  
    (err, categoriaDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El ID no existe",
          },
        });
      }

      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});

app.delete(
  "/categoria/:id",
  [verificaToken, verificaAdmin_role],
  (req, res) => {
    let id = req.params.id;

    Categoria.findOneAndRemove({ _id: id }, (err, categoriaRemoved) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaRemoved) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El ID no existe",
          },
        });
      }

      res.json({
        ok: true,
        message: "Categoria Borrada",
      });
    });
  }
);

module.exports = app;
