/* Importando el esquema y el modelo de mongoose. */
const { Schema, model } = require("mongoose");

/* 
    ?Crear un esquema/modelo para la base de datos, con los campos para Usuarios
 */
const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
    emun: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

/* Un método que se va a ejecutar cada vez que se cree o actualice un usuario. */
UsuarioSchema.methods.toJSON = function () {
  /* Desestructurar el objeto y eliminar la contraseña y las propiedades __v. */
  const { __v, password, _id, ...usuario } = this.toObject();

  /* Cambiar el nombre de la propiedad _id a uid. */
  usuario.uid = _id;

  /* Devolviendo el objeto de usuario sin la contraseña y la propiedad __v. */
  return usuario;
};

/* Exportación del modelo para ser utilizado en otros archivos y se crea el modelo en base al Schema */
module.exports = model("Usuario", UsuarioSchema);
