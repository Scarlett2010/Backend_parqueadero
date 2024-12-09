import parqueadero from "../models/parqueaderos.js";
import Parqueaderos from "../models/parqueaderos.js";
import mongoose from "mongoose";

const registrarParqueadero = async (req, res) => {
  try {
    const parqueadero = new Parqueaderos(req.body);
    await parqueadero.save();
    res.status(200).json({ msg: "Parqueadero registrado" });
  } catch (error) {
    res.status(500).json({
      msg: "Error al registrar el parqueadero",
      error: error.message,
    });
  }
};

const listarParqueaderos = async (req, res) => {
  const parqueaderos = await Parqueaderos.find({ estado: true });
  res.status(200).json(parqueaderos);
};
const cambiarEstadoParqueadero = async (req, res) => {
  try {
    const { estado } = req.body;
    if (typeof estado !== "boolean") {
      return res.status(400).json({ msg: "El estado debe ser true o false" });
    }
    await parqueadero.findByIdAndUpdate(req.params.id, { estado: estado });
    res.status(200).json({
      msg: `Estado del parqueadero modificado exitosamente a ${estado}`,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error al modificar el estado del parqueadero",
      error: error.message,
    });
  }
};
const detalleParqueadero = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(400)
      .json({ msg: "El id que acaba de ingresar no existe" });
  const parqueadero = await Parqueaderos.findById(id);
  res.status(200).json(parqueadero);
};

// const listarDisponibilidadParqueaderos = async (req, res) => {
//   const parqueaderosDisponibles = await Parqueaderos.find({
//     disponibilidad: true,
//   });
//   if (!parqueaderosDisponibles)
//     return res.status(203).json({
//       msg: "Lo sentimos, por el momento no hay parqueaderos disponibles",
//     });
//   res.status(200).json(parqueaderosDisponibles);
// };

const actualizarParqueadero = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, bloque, espacios, ...restOfBody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: "El id que acaba de ingresar no existe",
    });
  }
  if (Object.values(restOfBody).includes("")) {
    return res.status(400).json({
      msg: "Lo sentimos, debe llenar todos los campos",
    });
  }
  try {
    const parqueadero = await Parqueaderos.findById(id);
    if (!parqueadero) {
      return res.status(404).json({
        msg: "Parqueadero no encontrado",
      });
    }
    if (espacios !== undefined) {
      const espaciosToAdd = parseInt(espacios, 10);

      if (isNaN(espacios)) {
        return res.status(400).json({
          msg: "El valor de espacios debe ser un número válido",
        });
      }
      parqueadero.espacios = espacios;
    }
    Object.assign(parqueadero, restOfBody);
    await parqueadero.save();
    res
      .status(200)
      .json({ msg: "Parqueadero actualizado con éxito", parqueadero });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar el parqueadero" });
  }
};

//eliminar parqueadero
const EliminarParqueadero = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: "ID de usuario no válido" });
  const parqueadero = await parqueadero.findByIdAndDelete(id);
  if (!parqueadero) return res.status(404).json({ msg: "Usuario no encontrado" });
  res.status(200).json({ msg: "Usuario eliminado" });
};


export {
  registrarParqueadero,
  listarParqueaderos,
  cambiarEstadoParqueadero,
  detalleParqueadero,
  //listarDisponibilidadParqueaderos,
  actualizarParqueadero,
  EliminarParqueadero
};
