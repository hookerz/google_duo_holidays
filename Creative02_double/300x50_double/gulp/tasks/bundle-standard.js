/**
 * bundle dist for DC Studio
 * @tasks/bundle-dc
 */
'use strict';
var zip = require('gulp-vinyl-zip').zip;
var gutil = require('gulp-util');
var fs = require("fs");
var del = require('del');
var path = require('path');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @param flags - object
 * options.sourcemap : determines if sourcemaps are to be generated
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {
  return function () {
    let directives = require('../../compiler-directives');
    directives.type = flags.type;
    let opt = Object.assign({}, options);
    if (directives.standardOptions.staticLocation[directives.template] === 'in.zip') {
      opt.src[opt.src.length - 1] = opt.src[opt.src.length - 1].replace('!', '');
    }
    var arr = path.resolve(options.dist, '../');
    arr = arr.split(path.sep);
    var name = arr[arr.length - 1] + '.zip';
    del.sync(path.join(options.dist, '/*.zip'));
    return gulp.src(options.src).on('error', gutil.log)
      .pipe(zip(name).on('error', gutil.log))
      .pipe(gulp.dest(options.dist).on('error', gutil.log));
  }
};


