// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const securityQuestion = document.getElementById('securityQuestion').value;
        const securityAnswer = document.getElementById('securityAnswer').value;

        // Basic client-side validation
        if (name.length < 2) {
            alert('Name must be at least 2 characters long.');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        if (!securityQuestion) {
            alert('Please select a security question.');
            return;
        }

        if (securityAnswer.length < 3) {
            alert('Security answer must be at least 3 characters long.');
            return;
        }

        // If all checks pass, you can perform an AJAX request or a fetch to the server
        // For demonstration purposes, we will just log the values and redirect

        console.log({
            name,
            email,
            password,
            securityQuestion,
            securityAnswer
        });

        // Simulate form submission to a server
        setTimeout(() => {
            // Redirect to index.html after successful sign-up
            window.location.href = 'index.html';
        }, 1000); // Simulating a delay for form submission
    });
});
