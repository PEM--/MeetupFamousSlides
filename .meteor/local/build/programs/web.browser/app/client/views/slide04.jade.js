(function(){
Template.__checkName("slide04");
Template["slide04"] = new Template("Template.slide04", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      size: Spacebars.call("[undefined, undefined]")
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("HeaderFooterLayout"), function() {
      return [ Blaze._TemplateWith(function() {
        return {
          size: Spacebars.call("[undefined, 100]"),
          target: Spacebars.call("header")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("Surface"), function() {
          return HTML.H2("Meetup Famous - Class inheritance");
        });
      }), "\n", Blaze._TemplateWith(function() {
        return {
          size: Spacebars.call("[900, undefined]"),
          align: Spacebars.call("[.5, .5]"),
          origin: Spacebars.call("[.5, .5]"),
          target: Spacebars.call("content")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("Surface"), function() {
          return [ HTML.P({
            "class": "left"
          }, "Javascript"), "\n", Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("javascript"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "function EmptyView() {", "\n", "  View.apply(this, arguments);", "\n", "}", "\n", "EmptyView.prototype = Object.create(View.prototype);", "\n", "EmptyView.prototype.constructor = EmptyView;", "\n", "EmptyView.DEFAULT_OPTIONS = {", "\n", "  origin: [.5, .5]", "\n", "};" ];
            });
          }), "\n", HTML.P({
            "class": "left"
          }, "CoffeeScript"), "\n", Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("coffeescript"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "class EmptyView extends View", "\n", "  DEFAULT_OPTIONS:", "\n", "    origin: [.5, .5]", "\n", "  constructor: (@options)->", "\n", "    @constructor.DEFAULT_OPTIONS = @DEFAULT_OPTIONS", "\n", "    super @options" ];
            });
          }) ];
        });
      }), "\n", Blaze._TemplateWith(function() {
        return {
          size: Spacebars.call("[undefined, 70]"),
          target: Spacebars.call("footer")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("Surface"), function() {
          return HTML.P("PEM");
        });
      }) ];
    });
  });
}));

})();
