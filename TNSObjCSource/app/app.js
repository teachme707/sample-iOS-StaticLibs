
var tracer = TNSTrace.alloc().init();
tracer.trace();

var application = require("application");
application.mainModule = "main-page";
application.cssFile = "./app.css";
application.start();
