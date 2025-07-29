import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import config from '../../config.js'; 

const serviceAccount = JSON.parse(config.firebaseAdmin.service);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });

export async function isSlotAvailable(calendarId, start, end) {
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: start,
      timeMax: end,
      timeZone: 'America/Mexico_City', 
      items: [{ id: calendarId }],
    },
  });
  const busy = res.data.calendars[calendarId].busy;
  return busy.length === 0;
}

export async function createCalendarEvent(calendarId, event) {
  const res = await calendar.events.insert({
    calendarId,
    requestBody: event,
  });
  return res.data;
}