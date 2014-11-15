(function(){
Template.__checkName("slide01");
Template["slide01"] = new Template("Template.slide01", (function() {
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
          return HTML.H2("Meetup Famous - Build system");
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
          return [ HTML.UL(HTML.LI("Yeoman & Grunt: Use the one from Myles", "\n", HTML.A({
            href: "https://github.com/FamousTools/generator-famous"
          }, "Famo.us"), "\n", "."), "\n", HTML.LI("Gulp: Many templates & samples:", "\n", HTML.A({
            href: "https://github.com/PEM--/hellofamousgulped"
          }, "HelloFamousGulped"), "\n", "."), "\n", HTML.LI(HTML.A({
            href: "https://www.meteor.com"
          }, "Meteor"), "\n", ": Got its own build system.")), "\n", HTML.P({
            "class": "left"
          }, "Install and create a project:"), "\n", Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("bash"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "# Meteor installation", "\n", "curl https://install.meteor.com | /bin/sh", "\n", "# Create our sample application", "\n", "meteor create famousbubble", "\n", "# Hop in the directory and remove stuff", "\n", "cd famousbubble", "\n", "rm *", "\n", "# Importing packages", "\n", "meteor add raix:famono coffeescript pierreeric:cssc-famous pierreeric:cssc-colors mquandalle:jade", "\n", "# Create the application structure", "\n", "mkdir -p client/views client/styles" ];
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
