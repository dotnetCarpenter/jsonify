"use strict"

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

// tokenize :: String -> [Token]
function tokenize(str) {
	if(str.length === 0) return []
	let c = str[0],
		cs = str.substr(1)
		
	if( /[+\-*\/]/.test(c) )	return [operator(c)].concat(tokenize(cs))
	if( /\d/.test(c) ) 			return [c|0].concat(tokenize(cs))
	if( /\w/.test(c) ) 			return [c].concat(tokenize(cs))
	if( /\s/.test(c) ) 			return tokenize(cs)
	else throw "Cannot tokenize " + c
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

console.log( tokenize(" 1 + 4 / x ") )
console.log( tokenize(" 1 + 4 / x ").map(t=>t.toString()) )

module.exports = tokenize