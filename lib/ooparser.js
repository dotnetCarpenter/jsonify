"use strict"

const fs = require("fs")
const tokenize = new Tokenize

let str1 = ' <pre class=" language-javascript"><a title="Copy to clipboard" class="_pre-clip"></a><span spellcheck="true" class="token comment">// Pull off a header delimited by \n\n</span>'
let str2 = '</span>'
let str3 = '<a href="/cpp/" class="_list-item _icon-cpp _list-disabled" data-slug="cpp" title="C++"><span class="_list-enable" data-'
let str4 = '<a href="/cpp/ class="_list-item _icon-cpp _list-disabled" data-slug="cpp" title="C++">'
let str5 = '<p>'
let str6 = '<span></span>'
let str7 = '<br/><br><hr/>'
let str8 = '<a>mere end > og mindre <</a><</span>// hello world</span></pre>'
let str9 = '</presss></a></span>'
let str10 = `there should be <a>
						newline but text should
						include newline`


//tokenize.read(str1)
fs.readFile("../test/data/html2.htm", { encoding: "utf8" }, (err, data) => {
  if(err)
    throw err
  console.log(tokenize)
	tokenize.read(str1)
})

function Tokenize() {
 	this.tokens = []
	this.hasBalancedTokens = false
}
Tokenize.prototype.read = function(str, type="html") {	
	/*try {
		this.tokenReader[type].read(str1, this.tokens)
	} catch (er) {
		console.log(er)
	}*/
	let tokenReader = this.tokenReader[type]
	tokenReader.read(str, this.tokens, { newline: true, space: true })

	//this.hasBalancedTokens = valid(this.tokens)

	console.log("hasBalancedTokens", this.hasBalancedTokens)
	console.log(this.tokens.slice(-10))
	console.log(this.tokens.slice(-10).map(x => {
		if(x instanceof tokenReader.Html) return "Html"
		if(x instanceof tokenReader.Text) return "Text"
		if(x instanceof tokenReader.InvalidHtml) return "InvalidHtml"
		if(x instanceof tokenReader.NewLine) return "NewLine"
		if(x instanceof tokenReader.Space) return "Space"
	}))
}
Tokenize.prototype.getTokens = function() {
	let tokens = this.tokens
	this.tokens = []
	return tokens
}
Tokenize.prototype.tokenReader = {
	html: {	
		read(str, tokens, options = { newline:false, space:false }) {
			if(str.length === 0) return
			if(this.regexHtmlTag.test(str)) {
				let html = this.regexHtmlTag.exec(str)[0],
					rest = str.substr(html.length)
				//console.log("html match")
				tokens.push(new this.Html(html))
				return this.read(rest, tokens, options)
			}
			if(this.regexNewLine.test(str)) {
				let newline = this.regexNewLine.exec(str)[0],
					rest = str.substr(newline.length)
				//console.log("newline match", "options.newline is ", options.newline)
				if(options.newline)
					tokens.push(new this.NewLine(newline))
				return this.read(rest, tokens, options)
			}
			if(this.regexSpace.test(str)) {
				let space = this.regexSpace.exec(str)[0],
					rest = str.substr(space.length)
				//console.log("space match")//, space, space.length, rest)
				if(options.space)
					tokens.push(new this.Space(space))
				return this.read(rest, tokens, options)
			}
			if(this.regexText.test(str)) {
				let text = this.regexText.exec(str)[0],
					rest = str.substr(text.length)
				//console.log("text match")//, text, text.length, rest)
				tokens.push(new this.Text(text))
				return this.read(rest, tokens, options)
			} else  {
				//console.log("nothing matched")
				tokens.push(new this.InvalidHtml(str))
			}
			//else throw "Can not tokenize " + str.slice(0, 240)
		},
		//regexHtmlTag: /^<[.\w\s="'\-_\d\/.…\:;+\(\)&,\.]+>(?:<\/\w+>)?|^<\/\w+>/, //TODO: lookup utf8 code table
		//regexHtmlTag: /^<[^<>]+>(<\/\w+>)?|^<\/\w+>/,
		regexHtmlTag: /^<(\w+)[^<>]*>(<\/\1+>)?|^<\/\w+>/,
		regexSpace: /^\s+/,
		regexNewLine: /^\r\n|^\n/,
		//regexText: /^[.\w\s\d\r\n\\\/,\.\[\]\{\}\(\)='";:!\?+\-@©—]+/, //TODO: lookup utf8 code table
		regexText: /^[^<]+|^<(?!\/?\w+)/,
		Html: function(html) {
			this.value = html
			this.tagName = /<\/?(\w+)/.exec(html)[1]
			this.isEmpty = /><\/\w+>$|<\w{2,}\/?>$/.test(html)
			this.isStartTag = this.isEmpty ? false : /^<\w/.test(html)
			this.isEndTag = this.isEmpty ? false : /^<\//.test(html)
		},
		Text: function(text) {
			this.value = text
		},
		InvalidHtml: function(str) {
			this.value = str
			this.tagName = null
			this.isEmpty = false
			this.isStartTag = false
			this.isEndTag = false
		},
		NewLine: function(str) {
			this.value = str
		},
		Space: function(str) {
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