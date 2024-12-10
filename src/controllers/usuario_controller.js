import { enviarRestablecimientoContraseña } from "../config/nodemailer.js";
import Usuarios from "../models/usuarios.js";
import mongoose from "mongoose";
import generarJWT from "../helpers/crearJWT.js";
import Parqueaderos from "../models/parqueaderos.js";

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  // Validación de campos vacíos
  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }
  const usuarioInformacion = await Usuarios.findOne({ email });
  // Verificar si el usuario existe
  if (!usuarioInformacion) {
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  }

  const verificarPassword = await usuarioInformacion.matchPassword(password);

  // Verificar contraseña
  if (!verificarPassword) {
    return res
      .status(401)
      .json({ msg: "Lo sentimos, el password no es el correcto" });
  }

  const token = generarJWT(usuarioInformacion._id, "usuario");
  const { nombre, apellido, telefono, _id } = usuarioInformacion;

  res.status(200).json({
    nombre,
    apellido,
    telefono,
    token,
    _id,
    email: usuarioInformacion.email,
  });
};

const recuperarContraseña = async (req, res) => {
  const { email } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const usuario = await Usuarios.findOne({ email });
  if (!usuario)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  const token = usuario.crearToken();
  usuario.token = token;
  await enviarRestablecimientoContraseña(email, token);
  await usuario.save();
  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
};

const comprobarTokenContraseña = async (req, res) => {
  if (!req.params.token)
    return res
      .status(400)
      .json({ msg: "Lo siento no se pueda validar la cuenta" });
  const usuario = await Usuarios.findOne({ token: req.params.token });
  if (usuario?.token !== req.params.token)
    return res.status(400).json({
      msg: "Lo sentimos no se pueda validar la cuenta",
    });
  await usuario.save();
  res
    .status(200)
    .json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
};

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
  const usuario = await Usuarios.findOne({ token: req.params.token });
  if (usuario.token !== req.params.token)
    return res.status(404).json({
      msg: "Lo sentimos no hemos podido verificar su cuenta",
    });
  usuario.token = null;
  usuario.password = await usuario.encrypPassword(password);
  await usuario.save();

  res.status(200).json({ msg: "Contraseña actualizada con exito" });
};

const perfilUsuario = (req, res) => {
  delete req.usuario.token;
  delete req.usuario.createdAt;
  delete req.usuario.updatedAt;
  delete req.usuario.__v;
  res.status(200).json(req.usuario);
};

const actualizarContraseña = async (req, res) => {
  if (Object.values(req.body).includes(""))
    return res.status(404).json({
      msg: "Lo sentimos debe llenar todos los campos",
    });
  const usuario = await Usuarios.findById(req.usuario._id);
  if (!usuario)
    return res.status(404).json({
      msg: `Lo sentimos, no existe el usuario ${id}`,
    });
  const verificarContraseña = await usuario.matchPassword(
    req.body.actualPassword
  );
  if (!verificarContraseña)
    return res.status(404).json({
      msg: "Lo sentimos, la contraseña actual no es correcta",
    });
  usuario.password = await usuario.encrypPassword(req.body.nuevoPassword);
  await usuario.save();
  res.status(200).json({ msg: "Contraseña actualizada con exito" });
};

const actualizarPerfil = async (req, res) => {
  const { id } = req.params;

  // Verifica si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({
      msg: "El id que acaba de ingresar no existe",
    });

  // Verifica si todos los campos necesarios están llenos
  if (Object.values(req.body).includes(""))
    return res.status(400).json({
      msg: "Lo sentimos, debes llenar todos los campos",
    });

  // Actualiza solo el número de teléfono del usuario
  const usuario = await Usuarios.findByIdAndUpdate(
    id,
    { telefono: req.body.telefono },
    {
      new: true,
      runValidators: true,
    }
  );

  // Guarda los cambios
  await usuario.save();

  // Envía una respuesta de éxito
  res.status(200).json({ msg: "Perfil actualizado" });
};

const verParqueaderosDisponibles = async (req, res) => {
  const parqueaderos = await Parqueaderos.find({ estado: true });
  if (!parqueaderos)
    return res.status(203).json({
      msg: "Lo sentimos, por el momento no hay parqueaderos disponibles",
    });
  res.status(200).json(parqueaderos);
};

export {
  loginUsuario,
  perfilUsuario,
  recuperarContraseña,
  nuevaContraseña,
  actualizarContraseña,
  actualizarPerfil,
  comprobarTokenContraseña,
  verParqueaderosDisponibles,
};