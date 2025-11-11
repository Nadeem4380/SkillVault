const axios = require('axios');

const AI_API_URL = 'https://api.example.com/ai'; // Replace with actual AI API URL
const AI_API_KEY = process.env.AI_API_KEY; // Ensure to set this in your environment variables

class AIService {
    async generateRoadmap(userInput) {
        try {
            const response = await axios.post(`${AI_API_URL}/generate-roadmap`, {
                input: userInput,
                headers: {
                    'Authorization': `Bearer ${AI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error generating roadmap:', error);
            throw new Error('Could not generate roadmap');
        }
    }

    async enhanceResume(resumeData) {
        try {
            const response = await axios.post(`${AI_API_URL}/enhance-resume`, {
                data: resumeData,
                headers: {
                    'Authorization': `Bearer ${AI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error enhancing resume:', error);
            throw new Error('Could not enhance resume');
        }
    }
}

module.exports = new AIService();