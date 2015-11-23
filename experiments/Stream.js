"use strict"

function Stream(head, tailPromise) {
  if (typeof head != 'undefined')
    this.headValue = head;

  if (typeof tailPromise == 'undefined')
    tailPromise = () => new Stream
  this.tailPromise = tailPromise;
}
Stream.prototype = {
  empty: function () {
    return typeof this.headValue == 'undefined';
  },
  force: function () {
    // requires finite stream
    var stream = this;
    while (!stream.empty()) {
      stream = stream.tail();
    }
  },
  head: function () {
    if (this.empty()) {
      throw new Error('Cannot get the head of the empty stream.');
    }
    return this.headValue;
  },
  item: function (n) {
    if (this.empty()) {
      throw new Error('Cannot use item() on an empty stream.');
    }
    var s = this;
    while (n != 0) {
      --n;
      try {
        s = s.tail();
      }
      catch (e) {
        throw new Error('Item index does not exist in stream.');
      }
    }
    try {
      return s.head();
    }
    catch (e) {
      throw new Error('Item index does not exist in stream.');
    }
  },
  map: function (f) {
    if (this.empty()) return this
    return new Stream(f(this.head()), () => this.tail().map(f));
  },
  print: function (n) {
    var target;
    if (typeof n != 'undefined') {
      target = this.take(n);
    }
    else {
      // requires finite stream
      target = this;
    }
    target.walk(function (x) {
      console.log(x);
    });
  },
  take: function (howmany) {
    if (this.empty())
      return this
    if (howmany == 0)
      return new Stream

    return new Stream(
      this.head(),
      () => this.tail().take(howmany - 1)
      )
  },
  tail: function () {
    if (this.empty()) {
      throw new Error('Cannot get the tail of the empty stream.');
    }
    // TODO: memoize here
    return this.tailPromise();
  },
  toString: function () {
    // requires finite stream
    return '[stream head: ' + this.head() + '; tail: ' + this.tail() + ']'
  },
  walk: function (f) {
    // requires finite stream
    this.map((x) => {
      f(x)
      return x
    }).force()
  },
}

var t = new Stream(10, function () {
  return new Stream(20, function () {
    return new Stream(30, function () {
      return new Stream();
    });
  });
});  
// the head of the t stream is 10; its tail has a head which is 20 and a tail which  
// has a head which is 30 and a tail which is the empty stream.  
//t.print(); // prints 10, 20, 30
//console.log( t )


let testStream = test("abc") 
console.log(testStream)
console.log(testStream.item(2))

function test(list) {
  if (list.length === 0) return new Stream
  let fst = list[0],
      rest = list.substr(fst.length)
  return new Stream(fst, () => test(rest))
}