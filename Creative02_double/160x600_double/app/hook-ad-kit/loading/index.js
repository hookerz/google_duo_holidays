'use strict';
import {removeChildren} from '../Util'
import b64Loader from '../../UsefulThings/Base64ImageLoader'
import {config} from '../../hook-ad-kit/config';
export function patchCSS(styleSheet, richBaseURL) {
    return new Promise(function (resolve, reject) {

        // @if isStandard=true
        console.info ("DONT PATCH CSS IN STDS");
        resolve();
        return;
        // @endif
        let rules = styleSheet.cssRules || styleSheet.rules;
        if (rules === null) {
            resolve();
            return;
        }
        for (let j = 0; j < rules.length; j++) {
            let rule = rules[j];
            if (rule.cssText.search('../images') !== -1) {
                // console.log(rule.cssText);
                console.log('PATCH CSS', rule.style.backgroundImage);
                let oldURL = rule.style.backgroundImage.slice(0);
                let oldURLsplit = oldURL.split('/');
                let oldRel = oldURLsplit[oldURLsplit.length - 2] + '/' + oldURLsplit[oldURLsplit.length - 1];
                oldRel = oldRel.replace('(', '').replace(')', '').replace('"', '');
                let newURL = 'url("' + richBaseURL + oldRel + '")';
                rule.style.backgroundImage = '';
                rule.style.backgroundImage = newURL;
                console.log('PATCH CSS', rule.style.backgroundImage, newURL);
            }
        }
        resolve()
    })
}
export function loadPartial(url) {
    return new Promise(function (resolve, reject) {
        let loadComplete = function (response) {
            console.log('partial loaded');
            return resolve(response);
        };
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                loadComplete(xhr.responseText);
            }
        }.bind(this);
        xhr.send();
    })
}
export function subloadPartial(container, html) {
    console.log('subloadPartial');
    let loadBackgroundImg = function (targetFrag, rules) {
        console.log('load background images');
        let retArray = [];
        let urls = [];
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            let imagePath = null;
            // filter only to images that have background images
            if (rule.cssText.search('background-image') !== -1 && rule.selectorText.search(targetFrag.body.firstChild.id) !== -1) {
                imagePath = rule.cssText.match(/http(.*?).(?:jpg|gif|png)/)
                if (imagePath !== null) {
                    imagePath = imagePath[0];
                    if (urls.indexOf(imagePath) === -1) {
                        urls.push(imagePath)
                        console.log('load background image =', imagePath);
                        if (config.base64LoadBGs !== true) {
                            retArray.push(
                                new Promise(function (resolve, reject) {
                                    let img = new Image();
                                    img.onload = function () {
                                        console.log('single background loaded');
                                        resolve()
                                    }.bind(this);
                                    img.src = imagePath;
                                })
                            )
                        } else {
                            retArray.push(
                                new Promise(function (resolve, reject) {
                                    let imgarr = [{url: imagePath, css: true}];
                                    b64Loader(imgarr)
                                        .then(function (loadedImageArray) {
                                            let heroItem = loadedImageArray[0];
                                            // replace the URL in all the css with this updated one.
                                            for (let j = 0; j < rules.length; j++) {
                                                let thisRule = rules[j];
                                                if (thisRule.cssText.search('background-image') !== -1) {
                                                    if (rule.style.backgroundImage.search(heroItem.id) !== -1) {
                                                        rule.style.backgroundImage = heroItem.img;
                                                    }
                                                }
                                            }
                                            console.log('base64 BG image loaded', heroItem.id);
                                        })
                                        .then(resolve)
                                })
                            )
                        }
                    } else {
                        console.log('SKIP Duplicate background image =', imagePath);
                    }
                }
            }
        }
        return Promise.all(retArray);
    };
    let loadImgTags = function (target) {
        console.log('loadImgTags');
        let retArray = [];
        let urls = [];
        let divs = target.querySelectorAll('img');
        for (let i = 0; i < divs.length; i++) {
            if (typeof  divs[i].src !== 'undefined') {
                let item = divs[i].src;
                if (urls.indexOf(item) === -1) {
                    urls.push(item);
                    retArray.push(
                        new Promise(function (resolve, reject) {
                            let img = new Image();
                            img.onload = function () {
                                console.log('single image loaded', item);
                                resolve()
                            }.bind(this);
                            img.src = item;
                        })
                    )
                } else {
                    console.log('SKIP Image URL LOAD ', item);
                }
            } else {
                console.log('Image URL is busted ', divs[i].src);
            }
        }
        return Promise.all(retArray);
    };
    let loadSvgImageTags = function (target) {
        console.log('loadSvgImageTags');
        let retArray = [];
        let urls = [];
        let divs = target.querySelectorAll('image');
        for (let i = 0; i < divs.length; i++) {
            //if (typeof  divs[i].getAttribute('xlink:href') !== 'undefined') {
            if ( divs[i].getAttribute('xlink:href') !== null &&  divs[i].getAttribute('xlink:href') !== "") {

                let item = divs[i].getAttribute('xlink:href');
                if (urls.indexOf(item) === -1) {
                    urls.push(item);
                    retArray.push(
                        new Promise(function (resolve, reject) {
                            let img = new Image();
                            img.onload = function () {
                                console.log('single SVG image loaded', item);
                                resolve()
                            }.bind(this);

                            if (item !==null) {
                                img.src = item;
                            }else {
                                console.warn ("SVG IMAGE URL MALFORMED ",item)
                            }


                        })
                    )
                } else {
                    console.log('SKIP Image URL LOAD ', item);
                }
            } else {
                console.log('Image  SVG URL is busted ', divs[i].getAttribute('xlink:href'));
            }
        }
        return Promise.all(retArray);
    };

    return new Promise(function (resolve, reject) {
        let frag = null;
        removeChildren(container)
            .then(function () {
                console.log('add html');
                // container.innerHTML = html
                let parser = new DOMParser();
                let str = `<div id=${container.id}>` + html + '</div>';
                frag = parser.parseFromString(str, "text/html");
                window.frag = frag;
            })
            .then(function () {
                return Promise.all([
                    loadImgTags(frag.querySelector('.content')),
                    loadSvgImageTags(frag.querySelector('.content')),

                    loadBackgroundImg(frag, document.styleSheets[0].cssRules)
                ])
            }) // need to return promise to keep flow going since it is async
            .then(function () {
                container.appendChild(frag.querySelector('.content'))
            })
            .then(resolve)
    });
}
export function cssUpdate(richBaseURL) {
    for (let i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf("css/style.css")) {
            patchCSS(document.styleSheets[i], richBaseURL);
            break;
        }
    }
};
export function patchURL(text, richBase) {
    let absURL = '';
    absURL = text.replace(/\.\//g, richBase);
    return absURL;
}
export function loadContent(url, container, richBaseURL) {
    console.log('loadContent');
    container.classList.remove('hidden');
    return new Promise(function (resolve, reject) {
        loadPartial(url)
            .then(function (value) {
                value = patchURL(value, richBaseURL);
                return subloadPartial(container, value)
            })
            .then(resolve);
    })
}


