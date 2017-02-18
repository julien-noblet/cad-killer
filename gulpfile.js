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
      ".city",
      ".content",
      ".geo",
      ".geoJson",
      ".headmasked",
      ".hidden",
      ".nohead",
      ".on",
      ".textnote",
      ".type",
      "li",
      "ul",
      /input/,
      /leaflet-/,
      /note/,
      /photon-/,
      /reverse-/,
      /zmdi/
    ]
  },
  colorguard: {
    logOk: true,
    threshold: 3,
    whitelist: [
      ["#f4f4f4", "#ffffff"]
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

var imageminZopfli = require("imagemin-zopfli");

/*********
 * Tasks *
 *********/
// Deletes the directory that is used to serve the site during development
gulp.task("clean:dev", del.bind(null, [config.devFolder]));

// Deletes the directory that the optimized site is output to
gulp.task("clean:prod", del.bind(null, [config.prodFolder]));
gulp.task("clean", ["clean:dev", "clean:prod"]);

// SCSS-Lint
gulp.task("scss-lint", function() {
  gulp.src(config.sourceFolder + "/scss/style.scss")
    .pipe($.scssLint());
});

// SCSS
gulp.task("SCSS", function() {
  gulp.src(config.sourceFolder + "/scss/style.scss")
    //  .pipe($.sourcemaps.init()) //useless ?
    .pipe($.scss())
    .pipe($.concat("style.css"))
    // AutoPrefix your CSS so it works between browsers
    .pipe($.autoprefixer({
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
    .pipe($.htmlhint())
    .pipe($.htmlhint.reporter());
});

// Run JS Lint against your JS
gulp.task("jslint", function() {
  gulp.src(config.sourceFolder + "/js/*.js")
    // Checks your JS code quality against your .jshintrc file
    .pipe($.eslint())
    .pipe($.eslint.formatEach("compact", process.stderr))
    .pipe($.eslint.failOnError());
});

// Copy over fonts to the "site" directory
gulp.task("fonts", function() {
  return gulp.src(["node_modules/npm-font-open-sans/fonts/**", "node_modules/material-design-iconic-font/dist/fonts/**"])
    .pipe(gulp.dest(config.devFolder + "/fonts"))
    .pipe(gulp.dest(config.prodFolder + "/fonts"))
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
  return gulp.src([config.sourceFolder + "/images/**", "node_modules/leaflet/dist/images/**", "node_modules/leaflet-draw/dist/images/**"])
    .pipe(gulp.dest(config.devFolder + "/images"))
    .pipe($.changed(config.prodFolder + "/images"))
    .pipe($.imagemin({
      // Interlace GIFs for progressive rendering
      interlaced: true,
      // Lossless conversion to progressive JPGs
      progressive: true,
      optimizationLevel: 7,
      use: [imageminZopfli({
        "8bit": true,
        "more": true
      })]
    }))
    .pipe(gulp.dest(config.prodFolder + "/images"))
    .pipe($.size({
      title: "images"
    }));
});

gulp.task("install", function() {
  return gulp.src(['./package.json'])
    .pipe(gulp.dest(config.devFolder))
    .pipe($.install({production: true}))
    .pipe($.size({
      title: "node_modules"
    }));;
});

gulp.task("install2",["install"],function(){
  return gulp.src([config.sourceFolder + "/node_modules/**"])
    .pipe(gulp.dest(config.devFolder ))
    .pipe($.imagemin({
      // Interlace GIFs for progressive rendering
      interlaced: true,
      // Lossless conversion to progressive JPGs
      progressive: true,
      optimizationLevel: 7,
      use: [imageminZopfli({
        "8bit": true,
        "more": true
      })]
    }))
    .pipe(gulp.dest(config.prodFolder))
    .pipe($.size({
      title: "images in node_modules"
    }));
})

gulp.task("dev", ["install2", "fonts", "images", "scss-lint", "SCSS", "jslint", "js", "htmllint"], function() {

  gulp.src(config.sourceFolder + "/**/*.html")
    .pipe(gulp.dest(config.devFolder));
});
gulp.task("serve:dev", ["dev"], function() {
  bs = browserSync({
    notify: true,
    // tunnel: "",
    server: {
      baseDir: config.devFolder
    },
    ui: {
      port: 3000,
      weinre: {
        port: 3002
      }
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
  /*var assets = $.useref.assets({
    searchPath: config.devFolder
  });*/
  /*  var revAll = new $.revAll({
      dontRenameFile: [".eot", ".svg", ".ttf", ".woff", "png"]
    });*/
  var jsFilter = $.filter("**/*.js", {
    restore: true
  });
  var cssFilter = $.filter("**/*.css", {
    restore: true
  });
  var htmlFilter = $.filter("**/*.html", {
    restore: true
  });

  return gulp.src(config.devFolder + "/index.html")
    //.pipe(assets)
    // Concatenate JavaScript files and preserve important comments
    .pipe(jsFilter)
    .pipe($.uglify({
      preserveComments: "some"
    }))
    .pipe(jsFilter.restore)
    // Minify CSS
    .pipe(cssFilter)
    .pipe($.cleanCss({compatibility: 'ie8'}))
    .pipe(cssFilter.restore)
    // Start cache busting the files
    //.pipe($.rev())
    //.pipe(assets.restore())
    // Conctenate your files based on what you specified in _layout/header.html
    .pipe($.useref({
      searchPath: config.devFolder
    }))
    // Replace the asset names with their cache busted names
    //.pipe($.revReplace())
    .pipe(htmlFilter)
    // Add GA
    /*
    .pipe($.ga({
          url: "http://julien-noblet.github.io/cad-killer",
          uid: "UA-59363844-3",
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
      removeRedundantAttributes: true
        // Send the output to the correct folder
    }))
    .pipe(htmlFilter.restore)
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
    },
    ui: {
      port: 3000,
      weinre: {
        port: 3002
      }
    }

  });
});
gulp.task("serve", ["serve:prod", "watch"]);
