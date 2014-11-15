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
var _ = Package.underscore._;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var compilePath, Url;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron:url/lib/compiler.js                                                                        //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/*                                                                                                          // 1
From https://github.com/pillarjs/path-to-regexp                                                             // 2
                                                                                                            // 3
The MIT License (MIT)                                                                                       // 4
                                                                                                            // 5
Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)                                                     // 6
                                                                                                            // 7
Permission is hereby granted, free of charge, to any person obtaining a copy                                // 8
of this software and associated documentation files (the "Software"), to deal                               // 9
in the Software without restriction, including without limitation the rights                                // 10
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell                                   // 11
copies of the Software, and to permit persons to whom the Software is                                       // 12
furnished to do so, subject to the following conditions:                                                    // 13
                                                                                                            // 14
The above copyright notice and this permission notice shall be included in                                  // 15
all copies or substantial portions of the Software.                                                         // 16
                                                                                                            // 17
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR                                  // 18
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,                                    // 19
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE                                 // 20
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                                      // 21
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,                               // 22
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN                                   // 23
THE SOFTWARE.                                                                                               // 24
*/                                                                                                          // 25
                                                                                                            // 26
/**                                                                                                         // 27
 * The main path matching regexp utility.                                                                   // 28
 *                                                                                                          // 29
 * @type {RegExp}                                                                                           // 30
 */                                                                                                         // 31
var PATH_REGEXP = new RegExp([                                                                              // 32
  // Match already escaped characters that would otherwise incorrectly appear                               // 33
  // in future matches. This allows the user to escape special characters that                              // 34
  // shouldn't be transformed.                                                                              // 35
  '(\\\\.)',                                                                                                // 36
  // Match Express-style parameters and un-named parameters with a prefix                                   // 37
  // and optional suffixes. Matches appear as:                                                              // 38
  //                                                                                                        // 39
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]                                                // 40
  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]                                  // 41
  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',                     // 42
  // Match regexp special characters that should always be escaped.                                         // 43
  '([.+*?=^!:${}()[\\]|\\/])'                                                                               // 44
].join('|'), 'g');                                                                                          // 45
                                                                                                            // 46
/**                                                                                                         // 47
 * Escape the capturing group by escaping special characters and meaning.                                   // 48
 *                                                                                                          // 49
 * @param  {String} group                                                                                   // 50
 * @return {String}                                                                                         // 51
 */                                                                                                         // 52
function escapeGroup (group) {                                                                              // 53
  return group.replace(/([=!:$\/()])/g, '\\$1');                                                            // 54
}                                                                                                           // 55
                                                                                                            // 56
/**                                                                                                         // 57
 * Attach the keys as a property of the regexp.                                                             // 58
 *                                                                                                          // 59
 * @param  {RegExp} re                                                                                      // 60
 * @param  {Array}  keys                                                                                    // 61
 * @return {RegExp}                                                                                         // 62
 */                                                                                                         // 63
var attachKeys = function (re, keys) {                                                                      // 64
  re.keys = keys;                                                                                           // 65
                                                                                                            // 66
  return re;                                                                                                // 67
};                                                                                                          // 68
                                                                                                            // 69
/**                                                                                                         // 70
 * Normalize the given path string, returning a regular expression.                                         // 71
 *                                                                                                          // 72
 * An empty array should be passed in, which will contain the placeholder key                               // 73
 * names. For example `/user/:id` will then contain `["id"]`.                                               // 74
 *                                                                                                          // 75
 * @param  {(String|RegExp|Array)} path                                                                     // 76
 * @param  {Array}                 keys                                                                     // 77
 * @param  {Object}                options                                                                  // 78
 * @return {RegExp}                                                                                         // 79
 */                                                                                                         // 80
