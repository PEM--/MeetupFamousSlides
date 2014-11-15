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
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Template = Package.templating.Template;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ObserveSequence = Package['observe-sequence'].ObserveSequence;
var Pince = Package['jag:pince'].Pince;
var Logger = Package['jag:pince'].Logger;
var MicroEvent = Package['jag:pince'].MicroEvent;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var FView, log, Transform, optionString, handleOptions, options, MeteorFamousView, throwError, sequencer, parentViewName, parentTemplateName, runRenderedCallback, key;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/famous-views.js                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var mainCtx = null;                                                                                              // 1
                                                                                                                 // 2
// Could use something from --settings too                                                                       // 3
var isDev = ("localhost" === window.location.hostname);                                                          // 4
                                                                                                                 // 5
log = new Logger('famous-views');                                                                                // 6
Logger.setLevel('famous-views', isDev ? 'trace' : 'info');                                                       // 7
                                                                                                                 // 8
FView = {};                                                                                                      // 9
                                                                                                                 // 10
var readyQueue = [];                                                                                             // 11
var readyDep = new Tracker.Dependency;                                                                           // 12
FView.ready = function(func) {                                                                                   // 13
	if (func) {                                                                                                     // 14
    if (FView.isReady)                                                                                           // 15
      func();                                                                                                    // 16
    else                                                                                                         // 17
		  readyQueue.push(func);                                                                                       // 18
  } else {                                                                                                       // 19
		readyDep.depend();                                                                                             // 20
		return FView.isReady;                                                                                          // 21
	}                                                                                                               // 22
}                                                                                                                // 23
FView.runReadies = function() {                                                                                  // 24
	FView.isReady = true;                                                                                           // 25
	readyDep.changed();                                                                                             // 26
	while(readyQueue.length) {                                                                                      // 27
		(readyQueue.shift())();                                                                                        // 28
	}                                                                                                               // 29
}                                                                                                                // 30
                                                                                                                 // 31
// famous-views globals from Famous                                                                              // 32
Transform = null;                                                                                                // 33
                                                                                                                 // 34
if (typeof(famous) === 'undefined' && typeof(define) !== 'undefined')                                            // 35
define(function(require) {                                                                                       // 36
//  console.log(1);                                                                                              // 37
});                                                                                                              // 38
                                                                                                                 // 39
FView.startup = function() {                                                                                     // 40
  log.debug('Current logging default is "debug" (for localhost).  '                                              // 41
    + 'Change in your app with Logger.setLevel("famous-views", "info");');                                       // 42
  FView.startedUp = true;                                                                                        // 43
                                                                                                                 // 44
  famous.polyfills;                                                                                              // 45
  famous.core.famous;                                                                                            // 46
  Transform = famous.core.Transform;                                                                             // 47
                                                                                                                 // 48
  // Note, various views are registered here                                                                     // 49
  FView.runReadies();                                                                                            // 50
                                                                                                                 // 51
  // Required document.body                                                                                      // 52
  Meteor.startup(function() {                                                                                    // 53
                                                                                                                 // 54
    // Sanity check, disallow templates with same name as a View                                                 // 55
    var names = [];                                                                                              // 56
    for (var name in FView.views)                                                                                // 57
      if (Template[name])                                                                                        // 58
        names.push(name);                                                                                        // 59
    if (names.length)                                                                                            // 60
      throw new Error("You have created Template(s) with the same name "                                         // 61
        + "as these famous-views: " + names.join(', ')                                                           // 62
        + '.  Nothing will work until you rename them.');                                                        // 63
                                                                                                                 // 64
    if (FView.mainCtx)                                                                                           // 65
      mainCtx = FView.mainCtx;                                                                                   // 66
    else {                                                                                                       // 67
      if (FView.mainCtx !== false)                                                                               // 68
        log.debug('Creating a new main context.  If you already have '                                           // 69
          + 'your own, set FView.mainCtx = yourMainContext (or to false to get '                                 // 70
          + 'rid of this warning)');                                                                             // 71
      FView.mainCtx = mainCtx = famous.core.Engine.createContext();                                              // 72
    }                                                                                                            // 73
                                                                                                                 // 74
    if (Template.famousInit)                                                                                     // 75
      Blaze.render(Template.famousInit, document.body);                                                          // 76
  });                                                                                                            // 77
};                                                                                                               // 78
                                                                                                                 // 79
FView.isReady = false;                                                                                           // 80
                                                                                                                 // 81
// Imports from weak deps                                                                                        // 82
/*                                                                                                               // 83
if (Package['mjnetworks:famous'])                                                                                // 84
  // @famono ignore                                                                                              // 85
  famous = Package['mjnetworks:famous'].famous;                                                                  // 86
else if (Package['mjnetworks:mj-famous'])                                                                        // 87
  // @famono ignore                                                                                              // 88
  famous = Package['mjnetworks:mj-famous'].famous;                                                               // 89
*/                                                                                                               // 90
                                                                                                                 // 91
// Load as ealry as possible, and keep trying                                                                    // 92
if (typeof(famous) !== 'undefined') {                                                                            // 93
  log.debug("Starting up.  famous global found while loading package, great!");                                  // 94
  FView.startup();                                                                                               // 95
}                                                                                                                // 96
else                                                                                                             // 97
  Meteor.startup(function() {                                                                                    // 98
    if (typeof(famous) !== 'undefined') {                                                                        // 99
      log.debug("Starting up.  famous global found during Meteor.startup()");                                    // 100
    	FView.startup();                                                                                            // 101
    } else {                                                                                                     // 102
      log.debug("No famous global available in Meteor.startup().  Call FView.startup() when appropriate.");      // 103
    }                                                                                                            // 104
  });                                                                                                            // 105
                                                                                                                 // 106
