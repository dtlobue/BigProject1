/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
//Experiment var app = {
    // Application Constructor
// Experiment    initialize: function() {
//Experiment        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
//Experiment    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
//Experiment    onDeviceReady: function() {
//Experiment        this.receivedEvent('deviceready');
    //    console.log('navigator.geolocation works well');
    //    function onSuccess(position) {
     //       var newElement = document.getElementById('geolocation');
     //       newElement.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' + 
      //                             'Longitude: ' + position.coords.longitude + '<br />' +
      //                             '<hr />' + newElement.innerHTML;
     //   }


//Experiment   },

    // Update DOM on a Received Event
//Experiment    receivedEvent: function(id) {
//Experiment        var parentElement = document.getElementById(id);
//Experiment        var listeningElement = parentElement.querySelector('.listening');
//Experiment        var receivedElement = parentElement.querySelector('.received');

//Experiment       listeningElement.setAttribute('style', 'display:none;');
//Experiment        receivedElement.setAttribute('style', 'display:block;');

//Experiment        console.log('Received Event: ' + id);
//Experiment    }
//Experiment };

//Experiment app.initialize();

//Start of experiment code*


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


//Possibly clear the local storage
$("#localStorage").on("click", function(){
  window.localStorage.clear();

  /* Can add a local storage button and just clear it*/
  /* Talk this over with James */
});


//Maybe create history page of where the dog has gone


//Create the Dog Button off the user input [THINK ABOUT THIS ONE]


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