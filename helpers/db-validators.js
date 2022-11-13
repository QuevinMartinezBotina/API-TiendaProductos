/* Importación de los archivos roleModel.js y usuariosModel.js. */
const { Categoria, Producto } = require("../models");
const Role = require("../models/roleModel");
const Usuario = require("../models/usuariosModel");

/**
 * La función esRolevalido() comprueba si el rol es válido y arroja un error si no lo es.
 * @param [rol] - El rol que se va a validar.
 */

const esRolevalido = async (rol = "") => {
  /* Comprobando si el rol es válido. */
  const rolesValido = await Role.findOne({ rol });

  if (!rolesValido) {
    /* Lanzar un error si el rol no es válido. */
    throw new Error(`El rol ${rol} no está registrado`);
  }
};

/**
 * La función 'existeCorreo' es una función asíncrona que toma una cadena como argumento y devuelve un
 * valor booleano.
 * @param [correo] - La dirección de correo electrónico a validar.
 */
const existeCorreo = async (correo = "") => {
  // * Validar correo
  const correoExiste = await Usuario.findOne({ correo });

  /* Comprobando si el correo electrónico ya existe en la base de datos. */
  if (correoExiste) {
    /* Lanzar un error si el correo ya existe. */
    throw new Error(`El correo ${correo} ya está registrado`);
  }
};

/**
 * Si el ID no existe, lanza un error.
 * @param id - El ID del usuario a eliminar.
 */
const existeUsuarioID = async (id = "") => {
  /* Encontrar al usuario por el id. */
  const existeID = await Usuario.findById(id);

  /* Comprobando si el usuario existe. */
  if (!existeID) {
    throw new Error(`El ID ${id} no existe`);
  }
};

const tieneRolPermitido = async (id = "", rolesPermitidos = []) => {
  /* Encontrar al usuario por el id. */
  const usuario = await Usuario.findById(id);

  console.log(usuario);

  /* Comprobando si el usuario tiene un rol que está autorizado para realizar la acción. */
  if (!rolesPermitidos.includes(usuario.rol)) {
    throw new Error(`El usuario ${usuario.nombre} no tiene un rol permitido`);
  }
};

// * Validaciones para categorías

/**
 * Si la categoría existe arroja un error.
 * @param [nombre] - El nombre de la categoría.
 */
const existeNombreCategoria = async (nombre = "") => {
  const categoria = nombre.toUpperCase();

  /* Comprobando si la categoría existe. */
  const categoriaExiste = await Categoria.findOne({ nombre: categoria });

  if (categoriaExiste) {
    throw new Error(`La categoría ${nombre} ya existe`);
  }
};

/**
 * "Si la categoría no existe, lanza un error".
 *
 * La función se llama en el siguiente código:
 * @param [id] - El ID de la categoría que se va a comprobar.
 */
const existeCategoriaEnDB = async (id = "") => {
  /* Comprobando si la categoría existe. */
  const categoriaExiste = await Categoria.findById(id);

  if (!categoriaExiste) {
    throw new Error(`La categoría con el ID ${id} no existe`);
  }
};

// * Validaciones para Productos

/**
 * "Si el producto existe, lanza un error, de lo contrario, no hagas nada".
 *
 * La función se llama en el siguiente código:
 * @param [nombre] - El nombre del producto
 */
const existeNombreDeProducto = async (nombre = "") => {
  const producto = nombre.toUpperCase();

  const productoDB = await Producto.findOne({ nombre: producto });

  if (productoDB) {
    throw new Error(`El producto ${nombre} ya existe`);
  }
};

/**
 * "Si el producto con la ID dada no existe, lanza un error".
 *
 * La función se llama en el siguiente código:
 * @param [id] - El ID del producto a buscar en la base de datos.
 */
const existeProductoEnDB = async (id = "") => {
  const productoDB = await Producto.findById(id);

  if (!productoDB) {
    throw new Error(`El producto con el ID ${id} no existe`);
  }
};

module.exports = {
  esRolevalido,
  existeCorreo,
  tieneRolPermitido,
  existeUsuarioID,
  existeNombreCategoria,
  existeCategoriaEnDB,
  existeNombreDeProducto,
  existeProductoEnDB,
};
