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
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var _ = Package.underscore._;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Template = Package.templating.Template;
var Random = Package.random.Random;
var Iron = Package['iron:core'].Iron;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var DynamicTemplate;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:dynamic-template/version_conflict_error.js                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
if (Package['cmather:iron-dynamic-template']) {                                                                   // 1
  throw new Error("\n\n\
    Sorry! The cmather:iron-{x} packages were migrated to the new package system with the wrong name, and you have duplicate copies.\n\
    You can see which cmather:iron-{x} packages have been installed by using this command:\n\n\
    > meteor list\n\n\
    Can you remove any installed cmather:iron-{x} packages like this:\
    \n\n\
    > meteor remove cmather:iron-core\n\
    > meteor remove cmather:iron-router\n\
    > meteor remove cmather:iron-dynamic-template\n\
    > meteor remove cmather:iron-dynamic-layout\n\
    \n\
    The new packages are named iron:{x}. For example:\n\n\
    > meteor add iron:router\n\n\
    Sorry for the hassle, but thank you!\
    \n\n\
  ");                                                                                                             // 17
                                                                                                                  // 18
}                                                                                                                 // 19
                                                                                                                  // 20
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:dynamic-template/template.dynamic_template.js                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
                                                                                                                  // 1
Template.__checkName("__DynamicTemplateError__");                                                                 // 2
Template["__DynamicTemplateError__"] = new Template("Template.__DynamicTemplateError__", (function() {            // 3
  var view = this;                                                                                                // 4
  return HTML.DIV({                                                                                               // 5
    style: "margin: 0 auto; color: red;"                                                                          // 6
  }, "\n    ", Blaze.View(function() {                                                                            // 7
    return Spacebars.mustache(view.lookup("msg"));                                                                // 8
  }), "\n  ");                                                                                                    // 9
}));                                                                                                              // 10
                                                                                                                  // 11
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:dynamic-template/dynamic_template.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*****************************************************************************/                                   // 1
/* Imports */                                                                                                     // 2
/*****************************************************************************/                                   // 3
var debug = Iron.utils.debug('iron:dynamic-template');                                                            // 4
var assert = Iron.utils.assert;                                                                                   // 5
var get = Iron.utils.get;                                                                                         // 6
var camelCase = Iron.utils.camelCase;                                                                             // 7
                                                                                                                  // 8
/*****************************************************************************/                                   // 9
/* Private */                                                                                                     // 10
/*****************************************************************************/                                   // 11
var typeOf = function (value) {                                                                                   // 12
  return Object.prototype.toString.call(value);                                                                   // 13
};                                                                                                                // 14
                                                                                                                  // 15
/*****************************************************************************/                                   // 16
/* DynamicTemplate */                                                                                             // 17
/*****************************************************************************/                                   // 18
                                                                                                                  // 19
/**                                                                                                               // 20
 * Render a component to the page whose template and data context can change                                      // 21
 * dynamically, either from code or from helpers.                                                                 // 22
 *                                                                                                                // 23
 */                                                                                                               // 24
DynamicTemplate = function (options) {                                                                            // 25
  this._id = Random.id();                                                                                         // 26
  this.options = options = options || {};                                                                         // 27
  this._template = options.template;                                                                              // 28
  this._defaultTemplate = options.defaultTemplate;                                                                // 29
  this._content = options.content;                                                                                // 30
  this._data = options.data;                                                                                      // 31
  this._templateDep = new Tracker.Dependency;                                                                     // 32
  this._dataDep = new Tracker.Dependency;                                                                         // 33
                                                                                                                  // 34
  this._lookupHostDep = new Tracker.Dependency;                                                                   // 35
  this._lookupHostValue = null;                                                                                   // 36
                                                                                                                  // 37
  this._hooks = {};                                                                                               // 38
  this._eventMap = null;                                                                                          // 39
  this._eventHandles = null;                                                                                      // 40
  this._eventThisArg = null;                                                                                      // 41
  this.name = options.name || this.constructor.prototype.name || 'DynamicTemplate';                               // 42
                                                                                                                  // 43
  // has the Blaze.View been created?                                                                             // 44
  this.isCreated = false;                                                                                         // 45
                                                                                                                  // 46
  // has the Blaze.View been destroyed and not created again?                                                     // 47
  this.isDestroyed = false;                                                                                       // 48
};                                                                                                                // 49
                                                                                                                  // 50
