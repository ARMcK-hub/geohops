// GeoHops
// Creation Date: 2020-03-24
// Authors: Drew McKinney, Nick Riff, Jon Disarufino, Karsten Olson


// DEVELOPER TOOLS
var limit = 10000
var url = `https://data.nashville.gov/resource/3wb6-xy3j.geojson?$limit=${limit}`



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

// Field Count for different fields in feature set
function fieldCount(features, field) {
  featureCount = {}
  features.forEach( feature => {
    type = feature.properties[field]
    featureCount[type] = (featureCount[type]) ? featureCount[type] + 1 : 1
  })
  return featureCount
}

function yearCount(features, field) {
  featureCount = {}

  features.forEach( feature => {
    if (feature.properties[field]) {
    type = feature.properties[field].split("-")[0]
    featureCount[type] = (featureCount[type]) ? featureCount[type] + 1 : 1
    }
  })
  return featureCount
}




//////////////////////
//    D3 OBJECTS    //
//////////////////////
var buttonFilter = d3.select('#filter-btn')
var startDateFilter = d3.select('#startdate')
var endDateFilter = d3.select('#enddate')

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



// Initiailization of Webpage
function init() {

// Requesting geojson API call
d3.json(url, (data) => {
  console.log(data)

  // Date lookup: data.properties.date_issued (YYYY-MM-DDT00:00:00.000)


  var features = data.features
  var arrHeat = []

  // Filtering Data on Date
  var filteredFeatures = features
  

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



  //////////////////////
  //     Bar Chart    //
  //////////////////////
    
    // console.log(yearCount(filteredFeatures, 'date_issued'))
    yearCounts = yearCount(filteredFeatures, 'date_issued')
    yearLabels = Object.keys(yearCounts)
    yearValue = Object.values(yearCounts)
    // console.log(yearLabels, yearValue)
  
    //  Create the Traces
    var trace1 = {
      x: yearLabels,
      y: yearValue,
      type: "bar",
    };
  
    // Create the data array for the plot
    var data = [trace1];
  
    // Define the plot layout
    var layout = {
      title: "Number Of Beer Permits",
      xaxis: { title: "Date" },
      yaxis: { title: "Number of Permits" }
    };
  
    // Plot the chart to a div tag with id "plot"
    Plotly.newPlot("plot", data, layout);







  //////////////////////
  //     Pie Chart    //
  //////////////////////


  // On Sales///
  function onSelect(data) {
    return data.properties.permit_subtype === "ONSALES";
}
var onSalesPermit = filteredFeatures.filter(onSelect);
var onSalesCount = onSalesPermit.length; 
console.log(onSalesCount)
// Off Sales////
function offSelect(data) {
    return data.properties.permit_subtype === "OFFSALES";
}
var offSalesPermit = filteredFeatures.filter(offSelect);
var offSalesCount = offSalesPermit.length; 
console.log(offSalesCount)
// On Off Sales///
function onOffSelect(data) {
    return data.properties.permit_subtype === "ONOFFSALES";
}
var onOffSalesPermit = filteredFeatures.filter(onOffSelect);
var onOffSalesCount = onOffSalesPermit.length; 
console.log(onOffSalesCount)
// SPECIAL/////
function specialSelect(data) {
    return data.properties.permit_subtype === "SPECIAL";
}
var specialSalesPermit = filteredFeatures.filter(specialSelect);
var specialSalesCount = specialSalesPermit.length; 
console.log(specialSalesCount)

// WHOLESALE/////
function wholeSaleSelect(data) {
    return data.properties.permit_subtype === "WHOLESALES";
}
var wholeSalesPermit = filteredFeatures.filter(wholeSaleSelect);
var wholeSalesCount = wholeSalesPermit.length; 
console.log(wholeSalesCount)
// bar chart////
var trace1 = {
    labels: ["On Sales", "Off Sales", "On & Off Sales", "Special Sales", "Whole Sales"],
    values: [onSalesCount, offSalesCount, onOffSalesCount, specialSalesCount, wholeSalesCount],
    type: 'pie',
    textinfo: "label+percent",
    insidetextorientation: "radial"
  };
  
  var data = [trace1];
  
  var layout = {
    title: "Liquor Licence By Permit Type",
  };
  
  Plotly.newPlot("pie", data, layout);



  
})

}


// Update Visuals on filtering
buttonFilter.on('click', function() {

  var startDate = startDateFilter.property('value')
  var endDate = endDateFilter.property('value')

  d3.json(url, (data) => {

    var features = data.features
    var arrHeat = []
  
    // Filtering Data on Date
    var filteredFeatures = filterDate(features, startDate, endDate)
    
  
    //////////////////////
    //     HEAT MAP     //
    //////////////////////
  
    // Clearing all map layers except MapBox layer
    myMap.eachLayer(layer => { (layer._url) ? null : myMap.removeLayer(layer)} )


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

    // @TODO: Inersert Plotly plots update on filter
    console.log(yearCount(filteredFeatures, 'date_issued'))
    


  })



})




init()