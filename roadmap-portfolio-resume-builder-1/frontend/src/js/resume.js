// This file contains the logic for the resume builder, including form handling and PDF generation.

document.addEventListener('DOMContentLoaded', function() {
    const resumeForm = document.getElementById('resume-form');
    const generateButton = document.getElementById('generate-resume');
    const downloadButton = document.getElementById('download-resume');

    generateButton.addEventListener('click', function(event) {
        event.preventDefault();
        const formData = new FormData(resumeForm);
        const resumeData = Object.fromEntries(formData.entries());
        generateResume(resumeData);
    });

    downloadButton.addEventListener('click', function(event) {
        event.preventDefault();
        downloadResume();
    });

    function generateResume(data) {
        // Logic to generate resume content
        const resumeContent = `
            <h1>${data.name}</h1>
            <p>${data.email}</p>
            <h2>Education</h2>
            <p>${data.education}</p>
            <h2>Experience</h2>
            <p>${data.experience}</p>
            <h2>Skills</h2>
            <p>${data.skills}</p>
            <h2>Projects</h2>
            <p>${data.projects}</p>
            <h2>Certifications</h2>
            <p>${data.certifications}</p>
        `;
        document.getElementById('resume-preview').innerHTML = resumeContent;
    }

    function downloadResume() {
        const resumePreview = document.getElementById('resume-preview').innerHTML;
        const blob = new Blob([resumePreview], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});