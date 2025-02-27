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

let stations = [];
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

  ////////////////////////////////////

//   try {
//     const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
//     const jsonData = await d3.json(jsonurl);
//     let stations = jsonData.data.stations;
//     console.log("Stations Array:", stations);

//     // Append Circles for Stations
//     const svg = d3.select('#map').append("svg")
//       .attr("width", "100%")
//       .attr("height", "100%")
//       .style("position", "absolute")
//       .style("z-index", "1")
//       .style("pointer-events", "none");

//     const circles = svg.selectAll("circle")
//       .data(stations)
//       .enter()
//       .append("circle")
//       .attr("r", 5)
//       .attr("fill", "steelblue")
//       .attr("stroke", "white")
//       .attr("stroke-width", 1)
//       .attr("opacity", 0.8);

//     // Function to update circle positions
//     function updatePositions() {
//       circles.attr("cx", d => getCoords(d).cx)
//              .attr("cy", d => getCoords(d).cy);
//     }

//     function getCoords(station) {
//       const longitude = station.Long || station.long || station.Lon || station.lon;
//       const latitude = station.Lat || station.lat;
    
//       if (!longitude || !latitude) {
//         console.warn("Invalid coordinates for station:", station);
//         return { cx: 0, cy: 0 }; // Prevents NaN errors
//       }
    
//       const point = new mapboxgl.LngLat(+longitude, +latitude);
//       const { x, y } = map.project(point);
//       return { cx: x, cy: y };
//     }    

//     console.log("First Station:", stations[0]);

//     updatePositions();
//     map.on("move", updatePositions);
//     map.on("zoom", updatePositions);
//     map.on("resize", updatePositions);
//     map.on("moveend", updatePositions);
//   } catch (error) {
//     console.error('Error loading stations:', error);
//   }

//   // Lab 7 Step 4.1: Load the CSV traffic data
//   const trafficDataUrl = "https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv";
//   let trips = [];

//   async function loadTrafficData() {
//       try {
//           trips = await d3.csv(trafficDataUrl, (trip) => {
//               return {
//                   ride_id: trip.ride_id,
//                   bike_type: trip.bike_type,
//                   started_at: new Date(trip.started_at),
//                   ended_at: new Date(trip.ended_at),
//                   start_station_id: trip.start_station_id,
//                   end_station_id: trip.end_station_id,
//                   is_member: +trip.is_member
//               };
//           });
//           console.log("Loaded traffic data:", trips.slice(0, 5)); // Debugging - check first few rows
//       } catch (error) {
//           console.error("Error loading traffic data:", error);
//       }
//   }

//   // Lab 7 Step 4.2: Calculating Traffic at Each Station \
//   async function computeStationTraffic() {
//     await loadTrafficData(); // Load trip data first

//     const departures = d3.rollup(trips, v => v.length, d => d.start_station_id);
//     const arrivals = d3.rollup(trips, v => v.length, d => d.end_station_id);

//     // Update stations with computed traffic data
//     stations = stations.map(station => {
//         let id = station.short_name;
//         station.arrivals = arrivals.get(id) ?? 0;
//         station.departures = departures.get(id) ?? 0;
//         station.totalTraffic = station.arrivals + station.departures;
//         return station;
//     });

//     console.log("Updated stations with traffic data:", stations.slice(0, 5)); // Debugging

//     updateCircleSizes(); 
//     addTooltips(); 
// }

//   // Step 4.3: Define a square root scale for circle sizes
//   function updateCircleSizes() {
//     if (!stations || stations.length === 0) {
//         console.warn("Stations data is empty, skipping size updates.");
//         return;
//     }

//     const maxTraffic = d3.max(stations, d => d.totalTraffic || 1); // Prevents NaN

//     const radiusScale = d3.scaleSqrt()
//         .domain([0, maxTraffic])
//         .range([2, 25]); // Min radius 2, Max radius 25

//     circles.transition().duration(500)
//         .attr("r", d => radiusScale(d.totalTraffic || 1)); // Prevent NaN
// }

