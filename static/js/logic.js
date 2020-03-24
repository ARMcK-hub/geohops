var myMap = L.map('map', {
    center: [40.7128, -74.0059],
    zoom: 11
})

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// var dataLink = 'https://data-beta-nyc-files.s3.amazonaws.com/resources/35dd04fb-81b3-479b-a074-a27a37888ce7/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson?Signature=zCGxORklgA38BJiyT1NNWySfQG8%3D&Expires=1584488534&AWSAccessKeyId=AKIAWM5UKMRH2KITC3QA'

var dataRaw = 'static/data/nyc.geojson'

d3.json(dataRaw, (data) => L.geoJson(data).addTo(myMap))