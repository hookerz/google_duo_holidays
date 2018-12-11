export function removeChildren (domNode){
  return new Promise(function (resolve, reject) {
    while (domNode.hasChildNodes()) {
      domNode.removeChild(domNode.lastChild);
    }
    requestAnimationFrame(resolve);
  });
  
}

export function getBaseURL () {
  
  let baseURL = location.protocol + '//' + location.host + location.pathname.slice(0).replace(/\/index(.*?)\.html/, '/');
  if (baseURL.charAt(baseURL.length - 1) !== '/') {
    baseURL = baseURL + '/'
  }
  console.log(baseURL);
  return baseURL
  
}

export function prependChild (element, child) {
  let first = element.firstChild;
  if (first) {
    return element.insertBefore(child, first);
  } else {
    return element.appendChild(child);
  }
}