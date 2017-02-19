/* eslint-env es5 */
/* eslint strict: ["warn", "global"]*/

'use strict';

/** ***************
 * Configuration *
 *****************/
const config = {
  sourceFolder: 'src', // dossier source
  devFolder: 'serve', // dossier pour le serveur local
  prodFolder: 'prod', // dossier de build :)

  uncss: {
    html: ['src/index.html'], // have to fix?
    ignore: [
      '.city',
      '.content',
      '.geo',
      '.geoJson',
      '.headmasked',
      '.hidden',
      '.nohead',
      '.on',
      '.textnote',
      '.type',
      'li',
      'ul',
      /input/,
      /leaflet-/,
      /note/,
      /photon-/,
      /reverse-/,
      /zmdi/,
    ],
  },
  colorguard: {
    logOk: true,
    threshold: 3,
    whitelist: [
      ['#f4f4f4', '#ffffff'],
    ],
  },
};

/** **********
 * Includes *
 ************/
const gulp = require('gulp');
const $ = require('gulp-load-plugins')(); // auto load :)
// Permet de supprimer les dossier de destination
const del = require('del'); // ce n'est pas un plugin Gulp.
// var argv = require('minimist')(process.argv.slice(2));

// Idem, on doit le charger manuellement.
const browserSync = require('browser-sync');

const reload = browserSync.reload; // on met la commande dans une variable locale

/* eslint-disable no-unused-vars */
let bs; // voir plus loin :)
/* eslint-enable no-unused-vars */
const lazypipe = require('lazypipe');

const imageminZopfli = require('imagemin-zopfli');

/** *******
 * Tasks *
 *********/
// Deletes the directory that is used to serve the site during development
gulp.task('clean:dev', del.bind(null, [config.devFolder]));

// Deletes the directory that the optimized site is output to
gulp.task('clean:prod', del.bind(null, [config.prodFolder]));
gulp.task('clean', ['clean:dev', 'clean:prod']);

// SASS-Lint
gulp.task('sass-lint', () => {
  gulp.src(`${config.sourceFolder}/scss/style.scss`)
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError());
});

// SCSS
gulp.task('SCSS', () => {
  gulp.src(`${config.sourceFolder}/scss/style.scss`)
    .pipe($.sourcemaps.init()) // useless ?
    .pipe($.scss())
    .pipe($.concat('style.css'))
    // AutoPrefix your CSS so it works between browsers
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', '> 1%'],
      cascade: true,
    }))
    .pipe($.uncss(config.uncss))
    .pipe($.colorguard(config.colorguard))
    .pipe(gulp.dest(`${config.sourceFolder}/css`))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(`${config.devFolder}/css`))
    // Outputs the size of the CSS file
    .pipe($.size({
      title: 'styles',
    }))
    // Injects the CSS changes to your browser since Jekyll doesn't rebuild the CSS
    .pipe(reload({
      stream: true,
    }));
});

// HTML Lint
gulp.task('htmllint', () => {
  gulp.src('./src/*.html')
    .pipe($.htmlhint())
    .pipe($.htmlhint.reporter());
});

// Run JS Lint against your JS
gulp.task('jslint', () => {
  gulp.src(`${config.sourceFolder}/js/*.js`)
    // Checks your JS code quality against your .jshintrc file
    .pipe($.eslint())
    .pipe($.eslint.formatEach('compact', process.stderr))
    .pipe($.eslint())
    .pipe($.eslint.formatEach('compact', process.stderr))
    .pipe($.eslint.failOnError());
});

// Copy over fonts to the 'site' directory
gulp.task('fonts', () => gulp.src(['node_modules/npm-font-open-sans/fonts/**', 'node_modules/material-design-iconic-font/dist/fonts/**'])
    .pipe(gulp.dest(`${config.devFolder}/fonts`))
    .pipe(gulp.dest(`${config.prodFolder}/fonts`))
    .pipe($.size({
      title: 'fonts',
    })));

gulp.task('js', () => {
  gulp.src(`${config.sourceFolder}/js/*.js`)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    // .pipe($.concat('all.js'))
    // .pipe($.uglify({preserveComments: 'some'}))
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(`${config.devFolder}/js/`))
    .pipe($.size({
      title: 'js',
    }));
});

// Optimizes the images that exists
gulp.task('images', () => gulp.src([`${config.sourceFolder}/images/**`, 'node_modules/leaflet/dist/images/**', 'node_modules/leaflet-draw/dist/images/**'])
    .pipe(gulp.dest(`${config.devFolder}/images`))
    .pipe($.changed(`${config.prodFolder}/images`))
    .pipe($.imagemin({
      // Interlace GIFs for progressive rendering
      interlaced: true,
      // Lossless conversion to progressive JPGs
      progressive: true,
      optimizationLevel: 7,
      use: [imageminZopfli({
        '8bit': true,
        more: true,
      })],
    }))
    .pipe(gulp.dest(`${config.prodFolder}/images`))
    .pipe(gulp.dest(`${config.prodFolder}/`))
    .pipe($.size({
      title: 'images',
    })));

