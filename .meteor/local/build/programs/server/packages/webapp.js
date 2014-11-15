(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Log = Package.logging.Log;
var _ = Package.underscore._;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var Boilerplate = Package['boilerplate-generator'].Boilerplate;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var WebAppHashing = Package['webapp-hashing'].WebAppHashing;

/* Package-scope variables */
var WebApp, main, WebAppInternals;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/webapp/webapp_server.js                                                      //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
////////// Requires //////////                                                           // 1
                                                                                         // 2
var fs = Npm.require("fs");                                                              // 3
var http = Npm.require("http");                                                          // 4
var os = Npm.require("os");                                                              // 5
var path = Npm.require("path");                                                          // 6
var url = Npm.require("url");                                                            // 7
var crypto = Npm.require("crypto");                                                      // 8
                                                                                         // 9
var connect = Npm.require('connect');                                                    // 10
var useragent = Npm.require('useragent');                                                // 11
var send = Npm.require('send');                                                          // 12
                                                                                         // 13
var Future = Npm.require('fibers/future');                                               // 14
var Fiber = Npm.require('fibers');                                                       // 15
                                                                                         // 16
var SHORT_SOCKET_TIMEOUT = 5*1000;                                                       // 17
var LONG_SOCKET_TIMEOUT = 120*1000;                                                      // 18
                                                                                         // 19
WebApp = {};                                                                             // 20
WebAppInternals = {};                                                                    // 21
                                                                                         // 22
WebApp.defaultArch = 'web.browser';                                                      // 23
                                                                                         // 24
// XXX maps archs to manifests                                                           // 25
WebApp.clientPrograms = {};                                                              // 26
                                                                                         // 27
// XXX maps archs to program path on filesystem                                          // 28
var archPath = {};                                                                       // 29
                                                                                         // 30
var bundledJsCssPrefix;                                                                  // 31
                                                                                         // 32
// Keepalives so that when the outer server dies unceremoniously and                     // 33
// doesn't kill us, we quit ourselves. A little gross, but better than                   // 34
// pidfiles.                                                                             // 35
// XXX This should really be part of the boot script, not the webapp package.            // 36
//     Or we should just get rid of it, and rely on containerization.                    // 37
//                                                                                       // 38
// XXX COMPAT WITH 0.9.2.2                                                               // 39
// Keepalives have been replaced with a check that the parent pid is                     // 40
// still running. We keep the --keep-alive option for backwards                          // 41
// compatibility.                                                                        // 42
var initKeepalive = function () {                                                        // 43
  var keepaliveCount = 0;                                                                // 44
                                                                                         // 45
  process.stdin.on('data', function (data) {                                             // 46
    keepaliveCount = 0;                                                                  // 47
  });                                                                                    // 48
                                                                                         // 49
  process.stdin.resume();                                                                // 50
                                                                                         // 51
  setInterval(function () {                                                              // 52
    keepaliveCount ++;                                                                   // 53
    if (keepaliveCount >= 3) {                                                           // 54
      console.log("Failed to receive keepalive! Exiting.");                              // 55
      process.exit(1);                                                                   // 56
    }                                                                                    // 57
  }, 3000);                                                                              // 58
};                                                                                       // 59
                                                                                         // 60
// Check that we have a pid that looks like an integer (non-decimal                      // 61
// integer is okay).                                                                     // 62
var validPid = function (pid) {                                                          // 63
  return ! isNaN(+pid);                                                                  // 64
};                                                                                       // 65
                                                                                         // 66
// As a replacement to the old keepalives mechanism, check for a running                 // 67
// parent every few seconds. Exit if the parent is not running.                          // 68
//                                                                                       // 69
// Two caveats to this strategy:                                                         // 70
// * Doesn't catch the case where the parent is CPU-hogging (but maybe we                // 71
//   don't want to catch that case anyway, since the bundler not yielding                // 72
//   is what caused #2536).                                                              // 73
// * Could be fooled by pid re-use, i.e. if another process comes up and                 // 74
//   takes the parent process's place before the child process dies.                     // 75
var startCheckForLiveParent = function (parentPid) {                                     // 76
  if (parentPid) {                                                                       // 77
    if (! validPid(parentPid)) {                                                         // 78
      console.error("--parent-pid must be a valid process ID.");                         // 79
      process.exit(1);                                                                   // 80
    }                                                                                    // 81
                                                                                         // 82
    setInterval(function () {                                                            // 83
      try {                                                                              // 84
        process.kill(parentPid, 0);                                                      // 85
      } catch (err) {                                                                    // 86
        console.error("Parent process is dead! Exiting.");                               // 87
        process.exit(1);                                                                 // 88
      }                                                                                  // 89
    });                                                                                  // 90
  }                                                                                      // 91
};                                                                                       // 92
                                                                                         // 93
                                                                                         // 94
var sha1 = function (contents) {                                                         // 95
  var hash = crypto.createHash('sha1');                                                  // 96
  hash.update(contents);                                                                 // 97
  return hash.digest('hex');                                                             // 98
};                                                                                       // 99
                                                                                         // 100
var readUtf8FileSync = function (filename) {                                             // 101
  return Meteor.wrapAsync(fs.readFile)(filename, 'utf8');                                // 102
};                                                                                       // 103
                                                                                         // 104
// #BrowserIdentification                                                                // 105
//                                                                                       // 106
// We have multiple places that want to identify the browser: the                        // 107
// unsupported browser page, the appcache package, and, eventually                       // 108
// delivering browser polyfills only as needed.                                          // 109
//                                                                                       // 110
// To avoid detecting the browser in multiple places ad-hoc, we create a                 // 111
// Meteor "browser" object. It uses but does not expose the npm                          // 112
// useragent module (we could choose a different mechanism to identify                   // 113
// the browser in the future if we wanted to).  The browser object                       // 114
// contains                                                                              // 115
//                                                                                       // 116
// * `name`: the name of the browser in camel case                                       // 117
// * `major`, `minor`, `patch`: integers describing the browser version                  // 118
//                                                                                       // 119
// Also here is an early version of a Meteor `request` object, intended                  // 120
// to be a high-level description of the request without exposing                        // 121
// details of connect's low-level `req`.  Currently it contains:                         // 122
//                                                                                       // 123
// * `browser`: browser identification object described above                            // 124
// * `url`: parsed url, including parsed query params                                    // 125
//                                                                                       // 126
// As a temporary hack there is a `categorizeRequest` function on WebApp which           // 127
// converts a connect `req` to a Meteor `request`. This can go away once smart           // 128
// packages such as appcache are being passed a `request` object directly when           // 129
// they serve content.                                                                   // 130
//                                                                                       // 131
// This allows `request` to be used uniformly: it is passed to the html                  // 132
// attributes hook, and the appcache package can use it when deciding                    // 133
// whether to generate a 404 for the manifest.                                           // 134
//                                                                                       // 135
// Real routing / server side rendering will probably refactor this                      // 136
// heavily.                                                                              // 137
                                                                                         // 138
                                                                                         // 139
// e.g. "Mobile Safari" => "mobileSafari"                                                // 140
var camelCase = function (name) {                                                        // 141
  var parts = name.split(' ');                                                           // 142
  parts[0] = parts[0].toLowerCase();                                                     // 143
  for (var i = 1;  i < parts.length;  ++i) {                                             // 144
    parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substr(1);                    // 145
  }                                                                                      // 146
  return parts.join('');                                                                 // 147
};                                                                                       // 148
                                                                                         // 149
var identifyBrowser = function (userAgentString) {                                       // 150
  var userAgent = useragent.lookup(userAgentString);                                     // 151
  return {                                                                               // 152
    name: camelCase(userAgent.family),                                                   // 153
    major: +userAgent.major,                                                             // 154
    minor: +userAgent.minor,                                                             // 155
    patch: +userAgent.patch                                                              // 156
  };                                                                                     // 157
};                                                                                       // 158
                                                                                         // 159
// XXX Refactor as part of implementing real routing.                                    // 160
WebAppInternals.identifyBrowser = identifyBrowser;                                       // 161
                                                                                         // 162
WebApp.categorizeRequest = function (req) {                                              // 163
  return {                                                                               // 164
    browser: identifyBrowser(req.headers['user-agent']),                                 // 165
    url: url.parse(req.url, true)                                                        // 166
  };                                                                                     // 167
};                                                                                       // 168
                                                                                         // 169
// HTML attribute hooks: functions to be called to determine any attributes to           // 170
// be added to the '<html>' tag. Each function is passed a 'request' object (see         // 171
// #BrowserIdentification) and should return a string,                                   // 172
var htmlAttributeHooks = [];                                                             // 173
var getHtmlAttributes = function (request) {                                             // 174
  var combinedAttributes  = {};                                                          // 175
  _.each(htmlAttributeHooks || [], function (hook) {                                     // 176
    var attributes = hook(request);                                                      // 177
    if (attributes === null)                                                             // 178
      return;                                                                            // 179
    if (typeof attributes !== 'object')                                                  // 180
      throw Error("HTML attribute hook must return null or object");                     // 181
    _.extend(combinedAttributes, attributes);                                            // 182
  });                                                                                    // 183
  return combinedAttributes;                                                             // 184
};                                                                                       // 185
WebApp.addHtmlAttributeHook = function (hook) {                                          // 186
  htmlAttributeHooks.push(hook);                                                         // 187
};                                                                                       // 188
                                                                                         // 189
// Serve app HTML for this URL?                                                          // 190
var appUrl = function (url) {                                                            // 191
  if (url === '/favicon.ico' || url === '/robots.txt')                                   // 192
    return false;                                                                        // 193
                                                                                         // 194
  // NOTE: app.manifest is not a web standard like favicon.ico and                       // 195
  // robots.txt. It is a file name we have chosen to use for HTML5                       // 196
  // appcache URLs. It is included here to prevent using an appcache                     // 197
  // then removing it from poisoning an app permanently. Eventually,                     // 198
  // once we have server side routing, this won't be needed as                           // 199
  // unknown URLs with return a 404 automatically.                                       // 200
  if (url === '/app.manifest')                                                           // 201
    return false;                                                                        // 202
                                                                                         // 203
  // Avoid serving app HTML for declared routes such as /sockjs/.                        // 204
  if (RoutePolicy.classify(url))                                                         // 205
    return false;                                                                        // 206
                                                                                         // 207
  // we currently return app HTML on all URLs by default                                 // 208
  return true;                                                                           // 209
};                                                                                       // 210
                                                                                         // 211
                                                                                         // 212
// We need to calculate the client hash after all packages have loaded                   // 213
// to give them a chance to populate __meteor_runtime_config__.                          // 214
//                                                                                       // 215
// Calculating the hash during startup means that packages can only                      // 216
// populate __meteor_runtime_config__ during load, not during startup.                   // 217
//                                                                                       // 218
// Calculating instead it at the beginning of main after all startup                     // 219
// hooks had run would allow packages to also populate                                   // 220
// __meteor_runtime_config__ during startup, but that's too late for                     // 221
// autoupdate because it needs to have the client hash at startup to                     // 222
// insert the auto update version itself into                                            // 223
// __meteor_runtime_config__ to get it to the client.                                    // 224
//                                                                                       // 225
// An alternative would be to give autoupdate a "post-start,                             // 226
// pre-listen" hook to allow it to insert the auto update version at                     // 227
// the right moment.                                                                     // 228
                                                                                         // 229
Meteor.startup(function () {                                                             // 230
  var calculateClientHash = WebAppHashing.calculateClientHash;                           // 231
  WebApp.clientHash = function (archName) {                                              // 232
    archName = archName || WebApp.defaultArch;                                           // 233
    return calculateClientHash(WebApp.clientPrograms[archName].manifest);                // 234
  };                                                                                     // 235
                                                                                         // 236
  WebApp.calculateClientHashRefreshable = function (archName) {                          // 237
    archName = archName || WebApp.defaultArch;                                           // 238
    return calculateClientHash(WebApp.clientPrograms[archName].manifest,                 // 239
      function (name) {                                                                  // 240
        return name === "css";                                                           // 241
      });                                                                                // 242
  };                                                                                     // 243
  WebApp.calculateClientHashNonRefreshable = function (archName) {                       // 244
    archName = archName || WebApp.defaultArch;                                           // 245
    return calculateClientHash(WebApp.clientPrograms[archName].manifest,                 // 246
      function (name) {                                                                  // 247
        return name !== "css";                                                           // 248
      });                                                                                // 249
  };                                                                                     // 250
  WebApp.calculateClientHashCordova = function () {                                      // 251
    var archName = 'web.cordova';                                                        // 252
    if (! WebApp.clientPrograms[archName])                                               // 253
      return 'none';                                                                     // 254
                                                                                         // 255
    return calculateClientHash(                                                          // 256
      WebApp.clientPrograms[archName].manifest, null, _.pick(                            // 257
        __meteor_runtime_config__, 'PUBLIC_SETTINGS'));                                  // 258
  };                                                                                     // 259
});                                                                                      // 260
                                                                                         // 261
                                                                                         // 262
                                                                                         // 263
// When we have a request pending, we want the socket timeout to be long, to             // 264
// give ourselves a while to serve it, and to allow sockjs long polls to                 // 265
// complete.  On the other hand, we want to close idle sockets relatively                // 266
// quickly, so that we can shut down relatively promptly but cleanly, without            // 267
// cutting off anyone's response.                                                        // 268
WebApp._timeoutAdjustmentRequestCallback = function (req, res) {                         // 269
  // this is really just req.socket.setTimeout(LONG_SOCKET_TIMEOUT);                     // 270
  req.setTimeout(LONG_SOCKET_TIMEOUT);                                                   // 271
  // Insert our new finish listener to run BEFORE the existing one which removes         // 272
  // the response from the socket.                                                       // 273
  var finishListeners = res.listeners('finish');                                         // 274
  // XXX Apparently in Node 0.12 this event is now called 'prefinish'.                   // 275
  // https://github.com/joyent/node/commit/7c9b6070                                      // 276
  res.removeAllListeners('finish');                                                      // 277
  res.on('finish', function () {                                                         // 278
    res.setTimeout(SHORT_SOCKET_TIMEOUT);                                                // 279
  });                                                                                    // 280
  _.each(finishListeners, function (l) { res.on('finish', l); });                        // 281
};                                                                                       // 282
                                                                                         // 283
                                                                                         // 284
// Will be updated by main before we listen.                                             // 285
// Map from client arch to boilerplate object.                                           // 286
// Boilerplate object has:                                                               // 287
//   - func: XXX                                                                         // 288
//   - baseData: XXX                                                                     // 289
var boilerplateByArch = {};                                                              // 290
                                                                                         // 291
// Given a request (as returned from `categorizeRequest`), return the                    // 292
// boilerplate HTML to serve for that request. Memoizes on HTML                          // 293
// attributes (used by, eg, appcache) and whether inline scripts are                     // 294
// currently allowed.                                                                    // 295
// XXX so far this function is always called with arch === 'web.browser'                 // 296
var memoizedBoilerplate = {};                                                            // 297
var getBoilerplate = function (request, arch) {                                          // 298
                                                                                         // 299
  var htmlAttributes = getHtmlAttributes(request);                                       // 300
                                                                                         // 301
  // The only thing that changes from request to request (for now) are                   // 302
  // the HTML attributes (used by, eg, appcache) and whether inline                      // 303
  // scripts are allowed, so we can memoize based on that.                               // 304
  var memHash = JSON.stringify({                                                         // 305
    inlineScriptsAllowed: inlineScriptsAllowed,                                          // 306
    htmlAttributes: htmlAttributes,                                                      // 307
    arch: arch                                                                           // 308
  });                                                                                    // 309
                                                                                         // 310
  if (! memoizedBoilerplate[memHash]) {                                                  // 311
    memoizedBoilerplate[memHash] = boilerplateByArch[arch].toHTML({                      // 312
      htmlAttributes: htmlAttributes                                                     // 313
    });                                                                                  // 314
  }                                                                                      // 315
  return memoizedBoilerplate[memHash];                                                   // 316
};                                                                                       // 317
                                                                                         // 318
WebAppInternals.generateBoilerplateInstance = function (arch,                            // 319
                                                        manifest,                        // 320
                                                        additionalOptions) {             // 321
  additionalOptions = additionalOptions || {};                                           // 322
                                                                                         // 323
  var runtimeConfig = _.extend(                                                          // 324
    _.clone(__meteor_runtime_config__),                                                  // 325
    additionalOptions.runtimeConfigOverrides || {}                                       // 326
  );                                                                                     // 327
                                                                                         // 328
  return new Boilerplate(arch, manifest,                                                 // 329
    _.extend({                                                                           // 330
      pathMapper: function (itemPath) {                                                  // 331
        return path.join(archPath[arch], itemPath); },                                   // 332
      baseDataExtension: {                                                               // 333
        additionalStaticJs: _.map(                                                       // 334
          additionalStaticJs || [],                                                      // 335
          function (contents, pathname) {                                                // 336
            return {                                                                     // 337
              pathname: pathname,                                                        // 338
              contents: contents                                                         // 339
            };                                                                           // 340
          }                                                                              // 341
        ),                                                                               // 342
        meteorRuntimeConfig: JSON.stringify(runtimeConfig),                              // 343
        rootUrlPathPrefix: __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '',         // 344
        bundledJsCssPrefix: bundledJsCssPrefix ||                                        // 345
          __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '',                          // 346
        inlineScriptsAllowed: WebAppInternals.inlineScriptsAllowed(),                    // 347
        inline: additionalOptions.inline                                                 // 348
      }                                                                                  // 349
    }, additionalOptions)                                                                // 350
  );                                                                                     // 351
};                                                                                       // 352
                                                                                         // 353
// A mapping from url path to "info". Where "info" has the following fields:             // 354
// - type: the type of file to be served                                                 // 355
// - cacheable: optionally, whether the file should be cached or not                     // 356
// - sourceMapUrl: optionally, the url of the source map                                 // 357
//                                                                                       // 358
// Info also contains one of the following:                                              // 359
// - content: the stringified content that should be served at this path                 // 360
// - absolutePath: the absolute path on disk to the file                                 // 361
                                                                                         // 362
var staticFiles;                                                                         // 363
                                                                                         // 364
// Serve static files from the manifest or added with                                    // 365
// `addStaticJs`. Exported for tests.                                                    // 366
WebAppInternals.staticFilesMiddleware = function (staticFiles, req, res, next) {         // 367
  if ('GET' != req.method && 'HEAD' != req.method) {                                     // 368
    next();                                                                              // 369
    return;                                                                              // 370
  }                                                                                      // 371
  var pathname = connect.utils.parseUrl(req).pathname;                                   // 372
  try {                                                                                  // 373
    pathname = decodeURIComponent(pathname);                                             // 374
  } catch (e) {                                                                          // 375
    next();                                                                              // 376
    return;                                                                              // 377
  }                                                                                      // 378
                                                                                         // 379
  var serveStaticJs = function (s) {                                                     // 380
    res.writeHead(200, {                                                                 // 381
      'Content-type': 'application/javascript; charset=UTF-8'                            // 382
    });                                                                                  // 383
    res.write(s);                                                                        // 384
    res.end();                                                                           // 385
  };                                                                                     // 386
                                                                                         // 387
  if (pathname === "/meteor_runtime_config.js" &&                                        // 388
      ! WebAppInternals.inlineScriptsAllowed()) {                                        // 389
    serveStaticJs("__meteor_runtime_config__ = " +                                       // 390
                  JSON.stringify(__meteor_runtime_config__) + ";");                      // 391
    return;                                                                              // 392
  } else if (_.has(additionalStaticJs, pathname) &&                                      // 393
              ! WebAppInternals.inlineScriptsAllowed()) {                                // 394
    serveStaticJs(additionalStaticJs[pathname]);                                         // 395
    return;                                                                              // 396
  }                                                                                      // 397
                                                                                         // 398
  if (!_.has(staticFiles, pathname)) {                                                   // 399
    next();                                                                              // 400
    return;                                                                              // 401
  }                                                                                      // 402
                                                                                         // 403
  // We don't need to call pause because, unlike 'static', once we call into             // 404
  // 'send' and yield to the event loop, we never call another handler with              // 405
  // 'next'.                                                                             // 406
                                                                                         // 407
  var info = staticFiles[pathname];                                                      // 408
                                                                                         // 409
  // Cacheable files are files that should never change. Typically                       // 410
  // named by their hash (eg meteor bundled js and css files).                           // 411
  // We cache them ~forever (1yr).                                                       // 412
  //                                                                                     // 413
  // We cache non-cacheable files anyway. This isn't really correct, as users            // 414
  // can change the files and changes won't propagate immediately. However, if           // 415
  // we don't cache them, browsers will 'flicker' when rerendering                       // 416
  // images. Eventually we will probably want to rewrite URLs of static assets           // 417
  // to include a query parameter to bust caches. That way we can both get               // 418
  // good caching behavior and allow users to change assets without delay.               // 419
  // https://github.com/meteor/meteor/issues/773                                         // 420
  var maxAge = info.cacheable                                                            // 421
        ? 1000 * 60 * 60 * 24 * 365                                                      // 422
        : 1000 * 60 * 60 * 24;                                                           // 423
                                                                                         // 424
  // Set the X-SourceMap header, which current Chrome, FireFox, and Safari               // 425
  // understand.  (The SourceMap header is slightly more spec-correct but FF             // 426
  // doesn't understand it.)                                                             // 427
  //                                                                                     // 428
  // You may also need to enable source maps in Chrome: open dev tools, click            // 429
  // the gear in the bottom right corner, and select "enable source maps".               // 430
  if (info.sourceMapUrl) {                                                               // 431
    res.setHeader('X-SourceMap',                                                         // 432
                  __meteor_runtime_config__.ROOT_URL_PATH_PREFIX +                       // 433
                  info.sourceMapUrl);                                                    // 434
  }                                                                                      // 435
                                                                                         // 436
  if (info.type === "js") {                                                              // 437
    res.setHeader("Content-Type", "application/javascript; charset=UTF-8");              // 438
  } else if (info.type === "css") {                                                      // 439
    res.setHeader("Content-Type", "text/css; charset=UTF-8");                            // 440
  } else if (info.type === "json") {                                                     // 441
    res.setHeader("Content-Type", "application/json; charset=UTF-8");                    // 442
    // XXX if it is a manifest we are serving, set additional headers                    // 443
    if (/\/manifest.json$/.test(pathname)) {                                             // 444
      res.setHeader("Access-Control-Allow-Origin", "*");                                 // 445
    }                                                                                    // 446
  }                                                                                      // 447
                                                                                         // 448
  if (info.content) {                                                                    // 449
    res.write(info.content);                                                             // 450
    res.end();                                                                           // 451
  } else {                                                                               // 452
    send(req, info.absolutePath)                                                         // 453
      .maxage(maxAge)                                                                    // 454
      .hidden(true)  // if we specified a dotfile in the manifest, serve it              // 455
      .on('error', function (err) {                                                      // 456
        Log.error("Error serving static file " + err);                                   // 457
        res.writeHead(500);                                                              // 458
        res.end();                                                                       // 459
      })                                                                                 // 460
      .on('directory', function () {                                                     // 461
        Log.error("Unexpected directory " + info.absolutePath);                          // 462
        res.writeHead(500);                                                              // 463
        res.end();                                                                       // 464
      })                                                                                 // 465
      .pipe(res);                                                                        // 466
  }                                                                                      // 467
};                                                                                       // 468
                                                                                         // 469
var getUrlPrefixForArch = function (arch) {                                              // 470
  // XXX we rely on the fact that arch names don't contain slashes                       // 471
  // in that case we would need to uri escape it                                         // 472
                                                                                         // 473
  // We add '__' to the beginning of non-standard archs to "scope" the url               // 474
  // to Meteor internals.                                                                // 475
  return arch === WebApp.defaultArch ?                                                   // 476
    '' : '/' + '__' + arch.replace(/^web\./, '');                                        // 477
};                                                                                       // 478
                                                                                         // 479
var runWebAppServer = function () {                                                      // 480
  var shuttingDown = false;                                                              // 481
  var syncQueue = new Meteor._SynchronousQueue();                                        // 482
                                                                                         // 483
  var getItemPathname = function (itemUrl) {                                             // 484
    return decodeURIComponent(url.parse(itemUrl).pathname);                              // 485
  };                                                                                     // 486
                                                                                         // 487
  WebAppInternals.reloadClientPrograms = function () {                                   // 488
    syncQueue.runTask(function() {                                                       // 489
      staticFiles = {};                                                                  // 490
      var generateClientProgram = function (clientPath, arch) {                          // 491
        // read the control for the client we'll be serving up                           // 492
        var clientJsonPath = path.join(__meteor_bootstrap__.serverDir,                   // 493
                                   clientPath);                                          // 494
        var clientDir = path.dirname(clientJsonPath);                                    // 495
        var clientJson = JSON.parse(readUtf8FileSync(clientJsonPath));                   // 496
        if (clientJson.format !== "web-program-pre1")                                    // 497
          throw new Error("Unsupported format for client assets: " +                     // 498
                          JSON.stringify(clientJson.format));                            // 499
                                                                                         // 500
        if (! clientJsonPath || ! clientDir || ! clientJson)                             // 501
          throw new Error("Client config file not parsed.");                             // 502
                                                                                         // 503
        var urlPrefix = getUrlPrefixForArch(arch);                                       // 504
                                                                                         // 505
        var manifest = clientJson.manifest;                                              // 506
        _.each(manifest, function (item) {                                               // 507
          if (item.url && item.where === "client") {                                     // 508
            staticFiles[urlPrefix + getItemPathname(item.url)] = {                       // 509
              absolutePath: path.join(clientDir, item.path),                             // 510
              cacheable: item.cacheable,                                                 // 511
              // Link from source to its map                                             // 512
              sourceMapUrl: item.sourceMapUrl,                                           // 513
              type: item.type                                                            // 514
            };                                                                           // 515
                                                                                         // 516
            if (item.sourceMap) {                                                        // 517
              // Serve the source map too, under the specified URL. We assume all        // 518
              // source maps are cacheable.                                              // 519
              staticFiles[urlPrefix + getItemPathname(item.sourceMapUrl)] = {            // 520
                absolutePath: path.join(clientDir, item.sourceMap),                      // 521
                cacheable: true                                                          // 522
              };                                                                         // 523
            }                                                                            // 524
          }                                                                              // 525
        });                                                                              // 526
                                                                                         // 527
        var program = {                                                                  // 528
          manifest: manifest,                                                            // 529
          version: WebAppHashing.calculateClientHash(manifest, null, _.pick(             // 530
            __meteor_runtime_config__, 'PUBLIC_SETTINGS')),                              // 531
          PUBLIC_SETTINGS: __meteor_runtime_config__.PUBLIC_SETTINGS                     // 532
        };                                                                               // 533
                                                                                         // 534
        WebApp.clientPrograms[arch] = program;                                           // 535
                                                                                         // 536
        // Serve the program as a string at /foo/<arch>/manifest.json                    // 537
        // XXX change manifest.json -> program.json                                      // 538
        staticFiles[path.join(urlPrefix, 'manifest.json')] = {                           // 539
          content: JSON.stringify(program),                                              // 540
          cacheable: true,                                                               // 541
          type: "json"                                                                   // 542
        };                                                                               // 543
      };                                                                                 // 544
                                                                                         // 545
      try {                                                                              // 546
        var clientPaths = __meteor_bootstrap__.configJson.clientPaths;                   // 547
        _.each(clientPaths, function (clientPath, arch) {                                // 548
          archPath[arch] = path.dirname(clientPath);                                     // 549
          generateClientProgram(clientPath, arch);                                       // 550
        });                                                                              // 551
                                                                                         // 552
        // Exported for tests.                                                           // 553
        WebAppInternals.staticFiles = staticFiles;                                       // 554
      } catch (e) {                                                                      // 555
        Log.error("Error reloading the client program: " + e.stack);                     // 556
        process.exit(1);                                                                 // 557
      }                                                                                  // 558
    });                                                                                  // 559
  };                                                                                     // 560
                                                                                         // 561
  WebAppInternals.generateBoilerplate = function () {                                    // 562
    // This boilerplate will be served to the mobile devices when used with              // 563
    // Meteor/Cordova for the Hot-Code Push and since the file will be served by         // 564
    // the device's server, it is important to set the DDP url to the actual             // 565
    // Meteor server accepting DDP connections and not the device's file server.         // 566
    var defaultOptionsForArch = {                                                        // 567
      'web.cordova': {                                                                   // 568
        runtimeConfigOverrides: {                                                        // 569
          // XXX We use absoluteUrl() here so that we serve https://                     // 570
          // URLs to cordova clients if force-ssl is in use. If we were                  // 571
          // to use __meteor_runtime_config__.ROOT_URL instead of                        // 572
          // absoluteUrl(), then Cordova clients would immediately get a                 // 573
          // HCP setting their DDP_DEFAULT_CONNECTION_URL to                             // 574
          // http://example.meteor.com. This breaks the app, because                     // 575
          // force-ssl doesn't serve CORS headers on 302                                 // 576
          // redirects. (Plus it's undesirable to have clients                           // 577
          // connecting to http://example.meteor.com when force-ssl is                   // 578
          // in use.)                                                                    // 579
          DDP_DEFAULT_CONNECTION_URL: process.env.MOBILE_DDP_URL ||                      // 580
            Meteor.absoluteUrl(),                                                        // 581
          ROOT_URL: process.env.MOBILE_ROOT_URL ||                                       // 582
            Meteor.absoluteUrl()                                                         // 583
        }                                                                                // 584
      }                                                                                  // 585
    };                                                                                   // 586
                                                                                         // 587
    syncQueue.runTask(function() {                                                       // 588
      _.each(WebApp.clientPrograms, function (program, archName) {                       // 589
        boilerplateByArch[archName] =                                                    // 590
          WebAppInternals.generateBoilerplateInstance(                                   // 591
            archName, program.manifest,                                                  // 592
            defaultOptionsForArch[archName]);                                            // 593
      });                                                                                // 594
                                                                                         // 595
      // Clear the memoized boilerplate cache.                                           // 596
      memoizedBoilerplate = {};                                                          // 597
                                                                                         // 598
      // Configure CSS injection for the default arch                                    // 599
      // XXX implement the CSS injection for all archs?                                  // 600
      WebAppInternals.refreshableAssets = {                                              // 601
        allCss: boilerplateByArch[WebApp.defaultArch].baseData.css                       // 602
      };                                                                                 // 603
    });                                                                                  // 604
  };                                                                                     // 605
                                                                                         // 606
  WebAppInternals.reloadClientPrograms();                                                // 607
                                                                                         // 608
  // webserver                                                                           // 609
  var app = connect();                                                                   // 610
                                                                                         // 611
  // Auto-compress any json, javascript, or text.                                        // 612
  app.use(connect.compress());                                                           // 613
                                                                                         // 614
  // Packages and apps can add handlers that run before any other Meteor                 // 615
  // handlers via WebApp.rawConnectHandlers.                                             // 616
  var rawConnectHandlers = connect();                                                    // 617
  app.use(rawConnectHandlers);                                                           // 618
                                                                                         // 619
  // Strip off the path prefix, if it exists.                                            // 620
  app.use(function (request, response, next) {                                           // 621
    var pathPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;                     // 622
    var url = Npm.require('url').parse(request.url);                                     // 623
    var pathname = url.pathname;                                                         // 624
    // check if the path in the url starts with the path prefix (and the part            // 625
    // after the path prefix must start with a / if it exists.)                          // 626
    if (pathPrefix && pathname.substring(0, pathPrefix.length) === pathPrefix &&         // 627
       (pathname.length == pathPrefix.length                                             // 628
        || pathname.substring(pathPrefix.length, pathPrefix.length + 1) === "/")) {      // 629
      request.url = request.url.substring(pathPrefix.length);                            // 630
      next();                                                                            // 631
    } else if (pathname === "/favicon.ico" || pathname === "/robots.txt") {              // 632
      next();                                                                            // 633
    } else if (pathPrefix) {                                                             // 634
      response.writeHead(404);                                                           // 635
      response.write("Unknown path");                                                    // 636
      response.end();                                                                    // 637
    } else {                                                                             // 638
      next();                                                                            // 639
    }                                                                                    // 640
  });                                                                                    // 641
                                                                                         // 642
  // Parse the query string into res.query. Used by oauth_server, but it's               // 643
  // generally pretty handy..                                                            // 644
  app.use(connect.query());                                                              // 645
                                                                                         // 646
  // Serve static files from the manifest.                                               // 647
  // This is inspired by the 'static' middleware.                                        // 648
  app.use(function (req, res, next) {                                                    // 649
    Fiber(function () {                                                                  // 650
     WebAppInternals.staticFilesMiddleware(staticFiles, req, res, next);                 // 651
    }).run();                                                                            // 652
  });                                                                                    // 653
                                                                                         // 654
  // Packages and apps can add handlers to this via WebApp.connectHandlers.              // 655
  // They are inserted before our default handler.                                       // 656
  var packageAndAppHandlers = connect();                                                 // 657
  app.use(packageAndAppHandlers);                                                        // 658
                                                                                         // 659
  var suppressConnectErrors = false;                                                     // 660
  // connect knows it is an error handler because it has 4 arguments instead of          // 661
  // 3. go figure.  (It is not smart enough to find such a thing if it's hidden          // 662
  // inside packageAndAppHandlers.)                                                      // 663
  app.use(function (err, req, res, next) {                                               // 664
    if (!err || !suppressConnectErrors || !req.headers['x-suppress-error']) {            // 665
      next(err);                                                                         // 666
      return;                                                                            // 667
    }                                                                                    // 668
    res.writeHead(err.status, { 'Content-Type': 'text/plain' });                         // 669
    res.end("An error message");                                                         // 670
  });                                                                                    // 671
                                                                                         // 672
  app.use(function (req, res, next) {                                                    // 673
    if (! appUrl(req.url))                                                               // 674
      return next();                                                                     // 675
                                                                                         // 676
    var headers = {                                                                      // 677
      'Content-Type':  'text/html; charset=utf-8'                                        // 678
    };                                                                                   // 679
    if (shuttingDown)                                                                    // 680
      headers['Connection'] = 'Close';                                                   // 681
                                                                                         // 682
    var request = WebApp.categorizeRequest(req);                                         // 683
                                                                                         // 684
    if (request.url.query && request.url.query['meteor_css_resource']) {                 // 685
      // In this case, we're requesting a CSS resource in the meteor-specific            // 686
      // way, but we don't have it.  Serve a static css file that indicates that         // 687
      // we didn't have it, so we can detect that and refresh.                           // 688
      headers['Content-Type'] = 'text/css; charset=utf-8';                               // 689
      res.writeHead(200, headers);                                                       // 690
      res.write(".meteor-css-not-found-error { width: 0px;}");                           // 691
      res.end();                                                                         // 692
      return undefined;                                                                  // 693
    }                                                                                    // 694
                                                                                         // 695
    // /packages/asdfsad ... /__cordova/dafsdf.js                                        // 696
    var pathname = connect.utils.parseUrl(req).pathname;                                 // 697
    var archKey = pathname.split('/')[1];                                                // 698
    var archKeyCleaned = 'web.' + archKey.replace(/^__/, '');                            // 699
                                                                                         // 700
    if (! /^__/.test(archKey) || ! _.has(archPath, archKeyCleaned)) {                    // 701
      archKey = WebApp.defaultArch;                                                      // 702
    } else {                                                                             // 703
      archKey = archKeyCleaned;                                                          // 704
    }                                                                                    // 705
                                                                                         // 706
    var boilerplate;                                                                     // 707
    try {                                                                                // 708
      boilerplate = getBoilerplate(request, archKey);                                    // 709
    } catch (e) {                                                                        // 710
      Log.error("Error running template: " + e);                                         // 711
      res.writeHead(500, headers);                                                       // 712
      res.end();                                                                         // 713
      return undefined;                                                                  // 714
    }                                                                                    // 715
                                                                                         // 716
    res.writeHead(200, headers);                                                         // 717
    res.write(boilerplate);                                                              // 718
    res.end();                                                                           // 719
    return undefined;                                                                    // 720
  });                                                                                    // 721
                                                                                         // 722
  // Return 404 by default, if no other handlers serve this URL.                         // 723
  app.use(function (req, res) {                                                          // 724
    res.writeHead(404);                                                                  // 725
    res.end();                                                                           // 726
  });                                                                                    // 727
                                                                                         // 728
                                                                                         // 729
  var httpServer = http.createServer(app);                                               // 730
  var onListeningCallbacks = [];                                                         // 731
                                                                                         // 732
  // After 5 seconds w/o data on a socket, kill it.  On the other hand, if               // 733
  // there's an outstanding request, give it a higher timeout instead (to avoid          // 734
  // killing long-polling requests)                                                      // 735
  httpServer.setTimeout(SHORT_SOCKET_TIMEOUT);                                           // 736
                                                                                         // 737
  // Do this here, and then also in livedata/stream_server.js, because                   // 738
  // stream_server.js kills all the current request handlers when installing its         // 739
  // own.                                                                                // 740
  httpServer.on('request', WebApp._timeoutAdjustmentRequestCallback);                    // 741
                                                                                         // 742
                                                                                         // 743
  // For now, handle SIGHUP here.  Later, this should be in some centralized             // 744
  // Meteor shutdown code.                                                               // 745
  process.on('SIGHUP', Meteor.bindEnvironment(function () {                              // 746
    shuttingDown = true;                                                                 // 747
    // tell others with websockets open that we plan to close this.                      // 748
    // XXX: Eventually, this should be done with a standard meteor shut-down             // 749
    // logic path.                                                                       // 750
    httpServer.emit('meteor-closing');                                                   // 751
                                                                                         // 752
    httpServer.close(Meteor.bindEnvironment(function () {                                // 753
      if (proxy) {                                                                       // 754
        try {                                                                            // 755
          proxy.call('removeBindingsForJob', process.env.GALAXY_JOB);                    // 756
        } catch (e) {                                                                    // 757
          Log.error("Error removing bindings: " + e.message);                            // 758
          process.exit(1);                                                               // 759
        }                                                                                // 760
      }                                                                                  // 761
      process.exit(0);                                                                   // 762
                                                                                         // 763
    }, "On http server close failed"));                                                  // 764
                                                                                         // 765
    // Ideally we will close before this hits.                                           // 766
    Meteor.setTimeout(function () {                                                      // 767
      Log.warn("Closed by SIGHUP but one or more HTTP requests may not have finished."); // 768
      process.exit(1);                                                                   // 769
    }, 5000);                                                                            // 770
                                                                                         // 771
  }, function (err) {                                                                    // 772
    console.log(err);                                                                    // 773
    process.exit(1);                                                                     // 774
  }));                                                                                   // 775
                                                                                         // 776
  // start up app                                                                        // 777
  _.extend(WebApp, {                                                                     // 778
    connectHandlers: packageAndAppHandlers,                                              // 779
    rawConnectHandlers: rawConnectHandlers,                                              // 780
    httpServer: httpServer,                                                              // 781
    // For testing.                                                                      // 782
    suppressConnectErrors: function () {                                                 // 783
      suppressConnectErrors = true;                                                      // 784
    },                                                                                   // 785
    onListening: function (f) {                                                          // 786
      if (onListeningCallbacks)                                                          // 787
        onListeningCallbacks.push(f);                                                    // 788
      else                                                                               // 789
        f();                                                                             // 790
    },                                                                                   // 791
    // Hack: allow http tests to call connect.basicAuth without making them              // 792
    // Npm.depends on another copy of connect. (That would be fine if we could           // 793
    // have test-only NPM dependencies but is overkill here.)                            // 794
    __basicAuth__: connect.basicAuth                                                     // 795
  });                                                                                    // 796
                                                                                         // 797
  // Let the rest of the packages (and Meteor.startup hooks) insert connect              // 798
  // middlewares and update __meteor_runtime_config__, then keep going to set up         // 799
  // actually serving HTML.                                                              // 800
  main = function (argv) {                                                               // 801
    // main happens post startup hooks, so we don't need a Meteor.startup() to           // 802
    // ensure this happens after the galaxy package is loaded.                           // 803
    var AppConfig = Package["application-configuration"].AppConfig;                      // 804
    // We used to use the optimist npm package to parse argv here, but it's              // 805
    // overkill (and no longer in the dev bundle). Just assume any instance of           // 806
    // '--keepalive' is a use of the option.                                             // 807
    // XXX COMPAT WITH 0.9.2.2                                                           // 808
    // We used to expect keepalives to be written to stdin every few                     // 809
    // seconds; now we just check if the parent process is still alive                   // 810
    // every few seconds.                                                                // 811
    var expectKeepalives = _.contains(argv, '--keepalive');                              // 812
    // XXX Saddest argument parsing ever, should we add optimist back to                 // 813
    // the dev bundle?                                                                   // 814
    var parentPid = null;                                                                // 815
    var parentPidIndex = _.indexOf(argv, "--parent-pid");                                // 816
    if (parentPidIndex !== -1) {                                                         // 817
      parentPid = argv[parentPidIndex + 1];                                              // 818
    }                                                                                    // 819
    WebAppInternals.generateBoilerplate();                                               // 820
                                                                                         // 821
    // only start listening after all the startup code has run.                          // 822
    var localPort = parseInt(process.env.PORT) || 0;                                     // 823
    var host = process.env.BIND_IP;                                                      // 824
    var localIp = host || '0.0.0.0';                                                     // 825
    httpServer.listen(localPort, localIp, Meteor.bindEnvironment(function() {            // 826
      if (expectKeepalives || parentPid)                                                 // 827
        console.log("LISTENING"); // must match run-app.js                               // 828
      var proxyBinding;                                                                  // 829
                                                                                         // 830
      AppConfig.configurePackage('webapp', function (configuration) {                    // 831
        if (proxyBinding)                                                                // 832
          proxyBinding.stop();                                                           // 833
        if (configuration && configuration.proxy) {                                      // 834
          // TODO: We got rid of the place where this checks the app's                   // 835
          // configuration, because this wants to be configured for some things          // 836
          // on a per-job basis.  Discuss w/ teammates.                                  // 837
          proxyBinding = AppConfig.configureService(                                     // 838
            "proxy",                                                                     // 839
            "pre0",                                                                      // 840
            function (proxyService) {                                                    // 841
              if (proxyService && ! _.isEmpty(proxyService)) {                           // 842
                var proxyConf;                                                           // 843
                // XXX Figure out a per-job way to specify bind location                 // 844
                // (besides hardcoding the location for ADMIN_APP jobs).                 // 845
                if (process.env.ADMIN_APP) {                                             // 846
                  var bindPathPrefix = "";                                               // 847
                  if (process.env.GALAXY_APP !== "panel") {                              // 848
                    bindPathPrefix = "/" + bindPathPrefix +                              // 849
                      encodeURIComponent(                                                // 850
                        process.env.GALAXY_APP                                           // 851
                      ).replace(/\./g, '_');                                             // 852
                  }                                                                      // 853
                  proxyConf = {                                                          // 854
                    bindHost: process.env.GALAXY_NAME,                                   // 855
                    bindPathPrefix: bindPathPrefix,                                      // 856
                    requiresAuth: true                                                   // 857
                  };                                                                     // 858
                } else {                                                                 // 859
                  proxyConf = configuration.proxy;                                       // 860
                }                                                                        // 861
                Log("Attempting to bind to proxy at " +                                  // 862
                    proxyService);                                                       // 863
                WebAppInternals.bindToProxy(_.extend({                                   // 864
                  proxyEndpoint: proxyService                                            // 865
                }, proxyConf));                                                          // 866
              }                                                                          // 867
            }                                                                            // 868
          );                                                                             // 869
        }                                                                                // 870
      });                                                                                // 871
                                                                                         // 872
      var callbacks = onListeningCallbacks;                                              // 873
      onListeningCallbacks = null;                                                       // 874
      _.each(callbacks, function (x) { x(); });                                          // 875
                                                                                         // 876
    }, function (e) {                                                                    // 877
      console.error("Error listening:", e);                                              // 878
      console.error(e && e.stack);                                                       // 879
    }));                                                                                 // 880
                                                                                         // 881
    if (expectKeepalives) {                                                              // 882
      initKeepalive();                                                                   // 883
    }                                                                                    // 884
    if (parentPid) {                                                                     // 885
      startCheckForLiveParent(parentPid);                                                // 886
    }                                                                                    // 887
    return 'DAEMON';                                                                     // 888
  };                                                                                     // 889
};                                                                                       // 890
                                                                                         // 891
                                                                                         // 892
var proxy;                                                                               // 893
WebAppInternals.bindToProxy = function (proxyConfig) {                                   // 894
  var securePort = proxyConfig.securePort || 4433;                                       // 895
  var insecurePort = proxyConfig.insecurePort || 8080;                                   // 896
  var bindPathPrefix = proxyConfig.bindPathPrefix || "";                                 // 897
  // XXX also support galaxy-based lookup                                                // 898
  if (!proxyConfig.proxyEndpoint)                                                        // 899
    throw new Error("missing proxyEndpoint");                                            // 900
  if (!proxyConfig.bindHost)                                                             // 901
    throw new Error("missing bindHost");                                                 // 902
  if (!process.env.GALAXY_JOB)                                                           // 903
    throw new Error("missing $GALAXY_JOB");                                              // 904
  if (!process.env.GALAXY_APP)                                                           // 905
    throw new Error("missing $GALAXY_APP");                                              // 906
  if (!process.env.LAST_START)                                                           // 907
    throw new Error("missing $LAST_START");                                              // 908
                                                                                         // 909
  // XXX rename pid argument to bindTo.                                                  // 910
  // XXX factor out into a 'getPid' function in a 'galaxy' package?                      // 911
  var pid = {                                                                            // 912
    job: process.env.GALAXY_JOB,                                                         // 913
    lastStarted: +(process.env.LAST_START),                                              // 914
    app: process.env.GALAXY_APP                                                          // 915
  };                                                                                     // 916
  var myHost = os.hostname();                                                            // 917
                                                                                         // 918
  WebAppInternals.usingDdpProxy = true;                                                  // 919
                                                                                         // 920
  // This is run after packages are loaded (in main) so we can use                       // 921
  // Follower.connect.                                                                   // 922
  if (proxy) {                                                                           // 923
    // XXX the concept here is that our configuration has changed and                    // 924
    // we have connected to an entirely new follower set, which does                     // 925
    // not have the state that we set up on the follower set that we                     // 926
    // were previously connected to, and so we need to recreate all of                   // 927
    // our bindings -- analogous to getting a SIGHUP and rereading                       // 928
    // your configuration file. so probably this should actually tear                    // 929
    // down the connection and make a whole new one, rather than                         // 930
    // hot-reconnecting to a different URL.                                              // 931
    proxy.reconnect({                                                                    // 932
      url: proxyConfig.proxyEndpoint                                                     // 933
    });                                                                                  // 934
  } else {                                                                               // 935
    proxy = Package["follower-livedata"].Follower.connect(                               // 936
      proxyConfig.proxyEndpoint, {                                                       // 937
        group: "proxy"                                                                   // 938
      }                                                                                  // 939
    );                                                                                   // 940
  }                                                                                      // 941
                                                                                         // 942
  var route = process.env.ROUTE;                                                         // 943
  var ourHost = route.split(":")[0];                                                     // 944
  var ourPort = +route.split(":")[1];                                                    // 945
                                                                                         // 946
  var outstanding = 0;                                                                   // 947
  var startedAll = false;                                                                // 948
  var checkComplete = function () {                                                      // 949
    if (startedAll && ! outstanding)                                                     // 950
      Log("Bound to proxy.");                                                            // 951
  };                                                                                     // 952
  var makeCallback = function () {                                                       // 953
    outstanding++;                                                                       // 954
    return function (err) {                                                              // 955
      if (err)                                                                           // 956
        throw err;                                                                       // 957
      outstanding--;                                                                     // 958
      checkComplete();                                                                   // 959
    };                                                                                   // 960
  };                                                                                     // 961
                                                                                         // 962
  // for now, have our (temporary) requiresAuth flag apply to all                        // 963
  // routes created by this process.                                                     // 964
  var requiresDdpAuth = !! proxyConfig.requiresAuth;                                     // 965
  var requiresHttpAuth = (!! proxyConfig.requiresAuth) &&                                // 966
        (pid.app !== "panel" && pid.app !== "auth");                                     // 967
                                                                                         // 968
  // XXX a current limitation is that we treat securePort and                            // 969
  // insecurePort as a global configuration parameter -- we assume                       // 970
  // that if the proxy wants us to ask for 8080 to get port 80 traffic                   // 971
  // on our default hostname, that's the same port that we would use                     // 972
  // to get traffic on some other hostname that our proxy listens                        // 973
  // for. Likewise, we assume that if the proxy can receive secure                       // 974
  // traffic for our domain, it can assume secure traffic for any                        // 975
  // domain! Hopefully this will get cleaned up before too long by                       // 976
  // pushing that logic into the proxy service, so we can just ask for                   // 977
  // port 80.                                                                            // 978
                                                                                         // 979
  // XXX BUG: if our configuration changes, and bindPathPrefix                           // 980
  // changes, it appears that we will not remove the routes derived                      // 981
  // from the old bindPathPrefix from the proxy (until the process                       // 982
  // exits). It is not actually normal for bindPathPrefix to change,                     // 983
  // certainly not without a process restart for other reasons, but                      // 984
  // it'd be nice to fix.                                                                // 985
                                                                                         // 986
  _.each(routes, function (route) {                                                      // 987
    var parsedUrl = url.parse(route.url, /* parseQueryString */ false,                   // 988
                              /* slashesDenoteHost aka workRight */ true);               // 989
    if (parsedUrl.protocol || parsedUrl.port || parsedUrl.search)                        // 990
      throw new Error("Bad url");                                                        // 991
    parsedUrl.host = null;                                                               // 992
    parsedUrl.path = null;                                                               // 993
    if (! parsedUrl.hostname) {                                                          // 994
      parsedUrl.hostname = proxyConfig.bindHost;                                         // 995
      if (! parsedUrl.pathname)                                                          // 996
        parsedUrl.pathname = "";                                                         // 997
      if (! parsedUrl.pathname.indexOf("/") !== 0) {                                     // 998
        // Relative path                                                                 // 999
        parsedUrl.pathname = bindPathPrefix + parsedUrl.pathname;                        // 1000
      }                                                                                  // 1001
    }                                                                                    // 1002
    var version = "";                                                                    // 1003
                                                                                         // 1004
    var AppConfig = Package["application-configuration"].AppConfig;                      // 1005
    version = AppConfig.getStarForThisJob() || "";                                       // 1006
                                                                                         // 1007
                                                                                         // 1008
    var parsedDdpUrl = _.clone(parsedUrl);                                               // 1009
    parsedDdpUrl.protocol = "ddp";                                                       // 1010
    // Node has a hardcoded list of protocols that get '://' instead                     // 1011
    // of ':'. ddp needs to be added to that whitelist. Until then, we                   // 1012
    // can set the undocumented attribute 'slashes' to get the right                     // 1013
    // behavior. It's not clear whether than is by design or accident.                   // 1014
    parsedDdpUrl.slashes = true;                                                         // 1015
    parsedDdpUrl.port = '' + securePort;                                                 // 1016
    var ddpUrl = url.format(parsedDdpUrl);                                               // 1017
                                                                                         // 1018
    var proxyToHost, proxyToPort, proxyToPathPrefix;                                     // 1019
    if (! _.has(route, 'forwardTo')) {                                                   // 1020
      proxyToHost = ourHost;                                                             // 1021
      proxyToPort = ourPort;                                                             // 1022
      proxyToPathPrefix = parsedUrl.pathname;                                            // 1023
    } else {                                                                             // 1024
      var parsedFwdUrl = url.parse(route.forwardTo, false, true);                        // 1025
      if (! parsedFwdUrl.hostname || parsedFwdUrl.protocol)                              // 1026
        throw new Error("Bad forward url");                                              // 1027
      proxyToHost = parsedFwdUrl.hostname;                                               // 1028
      proxyToPort = parseInt(parsedFwdUrl.port || "80");                                 // 1029
      proxyToPathPrefix = parsedFwdUrl.pathname || "";                                   // 1030
    }                                                                                    // 1031
                                                                                         // 1032
    if (route.ddp) {                                                                     // 1033
      proxy.call('bindDdp', {                                                            // 1034
        pid: pid,                                                                        // 1035
        bindTo: {                                                                        // 1036
          ddpUrl: ddpUrl,                                                                // 1037
          insecurePort: insecurePort                                                     // 1038
        },                                                                               // 1039
        proxyTo: {                                                                       // 1040
          tags: [version],                                                               // 1041
          host: proxyToHost,                                                             // 1042
          port: proxyToPort,                                                             // 1043
          pathPrefix: proxyToPathPrefix + '/websocket'                                   // 1044
        },                                                                               // 1045
        requiresAuth: requiresDdpAuth                                                    // 1046
      }, makeCallback());                                                                // 1047
    }                                                                                    // 1048
                                                                                         // 1049
    if (route.http) {                                                                    // 1050
      proxy.call('bindHttp', {                                                           // 1051
        pid: pid,                                                                        // 1052
        bindTo: {                                                                        // 1053
          host: parsedUrl.hostname,                                                      // 1054
          port: insecurePort,                                                            // 1055
          pathPrefix: parsedUrl.pathname                                                 // 1056
        },                                                                               // 1057
        proxyTo: {                                                                       // 1058
          tags: [version],                                                               // 1059
          host: proxyToHost,                                                             // 1060
          port: proxyToPort,                                                             // 1061
          pathPrefix: proxyToPathPrefix                                                  // 1062
        },                                                                               // 1063
        requiresAuth: requiresHttpAuth                                                   // 1064
      }, makeCallback());                                                                // 1065
                                                                                         // 1066
      // Only make the secure binding if we've been told that the                        // 1067
      // proxy knows how terminate secure connections for us (has an                     // 1068
      // appropriate cert, can bind the necessary port..)                                // 1069
      if (proxyConfig.securePort !== null) {                                             // 1070
        proxy.call('bindHttp', {                                                         // 1071
          pid: pid,                                                                      // 1072
          bindTo: {                                                                      // 1073
            host: parsedUrl.hostname,                                                    // 1074
            port: securePort,                                                            // 1075
            pathPrefix: parsedUrl.pathname,                                              // 1076
            ssl: true                                                                    // 1077
          },                                                                             // 1078
          proxyTo: {                                                                     // 1079
            tags: [version],                                                             // 1080
            host: proxyToHost,                                                           // 1081
            port: proxyToPort,                                                           // 1082
            pathPrefix: proxyToPathPrefix                                                // 1083
          },                                                                             // 1084
          requiresAuth: requiresHttpAuth                                                 // 1085
        }, makeCallback());                                                              // 1086
      }                                                                                  // 1087
    }                                                                                    // 1088
  });                                                                                    // 1089
                                                                                         // 1090
  startedAll = true;                                                                     // 1091
  checkComplete();                                                                       // 1092
};                                                                                       // 1093
                                                                                         // 1094
// (Internal, unsupported interface -- subject to change)                                // 1095
//                                                                                       // 1096
// Listen for HTTP and/or DDP traffic and route it somewhere. Only                       // 1097
// takes effect when using a proxy service.                                              // 1098
//                                                                                       // 1099
// 'url' is the traffic that we want to route, interpreted relative to                   // 1100
// the default URL where this app has been told to serve itself. It                      // 1101
// may not have a scheme or port, but it may have a host and a path,                     // 1102
// and if no host is provided the path need not be absolute. The                         // 1103
// following cases are possible:                                                         // 1104
//                                                                                       // 1105
//   //somehost.com                                                                      // 1106
//     All incoming traffic for 'somehost.com'                                           // 1107
//   //somehost.com/foo/bar                                                              // 1108
//     All incoming traffic for 'somehost.com', but only when                            // 1109
//     the first two path components are 'foo' and 'bar'.                                // 1110
//   /foo/bar                                                                            // 1111
//     Incoming traffic on our default host, but only when the                           // 1112
//     first two path components are 'foo' and 'bar'.                                    // 1113
//   foo/bar                                                                             // 1114
//     Incoming traffic on our default host, but only when the path                      // 1115
//     starts with our default path prefix, followed by 'foo' and                        // 1116
//     'bar'.                                                                            // 1117
//                                                                                       // 1118
// (Yes, these scheme-less URLs that start with '//' are legal URLs.)                    // 1119
//                                                                                       // 1120
// You can select either DDP traffic, HTTP traffic, or both. Both                        // 1121
// secure and insecure traffic will be gathered (assuming the proxy                      // 1122
// service is capable, eg, has appropriate certs and port mappings).                     // 1123
//                                                                                       // 1124
// With no 'forwardTo' option, the traffic is received by this process                   // 1125
// for service by the hooks in this 'webapp' package. The original URL                   // 1126
// is preserved (that is, if you bind "/a", and a user visits "/a/b",                    // 1127
// the app receives a request with a path of "/a/b", not a path of                       // 1128
// "/b").                                                                                // 1129
//                                                                                       // 1130
// With 'forwardTo', the process is instead sent to some other remote                    // 1131
// host. The URL is adjusted by stripping the path components in 'url'                   // 1132
// and putting the path components in the 'forwardTo' URL in their                       // 1133
// place. For example, if you forward "//somehost/a" to                                  // 1134
// "//otherhost/x", and the user types "//somehost/a/b" into their                       // 1135
// browser, then otherhost will receive a request with a Host header                     // 1136
// of "somehost" and a path of "/x/b".                                                   // 1137
//                                                                                       // 1138
// The routing continues until this process exits. For now, all of the                   // 1139
// routes must be set up ahead of time, before the initial                               // 1140
// registration with the proxy. Calling addRoute from the top level of                   // 1141
// your JS should do the trick.                                                          // 1142
//                                                                                       // 1143
// When multiple routes are present that match a given request, the                      // 1144
// most specific route wins. When routes with equal specificity are                      // 1145
// present, the proxy service will distribute the traffic between                        // 1146
// them.                                                                                 // 1147
//                                                                                       // 1148
// options may be:                                                                       // 1149
// - ddp: if true, the default, include DDP traffic. This includes                       // 1150
//   both secure and insecure traffic, and both websocket and sockjs                     // 1151
//   transports.                                                                         // 1152
// - http: if true, the default, include HTTP/HTTPS traffic.                             // 1153
// - forwardTo: if provided, should be a URL with a host, optional                       // 1154
//   path and port, and no scheme (the scheme will be derived from the                   // 1155
//   traffic type; for now it will always be a http or ws connection,                    // 1156
//   never https or wss, but we could add a forwardSecure flag to                        // 1157
//   re-encrypt).                                                                        // 1158
var routes = [];                                                                         // 1159
WebAppInternals.addRoute = function (url, options) {                                     // 1160
  options = _.extend({                                                                   // 1161
    ddp: true,                                                                           // 1162
    http: true                                                                           // 1163
  }, options || {});                                                                     // 1164
                                                                                         // 1165
  if (proxy)                                                                             // 1166
    // In the future, lift this restriction                                              // 1167
    throw new Error("Too late to add routes");                                           // 1168
                                                                                         // 1169
  routes.push(_.extend({ url: url }, options));                                          // 1170
};                                                                                       // 1171
                                                                                         // 1172
// Receive traffic on our default URL.                                                   // 1173
WebAppInternals.addRoute("");                                                            // 1174
                                                                                         // 1175
runWebAppServer();                                                                       // 1176
                                                                                         // 1177
                                                                                         // 1178
var inlineScriptsAllowed = true;                                                         // 1179
                                                                                         // 1180
WebAppInternals.inlineScriptsAllowed = function () {                                     // 1181
  return inlineScriptsAllowed;                                                           // 1182
};                                                                                       // 1183
                                                                                         // 1184
WebAppInternals.setInlineScriptsAllowed = function (value) {                             // 1185
  inlineScriptsAllowed = value;                                                          // 1186
  WebAppInternals.generateBoilerplate();                                                 // 1187
};                                                                                       // 1188
                                                                                         // 1189
WebAppInternals.setBundledJsCssPrefix = function (prefix) {                              // 1190
  bundledJsCssPrefix = prefix;                                                           // 1191
  WebAppInternals.generateBoilerplate();                                                 // 1192
};                                                                                       // 1193
                                                                                         // 1194
// Packages can call `WebAppInternals.addStaticJs` to specify static                     // 1195
// JavaScript to be included in the app. This static JS will be inlined,                 // 1196
// unless inline scripts have been disabled, in which case it will be                    // 1197
// served under `/<sha1 of contents>`.                                                   // 1198
var additionalStaticJs = {};                                                             // 1199
WebAppInternals.addStaticJs = function (contents) {                                      // 1200
  additionalStaticJs["/" + sha1(contents) + ".js"] = contents;                           // 1201
};                                                                                       // 1202
                                                                                         // 1203
// Exported for tests                                                                    // 1204
WebAppInternals.getBoilerplate = getBoilerplate;                                         // 1205
WebAppInternals.additionalStaticJs = additionalStaticJs;                                 // 1206
WebAppInternals.validPid = validPid;                                                     // 1207
                                                                                         // 1208
///////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.webapp = {
  WebApp: WebApp,
  main: main,
  WebAppInternals: WebAppInternals
};

})();

//# sourceMappingURL=webapp.js.map
