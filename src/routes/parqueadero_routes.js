import { Router } from "express";
import {
  registrarParqueadero,
  actualizarParqueadero,
  EliminarParqueadero,
  listarParqueaderos,
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
 * /api/parqueaderos:
 *  get:
 *    summary: Listar todos los parqueaderos
 *    tags: [Parqueadero]
 *    responses:
 *      200:
 *        description: Lista de parqueaderos obtenida con éxito
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    description: ID único del parqueadero
 *                  nombre:
 *                    type: string
 *                    description: Nombre del parqueadero
 *                  description:
 *                    type: string
 *                    description: Descripción del parqueadero
 *                  planta:
 *                    type: string
 *                    description: Planta donde se encuentra el parqueadero
 *                  bloque:
 *                    type: string
 *                    description: Bloque donde se encuentra el parqueadero
 *                  espacios:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        numeroEspacio:
 *                          type: number
 *                          description: Número del espacio
 *                        estado:
 *                          type: boolean
 *                          description: Estado del espacio (true para ocupado, false para libre)
 *                  estado:
 *                    type: boolean
 *                    description: Estado del parqueadero (activo/inactivo)
 *              example:
 *                - _id: "63f9a6e3c9d4b7a3f4e7d8a1"
 *                  nombre: "Parqueadero A"
 *                  description: "Parqueadero cerca del bloque principal"
 *                  planta: "Planta Baja"
 *                  bloque: "Bloque A"
 *                  espacios:
 *                    - numeroEspacio: 1
 *                      estado: true
 *                    - numeroEspacio: 2
 *                      estado: false
 *                  estado: true
 *                - _id: "63f9a6e3c9d4b7a3f4e7d8a2"
 *                  nombre: "Parqueadero B"
 *                  description: "Parqueadero en el segundo bloque"
 *                  planta: "Primer Piso"
 *                  bloque: "Bloque B"
 *                  espacios:
 *                    - numeroEspacio: 1
 *                      estado: true
 *                  estado: false
 *      500:
 *        description: Error al intentar obtener la lista de parqueaderos
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
 *                  description: Detalles del error (opcional)
 *              example:
 *                msg: "Error al listar los parqueaderos."
 *                error: "Detalle del error interno"
 */
router.get("/parqueaderos", listarParqueaderos);

/**
 * @swagger
 * /api/actualizar-parqueadero/{id}:
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
router.put(
  "/actualizar-parqueadero/:id",
  verificarAdmin,
  actualizarParqueadero
);

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

export default router;
