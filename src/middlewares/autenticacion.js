import jwt from "jsonwebtoken";
import Usuarios from "../models/usuarios.js";
import Administrador from "../models/administrador.js";
import Guardias from "../models/guardias.js";

const autenticacion = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res.status(404).json({
      msg: "Lo sentimos primero debe proporcionar un token",
    });

  const { authorization } = req.headers;

  try {
    const { id, rol } = jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    if (rol === "usuario") {
      req.usuario = await Usuarios.findById(id).lean().select("-password");
      next();
    } else if (rol === "guardia") {
      req.guardia = await Guardias.findById(id).lean().select("-password");
      next();
    } else {
      req.admin = await Administrador.findById(id).lean().select("-password");
      next();
    }
  } catch (error) {
    const e = new Error("Formato del token no válido");
    return res.status(404).json({ msg: e.message });
  }
};

export default autenticacion;
