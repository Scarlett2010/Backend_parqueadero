import mongoose from "mongoose";

const espacioSchema = new mongoose.Schema({
  numeroEspacio: {
    type: String,
    required: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

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
    espacios: [espacioSchema],
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Parqueaderos", parqueaderoSchema);
