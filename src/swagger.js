import swaggerJSDoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      version: "1.0.0",
      title: "Parking ESFOT",
      description:
        "La API de Gestión de Lugares de Parqueo está diseñada para facilitar la administración eficiente de los espacios de estacionamiento en una instalación o área específica. Esta API permite a los administradores, guardias y usuarios interactuar con el sistema para obtener información en tiempo real sobre la disponibilidad de lugares de parqueo y realizar acciones relacionadas con la gestión de estos espacios.",
      servers: ["https://backend-espacios-esfot.onrender.com/"],
    },
    basePath: "/",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    servers: [
      {
        url: "https://backend-espacios-esfot.onrender.com/",
      },
    ],
  },
  apis: ["./src/routes/*_routes.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
