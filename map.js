// Import Mapbox GL JS and D3.js
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Initialize Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaHVhZG1sZWUiLCJhIjoiY203ZmI0eTRvMDBjajJqcHpmeWM1MGd4NiJ9.0TlBIhJdBvvYzAgcNpwcMAE'; // Replace with your actual Mapbox token

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-71.09415, 42.36027],
  zoom: 12,
  minZoom: 5,
  maxZoom: 18
});

let stations = [];
let trips = [];

// Function to Load Bike Lane Data
async function loadBikeLanes() {
  try {
    const bostonData = await d3.json('https://s3.amazonaws.com/.../existing_bike_network_2024.geojson');
    map.addSource('boston_bike_lanes', { type: 'geojson', data: bostonData });
    map.addLayer({
      id: 'boston-bike-lanes',
      type: 'line',
      source: 'boston_bike_lanes',
      paint: { 'line-color': 'green', 'line-width': 3, 'line-opacity': 0.6 }
    });
  } catch (error) {
    console.error('Error loading Boston bike lanes:', error);
  }
}

// Function to Load Bike Stations
async function loadBikeStations() {
  try {
    const stationData = await d3.json('https://dsc106.com/labs/lab07/data/bluebikes-stations.json');
    stations = stationData.data.stations;
    
    const svg = d3.select('#map').append('svg')
      .attr('width', '100%').attr('height', '100%')
      .style('position', 'absolute').style('z-index', '1').style('pointer-events', 'none');
    
    const circles = svg.selectAll('circle').data(stations).enter().append('circle')
      .attr('r', 5).attr('fill', 'steelblue').attr('stroke', 'white')
      .attr('stroke-width', 1).attr('opacity', 0.8);
    
    function getCoords(station) {
      const longitude = station.Long || station.lon;
      const latitude = station.Lat || station.lat;
      if (!longitude || !latitude) return { cx: 0, cy: 0 };
      const point = map.project(new mapboxgl.LngLat(+longitude, +latitude));
      return { cx: point.x, cy: point.y };
    }
    
    function updatePositions() {
      circles.attr('cx', d => getCoords(d).cx).attr('cy', d => getCoords(d).cy);
    }
    
    updatePositions();
    map.on('move', updatePositions);
    map.on('zoom', updatePositions);
  } catch (error) {
    console.error('Error loading stations:', error);
  }
}

// Function to Load Traffic Data
async function loadTrafficData() {
  try {
    trips = await d3.csv('https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv', d => ({
      ride_id: d.ride_id,
      bike_type: d.bike_type,
      started_at: new Date(d.started_at),
      ended_at: new Date(d.ended_at),
      start_station_id: d.start_station_id,
      end_station_id: d.end_station_id,
      is_member: +d.is_member
    }));
  } catch (error) {
    console.error('Error loading traffic data:', error);
  }
}

// Function to Compute Station Traffic
function computeStationTraffic() {
  const departures = d3.rollup(trips, v => v.length, d => d.start_station_id);
  const arrivals = d3.rollup(trips, v => v.length, d => d.end_station_id);
  
  stations = stations.map(station => {
    let id = station.short_name;
    station.arrivals = arrivals.get(id) ?? 0;
    station.departures = departures.get(id) ?? 0;
    station.totalTraffic = station.arrivals + station.departures;
    return station;
  });
}

// Function to Update Traffic Visualization
function updateTrafficVisualization() {
  computeStationTraffic();
  const radiusScale = d3.scaleSqrt().domain([0, d3.max(stations, d => d.totalTraffic)]).range([2, 25]);
  d3.selectAll('circle').transition().duration(500).attr('r', d => radiusScale(d.totalTraffic));
}

// Function to Update Time Filter
function updateTimeFilter() {
  let timeFilter = Number(document.getElementById('time-slider').value);
  trips = trips.filter(trip => {
    let startTime = trip.started_at.getHours() * 60 + trip.started_at.getMinutes();
    let endTime = trip.ended_at.getHours() * 60 + trip.ended_at.getMinutes();
    return Math.abs(startTime - timeFilter) <= 60 || Math.abs(endTime - timeFilter) <= 60;
  });
  updateTrafficVisualization();
}

document.getElementById('time-slider').addEventListener('input', updateTimeFilter);

// Initialize Data Loading
map.on('load', async () => {
  await loadBikeLanes();
  await loadBikeStations();
  await loadTrafficData();
  updateTrafficVisualization();
});
