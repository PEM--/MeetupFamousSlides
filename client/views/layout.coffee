Template.layout.helpers
  getTransition: ->
    (Session.get 'currentTransition') or 'slideWindow'

Template.layout.rendered = ->
  Session.set 'currentTransition', 'slideWindow'
  # Set the initial slide counter when layout is rendered
  famous.utilities.Timer.setTimeout ->
    Router.setCounter()
    console.log Router.current().path
  , 1000
