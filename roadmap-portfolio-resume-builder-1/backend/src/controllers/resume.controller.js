const ResumeController = require('../models/resume.model');

// Create a new resume
exports.createResume = async (req, res) => {
    try {
        const resumeData = req.body;
        const newResume = await ResumeController.create(resumeData);
        res.status(201).json(newResume);
    } catch (error) {
        res.status(500).json({ message: 'Error creating resume', error });
    }
};

// Get a user's resume
exports.getResume = async (req, res) => {
    try {
        const { userId } = req.params;
        const resume = await ResumeController.findOne({ userId });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resume', error });
    }
};

// Update a user's resume
exports.updateResume = async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedResume = await ResumeController.findOneAndUpdate({ userId }, req.body, { new: true });
        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json(updatedResume);
    } catch (error) {
        res.status(500).json({ message: 'Error updating resume', error });
    }
};

// Delete a user's resume
exports.deleteResume = async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedResume = await ResumeController.findOneAndDelete({ userId });
        if (!deletedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting resume', error });
    }
};