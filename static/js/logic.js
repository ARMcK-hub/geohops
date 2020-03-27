var myMap = L.map('map', {
    center: [36.16273,-86.7816],
    zoom: 13
})

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var limit = 10000

url = `https://data.nashville.gov/resource/3wb6-xy3j.geojson`


d3.json(url, (data) => {
  console.log(data)

// Date lookup: data.properties.date_issued (YYYY-MM-DDT00:00:00.000)

  features = data.features
  var arrHeat = []

  features.forEach(feature => {
    if (feature.geometry !== null) {

      var lat = feature.geometry.coordinates[1]
      var lng = feature.geometry.coordinates[0]

      console.log(lat, lng)
      var location = [lat, lng]
      
      if (lat && lng) { arrHeat.push(location) }

      }
  })

  var mapHeat = L.heatLayer(arrHeat, {
      radius: 25,
      blur: 20,
      maxZoom: 15
      
  }).addTo(myMap)



})