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
// map.on('load', async () => {
//   console.log("Map has loaded!")

//   map.addSource('boston_route', {
//     type: 'geojson',
//     data: 'https://data.boston.gov/dataset/existing-bike-network-2022.geojson'
//   });

//   map.addLayer({
//     id: 'boston-bike-lanes',
//     type: 'line',
//     source: 'boston_route',
//     paint: {
//       'line-color': 'green',
//       'line-width': 3,
//       'line-opacity': 0.4
//     }
//   });

//   // Lab Step 2.3: Adding Cambridge bike lanes
//   map.addSource('cambridge_route', {
//     type: 'geojson',
//     data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson'
//   });

//   map.addLayer({
//     id: 'cambridge-bike-lanes',
//     type: 'line',
//     source: 'cambridge_route',
//     paint: {
//       'line-color': 'green',
//       'line-width': 3,
//       'line-opacity': 0.4
//     }
//   })
// });
map.on('load', async () => {
  console.log("Map has loaded!"); // Debugging log

  // Load Boston bike lanes
  try {
    const bostonGeoJSON = await fetch('https://s3.amazonaws.com/og-production-open-data-bostonma-892364687672/resources/687847db-3296-41a7-aada-0419416ea59b/existing_bike_network_2024.geojson?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJJIENTAPKHZMIPXQ%2F20250227%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250227T014709Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=703ce22b715d0b5d915a2523359b973bb19174389be423440344babce97de707')
      .then(response => response.json());
    
    map.addSource('boston_bike_lanes', {
      type: 'geojson',
      data: bostonGeoJSON
    });

    map.addLayer({
      id: 'boston-bike-lanes',
      type: 'line',
      source: 'boston_bike_lanes',
      paint: {
        'line-color': 'green',
        'line-width': 3,
        'line-opacity': 0.6
      }
    });
  } catch (error) {
    console.error("Error loading Boston bike lanes:", error);
  }

  // Load Cambridge bike lanes
  try {
    const cambridgeGeoJSON = await fetch('https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson')
      .then(response => response.json());

    map.addSource('cambridge_bike_lanes', {
      type: 'geojson',
      data: cambridgeGeoJSON
    });

    map.addLayer({
      id: 'cambridge-bike-lanes',
      type: 'line',
      source: 'cambridge_bike_lanes',
      paint: {
        'line-color': 'blue',
        'line-width': 3,
        'line-opacity': 0.6
      }
    });
  } catch (error) {
    console.error("Error loading Cambridge bike lanes:", error);
  }
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

