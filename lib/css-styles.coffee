@theme =
  primary: '#474645'
  bg2: '#B5AFAB'
  bg1: '#cdcec7'
  highligh: '#208ad2'

css = new CSSC
css
  # Fonts
  .add '@font-face',
    fontFamily: 'lane'
    src: "url('Lane/LANENAR_.ttf')"
    fontWeight: 'normal'
    fontStyle: 'normal'

  .add '@font-face',
    fontFamily: 'sourceSansPro'
    src: "url('source-sans-pro/SourceSansPro-Regular.otf')"
    fontWeight: 'normal'
    fontStyle: 'normal'

  .add '@font-face',
    fontFamily: 'sourceSansProBold'
    src: "url('source-sans-pro/SourceSansPro-Bold.otf')"
    fontWeight: 'normal'
    fontStyle: 'normal'

  .add '@font-face',
    fontFamily: 'sourceCode'
    src: "url('source-code-pro/SourceCodePro-Regular.otf')"
    fontWeight: 'normal'
    fontStyle: 'normal'

  # Slide counter
  .add '.slide-cpt',
    border: "#{CSSC.x 3} solid #{@theme.primary}"
    borderRadius: CSSC.x 30
    backgroundColor: CSSC.white
    color: @theme.primary
    textAlign: 'center'
    width: CSSC.p 100
    height: CSSC.p 100
    lineHeight: CSSC.x 22
    fontSize: CSSC.x 14
    margin: 0
    padding: 0
    boxSizing: 'border-box'
    fontFamily: 'sourceSansProBold'

  # Gravatar
  .add '.gravatar',
    borderRadius: CSSC.p 5
    border: "3px solid #{@theme.primary}"
    width: CSSC.p 20

  # Background and generic values
  .add 'html',
    backgroundImage: "radial-gradient(ellipse at center, \
      #{@theme.bg1} 0%, #{@theme.bg2} 100%)"
    color: @theme.primary
    textAlign: 'center'
    font: "24px sourceSansPro"

  # Titles
  .add 'h1',
    fontSize: '3em'
    fontFamily: 'lane'

  .add 'h2',
    fontSize: '1.8em'
    fontFamily: 'lane'

  # Texts
  .add 'p',
    fontSize: '1.2em'

  .add '.left',
    textAlign: 'left'

  .add 'a',
    color: @theme.highligh
    textDecoration: 'none'
    fontFamily: 'sourceSansProBold'

  .add 'li',
    textAlign: 'left'

  .add 'a:hover',
    textDecoration: 'underline'

  .add 'code',
    fontFamily: 'sourceCode'
    fontSize: '.9em'

  # Codes
  .add 'pre[class*="language-"]',
    fontFamily: 'sourceCode'
    fontSize: '.6em'
    lineHeight: '.8em'
