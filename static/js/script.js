var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// var heatData = generateRandomHeatData(1000); // Generate 1000 random data points

// // Create heatmap layer
// var heat = L.heatLayer(heatData, {radius: 25, gradient: {0.2: 'blue', 0.5: 'lime', 0.7: 'yellow', 1: 'red'}}).addTo(map);

// // Function to generate random data points
// function generateRandomHeatData(count) {
//     var data = [];
//     for (var i = 0; i < count; i++) {
//         data.push([
//             Math.random() * 180 - 90, // Random latitude between -90 and 90
//             Math.random() * 360 - 180, // Random longitude between -180 and 180
//             Math.random() // Random intensity between 0 and 1
//         ]);
//     }
//     return data;
// }


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