function pathtoRegexp (path, keys, options) {                                                               // 81
  if (keys && !Array.isArray(keys)) {                                                                       // 82
    options = keys;                                                                                         // 83
    keys = null;                                                                                            // 84
  }                                                                                                         // 85
                                                                                                            // 86
  keys = keys || [];                                                                                        // 87
  options = options || {};                                                                                  // 88
                                                                                                            // 89
  var strict = options.strict;                                                                              // 90
  var end = options.end !== false;                                                                          // 91
  var flags = options.sensitive ? '' : 'i';                                                                 // 92
  var index = 0;                                                                                            // 93
                                                                                                            // 94
  if (path instanceof RegExp) {                                                                             // 95
    // Match all capturing groups of a regexp.                                                              // 96
    var groups = path.source.match(/\((?!\?)/g) || [];                                                      // 97
                                                                                                            // 98
    // Map all the matches to their numeric keys and push into the keys.                                    // 99
    keys.push.apply(keys, groups.map(function (match, index) {                                              // 100
      return {                                                                                              // 101
        name:      index,                                                                                   // 102
        delimiter: null,                                                                                    // 103
        optional:  false,                                                                                   // 104
        repeat:    false                                                                                    // 105
      };                                                                                                    // 106
    }));                                                                                                    // 107
                                                                                                            // 108
    // Return the source back to the user.                                                                  // 109
    return attachKeys(path, keys);                                                                          // 110
  }                                                                                                         // 111
                                                                                                            // 112
  if (Array.isArray(path)) {                                                                                // 113
    // Map array parts into regexps and return their source. We also pass                                   // 114
    // the same keys and options instance into every generation to get                                      // 115
    // consistent matching groups before we join the sources together.                                      // 116
    path = path.map(function (value) {                                                                      // 117
      return pathtoRegexp(value, keys, options).source;                                                     // 118
    });                                                                                                     // 119
                                                                                                            // 120
    // Generate a new regexp instance by joining all the parts together.                                    // 121
    return attachKeys(new RegExp('(?:' + path.join('|') + ')', flags), keys);                               // 122
  }                                                                                                         // 123
                                                                                                            // 124
  // Alter the path string into a usable regexp.                                                            // 125
  path = path.replace(PATH_REGEXP, function (match, escaped, prefix, key, capture, group, suffix, escape) { // 126
    // Avoiding re-escaping escaped characters.                                                             // 127
    if (escaped) {                                                                                          // 128
      return escaped;                                                                                       // 129
    }                                                                                                       // 130
                                                                                                            // 131
    // Escape regexp special characters.                                                                    // 132
    if (escape) {                                                                                           // 133
      return '\\' + escape;                                                                                 // 134
    }                                                                                                       // 135
                                                                                                            // 136
    var repeat   = suffix === '+' || suffix === '*';                                                        // 137
    var optional = suffix === '?' || suffix === '*';                                                        // 138
                                                                                                            // 139
    keys.push({                                                                                             // 140
      name:      key || index++,                                                                            // 141
      delimiter: prefix || '/',                                                                             // 142
      optional:  optional,                                                                                  // 143
      repeat:    repeat                                                                                     // 144
    });                                                                                                     // 145
                                                                                                            // 146
    // Escape the prefix character.                                                                         // 147
    prefix = prefix ? '\\' + prefix : '';                                                                   // 148
                                                                                                            // 149
    // Match using the custom capturing group, or fallback to capturing                                     // 150
    // everything up to the next slash (or next period if the param was                                     // 151
    // prefixed with a period).                                                                             // 152
    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');                            // 153
                                                                                                            // 154
    // Allow parameters to be repeated more than once.                                                      // 155
    if (repeat) {                                                                                           // 156
      capture = capture + '(?:' + prefix + capture + ')*';                                                  // 157
    }                                                                                                       // 158
                                                                                                            // 159
    // Allow a parameter to be optional.                                                                    // 160
    if (optional) {                                                                                         // 161
      return '(?:' + prefix + '(' + capture + '))?';                                                        // 162
    }                                                                                                       // 163
                                                                                                            // 164
    // Basic parameter support.                                                                             // 165
    return prefix + '(' + capture + ')';                                                                    // 166
  });                                                                                                       // 167
                                                                                                            // 168
  // Check whether the path ends in a slash as it alters some match behaviour.                              // 169
  var endsWithSlash = path[path.length - 1] === '/';                                                        // 170
                                                                                                            // 171
  // In non-strict mode we allow an optional trailing slash in the match. If                                // 172
  // the path to match already ended with a slash, we need to remove it for                                 // 173
  // consistency. The slash is only valid at the very end of a path match, not                              // 174
  // anywhere in the middle. This is important for non-ending mode, otherwise                               // 175
  // "/test/" will match "/test//route".                                                                    // 176
  if (!strict) {                                                                                            // 177
    path = (endsWithSlash ? path.slice(0, -2) : path) + '(?:\\/(?=$))?';                                    // 178
  }                                                                                                         // 179
                                                                                                            // 180
  // In non-ending mode, we need prompt the capturing groups to match as much                               // 181
  // as possible by using a positive lookahead for the end or next path segment.                            // 182
  if (!end) {                                                                                               // 183
    path += strict && endsWithSlash ? '' : '(?=\\/|$)';                                                     // 184
  }                                                                                                         // 185
                                                                                                            // 186
  return attachKeys(new RegExp('^' + path + (end ? '$' : ''), flags), keys);                                // 187
};                                                                                                          // 188
                                                                                                            // 189
compilePath = pathtoRegexp;                                                                                 // 190
                                                                                                            // 191
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron:url/lib/url.js                                                                             //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/*****************************************************************************/                             // 1
/* Url */                                                                                                   // 2
/*****************************************************************************/                             // 3
/**                                                                                                         // 4
 * Url utilities and the ability to compile a url into a regular expression.                                // 5
 */                                                                                                         // 6
Url = function (url, options) {                                                                             // 7
  options = options || {};                                                                                  // 8
  this.options = options;                                                                                   // 9
  this.keys = [];                                                                                           // 10
  this.regexp = compilePath(url, this.keys, options);                                                       // 11
  this._originalPath = url;                                                                                 // 12
  _.extend(this, Url.parse(url));                                                                           // 13
};                                                                                                          // 14
                                                                                                            // 15
/**                                                                                                         // 16
 * Given a relative or absolute path return                                                                 // 17
 * a relative path with a leading forward slash and                                                         // 18
 * no search string or hash fragment                                                                        // 19
 *                                                                                                          // 20
 * @param {String} path                                                                                     // 21
 * @return {String}                                                                                         // 22
 */                                                                                                         // 23
Url.normalize = function (url) {                                                                            // 24
  if (url instanceof RegExp)                                                                                // 25
    return url;                                                                                             // 26
  else if (typeof url !== 'string')                                                                         // 27
    return '/';                                                                                             // 28
                                                                                                            // 29
  var parts = Url.parse(url);                                                                               // 30
  var pathname = parts.pathname;                                                                            // 31
                                                                                                            // 32
  if (pathname.charAt(0) !== '/')                                                                           // 33
    pathname = '/' + pathname;                                                                              // 34
                                                                                                            // 35
  if (pathname.length > 1 && pathname.charAt(pathname.length - 1) === '/') {                                // 36
    pathname = pathname.slice(0, pathname.length - 1);                                                      // 37
  }                                                                                                         // 38
                                                                                                            // 39
  return pathname;                                                                                          // 40
};                                                                                                          // 41
                                                                                                            // 42
/**                                                                                                         // 43
 * Returns true if both a and b are of the same origin.                                                     // 44
 */                                                                                                         // 45
Url.isSameOrigin = function (a, b) {                                                                        // 46
  var aParts = Url.parse(a);                                                                                // 47
  var bParts = Url.parse(b);                                                                                // 48
  var result = aParts.origin === bParts.origin;                                                             // 49
  return result;                                                                                            // 50
};                                                                                                          // 51
                                                                                                            // 52
/**                                                                                                         // 53
 * Given a query string return an object of key value pairs.                                                // 54
 *                                                                                                          // 55
 * "?p1=value1&p2=value2 => {p1: value1, p2: value2}                                                        // 56
 */                                                                                                         // 57
Url.fromQueryString = function (query) {                                                                    // 58
  if (!query)                                                                                               // 59
    return {};                                                                                              // 60
                                                                                                            // 61
  if (typeof query !== 'string')                                                                            // 62
    throw new Error("expected string");                                                                     // 63
                                                                                                            // 64
  // get rid of the leading question mark                                                                   // 65
  if (query.charAt(0) === '?')                                                                              // 66
    query = query.slice(1);                                                                                 // 67
                                                                                                            // 68
  var keyValuePairs = query.split('&');                                                                     // 69
  var result = {};                                                                                          // 70
  var parts;                                                                                                // 71
                                                                                                            // 72
  _.each(keyValuePairs, function (pair) {                                                                   // 73
    var parts = pair.split('=');                                                                            // 74
    var key = parts[0];                                                                                     // 75
    var value = decodeURIComponent(parts[1]);                                                               // 76
                                                                                                            // 77
    if (key.slice(-2) === '[]') {                                                                           // 78
      key = key.slice(0, -2);                                                                               // 79
      result[key] = result[key] || [];                                                                      // 80
      result[key].push(value);                                                                              // 81
    } else {                                                                                                // 82
      result[key] = value;                                                                                  // 83
    }                                                                                                       // 84
  });                                                                                                       // 85
                                                                                                            // 86
  return result;                                                                                            // 87
};                                                                                                          // 88
                                                                                                            // 89
/**                                                                                                         // 90
 * Given a query object return a query string.                                                              // 91
 */                                                                                                         // 92
Url.toQueryString = function (queryObject) {                                                                // 93
  var result = [];                                                                                          // 94
                                                                                                            // 95
  if (typeof queryObject === 'string') {                                                                    // 96
    if (queryObject.charAt(0) !== '?')                                                                      // 97
      return '?' + queryObject;                                                                             // 98
    else                                                                                                    // 99
      return queryObject;                                                                                   // 100
  }                                                                                                         // 101
                                                                                                            // 102
  _.each(queryObject, function (value, key) {                                                               // 103
    if (_.isArray(value)) {                                                                                 // 104
      _.each(value, function(valuePart) {                                                                   // 105
        result.push(encodeURIComponent(key + '[]') + '=' + encodeURIComponent(valuePart));                  // 106
      });                                                                                                   // 107
    } else {                                                                                                // 108
      result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));                               // 109
    }                                                                                                       // 110
  });                                                                                                       // 111
                                                                                                            // 112
  // no sense in adding a pointless question mark                                                           // 113
  if (result.length > 0)                                                                                    // 114
    return '?' + result.join('&');                                                                          // 115
  else                                                                                                      // 116
    return '';                                                                                              // 117
};                                                                                                          // 118
                                                                                                            // 119
