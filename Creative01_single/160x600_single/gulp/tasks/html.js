/**
 * Compiles and copies the final file
 * @tasks/html
 */
'use strict';
let gulpif = require('gulp-if');
let replace = require('gulp-replace');
let injectSvg = require('gulp-inject-svg');
let preprocess = require('gulp-preprocess');
let path = require('path');
let gutil = require('gulp-util');
let del = replace('del');
let debug = require('gulp-debug');

const sreplace = require('gulp-string-replace');
let replaceOptions = {logs: {enabled: false}};

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
    let path = [];
    path = path.concat(options.src);
    if (flags.type === "prod") {
      path.push("!" + options.entry)
    }
    let onError = function (err) {
      console.log("!!! HTML Error");
      gutil.beep();
      gutil.log(err);
      gutil.log(err.toString());
      //del.sync(options.hackFile);
      this.emit('end');
    };
    
    let directives = require('../../compiler-directives');
    directives.type = flags.type;
    
    console.log('!!!!!!', path);
    return gulp.src(path)
      .pipe(debug())
      .pipe(preprocess({context: directives}, {type: 'html'})).on('error', onError)
      .pipe(injectSvg()).on('error', onError)

        .pipe(sreplace(/http:\/\//g, 'https://',replaceOptions))
        .pipe(sreplace(/xmlns="https:\/\/www.w3.org\/2000\/svg"/g, 'xmlns="http:\/\/www.w3.org\/2000\/svg"',replaceOptions))
        .pipe(sreplace(/xmlns:xlink="https:\/\/www.w3.org\/1999\/xlink"/g, 'xmlns:xlink="http:\/\/www.w3.org\/1999\/xlink"',replaceOptions))
      .pipe(gulpif(flags.type === "dev", replace('../../vendor', 'vendor')))
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream());
  };
};