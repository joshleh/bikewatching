// Access token for access to map
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaHVhZG1sZWUiLCJhIjoiY203ZmI0eTRvMDBjajJqcHpmeWM1MGd4NiJ9.0TlBIhJdBvvYzAgcNpwcMA';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // ID of the div where the map will render
  style: 'mapbox://styles/mapbox/streets-v12', // Map style
  center: [-71.09415, 42.36027], // [longitude, latitude] for Boston
  zoom: 12, // Initial zoom level
  minZoom: 5, // Minimum allowed zoom
  maxZoom: 18 // Maximum allowed zoom
});

// Lab Step 2.1: Import the data
map.on('load', () => { 
    //code 
  });

// Lab Step 2.1: Adding the Data Source with addSource
map.addSource('boston_route', {
    type: 'geojson',
    data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?...'
  });

// Lab 7 Step 2.1: Visualizing Data with addLayer  
map.addLayer({
  id: 'bike-lanes',
  type: 'line',
  source: 'boston_route',
  // Lab Step 2.2 Styling and Customization
  paint: {
    'line-color': 'green',
    'line-width': 3,
    'line-opacity': 0.4
  }
});

// Lab 7 Step 2.3: Adding Cambridge bike lanes
map.addSource('cambridge_route', {
    type: 'geojson',
    data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?...'
  });

map.addLayer({
id: 'bike-lanes',
type: 'line',
source: 'cambridge_route',
// Lab Step 2.2 Styling and Customization
paint: {
    'line-color': '#32D400',  // A bright green using hex code
    'line-width': 5,          // Thicker lines
    'line-opacity': 0.6       // Slightly less transparent
    }
});

// Lab 7 Step 3.1
map.on('load', () => {
    // Load the nested JSON file
    const jsonurl = INPUT_BLUEBIKES_CSV_URL // add url here 
    d3.json(jsonurl).then(jsonData => {
      console.log('Loaded JSON Data:', jsonData);  // Log to verify structure
    }).catch(error => {
      console.error('Error loading JSON:', error);  // Handle errors if JSON loading fails
    });
  });

