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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var urlToHashStyle, urlFromHashStyle, fixHashPath, State, Location;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/iron:location/lib/utils.js                                                 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var Url = Iron.Url;                                                                    // 1
var HASH_PARAM_NAME='__hash__';                                                        // 2
                                                                                       // 3
/**                                                                                    // 4
 * Given:                                                                              // 5
 *   http://host:port/some/pathname/?query=string#bar                                  // 6
 *                                                                                     // 7
 * Return:                                                                             // 8
 *   http://host:port/?query=string&hash=bar/#/some/pathname                           // 9
 */                                                                                    // 10
urlToHashStyle = function (url) {                                                      // 11
  var parts = Url.parse(url);                                                          // 12
  var hash = parts.hash && parts.hash.replace('#', '');                                // 13
  var search = parts.search;                                                           // 14
  var pathname = parts.pathname;                                                       // 15
  var root = parts.rootUrl;                                                            // 16
                                                                                       // 17
  // do we have another hash value that isn't a path?                                  // 18
  if (hash && hash.charAt(0) !== '/') {                                                // 19
    var hashQueryString = HASH_PARAM_NAME + '=' + hash;                                // 20
    search = search ? (search + '&') : '?';                                            // 21
    search += hashQueryString;                                                         // 22
  }                                                                                    // 23
                                                                                       // 24
  // if we don't already have a path on the hash create one                            // 25
  if (!hash || hash.charAt(0) !== '/') {                                               // 26
    hash = pathname ? '#' + pathname : '';                                             // 27
  } else if (hash) {                                                                   // 28
    hash = '#' + hash;                                                                 // 29
  }                                                                                    // 30
                                                                                       // 31
  return [                                                                             // 32
    root,                                                                              // 33
    hash,                                                                              // 34
    search                                                                             // 35
  ].join('');                                                                          // 36
};                                                                                     // 37
                                                                                       // 38
/**                                                                                    // 39
 * Given a url that uses the hash style (see above), return a new url that uses        // 40
 * the hash path as a normal pathname.                                                 // 41
 *                                                                                     // 42
 * Given:                                                                              // 43
 *   http://host:port/?query=string&hash=bar/#/some/pathname                           // 44
 *                                                                                     // 45
 * Return:                                                                             // 46
 *   http://host:port/some/pathname?query=string#bar                                   // 47
 */                                                                                    // 48
urlFromHashStyle = function (url) {                                                    // 49
  var parts = Url.parse(url);                                                          // 50
  var pathname = parts.hash && parts.hash.replace('#', '');                            // 51
  var search = parts.search;                                                           // 52
  var root = parts.rootUrl;                                                            // 53
  var hash;                                                                            // 54
                                                                                       // 55
  // see if there's a hash=value in the query string in which case put it back         // 56
  // in the normal hash position and delete it from the search string.                 // 57
  if (_.has(parts.queryObject, HASH_PARAM_NAME)) {                                     // 58
    hash = '#' + parts.queryObject[HASH_PARAM_NAME];                                   // 59
    delete parts.queryObject[HASH_PARAM_NAME];                                         // 60
  } else {                                                                             // 61
    hash = '';                                                                         // 62
  }                                                                                    // 63
                                                                                       // 64
  return [                                                                             // 65
    root,                                                                              // 66
    pathname,                                                                          // 67
    Url.toQueryString(parts.queryObject),                                              // 68
    hash                                                                               // 69
  ].join('');                                                                          // 70
};                                                                                     // 71
                                                                                       // 72
/**                                                                                    // 73
 * Fix up a pathname intended for use with a hash path by moving any hash              // 74
 * fragments into the query string.                                                    // 75
 */                                                                                    // 76
fixHashPath = function (pathname) {                                                    // 77
  var parts = Url.parse(pathname);                                                     // 78
  var query = parts.queryObject;                                                       // 79
                                                                                       // 80
  // if there's a hash in the path move that to the query string                       // 81
  if (parts.hash) {                                                                    // 82
    query.hash = parts.hash.replace('#', '')                                           // 83
  }                                                                                    // 84
                                                                                       // 85
  return [                                                                             // 86
    parts.pathname,                                                                    // 87
    Url.toQueryString(query)                                                           // 88
  ].join('');                                                                          // 89
};                                                                                     // 90
                                                                                       // 91
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/iron:location/lib/state.js                                                 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var Url = Iron.Url;                                                                    // 1
                                                                                       // 2
