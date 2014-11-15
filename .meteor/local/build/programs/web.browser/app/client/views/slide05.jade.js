(function(){
Template.__checkName("slide05");
Template["slide05"] = new Template("Template.slide05", (function() {
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
          return HTML.H2("Meetup Famous - Styling");
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
          }, "Optional, to simplify interactions with Famo.us, styles are written in CoffeeScript", "\n", HTML.CODE("client/styles/maincss.coffee"), "\n", ":"), "\n", Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("coffeescript"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "css = new CSSC", "\n", "css.add 'html',", "\n", "  backgroundColor: CSSC.orange", "\n", "css.add '.bubble-main-box',", "\n", "  backgroundColor: CSSC.yellow", "\n", "  borderRadius: '8px'", "\n", "css.add '.bubble-bluebubble',", "\n", "  backgroundColor: CSSC.aqua", "\n", "  border: '3px solid ' + CSSC.blue", "\n", "css.add '.bubble-dragger',", "\n", "  backgroundColor: 'rgba(255, 255, 255, .5)'", "\n", "  border: '2px solid ' + CSSC.red" ];
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
