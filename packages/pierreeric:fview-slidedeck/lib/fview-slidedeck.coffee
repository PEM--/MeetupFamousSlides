# https://github.com/gadicc/meteor-famous-views/issues/89
@CLICK_EVT = unless window.ontouchstart is undefined \
  then 'touchstart' else 'click'
