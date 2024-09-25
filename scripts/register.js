// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Populate birthday selects
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 2024 - 1980 + 1 }, (_, i) => 1980 + i);

    // Define traits as regular constants (remove `export`)
    const positiveTraits = [
        'Adventurous', 'Romantic', 'Curious', 'Creative', 'Cheerful', 'Calm', 'Courageous', 
        'Sensitive', 'Imaginative', 'Energetic', 'Compassionate', 'Dramatic', 'Humorous', 
        'Intelligent', 'Optimistic', 'Leaderly', 'Honest', 'Playful', 'Caring', 
        'Independent', 'Strong', 'Loyal'
    ];

    const neutralTraits = [
        'Ambitious', 'Complex', 'Dreamy', 'Mellow', 'Proud', 'Reserved', 
        'Sensitive', 'Sarcastic', 'Competitive', 'Formal', 'Logical'
    ];

    const negativeTraits = [
        'Anxious', 'Aggressive', 'Cynical', 'Nihilistic', 'Pessimistic', 'Rebellious', 
        'Lazy', 'Apathetic', 'Jealous', 'Selfish', 'Fearful', 'Impatient', 'Impulsive', 
        'Irritable', 'Hostile', 'Stubborn', 'Manipulative'
    ];

    // Get references to the select elements
    const birthMonthSelect = document.getElementById('birth-month');
    const birthDaySelect = document.getElementById('birth-day');
    const birthYearSelect = document.getElementById('birth-year');
    const positiveTraitSelect = document.getElementById('positive-trait');
    const neutralTraitSelect = document.getElementById('neutral-trait');
    const negativeTraitSelect = document.getElementById('negative-trait');

    // Populate the birthday and trait select elements
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        birthMonthSelect.appendChild(option);
    });
    days.forEach(day => {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        birthDaySelect.appendChild(option);
    });
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        birthYearSelect.appendChild(option);
    });
    positiveTraits.forEach(trait => {
        const option = document.createElement('option');
        option.value = trait;
        option.textContent = trait;
        positiveTraitSelect.appendChild(option);
    });
    neutralTraits.forEach(trait => {
        const option = document.createElement('option');
        option.value = trait;
        option.textContent = trait;
        neutralTraitSelect.appendChild(option);
    });
    negativeTraits.forEach(trait => {
        const option = document.createElement('option');
        option.value = trait;
        option.textContent = trait;
        negativeTraitSelect.appendChild(option);
    });

    // Check if there is existing user data in localStorage and pre-populate the form
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
        document.getElementById('email').value = storedUserData.email;
        document.getElementById('username').value = storedUserData.username;
        birthMonthSelect.value = storedUserData.birthday.split(' ')[0];
        birthDaySelect.value = storedUserData.birthday.split(' ')[1].replace(',', '');
        birthYearSelect.value = storedUserData.birthday.split(' ')[2];
        positiveTraitSelect.value = storedUserData.traits.positive;
        neutralTraitSelect.value = storedUserData.traits.neutral;
        negativeTraitSelect.value = storedUserData.traits.negative;
    }

    // Handle the registration form submission
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const birthMonth = birthMonthSelect.value;
        const birthDay = birthDaySelect.value;
        const birthYear = birthYearSelect.value;
        const positiveTrait = positiveTraitSelect.value;
        const neutralTrait = neutralTraitSelect.value;
        const negativeTrait = negativeTraitSelect.value;

        // Create user data object
        const userData = {
            email,
            username,
            password,
            birthday: `${birthMonth} ${birthDay}, ${birthYear}`,
            traits: {
                positive: positiveTrait,
                neutral: neutralTrait,
                negative: negativeTrait,
            }
        };

        // Store the user data in localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(userData));

        // Mark the user as logged in for this session only
        sessionStorage.setItem('isLoggedIn', 'true');

        // Redirect to List.html after successful registration
        window.location.href = 'List.html';
    });
});
