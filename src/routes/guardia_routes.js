import { Router } from "express";
import {
  login,
  recuperarContraseña,
  comprobarTokenContraseña,
  nuevaContraseñaG,
  perfil,
  actualizarContraseñaG,
  actualizarPerfil,
  registroUsuarios,
  ListarUsuarios,
  cambiarEstadoUsuario,
  actualizarUsuarios,
  cambiarEstadoParqueadero,
  cambiarEstadoEspacio,
} from "../controllers/guardia_controller.js";
import verificarRol from "../middlewares/autenticacion.js";

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     GuardiaLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: El email del guardia
 *         password:
 *           type: string
 *           format: password
 *       example:
 *         email: "juanperez@gmail.com"
 *         password: "Guardia.123"
 *     Guardia:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del guardia
 *         apellido:
 *           type: string
 *           description: El apellido del guardia
 *         cedula:
 *           type: string
 *           description: La cédula del guardia
 *         email:
 *           type: string
 *           description: El email del guardia
 *         password:
 *           type: string
 *           description: La contraseña del guardia
 *           format: password
 *         telefono:
 *           type: number
 *           description: El teléfono del guardia
 *         estado:
 *           type: boolean
 *           description: El estado del guardia
 *         token:
 *           type: string
 *           description: Token de recuperación o sesión
 *       example:
 *         nombre: "Juan"
 *         apellido: "Perez"
 *         cedula: "1234567890"
 *         email: "juanperez@gmail.com"
 *         password: "Guardia.123"
 *         telefono: 987654321
 *         estado: true
 *     UsuarioRegister:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del usuario
 *         apellido:
 *           type: string
 *           description: El apellido del usuario
 *         cedula:
 *           type: string
 *           description: La cédula del usuario
 *         email:
 *           type: string
 *           description: El email del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: La contraseña debe ser segura
 *         telefono:
 *           type: number
 *           description: El teléfono del usuario
 *         placa_vehiculo:
 *           type: string
 *           description: La placa del vehículo del usuario
 *         rol:
 *           type: string
 *           description: El rol del usuario (e.g., administrador, cliente)
 *         estado:
 *           type: boolean
 *           description: El estado activo o inactivo del usuario
 *       example:
 *         nombre: "Carlos"
 *         apellido: "Ramírez"
 *         cedula: "9876543210"
 *         email: "carlosramirez@gmail.com"
 *         password: "Usuario.123"
 *         telefono: 123456789
 *         placa_vehiculo: "XYZ789"
 *         rol: "usuario"
 *         estado: true
 *     UsuarioResponse:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del usuario
 *         apellido:
 *           type: string
 *           description: El apellido del usuario
 *         cedula:
 *           type: string
 *           description: La cédula del usuario
 *         email:
 *           type: string
 *           description: El email del usuario
 *         telefono:
 *           type: number
 *           description: El teléfono del usuario
 *         placa_vehiculo:
 *           type: string
 *           description: La placa del vehículo del usuario
 *         rol:
 *           type: string
 *           description: El rol del usuario
 *         estado:
 *           type: boolean
 *           description: El estado activo o inactivo del usuario
 *         _id:
 *           type: string
 *           description: El ID único del usuario
 *         token:
 *           type: string
 *           description: El token generado para el usuario
 *       example:
 *         nombre: "Carlos"
 *         apellido: "Ramírez"
 *         cedula: "9876543210"
 *         email: "carlosramirez@gmail.com"
 *         telefono: 123456789
 *         placa_vehiculo: "XYZ789"
 *         rol: "Estudiante"
 *         estado: true
 *         _id: "63f5d123c8b7f1d21c456abc"
 *
 * Parqueadero:
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: El nombre del parqueadero
 *        description:
 *          type: string
 *          description: Descripción del parqueadero
 *        planta:
 *          type: string
 *          description: La planta en la que se encuentra el parqueadero
 *        bloque:
 *          type: string
 *          description: El bloque donde está ubicado el parqueadero
 *        tipo:
 *          type: string
 *          description: Tipo de parqueadero (Ej. cubierto, descubierto)
 *        espacios:
 *          type: number
 *          description: El número de espacios disponibles en el parqueadero
 *        estado:
 *          type: boolean
 *          description: El estado del parqueadero (activo/inactivo)
 *      example:
 *        nombre: "Parqueadero ESFOT"
 *        description: "Parqueadero principal"
 *        planta: "Planta 1"
 *        bloque: "A"
 *        tipo: "Automovil"
 *        espacios: 6
 *        estado: true
 */

