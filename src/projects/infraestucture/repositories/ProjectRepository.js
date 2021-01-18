'use strict';

const Project = Parse.Object.extend('Project');
const ProjectRepository = require('../../domain/ProjectRepository');

module.exports = class extends ProjectRepository {
 
    constructor(){
        super();
    }

    async getProjects(){
        const projectQuery = new Parse.Query(Project);
        return await projectQuery.find();
    }

}