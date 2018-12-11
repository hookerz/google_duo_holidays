"use strict";
console.log('hello world');
let preloadStack = [];
// needed for promise support in IE 11
// @if polyfill=true
import './polyfill'
// @endif
import {config, setup, adKit, getRichBase} from './hook-ad-kit/config';
import {getBaseURL} from './hook-ad-kit/Util'
import {cssUpdate} from './hook-ad-kit/loading';
// @if useDynamicPreviewer=true
import dynamicLoad from "./hook-ad-kit/dynamic"
preloadStack.push(dynamicLoad);
// @endif
// @if isStandard=true
// @include app/templates/header/standard.txt
// @endif
// @if isStandard=false
// @if isExpando=false
// @include app/templates/header/inPage.txt
// @endif
//
// @if isExpando=true
// @if isAutoExpand=true
// @include app/templates/header/auto-expand.txt
// @endif
// @if isAutoExpand=false
// @include app/templates/header/user-expand.txt
// @endif
// @endif
// @endif
function prep() {
  config.richBaseURL = getRichBase(getBaseURL());
  cssUpdate(config.richBaseURL)
}
function preloaderPrep() {
// @if isStandard=true
// @include app/templates/preloaderPrep/standard.txt
// @endif
// @if isStandard=false
  // @if isExpando=false
  // @include app/templates/preloaderPrep/inPage.txt
  // @endif
  //
  // @if isExpando=true
  // @if isAutoExpand=true
  // @include app/templates/preloaderPrep/auto-expand.txt
  // @endif
  // @if isAutoExpand=false
  // @include app/templates/preloaderPrep/user-expand.txt
  // @endif
  // @endif
// @endif
}
function init() {
  console.log('init');
  return adKit.boot()
    .then(setup)
    .then(preloaderPrep)
    .then(prep)
    .then(preload)
    .then(run)
}
// this is a global preload for anything not needed by an individual panel
function preload() {
  return Promise.all(preloadStack)
}
function run() {
  
  // @if type='dev'
  // @if isStandard=true
  GSDevTools.create({paused: false, hideGlobalTimeline: true, animation: 'StandardRootTimeline'});
  // @endif
  // @endif
// @if isStandard=true
// @include app/templates/run/standard.txt
// @endif
//
// @if isStandard=false
  // @if isExpando=false
  // @include app/templates/run/inPage.txt
  // @endif
  //
  // @if isExpando=true
  // @if isAutoExpand=true
  // @include app/templates/run/auto-expand.txt
  // @endif
  // @if isAutoExpand=false
  // @include app/templates/run/user-expand.txt
  // @endif
  // @endif
// @endif
}
init();
