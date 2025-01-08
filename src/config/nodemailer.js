import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
  },
});

const CorreoCredencialesG = async (userMail, plainPassword) => {
  try {
    let mailOptions = {
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Bienvenid@ a nuestro sistema",
      html: `<h3>Hola 😊🚗,</h3>
             <h4>Te damos la bienvenida a nuestro sistema de gestión (Parking 🚗🛣️). Estos son tus datos de acceso:</h4>
             <p>------------- Credenciales -------------</p>
             <ul>
               <li><strong>Email:</strong> ${userMail}</li>
               <li><strong>Contraseña:</strong> ${plainPassword}</li>
             </ul>
             <p>------------------------------------------</p>
             <p>Por favor, guarda esta información de manera segura.</p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

const CorreoCredencialesU = async (userMail, plainPassword) => {
  try {
    let mailOptions = {
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Bienvenid@ a nuestro sistema",
      html: `<h3>Hola 😊🚗,</h3>
             <h4>Te damos la bienvenida a nuestro sistema de gestión (Parking 🚗🛣️). Estos son tus datos de acceso:</h4>
             <p>------------- Credenciales -------------</p>
             <ul>
               <li><strong>Email:</strong> ${userMail}</li>
               <li><strong>Contraseña:</strong> ${plainPassword}</li>
             </ul>
             <p>------------------------------------------</p>
             <p>Por favor, guarda esta información de manera segura.</p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

const RestablecimientoContraseñaUser = async (userMail, token) => {
  try {
    let info = await transporter.sendMail({
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Correo para reestablecer tu contraseña",
      html: `
      <h1>Sistema de gestión (Parking 🚗🛣️)</h1>
      <hr>
      <a href="https://timely-crepe-9d2886.netlify.app/cambiar-contrasena?token=${token}">Clic para reestablecer tu contraseña</a>
      <hr>
      <footer>Bienvenid@s!</footer>
      `,
    });
    return info;
  } catch (error) {
    throw error;
  }
};

const RestablecimientoContraseñaAdmin = async (userMail, token) => {
  try {
    let info = await transporter.sendMail({
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Correo para reestablecer tu contraseña",
      html: `
      <h1>Sistema de gestión (Parking 🚗🛣️)</h1>
      <hr>
      <a href="https://timely-crepe-9d2886.netlify.app/cambiar-contrasena?token=${token}">Clic para reestablecer tu contraseña</a>
      <hr>
      <footer>Bienvenid@s!</footer>
      `,
    });
    return info;
  } catch (error) {
    throw error;
  }
};

const RestablecimientoContraseñaGuardia = async (userMail, token) => {
  try {
    let info = await transporter.sendMail({
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Correo para reestablecer tu contraseña",
      html: `
      <h1>Sistema de gestión (Parking 🚗🛣️)</h1>
      <hr>
      <a href="https://timely-crepe-9d2886.netlify.app/cambiar-contrasena?token=${token}">Clic para reestablecer tu contraseña</a>
      <hr>
      <footer>Bienvenid@s!</footer>
      `,
    });
    return info;
  } catch (error) {
    throw error;
  }
};

export {
  CorreoCredencialesG,
  CorreoCredencialesU,
  RestablecimientoContraseñaUser,
  RestablecimientoContraseñaAdmin,
  RestablecimientoContraseñaGuardia,
};
