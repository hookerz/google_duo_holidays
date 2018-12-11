/**
 * Deletes specified directory.
 * @tasks/clean
 */
'use strict';
let del = require('del');
let _ = require('lodash');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to delete.
 * @returns {Function}
 */
module.exports = function (gulp, options) {
  let directives = require('../../compiler-directives');
  return function (done) {
    if (directives.isStandard === true) {
      if (directives.template !== "FT") {
        options.src = _.concat(options.src, options.ft_add);
      }
      del.sync(options.src, {
        force: true
      });
    } else {
      del.sync(options.rm_alt, {
        force: true
      });
    }
    done();
  };
};

