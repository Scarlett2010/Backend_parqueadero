import {
  registrarParqueadero,
  listarParqueaderos,
  actualizarParqueadero,
  EliminarParqueadero,
} from "../src/controllers/parquedero_controller.js";

import Parqueaderos from "../src/models/parqueaderos.js";
import mongoose from "mongoose";

// Mock del modelo Parqueaderos
jest.mock("../src/models/parqueaderos.js");

describe("Pruebas Unitarias - Controlador de Parqueaderos", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Registro de Parqueadero", () => {
    test("Registrar parqueadero exitosamente", async () => {
      req.body = {
        nombre: "Parqueadero A",
        description: "Parqueadero Principal",
        planta: "1",
        bloque: "B",
        espacios: [
          { numeroEspacio: "A1", estado: true },
          { numeroEspacio: "A2", estado: true },
          { numeroEspacio: "A3", estado: true },
        ],
        estado: true,
      };

      const mockParqueadero = {
        ...req.body,
        save: jest.fn().mockResolvedValue(true),
      };

      Parqueaderos.prototype.save = mockParqueadero.save;

      await registrarParqueadero(req, res);

      expect(mockParqueadero.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "Parqueadero registrado" });
    });

    test("Error al registrar parqueadero", async () => {
      req.body = {
        nombre: "Parqueadero Error",
      };

      const mockError = new Error("Error de validación");
      Parqueaderos.prototype.save = jest.fn().mockRejectedValue(mockError);

      await registrarParqueadero(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Error al registrar el parqueadero",
        error: "Error de validación",
      });
    });
  });

  describe("Listar Parqueaderos", () => {
    test("Listar parqueaderos exitosamente", async () => {
      const mockParqueaderos = [
        {
          _id: new mongoose.Types.ObjectId(),
          nombre: "Parqueadero 1",
          description: "Descripción 1",
          planta: "1",
          bloque: "A",
          espacios: [
            { numeroEspacio: "A1", estado: true },
            { numeroEspacio: "A2", estado: false },
          ],
          estado: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
          toObject: function () {
            return {
              _id: this._id,
              nombre: this.nombre,
              description: this.description,
              planta: this.planta,
              bloque: this.bloque,
              espacios: this.espacios,
              estado: this.estado,
              createdAt: this.createdAt,
              updatedAt: this.updatedAt,
              __v: this.__v,
            };
          },
        },
      ];

      Parqueaderos.find.mockResolvedValue(mockParqueaderos);

      await listarParqueaderos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          _id: expect.any(mongoose.Types.ObjectId),
          nombre: "Parqueadero 1",
          description: "Descripción 1",
          planta: "1",
          bloque: "A",
          espacios: [
            { numeroEspacio: "A1", estado: true },
            { numeroEspacio: "A2", estado: false },
          ],
          estado: true,
        },
      ]);
    });

    test("Error al listar parqueaderos", async () => {
      const mockError = new Error("Error en la base de datos");
      Parqueaderos.find.mockRejectedValue(mockError);

      await listarParqueaderos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Error al listar los parqueaderos.",
      });
    });
  });

  describe("Actualizar Parqueadero", () => {
    test("Actualizar parqueadero exitosamente", async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };
      req.body = {
        nombre: "Parqueadero Actualizado",
        description: "Nueva descripción",
        planta: "2",
        bloque: "C",
        espacios: [
          { numeroEspacio: "C1", estado: true },
          { numeroEspacio: "C2", estado: false },
        ],
        estado: true,
      };

      const mockParqueaderoActualizado = {
        ...req.body,
        save: jest.fn().mockResolvedValue(true),
      };

      Parqueaderos.findByIdAndUpdate.mockResolvedValue(
        mockParqueaderoActualizado
      );

      await actualizarParqueadero(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Perfil guardia actualizado",
      });
    });

    test("Error al actualizar - campos vacíos", async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };
      req.body = {
        nombre: "",
        description: "Nueva descripción",
      };

      await actualizarParqueadero(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos debe llenar todos los campos",
      });
    });

    test("Error al actualizar - ID inválido", async () => {
      req.params = { id: "id-invalido" };
      req.body = {
        nombre: "Parqueadero Test",
      };

      await actualizarParqueadero(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Lo sentimos pero ese guardia no se encuentra registrado",
      });
    });
  });

  describe("Eliminar Parqueadero", () => {
    test("Eliminar parqueadero exitosamente", async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };

      Parqueaderos.findByIdAndDelete.mockResolvedValue({
        _id: req.params.id,
        nombre: "Parqueadero Eliminado",
      });

      await EliminarParqueadero(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "Espacio eliminado" });
    });

    test("Error al eliminar - ID inválido", async () => {
      req.params = { id: "id-invalido" };

      await EliminarParqueadero(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "ID de espacio no válido" });
    });

    test("Error al eliminar - Parqueadero no encontrado", async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };

      Parqueaderos.findByIdAndDelete.mockResolvedValue(null);

      await EliminarParqueadero(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Espacio no encontrado" });
    });
  });
});
