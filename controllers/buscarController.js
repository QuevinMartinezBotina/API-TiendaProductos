/* Importaciones de terceros */
const { response } = require("express");
const { ObjectID } = require("mongodb");

/* Importaciones del sistema */
const { Usuario, Categoria, Producto } = require("../models");

/* Variables */
const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

/**
 * Busca un usuario en la base de datos por su nombre o correo electrónico
 * @param [termino] - El término a buscar.
 * @param [res] - respuesta
 * @returns Una matriz de usuarios.
 */
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

/**
 * Busca una categoría en la base de datos.
 * @param [termino] - El término a buscar.
 * @param [res] - respuesta
 * @returns Una matriz de objetos.
 */
const buscarCategoria = async (termino = "", res = response) => {
  const esMongoID = ObjectID.isValid(termino); // True o false

  /* Comprobando si el `terminal` es un ID de MongoDB válido. Si es así, devolverá al usuario con esa ID. */
  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  /* Está creando una expresión regular que se usará para buscar el `término` en la base de datos. */
  const regex = new RegExp(termino, "i");

  /* Buscando el `término` en la base de datos. */
  const categoria = await Categoria.find({
    $or: [{ nombre: regex }],
  });

  return res.status(200).json({
    status: true,
    results: categoria ? [categoria] : [],
  });
};

/**
 * Si el `término` es una ID de MongoDB válida, devuelva al usuario con esa ID. De lo contrario,
 * devuelva los usuarios cuyo nombre coincida con `terminal`.
 * </código>
 * @param [termino] - El término de búsqueda.
 * @param [res] - respuesta
 * @returns Una matriz de objetos.
 */
const buscarProductos = async (termino = "", res = response) => {
  const esMongoID = ObjectID.isValid(termino); // True o false

  /* Comprobando si el `terminal` es un ID de MongoDB válido. Si es así, devolverá al usuario con esa ID. */
  if (esMongoID) {
    const producto = await Producto.findById(termino)
      .populate("categoria", "nombre")
      .populate("usuario", "nombre");

    return res.status(200).json({
      status: true,
      results: producto ? [producto] : [],
    });
  }

  /* Crear una expresión regular que se usará para buscar el `término` en la base de datos. */
  const regex = new RegExp(termino, "i");

  /* Crear una expresión regular que se usará para buscar el `término` en la base de datos. */
  const productos = await Producto.find({ nombre: regex })
    .populate("categoria", "nombre")
    .populate("usuario", "nombre");

  return res.status(200).json({
    status: true,
    results: productos ? [productos] : [],
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

  /* Una declaración de cambio. Se utiliza para realizar diferentes acciones basadas en diferentes
  condiciones. */
  switch (coleccion) {
    case "usuarios":
      buscadorUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategoria(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
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
