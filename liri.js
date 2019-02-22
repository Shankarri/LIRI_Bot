// import in the action.js file to get the constructors and store it on variables
var action = require("./action");
var Band = action.Band;
var Movie = action.Movie;
var Song = action.Song;

//import the file stream to read and write files
var fs = require("fs");

// get the values from the user input
var liriAction = process.argv[2];

var liriArguments = process.argv.slice(3).join(" ");
var count = 10;
if(liriArguments.indexOf(" count-")>0)
    {
        count = liriArguments.split(" count-")[1];
        liriArguments = liriArguments.split(" count-")[0];
        // console.log("count", count, liriArguments);
    }

// Print Loading while you wait for the results
console.log(" \n \t\t\t\t Loading................\n");

// -----------------------------------------------------------------------------------------------------//
// Only if a one of the action arguments was provided
if (liriAction) {

    // intialize your all 3 constructors 
    var band = new Band(liriArguments);
    var movie = new Movie(liriArguments);
    var song = new Song(liriArguments);

    liriAction = liriAction.toLowerCase();

    //if user provide "concert-this" as input, then call bandAjax function
    if (liriAction === "concert-this" && liriArguments) {
           band.bandAjax(count);
    }
    
    //if user provide "movie-this" as input, then call movieAjax function
    else if (liriAction === "movie-this") {
        // if user has provided any movie name
        if (liriArguments) {
           movie.movieAjax();
        }
        // if user has provided not given any movie name arguments, then diplay the below message
        else {
            console.log("\n If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
            console.log("\n It's on Netflix!");
        }
    }

    //if user provide "spotify-this-song" as input, then call songAjax function
    else if (liriAction === "spotify-this-song") {
        song.songAjax(count);
    }

    //if user provide "do-what-it-says" as input, have to take values from random.txt file
    else if (liriAction === "do-what-it-says") {

        // use fs to read the random.txt file and store the file content in data
        fs.readFile("random.txt", "utf8", function(error, data) {
            // If there is any error in reading the file, then return err
            if (error) {
              return console.log(error);
            }          

            // Instead of changing the content inside the random.txt file to test the liri bot action everytime
            // Declared 3 different liri action commands in the file and ranndomly select one line from it to execute
            var dataArr = data.split("\r\n");   
            var randomitem = (dataArr[Math.floor(Math.random()*dataArr.length)]).split(",");  
            var arguments = randomitem[1].replace(/"/g, '');

            // after randomly selecting one line, according to the content select case and execute
            switch (randomitem[0])
            {
                case "concert-this":
                bband.bandAjax(count);
                break;

                case "spotify-this-song":
                song.songAjax(count);
                break;

                case "movie-this":
                movie.movieAjax();
                break;
            }

            // Add the randomly selected command to Log.txt for tracking purpose
            fs.appendFile("log.txt", " \n \n Randomly selected command --> " + randomitem.join(" ")+" \n", function (err) {
                if (err) throw err;
                // Since the function is reandomly selected, displaying it console at the start
                console.log("\n **** Randomly selected command --> " + randomitem.join(" ")+" \n");
            });
          });
    }

    // If the given arguments are not in the correct format, display the correct format
    else {
        errormsg();
    }

    // Add commands typed by user to Log.txt for each tracking
    fs.appendFile("log.txt", "Command typed --> " + liriAction + " " + liriArguments, function (err) {
        if (err) throw err;
    });
}

// -----------------------------------------------------------------------------------------------------//
// If the user has not entered anything after 
else {
    errormsg();
}

function errormsg()
{
    console.log("\n ** No response found **" +
        "\n\n Please enter the arguments in below formats :"+
        "\n\n node liri.js concert-this <artist/band name here> [count-<value>]"+
        "\n\n node liri.js movie-this '<movie name here>'"+
        "\n\n node liri.js spotify-this-song '<song name here> [count-<value>]'"+
        "\n\n node liri.js do-what-it-says");
}
// -----------------------------------------------------------------------------------------------------//