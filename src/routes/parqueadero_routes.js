import { Router } from "express";
import {
  actualizarParqueadero,
  detalleParqueadero,
  cambiarEstadoParqueadero,
  // listarDisponibilidadParqueaderos,
  listarParqueaderos,
  registrarParqueadero,
  EliminarParqueadero,
} from "../controllers/parquedero_controller.js";

import verificarAdmin from "../middlewares/autenticacionAdmin.js";

const router = Router();

router.post("/parqueaderos/registrar", verificarAdmin, registrarParqueadero);

router.get("/parqueaderos", listarParqueaderos);

router.get("/parqueaderos/:id", verificarAdmin, detalleParqueadero);

router.put("/parqueaderos/:id", verificarAdmin, actualizarParqueadero);

router.patch("/parqueaderos/:id", verificarAdmin, cambiarEstadoParqueadero);

router.delete("/parqueaderos/:id", verificarAdmin, EliminarParqueadero);
export default router;
