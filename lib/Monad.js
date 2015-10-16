"use strict";

var assert = require("assert");

var Tuple = require("./Tuple");
[["Hello", "World"], ["The answer is", 42]].forEach(function (n) {
  tupleTest(n);
});

function tupleTest(tuple) {
  var fst = tuple[0],
      snd = tuple[1];
  var tuple = new Tuple(fst, snd);
  assert.strictEqual(2, tuple.length);
  assert.strictEqual(fst, tuple.fst());
  assert.strictEqual(fst, tuple[0]);
  assert.strictEqual(snd, tuple.snd());
  assert.strictEqual(snd, tuple[1]);
  assert.strictEqual(fst + snd, tuple.reduce(function (a, b) {
    return a + b;
  }));
}

var data = "term0 = (App (Lam 'x' (Add (Var 'x') (Var 'x'))) (Add (Con 10) (Con 11)))";
var prove = (function (x) {
  return x + x;
})(11 + 10);
function Identity(x) {
  this.Value = x;
}
Identity.prototype.unitI = function (a) {
  return function () {
    return Identity(a);
  };
};
Identity.prototype.bindI = function (a) {
  return this.unitI(a.Value);
};
Identity.prototype.showI = function (a) {
  return a.Value;
};

assert.strictEqual(11 + 10, new Identity(11 + 10).Value);
var i = new Identity();
console.log(new Identity(11 + 10), i.showI(i.bindI(i.unitI(11 + 10))));

function M(a) {
  return function () {
    return a;
  };
}
function unitM(a) {
  return M(a);
}
function bindM(a) {
  return M(a());
}
function showM(m) {
  return m();
}

function k(a) {
  return a + 1;
}

function monadTest(monad) {}

monadTest();
