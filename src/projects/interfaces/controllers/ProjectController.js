'use strict';

const FindAll = require('../../application/use_cases/FindAll');
const ProjectRepository = require('../../infraestucture/repositories/ProjectRepository');

module.exports = {

    async getProjects(req, res, next) {
        try {
            const projects = await FindAll(new ProjectRepository());
            res.status(200).json(projects);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

}