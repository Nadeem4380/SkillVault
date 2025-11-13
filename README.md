# SkillVault 🎯

**Build Your Career Path | Master Your Growth**

SkillVault is a modern web application designed to help professionals and students plan their career journey through personalized learning roadmaps and showcase their skills with stunning portfolio pages.

![SkillVault Banner](https://img.shields.io/badge/SkillVault-Career%20Planning-0066ff?style=for-the-badge)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)
[![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)]()

## ✨ Features

### 🗺️ **Roadmap Builder**
- **Personalized Career Paths**: Enter your dream job and get a tailored learning roadmap
- **Timeline Visualization**: Track your progress through structured learning phases
- **Skill Tracking**: Monitor key skills required for your target role
- **Curated Resources**: Access courses, books, and project ideas categorized by learning stage
- **Progress Saving**: Save and revisit your roadmaps anytime

### 💼 **Portfolio Builder**
- **Live Preview**: See your portfolio changes in real-time
- **Multiple Templates**: Choose from Modern, Classic, and Showcase designs
- **Customizable Design**: Personalize accent colors and layout styles
- **Profile Management**: Add bio, skills, education, and contact information
- **Project Showcase**: Display your work with project cards, descriptions, and links
- **Resume Export**: Generate and download professional resumes
- **Data Export**: Export your portfolio data as JSON

### 🎨 **User Experience**
- **Dark/Light Theme**: Seamless theme switching with persistent preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Profile Management**: Edit personal information and track history
- **Toast Notifications**: User-friendly feedback for all actions
- **Accessible UI**: Built with accessibility best practices

## 🚀 Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Icons**: Font Awesome 6.4.0
- **Storage**: LocalStorage for data persistence
- **Design**: Custom CSS with CSS Variables for theming
- **Architecture**: Modular JavaScript with component-based structure

## 📁 Project Structure

```
SkillVault/
├── index.html           # Landing page with main features
├── roadmap.html         # Career roadmap builder interface
├── portfolio.html       # Portfolio builder interface
├── script.js            # Main app logic and event handlers
├── portfolio.js         # Portfolio builder functionality
├── styles.css           # Main stylesheet with theme variables
├── portfolio.css        # Portfolio-specific styles
└── README.md           # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional dependencies or build tools required!

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nadeem4380/SkillVault.git
   cd SkillVault
   ```

2. **Open in browser**
   ```bash
   # Option 1: Open directly
   open index.html
   
   # Option 2: Use a local server (recommended)
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (with npx)
   npx http-server
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`
   - Or simply double-click `index.html` to open it directly

## 📖 Usage Guide

### Building a Career Roadmap

1. **Navigate to the landing page** (`index.html`)
2. **Enter your dream job** in the "Build Roadmap" card
3. **Click "Search"** to generate your personalized roadmap
4. **Explore your journey**:
   - View timeline phases from foundations to mastery
   - Check key skills to develop
   - Browse curated learning resources (courses, books, projects)
5. **Save your roadmap** for future reference
6. **Share** your progress with others

### Creating a Portfolio

1. **Click "Build Portfolio"** from the landing page or navigate to `portfolio.html`
2. **Fill in your information**:
   - **Bio**: Add your name, headline, and summary
   - **Skills**: Add relevant technical and soft skills
   - **Education**: Include your academic background
   - **Projects**: Showcase your work with descriptions and links
   - **Contact**: Provide email, phone, website, and social links
3. **Customize design**:
   - Choose a template (Modern, Classic, or Showcase)
   - Select an accent color
4. **Preview in real-time** on the left panel
5. **Export your work**:
   - Save your portfolio data
   - Download as resume
   - Export as JSON for backup

### Theme & Profile Management

- **Toggle Theme**: Click the moon/sun icon in the header to switch between light and dark modes
- **Access Profile**: Click the user icon to view/edit your profile information
- **View History**: Check your saved roadmaps and portfolios in the profile modal

## 🎯 Key Highlights

- **Zero Dependencies**: Pure vanilla JavaScript - no frameworks, no npm packages
- **Offline Ready**: Works without internet after initial load
- **Fast & Lightweight**: Minimal footprint, instant loading
- **Privacy First**: All data stored locally in your browser
- **Modern UI/UX**: Clean design with smooth animations and transitions
- **Fully Responsive**: Adapts seamlessly to any screen size

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your work**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Test your changes across different browsers
- Ensure responsive design on mobile devices
- Keep accessibility in mind (ARIA labels, keyboard navigation)
- Write clear commit messages

## 🐛 Known Issues & Future Enhancements

### Planned Features
- User authentication and cloud storage
- Social sharing with custom URLs
- More portfolio templates
- PDF export for portfolios
- Integration with LinkedIn and GitHub APIs
- Analytics dashboard for tracking learning progress
- Collaborative roadmap sharing

## 📄 License

This project is licensed under the MIT License - feel free to use, modify, and distribute as needed.

## 👨‍💻 Author

**Nadeem**
- GitHub: [@Nadeem4380](https://github.com/Nadeem4380)

## 🙏 Acknowledgments

- Font Awesome for the comprehensive icon library
- The open-source community for inspiration and best practices
- All contributors who help improve SkillVault

---

<div align="center">
  <p>Built with ❤️ for career growth and professional development</p>
  <p>© 2025 SkillVault. All rights reserved.</p>
</div>
