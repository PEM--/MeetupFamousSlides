(function(){
Template.__checkName("slide10");
Template["slide10"] = new Template("Template.slide10", (function() {
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
          return HTML.H2("Meetup Famous - Forces & constraints");
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
          }, "Adding a force, some constraints and the physic engine in our main view", "\n", HTML.CODE("client/view/bubblebox.coffee"), "\n", ":"), "\n", Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("coffeescript"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "...", "\n", "DEFAULT_OPTIONS:", "\n", "  gravityStrength: 3", "\n", "  gravityNormal: [0, -200]", "\n", "  ...", "\n", "constructor: (@options) ->", "\n", "  ...", "\n", "  @gravity = new famous.physics.forces.Repulsion", "\n", "    strength: @options.gravityStrength", "\n", "    anchor: @options.gravityNormal", "\n", "  @walls = new famous.physics.constraints.Walls", "\n", "    sides: famous.physics.constraints.Walls.SIDES.TWO_DIMENSIONAL", "\n", "    size: @options.size", "\n", "    origin: @options.origin", "\n", "    restitution: 1", "\n", "    drift: 1", "\n", "  @pe = new famous.physics.PhysicsEngine()", "\n", "  @collision = new famous.physics.constraints.Collision", "\n", "    restitution: .8", "\n", "    drift: 1" ];
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