State = function (url, options) {                                                      // 3
  _.extend(this, Url.parse(url), {options: options || {}});                            // 4
};                                                                                     // 5
                                                                                       // 6
// XXX: should this compare options (e.g. history.state?)                              // 7
State.prototype.equals = function (other) {                                            // 8
  if (!other)                                                                          // 9
    return false;                                                                      // 10
                                                                                       // 11
  if (!(other instanceof State))                                                       // 12
    return false;                                                                      // 13
                                                                                       // 14
  if (other.pathname == this.pathname &&                                               // 15
     other.search == this.search &&                                                    // 16
     other.hash == this.hash &&                                                        // 17
     other.options.historyState === this.options.historyState)                         // 18
    return true;                                                                       // 19
                                                                                       // 20
  return false;                                                                        // 21
};                                                                                     // 22
                                                                                       // 23
State.prototype.isCancelled = function () {                                            // 24
  return !!this._isCancelled;                                                          // 25
};                                                                                     // 26
                                                                                       // 27
State.prototype.cancelUrlChange = function () {                                        // 28
  this._isCancelled = true;                                                            // 29
};                                                                                     // 30
                                                                                       // 31
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/iron:location/lib/location.js                                              //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
/*****************************************************************************/        // 1
/* Imports */                                                                          // 2
/*****************************************************************************/        // 3
var Url = Iron.Url;                                                                    // 4
                                                                                       // 5
/*****************************************************************************/        // 6
/* Private */                                                                          // 7
/*****************************************************************************/        // 8
var current = null;                                                                    // 9
var dep = new Deps.Dependency;                                                         // 10
var handlers = {go: [], popState: []};                                                 // 11
                                                                                       // 12
var isIE9 = function () {                                                              // 13
  return /MSIE 9/.test(navigator.appVersion);                                          // 14
};                                                                                     // 15
                                                                                       // 16
var isIE8 = function () {                                                              // 17
  return /MSIE 8/.test(navigator.appVersion);                                          // 18
};                                                                                     // 19
                                                                                       // 20
var usingAppcache = function() {                                                       // 21
  return !! Package.appcache;                                                          // 22
}                                                                                      // 23
                                                                                       // 24
var shouldUseHashPaths = function () {                                                 // 25
  return Location.options.useHashPaths || isIE8() || isIE9() || usingAppcache();       // 26
};                                                                                     // 27
                                                                                       // 28
var isUsingHashPaths = function () {                                                   // 29
  return !!Location.options.useHashPaths;                                              // 30
};                                                                                     // 31
                                                                                       // 32
var runHandlers = function(name, state) {                                              // 33
  _.each(handlers[name], function(cb) {                                                // 34
    cb.call(state);                                                                    // 35
  });                                                                                  // 36
}                                                                                      // 37
                                                                                       // 38
var set = function (state) {                                                           // 39
  if (!(state instanceof State))                                                       // 40
    throw new Error("Expected a State instance");                                      // 41
                                                                                       // 42
  if (!state.equals(current)) {                                                        // 43
    current = state;                                                                   // 44
    dep.changed();                                                                     // 45
                                                                                       // 46
    // return true to indicate state was set to a new value.                           // 47
    return true;                                                                       // 48
  }                                                                                    // 49
                                                                                       // 50
  // state not set                                                                     // 51
  return false;                                                                        // 52
};                                                                                     // 53
                                                                                       // 54
var setStateFromEventHandler = function () {                                           // 55
  var href = location.href;                                                            // 56
  var state;                                                                           // 57
                                                                                       // 58
  if (isUsingHashPaths()) {                                                            // 59
    state = new State(urlFromHashStyle(href));                                         // 60
  } else {                                                                             // 61
    state = new State(href, {historyState: history.state});                            // 62
  }                                                                                    // 63
                                                                                       // 64
  runHandlers('popState', state);                                                      // 65
  set(state);                                                                          // 66
};                                                                                     // 67
                                                                                       // 68
var fireOnClick = function (e) {                                                       // 69
  var handler = onClickHandler;                                                        // 70
  handler && handler(e);                                                               // 71
};                                                                                     // 72
                                                                                       // 73
/**                                                                                    // 74
 * Go to a url.                                                                        // 75
 */                                                                                    // 76
