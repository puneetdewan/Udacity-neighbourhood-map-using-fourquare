var map;
var markers = [];
//Creating a blank array for markers
var polygon = null;
var largeInfowindow ;

var locations = [
      {title: 'JW Marriott Hotel', location: {lat: 30.727011, lng: 76.766998}},
      {title: 'Barbeque nation', location: {lat: 30.727476, lng: 76.804183 }},
      {title: 'Chandigarh University Office', location: {lat: 30.734093, lng: 76.75244}},
      {title: 'Chandigarh Club', location: {lat: 30.763986, lng: 76.796689 }},
      {title: 'Elante Mall', location: {lat: 30.70536, lng: 76.801104}},
    ];

// Create placemarkers array to use in multiple functions to have control
  // over the number of places that show.
  var placeMarkers = [];
  var trafficLayer;
 toggleTraffic = function(){
if(trafficLayer.getMap() === null){
   //traffic layer is disabled.. enable it
   trafficLayer.setMap(map);
} else {
   //traffic layer is enabled.. disable it
   trafficLayer.setMap(null);
}
};

function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}


 // This is the PLACE DETAILS search - it's the most detailed so it's only
// executed when a marker is selected, indicating the user wants more
// details about that place.
function getPlacesDetails(marker, infowindow) {
  var service = new google.maps.places.PlacesService(map);
  service.getDetails({
    placeId: marker.id
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Set the marker property on this infowindow so it isn't created again.
      infowindow.marker = marker;
      var innerHTML = '<div>';
      if (place.name) {
        innerHTML += '<strong>' + place.name + '</strong>';
      }
      if (place.formatted_address) {
        innerHTML += '<br>' + place.formatted_address;
      }
      if (place.formatted_phone_number) {
        innerHTML += '<br>' + place.formatted_phone_number;
      }
      if (place.opening_hours) {
        innerHTML += '<br><br><strong>Hours:</strong><br>' +
            place.opening_hours.weekday_text[0] + '<br>' +
            place.opening_hours.weekday_text[1] + '<br>' +
            place.opening_hours.weekday_text[2] + '<br>' +
            place.opening_hours.weekday_text[3] + '<br>' +
            place.opening_hours.weekday_text[4] + '<br>' +
            place.opening_hours.weekday_text[5] + '<br>' +
            place.opening_hours.weekday_text[6];
      }
      if (place.photos) {
        innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
            {maxHeight: 100, maxWidth: 200}) + '">';
      }
      innerHTML += '</div>';
      infowindow.setContent(innerHTML);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  });
}


