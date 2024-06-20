
function initMap() {
    // The location of your map (example: New York)
    var mapCenter = {lat: 40.730610, lng: -73.935242};
    
    // The map, centered at your location
    var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 10, center: mapCenter});
    
    // Place a marker for the map center
    var centerMarker = new google.maps.Marker({position: mapCenter, map: map});
    
    // Fetch blood bank data
    fetch('/bloodbanks')
      .then(response => response.json())
      .then(bloodBanks => {
        // Place markers for each blood bank
        bloodBanks.forEach(bloodBank => {
          var marker = new google.maps.Marker({
            position: { lat: bloodBank.lat, lng: bloodBank.lng },
            map: map,
            title: bloodBank.name
          });
        });
      });
  }
