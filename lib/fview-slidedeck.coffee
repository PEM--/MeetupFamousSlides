# https://github.com/gadicc/meteor-famous-views/issues/89
@CLICK_EVT = unless window.ontouchstart is undefined \
  then 'touchstart' else 'click'

@slidedeck = {}

@Transform = null
@Easing = null

FView.ready ->

  Node = famous.core.Node;

  class Slide extends famous.core.Node
    constructor: (options) ->
      super options
      @setAlign             .5, .5, .5
      @setMountPoint        .5, .5, .5
      @setSizeMode          Node.RELATIVE_SIZE, Node.RELATIVE_SIZE, Node.RELATIVE_SIZE
      @setProportionalSize  0.9, 1, 1
      @setDifferentialSize  0, -10, 0

  FView.wrap 'Slide', Slide

  #Transform = famous.core.Transform
  #Easing = famous.transitions.Easing
  #FView.attrEvalAllowedKeys = '*'
  #if slidedeck?.impress?
  #  FView.attrEvalAllowedKeys = ['transform']
  #View = famous.core.View
  #StateModifier = famous.modifiers.StateModifier
  #Surface = famous.core.Surface

  #class Impress extends StateModifier
  #  constructor: (options) ->
  #    options.size = [400, 300]
  #    options.origin = [.5, .5]
  #    options.align = [.5, .5]
  #    # transform from template
  #    super options

  #  FView.registerModifier 'Impress', Impress
