var assert = require("assert")


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

/* essence */
/*
  If a function takes two parameters, we can also call it as an infix function
  by surrounding it with backticks. For instance, the div function takes two
  integers and does integral division between them. Doing div 92 10 results in
  a 9. But when we call it like that, there may be some confusion as to which
  number is doing the division and which one is being divided. So we can call
  it as an infix function by doing 92 ‘div‘ 10 and suddenly it’s much clearer.
*/
var data = "term0 = (App (Lam 'x' (Add (Var 'x') (Var 'x'))) (Add (Con 10) (Con 11)))"
var prove = ((x => x + x)(11 + 10))
function Identity(x) { this.Value = x }
Identity.prototype.unitI = a => () => Identity(a)
Identity.prototype.bindI = function(a) { return this.unitI(a.Value) }
Identity.prototype.showI = a => a.Value

assert.strictEqual(11 + 10, new Identity(11 + 10).Value)
var i = new Identity()
console.log(
  new Identity(11 + 10), i.showI(i.bindI(i.unitI(11 + 10)))
)

function M(a) { return () => a }
function unitM(a) { return M(a) }
function bindM(a) { return M(a()) }
function showM(m) { return m() }

function k(a) { return a + 1 }

function monadTest(monad) {
  //var left = bindM(unitM(k))
  //console.log(k(1), bindM(k)(unitM(1)) )
  //console.log(k);
  //console.log(  )
  /*assert.strictEqual(left, k(1))
  var right = unitM(bindM(k))
  assert.strictEqual(right, k);*/
}

monadTest()
