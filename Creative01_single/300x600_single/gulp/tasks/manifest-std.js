/**
 * Deletes specified directory.
 * @tasks/clean
 */
'use strict';
let preprocess = require('gulp-preprocess');
let gutil = require('gulp-util');
let debug = require('gulp-debug');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to delete.
 * @returns {Function}
 */
module.exports = function (gulp, bs, options, flags) {
  return function () {
    let directives = require('../../compiler-directives');
    directives.type = flags.type;
    let onError = function (err) {
      console.log("!!! STD Manifest Error Error");
      gutil.beep();
      gutil.log(err);
      gutil.log(err.toString());
      //del.sync(options.hackFile);
      this.emit('end');
    };
    if (directives.template === "FT" && directives.isStandard === true) {
      return gulp.src(options.src)
        //.pipe(debug())
        .pipe(preprocess({context: directives}, {type: 'js'})).on('error', onError)
        .pipe(gulp.dest(options.dist))
        .pipe(bs.stream());
    } else {
      return gulp.src(options.src)
        .pipe(bs.stream());
    }
  }
};

