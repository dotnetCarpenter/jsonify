"use strict"

var fs = require("fs");
var jsonify = require("../jsonify")
var test = require("./test");

test("jsonify should be a function", function(assert) {
  let expected = "function"
  let actual = typeof jsonify
  assert(expected, actual)
})

test("first letter of wordlist should be a", function(assert) {
  fs.readFile("test/data/wordlist_head", { encoding: "utf8" }, function(err, json) {
    if(err) assert.ok(false, err.message)
    let expected = "a"
    // FIXME jsonify fails when trying to convert big data - use streams instead
    console.log(jsonify(json))
    let data = JSON.parse(jsonify(json))
    let actual = data[0]
    assert(expected, actual)
  })
})

/*test("last word of wordlist should be études", function(assert, cb) {
  fs.readFile("test/data/wordlist_head", { encoding: "utf8" }, function(err, json) {
    if(err) assert.ok(false, err.message)
    let expected = "études"
    let data = JSON.parse(jsonify(json))
    let actual = data[data.length - 1]
    assert(expected, actual)
  })
})*/
