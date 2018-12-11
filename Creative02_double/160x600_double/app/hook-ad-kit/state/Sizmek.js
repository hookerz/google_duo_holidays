'use strict';
export function boot() {
  return new Promise(function (resolve, reject) {
    if (EB.isInitialized() === true) {
      resolve();
    } else {
      EB.addEventListener(EBG.EventName.EB_INITIALIZED, resolve);
    }
  })
}

