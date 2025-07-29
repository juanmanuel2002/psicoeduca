import dotenvx from '@dotenvx/dotenvx';

dotenvx.config();

const config = {
    firebase: {
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PROJECT_ID,
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_APP_ID,
        measurementId: process.env.REACT_APP_MEASUREMENT_ID,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        calendarId: process.env.CALENDAR_ID,
    },
    firebaseAdmin: {
        service: process.env.FIREBASE,
    },
};

export default config;