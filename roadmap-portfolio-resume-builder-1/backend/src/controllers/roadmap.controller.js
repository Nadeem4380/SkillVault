const Roadmap = require('../models/roadmap.model');
const User = require('../models/user.model');

// Get user's roadmap
exports.getUserRoadmap = async (req, res) => {
    try {
        const userId = req.user.id;
        const roadmap = await Roadmap.findOne({ userId });

        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        res.status(200).json(roadmap);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create or update user's roadmap
exports.createOrUpdateRoadmap = async (req, res) => {
    try {
        const userId = req.user.id;
        const { milestones } = req.body;

        const roadmap = await Roadmap.findOneAndUpdate(
            { userId },
            { milestones },
            { new: true, upsert: true }
        );

        res.status(200).json(roadmap);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete user's roadmap
exports.deleteRoadmap = async (req, res) => {
    try {
        const userId = req.user.id;
        await Roadmap.findOneAndDelete({ userId });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};