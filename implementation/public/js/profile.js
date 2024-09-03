document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function() {
        const userData = localStorage.getItem("userData");
    
        if (userData) {
            const username = JSON.parse(userData).username;
            const name = document.querySelector("#name");
            name.textContent = username;
        } else {
            console.log("No userData found in localStorage.");
        }
    }, 1000);

    const profile = document.querySelector(".profile");
    const logout = document.querySelector(".logout");
    profile.addEventListener("click", function (event) {
        this.classList.toggle("active");
        event.stopPropagation(); // Prevent the click from bubbling up to the document
    });

    document.addEventListener("click", function (event) {
        // Check if the click happened outside the profile element
        if (!profile.contains(event.target)) {
            profile.classList.remove("active");
        }
    });

    logout.addEventListener("click", function (event) {
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
        redirectToLogin();
    });
});