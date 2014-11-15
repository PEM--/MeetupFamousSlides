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
var Handler, MiddlewareStack, Iron;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/iron:middleware-stack/lib/handler.js                                                       //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var Url = Iron.Url;                                                                                    // 1
                                                                                                       // 2
Handler = function (path, fn, options) {                                                               // 3
  if (_.isFunction(path)) {                                                                            // 4
    options = options || fn || {};                                                                     // 5
    fn = path;                                                                                         // 6
    path = '/';                                                                                        // 7
                                                                                                       // 8
    // probably need a better approach here to differentiate between                                   // 9
    // Router.use(function () {}) and Router.use(MyAdminApp). In the first                             // 10
    // case we don't want to count it as a viable server handler when we're                            // 11
    // on the client and need to decide whether to go to the server. in the                            // 12
    // latter case, we DO want to go to the server, potentially.                                       // 13
    this.middleware = true;                                                                            // 14
                                                                                                       // 15
    if (typeof options.mount === 'undefined')                                                          // 16
      options.mount = true;                                                                            // 17
  }                                                                                                    // 18
                                                                                                       // 19
  // if fn is a function then typeof fn => 'function'                                                  // 20
  // but note we can't use _.isObject here because that will return true if the                        // 21
  // fn is a function OR an object.                                                                    // 22
  if (typeof fn === 'object') {                                                                        // 23
    options = fn;                                                                                      // 24
    fn = options.action || 'action';                                                                   // 25
  }                                                                                                    // 26
                                                                                                       // 27
  options = options || {};                                                                             // 28
                                                                                                       // 29
  this.options = options;                                                                              // 30
  this.mount = options.mount;                                                                          // 31
  this.method = (options.method && options.method.toLowerCase()) || false;                             // 32
                                                                                                       // 33
  // should the handler be on the 'client', 'server' or 'both'?                                        // 34
  this.where = options.where || 'client';                                                              // 35
                                                                                                       // 36
  // if we're mounting at path '/foo' then this handler should also handle                             // 37
  // '/foo/bar' and '/foo/bar/baz'                                                                     // 38
  if (this.mount)                                                                                      // 39
    options.end = false;                                                                               // 40
                                                                                                       // 41
  // set the name                                                                                      // 42
  if (options.name)                                                                                    // 43
    this.name = options.name;                                                                          // 44
  else if (typeof path === 'string' && path.charAt(0) !== '/')                                         // 45
    this.name = path;                                                                                  // 46
  else if (fn && fn.name)                                                                              // 47
    this.name = fn.name;                                                                               // 48
  else if (typeof path === 'string' && path !== '/')                                                   // 49
    this.name = path.split('/').slice(1).join('.');                                                    // 50
                                                                                                       // 51
  // if the path is explicitly set on the options (e.g. legacy router support)                         // 52
  // then use that                                                                                     // 53
  // otherwise use the path argument which could also be a name                                        // 54
  path = options.path || path;                                                                         // 55
                                                                                                       // 56
  if (typeof path === 'string' && path.charAt(0) !== '/')                                              // 57
    path = '/' + path;                                                                                 // 58
                                                                                                       // 59
  this.path = path;                                                                                    // 60
  this.compiledUrl = new Url(path, options);                                                           // 61
                                                                                                       // 62
  if (_.isString(fn)) {                                                                                // 63
    this.handle = function handle () {                                                                 // 64
      // try to find a method on the current thisArg which might be a Controller                       // 65
      // for example.                                                                                  // 66
      var func = this[fn];                                                                             // 67
                                                                                                       // 68
      if (typeof func !== 'function')                                                                  // 69
        throw new Error("No method named " + JSON.stringify(fn) + " found on handler.");               // 70
                                                                                                       // 71
      return func.apply(this, arguments);                                                              // 72
    };                                                                                                 // 73
  } else if (_.isFunction(fn)) {                                                                       // 74
    // or just a regular old function                                                                  // 75
    this.handle = fn;                                                                                  // 76
  }                                                                                                    // 77
};                                                                                                     // 78
                                                                                                       // 79
