@CLICK_EVT = unless window.ontouchstart is undefined \
  then 'touchstart' else 'click'
