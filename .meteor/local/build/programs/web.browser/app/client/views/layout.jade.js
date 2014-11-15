(function(){
Template.body.addContent((function() {
  var view = this;
  return "";
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("layout");
Template["layout"] = new Template("Template.layout", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      size: Spacebars.call("[undefined, undefined]")
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("View"), function() {
      return [ Blaze._TemplateWith(function() {
        return {
          size: Spacebars.call("[50, 30]"),
          align: Spacebars.call("[0, 1]"),
          origin: Spacebars.call("[0, 1]"),
          translate: Spacebars.call("[10, -10, 100]")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("View"), function() {
          return Blaze._TemplateWith(function() {
            return {
              id: Spacebars.call("slideCpt"),
              align: Spacebars.call("[.5, .5]"),
              origin: Spacebars.call("[.5, .5]")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("Surface"), function() {
              return HTML.DIV({
                "class": "slide-cpt"
              }, Blaze.View(function() {
                return Spacebars.mustache(view.lookup("slideCpt"));
              }));
            });
          });
        });
      }), "\n", Blaze._TemplateWith(function() {
        return {
          size: Spacebars.call("[undefined, undefined]"),
          transition: Spacebars.call(view.lookup("getTransition"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("RenderController"), function() {
          return Spacebars.include(view.lookupTemplate("yield"));
        });
      }) ];
    });
  });
}));

})();
