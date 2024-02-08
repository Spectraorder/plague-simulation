var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var airborneRateControl = document.getElementById('airborne-rate');
var maskRateControl = document.getElementById('mask-rate');
var activityRateControl = document.getElementById('activity-rate');

function handleControlChange() {
    var airborneRate = parseFloat(airborneRateControl.value);
    var maskRate = parseFloat(maskRateControl.value);
    var activityRate = parseFloat(activityRateControl.value);
}

airborneRateControl.addEventListener('input', handleControlChange);
maskRateControl.addEventListener('input', handleControlChange);
activityRateControl.addEventListener('input', handleControlChange);
