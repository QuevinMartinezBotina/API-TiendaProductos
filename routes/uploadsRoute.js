/* Importaciones requeridas para que funcione nuestra ruta*/
const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo } = require("../controllers/uploadsController");

/* Improtacioens del sistema */
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/", cargarArchivo);

/* Exportando el objeto del enrutador. */
module.exports = router;