var go = function (url, options) {                                                     // 77
  options = options || {};                                                             // 78
                                                                                       // 79
  var state = new State(url, options);                                                 // 80
                                                                                       // 81
  runHandlers('go', state);                                                            // 82
                                                                                       // 83
  if (set(state)) {                                                                    // 84
    Deps.afterFlush(function () {                                                      // 85
      // if after we've flushed if nobody has cancelled the state then change          // 86
      // the url.                                                                      // 87
      if (!state.isCancelled()) {                                                      // 88
        if (isUsingHashPaths()) {                                                      // 89
          location.hash = fixHashPath(url);                                            // 90
        } else {                                                                       // 91
          if (options.replaceState === true)                                           // 92
            history.replaceState(options.historyState, null, url);                     // 93
          else                                                                         // 94
            history.pushState(options.historyState, null, url);                        // 95
        }                                                                              // 96
      }                                                                                // 97
    });                                                                                // 98
  }                                                                                    // 99
};                                                                                     // 100
                                                                                       // 101
var onClickHandler = function (e) {                                                    // 102
  try {                                                                                // 103
    var el = e.currentTarget;                                                          // 104
    var href = el.href;                                                                // 105
    var path = el.pathname + el.search + el.hash;                                      // 106
                                                                                       // 107
    // ie9 omits the leading slash in pathname - so patch up if it's missing           // 108
    path = path.replace(/(^\/?)/,"/");                                                 // 109
                                                                                       // 110
    // haven't been cancelled already                                                  // 111
    if (e.isDefaultPrevented()) {                                                      // 112
      console.log('default prevented!');                                               // 113
      e.preventDefault();                                                              // 114
      return;                                                                          // 115
    }                                                                                  // 116
                                                                                       // 117
    // with no meta key pressed                                                        // 118
    if (e.metaKey || e.ctrlKey || e.shiftKey)                                          // 119
      return;                                                                          // 120
                                                                                       // 121
    // aren't targeting a new window                                                   // 122
    if (el.target)                                                                     // 123
      return;                                                                          // 124
                                                                                       // 125
    // aren't external to the app                                                      // 126
    if (!Url.isSameOrigin(href, location.href))                                        // 127
      return;                                                                          // 128
                                                                                       // 129
    // note that we _do_ handle links which point to the current URL                   // 130
    // and links which only change the hash.                                           // 131
    e.preventDefault();                                                                // 132
                                                                                       // 133
    // manage setting the new state and maybe pushing onto the pushState stack         // 134
    go(path);                                                                          // 135
  } catch (err) {                                                                      // 136
    // make sure we can see any errors that are thrown before going to the             // 137
    // server.                                                                         // 138
    e.preventDefault();                                                                // 139
    throw err;                                                                         // 140
  }                                                                                    // 141
};                                                                                     // 142
                                                                                       // 143
/*****************************************************************************/        // 144
/* Location API */                                                                     // 145
/*****************************************************************************/        // 146
                                                                                       // 147
/**                                                                                    // 148
 * Main Location object. Reactively respond to url changes. Normalized urls            // 149
 * between hash style (ie8/9) and normal style using pushState.                        // 150
 */                                                                                    // 151
Location = {};                                                                         // 152
                                                                                       // 153
/**                                                                                    // 154
 * Default options.                                                                    // 155
 */                                                                                    // 156
Location.options = {                                                                   // 157
  linkSelector: 'a[href]',                                                             // 158
  useHashPaths: false                                                                  // 159
};                                                                                     // 160
                                                                                       // 161
/**                                                                                    // 162
 * Set options on the Location object.                                                 // 163
 */                                                                                    // 164
Location.configure = function (options) {                                              // 165
  _.extend(this.options, options || {});                                               // 166
};                                                                                     // 167
                                                                                       // 168
/**                                                                                    // 169
 * Reactively get the current state.                                                   // 170
 */                                                                                    // 171
Location.get = function () {                                                           // 172
  dep.depend();                                                                        // 173
  return current;                                                                      // 174
};                                                                                     // 175
                                                                                       // 176
/**                                                                                    // 177
 * Set the initial state and start listening for url events.                           // 178
 */                                                                                    // 179
