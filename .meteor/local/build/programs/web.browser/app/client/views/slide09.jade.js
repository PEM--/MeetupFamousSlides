(function(){
Template.__checkName("slide09");
Template["slide09"] = new Template("Template.slide09", (function() {
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
          return HTML.H2("Meetup Famous - Some interactivity");
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
          }, "A bubble pusher", "\n", HTML.CODE("client/view/dragger.coffee"), "\n", " :"), "\n", Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("coffeescript"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "class @Dragger", "\n", "  RADIUS: 30", "\n", "  constructor: ->", "\n", "    @shape = new famous.core.Surface", "\n", "      size: [2 * @RADIUS, 2 * @RADIUS]", "\n", "      classes: ['bubble-dragger']", "\n", "      properties: borderRadius: CSSC.x 2 * @RADIUS", "\n", "    @body = new famous.physics.bodies.Circle", "\n", "      radius: @RADIUS", "\n", "      mass: 60", "\n", "    @position = [0, 0]", "\n", "    @mod = new famous.core.Modifier", "\n", "      origin: [.5, .5]", "\n", "      align: [.5, .5]", "\n", "      transform: =>", "\n", "        famous.core.Transform.translate @position[0], @position[1], 0" ];
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
