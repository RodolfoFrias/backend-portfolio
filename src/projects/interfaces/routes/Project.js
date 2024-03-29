const express = require('express');

const router = express.Router();

const ProjectController = require('../controllers/ProjectController');

router.get('/', ProjectController.getProjects);
router.get('/:id', ProjectController.getProject);

module.exports = router;