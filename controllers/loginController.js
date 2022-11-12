/* Importando el objeto de respuesta desde el módulo express. */
const { response } = require("express");
const bcrypt = require("bcryptjs");

/* Inmportaciones del sisetma */
const Usuario = require("../models/usuariosModel");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

/**
 * Recibe una solicitud y una respuesta, luego desestructura el cuerpo de la solicitud, luego intenta
 * encontrar un usuario con el correo electrónico proporcionado, si no lo encuentra, devuelve un código
 * de estado 400 con un mensaje, si lo encuentra, comprueba si el usuario está activo, si no lo está,
 * devuelve un código de estado 400 con un mensaje, si lo está, comprueba si la contraseña es correcta,
 * si no lo está, devuelve un código de estado 400 con un mensaje, si está es decir, genera un JWT y
 * devuelve un código de estado 200 con un mensaje, el usuario y el token.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param [res] - respuesta
 * @returns El token está siendo devuelto.
 */
const login = async (req, res = response) => {
  /* Destrucción del cuerpo de la solicitud. */
  const { correo, password, ...resto } = req.body;

  try {
    // * Verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El correo/contraseña es incorrecto",
      });
    }

    // * Verificar si el usuario está activo

    if (!usuario.estado) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no está activo",
      });
    }

    // * Verificar la contraseña
    const validarPassword = bcrypt.compareSync(password, usuario.password);

    if (!validarPassword) {
      return res.status(400).json({
        ok: false,
        msg: "El correo/contraseña es incorrecto",
      });
    }

    // * Generar el JWT
    const token = await generarJWT(usuario.id);

    return res.status(200).json({
      status: true,
      msg: "Login realizado correctamente",
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ocurrio un error, hable con el administrador",
    });
  }
};

/**
 * Recibe un token de la interfaz, lo verifica con Google y luego crea un nuevo usuario si no existe
 * @param req - El objeto de la solicitud.
 * @param [res] - respuesta
 * @returns El token y el usuario.
 */
const loginGoogle = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    /* Crear un nuevo usuario si el usuario no existe. */
    if (!usuario) {
      //Crear usuario
      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    /* Comprobando si el usuario está activo o no. */
    if (usuario.estado === false) {
      return res.status(401).json({
        status: false,
        msg: "Hable con el administrador, usuario no habililitado",
      });
    }

    // * Generar el JWT
    const token = await generarJWT(usuario.id);

    return res.status(200).json({
      status: true,
      msg: "Login realizado correctamente",
      token,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ocurrio un error, hable con el administrador",
    });
  }
};
module.exports = {
  login,
  loginGoogle,
};
