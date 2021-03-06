
//***GPS for the distance***//
function gps_distance(lat1, lon1, lat2, lon2) {

  // http://www.movable-type.co.uk/scripts/latlong.html
  var R = 6371; // km
  var dLat = (lat2 - lat1) * (Math.PI / 180);
  var dLon = (lon2 - lon1) * (Math.PI / 180);
  var lat1 = lat1 * (Math.PI / 180);
  var lat2 = lat2 * (Math.PI / 180);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  console.log(d);
  return d;
}


//***Event listener for the device (NO INTERNET)***//
document.addEventListener("deviceready", function() {   //Syntax:document.addEventListener(event, function, useCapture)

    if (navigation.network.connection.type == Connection.NONE) {
      $("#track").text("No Internet Access");
      $("#track").attr("data-icon", "delete");
      $("#track").button("refresh");

      $("#setup").text("No Internet Access");
      $("#setup").attr("data-icon", "delete");
      $("#setup").button("refresh");

    }

  });

var dogName="" //Dog Name
var dogGeoId= null; //Geolocation of the dog
var tracking_data = []; //Hold all the GPS Locations within the array


//***Start Tracking Event of the Dog***//
$("#submit, #track").on("click", function() {

  //Start tracking the dog
  dogGeoId = navigator.geolocation.getCurrentPosition(

    //Position
    function(position) {
      tracking_data.push(position);
    },

    //Error
    function(error) {
      console.log(error);
    },

    //Settings
    { frequency: 3000, enableHighAccuracy: true });

  //Changing user interface showing we are tracking the dog
  dogName= $("#petName").val(); /**Have to figure out what to put here (dog name)**/

  $("#petName").hide();

  //Tracking Status
  $("#petName").html("Tracking dog: <strong>" + dogName + "</strong");/**Have to figure out what to put here (dog name)**/

});


//Stopping the Tracking
$("#stopTracking").on("click", function(){ /**figure out what ID goes here**/

  //Stop tracking the user
  navigator.geolocation.clearwatch(dogGeoId);

  //Save the tracking data
  window.localStorage.setItem(dogName, JSON.stringify(tracking_data));

  //Now we will reset the Dog Name and Tracking Data
  dogGeoId = null;
  tracking_data = []; /*empty array*/

  //Change the User Interface Again
  $("#petName").val(" ").show(); /**MIGHT HAVE TO CHANGE**/

  //Area of tracking status
  $("#petName").html("Stopped tracking: <strong>" + dogName + "</strong>");

});


/******LOCAL STORAGE AREA*********/
//Clearing the local storage
$("#localStorage").on("click", function(){
  window.localStorage.clear();

});

/**Can add a local storage button and just clear it**/
$("#localStorage").on('click', function(){
	window.localStorage.setItem('Sample block', '[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}]');
});

//Giphy API AJAX Call Begins

//GLobal Scope THings (Variables)

//var APIKey = "4b5a7da88d694ef2aea74e4bef626d01";
  var APIKey = "&api_key=dc6zaTOxFJmzC";
//Come back to this and add to it to complete
//var queryURL = "https://api.giphy.com/v1/gifs/search?q=";


//Clicking on a button makes it go to the Giphy API and pull a Giphy of a dog:
// So, an on.click event. Make sure to include $(this) in it, which makes sure only the button clicked sends
// it's VALUE to Giphy API.