/**                                                                                                               // 51
 * Get or set the template.                                                                                       // 52
 */                                                                                                               // 53
DynamicTemplate.prototype.template = function (value) {                                                           // 54
  if (arguments.length === 1 && value !== this._template) {                                                       // 55
    this._template = value;                                                                                       // 56
    this._templateDep.changed();                                                                                  // 57
    return;                                                                                                       // 58
  }                                                                                                               // 59
                                                                                                                  // 60
  if (arguments.length > 0)                                                                                       // 61
    return;                                                                                                       // 62
                                                                                                                  // 63
  this._templateDep.depend();                                                                                     // 64
                                                                                                                  // 65
  // do we have a template?                                                                                       // 66
  if (this._template)                                                                                             // 67
    return (typeof this._template === 'function') ? this._template() : this._template;                            // 68
                                                                                                                  // 69
  // no template? ok let's see if we have a default one set                                                       // 70
  if (this._defaultTemplate)                                                                                      // 71
    return (typeof this._defaultTemplate === 'function') ? this._defaultTemplate() : this._defaultTemplate;       // 72
};                                                                                                                // 73
                                                                                                                  // 74
/**                                                                                                               // 75
 * Get or set the default template.                                                                               // 76
 *                                                                                                                // 77
 * This function does not change any dependencies.                                                                // 78
 */                                                                                                               // 79
DynamicTemplate.prototype.defaultTemplate = function (value) {                                                    // 80
  if (arguments.length === 1)                                                                                     // 81
    this._defaultTemplate = value;                                                                                // 82
  else                                                                                                            // 83
    return this._defaultTemplate;                                                                                 // 84
};                                                                                                                // 85
                                                                                                                  // 86
/**                                                                                                               // 87
 * Clear the template and data contexts.                                                                          // 88
 */                                                                                                               // 89
DynamicTemplate.prototype.clear = function () {                                                                   // 90
  //XXX do we need to clear dependencies here too?                                                                // 91
  this._template = undefined;                                                                                     // 92
  this._data = undefined;                                                                                         // 93
  this._templateDep.changed();                                                                                    // 94
};                                                                                                                // 95
                                                                                                                  // 96
/**                                                                                                               // 97
 * Get or set the data context.                                                                                   // 98
 */                                                                                                               // 99
DynamicTemplate.prototype.data = function (value) {                                                               // 100
  if (arguments.length === 1 && value !== this._data) {                                                           // 101
    this._data = value;                                                                                           // 102
    this._dataDep.changed();                                                                                      // 103
    return;                                                                                                       // 104
  }                                                                                                               // 105
                                                                                                                  // 106
  this._dataDep.depend();                                                                                         // 107
  return typeof this._data === 'function' ? this._data() : this._data;                                            // 108
};                                                                                                                // 109
                                                                                                                  // 110
/**                                                                                                               // 111
 * Create the view if it hasn't been created yet.                                                                 // 112
 */                                                                                                               // 113
