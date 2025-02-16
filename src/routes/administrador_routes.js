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
} from "../controllers/administrador_controller.js";

const router = Router();

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
 *   summary: Login de administrador
 *   tags: [Administrador]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/AdminLogin'
 *   responses:
 *    200:
 *     description: Login exitoso
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/AdminResponse'
 *    400:
 *     description: Error de validación
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         msg:
 *          type: string
 *          description: El mensaje de error
 *        example:
 *         msg: Lo sentimos debe llenar todos los campos
 *    404:
 *     description: Error al iniciar sesión
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         msg:
 *          type: string
 *          description: El mensaje de error
 *       examples:
 *        usuario no registrado:
 *         value:
 *          msg: Lo siento el usuario no se encuentra registrado
 *        Contraseña incorrecta:
 *         value:
 *          msg: Lo sentimos la contraseña es incorrecta
 *        No autenticado:
 *         value:
 *          msg: Lo sentimos primero debe proporcionar un token
 */
router.post("/administrador/login", loginAdmin);

/**
 * @swagger
 * /api/administrador/recuperar-clave:
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
 *                example: "estaphanym@gmail.com"
 *    responses:
 *      200:
 *        description: Correo enviado para recuperación
 *      404:
 *        description: Usuario no encontrado
 */
router.post("/administrador/recuperar-clave", recuperarContraseña);

/**
 * @swagger
 * /api/administrador/recuperar-clave/{token}:
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
router.get("/administrador/recuperar-clave/:token", comprobarTokenContraseña);

/**
 * @swagger
 * /api/administrador/nueva-clave/{token}:
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
router.put("/administrador/nueva-clave/:token", nuevaContraseña);

/**
 * @swagger
 * /api/administrador/registrar-guardia:
 *  post:
 *      summary: Registrar un nuevo guardia
 *      tags: [Administrador]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                              description: Nombre del guardia
 *                          apellido:
 *                              type: string
 *                              description: Apellido del guardia
 *                          cedula:
 *                              type: string
 *                              description: Cédula del guardia
 *                          email:
 *                              type: string
 *                              description: Correo electrónico del guardia
 *                          telefono:
 *                              type: number
 *                              description: Teléfono del guardia
 *                          password:
 *                              type: string
 *                              description: Contraseña del guardia
 *                      required:
 *                          - nombre
 *                          - apellido
 *                          - cedula
 *                          - email
 *                          - telefono
 *                          - password
 *                      example:
 *                          nombre: "Carlos"
 *                          apellido: "López"
 *                          cedula: "1234567890"
 *                          email: "carlos.lopez@example.com"
 *                          telefono: 987654321
 *                          password: "contraseñaSegura123"
 *      responses:
 *          200:
 *              description: Guardia registrado y correo enviado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de éxito
 *                          example:
 *                              msg: Guardia registrado y correo enviado
 *          404:
 *              description: Error al registrar el guardia
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          examples:
 *                              camposVacios:
 *                                  value:
 *                                      msg: Lo sentimos debe llenar todos los campos
 *                              guardiaRegistrado:
 *                                  value:
 *                                      msg: Lo sentimos pero ese guardia ya se encuentra registrado
 *          500:
 *              description: Error interno al intentar registrar al guardia
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error interno
 *                              error:
 *                                  type: string
 *                                  description: Detalles del error (opcional)
 *                          example:
 *                              msg: Hubo un error al registrar el guardia
 */