Location.start = function () {                                                         // 180
  if (this._isStarted)                                                                 // 181
    return;                                                                            // 182
                                                                                       // 183
  // if we're using the /#/items/5 style then start off at the root url but            // 184
  // store away the pathname, query and hash into the hash fragment so when the        // 185
  // client gets the response we can render the correct page.                          // 186
  if (shouldUseHashPaths()) {                                                          // 187
    // if we have any pathname like /items/5 take a trip to the server to get us       // 188
    // back a root url.                                                                // 189
    var parts = Url.parse(location.href);                                              // 190
                                                                                       // 191
    if (parts.pathname.length > 1) {                                                   // 192
      var url = urlToHashStyle(location.href);                                         // 193
      window.location = url;                                                           // 194
    }                                                                                  // 195
                                                                                       // 196
    // ok good to go                                                                   // 197
    this.configure({useHashPaths: true});                                              // 198
  }                                                                                    // 199
                                                                                       // 200
  // set initial state                                                                 // 201
  var href = location.href;                                                            // 202
                                                                                       // 203
  if (isUsingHashPaths()) {                                                            // 204
    var state = new State(urlFromHashStyle(href));                                     // 205
    set(state);                                                                        // 206
  } else {                                                                             // 207
    var state = new State(href);                                                       // 208
    // store the fact that this is the first route we hit.                             // 209
    // this serves two purposes                                                        // 210
    //   1. We can tell when we've reached an unhandled route and need to show a       // 211
    //      404 (rather than bailing out to let the server handle it)                  // 212
    //   2. Users can look at the state to tell if the history.back() will stay        // 213
    //      inside the app (this is important for mobile apps).                        // 214
    history.replaceState({initial: true}, null, href);                                 // 215
    set(state);                                                                        // 216
  }                                                                                    // 217
                                                                                       // 218
  // bind the event handlers                                                           // 219
  $(window).on('popstate.iron-location', setStateFromEventHandler);                    // 220
  $(window).on('hashchange.iron-location', setStateFromEventHandler);                  // 221
                                                                                       // 222
  // make sure we have a document before binding the click handler                     // 223
  Meteor.startup(function () {                                                         // 224
    $(document).on('click.iron-location', Location.options.linkSelector, fireOnClick); // 225
  });                                                                                  // 226
};                                                                                     // 227
                                                                                       // 228
/**                                                                                    // 229
 * Stop the Location from listening for url changes.                                   // 230
 */                                                                                    // 231
Location.stop = function () {                                                          // 232
  if (!this._isStarted)                                                                // 233
    return;                                                                            // 234
                                                                                       // 235
  $(window).on('popstate.iron-location');                                              // 236
  $(window).on('hashchange.iron-location');                                            // 237
  $(document).off('click.iron-location');                                              // 238
                                                                                       // 239
  this._isStarted = false;                                                             // 240
};                                                                                     // 241
                                                                                       // 242
/**                                                                                    // 243
 * Assign a different click handler.                                                   // 244
 */                                                                                    // 245
Location.onClick = function (fn) {                                                     // 246
  onClickHandler = fn;                                                                 // 247
};                                                                                     // 248
                                                                                       // 249
/**                                                                                    // 250
 * Go to a new url.                                                                    // 251
 */                                                                                    // 252
Location.go = function (url, options) {                                                // 253
  return go(url, options);                                                             // 254
};                                                                                     // 255
                                                                                       // 256
/**                                                                                    // 257
 * Run the supplied callback whenever we "go" to a new location.                       // 258
 *                                                                                     // 259
 * Argument: cb - function, called with no arguments,                                  // 260
 * `this` is the state that's being set, _may_ be modified.                            // 261
 */                                                                                    // 262
Location.onGo = function (cb) {                                                        // 263
  handlers.go.push(cb);                                                                // 264
};                                                                                     // 265
                                                                                       // 266
/**                                                                                    // 267
 * Run the supplied callback whenever we "popState" to an old location.                // 268
 *                                                                                     // 269
 * Argument: cb - function, called with no arguments,                                  // 270
 * `this` is the state that's being set, _may_ be modified.                            // 271
 */                                                                                    // 272
Location.onPopState = function (cb) {                                                  // 273
  handlers.popState.push(cb);                                                          // 274
};                                                                                     // 275
                                                                                       // 276
/**                                                                                    // 277
 * Automatically start Iron.Location                                                   // 278
 */                                                                                    // 279
Location.start();                                                                      // 280
                                                                                       // 281
/*****************************************************************************/        // 282
/* Namespacing */                                                                      // 283
/*****************************************************************************/        // 284
Iron.Location = Location;                                                              // 285
                                                                                       // 286
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:location'] = {
  urlToHashStyle: urlToHashStyle,
  urlFromHashStyle: urlFromHashStyle
};

})();
