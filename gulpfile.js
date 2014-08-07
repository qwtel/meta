var gulp = require('gulp');
var gutil = require('gulp-util');

var react = require('gulp-react');
var coffee = require('gulp-coffee');
var less = require('gulp-less');

var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var prefix = require('gulp-autoprefixer');

var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');

var http = require('http');
var ecstatic = require('ecstatic');

var path = require('path');

const DEV_PATH = 'webapp';
const PROD_PATH = 'parse/public';

const HTTP_PORT = 8000;

var paths = {
  bower: [
      DEV_PATH + '/bower_components/**/*.js',
      DEV_PATH + '/bower_components/**/*.css',
      DEV_PATH + '/bower_components/**/*.otf',
      DEV_PATH + '/bower_components/**/*.eot',
      DEV_PATH + '/bower_components/**/*.svg',
      DEV_PATH + '/bower_components/**/*.ttf',
      DEV_PATH + '/bower_components/**/*.woff'
  ],

  js: DEV_PATH + '/src/js/**/*.js',
  jsx: DEV_PATH + '/src/js/**/*.jsx',
  coffee: DEV_PATH + '/src/js/**/*.coffee',
  requireConfig: DEV_PATH + '/src/js/requireConfig.js',

  less: DEV_PATH + '/src/css/main.less',
  css: DEV_PATH + '/build/css/**/*.css',

  images: DEV_PATH + '/img/*',

  index: DEV_PATH + '/index.html',

  spec: DEV_PATH + '/spec/*.coffee',

  main: PROD_PATH + '/build/main.js'
};

var bowerPaths = {
  director: '../../bower_components/director/build/director',
  fastclick: '../../bower_components/fastclick/lib/fastclick',
  jquery: '../../bower_components/jquery/dist/jquery',
  moment: '../../bower_components/moment/min/moment.min',
  react: '../../bower_components/react/react-with-addons',
  underscore: '../../bower_components/underscore/underscore',
  ratchet: '../../bower_components/ratchet/dist/js/ratchet'
};

var bowerPathsMin = {
  director: '../../bower_components/director/build/director.min',
  fastclick: '../../bower_components/fastclick/lib/fastclick',
  jquery: '../../bower_components/jquery/dist/jquery.min',
  moment: '../../bower_components/moment/min/moment.min',
  react: '../../bower_components/react/react-with-addons.min',
  underscore: '../../bower_components/underscore/underscore.min',
  ratchet: '../../bower_components/ratchet/dist/js/ratchet.min'
};

var requireConfig = function (bowerPaths) {
  return {
    baseUrl: DEV_PATH + '/build/js',
    paths: bowerPaths,
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
    name: 'view/main',
    out: 'main.js'
  }
};

gulp.task('bower', function () {
  return gulp.src(paths.bower)
    .pipe(gulp.dest(PROD_PATH + '/bower_components'))
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(gulp.dest(DEV_PATH + '/build/js'))
});

gulp.task('jsx', function () {
  return gulp.src(paths.jsx)
    .pipe(react())
    .pipe(gulp.dest(DEV_PATH + '/build/js'));
});

gulp.task('coffee', function () {
  return gulp.src(paths.coffee)
    .pipe(coffee())
    .pipe(gulp.dest(DEV_PATH + '/build/js'));
});

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest(DEV_PATH + '/build/css'));
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(gulp.dest(PROD_PATH + '/img'));
});

gulp.task('compile', ['js', 'jsx', 'coffee', 'less', 'images']);

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.jsx, ['jsx']);
  gulp.watch(paths.coffee, ['coffee']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.spec, ['spec']);
});

gulp.task('index', function () {
  return gulp.src(paths.index)
    .pipe(minifyHTML())
    .pipe(gulp.dest(PROD_PATH))
});

gulp.task('css', function () {
  return gulp.src(paths.css)
    .pipe(minifyCSS())
    .pipe(gulp.dest(PROD_PATH + '/build/css'))
});

gulp.task('rjs', ['compile'], function () {
  return rjs(requireConfig(bowerPaths))
    .pipe(gulp.dest(PROD_PATH + '/build/js'))
});

gulp.task('rjs-min', ['compile'], function () {
  return rjs(requireConfig(bowerPathsMin))
    .pipe(uglify())
    .pipe(gulp.dest(PROD_PATH + '/build/js'))
});

gulp.task('requireConfig', function () {
  return gulp.src(paths.requireConfig)
    .pipe(uglify())
    .pipe(gulp.dest(PROD_PATH + '/build/js'))
});

gulp.task('copy', ['bower', 'index', 'css', 'requireConfig']);

gulp.task('build', ['copy', 'rjs']);

gulp.task('build-min', ['copy', 'rjs-min']);

function server(root) {
  http.createServer(
    ecstatic({ root: root })
  ).listen(HTTP_PORT);

  gutil.log('Serving files at http://localhost:' + HTTP_PORT);
}

gulp.task('http', function () {
  server(DEV_PATH)
});

gulp.task('http-prod', function () {
  server(PROD_PATH)
});

gulp.task('development', ['compile', 'watch', 'http']);
gulp.task('default', ['development']);