var app = require("../demo/app");

var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('demo/API');

suite.discuss('When using awesome API')
  .discuss('and awesome resource')
  .use('localhost', 3000)
  .setHeader('Content-Type', 'application/json')
  .get("/version")
    .expect(200)
    .expect("should return version", function(err, res, body){
      var version = require("../package.json").version;
      assert.equal(body, JSON.stringify({result: version}));
    })
  .next()
  .post("/token", {value: "test"})
    .expect(200)
    .expect("should return token", function(err, res, body){
      var result = JSON.parse(body).result;
      assert.equal(result.value, "test");
      assert.isString(result._id);
    })
  .post("/clear", {})
    .expect(200)
.export(module);