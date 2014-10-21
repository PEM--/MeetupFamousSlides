Template.layout.rendered = ->
  # Set the initial slide counter when layout is rendered
  famous.utilities.Timer.setTimeout ->
    Router.setCounter()
  , 1000
