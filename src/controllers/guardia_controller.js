import {
  RestablecimientoContraseñaGuardia,
  CorreoCredencialesU,
} from "../config/nodemailer.js";
import generarJWT from "../helpers/crearJWT.js";
import Guardias from "../models/guardias.js";
import Usuario from "../models/usuarios.js";
import Parqueaderos from "../models/parqueaderos.js";
import mongoose from "mongoose";
import usuarios from "../models/usuarios.js";
import parqueadero from "../models/parqueaderos.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes(""))
    return res.status(404).json({
      msg: "Lo sentimos debe llenar todos los campos",
    });
  const guardiaInfo = await Guardias.findOne({ email });
  if (!guardiaInfo)
    return res.status(404).json({
      msg: "Lo sentimos ese email no se encuentra registrado",
    });
  if (guardiaInfo.status === false) {
    return res.status(403).json({
      msg: "Acceso denegado",
    });
  }
  const confirmarPass = await guardiaInfo.matchPassword(password);
  if (!confirmarPass)
    return res.status(404).json({
      msg: "Lo sentimos contraseña incorrecta ",
    });
  const token = generarJWT(guardiaInfo._id, "guardia");
  const { nombre, apellido, telefono, _id } = guardiaInfo;

  await guardiaInfo.save();
  res.status(200).json({
    _id,
    token,
    nombre,
    apellido,
    telefono,
    email: guardiaInfo.email,
    rol: "guardia",
    status: guardiaInfo.status,
  });
};

const recuperarContraseña = async (req, res) => {
  const { email } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const guardia = await Guardias.findOne({ email });
  if (!guardia)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el guardia no se encuentra registrado" });
  const token = guardia.createToken();
  guardia.token = token;
  await RestablecimientoContraseñaGuardia(email, token);
  await guardia.save();
  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
};

const comprobarTokenContraseña = async (req, res) => {
  if (!req.params.token)
    return res
      .status(400)
      .json({ msg: "Lo siento no se pueda validar la cuenta" });
  const guardia = await Guardias.findOne({ token: req.params.token });
  if (guardia?.token !== req.params.token)
    return res.status(400).json({
      msg: "Lo sentimos no se pueda validar la cuenta",
    });
  await guardia.save();
  res
    .status(200)
    .json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
};

const nuevaContraseñaG = async (req, res) => {
  const { password, confirmarPassword } = req.body;
  if (Object.values(req.body).includes(""))
    return res.status(404).json({
      msg: "Lo sentimos, debe llenar todos los campos",
    });
  if (password !== confirmarPassword)
    return res.status(404).json({
      msg: "Lo sentimos, las contraseñas no coinciden",
    });
  const guardia = await Guardias.findOne({ token: req.params.token });
  if (guardia.token !== req.params.token)
    return res.status(404).json({
      msg: "Lo sentimos no hemos podido verificar su cuenta",
    });
  guardia.token = null;
  guardia.password = await guardia.encrypPassword(password);
  await guardia.save();

  res.status(200).json({ msg: "Contraseña actualizada con exito" });
};

const perfil = (req, res) => {
  delete req.guardia.token;
  delete req.guardia.createdAt;
  delete req.guardia.updatedAt;
  delete req.guardia.__v;
  res.status(200).json(req.guardia);
};

const actualizarContraseñaG = async (req, res) => {
  const { actualPassword, nuevoPassword } = req.body;
  if (Object.values(req.body).includes(""))
    return res.status(404).json({
      msg: "Lo sentimos, debe llenar todos los campos",
    });

  if (!actualPassword || !nuevoPassword) {
    return res.status(400).json({
      msg: "La contraseña actual y la nueva contraseña son necesarias",
    });
  }

  const guardia = await Guardias.findById(req.guardia._id);
  if (!guardia)
    return res.status(404).json({
      msg: `Lo sentimos, no existe el guardia ${id}`,
    });

  const verificarContraseña = await guardia.matchPassword(actualPassword);
  if (!verificarContraseña)
    return res.status(404).json({
      msg: "Lo sentimos, la contraseña actual no es correcta",
    });

  guardia.password = await guardia.encrypPassword(nuevoPassword);
  await guardia.save();
  res.status(200).json({ msg: "Contraseña actualizada con exito" });
};

const actualizarPerfil = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({
      msg: "El id que acaba de ingresar no existe",
    });

  if (Object.values(req.body).includes(""))
    return res.status(400).json({
      msg: "Lo sentimos, debes llenar todos los campos",
    });

  const guardia = await Guardias.findByIdAndUpdate(
    id,
    { telefono: req.body.telefono },
    {
      new: true,
      runValidators: true,
    }
  );

  await guardia.save();
  res.status(200).json({ msg: "Perfil actualizado" });
};

const registroUsuarios = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes("")) {
    return res.status(404).json({
      msg: "Lo sentimos debe llenar todos los campos",
    });
  }
  const usuarioInformacion = await Usuario.findOne({ email });
  if (usuarioInformacion) {
    return res.status(404).json({
      msg: "Lo sentimos pero el usuario ya se encuentra registrado",
    });
  }
  try {
    const nuevoUsuario = new Usuario(req.body);
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password);
    await nuevoUsuario.save();
    await CorreoCredencialesU(email, password);
    res.status(200).json({ msg: "Usuario registrado y correo enviado" });
  } catch (error) {
    console.error("Error en el registro del usuario:", error);
    res.status(500).json({ msg: "Hubo un error al registrar el usuario" });
  }
};

const ListarUsuarios = async (req, res) => {
  const usuario = await Usuario.find();
  res.status(200).json(usuario);
};

const cambiarEstadoUsuario = async (req, res) => {
  try {
    const estado = JSON.parse(req.body.estado);
    await usuarios.findByIdAndUpdate(req.params.id, {
      estado: estado,
    });
    res.status(200).json({ msg: "Estado modificado exitosamente" });
  } catch (error) {
    res.status(500).json({
      msg: "Error al modificar el estado del usuario",
      error: error.message,
    });
  }
};

const actualizarUsuarios = async (req, res) => {
  const { id } = req.params;
  if (Object.values(req.body).includes(""))
    return res.status(404).json({
      msg: "Lo sentimos debe llenar todos los campos",
    });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({
      msg: "Lo sentimos pero ese guardia no se encuentra registrado",
    });

  const usuarioActualizado = await Usuario.findByIdAndUpdate(id, req.body);
  await usuarioActualizado.save();

  res.status(200).json({ msg: "Perfil actualizado" });
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

const cambiarEstadoEspacio = async (req, res) => {
  try {
    const { estado, numeroEspacio } = req.body; // Recibimos el estado y el numeroEspacio
    if (typeof estado !== "boolean") {
      return res.status(400).json({ msg: "El estado debe ser true o false" });
    }

    // Buscar el parqueadero por su ID
    const parqueadero = await Parqueaderos.findById(req.params.id);

    if (!parqueadero) {
      return res.status(404).json({ msg: "Parqueadero no encontrado" });
    }

    // Buscar el espacio por numeroEspacio
    const espacio = parqueadero.espacios.find(
      (e) => e.numeroEspacio === numeroEspacio
    );

    if (!espacio) {
      return res.status(404).json({ msg: "Espacio no encontrado" });
    }

    // Cambiar el estado del espacio
    espacio.estado = estado;

    // Guardar los cambios en el parqueadero
    await parqueadero.save();

    res.status(200).json({
      msg: `Estado del espacio modificado exitosamente a ${estado}`,
      data: espacio,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error al modificar el estado del espacio",
      error: error.message,
    });
  }
};

export {
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
};
