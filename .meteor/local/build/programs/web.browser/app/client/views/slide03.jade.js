(function(){
Template.__checkName("slide03");
Template["slide03"] = new Template("Template.slide03", (function() {
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
          return HTML.H2("Meetup Famous - An empty shell");
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
          }, "Our page bootstraping Famo.us", "\n", HTML.CODE("client/index.jade"), "\n", ":"), "\n", Blaze._TemplateWith(function() {
            return {
              language: Spacebars.call("jade"),
              "class": Spacebars.call("line-numbers")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("prism"), function() {
              return [ "head", "\n", "  title Famous Bubbles", "\n", "  meta(charset='utf-8')", "\n", "  meta(name='viewport', content='width=device-width, maximum-scale=1, user-scalable=no')", "\n", "  meta(name='apple-mobile-web-app-capable', content='yes')", "\n", "  meta(name='apple-mobile-web-app-status-bar-style', content='black')", "\n", "  meta(name='apple-mobile-web-app-capable', content='yes')", "\n", "  meta(name='mobile-web-app-capable', content='yes')", "\n", "body", "\n", "  +index", "\n", "template(name='index')" ];
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