DynamicTemplate.prototype.create = function (options) {                                                           // 114
  var self = this;                                                                                                // 115
                                                                                                                  // 116
  if (this.isCreated) {                                                                                           // 117
    throw new Error("DynamicTemplate view is already created");                                                   // 118
  }                                                                                                               // 119
                                                                                                                  // 120
  this.isCreated = true;                                                                                          // 121
  this.isDestroyed = false;                                                                                       // 122
                                                                                                                  // 123
  var templateVar = ReactiveVar(null);                                                                            // 124
                                                                                                                  // 125
  var view = Blaze.View('DynamicTemplate', function () {                                                          // 126
    var thisView = this;                                                                                          // 127
                                                                                                                  // 128
    // create the template dependency here because we need the entire                                             // 129
    // dynamic template to re-render if the template changes, including                                           // 130
    // the Blaze.With view.                                                                                       // 131
    var template = templateVar.get();                                                                             // 132
                                                                                                                  // 133
    return Blaze.With(function () {                                                                               // 134
      // NOTE: This will rerun anytime the data function invalidates this                                         // 135
      // computation OR if created from an inclusion helper (see note below) any                                  // 136
      // time any of the argument functions invlidate the computation. For                                        // 137
      // example, when the template changes this function will rerun also. But                                    // 138
      // it's probably generally ok. The more serious use case is to not                                          // 139
      // re-render the entire template every time the data context changes.                                       // 140
      var result = self.data();                                                                                   // 141
                                                                                                                  // 142
      if (typeof result !== 'undefined')                                                                          // 143
        // looks like data was set directly on this dynamic template                                              // 144
        return result;                                                                                            // 145
      else                                                                                                        // 146
        // return the first parent data context that is not inclusion arguments                                   // 147
        return DynamicTemplate.getParentDataContext(thisView);                                                    // 148
    }, function () {                                                                                              // 149
      return self.renderView(template);                                                                           // 150
    });                                                                                                           // 151
  });                                                                                                             // 152
                                                                                                                  // 153
  view.onViewCreated(function () {                                                                                // 154
    this.autorun(function () {                                                                                    // 155
      templateVar.set(self.template());                                                                           // 156
    });                                                                                                           // 157
  });                                                                                                             // 158
                                                                                                                  // 159
  // wire up the view lifecycle callbacks                                                                         // 160
  _.each(['onViewCreated', 'onViewReady', '_onViewRendered', 'onViewDestroyed'], function (hook) {                // 161
    view[hook](function () {                                                                                      // 162
      // "this" is the view instance                                                                              // 163
      self._runHooks(hook, this);                                                                                 // 164
    });                                                                                                           // 165
  });                                                                                                             // 166
                                                                                                                  // 167
  view._onViewRendered(function () {                                                                              // 168
    // avoid inserting the view twice by accident.                                                                // 169
    self.isInserted = true;                                                                                       // 170
                                                                                                                  // 171
    if (view.renderCount !== 1)                                                                                   // 172
      return;                                                                                                     // 173
                                                                                                                  // 174
    self._attachEvents();                                                                                         // 175
  });                                                                                                             // 176
                                                                                                                  // 177
  view._templateInstance = new Blaze.TemplateInstance(view);                                                      // 178
  view.templateInstance = function () {                                                                           // 179
    // Update data, firstNode, and lastNode, and return the TemplateInstance                                      // 180
    // object.                                                                                                    // 181
    var inst = view._templateInstance;                                                                            // 182
                                                                                                                  // 183
    inst.data = Blaze.getData(view);                                                                              // 184
                                                                                                                  // 185
    if (view._domrange && !view.isDestroyed) {                                                                    // 186
      inst.firstNode = view._domrange.firstNode();                                                                // 187
      inst.lastNode = view._domrange.lastNode();                                                                  // 188
    } else {                                                                                                      // 189
      // on 'created' or 'destroyed' callbacks we don't have a DomRange                                           // 190
      inst.firstNode = null;                                                                                      // 191
      inst.lastNode = null;                                                                                       // 192
    }                                                                                                             // 193
                                                                                                                  // 194
    return inst;                                                                                                  // 195
  };                                                                                                              // 196
                                                                                                                  // 197
  this.view = view;                                                                                               // 198
  view.__dynamicTemplate__ = this;                                                                                // 199
  view.name = this.name;                                                                                          // 200
  return view;                                                                                                    // 201
};                                                                                                                // 202
                                                                                                                  // 203
