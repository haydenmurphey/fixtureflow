document.addEventListener('DOMContentLoaded', function () {
    const profileFormContainer = document.getElementById('profile-form-container');
    const profileDisplayContainer = document.getElementById('profile-display-container');
    const displayMessage = document.getElementById('display-message');
    const deleteProfileBtn = document.getElementById('delete-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const leagueSelect = document.getElementById('league-select');
    const teamSelect = document.getElementById('team-select');
    const nameInput = document.getElementById('name');
    const mainProfileHeader = document.getElementById('main-profile-header');

    // --- Functions ---

    function showProfile(profile) {
        if(profileFormContainer) profileFormContainer.style.display = 'none';
        if(profileDisplayContainer) profileDisplayContainer.style.display = 'block';
        if(displayMessage) displayMessage.innerHTML = `Your favorite team is: <strong>${profile.team}</strong>`;
    }

    function showForm() {
        if(profileFormContainer) profileFormContainer.style.display = 'block';
        if(profileDisplayContainer) profileDisplayContainer.style.display = 'none';
        if(profileForm) profileForm.reset();
        if(teamSelect) {
            teamSelect.innerHTML = '<option value="" selected disabled>Select a league first...</option>';
            teamSelect.disabled = true;
        }
    }

    function populateLeagues() {
        if(!leagueSelect) return;
        leagueSelect.innerHTML = '<option value="" selected disabled>Select a league...</option>';
        leagues.forEach(league => {
            const option = document.createElement('option');
            option.value = league.league;
            option.textContent = league.league;
            leagueSelect.appendChild(option);
        });
    }

    // --- Event Listeners (WITH SAFETY CHECKS) ---

    if (leagueSelect) {
        leagueSelect.addEventListener('change', function () {
            const selectedLeagueName = this.value;
            teamSelect.innerHTML = '<option value="" selected disabled>Select a team...</option>';
            teamSelect.disabled = false;

            const selectedLeague = leagues.find(league => league.league === selectedLeagueName);

            if (selectedLeague) {
                selectedLeague.teams.forEach(team => {
                    const option = document.createElement('option');
                    option.value = team;
                    option.textContent = team;
                    teamSelect.appendChild(option);
                });
            }
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const userProfile = {
                name: nameInput.value,
                league: leagueSelect.value,
                team: teamSelect.value
            };

            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            alert('Profile created successfully!');
            
            if(mainProfileHeader) mainProfileHeader.textContent = `WELCOME ${userProfile.name.toUpperCase()}!`;        
            showProfile(userProfile);
        });
    }

    if (deleteProfileBtn) {
        deleteProfileBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete your profile?')) {
                localStorage.removeItem('userProfile');
                alert('Profile deleted.');

                if(mainProfileHeader) mainProfileHeader.textContent = 'CREATE A PROFILE!';
                showForm();
            }
        });
    }

    // --- Initial Check on Page Load ---

    populateLeagues();

    const savedProfile = localStorage.getItem('userProfile');

    if (savedProfile) {
        const userProfile = JSON.parse(savedProfile);
        if(mainProfileHeader) mainProfileHeader.textContent = `WELCOME ${userProfile.name.toUpperCase()}!`;        
        showProfile(userProfile);
    } else {
        if(mainProfileHeader) mainProfileHeader.textContent = 'CREATE A PROFILE!';
        showForm();
    }
});