function initMap() {
  var styles = [{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"},{"lightness":"15"},{"gamma":"1"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#b8cb93"},{"lightness":"8"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"saturation":"-100"},{"lightness":"8"},{"weight":"0.35"},{"color":"#b8cb93"},{"gamma":"1"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#b8cb93"},{"lightness":"8"},{"weight":"0.01"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"},{"saturation":"0"},{"lightness":"42"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":43},{"lightness":"100"},{"color":"#9accf8"},{"gamma":"1"}]}];




  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.752535, lng: 76.810104},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

 trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    google.maps.event.addDomListener(document.getElementById('trafficToggle'), 'click', toggleTraffic);


  // This autocomplete is for use in the search within time entry box.
    var timeAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('search-within-time-text'));
    // This autocomplete is for use in the geocoder entry box.

    var searchBox = new google.maps.places.SearchBox(
        document.getElementById('places-search'));
    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());



      // Style the markers a bit. This will be our listing marker icon.




      var defaultIcon = makeMarkerIcon('0091ff');
      // Create a "highlighted location" marker color for when the user
      // mouses over the marker.
      var highlightedIcon = makeMarkerIcon('7bad6c');

      // The following group uses the location array to create an array of markers on initialize.
      for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          icon: defaultIcon,
          id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
          this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
          this.setIcon(defaultIcon);
        });
      }
      document.getElementById('show-listings').addEventListener('click', showListings);
      document.getElementById('hide-listings').addEventListener('click', function() {
     hideMarkers(markers);
   });



   // Listen for the event fired when the user selects a prediction from the
    // picklist and retrieve more details for that place.
    searchBox.addListener('places_changed', function() {
      searchBoxPlaces(this);
    });
    // Listen for the event fired when the user selects a prediction and clicks
    // "go" more details for that place.
    document.getElementById('go-places').addEventListener('click', textSearchPlaces);


  }

  // This function fires when the user selects a searchbox picklist item.
 // It will do a nearby search using the selected query string or place.
 function searchBoxPlaces(searchBox) {
   hideMarkers(placeMarkers);
   var places = searchBox.getPlaces();
   if (places.length === 0) {
     window.alert('We did not find any places matching that search!');
   } else {
   // For each place, get the icon, name and location.
     createMarkersForPlaces(places);
   }
 }
 // This function firest when the user select "go" on the places search.
 // It will do a nearby search using the entered query string or place.
 function textSearchPlaces() {
   var bounds = map.getBounds();
   hideMarkers(placeMarkers);
   var placesService = new google.maps.places.PlacesService(map);
   placesService.textSearch({
     query: document.getElementById('places-search').value,
     bounds: bounds
   }, function(results, status) {
     if (status === google.maps.places.PlacesServiceStatus.OK) {
       createMarkersForPlaces(results);
     }
   });
 }
 // This function creates markers for each place found in either places search.
 function createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      var icon = {
        url: place.icon,
        size: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        id: place.place_id
      });
      // Create a single infowindow to be used with the place details information
      // so that only one is open at once.
      var placeInfoWindow = new google.maps.InfoWindow();
      // If a marker is clicked, do a place details search on it in the next function.
      marker.addListener('click', function() {
        if (placeInfoWindow.marker == this) {
          console.log("This infowindow already is on this marker!");
        } else {
          getPlacesDetails(this, placeInfoWindow);
        }
      });
      placeMarkers.push(marker);
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }
    map.fitBounds(bounds);
  }


    var ViewModel =  function(){

      var self = this;
      self.locations = ko.observableArray(locations);
      self.markers = [];
      var marker;
      self.filter = ko.observable('');
      self.locations().forEach(function(loctaion){


          self.markers.push(marker);

      });
      self.search = ko.computed(function(){
        return ko.utils.arrayFilter(self.locations(), function(Result) {
            var result = Result.title.toLowerCase().indexOf(self.filter().toLowerCase());
            if (result != -1) {
              marker = new google.maps.Marker({
                 position: Result.location,
                 map: map,
                 animation: google.maps.Animation.DROP,
                 title: Result.title
               });
                Result.marker.setVisible(true);
            } else {
                Result.marker.setVisible(false);
            }
            return result >= 0;
        });



      });

      var clientId = '&client_id=IEJ1L4RE0U05EWNN1LTOEQXDHVMIY2BVRVYPKINFA4A01MI3';
      var clientSecret = '&client_secret=0QIIJNJLZEJVXXG33FR0TKL5IOGD4BNTXCODQ5MHNPPURRJD';



      self.selectPlace = function(location){

        marker = new google.maps.Marker({
           position: location.location,
           map: map,
           animation: google.maps.Animation.DROP,
           title: location.title
       });
       self.markers.push(marker);

                  $.ajax({
                    type: "GET",
                        dataType: 'json',
                        cache: false,
                        url: 'https://api.foursquare.com/v2/venues/search?ll=' + location.location.lat + ',' + location.location.lng + clientId + clientSecret + '&v=20161228',
                        async: true,
                      }).done(function(data) {
                          var venue = data.response.venues[0];
                          var name = venue.name;
                          var contactNo = venue.contact.phone;
                          var formattedAddress = venue.location.address;


                          var infowindow = new google.maps.InfoWindow({
                        content: '<h3>'  + name + '</h3>' +'<h4>' + contactNo + '</h4>' + '<h4>' + formattedAddress + '</h4>'

                      });
                      location.infowindow = infowindow;

                        marker.addListener('click', function(){
                        largeInfowindow = location.infowindow;

                      location.infowindow.open(map, marker);
                      largeInfowindow.open(map, location.marker);
                      // Make sure the marker property is cleared if the infowindow is closed.
                      infowindow.addListener('closeclick', function() {
                     infowindow.marker = null;

                 });

               });
             });


                  map.panTo(location.location);
                  map.setZoom(13); //Updates the Map Zoom

                  if (largeInfowindow !== undefined) {
                          largeInfowindow.close();
                      }
                      largeInfowindow= location.infowindow;





      };


};
ko.applyBindings(new ViewModel());
