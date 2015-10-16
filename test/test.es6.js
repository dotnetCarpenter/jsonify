"use strict"

var assert = require("assert")
var Tuple = require("../lib/Tuple")

const SETUP_TEXT = "Setup of: "

var testCounter = () => {
  let n = 0
  return () => ++n
}()

var tests = []
function addTest(msg, fn) {
  tests.push(new Tuple(msg, fn))
  if(addTest.timeoutId)
    clearTimeout(addTest.timeoutId)

  addTest.timeoutId = setTimeout(runTests, 100)
}
addTest.hadFailues = false
addTest.timeoutId = 0

function runTests() {
  tests.forEach(tuple => [tuple.fst(), test(SETUP_TEXT + tuple.fst(), tuple.snd(), equal)])

  //preparedTests.forEach(test => {
  //  debugger;
    /*
    let msg = test.fst(),
        fn  = test.snd()
    try {
      console.log("inner try ran:", msg);
      fn((expected, actual) => {
        assert.equal(expected, actual);
        success(msg)
      })
    } catch (e) {
      failure(msg, e);
    }
    */
  //})
}

function test(msg, fn, callback) {
  try {
    fn(callback)
    success(msg)
  } catch (e) {
    failure(msg, e)
  }
}

function equal(expected, actual) {
  assert.equal(expected, actual);
}

function success(msg) {
  console.log(testCounter(), msg, "V")
}

function failure(msg, e) {
  console.log(testCounter(), msg, "failed")
  console.log("\t" + e.message)
  addTest.hadFailues = true
}

module.exports = addTest
