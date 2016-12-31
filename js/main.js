var map;
var markers = [];
//Creating a blank array for markers
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

            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open the large infowindow at each marker.

       }

       ko.applyBindings(new ViewModel());
     }





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




      document.getElementById('show-listings').addEventListener('click', showListings);
      document.getElementById('hide-listings').addEventListener('click', function() {
     hideMarkers(markers);
   });// This function fires when the user selects a searchbox picklist item.
  // It will do a nearby search using the selected query string or place.





  function ViewModel(){

    var self = this;
    self.locations = ko.observableArray(locations);
    self.markers = [];
    var marker;
    self.filter = ko.observable('');


    var clientId = '&client_id=IEJ1L4RE0U05EWNN1LTOEQXDHVMIY2BVRVYPKINFA4A01MI3';
    var clientSecret = '&client_secret=0QIIJNJLZEJVXXG33FR0TKL5IOGD4BNTXCODQ5MHNPPURRJD';

    self.locations().forEach(function(place){

      var marker = new google.maps.Marker({
            position: place.location,
            map: map,
            animation: google.maps.Animation.DROP,
            title: place.title
          });

          place.marker = marker;
          marker.setVisible(true);
        self.markers.push(marker);


        $.ajax({
          type: "GET",
              dataType: 'json',
              cache: false,
              url: 'https://api.foursquare.com/v2/venues/search?ll=' + place.location.lat + ',' + place.location.lng + clientId + clientSecret + '&v=20161228',
              async: true,
            }).done(function(data) {
                var venue = data.response.venues[0];
                var name = venue.name;
                var contactNo = venue.contact.phone;
                var formattedAddress = venue.location.address;


                var infowindow = new google.maps.InfoWindow({
              content: '<h3>'  + name + '</h3>' +'<h4>' + contactNo + '</h4>' + '<h4>' + formattedAddress + '</h4>'

            });
            place.infowindow = infowindow;


              place.marker.addListener('click', function(){
                largeInfowindow = place.infowindow;

            place.infowindow.open(map, this);
            largeInfowindow.open(map, location.marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
           infowindow.marker = null;

       });

     });

    });

});
    self.selectPlace = function(location){

                location.marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
            location.marker.setAnimation(null);
        }, 2000);
                map.panTo(location.location);
                map.setZoom(13); //Updates the Map Zoom

                if (largeInfowindow !== undefined) {
                        largeInfowindow.close();
                    }
                    largeInfowindow = location.infowindow;
                    largeInfowindow.open(map, location.marker);

    };



    self.search = ko.computed(function(){
      return ko.utils.arrayFilter(self.locations(), function(Result) {
          var result = Result.title.toLowerCase().indexOf(self.filter().toLowerCase());
          if (result != -1) {

              Result.marker.setVisible(true);
          } else {
              Result.marker.setVisible(false);
          }
          return result >= 0;
      });



    });


}
