/* Importando las funciones de los otros archivos. */
const dbValidators = require("./db-validators");
const generarJWT = require("./generar-jwt");
const googleVerify = require("./google-verify");
const subirArchivo = require("./subir-archivo");

/* Exportando todas las funciones de los otros archivos. */
module.exports = {
  ...dbValidators,
  ...generarJWT,
  ...googleVerify,
  ...subirArchivo,
};
