/*eslint-env node*/
"use strict";

/*****************
 * Configuration *
 *****************/
var config = {
  sourceFolder: "src", // dossier source
  devFolder: "serve", // dossier pour le serveur local
  prodFolder: "prod", // dossier de build :)

  uncss: {
    html: ["src/index.html"], // have to fix?
    ignore: [
      ".content",
      ".type",
      ".geoJson",
      ".headmasked",
      ".nohead",
      ".geo",
      ".on",
      "ul",
      "li",
      /\.ath/,
      /input/,
      /reverse-/,
      /leaflet-/,
      /photon-/
    ]
  },
  colorguard: {
    logOk: true,
    threshold: 3,
    ignore: ["#030303"],
    whitelist: [
      ["#000000", "#010101"],
      ["#9e9e9e", "#999999"],
      ["#cccccc", "#c3c3c3"],
      ["#cccccc", "#d1d1d1"],
      ["#bbbbbb", "#c3c3c3"],
      ["#dddddd", "#d1d1d1"],
      ["#eeeeee", "#f4f4f4"],
      ["#fefefe", "#f4f4f4"],
      ["#ffffff", "#f4f4f4"], // Can-i reduce?
      ["#ffffff", "#fefefe"]
    ]
  }
};

/************
 * Includes *
 ************/
var gulp = require("gulp");
var $ = require("gulp-load-plugins")(); // auto load :)
// Permet de supprimer les dossier de destination
var del = require("del"); // ce n'est pas un plugin Gulp.
//var argv = require("minimist")(process.argv.slice(2));

// Idem, on doit le charger manuellement.
var browserSync = require("browser-sync");
var reload = browserSync.reload; // on met la commande dans une variable locale

/* eslint-disable no-unused-vars */
var bs; // voir plus loin :)
/* eslint-enable no-unused-vars */

//var merge = require("merge-stream"); // permet de joindre 2 flux de sorties.
var scsslint = require("gulp-scss-lint");
var htmlhint = require("gulp-htmlhint");

/*********
 * Tasks *
 *********/
// Deletes the directory that is used to serve the site during development
gulp.task("clean:dev", del.bind(null, [config.devFolder]));

// Deletes the directory that the optimized site is output to
gulp.task("clean:prod", del.bind(null, [config.prodFolder]));

// SCSS-Lint
gulp.task("scss-lint", function() {
  gulp.src(config.sourceFolder + "/scss/style.scss")
    .pipe(scsslint());
});

// SCSS
gulp.task("SCSS", function() {
  gulp.src(["bower_components/add-to-homescreen/style/addtohomescreen.css",
      "bower_components/leaflet-plugins/css/distance.css",
      "bower_components/leaflet-plugins/css/osb.css",
      "bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css",
      "bower_components/leaflet.photon/leaflet.photon.css",
      "bower_components/leaflet/dist/leaflet.css",
      config.sourceFolder + "/scss/style.scss"
    ])
    //  .pipe($.sourcemaps.init()) //useless ?
    .pipe($.sass())
    .pipe($.concat("style.css"))
    // AutoPrefix your CSS so it works between browsers
    .pipe($.autoprefixer("> 1%, last 2 versions, Firefox ESR, Opera 12.1", {
      cascade: true
    }))
    .pipe($.uncss(config.uncss))
    .pipe($.colorguard(config.colorguard))
    .pipe(gulp.dest(config.sourceFolder + "/css"))
    .pipe(gulp.dest(config.devFolder + "/css"))
    // Outputs the size of the CSS file
    .pipe($.size({
      title: "styles"
    }))
    // Injects the CSS changes to your browser since Jekyll doesn't rebuild the CSS
    .pipe(reload({
      stream: true
    }));
});

// HTML Lint
gulp.task("htmllint", function() {
  gulp.src("./src/*.html")
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());
});

