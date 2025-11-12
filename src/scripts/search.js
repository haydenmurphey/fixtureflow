document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const autocompleteResults = document.getElementById('autocomplete-results');

    /**
     * Finds a team in the data and redirects to its page.
     * @param {string} teamName - The name of the team to search for.
     */
    function searchForTeam(teamName) {
        if (!teamName) return;

        let foundTeam = null;

        // Find the exact team match (case-insensitive)
        for (const league of leagues) {
            const team = league.teams.find(t => t.toLowerCase() === teamName.toLowerCase());
            if (team) {
                foundTeam = team;
                break;
            }
        }

        if (foundTeam) {
            // Redirect to the team page
            window.location.href = `team.html?name=${encodeURIComponent(foundTeam)}`;
        } else {
            alert('Team not found!');
        }
    }

    // --- Autocomplete Logic ---
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        autocompleteResults.innerHTML = ''; // Clear previous results

        if (!query) {
            autocompleteResults.style.display = 'none'; // Hide if input is empty
            return;
        }

        const suggestions = [];
        // Gather all teams that include the search query
        for (const league of leagues) {
            league.teams.forEach(team => {
                if (team.toLowerCase().includes(query)) {
                    suggestions.push(team);
                }
            });
        }

        // Display suggestions if any are found
        if (suggestions.length > 0) {
            suggestions.forEach(team => {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.textContent = team;
                
                // Add click event to each suggestion
                suggestionDiv.addEventListener('click', function() {
                    searchInput.value = team; // Fill input with clicked team
                    autocompleteResults.style.display = 'none'; // Hide suggestions
                    searchForTeam(team); // Immediately navigate to the team page
                });
                
                autocompleteResults.appendChild(suggestionDiv);
            });
            autocompleteResults.style.display = 'block'; // Show the suggestions container
        } else {
            autocompleteResults.style.display = 'none'; // Hide if no suggestions
        }
    });

    // --- Handle "Enter" Key Press ---
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents any default form submission
            const query = this.value.trim();
            autocompleteResults.style.display = 'none'; // Hide suggestions
            searchForTeam(query);
        }
    });

    // --- Hide Suggestions When Clicking Elsewhere ---
    document.addEventListener('click', function(event) {
        // Hide the autocomplete results if the click is outside the search input
        if (!searchInput.contains(event.target)) {
            autocompleteResults.style.display = 'none';
        }
    });
});