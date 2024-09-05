import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        axios.get('/api/recommendations', {
            params: {
                personality_traits: "YOUR_PERSONALITY_TRAITS" // Replace with actual user traits
            }
        })
        .then(response => {
            setRecommendations(response.data.recommendations);
        })
        .catch(error => console.error('Error fetching recommendations:', error));
    }, []);

    return (
        <div>
            <h1>Recommended Anime</h1>
            <ul>
                {recommendations.map((anime, index) => (
                    <li key={index}>{anime.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
