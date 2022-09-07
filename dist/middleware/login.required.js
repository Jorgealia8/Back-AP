import * as aut from '../services/authorization.js';
export const loginRequired = (req, resp, next) => {
    const authorization = req.get('authorization');
    let token;
    const tokenError = new Error('token missing or invalid');
    tokenError.name = 'TokenError';
    let decodedToken;
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
        decodedToken = aut.verifyToken(token);
        if (typeof decodedToken === 'string') {
            next(tokenError);
        }
        else {
            req.tokenPayload = decodedToken;
            next();
        }
    }
    else {
        next(tokenError);
    }
};
