Package.describe({
  name: 'pierreeric:fview-slidedeck',
  summary: 'Famo.us Slide Deck',
  version: '0.1.1',
  git: 'https://github.com/PEM--/MeetupFamousSlides'
});

Package.onUse(function(api) {
	// Meteor Core Packages
  api.use([
  	'underscore@1.0.1',
  	'coffeescript@1.0.4',
  	'templating@1.0.9'
	], 'client');

  // Atmosphere packages
  api.use('mjn:famous@0.3.0_5', 'client', { weak: true });
  api.use('raix:famono@0.9.14', { weak: true });
	api.use([
		'mquandalle:jade@0.2.9',
		'iron:router@1.0.0',
		'gadicohen:famous-views@0.1.24',
    'pierreeric:cssc@1.0.3',
    'pierreeric:cssc-normalize@1.0.1',
    'pierreeric:cssc-famous@1.0.1',
    'pierreeric:cssc-colors@1.0.3'
	], 'client');

	// Package files
  api.addFiles([
  	'lib/fview-slidedeck.coffee',
  	'lib/layout.jade',
  	'lib/layout.coffee',
  	'lib/routing.coffee',
  	'lib/css-styles.coffee'
  ], 'client');

  api.export('slidedeck', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('pierreeric:fview-slidedeck');
  // TODO :)
});
