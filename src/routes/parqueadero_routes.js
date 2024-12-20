import { Router } from "express";
import {
  registrarParqueadero,
  actualizarParqueadero,
  cambiarEstadoParqueadero,
  EliminarParqueadero,
  // listarDisponibilidadParqueaderos,
  //listarParqueaderos,
  //detalleParqueadero,
} from "../controllers/parquedero_controller.js";

import verificarAdmin from "../middlewares/autenticacionAdmin.js";

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
 *    Parqueadero:
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
 *        x:
 *          type: number
 *          description: Coordenada X del parqueadero
 *        y:
 *          type: number
 *          description: Coordenada Y del parqueadero
 *      example:
 *        nombre: "Parqueadero ESFOT"
 *        description: "Parqueadero principal"
 *        planta: "Planta 1"
 *        bloque: "A"
 *        tipo: "Automovil"
 *        espacios: 6
 *        estado: true
 *        x: 100
 *        y: 100
 */

/**
 * @swagger
 * tags:
 *   - name: Parqueadero
 *     description: Endpoints relacionados con la gestión de parqueaderos
 */

/**
 * @swagger
 * /api/parqueaderos/registrar:
 *   post:
 *     summary: Registra un nuevo parqueadero
 *     tags: [Parqueadero]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parqueadero'
 *     responses:
 *       201:
 *         description: Parqueadero registrado exitosamente
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: No autorizado, falta de token
 */
router.post("/parqueaderos/registrar", verificarAdmin, registrarParqueadero);

/**
 * @swagger
 * /api/parqueaderos/{id}:
 *   put:
 *     summary: Actualiza la información de un parqueadero
 *     tags: [Parqueadero]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del parqueadero a actualizar
 *         schema:
 *           type: string
 *           example: "63f5d123c8b7f1d21c456abc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parqueadero'
 *     responses:
 *       200:
 *         description: Parqueadero actualizado exitosamente
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Parqueadero no encontrado
 *       401:
 *         description: No autorizado, falta de token
 */
router.put("/parqueaderos/:id", verificarAdmin, actualizarParqueadero);

/**
 * @swagger
 * /api/parqueaderos/{id}:
 *   patch:
 *     summary: Cambia el estado de un parqueadero
 *     tags: [Parqueadero]
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
router.patch("/parqueaderos/:id", verificarAdmin, cambiarEstadoParqueadero);

/**
 * @swagger
 * /api/parqueaderos/{id}:
 *   delete:
 *     summary: Elimina un parqueadero
 *     tags: [Parqueadero]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del parqueadero a eliminar
 *         schema:
 *           type: string
 *           example: "63f5d123c8b7f1d21c456abc"
 *     responses:
 *       200:
 *         description: Parqueadero eliminado exitosamente
 *       404:
 *         description: Parqueadero no encontrado
 *       401:
 *         description: No autorizado, falta de token
 */
router.delete("/parqueaderos/:id", verificarAdmin, EliminarParqueadero);

//router.get("/parqueaderos", listarParqueaderos);

//router.get("/parqueaderos/:id", verificarAdmin, detalleParqueadero);
export default router;
