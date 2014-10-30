@SLIDES = [
  { path: '/', tpl: 'title' }
  { path: '/slide01' }
  { path: '/slide02' }
  { path: '/slide03' }
  { path: '/slide04' }
  { path: '/slide05' }
  { path: '/slide06' }
  { path: '/slide07' }
  { path: '/slide08' }
  { path: '/slide09' }
  { path: '/slide10' }
  { path: '/slide11' }
  { path: '/slide12' }
  { path: '/slide13' }
  { path: '/end' }
]

Router.configure layoutTemplate: 'layout'
Router.route SLIDES[0].path, -> @render SLIDES[0].tpl
Router.route slide.path for slide in _.rest SLIDES

if Meteor.isClient
  # Remove debug logging in Famous-Views
  Logger.setLevel 'famous-views', 'error'

  Meteor.startup ->
    # Events handling for going from one slide to the other.
    famous.core.Engine.on 'keydown', (keyEvt) ->
      switch keyEvt.which
        # SPACE and →: Go next slide
        when 39, 32 then Router.setNext()
        # SPACE and →: Go next slide
        when 37 then Router.setPrev()
    famous.core.Engine.on CLICK_EVT, -> Router.setNext()

  Router.onBeforeAction ->
    # Get the first index in the slidedeck when loading the app.
    unless Router.history?
      path = Router.current().url
      Router.history = _.indexOf SLIDES, _.find SLIDES, (slide) ->
        slide.path is path
      console.log 'Current url', Router.current().url
      console.log 'Current path', path
      console.log 'Router.history', Router.history
    @next()

  Router.setNext = ->
    transition = Session.get 'currentTransition'
    if transition is 'slideWindowRight' or transition is undefined
      Session.set 'currentTransition', 'slideWindow'
    Router.history++
    Router.history = 0 if Router.history is SLIDES.length
    Router.go SLIDES[Router.history].path

  Router.setPrev = ->
    transition = Session.get 'currentTransition'
    if transition is 'slideWindow' or transition is undefined
      Session.set 'currentTransition', 'slideWindowRight'
    Router.history--
    Router.history = SLIDES.length - 1 if Router.history is -1
    Router.go SLIDES[Router.history].path

  Router.setCounter = ->
    window.cpt = FView.byId 'slideCpt'
    unless cpt is undefined
      cpt.modifier.setTransform (famous.core.Transform.rotateY Math.PI),
        duration: 300
      famous.utilities.Timer.setTimeout ->
        Session.set 'slideCpt', "#{Router.history + 1}/#{SLIDES.length}"
        cpt.modifier.setTransform (famous.core.Transform.rotateY 0),
          duration: 300
      , 300

  Router.onAfterAction -> Router.setCounter()
