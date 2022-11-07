/* importaciones de terceros */
const jwt = require("jsonwebtoken");

/**
 * Crea un nuevo objeto con la clave `uid` y el valor del parámetro `uid`. Luego crea un token con el
 * payload y la clave secreta.
 * @param [uid] - El ID de usuario.
 * @returns Una promesa.
 */
const generarJWT = (uid = "") => {
  /* Creando una nueva promesa. */
  return new Promise((resolve, reject) => {
    /* Creando un nuevo objeto con la clave `uid` y el valor del parámetro `uid`. */
    const payload = { uid };

    /* Crear un token con el payload y la clave secreta. */
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        }

        /* Devolviendo la ficha. */
        resolve(token);
      }
    );
  });
};

/* Exportando la función `generarJWT` para que pueda ser utilizada en otros archivos. */
module.exports = {
  generarJWT,
};
