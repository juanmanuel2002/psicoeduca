import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import config from '../../config.js';
import { connectDataConnectEmulator } from 'firebase/data-connect';

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

async function findId(item){
  const docRef = admin.firestore().collection('recursos').doc(item.id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return res.status(404).send('Recurso no encontrado');
  }

  const recurso = docSnap.data();
  const archivoDriveId = recurso.archivoDriveId;

  if (!archivoDriveId) {
    return null
  }

  return archivoDriveId
}

export async function sendPurchaseEmail(req, res) {
  const { items, correo, nombre, tipo } = req.body;
  try {
    let attachments = [];
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        let archivoId = await findId(item)
        item.archivoDriveId = archivoId
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

    // Enviar correo
    let subject = 'Inscripción a clase de inglés con Psicoeduca';
    let html = "";

    if (tipo === 'grupo') {
      html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
       
        <h2 style="color: #007bff;">Hola ${nombre || ''},</h2>

        <p>¡Gracias por tu interés en nuestras <strong>clases grupales de inglés</strong>! 🎉</p>

        <p>¿Quieres aprender inglés pero sientes nervios al hablar?<br>
        En <strong>Psicoeduca</strong> desarrollamos un programa de inglés con base psicológica que combina técnicas de aprendizaje y motivación para que avances con confianza, seguridad y resultados reales.</p>

        <h3 style="color: #444;">✨ Beneficios:</h3>
        <ul>
          <li>Reducción de la ansiedad al expresarte</li>
          <li>Clases dinámicas y personalizadas</li>
          <li>Aprendizaje efectivo y duradero</li>
        </ul>

        <p>Por favor, completa el siguiente formulario para finalizar tu inscripción:</p>
        <p>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdiuTPUSSZB1FG4nm-pDnA68ZVu4Ee5oYmdlXxMu5Q5T5zNcQ/viewform?usp=header"
            style="background: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            📋 Completar formulario
          </a>
        </p>

        <h3 style="color: #444;">📅 Horario de atención:</h3>
        <p>
          Lunes a Viernes: 9:00 a.m. – 6:00 p.m.<br>
          Sábados: 9:00 a.m. – 2:00 p.m.
        </p>

        <p>Saludos,<br><strong>El equipo de Psicoeduca</strong></p>

        <hr style="margin: 20px 0;" />

        <p style="text-align: center;">
          🌐 <a href="https://instagram.com/p.siedu" style="color: #E1306C;">Instagram @p.siedu</a> | 
          👍 <a href="https://www.facebook.com/profile.php?id=100063462581485" style="color: #1877F2;">Facebook Psicoeduca</a>
        </p>
        <img src="https://drive.google.com/uc?export=view&id=18U9hEM-IWMFVwItXjmaH4aDqB6sx29jU" alt="Psicoeduca Inglés" style="width: 100%; border-radius: 10px; margin-bottom: 20px;" />
      </div>
      `;
    } else {
      html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        
        <h2 style="color: #007bff;">Hola ${nombre || ''},</h2>

        <p>¡Gracias por tu interés en nuestras <strong>clases individuales de inglés</strong>! 🎉</p>

        <p>¿Quieres aprender inglés pero sientes nervios al hablar?<br>
        En <strong>Psicoeduca</strong> desarrollamos un programa de inglés con base psicológica que combina técnicas de aprendizaje y motivación para que avances con confianza, seguridad y resultados reales.</p>

        <h3 style="color: #444;">✨ Beneficios:</h3>
        <ul>
          <li>Reducción de la ansiedad al expresarte</li>
          <li>Clases dinámicas y personalizadas</li>
          <li>Aprendizaje efectivo y duradero</li>
        </ul>

        <p>Para confirmar tu inscripción, completa el siguiente formulario:</p>
        <p>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdeC8UbFsoZ10L-rAP8j1CQoSWLwG_7_xFzPfeV6isINImdgA/viewform"
            style="background: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            📋 Completar formulario
          </a>
        </p>

        <h3 style="color: #444;">📅 Horario de atención:</h3>
        <p>
          Lunes a Viernes: 9:00 a.m. – 6:00 p.m.<br>
          Sábados: 9:00 a.m. – 2:00 p.m.
        </p>

        <p>Saludos,<br><strong>El equipo de Psicoeduca</strong></p>

        <hr style="margin: 20px 0;" />

        <p style="text-align: center;">
          🌐 <a href="https://instagram.com/p.siedu" style="color: #E1306C;">Instagram @p.siedu</a> | 
          👍 <a href="https://www.facebook.com/profile.php?id=100063462581485" style="color: #1877F2;">Facebook Psicoeduca</a>
        </p>
        <img src="https://drive.google.com/uc?export=view&id=18U9hEM-IWMFVwItXjmaH4aDqB6sx29jU" alt="Psicoeduca Inglés" style="width: 100%; border-radius: 10px; margin-bottom: 20px;" />
      </div>
      `;
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
      html
    };

    await transporter.sendMail(mailOptions);
     // Agregar inscripción
    await usuarioRef.update({
      inscripciones: admin.firestore.FieldValue.arrayUnion(inscripcionActual)
    });
    res.status(200).json({ message: 'Correo de inscripción enviado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}