DynamicTemplate.prototype.renderView = function (template) {                                                      // 204
  var self = this;                                                                                                // 205
                                                                                                                  // 206
  // NOTE: When DynamicTemplate is used from a template inclusion helper                                          // 207
  // like this {{> DynamicTemplate template=getTemplate data=getData}} the                                        // 208
  // function below will rerun any time the getData function invalidates the                                      // 209
  // argument data computation.                                                                                   // 210
  var tmpl = null;                                                                                                // 211
                                                                                                                  // 212
  // is it a template name like "MyTemplate"?                                                                     // 213
  if (typeof template === 'string') {                                                                             // 214
    tmpl = Template[template];                                                                                    // 215
                                                                                                                  // 216
    if (!tmpl)                                                                                                    // 217
      // as a fallback double check the user didn't actually define                                               // 218
      // a camelCase version of the template.                                                                     // 219
      tmpl = Template[camelCase(template)];                                                                       // 220
                                                                                                                  // 221
    if (!tmpl) {                                                                                                  // 222
      tmpl = Blaze.With({                                                                                         // 223
        msg: "Couldn't find a template named " + JSON.stringify(template) + " or " + JSON.stringify(camelCase(template))+ ". Are you sure you defined it?"
      }, function () {                                                                                            // 225
        return Template.__DynamicTemplateError__;                                                                 // 226
      });                                                                                                         // 227
    }                                                                                                             // 228
  } else if (typeOf(template) === '[object Object]') {                                                            // 229
    // or maybe a view already?                                                                                   // 230
    tmpl = template;                                                                                              // 231
  } else if (typeof self._content !== 'undefined') {                                                              // 232
    // or maybe its block content like                                                                            // 233
    // {{#DynamicTemplate}}                                                                                       // 234
    //  Some block                                                                                                // 235
    // {{/DynamicTemplate}}                                                                                       // 236
    tmpl = self._content;                                                                                         // 237
  }                                                                                                               // 238
                                                                                                                  // 239
  return tmpl;                                                                                                    // 240
};                                                                                                                // 241
                                                                                                                  // 242
/**                                                                                                               // 243
 * Destroy the dynamic template, also destroying the view if it exists.                                           // 244
 */                                                                                                               // 245
DynamicTemplate.prototype.destroy = function () {                                                                 // 246
  if (this.isCreated) {                                                                                           // 247
    Blaze.remove(this.view);                                                                                      // 248
    this.view = null;                                                                                             // 249
    this.isDestroyed = true;                                                                                      // 250
    this.isCreated = false;                                                                                       // 251
  }                                                                                                               // 252
};                                                                                                                // 253
                                                                                                                  // 254
/**                                                                                                               // 255
 * View lifecycle hooks.                                                                                          // 256
 */                                                                                                               // 257
_.each(['onViewCreated', 'onViewReady', '_onViewRendered', 'onViewDestroyed'], function (hook) {                  // 258
  DynamicTemplate.prototype[hook] = function (cb) {                                                               // 259
    var hooks = this._hooks[hook] = this._hooks[hook] || [];                                                      // 260
    hooks.push(cb);                                                                                               // 261
    return this;                                                                                                  // 262
  };                                                                                                              // 263
});                                                                                                               // 264
                                                                                                                  // 265
DynamicTemplate.prototype._runHooks = function (name, view) {                                                     // 266
  var hooks = this._hooks[name] || [];                                                                            // 267
  var hook;                                                                                                       // 268
                                                                                                                  // 269
  for (var i = 0; i < hooks.length; i++) {                                                                        // 270
    hook = hooks[i];                                                                                              // 271
    // keep the "thisArg" pointing to the view, but make the first parameter to                                   // 272
    // the callback teh dynamic template instance.                                                                // 273
    hook.call(view, this);                                                                                        // 274
  }                                                                                                               // 275
};                                                                                                                // 276
                                                                                                                  // 277
DynamicTemplate.prototype.events = function (eventMap, thisInHandler) {                                           // 278
  var self = this;                                                                                                // 279
                                                                                                                  // 280
  this._detachEvents();                                                                                           // 281
  this._eventThisArg = thisInHandler;                                                                             // 282
                                                                                                                  // 283
  var boundMap = this._eventMap = {};                                                                             // 284
                                                                                                                  // 285
  for (var key in eventMap) {                                                                                     // 286
    boundMap[key] = (function (key, handler) {                                                                    // 287
      return function (e) {                                                                                       // 288
        var data = Blaze.getData(e.currentTarget);                                                                // 289
        if (data == null) data = {};                                                                              // 290
        var tmplInstance = self.view.templateInstance();                                                          // 291
        return handler.call(thisInHandler || this, e, tmplInstance, data);                                        // 292
      }                                                                                                           // 293
    })(key, eventMap[key]);                                                                                       // 294
  }                                                                                                               // 295
                                                                                                                  // 296
  this._attachEvents();                                                                                           // 297
};                                                                                                                // 298
                                                                                                                  // 299
