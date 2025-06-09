const transport = require("../config/mailer");

const sendMail = async (req, res) => {
  try {
    const message = {
      from: "vmh.nodemailer@gmail.com",
      to: req.body.email,
      subject: "Verificación de correo electronico",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 8px; color: #333;">
        <h2 style="color: #2c3e50;">¡Bienvenido!</h2>
        <p style="font-size: 16px; line-height: 1.6;">
        Gracias por registrarte. Para verificar tu correo electrónico y activar tu cuenta, por favor hacé clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin: 30px 0;">
        <a href="${req.body.link}" 
       style="background-color: #3498db; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 6px; display: inline-block;">
      Verificar correo
    </a>
  </div>
  <p style="font-size: 14px; color: #777;">
    Si no solicitaste esta verificación, podés ignorar este mensaje.
  </p>
</div>`,
    };

    const info = await transport.sendMail(message);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al intentar enviar el mail" });
  }
};

module.exports = {
  sendMail,
};
