document.addEventListener('DOMContentLoaded', function () {
    const recentContainer = document.getElementById('recent-match-container');
    const upcomingContainer = document.getElementById('upcoming-match-container');

    // 1. Check for User Profile
    const savedProfile = localStorage.getItem('userProfile');
    
    if (!savedProfile) {
        showNoProfileMessage();
        return;
    }

    const userProfile = JSON.parse(savedProfile);
    const favoriteTeam = userProfile.team;

    // 2. Get Team ID from data.js
    // Ensure data.js is loaded and 'teamData' exists
    if (typeof teamData === 'undefined' || !teamData[favoriteTeam]) {
        recentContainer.innerHTML = `<p>Error: Could not find data ID for <strong>${favoriteTeam}</strong>.</p>`;
        upcomingContainer.innerHTML = `<p>Error: Could not find data ID for <strong>${favoriteTeam}</strong>.</p>`;
        return;
    }

    const teamId = teamData[favoriteTeam];

    // 3. Fetch Data
    fetchRecentMatch(teamId);
    fetchUpcomingMatch(teamId);


    // --- Helper Functions ---

    function showNoProfileMessage() {
        const msg = `<p>Make a profile and select your team to have them displayed on the home page!</p>
                     <a href="profile.html" class="btn" style="margin-top:10px;">Create Profile</a>`;
        if(recentContainer) recentContainer.innerHTML = msg;
        if(upcomingContainer) upcomingContainer.innerHTML = msg;
    }

    function fetchRecentMatch(id) {
        fetch(`proxy.php?id=${id}&type=matches_finished`)
            .then(res => res.json())
            .then(data => {
                if (data.matches && data.matches.length > 0) {
                    // The API usually returns matches in date order. 
                    // The "most recent" finished game is the LAST one in the array.
                    const lastMatch = data.matches[data.matches.length - 1];
                    renderMatch(recentContainer, lastMatch, "Recent Match");
                } else {
                    recentContainer.innerHTML = "<p>No recent matches found.</p>";
                }
            })
            .catch(err => {
                console.error(err);
                recentContainer.innerHTML = "<p>Error loading recent match.</p>";
            });
    }

    function fetchUpcomingMatch(id) {
        fetch(`proxy.php?id=${id}&type=matches_scheduled`)
            .then(res => res.json())
            .then(data => {
                if (data.matches && data.matches.length > 0) {
                    // The "soonest" upcoming game is the FIRST one in the array.
                    const nextMatch = data.matches[0];
                    renderMatch(upcomingContainer, nextMatch, "Next Match");
                } else {
                    upcomingContainer.innerHTML = "<p>No upcoming matches scheduled.</p>";
                }
            })
            .catch(err => {
                console.error(err);
                upcomingContainer.innerHTML = "<p>Error loading upcoming match.</p>";
            });
    }

    function renderMatch(container, match, titleLabel) {
        // Format Date
        const dateObj = new Date(match.utcDate);
        const dateStr = dateObj.toLocaleDateString();
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Determine Score Display (if finished)
        let scoreDisplay = "v.s.";
        if (match.status === "FINISHED") {
            scoreDisplay = `${match.score.fullTime.home} - ${match.score.fullTime.away}`;
        }

        const html = `
            <div style="background-color: #f8f9fa; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
                <p style="font-weight: bold; margin-bottom: 5px;">${dateStr} @ ${timeStr}</p>
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 15px;">${match.competition.name}</p>
                
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: nowrap;">
                    <!-- Home Team -->
                    <div style="text-align: center; flex: 1; min-width: 0; padding-right: 5px;">
                        <div style="height: 60px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                            <img src="${match.homeTeam.crest}" alt="${match.homeTeam.shortName}" 
                                 style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain;">
                        </div>
                        <span style="font-size: 0.9rem; font-weight: bold; display: block; line-height: 1.2; word-wrap: break-word;">${match.homeTeam.shortName}</span>
                    </div>

                    <!-- Score / VS -->
                    <div style="flex: 0 0 auto; font-weight: bold; font-size: 1.2rem; color: #001D44; margin: 0 10px; white-space: nowrap;">
                        ${scoreDisplay}
                    </div>

                    <!-- Away Team -->
                    <div style="text-align: center; flex: 1; min-width: 0; padding-left: 5px;">
                        <div style="height: 60px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                            <img src="${match.awayTeam.crest}" alt="${match.awayTeam.shortName}" 
                                 style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain;">
                        </div>
                        <span style="font-size: 0.9rem; font-weight: bold; display: block; line-height: 1.2; word-wrap: break-word;">${match.awayTeam.shortName}</span>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
});