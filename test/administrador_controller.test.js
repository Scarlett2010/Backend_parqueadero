import mongoose from "mongoose";
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
} from "../src/controllers/administrador_controller.js";

import Administrador from "../src/models/administrador.js";
import guardias from "../src/models/guardias.js";
import parqueaderos from "../src/models/parqueaderos.js";
import Usuario from "../src/models/usuarios.js";
import generarJWT from "../src/helpers/crearJWT.js";
import { RestablecimientoContraseñaAdmin } from "../src/config/nodemailer.js";

jest.mock("../src/models/administrador.js");
jest.mock("../src/models/guardias.js");
jest.mock("../src/models/parqueaderos.js");
jest.mock("../src/models/usuarios.js");
jest.mock("../src/helpers/crearJWT.js");
jest.mock("../src/config/nodemailer.js");

describe("Pruebas Unitarias - Administrador y Gestión de Usuarios", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  test("Registrar un administrador exitosamente", async () => {
    req.body = { email: "admin@test.com", password: "password123" };
    Administrador.findOne.mockResolvedValue(null);
    const saveMock = jest.fn();
    Administrador.mockImplementation(() => ({
      save: saveMock,
      encrypPassword: jest.fn().mockResolvedValue("hashedPassword"),
    }));

    await registroAdmin(req, res);

    expect(Administrador.findOne).toHaveBeenCalledWith({
      email: "admin@test.com",
    });
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: "Administrador registrado" });
  });

  test("Login administrador exitoso", async () => {
    req.body = { email: "admin@test.com", password: "password123" };
    const adminMock = {
      matchPassword: jest.fn().mockResolvedValue(true),
      _id: "adminId",
      email: "admin@test.com",
    };
    Administrador.findOne.mockResolvedValue(adminMock);
    generarJWT.mockReturnValue("testToken");

    await loginAdmin(req, res);

    expect(Administrador.findOne).toHaveBeenCalledWith({
      email: "admin@test.com",
    });
    expect(adminMock.matchPassword).toHaveBeenCalledWith("password123");
    expect(generarJWT).toHaveBeenCalledWith("adminId", "administrador");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: "testToken", email: "admin@test.com" })
    );
  });

  test("Recuperar contraseña - envía correo exitosamente", async () => {
    req.body = { email: "admin@test.com" };
    const tokenMock = "token123";
    const adminMock = {
      Tokencrear: jest.fn().mockReturnValue(tokenMock),
      save: jest.fn(),
    };
    Administrador.findOne.mockResolvedValue(adminMock);
    RestablecimientoContraseñaAdmin.mockResolvedValue(true);

    await recuperarContraseña(req, res);

    expect(Administrador.findOne).toHaveBeenCalledWith({
      email: "admin@test.com",
    });
    expect(adminMock.Tokencrear).toHaveBeenCalled();
    expect(adminMock.save).toHaveBeenCalled();
    expect(RestablecimientoContraseñaAdmin).toHaveBeenCalledWith(
      "admin@test.com",
      tokenMock
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        msg: "Revisa tu correo electrónico para reestablecer tu cuenta",
      })
    );
  });

  test("Registrar un guardia exitosamente", async () => {
    req.body = { email: "guard@test.com", password: "password123" };
    guardias.findOne.mockResolvedValue(null);
    const saveMock = jest.fn();
    guardias.mockImplementation(() => ({
      save: saveMock,
      encrypPassword: jest.fn().mockResolvedValue("hashedPassword"),
    }));

    await registroGuardias(req, res);

    expect(guardias.findOne).toHaveBeenCalledWith({ email: "guard@test.com" });
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: "Guardia registrado" });
  });

  test("Listar guardias exitosamente", async () => {
    const mockGuardias = [
      { email: "guard1@test.com" },
      { email: "guard2@test.com" },
    ];
    guardias.find.mockResolvedValue(mockGuardias);

    await ListarGuardias(req, res);

    expect(guardias.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockGuardias);
  });

  test("Eliminar un usuario exitosamente", async () => {
    req.params.id = new mongoose.Types.ObjectId().toString();
    Usuario.findByIdAndDelete.mockResolvedValue({ id: req.params.id });

    await EliminarUsuarios(req, res);

    expect(Usuario.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: "Usuario eliminado" });
  });
});
