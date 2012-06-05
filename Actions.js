var Backbone = require("backbone");
var ActionResponse = require("./ActionResponse");
var _ = require("underscore");

module.exports = function(attributes) {
  for(var key in attributes)
    this[key] = attributes[key];
  this.request = this.request || function(req) {};
  this.response = this.response || ActionResponse.augment;
}

module.exports.prototype = {
  registerAction : function(app, method, url, action) {
    var request = this.request;
    var response = this.response;
    var handler = function(req, res, next){
      request(req);
      response(res);
      action(req, res, next);
    };
    var args = [url];
    if(Array.isArray(action)) {
      _.each(action, function(a){
        args.push(function(req, res, next){
          request(req);
          response(res);
          a(req, res, next);
        });
      });
    } else {
      args.push(function(req, res, next){
        request(req);
        response(res);
        action(req, res, next);
      });
    }
    switch(method) {
      case "GET":
        app.get.apply(app, args);
      break;
      case "POST":
        app.post.apply(app, args);
      break;
      case "PUT":
        app.put.apply(app, args);
      break;
      case "DELETE":
        app.del.apply(app, args);
      break;
    }
  },
  exportHttpActions : function(app, root, actions) {
    var root = actions.root || root;

    for(var key in actions) {
      if(key == "routes") {
        this.exportHttpActions(app, root,  actions.routes);
        continue;
      }
      if(key.indexOf(" ") === -1) continue;

      var parts = key.split(" ");
      var method = parts.shift();
      var url = parts.pop();
      var actionHandler = actions[key];
      if(typeof actionHandler === "string") {
        actionHandler = this[actionHandler];
        if(typeof actionHandler !== "function" && !Array.isArray(actionHandler))
          throw new Error(actionHandler+" was not found");
      }
      this.registerAction(app, method, root+url, actionHandler);
    }
  },
  registerActions: function(app, root){
    this.exportHttpActions(app, root || "", this);
  }
}

module.exports.extend = Backbone.View.extend;