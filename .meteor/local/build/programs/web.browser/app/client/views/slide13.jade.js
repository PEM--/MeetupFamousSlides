(function(){
Template.__checkName("slide13");
Template["slide13"] = new Template("Template.slide13", (function() {
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
          return HTML.H2("Meetup Famous - The finish, the bubbles");
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
          return Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("coffeescript"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "  ...", "\n", "  addBubble: (i) ->", "\n", "    bubble = new Bubble()", "\n", "    (@add bubble.mod).add bubble.shape", "\n", "    bubble.mod.transformFrom ->", "\n", "      bubble.body.getTransform()", "\n", "    @pe.attach @collision, @pe.getBodies(), bubble.body", "\n", "    @pe.attach [", "\n", "      @gravity", "\n", "      @walls.components[0]", "\n", "      @walls.components[1]", "\n", "      @walls.components[2]", "\n", "      @walls.components[3]", "\n", "    ] , bubble.body", "\n", "    @pe.addBody bubble.body" ];
            });
          });
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
