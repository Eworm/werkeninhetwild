$(document).ready(function() {

    //
    var bLazy = new Blazy();


    // The map
    if (typeof episode != 'undefined') {
        initialize_single(episode);
        var bounds = new google.maps.LatLngBounds();
    }


    // Initialize a single marker
    function initialize_single(v) {
        var myOptions = {
        zoom: 10,
        center: new google.maps.LatLng(0, 0),
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    var map = new google.maps.Map(document.getElementById("google_map"), myOptions);
    codeLocations_single(v, map);
    }

    function codeLocations_single(list, map) {
        for (var i = 0; i < list.length; i++) {
            list = window[list] || list;
            var addressId = list[i].id;
            var geocoder = new google.maps.Geocoder();
            var geoOptions = {
                address: list[i].location,
                region: "NO"
            };
            geocoder.geocode(geoOptions, createGeocodeCallback_single(list[i], map, addressId));
        }
    }

    function createGeocodeCallback_single(item, map, addressId) {
        return function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            addMarker_single(map, item, results[0].geometry.location, addressId);
        } else {
        }
      }
    }

    function addMarker_single(map, item, location, addressId) {
        var marker = new google.maps.Marker({
            map : map,
            position : location,
        });
        bounds.extend(location);
        map.fitBounds(bounds);
        zoomChangeBoundsListener =
        google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
            if (this.getZoom()){
                this.setZoom(14);
            }
        });
    }

});
