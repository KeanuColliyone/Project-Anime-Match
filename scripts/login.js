document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const identifier = document.getElementById('identifier').value; // This can be email or username
        const password = document.getElementById('password').value;

        // Retrieve user data from localStorage
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        // Check if the identifier matches either the email or username, and the password matches
        if (storedUserData &&
            (storedUserData.email === identifier || storedUserData.username === identifier) &&
            storedUserData.password === password) {
            // Mark the user as logged in in sessionStorage
            sessionStorage.setItem('isLoggedIn', 'true');
            // Automatically redirect to List.html
            window.location.href = 'List.html';
        } else {
            alert('Invalid username/email or password. Please try again.');
        }
    });
});
