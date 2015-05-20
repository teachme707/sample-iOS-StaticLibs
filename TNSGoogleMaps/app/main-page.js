var vmModule = require("./main-view-model");
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = vmModule.mainViewModel;
}
exports.pageLoaded = pageLoaded;

var camera;
var mapView;
var marker;

function createMapView(args) {
	console.log('Providing GoogleMap API key...');

	// NOTE: Just do not use my API key in production!
	GMSServices.provideAPIKey("AIzaSyC0UH2UEjaDlYRuIzkYUykbucSyqT3PEQg");

	console.log("Creating map view...");
	camera = GMSCameraPosition.cameraWithLatitudeLongitudeZoom(-33.86, 151.20, 6);
	mapView = GMSMapView.mapWithFrameCamera(CGRectZero, camera);

	console.log("Setting a marker...");
	marker = GMSMarker.alloc().init();
	// Note that inline functions such as CLLocationCoordinate2DMake are not exported.
	marker.position = { latitude: -33.86, longitude: 151.20 }
	marker.title = "Sydney";
	marker.snippet = "Australia";
	marker.map = mapView;

	console.log("Displaying map...");
	args.view = mapView;
}
exports.createMapView = createMapView;