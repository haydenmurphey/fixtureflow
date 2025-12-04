document.addEventListener('DOMContentLoaded', function() {
    const teamNameHeader = document.getElementById('team-name-header');
    const teamDetailsContent = document.getElementById('team-details-content');

    // Get the search parameters from the page's URL
    const params = new URLSearchParams(window.location.search);
    const teamName = params.get('name');

    if (teamName) {
        // 1. Look up the ID in the teamData object (from data.js)
        const teamId = teamData[teamName];

        if (teamId) {
            // 2. Fetch data from our PHP proxy
            fetch(`proxy.php?id=${teamId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    // 3. Update the Page Title
                    document.title = data.name;
                    teamNameHeader.textContent = data.name.toUpperCase();

                    // 4. Render the Content (Logo + Facts)
                    renderTeamDetails(data);
                })
                .catch(error => {
                    console.error('Error fetching team data:', error);
                    teamDetailsContent.innerHTML = `<p>Error loading data for ${teamName}. Please try again later.</p>`;
                });
        } else {
            // If team exists in URL but not in our ID list
            teamNameHeader.textContent = 'Team ID Not Found';
            teamDetailsContent.innerHTML = `<p>Sorry, we don't have an ID on file for "${teamName}".</p>`;
        }

    } else {
        // If the URL has no team name parameter
        teamNameHeader.textContent = 'No Team Specified';
        teamDetailsContent.textContent = 'Please search for a team from the homepage.';
    }
});

function renderTeamDetails(data) {
    const container = document.getElementById('team-details-content');
    
    // Safely get coach name if it exists
    const coachName = data.coach && data.coach.name ? data.coach.name : "N/A";
    
    // Format the list of active competitions
    const competitions = data.runningCompetitions 
        ? data.runningCompetitions.map(c => c.name).join(', ') 
        : "None";

    // Create the HTML structure
    const html = `
        <div class="team-profile" style="text-align: center; padding: 20px;">
            
            <div class="team-logo-container" style="margin-bottom: 20px;">
                <img src="${data.crest}" alt="${data.name} Crest" style="width: 150px; height: auto;">
            </div>

            <h2 style="margin-bottom: 30px; font-size: 2rem;">${data.name}</h2>

            <div class="fun-facts" style="text-align: left; background-color: #f8f9fa; padding: 20px; border-radius: 8px; display: inline-block; width: 100%; max-width: 600px;">
                <h3 style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">Fun Facts</h3>
                
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 10px;"><strong>📅 Founded:</strong> ${data.founded}</li>
                    <li style="margin-bottom: 10px;"><strong>🏟️ Venue:</strong> ${data.venue}</li>
                    <li style="margin-bottom: 10px;"><strong>🎨 Club Colors:</strong> ${data.clubColors}</li>
                    <li style="margin-bottom: 10px;"><strong>👔 Head Coach:</strong> ${coachName}</li>
                    <li style="margin-bottom: 10px;"><strong>🏆 Active Competitions:</strong> ${competitions}</li>
                    <li style="margin-bottom: 10px;"><strong>💻 Website:</strong> <a href="${data.website}" target="_blank" style="color: #001D44;">${data.website}</a></li>
                </ul>
            </div>

        </div>
    `;

    container.innerHTML = html;
}