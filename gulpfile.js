/*eslint-env node*/
"use strict";

/*****************
 * Configuration *
 *****************/
var config = {
  sourceFolder: "src", // dossier source
  devFolder: "serve", // dossier pour le serveur local
  prodFolder: "prod", // dossier de build :)

  eslint: {
    "env": {
      "browser": true
    },
    ecmaFeatures: {
      jsx: true
    },
    "globals": {},
    "plugins": [],
    "rules": {
      // Possible Errors
      "comma-dangle": [2, "never"],
      "no-cond-assign": 2,
      "no-console": 1,
      "no-constant-condition": 2,
      "no-control-regex": 2,
      "no-debugger": 2,
      "no-dupe-args": 2,
      "no-dupe-keys": 2,
      "no-duplicate-case": 1,
      "no-empty": 2,
      "no-empty-character-class": 2,
      "no-ex-assign": 2,
      "no-extra-boolean-cast": 2,
      "no-extra-parens": 1,
      "no-extra-semi": 2,
      "no-func-assign": 2,
      "no-inner-declarations": 2,
      "no-invalid-regexp": 2,
      "no-irregular-whitespace": 2,
      "no-negated-in-lhs": 2,
      "no-obj-calls": 2,
      "no-regex-spaces": 2,
      "no-reserved-keys": 0,
      "no-sparse-arrays": 2,
      "no-unreachable": 2,
      "use-isnan": 2,
      "valid-jsdoc": 0,
      "valid-typeof": 2,
      // Best Practices
      "block-scoped-var": 2,
      "complexity": 1,
      "consistent-return": 2,
      "curly": 2,
      "default-case": 2,
      "dot-notation": 2,
      "eqeqeq": 2,
      "guard-for-in": 2,
      "no-alert": 2,
      "no-caller": 2,
      "no-div-regex": 2,
      "no-else-return": 2,
      "no-empty-label": 2,
      "no-eq-null": 2,
      "no-eval": 2,
      "no-extend-native": 2,
      "no-extra-bind": 2,
      "no-fallthrough": 2,
      "no-floating-decimal": 2,
      "no-implied-eval": 2,
      "no-iterator": 2,
      "no-labels": 2,
      "no-lone-blocks": 2,
      "no-loop-func": 2,
      "no-multi-spaces": 2,
      "no-multi-str": 1,
      "no-native-reassign": 2,
      "no-new": 2,
      "no-new-func": 2,
      "no-new-wrappers": 2,
      "no-octal": 2,
      "no-octal-escape": 2,
      "no-process-env": 2,
      "no-proto": 2,
      "no-redeclare": 2,
      "no-return-assign": 2,
      "no-script-url": 2,
      "no-self-compare": 2,
      "no-sequences": 2,
      "no-unused-expressions": 2,
      "no-void": 1,
      "no-warning-comments": 2,
      "no-with": 2,
      "radix": 2,
      "vars-on-top": 1,
      "wrap-iife": 2,
      "yoda": 2,
      // Strict Mode
      "strict": [2, "global"],
      // Variables
      "no-catch-shadow": 2,
      "no-delete-var": 2,
      "no-label-var": 2,
      "no-shadow": 2,
      "no-shadow-restricted-names": 2,
      "no-undef": 2,
      "no-undef-init": 2,
      "no-undefined": 2,
      "no-unused-vars": 2,
      "no-use-before-define": 2,
      // Stylistic Issues
      "indent": [2, 2, {
        "SwitchCase": 1
      }],
      "brace-style": 2,
      "camelcase": 1,
      "comma-spacing": 2,
      "comma-style": 2,
      "consistent-this": 1,
      "eol-last": 2,
      "func-names": 0,
      "func-style": 0,
      "key-spacing": [2, {
        "beforeColon": false,
        "afterColon": true
      }],
      "max-nested-callbacks": 1,
      "new-cap": 2,
      "new-parens": 2,
      "no-array-constructor": 2,
      "no-inline-comments": 0,
      "no-lonely-if": 2,
      "no-mixed-spaces-and-tabs": 2,
      "no-nested-ternary": 2,
      "no-new-object": 2,
      "semi-spacing": [2, {
        "before": false,
        "after": true
      }],
      "no-spaced-func": 2,
      "no-ternary": 0,
      "no-trailing-spaces": 2,
      "no-multiple-empty-lines": 2,
      "no-underscore-dangle": 0,
      "one-var": 0,
      "operator-assignment": [2, "always"],
      "padded-blocks": 0,
      "quotes": [2, "double"],
      "quote-props": [2, "as-needed"],
      "semi": [2, "always"],
      "sort-vars": [2, {
        "ignoreCase": true
      }],
      "space-after-keywords": 2,
      "space-before-blocks": 2,
      "object-curly-spacing": [1, "always"],
      "array-bracket-spacing": [1, "never"],
      "space-in-parens": 2,
      "space-infix-ops": 2,
      "space-return-throw-case": 2,
      "space-unary-ops": 2,
      "spaced-comment": 2,
      "wrap-regex": 1,
      // Legacy
      "max-depth": 0,
      //"max-len": [2, 120],
      "max-params": [1, 3],
      "max-statements": 0,
      "no-plusplus": 1,
      "no-bitwise": 1,
      // Others
      "accessor-pairs" : 1
    }
  },
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
    .pipe($.eslint(config.eslint))
    .pipe($.eslint.formatEach("compact", process.stderr))
    .pipe($.eslint.failOnError());
});

// Copy over fonts to the "site" directory
gulp.task("fonts", function() {
  return gulp.src([config.sourceFolder + "/fonts/**", "bower_components/material-design-iconic-font/dist/fonts/*"])
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
  return gulp.src([config.sourceFolder + "/images/**", "bower_components/leaflet/dist/images/**", "bower_components/leaflet.draw/dist/images/**"])
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
  var assets = $.useref.assets({
    searchPath: config.devFolder
  });
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

  return gulp.src(config.devFolder + "/*.html")
    .pipe(assets)
    // Concatenate JavaScript files and preserve important comments
    .pipe(jsFilter)
    .pipe($.uglify({
      preserveComments: "some"
    }))
    .pipe(jsFilter.restore)
    // Minify CSS
    .pipe(cssFilter)
    .pipe($.minifyCss())
    .pipe(cssFilter.restore)
    // Start cache busting the files
    .pipe($.rev())
    .pipe(assets.restore())
    // Conctenate your files based on what you specified in _layout/header.html
    .pipe($.useref())
    // Replace the asset names with their cache busted names
    .pipe($.revReplace())
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
