// GeoHops
// Creation Date: 2020-03-24
// Authors: Drew McKinney, Nick Riff, Jon Disarufino, Karsten Olson


// DEVELOPER TOOLS
var limit = 10000
var url = `https://data.nashville.gov/resource/3wb6-xy3j.geojson`



//////////////////////
//    Functions     //
//////////////////////

// Filtering Dataset based on Event Listener Dates
function filterDate(features, startDate, endDate) {
  var features = features
  var filteredFeatures = []
  var startDate = Date.parse(startDate)
  var endDate = Date.parse(endDate)

  features.forEach( (feature) => {

    var issuedDate = Date.parse(String(feature.properties.date_issued).split("T")[0])

    if (issuedDate) {
      if (issuedDate >= startDate && issuedDate <= endDate) {filteredFeatures.push(feature)}
    }
  })

  return filteredFeatures

}



//////////////////////
//    D3 OBJECTS    //
//////////////////////
var buttonFilter = d3.select('#filter-btn')



// Defining myMap Object
var myMap = L.map('map', {
    center: [36.16273,-86.7816],
    zoom: 13
})

// Generating Map from MapBox for myMap
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);





// Requesting geojson API call
d3.json(url, (data) => {
  console.log(data)

  // Date lookup: data.properties.date_issued (YYYY-MM-DDT00:00:00.000)


  var features = data.features
  var arrHeat = []
  var startDate = "1-1-2015"
  var endDate = "1-1-2020"

  // Filtering Data on Date
  var filteredFeatures = filterDate(features, startDate, endDate)
  

  //////////////////////
  //     HEAT MAP     //
  //////////////////////

  // Creating Location Array for Heat Map
  filteredFeatures.forEach(feature => {
    if (feature.geometry !== null) {

      var lat = feature.geometry.coordinates[1]
      var lng = feature.geometry.coordinates[0]
      var location = [lat, lng]
      
      if (lat && lng) { arrHeat.push(location) }
      }
  })

  console.log("Heat Map Data Count: " + arrHeat.length)

  // Plotting Heatmap
  var mapHeat = L.heatLayer(arrHeat, {
      radius: 25,
      blur: 20,
      maxZoom: 15
      
  }).addTo(myMap)



})