DynamicTemplate.prototype._attachEvents = function () {                                                           // 300
  var self = this;                                                                                                // 301
  var thisArg = self._eventThisArg;                                                                               // 302
  var boundMap = self._eventMap;                                                                                  // 303
  var view = self.view;                                                                                           // 304
  var handles = self._eventHandles;                                                                               // 305
                                                                                                                  // 306
  if (!view)                                                                                                      // 307
    return;                                                                                                       // 308
                                                                                                                  // 309
  var domrange = view._domrange;                                                                                  // 310
                                                                                                                  // 311
  if (!domrange)                                                                                                  // 312
    throw new Error("no domrange");                                                                               // 313
                                                                                                                  // 314
  var attach = function (range, element) {                                                                        // 315
    _.each(boundMap, function (handler, spec) {                                                                   // 316
      var clauses = spec.split(/,\s+/);                                                                           // 317
      // iterate over clauses of spec, e.g. ['click .foo', 'click .bar']                                          // 318
      _.each(clauses, function (clause) {                                                                         // 319
        var parts = clause.split(/\s+/);                                                                          // 320
        if (parts.length === 0)                                                                                   // 321
          return;                                                                                                 // 322
                                                                                                                  // 323
        var newEvents = parts.shift();                                                                            // 324
        var selector = parts.join(' ');                                                                           // 325
        handles.push(Blaze._EventSupport.listen(                                                                  // 326
          element, newEvents, selector,                                                                           // 327
          function (evt) {                                                                                        // 328
            if (! range.containsElement(evt.currentTarget))                                                       // 329
              return null;                                                                                        // 330
            var handlerThis = self._eventThisArg || this;                                                         // 331
            var handlerArgs = arguments;                                                                          // 332
            //XXX which view should this be? What if the event happened                                           // 333
            //somwhere down the hierarchy?                                                                        // 334
            return Blaze._withCurrentView(view, function () {                                                     // 335
              return handler.apply(handlerThis, handlerArgs);                                                     // 336
            });                                                                                                   // 337
          },                                                                                                      // 338
          range, function (r) {                                                                                   // 339
            return r.parentRange;                                                                                 // 340
          }));                                                                                                    // 341
      });                                                                                                         // 342
    });                                                                                                           // 343
  };                                                                                                              // 344
                                                                                                                  // 345
  if (domrange.attached)                                                                                          // 346
    attach(domrange, domrange.parentElement);                                                                     // 347
  else                                                                                                            // 348
    domrange.onAttached(attach);                                                                                  // 349
};                                                                                                                // 350
                                                                                                                  // 351
DynamicTemplate.prototype._detachEvents = function () {                                                           // 352
  _.each(this._eventHandles, function (h) { h.stop(); });                                                         // 353
  this._eventHandles = [];                                                                                        // 354
};                                                                                                                // 355
                                                                                                                  // 356
var attachEventMaps = function (range, element, eventMap, thisInHandler) {                                        // 357
  _.each(eventMap, function (handler, spec) {                                                                     // 358
    var clauses = spec.split(/,\s+/);                                                                             // 359
    // iterate over clauses of spec, e.g. ['click .foo', 'click .bar']                                            // 360
    _.each(clauses, function (clause) {                                                                           // 361
      var parts = clause.split(/\s+/);                                                                            // 362
      if (parts.length === 0)                                                                                     // 363
        return;                                                                                                   // 364
                                                                                                                  // 365
      var newEvents = parts.shift();                                                                              // 366
      var selector = parts.join(' ');                                                                             // 367
      handles.push(Blaze._EventSupport.listen(                                                                    // 368
        element, newEvents, selector,                                                                             // 369
        function (evt) {                                                                                          // 370
          if (! range.containsElement(evt.currentTarget))                                                         // 371
            return null;                                                                                          // 372
          var handlerThis = thisInHandler || this;                                                                // 373
          var handlerArgs = arguments;                                                                            // 374
          return Blaze._withCurrentView(view, function () {                                                       // 375
            return handler.apply(handlerThis, handlerArgs);                                                       // 376
          });                                                                                                     // 377
        },                                                                                                        // 378
        range, function (r) {                                                                                     // 379
          return r.parentRange;                                                                                   // 380
        }));                                                                                                      // 381
    });                                                                                                           // 382
  });                                                                                                             // 383
};                                                                                                                // 384
                                                                                                                  // 385
