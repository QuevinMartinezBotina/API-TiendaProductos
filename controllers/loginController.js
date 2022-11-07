/* Importando el objeto de respuesta desde el módulo express. */
const { response } = require("express");
const bcrypt = require("bcryptjs");

/* Inmportaciones del sisetma */
const Usuario = require("../models/usuariosModel");
const { generarJWT } = require("../helpers/generar-jwt");

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

module.exports = {
  login,
};
