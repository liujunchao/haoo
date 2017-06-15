var http = require('http');
var fs = require('fs');

var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
}


download("http://at.alicdn.com/t/font_9lur1kofcjrod2t9.js", "./lib/icon/icon.js", function() {
    console.log("downloaded");
});