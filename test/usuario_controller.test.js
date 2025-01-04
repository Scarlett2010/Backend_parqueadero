import {
  loginUsuario,
  perfilUsuario,
  recuperarContraseña,
  nuevaContraseña,
  actualizarContraseña,
  actualizarPerfil,
  comprobarTokenContraseña,
} from "../src/controllers/usuario_controller.js";
import Usuarios from "../src/models/usuarios.js";
import mongoose from "mongoose";

// Mocks
jest.mock("../src/models/usuarios.js");
jest.mock("../src/helpers/crearJWT.js", () => () => "mock-token");
jest.mock("../src/config/nodemailer.js", () => ({
  enviarRestablecimientoContraseña: jest.fn().mockResolvedValue(true),
}));

describe("Pruebas Unitarias - Usuario Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      usuario: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("Login usuario exitoso", async () => {
    req.body = {
      email: "usuario@test.com",
      password: "password123",
    };

    const mockUsuario = {
      _id: "mockid123",
      email: "usuario@test.com",
      nombre: "Usuario",
      apellido: "Test",
      telefono: "123456789",
      matchPassword: jest.fn().mockResolvedValue(true),
    };

    Usuarios.findOne.mockResolvedValue(mockUsuario);

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: mockUsuario._id,
      token: "mock-token",
      nombre: mockUsuario.nombre,
      apellido: mockUsuario.apellido,
      telefono: mockUsuario.telefono,
      email: mockUsuario.email,
    });
  });

  test("Login usuario - campos vacíos", async () => {
    req.body = {
      email: "",
      password: "",
    };

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Lo sentimos, debes llenar todos los campos",
    });
  });

  test("Login usuario - usuario no encontrado", async () => {
    req.body = {
      email: "noexiste@test.com",
      password: "password123",
    };

    Usuarios.findOne.mockResolvedValue(null);

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Lo sentimos, el usuario no se encuentra registrado",
    });
  });

  test("Login usuario - contraseña incorrecta", async () => {
    req.body = {
      email: "usuario@test.com",
      password: "wrongpassword",
    };

    const mockUsuario = {
      email: "usuario@test.com",
      matchPassword: jest.fn().mockResolvedValue(false),
    };

    Usuarios.findOne.mockResolvedValue(mockUsuario);

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Lo sentimos, el password no es el correcto",
    });
  });

  test("Recuperar contraseña exitosamente", async () => {
    req.body = { email: "usuario@test.com" };

    const mockUsuario = {
      email: "usuario@test.com",
      crearToken: jest.fn().mockReturnValue("mock-token"),
      save: jest.fn().mockResolvedValue(true),
    };

    Usuarios.findOne.mockResolvedValue(mockUsuario);

    await recuperarContraseña(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Revisa tu correo electrónico para reestablecer tu cuenta",
    });
  });

  test("Comprobar token de contraseña exitosamente", async () => {
    req.params = { token: "valid-token" };

    const mockUsuario = {
      token: "valid-token",
      save: jest.fn().mockResolvedValue(true),
    };

    Usuarios.findOne.mockResolvedValue(mockUsuario);

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

    const mockUsuario = {
      token: "valid-token",
      encrypPassword: jest.fn().mockResolvedValue("hashed-password"),
      save: jest.fn().mockResolvedValue(true),
    };

    Usuarios.findOne.mockResolvedValue(mockUsuario);

    await nuevaContraseña(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Contraseña actualizada con exito",
    });
  });

  test("Perfil usuario exitoso", async () => {
    req.usuario = {
      _id: "mockid123",
      nombre: "Usuario",
      apellido: "Test",
      email: "usuario@test.com",
      telefono: "123456789",
      token: "should-be-deleted",
      createdAt: "should-be-deleted",
      updatedAt: "should-be-deleted",
      __v: "should-be-deleted",
    };

    await perfilUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: "mockid123",
      nombre: "Usuario",
      apellido: "Test",
      email: "usuario@test.com",
      telefono: "123456789",
    });
  });

  test("Actualizar contraseña exitosamente", async () => {
    req.body = {
      actualPassword: "oldPassword123",
      nuevoPassword: "newPassword123",
    };
    req.usuario = { _id: "mockid123" };

    const mockUsuario = {
      _id: "mockid123",
      matchPassword: jest.fn().mockResolvedValue(true),
      encrypPassword: jest.fn().mockResolvedValue("hashed-password"),
      save: jest.fn().mockResolvedValue(true),
    };

    Usuarios.findById.mockResolvedValue(mockUsuario);

    await actualizarContraseña(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Contraseña actualizada con exito",
    });
  });

  test("Actualizar perfil exitosamente", async () => {
    req.params = { id: new mongoose.Types.ObjectId().toString() };
    req.body = { telefono: "987654321" };

    const mockUsuario = {
      save: jest.fn().mockResolvedValue(true),
    };

    Usuarios.findByIdAndUpdate.mockResolvedValue(mockUsuario);

    await actualizarPerfil(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Perfil actualizado",
    });
  });
});
