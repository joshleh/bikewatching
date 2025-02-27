// Lab Step 1.1: Check that Mapbox GL JS is loaded
console.log("Mapbox GL JS Loaded:", mapboxgl);

// Import Mapbox as an ESM module
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';

// Lab 7 Step 1.3: Initialize the Mapbox Map
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaHVhZG1sZWUiLCJhIjoiY203ZmI0eTRvMDBjajJqcHpmeWM1MGd4NiJ9.0TlBIhJdBvvYzAgcNpwcMA'; // Replace with your token

const map = new mapboxgl.Map({
  container: 'map', // ID of the div
  style: 'mapbox://styles/mapbox/streets-v12', // Base map style
  center: [-71.09415, 42.36027], // Boston coordinates
  zoom: 12, // Initial zoom
  minZoom: 5,
  maxZoom: 18
});

// Lab 7 Step 2.1: Load Bike Lane Data
map.on('load', () => {
  map.addSource('boston_route', {
    type: 'geojson',
    data: 'https://data.boston.gov/dataset/existing-bike-network-2022.geojson'
  });

  map.addLayer({
    id: 'bike-lanes',
    type: 'line',
    source: 'boston_route',
    paint: {
      'line-color': 'green',
      'line-width': 3,
      'line-opacity': 0.4
    }
  });
});

// Lab 7 Step 3.1: Load Bike Station Data
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadStations() {
  const stations = await d3.json('https://dsc106.com/labs/lab07/data/bluebikes-stations.json');
  console.log('Loaded Stations:', stations);
}

loadStations();

// Lab 7 Step 5.2: Implement Time Filtering
const timeSlider = document.getElementById('time-slider');
const selectedTime = document.getElementById('selected-time');
const anyTimeLabel = document.getElementById('any-time');

function formatTime(minutes) {
  const date = new Date(0, 0, 0, 0, minutes);
  return date.toLocaleString('en-US', { timeStyle: 'short' });
}

function updateTimeDisplay() {
  let timeFilter = Number(timeSlider.value);

  if (timeFilter === -1) {
    selectedTime.textContent = '';
    anyTimeLabel.style.display = 'block';
  } else {
    selectedTime.textContent = formatTime(timeFilter);
    anyTimeLabel.style.display = 'none';
  }
}

timeSlider.addEventListener('input', updateTimeDisplay);
updateTimeDisplay();

// Lab 7 Step 6.1: Traffic Flow Legend
const legendHTML = `
  <div class="legend">
    <div style="background: steelblue;">More departures</div>
    <div style="background: gray;">Balanced</div>
    <div style="background: darkorange;">More arrivals</div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', legendHTML);

