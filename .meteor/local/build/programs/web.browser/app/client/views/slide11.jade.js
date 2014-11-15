(function(){
Template.__checkName("slide11");
Template["slide11"] = new Template("Template.slide11", (function() {
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
          return HTML.H2("Meetup Famous - Bubble pusher");
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
          }, "Adding the bubble pusher", "\n", HTML.CODE("client/view/bubblebox.coffee"), "\n", ":"), "\n", Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("coffeescript"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "constructor: (@options) ->", "\n", "  ...", "\n", "  famous.inputs.GenericSync.register", "\n", "    'mouse': famous.inputs.MouseSync", "\n", "    'touch': famous.inputs.TouchSync", "\n", "  @addDragger()", "\n", "addDragger: ->", "\n", "  @dragger = new Dragger()", "\n", "  @pe.addBody @dragger.body", "\n", "  (@add @dragger.mod).add @dragger.shape", "\n", "  sync = new famous.inputs.GenericSync ['mouse', 'touch']", "\n", "  @dragger.shape.pipe sync", "\n", "  sync.on 'update', (data) =>", "\n", "    @dragger.position[0] += data.delta[0]", "\n", "    @dragger.position[1] += data.delta[1]", "\n", "    @dragger.body.setPosition @dragger.position" ];
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
