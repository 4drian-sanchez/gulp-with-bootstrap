const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");

//Autoprefixer
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");

//Imagenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

//building
const rename = require("gulp-rename");
const purgecss = require("gulp-purgecss");

function css(done) {
  src("src/scss/app.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css"));
  done();
}

function cssbuild(done) {
  src("build/css/app.css")
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(
      purgecss({
        content: ["index.html"],
      })
    )
    .pipe(dest("build/css"));

  done();
}

function img(done) {
  src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));
  done();
}

function WebpVersions(done) {
  src("src/img/**/*.{jpg,png}").pipe(webp()).pipe(dest("build/img"));
  done();
}

function avifVersions(done) {
  src("src/img/**/*.{jpg,png}").pipe(avif()).pipe(dest("build/img"));
  done();
}

function dev(done) {
  watch("src/scss/**/*.scss", css);
  done();
}

exports.css = css;
exports.dev = dev;
exports.img = img;
exports.WebpVersions = WebpVersions;
exports.avifVersions = avifVersions;
exports.cssbuild = cssbuild;
exports.imgVersions = series(img, WebpVersions, avifVersions);
exports.default = series(css, dev);
