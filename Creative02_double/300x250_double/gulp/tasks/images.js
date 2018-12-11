/**
 * Minify PNG, JPEG, GIF and SVG images.
 * @tasks/images
 */
'use strict';
var util = require('gulp-util');
var gulpTinifyImg = require('gulp-tinify-img');

/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function(gulp, bs, options, flags,tinypngkey) {
  return function() {
    var d1 = new Date();
    util.log('@tasks/optimize-image start ');
    
    if (flags===null){
      return gulp.src(options.src)
        .pipe(gulp.dest(options.dist))
        .pipe(bs.stream());
    }
    if (tinypngkey === 'undefined' || tinypngkey === undefined ||tinypngkey ==='' || tinypngkey === null || tinypngkey.length !==32) {
  
      util.log('@tasks/optimize-image Skipping TinyPNG ');
      
      return gulp.src(options.src)
        .pipe(gulp.dest(options.dist))
        .pipe(bs.stream());
    }
  
    util.log('@tasks/optimize-image Using TinyPNG ');
    return gulp.src(options.src)
      .pipe(gulpTinifyImg({tinify_key: tinypngkey, log: false}).on('error', util.log))
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream())
      .on('error', util.log)
      .on('finish', function () {
        var d2 = new Date();
        var seconds = (d2 - d1) / 1000;
        util.log('@tasks/optimize-image complete ', seconds + 's')
      })
    
    
  };
};