# Roadmap, Portfolio, and Resume Builder

This project is a comprehensive web application designed to help users build their learning roadmap, create an online portfolio, and generate resumes. It integrates with free AI APIs for content generation and suggestions, providing a seamless experience for users looking to enhance their professional profiles.

## Features

- **User Authentication**: Secure login and signup functionality with options for social logins (Google/GitHub).
- **Personalized Dashboard**: Users can view their personalized learning roadmap, progress tracker, and recommended resources.
- **Portfolio Builder**: Users can create and manage their portfolios, showcasing their projects with various templates.
- **Resume Builder**: An interactive resume generator that allows users to input their information and download a PDF version.
- **AI Integration**: Utilizes AI APIs to provide suggestions for roadmaps and enhance resume content.
- **Responsive Design**: Fully responsive layout that works on both mobile and desktop devices.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Three.js for 3D animations
- **Backend**: Node.js, Express, SQL for database management
- **Database**: SQL (MySQL/PostgreSQL)
- **Deployment**: Docker for containerization

## Project Structure

```
roadmap-portfolio-resume-builder
├── frontend
│   ├── public
│   ├── src
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── backend
│   ├── package.json
│   ├── src
│   ├── .env.example
│   └── README.md
├── sql
│   ├── schema.sql
│   └── seed.sql
├── docker
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── scripts
│   ├── setup-db.sh
│   └── seed-db.sh
├── .gitignore
├── README.md
└── LICENSE
```

## Getting Started

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd roadmap-portfolio-resume-builder
   ```

2. **Set Up the Frontend**:
   - Navigate to the `frontend` directory.
   - Install dependencies:
     ```
     npm install
     ```
   - Start the development server:
     ```
     npm start
     ```

3. **Set Up the Backend**:
   - Navigate to the `backend` directory.
   - Install dependencies:
     ```
     npm install
     ```
   - Start the backend server:
     ```
     npm start
     ```

4. **Database Setup**:
   - Run the setup script to create the database and tables:
     ```
     ./scripts/setup-db.sh
     ```
   - Seed the database with initial data:
     ```
     ./scripts/seed-db.sh
     ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.