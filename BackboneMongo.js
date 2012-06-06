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
      var updateData = model.toJSON();
      store.update({_id: model.id}, updateData, options, function(err, count){
        if(err)
          options.error(err);
        else
          options.success(updateData);
      });
    break;
    case "delete":
      store.remove({_id: model.id}, options, function(err, count){
        if(err)
          options.error(err);
        else
          options.success();
      });
    break;
  }
  return ;
};

var nodejsSave = 

exports.Model = Backbone.Model.extend({
  idAttribute: "_id",
  save: function(input, options) {
    if(typeof input == "function") {
      options = input;
      input = null;
    }
    if(typeof options == "function") {
      var callback = options;
      options = {
        success: function(model) {
          callback(null, model);
        },
        error: function(model, err) {
          callback(err);
        }
      }
    }
    Backbone.Model.prototype.save.call(this, input, options);
  },
  fetch: function(options){
    if(typeof options == "function") {
      var callback = options;
      options = {
        success: function(model) {
          callback(null, model);
        },
        error: function(model, err) {
          callback(err);
        }
      }
    }
    Backbone.Model.prototype.fetch.call(this, options);
  },
  destroy: function(options){
    if(typeof options == "function") {
      var callback = options;
      options = {
        success: function(model) {
          callback(null, model);
        },
        error: function(model, err) {
          callback(err);
        }
      }
    }
    Backbone.Model.prototype.destroy.call(this, options);
  }
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