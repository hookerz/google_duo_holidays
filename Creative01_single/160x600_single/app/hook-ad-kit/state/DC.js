'use strict';
export function boot() {
  let enablerCheck = function (method, state) {
    let check = function () {
      let result = method();
      console.log(state, result);
      return result
    };
    return new Promise(function (resolve, reject) {
      if (check() === true) {
        console.log(state, check(), "VERIFIED");
        resolve()
      } else {
        Enabler.addEventListener(state, function () {
          console.log(state, check(), "EVENT VERIFIED");
          resolve()
        });
      }
    })
  };
  return new Promise(function (resolve, reject) {
    enablerCheck(function () {
      return Enabler.isInitialized();
    }, studio.events.StudioEvent.INIT)
      .then(function () {
        return enablerCheck(function () {
          return Enabler.isPageLoaded();
        }, studio.events.StudioEvent.PAGE_LOADED)
      })
      .then(function () {
        return enablerCheck(function () {
          return Enabler.isVisible();
        }, studio.events.StudioEvent.VISIBLE)
      })
      .then(resolve)
  })
}

export function requestExpand() {
  return new Promise(function (resolve, reject) {
    console.log('expansion requested');
    // only allow expand if not expanding already
    if (Enabler.getContainerState() !== studio.sdk.ContainerState.EXPANDED && Enabler.getContainerState() !== studio.sdk.ContainerState.EXPANDING) {
      let func = function () {
        Enabler.removeEventListener(studio.events.StudioEvent.EXPAND_START, func);
        resolve('EXPANSION START')
      };
      Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, func);
      Enabler.requestExpand();
    } else {
      reject('AlreadyExpanded');
    }
  });
}

export function completeExpand() {
  return new Promise(function (resolve, reject) {
    console.log('complete expansion requested');
    if (Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDING) {
      let func = function () {
        Enabler.removeEventListener(studio.events.StudioEvent.EXPAND_FINISH, func);
        resolve('EXPANSION COMPLETE')
      };
      Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, func);
      Enabler.finishExpand();
    } else {
      reject('Expand Not Started so cant be completed');
    }
  });
}

export function requestCollapse() {
  return new Promise(function (resolve, reject) {
    // only collapse if expanded
    if (Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDED) {
      let func = function () {
        Enabler.removeEventListener(studio.events.StudioEvent.COLLAPSE_START, func);
        resolve('COLLAPSE START')
      };
      Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, func);
      Enabler.requestCollapse();
    } else {
      reject('AlreadyCollapsed');
    }
  });
}

export function completeCollapse() {
  return new Promise(function (resolve, reject) {
    if (Enabler.getContainerState() === studio.sdk.ContainerState.COLLAPSING) {
      let func = function () {
        Enabler.removeEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, func);
        resolve('COLLAPSE COMPLETE')
      };
      Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, func);
      Enabler.finishCollapse();
    } else {
      reject('Collapse not started so cant complete');
    }
  });
}

export function exit(closure) {
  return new Promise(function (resolve, reject) {
    Enabler.addEventListener(studio.events.StudioEvent.EXIT, resolve);
    closure.call();
  })
}

export function defaultClose() {
  Enabler.reportManualClose()
}

export function expanded() {
  if (Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDED || Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDING) {
    return true;
  }
  return false;
}