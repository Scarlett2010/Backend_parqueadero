import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const administradorSchema = new mongoose.Schema(
  {
    cedula: {
      type: Number,
      require: true,
      trim: true,
    },
    nombre: {
      type: String,
      require: true,
      trim: true,
    },
    apellido: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    token: {
      type: String,
      default: null,
    },
    telefono: {
      type: Number,
      require: false,
    },
    rol: {
      type: String,
      default: "administrador",
    },
    permisos: [
      {
        Usuarios: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Usuarios",
        },
        Parqueadero: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Parqueadero",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

administradorSchema.methods.encrypPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const passwordEncryp = await bcrypt.hash(password, salt);
  return passwordEncryp;
};

administradorSchema.methods.matchPassword = async function (password) {
  const response = await bcrypt.compare(password, this.password);
  return response;
};

//Metodo para crear un token
administradorSchema.methods.Tokencrear = function () {
  const tokenGenerado = (this.token = Math.random().toString(36).slice(2));
  return tokenGenerado;
};

export default mongoose.model("Administrador", administradorSchema);
