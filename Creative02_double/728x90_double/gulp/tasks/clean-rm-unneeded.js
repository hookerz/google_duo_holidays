/**
 * Deletes specified directory.
 * @tasks/clean
 */
'use strict';
let del = require('del');
let _ = require('lodash');
let rimraf = require ('rimraf');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to delete.
 * @returns {Function}
 */
module.exports = function (gulp, options) {
  let directives = require('../../compiler-directives');
  return function (done) {

    _.forEach (options.src,(value)=>{
      
      rimraf.sync (value,{glob:false})
      
    });
    
    done();
  };
};

