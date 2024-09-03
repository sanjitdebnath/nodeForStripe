document.addEventListener('DOMContentLoaded', function() {
    const errorColor = '#bd0101';
    const successColor = '#01bd02';
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const requestBody = {};
        for (const [key, value] of formData.entries()) {
            if(!value)
            {
                displayError(usernameInput, key+' is required.');
                return;
            }
            requestBody[key] = value;
        }

        fetch('http://localhost:8000/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data)
            if(!data.status){
                addMessage(data.message,errorColor);
            }else{
                addMessage(data.message,successColor);
                localStorage.setItem("authToken", data.token);
                setTimeout(() => {
                    window.location.href = "/";
                }, 3000)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    const addMessage = (message, color) => {
        const messagesDiv = document.querySelector('#messages');
        messagesDiv.style.backgroundColor = color;
        messagesDiv.style.display = 'block';
        messagesDiv.innerHTML = message;

    };

    function clearErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => error.remove());
    }
});
