var express = require("express");
var bodyParser = require("body-parser");
var linkedin = require('linkedin-scraper2');
var domain = require('parse-domain');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(request, response) {
  var linkedinURL = request.query.url;
  if (!linkedinURL) {
    return response.json({
      success: false,
      data: {
        message: 'You have not provided a LinkedIn profile URL.'
      }
    });
  }

  isLinkedInURL(linkedinURL, function(error, isUrl) {
    if (error) {
      return response.json({
        success: false,
        data: {
          message: error.message
        }
      });
    }

    linkedin(linkedinURL, function(error, profile) {
      if (error) {
        return response.json({
          success: false,
          data: {
            message: error.message
          }
        });
      }
      response.json({
        success: true,
        data: profile
      });
    });
  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port %s...", process.env.PORT || 3000);
});

var isLinkedInURL = function(url, callback) {
  var parsedUrl = domain(url);
  if (parsedUrl) {
    if (parsedUrl.domain !== 'linkedin') {
      return callback(new Error('URL does not seem to be a LinkedIn URL.'), null);
    } else {
      callback(null, true);
    }
  } else {
    return callback(new Error('URL does not seem to be in a recognizable form.'), null);
  }
};
