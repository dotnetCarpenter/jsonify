"use strict"

module.exports = Tuple

function Tuple(first, second) {
  this.push(first)
  this.push(second)
}
Tuple.prototype = Array.prototype
Tuple.prototype.fst = function() { return this[0] }
Tuple.prototype.snd = function() { return this[1] }
