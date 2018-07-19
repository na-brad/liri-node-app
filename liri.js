require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request")
var fs = require("fs");
var keys = require("./keys.js")



// var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var item = process.argv.slice(3).join("+");


var params = { screen_name: 'Brad23542103' };




function run (command, item){
switch (command) {
    case "my-tweets":
        getTweets();
        break;

    case "spotify-this-song":
        switch(item){

            case "":
            getSong("The Sign Ace of Base");
            break;

            case item:
            getSong(item)
            break;

        }
    break;

    case "movie-this":
        getMovie(item);
        break;

    case "do-what-it-says":
        doIt();
        break;

    
}
}

function getTweets() {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            tweets.forEach(function (element) {
                console.log(element.text);
                console.log(element.created_at);
                console.log("----------------------")
            })
        }
    });
}

function getSong(item) {
    spotify.search({ type: 'track', query: item }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //    var dataString = JSON.stringify(data).tracks.items;
        var songs = data.tracks.items[0];

        // songs.forEach(function (element) {
            console.log("Arist(s): " + songs.artists.map(getArtists));
            console.log("Song Name: " + songs.name);
            console.log("Preview URL: " + songs.album.name);
            console.log("Album: " + songs.preview_url);
            console.log("--------------------");
        // })

    });
}
var getArtists = function(artist){
    return artist.name;
}

function getMovie(item) {
    request("http://www.omdbapi.com/?y=&plot=short&apikey=trilogy&t=" + item, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonData = JSON.parse(body);
            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            // console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("IMDB Rating: " + jsonData.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
        }
    });
}

function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        // We will then re-display the content as an array for later use.

        run(dataArr[0], dataArr[1]);
    });
}
run(command,item);