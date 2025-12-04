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

    // NEW: Get elements for Import/Export
    const exportProfileBtn = document.getElementById('export-profile-btn');
    const importProfileBtn = document.getElementById('import-profile-btn');
    const importFileInput = document.getElementById('import-file-input');

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
        
        // Safety check if data.js didn't load
        if (typeof leagues === 'undefined') {
            console.error("Leagues data is missing. Make sure data.js is loaded.");
            return;
        }

        leagueSelect.innerHTML = '<option value="" selected disabled>Select a league...</option>';
        leagues.forEach(league => {
            const option = document.createElement('option');
            option.value = league.league;
            option.textContent = league.league;
            leagueSelect.appendChild(option);
        });
    }

    // --- Event Listeners ---

    if (leagueSelect) {
        leagueSelect.addEventListener('change', function () {
            const selectedLeagueName = this.value;
            teamSelect.innerHTML = '<option value="" selected disabled>Select a team...</option>';
            teamSelect.disabled = false;

            if (typeof leagues !== 'undefined') {
                const selectedLeague = leagues.find(league => league.league === selectedLeagueName);

                if (selectedLeague) {
                    selectedLeague.teams.forEach(team => {
                        const option = document.createElement('option');
                        option.value = team;
                        option.textContent = team;
                        teamSelect.appendChild(option);
                    });
                }
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

    // --- NEW: Export Functionality ---
    if (exportProfileBtn) {
        exportProfileBtn.addEventListener('click', function() {
            const savedProfile = localStorage.getItem('userProfile');
            if (!savedProfile) {
                alert("No profile to export.");
                return;
            }
            
            // Create a blob from the JSON string
            const blob = new Blob([savedProfile], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            // Create a temporary link and click it
            const a = document.createElement('a');
            a.href = url;
            a.download = "my_football_profile.json";
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // --- NEW: Import Functionality ---
    if (importProfileBtn && importFileInput) {
        // When the visible button is clicked, click the hidden file input
        importProfileBtn.addEventListener('click', function() {
            importFileInput.click();
        });

        // When a file is selected
        importFileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const content = e.target.result;
                    const parsedProfile = JSON.parse(content);

                    // Basic validation to ensure it's a valid profile
                    if (parsedProfile.name && parsedProfile.league && parsedProfile.team) {
                        localStorage.setItem('userProfile', JSON.stringify(parsedProfile));
                        alert('Profile imported successfully!');
                        
                        // Update UI immediately
                        if(mainProfileHeader) mainProfileHeader.textContent = `WELCOME ${parsedProfile.name.toUpperCase()}!`;        
                        showProfile(parsedProfile);
                    } else {
                        alert("Invalid profile file. Missing required fields.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Error reading file. Please ensure it is a valid JSON file.");
                }
            };

            reader.readAsText(file);
            
            // Reset the input so the same file can be selected again if needed
            importFileInput.value = ''; 
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