Handler.prototype.test = function (path, options) {                                                    // 80
  if (this.method && options && options.method) {                                                      // 81
    // if the handler has a method option defined, and this is a method request,                       // 82
    // test whether this handler should respond to the given method                                    // 83
    return this.method == options.method.toLowerCase() && this.compiledUrl.test(path);                 // 84
  } else                                                                                               // 85
    // if a route or handler doesn't have a method specified, then it will                             // 86
    // handle ALL methods                                                                              // 87
    return this.compiledUrl.test(path);                                                                // 88
};                                                                                                     // 89
                                                                                                       // 90
Handler.prototype.params = function (path) {                                                           // 91
  return this.compiledUrl.params(path);                                                                // 92
};                                                                                                     // 93
                                                                                                       // 94
Handler.prototype.resolve = function (params, options) {                                               // 95
  return this.compiledUrl.resolve(params, options);                                                    // 96
};                                                                                                     // 97
                                                                                                       // 98
/**                                                                                                    // 99
 * Returns a new cloned Handler.                                                                       // 100
 * XXX problem is here because we're not storing the original path.                                    // 101
 */                                                                                                    // 102
Handler.prototype.clone = function () {                                                                // 103
  var clone = new Handler(this.path, this.handle, this.options);                                       // 104
  // in case the original function had a name                                                          // 105
  clone.name = this.name;                                                                              // 106
  return clone;                                                                                        // 107
};                                                                                                     // 108
                                                                                                       // 109
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/iron:middleware-stack/lib/middleware_stack.js                                              //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var Url = Iron.Url;                                                                                    // 1
var assert = Iron.utils.assert;                                                                        // 2
var defaultValue = Iron.utils.defaultValue;                                                            // 3
                                                                                                       // 4
/**                                                                                                    // 5
 * Connect inspired middleware stack that works on the client and the server.                          // 6
 *                                                                                                     // 7
 * You can add handlers to the stack for various paths. Those handlers can run                         // 8
 * on the client or server. Then you can dispatch into the stack with a                                // 9
 * given path by calling the dispatch method. This goes down the stack looking                         // 10
 * for matching handlers given the url and environment (client/server). If we're                       // 11
 * on the client and we should make a trip to the server, the onServerDispatch                         // 12
 * callback is called.                                                                                 // 13
 *                                                                                                     // 14
 * The middleware stack supports the Connect API. But it also allows you to                            // 15
 * specify a context so we can have one context object (like a Controller) that                        // 16
 * is a consistent context for each handler function called on a dispatch.                             // 17
 *                                                                                                     // 18
 */                                                                                                    // 19
MiddlewareStack = function () {                                                                        // 20
  this._stack = [];                                                                                    // 21
};                                                                                                     // 22
                                                                                                       // 23
MiddlewareStack.prototype._create = function (path, fn, options) {                                     // 24
  var handler = new Handler(path, fn, options);                                                        // 25
  var name = handler.name;                                                                             // 26
                                                                                                       // 27
  if (name) {                                                                                          // 28
    if (_.has(this._stack, name)) {                                                                    // 29
      throw new Error("Handler with name '" + name + "' already exists.");                             // 30
    }                                                                                                  // 31
    this._stack[name] = handler;                                                                       // 32
  }                                                                                                    // 33
                                                                                                       // 34
  return handler;                                                                                      // 35
};                                                                                                     // 36
                                                                                                       // 37
MiddlewareStack.prototype.findByName = function (name) {                                               // 38
  return this._stack[name];                                                                            // 39
};                                                                                                     // 40
                                                                                                       // 41
/**                                                                                                    // 42
 * Push a new handler onto the stack.                                                                  // 43
 */                                                                                                    // 44
MiddlewareStack.prototype.push = function (path, fn, options) {                                        // 45
  var handler = this._create(path, fn, options);                                                       // 46
  this._stack.push(handler);                                                                           // 47
  return handler;                                                                                      // 48
};                                                                                                     // 49
                                                                                                       // 50
