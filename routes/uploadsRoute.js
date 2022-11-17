/* Importaciones requeridas para que funcione nuestra ruta*/
const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  actualizarImg,
} = require("../controllers/uploadsController");
const { coleccionesPermitidas } = require("../helpers/db-validators");
const { validaArchivoSubir } = require("../middlewares");

/* Improtacioens del sistema */
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/", [validaArchivoSubir], cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validaArchivoSubir,
    check("id", "El id debe ser de Mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarImg
);

/* Exportando el objeto del enrutador. */
module.exports = router;
