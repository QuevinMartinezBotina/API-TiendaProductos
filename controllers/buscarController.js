/* Importaciones de terceros */
const { response } = require("express");
const { ObjectID } = require("mongodb");

/* Importaciones del sistema */
const { Usuario, Categoria, Producto } = require("../models");

/* Variables */
const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscadorUsuarios = async (termino = "", res = response) => {
  const esMongoID = ObjectID.isValid(termino); // True o false

  /* Comprobando si el `terminal` es un ID de MongoDB válido. Si es así, devolverá al usuario con esa ID. */
  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  /* Está creando una expresión regular que se usará para buscar el `término` en la base de datos. */
  const regex = new RegExp(termino, "i");

  /* Buscando el `término` en la base de datos. */
  const usuario = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
  });

  return res.status(200).json({
    status: true,
    results: usuario ? [usuario] : [],
  });
};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  /* Comprobando si la coleccion está permitida. */
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscadorUsuarios(termino, res);
      break;
    case "categorias":
      break;
    case "productos":
      break;
    case "roles":
      break;
    default:
      res.status(500).json({
        status: false,
        msg: `La colección ${coleccion} no tiene un método de búsqueda.`,
      });
      break;
  }
};

module.exports = {
  buscar,
};
