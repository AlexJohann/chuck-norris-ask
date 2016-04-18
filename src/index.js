/**
 * App ID for the skill
 */
var APP_ID = undefined; 

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var http = require('http');
var urlPrefix = "http://api.icndb.com/jokes/random";

var ChuckNorris = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
ChuckNorris.prototype = Object.create(AlexaSkill.prototype);
ChuckNorris.prototype.constructor = ChuckNorris;

ChuckNorris.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("ChuckNorris onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

ChuckNorris.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("ChuckNorris onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to Chuck Norris facts, you can say give me a fact";
    var repromptText = "You can say give me a fact";
    response.ask(speechOutput, repromptText);
};

ChuckNorris.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("ChuckNorris onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

ChuckNorris.prototype.intentHandlers = {

    "ChuckNorrisIntent": function (intent, session, response) {
        var speechOut = "Chuck is working"; 
        var cardTitle = "Chuck Norris Facts";
        var cardSpeech = speechOut;

        fetchChuckNorrisFact( response );
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say give me a fact!", "You can say give me a fact!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var chuckNorris = new ChuckNorris();
    chuckNorris.execute(event, context);
};

function fetchChuckNorrisFact( response )
{
    var url = urlPrefix; 
    http.get(url, function(res) {
        var body = '';

        console.log(res);

        res.on('data', function (chunk) {
            body += chunk;
            console.log(body);
        });

        res.on('end', function () {
            var chuckFact = JSON.parse(body);
            response.tell("Did you know: " + chuckFact.value.joke );
        });
    }).on('error', function (e) {
        response.tell("I am sorry, but I couldn't reach Chuck Norris wisdom on the web. Try again later. " + e.message );
    });

}
