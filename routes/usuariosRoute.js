/* Importaciones requeridas para que funcione nuestra ruta*/
const { Router } = require("express");
const { check } = require("express-validator");

/* Importaciones de funciones creadas para el sistema */
const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
} = require("../controllers/usuariosController");
const {
  esRolevalido,
  existeCorreo,
  tieneRolPermitido,
  existeUsuarioID,
} = require("../helpers/db-validators");

/* Importando las funciones desde el archivo index de middlewares */
const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");

/* Creando una nueva instancia del objeto Router. */
const router = Router();

router.get("/", usuariosGet);

/* EndPoint para crear un nuevo usuario */
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("correo", "El correo no es válido").isEmail().custom(existeCorreo),
    check("password", "El password debe tener al menos 6 caracteres").isLength({
      min: 6,
    }),
    // check("rol", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").optional().custom(esRolevalido),
    /* Un middleware que valida los campos de la solicitud. */
    validarCampos,
  ],
  usuariosPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId().custom(existeUsuarioID),
    check("correo").custom(existeCorreo),
    check("rol").custom(esRolevalido).optional(),
    validarCampos,
  ],
  usuariosPut
);

router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    esAdminRole,
    check("id", "No es un ID válido").isMongoId().custom(existeUsuarioID),
    validarCampos,
  ],
  usuariosDelete
);

/* Exportar el objeto del enrutador para que pueda usarse en otros archivos. */
module.exports = router;
