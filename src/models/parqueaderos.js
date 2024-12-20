import mongoose from "mongoose";

const parqueaderoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      require: true,
      default: false,
    },
    description: {
      type: String,
      require: true,
    },
    planta: {
      type: String,
      require: true,
    },
    bloque: {
      type: String,
      require: true,
    },
    tipo: {
      type: String,
      require: true,
    },
    espacios: {
      type: Number,
      require: true,
    },
    estado: {
      type: Boolean,
      default: true,
    },
    x: {
      type: Number,
    },
    y: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Parqueaderos", parqueaderoSchema);
