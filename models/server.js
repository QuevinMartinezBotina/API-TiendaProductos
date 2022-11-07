/* 
  ? Importando los módulos que se necesitan para que el servidor funcione. 
*/
const { response } = require("express");
const express = require("express");
const cors = require("cors");
const { dbConecction } = require("../database/config");

/* 
  ? La clase Server es una clase que crea un servidor express y lo configura. 
*/
class Server {
  /*
   ? La función constructora es una función especial que se llama cuando se crea un objeto a partir de
   ? una clase.
   */
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usuariosPath = "/api/usuarios";
    this.authPath = "/api/auth";

    // * Conexion a la base de datos
    /* Esperando a que la base de datos se conecte. */
    this.dbConecction();

    // * Middlewares
    /* Llamar a la función de middleware. */
    this.middlewares();

    // * Routes
    /* Diciéndole al servidor que use el archivo usuariosRoute cuando la url es /api/usuarios. */
    this.routes();
  }

  /*
   ? Esta función espera a que la base de datos se conecte.
   */
  async dbConecction() {
    /* Esperando a que la base de datos se conecte. */
    await dbConecction();
  }

  /*
   ? Esta función se utiliza para configurar los middlewares que utilizará el servidor.
   */
  middlewares() {
    // * CORS
    /* Un middleware que permite al servidor aceptar solicitudes de otros dominios. */
    this.app.use(cors());

    // * Lectura y parseo del body
    /* Analizando el cuerpo de la solicitud, nos devuelve un json para trabjar la información */
    this.app.use(express.json());

    // * Carpeta publica
    /* Diciéndole al servidor que use la carpeta pública como la carpeta raíz. */
    this.app.use(express.static("public"));
  }

  /*
   ?Una función que se utiliza para definir las rutas de la aplicación. */
  routes() {
    /* Diciéndole al servidor que use el archivo usuariosRoute cuando la url es /api/usuarios. */
    this.app.use(this.usuariosPath, require("../routes/usuariosRoute"));
    this.app.use(this.authPath, require("../routes/authRoute"));
  }

  /*
   ? Esta función se utiliza para iniciar el servidor y escuchar solicitudes en el puerto especificado.
   */
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${this.port}`);
    });
  }
}

/* 
 ? Exportando el servidor de clases para que pueda ser utilizado en otros archivos. 
*/
module.exports = Server;
