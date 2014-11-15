(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var slide, _i, _len, _ref;

this.SLIDES = [
  {
    path: '/',
    tpl: 'title'
  }, {
    path: '/slide01'
  }, {
    path: '/slide02'
  }, {
    path: '/slide03'
  }, {
    path: '/slide04'
  }, {
    path: '/slide05'
  }, {
    path: '/slide06'
  }, {
    path: '/slide07'
  }, {
    path: '/slide08'
  }, {
    path: '/slide09'
  }, {
    path: '/slide10'
  }, {
    path: '/slide11'
  }, {
    path: '/slide12'
  }, {
    path: '/slide13'
  }, {
    path: '/end'
  }
];

Router.configure({
  layoutTemplate: 'layout'
});

Router.route(SLIDES[0].path, function() {
  return this.render(SLIDES[0].tpl);
});

_ref = _.rest(SLIDES);
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  slide = _ref[_i];
  Router.route(slide.path);
}

if (Meteor.isClient) {
  Logger.setLevel('famous-views', 'error');
  Meteor.startup(function() {
    famous.core.Engine.on('keydown', function(keyEvt) {
      switch (keyEvt.which) {
        case 39:
        case 32:
          return Router.setNext();
        case 37:
          return Router.setPrev();
      }
    });
    return famous.core.Engine.on(CLICK_EVT, function() {
      return Router.setNext();
    });
  });
  Router.onBeforeAction(function() {
    var path;
    if (Router.history == null) {
      path = Router.current().url;
      Router.history = _.indexOf(SLIDES, _.find(SLIDES, function(slide) {
        return slide.path === path;
      }));
    }
    return this.next();
  });
  Router.setNext = function() {
    var transition;
    transition = Session.get('currentTransition');
    if (transition === 'slideWindowRight' || transition === void 0) {
      Session.set('currentTransition', 'slideWindow');
    }
    Router.history++;
    if (Router.history === SLIDES.length) {
      Router.history = 0;
    }
    return Router.go(SLIDES[Router.history].path);
  };
  Router.setPrev = function() {
    var transition;
    transition = Session.get('currentTransition');
    if (transition === 'slideWindow' || transition === void 0) {
      Session.set('currentTransition', 'slideWindowRight');
    }
    Router.history--;
    if (Router.history === -1) {
      Router.history = SLIDES.length - 1;
    }
    return Router.go(SLIDES[Router.history].path);
  };
  Router.setCounter = function() {
    window.cpt = FView.byId('slideCpt');
    if (cpt !== void 0) {
      cpt.modifier.setTransform(famous.core.Transform.rotateY(Math.PI), {
        duration: 300
      });
      return famous.utilities.Timer.setTimeout(function() {
        Session.set('slideCpt', "" + (Router.history + 1) + "/" + SLIDES.length);
        return cpt.modifier.setTransform(famous.core.Transform.rotateY(0), {
          duration: 300
        });
      }, 300);
    }
  };
  Router.onAfterAction(function() {
    return Router.setCounter();
  });
}

})();

//# sourceMappingURL=router.coffee.js.map