/**                                                                                                         // 120
 * Given a string url return an object with all of the url parts.                                           // 121
 */                                                                                                         // 122
Url.parse = function (url) {                                                                                // 123
  if (typeof url !== 'string')                                                                              // 124
    return {};                                                                                              // 125
                                                                                                            // 126
  //http://tools.ietf.org/html/rfc3986#page-50                                                              // 127
  //http://www.rfc-editor.org/errata_search.php?rfc=3986                                                    // 128
  var re = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;                                 // 129
                                                                                                            // 130
  var match = url.match(re);                                                                                // 131
                                                                                                            // 132
  var protocol = match[1] ? match[1].toLowerCase() : undefined;                                             // 133
  var hostWithSlashes = match[3];                                                                           // 134
  var slashes = !!hostWithSlashes;                                                                          // 135
  var hostWithAuth= match[4] ? match[4].toLowerCase() : undefined;                                          // 136
  var hostWithAuthParts = hostWithAuth ? hostWithAuth.split('@') : [];                                      // 137
                                                                                                            // 138
  var host, auth;                                                                                           // 139
                                                                                                            // 140
  if (hostWithAuthParts.length == 2) {                                                                      // 141
    auth = hostWithAuthParts[0];                                                                            // 142
    host = hostWithAuthParts[1];                                                                            // 143
  } else if (hostWithAuthParts.length == 1) {                                                               // 144
    host = hostWithAuthParts[0];                                                                            // 145
    auth = undefined;                                                                                       // 146
  } else {                                                                                                  // 147
    host = undefined;                                                                                       // 148
    auth = undefined;                                                                                       // 149
  }                                                                                                         // 150
                                                                                                            // 151
  var hostWithPortParts = (host && host.split(':')) || [];                                                  // 152
  var hostname = hostWithPortParts[0];                                                                      // 153
  var port = hostWithPortParts[1];                                                                          // 154
  var origin = (protocol && host) ? protocol + '//' + host : undefined;                                     // 155
  var pathname = match[5];                                                                                  // 156
  var hash = match[8];                                                                                      // 157
  var originalUrl = url;                                                                                    // 158
                                                                                                            // 159
  var search = match[6];                                                                                    // 160
                                                                                                            // 161
  var query;                                                                                                // 162
  var indexOfSearch = (hash && hash.indexOf('?')) || -1;                                                    // 163
                                                                                                            // 164
  // if we found a search string in the hash and there is no explicit search                                // 165
  // string                                                                                                 // 166
  if (~indexOfSearch && !search) {                                                                          // 167
    search = hash.slice(indexOfSearch);                                                                     // 168
    hash = hash.substr(0, indexOfSearch);                                                                   // 169
    // get rid of the ? character                                                                           // 170
    query = search.slice(1);                                                                                // 171
  } else {                                                                                                  // 172
    query = match[7];                                                                                       // 173
  }                                                                                                         // 174
                                                                                                            // 175
  var path = pathname + (search || '');                                                                     // 176
  var queryObject = Url.fromQueryString(query);                                                             // 177
                                                                                                            // 178
  var rootUrl = [                                                                                           // 179
    protocol || '',                                                                                         // 180
    slashes ? '//' : '',                                                                                    // 181
    hostWithAuth || ''                                                                                      // 182
  ].join('');                                                                                               // 183
                                                                                                            // 184
  var href = [                                                                                              // 185
    protocol || '',                                                                                         // 186
    slashes ? '//' : '',                                                                                    // 187
    hostWithAuth || '',                                                                                     // 188
    pathname || '',                                                                                         // 189
    search || '',                                                                                           // 190
    hash || ''                                                                                              // 191
  ].join('');                                                                                               // 192
                                                                                                            // 193
  return {                                                                                                  // 194
    rootUrl: rootUrl || '',                                                                                 // 195
    originalUrl: url || '',                                                                                 // 196
    href: href || '',                                                                                       // 197
    protocol: protocol || '',                                                                               // 198
    auth: auth || '',                                                                                       // 199
    host: host || '',                                                                                       // 200
    hostname: hostname || '',                                                                               // 201
    port: port || '',                                                                                       // 202
    origin: origin || '',                                                                                   // 203
    path: path || '',                                                                                       // 204
    pathname: pathname || '',                                                                               // 205
    search: search || '',                                                                                   // 206
    query: query || '',                                                                                     // 207
    queryObject: queryObject || '',                                                                         // 208
    hash: hash || '',                                                                                       // 209
    slashes: slashes                                                                                        // 210
  };                                                                                                        // 211
};                                                                                                          // 212
                                                                                                            // 213