optionString = function(string) {                                                                                // 107
  if (string == 'undefined')                                                                                     // 108
    return undefined;                                                                                            // 109
  if (string == 'true')                                                                                          // 110
    return true;                                                                                                 // 111
  if (string == 'false')                                                                                         // 112
    return false;                                                                                                // 113
  if (string === null)                                                                                           // 114
    return null;                                                                                                 // 115
                                                                                                                 // 116
  if (string[0] == '[' || string[0] == '{') {                                                                    // 117
    var obj;                                                                                                     // 118
    string = string.replace(/\bauto\b/g, '"auto"');                                                              // 119
    string = string.replace(/undefined/g, '"__undefined__"');                                                    // 120
    // JSON can't parse values like ".5" so convert them to "0.5"                                                // 121
    string = string.replace(/([\[\{,]+)(\W*)(\.[0-9])/g, '$1$20$3');                                             // 122
                                                                                                                 // 123
    try {                                                                                                        // 124
      obj = JSON.parse(string);                                                                                  // 125
    }                                                                                                            // 126
    catch (err) {                                                                                                // 127
      log.error("Couldn't parse JSON, skipping: " + string);                                                     // 128
      log.error(err);                                                                                            // 129
      return undefined;                                                                                          // 130
    }                                                                                                            // 131
                                                                                                                 // 132
    for (var key in obj)                                                                                         // 133
      if (obj[key] === '__undefined__')                                                                          // 134
        obj[key] = undefined;                                                                                    // 135
    return obj;                                                                                                  // 136
  } else {                                                                                                       // 137
    var float = parseFloat(string);                                                                              // 138
    if (!_.isNaN(float))                                                                                         // 139
      return float;                                                                                              // 140
    return string;                                                                                               // 141
  }                                                                                                              // 142
                                                                                                                 // 143
  /*                                                                                                             // 144
  if (string == 'undefined')                                                                                     // 145
    return undefined;                                                                                            // 146
  if (string == 'true')                                                                                          // 147
    return true;                                                                                                 // 148
  if (string == 'false')                                                                                         // 149
    return false;                                                                                                // 150
  if (string.substr(0,1) == '[') {                                                                               // 151
    var out = [];                                                                                                // 152
    string = string.substr(1, string.length-2).split(',');                                                       // 153
    for (var i=0; i < string.length; i++)                                                                        // 154
      out.push(optionString(string[i].trim()));                                                                  // 155
    return out;                                                                                                  // 156
  }                                                                                                              // 157
  if (string.match(/^[0-9\.]+$/))                                                                                // 158
    return parseFloat(string);                                                                                   // 159
  */                                                                                                             // 160
}                                                                                                                // 161
                                                                                                                 // 162
handleOptions = function(data) {                                                                                 // 163
  options = {};                                                                                                  // 164
  for (var key in data) {                                                                                        // 165
    var value = data[key];                                                                                       // 166
    if (_.isString(value))                                                                                       // 167
      options[key] = optionString(value);                                                                        // 168
    else                                                                                                         // 169
      options[key] = value;                                                                                      // 170
  }                                                                                                              // 171
  return options;                                                                                                // 172
}                                                                                                                // 173
                                                                                                                 // 174
/* --- totally not done --- */                                                                                   // 175
                                                                                                                 // 176
FView.showTreeGet = function(renderNode) {                                                                       // 177
  var obj = renderNode._node._child._object;                                                                     // 178
    if (obj.node)                                                                                                // 179
      obj.node = this.showTreeGet(obj.node);                                                                     // 180
  return obj;                                                                                                    // 181
}                                                                                                                // 182
FView.showTreeChildren = function(renderNode) {                                                                  // 183
  var out = {}, i=0;                                                                                             // 184
  if (renderNode._node)                                                                                          // 185
    out['child'+(i++)] = this.showTreeGet(renderNode)                                                            // 186
  return out;                                                                                                    // 187
}                                                                                                                // 188
FView.showTree = function() {                                                                                    // 189
  console.log(this.showTreeChildren(mainCtx));                                                                   // 190
}                                                                                                                // 191
                                                                                                                 // 192
/* --- */                                                                                                        // 193
                                                                                                                 // 194
                                                                                                                 // 195
                                                                                                                 // 196
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/meteorFamousView.js                                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/*                                                                                                               // 1
 * Templates are always added to a MeteorFamousView ("fview"), in turn is                                        // 2
 * added to it's parent fview or a context.  This allows us to handle                                            // 3
 * situations where a template is later removed (since nodes cannot ever                                         // 4
 * be manually removed from the render tree).                                                                    // 5
 *                                                                                                               // 6
 * http://stackoverflow.com/questions/23087980/how-to-remove-nodes-from-the-ren                                  // 7
 */                                                                                                              // 8
                                                                                                                 // 9
var meteorFamousViews = {};                                                                                      // 10
var meteorFamousViewsCount = 0;                                                                                  // 11
                                                                                                                 // 12
MeteorFamousView = function(blazeView, options, noAdd) {                                                         // 13
  this.id = options.id || ++meteorFamousViewsCount;                                                              // 14
  meteorFamousViews[this.id] = this;                                                                             // 15
                                                                                                                 // 16
  this.blazeView = blazeView;                                                                                    // 17
  this.children = [];                                                                                            // 18
                                                                                                                 // 19
  // this._callbacks = { destroy: [] };                                                                          // 20
                                                                                                                 // 21
  if (noAdd)                                                                                                     // 22
    return;                                                                                                      // 23
                                                                                                                 // 24
  var parent = blazeView;                                                                                        // 25
  while ((parent=parent.parentView) && !parent.fview);                                                           // 26
  parent = parent ? parent.fview : { node: FView.mainCtx, children: [] };                                        // 27
                                                                                                                 // 28
  this.parent = parent;                                                                                          // 29
                                                                                                                 // 30
  // Keep track of fview children, since Meteor only tracks children in DOM                                      // 31
  parent.children.push(this);                                                                                    // 32
                                                                                                                 // 33
  // Adding to famous parent node, once done here, is now in famous.js                                           // 34
}                                                                                                                // 35
                                                                                                                 // 36
MeteorFamousView.prototype.render = function() {                                                                 // 37
  if (this.isDestroyed)                                                                                          // 38
    return [];                                                                                                   // 39
  if (this.node)                                                                                                 // 40
    return this.node.render();                                                                                   // 41
  console.log('render called before anything set');                                                              // 42
  return [];                                                                                                     // 43
}                                                                                                                // 44
                                                                                                                 // 45
MeteorFamousView.prototype.setNode = function(node) {                                                            // 46
  // surface or modifier/view                                                                                    // 47
  this.node = new famous.core.RenderNode(node);                                                                  // 48
  return this.node;                                                                                              // 49
}                                                                                                                // 50
                                                                                                                 // 51
/*                                                                                                               // 52
  Replace fview.onDestroy = function() with fview.on('destroy', function)                                        // 53
  which can be called multiple times.  The old way will still work                                               // 54
  but will show a deprecation warning.                                                                           // 55
                                                                                                                 // 56
MeteorFamousView.prototype.onDestroy = function() {                                                              // 57
  return '__original__';                                                                                         // 58
}                                                                                                                // 59
*/                                                                                                               // 60
                                                                                                                 // 61
MeteorFamousView.prototype.preventDestroy = function() {                                                         // 62
	this.destroyPrevented = true;	                                                                                  // 63
}                                                                                                                // 64
                                                                                                                 // 65
MeteorFamousView.prototype.destroy = function(isTemplateDestroy) {                                               // 66
  var fview = this;                                                                                              // 67
  log.debug('Destroying ' + (fview._view ? fview._view.name : fview.kind)                                        // 68
    + ' (#' + fview.id + ') and children'                                                                        // 69
    + (isTemplateDestroy&&fview.destroyPrevented ? ' (destroyPrevented)':''));                                   // 70
                                                                                                                 // 71
  // XXX ADD TO DOCS                                                                                             // 72
  if (isTemplateDestroy) {                                                                                       // 73
                                                                                                                 // 74
    /*                                                                                                           // 75
    if (fview.onDestroy() === '__original__')                                                                    // 76
      for (var i=0; i < fview._callbacks.destroy.length; i++)                                                    // 77
        fview._calbacks.destroy[i].call(fview);                                                                  // 78
    else                                                                                                         // 79
      log.warn('#' + fview.id + ' - you set fview.onDestroy = function().  '                                     // 80
        + 'This will work for now '                                                                              // 81
        + 'but is deprecated.  Please use fview.onDestoy(callback), which may '                                  // 82
        + 'be used multiple times, and receives the `fview` as `this`.');                                        // 83
    */                                                                                                           // 84
                                                                                                                 // 85
    if (fview.onDestroy)                                                                                         // 86
      fview.onDestroy();                                                                                         // 87
                                                                                                                 // 88
    if (fview.destroyPrevented) {                                                                                // 89
      // log.debug('  #' + fview.id + ' - destroyPrevented');                                                    // 90
      return;                                                                                                    // 91
    }                                                                                                            // 92
  }                                                                                                              // 93
                                                                                                                 // 94
  // First delete children (via Blaze to trigger Template destroy callback)                                      // 95
  if (fview.children)                                                                                            // 96
    for (var i=0; i < fview.children.length; i++)                                                                // 97
      Blaze.remove(fview.children[i].blazeView);                                                                 // 98
                                                                                                                 // 99
  fview.isDestroyed = true;                                                                                      // 100
  fview.node = null;                                                                                             // 101
  fview.view = null;                                                                                             // 102
  fview.modifier = null;                                                                                         // 103
  delete(meteorFamousViews[fview.id]);                                                                           // 104
                                                                                                                 // 105
  // If we're part of a sequence, now is the time to remove ourselves                                            // 106
  if (fview.parent.sequence) {                                                                                   // 107
    if (fview.sequence) {                                                                                        // 108
      // TODO, we're a child sequence, remove the child (TODO in sequencer.js)                                   // 109
      // log.debug("child sequence");                                                                            // 110
    } else {                                                                                                     // 111
      _.defer(function() {                                                                                       // 112
        fview.parent.sequence.remove(fview);  // less flicker in a defer                                         // 113
      });                                                                                                        // 114
    }                                                                                                            // 115
  }                                                                                                              // 116
}                                                                                                                // 117
                                                                                                                 // 118
MeteorFamousView.prototype.getSize = function() {                                                                // 119
  return this.node && this.node.getSize() || this.size || [true,true];                                           // 120
}                                                                                                                // 121
                                                                                                                 // 122
throwError = function(startStr, object) {                                                                        // 123
  if (object instanceof Object)                                                                                  // 124
    console.error(object);                                                                                       // 125
  throw new Error('FView.getData() expects BlazeView or TemplateInstance or '                                    // 126
      + 'DOM node, but got ' + object);                                                                          // 127
}                                                                                                                // 128
                                                                                                                 // 129
FView.from = function(viewOrTplorEl) {                                                                           // 130
  if (viewOrTplorEl instanceof Blaze.View)                                                                       // 131
    return FView.fromBlazeView(viewOrTplorEl);                                                                   // 132
  else if (viewOrTplorEl instanceof Blaze.TemplateInstance)                                                      // 133
    return FView.fromTemplate(viewOrTplorEl);                                                                    // 134
  else if (viewOrTplorEl && typeof viewOrTplorEl.nodeType === 'number')                                          // 135
    return FView.fromElement(viewOrTplorEl);                                                                     // 136
  else {                                                                                                         // 137
    throwError('FView.getData() expects BlazeView or TemplateInstance or '                                       // 138
        + 'DOM node, but got ', viewOrTplorEl);                                                                  // 139
  }                                                                                                              // 140
}                                                                                                                // 141
                                                                                                                 // 142
FView.fromBlazeView = FView.dataFromView = function(view) {                                                      // 143
  while ((view=view.parentView) && !view.fview);                                                                 // 144
  return view ? view.fview : undefined;                                                                          // 145
}                                                                                                                // 146
                                                                                                                 // 147
FView.fromTemplate = FView.dataFromTemplate = function(tplInstance) {                                            // 148
  return this.dataFromView(tplInstance.view);                                                                    // 149
}                                                                                                                // 150
                                                                                                                 // 151
FView.fromElement = FView.dataFromElement = function(el) {                                                       // 152
  var view = Blaze.getView(el);                                                                                  // 153
  return this.dataFromView(view);                                                                                // 154
}                                                                                                                // 155
                                                                                                                 // 156
FView.byId = function(id) {                                                                                      // 157
  return meteorFamousViews[id];                                                                                  // 158
}                                                                                                                // 159
                                                                                                                 // 160
// Leave as alias?  Deprecate?                                                                                   // 161
FView.dataFromCmp = FView.dataFromComponent;                                                                     // 162
FView.dataFromTpl = FView.dataFromTemplate;                                                                      // 163
                                                                                                                 // 164
FView.dataFromComponent = function(component) {                                                                  // 165
  log.warn("FView.dataFromComponent has been deprecated.  Please use 'FView.fromBlazeView' instead.");           // 166
  return FView.fromBlazeView(component);                                                                         // 167
}                                                                                                                // 168
                                                                                                                 // 169
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/sequencer.js                                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/* Sequencer and childSequence */                                                                                // 1
                                                                                                                 // 2
sequencer = function(parent) {                                                                                   // 3
  this._sequence = [];                                                                                           // 4
  this._children = [];                                                                                           // 5
                                                                                                                 // 6
  if (parent) {                                                                                                  // 7
    this.parent = parent;                                                                                        // 8
    this.childNo = parent._children.length;                                                                      // 9
    this.startIndex = parent._sequence.length;                                                                   // 10
  }                                                                                                              // 11
}                                                                                                                // 12
                                                                                                                 // 13
// TODO, refactor + cleanup for constructor                                                                      // 14
sequencer.prototype.child = function(index) {                                                                    // 15
  var child = new sequencer(this);                                                                               // 16
                                                                                                                 // 17
  if (typeof index !== 'undefined') {                                                                            // 18
    child.childNo = index;                                                                                       // 19
    child.startIndex = index < this._children.length                                                             // 20
      ? this._children[index].startIndex : this._sequence.length;                                                // 21
    // Recall for below loop that child has not been inserted yet                                                // 22
    for (var i=index; i < this._children.length; i++)                                                            // 23
      this._children[i].childNo++;                                                                               // 24
  } else                                                                                                         // 25
    index = this._children.length;                                                                               // 26
                                                                                                                 // 27
  this._children.splice(index, 0, child);                                                                        // 28
  return child;                                                                                                  // 29
}                                                                                                                // 30
                                                                                                                 // 31
/*                                                                                                               // 32
 * For both functions below:                                                                                     // 33
 *                                                                                                               // 34
 *   1. Splice into correct position in parent sequencer's _sequence                                             // 35
 *   2. Update the startIndex of all siblings born after us                                                      // 36
 *   3. Modify our own _sequence                                                                                 // 37
 */                                                                                                              // 38
                                                                                                                 // 39
sequencer.prototype.push = function(value) {                                                                     // 40
  if (this.parent) {                                                                                             // 41
    this.parent.splice(this.startIndex+this._sequence.length, 0, value);                                         // 42
    for (var i=this.childNo+1; i < this.parent._children.length; i++) {                                          // 43
      this.parent._children[i].startIndex++;                                                                     // 44
    }                                                                                                            // 45
  }                                                                                                              // 46
  return this._sequence.push(value);                                                                             // 47
}                                                                                                                // 48
                                                                                                                 // 49
sequencer.prototype.splice = function(index, howMany /*, arguments */) {                                         // 50
  if (!this.parent)                                                                                              // 51
    return this._sequence.splice.apply(this._sequence, arguments);                                               // 52
                                                                                                                 // 53
  var diff, max = this._sequence.length - index;                                                                 // 54
  if (howMany > max) howMany = max;                                                                              // 55
  diff = (arguments.length - 2) - howMany; // inserts - howMany                                                  // 56
                                                                                                                 // 57
  for (var i=this.childNo+1; i < this.parent._children.length; i++)                                              // 58
    this.parent._children[i].startIndex += diff;                                                                 // 59
                                                                                                                 // 60
  this._sequence.splice.apply(this._sequence, arguments);                                                        // 61
  arguments[0] += this.startIndex;  // add startIndex and re-use args                                            // 62
  return this.parent.splice.apply(this.parent, arguments);                                                       // 63
}                                                                                                                // 64
                                                                                                                 // 65
/*                                                                                                               // 66
 * Currently we don't keep track of our children and descedent children separately,                              // 67
 * so grandChild.push(x) && parent.remove(x) would break everything :)                                           // 68
 */                                                                                                              // 69
sequencer.prototype.remove = function(value /*, suspectedIndex */) {                                             // 70
  var index;                                                                                                     // 71
  for (index=0; index < this._sequence.length; index++)                                                          // 72
    if (this._sequence[index] === value)                                                                         // 73
      return this.splice(index, 1);                                                                              // 74
}                                                                                                                // 75
                                                                                                                 // 76
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/famous.js                                                                 //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/* Extend Meteor Template framework for .famousEvents() */                                                       // 1
Template.prototype.famousEvents = function (eventMap) {                                                          // 2
  var template = this;                                                                                           // 3
  template.__famousEventMaps = (template.__famousEventMaps || []);                                               // 4
  template.__famousEventMaps.push(eventMap);                                                                     // 5
};                                                                                                               // 6
                                                                                                                 // 7
function setupEvents(fview, template) {                                                                          // 8
  if (template.__famousEventMaps) {                                                                              // 9
    var target = fview.surface || fview.view;                                                                    // 10
    _.each(template.__famousEventMaps, function(eventMap) {                                                      // 11
      for (var k in eventMap) {                                                                                  // 12
        target.on(k, (function(k) {                                                                              // 13
          return function(/* arguments */) {                                                                     // 14
            Array.prototype.push.call(arguments, fview);                                                         // 15
            eventMap[k].apply(this, arguments);                                                                  // 16
          };                                                                                                     // 17
        })(k));                                                                                                  // 18
      }                                                                                                          // 19
    });                                                                                                          // 20
  }                                                                                                              // 21
}                                                                                                                // 22
                                                                                                                 // 23
function autoHeight(callback) {                                                                                  // 24
  var fview = this;                                                                                              // 25
  var div = fview.surface.content;                                                                               // 26
                                                                                                                 // 27
  var height = div.scrollHeight;                                                                                 // 28
  if (height && (!fview.size || (fview.size.length == 2 && fview.size[1] != height))) {                          // 29
    fview.size = [undefined, height];                                                                            // 30
    if (fview.modifier) {                                                                                        // 31
      fview.modifier.setSize(fview.size);                                                                        // 32
      fview.surface.setSize([undefined,undefined]);                                                              // 33
    } else {                                                                                                     // 34
      fview.surface.setSize(fview.size);                                                                         // 35
    }                                                                                                            // 36
                                                                                                                 // 37
    if (callback)                                                                                                // 38
      callback.call(fview, height);                                                                              // 39
  } else {                                                                                                       // 40
    window.setTimeout(function() {                                                                               // 41
      fview.autoHeight();                                                                                        // 42
    }, 10);  // FYI: 16.67ms = 1x 60fps animation frame                                                          // 43
  }                                                                                                              // 44
}                                                                                                                // 45
                                                                                                                 // 46
function templateSurface(div, fview, renderedTemplate, tName, options) {                                         // 47
  // var div = document.createElement('div');                                                                    // 48
  var autoSize = options.size && options.size[1] == 'auto';                                                      // 49
                                                                                                                 // 50
  if (autoSize)                                                                                                  // 51
    options.size = [0, 0];                                                                                       // 52
  else                                                                                                           // 53
    div.style.height='100%';                                                                                     // 54
  div.style.width='100%';                                                                                        // 55
                                                                                                                 // 56
  /*                                                                                                             // 57
  if (fview.uiHooks)                                                                                             // 58
    div._uihooks = fview.uiHooks;                                                                                // 59
  */                                                                                                             // 60
                                                                                                                 // 61
//  UI.insert(renderedTemplate, div);                                                                            // 62
                                                                                                                 // 63
//  we're now forced to always render in main func                                                               // 64
//  renderedTemplate.domrange.attach(div);                                                                       // 65
                                                                                                                 // 66
  if (!options)                                                                                                  // 67
    options = {};                                                                                                // 68
                                                                                                                 // 69
  // If any HTML was generated, create a surface for it                                                          // 70
  if (options.view=='Surface' || div.innerHTML.trim().length) {                                                  // 71
    fview.surfaceClassName = 't_'+tName.replace(/ /, '_');                                                       // 72
    if (options.classes)                                                                                         // 73
      throw new Error('Surface classes="x,y" is deprecated.  Use class="x y" instead.');                         // 74
                                                                                                                 // 75
    var surfaceOptions = {                                                                                       // 76
      content: div,                                                                                              // 77
      size: fview.size                                                                                           // 78
    };                                                                                                           // 79
                                                                                                                 // 80
    fview.surface = fview.view;                                                                                  // 81
    fview.surface.setOptions(surfaceOptions);                                                                    // 82
                                                                                                                 // 83
    /*                                                                                                           // 84
    fview.surface = new famous.core.Surface(surfaceOptions);                                                     // 85
    if (!fview.node)                                                                                             // 86
      // nothing, i.e. Surface & no modifier                                                                     // 87
      fview.setNode(fview.surface);                                                                              // 88
    else if (!fview.sequencer)                                                                                   // 89
      // add Surface as only child                                                                               // 90
      fview.node.add(fview.surface);                                                                             // 91
    else {                                                                                                       // 92
      fview.sequencer.sequence.push(fview.surface);                                                              // 93
    }                                                                                                            // 94
    */                                                                                                           // 95
                                                                                                                 // 96
    var pipeChildrenTo = fview.parent.pipeChildrenTo;                                                            // 97
    if (pipeChildrenTo)                                                                                          // 98
      for (var i=0; i < pipeChildrenTo.length; i++)                                                              // 99
        fview.surface.pipe(pipeChildrenTo[i]);                                                                   // 100
                                                                                                                 // 101
    if (autoSize) {                                                                                              // 102
      fview.autoHeight = autoHeight;                                                                             // 103
      fview.autoHeight();                                                                                        // 104
    }                                                                                                            // 105
  }                                                                                                              // 106
}                                                                                                                // 107
                                                                                                                 // 108
// Used by famousEach too                                                                                        // 109
parentViewName = function(blazeView) {                                                                           // 110
  while (blazeView.name == "with" || blazeView.name == "(contentBlock)")                                         // 111
    blazeView = blazeView.parentView;                                                                            // 112
  return blazeView.name;                                                                                         // 113
}                                                                                                                // 114
parentTemplateName = function(blazeView) {                                                                       // 115
  while (blazeView && !blazeView.name.match(/^Template/))                                                        // 116
    blazeView = blazeView.parentView;                                                                            // 117
  return blazeView.name;                                                                                         // 118
}                                                                                                                // 119
                                                                                                                 // 120
// Need to fire manually at appropriate time,                                                                    // 121
// for non-Surfaces which are never added to the DOM by meteor                                                   // 122
runRenderedCallback = function(view) {                                                                           // 123
//  if (view._callbacks.rendered && view._callbacks.rendered.length)                                             // 124
  var needsRenderedCallback = true; // uh yeah, TODO :>                                                          // 125
  view.domrange = null; // TODO, check if it's a surface / real domrange                                         // 126
  if (needsRenderedCallback && ! view.isDestroyed &&                                                             // 127
      view._callbacks.rendered && view._callbacks.rendered.length) {                                             // 128
    Tracker.afterFlush(function callRendered() {                                                                 // 129
      if (needsRenderedCallback && ! view.isDestroyed) {                                                         // 130
        needsRenderedCallback = false;                                                                           // 131
        Blaze._fireCallbacks(view, 'rendered');                                                                  // 132
      }                                                                                                          // 133
    });                                                                                                          // 134
  }                                                                                                              // 135
}                                                                                                                // 136
                                                                                                                 // 137
function famousCreated() {                                                                                       // 138
  var blazeView = this.view;                                                                                     // 139
  var famousViewName = blazeView.name ? blazeView.name.substr(7) : "";                                           // 140
                                                                                                                 // 141
  this.data = this.data || {};                                                                                   // 142
  var dataContext = this.data.data                                                                               // 143
    || Blaze._parentData(1) && Blaze._parentData(1, true)                                                        // 144
    || Blaze._parentData(0) && Blaze._parentData(0, true)                                                        // 145
    || {};                                                                                                       // 146
                                                                                                                 // 147
  // deprecate                                                                                                   // 148
  if (!this.data.view && famousViewName === "")                                                                  // 149
    this.data.view = 'SequentialLayout';                                                                         // 150
  if (!this.data.view) this.data.view = famousViewName;                                                          // 151
  else if (!famousViewName) {                                                                                    // 152
    famousViewName = this.data.view;                                                                             // 153
    blazeView.viewName = 'Famous.' + famousViewName;                                                             // 154
  }                                                                                                              // 155
                                                                                                                 // 156
  // Deprecated 2014-08-17                                                                                       // 157
  if (this.data.size && _.isString(this.data.size) && this.data.size.substr(0,1) != '[')                         // 158
    throw new Error('[famous-views] size="' + this.data.size + '" is deprecated, please use '                    // 159
      + 'size="['+ this.data.size + ']" instead');                                                               // 160
                                                                                                                 // 161
  // See attribute parsing notes in README                                                                       // 162
  var options = handleOptions(this.data);                                                                        // 163
                                                                                                                 // 164
  // These require special handling (but should still be moved elsewhere)                                        // 165
  if (this.data.direction)                                                                                       // 166
    options.direction = this.data.direction == "Y"                                                               // 167
      ? famous.utilities.Utility.Direction.Y                                                                     // 168
      : famous.utilities.Utility.Direction.X;                                                                    // 169
  if (options.translate) {                                                                                       // 170
    options.transform =                                                                                          // 171
      Transform.translate.apply(null, options.translate);                                                        // 172
    delete options.translate;                                                                                    // 173
  }                                                                                                              // 174
  // any other transforms added here later must act on existing transform matrix                                 // 175
                                                                                                                 // 176
  if (!this.data.modifier && (this.data.origin || this.data.size || this.data.translate || this.data.transform)) // 177
    this.data.modifier = 'StateModifier';                                                                        // 178
                                                                                                                 // 179
  var fview = blazeView.fview = new MeteorFamousView(blazeView, options);                                        // 180
  fview._view = FView.views[this.data.view] || { name: this.data.view };                                         // 181
                                                                                                                 // 182
  var pViewName = parentViewName(blazeView.parentView);                                                          // 183
  var pTplName = parentTemplateName(blazeView.parentView);                                                       // 184
  log.debug('New ' + famousViewName + " (#" + fview.id + ')'                                                     // 185
    + (this.data.template                                                                                        // 186
      ? ', content from "' + this.data.template + '"'                                                            // 187
      : ', content from inline block')                                                                           // 188
    + ' (parent: ' + pViewName                                                                                   // 189
    + (pViewName == pTplName                                                                                     // 190
      ? ''                                                                                                       // 191
      : ', template: ' + pTplName)                                                                               // 192
    + ')');                                                                                                      // 193
                                                                                                                 // 194
  /*                                                                                                             // 195
  if (FView.viewOptions[this.data.view]                                                                          // 196
      && FView.viewOptions[this.data.view].childUiHooks) {                                                       // 197
    // if childUiHooks specified, store them here too                                                            // 198
    fview.childUiHooks = FView.viewOptions[this.data.view].childUiHooks;                                         // 199
  } else if (fview.parent.childUiHooks) {                                                                        // 200
    if (this.data.view == 'Surface') {                                                                           // 201
      fview.uiHooks = fview.parent.childUiHooks;                                                                 // 202
    } else {                                                                                                     // 203
      // Track descedents                                                                                        // 204
    }                                                                                                            // 205
    console.log('child ' + this.data.view);                                                                      // 206
  }                                                                                                              // 207
  */                                                                                                             // 208
                                                                                                                 // 209
  var view, node;                                                                                                // 210
                                                                                                                 // 211
  if (this.data.view /* != 'Surface' */) {                                                                       // 212
                                                                                                                 // 213
    view = FView.getView(this.data.view);                                                                        // 214
    node = new view(options);                                                                                    // 215
                                                                                                                 // 216
    if (node.sequenceFrom) {                                                                                     // 217
      fview.sequence = new sequencer();                                                                          // 218
      node.sequenceFrom(fview.sequence._sequence);                                                               // 219
    }                                                                                                            // 220
                                                                                                                 // 221
  }                                                                                                              // 222
                                                                                                                 // 223
  if (this.data.modifier) {                                                                                      // 224
                                                                                                                 // 225
    fview._modifier = FView.modifiers[this.data.modifier];                                                       // 226
    fview.modifier = fview._modifier.create.call(fview, options);                                                // 227
                                                                                                                 // 228
    if (node) {                                                                                                  // 229
      fview.setNode(fview.modifier).add(node);                                                                   // 230
      fview.view = node;                                                                                         // 231
    } else                                                                                                       // 232
      fview.setNode(fview.modifier);                                                                             // 233
                                                                                                                 // 234
    if (fview._modifier.postRender)                                                                              // 235
      fview._modifier.postRender();                                                                              // 236
                                                                                                                 // 237
  } else if (node) {                                                                                             // 238
                                                                                                                 // 239
    fview.setNode(node);                                                                                         // 240
    fview.view = node;                                                                                           // 241
                                                                                                                 // 242
  }                                                                                                              // 243
                                                                                                                 // 244
  // could do pipe=1 in template helper?                                                                         // 245
  if (fview.parent.pipeChildrenTo)                                                                               // 246
    fview.pipeChildrenTo = fview.parent.pipeChildrenTo;                                                          // 247
                                                                                                                 // 248
  // think about what else this needs                                                                            // 249
  if (fview._view && fview._view.famousCreatedPost)                                                              // 250
    fview._view.famousCreatedPost.call(fview);                                                                   // 251
                                                                                                                 // 252
                                                                                                                 // 253
  // Render contents (and children)                                                                              // 254
  var newBlazeView, template, scopedView;                                                                        // 255
  if (blazeView.templateContentBlock) {                                                                          // 256
    if (this.data.template)                                                                                      // 257
      throw new Error("A block helper {{#View}} cannot also specify template=X");                                // 258
    // Called like {{#famous}}inlineContents{{/famous}}                                                          // 259
    template = blazeView.templateContentBlock;                                                                   // 260
  } else if (this.data.template) {                                                                               // 261
    template = Template[this.data.template];                                                                     // 262
    if (!template)                                                                                               // 263
      throw new Error('Famous called with template="' + this.data.template                                       // 264
        + '" but no such template exists');                                                                      // 265
  } else {                                                                                                       // 266
    // Called with inclusion operator but not template {{>famous}}                                               // 267
    throw new Error("No template='' specified");                                                                 // 268
  }                                                                                                              // 269
                                                                                                                 // 270
  /*                                                                                                             // 271
  newBlazeView = template.constructView();                                                                       // 272
  scopedView = Blaze.With(dataContext, function() { return newBlazeView; });                                     // 273
  Blaze.materializeView(scopedView, blazeView);                                                                  // 274
  */                                                                                                             // 275
                                                                                                                 // 276
  /*                                                                                                             // 277
  newBlazeView = Blaze.render(function() {                                                                       // 278
    Blaze.With(dataContext, function() { return template.constructView(); })                                     // 279
  }, div, null, blazeView);                                                                                      // 280
  */                                                                                                             // 281
                                                                                                                 // 282
  // Avoid Blaze running rendered() before it's actually on the DOM                                              // 283
  // Delete must happen before Blaze.render() called.                                                            // 284
  /*                                                                                                             // 285
  var onRendered = this.data.view == 'Surface' && template.rendered;                                             // 286
  if (onRendered)                                                                                                // 287
    delete template.rendered;                                                                                    // 288
  */                                                                                                             // 289
                                                                                                                 // 290
  var div = document.createElement('div');                                                                       // 291
  newBlazeView = Blaze.renderWithData(template, dataContext, div, null, blazeView);                              // 292
  setupEvents(fview, template);                                                                                  // 293
                                                                                                                 // 294
  if (this.data.view == 'Surface') {                                                                             // 295
    templateSurface(div, fview, scopedView,                                                                      // 296
      this.data.template || parentTemplateName(blazeView.parentView).substr(9) + '_inline',                      // 297
      options);                                                                                                  // 298
  } else {                                                                                                       // 299
    // no longer necessary since we're forced to render to a div now                                             // 300
    // runRenderedCallback(newBlazeView);                                                                        // 301
  }                                                                                                              // 302
                                                                                                                 // 303
  /*                                                                                                             // 304
  var template = options.template;                                                                               // 305
  if (template && Template[template].beforeAdd)                                                                  // 306
  	Template[template].beforeAdd.call(this);                                                                      // 307
  */                                                                                                             // 308
                                                                                                                 // 309
  /* This is the final step where the fview is added to Famous Render Tree */                                    // 310
  /* By deferring the actual add we can prevent a little flicker */                                              // 311
                                                                                                                 // 312
  var parent = fview.parent;                                                                                     // 313
//  _.defer(function() {                                                                                         // 314
    if (parent._view && parent._view.add)                                                                        // 315
      // views can explicitly handle how their children should be added                                          // 316
      parent._view.add.call(parent, fview, options);                                                             // 317
    else if (parent.sequence)                                                                                    // 318
      // 'sequence' can be an array, sequencer or childSequencer, it doesn't matter                              // 319
      parent.sequence.push(fview);                                                                               // 320
    else if (!parent.node || (parent.node._object && parent.node._object.isDestroyed))                           // 321
      // compView->compView.  long part above is temp hack for template rerender #2010                           // 322
      parent.setNode(fview);                                                                                     // 323
    else                                                                                                         // 324
      // default case, just use the add method                                                                   // 325
      parent.node.add(fview);                                                                                    // 326
 // });                                                                                                          // 327
                                                                                                                 // 328
  /*                                                                                                             // 329
   * Now that the Template has been rendered to the Famous Render Tree (and                                      // 330
   * also to the DOM in the case of a Surface), let's run any rendered()                                         // 331
   * callback that may have been defined.                                                                        // 332
   */                                                                                                            // 333
  /*                                                                                                             // 334
  if (onRendered)                                                                                                // 335
    onRendered.call(fview.blazeView._templateInstance);                                                          // 336
  */                                                                                                             // 337
}                                                                                                                // 338
                                                                                                                 // 339
/*                                                                                                               // 340
 * This is called by Blaze when the View/Template is destroyed,                                                  // 341
 * e.g. {{#if 0}}{{#Scrollview}}{{/if}}.  When this happens we need to:                                          // 342
 *                                                                                                               // 343
 * 1) Destroy children (Blaze won't do it since it's not in the DOM),                                            // 344
 *    and any "eaches" that may have been added from a famousEach.                                               // 345
 * 2) Call fview.destroy() which handles cleanup w.r.t. famous,                                                  // 346
 *    which lives in meteorFamousView.js.                                                                        // 347
 *                                                                                                               // 348
 * It's possible we want to have the "template" destroyed but not the                                            // 349
 * fview in the render tree to do a graceful exit animation, etc.                                                // 350
 */                                                                                                              // 351
function famousDestroyed() {                                                                                     // 352
  this.view.fview.destroy(true);                                                                                 // 353
}                                                                                                                // 354
                                                                                                                 // 355
// Keep this at the bottom; Firefox doesn't do function hoisting                                                 // 356
                                                                                                                 // 357
FView.famousView = new Template(                                                                                 // 358
  'famous',           // viewName: "famous"                                                                      // 359
  function() {        // Blaze.View "renderFunc"                                                                 // 360
    var blazeView = this;                                                                                        // 361
    var data = Blaze.getData(blazeView);                                                                         // 362
    var tpl = blazeView._templateInstance;                                                                       // 363
    var fview = blazeView.fview;                                                                                 // 364
                                                                                                                 // 365
    var changed = {};                                                                                            // 366
    var orig = {};                                                                                               // 367
    for (var key in data) {                                                                                      // 368
      var value = data[key];                                                                                     // 369
      if (typeof value === "string")                                                                             // 370
        value = optionString(value);                                                                             // 371
      if (!EJSON.equals(value, tpl.data[key]) || !blazeView.hasRendered) {                                       // 372
        orig[key] = blazeView.hasRendered ? tpl.data[key] : null;                                                // 373
        changed[key] = tpl.data[key] = value;                                                                    // 374
      }                                                                                                          // 375
    }                                                                                                            // 376
                                                                                                                 // 377
    /*                                                                                                           // 378
     * Think about:                                                                                              // 379
     *                                                                                                           // 380
     * 1) Should the function get the old value or all old data too?                                             // 381
     * 2) Should the function get all the new data, but translated?                                              // 382
     *                                                                                                           // 383
     */                                                                                                          // 384
                                                                                                                 // 385
    _.each(['modifier', 'view'], function(node) {                                                                // 386
                                                                                                                 // 387
      // If the fview has a modifier or view                                                                     // 388
      var what = '_' + node;                                                                                     // 389
      if (fview[what]) {                                                                                         // 390
        if (fview[what].attrUpdate) {                                                                            // 391
          // If that mod/view wants to finely handle reactive updates                                            // 392
          for (var key in changed)                                                                               // 393
            fview[what].attrUpdate.call(fview,                                                                   // 394
              key, changed[key], orig[key], tpl.data, !blazeView.hasRendered);                                   // 395
        } else if (fview[node].setOptions && blazeView.hasRendered) {                                            // 396
          // Otherwise if it has a setOptions                                                                    // 397
          fview[node].setOptions(tpl.data);                                                                      // 398
        }                                                                                                        // 399
      }                                                                                                          // 400
                                                                                                                 // 401
    });                                                                                                          // 402
                                                                                                                 // 403
//    console.log(view);                                                                                         // 404
    blazeView.hasRendered = true;                                                                                // 405
    return null;                                                                                                 // 406
  }                                                                                                              // 407
);                                                                                                               // 408
                                                                                                                 // 409
Blaze.registerHelper('famous', FView.famousView);                                                                // 410
FView.famousView.created = famousCreated;                                                                        // 411
FView.famousView.destroyed = famousDestroyed;                                                                    // 412
                                                                                                                 // 413
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/famousEach.js                                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
function famousEachRender(eachView, template, argFunc) {                                                         // 1
  var fview = eachView.fview;                                                                                    // 2
  var sequence = fview.sequence;				    // fviews for Famous Render Tree                                         // 3
  var children = fview.children = [];	      // each contentBlock instance                                        // 4
                                                                                                                 // 5
  // For Blaze.currentView (see blaze/builtins.js#each)                                                          // 6
  eachView.argVar = new Blaze.ReactiveVar;                                                                       // 7
  eachView.autorun(function () {                                                                                 // 8
    eachView.argVar.set(argFunc());                                                                              // 9
  }, eachView.parentView);                                                                                       // 10
                                                                                                                 // 11
  eachView.stopHandle = ObserveSequence.observe(function () {                                                    // 12
      return eachView.argVar.get();                                                                              // 13
    }, {                                                                                                         // 14
      addedAt: function (id, item, index) {                                                                      // 15
        Tracker.nonreactive(function () {                                                                        // 16
          var newItemView = Blaze.With(item, function() {                                                        // 17
            return template.constructView();                                                                     // 18
          });                                                                                                    // 19
                                                                                                                 // 20
          /*                                                                                                     // 21
           * This is the repeated block inside famousEach, but not the actual node/                              // 22
           * view/surface that gets created on render as this block's children.                                  // 23
           * We create a pseudo-fview for this                                                                   // 24
           */                                                                                                    // 25
          newItemView.fview = new MeteorFamousView(null, {}, true /* noAdd */);                                  // 26
          newItemView.fview.kind = 'famousEachBlock';                                                            // 27
          newItemView.fview.sequence = sequence.child(index);                                                    // 28
                                                                                                                 // 29
          if (fview.parent.pipeChildrenTo)                                                                       // 30
            newItemView.fview.pipeChildrenTo                                                                     // 31
              = fview.parent.pipeChildrenTo;                                                                     // 32
                                                                                                                 // 33
          children.splice(index, 0, { blazeView: newItemView });                                                 // 34
                                                                                                                 // 35
          var unusedDiv = document.createElement('div');                                                         // 36
          Blaze.render(newItemView, unusedDiv, eachView);                                                        // 37
                                                                                                                 // 38
          //Blaze.materializeView(newItemView, eachView);                                                        // 39
          //runRenderedCallback(newItemView);  // now called by Blaze.render                                     // 40
        });                                                                                                      // 41
      },                                                                                                         // 42
      removedAt: function (id, item, index) {                                                                    // 43
        // famousEachBlock, not individual Views                                                                 // 44
        Blaze.remove(children[index].blazeView);                                                                 // 45
        children.splice(index, 1);                                                                               // 46
      },                                                                                                         // 47
      changedAt: function (id, newItem, oldItem, index) {                                                        // 48
        Tracker.nonreactive(function () {                                                                        // 49
          children[index].blazeView.dataVar.set(newItem);                                                        // 50
        });                                                                                                      // 51
      },                                                                                                         // 52
      movedTo: function (id, doc, fromIndex, toIndex) {                                                          // 53
        Tracker.nonreactive(function () {                                                                        // 54
          var item = sequence.splice(fromIndex, 1)[0];                                                           // 55
          sequence.splice(toIndex, 0, item);                                                                     // 56
                                                                                                                 // 57
          item = children.splice(fromIndex, 1)[0];                                                               // 58
          children.splice(toIndex, 0, item);                                                                     // 59
        });                                                                                                      // 60
      }                                                                                                          // 61
    });                                                                                                          // 62
}                                                                                                                // 63
                                                                                                                 // 64
function famousEachCreated() {                                                                                   // 65
  var blazeView = this.view;                                                                                     // 66
  var fview = blazeView.fview = new MeteorFamousView(blazeView, {});                                             // 67
                                                                                                                 // 68
  log.debug('New famousEach' + " (#" + fview.id + ')'                                                            // 69
    + ' (parent: ' + parentViewName(blazeView.parentView) + ','                                                  // 70
    + ' template: ' + parentTemplateName(blazeView.parentView) + ')');                                           // 71
                                                                                                                 // 72
  fview.kind = 'famousEach';                                                                                     // 73
  fview.sequence = fview.parent.sequence.child();                                                                // 74
                                                                                                                 // 75
  // Contents of {{#famousEach}}block{{/famousEach}}                                                             // 76
  if (blazeView.templateContentBlock)                                                                            // 77
    famousEachRender(blazeView, blazeView.templateContentBlock, function() {                                     // 78
      return Blaze.getData(blazeView);                                                                           // 79
    });                                                                                                          // 80
}                                                                                                                // 81
                                                                                                                 // 82
function famousEachDestroyed() {                                                                                 // 83
  this.view.fview.destroy(true);                                                                                 // 84
}                                                                                                                // 85
                                                                                                                 // 86
// Keep this at the bottom; Firefox doesn't do function hoisting                                                 // 87
                                                                                                                 // 88
FView.famousEachView = new Template(                                                                             // 89
  'famousEach',       // viewName: "famousEach"                                                                  // 90
  function() {        // Blaze.View "renderFunc"                                                                 // 91
    var view = this;  // Blaze.View, viewName "famousEach"                                                       // 92
    // console.log(view);                                                                                        // 93
    return null;                                                                                                 // 94
  }                                                                                                              // 95
);                                                                                                               // 96
                                                                                                                 // 97
Blaze.registerHelper('famousEach', FView.famousEachView);                                                        // 98
FView.famousEachView.created = famousEachCreated;                                                                // 99
FView.famousEachView.destroyed = famousEachDestroyed;                                                            // 100
                                                                                                                 // 101
/*                                                                                                               // 102
FView.Each = function (argFunc, contentFunc, elseFunc) {                                                         // 103
  var eachView = Blaze.View('Feach', function() {                                                                // 104
    return null;                                                                                                 // 105
  });                                                                                                            // 106
                                                                                                                 // 107
  eachView.onCreated(function() {                                                                                // 108
    // For Blaze.currentView (see blaze/builtins.js#each)                                                        // 109
    eachView.autorun(function () {                                                                               // 110
      eachView.argVar.set(argFunc());                                                                            // 111
    }, eachView.parentView);                                                                                     // 112
                                                                                                                 // 113
                                                                                                                 // 114
  });                                                                                                            // 115
                                                                                                                 // 116
  return eachView;                                                                                               // 117
}                                                                                                                // 118
Blaze.registerHelper('famousEach', FView.Each);                                                                  // 119
*/                                                                                                               // 120
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/famousIf.js                                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/*                                                                                                               // 1
 * In brief, on Create we setup a child sequence to serve as a placeholder for                                   // 2
 * any children (so that order is retained).  On reactive render, we destroy any                                 // 3
 * existing children and render the contentBlock / elseBlock (as our children).                                  // 4
 * On destroy, we cleanup and remove (TODO) child sequence placeholder.                                          // 5
 */                                                                                                              // 6
                                                                                                                 // 7
/* Other thoughts:                                                                                               // 8
 * - Currently this is only used to retain order in a sequence                                                   // 9
 * - If used in a surface we could force rerun of autoHeight, etc?                                               // 10
 */                                                                                                              // 11
                                                                                                                 // 12
function famousIfCreated() {                                                                                     // 13
  var blazeView = this.view;                                                                                     // 14
  var fview = blazeView.fview = new MeteorFamousView(blazeView, {});                                             // 15
                                                                                                                 // 16
  log.debug('New famousIf' + " (#" + fview.id + ')'                                                              // 17
    + ' (parent: ' + parentViewName(blazeView.parentView) + ','                                                  // 18
    + ' template: ' + parentTemplateName(blazeView.parentView) + ')');                                           // 19
                                                                                                                 // 20
  fview.kind = 'famousIf';                                                                                       // 21
  fview.sequence = fview.parent.sequence.child();                                                                // 22
}                                                                                                                // 23
                                                                                                                 // 24
function cleanupChildren(blazeView) {                                                                            // 25
	var children = blazeView.fview.children;                                                                        // 26
	for (var i=0; i < children.length; i++)                                                                         // 27
  	Blaze.remove(children[i].blazeView);                                                                          // 28
}                                                                                                                // 29
                                                                                                                 // 30
function famousIfDestroyed() {                                                                                   // 31
  this.view.fview.destroy(true);                                                                                 // 32
}                                                                                                                // 33
                                                                                                                 // 34
FView.famousIfView = new Template('famousIf', function() {                                                       // 35
	var blazeView = this;                                                                                           // 36
	var condition = Blaze.getData(blazeView);                                                                       // 37
                                                                                                                 // 38
  log.debug('famousIf' + " (#" + blazeView.fview.id + ')'                                                        // 39
    + ' is now ' + !!condition                                                                                   // 40
    + ' (parent: ' + parentViewName(blazeView.parentView) + ','                                                  // 41
    + ' template: ' + parentTemplateName(blazeView.parentView) + ')');                                           // 42
                                                                                                                 // 43
  var dataContext = null /* this.data.data */                                                                    // 44
    || Blaze._parentData(1) && Blaze._parentData(1, true)                                                        // 45
    || Blaze._parentData(0) && Blaze._parentData(0, true)                                                        // 46
    || {};                                                                                                       // 47
                                                                                                                 // 48
  var unusedDiv = document.createElement('div');                                                                 // 49
  var template = blazeView.templateContentBlock;                                                                 // 50
                                                                                                                 // 51
  // Any time condition changes, remove all old children                                                         // 52
  cleanupChildren(blazeView);                                                                                    // 53
                                                                                                                 // 54
  var template = condition                                                                                       // 55
  	? blazeView.templateContentBlock : blazeView.templateElseBlock;                                               // 56
                                                                                                                 // 57
  if (template)                                                                                                  // 58
	  Blaze.renderWithData(template, dataContext, unusedDiv, null, blazeView);                                      // 59
});                                                                                                              // 60
                                                                                                                 // 61
Blaze.registerHelper('famousIf', FView.famousIfView);                                                            // 62
FView.famousIfView.created = famousIfCreated;                                                                    // 63
FView.famousIfView.destroyed = famousIfDestroyed;                                                                // 64
                                                                                                                 // 65
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/famousContext.js                                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Template.famousContext                                                                                           // 1
	= Template.FamousContext                                                                                        // 2
	= new Template('Template.FamousContext', function() {                                                           // 3
	  var blazeView = this;                                                                                         // 4
                                                                                                                 // 5
		var children = [];                                                                                             // 6
		var sequence = [];                                                                                             // 7
                                                                                                                 // 8
		// Since all Surfaces are created in a .created callback, the expect to find a fview field on some parent.     // 9
		// Fake here one, and later link to real Context                                                               // 10
		Blaze.getView().fview = {                                                                                      // 11
			sequence : sequence,                                                                                          // 12
			children : children                                                                                           // 13
		};                                                                                                             // 14
                                                                                                                 // 15
		var templateContentBlock = this.templateContentBlock;                                                          // 16
                                                                                                                 // 17
		blazeView.onViewReady(function () {                                                                            // 18
			var firstNode = $(this.templateInstance().firstNode);                                                         // 19
			var parent = firstNode.parent();                                                                              // 20
                                                                                                                 // 21
			var context = famous.core.Engine.createContext(parent[0]);                                                    // 22
                                                                                                                 // 23
			_.each(children, function (c) {                                                                               // 24
				context.add(c);                                                                                              // 25
			});                                                                                                           // 26
		});                                                                                                            // 27
                                                                                                                 // 28
		return Blaze.View('famousContext', function () {                                                               // 29
			return templateContentBlock;                                                                                  // 30
		})                                                                                                             // 31
	});                                                                                                             // 32
                                                                                                                 // 33
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/modifiers.js                                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FView.modifiers = {};                                                                                            // 1
                                                                                                                 // 2
function defaultCreate(options) {                                                                                // 3
  return new this._modifier.modifier(options);                                                                   // 4
}                                                                                                                // 5
                                                                                                                 // 6
FView.registerModifier = function(name, modifier, options) {                                                     // 7
  if (!FView.modifiers[name])                                                                                    // 8
    FView.modifiers[name] = _.extend(                                                                            // 9
      { create: defaultCreate },                                                                                 // 10
      options,                                                                                                   // 11
      { name: name, modifier: modifier }                                                                         // 12
    );                                                                                                           // 13
}                                                                                                                // 14
                                                                                                                 // 15
FView.ready(function(require) {                                                                                  // 16
                                                                                                                 // 17
  FView.registerModifier('modifier', famous.core.Modifier);                                                      // 18
                                                                                                                 // 19
  FView.registerModifier('identity', null, {                                                                     // 20
    create: function(options) {                                                                                  // 21
      return new Modifier(_.extend({                                                                             // 22
        transform : Transform.identity                                                                           // 23
      }, options));                                                                                              // 24
    }                                                                                                            // 25
  });                                                                                                            // 26
                                                                                                                 // 27
  FView.registerModifier('inFront', null, {                                                                      // 28
    create: function(options) {                                                                                  // 29
      return new Modifier(_.extend({                                                                             // 30
        transform : Transform.inFront                                                                            // 31
      }, options));                                                                                              // 32
    }                                                                                                            // 33
  });                                                                                                            // 34
                                                                                                                 // 35
  function modifierMethod(fview, method, value, options) {                                                       // 36
    if (typeof options.halt !== 'undefined'                                                                      // 37
        ? options.halt : fview.modifierTransitionHalt)                                                           // 38
      fview.modifier.halt();                                                                                     // 39
                                                                                                                 // 40
    fview.modifier[method](                                                                                      // 41
      value,                                                                                                     // 42
      options.transition || fview.modifierTransition,                                                            // 43
      options.done || fview.modifierTransitionDone                                                               // 44
    );                                                                                                           // 45
  }                                                                                                              // 46
  function degreesToRadians(x) {                                                                                 // 47
    return x * Math.PI / 180;                                                                                    // 48
  }                                                                                                              // 49
  FView.registerModifier('StateModifier', famous.modifiers.StateModifier, {                                      // 50
                                                                                                                 // 51
    attrUpdate: function(key, value, oldValue, data, firstTime) {                                                // 52
      // Allow for values like { value: 30, transition: {}, halt: true }                                         // 53
      var options = {};                                                                                          // 54
      if (typeof value === 'object' && value && typeof value.value !== 'undefined') {                            // 55
        options = value;                                                                                         // 56
        value = options.value;                                                                                   // 57
      }                                                                                                          // 58
      if (typeof oldValue === 'object' && oldValue && typeof oldValue.value !== 'undefined')                     // 59
        oldValue = oldValue.value;                                                                               // 60
                                                                                                                 // 61
      switch(key) {                                                                                              // 62
        case 'transform': case 'opacity': case 'align': case 'size':                                             // 63
          modifierMethod(this, 'set'+key[0].toUpperCase()+key.substr(1), value, options);                        // 64
          break;                                                                                                 // 65
                                                                                                                 // 66
        // Below are helpful shortcuts for transforms                                                            // 67
                                                                                                                 // 68
        case 'translate':                                                                                        // 69
          modifierMethod(this, 'setTransform',                                                                   // 70
            Transform.translate.apply(null, value), options);                                                    // 71
          break;                                                                                                 // 72
                                                                                                                 // 73
        case 'scaleX': case 'scaleY': case 'scaleZ':                                                             // 74
          var amount = degreesToRadians((value || 0) - (oldValue || 0));                                         // 75
          var scale = [0,0,0];                                                                                   // 76
          if (key == 'scaleX') scale[0] = amount;                                                                // 77
          else if (key == 'scaleY') scale[1] = amount;                                                           // 78
          else scale[2] = amount;                                                                                // 79
          modifierMethod(this, 'setTransform', Transform.multiply(                                               // 80
            this.modifier.getFinalTransform(),                                                                   // 81
            Transform.scale.apply(null, scale)                                                                   // 82
          ), options);                                                                                           // 83
          break;                                                                                                 // 84
                                                                                                                 // 85
        case 'skewX': case 'skewY':                                                                              // 86
          var skewBy = (value || 0) - (oldValue || 0);                                                           // 87
          modifierMethod(this, 'setTransform', Transform.multiply(                                               // 88
            this.modifier.getFinalTransform(),                                                                   // 89
            Transform[key](degreesToRadians(skewBy))                                                             // 90
          ), options);                                                                                           // 91
          break;                                                                                                 // 92
                                                                                                                 // 93
        case 'skewZ': // doesn't exist in famous                                                                 // 94
          var skewBy = (value || 0) - (oldValue || 0);                                                           // 95
          modifierMethod(this, 'setTransform', Transform.multiply(                                               // 96
            this.modifier.getFinalTransform(),                                                                   // 97
            Transform.skew(0, 0, degreesToRadians(skewBy))                                                       // 98
          ), options);                                                                                           // 99
          break;                                                                                                 // 100
                                                                                                                 // 101
        case 'rotateX': case 'rotateY': case 'rotateZ':                                                          // 102
          // value might be undefined from Session with no SessionDefault                                        // 103
          var rotateBy = (value || 0) - (oldValue || 0);                                                         // 104
          modifierMethod(this, 'setTransform', Transform.multiply(                                               // 105
            this.modifier.getFinalTransform(),                                                                   // 106
            Transform[key](degreesToRadians(rotateBy))                                                           // 107
          ), options);                                                                                           // 108
          break;                                                                                                 // 109
      }                                                                                                          // 110
    }                                                                                                            // 111
  });                                                                                                            // 112
                                                                                                                 // 113
                                                                                                                 // 114
});                                                                                                              // 115
                                                                                                                 // 116
/*                                                                                                               // 117
FView.modifiers.pageTransition = function(blazeView, options) {                                                  // 118
  this.blazeView = blazeView;                                                                                    // 119
  this.famous = new Modifier({                                                                                   // 120
    transform : Transform.identity,                                                                              // 121
    opacity   : 1,                                                                                               // 122
    origin    : [-0.5, -0.5],                                                                                    // 123
    size      : [100, 100]                                                                                       // 124
  });                                                                                                            // 125
};                                                                                                               // 126
                                                                                                                 // 127
FView.modifiers.pageTransition.prototype.postRender = function() {                                               // 128
  this.famous.setOrigin([0,0], {duration : 5000});                                                               // 129
};                                                                                                               // 130
*/                                                                                                               // 131
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/views.js                                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FView.views = {};                                                                                                // 1
                                                                                                                 // 2
/* Available in JS via `FView.views.Scrollview` and in templates via                                             // 3
	`{{#famous view='Scrollview'}}` or just `{{#Scrollview}}`. */                                                   // 4
FView.registerView = function(name, famousView, options) {                                                       // 5
	if (FView.views[name])                                                                                          // 6
		return;                                                                                                        // 7
                                                                                                                 // 8
  /*                                                                                                             // 9
  var tpl = _.clone(FView.famousView);                                                                           // 10
  tpl.viewName = 'Famous.' + name;                                                                               // 11
  console.log(tpl);                                                                                              // 12
  */                                                                                                             // 13
                                                                                                                 // 14
  var fview = FView.famousView;                                                                                  // 15
  var tpl = new Template('Famous.' + name, fview.renderFunction);                                                // 16
  tpl.created = fview.created;                                                                                   // 17
  tpl.destroyed = fview.destroyed;                                                                               // 18
  Blaze.registerHelper(name, tpl);                                                                               // 19
                                                                                                                 // 20
	FView.views[name]                                                                                               // 21
		= _.extend(options || {}, { name: name, class: famousView });                                                  // 22
}                                                                                                                // 23
                                                                                                                 // 24
/* Do we still need this?  Most people explicitly register views with                                            // 25
   registerView() these days, to get the template helper */                                                      // 26
FView.getView = function(name)  {                                                                                // 27
	// @famono silent                                                                                               // 28
  if (FView.views[name])                                                                                         // 29
    return FView.views[name].class;                                                                              // 30
  if (typeof Famous !== 'undefined' && Famous[name])                                                             // 31
    return Famous[name];                                                                                         // 32
  if (typeof Famous !== 'undefined' && famous.Views && Famous.Views[name])                                       // 33
    return Famous.Views[name];                                                                                   // 34
  if (typeof famous !== 'undefined' && famous.views && famous.views[name])                                       // 35
    return famous.views[name];                                                                                   // 36
  else                                                                                                           // 37
    throw new Error('Wanted view "' + name + '" but it doesn\'t exists.'                                         // 38
      + ' Try FView.registerView("'+name+'", require(...))');                                                    // 39
}                                                                                                                // 40
                                                                                                                 // 41
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/views/_simple.js                                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FView.ready(function(require) {                                                                                  // 1
	FView.registerView('SequentialLayout', famous.views.SequentialLayout);                                          // 2
	FView.registerView('View', famous.core.View);                                                                   // 3
});                                                                                                              // 4
                                                                                                                 // 5
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/views/ContainerSurface.js                                                 //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FView.ready(function(require) {                                                                                  // 1
	FView.registerView('ContainerSurface', famous.surfaces.ContainerSurface, {                                      // 2
                                                                                                                 // 3
		add: function(child_fview, child_options) {                                                                    // 4
			this.view.add(child_fview);                                                                                   // 5
    },                                                                                                           // 6
                                                                                                                 // 7
    attrUpdate: function(key, value, oldValue, data, firstTime) {                                                // 8
			if (key == 'overflow')                                                                                        // 9
				this.view.setProperties({ overflow: value });                                                                // 10
			else if (key == 'class')                                                                                      // 11
				this.view.setClasses(value.split(" "));                                                                      // 12
		}                                                                                                              // 13
                                                                                                                 // 14
	});                                                                                                             // 15
});                                                                                                              // 16
                                                                                                                 // 17
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/views/EdgeSwapper.js                                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FView.ready(function(require) {                                                                                  // 1
	FView.registerView('EdgeSwapper', famous.views.EdgeSwapper, {                                                   // 2
		add: function(child_fview, child_options) {                                                                    // 3
			if (!this.view)                                                                                               // 4
				return;  // when?                                                                                            // 5
                                                                                                                 // 6
			if (this.currentShow)                                                                                         // 7
				this.previousShow = this.currentShow;                                                                        // 8
			this.currentShow = child_fview;                                                                               // 9
                                                                                                                 // 10
			child_fview.preventDestroy();                                                                                 // 11
                                                                                                                 // 12
			var self = this;                                                                                              // 13
			this.view.show(child_fview, null, function() {                                                                // 14
				if (self.previousShow)                                                                                       // 15
					self.previousShow.destroy();                                                                                // 16
			});                                                                                                           // 17
		}                                                                                                              // 18
	});                                                                                                             // 19
});                                                                                                              // 20
                                                                                                                 // 21
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/views/Flipper.js                                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FView.ready(function(require) {                                                                                  // 1
	FView.registerView('Flipper', famous.views.Flipper, {                                                           // 2
		add: function(child_fview, child_options) {                                                                    // 3
			var target = child_options.target;                                                                            // 4
			if (!target || (target != 'back' && target != 'front'))                                                       // 5
				throw new Error('Flipper must specify target="back/front"');                                                 // 6
                                                                                                                 // 7
			if (target == 'front')                                                                                        // 8
				this.view.setFront(child_fview);                                                                             // 9
			else                                                                                                          // 10
				this.view.setBack(child_fview);                                                                              // 11
		}                                                                                                              // 12
	});                                                                                                             // 13
});                                                                                                              // 14
                                                                                                                 // 15
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/views/HeaderFooterLayout.js                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FView.ready(function(require) {                                                                                  // 1
	FView.registerView('HeaderFooterLayout', famous.views.HeaderFooterLayout, {                                     // 2
		add: function(child_fview, child_options) {                                                                    // 3
			var target = child_options.target;                                                                            // 4
			if (!target)                                                                                                  // 5
				throw new Error('HeaderFooterLayout children must specify target="header/footer/content"');                  // 6
			this.view[target].add(child_fview);                                                                           // 7
		}                                                                                                              // 8
	});                                                                                                             // 9
});                                                                                                              // 10
                                                                                                                 // 11
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/views/RenderController.js                                                 //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FView.transitions = {                                                                                            // 1
	opacity: {                                                                                                      // 2
    outTransformFrom: function(progress) {                                                                       // 3
      return Transform.Identity;                                                                                 // 4
    },                                                                                                           // 5
    inTransformFrom: function(progress) {                                                                        // 6
      return Transform.Identity;                                                                                 // 7
    }                                                                                                            // 8
	},                                                                                                              // 9
	slideWindow: {                                                                                                  // 10
    outTransformFrom: function(progress) {                                                                       // 11
      return Transform.translate(window.innerWidth * progress - window.innerWidth, 0, 0);                        // 12
    },                                                                                                           // 13
    inTransformFrom: function(progress) {                                                                        // 14
      return Transform.translate(window.innerWidth * (1.0 - progress), 0, 0);                                    // 15
    }                                                                                                            // 16
	},                                                                                                              // 17
	WIP: {                                                                                                          // 18
    outTransformFrom: function(progress) {                                                                       // 19
      return Transform.rotateY(Math.PI*progress);                                                                // 20
    },                                                                                                           // 21
    inTransformFrom: function(progress) {                                                                        // 22
      return Transform.rotateY(Math.PI + Math.PI*progress);                                                      // 23
    }                                                                                                            // 24
	}                                                                                                               // 25
};                                                                                                               // 26
                                                                                                                 // 27
