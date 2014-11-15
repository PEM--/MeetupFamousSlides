Meteor.startup ->
  Template.layout = Template.defaultLayout unless Template.layout
  Template.layout.helpers
    getTransition: -> (Session.get 'currentTransition') or 'slideWindow'
    slideCpt: -> (Session.get 'slideCpt') or '. . .'
  Template.layout.rendered = ->
    Session.set 'currentTransition', 'slideWindow'
    Router.setCounter()
