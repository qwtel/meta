require.config({
  baseUrl: 'build/js',
  paths: {
    director: '../../bower_components/director/build/director.min',
    fastclick: '../../bower_components/fastclick/lib/fastclick',
    jquery: '../../bower_components/jquery/dist/jquery.min',
    moment: '../../bower_components/moment/min/moment.min',
    react: '../../bower_components/react/react-with-addons',
    underscore: '../../bower_components/underscore/underscore',
    ratchet: '../../bower_components/ratchet/dist/js/ratchet'
  },
  shim: {
    director: {
      exports: 'Router'
    },
    bootstrap: {
      deps: ['jquery']
    },
    fastclick: {
      exports: 'FastClick'
    },
    jquery: {
      exports: '$'
    },
    moment: {
      exports: 'moment'
    },
    react: {
      exports: "React"
    },
    underscore: {
      exports: '_'
    }
  },
  name: 'view/launch',
  out: 'main.js'
});

require(['main'], function () {
  require(['view/main']);
});