/**
 * @swagger
 * tags:
 *  - name: Guardia
 *    description: Endpoints relacionados con la gestión de guardias
 */

/**
 * @swagger
 * /api/guardias/login:
 *  post:
 *      summary: Inicio de sesión para guardias
 *      tags: [Guardia]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/GuardiaLogin'
 *      responses:
 *          200:
 *              description: Inicio de sesión exitoso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GuardiaResponse'
 *          400:
 *              description: Error de validación
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: El mensaje de error
 *                          example:
 *                              msg: Lo sentimos, debe llenar todos los campos
 *          404:
 *              description: Error al iniciar sesión
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: El mensaje de error
 *                      examples:
 *                          usuario no registrado:
 *                              value:
 *                                  msg: Lo siento, el usuario no se encuentra registrado
 *                          contraseña incorrecta:
 *                              value:
 *                                  msg: Lo sentimos, la contraseña es incorrecta
 *                          no autenticado:
 *                              value:
 *                                  msg: Lo sentimos, primero debe proporcionar un token
 */
router.post("/guardias/login", login);

/**
 * @swagger
 * /api/guardias/recuperar-clave:
 *  post:
 *    summary: Solicita recuperación de contraseña
 *    tags: [Guardia]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: "juanperez@gmail.com"
 *    responses:
 *      200:
 *        description: Correo enviado para recuperación
 *      404:
 *        description: Usuario no encontrado
 */
router.post("/guardias/recuperar-clave", recuperarContraseña);

/**
 * @swagger
 * /api/guardias/recuperar-clave/{token}:
 *  get:
 *    summary: Verifica el token de recuperación de contraseña
 *    tags: [Guardia]
 *    parameters:
 *      - name: token
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Token válido
 *      400:
 *        description: Token inválido o expirado
 */
router.get("/guardias/recuperar-clave/:token", comprobarTokenContraseña);

/**
 * @swagger
 * /api/guardias/nueva-clave/{token}:
 *  put:
 *    summary: Cambia la contraseña utilizando el token
 *    tags: [Guardia]
 *    parameters:
 *      - name: token
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                description: Nueva contraseña
 *                example: "NuevaContraseña123"
 *              confirmarPassword:
 *                type: string
 *                description: Confirmación de la nueva contraseña
 *                example: "NuevaContraseña123"
 *    responses:
 *      200:
 *        description: Contraseña actualizada
 *      400:
 *        description: Token inválido o contraseña no válida
 */
router.put("/guardias/nueva-clave/:token", nuevaContraseñaG);

/**
 * @swagger
 * /api/guardias/perfil:
 *  get:
 *    summary: Obtiene el perfil del guardia autenticado
 *    tags: [Guardia]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Perfil del guardia obtenido
 *      401:
 *        description: No autorizado
 */
router.get("/guardias/perfil", verificarRol, perfil);

/**
 * @swagger
 * /api/guardias/actualizar-clave:
 *  put:
 *    summary: Actualiza la contraseña del guardia
 *    tags: [Guardia]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              actualPassword:
 *                type: string
 *                description: La contraseña actual del guardia
 *              nuevoPassword:
 *                type: string
 *                description: La nueva contraseña para el guardia
 *            required:
 *              - actualPassword
 *              - nuevoPassword
 *            example:
 *              actualPassword: "Guardia.123"
 *              nuevoPassword: "Guardia.456"
 *    responses:
 *      200:
 *        description: Contraseña actualizada con éxito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de confirmación
 *              example:
 *                msg: Contraseña actualizada con exito
 *      400:
 *        description: Falta la contraseña actual o la nueva contraseña
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *              example:
 *                msg: La contraseña actual y la nueva contraseña son necesarias
 *      404:
 *        description: Error al verificar la contraseña actual o usuario no encontrado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *              examples:
 *                usuario_no_encontrado:
 *                  value:
 *                    msg: Lo sentimos, no existe el guardia {id}
 *                contraseña_incorrecta:
 *                  value:
 *                    msg: Lo sentimos, la contraseña actual no es correcta
 *                campos_faltantes:
 *                  value:
 *                    msg: Lo sentimos, debe llenar todos los campos
 */
router.put("/guardias/actualizar-clave", verificarRol, actualizarContraseñaG);

