'use strict';

const Login = require('../../application/use_cases/Login');
const AuthRepository = require('../../infraestucture/repositories/AuthRepository');
const responseFormatter = require('../util/responseFormatter');

module.exports = {

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            await Login(username, password, new AuthRepository());
            responseFormatter(res, true, 200)
        } catch (error) {
           next(error)
        }
    }

}