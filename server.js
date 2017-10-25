var mongoose   = require("mongoose");
var request    = require("request");
var bodyParser = require('body-parser')
var cheerio    = require("cheerio");
var exphbs     = require('express-handlebars');
var express    = require("express");


// Require the models
var db = require("./models");

// Initialize Express
var app = express();

// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoscraper", {
  useMongoClient: true
});

// Routes
app.get("/", function(req, res) {
  db.Article
  .find({saved: false})
  .then(function(results) {
    res.render('index', { articles: results } );
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  db.Article
  .find({})
  .then(function(results) {
    // If we were able to successfully find Articles, send them back to the client
    res.json(results);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

// Scrape data and place it into the mongodb
app.get("/scrape", function(req, res) {

  request("http://abc7.com/news/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "headline" class
    $(".headline").each(function(i, element) {
      // Crete an empty object to hold the article title and image
      var article = {};
      // Save the text of the element in a "title" variable
      article.title = $(element).text();
      // Save the href into the link variable
      article.link = "http://abc7.com/news/" + $(element).parent().attr("href");

      // Insert the data in the articles collection in the mongoDB
      db.Article.create(article)
        .then(function(results) {
        })
        //sends back error
        .catch(function(err) {
        res.json(err);
        });
    });
    res.redirect("/");
  });
});

// This route changes the saved bool to true. This route is called when save is clicked.
app.put("/save/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    {
     _id: req.params.id 
    }, 
    { 
      saved: true 
    }
  ).then(function(results) {
    res.json(results);
  }).catch(function(err) {
    res.json(err);
  });
});

// This route changes the saved bool to false. This route is called when unsave is clicked.
app.put("/unsave/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { 
      _id: req.params.id 
    }, 
    { 
      saved: false 
    }
  ).then(function(results) {
    console.log(results);
    res.json(results);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for all saved articles
app.get("/saved", function(req, res) {
  db.Article.find(
    { 
      saved: true 
    }
  ).then(function(results) {
    res.render('saved', { articles: results } );
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});