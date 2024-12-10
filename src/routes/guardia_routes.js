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
  verParqueaderosDisponibles,
} from "../controllers/guardia_controller.js";
import verificarRol from "../middlewares/autenticacion.js";

const router = Router();

router.post("/guardias/login", login);

router.post("/guardias/recuperar-password", recuperarContraseña);

router.get("/guardias/recuperar-password/:token", comprobarTokenContraseña);

router.put("/guardias/nueva-password/:token", nuevaContraseñaG);

router.get("/guardias/perfil", verificarRol, perfil);

router.put(
  "/guardias/actualizar-password",
  verificarRol,
  actualizarContraseñaG
);

router.put("/guardias/:id", verificarRol, actualizarPerfil);

router.post("/guardias/registrar", verificarRol, registroUsuarios);

router.get("/guardias/listar-usuarios", verificarRol, ListarUsuarios);
router.patch(
  "/guardias/cambiar-estado-usuario/:id",
  verificarRol,
  cambiarEstadoUsuario
);

router.put(
  "/guardias/actualizar-usuarios/:id",
  verificarRol,
  actualizarUsuarios
);
router.get("/guardias/parqueaderos-disponibles", verParqueaderosDisponibles);

export default router;
