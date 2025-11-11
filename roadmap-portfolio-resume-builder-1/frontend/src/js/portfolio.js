// This file manages the portfolio builder functionalities, including adding and displaying projects.

document.addEventListener("DOMContentLoaded", function() {
    const projectForm = document.getElementById("project-form");
    const projectList = document.getElementById("project-list");

    // Load existing projects from local storage or database
    loadProjects();

    // Event listener for form submission
    projectForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const projectTitle = document.getElementById("project-title").value;
        const projectDescription = document.getElementById("project-description").value;
        const projectTechStack = document.getElementById("project-tech-stack").value;
        const projectLink = document.getElementById("project-link").value;
        const projectImage = document.getElementById("project-image").files[0];

        if (projectTitle && projectDescription) {
            addProject(projectTitle, projectDescription, projectTechStack, projectLink, projectImage);
            projectForm.reset();
        } else {
            alert("Please fill in all required fields.");
        }
    });

    function loadProjects() {
        // Fetch projects from the backend or local storage
        fetch('/api/projects')
            .then(response => response.json())
            .then(data => {
                data.forEach(project => {
                    displayProject(project);
                });
            })
            .catch(error => console.error('Error loading projects:', error));
    }

    function addProject(title, description, techStack, link, image) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("techStack", techStack);
        formData.append("link", link);
        if (image) {
            formData.append("image", image);
        }

        fetch('/api/projects', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            displayProject(data);
        })
        .catch(error => console.error('Error adding project:', error));
    }

    function displayProject(project) {
        const projectItem = document.createElement("div");
        projectItem.classList.add("project-item");
        projectItem.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p><strong>Tech Stack:</strong> ${project.techStack}</p>
            <a href="${project.link}" target="_blank">View Project</a>
            ${project.image ? `<img src="${project.image}" alt="${project.title} image" />` : ''}
        `;
        projectList.appendChild(projectItem);
    }
});