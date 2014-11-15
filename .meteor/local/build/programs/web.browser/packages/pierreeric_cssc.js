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

/* Package-scope variables */
var __coffeescriptShare;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/pierreeric:cssc/cssc.coffee.js                           //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/*
CSSC: CoffeeScript's StyleSheet.
@example
  stylesheet = new CSSC
  CSSC.add 'html',
    backgroundColor: 'red'
 */
this.CSSC = (function() {

  /*
  Static method for creating percentage strings.
  @param  {Number} val Value set in the string.
  @return {String}     Stringified value with percentage.
   */
  CSSC.p = function(val) {
    return "" + val + "%";
  };


  /*
  Static method for creating pixel strings.
  @param  {Number} val Value set in the string.
  @return {string}     Stringified value with pixel.
   */

  CSSC.x = function(val) {
    return "" + val + "px";
  };


  /*
  C-tor creating a StyleSheet.
  @return {CSSC} The GhostTag's StyleSheet.
   */

  function CSSC() {
    var style;
    style = document.createElement('style');
    style.setAttribute('media', 'screen');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.sheet = style.sheet;
    this.rulesIdx = 0;
  }


  /*
  Add a CSSRule to the current StyleSheet.
  @param {String} tag        A tag or a class.
  @param {Object} properties A dictionnay of CSS's properties.
   */

  CSSC.prototype.add = function(tag, properties) {
    var key, rule, val;
    this.sheet.insertRule("" + tag + " {}", this.rulesIdx);
    rule = this.sheet.cssRules[this.rulesIdx];
    for (key in properties) {
      val = properties[key];
      rule.style[key] = val;
    }
    return this.rulesIdx++;
  };

  return CSSC;

})();
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['pierreeric:cssc'] = {};

})();
