//THINGS TO DO:
//1) Add API key to html
//2) Add new jquery mobile script tag to all html

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
$("#submit, #track").live("click", function() {

  //Start tracking the dog
  dogGeoId = navigator.geolocation.watchPosition (

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
  dogName= $("#").val(); /**Have to figure out what to put here (dog name)**/

  $("#").hide();

  //Tracking Status
  $("#").html("Tracking dog: <strong>" + dogName + "</strong");/**Have to figure out what to put here (dog name)**/

});


//Stopping the Tracking
$("#").live("click", function(){ /**figure out what ID goes here**/

  //Stop tracking the user
  navigator.geolocation.clearwatch(dogGeoId);

  //Save the tracking data
  window.localStorage.setItem(dogName, JSON.stringify(tracking_data));

  //Now we will reset the Dog Name and Tracking Data
  dogGeoId = null;
  tracking_data = []; /*empty array*/

  //Change the User Interface Again
  $("#").val(" ").show(); /**Add ID here again for tracking**/

  //Area of tracking status
  $("").html("Stopped tracking: <strong>" + dogName + "</strong>");

});


//Possibly clear the local storage
$("#").live("click", function(){
  window.localStorage.clear();

  /* Can add a local storage button and just clear it*/
  /* Talk this over with James */
});


//Maybe create history page of where the dog has gone


//Create the Dog Button off the user input [THINK ABOUT THIS ONE]

//When the user clicks a link to view track info, set/change the dogName attribute on the tracking info page.
$("#").live("click", function() {

  $("#").attr("dogName", $(this).text());
});


//User views the Tracking page
$("#").live("pageshow", function(){

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

  for (var i=0, i < data.length; i++){

    if( i==(data.lenght-1)) {
      break;
    }
    total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i+1].coords.latitude, data[i+1].coords.longitude);
  }


//Now calculate the total time to track the dog
