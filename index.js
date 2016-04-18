/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var https = require('https');
var urlPrefix = "http://api.icndb.com/jokes/random";

var ChuckNorris = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
ChuckNorris.prototype = Object.create(AlexaSkill.prototype);
ChuckNorris.prototype.constructor = ChuckNorris;

ChuckNorris.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
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
        var speechOut = fetchChuckNorrisFact();
        var cardTitle = "Chuck Norris Facts";
        var cardSpeech = speechOut;

        response.tellWithCard(speechOut, cardTitle, cardSpeech);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say give me a fact!", "You can say give me a fact!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var chuckNorris = new ChuckNorris();
    chuckNorris.execute(event, context);
};

function fetchChuckNorrisFact()
{
    var url = urlPrefix; 

    https.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            console.log( body );
            var stringResult = body["value"]["joke"];
            return stringResult;
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}
