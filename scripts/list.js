document.addEventListener('DOMContentLoaded', async () => {
    const topPickImg = document.getElementById('top-pick-img');
    const topPickTitle = document.getElementById('top-pick-title');
    const topPickGenre = document.getElementById('top-pick-genre');
    const topPickRating = document.getElementById('top-pick-rating'); // Rating element
    const topPickLabel = document.getElementById('top-pick-label');
    const topPickDescription = document.getElementById('anime-description');
    const addToWatchlistBtn = document.getElementById('add-watchlist-btn');
    const otherAnimeList = document.getElementById('other-anime-list');

    let currentAnime = null; // Store the current selected anime object

    // Define personality traits mapped to genres
    const personalityToGenreMap = {
        // Positive Traits
        "Adventurous": ["Action", "Adventure"],
        "Romantic": ["Romance", "Shoujo"],
        "Curious": ["Sci-Fi", "Mystery"],
        "Creative": ["Fantasy", "Supernatural"],
        "Cheerful": ["Comedy", "Slice of Life"],
        "Calm": ["Slice of Life", "Drama"],
        "Courageous": ["Action", "Adventure"],
        "Sensitive": ["Drama", "Romance"],
        "Imaginative": ["Fantasy", "Supernatural"],
        "Energetic": ["Action", "Sports"],
        "Compassionate": ["Drama", "Romance"],
        "Dramatic": ["Drama", "Supernatural"],
        "Humorous": ["Comedy", "Slice of Life"],
        "Intelligent": ["Psychological", "Sci-Fi"],
        "Optimistic": ["Fantasy", "Shounen"],
        "Leaderly": ["Action", "Military", "Superhero"],
        "Honest": ["Drama", "Slice of Life"],
        "Playful": ["Comedy", "Slice of Life"],
        "Caring": ["Drama", "Romance"],
        "Independent": ["Adventure", "Action"],
        "Strong": ["Action", "Superhero"],
        "Loyal": ["Shounen", "Sports"],

        // Neutral Traits
        "Ambitious": ["Action", "Military"],
        "Aggressive": ["Action", "Thriller"],
        "Complex": ["Psychological", "Mystery"],
        "Dreamy": ["Fantasy", "Adventure"],
        "Mellow": ["Slice of Life", "Drama"],
        "Proud": ["Sports", "Shounen"],
        "Reserved": ["Drama", "Slice of Life"],
        "Sensitive": ["Romance", "Drama"],
        "Sarcastic": ["Comedy", "Slice of Life"],
        "Competitive": ["Sports", "Shounen"],
        "Formal": ["Historical", "Military"],
        "Logical": ["Sci-Fi", "Psychological"],

        // Negative Traits
        "Anxious": ["Psychological", "Drama"],
        "Aggressive": ["Thriller", "Action"],
        "Cynical": ["Psychological", "Mystery"],
        "Nihilistic": ["Psychological", "Horror"],
        "Pessimistic": ["Drama", "Psychological"],
        "Rebellious": ["Action", "Adventure"],
        "Lazy": ["Comedy", "Slice of Life"],
        "Apathetic": ["Drama", "Psychological"],
        "Jealous": ["Drama", "Thriller"],
        "Selfish": ["Thriller", "Psychological"],
        "Fearful": ["Horror", "Psychological"],
        "Impatient": ["Action", "Sports"],
        "Impulsive": ["Action", "Shounen"],
        "Irritable": ["Drama", "Thriller"],
        "Hostile": ["Action", "Thriller"],
        "Stubborn": ["Shounen", "Action"],
        "Manipulative": ["Thriller", "Psychological"],
    };

    // Retrieve user data from localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    let userPersonalityTraits = [];

    // Check if userData exists and has personality traits
    if (storedUserData && storedUserData.traits) {
        const { positive, neutral, negative } = storedUserData.traits;
        userPersonalityTraits = [positive, neutral, negative];
        console.log("Personality traits retrieved from userData:", userPersonalityTraits);
    } else {
        // Use default traits if none are found
        userPersonalityTraits = ["Adventurous", "Creative", "Courageous"];
        console.log("No user data found in localStorage, using default traits.");
    }

    // Fetch anime data from Jikan API and ensure we always have 10 anime picks
    async function fetchAnimeRecommendations() {
        try {
            let animeList = [];
            let page = 1;

            // Fetch fewer pages to reduce the number of requests
            while (animeList.length < 30) {  // Adjust to a lower threshold
                const response = await axios.get(`https://api.jikan.moe/v4/top/anime?page=${page}`);
                if (response.data && response.data.data) {
                    animeList = animeList.concat(response.data.data);
                    page++;
                } else {
                    console.error("Unexpected API response format", response);
                    break; // Stop if API response is unexpected
                }

                // Add a short delay to avoid hitting rate limits
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between requests
            }

            console.log("Fetched anime list:", animeList); // Debugging: Check fetched data
            return animeList;
        } catch (error) {
            console.error('Error fetching anime data:', error);
            return []; // Return an empty array on error
        }
    }


    function filterAndScoreAnime(animeList) {
        // Filter out anime that are already in the watchlist
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const watchlistIds = watchlist.map(anime => anime.mal_id);

        animeList = animeList.filter(anime => !watchlistIds.includes(anime.mal_id));

        console.log("Anime list after filtering watchlist:", animeList); // Debugging: Check after filtering

        // Score anime based on genre matches with personality traits
        animeList = animeList.map(anime => {
            const genres = anime.genres.map(genre => genre.name); // Get genres of the anime
            let points = 0;

            // Calculate points based on matching genres with user personality traits
            userPersonalityTraits.forEach(trait => {
                const matchingGenres = personalityToGenreMap[trait] || [];
                genres.forEach(genre => {
                    if (matchingGenres.includes(genre)) {
                        points += 1; // Add a point for each genre match
                    }
                });
            });

            return {
                ...anime,
                points: points,
            };
        });

        console.log("Anime list after scoring:", animeList); // Debugging: Check after scoring

        // Sort anime by points first, and by popularity (members count) if points are equal
        animeList.sort((a, b) => {
            if (b.points === a.points) {
                return b.members - a.members; // Sort by popularity (members) if points are the same
            }
            return b.points - a.points; // Sort by points (descending order)
        });

        return animeList.slice(0, 10); // Return only the top 10 picks
    }

    async function loadAnimeRecommendations() {
        const animeList = await fetchAnimeRecommendations();
        if (animeList.length === 0) {
            console.error("No anime data fetched!");
            return; // Exit if no anime was fetched
        }

        const topAnimeList = filterAndScoreAnime(animeList);
        if (topAnimeList.length === 0) {
            console.error("No anime to display after filtering and scoring!");
            return; // Exit if no anime to display
        }

        // Automatically set the first anime as the top pick
        updateTopPick(topAnimeList[0], 1);

        // Render the remaining anime picks
        renderAnimePicks(topAnimeList);
    }

    function renderAnimePicks(animeList) {
        otherAnimeList.innerHTML = ''; // Clear the previous list
        animeList.forEach((anime, index) => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('anime-card');

            // Generate the star rating HTML
            const starRating = getStarRating(anime.score);

            animeCard.innerHTML = `
                <div class="anime-card-number">${index + 1}</div>
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <h4>${anime.title}</h4>
                <p>Points: ${anime.points}</p> <!-- Display points -->
                <div class="star-rating">${starRating}</div> <!-- Display star rating -->
            `;

            // Click event to select this anime as the top pick
            animeCard.addEventListener('click', () => {
                updateTopPick(anime, index + 1);
            });

            otherAnimeList.appendChild(animeCard);
        });
    }

    // Function to update the top pick section
    function updateTopPick(anime, index) {
        currentAnime = anime; // Store the selected anime object

        topPickImg.src = anime.images.jpg.large_image_url;
        topPickTitle.textContent = anime.title;
        topPickGenre.textContent = anime.genres.map(genre => genre.name).join(', ');
        topPickDescription.textContent = anime.synopsis || "No description available.";
        topPickRating.innerHTML = getStarRating(anime.score); // Display star rating in top pick
        topPickLabel.textContent = index === 1 ? "Top Pick" : `#${index} Pick`;

        console.log(`Top pick updated to: ${anime.title} (#${index} pick)`); // Debugging
    }

    // Add to Watchlist button click event
    addToWatchlistBtn.addEventListener('click', () => {
        if (currentAnime) {
            addToWatchlist(currentAnime);
        }
    });

    // Function to add an anime to the watchlist
    function addToWatchlist(anime) {
        // Retrieve existing watchlist from localStorage or create an empty array
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        // Check if the anime is already in the watchlist
        if (!watchlist.some(item => item.mal_id === anime.mal_id)) {
            // Add the new anime to the watchlist array
            watchlist.push({
                mal_id: anime.mal_id,
                title: anime.title,
                image: anime.images.jpg.image_url,
                genres: anime.genres.map(genre => genre.name).join(', '),
                synopsis: anime.synopsis || 'No description available.',
            });

            // Save the updated watchlist back to localStorage
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            alert(`${anime.title} has been added to your watchlist!`);
        } else {
            alert(`${anime.title} is already in your watchlist!`);
        }
    }

    // Helper function to generate star rating HTML
    function getStarRating(score) {
        if (!score) return "N/A";

        const maxStars = 5;
        const fullStars = Math.floor(score / 2); // Convert score to a 5-star scale (full stars)
        const halfStars = score % 2 >= 1 ? 1 : 0; // Determine if we need a half star
        const emptyStars = maxStars - fullStars - halfStars; // Empty stars fill the rest

        let starHtml = '';

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            starHtml += '<i class="fas fa-star" style="color: white;"></i>';
        }

        // Add half star if necessary
        if (halfStars) {
            starHtml += '<i class="fas fa-star-half-alt" style="color: white;"></i>';
        }

        // Add empty stars
        for (let i = 0; i < emptyStars; i++) {
            starHtml += '<i class="far fa-star" style="color: white;"></i>';
        }

        return starHtml;
    }

    // Load the anime recommendations when the page loads
    loadAnimeRecommendations();
});
