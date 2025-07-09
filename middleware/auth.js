const { validateToken } = require('../services/auth'); 

function checkForAuthenficationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookie = req.cookies[cookieName];

        if (!tokenCookie) {
            req.user = null;
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookie);
            req.user = userPayload;
        } catch (error) {
            req.user = null;
        }

        return next();
    };
}

module.exports = { checkForAuthenficationCookie };
