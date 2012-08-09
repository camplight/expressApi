
var mongojs = require('mongojs');
var Actions = require("./Actions");
var express = require("express");
var MongoStore = require('connect-mongo')(express);
var _ = require("underscore");

var app = module.exports = express.createServer();

app.useExpressApiMiddleware = function(options){
  
  var cookie_secret = options.cookie_secret;
  var dbname = options.dbname;
  var store = app.store = global.store = mongojs.connect(dbname);

  app.use(express.cookieParser());
  app.use(express.session({
    secret: cookie_secret,
    store: new MongoStore({
      db: dbname
    })
  }));
  app.use(function(req, res, next){
    req.store = store;
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    next();
  });
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);

  return express;
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