/* Importaciones de terceros */
const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");

/* Importaciones del sistema */
const path = require("path");
const fs = require("fs");

/**
 * Recibe un archivo, lo sube al servidor y devuelve la ruta al archivo
 * @param req - El objeto de la solicitud.
 * @param [res] - respuesta
 * @returns La ruta del archivo.
 */
const cargarArchivo = async (req, res = response) => {
  try {
    const pathCompleto = await subirArchivo(req.files, undefined, "usuarios");

    return res.status(200).json({
      status: true,
      msg: "Archivo cargado correctamente.",
      pathCompleto,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: error,
    });
  }
};

const actualizarImg = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo = "";

  /* Una declaración de cambio. Se utiliza para realizar diferentes acciones basadas en diferentes
  condiciones. */
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          status: false,
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          status: false,
          msg: `No existe un producto con el id ${id}`,
        });
      }

      break;
    default:
      return res.status(500).json({
        status: false,
        msg: `La colección ${coleccion} no está permitida.`,
      });

      break;
  }

  // Limpiar imágenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );

    /* Borrando la imagen anterior. */
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  /* Llamando a la función `subirArchivo` y pasando los parámetros `req.files`, `undefined` y
  `coleccion`. */
  const nombre = await subirArchivo(req.files, undefined, coleccion);

  modelo.img = nombre;

  await modelo.save();

  return res.status(200).json({
    status: true,
    msg: "Archivo cargado correctamente.",
    modelo,
  });
};

/* Exportación de la función `cargarArchivo` para ser utilizada en otros archivos. */
module.exports = {
  cargarArchivo,
  actualizarImg,
};
