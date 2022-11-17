/* Importaciones de terceros */
const { response } = require("express");

const validaArchivoSubir = (req, res = response, next) => {
  /* Comprobando si hay un archivo para cargar. */
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({
      status: false,
      msg: "No hay archivos para cargar.",
    });
  }

  /* Una función que se utiliza para pasar el control a la siguiente función de middleware. */
  next();
};

module.exports = {
  validaArchivoSubir,
};
