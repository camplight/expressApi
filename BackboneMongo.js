var Backbone = require("backbone");
var _ = require("underscore");

Backbone.sync = function(method, model, options){
  var callback = function(err, resp){
    if(err)
      options.error(err);
    else
      options.success(resp);
  }

  var store = this.store;
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
};

exports.Model = function(attributes, options){
  Backbone.Model.call(this, attributes, options);
}
_.extend(exports.Model.prototype, Backbone.Model, {
});
exports.Model.extend = function(obj){
  var result = Backbone.Model.extend(obj);
  result.store = function(){
    return global.store.collection(this.prototype.collectionName);
  }
  return result;
}

exports.Collection = function(models, options){
  Backbone.Collection.call(this, models, options);
}
_.extend(exports.Collection.prototype, Backbone.Collection, {
});
exports.Collection.extend = exports.Model.extend;