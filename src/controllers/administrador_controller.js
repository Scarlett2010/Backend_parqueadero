import Administrador from "../models/administrador.js";
import guardias from "../models/guardias.js";
import Usuario from "../models/usuarios.js";
import mongoose from "mongoose";
import generarJWT from "../helpers/crearJWT.js";
import {
  RestablecimientoContraseñaAdmin,
  CorreoCredencialesG,
  CorreoCredencialesU,
} from "../config/nodemailer.js";

// Registrar administrador
const registroAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!req.body || Object.values(req.body).includes("")) {
    return res.status(400).json({
      msg: "Lo sentimos debe llenar todos los campos",
    });
  }
  const adminBDD = await Administrador.findOne({ email });
  if (adminBDD)
    return res.status(404).json({
      msg: "Lo siento el usuario ya se encuentra registrado",
    });
  const nuevoAdmin = new Administrador(req.body);
  nuevoAdmin.password = await nuevoAdmin.encrypPassword(password);
  await nuevoAdmin.save();
  res.status(200).json({ msg: "Administrador registrado" });
};

// Login administrador
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes(""))
    return res.status(400).json({
      msg: "Lo sentimos debe llenar todos los campos",
    });
  const adminBDD = await Administrador.findOne({ email }).select(
    "-status -createdAt -updatedAt -__v -token"
  );
  if (!adminBDD)
    return res.status(404).json({
      msg: "Lo siento el usuario no se encuentra registrado",
    });
  const confirmarPasword = await adminBDD.matchPassword(password);
  if (!confirmarPasword)
    return res.status(404).json({
      msg: "Lo sentimos la contraseña es incorrecta",
    });
  const token = generarJWT(adminBDD._id, "administrador");
  const { nombre, apellido, telefono, _id } = adminBDD;
  res.status(200).json({
    _id,
    token,
    nombre,
    apellido,
    telefono,
    email: adminBDD.email,
  });
};

// Recuperar contraseña
const recuperarContraseña = async (req, res) => {
  const { email } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const adminBDD = await Administrador.findOne({ email });
  if (!adminBDD)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  const token = adminBDD.Tokencrear();
  adminBDD.token = token;
  await RestablecimientoContraseñaAdmin(email, token);
  await adminBDD.save();
  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
};

// Comprobar token contraseña
const comprobarTokenContraseña = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      msg: "Lo siento, no se puede validar la cuenta del administrador",
    });
  }
  const adminBDD = await Administrador.findOne({ token });
  if (!adminBDD) {
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se encuentra el administrador" });
  }
  if (adminBDD.token !== token) {
    return res.status(400).json({ msg: "Lo sentimos, el token no es válido" });
  }
  res
    .status(200)
    .json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
};

// Actualizar contraseña
const nuevaContraseña = async (req, res) => {
  const { password, confirmarPassword } = req.body;

  if (Object.values(req.body).includes(""))
    return res.status(404).json({
      msg: "Lo sentimos, debe llenar todos los campos",
    });
  if (password !== confirmarPassword)
    return res.status(404).json({
      msg: "Lo sentimos, las contraseñas no coinciden",
    });
  const adminBDD = await Administrador.findOne({ token: req.params.token });

  if (adminBDD.token !== req.params.token)
    return res.status(404).json({
      msg: "Lo sentimos no hemos podido verificar su cuenta",
    });
  adminBDD.token = null;
  adminBDD.password = await adminBDD.encrypPassword(password);
  await adminBDD.save();

  res.status(200).json({ msg: "Contraseña actualizada con exito" });
};

// Registrar guardias
const registroGuardias = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes("")) {
    return res.status(404).json({
      msg: "Lo sentimos debe llenar todos los campos",
    });
  }
  const guardia = await guardias.findOne({ email });
  if (guardia) {
    return res.status(404).json({
      msg: "Lo sentimos pero ese guardia ya se encuentra registrado",
    });
  }
  try {
    const nuevoGuardia = new guardias(req.body);
    nuevoGuardia.password = await nuevoGuardia.encrypPassword(password);
    await nuevoGuardia.save();
    await CorreoCredencialesG(email, password);
    res.status(200).json({ msg: "Guardia registrado y correo enviado" });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error al registrar el guardia" });
  }
};

// Listar guardias
const ListarGuardias = async (req, res) => {
  const guardia = await guardias.find();
  res.status(200).json(guardia);
};

// Actualizar perfil de guardia
const actualizarPerfilGuardia = async (req, res) => {
  const { id } = req.params;
  const camposPermitidos = [
    "nombre",
    "apellido",
    "cedula",
    "email",
    "telefono",
  ];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: "Guardia no registrado." });
  }

  const datosActualizados = Object.keys(req.body)
    .filter((key) => camposPermitidos.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: req.body[key] }), {});

  if (!Object.keys(datosActualizados).length) {
    return res.status(400).json({ msg: "No se enviaron campos válidos." });
  }

  try {
    const guardiaActualizado = await guardias.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true }
    );
    if (!guardiaActualizado) {
      return res.status(404).json({ msg: "Guardia no encontrado." });
    }
    res.status(200).json({
      msg: "Perfil del guardia actualizado con éxito.",
      guardia: guardiaActualizado,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el perfil del guardia." });
  }
};

// Cambiar estado de guardia
const cambiarEstadoGuardia = async (req, res) => {
  try {
    const estado = JSON.parse(req.body.estado);
    await guardias.findByIdAndUpdate(req.params.id, {
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

// Eliminar guardias
const EliminarGuardias = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: "ID de usuario no válido" });
  const guardia = await guardias.findByIdAndDelete(id);
  if (!guardia) return res.status(404).json({ msg: "Guardia no encontrado" });
  res.status(200).json({ msg: "Guardia eliminado" });
};

// Registrar usuarios
// Registrar usuarios
const registroUsuarios = async (req, res) => {
  const { email, password, rol } = req.body;

  if (Object.values(req.body).includes("")) {
    return res.status(400).json({
      msg: "Lo sentimos, debe llenar todos los campos",
    });
  }

  if (rol !== "Administrativo" && rol !== "Docente") {
    return res.status(400).json({
      msg: "El rol debe ser Administrativo o Docente",
    });
  }

  // Check if the user already exists
  const usuarioInformacion = await Usuario.findOne({ email });
  if (usuarioInformacion) {
    return res.status(409).json({
      msg: "Lo sentimos, pero el usuario ya se encuentra registrado",
    });
  }

  try {
    const nuevoUsuario = new Usuario(req.body);
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password);
    await nuevoUsuario.save();
    await CorreoCredencialesU(email, password);
    res.status(201).json({ msg: "Usuario registrado y correo enviado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al registrar el usuario" });
  }
};

// Listar usuarios
const ListarUsuarios = async (req, res) => {
  const usuario = await Usuario.find();
  res.status(200).json(usuario);
};

// Eliminar usuarios
const EliminarUsuarios = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: "ID de usuario no válido" });
  const usuarioInformacion = await Usuario.findByIdAndDelete(id);
  if (!usuarioInformacion)
    return res.status(404).json({ msg: "Usuario no encontrado" });
  res.status(200).json({ msg: "Usuario eliminado" });
};

export {
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
};
