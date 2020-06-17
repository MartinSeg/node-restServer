const express = require("express");
const { verificaToken } = require("../middlewares/autenticacion");
const app = express();
const Producto = require("../models/producto");

// Obterne Todos

app.get("/productos", verificaToken, (req, res) => {
  let desde = Number(req.query.desde) || 0;

  Producto.find({ disponible: true })
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .limit(5)
    .skip(desde)
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productos) {
        return res.status(400).json({
          ok: false,
          err: { message: "No existen productos para mostrar" },
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

app.get("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: { message: "No existe ese ID" },
        });
      }

      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

app.get("/productos/buscar/:termino", (req, res) => {
  let termino = req.params.termino;
  let regex = new RegExp(termino, "i");

  Producto.find({ nombre: regex })
    .populate("categoria", "descripcion")
    .exec((err, producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({ ok: true, producto });
    });
});

app.post("/productos", verificaToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    usuario: req.usuario._id,
    categoria: body.categoria,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Error al tratar de guardar el producto",
        },
      });
    }

    res.status(201).json({
      ok: true,
      producto: productoDB,
    });
  });
});

app.put("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No existe el producto bajo ese ID",
        },
      });
    }

    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.descripcion;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoGuardado,
      });
    });
  });
});

app.delete("/productos/:id", verificaToken, (req, res) => {
  //Grabar el usuario
  //Grabar la Categoria
  // disponible - PASARLO A FALSE
  let id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: { message: "No existen productos para Eliminar" },
      });
    }

    productoDB.disponible = false;
    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({ ok: true, message: "Producto Borrado", productoBorrado });
    });
  });
});

module.exports = app;
