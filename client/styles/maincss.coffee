@theme =
  primary: '#474645'
  bg2: '#B5AFAB'
  bg1: '#cdcec7'
  highligh: '#208ad2'

css = new CSSC

# Fonts
css.add '@font-face',
  fontFamily: 'lane'
  src: "url('Lane/LANENAR_.ttf')"
  fontWeight: 'normal'
  fontStyle: 'normal'

css.add '@font-face',
  fontFamily: 'sourceSansPro'
  src: "url('source-sans-pro/SourceSansPro-Regular.otf')"
  fontWeight: 'normal'
  fontStyle: 'normal'

css.add '@font-face',
  fontFamily: 'sourceSansProBold'
  src: "url('source-sans-pro/SourceSansPro-Bold.otf')"
  fontWeight: 'normal'
  fontStyle: 'normal'

# Slide counter
css.add '#slide-cpt',
  border: "#{CSSC.x 3} solid #{CSSC.black}"
  borderRadius: CSSC.x 30
  backgroundColor: CSSC.white
  color: CSSC.black
  textAlign: 'center'
  width: CSSC.p 100
  height: CSSC.p 100
  lineHeight: CSSC.x 24
  boxSizing: 'border-box'

# Background and generic values
css.add 'html',
  backgroundImage: "radial-gradient(ellipse at center, \
    #{@theme.bg1} 0%, #{@theme.bg2} 100%)"
  color: @theme.primary
  textAlign: 'center'
  font: "20px sourceSansPro"

# Titles
css.add 'h1',
  fontSize: '2.2em'
  fontFamily: 'lane'
  textShadow: '0px 1px 1px #4d4d4d'

css.add 'h2',
  fontSize: '1.8em'
  fontFamily: 'lane'

# Texts
css.add 'p',
  fontSize: '1em'

css.add 'a',
  color: @theme.highligh
  textDecoration: 'none'
  fontFamily: 'sourceSansProBold'

css.add 'a:hover',
  textDecoration: 'underline'
