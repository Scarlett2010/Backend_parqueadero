import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const conexion = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `Database connected in ${connection.host} - ${connection.port}`
    );
  } catch (error) {
    console.log(error);
  }
};

export default conexion;
