var mongoose = require("mongoose");
var request = require("request");
var bodyParser = require('body-parser')
var cheerio = require("cheerio");
var exphbs = require('express-handlebars');
var express = require("express");
var PORT       = process.env.PORT || 3000;
var MONGODB_URI = MONGOLAB_PURPLE_URI || "mongodb://localhost/mongoscraper";


// Require the models
var db = require("./models");

// Initialize Express
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Initialize Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the MongoDB
mongoose.Promise = Promise;
mongoose.connect(MONGOLAB_PURPLE_URI, {
  useMongoClient: true
});

// Home Route. Shows the previously scraped articles that haven't been saved yet.
app.get("/", function(req, res) {
    db.Article.find({
            saved: false
        }).then(function(results) {
            res.render('index', { articles: results });
        })
        .catch(function(err) {
            // Catches any errors that occurred and sends the it back.
            res.json(err);
        });
});

// Retrieve data from the mongoDB
app.get("/all", function(req, res) {
    db.Article.find({})
        .then(function(results) {
            //Finds any articles that exist and outputs Json results.
            res.json(results);
        })
        .catch(function(err) {
            // Catches any errors that occurred and sends the it back.
            res.json(err);
        });
});

// Scrape data and place it into the mongoDB
app.get("/scrape", function(req, res) {


    request("http://abc7.com/news/", function(error, response, html) {
        // Load the html body from request into cheerio
        var $ = cheerio.load(html);
        // For each element with a "headline" class
        $("div.headline-list-item").each(function(i, element) {
            // Crete an empty object to hold the article title and image
            var article = {};
            // Save the text of the element in a "title" variable
            article.title = $(element).children().children(".headline").text();
            // Save the href into the link variable
            article.link = "http://abc7.com/news/" + $(element).children().attr("href");
            // Save an image src if one exists
            article.image = $(element).children().children(".image").children().attr("src");

            // Insert the data in the articles collection in the mongoDB
            db.Article.create(article)
                .then(function(results) {})
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
    db.Article.findOneAndUpdate({
        _id: req.params.id
    }, {
        saved: true
    }).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        res.json(err);
    });
});

// This route changes the saved bool to false. This route is called when unsave is clicked.
app.put("/unsave/:id", function(req, res) {
    db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            saved: false
        }).then(function(results) {
            console.log(results);
            res.json(results);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Route for all saved articles
app.get("/saved", function(req, res) {
    db.Article.find({
            saved: true
        }).then(function(results) {
            res.render('saved', { articles: results });
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Set the app to listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000");
});