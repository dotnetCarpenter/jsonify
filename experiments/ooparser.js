"use strict"

const fs = require("fs")
const path = require("path")
const Stream = require("Streams")

const nlsvParser = new Parser("nlsv")
const htmlParser = new Parser("html")

const str1 = ' <pre class=" language-javascript"><a title="Copy to clipboard" class="_pre-clip"></a><span spellcheck="true" class="token comment">// Pull off a header delimited by \n\n</span>'
const str2 = '</span>'
const str3 = '<a href="/cpp/" class="_list-item _icon-cpp _list-disabled" data-slug="cpp" title="C++"> <span class="_list-enable" data-'
const str4 = '<a href="/cpp/ class="_list-item _icon-cpp _list-disabled" data-slug="cpp" title="C++">'
const str5 = '<p>'
const str6 = '<span></span>'
const str7 = '<br/><br><hr/>'
const str8 = '<a>mere end > og mindre <</a><</span>// hello world</span></pre>'
const str9 = '</presss></a></span>'
const str10 = `there should be <a>
						newline but text should
						include newline`
const htmlFile = "test/data/html.htm"
const htmlFile2 = "test/data/html2.htm"
const nlsvFile1 = path.resolve(__dirname, "../test/data/wordlist_tail")
const nlsvFile2 = "/test/data/wordlist"

const nlsvData = `a
									a
									a's
									a's
									ab's
									abaci
									aback
									abacus
									abacus's
									abacuses
									`

/*const promise = wait(data => {
		htmlParser.parse(data, { newline: true, space: true})
	}, 0, str3)*/
/*const promise = wait(data => {
	nlsvParser.parse(data, { newline: true, space: true})
}, 0, nlsvData)
promise.catch(err => {
	console.error(err)
	return {}// visual studio has a wrong return type for promise.catch()
})
promise.then(process.exit.bind(process, 0))*/

fs.readFile(nlsvFile1, { encoding: "utf8" }, (err, data) => {
  if(err)
    throw err
	nlsvParser.parse(data)
	//htmlParser.parse(data)
})

function Tokenize(type) {
	this.tokens = []
	this.type = type
}
Tokenize.prototype.read = function(str, options = { newline: false, space: false }) {	
	/*try {
		this.tokenReader[this.type].read(str1, this.tokens)
	} catch (er) {
		console.log(er)
	}*/

	const tokenReader = this.tokenReader[this.type]

	if(!tokenReader)
		throw new Error("Unknown data type " + this.type)

	return tokenReader.read(str, this.tokens, options)
	

	/*console.log(this.tokens.slice(-10))
	if(this.type === "nlsv") {
		console.log(this.tokens.slice(-10).map(x => {
			if(x instanceof tokenReader.Word) return "Word"
			if(x instanceof tokenReader.NewLine) return "NewLine"
			if(x instanceof tokenReader.Space) return "Space"
			if(x instanceof tokenReader.InvalidString) return "InvalidString"
		}))
	}
	if(this.type === "html") {
		console.log(this.tokens.slice(-10).map(x => {
			if(x instanceof tokenReader.Html) return "Html"
			if(x instanceof tokenReader.Text) return "Text"
			if(x instanceof tokenReader.InvalidHtml) return "InvalidHtml"
			if(x instanceof tokenReader.NewLine) return "NewLine"
			if(x instanceof tokenReader.Space) return "Space"
		}))
	}*/
}
Tokenize.prototype.getTokens = function() {
	let tokens = this.tokens
	this.tokens = []
	return tokens
}
Tokenize.prototype.tokenReader = {
	nlsv: {
		read(str, tokens, options = { newline:false, space:false }) {
			if(str.length === 0) return new Stream
			if(this.regexWord.test(str)) {
				let word = this.regexWord.exec(str)[0],
						rest = str.substr(word.length)
				return new Stream([new this.Word(word)], () => this.read(rest, tokens, options))
				//console.log(this.regexWord.exec(str))
				//tokens.push(new this.Word(word))
				//return this.read(rest, tokens, options)
				//setTimeout(this.read.bind(this, rest, tokens, options), 0)
			}
			if(this.regexNewLine.test(str)) {
				let newline = this.regexNewLine.exec(str)[0],
						rest = str.substr(newline.length)
				console.log(newline, this.regexNewLine.exec(str))
				if(options.newline)
					return new Stream([new this.NewLine(newline)], () => this.read(rest, tokens, options))
					//tokens.push(new this.NewLine(newline))
				return new Stream([null], () => this.read(rest, tokens, options))
				//return this.read(rest, tokens, options)
				//setTimeout(this.read.bind(this, rest, tokens, options), 0)
			}
			if(this.regexSpace.test(str)) {
				let space = this.regexSpace.exec(str)[0],
						rest = str.substr(space.length)
				if(options.space)
					return new Stream([new this.Space(space)], () => this.read(rest, tokens, options))
					//tokens.push(new this.Space(space))
				return new Stream([null], () => this.read(rest, tokens, options))
				//console.log(this.regexSpace.exec(str))
				//return this.read(rest, tokens, options)
				//setTimeout(this.read.bind(this, rest, tokens, options), 0)
			} else return new Stream([new this.InvalidString(str)], new Stream) //tokens.push(new this.InvalidString(str))
		},
		regexWord: /^[^(\r\n|\n|\s)]+/,
		regexSpace: /^\s+/, //TODO: why does this match newline? what is the example?
		regexNewLine: /^\r\n|^\n/,
		Word: function(str) {
			this.value = str
		},
		InvalidString: function(str) {
			this.value = str
		},
		NewLine: function(str) {
			this.value = str
		},
		Space: function(str) {
			this.value = str
		}
	},
	csv: {},
	tsv: {},
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

function Parser(type="html") {
	this.tokenize = new Tokenize(type)
}
Parser.prototype.parse = function(str, options = { newline: false, space: false }) {
	let stream = this.tokenize.read(str, options)
	console.log(stream)
	let c = 0
	setInterval(() => {
		//c = this.lexer(this.tokenize.tokens)
		this.lexer(stream.item(0))
		//if(c >  1048574/*198350*/)
		//	process.exit(0)
	}, 500)
	//return this.lexer(this.tokenize.tokens)
}
Parser.prototype.lexer = function(tokens) {
	console.log("lexer got %d tokens", tokens.length)
	console.log("last token is ", tokens[tokens.length-1])
	return tokens.length
}


//wait :: (a -> any) -> b -> c -> Promise
function wait(fn, delay, ...args) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			try {
				resolve(fn(...args))
			} catch (err) {
				reject(err)
			}
		}, delay)
	})
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