var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var airborneRateControl = document.getElementById('airborne-rate');
var maskRateControl = document.getElementById('mask-rate');
var activityRateControl = document.getElementById('activity-rate');
const startBtn = document.getElementById('start-simulation');

function startSimulation() {
    var airborneRate = parseFloat(airborneRateControl.value);
    var maskRate = parseFloat(maskRateControl.value);
    var activityRate = parseFloat(activityRateControl.value);

    fetch('/start-simulation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            airborneRate: airborneRate,
            maskRate: maskRate,
            activityRate: activityRate
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Simulation started successfully.');
            // You can add further actions here if needed
        } else {
            console.error('Failed to start simulation.');
        }
    })
    .catch(error => {
        console.error('Error starting simulation:', error);
    });
}

startBtn.addEventListener('click', startSimulation);
