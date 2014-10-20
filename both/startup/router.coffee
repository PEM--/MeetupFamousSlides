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
  famous.core.Engine.on 'keydown', (e) ->
    console.log 'Keydown', e.which
  Router.onBeforeAction ->
    Router.history = Router.current().route unless Router.history?
  Router.onAfterAction ->
    console.log 'Set next slide'
