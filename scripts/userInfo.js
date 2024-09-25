document.addEventListener('DOMContentLoaded', () => {
    // Get references to the form elements
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const positiveTraitSelect = document.getElementById('positive-trait');
    const neutralTraitSelect = document.getElementById('neutral-trait');
    const negativeTraitSelect = document.getElementById('negative-trait');
    const birthMonthSelect = document.getElementById('birth-month');
    const birthDaySelect = document.getElementById('birth-day');
    const birthYearSelect = document.getElementById('birth-year');
    const userInfoForm = document.getElementById('userInfoForm');

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


    // Populate the select fields with the imported traits
    populateSelect(positiveTraitSelect, positiveTraits);
    populateSelect(neutralTraitSelect, neutralTraits);
    populateSelect(negativeTraitSelect, negativeTraits);

    // Populate the birthdate fields with options
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 2024 - 1980 + 1 }, (_, i) => 1980 + i);

    populateSelect(birthMonthSelect, months);
    populateSelect(birthDaySelect, days);
    populateSelect(birthYearSelect, years);

    // Retrieve user data from localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    // Populate the form with current data if available
    if (storedUserData) {
        emailInput.value = storedUserData.email || ''; // Set email
        usernameInput.value = storedUserData.username || ''; // Set username

        const birthdayParts = storedUserData.birthday ? storedUserData.birthday.split(' ') : [];
        if (birthdayParts.length === 3) {
            birthMonthSelect.value = birthdayParts[0] || '';
            birthDaySelect.value = birthdayParts[1].replace(',', '') || '';
            birthYearSelect.value = birthdayParts[2] || '';
        }

        positiveTraitSelect.value = storedUserData.traits.positive || positiveTraits[0]; // Set positive trait
        neutralTraitSelect.value = storedUserData.traits.neutral || neutralTraits[0]; // Set neutral trait
        negativeTraitSelect.value = storedUserData.traits.negative || negativeTraits[0]; // Set negative trait
    } else {
        // Set default values if no user data exists
        emailInput.value = '';
        usernameInput.value = '';
        birthMonthSelect.value = months[0];
        birthDaySelect.value = days[0];
        birthYearSelect.value = years[0];
        positiveTraitSelect.value = positiveTraits[0];
        neutralTraitSelect.value = neutralTraits[0];
        negativeTraitSelect.value = negativeTraits[0];
    }

    // Handle form submission to update localStorage
    userInfoForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
        
        // Get updated user data from the form
        const updatedUserData = {
            email: emailInput.value,
            username: usernameInput.value,
            birthday: `${birthMonthSelect.value} ${birthDaySelect.value}, ${birthYearSelect.value}`,
            traits: {
                positive: positiveTraitSelect.value,
                neutral: neutralTraitSelect.value,
                negative: negativeTraitSelect.value,
            },
        };

        // Save the updated user data to localStorage
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        alert('User information updated successfully!');
    });
});

// Helper function to populate a select element with options
function populateSelect(selectElement, optionsArray) {
    optionsArray.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        selectElement.appendChild(option);
    });
}
