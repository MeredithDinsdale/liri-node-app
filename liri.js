var dotenv = require("dotenv").config();
var Spotify = require('node-spotify-api');
var axios = require('axios');
var keys = require("./keys.js");
var inquirer = require('inquirer');
var moment = require('moment');
var fs = require('fs');

const arguments = process.argv;
var liriCommand = arguments[2];
var query = arguments.slice(3).join(" ");


//MOVIES SEARCH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var movieThis = function(movieQuery){
    if (!movieQuery){
        movieQuery = "Mr. Nobody"
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function(response) {
          console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
          console.log("Here is what I know about that movie:");
          console.log('Title: '+ (response.data.Title));
          console.log('Year: '+ (response.data.Released));
          console.log('Country: '+ (response.data.Country));
          if (response.data.Ratings[0] === undefined){
            console.log('This film has not been rated by IMDB.');
        }
        else {
            console.log('IMDB Rating: '+ (response.data.Ratings[0].Value));  
        }
          if (response.data.Ratings[1] === undefined){
              console.log('This film has not been rated by Rotten Tomatoes.');
          }
          else {
            console.log('Rotten Tomatoes Rating: '+ (response.data.Ratings[1].Value));  
          }
          console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        }
    );
}

//SONGS SEARCH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var spotifyThis = function(trackQuery){
    // console.log(query);
    var spotify = new Spotify(keys.spotify);
    if (!trackQuery){
        trackQuery = "the sign ace of base"
    }
    spotify.search({ type: 'track', query: trackQuery}, function(error, data) {
	    if(error) { 
	        console.log('Error occurred: ' + error);
        } 
        
        else { 
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log("Song: " + data.tracks.items[0].name);
            for(var i = 0; i < data.tracks.items[0].artists.length; i++) {
                if(i === 0) {
                    console.log("Artist(s):" + data.tracks.items[0].artists[i].name);
                } else {
                    console.log("" + data.tracks.items[0].artists[i].name);
                }
            }
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        }
    })
}
//CONCERTS SEARCH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var concertThis = function(artistQuery){
    if (!artistQuery){
        console.log('You have to enter an artist to search for shows!')
    }
    else {
    var queryUrl = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function(response) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log("These are the five upcoming shows by that artist:");
            console.log(' ');
            console.log("-----------------------");
            var data = response.data;
            for(var i = 0; i < 4; i++) {
            console.log(moment(data[i].datetime).format("MM/DD/YYYY"));
            console.log("Venue: " + data[i].venue.name);
            console.log("City: " + data[i].venue.city);
            console.log("-----------------------");
            }
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    });
  }
}
//RANDOM~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var random = function(){

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        var dataArr = data.split(", ");
        if (dataArr[0] === "spotifyThis"){
            spotifyThis(dataArr[1])
        }
        else if (dataArr[0] === "movieThis"){
            movieThis(dataArr[1])
        }
        else if (dataArr[0] === "concertThis"){
            concertThis(dataArr[1])
        }
        else {
            console.log('Hmm, something seems to be wrong...');
        }

      });     
}
//Commands~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
if (liriCommand === "spotify-this"){
    spotifyThis(query);
}

if (liriCommand === "imdb-this"){
    movieThis(query);
}

if (liriCommand === "bandsInTown-this"){
    concertThis(query);
}

if (liriCommand === "do-what-it-says"){
    random();
}

