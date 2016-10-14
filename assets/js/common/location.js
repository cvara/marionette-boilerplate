import App from 'app';


var gmapsFetched = false;

var LocationModule = {};

// Does reverse geocoding, returning location name from long/lat
LocationModule.reverseGeocode = function(latitute, longitude) {
    var deferred = $.Deferred();

    function doGeocode() {
        var gmaps = window.google.maps;
        var geocoder = new gmaps.Geocoder();
        var latlng = new gmaps.LatLng(latitute, longitude);

        geocoder.geocode({
            'latLng': latlng
        }, function(results, status) {
            if (status === gmaps.GeocoderStatus.OK) {
                // try to get locality type result
                var location = _.find(results, function(result) {
                    return _.difference(result.types, ['locality', 'political']).length === 0;
                });
                // fallback to administrative_area_level_3
                if (!location) {
                    location = _.find(results, function(result) {
                        return result.types.indexOf('administrative_area_level_3') !== -1;
                    });
                }
                // fallback to last result
                if (!location) {
                    var location = results[results.length - 2] || results[results.length - 1];
                }
                deferred.resolve(location.formatted_address);
            } else {
                console.warn('Geocoder failed due to:' + status);
                deferred.reject();
            }
        });
    }

    if (!gmapsFetched) {
        // This will be called by gmaps on load. Geocoder will be set by then
        window.googleMapsCallback = function() {
            gmapsFetched = true;
            doGeocode();
        };

        // Async fetch script with jquery
        var gmapsUrl = 'http://maps.google.com/maps/api/js?v=3&sensor=false&libraries=places&language=el-GR&callback=googleMapsCallback';
        $.getScript(gmapsUrl).done(function() {
            // Script loaded, but Geocoder is still not available, so do nothing.
        });
    } else {
        doGeocode();
    }


    return deferred.promise();
};

// Asks for user location via the Html5 Geolocation API
LocationModule.getLocation = function() {
    var deferred = $.Deferred();

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitute = position.coords.longitude;

            var geocoding = LocationModule.reverseGeocode(latitude, longitute);

            geocoding.done(function(location) {
                deferred.resolve({
                    place_name: location,
                    latitude: latitude,
                    longitude: longitute
                });
            });

            geocoding.fail(function() {
                deferred.reject();
            });
        });
    } else {
        deferred.reject();
    }
    return deferred.promise();
};


module.exports = LocationModule;