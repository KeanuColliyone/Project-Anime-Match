document.addEventListener('DOMContentLoaded', () => {
    const watchlistItemsContainer = document.getElementById('watchlist-items');

    // Function to load watchlist from localStorage and display it
    function loadWatchlist() {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        // Clear existing content
        watchlistItemsContainer.innerHTML = '';

        // Display each anime in the watchlist
        if (watchlist.length > 0) {
            watchlist.forEach((anime) => {
                const watchlistItem = document.createElement('div');
                watchlistItem.classList.add('watchlist-item');

                const watchedState = JSON.parse(localStorage.getItem('watchedState')) || {};
                const watchedClass = watchedState[anime.mal_id] ? 'watched-marked' : 'watched';
                const watchedText = watchedState[anime.mal_id] ? 'Watched' : 'Not Watched';

                watchlistItem.innerHTML = `
                    <div class="watchlist-info">
                        <h3>${anime.title}</h3>
                        <p>Genres: ${anime.genres}</p>
                        <p>Description: ${anime.synopsis}</p>
                    </div>
                    <div class="watchlist-image">
                        <img src="${anime.image}" alt="${anime.title}">
                        <div class="watchlist-buttons">
                            <button class="watched-btn ${watchedClass}" data-id="${anime.mal_id}">${watchedText}</button>
                            <button class="remove-btn remove" data-id="${anime.mal_id}">Remove</button>
                        </div>
                    </div>
                `;

                // Add the watchlist item to the container
                watchlistItemsContainer.appendChild(watchlistItem);
            });
        } else {
            // Display message if the watchlist is empty
            watchlistItemsContainer.innerHTML = '<p>Your watchlist is empty!</p>';
        }
    }

    // Function to toggle watched status
    function toggleWatched(animeId) {
        const watchedState = JSON.parse(localStorage.getItem('watchedState')) || {};
        watchedState[animeId] = !watchedState[animeId]; // Toggle watched state
        localStorage.setItem('watchedState', JSON.stringify(watchedState)); // Save to localStorage
        loadWatchlist(); // Reload the watchlist to reflect changes
    }

    // Event listener for Watched and Remove buttons
    watchlistItemsContainer.addEventListener('click', (event) => {
        const animeId = parseInt(event.target.getAttribute('data-id'));

        if (event.target.classList.contains('remove-btn')) {
            removeFromWatchlist(animeId);
        } else if (event.target.classList.contains('watched-btn')) {
            toggleWatched(animeId); // Toggle watched status
        }
    });

    // Function to remove an anime from the watchlist
    function removeFromWatchlist(animeId) {
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        watchlist = watchlist.filter(anime => anime.mal_id !== animeId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        loadWatchlist(); // Reload the watchlist after removing
    }

    // Load watchlist on page load
    loadWatchlist();
});
