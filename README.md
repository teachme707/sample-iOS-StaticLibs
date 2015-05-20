# sample-iOS-StaticLibs
An example how static libraries, static frameworks and cocoa pods can be added manually to the NativeScript for iOS framework.

> **NOTE:** At the time of the writing we have NativeScript for iOS v1.0 available. The approach is expected to be updated once we have plug-ins support available.

## Using Static Frameworks
#### An Example Using the Google Maps SDK for iOS
![GoogleMaps](Screenshots/GoogleMaps.png)

To create the project:
```bash
$ tns create TNSGoogleMaps
$ cd TNSGoogleMaps
$ tns platform add ios
$ tns prepare ios
```

To use static frameworks you just need to add and configure them by hand in the Xcode project that is generated in `TNSGoogleMaps/platforms/ios/TNSGoogleMaps.xcodeproj`.

For convenience we will consider that you will place the _GoogleMaps.framework_ in `TNSGoogleMaps/deps/GoogleMaps.framework`.

[Follow the 'getting started' tutorial provided by Google to obtain and add the framework to the Xcode project, and obtain API key](https://developers.google.com/maps/documentation/ios/start). This includes all steps such as dragging _GoogleMaps.framework_ and _GoogleMaps.bundle_ in your project. Adding all dependencies such as: _AVFoundation.framework_, _CoreData.framework_, _CoreLocation.framework_, _CoreText.framework_, _GLKit.framework_, _ImageIO.framework_, _libc++.dylib_, _libicucore.dylib_, _libz.dylib_, _OpenGLES.framework_, _QuartzCore.framework_, _SystemConfiguration.framework_. The only thing to skip is setting up the AppDelegate.

The last point of the Google tutorial is setting up the AppDelegate. We will do that in JavaScript instead. You will also need a module map to help the NativeScript framework expose the Google maps APIs.

### Add Module Map
To add module map you will need to create a text file in:

`TNSGoogleMaps/deps/module.map`

With the following content:
```
framework module * {
}
```

Given you have other frameworks this module maps will help clang group the APIs by 'modules'. The NativeScript framework uses clang for iOS to extract API information from these headers.

> **NOTE:** There is a proposal that APIs will be removed from the global object and pulled through require. The GoogleMaps for APIs for example may be used with `var gm = require("objc!GoogleMaps");` in the near future.

### Set the API Key and Display a GoogleMap View
We will use the default template to add a `Placeholder` element in the common UI mark up that will host an iOS specific UI. This is the main-page.xml:
```XML
<Page xmlns="http://www.nativescript.org/tns.xsd" loaded="pageLoaded">
  <GridLayout rows="auto, auto, auto, *">
    <Label row="0" text="Tap the button" cssClass="title"/>
    <Button row="1" text="TAP" tap="{{ tapAction }}" />
    <Label row="2" text="{{ message }}" cssClass="message" textWrap="true"/>
    <Placeholder row="3" creatingView="createMapView" />
  </GridLayout>
</Page>
```

And we will set the API key and create the map view in `main-page.js`:
```JavaScript
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
	// Note that in-line functions such as CLLocationCoordinate2DMake are not exported.
	marker.position = { latitude: -33.86, longitude: 151.20 }
	marker.title = "Sydney";
	marker.snippet = "Australia";
	marker.map = mapView;

	console.log("Displaying map...");
	args.view = mapView;
}
exports.createMapView = createMapView;
```


