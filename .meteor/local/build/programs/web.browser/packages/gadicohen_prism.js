//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Template = Package.templating.Template;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var self, lines, crlf;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/lib/prism/prism.js                                                                    //
// This file is in bare mode and is not in its own closure.                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
                                                                                                                  // 1
/* **********************************************                                                                 // 2
     Begin prism-core.js                                                                                          // 3
********************************************** */                                                                 // 4
                                                                                                                  // 5
self = (typeof window !== 'undefined')                                                                            // 6
	? window   // if in browser                                                                                      // 7
	: (                                                                                                              // 8
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)                                 // 9
		? self // if in worker                                                                                          // 10
		: {}   // if in node js                                                                                         // 11
	);                                                                                                               // 12
                                                                                                                  // 13
/**                                                                                                               // 14
 * Prism: Lightweight, robust, elegant syntax highlighting                                                        // 15
 * MIT license http://www.opensource.org/licenses/mit-license.php/                                                // 16
 * @author Lea Verou http://lea.verou.me                                                                          // 17
 */                                                                                                               // 18
                                                                                                                  // 19
var Prism = (function(){                                                                                          // 20
                                                                                                                  // 21
// Private helper vars                                                                                            // 22
var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;                                                                      // 23
                                                                                                                  // 24
var _ = self.Prism = {                                                                                            // 25
	util: {                                                                                                          // 26
		encode: function (tokens) {                                                                                     // 27
			if (tokens instanceof Token) {                                                                                 // 28
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);                                   // 29
			} else if (_.util.type(tokens) === 'Array') {                                                                  // 30
				return tokens.map(_.util.encode);                                                                             // 31
			} else {                                                                                                       // 32
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');                           // 33
			}                                                                                                              // 34
		},                                                                                                              // 35
                                                                                                                  // 36
		type: function (o) {                                                                                            // 37
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];                                         // 38
		},                                                                                                              // 39
                                                                                                                  // 40
		// Deep clone a language definition (e.g. to extend it)                                                         // 41
		clone: function (o) {                                                                                           // 42
			var type = _.util.type(o);                                                                                     // 43
                                                                                                                  // 44
			switch (type) {                                                                                                // 45
				case 'Object':                                                                                                // 46
					var clone = {};                                                                                              // 47
                                                                                                                  // 48
					for (var key in o) {                                                                                         // 49
						if (o.hasOwnProperty(key)) {                                                                                // 50
							clone[key] = _.util.clone(o[key]);                                                                         // 51
						}                                                                                                           // 52
					}                                                                                                            // 53
                                                                                                                  // 54
					return clone;                                                                                                // 55
                                                                                                                  // 56
				case 'Array':                                                                                                 // 57
					return o.slice();                                                                                            // 58
			}                                                                                                              // 59
                                                                                                                  // 60
			return o;                                                                                                      // 61
		}                                                                                                               // 62
	},                                                                                                               // 63
                                                                                                                  // 64
	languages: {                                                                                                     // 65
		extend: function (id, redef) {                                                                                  // 66
			var lang = _.util.clone(_.languages[id]);                                                                      // 67
                                                                                                                  // 68
			for (var key in redef) {                                                                                       // 69
				lang[key] = redef[key];                                                                                       // 70
			}                                                                                                              // 71
                                                                                                                  // 72
			return lang;                                                                                                   // 73
		},                                                                                                              // 74
                                                                                                                  // 75
		// Insert a token before another token in a language literal                                                    // 76
		insertBefore: function (inside, before, insert, root) {                                                         // 77
			root = root || _.languages;                                                                                    // 78
			var grammar = root[inside];                                                                                    // 79
			var ret = {};                                                                                                  // 80
                                                                                                                  // 81
			for (var token in grammar) {                                                                                   // 82
                                                                                                                  // 83
				if (grammar.hasOwnProperty(token)) {                                                                          // 84
                                                                                                                  // 85
					if (token == before) {                                                                                       // 86
                                                                                                                  // 87
						for (var newToken in insert) {                                                                              // 88
                                                                                                                  // 89
							if (insert.hasOwnProperty(newToken)) {                                                                     // 90
								ret[newToken] = insert[newToken];                                                                         // 91
							}                                                                                                          // 92
						}                                                                                                           // 93
					}                                                                                                            // 94
                                                                                                                  // 95
					ret[token] = grammar[token];                                                                                 // 96
				}                                                                                                             // 97
			}                                                                                                              // 98
                                                                                                                  // 99
			return root[inside] = ret;                                                                                     // 100
		},                                                                                                              // 101
                                                                                                                  // 102
		// Traverse a language definition with Depth First Search                                                       // 103
		DFS: function(o, callback, type) {                                                                              // 104
			for (var i in o) {                                                                                             // 105
				if (o.hasOwnProperty(i)) {                                                                                    // 106
					callback.call(o, i, o[i], type || i);                                                                        // 107
                                                                                                                  // 108
					if (_.util.type(o[i]) === 'Object') {                                                                        // 109
						_.languages.DFS(o[i], callback);                                                                            // 110
					} else if (_.util.type(o[i]) === 'Array') {                                                                  // 111
						_.languages.DFS(o[i], callback, i);                                                                         // 112
					}                                                                                                            // 113
				}                                                                                                             // 114
			}                                                                                                              // 115
		}                                                                                                               // 116
	},                                                                                                               // 117
                                                                                                                  // 118
	highlightAll: function(async, callback) {                                                                        // 119
		var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');
                                                                                                                  // 121
		for (var i=0, element; element = elements[i++];) {                                                              // 122
			_.highlightElement(element, async === true, callback);                                                         // 123
		}                                                                                                               // 124
	},                                                                                                               // 125
                                                                                                                  // 126
	highlightElement: function(element, async, callback) {                                                           // 127
		// Find language                                                                                                // 128
		var language, grammar, parent = element;                                                                        // 129
                                                                                                                  // 130
		while (parent && !lang.test(parent.className)) {                                                                // 131
			parent = parent.parentNode;                                                                                    // 132
		}                                                                                                               // 133
                                                                                                                  // 134
		if (parent) {                                                                                                   // 135
			language = (parent.className.match(lang) || [,''])[1];                                                         // 136
			grammar = _.languages[language];                                                                               // 137
		}                                                                                                               // 138
                                                                                                                  // 139
		if (!grammar) {                                                                                                 // 140
			return;                                                                                                        // 141
		}                                                                                                               // 142
                                                                                                                  // 143
		// Set language on the element, if not present                                                                  // 144
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;         // 145
                                                                                                                  // 146
		// Set language on the parent, for styling                                                                      // 147
		parent = element.parentNode;                                                                                    // 148
                                                                                                                  // 149
		if (/pre/i.test(parent.nodeName)) {                                                                             // 150
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;          // 151
		}                                                                                                               // 152
                                                                                                                  // 153
		var code = element.textContent;                                                                                 // 154
                                                                                                                  // 155
		if(!code) {                                                                                                     // 156
			return;                                                                                                        // 157
		}                                                                                                               // 158
                                                                                                                  // 159
		var env = {                                                                                                     // 160
			element: element,                                                                                              // 161
			language: language,                                                                                            // 162
			grammar: grammar,                                                                                              // 163
			code: code                                                                                                     // 164
		};                                                                                                              // 165
                                                                                                                  // 166
		_.hooks.run('before-highlight', env);                                                                           // 167
                                                                                                                  // 168
		if (async && self.Worker) {                                                                                     // 169
			var worker = new Worker(_.filename);                                                                           // 170
                                                                                                                  // 171
			worker.onmessage = function(evt) {                                                                             // 172
				env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);                                        // 173
                                                                                                                  // 174
				_.hooks.run('before-insert', env);                                                                            // 175
                                                                                                                  // 176
				env.element.innerHTML = env.highlightedCode;                                                                  // 177
                                                                                                                  // 178
				callback && callback.call(env.element);                                                                       // 179
				_.hooks.run('after-highlight', env);                                                                          // 180
			};                                                                                                             // 181
                                                                                                                  // 182
			worker.postMessage(JSON.stringify({                                                                            // 183
				language: env.language,                                                                                       // 184
				code: env.code                                                                                                // 185
			}));                                                                                                           // 186
		}                                                                                                               // 187
		else {                                                                                                          // 188
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language)                                         // 189
                                                                                                                  // 190
			_.hooks.run('before-insert', env);                                                                             // 191
                                                                                                                  // 192
			env.element.innerHTML = env.highlightedCode;                                                                   // 193
                                                                                                                  // 194
			callback && callback.call(element);                                                                            // 195
                                                                                                                  // 196
			_.hooks.run('after-highlight', env);                                                                           // 197
		}                                                                                                               // 198
	},                                                                                                               // 199
                                                                                                                  // 200
	highlight: function (text, grammar, language) {                                                                  // 201
		var tokens = _.tokenize(text, grammar);                                                                         // 202
		return Token.stringify(_.util.encode(tokens), language);                                                        // 203
	},                                                                                                               // 204
                                                                                                                  // 205
	tokenize: function(text, grammar, language) {                                                                    // 206
		var Token = _.Token;                                                                                            // 207
                                                                                                                  // 208
		var strarr = [text];                                                                                            // 209
                                                                                                                  // 210
		var rest = grammar.rest;                                                                                        // 211
                                                                                                                  // 212
		if (rest) {                                                                                                     // 213
			for (var token in rest) {                                                                                      // 214
				grammar[token] = rest[token];                                                                                 // 215
			}                                                                                                              // 216
                                                                                                                  // 217
			delete grammar.rest;                                                                                           // 218
		}                                                                                                               // 219
                                                                                                                  // 220
		tokenloop: for (var token in grammar) {                                                                         // 221
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {                                                        // 222
				continue;                                                                                                     // 223
			}                                                                                                              // 224
                                                                                                                  // 225
			var patterns = grammar[token];                                                                                 // 226
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];                                        // 227
                                                                                                                  // 228
			for (var j = 0; j < patterns.length; ++j) {                                                                    // 229
				var pattern = patterns[j],                                                                                    // 230
					inside = pattern.inside,                                                                                     // 231
					lookbehind = !!pattern.lookbehind,                                                                           // 232
					lookbehindLength = 0,                                                                                        // 233
					alias = pattern.alias;                                                                                       // 234
                                                                                                                  // 235
				pattern = pattern.pattern || pattern;                                                                         // 236
                                                                                                                  // 237
				for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop                     // 238
                                                                                                                  // 239
					var str = strarr[i];                                                                                         // 240
                                                                                                                  // 241
					if (strarr.length > text.length) {                                                                           // 242
						// Something went terribly wrong, ABORT, ABORT!                                                             // 243
						break tokenloop;                                                                                            // 244
					}                                                                                                            // 245
                                                                                                                  // 246
					if (str instanceof Token) {                                                                                  // 247
						continue;                                                                                                   // 248
					}                                                                                                            // 249
                                                                                                                  // 250
					pattern.lastIndex = 0;                                                                                       // 251
                                                                                                                  // 252
					var match = pattern.exec(str);                                                                               // 253
                                                                                                                  // 254
					if (match) {                                                                                                 // 255
						if(lookbehind) {                                                                                            // 256
							lookbehindLength = match[1].length;                                                                        // 257
						}                                                                                                           // 258
                                                                                                                  // 259
						var from = match.index - 1 + lookbehindLength,                                                              // 260
							match = match[0].slice(lookbehindLength),                                                                  // 261
							len = match.length,                                                                                        // 262
							to = from + len,                                                                                           // 263
							before = str.slice(0, from + 1),                                                                           // 264
							after = str.slice(to + 1);                                                                                 // 265
                                                                                                                  // 266
						var args = [i, 1];                                                                                          // 267
                                                                                                                  // 268
						if (before) {                                                                                               // 269
							args.push(before);                                                                                         // 270
						}                                                                                                           // 271
                                                                                                                  // 272
						var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias);                           // 273
                                                                                                                  // 274
						args.push(wrapped);                                                                                         // 275
                                                                                                                  // 276
						if (after) {                                                                                                // 277
							args.push(after);                                                                                          // 278
						}                                                                                                           // 279
                                                                                                                  // 280
						Array.prototype.splice.apply(strarr, args);                                                                 // 281
					}                                                                                                            // 282
				}                                                                                                             // 283
			}                                                                                                              // 284
		}                                                                                                               // 285
                                                                                                                  // 286
		return strarr;                                                                                                  // 287
	},                                                                                                               // 288
                                                                                                                  // 289
	hooks: {                                                                                                         // 290
		all: {},                                                                                                        // 291
                                                                                                                  // 292
		add: function (name, callback) {                                                                                // 293
			var hooks = _.hooks.all;                                                                                       // 294
                                                                                                                  // 295
			hooks[name] = hooks[name] || [];                                                                               // 296
                                                                                                                  // 297
			hooks[name].push(callback);                                                                                    // 298
		},                                                                                                              // 299
                                                                                                                  // 300
		run: function (name, env) {                                                                                     // 301
			var callbacks = _.hooks.all[name];                                                                             // 302
                                                                                                                  // 303
			if (!callbacks || !callbacks.length) {                                                                         // 304
				return;                                                                                                       // 305
			}                                                                                                              // 306
                                                                                                                  // 307
			for (var i=0, callback; callback = callbacks[i++];) {                                                          // 308
				callback(env);                                                                                                // 309
			}                                                                                                              // 310
		}                                                                                                               // 311
	}                                                                                                                // 312
};                                                                                                                // 313
                                                                                                                  // 314