// Run JS Lint against your JS
gulp.task("jslint", function() {
  gulp.src(config.sourceFolder + "/js/*.js")
    // Checks your JS code quality against your .jshintrc file
    .pipe($.eslint({
      rules: {
        "no-unused-vars": 1,
        "no-console": 1
      }
    }))
    .pipe($.eslint.formatEach("compact", process.stderr))
    .pipe($.eslint.failOnError());
});

// Copy over fonts to the "site" directory
gulp.task("fonts", function() {
  return gulp.src([config.sourceFolder + "/fonts/**", "bower_components/material-design-iconic-font/dist/font/*"])
    .pipe(gulp.dest(config.devFolder + "/font"))
    .pipe(gulp.dest(config.prodFolder + "/font"))
    .pipe($.size({
      title: "fonts"
    }));
});

gulp.task("js", function() {
  gulp.src(config.sourceFolder + "/js/*.js")
    //.pipe($.concat("all.js"))
    //.pipe($.uglify({preserveComments: "some"}))
    .pipe($.size({
      title: "js"
    }))
    .pipe(gulp.dest(config.devFolder + "/js/"));
});

// Optimizes the images that exists
gulp.task("images", function() {
  return gulp.src([config.sourceFolder + "/images/**", "bower_components/leaflet/dist/images/**"])
    .pipe(gulp.dest(config.devFolder + "/images"))
    .pipe($.changed(config.prodFolder + "/images"))
    .pipe($.imagemin({
      // Lossless conversion to progressive JPGs
      progressive: true,
      // Interlace GIFs for progressive rendering
      interlaced: true
    }))
    .pipe(gulp.dest(config.prodFolder + "/images"))
    .pipe($.size({
      title: "images"
    }));
});

gulp.task("bower", function() {
  return $.bower()
    .pipe(gulp.dest(config.devFolder + "/vendor"));
});

gulp.task("dev", ["bower", "fonts", "images", "scss-lint", "SCSS", "jslint", "js", "htmllint"], function() {

  gulp.src(config.sourceFolder + "/**/*.html")
    .pipe(gulp.dest(config.devFolder));
});
gulp.task("serve:dev", ["dev"], function() {
  bs = browserSync({
    notify: true,
    // tunnel: "",
    server: {
      baseDir: config.devFolder
    }
  });
});

gulp.task("watch", function() {
  gulp.watch([config.sourceFolder + "/**/*.html", config.sourceFolder + "/**/*.js"], ["dev"]);
  gulp.watch([config.devFolder + "/css/*.css"], reload);
  gulp.watch([config.sourceFolder + "/scss/**/*.scss"], ["SCSS"]);
});

gulp.task("default", ["serve:dev", "watch"]);

// Optimizes all the CSS, HTML and concats the JS etc
gulp.task("prod", ["dev"], function() {
  var assets = $.useref.assets({
    searchPath: config.devFolder
  });

  return gulp.src(config.devFolder + "/*.html")
    .pipe(assets)
    // Concatenate JavaScript files and preserve important comments
    .pipe($.if("*.js", $.uglify({
      preserveComments: "some"
    })))
    // Minify CSS
    .pipe($.if("*.css", $.minifyCss()))
    // Start cache busting the files
    .pipe($.revAll({
      ignore: [".eot", ".svg", ".ttf", ".woff", "png"]
    }))
    .pipe(assets.restore())
    // Conctenate your files based on what you specified in _layout/header.html
    .pipe($.useref())
    // Replace the asset names with their cache busted names
    .pipe($.revReplace())
    // Add GA
    .pipe($.if('*.html',$.ga({
          url: "julien-noblet.github.io/cad-killer",
          uid: "UA-59363844-3",
          demographics: true,
          tag: "body",
          linkAttribution: true
        })))
    // Minify HTML
    .pipe($.if("*.html", $.htmlmin({
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true
        // Send the output to the correct folder
    })))
    .pipe(gulp.dest(config.prodFolder))
    .pipe($.size({
      title: "optimizations"
    }));
});
gulp.task("serve:prod", ["prod"], function() {
  bs = browserSync({
    notify: true,
    // tunnel: "",
    server: {
      baseDir: config.prodFolder
    }
  });
});