gulp.task('install', () => gulp.src(['./package.json'])
    .pipe(gulp.dest(config.devFolder))
    .pipe($.install({
      production: true,
    }))
    .pipe($.size({
      title: 'node_modules',
    })));

gulp.task('install2', ['install'], () => gulp.src([`${config.sourceFolder}/node_modules/**`])
    .pipe(gulp.dest(config.devFolder))
    .pipe($.imagemin({
      // Interlace GIFs for progressive rendering
      interlaced: true,
      // Lossless conversion to progressive JPGs
      progressive: true,
      optimizationLevel: 7,
      use: [imageminZopfli({
        '8bit': true,
        more: true,
      })],
    }))
    .pipe(gulp.dest(config.prodFolder))
    .pipe($.size({
      title: 'images in node_modules',
    })));

gulp.task('dev', ['install2', 'fonts', 'images', 'sass-lint', 'SCSS', 'jslint', 'js', 'htmllint'], () => {
  gulp.src(`${config.sourceFolder}/**/*.html`)
    .pipe(gulp.dest(config.devFolder));
});
gulp.task('serve:dev', ['dev'], () => {
  bs = browserSync({
    notify: true,
    // tunnel: '',
    server: {
      baseDir: config.devFolder,
    },
    ui: {
      port: 3000,
      weinre: {
        port: 3002,
      },
    },
  });
});

gulp.task('watch', () => {
  gulp.watch([`${config.sourceFolder}/**/*.html`, `${config.sourceFolder}/**/*.js`], ['dev']);
  gulp.watch([`${config.devFolder}/css/*.css`], reload);
  gulp.watch([`${config.sourceFolder}/scss/**/*.scss`], ['SCSS']);
});

gulp.task('default', ['serve:dev', 'watch']);

// Optimizes all the CSS, HTML and concats the JS etc
gulp.task('prod', ['dev'], () => {
  /* var assets = $.useref.assets({
    searchPath: config.devFolder
  });*/
  /*  var revAll = new $.revAll({
      dontRenameFile: ['.eot', '.svg', '.ttf', '.woff', 'png']
    });*/
  const htmlFilter = $.filter('**/*.html', {
    restore: true,
  });
  const cssFilter = $.filter('**/*.css', {
    restore: true,
  });
  const jsFilter = $.filter('**/*.js', {
    restore: true,
  });

  return gulp.src(`${config.devFolder}/index.html`)
    // .pipe(assets)
    // Conctenate your files based on what you specified in _layout/header.html
    .pipe($.useref({
      searchPath: config.devFolder,
    }, lazypipe().pipe($.sourcemaps.init, {
      loadMaps: true,
    })))
    // Concatenate JavaScript files and preserve important comments
    .pipe(jsFilter)
    .pipe($.uglify({
      output: { // http://lisperator.net/uglifyjs/codegen
        beautify: false,
        comments: /^!|\b(copyright|license)\b|@(preserve|license|cc_on)\b/i,
      },
      compress: { // http://lisperator.net/uglifyjs/compress, http://davidwalsh.name/compress-uglify
        sequences: true,
        booleans: true,
        conditionals: true,
        hoist_funs: false,
        hoist_vars: false,
        warnings: false,
      },
      mangle: true,
    }))
    .pipe(jsFilter.restore)
    // Minify CSS
    .pipe(cssFilter)
    .pipe($.cleanCss({
      compatibility: 'ie8',
    }))
    .pipe(cssFilter.restore)
    // Start cache busting the files
    // .pipe($.rev())
    // .pipe(assets.restore())
    // Replace the asset names with their cache busted names
    // .pipe($.revReplace())
    .pipe(htmlFilter)
    // Add GA
    /*
    .pipe($.ga({
          url: 'http://julien-noblet.github.io/cad-killer',
          uid: 'UA-59363844-3',
          linkAttribution: true
        }))
    */
    // Minify HTML
    .pipe($.htmlmin({
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
        // Send the output to the correct folder
    }))
    .pipe(htmlFilter.restore)
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.prodFolder))
    .pipe($.size({
      title: 'optimizations',
    }));
});
gulp.task('serve:prod', ['prod'], () => {
  bs = browserSync({
    notify: true,
    // tunnel: '',
    server: {
      baseDir: config.prodFolder,
    },
    ui: {
      port: 3000,
      weinre: {
        port: 3002,
      },
    },

  });
});
gulp.task('serve', ['serve:prod', 'watch']);
