"use strict"

// tokenize :: String -> [Token]
function tokenize(str) {
	if(str.length === 0) return []
	let c = str[0],
		rest = str.substr(1)

	return (isNaN(c) ? ["Alpha"] : ["Digit"]).concat( tokenize(rest) )
}

console.log( tokenize("passwd123") )

module.exports = tokenize