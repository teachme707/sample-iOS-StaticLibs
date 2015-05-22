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


