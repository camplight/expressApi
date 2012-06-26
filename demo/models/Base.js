var Backbone = require("../../BackboneMongo");

module.exports = Backbone.Model.extend({
  initialize: function(){
    this.createdAt = new Date();
    this.modifiedAt = new Date();
  }
});