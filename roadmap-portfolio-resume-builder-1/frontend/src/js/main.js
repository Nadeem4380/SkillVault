// main.js

document.addEventListener("DOMContentLoaded", function() {
    // Initialize event listeners for navigation
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const targetPage = this.getAttribute("href");
            loadPage(targetPage);
        });
    });

    // Function to load pages dynamically
    function loadPage(page) {
        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then(html => {
                document.getElementById("content").innerHTML = html;
            })
            .catch(error => {
                console.error("There was a problem with the fetch operation:", error);
            });
    }

    // Load the default page
    loadPage("public/dashboard.html");
});