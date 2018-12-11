/**
 * Minify PNG, JPEG, GIF and SVG images.
 * @tasks/images
 */
'use strict';
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var jimp = require('gulp-jimp');
var buffer = require('vinyl-buffer');
var rename = require('gulp-simple-rename');
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function (gulp, bs, options, flags) {
  
  let directives = require('../../compiler-directives');
  return function () {
    var imagesDone = false;
    var cssDone = false;
    var inter = 0;
    var use_jpg = false;
    if (options.jpg_conversion === true /*&& flags.type === 'prod'*/) {
      use_jpg = true;
    }
    // Generate our spritesheet
    var spriteData = gulp.src(options.src).pipe(spritesmith({
      imgName: options.prefix + '-sprite.png',
      cssName: '_sprite-' + options.prefix + '.scss',
      padding: 4,
      imgPath: '..' + options.img_root + options.prefix + '-sprite.png',
      cssOpts: {functions: false, variableNameTransforms: [], prefix: options.prefix + '-map', usejpg: use_jpg},
      cssSpritesheetName: 'spritesheet',
      cssVarMap: function (sprite) {
        sprite.name = sprite.name;
      },
      cssTemplate: './gulp/scss_maps.template.handlebars'
    }));
    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img;
    if (use_jpg === false) {
      imgStream.pipe(gulp.dest(options.dist_img)).on('finish', function () {
        //console.log("!!! IMAGES DONE");
        imagesDone = true;
      });
    } else {
      // change file name and write png
      imgStream.pipe(rename(function (path) {
          return path.replace(options.prefix, "__" + options.prefix);
        }))
        .pipe(gulp.dest(options.dist_img_source))
        // change file name back and write jpg
        .pipe(rename(function (path) {
          return path.replace('__', '');
        }))
        .pipe(buffer())
        .pipe(jimp({
          '': {
            type: 'jpg',
            quality: options.quality,
            bgColor:options.bgColor
          }
        }))
        .pipe(gulp.dest(options.dist_img))
        .on('finish', function () {
          //console.log("!!! IMAGES DONE");
          imagesDone = true;
        });
    }
    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
      .pipe(gulp.dest(options.dist_css))
      .on('finish', function () {
        //console.log("!!! CSS DONE");
        cssDone = true
      });
    // Return a merged stream to handle both `end` events
    return new Promise(function (resolve, reject) {
      var endIt = function () {
        resolve();
      };
      merge(imgStream, cssStream)
        .pipe(bs.stream())
        .on('finish', function () {
          if (cssDone === true && imagesDone === true) {
            endIt()
          } else {
            inter = setInterval(function () {
              //console.log('test ', cssDone, imagesDone, options.prefix);
              if (cssDone === true && imagesDone === true) {
                clearInterval(inter);
                endIt()
              }
            }, 250)
          }
        })
    })
  };
};
