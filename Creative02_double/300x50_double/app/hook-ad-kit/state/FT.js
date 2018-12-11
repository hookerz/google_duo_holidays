'use strict';
let expandingState = "expanding";
let expandedState = "expanded";
let collapsingState = "collapsing";
let collapsedState = "collapsed";
let state = collapsedState;

let directives = require ("../../../compiler-directives");

export function boot() {
  return new Promise(function (resolve, reject) {
    function prepDynamics() {
      return new Promise(function (resolve, reject) {
        if (myFT.instantAdsLoaded === true) {
          console.log('instant ads ready');
          console.log(myFT.instantAds);
          resolve()
        } else {
          myFT.on("instantads", function () {
            console.log('instant ads ready');
            console.log(myFT.instantAds);
            resolve();
          });
        }
      });
    }
    
    let checkman = function (e) {
      console.log('!!!!!!!! ', e.instantAds);
      if (Array.isArray(e.instantAds) === true) {
        prepDynamics()
          .then(resolve)
      } else {
        // no instant ads
        console.log ('skip instant ads');
        resolve()
      }
    };
    let man = function () {
      myFT.on("manifest", checkman);
    }
    if (myFT.hasLoaded === true) {
      man();
    } else {
      myFT.on("ready", man);
    }
  });
}

export function requestExpand() {
  return new Promise(function (resolve, reject) {
    console.log('expansion requested');
    if (state !== collapsedState) {
      reject('AlreadyExpanded');
      return;
    }
    state = expandingState;
    myFT.expand();
    resolve('EXPANSION START');
  });
}

export function completeExpand() {
  return new Promise(function (resolve, reject) {
    console.log('complete expansion requested');
    if (state !== expandingState) {
      reject('Expand Not Started so cant be completed');
      return;
    }
    state = expandedState;
    resolve('EXPANSION COMPLETE')
  });
}

export function requestCollapse() {
  return new Promise(function (resolve, reject) {
    if (state !== expandedState) {
      reject('AlreadyCollapsed');
      return;
    }
    myFT.contract();
    state = collapsingState;
    resolve('COLLAPSE START');
  });
}

export function completeCollapse() {
  return new Promise(function (resolve, reject) {
    if (state !== collapsingState) {
      reject('Collapse not started so cant complete');
      return;
    }
    state = collapsedState;
    resolve('COLLAPSE COMPLETE')
  });
}

export function exit(closure) {
  return new Promise(function (resolve, reject) {
    closure.call();
    resolve()
  })
}

export function defaultClose() {
  console.log('no default close in FT')
}

export function expanded() {
  if (state === expandingState || state === expandedState) {
    return true;
  }
  return false
}

