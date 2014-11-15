Package.describe({
  name: 'pierreeric:fview-slidedeck',
  summary: 'Famo.us Slide Deck',
  version: '0.1.0',
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
	api.use([
		'mquandalle:jade@0.2.9',
		'iron:router@1.0.0',
    'mjn:famous@0.3.0_5',
		'gadicohen:famous-views@0.1.24',
    'pierreeric:cssc-colors@0.1.0'
	], 'client');

	// Package files
  api.addFiles([
  	'lib/fview-slidedeck.jade',
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
