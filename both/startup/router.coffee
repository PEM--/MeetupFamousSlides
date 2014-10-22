SLIDES = [
  { path: '/',    tpl: 'title' }
  { path: '/01',  tpl: 'slide01' }
  { path: '/03',  tpl: 'slide03' }
  { path: '/04',  tpl: 'slide04' }
  { path: '/02',  tpl: 'slide02' }
  { path: '/05',  tpl: 'slide05' }
  { path: '/06',  tpl: 'slide06' }
  { path: '/07',  tpl: 'slide07' }
  { path: '/08',  tpl: 'slide08' }
  { path: '/end', tpl: 'end' }
]

Router.configure
  layoutTemplate: 'layout'

Router.map ->
  @route slide.tpl, path: slide.path for slide in SLIDES

if Meteor.isClient
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
    Router.history++
    Router.history = 0 if Router.history is SLIDES.length
    Router.go SLIDES[Router.history].path

  Router.setPrev = ->
    Router.history--
    Router.history = SLIDES.length - 1 if Router.history is -1
    Router.go SLIDES[Router.history].path

  Router.setCounter = ->
    FView.byId('slideCpt')?.surface.setContent "<p class='slide-cpt'>\
      #{Router.history + 1}/#{SLIDES.length}</p>"

  Router.onAfterAction -> Router.setCounter()
