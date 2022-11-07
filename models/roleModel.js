/* Destrucción del esquema y las propiedades del modelo del objeto mongoose. */
const { Schema, model } = require("mongoose");

/* Creación de un esquema para el modelo a seguir. */
const RoleSchema = Schema({
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
    default: "USER_ROLE",
  },
});

/* Exportación del modelo para ser utilizado en otros archivos. */
module.exports = model("Role", RoleSchema);
