import { Router } from "express";
import verificarAdmin from "../middlewares/autenticacion.js";
import {
  registroAdmin,
  loginAdmin,
  recuperarContraseña,
  comprobarTokenContraseña,
  nuevaContraseña,
  registroGuardias,
  ListarGuardias,
  actualizarPerfilGuardia,
  cambiarEstadoGuardia,
  EliminarGuardias,
  registroUsuarios,
  ListarUsuarios,
  EliminarUsuarios,
  listarDisponibilidadParqueaderosAdmin,
} from "../controllers/administrador_controller.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                Administrador                               */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * components:
 *  securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *  schemas:
 *      AdminLogin:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  description: El email del administrador
 *              password:
 *                  type: string
 *                  format: password
 *                  description: La contraseña debe ser segura
 *                  minLength: 8
 *          example:
 *              "email": "estaphanym@gmail.com"
 *              "password": "Admin.123"
 *      AdminResponse:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: El nombre del administrador
 *              apellido:
 *                  type: string
 *                  description: El apellido del administrador
 *              telefono:
 *                  type: number
 *                  description: El telefono del administrador
 *              token:
 *                  type: string
 *                  description: El token del administrador
 *              _id:
 *                  type: string
 *                  description: El id del administrador
 *              email:
 *                  type: string
 *                  description: El email del administrador
 *      AdminRegister:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: El nombre del administrador
 *              apellido:
 *                  type: string
 *                  description: El apellido del administrador
 *              cedula:
 *                  type: number
 *                  description: La cédula del administrador
 *              email:
 *                  type: string
 *                  description: El email del administrador
 *              password:
 *                  type: string
 *                  format: password
 *                  description: La contraseña debe ser segura
 *              telefono:
 *                  type: number
 *                  description: El teléfono del administrador
 *          example:
 *              "cedula": "1726447888"
 *              "nombre": "Estephany"
 *              "apellido": "Mendez"
 *              "email": "estaphanym@gmail.com"
 *              "password": "Admin.123"
 *              "telefono": "998675191"
 *
 *      GuardiaRegister:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: El nombre del guardia
 *              apellido:
 *                  type: string
 *                  description: El apellido del guardia
 *              cedula:
 *                  type: string
 *                  description: La cédula del guardia
 *              email:
 *                  type: string
 *                  description: El email del guardia
 *              password:
 *                  type: string
 *                  format: password
 *                  description: La contraseña debe ser segura
 *              telefono:
 *                  type: number
 *                  description: El teléfono del guardia
 *              estado:
 *                  type: boolean
 *                  description: El estado activo o inactivo del guardia
 *          example:
 *              nombre: "Juan"
 *              apellido: "Perez"
 *              cedula: "1234567890"
 *              email: "juanperez@gmail.com"
 *              password: "Guardia.123"
 *              telefono: 987654321
 *              estado: true
 *      GuardiaResponse:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: El nombre del guardia
 *              apellido:
 *                  type: string
 *                  description: El apellido del guardia
 *              cedula:
 *                  type: string
 *                  description: La cédula del guardia
 *              email:
 *                  type: string
 *                  description: El email del guardia
 *              telefono:
 *                  type: number
 *                  description: El teléfono del guardia
 *              estado:
 *                  type: boolean
 *                  description: El estado activo o inactivo del guardia
 *              _id:
 *                  type: string
 *                  description: El ID único del guardia
 *              token:
 *                  type: string
 *                  description: El token generado para el guardia
 *          example:
 *              nombre: "Juan"
 *              apellido: "Perez"
 *              cedula: "1234567890"
 *              email: "juanperez@gmail.com"
 *              telefono: 987654321
 *              estado: true
 *
 *      UsuarioRegister:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: El nombre del usuario
 *              apellido:
 *                  type: string
 *                  description: El apellido del usuario
 *              cedula:
 *                  type: string
 *                  description: La cédula del usuario
 *              email:
 *                  type: string
 *                  description: El email del usuario
 *              password:
 *                  type: string
 *                  format: password
 *                  description: La contraseña debe ser segura
 *              telefono:
 *                  type: number
 *                  description: El teléfono del usuario
 *              placa_vehiculo:
 *                  type: string
 *                  description: La placa del vehículo del usuario
 *              rol:
 *                  type: string
 *                  description: El rol del usuario (e.g., administrador, cliente)
 *              estado:
 *                  type: boolean
 *                  description: El estado activo o inactivo del usuario
 *          example:
 *              nombre: "Carlos"
 *              apellido: "Ramírez"
 *              cedula: "9876543210"
 *              email: "carlosramirez@gmail.com"
 *              password: "Usuario.123"
 *              telefono: 123456789
 *              placa_vehiculo: "XYZ789"
 *              rol: "usuario"
 *              estado: true
 *      UsuarioResponse:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: El nombre del usuario
 *              apellido:
 *                  type: string
 *                  description: El apellido del usuario
 *              cedula:
 *                  type: string
 *                  description: La cédula del usuario
 *              email:
 *                  type: string
 *                  description: El email del usuario
 *              telefono:
 *                  type: number
 *                  description: El teléfono del usuario
 *              placa_vehiculo:
 *                  type: string
 *                  description: La placa del vehículo del usuario
 *              rol:
 *                  type: string
 *                  description: El rol del usuario
 *              estado:
 *                  type: boolean
 *                  description: El estado activo o inactivo del usuario
 *              _id:
 *                  type: string
 *                  description: El ID único del usuario
 *              token:
 *                  type: string
 *                  description: El token generado para el usuario
 *          example:
 *              nombre: "Carlos"
 *              apellido: "Ramírez"
 *              cedula: "9876543210"
 *              email: "carlosramirez@gmail.com"
 *              telefono: 123456789
 *              placa_vehiculo: "XYZ789"
 *              rol: "usuario"
 *              estado: true
 *              _id: "63f5d123c8b7f1d21c456abc"
 *              token: "abcd1234efgh5678ijkl"
 */

