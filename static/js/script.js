var map = L.map('map').setView([0, 0], 2);

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
        console.log('Simulation results:', simulation_results);
    })
    .catch(error => {
        console.error('Error starting simulation:', error);
    });
}

startBtn.addEventListener('click', startSimulation);

calculateA0();
calculateP();
calculateInfection();
