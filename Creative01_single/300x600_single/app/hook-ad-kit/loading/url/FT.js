'use strict';
let directives = require ("../../../../compiler-directives");
export function getRichBase(baseURL) {
  if (directives.isStandard === true) {
    return baseURL.slice(0);
  }
  let arr = baseURL.split('/');
  // named folder of base
  let man = myFT.getManifest('richLoads')
  let richFolder = man[0].src;
  // if local testing just return base URL
  let cid = myFT.get("cID");
  let dom = myFT.get("serveDOM");
  let base = window.location.href.split(cid)[0];
  console.log(baseURL);
  console.log(richFolder);
  console.log(cid);
  console.log(dom);
  console.log(base);
  let ret = '';
  if (myFT.testMode === true) {
    ret = baseURL.slice(0);
    return ret
  }
  // on previewer domain
  if (dom.indexOf('creativepreview.') !== -1) {
    ret = base + cid + '/richloads' + '/' + richFolder + '/';
    return ret
  } else {
    //path to richloads on CDN
    ret = base + cid + '/' + richFolder + '/';
    return ret
  }
}

