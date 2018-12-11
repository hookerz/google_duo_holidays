'use strict';
// vars
var gulp = require('gulp');
var config = require('./config');
var bs = require('browser-sync').create();
var argv = require('minimist')(process.argv.slice(2));
var nconf = require('nconf');
var path = require('path');
var os = require('os');
var fs = require('fs');
console.log('vars');
console.log(argv);
var opts = {
  tinypngkey: null
};
nconf.env()
  .file({file: path.join(path.resolve(os.homedir()), 'display-standard-previewer-config.json')});
opts.tinypngkey = nconf.get('tinypngkey');
// two more states to minify code and create sourcemaps. The default is for local development.
gulp.task('dev', function (done) {
  config.flags.minify = false;
  config.flags.sourcemap = true;
  config.flags.type = 'dev';
  done();
});
gulp.task('prod', function (done) {

//test
  config.flags.minify = true;
  config.flags.sourcemap = false;
  config.flags.type = 'prod';
  done();
});
// define stackable tasks
gulp.task('clean', require('./tasks/clean')(gulp, config.clean));
gulp.task('clean-std', require('./tasks/clean-std')(gulp, config.clean_std));
gulp.task('wipe-rm', require('./tasks/clean-rm-unneeded')(gulp, config.clean_rm_unneeded));
gulp.task('html', require('./tasks/html')(gulp, bs, config.html, config.flags));
gulp.task('ft-manifest', require('./tasks/ft-manifest')(gulp, bs, config.ft_manifest, config.flags));
gulp.task('sass', require('./tasks/lib-sass')(gulp, bs, config.sass, config.flags));
gulp.task('images', require('./tasks/images')(gulp, bs, config.images, null, null));
gulp.task('videos', require('./tasks/videos')(gulp, bs, config.videos));
gulp.task('sprite-collapsed-foreground', require('./tasks/sprite-images')(gulp, bs, config.sprite.collapsed_foreground, config.flags));
gulp.task('sprite-collapsed-background', require('./tasks/sprite-images')(gulp, bs, config.sprite.collapsed_background, config.flags));
gulp.task('sprite-standard-foreground', require('./tasks/sprite-images')(gulp, bs, config.sprite.standard_foreground, config.flags));
gulp.task('sprite-standard-background', require('./tasks/sprite-images')(gulp, bs, config.sprite.standard_background, config.flags));
gulp.task('sprite-expanded-foreground', require('./tasks/sprite-images')(gulp, bs, config.sprite.expanded_foreground, config.flags));
gulp.task('sprite-expanded-background', require('./tasks/sprite-images')(gulp, bs, config.sprite.expanded_background, config.flags));
gulp.task('sprite-auto-expanded-foreground', require('./tasks/sprite-images')(gulp, bs, config.sprite.auto_expanded_foreground, config.flags));
gulp.task('sprite-auto-expanded-background', require('./tasks/sprite-images')(gulp, bs, config.sprite.auto_expanded_background, config.flags));
gulp.task('sprite-all', gulp.parallel('sprite-standard-foreground', 'sprite-standard-background','sprite-collapsed-foreground', 'sprite-collapsed-background', 'sprite-expanded-foreground', 'sprite-expanded-background', 'sprite-auto-expanded-foreground', 'sprite-auto-expanded-background'));
//gulp.task('sprite-convert', require('./tasks/sprite-convert')(gulp, config.sprite.optimize, config.flags));
gulp.task('scripts-app', require('./tasks/scripts-app')(gulp, bs, config.scripts, config.flags));
gulp.task('rollup', require('./tasks/rollup')(gulp, bs, config.rollup, config.flags));
// dev build specific tasks
gulp.task('scripts-vendor-dev', require('./tasks/scripts-vendor-dev')(gulp, bs, config.vendor, config.flags));
//Prod specifc tasks
gulp.task('scripts-vendor', require('./tasks/scripts-vendor')(gulp, bs, config.html, config.flags));
gulp.task('optimize-css', require('./tasks/optimize-css')(gulp, config.optimize, config.flags));
gulp.task('optimize-js', require('./tasks/optimize-js')(gulp, config.optimize, config.flags));
gulp.task('optimize-html', require('./tasks/optimize-html')(gulp, config.optimize, config.flags));
gulp.task('optimize-sprite-image', require('./tasks/optimize-sprite-image')(gulp, config.optimize, config.flags, opts.tinypngkey));
gulp.task('optimize-images', require('./tasks/images')(gulp, bs, config.images, config.flags, opts.tinypngkey));
gulp.task('rename-standard', require('./tasks/rename-standard')(gulp, bs, config.rename_backup, config.flags));
gulp.task('bundle-dc-int', require('./tasks/bundle-dc')(gulp, config.bundle.dc, config.flags));
gulp.task('bundle-ft-int', require('./tasks/bundle-ft')(gulp, config.bundle.ft, config.flags));
gulp.task('bundle-std-int', require('./tasks/bundle-standard')(gulp, config.bundle.standard, config.flags));
gulp.task('manifest-std', require('./tasks/manifest-std')(gulp, bs, config.manifest_std, config.flags));
gulp.task('test', require('./tasks/test')(gulp, config.test));
gulp.task('set-key', function (done) {
  nconf.set('tinypngkey', argv['key']);
  nconf.save(function (err) {
    fs.readFile(path.join(path.resolve(os.homedir()), 'display-standard-previewer-config.json'), function (err, data) {
      console.dir(JSON.parse(data.toString()));
      done()
    });
  });
})
// define watch actions
gulp.task('watch', function (done) {
  bs.init({
    server: {
      baseDir: config.server.root
    },
    online: false,
    port: config.server.port,
    reloadDelay: 1000,
    reloadDebounce: 1000,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  });
  gulp.watch(config.videos.src, gulp.series('videos','clean-std'));
  gulp.watch(config.images.src, gulp.series('images','clean-std'));
  gulp.watch(config.scripts.app.src, gulp.series('scripts-app','clean-std'));
  gulp.watch(config.html.src, gulp.series('html','clean-std'));
  gulp.watch(config.ft_manifest.src, gulp.series('ft-manifest','clean-std'));
  gulp.watch(config.sass.watch_src, gulp.series('sass','clean-std')); // only watch files not associated with spritesheets
  // generate new sass partials for spritesheets when images edited
  gulp.watch(config.sprite.standard_foreground.src, gulp.series('sprite-standard-foreground','clean-std'));
  gulp.watch(config.sprite.standard_background.src, gulp.series('sprite-standard-background','clean-std'));
  gulp.watch(config.sprite.collapsed_foreground.src, gulp.series('sprite-collapsed-foreground','clean-std'));
  gulp.watch(config.sprite.collapsed_background.src, gulp.series('sprite-collapsed-background','clean-std'));
  gulp.watch(config.sprite.expanded_foreground.src, gulp.series('sprite-expanded-foreground','clean-std'));
  gulp.watch(config.sprite.expanded_background.src, gulp.series('sprite-expanded-background','clean-std'));
  gulp.watch(config.sprite.auto_expanded_foreground.src, gulp.series('sprite-auto-expanded-foreground','clean-std'));
  gulp.watch(config.sprite.auto_expanded_background.src, gulp.series('sprite-auto-expanded-background','clean-std'));
  gulp.watch(config.svg.src, gulp.series('html'));
  if (config.flags.type === "dev") {
    gulp.watch(config.vendor.src, gulp.series('scripts-vendor-dev','clean-std'));
  }
  if (config.flags.type === "prod") {
    gulp.watch([config.html.entry, config.vendor.src], gulp.series('scripts-vendor','clean-std'));
  }
  done();
});
gulp.task('build-dev', gulp.series('dev', 'clean', gulp.parallel('html', 'ft-manifest', 'scripts-vendor-dev', 'scripts-app', 'images', 'videos', gulp.series('sprite-all', 'sass', 'rename-standard')),'clean-std','manifest-std'));
gulp.task('build-prod-part-one', gulp.parallel('html', 'ft-manifest', 'scripts-vendor', 'scripts-app', 'images', 'videos', gulp.series('sprite-all', 'sass', 'rename-standard')));
gulp.task('build-prod-part-two', gulp.series ( gulp.parallel('optimize-css', 'optimize-js', 'optimize-html', 'optimize-sprite-image'), gulp.series('optimize-images')));
gulp.task('build-prod', gulp.series('prod', 'clean', 'build-prod-part-one','clean-std','manifest-std'));
gulp.task('build-prod-optimize', gulp.series('prod', 'clean', 'build-prod-part-one', 'build-prod-part-two','clean-std','manifest-std'));
gulp.task('watch-dev', gulp.series('dev', 'build-dev','clean-std', 'watch'));
gulp.task('watch-prod', gulp.series('prod', 'build-prod','clean-std', 'watch'));
gulp.task('tinypng', gulp.series('optimize-sprite-image'));
gulp.task('default', gulp.series('watch-dev'));

gulp.task('bundle-dc', gulp.series ('bundle-dc-int','test'));
gulp.task('bundle-ft', gulp.series ('bundle-ft-int','test'));
gulp.task('bundle-std', gulp.series ('bundle-std-int','test'));