/**
 * @swagger
 * /api/guardias/{id}:
 *  put:
 *    summary: Actualiza el número de teléfono de un guardia
 *    tags: [Guardia]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: ID del guardia a actualizar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              telefono:
 *                type: number
 *                description: Nuevo número de teléfono del guardia
 *            required:
 *              - telefono
 *            example:
 *              telefono: 987654321
 *    responses:
 *      200:
 *        description: Perfil actualizado con éxito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de confirmación
 *                example:
 *                  msg: Perfil actualizado
 *      400:
 *        description: Error en los datos proporcionados
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *              examples:
 *                id_invalido:
 *                  value:
 *                    msg: El id que acaba de ingresar no existe
 *                campos_faltantes:
 *                  value:
 *                    msg: Lo sentimos, debes llenar todos los campos
 *      500:
 *        description: Error interno del servidor
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *                example:
 *                  msg: Error interno del servidor
 */
router.put("/guardias/:id", verificarRol, actualizarPerfil);

/**
 * @swagger
 * /api/guardias/registrar:
 *  post:
 *    summary: Registra un nuevo usuario desde el módulo de guardia
 *    tags: [Guardia]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nombre:
 *                type: string
 *                description: El nombre del usuario
 *              apellido:
 *                type: string
 *                description: El apellido del usuario
 *              cedula:
 *                type: string
 *                description: La cédula del usuario
 *              email:
 *                type: string
 *                description: El email del usuario
 *              password:
 *                type: string
 *                format: password
 *                description: La contraseña del usuario
 *              telefono:
 *                type: number
 *                description: El teléfono del usuario
 *              placa_vehiculo:
 *                type: string
 *                description: La placa del vehículo del usuario
 *              rol:
 *                type: string
 *                description: El rol asignado al usuario
 *              estado:
 *                type: boolean
 *                description: El estado del usuario (activo o inactivo)
 *            required:
 *              - nombre
 *              - apellido
 *              - cedula
 *              - email
 *              - password
 *              - rol
 *            example:
 *              nombre: "Carlos"
 *              apellido: "Ramírez"
 *              cedula: "9876543210"
 *              email: "carlosramirez@gmail.com"
 *              password: "Usuario.123"
 *              telefono: 123456789
 *              placa_vehiculo: "XYZ789"
 *              rol: "usuario"
 *              estado: true
 *    responses:
 *      200:
 *        description: Usuario registrado exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de confirmación
 *              example:
 *                msg: Usuario registrado y correo enviado
 *      404:
 *        description: Error en los datos proporcionados o usuario ya registrado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *              examples:
 *                campos_vacios:
 *                  value:
 *                    msg: Lo sentimos debe llenar todos los campos
 *                usuario_existente:
 *                  value:
 *                    msg: Lo sentimos pero el usuario ya se encuentra registrado
 *      500:
 *        description: Error interno al registrar el usuario
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *                error:
 *                  type: string
 *                  description: Detalles del error
 *              example:
 *                msg: Hubo un error al registrar el usuario
 */
router.post("/guardias/registrar", verificarRol, registroUsuarios);

/**
 * @swagger
 * /api/guardias/listar-usuarios:
 *  get:
 *    summary: Lista todos los guardias
 *    tags: [Guardia]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Lista de guardias obtenida
 */
router.get("/guardias/listar-usuarios", verificarRol, ListarUsuarios);

/**
 * @swagger
 * /api/guardias/cambiar-estado-usuario/{id}:
 *  patch:
 *    summary: Cambia el estado del usuario
 *    tags: [Guardia]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: El ID del usuario cuyo estado se desea modificar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              estado:
 *                type: boolean
 *                description: El estado que se desea asignar al usuario (true o false)
 *          example:
 *            estado: true
 *    responses:
 *      200:
 *        description: Estado modificado exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de éxito
 *              example:
 *                msg: "Estado modificado exitosamente"
 *      400:
 *        description: Error en los datos proporcionados
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: El mensaje de error
 *              example:
 *                msg: "El estado debe ser un valor booleano (true o false)"
 *      500:
 *        description: Error al modificar el estado del usuario
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: El mensaje de error
 *                error:
 *                  type: string
 *                  description: Detalle del error
 *              example:
 *                msg: "Error al modificar el estado del usuario"
 *                error: "Error interno del servidor"
 */
router.patch(
  "/guardias/cambiar-estado-usuario",
  verificarRol,
  cambiarEstadoUsuario
);

