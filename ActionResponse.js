exports.augment = function(res) {
  
  res.result = function(data) {
    res.send({result: data});
  }

  res.success = function(result){
    res.send(result);
  }

  res.error = function(err){
    res.send(err, 500);
  }
  
}