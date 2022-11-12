/* Importaciones requeridas para que funcione nuestra ruta*/
const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categoriasController");
const {
  existeNombreCategoria,
  existeCategoriaEnDB,
} = require("../helpers/db-validators");
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
      .custom(existeNombreCategoria),
    validarCampos,
  ],
  crearCategoria
);

router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "El ID no es válido").isMongoId().custom(existeCategoriaEnDB),
    check("nombre").custom(existeNombreCategoria),
    validarCampos,
  ],
  actualizarCategoria
);

router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "El ID no es válido").isMongoId().custom(existeCategoriaEnDB),
    validarCampos,
  ],
  eliminarCategoria
);

/* Exportando el objeto del enrutador. */
module.exports = router;