var Token = _.Token = function(type, content, alias) {                                                            // 315
	this.type = type;                                                                                                // 316
	this.content = content;                                                                                          // 317
	this.alias = alias;                                                                                              // 318
};                                                                                                                // 319
                                                                                                                  // 320
Token.stringify = function(o, language, parent) {                                                                 // 321
	if (typeof o == 'string') {                                                                                      // 322
		return o;                                                                                                       // 323
	}                                                                                                                // 324
                                                                                                                  // 325
	if (Object.prototype.toString.call(o) == '[object Array]') {                                                     // 326
		return o.map(function(element) {                                                                                // 327
			return Token.stringify(element, language, o);                                                                  // 328
		}).join('');                                                                                                    // 329
	}                                                                                                                // 330
                                                                                                                  // 331
	var env = {                                                                                                      // 332
		type: o.type,                                                                                                   // 333
		content: Token.stringify(o.content, language, parent),                                                          // 334
		tag: 'span',                                                                                                    // 335
		classes: ['token', o.type],                                                                                     // 336
		attributes: {},                                                                                                 // 337
		language: language,                                                                                             // 338
		parent: parent                                                                                                  // 339
	};                                                                                                               // 340
                                                                                                                  // 341
	if (env.type == 'comment') {                                                                                     // 342
		env.attributes['spellcheck'] = 'true';                                                                          // 343
	}                                                                                                                // 344
                                                                                                                  // 345
	if (o.alias) {                                                                                                   // 346
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];                                           // 347
		Array.prototype.push.apply(env.classes, aliases);                                                               // 348
	}                                                                                                                // 349
                                                                                                                  // 350
	_.hooks.run('wrap', env);                                                                                        // 351
                                                                                                                  // 352
	var attributes = '';                                                                                             // 353
                                                                                                                  // 354
	for (var name in env.attributes) {                                                                               // 355
		attributes += name + '="' + (env.attributes[name] || '') + '"';                                                 // 356
	}                                                                                                                // 357
                                                                                                                  // 358
	return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';
                                                                                                                  // 360
};                                                                                                                // 361
                                                                                                                  // 362
