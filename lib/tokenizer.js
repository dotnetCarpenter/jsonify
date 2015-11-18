"use strict"

const Tuple = require("./Tuple")

const isDigit = x => /\d/.test(x)
const isAlphaNum = x => /[\w0-9]/.test(x)
const isSpace = x => /\s/.test(x)
const isOperator = x => /[+\-*\/]/.test(x)
const isAssign = x => /=/.test(x)
const isLParen = x => /\(/.test(x)
const isRParen = x => /\)/.test(x)

const fst = xs => xs[0]
const snd = xs => xs[1]
const prepend = (x, xs) => { xs.unshift(x); return xs }
const join = (acc, s) => acc + s

// Tokens
function TokOp(){}
function TokIdent(str) { this.Value = String(str) }
TokIdent.prototype = Array.prototype
function TokNum(n) { this.Value = Number(n) }
TokNum.prototype = Array.prototype
function TokAssign(){}
TokAssign.prototype = Array.prototype
function TokLParen(){}
TokLParen.prototype = Array.prototype
function TokRParen(){}
TokRParen.prototype = Array.prototype
function TokEnd(){}

// Operators
function Plus(a,b) { return a+b }
Plus.prototype = new TokOp

function Minus(a,b) { return a-b }
Minus.prototype = new TokOp

function Times(a,b) { return a*b }
Times.prototype = new TokOp

function Div(a,b) { return a/b }
Div.prototype = new TokOp

// operator :: Char -> Operator
function operator(char) {
	let c
	switch(char) {
		case "+": c = Plus
			break;
		case "-": c = Minus
			break;
		case "*": c = Times
			break;
		case "/": c = Div
			break;	
	}
	return c	
}

// tokenize :: String -> [Token]
function tokenize(str) {
	if(str.length === 0)
		return []
	let c = str[0],
		cs= str.substr(1)
	
	if( isOperator(c) ) return prepend(operator(c), tokenize(cs))
	if( isAssign(c) ) return new TokAssign
	if( isLParen(c) ) return new TokLParen
	if( isRParen(c) ) return new TokRParen
	if( isDigit(c) ) return number(c, cs)
	if( isAlphaNum(c) ) return identifier(c, cs)
	if( isSpace(c) ) return tokenize(cs)
	else throw "Cannot tokenize " + c
}

function number(c, cs) {
	let digs = span(isDigit, cs)
	return prepend(
		new TokNum(
			prepend(
				c, fst(digs)
			).reduce(join, "")
		),
		tokenize(snd(digs))
	)
}

function identifier(c, cs) {
	let str = span(isAlphaNum, cs)
	return prepend(
		new TokIdent(
			prepend(
				c, fst(str)
			).reduce(join, "")
		),
		tokenize(snd(str))
	)
}

//span :: (a -> Bool) -> [a] -> ([a], [a])
function span(pred, str) {
	return spanAcc([], str)
	function spanAcc(acc, list) {
		if(list.length === 0) return [acc, list]
		let c = list[0],
			cs = list.slice(1)
		if(pred(c)) return spanAcc(acc.concat(c), cs)
		else return [acc, list]
	}
}

/*console.log( span( x => x < 3, [1,2,3,4,1,2,3,4] ) )
console.log( span( x => x < 9, [1,2,3] ) )
console.log( span( x => x < 0, [1,2,3] ) )
console.log( span( x => x < "b", "abc" ) )*/

/*console.log(" 1 + 4 / x ", tokenize(" 1 + 4 / x ") )
console.log( tokenize(" 1 + 4 / x ").map(t=>t.toString()) )*/

/*console.log("12 + 24 / x1")
console.dir(tokenize("12 + 24 / x1"))*/
//console.log( tokenize("12 + 24 / x1").map(t=>t.toString()) )
console.log("a + 2 = 6")
console.dir(tokenize("a + 2 = 6"))

module.exports = tokenize