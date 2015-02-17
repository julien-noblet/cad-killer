/*jslint node: true */
'use strict';
/*****************
 * Configuration *
 *****************/
var config = {
  source_folder : 'src', // dossier source
  dev_folder : 'serve', // dossier pour le serveur local
  prod_folder : 'prod', // dossier de build :)

  uncss : {
    html : ['src/index.html'], // have to fix?
    ignore : [
      '.content',
      '.type',
      '.geoJson',
      '.on',
      'ul',
      'li',
      /input/,
      /reverse-/,
      /leaflet-/,
      /photon-/
      ]
    },
  colorguard : {
      logOk: true,
      threshold: 3,
      ignore: ['#030303'],
      whitelist: [
        ['#000000', '#010101'],
        ['#ffffff', '#f4f4f4'], // Can-i reduce?
        ['#fefefe', '#f4f4f4'],
        ['#ffffff', '#fefefe'],
        ['#eeeeee', '#f4f4f4'],
        ['#cccccc', '#c3c3c3'],
        ['#bbbbbb', '#c3c3c3']
        ]
      }
};

/************
 * Includes *
 ************/
var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); // auto load :)
// Permet de supprimer les dossier de destination
var del = require('del'); // ce n'est pas un plugin Gulp.

// Idem, on doit le charger manuellement.
var browserSync = require('browser-sync');
var reload = browserSync.reload; // on met la commande dans une variable locale
var bs; // voir plus loin :)

var merge = require('merge-stream'); // permet de joindre 2 flux de sorties.

/*********
 * Tasks *
 *********/
// Deletes the directory that is used to serve the site during development
gulp.task('clean:dev', del.bind(null, [config.dev_folder]));

// Deletes the directory that the optimized site is output to
gulp.task('clean:prod', del.bind(null, [config.prod_folder]));

// SCSS
gulp.task('SCSS', function () {
  $.merge(
    gulp.src([config.source_folder+'/vendor/**/*.css','bower_components/**/*.css'])
      .pipe($.sourcemaps.init()),
    gulp.src(config.source_folder+'/scss/style.scss')
      .pipe($.sourcemaps.init()) //useless ?
      .pipe($.sass()))
  .pipe($.concat('style.css'))
  // AutoPrefix your CSS so it works between browsers
  .pipe($.autoprefixer('> 1%, last 2 versions, Firefox ESR, Opera 12.1', { cascade: true }))
  .pipe($.sourcemaps.write())
  .pipe($.uncss(config.uncss))
  .pipe($.colorguard(config.colorguard))
  .pipe(gulp.dest(config.source_folder+'/css'))
  .pipe(gulp.dest(config.dev_folder+'/css'))
  // Outputs the size of the CSS file
  .pipe($.size({title: 'styles'}))
  // Injects the CSS changes to your browser since Jekyll doesn't rebuild the CSS
  .pipe(reload({stream: true}));
});

// Run JS Lint against your JS
gulp.task('jslint', function () {
  gulp.src(config.source_folder+'/js/*.js')
    // Checks your JS code quality against your .jshintrc file
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter());
});

// Copy over fonts to the 'site' directory
gulp.task('fonts', function () {
  return gulp.src(config.source_folder+'/fonts/**')
    .pipe(gulp.dest(config.dev_folder+'/fonts'))
    .pipe(gulp.dest(config.prod_folder+'/fonts'))
    .pipe($.size({ title: 'fonts' }));
});

// Copy over vendor to the 'site' directory // need?
gulp.task('vendor', function () {
  return gulp.src([config.source_folder+'/vendor/**','bower_components/**'])
  .pipe(gulp.dest(config.dev_folder+'/vendor'))
    .pipe($.size({ title: 'vendor' }));
});

gulp.task('js', function() {
  gulp.src(config.source_folder+'/js/*.js')
  //.pipe($.concat('all.js'))
  .pipe($.uglify({preserveComments: 'some'}))
  .pipe($.size({title: 'js'}))
  .pipe(gulp.dest(config.dev_folder+'/js/'));
});

// Optimizes the images that exists
gulp.task('images', function () {
  return gulp.src([config.source_folder+'/images/**','bower_components/leaflet/dist/images/**'])
    .pipe(gulp.dest(config.dev_folder+'/images'))
    .pipe($.changed(config.prod_folder+'/images'))
    .pipe($.imagemin({
      // Lossless conversion to progressive JPGs
      progressive: true,
      // Interlace GIFs for progressive rendering
      interlaced: true
    }))
    .pipe(gulp.dest(config.prod_folder+'/images'))
    .pipe($.size({title: 'images'}));
});

gulp.task('dev',['vendor','fonts','images','SCSS','jslint','js'],function(){
  gulp.src(config.source_folder+'/**/*.html')
  .pipe(gulp.dest(config.dev_folder));
});
gulp.task('serve:dev', ['dev'], function () {
  bs = browserSync({
    notify: true,
    // tunnel: '',
    server: {
      baseDir: config.dev_folder
    }
  });
});

gulp.task('watch', function () {
  gulp.watch([config.source_folder+'/**/*.html', config.source_folder+'/**/*.js'], ['dev']);
  gulp.watch([config.dev_folder+'/css/*.css'], reload);
  gulp.watch([config.source_folder+'/scss/**/*.scss'], ['SCSS']);
});

gulp.task('default', ['serve:dev', 'watch']);

// Optimizes all the CSS, HTML and concats the JS etc
gulp.task('prod', ['dev'], function () {
  var assets = $.useref.assets({searchPath: config.dev_folder});

  return gulp.src(config.dev_folder+'/*.html')
    .pipe(assets)
    // Concatenate JavaScript files and preserve important comments
    .pipe($.if('*.js',$.uglify({preserveComments: 'some'})))
    // Minify CSS
    .pipe($.if('*.css', $.minifyCss()))
    // Start cache busting the files
    .pipe($.revAll({ ignore: ['.eot', '.svg', '.ttf', '.woff','png'] }))
    .pipe(assets.restore())
    // Conctenate your files based on what you specified in _layout/header.html
    .pipe($.useref())
    // Replace the asset names with their cache busted names
    .pipe($.revReplace())
    // Add GA
    .pipe($.if('*.html',$.ga({
          url: 'julien-noblet.github.io/cad-killer',
          uid: 'UA-59363844-1'
        })))
    // Minify HTML
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true
    // Send the output to the correct folder
    })))
    .pipe(gulp.dest(config.prod_folder))
    .pipe($.size({title: 'optimizations'}));
});
gulp.task('serve:prod', ['prod'], function () {
  bs = browserSync({
    notify: true,
    // tunnel: '',
    server: {
      baseDir: config.prod_folder
    }
  });
});

gulp.task('deploy',['prod'], function () {
  // Deploys your optimized site, you can change the settings in the html task if you want to
  return gulp.src(config.prod_folder+'/**/*')
    .pipe($.ghPages({
      // Currently only personal GitHub Pages are supported so it will upload to the master
      // branch and automatically overwrite anything that is in the directory
      branch: 'gh-pages'
      }));
});
