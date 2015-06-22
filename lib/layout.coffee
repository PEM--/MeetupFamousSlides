Meteor.startup ->
  Template.layout = Template.defaultLayout unless Template.layout
  Template.layout.helpers
    getTransition: -> (Session.get 'currentTransition') or 'slideWindow'
    slideCpt: -> (Session.get 'slideCpt') or '. . .'
#    https://github.com/Famous/engine/issues/295
#    setup: ->
#      node = @node
#      node.addUIEvent 'click'
#      node.onReceive = (type, ev) ->
#        if type == 'click'
#          console.log ev
#          # Click in 1st 1/3rd will go back a page
#          if ev.x / node.getSize()[0] > 0.33
#            Router.setNext()
#          else
#            Router.setPrev()

  Template.layout.rendered = ->
    Session.set 'currentTransition', 'slideWindow'
    Router.setCounter()

findAncestor = (el, cls) ->
  while (el = el.parentElement) and !el.classList.contains(cls) then
  el

Template.mainDomEvents.onRendered ->
  el = this.view._domrange.parentElement.parentNode
  $(el).on 'click', (evt) ->
    if evt.target.tagName != 'A' && !findAncestor(evt.target, 'noclick')
      if evt.clientX / $(window).width() > 0.33
        FView.defer Router.setNext
      else
        FView.defer Router.setPrev