MiddlewareStack.prototype.append = function (/* fn1, fn2, [f3, f4]... */) {                            // 51
  var self = this;                                                                                     // 52
  var args = _.toArray(arguments);                                                                     // 53
  var options = {};                                                                                    // 54
                                                                                                       // 55
  if (typeof args[args.length-1] === 'object')                                                         // 56
    options = args.pop();                                                                              // 57
                                                                                                       // 58
  args.forEach(function (fnOrArray) {                                                                  // 59
    if (typeof fnOrArray === 'undefined')                                                              // 60
      return;                                                                                          // 61
    else if (typeof fnOrArray === 'function')                                                          // 62
      self.push(fnOrArray, options);                                                                   // 63
    else if (_.isArray(fnOrArray))                                                                     // 64
      self.append.apply(self, fnOrArray.concat([options]));                                            // 65
    else                                                                                               // 66
      throw new Error("Can only append functions or arrays to the MiddlewareStack");                   // 67
  });                                                                                                  // 68
                                                                                                       // 69
  return this;                                                                                         // 70
};                                                                                                     // 71
                                                                                                       // 72
/**                                                                                                    // 73
 * Insert a handler at a specific index in the stack.                                                  // 74
 *                                                                                                     // 75
 * The index behavior is the same as Array.prototype.splice. If the index is                           // 76
 * greater than the stack length the handler will be appended at the end of the                        // 77
 * stack. If the index is negative, the item will be inserted "index" elements                         // 78
 * from the end.                                                                                       // 79
 */                                                                                                    // 80
MiddlewareStack.prototype.insertAt = function (index, path, fn, options) {                             // 81
  var handler = this._create(path, fn, options);                                                       // 82
  this._stack.splice(index, 0, handler);                                                               // 83
  return this;                                                                                         // 84
};                                                                                                     // 85
                                                                                                       // 86
/**                                                                                                    // 87
 * Insert a handler before another named handler.                                                      // 88
 */                                                                                                    // 89
MiddlewareStack.prototype.insertBefore = function (name, path, fn, options) {                          // 90
  var beforeHandler;                                                                                   // 91
  var index;                                                                                           // 92
                                                                                                       // 93
  if (!(beforeHandler = this._stack[name]))                                                            // 94
    throw new Error("Couldn't find a handler named '" + name + "' on the path stack");                 // 95
                                                                                                       // 96
  index = _.indexOf(this._stack, beforeHandler);                                                       // 97
  this.insertAt(index, path, fn, options);                                                             // 98
  return this;                                                                                         // 99
};                                                                                                     // 100
                                                                                                       // 101
/**                                                                                                    // 102
 * Insert a handler after another named handler.                                                       // 103
 *                                                                                                     // 104
 */                                                                                                    // 105
MiddlewareStack.prototype.insertAfter = function (name, path, fn, options) {                           // 106
  var handler;                                                                                         // 107
  var index;                                                                                           // 108
                                                                                                       // 109
  if (!(handler = this._stack[name]))                                                                  // 110
    throw new Error("Couldn't find a handler named '" + name + "' on the path stack");                 // 111
                                                                                                       // 112
  index = _.indexOf(this._stack, handler);                                                             // 113
  this.insertAt(index + 1, path, fn, options);                                                         // 114
  return this;                                                                                         // 115
};                                                                                                     // 116
                                                                                                       // 117
/**                                                                                                    // 118
 * Return a new MiddlewareStack comprised of this stack joined with other                              // 119
 * stacks. Note the new stack will not have named handlers anymore. Only the                           // 120
 * handlers are cloned but not the name=>handler mapping.                                              // 121
 */                                                                                                    // 122
MiddlewareStack.prototype.concat = function (/* stack1, stack2, */) {                                  // 123
  var ret = new MiddlewareStack;                                                                       // 124
  var concat = Array.prototype.concat;                                                                 // 125
  var clonedThisStack = EJSON.clone(this._stack);                                                      // 126
  var clonedOtherStacks = _.map(_.toArray(arguments), function (s) { return EJSON.clone(s._stack); }); // 127
  ret._stack = concat.apply(clonedThisStack, clonedOtherStacks);                                       // 128
  return ret;                                                                                          // 129
};                                                                                                     // 130
                                                                                                       // 131
