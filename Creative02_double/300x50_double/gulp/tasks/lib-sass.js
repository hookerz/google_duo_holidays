/**
 * Compiles sass to css
 * @tasks/sass
 */
'use strict';
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');
let gulpif = require('gulp-if');
let replace = require('gulp-replace');
let injectSvg = require('gulp-inject-svg');
let preprocess = require('gulp-preprocess');
let path = require('path');
let gutil = require('gulp-util');
const filter = require('gulp-filter');

/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @param flags - object
 * options.sourcemap : determines if sourcemaps are to be generated
 * @returns {Function}
 */
module.exports = function (gulp, bs, options, flags) {
  return function () {
  
    let onError = function (err) {
      console.log("!!! Rollup Error");
      gutil.beep();
      gutil.log(err);
      gutil.log(err.toString());
      del.sync(options.hackFile);
      this.emit('end');
    };
  
    const f = filter(['**/style.scss'], {restore: true});
  
    let opt = require('../../compiler-directives');
    opt.type = flags.type;
    
    console.log("!!!", flags.sourcemap);
    if (flags.sourcemap === true) {
      return gulp.src(options.src)
        .pipe(f)
        .pipe(preprocess({context: opt}, {type: 'js'})).on('error', onError)
        .pipe(f.restore)
        .pipe(sourcemaps.init())
        .pipe(sass( /*{includePaths: [require("bourbon").includePaths]}*/).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(options.dist))
        .pipe(bs.stream());
    }
    return gulp.src(options.src)
      .pipe(f)
      .pipe(preprocess({context: require('../../compiler-directives')}, {type: 'js'})).on('error', onError)
      .pipe(f.restore)
      .pipe(sass(/*{includePaths: [require("bourbon").includePaths]}*/).on('error', sass.logError))
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream());
  }
};


