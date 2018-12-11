"use strict";
let fs = require('fs-extra');
let cheerio = require('cheerio');
let path = require('path');
let glob = require('glob-promise');
let _ = require('lodash');
let imageSize = require('image-size');
let yauzl = require("yauzl");
let root = process.cwd();
let gutil = require('gulp-util');
let directives = require('./compiler-directives');
let dist = path.join(root, 'dist');
let bannerName = '';
let pathArr = path.resolve(root);
let jsScanPath = path.join(root, 'dist', 'js', 'main.build.js');
pathArr = pathArr.split(path.sep);
bannerName = pathArr[pathArr.length - 1];
let htmlPath = path.join(dist, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
let cssPath = path.join(dist, 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');
let combinedJS = fs.readFileSync(jsScanPath, 'utf8');
let $ = cheerio.load(html);
function assetList(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = assetList(path.join(dir, file), filelist);
    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
}
if (directives.isStandard) {
  describe('bundle size', function () {
    let intendedfileSize = directives.standardOptions.fileSize;
    it('should be smaller than ' + intendedfileSize + 'k' + ' Static Not Counted in .zip weight', function () {
      let zip = fs.statSync(path.join(dist, bannerName + '.zip'));
      let fileSize = zip['size'] / 1000;
      let location = directives.standardOptions.staticLocation[directives.template];
      let staticPath = null;
      if (location === 'in.img') {
        staticPath = path.join(dist, 'img', 'static' + '.jpg');
      } else if (location === 'in.zip') {
        staticPath = path.join(dist, bannerName + '.jpg');
      } else if (location === 'in.folder') {
        staticPath = path.join(dist, bannerName + '.jpg');
      }
      if (location !== 'in.folder') {
        let staticStats = fs.statSync(staticPath);
        let staticFileSize = staticStats['size'] / 1000;
        fileSize = fileSize - staticFileSize
      }
      expect(fileSize).not.toBeGreaterThan(intendedfileSize);
    });
  });
}
if (directives.isStandard) {
  describe('static location', function () {
    let location = directives.standardOptions.staticLocation[directives.template];
    it('should be located ' + location, function (done) {
      let isInZip = false;
      let onEnd = function () {
        expect(isInZip).toEqual(true);
        done()
      };
      if (location === 'in.zip') {
        yauzl.open(path.join(dist, bannerName + '.zip'), {lazyEntries: true}, function (err, zipfile) {
          if (err) throw err;
          zipfile.readEntry();
          zipfile.on("end", onEnd);
          zipfile.on("entry", function (entry) {
            //console.log('!!!!!', entry.fileName);
            if (entry.fileName === bannerName + '.jpg') {
              isInZip = true;
            }
            zipfile.readEntry();
          });
        });
      } else if (location === 'in.folder') {
        let isInFolder = false;
        try {
          let stats = fs.statSync(path.join(dist, bannerName + '.jpg'));
          isInFolder = true;
        }
        catch (e) {
        }
        expect(isInFolder).toEqual(true);
        done()
      }
      /*
      else if (location === 'in.img') {
        let isInFolder = false;
        try {
          let stats = fs.statSync(path.join(dist, 'img', 'static' + '.jpg'));
          isInFolder = true;
        }
        catch (e) {
        }
        expect(isInFolder).toEqual(true);
        done()
      }*/
      //
    });
  });
}
if (directives.isStandard) {
  describe('static size', function () {
    let intendedfileSize = directives.standardOptions.staticFileSize;
    it('should be smaller than ' + intendedfileSize + 'k', function () {
      let location = directives.standardOptions.staticLocation[directives.template];
      let staticPath = null;
      if (location === 'in.img') {
        staticPath = path.join(dist, 'img', 'static' + '.jpg');
      } else if (location === 'in.zip') {
        staticPath = path.join(dist, bannerName + '.jpg');
      } else if (location === 'in.folder') {
        staticPath = path.join(dist, bannerName + '.jpg');
      }
      let staticStats = fs.statSync(staticPath);
      let staticFileSize = staticStats['size'] / 1000;
      expect(staticFileSize).not.toBeGreaterThan(intendedfileSize);
    })
  });
}
if (directives.isStandard) {
  describe('static image', function () {
    let width = directives.collapsedWidth;
    let height = directives.collapsedHeight;
    it('should match dimensions of the creative (' + width + 'x' + height + ')', function () {
      let location = directives.standardOptions.staticLocation[directives.template];
      let dimensions = null;
      if (location === 'in.img') {
        dimensions = imageSize(path.join(dist, 'img', 'static' + '.jpg'));
      } else {
        dimensions = imageSize(path.join(dist, bannerName + '.jpg'));
      }
      expect(dimensions.width).toEqual(width);
      expect(dimensions.height).toEqual(height);
    });
  });
}
describe('Spritesheet PNGs', function () {
  it('should have dimensions that are a multiple of 4', function () {
    let pngDir = path.join(root, 'static', 'toSprite');
    let images = assetList(pngDir).filter(function (e) {
      return e.indexOf('.png') !== -1
    });
    let badImages = images.filter(function (e) {
      let dimensions = imageSize(e);
      if (dimensions.width % 4 !== 0 || dimensions.height % 4 !== 0) {
        let goodW = Math.ceil(dimensions.width / 4) * 4;
        let goodH = Math.ceil(dimensions.height / 4) * 4;
        console.log('!!    wrong dimensions:', e);
        console.log('!!    is: ' + dimensions.width + 'x' + dimensions.height);
        console.log('!!    should be: ' + goodW + 'x' + goodH);
        return true;
      }
    });
    expect(badImages.length).toEqual(0);
  });
});
describe('svg ID test', function () {
  let src = path.join(root, 'svgs', '/**/*.svg');
  let allClasses = [];
  it('no SVG IDs should be duplicates must be GLOBAL UNIQUE ', function () {
    let files = glob.sync(src);
    //console.log ("!!! files",files)
    files.forEach(function (file) {
      
      // inventory of all styles in each file
      let inventory = {};
      inventory.file = file;
      let content = fs.readFileSync(file, 'utf8');
      let matches = [];
      try {
        matches = content.match(/id\=\"(.*?)\"/g);
      } catch (err) {
      }
      let trimmed = [];
      try {
        
        //console.log ("!!! matches",matches)
        matches.forEach(function (match) {
          trimmed.push(match.replace('.', '').replace('{', ''))
        });
      } catch (err) {
        // console.error('no ID in this svg but that is ok', file, matches, err.message)
      }
      inventory.classMatches = trimmed;
      allClasses.push(inventory);
    });
    let classCollection = [];
    allClasses.forEach(function (inventory) {
      classCollection = _.concat(classCollection, inventory.classMatches);
    });
    let duplicates = _.filter(classCollection, function (value, index, iteratee) {
      return _.includes(iteratee, value, index + 1);
    });
    duplicates = duplicates.sort();
    console.log('!!dupes', duplicates.length);
    duplicates.forEach(function (dupe) {
      console.warn('!! SVG IDs DUPLICATE ERROR', dupe);
      allClasses.forEach(function (svg) {
        svg.classMatches.forEach(function (cssClass) {
          if (cssClass === dupe) {
            console.warn('\x1b[33m%s\x1b[0m', 'Appears In ' + path.relative(root, svg.file));
          }
        })
      })
    })
    expect(duplicates.length).toEqual(0);
  })
});
describe('svg css test', function () {
  let src = path.join(root, 'svgs', '/**/*.svg');
  let allClasses = [];
  it('no SVG CSS classes should be duplicates must be GLOBAL UNIQUE ', function () {
    let files = glob.sync(src);
    files.forEach(function (file) {
      
      // inventory of all styles in each file
      let inventory = {};
      inventory.file = file;
      let content = fs.readFileSync(file, 'utf8');
      let matches = [];
      try {
        let style = content.split('<style type="text/css">')[1].split('</style>')[0];
        matches = style.match(/\.(.*?){/g);
      } catch (err) {
      }
      let trimmed = [];
      matches.forEach(function (match) {
        trimmed.push(match.replace('.', '').replace('{', ''))
      });
      inventory.classMatches = trimmed;
      allClasses.push(inventory);
    });
    let classCollection = [];
    allClasses.forEach(function (inventory) {
      classCollection = _.concat(classCollection, inventory.classMatches);
    });
    let duplicates = _.filter(classCollection, function (value, index, iteratee) {
      return _.includes(iteratee, value, index + 1);
    });
    duplicates = duplicates.sort();
    duplicates.forEach(function (dupe) {
      console.warn('!! SVG CSS CLASS DUPLICATE ERROR', dupe);
      allClasses.forEach(function (svg) {
        svg.classMatches.forEach(function (cssClass) {
          if (cssClass === dupe) {
            console.warn('\x1b[31m%s\x1b[0m', 'Appears In ' + path.relative(root, svg.file));
          }
        })
      })
    })
    expect(duplicates.length).toEqual(0);
  })
});
if (directives.isStandard) {

// assets test
  describe('assets', function () {
    
    //html build and imgs
    let assets = assetList(dist + '/');
    function assetList(dir, filelist) {
      let files = fs.readdirSync(dir);
      filelist = filelist || [];
      files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
          filelist = assetList(path.join(dir, file), filelist);
        }
        else {
          filelist.push(file);
        }
      });
      return filelist;
    }
    function extraAssetCheck() {
      let missingReference = false;
      for (let i = 0; i < assets.length; i++) {
        let asset = assets[i];
        let combined = html + combinedJS + css;
        let referenceCount = count(combined, asset);
        if (referenceCount < 1 && asset !== '.DS_Store' && asset !== bannerName + '.jpg' && asset !== bannerName + '.zip' && asset !== 'index.html') {
          //notifies the user in the console which assets are not used
          if (directives.template === "FT" && asset === "manifest.js") {
          } else {
            console.log('!!    unused asset:', assets[i]);
            missingReference = true;
          }
        }
      }
      return (missingReference === false)
    }
    function missingAssetCheck() {
      let missingAsset = false;
      let images = [];
      let imagePaths = [];
      // get all images from css
      let regex = /url\s*\(['|"]*([\s\S]*?)["|']*\)/gm;
      let matches = 0;
      try {
        matches = css.match(regex).length;
      } catch (err) {
        console.log('!!!! no images css', matches)
        matches = 0;
      }
      while (matches--) {
        let match = regex.exec(css)[1];
        let isImage = match.indexOf('.gif') > -1 || match.indexOf('.jpg') > -1 || match.indexOf('.png') > -1 || match.indexOf('.svg') > -1;
        if (isImage) {
          imagePaths.push(match);
          match = path.join(dist, match.replace('../', './'));
          images.push(match);
        }
      }
      regex = / src=['|"]*([\s\S]*?)["|']*(>|\/>|\s)/gm;
      try {
        matches = html.match(regex).length;
      } catch (err) {
        console.log('!!!! no images HTML', matches)
        matches = 0;
      }
      while (matches--) {
        let match = regex.exec(html)[1];
        let isImage = match.indexOf('.gif') > -1 || match.indexOf('.jpg') > -1 || match.indexOf('.png') > -1 || match.indexOf('.svg') > -1;
        if (isImage) {
          imagePaths.push(match);
          match = path.join(dist, match.replace('../', './'));
          images.push(match);
        }
      }
      // get all source references
      regex = / src=['|"]*([\s\S]*?)["|']*(>|\/>|\s)/gm;
      matches = html.match(regex).length;
      while (matches--) {
        let match = regex.exec(html)[1];
        let isImage = match.indexOf('.gif') > -1 || match.indexOf('.jpg') > -1 || match.indexOf('.png') > -1 || match.indexOf('.svg') > -1;
        if (isImage) {
          imagePaths.push(match);
          match = path.join(dist, match.replace('../', './'));
          images.push(match);
        }
      }
      // console.log("!!!!!!!!!!!!", images, imagePaths);
      images = images.filter(function (elem, index, self) { // remove duplicates
        return index === self.indexOf(elem);
      });
      imagePaths = imagePaths.filter(function (elem, index, self) { // remove duplicates
        return index === self.indexOf(elem);
      });
      for (let i in images) {
        let image = images[i];
        let exists = fs.existsSync(image);
        if (exists === false) {
          console.log('\x1b[31m%s\x1b[0m', '!!    missing asset is referenced in HTML or CSS but not in the bundle:');
          console.log('\x1b[31m%s\x1b[0m', String(imagePaths[i]));
          missingAsset = true;
        }
      }
      return (missingAsset === false)
    }
    //counts the frequency of asset used in compiled html or css
    function count(str, subStr) {
      let matches = str.match(new RegExp(subStr, 'g'));
      try {
        return matches ? matches.length : 0;
      } catch (err) {
        return 0;
      }
    }

    //counts the frequency of asset used in compiled html or css
    function httpCount(str, subStr) {
      let matches = str.match(new RegExp(subStr, 'g'));

      let svgOne =str.match(new RegExp(/xmlns="http:\/\/www.w3.org\/2000\/svg"/, 'g'));
      let svgTwo = str.match(new RegExp(/xmlns:xlink="http:\/\/www.w3.org\/1999\/xlink"/, 'g'));

      try {
        
        let oneCount = 0;
        let twoCount = 0;

        if (svgOne!== null) {
          oneCount = svgOne.length;

        }
        if (svgTwo!== null) {
          twoCount = svgTwo.length;
          
        }

        //console.log (svgOne, svgTwo)

        let finalCount = 0;

        if (matches!==null) {
          finalCount = matches.length;
        }else {
          return 0;
        }

        console.log ("!!!! http:// reference count",finalCount,oneCount,twoCount);

        if (oneCount>0 ) {

          finalCount -= oneCount

        }
        if (twoCount>0 ) {

          finalCount -= twoCount

        }
        return finalCount
        
      } catch (err) {

        console.error ("!!!! http svg test error",err);

        return 0;
      }
    }

    it('should have no unused assets', function () {
      expect(extraAssetCheck()).not.toEqual(false);
    });
    it('should have no missing assets', function () {
      expect(missingAssetCheck()).not.toEqual(false);
    });
    it('should have no more than 15 assets', function () {
      expect(assets.length).toBeLessThan(directives.standardOptions.numFiles);
    });
    it('should have no http calls', function () {
      expect(httpCount(html, 'http://')).toEqual(0);
    });
  });
}