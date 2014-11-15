(function(){
Template.__checkName("slide06");
Template["slide06"] = new Template("Template.slide06", (function() {
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
          return HTML.H2("Meetup Famous - Main view");
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
          }, "Our main view", "\n", HTML.CODE("client/views/bubblebox.coffee"), "\n", ":"), "\n", Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("coffeescript"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "class @BubbleBox extends famous.core.View", "\n", "  DEFAULT_OPTIONS:", "\n", "    size: [400, 400]", "\n", "    origin: [.5, .5]", "\n", "    align: [.5, .5]", "\n", "  constructor: (@options) ->", "\n", "    @constructor.DEFAULT_OPTIONS = @DEFAULT_OPTIONS", "\n", "    super @options", "\n", "    surf = new famous.core.Surface", "\n", "      size: @options.size", "\n", "      classes: ['bubble-main-box']", "\n", "    mod = new famous.core.Modifier", "\n", "      origin: @options.origin", "\n", "      align: @options.align", "\n", "    @add(mod).add surf" ];
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
