(function () {

/* Imports */
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var EJSON = Package.ejson.EJSON;
var Meteor = Package.meteor.Meteor;
var Iron = Package['iron:core'].Iron;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Router, RouteController, CurrentOptions, HTTP_METHODS, Route;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/current_options.js                                                //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
/**                                                                                           // 1
 * Allows for dynamic scoping of options variables. Primarily intended to be                  // 2
 * used in the RouteController.prototype.lookupOption method.                                 // 3
 */                                                                                           // 4
CurrentOptions = new Meteor.EnvironmentVariable;                                              // 5
                                                                                              // 6
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/http_methods.js                                                   //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
HTTP_METHODS = [                                                                              // 1
  'get',                                                                                      // 2
  'post',                                                                                     // 3
  'put',                                                                                      // 4
  'delete',                                                                                   // 5
];                                                                                            // 6
                                                                                              // 7
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/route_controller.js                                               //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
/*****************************************************************************/               // 1
/* Imports */                                                                                 // 2
/*****************************************************************************/               // 3
var Controller = Iron.Controller;                                                             // 4
var Url = Iron.Url;                                                                           // 5
var MiddlewareStack = Iron.MiddlewareStack;                                                   // 6
var assert = Iron.utils.assert;                                                               // 7
                                                                                              // 8
/*****************************************************************************/               // 9
/* RouteController */                                                                         // 10
/*****************************************************************************/               // 11
RouteController = Controller.extend({                                                         // 12
  constructor: function (options) {                                                           // 13
    RouteController.__super__.constructor.apply(this, arguments);                             // 14
    options = options || {};                                                                  // 15
    this.options = options;                                                                   // 16
    this._onStopCallbacks = [];                                                               // 17
    this.route = options.route;                                                               // 18
    this.params = [];                                                                         // 19
                                                                                              // 20
    // Sometimes the data property can be defined on route options,                           // 21
    // or even on the global router config. And people will expect the                        // 22
    // data function to be available on the controller instance if it                         // 23
    // is defined anywhere in the chain. This ensure that if we have                          // 24
    // a data function somewhere in the chain, you can call this.data().                      // 25
    var data = this.lookupOption('data');                                                     // 26
                                                                                              // 27
    if (typeof data === 'function')                                                           // 28
      this.data = _.bind(data, this);                                                         // 29
    else if (typeof data !== 'undefined')                                                     // 30
      this.data = function () { return data; };                                               // 31
                                                                                              // 32
    this.init(options);                                                                       // 33
  }                                                                                           // 34
});                                                                                           // 35
                                                                                              // 36
/**                                                                                           // 37
 * Returns an option value following an "options chain" which is this path:                   // 38
 *                                                                                            // 39
 *   this.options                                                                             // 40
 *   this (which includes the proto chain)                                                    // 41
 *   this.route.options                                                                       // 42
 *   dynamic variable                                                                         // 43
 *   this.router.options                                                                      // 44
 */                                                                                           // 45
RouteController.prototype.lookupOption = function (key) {                                     // 46
  // this.route.options                                                                       // 47
  // NOTE: we've debated whether route options should come before controller but              // 48
  // Tom has convinced me that it's easier for people to think about overriding               // 49
  // controller stuff at the route option level. However, this has the possibly               // 50
  // counterintuitive effect that if you define this.someprop = true on the                   // 51
  // controller instance, and you have someprop defined as an option on your                  // 52
  // Route, the route option will take precedence.                                            // 53
  if (this.route && this.route.options && _.has(this.route.options, key))                     // 54
    return this.route.options[key];                                                           // 55
                                                                                              // 56
  // this.options                                                                             // 57
  if (_.has(this.options, key))                                                               // 58
    return this.options[key];                                                                 // 59
                                                                                              // 60
  // "this" object or its proto chain                                                         // 61
  if (typeof this[key] !== 'undefined')                                                       // 62
    return this[key];                                                                         // 63
                                                                                              // 64
  // see if we have the CurrentOptions dynamic variable set.                                  // 65
  var opts = CurrentOptions.get();                                                            // 66
  if (opts && _.has(opts, key))                                                               // 67
    return opts[key];                                                                         // 68
                                                                                              // 69
  // this.router.options                                                                      // 70
  if (this.router && this.router.options && _.has(this.router.options, key))                  // 71
    return this.router.options[key];                                                          // 72
};                                                                                            // 73
                                                                                              // 74
RouteController.prototype.configureFromUrl = function (url, context, options) {               // 75
  assert(typeof url === 'string', 'url must be a string');                                    // 76
  context = context || {};                                                                    // 77
  this.request = context.request || {};                                                       // 78
  this.response = context.response || {};                                                     // 79
  this.url = context.url || url;                                                              // 80
  this.originalUrl = context.originalUrl || url;                                              // 81
  this.method = this.request.method;                                                          // 82
  if (this.route) {                                                                           // 83
    // pass options to that we can set reactive: false                                        // 84
    this.setParams(this.route.params(url), options);                                          // 85
  }                                                                                           // 86
};                                                                                            // 87
                                                                                              // 88
/**                                                                                           // 89
 * Returns an array of hook functions for the given hook names. Hooks are                     // 90
 * collected in this order:                                                                   // 91
 *                                                                                            // 92
 * router global hooks                                                                        // 93
 * route option hooks                                                                         // 94
 * prototype of the controller                                                                // 95
 * this object for the controller                                                             // 96
 *                                                                                            // 97
 * For example, this.collectHooks('onBeforeAction', 'before')                                 // 98
 * will return an array of hook functions where the key is either onBeforeAction              // 99
 * or before.                                                                                 // 100
 *                                                                                            // 101
 * Hook values can also be strings in which case they are looked up in the                    // 102
 * Iron.Router.hooks object.                                                                  // 103
 *                                                                                            // 104
 * TODO: Add an options last argument which can specify to only collect hooks                 // 105
 * for a particular environment (client, server or both).                                     // 106
 */                                                                                           // 107
RouteController.prototype._collectHooks = function (/* hook1, alias1, ... */) {               // 108
  var self = this;                                                                            // 109
  var hookNames = _.toArray(arguments);                                                       // 110
                                                                                              // 111
  var getHookValues = function (value) {                                                      // 112
    if (!value)                                                                               // 113
      return [];                                                                              // 114
    var lookupHook = self.router.lookupHook;                                                  // 115
    var hooks = _.isArray(value) ? value : [value];                                           // 116
    return _.map(hooks, function (h) { return lookupHook(h); });                              // 117
  };                                                                                          // 118
                                                                                              // 119
  var collectInheritedHooks = function (ctor, hookName) {                                     // 120
    var hooks = [];                                                                           // 121
                                                                                              // 122
    if (ctor.__super__)                                                                       // 123
      hooks = hooks.concat(collectInheritedHooks(ctor.__super__.constructor, hookName));      // 124
                                                                                              // 125
    return _.has(ctor.prototype, hookName) ?                                                  // 126
      hooks.concat(getHookValues(ctor.prototype[hookName])) : hooks;                          // 127
  };                                                                                          // 128
                                                                                              // 129
  var eachHook = function (cb) {                                                              // 130
    for (var i = 0; i < hookNames.length; i++) {                                              // 131
      cb(hookNames[i]);                                                                       // 132
    }                                                                                         // 133
  };                                                                                          // 134
                                                                                              // 135
  var routerHooks = [];                                                                       // 136
  eachHook(function (hook) {                                                                  // 137
    var name = self.route && self.route.getName();                                            // 138
    var hooks = self.router.getHooks(hook, name);                                             // 139
    routerHooks = routerHooks.concat(hooks);                                                  // 140
  });                                                                                         // 141
                                                                                              // 142
  var protoHooks = [];                                                                        // 143
  eachHook(function (hook) {                                                                  // 144
    var hooks = collectInheritedHooks(self.constructor, hook);                                // 145
    protoHooks = protoHooks.concat(hooks);                                                    // 146
  });                                                                                         // 147
                                                                                              // 148
  var thisHooks = [];                                                                         // 149
  eachHook(function (hook) {                                                                  // 150
    if (_.has(self, hook)) {                                                                  // 151
      var hooks = getHookValues(self[hook]);                                                  // 152
      thisHooks = thisHooks.concat(hooks);                                                    // 153
    }                                                                                         // 154
  });                                                                                         // 155
                                                                                              // 156
  var routeHooks = [];                                                                        // 157
  if (self.route) {                                                                           // 158
    eachHook(function (hook) {                                                                // 159
      var hooks = getHookValues(self.route.options[hook]);                                    // 160
      routeHooks = routeHooks.concat(hooks);                                                  // 161
    });                                                                                       // 162
  }                                                                                           // 163
                                                                                              // 164
  var allHooks = routerHooks                                                                  // 165
    .concat(routeHooks)                                                                       // 166
    .concat(protoHooks)                                                                       // 167
    .concat(thisHooks);                                                                       // 168
                                                                                              // 169
  return allHooks;                                                                            // 170
};                                                                                            // 171
                                                                                              // 172
/**                                                                                           // 173
 * Runs each hook and returns the number of hooks that were run.                              // 174
 */                                                                                           // 175
RouteController.prototype.runHooks = function (/* hook, alias1, ...*/ ) {                     // 176
  var hooks = this._collectHooks.apply(this, arguments);                                      // 177
  for (var i = 0, l = hooks.length; i < l; i++) {                                             // 178
    var h = hooks[i];                                                                         // 179
    h.call(this);                                                                             // 180
  }                                                                                           // 181
  return hooks.length;                                                                        // 182
};                                                                                            // 183
                                                                                              // 184
RouteController.prototype.getParams = function () {                                           // 185
  return this.params;                                                                         // 186
};                                                                                            // 187
                                                                                              // 188
RouteController.prototype.setParams = function (value) {                                      // 189
  this.params = value;                                                                        // 190
  return this;                                                                                // 191
};                                                                                            // 192
                                                                                              // 193
Iron.RouteController = RouteController;                                                       // 194
                                                                                              // 195
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/route_controller_server.js                                        //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
/*****************************************************************************/               // 1
/* Imports */                                                                                 // 2
/*****************************************************************************/               // 3
var Fiber = Npm.require('fibers');                                                            // 4
var Controller = Iron.Controller;                                                             // 5
var Url = Iron.Url;                                                                           // 6
var MiddlewareStack = Iron.MiddlewareStack;                                                   // 7
                                                                                              // 8
/*****************************************************************************/               // 9
/* RouteController */                                                                         // 10
/*****************************************************************************/               // 11
                                                                                              // 12
/**                                                                                           // 13
 * Server specific initialization.                                                            // 14
 */                                                                                           // 15
RouteController.prototype.init = function (options) {};                                       // 16
                                                                                              // 17
/**                                                                                           // 18
 * Let this controller run a dispatch process. This function will be called                   // 19
 * from the router. That way, any state associated with the dispatch can go on                // 20
 * the controller instance. Note: no result returned from dispatch because its                // 21
 * run inside its own fiber. Might at some point move the fiber stuff to a                    // 22
 * higher layer.                                                                              // 23
 */                                                                                           // 24
RouteController.prototype.dispatch = function (stack, url, done) {                            // 25
  var self = this;                                                                            // 26
  Fiber(function () {                                                                         // 27
    stack.dispatch(url, self, done);                                                          // 28
  }).run();                                                                                   // 29
};                                                                                            // 30
                                                                                              // 31
/**                                                                                           // 32
 * Run a route on the server. When the router runs its middleware stack, it                   // 33
 * can run regular middleware functions or it can run a route. There should                   // 34
 * only one route object per path as where there may be many middleware                       // 35
 * functions.                                                                                 // 36
 *                                                                                            // 37
 * For example:                                                                               // 38
 *                                                                                            // 39
 *   "/some/path" => [middleware1, middleware2, route, middleware3]                           // 40
 *                                                                                            // 41
 * When a route is dispatched, it tells the controller to _runRoute so that                   // 42
 * the controller can control the process. At this point we should already be                 // 43
 * in a dispatch so a computation should already exist.                                       // 44
 */                                                                                           // 45
RouteController.prototype._runRoute = function (route, url, done) {                           // 46
  var self = this;                                                                            // 47
  var stack = new MiddlewareStack;                                                            // 48
                                                                                              // 49
  var onRunHooks = this._collectHooks('onRun', 'load');                                       // 50
  stack = stack.append(onRunHooks, {where: 'server'});                                        // 51
                                                                                              // 52
  var beforeHooks = this._collectHooks('onBeforeAction', 'before');                           // 53
  stack.append(beforeHooks, {where: 'server'});                                               // 54
                                                                                              // 55
  // make sure the action stack has at least one handler on it that defaults                  // 56
  // to the 'action' method                                                                   // 57
  if (route._actionStack.length === 0) {                                                      // 58
    route._actionStack.push(route._path, 'action', route.options);                            // 59
  }                                                                                           // 60
                                                                                              // 61
  stack = stack.concat(route._actionStack);                                                   // 62
  stack.dispatch(url, this, done);                                                            // 63
                                                                                              // 64
  // run the after hooks.                                                                     // 65
  this.next = function () {};                                                                 // 66
  this.runHooks('onAfterAction', 'after');                                                    // 67
};                                                                                            // 68
                                                                                              // 69
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/route.js                                                          //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
var Url = Iron.Url;                                                                           // 1
var MiddlewareStack = Iron.MiddlewareStack;                                                   // 2
var assert = Iron.utils.assert;                                                               // 3
                                                                                              // 4
/*****************************************************************************/               // 5
/* Both */                                                                                    // 6
/*****************************************************************************/               // 7
Route = function (path, fn, options) {                                                        // 8
  var route = function (req, res, next) {                                                     // 9
    var controller = this;                                                                    // 10
    controller.request = req;                                                                 // 11
    controller.response = res;                                                                // 12
    route.dispatch(req.url, controller, next);                                                // 13
  }                                                                                           // 14
                                                                                              // 15
  if (typeof fn === 'object') {                                                               // 16
    options = fn;                                                                             // 17
    fn = options.action;                                                                      // 18
  }                                                                                           // 19
                                                                                              // 20
  options = options || {};                                                                    // 21
                                                                                              // 22
  if (typeof path === 'string' && path.charAt(0) !== '/') {                                   // 23
    path = options.path ? options.path : '/' + path                                           // 24
  }                                                                                           // 25
                                                                                              // 26
  // extend the route function with properties from this instance and its                     // 27
  // prototype.                                                                               // 28
  _.extend(route, this);                                                                      // 29
                                                                                              // 30
  // always good to have options                                                              // 31
  options = route.options = options || {};                                                    // 32
                                                                                              // 33
  // the main action function as well as any HTTP VERB action functions will go               // 34
  // onto this stack.                                                                         // 35
  route._actionStack = new MiddlewareStack;                                                   // 36
                                                                                              // 37
  // any before hooks will go onto this stack to make sure they get executed                  // 38
  // before the action stack.                                                                 // 39
  route._beforeStack = new MiddlewareStack;                                                   // 40
  route._beforeStack.append(route.options.onBeforeAction);                                    // 41
  route._beforeStack.append(route.options.before);                                            // 42
                                                                                              // 43
  // after hooks get run after the action stack                                               // 44
  route._afterStack = new MiddlewareStack;                                                    // 45
  route._afterStack.append(route.options.onAfterAction);                                      // 46
  route._afterStack.append(route.options.after);                                              // 47
                                                                                              // 48
                                                                                              // 49
  // track which methods this route uses                                                      // 50
  route._methods = {};                                                                        // 51
                                                                                              // 52
  if (typeof fn === 'string') {                                                               // 53
    route._actionStack.push(path, _.extend(options, {                                         // 54
      template: fn                                                                            // 55
    }));                                                                                      // 56
  } else if (typeof fn === 'function' || typeof fn === 'object') {                            // 57
    route._actionStack.push(path, fn, options);                                               // 58
  }                                                                                           // 59
                                                                                              // 60
  route._path = path;                                                                         // 61
  return route;                                                                               // 62
};                                                                                            // 63
                                                                                              // 64
/**                                                                                           // 65
 * The name of the route is actually stored on the handler since a route is a                 // 66
 * function that has an unassignable "name" property.                                         // 67
 */                                                                                           // 68
Route.prototype.getName = function () {                                                       // 69
  return this.handler && this.handler.name;                                                   // 70
};                                                                                            // 71
                                                                                              // 72
/**                                                                                           // 73
 * Returns an appropriate RouteController constructor the this Route.                         // 74
 *                                                                                            // 75
 * There are three possibilities:                                                             // 76
 *                                                                                            // 77
 *  1. controller option provided as a string on the route                                    // 78
 *  2. a controller in the global namespace with the converted name of the route              // 79
 *  3. a default RouteController                                                              // 80
 *                                                                                            // 81
 */                                                                                           // 82
Route.prototype.findControllerConstructor = function () {                                     // 83
  var self = this;                                                                            // 84
                                                                                              // 85
  var resolve = function (name, opts) {                                                       // 86
    opts = opts || {};                                                                        // 87
    var C = Iron.utils.resolve(name);                                                         // 88
    if (!C || !RouteController.prototype.isPrototypeOf(C.prototype)) {                        // 89
      if (opts.supressErrors !== true)                                                        // 90
        throw new Error("RouteController '" + name + "' is not defined.");                    // 91
      else                                                                                    // 92
        return undefined;                                                                     // 93
    } else {                                                                                  // 94
      return C;                                                                               // 95
    }                                                                                         // 96
  };                                                                                          // 97
                                                                                              // 98
  var convert = function (name) {                                                             // 99
    return self.router.toControllerName(name);                                                // 100
  };                                                                                          // 101
                                                                                              // 102
  var result;                                                                                 // 103
  var name = this.getName();                                                                  // 104
                                                                                              // 105
  // the controller was set directly                                                          // 106
  if (typeof this.options.controller === 'function')                                          // 107
    return this.options.controller;                                                           // 108
                                                                                              // 109
  // was the controller specified precisely by name? then resolve to an actual                // 110
  // javascript constructor value                                                             // 111
  else if (typeof this.options.controller === 'string')                                       // 112
    return resolve(this.options.controller);                                                  // 113
                                                                                              // 114
  // otherwise do we have a name? try to convert the name to a controller name                // 115
  // and resolve it to a value                                                                // 116
  else if (name && (result = resolve(convert(name), {supressErrors: true})))                  // 117
    return result;                                                                            // 118
                                                                                              // 119
  // otherwise just use an anonymous route controller                                         // 120
  else                                                                                        // 121
    return RouteController;                                                                   // 122
};                                                                                            // 123
                                                                                              // 124
                                                                                              // 125
/**                                                                                           // 126
 * Create a new controller for the route.                                                     // 127
 */                                                                                           // 128
Route.prototype.createController = function (options) {                                       // 129
  options = options || {};                                                                    // 130
  var C = this.findControllerConstructor();                                                   // 131
  options.route = this;                                                                       // 132
  var instance = new C(options);                                                              // 133
  return instance;                                                                            // 134
};                                                                                            // 135
                                                                                              // 136
Route.prototype.setControllerParams = function (controller, url) {                            // 137
};                                                                                            // 138
                                                                                              // 139
/**                                                                                           // 140
 * Dispatch into the route's middleware stack.                                                // 141
 */                                                                                           // 142
Route.prototype.dispatch = function (url, context, done) {                                    // 143
  // call runRoute on the controller which will behave similarly to the previous              // 144
  // version of IR.                                                                           // 145
  assert(context._runRoute, "context doesn't have a _runRoute method");                       // 146
  return context._runRoute(this, url, done);                                                  // 147
};                                                                                            // 148
                                                                                              // 149
/**                                                                                           // 150
 * Returns a relative path for the route.                                                     // 151
 */                                                                                           // 152
Route.prototype.path = function (params, options) {                                           // 153
  return this.handler.resolve(params, options);                                               // 154
};                                                                                            // 155
                                                                                              // 156
/**                                                                                           // 157
 * Return a fully qualified url for the route, given a set of parmeters and                   // 158
 * options like hash and query.                                                               // 159
 */                                                                                           // 160
Route.prototype.url = function (params, options) {                                            // 161
  var path = this.path(params, options);                                                      // 162
  var host = (options && options.host) || Meteor.absoluteUrl();                               // 163
                                                                                              // 164
  if (host.charAt(host.length-1) === '/');                                                    // 165
    host = host.slice(0, host.length-1);                                                      // 166
  return host + path;                                                                         // 167
};                                                                                            // 168
                                                                                              // 169
/**                                                                                           // 170
 * Return a params object for the route given a path.                                         // 171
 */                                                                                           // 172
Route.prototype.params = function (path) {                                                    // 173
  return this.handler.params(path);                                                           // 174
};                                                                                            // 175
                                                                                              // 176
/**                                                                                           // 177
 * Add convenience methods for each HTTP verb.                                                // 178
 *                                                                                            // 179
 * Example:                                                                                   // 180
 *  var route = router.route('/item')                                                         // 181
 *    .get(function () { })                                                                   // 182
 *    .post(function () { })                                                                  // 183
 *    .put(function () { })                                                                   // 184
 */                                                                                           // 185
HTTP_METHODS.forEach(function (method) {                                                      // 186
  Route.prototype[method] = function (fn) {                                                   // 187
    // track the method being used for OPTIONS requests.                                      // 188
    this._methods[method] = true;                                                             // 189
                                                                                              // 190
    this._actionStack.push(this._path, fn, {                                                  // 191
      // give each method a unique name so it doesn't clash with the route's                  // 192
      // name in the action stack                                                             // 193
      name: this.getName() + '_' + method.toLowerCase(),                                      // 194
      method: method,                                                                         // 195
                                                                                              // 196
      // for now just make the handler where the same as the route, presumably a              // 197
      // server route.                                                                        // 198
      where: this.handler.where,                                                              // 199
      mount: false                                                                            // 200
    });                                                                                       // 201
                                                                                              // 202
    return this;                                                                              // 203
  };                                                                                          // 204
});                                                                                           // 205
                                                                                              // 206
Iron.Route = Route;                                                                           // 207
                                                                                              // 208
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/router.js                                                         //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
/*****************************************************************************/               // 1
/* Imports */                                                                                 // 2
/*****************************************************************************/               // 3
var MiddlewareStack = Iron.MiddlewareStack;                                                   // 4
var Url = Iron.Url;                                                                           // 5
var Layout = Iron.Layout;                                                                     // 6
var warn = Iron.utils.warn;                                                                   // 7
var assert = Iron.utils.assert;                                                               // 8
                                                                                              // 9
Router = function (options) {                                                                 // 10
  // keep the same api throughout which is:                                                   // 11
  // fn(url, context, done);                                                                  // 12
  function router (req, res, next) {                                                          // 13
    //XXX this assumes no other routers on the parent stack which we should probably fix      // 14
    router.dispatch(req.url, {                                                                // 15
      request: req,                                                                           // 16
      response: res                                                                           // 17
    }, next);                                                                                 // 18
  }                                                                                           // 19
                                                                                              // 20
  // the main router stack                                                                    // 21
  router._stack = new MiddlewareStack;                                                        // 22
                                                                                              // 23
  // for storing global hooks like before, after, etc.                                        // 24
  router._globalHooks = {};                                                                   // 25
                                                                                              // 26
  // backward compat and quicker lookup of Route handlers vs. regular function                // 27
  // handlers.                                                                                // 28
  router.routes = [];                                                                         // 29
                                                                                              // 30
  // to make sure we don't have more than one route per path                                  // 31
  router.routes._byPath = {};                                                                 // 32
                                                                                              // 33
  // always good to have options                                                              // 34
  this.configure.call(router, options);                                                       // 35
                                                                                              // 36
  // add proto properties to the router function                                              // 37
  _.extend(router, this);                                                                     // 38
                                                                                              // 39
  // let client and server side routing doing different things here                           // 40
  this.init.call(router, options);                                                            // 41
                                                                                              // 42
  Meteor.startup(function () {                                                                // 43
    Meteor.defer(function () {                                                                // 44
      if (router.options.autoStart !== false)                                                 // 45
        router.start();                                                                       // 46
    });                                                                                       // 47
  });                                                                                         // 48
                                                                                              // 49
  return router;                                                                              // 50
};                                                                                            // 51
                                                                                              // 52
Router.prototype.init = function (options) {};                                                // 53
                                                                                              // 54
Router.prototype.configure = function (options) {                                             // 55
  var self = this;                                                                            // 56
                                                                                              // 57
  options = options || {};                                                                    // 58
                                                                                              // 59
  var toArray = function (value) {                                                            // 60
    if (!value)                                                                               // 61
      return [];                                                                              // 62
                                                                                              // 63
    if (_.isArray(value))                                                                     // 64
      return value;                                                                           // 65
                                                                                              // 66
    return [value];                                                                           // 67
  };                                                                                          // 68
                                                                                              // 69
  // e.g. before: fn OR before: [fn1, fn2]                                                    // 70
  _.each(Iron.Router.HOOK_TYPES, function eachHookType (type) {                               // 71
    if (options[type]) {                                                                      // 72
      _.each(toArray(options[type]), function eachHook (hook) {                               // 73
        self.addHook(type, hook);                                                             // 74
      });                                                                                     // 75
                                                                                              // 76
      delete options[type];                                                                   // 77
    }                                                                                         // 78
  });                                                                                         // 79
                                                                                              // 80
  this.options = this.options || {};                                                          // 81
  _.extend(this.options, options);                                                            // 82
                                                                                              // 83
  return this;                                                                                // 84
};                                                                                            // 85
                                                                                              // 86
/**                                                                                           // 87
 * Just to support legacy calling. Doesn't really serve much purpose.                         // 88
 */                                                                                           // 89
Router.prototype.map = function (fn) {                                                        // 90
  return fn.call(this);                                                                       // 91
};                                                                                            // 92
                                                                                              // 93
/*                                                                                            // 94
 * XXX removing for now until this is thought about more carefully.                           // 95
Router.prototype.use = function (path, fn, opts) {                                            // 96
  if (typeof path === 'function') {                                                           // 97
    opts = fn || {};                                                                          // 98
    opts.mount = true;                                                                        // 99
    opts.where = opts.where || 'server';                                                      // 100
    this._stack.push(path, opts);                                                             // 101
  } else {                                                                                    // 102
    opts = opts || {};                                                                        // 103
    opts.mount = true;                                                                        // 104
    opts.where = opts.where || 'server';                                                      // 105
    this._stack.push(path, fn, opts);                                                         // 106
  }                                                                                           // 107
                                                                                              // 108
  return this;                                                                                // 109
};                                                                                            // 110
*/                                                                                            // 111
                                                                                              // 112
//XXX seems like we could put a params method on the route directly and make it reactive      // 113
Router.prototype.route = function (path, fn, opts) {                                          // 114
  var typeOf = function (val) { return Object.prototype.toString.call(val); };                // 115
  assert(typeOf(path) === '[object String]' || typeOf(path) === '[object RegExp]', "Router.route requires a path that is a string or regular expression.");
                                                                                              // 117
  if (typeof fn === 'object') {                                                               // 118
    opts = fn;                                                                                // 119
    fn = opts.action;                                                                         // 120
  }                                                                                           // 121
                                                                                              // 122
  var route = new Route(path, fn, opts);                                                      // 123
                                                                                              // 124
  opts = opts || {};                                                                          // 125
                                                                                              // 126
  // don't mount the route                                                                    // 127
  opts.mount = false;                                                                         // 128
                                                                                              // 129
  // stack expects a function which is exactly what a new Route returns!                      // 130
  var handler = this._stack.push(path, route, opts);                                          // 131
                                                                                              // 132
  handler.route = route;                                                                      // 133
  route.handler = handler;                                                                    // 134
  route.router = this;                                                                        // 135
                                                                                              // 136
  assert(!this.routes._byPath[handler.path],                                                  // 137
    "A route for the path " + JSON.stringify(handler.path) + " already exists by the name of " + JSON.stringify(handler.name) + ".");
  this.routes._byPath[handler.path] = route;                                                  // 139
                                                                                              // 140
  this.routes.push(route);                                                                    // 141
                                                                                              // 142
  if (typeof handler.name === 'string')                                                       // 143
    this.routes[handler.name] = route;                                                        // 144
                                                                                              // 145
  return route;                                                                               // 146
};                                                                                            // 147
                                                                                              // 148
/**                                                                                           // 149
 * Find the first route for the given url and options.                                        // 150
 */                                                                                           // 151
Router.prototype.findFirstRoute = function (url) {                                            // 152
  for (var i = 0; i < this.routes.length; i++) {                                              // 153
    if (this.routes[i].handler.test(url, {}))                                                 // 154
      return this.routes[i];                                                                  // 155
  }                                                                                           // 156
                                                                                              // 157
  return null;                                                                                // 158
};                                                                                            // 159
                                                                                              // 160
Router.prototype.path = function (routeName, params, options) {                               // 161
  var route = this.routes[routeName];                                                         // 162
  warn(route, "You called Router.path for a route named " + JSON.stringify(routeName) + " but that route doesn't seem to exist. Are you sure you created it?");
  return route && route.path(params, options);                                                // 164
};                                                                                            // 165
                                                                                              // 166
Router.prototype.url = function (routeName, params, options) {                                // 167
  var route = this.routes[routeName];                                                         // 168
  warn(route, "You called Router.url for a route named " + JSON.stringify(routeName) + " but that route doesn't seem to exist. Are you sure you created it?");
  return route && route.url(params, options);                                                 // 170
};                                                                                            // 171
                                                                                              // 172
/**                                                                                           // 173
 * Create a new controller for a dispatch.                                                    // 174
 */                                                                                           // 175
Router.prototype.createController = function (url, context) {                                 // 176
  // see if there's a route for this url                                                      // 177
  var route = this.findFirstRoute(url);                                                       // 178
  var controller;                                                                             // 179
                                                                                              // 180
  context = context || {};                                                                    // 181
                                                                                              // 182
  if (route)                                                                                  // 183
    // let the route decide what controller to use                                            // 184
    controller = route.createController({layout: this._layout});                              // 185
  else                                                                                        // 186
    // create an anonymous controller                                                         // 187
    controller = new RouteController({layout: this._layout});                                 // 188
                                                                                              // 189
  controller.router = this;                                                                   // 190
  controller.configureFromUrl(url, context, {reactive: false});                               // 191
  return controller;                                                                          // 192
};                                                                                            // 193
                                                                                              // 194
Router.prototype.setTemplateNameConverter = function (fn) {                                   // 195
  this._templateNameConverter = fn;                                                           // 196
  return this;                                                                                // 197
};                                                                                            // 198
                                                                                              // 199
Router.prototype.setControllerNameConverter = function (fn) {                                 // 200
  this._controllerNameConverter = fn;                                                         // 201
  return this;                                                                                // 202
};                                                                                            // 203
                                                                                              // 204
Router.prototype.toTemplateName = function (str) {                                            // 205
  if (this._templateNameConverter)                                                            // 206
    return this._templateNameConverter(str);                                                  // 207
  else                                                                                        // 208
    return Iron.utils.classCase(str);                                                         // 209
};                                                                                            // 210
                                                                                              // 211
Router.prototype.toControllerName = function (str) {                                          // 212
  if (this._controllerNameConverter)                                                          // 213
    return this._controllerNameConverter(str);                                                // 214
  else                                                                                        // 215
    return Iron.utils.classCase(str) + 'Controller';                                          // 216
};                                                                                            // 217
                                                                                              // 218
/**                                                                                           // 219
 *                                                                                            // 220
 * Add a hook to all routes. The hooks will apply to all routes,                              // 221
 * unless you name routes to include or exclude via `only` and `except` options               // 222
 *                                                                                            // 223
 * @param {String} [type] one of 'load', 'unload', 'before' or 'after'                        // 224
 * @param {Object} [options] Options to controll the hooks [optional]                         // 225
 * @param {Function} [hook] Callback to run                                                   // 226
 * @return {IronRouter}                                                                       // 227
 * @api public                                                                                // 228
 *                                                                                            // 229
 */                                                                                           // 230
                                                                                              // 231
Router.prototype.addHook = function(type, hook, options) {                                    // 232
  var self = this;                                                                            // 233
                                                                                              // 234
  options = options || {};                                                                    // 235
                                                                                              // 236
  var toArray = function (input) {                                                            // 237
    if (!input)                                                                               // 238
      return [];                                                                              // 239
    else if (_.isArray(input))                                                                // 240
      return input;                                                                           // 241
    else                                                                                      // 242
      return [input];                                                                         // 243
  }                                                                                           // 244
                                                                                              // 245
  if (options.only)                                                                           // 246
    options.only = toArray(options.only);                                                     // 247
  if (options.except)                                                                         // 248
    options.except = toArray(options.except);                                                 // 249
                                                                                              // 250
  var hooks = this._globalHooks[type] = this._globalHooks[type] || [];                        // 251
                                                                                              // 252
  var hookWithOptions = function () {                                                         // 253
    var thisArg = this;                                                                       // 254
    var args = arguments;                                                                     // 255
    // this allows us to bind hooks to options that get looked up when you call               // 256
    // this.lookupOption from within the hook. And it looks better to keep                    // 257
    // plugin/hook related options close to their definitions instead of                      // 258
    // Router.configure. But we use a dynamic variable so we don't have to                    // 259
    // pass the options explicitly as an argument and plugin creators can                     // 260
    // just use this.lookupOption which will follow the proper lookup chain from              // 261
    // "this", local options, dynamic variable options, route, router, etc.                   // 262
    return CurrentOptions.withValue(options, function () {                                    // 263
      return self.lookupHook(hook).apply(thisArg, args);                                      // 264
    });                                                                                       // 265
  };                                                                                          // 266
                                                                                              // 267
  hooks.push({options: options, hook: hookWithOptions});                                      // 268
  return this;                                                                                // 269
};                                                                                            // 270
                                                                                              // 271
/**                                                                                           // 272
 * If the argument is a function return it directly. If it's a string, see if                 // 273
 * there is a function in the Iron.Router.hooks namespace. Throw an error if we               // 274
 * can't find the hook.                                                                       // 275
 */                                                                                           // 276
Router.prototype.lookupHook = function (nameOrFn) {                                           // 277
  var fn = nameOrFn;                                                                          // 278
                                                                                              // 279
  // if we already have a func just return it                                                 // 280
  if (_.isFunction(fn))                                                                       // 281
    return fn;                                                                                // 282
                                                                                              // 283
  // look up one of the out-of-box hooks like                                                 // 284
  // 'loaded or 'dataNotFound' if the nameOrFn is a                                           // 285
  // string                                                                                   // 286
  if (_.isString(fn)) {                                                                       // 287
    if (_.isFunction(Iron.Router.hooks[fn]))                                                  // 288
      return Iron.Router.hooks[fn];                                                           // 289
  }                                                                                           // 290
                                                                                              // 291
  // we couldn't find it so throw an error                                                    // 292
  throw new Error("No hook found named: " + nameOrFn);                                        // 293
};                                                                                            // 294
                                                                                              // 295
/**                                                                                           // 296
 *                                                                                            // 297
 * Fetch the list of global hooks that apply to the given route name.                         // 298
 * Hooks are defined by the .addHook() function above.                                        // 299
 *                                                                                            // 300
 * @param {String} [type] one of IronRouter.HOOK_TYPES                                        // 301
 * @param {String} [name] the name of the route we are interested in                          // 302
 * @return {[Function]} [hooks] an array of hooks to run                                      // 303
 * @api public                                                                                // 304
 *                                                                                            // 305
 */                                                                                           // 306
                                                                                              // 307
Router.prototype.getHooks = function(type, name) {                                            // 308
  var self = this;                                                                            // 309
  var hooks = [];                                                                             // 310
                                                                                              // 311
  _.each(this._globalHooks[type], function(hook) {                                            // 312
    var options = hook.options;                                                               // 313
                                                                                              // 314
    if (options.except && _.include(options.except, name))                                    // 315
      return [];                                                                              // 316
                                                                                              // 317
    if (options.only && ! _.include(options.only, name))                                      // 318
      return [];                                                                              // 319
                                                                                              // 320
    hooks.push(hook.hook);                                                                    // 321
  });                                                                                         // 322
                                                                                              // 323
  return hooks;                                                                               // 324
};                                                                                            // 325
                                                                                              // 326
Router.HOOK_TYPES = [                                                                         // 327
  'onRun',                                                                                    // 328
  'onRerun',                                                                                  // 329
  'onBeforeAction',                                                                           // 330
  'onAfterAction',                                                                            // 331
  'onStop',                                                                                   // 332
                                                                                              // 333
  // not technically a hook but we'll use it                                                  // 334
  // in a similar way. This will cause waitOn                                                 // 335
  // to be added as a method to the Router and then                                           // 336
  // it can be selectively applied to specific routes                                         // 337
  'waitOn',                                                                                   // 338
                                                                                              // 339
  // legacy hook types but we'll let them slide                                               // 340
  'load', // onRun                                                                            // 341
  'before', // onBeforeAction                                                                 // 342
  'after', // onAfterAction                                                                   // 343
  'unload' // onStop                                                                          // 344
];                                                                                            // 345
                                                                                              // 346
/**                                                                                           // 347
 * A namespace for hooks keyed by name.                                                       // 348
 */                                                                                           // 349
Router.hooks = {};                                                                            // 350
                                                                                              // 351
                                                                                              // 352
/**                                                                                           // 353
 * A namespace for plugin functions keyed by name.                                            // 354
 */                                                                                           // 355
Router.plugins = {};                                                                          // 356
                                                                                              // 357
/**                                                                                           // 358
 * Auto add helper mtehods for all the hooks.                                                 // 359
 */                                                                                           // 360
                                                                                              // 361
Router.HOOK_TYPES.forEach(function (type) {                                                   // 362
  Router.prototype[type] = function (hook, options) {                                         // 363
    this.addHook(type, hook, options);                                                        // 364
  };                                                                                          // 365
});                                                                                           // 366
                                                                                              // 367
/**                                                                                           // 368
 * Add a plugin to the router instance.                                                       // 369
 */                                                                                           // 370
Router.prototype.plugin = function (nameOrFn, options) {                                      // 371
  var func;                                                                                   // 372
                                                                                              // 373
  if (typeof nameOrFn === 'function')                                                         // 374
    func = nameOrFn;                                                                          // 375
  else if (typeof nameOrFn === 'string')                                                      // 376
    func = Iron.Router.plugins[nameOrFn];                                                     // 377
                                                                                              // 378
  if (!func)                                                                                  // 379
    throw new Error("No plugin found named " + JSON.stringify(nameOrFn));                     // 380
                                                                                              // 381
  // fn(router, options)                                                                      // 382
  func.call(this, this, options);                                                             // 383
                                                                                              // 384
  return this;                                                                                // 385
};                                                                                            // 386
                                                                                              // 387
Iron.Router = Router;                                                                         // 388
                                                                                              // 389
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/hooks.js                                                          //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
if (typeof Template !== 'undefined') {                                                        // 1
  /**                                                                                         // 2
   * The default anonymous loading template.                                                  // 3
   */                                                                                         // 4
  var defaultLoadingTemplate = new Template('DefaultLoadingTemplate', function () {           // 5
    return 'Loading...';                                                                      // 6
  });                                                                                         // 7
                                                                                              // 8
  /**                                                                                         // 9
   * The default anonymous data not found template.                                           // 10
   */                                                                                         // 11
  var defaultDataNotFoundTemplate = new Template('DefaultDataNotFoundTemplate', function () { // 12
    return 'Data not found...';                                                               // 13
  });                                                                                         // 14
}                                                                                             // 15
                                                                                              // 16
/**                                                                                           // 17
 * Automatically render a loading template into the main region if the                        // 18
 * controller is not ready (i.e. this.ready() is false). If no loadingTemplate                // 19
 * is defined use some default text.                                                          // 20
 */                                                                                           // 21
                                                                                              // 22
Router.hooks.loading = function () {                                                          // 23
  // if we're ready just pass through                                                         // 24
  if (this.ready()) {                                                                         // 25
    this.next();                                                                              // 26
    return;                                                                                   // 27
  }                                                                                           // 28
                                                                                              // 29
  var template = this.lookupOption('loadingTemplate');                                        // 30
  this.render(template || defaultLoadingTemplate);                                            // 31
  this.renderRegions();                                                                       // 32
};                                                                                            // 33
                                                                                              // 34
/**                                                                                           // 35
 * Render a "data not found" template if a global data function returns a falsey              // 36
 * value                                                                                      // 37
 */                                                                                           // 38
Router.hooks.dataNotFound = function () {                                                     // 39
  if (!this.ready()) {                                                                        // 40
    this.next();                                                                              // 41
    return;                                                                                   // 42
  }                                                                                           // 43
                                                                                              // 44
  var data = this.lookupOption('data');                                                       // 45
  var dataValue;                                                                              // 46
  var template = this.lookupOption('notFoundTemplate');                                       // 47
                                                                                              // 48
  if (typeof data === 'function') {                                                           // 49
    if (!(dataValue = data.call(this))) {                                                     // 50
      this.render(template || defaultDataNotFoundTemplate);                                   // 51
      this.renderRegions();                                                                   // 52
      return;                                                                                 // 53
    }                                                                                         // 54
  }                                                                                           // 55
                                                                                              // 56
  // okay never mind just pass along now                                                      // 57
  this.next();                                                                                // 58
};                                                                                            // 59
                                                                                              // 60
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/helpers.js                                                        //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
/*****************************************************************************/               // 1
/* Imports */                                                                                 // 2
/*****************************************************************************/               // 3
var warn = Iron.utils.warn;                                                                   // 4
var DynamicTemplate = Iron.DynamicTemplate;                                                   // 5
var debug = Iron.utils.debug('iron:router <helpers>');                                        // 6
                                                                                              // 7
/*****************************************************************************/               // 8
/* UI Helpers */                                                                              // 9
/*****************************************************************************/               // 10
                                                                                              // 11
/**                                                                                           // 12
 * Render the Router to a specific location on the page instead of the                        // 13
 * document.body.                                                                             // 14
 */                                                                                           // 15
UI.registerHelper('Router', new Blaze.Template('Router', function () {                        // 16
  return Router.createView();                                                                 // 17
}));                                                                                          // 18
                                                                                              // 19
/**                                                                                           // 20
 * Returns a relative path given a route name, data context and optional query                // 21
 * and hash parameters.                                                                       // 22
 */                                                                                           // 23
UI.registerHelper('pathFor', function (options) {                                             // 24
  var routeName;                                                                              // 25
                                                                                              // 26
  if (arguments.length > 1) {                                                                 // 27
    routeName = arguments[0];                                                                 // 28
    options = arguments[1] || {};                                                             // 29
  }                                                                                           // 30
                                                                                              // 31
  var opts = options && options.hash;                                                         // 32
                                                                                              // 33
  opts = opts || {};                                                                          // 34
                                                                                              // 35
  var path = '';                                                                              // 36
  var query = opts.query;                                                                     // 37
  var hash = opts.hash;                                                                       // 38
  var routeName = routeName || opts.route;                                                    // 39
  var data = _.extend({}, opts.data || this);                                                 // 40
                                                                                              // 41
  var route = Router.routes[routeName];                                                       // 42
  warn(route, "pathFor couldn't find a route named " + JSON.stringify(routeName));            // 43
                                                                                              // 44
  if (route) {                                                                                // 45
    _.each(route.handler.compiledUrl.keys, function (keyConfig) {                             // 46
      var key = keyConfig.name;                                                               // 47
      if (_.has(opts, key)) {                                                                 // 48
        data[key] = EJSON.clone(opts[key]);                                                   // 49
                                                                                              // 50
        // so the option doesn't end up on the element as an attribute                        // 51
        delete opts[key];                                                                     // 52
      }                                                                                       // 53
    });                                                                                       // 54
                                                                                              // 55
    path = route.path(data, {query: query, hash: hash});                                      // 56
  }                                                                                           // 57
                                                                                              // 58
  return path;                                                                                // 59
});                                                                                           // 60
                                                                                              // 61
/**                                                                                           // 62
 * Returns a relative path given a route name, data context and optional query                // 63
 * and hash parameters.                                                                       // 64
 */                                                                                           // 65
UI.registerHelper('urlFor', function (options) {                                              // 66
  var routeName;                                                                              // 67
                                                                                              // 68
  if (arguments.length > 1) {                                                                 // 69
    routeName = arguments[0];                                                                 // 70
    options = arguments[1] || {};                                                             // 71
  }                                                                                           // 72
                                                                                              // 73
  var opts = options && options.hash;                                                         // 74
                                                                                              // 75
  opts = opts || {};                                                                          // 76
  var url = '';                                                                               // 77
  var query = opts.query;                                                                     // 78
  var hash = opts.hash;                                                                       // 79
  var routeName = routeName || opts.route;                                                    // 80
  var data = _.extend({}, opts.data || this);                                                 // 81
                                                                                              // 82
  var route = Router.routes[routeName];                                                       // 83
  warn(route, "urlFor couldn't find a route named " + JSON.stringify(routeName));             // 84
                                                                                              // 85
  if (route) {                                                                                // 86
    _.each(route.handler.compiledUrl.keys, function (keyConfig) {                             // 87
      var key = keyConfig.name;                                                               // 88
      if (_.has(opts, key)) {                                                                 // 89
        data[key] = EJSON.clone(opts[key]);                                                   // 90
                                                                                              // 91
        // so the option doesn't end up on the element as an attribute                        // 92
        delete opts[key];                                                                     // 93
      }                                                                                       // 94
    });                                                                                       // 95
                                                                                              // 96
    url = route.url(data, {query: query, hash: hash});                                        // 97
  }                                                                                           // 98
                                                                                              // 99
  return url;                                                                                 // 100
});                                                                                           // 101
                                                                                              // 102
/**                                                                                           // 103
 * Create a link with optional content block.                                                 // 104
 *                                                                                            // 105
 * Example:                                                                                   // 106
 *   {{#linkTo route="one" query="query" hash="hash" class="my-cls"}}                         // 107
 *    <div>My Custom Link Content</div>                                                       // 108
 *   {{/linkTo}}                                                                              // 109
 */                                                                                           // 110
UI.registerHelper('linkTo', new Blaze.Template('linkTo', function () {                        // 111
  var self = this;                                                                            // 112
  var opts = DynamicTemplate.getInclusionArguments(this);                                     // 113
                                                                                              // 114
  if (typeof opts !== 'object')                                                               // 115
    throw new Error("linkTo options must be key value pairs such as {{#linkTo route='my.route.name'}}. You passed: " + JSON.stringify(opts));
                                                                                              // 117
  opts = opts || {};                                                                          // 118
  var path = '';                                                                              // 119
  var query = opts.query;                                                                     // 120
  var hash = opts.hash;                                                                       // 121
  var routeName = opts.route;                                                                 // 122
  var data = _.extend({}, opts.data || DynamicTemplate.getParentDataContext(this));           // 123
  var route = Router.routes[routeName];                                                       // 124
  var paramKeys;                                                                              // 125
                                                                                              // 126
  warn(route, "linkTo couldn't find a route named " + JSON.stringify(routeName));             // 127
                                                                                              // 128
  if (route) {                                                                                // 129
    _.each(route.handler.compiledUrl.keys, function (keyConfig) {                             // 130
      var key = keyConfig.name;                                                               // 131
      if (_.has(opts, key)) {                                                                 // 132
        data[key] = EJSON.clone(opts[key]);                                                   // 133
                                                                                              // 134
        // so the option doesn't end up on the element as an attribute                        // 135
        delete opts[key];                                                                     // 136
      }                                                                                       // 137
    });                                                                                       // 138
                                                                                              // 139
    path = route.path(data, {query: query, hash: hash});                                      // 140
  }                                                                                           // 141
                                                                                              // 142
  // anything that isn't one of our keywords we'll assume is an attributed                    // 143
  // intended for the <a> tag                                                                 // 144
  var attrs = _.omit(opts, 'route', 'query', 'hash', 'data');                                 // 145
  attrs.href = path;                                                                          // 146
                                                                                              // 147
  return Blaze.With(function () {                                                             // 148
    return DynamicTemplate.getParentDataContext(self);                                        // 149
  }, function () {                                                                            // 150
    return HTML.A(attrs, self.templateContentBlock);                                          // 151
  });                                                                                         // 152
}));                                                                                          // 153
                                                                                              // 154
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/body_parser_server.js                                             //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
Router.bodyParser = Npm.require('body-parser');                                               // 1
                                                                                              // 2
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/router_server.js                                                  //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
var assert = Iron.utils.assert;                                                               // 1
                                                                                              // 2
var env = process.env.NODE_ENV || 'development';                                              // 3
                                                                                              // 4
/**                                                                                           // 5
 * Server specific initialization.                                                            // 6
 */                                                                                           // 7
Router.prototype.init = function (options) {};                                                // 8
                                                                                              // 9
/**                                                                                           // 10
 * Add the router to the server connect handlers.                                             // 11
 */                                                                                           // 12
Router.prototype.start = function () {                                                        // 13
  WebApp.connectHandlers.use(this);                                                           // 14
};                                                                                            // 15
                                                                                              // 16
/**                                                                                           // 17
 * Create a new controller and dispatch into the stack.                                       // 18
 */                                                                                           // 19
Router.prototype.dispatch = function (url, context, done) {                                   // 20
  var self = this;                                                                            // 21
                                                                                              // 22
  assert(typeof url === 'string', "expected url string in router dispatch");                  // 23
  assert(typeof context === 'object', "expected context object in router dispatch");          // 24
                                                                                              // 25
  // assumes there is only one router                                                         // 26
  // XXX need to initialize controller either from the context itself or if the               // 27
  // context already has a controller on it, just use that one.                               // 28
  var controller = this.createController(url, context);                                       // 29
                                                                                              // 30
  controller.dispatch(this._stack, url, function (err) {                                      // 31
    var res = this.response;                                                                  // 32
    var req = this.request;                                                                   // 33
    var msg;                                                                                  // 34
                                                                                              // 35
    if (err) {                                                                                // 36
      if (res.statusCode < 400)                                                               // 37
        res.statusCode = 500;                                                                 // 38
                                                                                              // 39
      if (err.status)                                                                         // 40
        res.statusCode = err.status;                                                          // 41
                                                                                              // 42
      if (env === 'development')                                                              // 43
        msg = (err.stack || err.toString()) + '\n';                                           // 44
      else                                                                                    // 45
        //XXX get this from standard dict of error messages?                                  // 46
        msg = 'Server error.';                                                                // 47
                                                                                              // 48
      console.error(err.stack || err.toString());                                             // 49
                                                                                              // 50
      if (res.headersSent)                                                                    // 51
        return req.socket.destroy();                                                          // 52
                                                                                              // 53
      res.setHeader('Content-Type', 'text/html');                                             // 54
      res.setHeader('Content-Length', Buffer.byteLength(msg));                                // 55
      if (req.method === 'HEAD')                                                              // 56
        return res.end();                                                                     // 57
      res.end(msg);                                                                           // 58
      return;                                                                                 // 59
    }                                                                                         // 60
                                                                                              // 61
    // if there are no client or server handlers for this dispatch                            // 62
    // then send a 404.                                                                       // 63
    // XXX we need a solution here for 404s on bad routes.                                    // 64
    //     one solution might be to provide a custom 404 page in the public                   // 65
    //     folder. But we need a proper way to handle 404s for search engines.                // 66
    // XXX might be a PR to Meteor to use an existing status code if it's set                 // 67
    if (!controller.isHandled() && !controller.willBeHandledOnClient()) {                     // 68
      return done();                                                                          // 69
      /*                                                                                      // 70
      res.statusCode = 404;                                                                   // 71
      res.setHeader('Content-Type', 'text/html');                                             // 72
      msg = req.method + ' ' + req.originalUrl + ' not found.';                               // 73
      console.error(msg);                                                                     // 74
      if (req.method == 'HEAD')                                                               // 75
        return res.end();                                                                     // 76
      res.end(msg + '\n');                                                                    // 77
      return;                                                                                 // 78
      */                                                                                      // 79
    }                                                                                         // 80
                                                                                              // 81
    // if for some reason there was a server handler but no client handler                    // 82
    // and the server handler called next() we might end up here. We                          // 83
    // want to make sure to end the response so it doesn't hang.                              // 84
    if (controller.isHandled() && !controller.willBeHandledOnClient()) {                      // 85
      res.setHeader('Content-Type', 'text/html');                                             // 86
      if (req.method === 'HEAD')                                                              // 87
        res.end();                                                                            // 88
      res.end("<p>It looks like you don't have any client routes defined, but you had at least one server handler. You probably want to define some client side routes!</p>\n");
    }                                                                                         // 90
                                                                                              // 91
    // we'll have Meteor load the normal application so long as                               // 92
    // we have at least one client route/handler and the done() iterator                      // 93
    // function has been passed to us, presumably from Connect.                               // 94
    if (controller.willBeHandledOnClient() && done)                                           // 95
      return done(err);                                                                       // 96
  });                                                                                         // 97
};                                                                                            // 98
                                                                                              // 99
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/plugins.js                                                        //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
/**                                                                                           // 1
 * Simple plugin wrapper around the loading hook.                                             // 2
 */                                                                                           // 3
Router.plugins.loading = function (router, options) {                                         // 4
  router.onBeforeAction('loading', options);                                                  // 5
};                                                                                            // 6
                                                                                              // 7
/**                                                                                           // 8
 * Simple plugin wrapper around the dataNotFound hook.                                        // 9
 */                                                                                           // 10
Router.plugins.dataNotFound = function (router, options) {                                    // 11
  router.onBeforeAction('dataNotFound', options);                                             // 12
};                                                                                            // 13
                                                                                              // 14
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/iron:router/lib/global_router.js                                                  //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
Router = new Iron.Router;                                                                     // 1
                                                                                              // 2
if (Meteor.isServer) {                                                                        // 3
  Router.onBeforeAction(Iron.Router.bodyParser.json());                                       // 4
}                                                                                             // 5
                                                                                              // 6
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:router'] = {
  Router: Router,
  RouteController: RouteController
};

})();

//# sourceMappingURL=iron_router.js.map
