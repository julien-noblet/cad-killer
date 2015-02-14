/*jslint node: true */
"use strict";
/*****************
 * Configuration *
 *****************/
var config = {
  source_folder : "src", // dossier source
  dev_folder : "serve", // dossier pour le serveur local
  prod_folder : "prod", // dossier de build :)

  uncss : {
    html : ["src/index.html"], // have to fix?
    ignore : [
      '.content',
      '.type',
      '.geoJson',
      '.on',
      /^.reverse-/,
      /^.leaflet-/,
      /^.photon-/
      ]
    },
  colorguard : {
      logOk: true,
      threshold: 3,
      ignore: ["#030303"],
      whitelist: [
        ["#000000", "#010101"],
        ["#ffffff", "#f4f4f4"],
        ["#cccccc", "#c3c3c3"],
        ["#bbbbbb", "#c3c3c3"]
        ]
      }
};

/************
 * Includes *
 ************/
var gulp = require("gulp");
var $ = require("gulp-load-plugins")(); // auto load :)
var addsrc = require("gulp-add-src"); // fucking "-"
// Permet de supprimer les dossier de destination
var del = require("del"); // ce n'est pas un plugin Gulp.

// Idem, on doit le charger manuellement.
var browserSync = require("browser-sync");
var reload = browserSync.reload; // on met la commande dans une variable locale
var bs; // voir plus loin :)

var merge = require("merge-stream"); // permet de joindre 2 flux de sorties.

/*********
 * Tasks *
 *********/
// Deletes the directory that is used to serve the site during development
gulp.task("clean:dev", del.bind(null, [config.dev_folder]));

// Deletes the directory that the optimized site is output to
gulp.task("clean:prod", del.bind(null, [config.prod_folder]));

// SCSS
gulp.task("SCSS", function () {
  gulp.src(config.source_folder+"/scss/style.scss")
  .pipe($.sourcemaps.init())
  .pipe($.sass())
  .pipe(addsrc.prepend(config.source_folder+'/vendor/**/*.css'))
  .pipe(addsrc.prepend('bower_components/**/*.css'))
  .pipe($.concat('style.css'))
  // AutoPrefix your CSS so it works between browsers
  .pipe($.autoprefixer("last 1 version", { cascade: true }))
  .pipe($.sourcemaps.write())
  .pipe($.uncss(config.uncss))
  .pipe($.colorguard(config.colorguard))
  .pipe(gulp.dest(config.source_folder+"/css/"))
  .pipe(gulp.dest(config.dev_folder+"/css/"))
  // Outputs the size of the CSS file
  .pipe($.size({title: "styles"}))
  // Injects the CSS changes to your browser since Jekyll doesn"t rebuild the CSS
  .pipe(reload({stream: true}));
});

// Run JS Lint against your JS
gulp.task("jslint", function () {
  gulp.src(config.source_folder+"/js/*.js")
    // Checks your JS code quality against your .jshintrc file
    .pipe($.jshint(".jshintrc"))
    .pipe($.jshint.reporter());
});

// Copy over fonts to the "site" directory
gulp.task("fonts", function () {
  return gulp.src(config.source_folder+"/fonts/**")
    .pipe(gulp.dest(config.prod_folder+"/fonts"))
    .pipe($.size({ title: "fonts" }));
});

// Copy over fonts to the "site" directory
gulp.task("vendor", function () {
  return gulp.src(config.source_folder+"/vendor/**","bower_components/**")
    .pipe(gulp.dest(config.prod_folder+"/vendor"))
    .pipe($.size({ title: "vendor" }));
});

gulp.task("coffee",function(){

});
gulp.task("js", function() {
  gulp.src("./src/js/*.js")
    .pipe($.jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest("./dist/js/"))
})


gulp.task("html", function() {
  gulp.src("./src/*.html")
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


gulp.task("default", ["vendor", "html", "styles", "js", "font"], function() {
  gulp.watch("./bower_components/**/*", ["vendor"])
  gulp.watch("./src/*.html", ["html"])
  gulp.watch("./src/js/**/*", ["js"])
  gulp.watch("./src/fonts/**/*", ["font"])
})

gulp.task("deploy", ["vendor", "html", "styles", "js", "font", "checkCSS"], function(cb) {
  ghpages.publish(path.join(process.cwd(), "dist"), cb);
});
