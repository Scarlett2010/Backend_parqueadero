import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
// import { Server as SocketServer } from "socket.io";
import routerParqueaderos from "./routes/parqueadero_routes.js";
import routerUsuarios from "./routes/usuario_routes.js";
import routerGuardias from "./routes/guardia_routes.js";
import routerAdministrador from "./routes/administrador_routes.js";
// import { SerialPort, ReadlineParser } from "serialport";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { options } from "../src/swagger.js";

// Inicializaciones
const app = express();
const httpServer = createServer(app);
// const io = new SocketServer(httpServer, {
//   cors: {
//     origin: "*",
//   },
// });

dotenv.config();

// Configuraciones
const PORT = process.env.PORT || 4000;
app.set("port", PORT);
app.use(cors());

// Middlewares
app.use(express.json());
const spect = swaggerJSDoc(options);

// Rutas
app.use("/api", routerParqueaderos);
app.use("/api", routerUsuarios);
app.use("/api", routerGuardias);
app.use("/api", routerAdministrador);

app.get("/", (req, res) => {
  res.send("Bienvenido al backend");
});
// Documentación
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spect));

// Endpoint no es encontrado
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// PARTE IOT
// const port = new SerialPort({
//   path: "COM3",
//   baudRate: 9600,
// });

// const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
// parser.on("data", function (data) {
//   console.log(data);
//   io.emit("serialData", data); // Emitir datos a todos los clientes conectados
// });
// parser.on("error", (err) => console.log(err));
// // // Socket.IO
// io.on("connection", (socket) => {
//   console.log("Un cliente se ha conectado");
//   socket.on("disconnect", () => {
//     console.log("Un cliente se ha desconectado");
//   });
// });

export { httpServer, app };
