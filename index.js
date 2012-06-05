
var mongojs = require('mongojs');
var Actions = require("./Actions");
var express = require("express");
var MongoStore = require('connect-mongo')(express);
var _ = require("underscore");

var app = module.exports = express.createServer();

app.useExpressApiMiddleware = function(options){
  
  var cookie_secret = options.cookie_secret;
  var dbname = options.dbname;
  var store = global.store = mongojs.connect(dbname);

  app.use(express.cookieParser());
  app.use(express.session({
    secret: cookie_secret,
    store: new MongoStore({
      db: dbname
    })
  }));
  app.use(function(req, res, next){
    req.store = store;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
}

app.addActions = function(input){
  var actions;
  if(typeof input == "function") {
    actions = new input({});
  } else {
    input = _.extend(input, {});
    actions = new Actions(input);
  }
  actions.registerActions(app);
  return actions;
}

module.exports = app;