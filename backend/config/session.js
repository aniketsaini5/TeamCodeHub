const session = require('express-session');

const configureSession = (app) => {
    // Session Configuration - 4 months expiry
    const FOUR_MONTHS = 4 * 30 * 24 * 60 * 60 * 1000; // in milliseconds

    app.use(session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: FOUR_MONTHS
        }
    }));
};

module.exports = configureSession;