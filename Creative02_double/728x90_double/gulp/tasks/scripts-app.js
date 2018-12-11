/**
 * Merges all ( non LIB ) javascript files into one js file using browserify.
 * @tasks/scripts-app
 */
'use strict';
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let gutil = require('gulp-util');
let babelify = require("babelify");
let preprocessify = require('preprocessify');
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
module.exports = function (gulp, bs, options, flags) {
  return function () {
    let opt = require('../../compiler-directives')
    opt.type = flags.type;
   
    
    if (flags.sourcemap === true) {
      opt["DEBUG"] = true
    }
    let bundler = browserify(options.app.entry, {
      debug: flags.sourcemap,
      cache: {}
    }).transform(preprocessify, {
        includeExtensions: ['.js'],
        context: opt // This will replace "/* @echo FOO */" with "bar"
      })
      .transform(babelify, {presets: ["es2015"]});
    let rebundle = function () {
      return bundler.bundle().on('error', onError)
        .pipe(source('main.build.js'))
        .pipe(gulp.dest(options.dist))
        .pipe(bs.stream());
    };
    let onError = function (err) {
      console.log("!!! browserify Error");
      gutil.beep();
      console.log(err.toString());
      this.emit('end');
    };
    bundler.on('update', rebundle);
    bundler.on('error', onError);
    return rebundle();
  };
};