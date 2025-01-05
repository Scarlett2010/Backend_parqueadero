import { enviarRestablecimientoContraseña } from "../config/nodemailer.js";
import Usuarios from "../models/usuarios.js";
import mongoose from "mongoose";
import generarJWT from "../helpers/crearJWT.js";

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }
  try {
    const usuarioInformacion = await Usuarios.findOne({ email });
    if (!usuarioInformacion) {
      return res
        .status(404)
        .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    }
    if (!usuarioInformacion.estado) {
      return res.status(403).json({
        msg: "Acceso denegado. Su cuenta está desactivada, contacte al administrador.",
      });
    }
    const verificarPassword = await usuarioInformacion.matchPassword(password);
    if (!verificarPassword) {
      return res
        .status(401)
        .json({ msg: "Lo sentimos, el password no es el correcto" });
    }
    const token = generarJWT(usuarioInformacion._id, "usuario");
    const { nombre, apellido, telefono, _id, estado } = usuarioInformacion;
    res.status(200).json({
      nombre,
      apellido,
      telefono,
      token,
      _id,
      email: usuarioInformacion.email,
      estado,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error al intentar iniciar sesión.",
    });
  }
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

  const usuario = await Usuarios.findById(req.usuario._id);
  if (!usuario)
    return res.status(404).json({
      msg: `Lo sentimos, no existe el guardia ${id}`,
    });

  const verificarContraseña = await usuario.matchPassword(actualPassword);
  if (!verificarContraseña)
    return res.status(404).json({
      msg: "Lo sentimos, la contraseña actual no es correcta",
    });

  usuario.password = await usuario.encrypPassword(nuevoPassword);
  await usuario.save();
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

  const usuario = await Usuarios.findByIdAndUpdate(
    id,
    { telefono: req.body.telefono },
    {
      new: true,
      runValidators: true,
    }
  );

  await usuario.save();

  res.status(200).json({ msg: "Perfil actualizado" });
};

export {
  loginUsuario,
  perfilUsuario,
  recuperarContraseña,
  nuevaContraseña,
  actualizarContraseña,
  actualizarPerfil,
  comprobarTokenContraseña,
};
