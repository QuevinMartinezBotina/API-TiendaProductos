/* Importaciones de terceros */
const { request, response } = require("express");

/* Importaciones locales */
const Usuario = require("../models/usuariosModel");

/**
 * "Si el usuario no ha iniciado sesión, o si el usuario no es un administrador, devolverá un mensaje
 * de error".
 *
 * Si el usuario ha iniciado sesión y es administrador, la función llamará a la función next().
 * La función next() se llama cuando se realiza la función de middleware.
 * @param [req] - solicitud
 * @param [res] - El objeto de respuesta.
 * @param next - Esta es una función a la que llamamos cuando queremos pasar al siguiente middleware.
 * @returns Una función.
 */
const esAdminRole = (req = request, res = response, next) => {
  /* Comprobando si el usuario está logueado o no. */
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar el rol sin validar el token primero",
    });
  }

  const { rol, nombre } = req.usuario;

  /* Comprobando si el usuario es un administrador o no. */
  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      status: false,
      msg: `${nombre} no es administrador, no puede hacer esto`,
    });
  }

  next();
};

/**
 * Es una función que devuelve una función que devuelve una función
 * @param roles - Matriz de roles que el usuario debe tener para acceder al servicio.
 * @returns Una función que toma 3 parámetros.
 */
const tieneRole = (...roles) => {
  return (req = request, res = response, next) => {
    /* Comprobando si el usuario está logueado o no. */
    if (!req.usuario) {
      return res.status(500).json({
        status: false,
        msg: "Se quiere verificar el rol sin validar el token primero",
      });
    }

    /* Comprobando si el usuario tiene el rol para acceder al servicio. */
    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        status: false,
        msg: `El servicio requiere uno de estos roles: ${roles}`,
      });
    }

    /* Llamar al siguiente middleware. */
    next();
  };
};

module.exports = { esAdminRole, tieneRole };