// Other option is to allow a slideDirection attribute.  Think about this.                                       // 28
FView.transitions.slideWindowLeft = FView.transitions.slideWindow;                                               // 29
FView.transitions.slideWindowRight = {                                                                           // 30
    outTransformFrom: FView.transitions.slideWindow.inTransformFrom,                                             // 31
    inTransformFrom: FView.transitions.slideWindow.outTransformFrom                                              // 32
};                                                                                                               // 33
                                                                                                                 // 34
FView.ready(function(require) {                                                                                  // 35
	FView.registerView('RenderController', famous.views.RenderController, {                                         // 36
		add: function(child_fview, child_options) {                                                                    // 37
			if (!this.view)                                                                                               // 38
				return;  // when?                                                                                            // 39
                                                                                                                 // 40
			if (this.currentShow)                                                                                         // 41
				this.previousShow = this.currentShow;                                                                        // 42
			this.currentShow = child_fview;                                                                               // 43
                                                                                                                 // 44
			var transition = child_options.transition;                                                                    // 45
			if (transition) {                                                                                             // 46
				var data = FView.transitions[transition];                                                                    // 47
				if (data) {                                                                                                  // 48
					for (key in data)                                                                                           // 49
						this.view[key](data[key]);                                                                                 // 50
				} else {                                                                                                     // 51
					log.error('No such transition ' + transition);                                                              // 52
				}                                                                                                            // 53
			}                                                                                                             // 54
                                                                                                                 // 55
			child_fview.preventDestroy();                                                                                 // 56
                                                                                                                 // 57
			var self = this;                                                                                              // 58
			this.view.show(child_fview, null, function() {                                                                // 59
				if (self.previousShow)                                                                                       // 60
					self.previousShow.destroy();                                                                                // 61
			});                                                                                                           // 62
		},                                                                                                             // 63
                                                                                                                 // 64
		attrUpdate: function(key, value, oldValue, data, firstTime) {                                                  // 65
			if (key == 'transition') {                                                                                    // 66
				var data = FView.transitions[value];                                                                         // 67
				if (data) {                                                                                                  // 68
					for (key in data)                                                                                           // 69
						this.view[key](data[key]);                                                                                 // 70
				} else {                                                                                                     // 71
					log.error('No such transition ' + transition);                                                              // 72
				}				                                                                                                        // 73
			}                                                                                                             // 74
		}                                                                                                              // 75
	});                                                                                                             // 76
});                                                                                                              // 77
                                                                                                                 // 78
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/views/Scrollview.js                                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FView.ready(function(require) {                                                                                  // 1
	FView.registerView('Scrollview', famous.views.Scrollview, {                                                     // 2
		famousCreatedPost: function() {                                                                                // 3
			this.pipeChildrenTo = this.parent.pipeChildrenTo                                                              // 4
				? [ this.view, this.parent.pipeChildrenTo[0] ]                                                               // 5
				: [ this.view ];                                                                                             // 6
		}                                                                                                              // 7
	});                                                                                                             // 8
});                                                                                                              // 9
                                                                                                                 // 10
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/gadicohen:famous-views/lib/views/Surface.js                                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FView.ready(function(require) {                                                                                  // 1
	FView.registerView('Surface', famous.core.Surface, {                                                            // 2
                                                                                                                 // 3
		add: function(child_fview, child_options) {                                                                    // 4
			var blazeView = this.blazeView;                                                                               // 5
                                                                                                                 // 6
		  log.error("You tried to embed a " + child_fview._view.name + " inside a Surface"                             // 7
		    + ' (parent: ' + parentViewName(blazeView) + ','                                                           // 8
		    + ' template: ' + parentTemplateName(blazeView) + ').  '                                                   // 9
		    + "Surfaces are endpoints in the Famous Render Tree and may not contain "                                  // 10
		  	+ "children themselves.  See "                                                                              // 11
		    + "https://github.com/gadicc/meteor-famous-views/issues/78 for more info.");                               // 12
                                                                                                                 // 13
			throw new Error("Cannot add View to Surface");                                                                // 14
		},                                                                                                             // 15
                                                                                                                 // 16
    attrUpdate: function(key, value, oldValue, data, firstTime) {                                                // 17
    	switch(key) {                                                                                               // 18
    		case 'size':                                                                                               // 19
    			// Let our modifier control our size                                                                      // 20
    			// Long term, rather specify modifierSize and surfaceSize args?                                           // 21
    			if (this._modifier.name == 'StateModifier')                                                               // 22
						this.surface.setSize([undefined,undefined]);                                                               // 23
    			else {                                                                                                    // 24
            this.surface.setSize(value);                                                                         // 25
          }                                                                                                      // 26
    			break;                                                                                                    // 27
                                                                                                                 // 28
        case 'class' :                                                                                           // 29
          if (Match.test(value, String))                                                                         // 30
            value = value.split(" ");                                                                            // 31
          else if (!Match.test(value, [String]))                                                                 // 32
            throw new Error('Surface class= expects string or array of strings');                                // 33
          value.push(this.surfaceClassName);                                                                     // 34
          this.view.setClasses(value);                                                                           // 35
          break;                                                                                                 // 36
                                                                                                                 // 37
        case 'properties' :                                                                                      // 38
          this.view.setProperties(value);                                                                        // 39
          break;                                                                                                 // 40
    	}                                                                                                           // 41
    }                                                                                                            // 42
                                                                                                                 // 43
	});                                                                                                             // 44
});                                                                                                              // 45
                                                                                                                 // 46
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['gadicohen:famous-views'] = {
  FView: FView
};

})();
