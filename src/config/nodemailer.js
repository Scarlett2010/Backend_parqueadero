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
      subject: "Bienvenido a nuestro sistema",
      html: `<p>Hola,</p>
             <p>Te damos la bienvenida a nuestro sistema de gestión (Parking 🚗🛣️). Estos son tus datos de acceso:</p>
             <ul>
               <li><strong>Email:</strong> ${userMail}</li>
               <li><strong>Contraseña:</strong> ${plainPassword}</li>
             </ul>
             <p>Por favor, guarda esta información de manera segura.</p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};

const CorreoCredencialesU = async (userMail, plainPassword) => {
  try {
    let mailOptions = {
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Bienvenido a nuestro sistema",
      html: `<p>Hola,</p>
             <p>Te damos la bienvenida a nuestro sistema de gestión (Parking 🚗🛣️). Estos son tus datos de acceso:</p>
             <ul>
               <li><strong>Email:</strong> ${userMail}</li>
               <li><strong>Contraseña:</strong> ${plainPassword}</li>
             </ul>
             <p>Por favor, guarda esta información de manera segura.</p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};
const enviarRestablecimientoContraseña = async (userMail, token) => {
  try {
    let info = await transporter.sendMail({
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Correo para reestablecer tu contraseña",
      html: `
      <h1>Sistema de gestión (Parking 🚗🛣️)</h1>
      <hr>
      <a href=http://localhost:4000/api/recuperar-clave/${token}>Clic para reestablecer tu contraseña</a>
      <hr>
      <footer>Bienvenid@s!</footer>
      `,
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo de restablecimiento:", error);
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
      <a href=http://localhost:4000/api/administrador/recuperar-clave/${token}>Clic para reestablecer tu contraseña</a>
      <hr>
      <footer>Bienvenid@s!</footer>
      `,
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo de restablecimiento:", error);
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
      <a href=http://localhost:4000/api/guardias/recuperar-clave/${token}>Clic para reestablecer tu contraseña</a>
      <hr>
      <footer>Bienvenid@s!</footer>
      `,
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo de restablecimiento:", error);
    throw error;
  }
};

export {
  CorreoCredencialesG,
  CorreoCredencialesU,
  enviarRestablecimientoContraseña,
  RestablecimientoContraseñaAdmin,
  RestablecimientoContraseñaGuardia,
};
