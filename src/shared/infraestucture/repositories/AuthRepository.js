const User = Parse.Object.extend('User');
const AuthRepository = require('../../domain/AuthRepository');

module.exports = class extends AuthRepository {
 
    constructor(){
        super();
    }

    async login(entity){
        const { username, password } = entity;
        return await Parse.User.logIn(username, password);
    }

}