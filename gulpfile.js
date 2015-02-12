var gulp = require("gulp")
var gutil = require("gulp-util")
var plumber = require("gulp-plumber")
var myth = require("gulp-myth")
var options = require("minimist")(process.argv.slice(2))
var checkCSS = require('gulp-check-unused-css');
var colorguard = require('gulp-colorguard');
var crass = require('gulp-crass');
var prettify = require('gulp-html-prettify');
var resources = require('gulp-resources');
var csscombLint = require('gulp-csscomb-lint');
var ga = require('gulp-ga');
var jshint = require('gulp-jshint');
var ghpages = require('gh-pages');
var path = require('path');

gulp.task("checkCSS", function() {
  gulp.src("./dist/*.html")
    .pipe(options.production ? plumber() : gutil.noop())
    .pipe(resources())
    .pipe(checkCSS({
      ignore: [
        'content',
        'type',
        'geoJson',
        'on',
        /^reverse-/,
        /^leaflet-/,
        /^photon-/
      ]
    }));
})

gulp.task("styles", function() {
  gulp.src("./src/css/*.css")
    .pipe(options.production ? plumber() : gutil.noop())
    .pipe(colorguard({
      ignore: ["#030303"],
      whitelist: [
        ["#000000", "#010101"]
      ]
    }))
    .pipe(myth({
      sourcemap: !options.production
    }))
    .pipe(csscombLint())
    .pipe(crass())
    .pipe(gulp.dest("./dist/css/"))
})

gulp.task("html", function() {
  gulp.src("./src/*.html")
    .pipe(options.production ? plumber() : gutil.noop())
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(ga({
      url: 'julien-noblet.github.io/cad-killer',
      uid: 'UA-59363844-1'
    }))
    .pipe(gulp.dest("./dist/"))
})

gulp.task("js", function() {
  gulp.src("./src/js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest("./dist/js/"))
})

gulp.task("vendor", function() {
  gulp.src(["./bower_components/**/*", "./src/vendor/**/*"])
    .pipe(gulp.dest("./dist/vendor/"))
})

gulp.task("font", function() {
  gulp.src("./src/font/**/*")
    .pipe(options.production ? plumber() : gutil.noop())
    .pipe(gulp.dest("./dist/font/"))
})


gulp.task("default", ["vendor", "html", "styles", "js", "font", "checkCSS"], function() {
  gulp.watch("./bower_components/**/*", ["vendor"])
  gulp.watch("./src/*.html", ["html", "checkCSS"])
  gulp.watch("./src/js/**/*", ["js"])
  gulp.watch("./src/fonts/**/*", ["font", "checkCSS"])
  gulp.watch("./src/css/**/*", ["styles", "checkCSS"])
})

gulp.task("deploy", ["vendor", "html", "styles", "js", "font", "checkCSS"], function(cb) {
  ghpages.publish(path.join(process.cwd(), "dist"), cb);
});
