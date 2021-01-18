'use strict';

const Auth = require('../../domain/Auth');

module.exports = ( username, password, authRepository ) => {
    const auth = new Auth(username, password);
    return authRepository.login(auth);
}