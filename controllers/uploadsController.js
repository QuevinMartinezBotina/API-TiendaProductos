/* Importaciones de terceros */
const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

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

/**
 * Recibe una solicitud y una respuesta, luego obtiene la identificación y la colección de los
 * parámetros de la solicitud, luego declara una variable llamada modelo, luego usa una declaración de
 * cambio para determinar qué modelo usar, luego verifica si el modelo existe, luego borra la imagen
 * anterior, luego llama a la función subirArchivo y le pasa los archivos de solicitud, indefinidos y
 * colección, luego establece la imagen del modelo con el nombre devuelto por la función subirArchivo,
 * luego guarda el modelo, luego devuelve una respuesta .
 * </código>
 * @param req - El objeto de la solicitud.
 * @param [res] - respuesta
 * @returns una promesa.
 */
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

const mostrarImagen = async (req, res = response) => {
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

    /* Enviar path de la imagen */
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }
};

// ! Subir img a cloudinary
const actualizarImgCloudinary = async (req, res = response) => {
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
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");

    /* Borrando la imagen de cloudinary. */
    cloudinary.uploader.destroy(`${coleccion}/${public_id}`);
  }

  const { tempFilePath } = req.files.archivo;

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
    folder: coleccion,
  });

  modelo.img = secure_url;

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
  mostrarImagen,
  actualizarImgCloudinary,
};
