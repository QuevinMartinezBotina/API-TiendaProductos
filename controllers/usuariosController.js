/* Desestructuración de la propiedad de respuesta del módulo express. */
const { response } = require("express");
/* Importación del módulo bcryptjs, para encriptar passwords */
const bcryptjs = require("bcryptjs");

/* Desestructuración de la propiedad de respuesta del módulo express. */
const Usuario = require("../models/usuariosModel");

/**
 * Obtiene los valores límite y de omisión del objeto de consulta, luego usa el método countDocuments()
 * para obtener el número total de documentos en la colección y el método find() para obtener los
 * documentos que se devuelven en la misma solicitud.
 *
 * Finalmente, devuelve un objeto JSON con el estado, el mensaje y los usuarios.
 * @param req - El objeto de la solicitud.
 * @param [res] - El objeto de respuesta.
 */
const usuariosGet = async (req, res = response) => {
  /* Desestructurar el objeto de consulta del objeto de solicitud. */
  const { limite = 10, desde = 0 } = req.query;

  /* Una forma de obtener el número total de documentos en la colección y los documentos que se están
  devolviendo en una misma solicitud. */
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(),
    Usuario.find().skip(Number(desde)).limit(Number(limite)),
  ]);

  /* Devolver un objeto JSON con el estado, el mensaje y los usuarios. */
  res.json({
    total,
    status: true,
    msg: "Usuarios obtenidos correctamente",
    usuarios,
  });
};

/**
 * Toma el cuerpo de la solicitud, crea un nuevo objeto de usuario, cifra la contraseña y guarda el
 * usuario en la base de datos.
 * @param req - El objeto de la solicitud.
 * @param [res] - El objeto de respuesta.
 */
const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol, ...resto } = req.body;

  const usuario = new Usuario({ nombre, correo, password, rol });

  // * Encriptar la contraseña
  /* Generando una cadena aleatoria de caracteres para ser utilizada como sal. */
  const salt = bcryptjs.genSaltSync();

  /* Cifrado de la contraseña. */
  usuario.password = bcryptjs.hashSync(password, salt);

  /* Guardar el usuario en la base de datos. */
  await usuario.save();

  /* Devolver un objeto JSON con el estado, el mensaje y el objeto de usuario. */
  return res.json({
    status: true,
    msg: "Usuario creado correctamente",
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  /* Destrucción del objeto de solicitud. */
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  /* Comprobando si la contraseña se envía en el cuerpo de la solicitud. Si es así, lo está cifrando. */
  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  /* Actualizar el usuario con la identificación que se pasa en la solicitud. */
  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  /* Devolver un objeto JSON con el estado, mensaje y objeto de usuario. */
  res.json({
    status: true,
    msg: "Usuario actualizado correctamente",
    usuario,
  });
};

/**
 * La función usuariosDelete es una función asíncrona que toma dos parámetros, req y res, y devuelve un
 * objeto con tres propiedades, status, msg y usuario
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param [res] - El objeto de respuesta.
 */
const usuariosDelete = async (req, res = response) => {
  /* Desestructuración de la propiedad id del objeto req.params. */
  const { id } = req.params;

  /* Actualizar el usuario con la identificación que se pasa en la solicitud. */
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  /* Devolver un objeto JSON con el estado, mensaje y usuario. */
  res.json({
    status: true,
    msg: "Se cambio el estado del usuario",
    usuario,
  });
};

/* Exportación de las funciones a utilizar en otro archivo. */
module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
