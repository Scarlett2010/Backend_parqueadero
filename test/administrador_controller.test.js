import {
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
} from "../src/controllers/administrador_controller.js";
import Administrador from "../src/models/administrador.js";
import guardias from "../src/models/guardias.js";
import Usuario from "../src/models/usuarios.js";
import mongoose from "mongoose";

// Mocks
jest.mock("../src/models/administrador.js");
jest.mock("../src/models/guardias.js");
jest.mock("../src/models/usuarios.js");
jest.mock("../src/helpers/crearJWT.js", () => () => "mock-token");
jest.mock("../src/config/nodemailer.js", () => ({
  RestablecimientoContraseñaAdmin: jest.fn().mockResolvedValue(true),
}));

describe("Pruebas Unitarias - Administrador y Gestión de Usuarios", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("Login administrador exitoso", async () => {
    req.body = {
      email: "admin@test.com",
      password: "password123",
    };

    const mockAdmin = {
      _id: "mockid123",
      email: "admin@test.com",
      nombre: "Admin",
      apellido: "Test",
      telefono: "123456789",
      matchPassword: jest.fn().mockResolvedValue(true),
    };

    Administrador.findOne.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockAdmin),
    }));

    await loginAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: mockAdmin._id,
      token: "mock-token",
      nombre: mockAdmin.nombre,
      apellido: mockAdmin.apellido,
      telefono: mockAdmin.telefono,
      email: mockAdmin.email,
    });
  });

  test("Recuperar contraseña - envía correo exitosamente", async () => {
    req.body = { email: "admin@test.com" };

    const mockAdmin = {
      email: "admin@test.com",
      Tokencrear: jest.fn().mockReturnValue("mock-token"),
      save: jest.fn().mockResolvedValue(true),
    };

    Administrador.findOne.mockResolvedValue(mockAdmin);

    await recuperarContraseña(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Revisa tu correo electrónico para reestablecer tu cuenta",
    });
  });

  test("Comprobar token de contraseña exitosamente", async () => {
    req.params = { token: "valid-token" };

    const mockAdmin = {
      token: "valid-token",
    };

    Administrador.findOne.mockResolvedValue(mockAdmin);

    await comprobarTokenContraseña(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Token confirmado, ya puedes crear tu nuevo password",
    });
  });

  test("Nueva contraseña - actualización exitosa", async () => {
    req.params = { token: "valid-token" };
    req.body = {
      password: "newPassword123",
      confirmarPassword: "newPassword123",
    };

    const mockAdmin = {
      token: "valid-token",
      encrypPassword: jest.fn().mockResolvedValue("hashed-password"),
      save: jest.fn().mockResolvedValue(true),
    };

    Administrador.findOne.mockResolvedValue(mockAdmin);

    await nuevaContraseña(req, res);

    expect(mockAdmin.encrypPassword).toHaveBeenCalledWith("newPassword123");
    expect(mockAdmin.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Contraseña actualizada con exito",
    });
  });

  test("Nueva contraseña - contraseñas no coinciden", async () => {
    req.params = { token: "valid-token" };
    req.body = {
      password: "newPassword123",
      confirmarPassword: "differentPassword",
    };

    await nuevaContraseña(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Lo sentimos, las contraseñas no coinciden",
    });
  });

  test("Nueva contraseña - campos vacíos", async () => {
    req.params = { token: "valid-token" };
    req.body = {
      password: "",
      confirmarPassword: "",
    };

    await nuevaContraseña(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Lo sentimos, debe llenar todos los campos",
    });
  });

  test("Registrar un guardia exitosamente", async () => {
    req.body = {
      email: "guardia@test.com",
      password: "password123",
      nombre: "Guardia",
    };

    const mockGuardia = {
      ...req.body,
      encrypPassword: jest.fn().mockResolvedValue("hashed-password"),
      save: jest.fn().mockResolvedValue(true),
    };

    guardias.findOne.mockResolvedValue(null);
    guardias.prototype.encrypPassword = mockGuardia.encrypPassword;
    guardias.prototype.save = mockGuardia.save;

    await registroGuardias(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: "Guardia registrado" });
  });

  test("Listar guardias exitosamente", async () => {
    const mockGuardias = [
      {
        _id: new mongoose.Types.ObjectId(),
        nombre: "Guardia 1",
        email: "guardia1@test.com",
      },
      {
        _id: new mongoose.Types.ObjectId(),
        nombre: "Guardia 2",
        email: "guardia2@test.com",
      },
    ];

    guardias.find.mockResolvedValue(mockGuardias);

    await ListarGuardias(req, res);

    expect(guardias.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockGuardias);
  });

  test("Actualizar perfil del guardia exitosamente", async () => {
    req.params = { id: new mongoose.Types.ObjectId().toString() };
    req.body = { nombre: "Guardia Actualizado" };

    guardias.findByIdAndUpdate.mockResolvedValue({
      ...req.body,
      _id: req.params.id,
    });

    await actualizarPerfilGuardia(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Perfil del guardia actualizado con éxito.",
      guardia: expect.any(Object),
    });
  });

  test("Cambiar estado del guardia exitosamente", async () => {
    req.params = { id: new mongoose.Types.ObjectId().toString() };
    req.body = { estado: "true" };

    guardias.findByIdAndUpdate.mockResolvedValue({ estado: true });

    await cambiarEstadoGuardia(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Estado modificado exitosamente",
    });
  });

  test("Eliminar un guardia exitosamente", async () => {
    req.params = { id: new mongoose.Types.ObjectId().toString() };

    guardias.findByIdAndDelete.mockResolvedValue({
      _id: req.params.id,
      nombre: "Guardia",
    });

    await EliminarGuardias(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: "Usuario eliminado" });
  });

  test("Registro de usuario exitoso", async () => {
    req.body = {
      email: "usuario@test.com",
      password: "password123",
      nombre: "Usuario Test",
    };

    const mockUsuario = {
      ...req.body,
      encrypPassword: jest.fn().mockResolvedValue("hashed-password"),
      save: jest.fn().mockResolvedValue(true),
    };

    Usuario.findOne.mockResolvedValue(null);
    Usuario.prototype.encrypPassword = mockUsuario.encrypPassword;
    Usuario.prototype.save = mockUsuario.save;

    await registroUsuarios(req, res);

    expect(Usuario.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(mockUsuario.encrypPassword).toHaveBeenCalledWith(req.body.password);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Usuario registrado",
    });
  });

  test("Registro de usuario - usuario ya existe", async () => {
    req.body = {
      email: "usuario@test.com",
      password: "password123",
      nombre: "Usuario Test",
    };

    Usuario.findOne.mockResolvedValue({ email: req.body.email });

    await registroUsuarios(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Lo sentimos pero el usuario ya se encuentra registrado",
    });
  });

  test("Registro de usuario - campos vacíos", async () => {
    req.body = {
      email: "",
      password: "",
      nombre: "",
    };

    await registroUsuarios(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Lo sentimos debe llenar todos los campos",
    });
  });

  test("Listar usuarios exitosamente", async () => {
    const mockUsuarios = [
      { _id: new mongoose.Types.ObjectId(), nombre: "Usuario 1" },
      { _id: new mongoose.Types.ObjectId(), nombre: "Usuario 2" },
    ];

    Usuario.find.mockResolvedValue(mockUsuarios);

    await ListarUsuarios(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsuarios);
  });

  test("Eliminar un usuario exitosamente", async () => {
    req.params = { id: new mongoose.Types.ObjectId().toString() };

    Usuario.findByIdAndDelete.mockResolvedValue({
      _id: req.params.id,
      nombre: "Usuario",
    });

    await EliminarUsuarios(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: "Usuario eliminado" });
  });
});
