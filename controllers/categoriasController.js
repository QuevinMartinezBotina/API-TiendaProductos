/* Importaciones de terceros */
const { response } = require("express");

/* Importaciones del sistema */
const { Categoria } = require("../models");

/**
 * Devuelve un objeto JSON que contiene el número total de categorías y las categorías mismas.
 * @param req - El objeto de la solicitud.
 * @param [res] - El objeto de respuesta.
 * @returns un objeto de respuesta.
 */
const obtenerCategorias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  /* Una tarea de desestructuración. Se trata de asignar los valores del array a las variables `total`
  y `categorias`. */
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(),
    Categoria.find()
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  return res.status(200).json({
    status: true,
    msg: "Categorías obtenidas con éxito",
    total,
    categorias,
  });
};

/**
 * Obtiene una categoría por su ID y completa el campo de usuario con el nombre del usuario.
 * @param req - solicitud
 * @param [res] - respuesta
 * @returns La categoría está siendo devuelta.
 */
const obtenerCategoriaPorId = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  return res.status(200).json({
    status: true,
    msg: "Categoría obtenida con éxito",
    categoria,
  });
};

/**
 * Crea una nueva categoría en la base de datos.
 * @param req - El objeto de la solicitud.
 * @param [res] - El objeto de respuesta.
 * @returns El objeto de respuesta.
 */
const crearCategoria = async (req, res = response) => {
  /* Tomando el valor de la propiedad `nombre` del objeto `req.body` y convirtiéndolo a mayúsculas. */
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      status: false,
      msg: `La categoría ${categoriaDB.nombre}, ya existe`,
    });
  }

  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  // Guardar en DB
  await categoria.save();

  return res.status(201).json({
    status: true,
    msg: "Categoría creada con éxito",
  });
};

/**
 * Actualiza una categoría.
 * @param req - solicitud
 * @param [res] - respuesta
 * @returns La categoría actualizada.
 */
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;

  const { estado, usuario, ...data } = req.body;

  /* Convirtiendo el nombre de la categoría a mayúsculas. */
  data.nombre = data.nombre.toUpperCase();

  /* Asignar el valor de la propiedad `_id` del objeto `req.usuario` a la propiedad `usuario` del
  objeto `data`. */
  data.usuario = req.usuario._id;

  /* Actualizando la categoría. */
  const categoria = await Categoria.findByIdAndUpdate(id, data, {
    new: true,
  });

  return res.status(200).json({
    status: true,
    msg: "Categoría actualizada con éxito",
    categoria,
  });
};

/**
 * Encuentra una categoría por id y actualiza su estado a falso.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param [res] - respuesta
 * @returns La respuesta está siendo devuelta.
 */
const eliminarCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  console.log(`${categoria} y el ID: ${id}`);

  return res.status(200).json({
    status: true,
    msg: "Categoría eliminada con éxito",
    categoria,
  });
};

module.exports = {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
