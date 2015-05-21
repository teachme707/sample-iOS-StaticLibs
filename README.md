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

## Using CocoaPods
![GoogleMaps](Screenshots/CocoaPods.png)

#### CocoaPods can now Use Frameworks
Lets create a NativeScript project:

```bash
$ tns create TNSCocoaPods
$ cd TNSCocoaPods
$ tns platform add ios
$ tns run ios --emulator
```

CocoaPods now supports the `use_frameworks!` statement that will generate a dynamic shared framework for the pods. Dynamic frameworks are a first class citizen in the NativeScript framework.

Like in the GoogleMaps example, you will work with the Xcode project located in `TNSCocoaPods\platforms\ios\TNSCocoaPods.xcodeproj` to set up the libraries.

CocoaPods will require a podfile located at `TNSCocoaPods\platforms\ios\Podfile`. We will add the following libraries:
```
platform :ios, '8.0'
use_frameworks!

target 'TNSCocoaPods' do
	pod 'iCarousel'
	pod 'FontAwesome+iOS'
	pod 'AFNetworking'
end
```

Then at `TNSCocoaPods\platforms\ios\` run:
``` bash
$ pod install
```

This will install all cocoa pods, create an Xcode workspace and set the required dependencies.
> **NOTE:** From that point on, you will have to open the generated `TNSCocoaPods.xcworkspace` and work with it. In future we will have to update the NativeScript CLI to build using the workspace instead the project.

> **NOTE:** You will have to set add the `$(inherited)` flag in the Other Linker Flags of the _TNSCocoaPods_ target in both the Debug and Release configurations.

Since the pods will be put in dynamic framework our metadata generator will build metadata from their headers and expose their Objective-C APIs in the JavaScript runtime.

We will set a simple carousel. Similar to the Google Maps example add the following UI in `TNSCocoaPods\app\main-page.xml`:
```XML
<Page xmlns="http://www.nativescript.org/tns.xsd" loaded="pageLoaded">
  <GridLayout rows="auto, auto, auto, *">
    <Label row="0" text="Tap the button" cssClass="title"/>
    <Button row="1" text="TAP" tap="{{ tapAction }}" />
    <Label row="2" text="{{ message }}" cssClass="message" textWrap="true"/>
    <Placeholder row="3" creatingView="createCarouselView" />
  </GridLayout>
</Page>
```

And the following JavaScript in `TNSCocoaPods\app\main-page.js` to integrate the carousel in the UI:
``` JavaScript
var vmModule = require("./main-view-model");
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = vmModule.mainViewModel;
}
exports.pageLoaded = pageLoaded;

var CarouselData = NSObject.extend({
    init: function() {
        NSObject.prototype.init.apply(this, arguments);

        this._items = ['4zSb0qS', 'jCUvdej', 'bq7JddZ', 'K815GK5', 'GTeMJud', 'SEUNWpX'];
        this._placeholder = UIImage.imageWithIconBackgroundColorIconColorIconScaleAndSize("icon-spinner", UIColor.clearColor(), UIColor.blackColor(), 1, CGSizeMake(150, 150));

        return this;
    },

    numberOfItemsInCarousel: function(carousel) {
    	console.log("Numbers of items: " + this._items.length);
        return this._items.length;
    },

    carouselViewForItemAtIndexReusingView: function(carousel, index, view) {
    	console.log("Item at index: " + index);
        if (!view) {
            view = new UIImageView(CGRectMake(0, 0, 280, 175));
            view.setImageWithURLPlaceholderImage(NSURL.URLWithString('http://i.imgur.com/' + this._items[index] + '.jpg'), this._placeholder);
            view.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFit;
        }

        return view;
    }
}, {
    protocols: [iCarouselDataSource, iCarouselDelegate]
});

var carousel;
var carouselData;

function createCarouselView(args) {
	carousel = new iCarousel();
    carousel.type = iCarouselType.iCarouselTypeCoverFlow2;

    carouselData = CarouselData.alloc().init();
    
    carousel.delegate = carouselData;
    carousel.dataSource = carouselData;
    
    args.view = carousel;
    console.log("Created carousel: " + carousel);
}
exports.createCarouselView = createCarouselView;
```

Open the `platforms\ios\TNSCocoaPods.xcworkspace` and run in simulator.

Cocoa pods integration with NativeScript for iOS will be quite smooth.