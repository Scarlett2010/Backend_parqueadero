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
} from "../src/controllers/guardia_controller.js";
import Guardias from "../src/models/guardias.js";
import Usuario from "../src/models/usuarios.js";
import Parqueaderos from "../src/models/parqueaderos.js";
import { RestablecimientoContraseñaGuardia } from "../src/config/nodemailer.js";
import generarJWT from "../src/helpers/crearJWT.js";
import mongoose from "mongoose";

// Mocks
jest.mock("../src/models/guardias.js");
jest.mock("../src/models/usuarios.js");
jest.mock("../src/models/parqueaderos.js");
jest.mock("../src/helpers/crearJWT.js", () => jest.fn(() => "mock-token"));
jest.mock("../src/config/nodemailer.js", () => ({
  RestablecimientoContraseñaGuardia: jest.fn().mockResolvedValue(true),
}));

describe("Pruebas Unitarias - Gestión de Guardias y Usuarios", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      guardia: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Login y Autenticación", () => {
    test("Login guardia - campos vacíos", async () => {
      req.body = { email: "", password: "" };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos debe llenar todos los campos",
      });
    });

    test("Login guardia - email no registrado", async () => {
      req.body = { email: "noexiste@test.com", password: "password123" };

      Guardias.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos ese email no se encuentra registrado",
      });
    });

    test("Login guardia - cuenta inactiva", async () => {
      req.body = { email: "guardia@test.com", password: "password123" };

      const mockGuardia = {
        email: "guardia@test.com",
        status: false,
      };

      Guardias.findOne.mockResolvedValue(mockGuardia);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Acceso denegado",
      });
    });

    test("Login guardia - contraseña incorrecta", async () => {
      req.body = { email: "guardia@test.com", password: "wrongpassword" };

      const mockGuardia = {
        email: "guardia@test.com",
        status: true,
        matchPassword: jest.fn().mockResolvedValue(false),
      };

      Guardias.findOne.mockResolvedValue(mockGuardia);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos contraseña incorrecta ",
      });
    });

    test("Login guardia exitoso", async () => {
      req.body = { email: "guardia@test.com", password: "password123" };

      const mockGuardia = {
        _id: "mockid123",
        email: "guardia@test.com",
        nombre: "Guardia",
        apellido: "Test",
        telefono: "123456789",
        status: true,
        matchPassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };

      Guardias.findOne.mockResolvedValue(mockGuardia);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: mockGuardia._id,
        token: "mock-token",
        nombre: mockGuardia.nombre,
        apellido: mockGuardia.apellido,
        telefono: mockGuardia.telefono,
        email: mockGuardia.email,
        rol: "guardia",
        status: mockGuardia.status,
      });
    });
  });

  describe("Recuperación de Contraseña", () => {
    test("Recuperar contraseña - campos vacíos", async () => {
      req.body = { email: "" };

      await recuperarContraseña(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos, debes llenar todos los campos",
      });
    });

    test("Recuperar contraseña - guardia no encontrado", async () => {
      req.body = { email: "noexiste@test.com" };

      Guardias.findOne.mockResolvedValue(null);

      await recuperarContraseña(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos, el guardia no se encuentra registrado",
      });
    });

    test("Recuperar contraseña - envío exitoso", async () => {
      req.body = { email: "guardia@test.com" };

      const mockGuardia = {
        email: "guardia@test.com",
        createToken: jest.fn().mockReturnValue("mock-token"),
        save: jest.fn().mockResolvedValue(true),
      };

      Guardias.findOne.mockResolvedValue(mockGuardia);

      await recuperarContraseña(req, res);

      expect(RestablecimientoContraseñaGuardia).toHaveBeenCalledWith(
        "guardia@test.com",
        "mock-token"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Revisa tu correo electrónico para reestablecer tu cuenta",
      });
    });
  });

  describe("Gestión de Token y Contraseña", () => {
    test("Comprobar token - token no proporcionado", async () => {
      req.params = {};

      await comprobarTokenContraseña(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo siento no se pueda validar la cuenta",
      });
    });

    test("Comprobar token - token inválido", async () => {
      req.params.token = "invalid-token";

      const mockGuardia = {
        token: "different-token",
      };

      Guardias.findOne.mockResolvedValue(mockGuardia);

      await comprobarTokenContraseña(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos no se pueda validar la cuenta",
      });
    });

    test("Comprobar token válido", async () => {
      req.params.token = "valid-token";

      const mockGuardia = {
        token: "valid-token",
        save: jest.fn().mockResolvedValue(true),
      };

      Guardias.findOne.mockResolvedValue(mockGuardia);

      await comprobarTokenContraseña(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Token confirmado, ya puedes crear tu nuevo password",
      });
    });

    test("Nueva contraseña - campos vacíos", async () => {
      req.body = { password: "", confirmarPassword: "" };
      req.params.token = "valid-token";

      await nuevaContraseñaG(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos, debe llenar todos los campos",
      });
    });

    test("Nueva contraseña - contraseñas no coinciden", async () => {
      req.body = {
        password: "password123",
        confirmarPassword: "different123",
      };
      req.params.token = "valid-token";

      await nuevaContraseñaG(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos, las contraseñas no coinciden",
      });
    });

    test("Nueva contraseña exitosa", async () => {
      req.params.token = "valid-token";
      req.body = {
        password: "newpassword123",
        confirmarPassword: "newpassword123",
      };

      const mockGuardia = {
        token: "valid-token",
        encrypPassword: jest.fn().mockResolvedValue("hashedPassword"),
        save: jest.fn().mockResolvedValue(true),
      };

      Guardias.findOne.mockResolvedValue(mockGuardia);

      await nuevaContraseñaG(req, res);

      expect(mockGuardia.token).toBe(null);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Contraseña actualizada con exito",
      });
    });
  });

  describe("Gestión de Perfil", () => {
    test("Obtener perfil", async () => {
      req.guardia = {
        nombre: "Test",
        email: "test@test.com",
        telefono: "123456789",
      };

      await perfil(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(req.guardia);
    });

    test("Actualizar contraseña - campos vacíos", async () => {
      req.body = { actualPassword: "", nuevoPassword: "" };
      req.guardia = { _id: "mockid123" };

      await actualizarContraseñaG(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos, debe llenar todos los campos",
      });
    });

    test("Actualizar contraseña - contraseña actual incorrecta", async () => {
      req.body = {
        actualPassword: "wrongpassword",
        nuevoPassword: "newpassword123",
      };
      req.guardia = { _id: "mockid123" };

      const mockGuardia = {
        matchPassword: jest.fn().mockResolvedValue(false),
      };

      Guardias.findById.mockResolvedValue(mockGuardia);

      await actualizarContraseñaG(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos, la contraseña actual no es correcta",
      });
    });

    test("Actualizar contraseña exitosamente", async () => {
      req.body = {
        actualPassword: "currentpassword",
        nuevoPassword: "newpassword123",
      };
      req.guardia = { _id: "mockid123" };

      const mockGuardia = {
        matchPassword: jest.fn().mockResolvedValue(true),
        encrypPassword: jest.fn().mockResolvedValue("hashedPassword"),
        save: jest.fn().mockResolvedValue(true),
      };

      Guardias.findById.mockResolvedValue(mockGuardia);

      await actualizarContraseñaG(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Contraseña actualizada con exito",
      });
    });

    test("Actualizar perfil - ID inválido", async () => {
      req.params.id = "invalid-id";
      mongoose.Types.ObjectId.isValid = jest.fn(() => false);

      await actualizarPerfil(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "El id que acaba de ingresar no existe",
      });
    });

    test("Actualizar perfil exitosamente", async () => {
      req.params.id = "valid-id";
      req.body = { telefono: "987654321" };

      mongoose.Types.ObjectId.isValid = jest.fn(() => true);

      const mockGuardia = {
        save: jest.fn().mockResolvedValue(true),
      };

      Guardias.findByIdAndUpdate.mockResolvedValue(mockGuardia);

      await actualizarPerfil(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Perfil actualizado",
      });
    });
  });

  describe("Gestión de Usuarios", () => {
    test("Registrar usuario - campos vacíos", async () => {
      req.body = { email: "", password: "" };

      await registroUsuarios(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos debe llenar todos los campos",
      });
    });

    test("Registrar usuario - email ya registrado", async () => {
      req.body = {
        email: "existente@test.com",
        password: "password123",
        nombre: "Usuario Existente",
      };

      Usuario.findOne.mockResolvedValue({ email: "existente@test.com" });

      await registroUsuarios(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos pero el usuario ya se encuentra registrado",
      });
    });

    test("Registrar usuario exitosamente", async () => {
      req.body = {
        email: "nuevo@test.com",
        password: "password123",
        nombre: "Nuevo Usuario",
      };

      const mockUsuario = {
        ...req.body,
        encrypPassword: jest.fn().mockResolvedValue("hashedPassword"),
        save: jest.fn().mockResolvedValue(true),
      };

      Usuario.findOne.mockResolvedValue(null);
      Usuario.prototype.constructor = jest.fn().mockReturnValue(mockUsuario);

      await registroUsuarios(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Usuario registrado",
      });
    });

    test("Listar usuarios exitosamente", async () => {
      const mockUsuarios = [
        {
          _id: "1",
          nombre: "Usuario 1",
          email: "usuario1@test.com",
        },
        {
          _id: "2",
          nombre: "Usuario 2",
          email: "usuario2@test.com",
        },
      ];

      Usuario.find.mockResolvedValue(mockUsuarios);

      await ListarUsuarios(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsuarios);
    });

    test("Cambiar estado usuario - error en formato", async () => {
      req.params.id = "user1";
      req.body = { estado: "invalid" };

      await cambiarEstadoUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Error al modificar el estado del usuario",
        error: expect.any(String),
      });
    });

    test("Cambiar estado usuario exitosamente", async () => {
      req.params.id = "user1";
      req.body = { estado: "true" };

      Usuario.findByIdAndUpdate.mockResolvedValue({});

      await cambiarEstadoUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Estado modificado exitosamente",
      });
    });

    test("Actualizar usuario - campos vacíos", async () => {
      req.params.id = "user1";
      req.body = { nombre: "", email: "" };

      await actualizarUsuarios(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos debe llenar todos los campos",
      });
    });

    test("Actualizar usuario - ID inválido", async () => {
      req.params.id = "invalid-id";
      req.body = { nombre: "Updated", email: "updated@test.com" };

      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      await actualizarUsuarios(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos pero ese guardia no se encuentra registrado",
      });
    });

    test("Actualizar usuario exitosamente", async () => {
      req.params.id = "valid-id";
      req.body = {
        nombre: "Updated User",
        email: "updated@test.com",
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);

      const mockUsuario = {
        save: jest.fn().mockResolvedValue(true),
      };

      Usuario.findByIdAndUpdate.mockResolvedValue(mockUsuario);

      await actualizarUsuarios(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Perfil actualizado",
      });
    });
  });

  describe("Gestión de Parqueaderos", () => {
    test("Cambiar estado parqueadero - estado inválido", async () => {
      req.params.id = "parqueadero1";
      req.body = { estado: "invalid" };

      await cambiarEstadoParqueadero(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "El estado debe ser true o false",
      });
    });

    test("Cambiar estado parqueadero exitosamente", async () => {
      req.params.id = "parqueadero1";
      req.body = { estado: true };

      Parqueaderos.findByIdAndUpdate.mockResolvedValue({});

      await cambiarEstadoParqueadero(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Estado del parqueadero modificado exitosamente a true",
      });
    });

    test("Cambiar estado parqueadero - error del servidor", async () => {
      req.params.id = "parqueadero1";
      req.body = { estado: true };

      Parqueaderos.findByIdAndUpdate.mockRejectedValue(
        new Error("Error de servidor")
      );

      await cambiarEstadoParqueadero(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Error al modificar el estado del parqueadero",
        error: "Error de servidor",
      });
    });

    test("Cambiar estado espacio - estado inválido", async () => {
      req.params.id = "parqueadero1";
      req.body = {
        estado: "invalid",
        numeroEspacio: 1,
      };

      await cambiarEstadoEspacio(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "El estado debe ser true o false",
      });
    });

    test("Cambiar estado espacio - parqueadero no encontrado", async () => {
      req.params.id = "parqueadero1";
      req.body = {
        estado: true,
        numeroEspacio: 1,
      };

      Parqueaderos.findById.mockResolvedValue(null);

      await cambiarEstadoEspacio(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Parqueadero no encontrado",
      });
    });

    test("Cambiar estado espacio - espacio no encontrado", async () => {
      req.params.id = "parqueadero1";
      req.body = {
        estado: true,
        numeroEspacio: 999,
      };

      const mockParqueadero = {
        espacios: [{ numeroEspacio: 1, estado: false }],
      };

      Parqueaderos.findById.mockResolvedValue(mockParqueadero);

      await cambiarEstadoEspacio(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Espacio no encontrado",
      });
    });

    test("Cambiar estado espacio exitosamente", async () => {
      req.params.id = "parqueadero1";
      req.body = {
        estado: true,
        numeroEspacio: 1,
      };

      const mockParqueadero = {
        espacios: [{ numeroEspacio: 1, estado: false }],
        save: jest.fn().mockResolvedValue(true),
      };

      Parqueaderos.findById.mockResolvedValue(mockParqueadero);

      await cambiarEstadoEspacio(req, res);

      expect(mockParqueadero.espacios[0].estado).toBe(true);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Estado del espacio modificado exitosamente a true",
        data: { numeroEspacio: 1, estado: true },
      });
    });

    test("Cambiar estado espacio - error del servidor", async () => {
      req.params.id = "parqueadero1";
      req.body = {
        estado: true,
        numeroEspacio: 1,
      };

      Parqueaderos.findById.mockRejectedValue(new Error("Error de servidor"));

      await cambiarEstadoEspacio(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Error al modificar el estado del espacio",
        error: "Error de servidor",
      });
    });
  });
});
