"use strict"

const Tuple = require("./Tuple")

const isDigit = x => /\d/.test(x)
const isAlphaNum = x => /[\w0-9]/.test(x)
const isSpace = x => /\s/.test(x)
const isOperator = x => /[+\-*\/]/.test(x)

const fst = xs => xs[0]
const snd = xs => xs[1]
const prepend = (xs, x) => { xs.unshift(x); return xs }

// Operators
function Plus() {
	return (a,b) => a+b
}
function Minus() {
	return (a,b) => a-b
}
function Times() {
	return (a,b) => a*b
}
function Div() {
	return (a,b) => a/b
}

// operator :: Char -> Operator
function operator(char) {
	let c
	switch(char) {
		case "+": c = Plus()
			break;
		case "-": c = Minus()
			break;
		case "*": c = Times()
			break;
		case "/": c = Div()
			break;	
	}
	return c	
}

// tokenize :: String -> [Token]
function tokenize(str) {
	if(str.length === 0) return []
	let c = str[0],
		cs= str.substr(1)
	
	if( isOperator(c) ) return [operator(c)].concat(tokenize(cs))
	if( isDigit(c) ) return number(c, cs)
	if( isAlphaNum(c) ) return identifier(c, cs)
	if( isSpace(c) ) return tokenize(cs)
	else throw "Cannot tokenize " + c
}

function number(c, cs) {
	let digs = span(isDigit, cs)
	//TODO: refactor the next line to look sane
	return [ Number(prepend(fst(digs), c).join("")) ].concat(tokenize(snd(digs)))
}

function identifier(c, cs) {
	let str = span(isAlphaNum, cs)
	//TODO: refactor the next line to look sane
	return [ prepend(fst(str), c).join("") ].concat(tokenize(snd(str)))
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

console.log(" 1 + 4 / x ", tokenize(" 1 + 4 / x ") )
console.log( tokenize(" 1 + 4 / x ").map(t=>t.toString()) )

console.log("12 + 24 / x1", tokenize("12 + 24 / x1") )
console.log( tokenize("12 + 24 / x1").map(t=>t.toString()) )

module.exports = tokenize