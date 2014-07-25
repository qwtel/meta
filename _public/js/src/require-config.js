require.config({
    baseUrl: '/js/build',
    paths: {
        parse: 'vendor/parse-1.2.19',
        bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
        director: '../../bower_components/director/build/director',
        fastclick: '../../bower_components/fastclick/lib/fastclick',
        jquery: '../../bower_components/jquery/dist/jquery',
        moment: '../../bower_components/moment/moment',
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
        },
        parse: {
          deps: ['jquery'],
          exports: "Parse"
        }
    },
    name: 'view/launch',
    out: 'main.js'
});

require(['main'], function () {
    require(['view/launch']);
});
