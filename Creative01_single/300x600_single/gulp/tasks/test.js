/**
 * Deletes specified directory.
 * @tasks/test
 */
'use strict';
let del = require('del');
let util = require('gulp-util');
let jasmine = require('gulp-jasmine'); // injects globals of 'describe' and 'it'
let gutil = require('gulp-util');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to delete.
 * @returns {Function}
 */
module.exports = function (gulp, options) {
  try {
    return function (done) {
      util.log('@tasks/test start ');
      let d1 = new Date();
      gulp.src(options.src)
        .pipe(jasmine({
            verbose: true,
          includeStackTrace:false,
          errorOnFail:false
          })
          .on('error', function (err) {
            util.log("!!! ONE OR MORE TEST FAILED !!!")
            gutil.log(err);
            gutil.log(err.stack);
            gutil.log(err.toString());
            done ()
          })
          .on('jasmineDone', function () {
            let d2 = new Date();
            let seconds = (d2 - d1) / 1000;
            util.log('@tasks/test complete ', seconds + 's');
            done()
          })
        );
    };
  } catch (err) {
    util.log(err);
  }
};
/*
 function () {
 let d2 = new Date();
 let seconds = (d2 - d1) / 1000;
 util.log('@tasks/test complete ', seconds + 's');
 done()
 }*

 */
