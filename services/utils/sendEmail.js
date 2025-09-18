import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import config from '../../config.js';

const oAuth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);
oAuth2Client.setCredentials({ refresh_token: config.google.refreshToken });

export async function sendImageEmail(img, correo) {
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
      subject: "test imagen",
      text: 'este solo es el ejemplo',
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