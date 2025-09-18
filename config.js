import dotenvx from '@dotenvx/dotenvx';

dotenvx.config();

const config = {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        user: process.env.GOOGLE_USER,
        redirectUri: process.env.GOOGLE_REDIRECT_URI,
        calendarId: process.env.CALENDAR_ID,
        apiCalendar: process.env.GOOGLE_API_CALENDAR,
    },
};

export default config;