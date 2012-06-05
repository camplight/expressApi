var _ = require("underscore");

exports.augment = function(res) {
  return _.extend(res, {
    result: function(data) {
      this.send({result: data});
    },
    success: function(result){
      this.send(result);
    },
    error: function(err){
      this.send(err, 500);
    }
  });
}