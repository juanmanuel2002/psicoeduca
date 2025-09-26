import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import config from '../../config.js';

const oAuth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);
oAuth2Client.setCredentials({ refresh_token: config.google.refreshToken });


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


export async function sendImageEmail(img, correo, nivel, nombre) {
  try{
    if(!img || !correo) return;
    
    const subject = "¡Felicidades! Ya tenemos tu nivel de inglés"

    const text =  `
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
    `;

    const attachments = [
      {
        filename: 'Nivel.png',
        content: img,
        contentType: 'image/png'
      }
    ]

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
    console.log('Correo enviado');
  }catch(error){
    console.log('Error mandado el correo', error.message)
    throw new Error(error.message);
  }
   
}

export async function sendEmailInscripcionStatus(req, res){
  const { nombre, correo, estatusInscripcion, horario } = req.body;
	if (!nombre || !correo || !estatusInscripcion || !horario) {
		return res.status(400).json({ error: 'Faltan datos requeridos.' });
	}
	try {
    console.log('estado de la inscripcion', estatusInscripcion)
		if (estatusInscripcion === 'confirmado') {
      console.log('Mandando correo de confirmado')
			await sendInscripcionEmail(nombre, correo, horario);
			return res.json({ success: true, message: 'Correo de confirmación enviado.' });
		} else {
      console.log('Mandando correo de lista de espera')
			await sendListaEsperaEmail(nombre, correo, horario);
			return res.json({ success: true, message: 'Correo de lista de espera enviado.' });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

async function sendInscripcionEmail(nombre, correo, horario) {
  try {
    
    const subject = "¡Inscripción confirmada! 🎉"
    const text = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 12px; background: #fafafa;">
          <h2 style="color: #007bff;">Hola ${nombre},</h2>
          <p style="font-size: 14px; line-height: 1.6;">¡Tu inscripción ha sido <strong>confirmada</strong> en el horario: <span style='color:#28a745;'>${horario}</span>!</p>
          <p style="font-size: 14px; line-height: 1.6;">Estamos emocionados de que formes parte de nuestra comunidad de aprendizaje. Prepárate para una experiencia educativa enriquecedora y divertida.</p>

          <h3 style="color: #444;">👉 ¿Qué sigue?</h3>
          <p style="font-size: 14px; line-height: 1.6;">
            Te esperamos en tu primera clase. Asegúrate de revisar tu correo para cualquier actualización o información adicional que podamos enviarte antes de que comencemos.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

          <p style="font-size: 14px;">Si tienes alguna duda o comentario, no dudes en escribirnos.  
          Agradecemos tu interés y participación.</p>

          <h3 style="color: #444;">📅 Horario de atención:</h3>
          <p style="font-size: 14px; line-height: 1.6;">
            Lunes a Viernes: 9:00 a.m. – 6:00 p.m.<br>
            Sábados: 9:00 a.m. – 2:00 p.m.
          </p>

          <p style="font-size: 15px; line-height: 1.6;">Saludos,<br><strong>Equipo Psicoeduca</strong></p>

          <hr style="margin: 20px 0;" />

          <div style="text-align: center;">
            <p style="font-size: 12px; color: #888; ">2025 © Psicoeduca</p>
            🌐 <a href="https://instagram.com/p.siedu" style="color: #E1306C;">Instagram @p.siedu</a> | 
            👍 <a href="https://www.facebook.com/profile.php?id=100063462581485" style="color: #1877F2;">Facebook Psicoeduca</a>
          </div>
        </div>
     `;

    const attachments = null;
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

  } catch (error) {
    console.log('Error mandando correo de inscripción', error.message);
    throw new Error(error.message);
  }
}

async function sendListaEsperaEmail(nombre, correo, horario) {
  try {

    const subject = 'Estás en la lista de espera'

    const text = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 12px; background: #fafafa;">
          <h2 style="color: #007bff;">Hola ${nombre},</h2>
          <p style="font-size: 14px;">Actualmente el horario <span style='color:#dc3545;'>${horario}</span> está completo, pero te hemos agregado a la <strong>lista de espera</strong>.</p>
          
          <p style="font-size: 14px;">Pero no te preocupes! En cuanto se libere algun lugar te notificaremos. Agradecemos tu paciencia y comprensión.</p>
          <h3 style="color: #444;">👉 ¿Qué puedes hacer mientras tanto?</h3>
          <p style="font-size: 14px; line-height: 1.6;">
            Considera explorar otros horarios disponibles o nuestro programa <strong>Conviértete en Aprendiz</strong>, que ofrece una excelente oportunidad para comenzar tu aprendizaje de inmediato.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

          <p style="font-size: 14px;">Si tienes alguna duda o comentario, no dudes en escribirnos.  
          Agradecemos tu interés y participación.</p>

          <h3 style="color: #444;">📅 Horario de atención:</h3>
          <p style="font-size: 14px; line-height: 1.6;">
            Lunes a Viernes: 9:00 a.m. – 6:00 p.m.<br>
            Sábados: 9:00 a.m. – 2:00 p.m.
          </p>

          <p style="font-size: 15px; line-height: 1.6;">Saludos,<br><strong>Equipo Psicoeduca</strong></p>

          <hr style="margin: 20px 0;" />

          <div style="text-align: center;">
            <p style="font-size: 12px; color: #888; ">2025 © Psicoeduca</p>
            🌐 <a href="https://instagram.com/p.siedu" style="color: #E1306C;">Instagram @p.siedu</a> | 
            👍 <a href="https://www.facebook.com/profile.php?id=100063462581485" style="color: #1877F2;">Facebook Psicoeduca</a>
          </div>
        </div>
      `;

    const attachments = null;

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


  } catch (error) {
    console.log('Error mandando correo de lista de espera', error.message);
    throw new Error(error.message);
  }
}