"use strict";
import {config} from '../../hook-ad-kit/config';
import {patchURL, loadContent} from '../../hook-ad-kit/loading'
import {animateIn} from './Animation';
import {prependChild} from '../../hook-ad-kit/Util'
import {EventEmitter} from 'events';
export default function () {
  console.log("!!!!!!!!!!!!!!!!!!! STANDARD");
  let url = patchURL('./standard.html', config.richBaseURL);
  let adRoot = document.querySelector('#adRoot');
  let container = null;
  let content = null;
  let ee = new EventEmitter();
  let api = {};
  function catchAllHandler() {
    // internal cleanup here
    ee.emit('catchall');
  }
  function ctaHandler() {
    // internal cleanup here
    ee.emit('cta');
  }
  function bind() {
    Array.from(container.querySelectorAll('.catch-all')).forEach(function (item) {
      item.addEventListener('click', catchAllHandler);
    });
    Array.from(container.querySelectorAll('.cta')).forEach(function (item) {
      item.addEventListener('click', ctaHandler);
    });
  }
  function prepareContainer() {
    container = document.createElement("div");
    container.setAttribute('id', 'content');
    prependChild(adRoot, container)
  }
  api.preload = function () {
    return new Promise(function (resolve, reject) {
      container = document.querySelector('.content');
      resolve();
    })
    /*
    return new Promise(function (resolve, reject) {
      console.log('PRELOAD');
      prepareContainer();
      loadContent(url, container, config.richBaseURL)
        .then(function () {
          content = container.querySelector('.content');
        })
        .then(resolve);
    });*/
  };
  api.init = function () {
    return new Promise(function (resolve, reject) {
      console.log('INIT');
      bind();
      animateIn();
      resolve();
    })
  };
  api.ee = ee;
  api.exit = function () {
    return new Promise(function (resolve, reject) {
      resolve();
    })
  };
  api.destroy = function () {
    return new Promise(function (resolve, reject) {
      ee.removeAllListeners();
      ee = null;
      adRoot.removeChild(container);
      resolve();
    })
  };
  return api;
}
