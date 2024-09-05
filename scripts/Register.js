import axios from 'axios';

// Populate birthday selects
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 2024 - 1980 + 1 }, (_, i) => 1980 + i);

const positiveTraits = ['Optimistic', 'Confident', 'Generous'];
const neutralTraits = ['Calm', 'Introverted', 'Logical'];
const negativeTraits = ['Pessimistic', 'Anxious', 'Impatient'];

const birthMonthSelect = document.getElementById('birth-month');
const birthDaySelect = document.getElementById('birth-day');
const birthYearSelect = document.getElementById('birth-year');
const positiveTraitSelect = document.getElementById('positive-trait');
const neutralTraitSelect = document.getElementById('neutral-trait');
const negativeTraitSelect = document.getElementById('negative-trait');

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

const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (event) => {
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

    try {
        const response = await axios.post('https://api.example.com/register', userData); // Replace with actual API URL
        console.log('User registered:', response.data);
        alert('Registration successful');
    } catch (error) {
        console.error('Error registering user:', error);
        alert('There was an error with the registration. Please try again.');
    }
});
