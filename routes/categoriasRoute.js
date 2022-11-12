/* Importaciones requeridas para que funcione nuestra ruta*/
const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
} = require("../controllers/categoriasController");
const { existeCategoria } = require("../helpers/db-validators");
const { validarJWT, tieneRole, esAdminRole } = require("../middlewares");

/* Improtacioens del sistema */
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get(
  "/",
  [validarJWT, tieneRole("ADMIN_ROLE", "VENTAS_ROLE"), validarCampos],
  obtenerCategorias
);

router.get(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "El ID no es válido").isMongoId(),
    validarCampos,
  ],
  obtenerCategoriaPorId
);

router.post(
  "/",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    esAdminRole,
    check("nombre", "El nombre es obligatorio")
      .not()
      .isEmpty()
      .custom(existeCategoria),
    validarCampos,
  ],
  crearCategoria
);

router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "El ID no es válido").isMongoId(),
    check("nombre").custom(existeCategoria),
    validarCampos,
  ],
  actualizarCategoria
);

router.delete("/");

/* Exportando el objeto del enrutador. */
module.exports = router;
