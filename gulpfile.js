"use strict";

var siteCSS = "",
  siteUrl = "";

const jsFiles = [
  "./src/js/libs/jquery.matchHeight-min.js",
  "./src/js/libs/jquery.fancybox.js",
  "./src/js/libs/readmore.min.js",
  "./src/js/libs/slick.min.js",
  "./src/js/custom/common.js"
];

var gulp = require("gulp"),
  concatcss = require("gulp-concat-css"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  notify = require("gulp-notify"),
  prefix = require("autoprefixer"),
  livereload = require("gulp-livereload"),
  connect = require("gulp-connect"),
  sass = require("gulp-sass"),
  nested = require("postcss-nested"),
  short = require("postcss-short"),
  plumber = require("gulp-plumber"),
  uglify = require("gulp-uglify"),
  cleanCSS = require("gulp-clean-css"),
  sourcemaps = require("gulp-sourcemaps"),
  useref = require("gulp-useref"),
  postcss = require("gulp-postcss"),
  cssnext = require("postcss-preset-env"),
  clean = require("gulp-clean"),
  svgSymbols = require("gulp-svg-symbols"),
  inject = require("gulp-inject"),
  browserSync = require("browser-sync");

gulp.task(`svg-sprites`, function() {
  return gulp
    .src(`src/svg/*.svg`)
    .pipe(svgSymbols({ 
			templates: [`default-svg`, "default-demo"],
			svgAttrs: {
				style: 'display: none;'
			}
		}))
    .pipe(gulp.dest(`./app/assets/svg`));
});

//JS
gulp.task("js", function() {
  return gulp
    .src(jsFiles)
    .pipe(sourcemaps.init())
    .pipe(concat("main.js"))
    .pipe(uglify({ toplevel: true }))
    .pipe(gulp.dest("./app/assets/js"))
    .pipe(connect.reload());
});

//server
gulp.task("connect", function() {
  connect.server({
    root: "app",
    livereload: true
  });
});

// Remove app/
gulp.task("clean", function() {
  return gulp.src("app/*").pipe(clean());
});

//html
gulp.task("html", function() {
  return gulp
    .src("src/*.html")
    .pipe(
      inject(gulp.src("./app/assets/svg/svg-symbols.svg"), {
        starttag: "<!-- inject:svg -->",
        relative: true,
        transform: function(filePath, file) {
          // return file contents as string
          return file.contents.toString("utf8");
        }
      })
    )
    .pipe(gulp.dest("app"))
    .pipe(connect.reload());
});

//css
gulp.task("css", function() {
  var processors = [
    short,
    nested,
    cssnext({
      customProperties: true,
      customFunction: true,
      customSelectors: true
    }),
    prefix({ overrideBrowserslist: ["last 2 versions", "> 1%", "ie 9"] })
  ];
  return (
    gulp
      .src("src/scss/common.scss")
      .pipe(
        plumber({
          // plumber - catching errors
          errorHandler: notify.onError(function(err) {
            // Easy to read errors
            return {
              title: "Styles",
              message: err.message
            };
          })
        })
      )
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(postcss(processors))
      // .pipe(concat("bundle.css"))
      .pipe(cleanCSS())
      .pipe(rename("bundle.min.css"))
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest("./app/assets//css"))
      // .pipe(gulp.dest('wp/wp-content/themes/windfall/assets//css'))
      .pipe(connect.reload())
  );
});

// Fonts
gulp.task("fonts", function() {
  return gulp
    .src("src/fonts/**/*.*")
    .pipe(gulp.dest("./app/assets/fonts/"))
    .pipe(connect.reload());
});

// Images
gulp.task("images", function() {
  return gulp
    .src("src/img/**/*.*")
    .pipe(gulp.dest("./app/assets/img/"))
    .pipe(connect.reload());
});

//watch
gulp.task("watch", function() {
  gulp.watch("src/scss/**/*.*", gulp.series("css"));
  gulp.watch("src/js/**/*.*", gulp.series("js"));
  gulp.watch("src/*.html", gulp.series("html"));
  gulp.watch("src/img/**/*.*", gulp.series("images"));
  gulp.watch("src/fonts/**/*.*", gulp.series("fonts"));
  gulp.watch("src/svg/**/*.*", gulp.series("svg-sprites"));
});

// Watch Injection
gulp.task("watch-inject", function() {
  gulp.watch("src/scss/**/*.*", gulp.series("css-inject"));
});

// Server Injection
gulp.task("server", function() {
  browserSync({
    proxy: siteUrl,
    middleware: require("serve-static")("./app"),
    rewriteRules: [
      {
        match: new RegExp(siteCSS),
        fn: function() {
          return "assets/css/style.css";
        }
      }
    ]
  });
});

// CSS Injection
gulp.task("css-inject", function() {
  var reload = browserSync.reload;
  var processors = [
    short,
    nested,
    cssnext({
      customProperties: true,
      customFunction: true,
      customSelectors: true
    }),
    prefix({ overrideBrowserslist: ["last 2 versions", "> 1%", "ie 9"] })
  ];
  return gulp
    .src("src/scss/common.scss")
    .pipe(
      plumber({
        // plumber - плагин для отловли ошибок.
        errorHandler: notify.onError(function(err) {
          // nofity - представление ошибок в удобном для вас виде.
          return {
            title: "Styles",
            message: err.message
          };
        })
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass()) //Компиляция sass.
    .pipe(postcss(processors))
    .pipe(concat("bundle.css"))
    .pipe(rename("style.css"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("app/assets//css"))
    .pipe(reload({ stream: true }));
});

gulp.task(
  "default",
  gulp.parallel(
    "connect",
    "svg-sprites",
    "html",
    "css",
    "js",
    "fonts",
    "images",
    "watch"
  )
);
gulp.task(
  "build",
  gulp.series(
    "clean",
    "svg-sprites",
    gulp.parallel("connect", "html", "css", "js", "fonts", "images", "watch")
  )
);

gulp.task("inject", gulp.parallel("css-inject", "watch-inject", "server"));
