"use strict"

const fs = require("fs")
const tokenize = new Tokenize

fs.readFile("../test/data/html.htm", { encoding: "utf8" }, (err, data) => {
  if(err)
    throw err

  tokenize.read(data)
})


function Tokenize() {
  this.tokens = []
	this.hasValidTokens = false
}
Tokenize.prototype.read = function(str, type="html") {
	//let html = span(isHtmlTag, str)
	//console.log(html[0]);
	let testString1 = '<pre class=" language-javascript"><a title="Copy to clipboard" class="_pre-clip"></a><span spellcheck="true" class="token comment">// Pull off a header delimited by \n\n</span>';
	let testString2 = '</span>';
	
	try {
		this.tokenReader[type].read(str, this.tokens)
	} catch (er) {
		console.log(er)
	}
	console.log(this.tokens)
}
Tokenize.prototype.getTokens = function() {
	let tokens = this.tokens
	this.tokens = []
	return tokens
}
Tokenize.prototype.tokenReader = {
	html: {
		read(str, tokens) {
			if(str.length === 0) return
			if(this.regexHtmlTag.test(str)) {
				let html = this.regexHtmlTag.exec(str)[0],
					rest = str.substr(html.length)
				tokens.push(new this.Html(html))
				return this.read(rest, tokens)
			}
			if(this.regexNewLine.test(str)) {
				let newline = this.regexNewLine.exec(str)[0],
					rest = str.substr(newline.length)
				//console.log("skipping newline")
				return this.read(rest, tokens)
			}
			if(this.regexText.test(str)) {
				let text = this.regexText.exec(str)[0],
					rest = str.substr(text.length)
				tokens.push(new this.Text(text))
				return this.read(rest, tokens)
			}
			else throw "Can not tokenize " + str
		},
		regexHtmlTag: /^<[\w\s="-\d]+>(?:<\/\w+>)?|^<\/\w+>/,
		regexNewLine: /^\r\n|^\n/,
		regexText: /^[.\w\s\d\r\n\\\/,\.\[\]\{\}\(\)=';:!\?+-]+/,
		Html: function(html) {
			this.value = html
			this.tagName = /<\/?(\w+)/.exec(html)[1]
			this.isEmpty = /><\/\w+>$/.test(html) // we're checking for a less than character before an end tag e.i. ></a>
		},
		Text: function(text) {
			this.value = text
		}, //NOTE: not used at the moment
		InvalidHtml: function(str) {
			this.value = str
		}
	}
}


function valid(tokens) {
  
}

function parse(tokens) {}


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