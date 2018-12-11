/**
 * optimize css in place for production
 * @tasks/optimize-css
 */
'use strict';

var htmlmin = require('gulp-htmlmin');
let gutil = require('gulp-util');


/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function(gulp,  options, flags) {
  return function() {
  
    let onError = function (err) {
      console.log("!!! Rollup Error");
      gutil.beep();
      gutil.log(err);
      gutil.log(err.toString());
      del.sync(options.hackFile);
      this.emit('end');
    };
  
    let opt = require('../../compiler-directives');
  
    
    
    return gulp.src(options.html.src)

      .pipe(htmlmin({
        collapseWhitespace: opt.standardOptions.minifyHTML[opt.template],
        conservativeCollapse:true,
        removeComments:true}))
      .pipe(gulp.dest(options.dist))

  };
};


