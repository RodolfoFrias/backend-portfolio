'use strict';

const Login = require('../../application/use_cases/Login');
const AuthRepository = require('../../infraestucture/repositories/AuthRepository');

module.exports = {

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            await Login(username, password, new AuthRepository());
            res.status(200).json('OK');
        } catch (error) {
            console.log(error);
            res.status(400).json('Failed');
        }
    }

}