/**                                                                                                               // 386
 * Insert the Layout view into the dom.                                                                           // 387
 */                                                                                                               // 388
DynamicTemplate.prototype.insert = function (options) {                                                           // 389
  options = options || {};                                                                                        // 390
                                                                                                                  // 391
  if (this.isInserted)                                                                                            // 392
    return;                                                                                                       // 393
  this.isInserted = true;                                                                                         // 394
                                                                                                                  // 395
  var el = options.el || document.body;                                                                           // 396
  var $el = $(el);                                                                                                // 397
                                                                                                                  // 398
  if ($el.length === 0)                                                                                           // 399
    throw new Error("No element to insert layout into. Is your element defined? Try a Meteor.startup callback."); // 400
                                                                                                                  // 401
  if (!this.view)                                                                                                 // 402
    this.create(options);                                                                                         // 403
                                                                                                                  // 404
  Blaze.render(this.view, $el[0], options.nextNode, options.parentView);                                          // 405
                                                                                                                  // 406
  return this;                                                                                                    // 407
};                                                                                                                // 408
                                                                                                                  // 409
/**                                                                                                               // 410
 * Reactively return the value of the current lookup host or null if there                                        // 411
 * is no lookup host.                                                                                             // 412
 */                                                                                                               // 413
DynamicTemplate.prototype._getLookupHost = function () {                                                          // 414
  return this._lookupHostValue;                                                                                   // 415
};                                                                                                                // 416
                                                                                                                  // 417
/**                                                                                                               // 418
 * Set the reactive value of the lookup host.                                                                     // 419
 *                                                                                                                // 420
 */                                                                                                               // 421
DynamicTemplate.prototype._setLookupHost = function (host) {                                                      // 422
  var self = this;                                                                                                // 423
                                                                                                                  // 424
  if (self._lookupHostValue !== host) {                                                                           // 425
    self._lookupHostValue = host;                                                                                 // 426
    Deps.afterFlush(function () {                                                                                 // 427
      // if the lookup host changes and the template also changes                                                 // 428
      // before the next flush cycle, this gives the new template                                                 // 429
      // a chance to render, and the old template to be torn off                                                  // 430
      // the page (including stopping its computation) before the                                                 // 431
      // lookupHostDep is changed.                                                                                // 432
      self._lookupHostDep.changed();                                                                              // 433
    });                                                                                                           // 434
  }                                                                                                               // 435
                                                                                                                  // 436
  return this;                                                                                                    // 437
};                                                                                                                // 438
                                                                                                                  // 439
/*****************************************************************************/                                   // 440
/* DynamicTemplate Static Methods */                                                                              // 441
/*****************************************************************************/                                   // 442
                                                                                                                  // 443
/**                                                                                                               // 444
 * Get the first parent data context that are not inclusion arguments                                             // 445
 * (see above function). Note: This function can create reactive dependencies.                                    // 446
 */                                                                                                               // 447
DynamicTemplate.getParentDataContext = function (view) {                                                          // 448
  return DynamicTemplate.getDataContext(view && view.parentView);                                                 // 449
};                                                                                                                // 450
                                                                                                                  // 451
/**                                                                                                               // 452
 * Get the first data context that is not inclusion arguments.                                                    // 453
 */                                                                                                               // 454
DynamicTemplate.getDataContext = function (view) {                                                                // 455
  while (view) {                                                                                                  // 456
    if (view.name === 'with' && !view.__isTemplateWith)                                                           // 457
      return view.dataVar.get();                                                                                  // 458
    else                                                                                                          // 459
      view = view.parentView;                                                                                     // 460
  }                                                                                                               // 461
                                                                                                                  // 462
  return null;                                                                                                    // 463
};                                                                                                                // 464
                                                                                                                  // 465
/**                                                                                                               // 466
 * Get inclusion arguments, if any, from a view.                                                                  // 467
 *                                                                                                                // 468
 * Uses the __isTemplateWith property set when a parent view is used                                              // 469
 * specificially for a data context with inclusion args.                                                          // 470
 *                                                                                                                // 471
 * Inclusion arguments are arguments provided in a template like this:                                            // 472
 * {{> yield "inclusionArg"}}                                                                                     // 473
 * or                                                                                                             // 474
 * {{> yield region="inclusionArgValue"}}                                                                         // 475
 */                                                                                                               // 476
