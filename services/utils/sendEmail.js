import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import config from '../../config.js';

const oAuth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);
oAuth2Client.setCredentials({ refresh_token: config.google.refreshToken });

async function getDriveFileBuffer(fileId) {
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
  return Buffer.from(res.data);
}

export async function sendPurchaseEmail(req, res) {
  const { items, correo, nombre, tipo } = req.body;
  try {
    let attachments = [];
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        if (item.archivoDriveId) {
          const buffer = await getDriveFileBuffer(item.archivoDriveId);
          attachments.push({
            filename: `${item.nombre || 'archivo'}.pdf`, 
            content: buffer
          });
        }
      }
    }

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
    const esSolicitud = tipo === 'solicitud';

    const mailOptions = {
      from: `Psicoeduca <${config.google.user}>`,
      to: correo,
      subject: esSolicitud
        ? 'Solicitud clases de inglés con Psicoeduca'
        : '¡Muchas gracias por tu compra!',
      text: esSolicitud
        ? `Hola ${nombre || ''},

        Gracias por tu interés en nuestras clases de inglés con enfoque 
        conversacional y psicológico. Cuentanos como podemos ayudarte
        y nos pondremos en contacto contigo a la brevedad.


        
        📅 Horario de atención:
        - Lunes a Viernes: 9:00 a.m. – 6:00 p.m.
        - Sábados: 9:00 a.m. – 2:00 p.m.

        Saludos,
        El equipo de Psicoeduca`
        
        : `Hola ${nombre || ''},

        Agradecemos mucho tu compra. Esperamos que el material adquirido sea 
        de gran utilidad para tu crecimiento personal.

        Si tienes alguna duda adicional, puedes escribirnos a este mismo correo o
        contactarnos por redes sociales.

        📅 Horario de atención:
        - Lunes a Viernes: 9:00 a.m. – 6:00 p.m.
        - Sábados: 9:00 a.m. – 2:00 p.m.

        ¡Gracias por confiar en nosotros!

        Atentamente,
        El equipo de Psicoeduca`,
        attachments
        };
    
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado correctamente.' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function sendInscripcionClase(req, res) {
  const { correo, nombre, tipo } = req.body;
  try {
    // Buscar usuario por email
    const usuariosSnap = await admin.firestore().collection('usuarios').where('email', '==', correo).get();
    if (usuariosSnap.empty) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    const usuarioRef = usuariosSnap.docs[0].ref;
    const usuario = usuariosSnap.docs[0].data();
    const inscripciones = usuario.inscripciones || [];
    const inscripcionActual = tipo === 'grupo' ? 'claseGrupo' : 'claseIndividual';
    if (inscripciones.includes(inscripcionActual)) {
      return res.status(200).json({ message: 'Ya estás inscrito a esta clase.' });
    }
    // Agregar inscripción
    await usuarioRef.update({
      inscripciones: admin.firestore.FieldValue.arrayUnion(inscripcionActual)
    });

    // Enviar correo
    let subject = 'Inscripción a clase de inglés con Psicoeduca';
    let text = '';
    if (tipo === 'grupo') {
      text = `Hola ${nombre || ''},\n\n¡Gracias por tu interés en nuestras clases grupales de inglés!\n\nPor favor, completa el siguiente formulario para finalizar tu inscripción:\nhttps://docs.google.com/forms/d/e/1FAIpQLSdiuTPUSSZB1FG4nm-pDnA68ZVu4Ee5oYmdlXxMu5Q5T5zNcQ/viewform?usp=header\n\nCualquier duda, contáctanos.\n\n 
      
      📅 Horario de atención:
        - Lunes a Viernes: 9:00 a.m. – 6:00 p.m.
        - Sábados: 9:00 a.m. – 2:00 p.m.

        Saludos,
        El equipo de Psicoeduca`;
    } else {
      text = `Hola ${nombre || ''},\n\n¡Gracias por tu interés en nuestras clases individuales de inglés!\n\nEn breve nos pondremos en contacto contigo para coordinar tu clase personalizada.\n\nCualquier duda, contáctanos.\n\n 

      📅 Horario de atención:
        - Lunes a Viernes: 9:00 a.m. – 6:00 p.m.
        - Sábados: 9:00 a.m. – 2:00 p.m.

        Saludos,
        El equipo de Psicoeduca`;
    }

    
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
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo de inscripción enviado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
/*
export async function sendInscripcionClase(req, res) {
  const { correo, nombre, tipo } = req.body;
  try {
    let subject = 'Inscripción a clase de inglés con Psicoeduca';
    let text = '';
    if (tipo === 'grupo') {
      text = `Hola ${nombre || ''},\n\n¡Gracias por tu interés en nuestras clases grupales de inglés!\n\nPor favor, completa el siguiente formulario para finalizar tu inscripción:\nhttps://docs.google.com/forms/d/e/1FAIpQLSdiuTPUSSZB1FG4nm-pDnA68ZVu4Ee5oYmdlXxMu5Q5T5zNcQ/viewform?usp=header\n\nCualquier duda, contáctanos.\n\n 
      
      📅 Horario de atención:
        - Lunes a Viernes: 9:00 a.m. – 6:00 p.m.
        - Sábados: 9:00 a.m. – 2:00 p.m.

        Saludos,
        El equipo de Psicoeduca`;
    } else {
      text = `Hola ${nombre || ''},\n\n¡Gracias por tu interés en nuestras clases individuales de inglés!\n\nEn breve nos pondremos en contacto contigo para coordinar tu clase personalizada.\n\nCualquier duda, contáctanos.\n\n 

      📅 Horario de atención:
        - Lunes a Viernes: 9:00 a.m. – 6:00 p.m.
        - Sábados: 9:00 a.m. – 2:00 p.m.

        Saludos,
        El equipo de Psicoeduca`;
    }

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
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo de inscripción enviado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
*/