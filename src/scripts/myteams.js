document.addEventListener('DOMContentLoaded', function () {
    const teamHeader = document.getElementById('my-team-header');
    const teamContent = document.getElementById('my-team-content');

    // Retrieve the user profile from local storage
    const savedProfile = localStorage.getItem('userProfile');

    if (savedProfile) {
        // If a profile exists, parse it to get the data
        const userProfile = JSON.parse(savedProfile);
        
        // Check if the profile has a team name
        if (userProfile.team) {
            teamHeader.textContent = userProfile.team.toUpperCase(); // Display team name in uppercase
            teamContent.textContent = `Displaying information for ${userProfile.team}.`;
        }
    } else {
        // If no profile is found in local storage
        teamHeader.textContent = 'NO TEAM SELECTED';
        teamContent.innerHTML = 'Pick your favorite team in the <a href="profile.html">profile section!</a>';
    }
});
