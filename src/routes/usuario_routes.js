import { Router } from "express";
import {
  actualizarContraseña,
  actualizarPerfil,
  comprobarTokenContraseña,
  loginUsuario,
  nuevaContraseña,
  perfilUsuario,
  recuperarContraseña,
  verParqueaderosDisponibles,
} from "../controllers/usuario_controller.js";
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
 *     UsuarioLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: El email del usuario
 *         password:
 *           type: string
 *           format: password
 *       example:
 *         email: "carlosramirez@gmail.com"
 *         password: "Usuario.123"
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
 */

/**
 * @swagger
 * tags:
 *  - name: Usuario
 *    description: Endpoints relacionados con la gestión de usuarios
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El email del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 description: La contraseña del usuario
 *           example:
 *             email: "carlosramirez@gmail.com"
 *             password: "Usuario.123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: El token generado para el usuario
 *               example:
 *                 token: "abcdef123456"
 *       400:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "Credenciales inválidas"
 */
router.post("/usuarios/login", loginUsuario);

/**
 * @swagger
 * /api/recuperar-password:
 *   post:
 *     summary: Solicita un enlace para recuperar la contraseña
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El email del usuario para recuperar la contraseña
 *           example:
 *             email: "carlosramirez@gmail.com"
 *     responses:
 *       200:
 *         description: Enlace de recuperación enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "Enlace de recuperación enviado"
 *       400:
 *         description: Error al enviar el enlace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "Error al enviar el enlace"
 */
router.post("/recuperar-password", recuperarContraseña);

/**
 * @swagger
 * /api/recuperar-password/{token}:
 *   get:
 *     summary: Verifica si el token de recuperación es válido
 *     tags: [Usuario]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: El token de recuperación
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token válido
 *       400:
 *         description: Token inválido
 */
router.get("/recuperar-password/:token", comprobarTokenContraseña);

/**
 * @swagger
 * /api/nueva-password/{token}:
 *   put:
 *     summary: Establece una nueva contraseña usando el token
 *     tags: [Usuario]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: El token de recuperación
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: La nueva contraseña
 *           example:
 *             password: "NuevaContraseña.123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *       400:
 *         description: Token inválido o error en la actualización
 */
router.put("/nueva-password/:token", nuevaContraseña);

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obtiene el perfil del usuario
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 cedula:
 *                   type: string
 *                 email:
 *                   type: string
 *                 telefono:
 *                   type: number
 *                 placa_vehiculo:
 *                   type: string
 *                 rol:
 *                   type: string
 *                 estado:
 *                   type: boolean
 *                 _id:
 *                   type: string
 *       401:
 *         description: No autorizado, falta de token
 */
router.get("/usuarios/perfil", verificarRol, perfilUsuario);

/**
 * @swagger
 * /api/usuarios/actualizar-password:
 *   put:
 *     summary: Actualiza la contraseña del usuario
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actualPassword:
 *                 type: string
 *                 format: password
 *                 description: La contraseña actual del usuario
 *               nuevoPassword:
 *                 type: string
 *                 format: password
 *                 description: La nueva contraseña del usuario
 *           example:
 *             actualPassword: "Usuario.123"
 *             nuevoPassword: "Usuario.456"
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "Contraseña actualizada con éxito"
 *       400:
 *         description: Error de validación, contraseñas vacías o incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "La contraseña actual y la nueva contraseña son necesarias"
 *       404:
 *         description: Usuario no encontrado o la contraseña actual es incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "Lo sentimos, la contraseña actual no es correcta"
 *       401:
 *         description: No autorizado, falta de token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "No autorizado, falta de token"
 */
router.put("/usuarios/actualizar-password", verificarRol, actualizarContraseña);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza el perfil del usuario (solo teléfono)
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del usuario que se va a actualizar
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
 *               telefono:
 *                 type: number
 *                 description: El nuevo número de teléfono del usuario
 *             required:
 *               - telefono
 *           example:
 *             telefono: 987654321
 *     responses:
 *       200:
 *         description: Perfil actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "Perfil actualizado"
 *       400:
 *         description: Error de validación, ID no válido o campos incompletos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "El id que acaba de ingresar no existe"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "Lo sentimos, debes llenar todos los campos"
 *       401:
 *         description: No autorizado, falta de token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *               example:
 *                 msg: "No autorizado, falta de token"
 */
router.put("/usuarios/:id", verificarRol, actualizarPerfil);

/**
 * @swagger
 * /api/usuarios/parqueaderos-disponibles:
 *   get:
 *     summary: Obtiene los parqueaderos disponibles
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de parqueaderos disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   direccion:
 *                     type: string
 *                   disponible:
 *                     type: boolean
 *             example:
 *               - id: "123"
 *                 nombre: "Parqueadero A"
 *                 direccion: "Calle 123, Ciudad"
 *                 disponible: true
 *       401:
 *         description: No autorizado, falta de token
 */
router.get("/usuarios/parqueaderos-disponibles", verParqueaderosDisponibles);

export default router;
