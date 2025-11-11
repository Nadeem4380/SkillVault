INSERT INTO users (username, email, password, created_at) VALUES
('john_doe', 'john@example.com', 'hashed_password_1', NOW()),
('jane_smith', 'jane@example.com', 'hashed_password_2', NOW());

INSERT INTO projects (user_id, title, description, tech_stack, github_link, demo_link, created_at) VALUES
(1, 'Personal Website', 'A personal portfolio website to showcase my work.', 'HTML, CSS, JavaScript', 'https://github.com/john_doe/personal-website', 'https://john_doe.com', NOW()),
(1, 'Weather App', 'A web application that provides weather updates.', 'React, Node.js', 'https://github.com/john_doe/weather-app', 'https://john_doe.com/weather', NOW()),
(2, 'E-commerce Store', 'An online store for selling products.', 'Django, PostgreSQL', 'https://github.com/jane_smith/ecommerce-store', 'https://jane_smith.com/store', NOW());

INSERT INTO resumes (user_id, personal_info, education, experience, skills, projects, certifications, created_at) VALUES
(1, 'John Doe, Web Developer', 'B.Sc. in Computer Science', '2 years at XYZ Company', 'JavaScript, React, Node.js', 'Personal Website, Weather App', 'Certified Web Developer', NOW()),
(2, 'Jane Smith, Data Scientist', 'M.Sc. in Data Science', '3 years at ABC Corp', 'Python, Machine Learning', 'E-commerce Store', 'Certified Data Scientist', NOW());

INSERT INTO roadmaps (user_id, career_path, milestones, created_at) VALUES
(1, 'Web Developer', 'Learn HTML, CSS, JavaScript, React, Node.js', NOW()),
(2, 'Data Scientist', 'Learn Python, Data Analysis, Machine Learning', NOW());