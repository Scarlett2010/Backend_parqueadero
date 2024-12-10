import { Router } from "express";

import verificarRol from "../middlewares/autenticacion.js";
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
/*inicio sesion y recuperar contraseña*/

router.post("/administrador/registrar", registroAdmin);

router.post("/administrador/login", loginAdmin);

router.post("/administrador/recuperar-password", recuperarContraseña);

router.get(
  "/administrador/recuperar-password/:token",
  comprobarTokenContraseña
);

router.put("/administrador/nueva-password/:token", nuevaContraseña);

/*fin inicio sesion y recuperar contraseña*/

/*apartado guardias*/
router.post("/administrador/registrar-guardia", verificarRol, registroGuardias);

router.get("/administrador/listar-guardias", verificarRol, ListarGuardias);

router.put(
  "/administrador/actualizar-perfil/:id",
  verificarRol,
  actualizarPerfilGuardia
);

router.patch(
  "/administrador/cambiar-estado-guardia/:id",
  verificarRol,
  cambiarEstadoGuardia
);

router.delete(
  "/administrador/eliminar-guardia/:id",
  verificarRol,
  EliminarGuardias
);
/*fin apartado guardias*/

/*apartado usuarios*/
router.post("/administrador/registrar-usuario", verificarRol, registroUsuarios);

router.get("/administrador/listar-usuarios", verificarRol, ListarUsuarios);

router.delete(
  "/administrador/eliminar_usuario/:id",
  verificarRol,
  EliminarUsuarios
);
/*fin apartado usuarios*/

/*apartado parqueaderos*/
router.get(
  "/administrador/disponibilidad-parqueadero",
  verificarRol,
  listarDisponibilidadParqueaderosAdmin
);
/*fin apartado parqueaderos*/

export default router;
