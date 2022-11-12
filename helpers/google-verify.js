/* Importaciones de terceros */
const { OAuth2Client } = require("google-auth-library");

/* Creando una nueva instancia de la clase OAuth2Client. */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Toma un token, lo envía a Google y devuelve el nombre, la imagen y el correo electrónico del
 * usuario.
 * @param [token] - El token que obtienes del cliente.
 * @returns un objeto con el nombre, foto y correo electrónico del usuario.
 */
async function googleVerify(token = "") {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const { name, picture, email } = ticket.getPayload();

  return { nombre: name, img: picture, correo: email };
}

module.exports = {
  googleVerify,
};
