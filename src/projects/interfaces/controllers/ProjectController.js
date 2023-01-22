const Project = Parse.Object.extend('Project');
const FindAll = require('../../application/use_cases/FindAll');
const Find = require('../../application/use_cases/Find');
const ProjectRepository = require('../../infraestucture/repositories/ProjectRepository');

module.exports = {

    async getProjects(req, res, next) {
        try {
            console.log('Projects endpoint');
            const projects = await FindAll(new ProjectRepository(Project));
            console.log('Projects: ', projects);
            res.status(200).json(projects);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    },

    async getProject(req, res, next) {
        try {
            console.log('Project endpoint');
            const { id } = req.params;
            const project = await Find(new ProjectRepository(Project), id);
            console.log('Project:', project);
            res.status(200).json(project);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

}