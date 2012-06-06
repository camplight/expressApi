var mode = process.env.NODE_ENV || "development";
var nconf = require('nconf').argv().env().file({ file: __dirname+'/config/'+mode+'.json' });

var app = require("expressApi");
var Token = require("./models/Token");

app.configure(function(){
  app.useExpressApiMiddleware({
    dbname: nconf.get("database:name"),
    cookie_secret: nconf.get("cookie_secret")
  });
});

var EchoActions = require("./actions/echo");
app.addActions(EchoActions);

app.addActions({
  root: "/otherAction",
  request: function(req) {
  },
  response : function(res) {
    var startTime = new Date();
    res.result = function(data) {
      res.send({myResult: data, time: (new Date()).getTime()-startTime.getTime()});
    }
  },
  "GET /me": function(req, res, next) {
    res.result("Hello World");
  }
});

var echoActionsInstance = new EchoActions({
  root: "/echoActionsClone"
});
echoActionsInstance.registerActions(app);
app.get("/other/:message", echoActionsInstance.getMessage);


app.addActions({
  "GET /": function(req, res, next){
    res.result("Welcome to expressApi");
  },
  "GET /version": [
    function(req, res, next){
      res.version = require("../package.json").version;
      next();
    },
    function(req, res, next){
      res.result(res.version);
    }
  ],
  "POST /token": function(req, res, next) {
    var token = new Token(req.body);
    token.save(null, {
      success: function(){
        res.result(token);
      },
      error: res.error
    });
  },
  "POST /clear": function(req, res, next){
    app.store.collection(Token.prototype.collectionName).remove({},{multi: true}, function(err, count){
      if(err) { res.error(err); return; }
      res.result(count);
    });
  }
});

app.listen(nconf.get("port"), function(){
  console.log("demo app running in "+app.settings.env+" at "+app.address().port);
});