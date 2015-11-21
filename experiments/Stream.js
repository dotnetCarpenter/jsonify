"use strict"

function Stream(head, tailPromise) {
  if (typeof head != 'undefined') {
    this.headValue = head;
  }
  if (typeof tailPromise == 'undefined') {
    tailPromise = function () {
      return new Stream();
    };
  }
  this.tailPromise = tailPromise;
}
Stream.prototype = {
  empty: function () {
    return typeof this.headValue == 'undefined';
  },
  head: function () {
    if (this.empty()) {
      throw new Error('Cannot get the head of the empty stream.');
    }
    return this.headValue;
  },
  tail: function () {
    if (this.empty()) {
      throw new Error('Cannot get the tail of the empty stream.');
    }
    // TODO: memoize here
    return this.tailPromise();
  },
  force: function () {
    // requires finite stream
    var stream = this;
    while (!stream.empty()) {
      stream = stream.tail();
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
//console.log(t)
test("abc")

function test(list, acc = []) {
  if(list.length === 0) return acc
  let fst = list[0],
      rest =  list.substr(list.length-1)
  return new Stream(fst, test(rest))
}