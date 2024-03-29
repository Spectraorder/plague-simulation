// map set default view to china
var map = L.map('map').setView([35, 85], 4.5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var airborneRateControl = document.getElementById('airborne-rate');
var maskRateControl = document.getElementById('mask-rate');
var activityRateControl = document.getElementById('activity-rate');

const airborneValueDisplay = document.getElementById('airborne-value');
const maskValueDisplay = document.getElementById('mask-value');
const activityValueDisplay = document.getElementById('activity-value');

const numberOfContactsInput = document.getElementById('input');

const resultA0Display = document.getElementById('result-a0-value');
const resultPDisplay = document.getElementById('result-p-value');
const resultInfectDisplay = document.getElementById('result-infect-value');

const startBtn = document.getElementById('start-simulation');
const fastForward = document.getElementById('checkbox');

const progress = document.querySelector('.progress');
const progressText = document.querySelector('.progress-text');

let timeint = 600;

function calculateA0() {
    const numberOfContacts = parseFloat(numberOfContactsInput.value);
    const activityRate = parseFloat(activityRateControl.value);
    const a = numberOfContacts * activityRate;
    resultA0Display.textContent = a.toFixed(2);
}

function calculateP() {
    const maskRate = parseFloat(maskRateControl.value);
    const airRate = parseFloat(airborneRateControl.value);
    const a = (1 - 0.8*maskRate) * airRate;
    resultPDisplay.textContent = a.toFixed(2);
}

function calculateInfection() {
    const a0 = parseFloat(resultA0Display.textContent);
    const p = parseFloat(resultPDisplay.textContent);
    const a = a0 * p;
    resultInfectDisplay.textContent = a.toFixed(3);
}

airborneRateControl.addEventListener('input', function() {
    airborneValueDisplay.textContent = airborneRateControl.value;
    calculateP();
    calculateInfection()
});

maskRateControl.addEventListener('input', function() {
    maskValueDisplay.textContent = maskRateControl.value;
    calculateP();
    calculateInfection()
});

activityRateControl.addEventListener('input', function() {
    activityValueDisplay.textContent = activityRateControl.value;
    calculateA0();
    calculateInfection()
});

function startSimulation() {
    var infectivityA = resultInfectDisplay.textContent;

    fetch('/start-simulation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            infectivity: infectivityA
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.error('Failed to start simulation.');
        }
    })
    .then(simulation_results => {
        const t = simulation_results.t;
        const S = simulation_results.S;
        const I = simulation_results.I;
        const R = simulation_results.R;
        const N = simulation_results.N;

        const blueGradient = {
            0.0: 'rgb(0, 25, 92)', // Deep blue at the minimum value
            0.2: 'rgb(0, 51, 153)', // Medium blue
            0.4: 'rgb(0, 102, 204)', // Light blue
            0.6: 'rgb(86, 180, 233)', // Lighter blue
            0.8: 'rgb(173, 216, 255)', // Very light blue
            1.0: 'white' // White at the maximum value
        };

        const redGradient = {
            0.0: 'rgb(255, 0, 0)',
            0.2: 'rgb(255, 77, 77)',
            0.4: 'rgb(255, 128, 128)',
            0.6: 'rgb(255, 178, 178)',
            0.8: 'rgb(255, 229, 229)',
            1.0: 'white'
        };

        const greenGradient = {
            0.0: 'rgb(34, 139, 34)', // Forest green
            0.2: 'rgb(85, 168, 85)', // Lime green
            0.4: 'rgb(144, 238, 144)', // Light yellow-green
            0.6: 'rgb(193, 255, 193)', // Mint green
            0.8: 'rgb(244, 255, 244)', // Very light green
            1.0: 'white' // White
        };

        var blueHeatmapLayer = L.heatLayer([], { radius: 20, maxZoom: 10, gradient: blueGradient }).addTo(map);
        var redHeatmapLayer = L.heatLayer([], { radius: 20, maxZoom: 10, gradient: redGradient }).addTo(map);
        var greenHeatmapLayer = L.heatLayer([], { radius: 20, maxZoom: 10, gradient: greenGradient }).addTo(map);

        async function updateHeatmap(timestep) {
            var heatData = [];
            // Calculate the number of heatmap points based on S/N ratio
            var numPoints = Math.floor((S[timestep] / N) * 1000);
            for (var i = 0; i < numPoints; i++) {
                let lat = map.getBounds().getNorthEast().lat - Math.random() * (map.getBounds().getNorthEast().lat - map.getBounds().getSouthWest().lat);
                let lng = map.getBounds().getWest() + Math.random() * (map.getBounds().getEast() - map.getBounds().getWest());

                heatData.push([lat, lng]);
            }
            blueHeatmapLayer.setLatLngs(heatData);
        }

        function updateRedHeatmap(timestep) {
            var heatData = [];
            var numPoints = Math.floor((I[timestep] / N) * 1000);
            for (var i = 0; i < numPoints; i++) {
                let lat = map.getBounds().getNorthEast().lat - Math.random() * (map.getBounds().getNorthEast().lat - map.getBounds().getSouthWest().lat);
                let lng = map.getBounds().getWest() + Math.random() * (map.getBounds().getEast() - map.getBounds().getWest());
                heatData.push([lat, lng]);
            }
            redHeatmapLayer.setLatLngs(heatData);
        }

        function updateGreenHeatmap(timestep) {
            var heatData = [];
            var numPoints = Math.floor((R[timestep] / N) * 1000);
            for (var i = 0; i < numPoints; i++) {
                let lat = map.getBounds().getNorthEast().lat - Math.random() * (map.getBounds().getNorthEast().lat - map.getBounds().getSouthWest().lat);
                let lng = map.getBounds().getWest() + Math.random() * (map.getBounds().getEast() - map.getBounds().getWest());
                heatData.push([lat, lng]);
            }
            greenHeatmapLayer.setLatLngs(heatData);
        }

        var timestep = 0;
        var interval = setInterval(function() {
            updateHeatmap(timestep);
            updateRedHeatmap(timestep);
            updateGreenHeatmap(timestep);
            timestep++;
            const progressWidth = (timestep / t.length) * 100;
            progress.style.width = progressWidth + '%';
            progressText.textContent = 'Day ' + (timestep);
            if (timestep >= t.length) clearInterval(interval);
        }, timeint);
    })
    .catch(error => {
        console.error('Error starting simulation:', error);
    });
}

fastForward.addEventListener('change', function() {
    if (this.checked) {
        console.log("fast");
        timeint = 200;
    } else {
        console.log("slow");
        timeint = 600;
    }
});

startBtn.addEventListener('click', startSimulation);

calculateA0();
calculateP();
calculateInfection();
