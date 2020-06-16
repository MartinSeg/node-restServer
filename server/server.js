require("./config/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("./routes"));

//Habilitar la carpeta Public
app.use( express.static(path.resolve(__dirname, '../public')))

mongoose
  .connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(console.log("Base de datos correctament"))
  .catch((e) => console.log(e));

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