router.post(
  "/administrador/registrar-guardia",
  verificarAdmin,
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
 *                      example:
 *                          [
 *                              {
 *                                  "_id": "60d5ecb8b98c1f2b9cfe6b1a",
 *                                  "cedula": 1234567890,
 *                                  "nombre": "Juan",
 *                                  "apellido": "Pérez",
 *                                  "email": "juan.perez@example.com",
 *                                  "telefono": 987654321,
 *                                  "placa_vehiculo": "ABC-123",
 *                                  "rol": "Guardia",
 *                                  "estado": true,
 *                                  "createdAt": "2023-06-21T15:30:00.000Z",
 *                                  "updatedAt": "2023-06-21T15:30:00.000Z"
 *                              },
 *                              {
 *                                  "_id": "60d5ecb8b98c1f2b9cfe6b1b",
 *                                  "cedula": 9876543210,
 *                                  "nombre": "María",
 *                                  "apellido": "González",
 *                                  "email": "maria.gonzalez@example.com",
 *                                  "telefono": 123456789,
 *                                  "placa_vehiculo": "XYZ-789",
 *                                  "rol": "Guardia",
 *                                  "estado": true,
 *                                  "createdAt": "2023-06-21T15:30:00.000Z",
 *                                  "updatedAt": "2023-06-21T15:30:00.000Z"
 *                              }
 *                          ]
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
router.get("/administrador/listar-guardias", verificarAdmin, ListarGuardias);

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
 *           example:
 *             nombre: "Juan"
 *             apellido: "Pérez"
 *             cedula: "1234567890"
 *             email: "juan.perez@example.com"
 *             telefono: 987654321
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
 *                   example: Perfil del guardia actualizado con éxito.
 *                 guardia:
 *                   type: object
 *                   description: Datos actualizados del guardia
 *       400:
 *         description: No se enviaron campos válidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: No se enviaron campos válidos.
 *       404:
 *         description: Guardia no encontrado o ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *             examples:
 *               idInvalido:
 *                 value:
 *                   msg: Guardia no registrado.
 *               guardiaNoEncontrado:
 *                 value:
 *                   msg: Guardia no encontrado.
 *       500:
 *         description: Error en el servidor al intentar actualizar el perfil del guardia
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Error al actualizar el perfil del guardia.
 */
router.put(
  "/administrador/actualizar-guardia/:id",
  verificarAdmin,
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
  verificarAdmin,
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
  verificarAdmin,
  EliminarGuardias
);

/**
 * @swagger
 * /api/administrador/registrar-usuario:
 *  post:
 *      summary: Registrar un nuevo usuario (Administrativo o Docente)
 *      tags: [Administrador]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                              description: Nombre del usuario
 *                          apellido:
 *                              type: string
 *                              description: Apellido del usuario
 *                          cedula:
 *                              type: number
 *                              description: Cédula del usuario
 *                          email:
 *                              type: string
 *                              description: Correo electrónico del usuario
 *                          telefono:
 *                              type: number
 *                              description: Teléfono del usuario
 *                          password:
 *                              type: string
 *                              description: Contraseña del usuario
 *                          placa_vehiculo:
 *                              type: string
 *                              description: Placa del vehículo del usuario
 *                          rol:
 *                              type: string
 *                              description: Rol del usuario (Administrativo o Docente)
 *                              enum: [Administrativo, Docente]
 *                      required:
 *                          - nombre
 *                          - apellido
 *                          - cedula
 *                          - email
 *                          - password
 *                          - placa_vehiculo
 *                          - rol
 *                      example:
 *                          nombre: "María"
 *                          apellido: "Pérez"
 *                          cedula: 987654321
 *                          email: "maria.perez@example.com"
 *                          telefono: 987654321
 *                          password: "passwordSeguro123"
 *                          placa_vehiculo: "ABC-123"
 *                          rol: "Administrativo"
 *      responses:
 *          201:
 *              description: Usuario registrado y correo enviado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de éxito
 *                          example:
 *                              msg: Usuario registrado y correo enviado
 *          400:
 *              description: Error por datos faltantes o rol inválido
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          examples:
 *                              camposVacios:
 *                                  value:
 *                                      msg: Lo sentimos, debe llenar todos los campos
 *                              rolInvalido:
 *                                  value:
 *                                      msg: El rol debe ser Administrativo o Docente
 *          409:
 *              description: Error por usuario ya registrado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error
 *                          example:
 *                              msg: Lo sentimos, pero el usuario ya se encuentra registrado
 *          500:
 *              description: Error interno al intentar registrar el usuario
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de error interno
 *                          example:
 *                              msg: Hubo un error al registrar el usuario
 */
router.post(
  "/administrador/registrar-usuario",
  verificarAdmin,
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
 *                      example:
 *                          [
 *                              {
 *                                  "_id": "60d5ecb8b98c1f2b9cfe6b1a",
 *                                  "cedula": 1234567790,
 *                                  "nombre": "Juan",
 *                                  "apellido": "Pérez",
 *                                  "email": "juan@example.com",
 *                                  "telefono": 987654321,
 *                                  "placa_vehiculo": "ABC-123",
 *                                  "rol": "Invitado",
 *                                  "estado": true
 *                              },
 *                              {
 *                                  "_id": "60d5ecb8b98c1f2b9cfe6b1b",
 *                                  "cedula": 9876543110,
 *                                  "nombre": "María",
 *                                  "apellido": "González",
 *                                  "email": "maria@example.com",
 *                                  "telefono": 123456789,
 *                                  "placa_vehiculo": "XYZ-789",
 *                                  "rol": "Docente",
 *                                  "estado": true
 *                              }
 *                          ]
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
router.get("/administrador/listar-usuarios", verificarAdmin, ListarUsuarios);

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
  verificarAdmin,
  EliminarUsuarios
);

export default router;