if (!self.document) {                                                                                             // 363
	if (!self.addEventListener) {                                                                                    // 364
		// in Node.js                                                                                                   // 365
		return self.Prism;                                                                                              // 366
	}                                                                                                                // 367
 	// In worker                                                                                                    // 368
	self.addEventListener('message', function(evt) {                                                                 // 369
		var message = JSON.parse(evt.data),                                                                             // 370
		    lang = message.language,                                                                                    // 371
		    code = message.code;                                                                                        // 372
                                                                                                                  // 373
		self.postMessage(JSON.stringify(_.util.encode(_.tokenize(code, _.languages[lang]))));                           // 374
		self.close();                                                                                                   // 375
	}, false);                                                                                                       // 376
                                                                                                                  // 377
	return self.Prism;                                                                                               // 378
}                                                                                                                 // 379
                                                                                                                  // 380
// Get current script and highlight                                                                               // 381
var script = document.getElementsByTagName('script');                                                             // 382
                                                                                                                  // 383
script = script[script.length - 1];                                                                               // 384
                                                                                                                  // 385
if (script) {                                                                                                     // 386
	_.filename = script.src;                                                                                         // 387
                                                                                                                  // 388
	if (document.addEventListener && !script.hasAttribute('data-manual')) {                                          // 389
		document.addEventListener('DOMContentLoaded', _.highlightAll);                                                  // 390
	}                                                                                                                // 391
}                                                                                                                 // 392
                                                                                                                  // 393
return self.Prism;                                                                                                // 394
                                                                                                                  // 395
})();                                                                                                             // 396
                                                                                                                  // 397
if (typeof module !== 'undefined' && module.exports) {                                                            // 398
	module.exports = Prism;                                                                                          // 399
}                                                                                                                 // 400
                                                                                                                  // 401
                                                                                                                  // 402
/* **********************************************                                                                 // 403
     Begin prism-markup.js                                                                                        // 404
********************************************** */                                                                 // 405
                                                                                                                  // 406
Prism.languages.markup = {                                                                                        // 407
	'comment': /<!--[\w\W]*?-->/g,                                                                                   // 408
	'prolog': /<\?.+?\?>/,                                                                                           // 409
	'doctype': /<!DOCTYPE.+?>/,                                                                                      // 410
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,                                                                              // 411
	'tag': {                                                                                                         // 412
		pattern: /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,                     // 413
		inside: {                                                                                                       // 414
			'tag': {                                                                                                       // 415
				pattern: /^<\/?[\w:-]+/i,                                                                                     // 416
				inside: {                                                                                                     // 417
					'punctuation': /^<\/?/,                                                                                      // 418
					'namespace': /^[\w-]+?:/                                                                                     // 419
				}                                                                                                             // 420
			},                                                                                                             // 421
			'attr-value': {                                                                                                // 422
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,                                                                  // 423
				inside: {                                                                                                     // 424
					'punctuation': /=|>|"/g                                                                                      // 425
				}                                                                                                             // 426
			},                                                                                                             // 427
			'punctuation': /\/?>/g,                                                                                        // 428
			'attr-name': {                                                                                                 // 429
				pattern: /[\w:-]+/g,                                                                                          // 430
				inside: {                                                                                                     // 431
					'namespace': /^[\w-]+?:/                                                                                     // 432
				}                                                                                                             // 433
			}                                                                                                              // 434
                                                                                                                  // 435
		}                                                                                                               // 436
	},                                                                                                               // 437
	'entity': /\&#?[\da-z]{1,8};/gi                                                                                  // 438
};                                                                                                                // 439
                                                                                                                  // 440
// Plugin to make entity title show the real entity, idea by Roman Komarov                                        // 441
Prism.hooks.add('wrap', function(env) {                                                                           // 442
                                                                                                                  // 443
	if (env.type === 'entity') {                                                                                     // 444
		env.attributes['title'] = env.content.replace(/&amp;/, '&');                                                    // 445
	}                                                                                                                // 446
});                                                                                                               // 447
                                                                                                                  // 448
                                                                                                                  // 449
