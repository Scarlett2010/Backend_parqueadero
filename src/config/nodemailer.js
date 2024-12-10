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

const sendMailToUser = async (userMail, token) => {
  try {
    let mailOptions = {
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Verifica tu cuenta",
      html: `<p>Hola, haz clic <a href="${
        process.env.URL_FRONTEND
      }confirmar/${encodeURIComponent(
        token
      )}">aquí</a> para confirmar tu cuenta.</p>`,
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
      <a href=http://localhost:3000/api/recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
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
      <a href=http://localhost:3000/api/administrador/recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
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
      <a href=http://localhost:3000/api/guardias/recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
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
  sendMailToUser,
  enviarRestablecimientoContraseña,
  RestablecimientoContraseñaAdmin,
  RestablecimientoContraseñaGuardia,
};