/**
 * @swagger
 * tags:
 *  name: Administrador
 *  description: Endpoints para administrador
 */

/**
 * @swagger
 * /api/administrador/registrar:
 *  post:
 *      summary: Registrar Administrador
 *      tags: [Administrador]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AdminRegister'
 *      responses:
 *          200:
 *              description: Administrador registrado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AdminResponse'
 *          400:
 *              description: Error al registrar Administrador
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          examples:
 *                              Datos incompletos:
 *                                  value:
 *                                      msg: Lo sentimos, debe llenar todos los campos
 *                              Email ya registrado:
 *                                  value:
 *                                      msg: Lo sentimos, este email ya está registrado
 */
router.post("/administrador/registrar", registroAdmin);

/**
 * @swagger
 * /api/administrador/login:
 *  post:
 *      summary: Login de administrador
 *      tags: [Administrador]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AdminLogin'
 *      responses:
 *          200:
 *              description: Login exitoso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AdminResponse'
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
 *                              msg: Lo sentimos debe llenar todos los campos
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
 *                                  msg: Lo siento el usuario no se encuentra registrado
 *                          Contraseña incorrecta:
 *                              value:
 *                                  msg: Lo sentimos la contraseña es incorrecta
 *                          No autenticado:
 *                              value:
 *                                  msg: Lo sentimos primero debe proporcionar un token
 */
router.post("/administrador/login", loginAdmin);

/**
 * @swagger
 * /api/administrador/recuperar-contraseña:
 *  post:
 *    summary: Solicita recuperación de contraseña
 *    tags: [Administrador]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: Correo enviado para recuperación
 *      404:
 *        description: Usuario no encontrado
 */
router.post("/administrador/recuperar-contraseña", recuperarContraseña);

/**
 * @swagger
 * /api/administrador/recuperar-contraseña/{token}:
 *  get:
 *    summary: Verifica el token de recuperación de contraseña
 *    tags: [Administrador]
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
router.get(
  "/administrador/recuperar-contraseña/:token",
  comprobarTokenContraseña
);

/**
 * @swagger
 * /api/administrador/nueva-contraseña/{token}:
 *  put:
 *    summary: Actualiza la contraseña de un administrador
 *    tags: [Administrador]
 *    parameters:
 *      - in: path
 *        name: token
 *        required: true
 *        schema:
 *          type: string
 *        description: Token de validación del administrador
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
 *            required:
 *              - password
 *              - confirmarPassword
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
 *                  example: Contraseña actualizada con exito
 *      404:
 *        description: Error en la solicitud
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  example: Lo sentimos no hemos podido verificar su cuenta
 */
router.put("/administrador/nueva-contraseña/:token", nuevaContraseña);

/**
 * @swagger
 * /api/administrador/registrar-guardia:
 *  post:
 *      summary: Registrar guardias
 *      tags: [Administrador]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/GuardiaRegister'
 *      responses:
 *          200:
 *              description: Guardia registrado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de éxito
 *                          example:
 *                              msg: Guardia registrado correctamente
 *          400:
 *              description: Error al registrar guardia
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          example:
 *                              msg: Error en los datos del registro
 */
router.post(
  "/administrador/registrar-guardia",
  
  registroGuardias
);

