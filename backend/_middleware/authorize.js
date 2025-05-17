const jwt = require('express-jwt').expressjwt || require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ 
            secret, 
            algorithms: ['HS256'],
            requestProperty: 'auth', // Change from 'user' to 'auth'
            getToken: function fromHeaderOrQuerystring(req) {
                if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                    return req.headers.authorization.split(' ')[1];
                }
                return null;
            }
        }),

        // authorize based on user role
        async (req, res, next) => {
            try {
                console.log('Authorization middleware - Request headers:', req.headers);
                console.log('Authorization middleware - Auth object:', req.auth);

                if (!req.auth || !req.auth.id) {
                    console.error('No auth object or id found in request');
                    return res.status(401).json({ message: 'No token provided' });
                }

                const account = await db.Account.findByPk(req.auth.id);
                console.log('Found account:', account ? 'Yes' : 'No');

                if (!account) {
                    console.error('Account not found for id:', req.auth.id);
                    return res.status(401).json({ message: 'Account not found' });
                }

                if (roles.length && !roles.includes(account.role)) {
                    console.error('Role not authorized:', account.role);
                    return res.status(401).json({ message: 'Role not authorized' });
                }

                // authentication and authorization successful
                req.user = {
                    id: account.id,
                    role: account.role
                };

                const refreshTokens = await account.getRefreshTokens();
                req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
                
                console.log('Authorization successful for user:', req.user.id);
                next();
            } catch (error) {
                console.error('Authorization error:', error);
                return res.status(500).json({ message: 'Internal server error during authorization' });
            }
        }
    ];
}
