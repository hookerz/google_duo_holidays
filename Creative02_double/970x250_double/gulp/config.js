'use strict';
var dest = './dist';
var path = require('path');

let directives = require ('../compiler-directives');
var config = {
  flags: {
    minify: false,
    sourcemap: true,
    type: 'dev'
  },
  clean: {
    src: dest + '/**/*'
  },
  clean_std:{
    src:[
      dest + '/**/auto-expanded.html',
      dest + '/**/collapsed.html',
      dest + '/**/expanded.html',
      dest + '/**/standard.html',
      dest + '**/_assets/**',
      dest + '/**/auto-expanded-background-sprite.jpg',
      dest + '/**/auto-expanded-foreground-sprite.png',
      dest + '/**/collapsed-background-sprite.jpg',
      dest + '/**/collapsed-foreground-sprite.png',
      dest + '/**/expanded-background-sprite.jpg',
      dest + '/**/expanded-foreground-sprite.png',
      dest + '/**/__standard-background-sprite.png',
      dest + '/**/__expanded-background-sprite.png',
      dest + '/**/__collapsed-background-sprite.png',
      dest + '/**/__auto-expanded-background-sprite.png'
    ],
    rm_alt:[
      dest + '/**/standard.html',
      dest + '/**/standard-background-sprite.jpg',
      dest + '/**/standard-foreground-sprite.png'
    ],
    ft_add:[
      dest + '**/manifest.js',
    ]
    
  
  },
  clean_rm_unneeded:{
    
    src:[
      './app/Panels/AutoExpand',
      './app/Panels/Collapsed',
      './app/Panels/Expand',
      './app/Panels/ExpandedPreloader',
      './app/Panels/CollapsedPreloader',
      './app/Presentations/AutoExpand.js',
      './app/Presentations/Expand.js',
      './app/Presentations/InPage.js',
      './sass/_collapsed-panel.scss',
      './sass/_expanded-panel.scss',
      './sass/_preloaders.scss',
      './sass/spritesheets/_sprite-auto-expanded-background.scss',
      './sass/spritesheets/_sprite-auto-expanded-foreground.scss',
      './sass/spritesheets/_sprite-collapsed-background.scss',
      './sass/spritesheets/_sprite-collapsed-foreground.scss',
      './sass/spritesheets/_sprite-expanded-background.scss',
      './sass/spritesheets/_sprite-expanded-foreground.scss',
      './static/html/auto-expanded.html',
      './static/html/collapsed.html',
      './static/html/expanded.html',
      './static/toSprite/auto_expanded',
      './static/toSprite/collapsed',
      './static/toSprite/expanded',

    ]
    
    
  },
  styles: {
    src: './styles/**/*',
    entry: './styles/index.styl',
    dist: dest + '/css/'
  },
  html: {
    src:[
      './static/html/**/!(*.fla|*.md|*.js|*.jpg|*.png)',
      '!./static/html/templates/**/*',
      '!./static/html/templates'
    
    ],
    entry: './static/html/index.html',
    dist: dest
  },
  svg:{
  
    src: './svgs/**/*.*',
  },
  ft_manifest: {
      src: './static/html/manifest.js',
      entry: './static/html/index.html',
      dist: dest
    },

  sass: {
    src: './sass/**/*.scss',
    watch_src: ['./sass/**/*.scss', '!./sass/spritesheets/**/*.scss'],
    image_src: './static/toSprite/**/*.{gif,jpg,png,svg}',
    dist: dest + '/css/'
  },
  images: {
    src: './static/images/**/*.{gif,jpg,png,svg}',
    dist: dest + '/images/'
  },
  videos: {
    src: './static/videos/**/*.{ogg,mp4,webm}',
    dist: dest + '/videos/'
  },
  sprite: {
    collapsed_foreground: {
      src: './static/toSprite/collapsed/foreground/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'collapsed-foreground',
      jpg_conversion: false,
      quality: directives.standardOptions.compression,
      bgColor:directives.standardOptions.spriteBackgroundColor
    },
    collapsed_background: {
      src: './static/toSprite/collapsed/background/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'collapsed-background',
      jpg_conversion: true,
      quality: directives.standardOptions.compression,
      bgColor:directives.standardOptions.spriteBackgroundColor
    },
    standard_foreground: {
      src: './static/toSprite/standard/foreground/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'standard-foreground',
      jpg_conversion: false,
      quality: directives.standardOptions.compression,
      bgColor:directives.standardOptions.spriteBackgroundColor
    },
    standard_background: {
      src: './static/toSprite/standard/background/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'standard-background',
      jpg_conversion: true,
      quality: directives.standardOptions.compression,
      bgColor:directives.standardOptions.spriteBackgroundColor
    },
    expanded_foreground: {
      src: './static/toSprite/expanded/foreground/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'expanded-foreground',
      jpg_conversion: false,
      quality: directives.standardOptions.compression,
      bgColor:directives.standardOptions.spriteBackgroundColor
    },
    expanded_background: {
      src: './static/toSprite/expanded/background/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'expanded-background',
      jpg_conversion: true,
      quality: directives.standardOptions.compression,
      bgColor:directives.standardOptions.spriteBackgroundColor
    },
    auto_expanded_foreground: {
      src: './static/toSprite/auto_expanded/foreground/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'auto-expanded-foreground',
      jpg_conversion: false,
      quality: directives.standardOptions.compression,
      bgColor:directives.standardOptions.spriteBackgroundColor
    },
    auto_expanded_background: {
      src: './static/toSprite/auto_expanded/background/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'auto-expanded-background',
      jpg_conversion: true,
      quality: directives.standardOptions.compression,
      bgColor:directives.standardOptions.spriteBackgroundColor
    }
  },
  scripts: {
    app: {
      src: './app/**/*.js',
      entry: './app/App.js'
    },
    dist: dest + '/js/'
  },
  
  rollup:{
    html:'./static/html/*.html',
    src:'./app/App.js',
    hack:'./app',
    hackFile:'./app/main.build.js',
    dist: dest + '/js'
    
  },
  
  vendor: {
    src: './vendor/**/*.js',
    dist: dest + '/vendor'
  },
  optimize: {
    css: {
      src: dest + '/**/*.css'
    },
    js: {
      src: [dest + '/**/main.build.js', '!' + dest + '/**/*manifest.js']
    },
    html: {
      src: dest + '/**/*.html'
    },
    sprite_image:{
      src: [
        path.join(dest, '/**/*-sprite.png'),
        path.join(dest,  '/**/*-sprite.jpg')
      ]
      
    },
    
    
    dist: dest
  },
  rename_backup: {
    src: path.join('./static/html', '/*.jpg'),
    dist: path.join(dest)
  },
  manifest_std:{
    src: path.join('./static/html/templates/standard/manifest.js'),
    dist: path.join(dest)
    
  },
  
  
  bundle: {
    standard:{
      src: [
        dest + '/**/*.*',
        '!' + dest + '/**/manifest.js',
        '!' + dest + '/**/__*.png',
        '!' + dest + '/**/.*',
          '!' + dest + '/*.jpg',// exclude static by default
          '!' + dest + '/*.png'// exclude static by default
      
      ],
      dist: dest,
      name: 'banner.zip'
    
    },
    dc: {
      src: [dest + '/**/*.*', '!' + dest + '/**/manifest.js', '!' + dest + '/**/__*.png', '!' + dest + '/**/.*'],
      dist: dest,
      name: 'banner.zip'
    },
    ft: {
      base: {
        src: [
          dest + '/**/*.js',
          dest + '/**/*.css',
          '!' + dest + '/**/.*',
          dest + '/index.html'
        ]
      },
      rich: {
        src: [
          dest + '/**/*.{gif,jpg,png,svg}',
          '!' + dest + '/**/.*',
          '!' + dest + '/**/__*.png',
          '!' + dest + '/*.{gif,jpg,png,svg}',
          dest + '/*.html'
        ]
      },
      dist: dest
    }
  },
  test: {
    src: path.join('./', 'test-definitions.js')
  },
  server: {
    root: dest,
    port: 8080
  }
};
module.exports = config;