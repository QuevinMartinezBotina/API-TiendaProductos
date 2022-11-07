// ? Paquete y importaciones de terceros siempre de primeros

/* Cargando el archivo `.env` y poniendo las variables a disposición de la aplicación. */
require("dotenv").config();

/* Importando la clase `Server` desde el archivo `models/server.js`. */
const Server = require("./models/server");

/* Creando una nueva instancia de la clase `Servidor`. */
const server = new Server();

server.listen();
