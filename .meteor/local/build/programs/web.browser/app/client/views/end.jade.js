(function(){
Template.__checkName("end");
Template["end"] = new Template("Template.end", (function() {
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
          return HTML.H2("Meetup Famous");
        });
      }), "\n", Blaze._TemplateWith(function() {
        return {
          size: Spacebars.call("[undefined, undefined]"),
          target: Spacebars.call("content")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("Surface"), function() {
          return [ HTML.H1("Thank you for your time.", "\n", HTML.BR(), "\n", "Any questions?"), "\n", HTML.P("Slides are available here:", "\n", HTML.BR(), "\n", HTML.A({
            href: "https://github.com/PEM--/MeetupFamousSlides"
          }, "github.com/PEM--/MeetupFamousSlides")), "\n", HTML.P("Sources are available here:", "\n", HTML.BR(), "\n", HTML.A({
            href: "https://github.com/PEM--/famousbubble"
          }, "github.com/PEM--/famousbubble")) ];
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