DynamicTemplate.getInclusionArguments = function (view) {                                                         // 477
  var parent = view && view.parentView;                                                                           // 478
                                                                                                                  // 479
  if (!parent)                                                                                                    // 480
    return null;                                                                                                  // 481
                                                                                                                  // 482
  if (parent.__isTemplateWith)                                                                                    // 483
    return parent.dataVar.get();                                                                                  // 484
                                                                                                                  // 485
  return null;                                                                                                    // 486
};                                                                                                                // 487
                                                                                                                  // 488
/**                                                                                                               // 489
 * Given a view, return a function that can be used to access argument values at                                  // 490
 * the time the view was rendered. There are two key benefits:                                                    // 491
 *                                                                                                                // 492
 * 1. Save the argument data at the time of rendering. When you use lookup(...)                                   // 493
 *    it starts from the current data context which can change.                                                   // 494
 * 2. Defer creating a dependency on inclusion arguments until later.                                             // 495
 *                                                                                                                // 496
 * Example:                                                                                                       // 497
 *                                                                                                                // 498
 *   {{> MyTemplate template="MyTemplate"                                                                         // 499
 *   var args = DynamicTemplate.args(view);                                                                       // 500
 *   var tmplValue = args('template');                                                                            // 501
 *     => "MyTemplate"                                                                                            // 502
 */                                                                                                               // 503
DynamicTemplate.args = function (view) {                                                                          // 504
  return function (key) {                                                                                         // 505
    var data = DynamicTemplate.getInclusionArguments(view);                                                       // 506
                                                                                                                  // 507
    if (data) {                                                                                                   // 508
      if (key)                                                                                                    // 509
        return data[key];                                                                                         // 510
      else                                                                                                        // 511
        return data;                                                                                              // 512
    }                                                                                                             // 513
                                                                                                                  // 514
    return null;                                                                                                  // 515
  };                                                                                                              // 516
};                                                                                                                // 517
                                                                                                                  // 518
/**                                                                                                               // 519
 * Inherit from DynamicTemplate.                                                                                  // 520
 */                                                                                                               // 521
DynamicTemplate.extend = function (props) {                                                                       // 522
  return Iron.utils.extend(this, props);                                                                          // 523
};                                                                                                                // 524
                                                                                                                  // 525
DynamicTemplate.findFirstLookupHost = function (view) {                                                           // 526
  var host;                                                                                                       // 527
  var helper;                                                                                                     // 528
  assert(view instanceof Blaze.View, "view must be a Blaze.View");                                                // 529
  while (view) {                                                                                                  // 530
    if (view.__dynamicTemplate__) {                                                                               // 531
      // creates a reactive dependency.                                                                           // 532
      var host = view.__dynamicTemplate__._getLookupHost();                                                       // 533
      if (host) return host;                                                                                      // 534
    } else {                                                                                                      // 535
      view = view.parentView;                                                                                     // 536
    }                                                                                                             // 537
  }                                                                                                               // 538
                                                                                                                  // 539
  return undefined;                                                                                               // 540
};                                                                                                                // 541
                                                                                                                  // 542
DynamicTemplate.findLookupHostWithProperty = function (view, key) {                                               // 543
  var host;                                                                                                       // 544
  var prop;                                                                                                       // 545
  assert(view instanceof Blaze.View, "view must be a Blaze.View");                                                // 546
  while (view) {                                                                                                  // 547
    if (view.__dynamicTemplate__) {                                                                               // 548
                                                                                                                  // 549
      // creates a reactive dependency                                                                            // 550
      var host = view.__dynamicTemplate__._getLookupHost();                                                       // 551
                                                                                                                  // 552
      if (host && get(host, key)) {                                                                               // 553
        return host;                                                                                              // 554
      }                                                                                                           // 555
    }                                                                                                             // 556
                                                                                                                  // 557
    view = view.parentView;                                                                                       // 558
  }                                                                                                               // 559
                                                                                                                  // 560
  return undefined;                                                                                               // 561
};                                                                                                                // 562
                                                                                                                  // 563
