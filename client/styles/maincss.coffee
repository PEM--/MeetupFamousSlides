@theme =
  primary: '#ebcb00'
  bg2: '#460432'
  bg1: '#6d315c'

css = new CSSC

css.add 'html',
  backgroundImage: "radial-gradient(ellipse at center, \
    #{@theme.bg1} 0%, #{@theme.bg2} 100%)"
  color: @theme.primary
  textAlign: 'center'
  fontFamily: 'Helvetica, Arial, sans-serif'

css.add 'h1',
  fontSize: '2em'

css.add 'h2',
  fontSize: '1.5em'

css.add 'p',
  fontSize: '1em'
