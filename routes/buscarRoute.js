/* Importaciones de terceros */
const { Router } = require("express");

/* Importaciones propias */
const { buscar } = require("../controllers/buscarController");

const router = Router();

router.get("/:coleccion/:termino", buscar);

module.exports = router;
