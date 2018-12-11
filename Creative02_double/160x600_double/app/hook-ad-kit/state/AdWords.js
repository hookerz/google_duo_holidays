'use strict';
export function boot() {
  return new Promise(function (resolve, reject) {
    let tid = setInterval(function () {
      if (document.readyState !== 'complete') return;
      
      console.log ("DCM READY");
      clearInterval(tid);
      resolve();
    }, 100);
  })
}

