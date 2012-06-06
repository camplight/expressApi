describe('Backbone.Model', function(){

  var mongojs = require("mongojs");
  var ObjectId = mongojs.ObjectId;

  global.store = mongojs.connect("test");
  global.store.collection("expressApi-test").remove({},{multi: true});

  var Backbone = require("../BackboneMongo");
  var Model = Backbone.Model.extend({collectionName: "test"});
  var instance = new Model({value: "test"});

  it("should be able to create model", function(done){
    instance.save(null, {
      success: function(model){
        expect(model).toBeDefined();
        expect(model.get("value")).toBe("test");
        done();
      },
      error: function(model, err){
        expect(err).toBeEmpty();
        done();
      }
    });
  });

  it("should be found in database", function(done){
    global.store.collection("test").find({_id: instance.id}, function(err, docs){
      expect(docs.length).toBe(1);
      done();
    });
  });

  it("should be able to update model", function(done){
    instance.save({value: "test2"}, {
      success: function(model) {
        expect(model.get("value")).toBe("test2");
        done();
      },
      error: function(model, err){
        expect(err).toBeEmpty();
        done();
      }
    });
  });

  it("should be updated in database", function(done){
    global.store.collection("test").find({_id: instance.id}, function(err, docs){
      expect(docs.length).toBe(1);
      expect(docs[0].value).toBe("test2");
      done();
    });
  });

  it("should be able to remove model", function(done){
    instance.destroy({
      success: function(model){
        expect(model).toBeDefined();
        done();
      },
      error: function(model, err) {
        expect(err).toBeEmpty();
        done();
      }
    });
  });

  it("should be removed from database", function(done){
    global.store.collection("test").find({_id: instance.id}, function(err, docs){
      expect(docs.length).toBe(0);
      done();
    });
  });
});