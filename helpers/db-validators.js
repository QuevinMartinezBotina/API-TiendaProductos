/* Importación de los archivos roleModel.js y usuariosModel.js. */
const { Categoria } = require("../models");
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

const existeCategoria = async (nombre = "") => {
  const categoria = nombre.toUpperCase();

  /* Comprobando si la categoría existe. */
  const categoriaExiste = await Categoria.findOne({ nombre: categoria });

  if (categoriaExiste) {
    throw new Error(`La categoría ${nombre} ya existe`);
  }
};

module.exports = {
  esRolevalido,
  existeCorreo,
  tieneRolPermitido,
  existeUsuarioID,
  existeCategoria,
};
