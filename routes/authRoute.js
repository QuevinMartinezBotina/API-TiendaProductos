/* Importaciones requeridas para que funcione nuestra ruta*/
const { Router } = require("express");
const { check } = require("express-validator");

/* Improtacioens del sistema */
const { login, loginGoogle } = require("../controllers/loginController");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo no es válido").isEmail(),
    check("password", "La contraseña no es valida").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  login
);

router.post(
  "/logingoogle",
  [
    check("id_token", "El id_token es necesario").not().isEmpty(),
    validarCampos,
  ],
  loginGoogle
);

/* Exportando el objeto del enrutador. */
module.exports = router;
