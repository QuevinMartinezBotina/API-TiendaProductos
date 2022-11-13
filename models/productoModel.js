/* Importaciones de terceros */
const { Schema, model } = require("mongoose");

/* Creación de un esquema para el modelo de producto. */
const ProductoSchema = Schema({
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
  precio: {
    type: Number,
    default: 0,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  descripcion: {
    type: String,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  },
});

/* Un método que se utiliza para eliminar las propiedades __v y estado del objeto. */
ProductoSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

/* Exportación del modelo para ser utilizado en otros archivos. */
module.exports = model("Producto", ProductoSchema);
