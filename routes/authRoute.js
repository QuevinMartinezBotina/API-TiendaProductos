/* Importaciones requeridas para que funcione nuestra ruta*/
const { Router } = require("express");
const { check } = require("express-validator");

/* Improtacioens del sistema */
const { login } = require("../controllers/loginController");
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

/* Exportando el objeto del enrutador. */
module.exports = router;