/**                                                                                                    // 132
 * Dispatch into the middleware stack, allowing the handlers to control the                            // 133
 * iteration by calling this.next();                                                                   // 134
 */                                                                                                    // 135
MiddlewareStack.prototype.dispatch = function dispatch (url, context, done) {                          // 136
  var self = this;                                                                                     // 137
  var originalUrl = url;                                                                               // 138
                                                                                                       // 139
  assert(typeof url === 'string', "Requires url");                                                     // 140
  assert(typeof context === 'object', "Requires context object");                                      // 141
                                                                                                       // 142
  url = Url.normalize(url || '/');                                                                     // 143
                                                                                                       // 144
  defaultValue(context, 'request', {});                                                                // 145
  defaultValue(context, 'response', {});                                                               // 146
  defaultValue(context, 'originalUrl', url);                                                           // 147
                                                                                                       // 148
  //defaultValue(context, 'location', Url.parse(originalUrl));                                         // 149
  defaultValue(context, '_method', context.method);                                                    // 150
  defaultValue(context, '_handlersForEnv', {client: false, server: false});                            // 151
  defaultValue(context, '_handled', false);                                                            // 152
                                                                                                       // 153
  defaultValue(context, 'isHandled', function () {                                                     // 154
    return context._handled;                                                                           // 155
  });                                                                                                  // 156
                                                                                                       // 157
  defaultValue(context, 'willBeHandledOnClient', function () {                                         // 158
    return context._handlersForEnv.client;                                                             // 159
  });                                                                                                  // 160
                                                                                                       // 161
  defaultValue(context, 'willBeHandledOnServer', function () {                                         // 162
    return context._handlersForEnv.server;                                                             // 163
  });                                                                                                  // 164
                                                                                                       // 165
  var wrappedDone = function () {                                                                      // 166
    if (done) {                                                                                        // 167
      try {                                                                                            // 168
        done.apply(this, arguments);                                                                   // 169
      } catch (err) {                                                                                  // 170
        // if we catch an error at this point in the stack we don't want it                            // 171
        // handled in the next() iterator below. So we'll mark the error to tell                       // 172
        // the next iterator to ignore it.                                                             // 173
        err._punt = true;                                                                              // 174
                                                                                                       // 175
        // now rethrow it!                                                                             // 176
        throw err;                                                                                     // 177
      }                                                                                                // 178
    }                                                                                                  // 179
  };                                                                                                   // 180
                                                                                                       // 181
  var index = 0;                                                                                       // 182
                                                                                                       // 183
  //XXX make this not an anonymous function or hard to read in the debugger                            // 184
  var next = Meteor.bindEnvironment(function boundNext (err) {                                         // 185
    var handler = self._stack[index++];                                                                // 186
                                                                                                       // 187
    // reset the url                                                                                   // 188
    context.url = context.request.url = context.originalUrl;                                           // 189
                                                                                                       // 190
    if (!handler)                                                                                      // 191
      return wrappedDone.call(context, err);                                                           // 192
                                                                                                       // 193
    if (!handler.test(url, {method: context._method}))                                                 // 194
      return next(err);                                                                                // 195
                                                                                                       // 196
    // okay if we've gotten this far the handler matches our url but we still                          // 197
    // don't know if this is a client or server handler. Let's track that.                             // 198
    var where = Meteor.isClient ? 'client' : 'server';                                                 // 199
                                                                                                       // 200
    // track that we have a handler for the given environment so long as it's                          // 201
    // not middleware created like this Router.use(function () {}). We'll assume                       // 202
    // that if the handler is of that form we don't want to make a trip to                             // 203
    // the client or the server for it.                                                                // 204
    if (!handler.middleware)                                                                           // 205
      context._handlersForEnv[handler.where] = true;                                                   // 206
                                                                                                       // 207
    // but if we're not actually on that env, skip to the next handler.                                // 208
    if (handler.where !== where)                                                                       // 209
      return next(err);                                                                                // 210
                                                                                                       // 211
    // get the parameters for this url from the handler's compiled path                                // 212
    // XXX removing for now                                                                            // 213
    //var params = handler.params(context.location.href);                                              // 214
    //context.request.params = defaultValue(context, 'params', {});                                    // 215
    //_.extend(context.params, params);                                                                // 216
                                                                                                       // 217
    // so we can call this.next()                                                                      // 218
    context.next = next;                                                                               // 219
                                                                                                       // 220
    if (handler.mount) {                                                                               // 221
      var mountpath = Url.normalize(handler.compiledUrl.pathname);                                     // 222
      var newUrl = url.substr(mountpath.length, url.length);                                           // 223
      newUrl = Url.normalize(newUrl);                                                                  // 224
      context.url = context.request.url = newUrl;                                                      // 225
    }                                                                                                  // 226
                                                                                                       // 227
    try {                                                                                              // 228
      //                                                                                               // 229
      // The connect api says a handler signature (arity) can look like any of:                        // 230
      //                                                                                               // 231
      // 1) function (req, res, next)                                                                  // 232
      // 2) function (err, req, res, next)                                                             // 233
      // 3) function (err)                                                                             // 234
      var arity = handler.handle.length                                                                // 235
      var req = context.request;                                                                       // 236
      var res = context.response;                                                                      // 237
                                                                                                       // 238
      // function (err, req, res, next)                                                                // 239
      if (err && arity === 4)                                                                          // 240
        return handler.handle.call(context, err, req, res, next);                                      // 241
                                                                                                       // 242
      // function (req, res, next)                                                                     // 243
      if (!err && arity < 4)                                                                           // 244
        return handler.handle.call(context, req, res, next);                                           // 245
                                                                                                       // 246
      // default is function (err) so punt the error down the stack                                    // 247
      // until we either find a handler who likes to deal with errors or we call                       // 248
      // out                                                                                           // 249
      return next(err);                                                                                // 250
    } catch (err) {                                                                                    // 251
      if (err._punt)                                                                                   // 252
        // ignore this error and throw it down the stack                                               // 253
        throw err;                                                                                     // 254
      else                                                                                             // 255
        // see if the next handler wants to deal with the error                                        // 256
        next(err);                                                                                     // 257
    } finally {                                                                                        // 258
      // we'll put this at the end because some middleware                                             // 259
      // might want to decide what to do based on whether we've                                        // 260
      // been handled "yet". If we set this to true before the handler                                 // 261
      // is called, there's no way for the handler to say, if we haven't been                          // 262
      // handled yet go to the server, for example.                                                    // 263
      context._handled = true;                                                                         // 264
      context.next = null;                                                                             // 265
    }                                                                                                  // 266
  });                                                                                                  // 267
                                                                                                       // 268
  next();                                                                                              // 269
                                                                                                       // 270
  context.next = null;                                                                                 // 271
  return context;                                                                                      // 272
};                                                                                                     // 273
                                                                                                       // 274
/**                                                                                                    // 275
 * The number of handlers on the stack.                                                                // 276
 *                                                                                                     // 277
 */                                                                                                    // 278
Object.defineProperty(MiddlewareStack.prototype, "length", {                                           // 279
  get: function () {                                                                                   // 280
    return this._stack.length;                                                                         // 281
  },                                                                                                   // 282
                                                                                                       // 283
  writeable: false,                                                                                    // 284
  configurable: false,                                                                                 // 285
  enumerable: true                                                                                     // 286
});                                                                                                    // 287
                                                                                                       // 288
Iron = Iron || {};                                                                                     // 289
Iron.MiddlewareStack = MiddlewareStack;                                                                // 290
                                                                                                       // 291
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:middleware-stack'] = {
  Handler: Handler
};

})();