/* **********************************************                                                                 // 450
     Begin prism-css.js                                                                                           // 451
********************************************** */                                                                 // 452
                                                                                                                  // 453
Prism.languages.css = {                                                                                           // 454
	'comment': /\/\*[\w\W]*?\*\//g,                                                                                  // 455
	'atrule': {                                                                                                      // 456
		pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,                                                                           // 457
		inside: {                                                                                                       // 458
			'punctuation': /[;:]/g                                                                                         // 459
		}                                                                                                               // 460
	},                                                                                                               // 461
	'url': /url\((["']?).*?\1\)/gi,                                                                                  // 462
	'selector': /[^\{\}\s][^\{\};]*(?=\s*\{)/g,                                                                      // 463
	'property': /(\b|\B)[\w-]+(?=\s*:)/ig,                                                                           // 464
	'string': /("|')(\\?.)*?\1/g,                                                                                    // 465
	'important': /\B!important\b/gi,                                                                                 // 466
	'punctuation': /[\{\};:]/g,                                                                                      // 467
	'function': /[-a-z0-9]+(?=\()/ig                                                                                 // 468
};                                                                                                                // 469
                                                                                                                  // 470
if (Prism.languages.markup) {                                                                                     // 471
	Prism.languages.insertBefore('markup', 'tag', {                                                                  // 472
		'style': {                                                                                                      // 473
			pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/ig,                                                                 // 474
			inside: {                                                                                                      // 475
				'tag': {                                                                                                      // 476
					pattern: /<style[\w\W]*?>|<\/style>/ig,                                                                      // 477
					inside: Prism.languages.markup.tag.inside                                                                    // 478
				},                                                                                                            // 479
				rest: Prism.languages.css                                                                                     // 480
			}                                                                                                              // 481
		}                                                                                                               // 482
	});                                                                                                              // 483
}                                                                                                                 // 484
                                                                                                                  // 485
/* **********************************************                                                                 // 486
     Begin prism-clike.js                                                                                         // 487
********************************************** */                                                                 // 488
                                                                                                                  // 489
Prism.languages.clike = {                                                                                         // 490
	'comment': [                                                                                                     // 491
		{                                                                                                               // 492
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//g,                                                                         // 493
			lookbehind: true                                                                                               // 494
		},                                                                                                              // 495
		{                                                                                                               // 496
			pattern: /(^|[^\\:])\/\/.*?(\r?\n|$)/g,                                                                        // 497
			lookbehind: true                                                                                               // 498
		}                                                                                                               // 499
	],                                                                                                               // 500
	'string': /("|')(\\?.)*?\1/g,                                                                                    // 501
	'class-name': {                                                                                                  // 502
		pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig, // 503
		lookbehind: true,                                                                                               // 504
		inside: {                                                                                                       // 505
			punctuation: /(\.|\\)/                                                                                         // 506
		}                                                                                                               // 507
	},                                                                                                               // 508
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,                                                                                  // 510
	'function': {                                                                                                    // 511
		pattern: /[a-z0-9_]+\(/ig,                                                                                      // 512
		inside: {                                                                                                       // 513
			punctuation: /\(/                                                                                              // 514
		}                                                                                                               // 515
	},                                                                                                               // 516
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,                                                        // 517
	'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,                                        // 518
	'ignore': /&(lt|gt|amp);/gi,                                                                                     // 519
	'punctuation': /[{}[\];(),.:]/g                                                                                  // 520
};                                                                                                                // 521
                                                                                                                  // 522
                                                                                                                  // 523
/* **********************************************                                                                 // 524
     Begin prism-javascript.js                                                                                    // 525
********************************************** */                                                                 // 526
                                                                                                                  // 527
Prism.languages.javascript = Prism.languages.extend('clike', {                                                    // 528
	'keyword': /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g,
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g                                          // 530
});                                                                                                               // 531
                                                                                                                  // 532
Prism.languages.insertBefore('javascript', 'keyword', {                                                           // 533
	'regex': {                                                                                                       // 534
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,                           // 535
		lookbehind: true                                                                                                // 536
	}                                                                                                                // 537
});                                                                                                               // 538
                                                                                                                  // 539
if (Prism.languages.markup) {                                                                                     // 540
	Prism.languages.insertBefore('markup', 'tag', {                                                                  // 541
		'script': {                                                                                                     // 542
			pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/ig,                                                               // 543
			inside: {                                                                                                      // 544
				'tag': {                                                                                                      // 545
					pattern: /<script[\w\W]*?>|<\/script>/ig,                                                                    // 546
					inside: Prism.languages.markup.tag.inside                                                                    // 547
				},                                                                                                            // 548
				rest: Prism.languages.javascript                                                                              // 549
			}                                                                                                              // 550
		}                                                                                                               // 551
	});                                                                                                              // 552
}                                                                                                                 // 553
                                                                                                                  // 554
                                                                                                                  // 555
/* **********************************************                                                                 // 556
     Begin prism-file-highlight.js                                                                                // 557
********************************************** */                                                                 // 558
                                                                                                                  // 559
(function(){                                                                                                      // 560
                                                                                                                  // 561
if (!self.Prism || !self.document || !document.querySelector) {                                                   // 562
	return;                                                                                                          // 563
}                                                                                                                 // 564
                                                                                                                  // 565
var Extensions = {                                                                                                // 566
	'js': 'javascript',                                                                                              // 567
	'html': 'markup',                                                                                                // 568
	'svg': 'markup',                                                                                                 // 569
	'xml': 'markup',                                                                                                 // 570
	'py': 'python'                                                                                                   // 571
};                                                                                                                // 572
                                                                                                                  // 573
Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function(pre) {                    // 574
	var src = pre.getAttribute('data-src');                                                                          // 575
	var extension = (src.match(/\.(\w+)$/) || [,''])[1];                                                             // 576
	var language = Extensions[extension] || extension;                                                               // 577
	                                                                                                                 // 578
	var code = document.createElement('code');                                                                       // 579
	code.className = 'language-' + language;                                                                         // 580
	                                                                                                                 // 581
	pre.textContent = '';                                                                                            // 582
	                                                                                                                 // 583
	code.textContent = 'Loading…';                                                                                   // 584
	                                                                                                                 // 585
	pre.appendChild(code);                                                                                           // 586
	                                                                                                                 // 587
	var xhr = new XMLHttpRequest();                                                                                  // 588
	                                                                                                                 // 589
	xhr.open('GET', src, true);                                                                                      // 590
                                                                                                                  // 591
	xhr.onreadystatechange = function() {                                                                            // 592
		if (xhr.readyState == 4) {                                                                                      // 593
			                                                                                                               // 594
			if (xhr.status < 400 && xhr.responseText) {                                                                    // 595
				code.textContent = xhr.responseText;                                                                          // 596
			                                                                                                               // 597
				Prism.highlightElement(code);                                                                                 // 598
			}                                                                                                              // 599
			else if (xhr.status >= 400) {                                                                                  // 600
				code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;                       // 601
			}                                                                                                              // 602
			else {                                                                                                         // 603
				code.textContent = '✖ Error: File does not exist or is empty';                                                // 604
			}                                                                                                              // 605
		}                                                                                                               // 606
	};                                                                                                               // 607
	                                                                                                                 // 608
	xhr.send(null);                                                                                                  // 609
});                                                                                                               // 610
                                                                                                                  // 611
})();                                                                                                             // 612
                                                                                                                  // 613






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/lib/prism/components/prism-bash.js                                                    //
// This file is in bare mode and is not in its own closure.                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Prism.languages.bash = Prism.languages.extend('clike', {                                                          // 1
	'comment': {                                                                                                     // 2
		pattern: /(^|[^"{\\])(#.*?(\r?\n|$))/g,                                                                         // 3
		lookbehind: true                                                                                                // 4
	},                                                                                                               // 5
	'string': {                                                                                                      // 6
		//allow multiline string                                                                                        // 7
		pattern: /("|')(\\?[\s\S])*?\1/g,                                                                               // 8
		inside: {                                                                                                       // 9
			//'property' class reused for bash variables                                                                   // 10
			'property': /\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^\}]+\})/g                                                           // 11
		}                                                                                                               // 12
	},                                                                                                               // 13
	'keyword': /\b(if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)\b/g
});                                                                                                               // 15
                                                                                                                  // 16
Prism.languages.insertBefore('bash', 'keyword', {                                                                 // 17
	//'property' class reused for bash variables                                                                     // 18
	'property': /\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^}]+\})/g                                                              // 19
});                                                                                                               // 20
Prism.languages.insertBefore('bash', 'comment', {                                                                 // 21
	//shebang must be before comment, 'important' class from css reused                                              // 22
	'important': /(^#!\s*\/bin\/bash)|(^#!\s*\/bin\/sh)/g                                                            // 23
});                                                                                                               // 24
                                                                                                                  // 25






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/lib/prism/components/prism-css.js                                                     //
// This file is in bare mode and is not in its own closure.                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Prism.languages.css = {                                                                                           // 1
	'comment': /\/\*[\w\W]*?\*\//g,                                                                                  // 2
	'atrule': {                                                                                                      // 3
		pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,                                                                           // 4
		inside: {                                                                                                       // 5
			'punctuation': /[;:]/g                                                                                         // 6
		}                                                                                                               // 7
	},                                                                                                               // 8
	'url': /url\((["']?).*?\1\)/gi,                                                                                  // 9
	'selector': /[^\{\}\s][^\{\};]*(?=\s*\{)/g,                                                                      // 10
	'property': /(\b|\B)[\w-]+(?=\s*:)/ig,                                                                           // 11
	'string': /("|')(\\?.)*?\1/g,                                                                                    // 12
	'important': /\B!important\b/gi,                                                                                 // 13
	'punctuation': /[\{\};:]/g,                                                                                      // 14
	'function': /[-a-z0-9]+(?=\()/ig                                                                                 // 15
};                                                                                                                // 16
                                                                                                                  // 17
if (Prism.languages.markup) {                                                                                     // 18
	Prism.languages.insertBefore('markup', 'tag', {                                                                  // 19
		'style': {                                                                                                      // 20
			pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/ig,                                                                 // 21
			inside: {                                                                                                      // 22
				'tag': {                                                                                                      // 23
					pattern: /<style[\w\W]*?>|<\/style>/ig,                                                                      // 24
					inside: Prism.languages.markup.tag.inside                                                                    // 25
				},                                                                                                            // 26
				rest: Prism.languages.css                                                                                     // 27
			}                                                                                                              // 28
		}                                                                                                               // 29
	});                                                                                                              // 30
}                                                                                                                 // 31






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/lib/prism/components/prism-javascript.js                                              //
// This file is in bare mode and is not in its own closure.                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Prism.languages.javascript = Prism.languages.extend('clike', {                                                    // 1
	'keyword': /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g,
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g                                          // 3
});                                                                                                               // 4
                                                                                                                  // 5
Prism.languages.insertBefore('javascript', 'keyword', {                                                           // 6
	'regex': {                                                                                                       // 7
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,                           // 8
		lookbehind: true                                                                                                // 9
	}                                                                                                                // 10
});                                                                                                               // 11
                                                                                                                  // 12
if (Prism.languages.markup) {                                                                                     // 13
	Prism.languages.insertBefore('markup', 'tag', {                                                                  // 14
		'script': {                                                                                                     // 15
			pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/ig,                                                               // 16
			inside: {                                                                                                      // 17
				'tag': {                                                                                                      // 18
					pattern: /<script[\w\W]*?>|<\/script>/ig,                                                                    // 19
					inside: Prism.languages.markup.tag.inside                                                                    // 20
				},                                                                                                            // 21
				rest: Prism.languages.javascript                                                                              // 22
			}                                                                                                              // 23
		}                                                                                                               // 24
	});                                                                                                              // 25
}                                                                                                                 // 26
                                                                                                                  // 27






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/lib/prism/components/prism-markup.js                                                  //
// This file is in bare mode and is not in its own closure.                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Prism.languages.markup = {                                                                                        // 1
	'comment': /<!--[\w\W]*?-->/g,                                                                                   // 2
	'prolog': /<\?.+?\?>/,                                                                                           // 3
	'doctype': /<!DOCTYPE.+?>/,                                                                                      // 4
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,                                                                              // 5
	'tag': {                                                                                                         // 6
		pattern: /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,                     // 7
		inside: {                                                                                                       // 8
			'tag': {                                                                                                       // 9
				pattern: /^<\/?[\w:-]+/i,                                                                                     // 10
				inside: {                                                                                                     // 11
					'punctuation': /^<\/?/,                                                                                      // 12
					'namespace': /^[\w-]+?:/                                                                                     // 13
				}                                                                                                             // 14
			},                                                                                                             // 15
			'attr-value': {                                                                                                // 16
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,                                                                  // 17
				inside: {                                                                                                     // 18
					'punctuation': /=|>|"/g                                                                                      // 19
				}                                                                                                             // 20
			},                                                                                                             // 21
			'punctuation': /\/?>/g,                                                                                        // 22
			'attr-name': {                                                                                                 // 23
				pattern: /[\w:-]+/g,                                                                                          // 24
				inside: {                                                                                                     // 25
					'namespace': /^[\w-]+?:/                                                                                     // 26
				}                                                                                                             // 27
			}                                                                                                              // 28
                                                                                                                  // 29
		}                                                                                                               // 30
	},                                                                                                               // 31
	'entity': /\&#?[\da-z]{1,8};/gi                                                                                  // 32
};                                                                                                                // 33
                                                                                                                  // 34
// Plugin to make entity title show the real entity, idea by Roman Komarov                                        // 35
Prism.hooks.add('wrap', function(env) {                                                                           // 36
                                                                                                                  // 37
	if (env.type === 'entity') {                                                                                     // 38
		env.attributes['title'] = env.content.replace(/&amp;/, '&');                                                    // 39
	}                                                                                                                // 40
});                                                                                                               // 41
                                                                                                                  // 42






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/lib/prism/components/prism-coffeescript.js                                            //
// This file is in bare mode and is not in its own closure.                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Prism.languages.coffeescript = Prism.languages.extend('javascript', {                                             // 1
	'comment': [                                                                                                     // 2
		/([#]{3}\s*\r?\n(.*\s*\r*\n*)\s*?\r?\n[#]{3})/g,                                                                // 3
		/(\s|^)([#]{1}[^#^\r^\n]{2,}?(\r?\n|$))/g                                                                       // 4
	],                                                                                                               // 5
	'keyword': /\b(this|window|delete|class|extends|namespace|extend|ar|let|if|else|while|do|for|each|of|return|in|instanceof|new|with|typeof|try|catch|finally|null|undefined|break|continue)\b/g
});                                                                                                               // 7
                                                                                                                  // 8
Prism.languages.insertBefore('coffeescript', 'keyword', {                                                         // 9
	'function': {                                                                                                    // 10
		pattern: /[a-z|A-z]+\s*[:|=]\s*(\([.|a-z\s|,|:|{|}|\"|\'|=]*\))?\s*-&gt;/gi,                                    // 11
		inside: {                                                                                                       // 12
			'function-name': /[_?a-z-|A-Z-]+(\s*[:|=])| @[_?$?a-z-|A-Z-]+(\s*)| /g,                                        // 13
			'operator': /[-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\//g                                    // 14
		}                                                                                                               // 15
	},                                                                                                               // 16
	'attr-name': /[_?a-z-|A-Z-]+(\s*:)| @[_?$?a-z-|A-Z-]+(\s*)| /g                                                   // 17
});                                                                                                               // 18
                                                                                                                  // 19






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/prism-jade.js                                                                         //
// This file is in bare mode and is not in its own closure.                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Prism.languages.jade = {                                                                                          // 1
	'comment': /^[\t ]*\/\/.*$/gm,                                                                                   // 2
	'mixin': {                                                                                                       // 3
		pattern: /\+\w+.*$/gm,                                                                                          // 4
		inside: {                                                                                                       // 5
			'regex': {                                                                                                     // 6
				pattern: /\+\w+/,                                                                                             // 7
				inside: {                                                                                                     // 8
					'punctuation': /\+/                                                                                          // 9
				}                                                                                                             // 10
			},                                                                                                             // 11
			'attr-value': {                                                                                                // 12
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,                                                                  // 13
				inside: {                                                                                                     // 14
					'punctuation': /=|>|"/g                                                                                      // 15
				}                                                                                                             // 16
			},                                                                                                             // 17
			'attr-name': {                                                                                                 // 18
				pattern: /[\w:-]+/g,                                                                                          // 19
				inside: {                                                                                                     // 20
					'namespace': /^[\w-]+?:/                                                                                     // 21
				}                                                                                                             // 22
			}                                                                                                              // 23
		}                                                                                                               // 24
	},                                                                                                               // 25
	'tagLine': {                                                                                                     // 26
		pattern: /\n[\t ]*\w+[\( ].*$/gm,                                                                               // 27
		inside: {                                                                                                       // 28
			'tag': {                                                                                                       // 29
				pattern: /(\n[\t ]*)\w+/m,                                                                                    // 30
				lookbehind: true                                                                                              // 31
			},                                                                                                             // 32
			'string': {                                                                                                    // 33
				pattern: /\b\w+\b/g,                                                                                          // 34
			},                                                                                                             // 35
			'attr-value': {                                                                                                // 36
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,                                                                  // 37
				inside: {                                                                                                     // 38
					'punctuation': /=|>|"/g                                                                                      // 39
				}                                                                                                             // 40
			},                                                                                                             // 41
			'attr-name': {                                                                                                 // 42
				pattern: /[\w:-]+/g,                                                                                          // 43
				inside: {                                                                                                     // 44
					'namespace': /^[\w-]+?:/                                                                                     // 45
				}                                                                                                             // 46
			}                                                                                                              // 47
		}                                                                                                               // 48
	},                                                                                                               // 49
	'entity': /\&#?[\da-z]{1,8};/gi                                                                                  // 50
};                                                                                                                // 51
                                                                                                                  // 52
// Plugin to make entity title show the real entity, idea by Roman Komarov                                        // 53
/*                                                                                                                // 54
Prism.hooks.add('wrap', function(env) {                                                                           // 55
                                                                                                                  // 56
	if (env.type === 'entity') {                                                                                     // 57
		env.attributes['title'] = env.content.replace(/&amp;/, '&');                                                    // 58
	}                                                                                                                // 59
});                                                                                                               // 60
*/                                                                                                                // 61
                                                                                                                  // 62






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/prism-spacebars.js                                                                    //
// This file is in bare mode and is not in its own closure.                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Prism.languages.spacebars = {                                                                                     // 1
	'comment': /<!--[\w\W]*?-->|\{\{!--[\w\W]*?--\}\}|\{\{! [\w\W]*?\}\}/g,                                          // 2
	'prolog': /<\?.+?\?>/,                                                                                           // 3
	'doctype': /<!DOCTYPE.+?>/,                                                                                      // 4
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,                                                                              // 5
	'tag': {                                                                                                         // 6
		pattern: /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,                     // 7
		inside: {                                                                                                       // 8
			'tag': {                                                                                                       // 9
				pattern: /^<\/?[\w:-]+/i,                                                                                     // 10
				inside: {                                                                                                     // 11
					'punctuation': /^<\/?/,                                                                                      // 12
					'namespace': /^[\w-]+?:/                                                                                     // 13
				}                                                                                                             // 14
			},                                                                                                             // 15
			'attr-value': {                                                                                                // 16
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,                                                                  // 17
				inside: {                                                                                                     // 18
					'punctuation': /=|>|"/g                                                                                      // 19
				}                                                                                                             // 20
			},                                                                                                             // 21
			'punctuation': /\/?>/g,                                                                                        // 22
			'attr-name': {                                                                                                 // 23
				pattern: /[\w:-]+/g,                                                                                          // 24
				inside: {                                                                                                     // 25
					'namespace': /^[\w-]+?:/                                                                                     // 26
				}                                                                                                             // 27
			}                                                                                                              // 28
                                                                                                                  // 29
		}                                                                                                               // 30
	},                                                                                                               // 31
	'entity': /\&#?[\da-z]{1,8};/gi,                                                                                 // 32
	'spacebars': {                                                                                                   // 33
		pattern: /\{\{[\/\#\>]?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\}\}/gi,            // 34
		inside: {                                                                                                       // 35
			'regex': {                                                                                                     // 36
				pattern: /\{\{[\/\#\>]?[\w:-]+/,                                                                              // 37
				inside: {                                                                                                     // 38
					'punctuation': /\{\{[\/\#\>]?/,                                                                              // 39
					'namespace': /^[\w-]+?:/                                                                                     // 40
				}                                                                                                             // 41
			},                                                                                                             // 42
			'attr-value': {                                                                                                // 43
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,                                                                  // 44
				inside: {                                                                                                     // 45
					'punctuation': /=|>|"/g                                                                                      // 46
				}                                                                                                             // 47
			},                                                                                                             // 48
			'punctuation': /\}\}/g,                                                                                        // 49
			'attr-name': {                                                                                                 // 50
				pattern: /[\w:-]+/g,                                                                                          // 51
				inside: {                                                                                                     // 52
					'namespace': /^[\w-]+?:/                                                                                     // 53
				}                                                                                                             // 54
			}                                                                                                              // 55
                                                                                                                  // 56
		}                                                                                                               // 57
	},                                                                                                               // 58
	'entity': /\&#?[\da-z]{1,8};/gi,                                                                                 // 59
};                                                                                                                // 60
                                                                                                                  // 61
// Plugin to make entity title show the real entity, idea by Roman Komarov                                        // 62
/*                                                                                                                // 63
Prism.hooks.add('wrap', function(env) {                                                                           // 64
                                                                                                                  // 65
	if (env.type === 'entity') {                                                                                     // 66
		env.attributes['title'] = env.content.replace(/&amp;/, '&');                                                    // 67
	}                                                                                                                // 68
});                                                                                                               // 69
*/                                                                                                                // 70
                                                                                                                  // 71
// Deprecated                                                                                                     // 72
Prism.languages.blaze = Prism.languages.spacebars;                                                                // 73
                                                                                                                  // 74






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/lib/prism/plugins/line-numbers/prism-line-numbers.js                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Prism.hooks.add('after-highlight', function (env) {                                                               // 1
	// works only for <code> wrapped inside <pre data-line-numbers> (not inline)                                     // 2
	var pre = env.element.parentNode;                                                                                // 3
	if (!pre || !/pre/i.test(pre.nodeName) || pre.className.indexOf('line-numbers') === -1) {                        // 4
		return;                                                                                                         // 5
	}                                                                                                                // 6
                                                                                                                  // 7
	var linesNum = (1 + env.code.split('\n').length);                                                                // 8
	var lineNumbersWrapper;                                                                                          // 9
                                                                                                                  // 10
	lines = new Array(linesNum);                                                                                     // 11
	lines = lines.join('<span></span>');                                                                             // 12
                                                                                                                  // 13
	lineNumbersWrapper = document.createElement('span');                                                             // 14
	lineNumbersWrapper.className = 'line-numbers-rows';                                                              // 15
	lineNumbersWrapper.innerHTML = lines;                                                                            // 16
                                                                                                                  // 17
	if (pre.hasAttribute('data-start')) {                                                                            // 18
		pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);                    // 19
	}                                                                                                                // 20
                                                                                                                  // 21
	env.element.appendChild(lineNumbersWrapper);                                                                     // 22
                                                                                                                  // 23
});                                                                                                               // 24
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/lib/prism/plugins/line-highlight/prism-line-highlight.js                              //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
(function(){                                                                                                      // 1
                                                                                                                  // 2
if(!window.Prism) {                                                                                               // 3
	return;                                                                                                          // 4
}                                                                                                                 // 5
                                                                                                                  // 6
function $$(expr, con) {                                                                                          // 7
	return Array.prototype.slice.call((con || document).querySelectorAll(expr));                                     // 8
}                                                                                                                 // 9
                                                                                                                  // 10
function hasClass(element, className) {                                                                           // 11
  className = " " + className + " ";                                                                              // 12
  return (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1                          // 13
}                                                                                                                 // 14
                                                                                                                  // 15
var CRLF = crlf = /\r?\n|\r/g;                                                                                    // 16
                                                                                                                  // 17
function highlightLines(pre, lines, classes) {                                                                    // 18
	var ranges = lines.replace(/\s+/g, '').split(','),                                                               // 19
	    offset = +pre.getAttribute('data-line-offset') || 0;                                                         // 20
	                                                                                                                 // 21
	var lineHeight = parseFloat(getComputedStyle(pre).lineHeight);                                                   // 22
                                                                                                                  // 23
	for (var i=0, range; range = ranges[i++];) {                                                                     // 24
		range = range.split('-');                                                                                       // 25
					                                                                                                             // 26
		var start = +range[0],                                                                                          // 27
		    end = +range[1] || start;                                                                                   // 28
		                                                                                                                // 29
		var line = document.createElement('div');                                                                       // 30
		                                                                                                                // 31
		line.textContent = Array(end - start + 2).join(' \r\n');                                                        // 32
		line.className = (classes || '') + ' line-highlight';                                                           // 33
                                                                                                                  // 34
    //if the line-numbers plugin is enabled, then there is no reason for this plugin to display the line numbers  // 35
    if(!hasClass(pre, 'line-numbers')) {                                                                          // 36
      line.setAttribute('data-start', start);                                                                     // 37
                                                                                                                  // 38
      if(end > start) {                                                                                           // 39
        line.setAttribute('data-end', end);                                                                       // 40
      }                                                                                                           // 41
    }                                                                                                             // 42
                                                                                                                  // 43
		line.style.top = (start - offset - 1) * lineHeight + 'px';                                                      // 44
                                                                                                                  // 45
    //allow this to play nicely with the line-numbers plugin                                                      // 46
    if(hasClass(pre, 'line-numbers')) {                                                                           // 47
      //need to attack to pre as when line-numbers is enabled, the code tag is relatively which screws up the positioning
      pre.appendChild(line);                                                                                      // 49
    } else {                                                                                                      // 50
      (pre.querySelector('code') || pre).appendChild(line);                                                       // 51
    }                                                                                                             // 52
	}                                                                                                                // 53
}                                                                                                                 // 54
                                                                                                                  // 55
function applyHash() {                                                                                            // 56
	var hash = location.hash.slice(1);                                                                               // 57
	                                                                                                                 // 58
	// Remove pre-existing temporary lines                                                                           // 59
	$$('.temporary.line-highlight').forEach(function (line) {                                                        // 60
		line.parentNode.removeChild(line);                                                                              // 61
	});                                                                                                              // 62
	                                                                                                                 // 63
	var range = (hash.match(/\.([\d,-]+)$/) || [,''])[1];                                                            // 64
	                                                                                                                 // 65
	if (!range || document.getElementById(hash)) {                                                                   // 66
		return;                                                                                                         // 67
	}                                                                                                                // 68
	                                                                                                                 // 69
	var id = hash.slice(0, hash.lastIndexOf('.')),                                                                   // 70
	    pre = document.getElementById(id);                                                                           // 71
	                                                                                                                 // 72
	if (!pre) {                                                                                                      // 73
		return;                                                                                                         // 74
	}                                                                                                                // 75
	                                                                                                                 // 76
	if (!pre.hasAttribute('data-line')) {                                                                            // 77
		pre.setAttribute('data-line', '');                                                                              // 78
	}                                                                                                                // 79
                                                                                                                  // 80
	highlightLines(pre, range, 'temporary ');                                                                        // 81
                                                                                                                  // 82
	document.querySelector('.temporary.line-highlight').scrollIntoView();                                            // 83
}                                                                                                                 // 84
                                                                                                                  // 85
var fakeTimer = 0; // Hack to limit the number of times applyHash() runs                                          // 86
                                                                                                                  // 87
Prism.hooks.add('after-highlight', function(env) {                                                                // 88
	var pre = env.element.parentNode;                                                                                // 89
	var lines = pre && pre.getAttribute('data-line');                                                                // 90
	                                                                                                                 // 91
	if (!pre || !lines || !/pre/i.test(pre.nodeName)) {                                                              // 92
		return;                                                                                                         // 93
	}                                                                                                                // 94
	                                                                                                                 // 95
	clearTimeout(fakeTimer);                                                                                         // 96
	                                                                                                                 // 97
	$$('.line-highlight', pre).forEach(function (line) {                                                             // 98
		line.parentNode.removeChild(line);                                                                              // 99
	});                                                                                                              // 100
	                                                                                                                 // 101
	highlightLines(pre, lines);                                                                                      // 102
	                                                                                                                 // 103
	fakeTimer = setTimeout(applyHash, 1);                                                                            // 104
});                                                                                                               // 105
                                                                                                                  // 106
addEventListener('hashchange', applyHash);                                                                        // 107
                                                                                                                  // 108
})();                                                                                                             // 109
                                                                                                                  // 110
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/gadicohen:prism/prism.js                                                                              //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
  Blaze.Template.registerHelper("prism", new Template('prism', function () {                                      // 1
    var view = this;                                                                                              // 2
    var data = Blaze.getData(view);                                                                               // 3
                                                                                                                  // 4
    if (!data.language && data.lang)                                                                              // 5
    	data.language = data.lang;                                                                                   // 6
                                                                                                                  // 7
    var content = '';                                                                                             // 8
    if (view.templateContentBlock) {                                                                              // 9
      content = Blaze._toText(view.templateContentBlock, HTML.TEXTMODE.STRING);                                   // 10
    }                                                                                                             // 11
                                                                                                                  // 12
    // strip blank first line / last line                                                                         // 13
    content = content.replace(/^\n|\n\s*$/g, '');                                                                 // 14
                                                                                                                  // 15
    // deindent by first indent (TODO, make optional)                                                             // 16
    var indent = content.match(/^[\t ]+/);                                                                        // 17
    if (indent) {                                                                                                 // 18
			indent = new RegExp('^' + indent[0], 'gm');                                                                    // 19
			content = content.replace(indent, '');                                                                         // 20
    }                                                                                                             // 21
                                                                                                                  // 22
    /*                                                                                                            // 23
     * This following approach - construction inside a real div - works                                           // 24
     * better overall.  It looks like some prism plugins rely on it too.                                          // 25
     */                                                                                                           // 26
                                                                                                                  // 27
    var div = document.createElement('div');                                                                      // 28
    var pre = document.createElement('pre');                                                                      // 29
    var code = document.createElement('code');                                                                    // 30
                                                                                                                  // 31
    div.appendChild(pre); pre.appendChild(code);                                                                  // 32
    code.className = "language-" + data.language;                                                                 // 33
    code.textContent = content;                                                                                   // 34
                                                                                                                  // 35
    if (data.class)                                                                                               // 36
    	pre.className += ' ' + data.class;                                                                           // 37
    for (var key in data)                                                                                         // 38
    	if (/^data-/.test(key))                                                                                      // 39
    		pre.setAttribute(key, data[key]);                                                                           // 40
                                                                                                                  // 41
    Prism.highlightElement(code);                                                                                 // 42
    return HTML.Raw(div.innerHTML);                                                                               // 43
                                                                                                                  // 44
    /*                                                                                                            // 45
    var extra = '';                                                                                               // 46
    if (data.class)                                                                                               // 47
    	extra += ' class="' + data.class + '"';                                                                      // 48
    for (var key in data)                                                                                         // 49
    	if (/^data-/.test(key))                                                                                      // 50
    		extra += ' ' + key + '="' + data[key] + '"';                                                                // 51
                                                                                                                  // 52
    return HTML.Raw('<pre' + extra +'><code class="language-' + data.language + '">'                              // 53
    	+ Prism.highlight(content, Prism.languages[data.language])                                                   // 54
    	+ '</code></pre>');                                                                                          // 55
    */                                                                                                            // 56
                                                                                                                  // 57
  }));                                                                                                            // 58
                                                                                                                  // 59
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['gadicohen:prism'] = {};

})();
