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
	return [].map.call(str, t => t).map(tokenizeChar)
}

// tokenizeChar :: Char -> Token
function tokenizeChar(c) {		
	if( /[+\-*\/]/.test(c) )	return operator(c)
	if( /\d/.test(c) ) 			return c|0
	if( /\w/.test(c) ) 			return c
	if( /\s/.test(c) ) 			return undefined
	else throw "Cannot tokenize " + c
}

//deSpace :: [Token] -> [Token]
function deSpace(tokens) {
	return tokens.filter(t => t)
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

console.log( deSpace(tokenize(" 1 + 4 / x ")) )
console.log( deSpace(tokenize(" 1 + 4 / x ")).map(t=>t.toString()) )

module.exports = tokenize