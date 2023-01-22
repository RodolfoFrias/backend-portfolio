'use strict';

const ProjectRepository = require('../../domain/ProjectRepository');

module.exports = class extends ProjectRepository {
    
    constructor(projectModel){
        super();
        this.model = new Parse.Query(projectModel);
    }

    async getProjects(){
        const projectQuery = this.model;
        return projectQuery.find();
    }

    async getProject(id){
        const projectQuery = this.model;
        projectQuery.equalTo('objectId', id);
        return projectQuery.first();
    }

}