document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        // const username = "sanjit98780@yopmail.com";
        // const password = "sanjit@#123";

        // Clear previous error messages
        clearErrors();

        // Validate form inputs
        if (username === '') {
            displayError(usernameInput, 'Username is required.');
            return;
        }

        if (password === '') {
            displayError(passwordInput, 'Password is required.');
            return;
        }

        // Send login request to API
        const requestBody = {
            email: username,
            password: password
        };

        fetch('http://localhost:8000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("authToken", data.token);
            window.location.href = "/";
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    function displayError(input, message) {
        const error = document.createElement('span');
        error.classList.add('error');
        error.textContent = message;
        input.parentElement.appendChild(error);
    }

    function clearErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => error.remove());
    }
});
