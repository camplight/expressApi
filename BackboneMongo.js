var Backbone = require("backbone");
var _ = require("underscore");

Backbone.sync = function(method, model, options){
  var callback = function(err, resp){
    if(err)
      options.error(err);
    else
      options.success(resp);
  }

  var store = global.store.collection(model.collectionName);
  switch(method) {
    case "read":
      if(model.id)
        store.findOne({_id: model.id}, options, callback);
      else
        store.find(options.pattern || {}, options, callback);
    break;
    case "create":
      store.save(model.toJSON(), options, callback);
    break;
    case "update":
      if(model.id)
        store.update({_id: model.id}, model.toJSON(), options, callback);
      else
        store.update(options.pattern || {}, options.data, options, callback);
    break;
    case "delete":
      store.remove({_id: model.id}, options, function(count){
        if(count == 1)
          options.success();
        else
          options.error("failed to delete "+model.id);
      });
    break;
  }
  return ;
};

exports.Model = Backbone.Model.extend({
  idAttribute: "_id"
},{
  store : function(){
    return global.store.collection(this.prototype.collectionName);
  }
});

exports.Collection = Backbone.Collection.extend({},{
  store : function(){
    return global.store.collection(this.prototype.collectionName);
  }
});