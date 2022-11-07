/* Importación de la biblioteca mongoose. */
const mongoose = require("mongoose");

/**
 * Esta función se conectará a la base de datos y, si falla, arrojará un error.
 */
const dbConecction = async () => {
  try {
    /* Conexión a la base de datos. */
    await mongoose.connect(process.env.MONGODB_CNN);

    console.log("Base de datos online");
  } catch (error) {
    /* Lanzar un error si falla la conexión a la base de datos. */
    console.log(error);
    throw new Error("Error in conecction DB");
  }
};

/* Exportando la función `dbConecction` para ser utilizada en otros archivos. */
module.exports = {
  dbConecction,
};
