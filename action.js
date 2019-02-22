// import all the packages needed for the action.js 
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");

// configure all the values for spotify API
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var divider = "\n------------------------------------------------------------\n\n";


// -----------------------------------------------------------------------------------------------------//

// Define a Movie constructor for future purpose
var Movie = function (movieName) {
    
    this.movieName= movieName;
    var queryUrl = "http://www.omdbapi.com/?t=" + this.movieName + "&y=&plot=short&apikey=trilogy";
    
    // Define movie Ajax function to get all the movie details  
    this.movieAjax = function () {
        axios.get(queryUrl).then(function (response) {
            // console.log(response.data);
            var movieData = response.data;

            // If we have search reaults for the user input movie
            if (movieData.Response != "False") {
                var logData = [];
                
                //push all the details to an logData array to display in the page as well as in log file
                logData.push(
                    "\n ** Title of the movie: \t\t\t" + movieData.Title,
                    "\n ** Year the movie came out : \t\t\t" + movieData.Year,
                    "\n ** IMDB Rating of the movie : \t\t\t" + movieData.imdbRating);
                
                // since we have more than one ratings in the response data, check all the ratings and find only Rotten tomatoes
                var ratings = movieData.Ratings;
                for (var index in ratings) {
                    if (ratings[index].Source === 'Rotten Tomatoes') {
                        logData.push("\n ** Rotten Tomatoes Rating of the movie : \t" + ratings[index].Value);
                    }
                }

                // continue to push rest of the details
                logData.push("\n ** Country where the movie was produced : \t " + movieData.Country,
                    "\n ** Language of the movie : \t\t\t" + movieData.Language,
                    "\n ** Actors in the movie : \t\t\t" + movieData.Actors,
                    "\n ** Plot of the movie : \t\t\t" + movieData.Plot);

                // Add the results of the liribot to Log.txt
                fs.appendFile("log.txt", logData + divider, function (err) {
                    if (err) throw err;
                    // Display the results in the page
                    console.log(logData.join(" "));
                });
            }
            else {
                // If the searched movie does not have any response, then show  error message to the user
                console.log("\n ** There is no search result for the movie - " + movieName + " **");
            }
        }).catch(function (error) {
            console.log(error);
        });
    }
}

// -----------------------------------------------------------------------------------------------------//

// Define a Band constructor for future purpose
var Band = function (bandName) {
    this.bandName = bandName;
    var queryUrl = "https://rest.bandsintown.com/artists/" + this.bandName + "/events?app_id=codingbootcamp&date=upcoming";

    // Define band Ajax function to get all the concert event details of that band 
    this.bandAjax = function(bandcount){
    axios.get(queryUrl).then(function (response) {
        var eventData = response.data;
        // console.log(eventData);  
        // if response has atleat one event
        if (eventData.length > 0) {

            //Display the results count heading
            console.log("--------------------------" +
                "\n ** Top " + bandcount + " search Results ** " +
                "\n--------------------------");

            var logData = [];
            //go through all the events and display the results
            for (var index in eventData) {
                //check count varaible to displaying correct number of results 
                if (bandcount > 0) {
                    var eventNo = parseFloat(index) + 1;
                    logData.push(
                        "\n \n Event : " + eventNo,
                        "\n ** Name of the venue :\t" + eventData[index].venue.name,
                        "\n ** Location of the Venue :\t" + eventData[index].venue.city + " , " + eventData[index].venue.country);
                    
                        // Change the event Date format to required format using moment pacakge and display result
                       var eventDate= moment(eventData[index].datetime.split("T")[0]).format("MM/DD/YYYY");
                        logData.push( "\n ** Data of the Event :\t" + eventDate,
                        "\n ** Time of the Event: " + eventData[index].datetime.split("T")[1]);
                    bandcount--;
                }
                else {
                    //count comes to zero break out of this loop
                    break;
                }
            }
            // Add the results of the liribot to Log.txt
            fs.appendFile("log.txt", logData + divider, function (err) {
                if (err) throw err;
                // Display the results in the page
                console.log(logData.join(" "));
            });

        }
        else {
            // If the searched movie does not have any response, then show  error message to the user
            console.log("\n ** There is no search result for the Band - " + bandName + " **");
        }
    }).catch(function (error) {
        console.log(error);
    });
}}

// -----------------------------------------------------------------------------------------------------//

// Define a Song constructor for future purpose
var Song = function (songName) {
        this.songName = songName;
    if (this.songName == "") {
        this.songName = "The Sign + Ace of Base";
    }
    // Define song Ajax function to get songs with user input song words
    // add user provided results count also in the query
    this.songAjax = function(songcount){
        spotify.search({ type: 'track', query: this.songName, limit: songcount }, function (err, data) {
        //if spotify search did not work - display error
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        else {
            var logData = [];
            var songData = data.tracks.items;
            // if response has atleat one song
            if (songData.length > 0) {

                //Display the results count heading
                console.log("--------------------------" +
                    "\n ** Top " + songcount + " search Results ** " +
                    "\n--------------------------");
                //go through all the songs and display the results
                for (var index in songData) {
                    var songNo = parseFloat(index) + 1;
                    logData.push("\n \n Song : " + songNo,
                        "\n ** Artist: \t\t" + songData[index].artists[0].name,
                        "\n ** Song: \t\t" + songData[index].name,
                        "\n ** Preview URL: \t" + songData[index].preview_url,
                        "\n ** Album: \t\t" + songData[index].album.name);
                }
                // Add the results of the liribot to Log.txt
                fs.appendFile("log.txt", logData + divider, function (err) {
                    if (err) throw err;
                    console.log(logData.join(" "));
                });
            }
            else {
                // If the searched somg does not have any response, then show error message to the user
                console.log("\n ** There is no search result for the song - " + songName + " **");
            }
        }
    });
}}


// export all 3 constructors to be used in liri.js page
module.exports = {
    Movie: Movie,
    Band: Band,
    Song: Song
};

