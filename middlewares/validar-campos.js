/* Importando la respuesta y el resultado de validación de express y express-validator. */
const { response } = require("express");
const { validationResult } = require("express-validator");

/**
 * Comprueba si hay algún error en la solicitud. Si los hay, devuelve un código de estado de 400 y los
 * errores. Si no los hay, pasa el control a la siguiente función de middleware
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param [res] - El objeto de respuesta.
 * @param next - Una función que se utiliza para pasar el control a la siguiente función de middleware.
 * @returns un objeto de respuesta con un código de estado de 400 y un objeto JSON con una propiedad de
 * estado de falso y una propiedad de errores con los errores asignados.
 */
const validarCampos = (req, res = response, next) => {
  const errors = validationResult(req);

  /* Comprobando si hay algún error en la solicitud. Si los hay, devolverá un código de estado 400 y
  los errores. */
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.mapped(),
    });
  }

  /* Una función que se utiliza para pasar el control a la siguiente función de middleware. */
  next();
};

/* Exportando la función `validarCampos` para que pueda ser utilizada en otros archivos. */
module.exports = {
  validarCampos,
};
