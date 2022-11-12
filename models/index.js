/* Importación de los modelos. */
const Categoria = require("./categoriaModel");
const Role = require("./roleModel");
const Server = require("./server");
const Usuario = require("./usuariosModel");
const Producto = require("./productoModel");

/* Exportación de los modelos. */
module.exports = {
  Categoria,
  Role,
  Server,
  Usuario,
  Producto,
};
