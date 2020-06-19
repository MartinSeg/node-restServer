const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const fs = require("fs");
const path = require("path");
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: "No ha subido ningun archivo",
    });
  }

  //El Middleware devuelve el archivo en REQ.FILES.(NOMBRE QUE PONGAMOS EN EL CAMPO DEL FORM-DATA)
  let archivo = req.files.archivo;
  let extension = archivo.name.split(".")[1].toLowerCase();
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "La extension enviada no es valida. Solo se permiten " +
          extensionesValidas.join(", "),
        extension,
      },
    });
  }

  //Valida el destino de la carpeta en Uploads
  let tiposValidos = ["usuarios", "productos"];
  let tipo = req.params.tipo;

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No es un destino Valido",
      },
    });
  }

  //cambiar el nombre al archivo
  let id = req.params.id;
  let numeroAlAzar = new Date().getMilliseconds();
  let nombreArchivo = `${id}-${numeroAlAzar}.${extension}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (tipo === "productos") {
      imagenProducto(id, res, nombreArchivo);
    } else {
      imagenUsuario(id, res, nombreArchivo);
    }
  });
});

const imagenUsuario = (id, res, nombreArchivo) => {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarImagen(nombreArchivo, "usuarios");
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      borrarImagen(nombreArchivo, "usuarios");
      return res.status(400).json({
        ok: false,
        err: { message: "Usuario no encontrado" },
      });
    }

    borrarImagen(usuarioDB.img, "usuarios");

    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({ ok: true, usuario: usuarioGuardado });
    });
  });
};

const imagenProducto = (id, res, nombreArchivo) => {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borrarImagen(nombreArchivo, "productos");
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      borrarImagen(nombreArchivo, "productos");
      return res.status(400).json({
        ok: false,
        err: { message: "Producto no encontrado" },
      });
    }

    borrarImagen(productoDB.img, "productos");

    productoDB.img = nombreArchivo;
    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({ ok: true, producto: productoGuardado });
    });
  });
};

const borrarImagen = (nombre, tipo) => {
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombre}`);

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
};

module.exports = app;
