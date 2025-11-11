# Roadmap, Portfolio, and Resume Builder

This project is a comprehensive web application designed to help users build their learning roadmap, create an online portfolio, and generate resumes. The application is built using HTML, CSS, and JavaScript for the frontend, with an SQL backend to manage user data and content.

## Features

- **User Authentication**: Secure login and signup functionality with session management.
- **Personalized Roadmap**: Users can view a customized learning roadmap based on their career goals.
- **Portfolio Builder**: A user-friendly interface for creating and managing an online portfolio.
- **Resume Generator**: An interactive form that allows users to input their information and generate a downloadable resume.
- **AI Integration**: Utilizes free AI APIs for content generation and suggestions to enhance user experience.

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

### Prerequisites

- Node.js
- npm
- SQL Database (e.g., MySQL, PostgreSQL)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd roadmap-portfolio-resume-builder
   ```

2. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Navigate to the backend directory and install dependencies:
   ```
   cd ../backend
   npm install
   ```

4. Set up the database using the provided SQL scripts in the `sql` directory.

5. Configure environment variables in the `.env` files based on the `.env.example` files.

### Running the Application

- Start the backend server:
  ```
  cd backend
  npm start
  ```

- Start the frontend application:
  ```
  cd frontend
  npm start
  ```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for more details.