//Select element with necessary ID (the button) and add on click event
// (Still need to actually make element with ID)
$("#hereIsADog").on("click", function(event) {

  //Constructing a QueryURL using the dunker name
  //(come back to this, might need to be changed)
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + "dog" + APIKey + "&limit1";
  //AJAX GET request:
  $.ajax({
    url: queryURL,
    method: "GET"
  })
  //Data should now be back from request
  .done(function(response) {
    //console log
    console.log(response);
    //creating and storing a div tag to be used below
    var dogDiv = $("<div>");

    //Storing response data in a variable for easier use
    var dogResults = response.data;
    //Creating and storing an image tag
    var dogImage = $("<img>");
    // Setting the src attribute of the image to a property pulled off the result item
    dogImage.attr("src", dogResults[8].images.fixed_height.url);

    dogImage.attr("id", "dogImg")

    //appending the image tag to an element on one of the pages (decide where!!)
    dogDiv.append(dogImage);

    dogDiv.attr("id","dogGif");
    //prepending the dogDiv to the div with ID "menu"
    $("#menu").prepend(dogDiv);


  })
})

//Giphy API AJAX call ends






// Gotta Fix This! (NOT WORKING CURRENTLY BUT NO ERROR)
var trackerId = []; /**Storing the pet id**/
var newPetName = []; /**Store the pet name off **/

//Create the Dog Button off the user input [THINK ABOUT THIS ONE]
$("#enter").on("click", function(){
  //Creating a new pet button
  var newPetButton = ("#extraPets").val(" ");

  var newButton = $("<button/>").addClass( "btn btn-info newPetName").attr('data-name',newPetButton).html(newPetButton).css({'margin': '5px'});

  //Create a new button for a new pet the user has entered
  $("myPetButtons").append(newButton);
  console.log()

  pqueryURL = "http://api.petfinder.com/my.method&pet.find" + newPetButton + "?key26fe4d75647f8cc15895ba375d993ed1=foo"; /**Gotta fix this (need to find better documentation)**/

  //AJAX call to grab from Pet Finder
  $.ajax({
    url: pqueryURL,
    method: 'GET'
  })

});



//When the user clicks a link to view track info, set/change the dogName attribute on the tracking info page.
$("#track").on("click", function() {

  $("#petName").attr("dogName", $(this).text());
});


//User views the Tracking page
$("#map").on("pageshow", function(){

  //Find the ID the dog they are viewing
  var key = $(this).attr("dogName");

  //Updating the tracking of the dog
  $("# [data-role=header] h1").text(key);

  //Get all the GPS Data for tracking the dog
  var data= window.localStorage.getItem(key);

  //Turn the GPS data into a object
  data= JSON.parse(data);

  //Now calculate the total distance the dog traveled
  total_km= 0; /**Use Kilometers**/

  for (var i=0; i < data.length; i++){

    if( i==(data.lenght-1)) {
      break;
    }
    total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i+1].coords.latitude, data[i+1].coords.longitude);
  }

  total_km_rounded = total_km.toFixed(2);


  //Now calculate the total time to track the dog
  startTime= new Date(data[0].timestamp).getTime();
  endTime = new Date(data[data.length-1].timestamp).getTime;

  totalTimeMs = endTime - startTime;
  totalTimeS = totalTimeMs/1000;

  finalTimeMin = Math.floor(totalTimeS/60);
  finalTimeSec = totalTimeS - (finalTimeMin * 60);

  //Display total distance and time in the HTML
  $("#info").html("Distance <strong> " + total_km_rounded + " km </strong>" + finalTimeMin + "minutes </strong>");

  //Setting the Initial Proximity of Long/Lat in Google Maps//
  myLatLong = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);

  //Options withing Google Maps
  var userOptions = {
    zoom: 15,
    center: myLatLong,
    mapTypeId: google.maps.mapTypeId.ROADMAP
  };

  //Create the Google Map for the User and set the options
  var map = new google.maps.Map(document.getElementById("map"), userOptions);

  var trackingCoord = [];

  //Adding GPS entries to an array
  for(var i= 0; i<data.length; i++){
    trackingCoord.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
  }

  //Plot GPS as a line in Google Maps
  var gMapsLine = new google.maps.Polyline({
    path: trackingCoord,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 1.5, /**Might Change**/
  });

  //Apply the Polyline to the Map
  gMapsLine.setMap(map);

});
