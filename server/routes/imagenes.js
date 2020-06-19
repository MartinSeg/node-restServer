const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get("/imagen/:tipo/:img", verificaTokenImg, (req, res) => {
    
  let tipo = req.params.tipo;
  let img = req.params.img;
  let imagePath = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
  let noImagePath = path.resolve(__dirname, "../assets/no-image.jpg");

  if (!fs.existsSync(imagePath)) {
    res.sendFile(noImagePath);
  } else {
    res.sendFile(imagePath);
  }
});

module.exports = app;
