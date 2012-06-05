var Base = require("./Base");

var Token = module.exports = Base.extend({
  collectionName: "tokens",

  defaults: {
    value: "",
  },

  initialize: function(){
    Base.prototype.initialize.call(this);
  }
},
{
  findByMessage: function(message, options){
    Token.store().findOne({value: message}, function(err, doc){
      if(err) { options.error(err); return; }
      options.success(doc);
    });
  },
  deleteByMessage: function(message, options){
    Token.store().remove({value: message}, {multi: false}, function(err, count){
      if(err || count == 0){ options.error(err || "not found"); return; }
      options.success(true);
    });
  }
});