/**
 * @swagger
 * /api/guardias/actualizar-usuarios/{id}:
 *  put:
 *    summary: Actualiza los datos de un usuario
 *    tags: [Guardia]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: El ID del usuario que se desea actualizar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              cedula:
 *                type: string
 *                description: La cédula del usuario
 *              nombre:
 *                type: string
 *                description: El nombre del usuario
 *              apellido:
 *                type: string
 *                description: El apellido del usuario
 *              email:
 *                type: string
 *                description: El email del usuario
 *              telefono:
 *                type: number
 *                description: El teléfono del usuario
 *              placa_vehiculo:
 *                type: string
 *                description: La placa del vehículo del usuario
 *              rol:
 *                type: string
 *                description: El rol del usuario
 *            example:
 *              cedula: "9876543210"
 *              nombre: "Carlos"
 *              apellido: "Ramírez"
 *              email: "carlosramirez@gmail.com"
 *              telefono: 123456789
 *              placa_vehiculo: "XYZ789"
 *              rol: "usuario"
 *    responses:
 *      200:
 *        description: Perfil actualizado exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de éxito
 *                usuario:
 *                  type: object
 *                  description: Datos actualizados del usuario
 *              example:
 *                msg: "Perfil actualizado."
 *                usuario:
 *                  id: "64d7a8f5f5c7e6b8d0b2f3c1"
 *                  cedula: "9876543210"
 *                  nombre: "Carlos"
 *                  apellido: "Ramírez"
 *                  email: "carlosramirez@gmail.com"
 *                  telefono: 123456789
 *                  placa_vehiculo: "XYZ789"
 *                  rol: "usuario"
 *      400:
 *        description: Datos inválidos o incompletos
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *              examples:
 *                campos_invalidos:
 *                  value:
 *                    msg: "No se enviaron campos válidos."
 *      404:
 *        description: Usuario no encontrado o ID inválido
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *              examples:
 *                id_invalido:
 *                  value:
 *                    msg: "Guardia no registrado."
 *                usuario_no_encontrado:
 *                  value:
 *                    msg: "Usuario no encontrado."
 *      500:
 *        description: Error interno del servidor
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *              example:
 *                msg: "Error al actualizar perfil."
 */
router.put(
  "/guardias/actualizar-usuarios/:id",
  verificarRol,
  actualizarUsuarios
);

/**
 * @swagger
 * /api/guardias/parqueaderos/{id}:
 *   patch:
 *     summary: Cambia el estado de un parqueadero
 *     tags: [Guardia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del parqueadero cuyo estado se quiere cambiar
 *         schema:
 *           type: string
 *           example: "63f5d123c8b7f1d21c456abc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: boolean
 *                 description: El nuevo estado del parqueadero (activo/inactivo)
 *             required:
 *               - estado
 *           example:
 *             estado: false
 *     responses:
 *       200:
 *         description: Estado del parqueadero cambiado exitosamente
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Parqueadero no encontrado
 *       401:
 *         description: No autorizado, falta de token
 */
router.patch(
  "/guardias/parqueaderos/:id",
  verificarRol,
  cambiarEstadoParqueadero
);

/**
 * @swagger
 * /api/guardias/parqueaderos-espacio/{id}:
 *  patch:
 *    summary: Cambia el estado de un espacio en un parqueadero
 *    tags: [Guardia]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: El ID del parqueadero
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              estado:
 *                type: boolean
 *                description: Nuevo estado del espacio (true para ocupado, false para libre)
 *              numeroEspacio:
 *                type: number
 *                description: El número del espacio que se desea actualizar
 *            required:
 *              - estado
 *              - numeroEspacio
 *            example:
 *              estado: true
 *              numeroEspacio: 5
 *    responses:
 *      200:
 *        description: Estado del espacio modificado exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de éxito
 *                data:
 *                  type: object
 *                  properties:
 *                    numeroEspacio:
 *                      type: number
 *                      description: Número del espacio
 *                    estado:
 *                      type: boolean
 *                      description: Estado actualizado del espacio
 *              example:
 *                msg: "Estado del espacio modificado exitosamente a true"
 *                data:
 *                  numeroEspacio: 5
 *                  estado: true
 *      400:
 *        description: Error en los datos proporcionados
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *              examples:
 *                estado_invalido:
 *                  value:
 *                    msg: "El estado debe ser true o false"
 *      404:
 *        description: Parqueadero o espacio no encontrado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *              examples:
 *                parqueadero_no_encontrado:
 *                  value:
 *                    msg: "Parqueadero no encontrado"
 *                espacio_no_encontrado:
 *                  value:
 *                    msg: "Espacio no encontrado"
 *      500:
 *        description: Error interno del servidor
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Mensaje de error
 *                error:
 *                  type: string
 *                  description: Detalles del error
 *              example:
 *                msg: "Error al modificar el estado del espacio"
 *                error: "Detalle del error interno"
 */
router.patch(
  "/guardias/parqueaderos-espacio/:id",
  verificarRol,
  cambiarEstadoEspacio
);
export default router;
