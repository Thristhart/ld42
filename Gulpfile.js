const gulp = require('gulp');

const rollup = require('rollup-stream');
const rollupNode = require('rollup-plugin-node-resolve');
const rollupBuiltins = require('rollup-plugin-node-builtins');
const rollupCommonjs = require('rollup-plugin-commonjs');

const setSource = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const browserSync = require('browser-sync');


let cache;

function buildJS() {
  return rollup({
    input: './src/main.mjs',
    format: 'iife',
    cache,
    sourcemap: true,
    plugins: [
      rollupNode(),
      rollupBuiltins(),
      rollupCommonjs({
        include: 'node_modules/victor/**'
      }),
    ]
  })
    .on('bundle', bundle => cache = bundle)
    .pipe(setSource('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist', {sourcemaps: './'}));
}

function buildHTML() {
  return gulp.src("./src/index.html")
    .pipe(gulp.dest("./dist/"));
}

function buildCSS() {
  return gulp.src("./src/**/*.css")
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());
}

function copyAssets() {
  return gulp.src("./src/assets/**/*")
    .pipe(gulp.dest("./dist/assets/"));
}

function watch() {
  gulp.watch("./src/**/*.mjs", gulp.series(buildJS, reload));
  gulp.watch("./src/**/*.html", gulp.series(buildHTML, reload));
  gulp.watch("./src/**/*.css", buildCSS);
  gulp.watch("./src/assets/**/*", gulp.series(copyAssets, reload));
}

function serve() {
  browserSync.init({
    server: "./dist",
    open: false,
  });
}

async function reload() {
  return browserSync.reload();
}

const child_process = require('child_process');

function pushHTMLToWebserver(done) {
  child_process.exec(`scp -r dist/* tom@shea.at:/srv/http/tom.shea.at/ld42/`, done);
}

gulp.task(buildJS);
gulp.task(buildHTML);
gulp.task(buildCSS);
gulp.task(copyAssets);
gulp.task("build", gulp.parallel(buildJS, buildHTML, buildCSS, copyAssets));
gulp.task(watch);
gulp.task(serve);
gulp.task("dev", gulp.series("build", gulp.parallel(serve, watch)));

gulp.task("deploy", pushHTMLToWebserver);
gulp.task("publish", gulp.series("build", "deploy"));