/**                                                                                                               // 564
 * Find a lookup host that has a given helper and returns the host. Note,                                         // 565
 * this will create a reactive dependency on each dynamic template's getLookupHost                                // 566
 * function. This is required becuase we need to rerun the entire lookup if                                       // 567
 * the host changes or is added or removed later, anywhere in the chain.                                          // 568
 */                                                                                                               // 569
DynamicTemplate.findLookupHostWithHelper = function (view, helperKey) {                                           // 570
  var host;                                                                                                       // 571
  var helper;                                                                                                     // 572
  assert(view instanceof Blaze.View, "view must be a Blaze.View");                                                // 573
  while (view) {                                                                                                  // 574
    if (view.__dynamicTemplate__) {                                                                               // 575
      // creates a reactive dependency                                                                            // 576
      var host = view.__dynamicTemplate__._getLookupHost();                                                       // 577
      if (host && get(host, 'constructor', '_helpers', helperKey)) {                                              // 578
        return host;                                                                                              // 579
      }                                                                                                           // 580
    }                                                                                                             // 581
                                                                                                                  // 582
    view = view.parentView;                                                                                       // 583
  }                                                                                                               // 584
                                                                                                                  // 585
  return undefined;                                                                                               // 586
};                                                                                                                // 587
                                                                                                                  // 588
/*****************************************************************************/                                   // 589
/* UI Helpers */                                                                                                  // 590
/*****************************************************************************/                                   // 591
if (typeof Template !== 'undefined') {                                                                            // 592
  UI.registerHelper('DynamicTemplate', new Template('DynamicTemplateHelper', function () {                        // 593
    var args = DynamicTemplate.args(this);                                                                        // 594
                                                                                                                  // 595
    return new DynamicTemplate({                                                                                  // 596
      data: function () { return args('data'); },                                                                 // 597
      template: function () { return args('template'); },                                                         // 598
      content: this.templateContentBlock                                                                          // 599
    }).create();                                                                                                  // 600
  }));                                                                                                            // 601
}                                                                                                                 // 602
                                                                                                                  // 603
/*****************************************************************************/                                   // 604
/* Namespacing */                                                                                                 // 605
/*****************************************************************************/                                   // 606
Iron.DynamicTemplate = DynamicTemplate;                                                                           // 607
                                                                                                                  // 608
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:dynamic-template/blaze_overrides.js                                                              //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*****************************************************************************/                                   // 1
/* Imports */                                                                                                     // 2
/*****************************************************************************/                                   // 3
var assert = Iron.utils.assert;                                                                                   // 4
var get = Iron.utils.get;                                                                                         // 5
                                                                                                                  // 6
/*****************************************************************************/                                   // 7
/* Blaze Overrides */                                                                                             // 8
/*****************************************************************************/                                   // 9
/**                                                                                                               // 10
 * Adds ability to inject lookup hosts into views that can participate in                                         // 11
 * property lookup. For example, iron:controller or iron:component could make                                     // 12
 * use of this to add methods into the lookup chain. If the property is found,                                    // 13
 * a function is returned that either returns the property value or the result                                    // 14
 * of calling the function (bound to the __lookupHost__).                                                         // 15
 */                                                                                                               // 16
var origLookup = Blaze.View.prototype.lookup;                                                                     // 17
Blaze.View.prototype.lookup = function (name /*, args */) {                                                       // 18
  var host = DynamicTemplate.findLookupHostWithHelper(Blaze.getView(), name);                                     // 19
                                                                                                                  // 20
  if (host) {                                                                                                     // 21
    return function callLookupHostHelper (/* args */) {                                                           // 22
      var helper = get(host, 'constructor', '_helpers', name);                                                    // 23
      var args = [].slice.call(arguments);                                                                        // 24
      return (typeof helper === 'function') ? helper.apply(host, args) : helper;                                  // 25
    }                                                                                                             // 26
  } else {                                                                                                        // 27
    return origLookup.apply(this, arguments);                                                                     // 28
  }                                                                                                               // 29
};                                                                                                                // 30
                                                                                                                  // 31
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:dynamic-template'] = {};

})();
