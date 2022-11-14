/* Importaciones de terceros */
const { response } = require("express");
const path = require("path");

/* Importaciones del sistema */

const cargarArchivo = async (req, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).send("No hay archivos para subir.");
    return;
  }

  const { archivo } = req.files;

  const uploadPath = path.join(__dirname, "../uploads/", archivo.name);

  archivo.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).json({
      status: true,
      msg: "Archivo subido correctamente.",
    });
  });
};

/* Exportación de la función `cargarArchivo` para ser utilizada en otros archivos. */
module.exports = {
  cargarArchivo,
};
