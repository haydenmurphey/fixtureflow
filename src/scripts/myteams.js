document.addEventListener('DOMContentLoaded', function () {
    const teamHeader = document.getElementById('my-team-header');
    const teamContent = document.getElementById('my-team-content');
    const chartsContainer = document.getElementById('charts-container');

    // 1. Retrieve the user profile
    const savedProfile = localStorage.getItem('userProfile');

    if (savedProfile) {
        const userProfile = JSON.parse(savedProfile);
        const myTeamName = userProfile.team;

        if (myTeamName) {
            teamHeader.textContent = myTeamName.toUpperCase();
            teamContent.innerHTML = `<p>Analyzing active competitions for ${myTeamName}...</p>`;

            // 2. Get the Team ID from data.js
            const teamId = teamData[myTeamName];

            if (teamId) {
                fetchTeamCompetitions(teamId, myTeamName);
            } else {
                teamContent.textContent = "Error: Could not find API ID for this team.";
            }
        }
    } else {
        teamHeader.textContent = 'NO TEAM SELECTED';
        teamContent.innerHTML = '<p>Pick your favorite team in the <a href="profile.html">profile section!</a></p>';
    }

    // --- Core Functions ---

    function fetchTeamCompetitions(teamId, teamName) {
        fetch(`proxy.php?type=team&id=${teamId}`)
            .then(response => response.json())
            .then(data => {
                if (data.runningCompetitions && data.runningCompetitions.length > 0) {
                    teamContent.innerHTML = `<p>${teamName} is currently active in ${data.runningCompetitions.length} competitions.</p>`;
                    
                    data.runningCompetitions.forEach(comp => {
                        // Pass teamId to the next function
                        fetchStandingsAndRenderChart(comp.id, comp.name, teamName, teamId);
                    });
                } else {
                    teamContent.innerHTML = `<p>${teamName} is not currently active in any supported competitions.</p>`;
                }
            })
            .catch(err => {
                console.error(err);
                teamContent.innerHTML = "<p>Error loading team details.</p>";
            });
    }

    function fetchStandingsAndRenderChart(compId, compName, myTeamName, myTeamId) {
        fetch(`proxy.php?type=standings&id=${compId}`)
            .then(response => response.json())
            .then(data => {
                const standingNode = data.standings.find(s => s.type === 'TOTAL');

                if (standingNode && standingNode.table) {
                    // Pass myTeamId to the chart function
                    createChart(compName, standingNode.table, myTeamName, myTeamId);
                }
            })
            .catch(err => {
                console.error(`Could not load standings for ${compName}`, err);
            });
    }

    function createChart(competitionName, tableData, myTeamName, myTeamId) {
        // Create column
        const colDiv = document.createElement('div');
        colDiv.className = 'col-12 col-lg-12'; 
        
        // Create the wrapper using the NEW CSS class
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-box'; 
        
        // Title
        const title = document.createElement('h3');
        title.textContent = competitionName;
        
        // Canvas Container (needed for dynamic height)
        const canvasContainer = document.createElement('div');
        canvasContainer.style.position = 'relative';
        
        // Calculate dynamic height: 30px per team + buffer
        const chartHeight = (tableData.length * 30) + 50; 
        canvasContainer.style.height = `${chartHeight}px`;

        const canvas = document.createElement('canvas');

        canvasContainer.appendChild(canvas);
        wrapper.appendChild(title);
        wrapper.appendChild(canvasContainer);
        colDiv.appendChild(wrapper);
        chartsContainer.appendChild(colDiv);

        // -- Process Data --
        let chartLabels = [];
        let chartPoints = [];
        let backgroundColors = [];
        let borderColors = [];

        tableData.forEach(row => {
            // Use Short Name if available to save space, else regular name
            const labelName = row.team.shortName || row.team.name;
            chartLabels.push(labelName);
            chartPoints.push(row.points);

            // Highlight Logic: Check ID instead of Name
            if (row.team.id === myTeamId) {
                backgroundColors.push('#001D44'); // Dark Blue for your team
                borderColors.push('#001D44');
            } else {
                backgroundColors.push('rgba(200, 200, 200, 0.5)'); // Light Grey for others
                borderColors.push('rgba(150, 150, 150, 1)');
            }
        });

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Points',
                    data: chartPoints,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    borderRadius: 4, // Rounded bar corners
                    barPercentage: 0.7
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal Bar Chart
                responsive: true,
                maintainAspectRatio: false, // Allows us to control height via CSS
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.raw} Points`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Points' },
                        grid: { display: true, color: '#f0f0f0' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            font: { size: 11, weight: 'bold' },
                            color: '#333'
                        }
                    }
                }
            }
        });
    }
});