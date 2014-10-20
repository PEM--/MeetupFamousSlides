SLIDES = [
  { path: '/',    tpl: 'title' }
  { path: '/01',  tpl: 'slide01' }
  { path: '/02',  tpl: 'slide02' }
]

Router.configure
  layoutTemplate: 'layout'

Router.map ->
  @route slide.tpl, path: slide.path for slide in SLIDES

if Meteor.isClient
  famous.core.Engine.on 'keydown', (keyEvt) ->
    console.log 'Keydown', keyEvt.which
    switch keyEvt.which
      when 39, 32 then Router.setNext()
      when 37 then Router.setPrev()

  Router.onBeforeAction ->
    unless Router.history?
      path = Router.current().path
      Router.history = _.indexOf SLIDES, _.find SLIDES, (slide) ->
        slide.path == path
      console.log Router.history

  Router.setNext = ->
    Router.history++
    Router.history = 0 if Router.history is SLIDES.length
    Router.go SLIDES[Router.history].path

  Router.setPrev = ->
    Router.history--
    Router.history = SLIDES.length - 1 if Router.history is -1
    Router.go SLIDES[Router.history].path

  Router.onAfterAction ->
    console.log 'Set next slide'
