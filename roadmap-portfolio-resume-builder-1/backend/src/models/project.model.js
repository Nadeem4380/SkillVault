const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    techStack: {
        type: [String],
        required: true,
    },
    githubLink: {
        type: String,
        required: true,
    },
    demoLink: {
        type: String,
    },
    images: {
        type: [String],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;