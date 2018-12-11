/**
 * Concants JS files in HTML
 * @tasks/scripts-vendor
 */
'use strict';
let useref = require('gulp-useref');
let source = require('vinyl-source-stream');
let gutil = require('gulp-util');
let gulpif = require('gulp-if');
let replace = require('gulp-replace');
let injectSvg = require('gulp-inject-svg');
let preprocess = require('gulp-preprocess');
let path = require('path');
let lec = require('gulp-line-ending-corrector');
const sreplace = require('gulp-string-replace');
let replaceOptions = {logs: {enabled: false}};



/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.entry : Path to the entry js file.
 * options.dist : Destination directory for file output.
 * @param flags - object
 * flags.minify : boolean
 * flags.sourcemap : boolean
 * @returns {Function}
 */
module.exports = function(gulp, bs, options, flags) {
  return function() {
    
    
    let onError = function (err) {
      console.log("!!! Rollup Error");
      gutil.beep();
      gutil.log(err);
      gutil.log(err.toString());
      del.sync(options.hackFile);
      this.emit('end');
    };
    
    
    return gulp.src (options.entry)
      .pipe(preprocess({context: require('../../compiler-directives')}, {type: 'html'})).on('error', onError)
      .pipe(lec())  
      .pipe(injectSvg()).on('error', onError)
      .pipe(sreplace(/http:\/\//g, 'https://',replaceOptions))
      .pipe(sreplace(/xmlns="https:\/\/www.w3.org\/2000\/svg"/g, 'xmlns="http:\/\/www.w3.org\/2000\/svg"',replaceOptions))
      .pipe(sreplace(/xmlns:xlink="https:\/\/www.w3.org\/1999\/xlink"/g, 'xmlns:xlink="http:\/\/www.w3.org\/1999\/xlink"',replaceOptions))
      .pipe(lec())
      .pipe(useref())
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream());
    
    
  };
};
