const AdminController = {
    // Function to get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find(); // Assuming User is the model for user data
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving users", error });
        }
    },

    // Function to approve a portfolio
    approvePortfolio: async (req, res) => {
        const { portfolioId } = req.params;
        try {
            const portfolio = await Portfolio.findByIdAndUpdate(portfolioId, { approved: true }, { new: true });
            if (!portfolio) {
                return res.status(404).json({ message: "Portfolio not found" });
            }
            res.status(200).json(portfolio);
        } catch (error) {
            res.status(500).json({ message: "Error approving portfolio", error });
        }
    },

    // Function to update course suggestions
    updateCourseSuggestions: async (req, res) => {
        const { courseId } = req.params;
        const { suggestion } = req.body;
        try {
            const course = await Course.findByIdAndUpdate(courseId, { suggestion }, { new: true });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.status(200).json(course);
        } catch (error) {
            res.status(500).json({ message: "Error updating course suggestion", error });
        }
    }
};

module.exports = AdminController;