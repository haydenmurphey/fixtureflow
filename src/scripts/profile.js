const leagues = [
  {
    league: "Premier League",
    teams: [
      "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion", "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town", "Leicester City", "Liverpool", "Manchester City", "Manchester United", "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur", "West Ham United", "Wolverhampton Wanderers",
    ],
  },
  {
    league: "La Liga",
    teams: [
      "Alavés", "Athletic Bilbao", "Atlético Madrid", "Barcelona", "Celta Vigo", "Espanyol", "Getafe", "Girona", "Las Palmas", "Leganés", "Mallorca", "Osasuna", "Rayo Vallecano", "Real Betis", "Real Madrid", "Real Sociedad", "Sevilla", "Valencia", "Valladolid", "Villarreal",
    ],
  },
  {
    league: "Bundesliga",
    teams: [
      "FC Augsburg", "Bayer 04 Leverkusen", "FC Bayern München", "VfL Bochum 1848", "SV Werder Bremen", "SV Darmstadt 98", "Borussia Dortmund", "Eintracht Frankfurt", "SC Freiburg", "1. FC Heidenheim 1846", "TSG Hoffenheim", "1. FC Köln", "RB Leipzig", "1. FSV Mainz 05", "Borussia Mönchengladbach", "VfB Stuttgart", "1. FC Union Berlin", "VfL Wolfsburg",
    ],
  },
  {
    league: "Serie A",
    teams: [
      "Atalanta", "Bologna", "Cagliari", "Como", "Empoli", "Fiorentina", "Genoa", "Hellas Verona", "Inter Milan", "Juventus", "Lazio", "Lecce", "AC Milan", "Monza", "Napoli", "Parma", "Roma", "Torino", "Udinese", "Venezia",
    ],
  },
  {
    league: "Ligue 1",
    teams: [
      "Angers", "Auxerre", "Brest", "Le Havre", "Lens", "Lille", "Lyon", "Marseille", "Monaco", "Montpellier", "Nantes", "Nice", "Paris Saint-Germain", "Reims", "Rennes", "Strasbourg", "Toulouse", "Saint-Étienne",
    ],
  },
];

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
        profileFormContainer.style.display = 'none';
        profileDisplayContainer.style.display = 'block';
        displayMessage.innerHTML = `Your favorite team is: <strong>${profile.team}</strong>`;
    }

    function showForm() {
        profileFormContainer.style.display = 'block';
        profileDisplayContainer.style.display = 'none';
        profileForm.reset();
        teamSelect.innerHTML = '<option value="" selected disabled>Select a league first...</option>';
        teamSelect.disabled = true;
    }

    function populateLeagues() {
        leagueSelect.innerHTML = '<option value="" selected disabled>Select a league...</option>';
        leagues.forEach(league => {
            const option = document.createElement('option');
            option.value = league.league;
            option.textContent = league.league;
            leagueSelect.appendChild(option);
        });
    }

    // --- Event Listeners ---

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

    profileForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const userProfile = {
            name: nameInput.value,
            league: leagueSelect.value,
            team: teamSelect.value
        };

        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        alert('Profile created successfully!');
        
        // Update header text on profile creation
        mainProfileHeader.textContent = `WELCOME ${userProfile.name.toUpperCase()}!`;        showProfile(userProfile);
    });

    deleteProfileBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete your profile?')) {
            localStorage.removeItem('userProfile');
            alert('Profile deleted.');

            // Update header text on profile deletion
            mainProfileHeader.textContent = 'CREATE A PROFILE!';
            showForm();
        }
    });

    // --- Initial Check on Page Load ---

    populateLeagues();

    const savedProfile = localStorage.getItem('userProfile');

    if (savedProfile) {
        const userProfile = JSON.parse(savedProfile);
        // If profile exists, set welcome message
        mainProfileHeader.textContent = `WELCOME ${userProfile.name.toUpperCase()}!`;        showProfile(userProfile);
    } else {
        // If no profile, set create profile message
        mainProfileHeader.textContent = 'CREATE A PROFILE!';
        showForm();
    }
});