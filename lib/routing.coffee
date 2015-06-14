Router.configure layoutTemplate: 'layout'
Router.route '/',
  onBeforeAction: ->
    Router.go('/slides/1')
    @next()
Router.route '/slides/:id', ->
  unless Router.history?
    Router.history = @params.id
    Session.set 'slideCpt', "#{Router.history}/#{slideCount}"
  unless slidedeck?.impress?
    @render "slide#{@params.id}"
    fdeckmod = FView.byId 'deckmod'
    if fdeckmod?
      deckmod = fdeckmod.modifier
      slide = (FView.byId "slide#{@params.id}").modifier
      deckmod.setTransform (famous.core.Transform.inverse \
        slide.getFinalTransform()),
        duration: 1000,
        curve: famous.transitions.Easing.inOutQuart

# Remove debug logging in Famous-Views
#Logger.setLevel 'famous-views', 'error'

slideCount = 0
Meteor.startup ->
  # Events handling for going from one slide to the other.
  #famous.core.Engine.on 'keydown', (keyEvt) ->
  document.body.addEventListener 'keydown', (keyEvt) ->
    switch keyEvt.which
      # SPACE and →: Go next slide
      when 39, 32 then Router.setNext()
      # SPACE and →: Go next slide
      when 37 then Router.setPrev()
  #famous.core.Engine.on CLICK_EVT, -> Router.setNext()
  slideCount++  while Template["slide#{slideCount + 1}"]
#  Template.layout.rendered = ->
#    (FView.byId 'deckCtx').view.context.setPerspective 800

Router.setNext = ->
  transition = Session.get 'currentTransition'
  if transition is 'slideWindowRight' or transition is undefined
    Session.set 'currentTransition', 'slideWindow'
  Router.history++
  Router.history = 1 if Router.history == slideCount + 1
  Router.go "/slides/#{Router.history}"

Router.setPrev = ->
  transition = Session.get 'currentTransition'
  if transition is 'slideWindow' or transition is undefined
    Session.set 'currentTransition', 'slideWindowRight'
  Router.history--
  Router.history = slideCount if Router.history is 0
  Router.go "/slides/#{Router.history}"

Router.setCounter = ->
  window.cpt = FView.byId 'slideCpt'
  unless cpt is undefined
    if !cpt.rotation
      cpt.rotation = new (famous.components.Rotation)(cpt.node)
    cpt.rotation.halt()
    cpt.rotation.setY Math.PI,
      duration: 300,
      ->
        Session.set 'slideCpt', "#{Router.history}/#{slideCount}"
        cpt.rotation.setY 0,
          duration: 300

Router.onAfterAction -> Router.setCounter()
