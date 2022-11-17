/* Importaciones de terceros */
const { v4: uuidv4 } = require("uuid");
const path = require("path");

/**
 * Toma un archivo, verifica si es válido y luego lo mueve a una carpeta
 * @param files - El objeto de archivos que contiene el archivo que se va a cargar.
 * @param [extensionesValidas] - Una matriz de extensiones válidas.
 * @param [carpeta] - La carpeta donde se guardará el archivo.
 * @returns La ruta al archivo.
 */
const subirArchivo = (
  files,
  extensionesValidas = ["png", "jpg", "jpeg", "gif", "webp"],
  /* Comprobando si hay un archivo para cargar. */
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    const nombreCortado = archivo.name.split(".");
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    /* Comprobando si la extensión del archivo es válida. */
    if (!extensionesValidas.includes(extensionArchivo)) {
      return reject(
        `La extensión ${extensionArchivo} no es válida. Las extensiones válidas son: ${extensionesValidas.join(
          ", "
        )}.`
      );
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    /* Creación de una ruta al archivo. */
    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      carpeta,
      nombreArchivo
    );

    /* Mover el archivo a uploadPath. */
    archivo.mv(uploadPath, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve(nombreArchivo);
    });
  });
};

module.exports = {
  subirArchivo,
};
