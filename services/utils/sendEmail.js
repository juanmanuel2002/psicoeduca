import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import config from '../../config.js';

const oAuth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);
oAuth2Client.setCredentials({ refresh_token: config.google.refreshToken });

export async function sendImageEmail(img, correo, nivel, nombre) {
  try{
    if(!img || !correo) return;
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.google.user,
        clientId: config.google.clientId,
        clientSecret: config.google.clientSecret,
        refreshToken: config.google.refreshToken,
        accessToken: accessToken.token
      },
       //(10s)
        timeout: 10000 
    });

    const mailOptions = {
      from: `Psicoeduca <${config.google.user}>`,
      to: correo,
      subject: "¡Felicidades! Ya tenemos tu nivel de inglés",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 12px; background: #fafafa;">
        
        <h2 style="color: #007bff;">Hola ${nombre || ''}, 🎉</h2>

        <p style="font-size: 16px;">¡Felicidades! Has completado tu <strong>examen de colocación</strong> y tu nivel actual es: 
          <span style="color:#28a745; font-weight: bold; font-size: 18px;">${nivel || ''}</span>.
        </p>

        <p style="font-size: 15px; line-height: 1.6;">
          Esto significa que ya sabemos desde dónde comenzar para que tu aprendizaje sea <strong>efectivo, adaptado a ti y con resultados reales</strong>.  
        </p>

        <h3 style="color: #444;">👉 ¿Cuál es el siguiente paso?</h3>
        <p style="font-size: 15px; line-height: 1.6;">
          Inscribirte en el grupo que mejor se ajuste a tu nivel y <strong>comenzar a mejorar tu inglés desde hoy</strong>.  
          Recuerda: mientras antes empieces, más rápido alcanzarás tus metas personales, académicas o profesionales.
        </p>

        <!-- Botón principal -->
        <div style="text-align: center; margin: 25px 0;">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdeC8UbFsoZ10L-rAP8j1CQoSWLwG_7_xFzPfeV6isINImdgA/viewform"
            style="background: #286aa7; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
            📋 Quiero inscribirme
          </a>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

        <!-- Programa promocional -->
        <h3 style="color: #007bff;">⭐ Conoce nuestro programa <em>Conviértete en Aprendiz</em></h3>
        <p style="font-size: 15px; line-height: 1.7; color: #444; margin: 12px 0 18px; text-align: justify;">
          Un programa práctico y flexible para aprender inglés paso a paso, con enfoque profesional, donde conocerás nuestra metodología y procesos de aprendizaje que impulsan tu confianza y desarrollo.
        </p>
        <ul style="font-size: 15px; line-height: 1.6;">
          <li>🎁 <strong>4 clases gratuitas</strong> de 1 hora*</li>
          <li>💸 Descuento adicional en tu primer mes*</li>
          <li>📜 Constancia digital al finalizar el nivel</li>
          <li>📘 Material de apoyo y clases personalizadas</li>
        </ul>

        <div style="text-align: center; margin: 20px 0;">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSfEupmJUzqXON6bQ4Kn8ibqSfs5P4gs6lnVsei8_NmSQr6Nhw/viewform" 
            style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 15px;">
            🚀 Inscribirme en Conviértete en Aprendiz
          </a>
        </div>
        <p style="font-size: 12px; color: #666;">*Consulta restricciones</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

        <p style="font-size: 14px;">Si tienes alguna duda o comentario, no dudes en escribirnos.  
        Agradecemos tu interés y participación.</p>

        <h3 style="color: #444;">📅 Horario de atención:</h3>
        <p>
          Lunes a Viernes: 9:00 a.m. – 6:00 p.m.<br>
          Sábados: 9:00 a.m. – 2:00 p.m.
        </p>

        <p>Saludos,<br><strong>Equipo Psicoeduca</strong></p>

        <hr style="margin: 20px 0;" />

        <div style="text-align: center;">
          <p style="font-size: 12px; color: #888; ">2025 © Psicoeduca</p>
          🌐 <a href="https://instagram.com/p.siedu" style="color: #E1306C;">Instagram @p.siedu</a> | 
          👍 <a href="https://www.facebook.com/profile.php?id=100063462581485" style="color: #1877F2;">Facebook Psicoeduca</a>
        </div>
        
      </div>
      `,
      attachments: [
        {
          filename: 'Nivel.png',
          content: img,
          contentType: 'image/png'
        }
      ]
    };


    await transporter.sendMail(mailOptions);
  }catch(error){
    console.log('Error mandado el correo', error.message)
    throw new Error(error.message);
  }
   
}