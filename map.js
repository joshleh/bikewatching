// Lab Step 1.1: Check that Mapbox GL JS is loaded
console.log("Mapbox GL JS Loaded:", mapboxgl);

// Import Mapbox as an ESM module
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';

// Lab 7 Step 3.0: Load Bike Station Data
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

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

  // Lab Step 3.3: Adding station markers
  const svg = d3.select('#map')
    .append("svg") // Ensure SVG exists
    .attr("width", "100%")
    .attr("height", "100%")
    .style("position", "absolute")
    .style("z-index", "1")
    .style("pointer-events", "none");

  let jsonData;

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

  // // Lab Step 3.1: Fetching and parsing the CSV
  //   try {
  //       const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
        
  //       // Await JSON fetch
  //       const jsonData = await d3.json(jsonurl);
        
  //       console.log('Loaded JSON Data:', jsonData); // Log to verify structure
  //   } catch (error) {
  //       console.error('Error loading JSON:', error); // Handle errors
  //   }

  // let stations = jsonData.data.stations;
  // console.log('Stations Array:', stations);

  // // Step 3.3: Append circles to the SVG for each station
  // const circles = svg.selectAll('circle')
  //   .data(stations)
  //   .enter()
  //   .append('circle')
  //   .attr('r', 5)               // Radius of the circle
  //   .attr('fill', 'steelblue')  // Circle fill color
  //   .attr('stroke', 'white')    // Circle border color
  //   .attr('stroke-width', 1)    // Circle border thickness
  //   .attr('opacity', 0.8);      // Circle opacity

  // // Function to update circle positions when the map moves/zooms
  // function updatePositions() {
  //   circles
  //     .attr('cx', d => getCoords(d).cx)  // Set the x-position using projected coordinates
  //     .attr('cy', d => getCoords(d).cy); // Set the y-position using projected coordinates
  // }
  
  // // Lab 3.3: Additing station markers
  // function getCoords(station) {
  //   const point = new mapboxgl.LngLat(+station.Long, +station.Lat);  // Convert lon/lat to Mapbox LngLat
  //   const { x, y } = map.project(point);  // Project to pixel coordinates
  //   return { cx: x, cy: y };  // Return as object for use in SVG attributes
  // }
  // // Initial position update when map loads
  // updatePositions();

  // // Reposition markers on map interactions
  // map.on('move', updatePositions);     // Update during map movement
  // map.on('zoom', updatePositions);     // Update during zooming
  // map.on('resize', updatePositions);   // Update on window resize
  // map.on('moveend', updatePositions);  // Final adjustment after movement ends

  // console.log(`Created ${circles.size()} station markers.`);
  // Load Bike Station Data
  try {
    const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
    const jsonData = await d3.json(jsonurl);
    let stations = jsonData.data.stations;
    console.log("Stations Array:", stations);

    // Append Circles for Stations
    const svg = d3.select('#map').append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("position", "absolute")
      .style("z-index", "1")
      .style("pointer-events", "none");

    const circles = svg.selectAll("circle")
      .data(stations)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", "steelblue")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("opacity", 0.8);

    // Function to update circle positions
    function updatePositions() {
      circles.attr("cx", d => getCoords(d).cx)
             .attr("cy", d => getCoords(d).cy);
    }

    function getCoords(station) {
      const point = new mapboxgl.LngLat(+station.Long, +station.Lat);
      const { x, y } = map.project(point);
      return { cx: x, cy: y };
    }

    updatePositions();
    map.on("move", updatePositions);
    map.on("zoom", updatePositions);
    map.on("resize", updatePositions);
    map.on("moveend", updatePositions);
  } catch (error) {
    console.error('Error loading stations:', error);
  }
  
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
});

// Lab 7 Step 6.1: Traffic Flow Legend
const legendHTML = `
  <div class="legend">
    <div style="background: steelblue;">More departures</div>
    <div style="background: gray;">Balanced</div>
    <div style="background: darkorange;">More arrivals</div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', legendHTML);


