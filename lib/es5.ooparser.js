"use strict";

var fs = require("fs");

var nlsvParser = new Parser("nlsv");
var htmlParser = new Parser("html");

var str1 = ' <pre class=" language-javascript"><a title="Copy to clipboard" class="_pre-clip"></a><span spellcheck="true" class="token comment">// Pull off a header delimited by \n\n</span>';
var str2 = '</span>';
var str3 = '<a href="/cpp/" class="_list-item _icon-cpp _list-disabled" data-slug="cpp" title="C++"> <span class="_list-enable" data-';
var str4 = '<a href="/cpp/ class="_list-item _icon-cpp _list-disabled" data-slug="cpp" title="C++">';
var str5 = '<p>';
var str6 = '<span></span>';
var str7 = '<br/><br><hr/>';
var str8 = '<a>mere end > og mindre <</a><</span>// hello world</span></pre>';
var str9 = '</presss></a></span>';
var str10 = "there should be <a>\n\t\t\t\t\t\tnewline but text should\n\t\t\t\t\t\tinclude newline";
var htmlFile = "../test/data/html.htm";
var htmlFile2 = "../test/data/html2.htm";
var nlsvFile = "../test/data/wordlist";

var nlsvData = "a\n\t\t\t\t\t\t\t\t\ta\n\t\t\t\t\t\t\t\t\ta's\n\t\t\t\t\t\t\t\t\ta's\n\t\t\t\t\t\t\t\t\tab's\n\t\t\t\t\t\t\t\t\tabaci\n\t\t\t\t\t\t\t\t\taback\n\t\t\t\t\t\t\t\t\tabacus\n\t\t\t\t\t\t\t\t\tabacus's\n\t\t\t\t\t\t\t\t\tabacuses\n\t\t\t\t\t\t\t\t\t";

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

fs.readFile(nlsvFile, { encoding: "utf8" }, function (err, data) {
	if (err) throw err;
	nlsvParser.parse(data);
	//htmlParser.parse(data)
});

