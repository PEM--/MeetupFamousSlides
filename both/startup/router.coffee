@SLIDES = [
  { path: '/',    tpl: 'title' }
  { path: '/01',  tpl: 'slide01' }
  { path: '/03',  tpl: 'slide03' }
  { path: '/04',  tpl: 'slide04' }
  { path: '/02',  tpl: 'slide02' }
  { path: '/05',  tpl: 'slide05' }
  { path: '/06',  tpl: 'slide06' }
  { path: '/07',  tpl: 'slide07' }
  { path: '/08',  tpl: 'slide08' }
  { path: '/09',  tpl: 'slide09' }
  { path: '/10',  tpl: 'slide10' }
  { path: '/11',  tpl: 'slide11' }
  { path: '/12',  tpl: 'slide12' }
  { path: '/13',  tpl: 'slide13' }
  { path: '/end', tpl: 'end' }
]

Router.configure
  layoutTemplate: 'layout'

Router.map ->
  @route slide.tpl, path: slide.path for slide in SLIDES

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
      path = Router.current().path
      Router.history = _.indexOf SLIDES, _.find SLIDES, (slide) ->
        slide.path == path

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
