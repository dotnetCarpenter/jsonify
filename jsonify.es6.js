"use strict"

module.exports = jsonify

var tokens = {
  STRING_START: '"',
  STRING_END: '"',
  NEWLINE: "\n", //FIXME: NEWLINE is a matcher
  SEPERATOR: ",",
  LIST_START: "[",
  LIST_END: "]"
}
var matcher = [

]

function jsonify(text) {
  console.log(JSON.stringify(["a", "a", "a's", "a's", "ab's", "abaci"]))
  //console.log(tokenizer(text))
  console.log(lexer(tokenizer(text)))
  return lexer(tokenizer(text))
}

function lexer(ast) {
  return ast.replace(/LIST_START/g, tokens.LIST_START)
           .replace(/STRING_START/g, tokens.STRING_START)
           .replace(/STRING_END/g, tokens.STRING_END)
           .replace(/SEPERATOR/g, tokens.SEPERATOR)
           .replace(/LIST_END/g, tokens.LIST_END)
}

function tokenizer(text) {
  var ast = "LIST_START",
      currentPosition = 0,
      char = ""

  for(let c = 0, len = text.length; c < len; c++, currentPosition++) {
    char += text[c]
    //console.log("%d char: %s", currentPosition, char)
    if(char === tokens.NEWLINE) {
      if(currentPosition > 0) {
        ast += "STRING_END"
      }
      ast += "SEPERATOR"
      char = ""
      currentPosition = -1
    }
    if( /[a-zA-Z']/.test(char) ) {
      if(currentPosition === 0)
        ast += "STRING_START"
      ast += char
      char = ""
    }
  }
  // remove last SEPERATOR
  ast = ast.replace(/SEPERATOR$/, "")
  return ast += "LIST_END"
}

jsonify(`a
a
a's
a's
ab's
abaci
aback
abacus
abacus's
abacuses
`)
