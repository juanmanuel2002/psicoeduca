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

const footerEmail = `
  <h3 style="color: #444;">📅 Horario de atención:</h3>
  <p>
    Lunes a Viernes: 9:00 a.m. – 6:00 p.m.<br>
    Sábados: 9:00 a.m. – 2:00 p.m.
  </p>

  <p>Saludos,<br><strong>Equipo Psicoeduca</strong></p>

  <hr style="margin: 20px 0;" />

  <div style="text-align: center;">
    <p style="font-size: 12px; color: #888; ">2025 © Psicoeduca</p>
    🌐 <a href="https://instagram.com/p.siedu" style="color: #1877F2;">Instagram @p.siedu</a> | 
    👍 <a href="https://www.facebook.com/profile.php?id=100063462581485" style="color: #1877F2;">Facebook Psicoeduca</a>
  </div>
`

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

function buildMimeMessage(from, to, subject, text, attachments) {
  const boundary = '----=_Boundary_' + Date.now();
  const nl = '\r\n';

  let mime = '';
  mime += `From: ${from}${nl}`;
  mime += `To: ${to}${nl}`;
  mime += `Subject: ${encodeSubject(subject)}${nl}`;
  mime += `MIME-Version: 1.0${nl}`;
  mime += `Content-Type: multipart/mixed; boundary="${boundary}"${nl}${nl}`;

  // Parte de texto
  mime += `--${boundary}${nl}`;
  mime += `Content-Type: text/html; charset="UTF-8"${nl}`;
  mime += `Content-Transfer-Encoding: 7bit${nl}${nl}`;
  mime += text + nl + nl;

  // Adjuntos
  if (attachments && attachments.length > 0) {
    for (const file of attachments) {
      const content = file.content.toString('base64');
      mime += `--${boundary}${nl}`;
      mime += `Content-Type: application/pdf; name="${file.filename}"${nl}`;
      mime += `Content-Disposition: attachment; filename="${file.filename}"${nl}`;
      mime += `Content-Transfer-Encoding: base64${nl}${nl}`;
      mime += `${content}${nl}${nl}`;
    }
  }

  mime += `--${boundary}--`;

  return Buffer.from(mime)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
function encodeSubject(subject) {
  const base64 = Buffer.from(subject, 'utf8').toString('base64');
  return `=?UTF-8?B?${base64}?=`;
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

    const esSolicitud = tipo === 'solicitud';

    const subject = esSolicitud
      ? 'Solicitud clases de inglés con Psicoeduca'
      : '¡Muchas gracias por tu compra!';
    const text = esSolicitud
      ? `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 12px; background: #fafafa;">
        <h2 style="color: #007bff;">Hola ${nombre || ''},</h2>
        <p style="font-size: 14px; line-height: 1.6;">
          Gracias por tu interés en nuestras clases de inglés con enfoque 
          <strong>conversacional y psicológico</strong>.
        </p>
        <p style="font-size: 14px; line-height: 1.6;">
          Cuéntanos cómo podemos ayudarte y nos pondremos en contacto contigo a la brevedad.
        </p>
        <p style="font-size: 14px; line-height: 1.6;">
          No olvides seguirnos en nuestras redes para que descubras tips, ejercicios y recursos que pueden ayudarte desde hoy a mejorar tu inglés. 📚✨
        </p>

        ${footerEmail}

      </div>
      `
      : `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 12px; background: #fafafa;">
        <h2 style="color: #007bff;">Hola ${nombre || ''},</h2>
        <p style="font-size: 14px; line-height: 1.6;">
          Queremos agradecerte de corazón por confiar en <strong>Psicoeduca</strong>.  
          Tu compra no solo es un paso hacia tu crecimiento personal, sino también una inversión en ti mismo. 💡
        </p>
        
        <p style="font-size: 14px; line-height: 1.6;">
          Aprovecha al máximo tu recurso, y recuerda: el aprendizaje es más poderoso cuando se aplica día a día.  
          ¡Estamos emocionados de acompañarte en este proceso! 🚀
        </p>
        
        <p style="font-size: 14px; line-height: 1.6;">
          Si tienes alguna duda adicional, puedes escribirnos a este mismo correo o
          contactarnos por redes sociales.
        </p>

        ${footerEmail}
      </div>
      `;

    // Construir MIME
    const raw = buildMimeMessage(
      `Psicoeduca <${config.google.user}>`,
      correo,
      subject,
      text,
      attachments
    );

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw }
    });
    console.log('envio exitoso')

    res.status(200).json({ message: 'Correo enviado correctamente con Gmail API.' });

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
    const subject = 'Inscripción a clase de inglés con Psicoeduca';
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
        
        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin: 20px 0; text-align: center; margin-right: 15px;">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdiuTPUSSZB1FG4nm-pDnA68ZVu4Ee5oYmdlXxMu5Q5T5zNcQ/viewform?usp=header"
            style="background: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            📋 Exámen de colocación
          </a>

          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdeC8UbFsoZ10L-rAP8j1CQoSWLwG_7_xFzPfeV6isINImdgA/viewform"
            style="background: #286aa7ff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            📋 Inscripción a clases
          </a>
        </div>

        ${footerEmail}

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

        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin: 20px 0; text-align: center; margin-right: 15px;">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdiuTPUSSZB1FG4nm-pDnA68ZVu4Ee5oYmdlXxMu5Q5T5zNcQ/viewform?usp=header"
            style="background: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            📋 Exámen de colocación
          </a>

          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdeC8UbFsoZ10L-rAP8j1CQoSWLwG_7_xFzPfeV6isINImdgA/viewform"
            style="background: #286aa7ff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            📋 Inscripción a clases
          </a>
        </div>

        ${footerEmail}

        <img src="https://drive.google.com/uc?export=view&id=18U9hEM-IWMFVwItXjmaH4aDqB6sx29jU" alt="Psicoeduca Inglés" style="width: 100%; border-radius: 10px; margin-bottom: 20px;" />
        
      </div>
      `;
    }
    const attachments = [];
    // Construir MIME
    const raw = buildMimeMessage(
      `Psicoeduca <${config.google.user}>`,
      correo,
      subject,
      html,
      attachments
    );

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw }
    });
    console.log('envio exitoso')

    // Agregar inscripción
    await usuarioRef.update({
      inscripciones: admin.firestore.FieldValue.arrayUnion(inscripcionActual)
    });
    res.status(200).json({ message: 'Correo de inscripción enviado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}