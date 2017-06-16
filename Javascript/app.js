

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
