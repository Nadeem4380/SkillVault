// roadmap.js

document.addEventListener('DOMContentLoaded', () => {
    const roadmapContainer = document.getElementById('roadmap-container');
    const userId = getUserIdFromSession(); // Function to get user ID from session or token

    // Fetch user's roadmap data
    fetch(`/api/roadmap/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderRoadmap(data.roadmap);
            } else {
                roadmapContainer.innerHTML = '<p>Error loading roadmap. Please try again later.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching roadmap:', error);
            roadmapContainer.innerHTML = '<p>Error loading roadmap. Please try again later.</p>';
        });
});

function renderRoadmap(roadmap) {
    const roadmapContainer = document.getElementById('roadmap-container');
    roadmapContainer.innerHTML = ''; // Clear previous content

    roadmap.forEach(milestone => {
        const milestoneElement = document.createElement('div');
        milestoneElement.className = 'milestone';
        milestoneElement.innerHTML = `
            <h3>${milestone.title}</h3>
            <p>${milestone.description}</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${milestone.progress}%;"></div>
            </div>
            <p>${milestone.progress}% completed</p>
        `;
        roadmapContainer.appendChild(milestoneElement);
    });
}

// Function to get user ID from session or token
function getUserIdFromSession() {
    // Implement logic to retrieve user ID from session storage or JWT token
    return sessionStorage.getItem('userId');
}