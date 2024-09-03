const authToken = localStorage.getItem("authToken")
if (!authToken) {
    redirectToLogin();
} else {
    fetch('http://localhost:8000/user/check-token', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        },
    }).then(response => {
        if (!response.ok) {
            console.log(response)
            redirectToLogin();
        }
        return response.json();
    }).then(data => {
        if (!data._id) {
            localStorage.removeItem("authToken");
            redirectToLogin();
        } else {
            const userData = JSON.stringify(data);
            localStorage.setItem("userData", userData);
        }
    }).catch(error => {
        console.error('Error:', error);
    });

    function redirectToLogin() {
        window.location.href = '/login.html';
    }
}

const stripe = Stripe('pk_test_51OdtuQA3CNYwysx62uYXdH8tQKnryKHSjhI4uKiz40A2OnayrCqKxiMutgTT1ehN7cMasqqoRPchydiCFktwDQiE00jOELiKgE');
const elements = stripe.elements();

const cardElement = elements.create('card');
cardElement.mount('#card-element');

const form = document.getElementById('payment-form');

const successColor = '#00D924';
const errorColor = '#d90000';

const addMessage = (message, color) => {
    const messagesDiv = document.querySelector('#messages');
    messagesDiv.style.color = color;
    messagesDiv.style.display = 'block';
    messagesDiv.innerHTML = message;
    setTimeout(() => {
        messagesDiv.style.display = "none";
    }, 5000)
};


form.addEventListener('submit', async (event) => {

    event.preventDefault();
    const save_card = document.getElementById("save_card");
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    if (error) {
        addMessage(error.message, errorColor);
    } else {
        addMessage("payment method created", successColor);
    }
    const userData = localStorage.getItem("userData");

    const paymentIntent = await fetch('http://localhost:8000/payment/createIntent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({
            amount: 1000,
            currency: 'usd',
            paymentMethod: paymentMethod.id,
            userData: userData,
            save_card : save_card.checked
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON response
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });

        console.log(paymentIntent);

    if (paymentIntent.status) {
        cardElement.clear();
        save_card.checked = false;
        addMessage(paymentIntent.message, successColor);
    } else {
        addMessage(paymentIntent.message, errorColor);
    }
});
