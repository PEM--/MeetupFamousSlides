(function(){
Template.__checkName("slide08");
Template["slide08"] = new Template("Template.slide08", (function() {
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
          return HTML.H2("Meetup Famous - Bubbles");
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
          }, "Our bubbles", "\n", HTML.CODE("client/views/bubble.coffee"), "\n", " :"), "\n", Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("coffeescript"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "class @Bubble", "\n", "  constructor: ->", "\n", "    radius = famous.math.Random.integer 20, 60", "\n", "    @shape = new famous.core.Surface", "\n", "      size: [radius * 2, radius * 2]", "\n", "      classes: ['bubble-bluebubble']", "\n", "      properties: borderRadius: CSSC.x radius", "\n", "    @body = new famous.physics.bodies.Circle", "\n", "      radius: radius", "\n", "      mass: radius / 10", "\n", "    @mod = new famous.core.Modifier", "\n", "      origin: [.5, .5]", "\n", "      align: [.5, .5]" ];
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
