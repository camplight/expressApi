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
      if(doc != null)
        options.success(new Token(doc));
      else
        options.success(null);
    });
  },
  deleteByMessage: function(message, options){
    Token.store().remove({value: message}, {multi: false}, function(err, count){
      if(err){ options.error(err); return; }
      if(count == 1)
        options.success(true);
      else
        options.success(false);
    });
  }
});