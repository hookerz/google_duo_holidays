/**
 * Merges all ( non LIB ) javascript files into one js file using browserify.
 * @tasks/scripts-app
 */


'use strict';
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('rollup-plugin-babel');
const rollup = require('gulp-better-rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const preprocess = require('gulp-preprocess');
const html = require('rollup-plugin-html');
const intercept = require('gulp-intercept');
const del = require('del');
const identityMap = require('@gulp-sourcemaps/identity-map');
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
    return gulp.src(options.src)
      .pipe(preprocess({context: require('../../compiler-directives')}, {type: 'js'})).on('error', onError)
      /* .pipe(intercept(function (file) {
         console.log('FILE: ' + file.path);
         console.log('OLD CONTENT: ' + file.contents.toString());
       }))*/
      .pipe(rename('main.build.js'))
      .pipe(gulp.dest(options.hack))
      .pipe(sourcemaps.init())
      
      .pipe(rollup({
        entry: options.hackFile,
        plugins: [
          html({
            include: options.html, htmlMinifierOptions: {
              collapseWhitespace: true,
              collapseBooleanAttributes: true,
              conservativeCollapse: true,
              minifyJS: true
            }
          }),
          resolve({browser: true}),
         // commonjs(),
          babel({
            exclude: ['node_modules/**', 'dist/**', 'vendor/**'],
            presets: ['es2015-rollup']
          }),
        ],
      }, {format: 'iife'  })).on('error', onError)
      .pipe(gulpif(flags.sourcemap === true, sourcemaps.write()))
      .pipe(rename('main.build.js'))
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream())
      .on('finish', function () {
        del.sync(options.hackFile);
      })
  };
};

