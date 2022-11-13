/* Importaciones requeridas para que funcione nuestra ruta*/
const { Router } = require("express");
const { check } = require("express-validator");

/* Improtacioens del sistema */
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productosController");
const {
  existeNombreDeProducto,
  existeCategoriaEnDB,
  existeProductoEnDB,
} = require("../helpers/db-validators");
const { validarJWT, tieneRole } = require("../middlewares");

/* Creando una nueva instancia del objeto Router. */
const router = Router();

router.get(
  "/",
  [validarJWT, tieneRole("ADMIN_ROLE", "VENTAS_ROLE"), validarCampos],
  obtenerProductos
);

router.post(
  "/",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("nombre", "El nombre es obligatorio")
      .not()
      .isEmpty()
      .custom(existeNombreDeProducto),
    check("categoria", "La categoria no es valida")
      .isMongoId()
      .custom(existeCategoriaEnDB),
    check("precio", "El precio debe ser un número").isNumeric(),
    validarCampos,
  ],
  crearProducto
);

router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "El id no es valido").isMongoId().custom(existeProductoEnDB),
    check("nombre").custom(existeNombreDeProducto).optional(),
    check("categoria").custom(existeCategoriaEnDB).optional(),
    check("precio", "El precio debe ser un número").isNumeric().optional(),
    validarCampos,
  ],
  actualizarProducto
);

router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "El id no es valido").isMongoId().custom(existeProductoEnDB),
    validarCampos,
  ],
  borrarProducto
);

/* Exportando el objeto del enrutador. */
module.exports = router;
