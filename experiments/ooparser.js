"use strict"

const fs = require("fs")
const path = require("path")
const Stream = require("stream.js")

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
const nlsvFile2 = path.resolve(__dirname, "../test/data/wordlist")

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

/*fs.readFile(nlsvFile2, { encoding: "utf8" }, (err, data) => {
  if(err)
    throw err
	nlsvParser.parse(data)
	//htmlParser.parse(data)
})*/

let testStream = fs.createReadStream(nlsvFile2, { encoding: "utf8" })
let data = ""
testStream.on("data", chunk => {
	nlsvParser.parse(chunk)
	//data += chunk
})
testStream.on("end", () => {
	console.log("All data is sent to the parser")
	//console.log(data)
})

function Tokenize(type) {
	this.tokens = []
	this.type = type
}
Tokenize.prototype.lexer = function(str, options = { newline: false, space: false }) {	
	/*try {
		this.tokenReader[this.type].lexer(str1, this.tokens)
	} catch (er) {
		console.log(er)
	}*/

	const tokenReader = this.tokenReader[this.type]

	if(!tokenReader)
		throw new Error("Unknown data type " + this.type)

	return tokenReader.lexer(str, this.tokens, options)
	

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
Tokenize.prototype.tokenReader = {
	nlsv: {
		lexer(str, tokens, options = { newline:false, space:false }) {
			if(str.length === 0) return new Stream
			if(this.regexWord.test(str)) {
				let word = this.regexWord.exec(str)[0],
						rest = str.substr(word.length)
				return new Stream(new this.Word(word), () => this.lexer(rest, tokens, options))
				//console.log(this.regexWord.exec(str))
				//tokens.push(new this.Word(word))
				//return this.lexer(rest, tokens, options)
				//setTimeout(this.lexer.bind(this, rest, tokens, options), 0)
			}
			if(this.regexNewLine.test(str)) {
				let newline = this.regexNewLine.exec(str)[0],
						rest = str.substr(newline.length)
				//console.log(newline, this.regexNewLine.exec(str))
				if(options.newline)
					return new Stream(new this.NewLine(newline), () => this.lexer(rest, tokens, options))
					//tokens.push(new this.NewLine(newline))
				return this.lexer(rest, tokens, options)
				//return this.lexer(rest, tokens, options)
				//setTimeout(this.lexer.bind(this, rest, tokens, options), 0)
			}
			if(this.regexSpace.test(str)) {
				let space = this.regexSpace.exec(str)[0],
						rest = str.substr(space.length)
				if(options.space)
					return new Stream(new this.Space(space), () => this.lexer(rest, tokens, options))
					//tokens.push(new this.Space(space))
				return this.lexer(rest, tokens, options)
				//console.log(this.regexSpace.exec(str))
				//return this.lexer(rest, tokens, options)
				//setTimeout(this.lexer.bind(this, rest, tokens, options), 0)
			} else return new Stream(new this.InvalidString(str)) //tokens.push(new this.InvalidString(str))
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
		lexer(str, tokens, options = { newline:false, space:false }) {
			if(str.length === 0) return
			if(this.regexHtmlTag.test(str)) {
				let html = this.regexHtmlTag.exec(str)[0],
					rest = str.substr(html.length)
				//console.log("html match")
				tokens.push(new this.Html(html))
				return this.lexer(rest, tokens, options)
			}
			if(this.regexNewLine.test(str)) {
				let newline = this.regexNewLine.exec(str)[0],
					rest = str.substr(newline.length)
				//console.log("newline match", "options.newline is ", options.newline)
				if(options.newline)
					tokens.push(new this.NewLine(newline))
				return this.lexer(rest, tokens, options)
			}
			if(this.regexSpace.test(str)) {
				let space = this.regexSpace.exec(str)[0],
					rest = str.substr(space.length)
				//console.log("space match")//, space, space.length, rest)
				if(options.space)
					tokens.push(new this.Space(space))
				return this.lexer(rest, tokens, options)
			}
			if(this.regexText.test(str)) {
				let text = this.regexText.exec(str)[0],
					rest = str.substr(text.length)
				//console.log("text match")//, text, text.length, rest)
				tokens.push(new this.Text(text))
				return this.lexer(rest, tokens, options)
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
	this.waitForData = 1000
	this.queue = new Stream //FIFO
	this.ast = []
}
Parser.prototype.parse = function(str, options = { newline: false, space: false }) {
	this.queue = this.queue.append(this.tokenize.lexer(str, options))
	
	if(this.queue.empty()) // unfortunately the first item is an empty stream on first run
		this.queue = this.queue.drop(1)

	//console.log(stream)
	let scheduleId = setInterval(() => {
		let t = this.queue.take(64)
		this.queue = this.queue.drop(64)
		//this.jsonify(t)
		this.ast = parseNlsvtokenStream(this, t, this.ast)

		if(this.queue.empty()) {
			clearInterval(scheduleId)
			//wait(clearInterval, this.waitForData, scheduleId)
			this.ast = this.ast.filter( //TODO: run this code when we are sure that no more data is incoming
				(t, n) => {
					if( t instanceof this.nonTerminal.ListStart )
						return n === 0
					return true
				} 
			).filter(
				(t, n, all) => {
					if( t instanceof this.nonTerminal.ListEnd )
						return n === all.length - 1
					return true
				}
			).map(
				(t, n, all) => {
					if( t instanceof this.nonTerminal.Value )
						return peak(all, n) instanceof this.nonTerminal.ListEnd
							? new this.nonTerminal.ValueEnd(t.value) : t
					return t
				}
			)
			let json = this.ast.map(t => t.value).join("")
			console.log( json )
			JSON.parse(json)
		}
	}, 0)
	//return this.jsonify(this.tokenize.tokens)
}
function peak(list, n) {
	let x
	try {
		x = list[n+1]
	} catch(err) {
		x = null
	}
	return x
}
function parseNlsvtokenStream(parser, tokenStream, ast) {
	//tokenStream.print()
	let token
	while(!tokenStream.empty()) {
		token = tokenStream.item(0)
		token = new parser.nonTerminal.Value(token.value) // replacement
		ast.push(token)
		tokenStream = tokenStream.drop(1)
	}
	ast.unshift(new parser.nonTerminal.ListStart)
	ast.push(new parser.nonTerminal.ListEnd)
	return ast
}
function drain(stream, howmany = 1) {
	let x = stream.take(howmany)
	return {
		x,
		stream: stream.drop(howmany)
	}
}

Parser.prototype.jsonify = function(tokenStream) {
	
	//tokenStream.print()
	let c = tokenStream.length();
	if(tokenStream.empty())
		return c
	console.log("lexer got %d tokens", c)
	console.log("first token is ", tokenStream.head())
	console.log("last token is ", tokenStream.drop(c-1).head())
	return c;
}
Parser.prototype.nonTerminal = {
	Value: function Value(value) {
		this.value = '"' + value + '",'
	},
	ValueEnd: function ValueEnd(value) {
		this.value = value.replace(/,$/, '')
	},
	ListStart: function ListStart() {
		this.value = "["
	},
	ListEnd: function ListEnd() {
		this.value = "]"
	}
}
Parser.prototype.terminal = {
	
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