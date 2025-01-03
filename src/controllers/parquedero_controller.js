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
  try {
    const parqueaderos = await Parqueaderos.find();
    const parqueaderosSinCamposExtras = parqueaderos.map((parqueadero) => {
      const { createdAt, updatedAt, __v, ...rest } = parqueadero.toObject();
      return {
        _id: rest._id,
        nombre: rest.nombre,
        description: rest.description,
        planta: rest.planta,
        bloque: rest.bloque,
        espacios: rest.espacios,
        estado: rest.estado,
      };
    });
    res.status(200).json(parqueaderosSinCamposExtras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al listar los parqueaderos." });
  }
};

const actualizarParqueadero = async (req, res) => {
  const { id } = req.params;
  if (Object.values(req.body).includes(""))
    return res.status(404).json({
      msg: "Lo sentimos debe llenar todos los campos",
    });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({
      msg: "Lo sentimos pero ese guardia no se encuentra registrado",
    });

  const espacioActualizado = await Parqueaderos.findByIdAndUpdate(id, req.body);
  await espacioActualizado.save();

  res.status(200).json({ msg: "Perfil guardia actualizado" });
};

//eliminar parqueadero
const EliminarParqueadero = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: "ID de espacio no válido" });
  const parqueadero = await Parqueaderos.findByIdAndDelete(id);
  if (!parqueadero)
    return res.status(404).json({ msg: "Espacio no encontrado" });
  res.status(200).json({ msg: "Espacio eliminado" });
};

export {
  registrarParqueadero,
  listarParqueaderos,
  actualizarParqueadero,
  EliminarParqueadero,
};
