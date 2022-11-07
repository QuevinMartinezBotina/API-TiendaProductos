/* Importaciones de terceros */
const { request, response } = require("express");
const jwt = require("jsonwebtoken");

/* Importaciones locales */
const Usuario = require("../models/usuariosModel");

/**
 * Comprueba si el token es válido y si el usuario está activo
 * @param [req] - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la
 * cadena de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param [res] - El objeto de respuesta.
 * @param next - Una función que se utiliza para pasar el control a la siguiente función de middleware.
 * @returns Una función.
 */
const validarJWT = async (req = request, res = response, next) => {
  /* Obtener el token del encabezado. */
  const token = req.header("x-token");

  /* Si no hay token, se envía un error. */
  if (!token) {
    return res.status(401).json({
      status: false,
      msg: "No hay token en la petición",
    });
  }

  /* Verificando el token. */
  try {
    /* Si hay token, se verifica. */
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    /* Buscando al usuario en la base de datos. */
    const usuario = await Usuario.findById(uid);

    /* Si el usuario no existe, se envía un error. */
    if (!usuario) {
      return res.status(401).json({
        status: false,
        msg: "Usuario no existe",
      });
    }

    /* Comprobando si el usuario está activo o no. */
    if (!usuario.estado) {
      return res.status(401).json({
        status: false,
        msg: "Usuario no está activo",
      });
    }

    /* Agregar el usuario al objeto de solicitud. */
    req.usuario = usuario;
    /* Una función que se utiliza para pasar el control a la siguiente función de middleware. */
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      msg: "Token no válido",
    });
  }
};

/* Exportando la función `validarJWT` para que pueda ser utilizada en otros archivos. */
module.exports = {
  validarJWT,
};