/**                                                                                                         // 214
 * Returns true if the path matches and false otherwise.                                                    // 215
 */                                                                                                         // 216
Url.prototype.test = function (path) {                                                                      // 217
  return this.regexp.test(Url.normalize(path));                                                             // 218
};                                                                                                          // 219
                                                                                                            // 220
/**                                                                                                         // 221
 * Returns the result of calling exec on the compiled path with                                             // 222
 * the given path.                                                                                          // 223
 */                                                                                                         // 224
Url.prototype.exec = function (path) {                                                                      // 225
  return this.regexp.exec(Url.normalize(path));                                                             // 226
};                                                                                                          // 227
                                                                                                            // 228
/**                                                                                                         // 229
 * Returns an array of parameters given a path. The array may have named                                    // 230
 * properties in addition to indexed values.                                                                // 231
 */                                                                                                         // 232
Url.prototype.params = function (path) {                                                                    // 233
  if (!path)                                                                                                // 234
    return [];                                                                                              // 235
                                                                                                            // 236
  var params = [];                                                                                          // 237
  var m = this.exec(path);                                                                                  // 238
  var queryString;                                                                                          // 239
  var keys = this.keys;                                                                                     // 240
  var key;                                                                                                  // 241
  var value;                                                                                                // 242
                                                                                                            // 243
  if (!m)                                                                                                   // 244
    throw new Error('The route named "' + this.name + '" does not match the path "' + path + '"');          // 245
                                                                                                            // 246
  for (var i = 1, len = m.length; i < len; ++i) {                                                           // 247
    key = keys[i - 1];                                                                                      // 248
    value = typeof m[i] == 'string' ? decodeURIComponent(m[i]) : m[i];                                      // 249
    if (key) {                                                                                              // 250
      params[key.name] = params[key.name] !== undefined ?                                                   // 251
        params[key.name] : value;                                                                           // 252
    } else                                                                                                  // 253
      params.push(value);                                                                                   // 254
  }                                                                                                         // 255
                                                                                                            // 256
  path = decodeURI(path);                                                                                   // 257
                                                                                                            // 258
  queryString = path.split('?')[1];                                                                         // 259
  if (queryString)                                                                                          // 260
    queryString = queryString.split('#')[0];                                                                // 261
                                                                                                            // 262
  params.hash = path.split('#')[1] || null;                                                                 // 263
  params.query = Url.fromQueryString(queryString);                                                          // 264
                                                                                                            // 265
  return params;                                                                                            // 266
};                                                                                                          // 267
                                                                                                            // 268