/**
 * @swagger
 * /api/administrador/listar-guardias:
 *  get:
 *      summary: Listar guardias
 *      tags: [Administrador]
 *      security:
 *       - bearerAuth: []
 *      responses:
 *          200:
 *              description: Lista de guardias obtenida correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Guardia'
 *          404:
 *              description: No se encontraron guardias
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          example:
 *                              msg: No hay guardias registrados
 */
router.get("/administrador/listar-guardias",  ListarGuardias);

/**
 * @swagger
 * /api/administrador/actualizar-guardia/{id}:
 *   put:
 *     summary: Actualizar el perfil de un guardia
 *     tags: [Administrador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del guardia a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del guardia
 *               apellido:
 *                 type: string
 *                 description: Apellido del guardia
 *               cedula:
 *                 type: string
 *                 description: Cédula del guardia
 *               email:
 *                 type: string
 *                 description: Email del guardia
 *               telefono:
 *                 type: number
 *                 description: Teléfono del guardia
 *               estado:
 *                 type: boolean
 *                 description: Estado del guardia (activo/inactivo)
 *           example:
 *             nombre: "Juan"
 *             apellido: "Pérez"
 *             cedula: "1234567890"
 *             email: "juan.perez@example.com"
 *             telefono: 987654321
 *             estado: true
 *     responses:
 *       200:
 *         description: Perfil del guardia actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Perfil guardia actualizado
 *       404:
 *         description: Error en la actualización del perfil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *             examples:
 *               camposVacios:
 *                 value:
 *                   msg: Lo sentimos debe llenar todos los campos
 *               idInvalido:
 *                 value:
 *                   msg: Lo sentimos pero ese guardia no se encuentra registrado
 */
router.put(
  "/administrador/actualizar-guardia/:id",
  
  actualizarPerfilGuardia
);

/**
 * @swagger
 * /api/administrador/cambiar-estado-guardia/{id}:
 *  patch:
 *      summary: Cambiar estado de guardia
 *      tags: [Administrador]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: ID del guardia
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          estado:
 *                              type: string
 *                              description: Nuevo estado
 *                      example:
 *                          estado: activo
 *      responses:
 *          200:
 *              description: Estado actualizado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de éxito
 *                          example:
 *                              msg: Estado actualizado correctamente
 *          400:
 *              description: Error al actualizar estado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          example:
 *                              msg: Estado inválido
 */
router.patch(
  "/administrador/cambiar-estado-guardia/:id",
  
  cambiarEstadoGuardia
);

/**
 * @swagger
 * /api/administrador/eliminar-guardia/{id}:
 *  delete:
 *      summary: Eliminar guardia
 *      tags: [Administrador]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: ID del guardia a eliminar
 *      responses:
 *          200:
 *              description: Guardia eliminado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de éxito
 *                          example:
 *                              msg: Guardia eliminado correctamente
 *          404:
 *              description: Guardia no encontrado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          example:
 *                              msg: Guardia no encontrado
 */
router.delete(
  "/administrador/eliminar-guardia/:id",
  
  EliminarGuardias
);

/**
 * @swagger
 * /api/administrador/registrar-usuarios:
 *  post:
 *      summary: Registrar un nuevo usuario
 *      tags: [Administrador]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UsuarioRegister'
 *      responses:
 *          200:
 *              description: Usuario registrado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de éxito
 *                          example:
 *                              msg: Usuario registrado correctamente
 *          400:
 *              description: Error en los datos del registro
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          example:
 *                              msg: Error en los datos proporcionados
 *          404:
 *              description: Usuario ya registrado o datos faltantes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          example:
 *                              msg: Lo sentimos debe llenar todos los campos o el usuario ya está registrado
 */
router.post(
  "/administrador/registrar-usuario",
  
  registroUsuarios
);

/**
 * @swagger
 * /api/administrador/listar-usuarios:
 *  get:
 *      summary: Listar usuarios
 *      tags: [Administrador]
 *      security:
 *       - bearerAuth: []
 *      responses:
 *          200:
 *              description: Lista de usuarios obtenida correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Usuario'
 *          404:
 *              description: No se encontraron usuarios
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          example:
 *                              msg: No hay usuarios registrados
 */
router.get("/administrador/listar-usuarios",  ListarUsuarios);

/**
 * @swagger
 * /api/administrador/eliminar-usuario/{id}:
 *  delete:
 *      summary: Eliminar usuario
 *      tags: [Administrador]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: ID del usuario a eliminar
 *      responses:
 *          200:
 *              description: Usuario eliminado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de éxito
 *                          example:
 *                              msg: Usuario eliminado correctamente
 *          404:
 *              description: Usuario no encontrado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          example:
 *                              msg: Usuario no encontrado
 */
router.delete(
  "/administrador/eliminar-usuario/:id",
  EliminarUsuarios
);

export default router;
