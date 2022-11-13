/* Importaciones de terceros */
const { response } = require("express");

/* Importaciones del sistema */
const { Producto } = require("../models");

/**
 * Es una función que devuelve una promesa que se resuelve en una matriz de dos valores, el primero de
 * los cuales es la cantidad de documentos en la colección y el segundo es una matriz de documentos.
 *
 * La función se llama con dos argumentos, el primero de los cuales es un objeto de solicitud y el
 * segundo es un objeto de respuesta.
 *
 * La función se llama con una cadena de consulta que contiene dos parámetros, el primero de los cuales
 * se llama limite y el segundo se llama desde.
 *
 * La función usa la desestructuración para asignar el valor del parámetro limite a una variable
 * llamada limite y el valor del parámetro desde a una variable llamada desde.
 *
 * La función utiliza la desestructuración para asignar el primer valor del arreglo devuelto por la
 * promesa a una variable llamada total y el segundo valor del arreglo devuelto por la promesa a una
 * variable llamada productos.
 *
 * La función devuelve
 * @param req - El objeto de la solicitud.
 * @param [res] - respuesta
 * @returns una promesa.
 */
const obtenerProductos = async (req, res = response) => {
  const { limite = 10, desde = 0 } = req.query;

  /* Una tarea de desestructuración. */
  const [total, productos] = await Promise.all([
    Producto.countDocuments,
    Producto.find()
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .limit(Number(limite))
      .skip(Number(desde)),
  ]);

  return res.status(200).json({
    status: true,
    total,
    msg: "Productos obtenidos correctamente",
    productos,
  });
};

/**
 * Crea un producto.
 * @param req - solicitud
 * @param [res] - respuesta
 * @returns El objeto producto
 */
const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  // Generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  // Guardar DB
  await producto.save();

  return res.status(201).json({
    status: true,
    msg: "Producto creado correctamente",
    producto,
  });
};

/**
 * "La función recibe una solicitud y una respuesta, y luego devuelve una respuesta".
 *
 * La función se llama actualizarProducto y recibe dos parámetros: req y res. El primer parámetro es
 * una solicitud y el segundo parámetro es una respuesta. La función devuelve una respuesta.
 *
 * La función es una función asíncrona, por lo que devuelve una promesa.
 *
 * La función es una expresión de función.
 *
 * La función
 * @param req - {
 * @param [res] - respuesta
 * @returns El producto está siendo devuelto.
 */
const actualizarProducto = async (req, res = response) => {
  /* Destrucción del objeto. */
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  /* Actualización del producto. */
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  return res.status(200).json({
    status: true,
    msg: "Producto actualizado correctamente",
    producto,
  });
};

/**
 * Encuentra un producto por su id y actualiza su estado a falso.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param [res] - respuesta
 * @returns El producto está siendo devuelto.
 */
const borrarProducto = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  return res.status(200).json({
    status: true,
    msg: "Producto borrado correctamente",
    producto,
  });
};

module.exports = {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
