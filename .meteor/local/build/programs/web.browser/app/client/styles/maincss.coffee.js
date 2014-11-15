(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var css;

this.theme = {
  primary: '#474645',
  bg2: '#B5AFAB',
  bg1: '#cdcec7',
  highligh: '#208ad2'
};

css = new CSSC;

css.add('@font-face', {
  fontFamily: 'lane',
  src: "url('Lane/LANENAR_.ttf')",
  fontWeight: 'normal',
  fontStyle: 'normal'
});

css.add('@font-face', {
  fontFamily: 'sourceSansPro',
  src: "url('source-sans-pro/SourceSansPro-Regular.otf')",
  fontWeight: 'normal',
  fontStyle: 'normal'
});

css.add('@font-face', {
  fontFamily: 'sourceSansProBold',
  src: "url('source-sans-pro/SourceSansPro-Bold.otf')",
  fontWeight: 'normal',
  fontStyle: 'normal'
});

css.add('@font-face', {
  fontFamily: 'sourceCode',
  src: "url('source-code-pro/SourceCodePro-Regular.otf')",
  fontWeight: 'normal',
  fontStyle: 'normal'
});

css.add('.slide-cpt', {
  border: "" + (CSSC.x(3)) + " solid " + this.theme.primary,
  borderRadius: CSSC.x(30),
  backgroundColor: CSSC.white,
  color: this.theme.primary,
  textAlign: 'center',
  width: CSSC.p(100),
  height: CSSC.p(100),
  lineHeight: CSSC.x(22),
  fontSize: CSSC.x(14),
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  fontFamily: 'sourceSansProBold'
});

css.add('.gravatar', {
  borderRadius: CSSC.p(5),
  border: "3px solid " + this.theme.primary,
  width: CSSC.p(20)
});

css.add('html', {
  backgroundImage: "radial-gradient(ellipse at center, " + this.theme.bg1 + " 0%, " + this.theme.bg2 + " 100%)",
  color: this.theme.primary,
  textAlign: 'center',
  font: "24px sourceSansPro"
});

css.add('h1', {
  fontSize: '3em',
  fontFamily: 'lane'
});

css.add('h2', {
  fontSize: '1.8em',
  fontFamily: 'lane'
});

css.add('p', {
  fontSize: '1.2em'
});

css.add('.left', {
  textAlign: 'left'
});

css.add('a', {
  color: this.theme.highligh,
  textDecoration: 'none',
  fontFamily: 'sourceSansProBold'
});

css.add('li', {
  textAlign: 'left'
});

css.add('a:hover', {
  textDecoration: 'underline'
});

css.add('code', {
  fontFamily: 'sourceCode',
  fontSize: '.9em'
});

css.add('pre[class*="language-"]', {
  fontFamily: 'sourceCode',
  fontSize: '.6em',
  lineHeight: '.8em'
});

})();
