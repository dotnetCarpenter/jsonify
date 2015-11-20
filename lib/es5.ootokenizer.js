"use strict";

var fs = require("fs");
var tokenize = new Tokenize();

var str1 = ' <pre class=" language-javascript"><a title="Copy to clipboard" class="_pre-clip"></a><span spellcheck="true" class="token comment">// Pull off a header delimited by \n\n</span>';
var str2 = '</span>';
var str3 = '<a href="/cpp/" class="_list-item _icon-cpp _list-disabled" data-slug="cpp" title="C++"><span class="_list-enable" data-';
var str4 = '<a href="/cpp/ class="_list-item _icon-cpp _list-disabled" data-slug="cpp" title="C++">';
var str5 = '<p>';
var str6 = '<span></span>';
var str7 = '<br/><br><hr/>';
var str8 = '<a>mere end > og mindre <</a><</span>// hello world</span></pre>';
var str9 = '</presss></a></span>';
var str10 = "there should be <a>\n\t\t\t\t\t\tnewline but text should\n\t\t\t\t\t\tinclude newline";

var promise = wait(function (data) {
	tokenize.read(data);
}, 0, str6);
promise["catch"](function (err) {
	console.error(err);
});
promise.then(process.exit.bind(process, 0));

/*fs.readFile("../test/data/html2.htm", { encoding: "utf8" }, (err, data) => {
  if(err)
    throw err
  console.log(tokenize)
	tokenize.read(str1)
})*/

function Tokenize() {
	this.tokens = [];
	this.hasBalancedTokens = false;
}
Tokenize.prototype.read = function (str) {
	var type = arguments.length <= 1 || arguments[1] === undefined ? "html" : arguments[1];

	/*try {
 	this.tokenReader[type].read(str1, this.tokens)
 } catch (er) {
 	console.log(er)
 }*/
	var tokenReader = this.tokenReader[type];
	tokenReader.read(str, this.tokens, { newline: true, space: true });

	this.hasBalancedTokens = tokenReader.valid(this.tokens);

	console.log("hasBalancedTokens", this.hasBalancedTokens);
	console.log(this.tokens.slice(-10));
	console.log(this.tokens.slice(-10).map(function (x) {
		if (x instanceof tokenReader.Html) return "Html";
		if (x instanceof tokenReader.Text) return "Text";
		if (x instanceof tokenReader.InvalidHtml) return "InvalidHtml";
		if (x instanceof tokenReader.NewLine) return "NewLine";
		if (x instanceof tokenReader.Space) return "Space";
	}));
};
Tokenize.prototype.getTokens = function () {
	var tokens = this.tokens;
	this.tokens = [];
	return tokens;
};
Tokenize.prototype.tokenReader = {
	html: {
		valid: function valid(tokens) {
			return tokens.some(function (t) {
				return t.isEmpty;
			});
		},
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

function parse(tokens) {}

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
	function spanAcc(_x3, _x4) {
		var _again = true;

		_function: while (_again) {
			var acc = _x3,
			    list = _x4;
			_again = false;

			if (list.length === 0) return [acc, list];
			var c = list[0],
			    cs = list.slice(1);
			if (pred(c)) {
				_x3 = acc.concat(c);
				_x4 = cs;
				_again = true;
				c = cs = undefined;
				continue _function;
			} else return [acc, list];
		}
	}
}