Url.prototype.resolve = function (params, options) {                                                        // 269
  var value;                                                                                                // 270
  var isValueDefined;                                                                                       // 271
  var result;                                                                                               // 272
  var wildCardCount = 0;                                                                                    // 273
  var path = this._originalPath;                                                                            // 274
  var hash;                                                                                                 // 275
  var query;                                                                                                // 276
  var missingParams = [];                                                                                   // 277
  var originalParams = params;                                                                              // 278
                                                                                                            // 279
  options = options || {};                                                                                  // 280
  params = params || [];                                                                                    // 281
  query = options.query;                                                                                    // 282
  hash = options.hash && options.hash.toString();                                                           // 283
                                                                                                            // 284
  if (path instanceof RegExp) {                                                                             // 285
    throw new Error('Cannot currently resolve a regular expression path');                                  // 286
  } else {                                                                                                  // 287
    path = path                                                                                             // 288
      .replace(                                                                                             // 289
        /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                             // 290
        function (match, slash, format, key, capture, optional, offset) {                                   // 291
          slash = slash || '';                                                                              // 292
          value = params[key];                                                                              // 293
          isValueDefined = typeof value !== 'undefined';                                                    // 294
                                                                                                            // 295
          if (optional && !isValueDefined) {                                                                // 296
            value = '';                                                                                     // 297
          } else if (!isValueDefined) {                                                                     // 298
            missingParams.push(key);                                                                        // 299
            return;                                                                                         // 300
          }                                                                                                 // 301
                                                                                                            // 302
          value = _.isFunction(value) ? value.call(params) : value;                                         // 303
          var escapedValue = _.map(String(value).split('/'), function (segment) {                           // 304
            return encodeURIComponent(segment);                                                             // 305
          }).join('/');                                                                                     // 306
          return slash + escapedValue                                                                       // 307
        }                                                                                                   // 308
      )                                                                                                     // 309
      .replace(                                                                                             // 310
        /\*/g,                                                                                              // 311
        function (match) {                                                                                  // 312
          if (typeof params[wildCardCount] === 'undefined') {                                               // 313
            throw new Error(                                                                                // 314
              'You are trying to access a wild card parameter at index ' +                                  // 315
              wildCardCount +                                                                               // 316
              ' but the value of params at that index is undefined');                                       // 317
          }                                                                                                 // 318
                                                                                                            // 319
          var paramValue = String(params[wildCardCount++]);                                                 // 320
          return _.map(paramValue.split('/'), function (segment) {                                          // 321
            return encodeURIComponent(segment);                                                             // 322
          }).join('/');                                                                                     // 323
        }                                                                                                   // 324
      );                                                                                                    // 325
                                                                                                            // 326
    query = Url.toQueryString(query);                                                                       // 327
                                                                                                            // 328
    path = path + query;                                                                                    // 329
                                                                                                            // 330
    if (hash) {                                                                                             // 331
      hash = encodeURI(hash.replace('#', ''));                                                              // 332
      path = query ?                                                                                        // 333
        path + '#' + hash : path + '/#' + hash;                                                             // 334
    }                                                                                                       // 335
  }                                                                                                         // 336
                                                                                                            // 337
  // Because of optional possibly empty segments we normalize path here                                     // 338
  path = path.replace(/\/+/g, '/'); // Multiple / -> one /                                                  // 339
  path = path.replace(/^(.+)\/$/g, '$1'); // Removal of trailing /                                          // 340
                                                                                                            // 341
  if (missingParams.length == 0)                                                                            // 342
    return path;                                                                                            // 343
  else if (options.throwOnMissingParams === true)                                                           // 344
    throw new Error("Missing required parameters on path " + JSON.stringify(this._originalPath) + ". The missing params are: " + JSON.stringify(missingParams) + ". The params object passed in was: " + JSON.stringify(originalParams) + ".");
  else                                                                                                      // 346
    return null;                                                                                            // 347
};                                                                                                          // 348
                                                                                                            // 349
/*****************************************************************************/                             // 350
/* Namespacing */                                                                                           // 351
/*****************************************************************************/                             // 352
Iron.Url = Url;                                                                                             // 353
                                                                                                            // 354
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:url'] = {};

})();
