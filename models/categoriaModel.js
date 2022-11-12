/* Destrucción del esquema y las propiedades del modelo del objeto mongoose. */
const { Schema, model } = require("mongoose");

/* Creación de un esquema para el modelo a seguir. */
const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  /* Una referencia al usuario que creó la categoría. */
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

/* Un método que se utiliza para eliminar la clave de versión del objeto. */
CategoriaSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

/* Exportación del modelo para ser utilizado en otros archivos. */
module.exports = model("Categoria", CategoriaSchema);
