let newYorkCoords = [40.73, -74.0059];
let mapZoomLevel = 12;

// Create the createMap function
function createMap(bikeStations) {
  // Create the tile layer that will be the background of our map
  let lightmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
  });

  // Create a baseMaps object to hold the lightmap layer
  let baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  let overlayMaps = {
    "Bike Stations": bikeStations
  };

  // Create the map object with options
  let map = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    layers: [lightmap, bikeStations]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

// Create the createMarkers function
function createMarkers(response) {
  // Pull the "stations" property from response.data
  let stations = response.data.stations;

  // Initialize an array to hold the bike markers
  let bikeMarkers = [];

  // Loop through the stations array
  stations.forEach(station => {
    // For each station, create a marker, and bind a popup with the station's name and capacity
    let bikeMarker = L.marker([station.lat, station.lon])
      .bindPopup(`${station.name} and Capacity: ${station.capacity}`);

    // Add the marker to the bikeMarkers array
    bikeMarkers.push(bikeMarker);
  });

  // Create a layer group that's made from the bike markers array, and pass it to the createMap function
  createMap(L.layerGroup(bikeMarkers));
}

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes
d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(createMarkers);

