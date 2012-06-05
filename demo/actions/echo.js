var Actions = require("expressApi/Actions");
var Token = require("../models/Token");

module.exports = Actions.extend({
  root: "/echoService",
  
  routes: {
    "GET /orSomethingFunky/:message?": "GET /:message?",
    "GET /somethingElse/:message?": "getMessage"
  },

  "GET /test/:message?": "getMessage",

  getMessage: function(req, res, next) {
    Token.findByMessage(req.params.message, {
      success: function(token){
        res.send(token);
      },
      error: function(err){
        res.send(err);
      }
    });
  },

  "GET /:message?": function(req, res, next) {
    Token.findByMessage(req.params.message, {
      success: function(token){
        res.result(token);
      },
      error: res.error
    });
  },
  "PUT|POST /:message?": function(req, res, next) {
    var token = new Token();
    token.set({value: req.params.message || "message not found"});
    token.save({
      success: res.result,
      error: res.error
    });
  },
  "DELETE /:message?": function(req, res, next) {
    Token.deleteByMessage(req.params.message, {
      success: res.result,
      error: res.error
    });
  }

});