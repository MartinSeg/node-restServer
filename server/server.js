require('./config/config');
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json("vooo");
});

app.get("/usuario", (req, res) => {
  res.json("get usuario");
});

app.post("/usuario", (req, res) => {
  let user = req.body;

  if (user.nombre === undefined) {
    res.status(400).json({ Mensaje: "Error en el Request" });
  } else {
    res.json({ user });
  }
});

app.put("/usuario/:id", (req, res) => {
  let id = req.params.id;
  res.json({ id });
});

app.delete("/usuario", (req, res) => {
  res.json("delte");
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
