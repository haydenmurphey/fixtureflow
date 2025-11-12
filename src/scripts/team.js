document.addEventListener('DOMContentLoaded', function() {
    const teamNameHeader = document.getElementById('team-name-header');
    const teamDetailsContent = document.getElementById('team-details-content');

    // Get the search parameters from the page's URL
    const params = new URLSearchParams(window.location.search);
    const teamName = params.get('name'); // This will get the value of the 'name' parameter

    if (teamName) {
        let teamData = null;
        let leagueName = null;

        // Find the team and its league
        for (const league of leagues) {
            const found = league.teams.find(t => t === teamName);
            if (found) {
                teamData = found;
                leagueName = league.league;
                break;
            }
        }
        
        if (teamData) {
            // If team is found, update the HTML content
            teamNameHeader.textContent = teamData.toUpperCase();
            teamDetailsContent.textContent = `This page contains details for ${teamData}, who play in the ${leagueName}.`;
            document.title = teamData; // Update the page title as well
        } else {
            // If team from URL is not in our data
            teamNameHeader.textContent = 'Team Not Found';
            teamDetailsContent.textContent = `Sorry, the team "${teamName}" could not be found.`;
        }

    } else {
        // If the URL has no team name parameter
        teamNameHeader.textContent = 'No Team Specified';
        teamDetailsContent.textContent = 'Please search for a team from the homepage.';
    }
});