//   function addTooltips() {
//     circles.each(function (d) {
//         if (d.totalTraffic > 0) { // ✅ Show only for stations with trips
//             d3.select(this)
//                 .append("title")
//                 .text(`${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);
//         }
//     });
//   }
// });

// 🚲 Load Bike Station Data
  async function loadStations() {
    try {
        const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
        const jsonData = await d3.json(jsonurl);
        stations = jsonData.data.stations;
        console.log("Stations Loaded:", stations.length);

        // Compute Traffic Data after loading stations
        await computeStationTraffic(); 

        // Add SVG Circles to Represent Stations
        addStationMarkers();
    } catch (error) {
        console.error("Error loading stations:", error);
    }
  }

  // 🚲 Load Traffic Data
  async function loadTrafficData() {
    try {
        const trafficDataUrl = "https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv";
        trips = await d3.csv(trafficDataUrl, (trip) => ({
            ride_id: trip.ride_id,
            bike_type: trip.bike_type,
            started_at: new Date(trip.started_at),
            ended_at: new Date(trip.ended_at),
            start_station_id: trip.start_station_id,
            end_station_id: trip.end_station_id,
            is_member: +trip.is_member
        }));
        console.log("Traffic Data Loaded:", trips.length);
    } catch (error) {
        console.error("Error loading traffic data:", error);
    }
  }

  // 🚲 Compute Traffic Data Per Station
  async function computeStationTraffic() {
    await loadTrafficData();

    const departures = d3.rollup(trips, v => v.length, d => d.start_station_id);
    const arrivals = d3.rollup(trips, v => v.length, d => d.end_station_id);

    stations = stations.map(station => {
        let id = station.short_name;
        station.arrivals = arrivals.get(id) ?? 0;
        station.departures = departures.get(id) ?? 0;
        station.totalTraffic = station.arrivals + station.departures;
        return station;
    });

    console.log("Updated Stations with Traffic:", stations.slice(0, 5));

    updateCircleSizes();
    addTooltips();
  }

  // 🚲 Add SVG Circles to Represent Stations
  function addStationMarkers() {
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
        .attr("fill", "steelblue")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("opacity", 0.6)
        .attr("pointer-events", "auto");

    function updatePositions() {
        circles
            .attr("cx", d => getCoords(d).cx)
            .attr("cy", d => getCoords(d).cy);
    }

    function getCoords(station) {
        const longitude = station.Long || station.long || station.Lon || station.lon;
        const latitude = station.Lat || station.lat;

        if (!longitude || !latitude) {
            console.warn("Invalid coordinates for station:", station);
            return { cx: 0, cy: 0 }; 
        }

        const point = new mapboxgl.LngLat(+longitude, +latitude);
        const { x, y } = map.project(point);
        return { cx: x, cy: y };
    }

    updatePositions();
    map.on("move", updatePositions);
    map.on("zoom", updatePositions);
    map.on("resize", updatePositions);
  }

  // 🚲 Update Circle Sizes Based on Traffic
  function updateCircleSizes() {
    if (!stations || stations.length === 0) {
        console.warn("Stations data is empty, skipping size updates.");
        return;
    }

    const maxTraffic = d3.max(stations, d => d.totalTraffic || 1);

    const radiusScale = d3.scaleSqrt()
        .domain([0, maxTraffic])
        .range([2, 25]);

    d3.selectAll("circle").transition().duration(500)
        .attr("r", d => radiusScale(d.totalTraffic || 1));
  }

  // 🚲 Add Tooltips to Show Traffic Info
  function addTooltips() {
    d3.selectAll("circle")
        .each(function (d) {
            if (d.totalTraffic > 0) {
                d3.select(this)
                    .append("title")
                    .text(`${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);
            }
        });
  }

  // 🚲 Load Everything Once Map is Ready
  map.on('load', async () => {
    console.log("Map Loaded!");
    await loadStations();
});

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


