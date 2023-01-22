const jwt = require('jsonwebtoken');

const AccessTokenManager = require('../../application/security/accessTokenManager');

const JWT_SECRET_KEY = '898989898!';

module.exports = class extends AccessTokenManager {

  generate(payload) {
    return jwt.sign(payload, JWT_SECRET_KEY);
  }

  decode(accessToken) {
    return jwt.verify(accessToken, JWT_SECRET_KEY);
  }

};