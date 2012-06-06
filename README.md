expressApi
==========
Helper node.js module for expressjs applications usable when building http APIs.

Contains:
- Backbone Models wired to MongoDB
- MongoDB session support using connect-mongo for express apps
- Actions(http request & response handlers)


# Usage #
add in `package.json` dependency to "expressApi". then create app.js file with the following:

    var app = require("expressApi");
    
    app.configure(function(){
      app.useExpressApiMiddleware("databaseName", "cookieSecret");
    });

    app.addActions(require("./actions/echoActions.js"));

    app.listen(8000, function(){
      console.log("server started");
    })

in ./actions/echoActions.js place actions routes and handlers as follows:

    var Actions = require("expressApi/Actions");

    var EchoActions = module.exports = Actions.extend({
      root: "/",

      "POST /echo": function(req, res, next) {},
      "GET /echo/:id": function(req, res, next) {},
      ...
    });

to create a Model just place standard Backbone.Model implementation like follows:

    var Backbone = require("expressApi/BackboneMongo");

    var MyModel = module.exports = Backbone.Model.extend({
      collectionName: "myCollection",
      defaults: {},
      initialize: function(){}
    },{
      staticMethod: function(){
        MyModel.store().find(...);
      }
    });

to use Model follow Backbone:

    var MyModel = require("MyModel");
    var instance = new MyModel({ property1: "value1" });

    // passing 'null' as first argument should notify Backbone to store all properties
    instance.save(null, {
      success: function(model){
        // instance == model
      },
      error: function(model, err) {

      }
    });


# Reference #

## expressApi ##
- useExpressApiMiddleware(databaseName, cookieSecret)
- addActions({} or ActionsClass)

## BackboneMongo.Model ##

## BackboneMongo.Collection ##

## Actions ##

    var MyActions = Actions.extend({
      root: "/somePath",

      response: function(res) {
        // modify express' res object before calling any action
      },

      request: function(req) {
        // modify express' req object before calling any action
      },

      routes: {
        "GET /path": "myMethod",
        "POST /path": "myMethod",
        "DELETE /path": function(req, res, next) {
          // req & res objects are already modified here
        }
      },

      myMethod: function(req, res, next) {
        // req & res objects are already modified here
      },

      "PUT /pathMe": function(req, res, next) {
        // the full path to this action is /somePath/pathMe accordingly to root
      },

      "GET /pathMe/:helloParam": function(req, res, next) {},

      "GET /pathMe2/:helloParam": [
        function(req, res, next) {
          // as before req & res objects are already modified,
          // and this method will be invoked first accordingly the array
          next(); // call next to invoke the next method ;)
        },
        function(req, res, next) {
          // this will be invoked second accordingly to the array
          res.result(true);
        }
      ]
    })