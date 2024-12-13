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

router.post("/usuarios/login", loginUsuario);

router.post("/recuperar-password", recuperarContraseña);

router.get("/recuperar-password/:token", comprobarTokenContraseña);

router.put("/nueva-password/:token", nuevaContraseña);

router.get("/usuarios/perfil", verificarRol, perfilUsuario);

router.put("/usuarios/actualizar-password", verificarRol, actualizarContraseña);

router.put("/usuarios/:id", verificarRol, actualizarPerfil);

router.get("/usuarios/parqueaderos-disponibles", verParqueaderosDisponibles);

export default router;