function Tokenize(type) {
	this.tokens = [];
	this.type = type;
}
Tokenize.prototype.read = function (str) {
	var options = arguments.length <= 1 || arguments[1] === undefined ? { newline: false, space: false } : arguments[1];

	/*try {
 	this.tokenReader[this.type].read(str1, this.tokens)
 } catch (er) {
 	console.log(er)
 }*/

	var tokenReader = this.tokenReader[this.type];

	if (!tokenReader) throw "Unknown data type " + this.type;

	tokenReader.read(str, this.tokens, options);

	console.log(this.tokens.slice(-10));
	if (this.type === "nlsv") {
		console.log(this.tokens.slice(-10).map(function (x) {
			if (x instanceof tokenReader.Word) return "Word";
			if (x instanceof tokenReader.NewLine) return "NewLine";
			if (x instanceof tokenReader.Space) return "Space";
			if (x instanceof tokenReader.InvalidString) return "InvalidString";
		}));
	}
	if (this.type === "html") {
		console.log(this.tokens.slice(-10).map(function (x) {
			if (x instanceof tokenReader.Html) return "Html";
			if (x instanceof tokenReader.Text) return "Text";
			if (x instanceof tokenReader.InvalidHtml) return "InvalidHtml";
			if (x instanceof tokenReader.NewLine) return "NewLine";
			if (x instanceof tokenReader.Space) return "Space";
		}));
	}
};
Tokenize.prototype.getTokens = function () {
	var tokens = this.tokens;
	this.tokens = [];
	return tokens;
};
Tokenize.prototype.tokenReader = {
	nlsv: {
		read: function read(str, tokens) {
			var options = arguments.length <= 2 || arguments[2] === undefined ? { newline: false, space: false } : arguments[2];

			if (str.length === 0) return;
			if (this.regexWord.test(str)) {
				var word = this.regexWord.exec(str)[0],
				    rest = str.substr(word.length);
				//console.log(this.regexWord.exec(str))
				tokens.push(new this.Word(word));
				return this.read(rest, tokens, options);
			}
			if (this.regexNewLine.test(str)) {
				var newline = this.regexNewLine.exec(str)[0],
				    rest = str.substr(newline.length);
				//console.log(newline, this.regexNewLine.exec(str))
				if (options.newline) tokens.push(new this.NewLine(newline));
				return this.read(rest, tokens, options);
			}
			if (this.regexSpace.test(str)) {
				var space = this.regexSpace.exec(str)[0],
				    rest = str.substr(space.length);
				if (options.space) tokens.push(new this.Space(space));
				return this.read(rest, tokens, options);
			} else tokens.push(new this.InvalidString(str));
		},
		regexWord: /^[^(\r\n|\n|\s)]+/,
		regexSpace: /^\s+/, //TODO: why does this match newline?
		regexNewLine: /^\r\n|^\n/,
		Word: function Word(str) {
			this.value = str;
		},
		InvalidString: function InvalidString(str) {
			this.value = str;
		},
		NewLine: function NewLine(str) {
			this.value = str;
		},
		Space: function Space(str) {
			this.value = str;
		}
	},
	csv: {},
	tsv: {},
	html: {
		read: function read(str, tokens) {
			var options = arguments.length <= 2 || arguments[2] === undefined ? { newline: false, space: false } : arguments[2];

			if (str.length === 0) return;
			if (this.regexHtmlTag.test(str)) {
				var html = this.regexHtmlTag.exec(str)[0],
				    rest = str.substr(html.length);
				//console.log("html match")
				tokens.push(new this.Html(html));
				return this.read(rest, tokens, options);
			}
			if (this.regexNewLine.test(str)) {
				var newline = this.regexNewLine.exec(str)[0],
				    rest = str.substr(newline.length);
				//console.log("newline match", "options.newline is ", options.newline)
				if (options.newline) tokens.push(new this.NewLine(newline));
				return this.read(rest, tokens, options);
			}
			if (this.regexSpace.test(str)) {
				var space = this.regexSpace.exec(str)[0],
				    rest = str.substr(space.length);
				//console.log("space match")//, space, space.length, rest)
				if (options.space) tokens.push(new this.Space(space));
				return this.read(rest, tokens, options);
			}
			if (this.regexText.test(str)) {
				var text = this.regexText.exec(str)[0],
				    rest = str.substr(text.length);
				//console.log("text match")//, text, text.length, rest)
				tokens.push(new this.Text(text));
				return this.read(rest, tokens, options);
			} else {
				//console.log("nothing matched")
				tokens.push(new this.InvalidHtml(str));
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
		Html: function Html(html) {
			this.value = html;
			this.tagName = /<\/?(\w+)/.exec(html)[1];
			this.isEmpty = /><\/\w+>$|<\w{2,}\/?>$/.test(html);
			this.isStartTag = this.isEmpty ? false : /^<\w/.test(html);
			this.isEndTag = this.isEmpty ? false : /^<\//.test(html);
		},
		Text: function Text(text) {
			this.value = text;
		},
		InvalidHtml: function InvalidHtml(str) {
			this.value = str;
			this.tagName = null;
			this.isEmpty = false;
			this.isStartTag = false;
			this.isEndTag = false;
		},
		NewLine: function NewLine(str) {
			this.value = str;
		},
		Space: function Space(str) {
			this.value = str;
		}
	}
};

function Parser() {
	var type = arguments.length <= 0 || arguments[0] === undefined ? "html" : arguments[0];

	this.tokenize = new Tokenize(type);
}
Parser.prototype.parse = function (str) {
	var options = arguments.length <= 1 || arguments[1] === undefined ? { newline: false, space: false } : arguments[1];

	this.tokenize.read(str, options);
	return this.lexer(this.tokenize.tokens);
};
Parser.prototype.lexer = function (tokens) {
	console.log("lexer got %d tokens", tokens.length);
};

//wait :: (a -> any) -> b -> c -> Promise
function wait(fn, delay) {
	for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		args[_key - 2] = arguments[_key];
	}

	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			try {
				resolve(fn.apply(undefined, args));
			} catch (err) {
				reject(err);
			}
		}, delay);
	});
}

//span :: (a -> Bool) -> [a] -> ([a], [a])
function span(pred, str) {
	return spanAcc([], str);
	function spanAcc(_x6, _x7) {
		var _again = true;

		_function: while (_again) {
			var acc = _x6,
			    list = _x7;
			_again = false;

			if (list.length === 0) return [acc, list];
			var c = list[0],
			    cs = list.slice(1);
			if (pred(c)) {
				_x6 = acc.concat(c);
				_x7 = cs;
				_again = true;
				c = cs = undefined;
				continue _function;
			} else return [acc, list];
		}
	}
}
