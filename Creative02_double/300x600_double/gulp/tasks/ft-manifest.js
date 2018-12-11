/**
 * fixes FT manifest
 * @tasks/html
 */
'use strict';

let gulpif = require('gulp-if');
let replace = require('gulp-replace');
let injectSvg = require('gulp-inject-svg');
let preprocess = require('gulp-preprocess');
let path = require('path');
let gutil = require('gulp-util');
let prettify = require('gulp-jsbeautifier');
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
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
    
    
    var arr = path.resolve(options.dist, '../');
    arr = arr.split(path.sep);
    var richName = arr[arr.length - 1] + '-rich';
    return gulp.src(options.src)
      .pipe(preprocess({context: require('../../compiler-directives')}, {type: 'js'})).on('error', onError)
      .pipe(prettify())
      .pipe(replace('RICH-NAME', richName))
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream());
  };
};