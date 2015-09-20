function identity(x) { return () => x }

var assert = require("assert")

assert.strictEqual(1, identity(1)())

/* Tuple assertions */
var Tuple = require("./Tuple");
[["Hello", "World"], ["The answer is", 42]].forEach( n => { tupleTest(n) })

function tupleTest(tuple) {
  const fst = tuple[0],
        snd = tuple[1]
  var tuple = new Tuple(fst, snd)
  assert.strictEqual(2, tuple.length)
  assert.strictEqual(fst, tuple.fst())
  assert.strictEqual(fst, tuple[0])
  assert.strictEqual(snd, tuple.snd())
  assert.strictEqual(snd, tuple[1])
  assert.strictEqual(fst+snd, tuple.reduce((a,b) => a+b))
}
