const Portfolio = require('../models/project.model');

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { title, description, techStack, githubLink, demoLink, images } = req.body;
        const newProject = new Portfolio({
            title,
            description,
            techStack,
            githubLink,
            demoLink,
            images,
            userId: req.user.id // Assuming user ID is stored in req.user
        });
        await newProject.save();
        res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// Get all projects for a user
exports.getProjects = async (req, res) => {
    try {
        const projects = await Portfolio.find({ userId: req.user.id });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const updatedProject = await Portfolio.findByIdAndUpdate(projectId, req.body, { new: true });
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const deletedProject = await Portfolio.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};