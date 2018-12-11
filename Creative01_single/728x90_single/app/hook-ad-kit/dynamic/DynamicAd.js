export default function DynamicAd() {
    console.log('DynamicAd');
    let api = {};
    api.onready = function () {
    };
    api.init = function () {
        console.log('DynamicAd init');
        if (window.dynamicContent) { // if this variable exists, it means the ad is being loaded in DC Studio
            window.previewData = transformDynamicContent();
            renderData();
        } else if (window.previewData) {
            renderData();
        }
    }
    function transformDynamicContent() {
        console.log('transforming dynamic content');
        let data;
        for (let key in window.dynamicContent) {
            if (key === '_profileid') continue;
            // get first element of dynamicContent. this will be our data from the spreadsheet.
            data = window.dynamicContent[key][0];
            for (let key in data) { // convert dynamicContent into a flat object.
                if (typeof data[key] === 'object' && data[key]['Url']) {
                    data[key] = data[key]['Url'];
                }
            }
            break;
        }
        return data;
    }
    function renderData() {
        let images = [];
        let svgs = [];
        console.log(JSON.stringify(previewData));
        for (let key in previewData) {
            if (key === 'label' || key === 'dimensions') continue;
            let value = previewData[key];
            // console.log('key', key, value);
            if (key === 'clickTag') window.clickTag = value;
            if (inferType(value) === 'image') {
                let element = document.getElementById(key);
                if (!element) {
                    console.warn('DynamicAd Warning: Could not bind "' + key + '". Not found: Matching Template String: {{' + key + '}} or Element ID: #' + key + '');
                    continue
                }
                if (element.tagName === 'IMG') element.src = value;
                if (element.tagName === 'DIV') element.style.backgroundImage = 'url(' + value + ')';
                images.push({id: key, url: value});
            }
            if (inferType(value) === 'svg') {
                let element = document.getElementById(key);
                if (!element) {
                    console.warn('DynamicAd Warning: Could not bind "' + key + '". Not found: Matching Template String: {{' + key + '}} or Element ID: #' + key + '');
                    continue
                }
                if (element.tagName === 'IMG') {
                    images.push({id: key, url: value});
                    element.src = value;
                }
                if (element.tagName === 'DIV') {
                    svgs.push({
                        key: key,
                        value: value
                    });
                }
            }
            if (inferType(value) === 'string') {
                let element = document.getElementById(key);
                if (!element) {
                    console.warn('DynamicAd Warning: Could not bind "' + key + '". Not found: Matching Template String: {{' + key + '}} or Element ID: #' + key + '');
                    continue
                }
                element.innerHTML = value;
            }
            console.log('rendering', key, value);
        }

        loadSVGs(svgs, function () {
            loadImages(images, function () {
                renderTemplateStrings();
                api.onready(api);
            });
        })
    }
    function renderTemplateStrings() {
        let html = String(document.body.innerHTML);
        for (let key in previewData) {
            let value = previewData[key]
            html = html.replace(new RegExp('{{' + key + '}}', 'g'), value);
        }
        document.body.innerHTML = html;
    }
    function renderTemplateStringsSrc(src) {
        let html = src;
        for (let key in previewData) {
            let value = previewData[key]
            html = html.replace(new RegExp('{{' + key + '}}', 'g'), value);
        }
        return html;
    }
    function loadImages(images, callback) {
        if (images.length === 0) {
            callback();
            return;
        }
        let imageCount = images.length;
        let imagesLoaded = 0;
        for (let i = 0; i < imageCount; i++) {
            let imageElement = document.createElement('img');
            let image = images[i];
            imageElement.src = image.url;
            document.getElementById('image-hack').appendChild(imageElement);
            imageElement.onload = function () {
                imagesLoaded++;
                if (imagesLoaded === imageCount) {
                    console.log('image loaded', image.id);
                    let elem = document.getElementById(image.id);
                    let computedWidth = window.getComputedStyle(elem, null).getPropertyValue("width");
                    let computedHeight = window.getComputedStyle(elem, null).getPropertyValue("height");
                    console.log('computedWidth', computedWidth);
                    let isWidthSet = computedWidth !== '0px';
                    let isHeightSet = computedHeight !== '0px';
                    if (isWidthSet === false || isHeightSet === false) { // this element's size isn't being set by CSS so lets set it to the source image size
                        elem.style.height = imageElement.height + 'px';
                        elem.style.width = imageElement.width + 'px';
                    }
                    elem.style.backgroundSize = 'contain';
                    callback();
                }
            }
        }
    }
    function loadSVGs(svgs, callback) {
        if (svgs.length === 0) return callback();
        if (!window.dataManager) return callback();
        let svgCount = svgs.length;
        let svgsLoaded = 0;
        for (let i = 0; i < svgCount; i++) {
            let svg = svgs[i];
            svg.element = document.getElementById(svg.key);
            if(svg.element.className.indexOf('dynamic-ignore') > -1 || !svg.element) {
                callback();
                return;
            }
            getDocument(svg.value, function (text) {
                this.html = text;
                this.element.innerHTML = renderTemplateStringsSrc('<svg ' + text.split('<svg ')[1]);
                svgsLoaded++;
                if (svgsLoaded === svgCount) {
                    callback();
                }
                ;
            }.bind(svg));
        }
    }
    function inferType(element) {
        // console.log('infer', element);
        if (typeof element === 'string') {
            if (element.indexOf('.jpg') > -1 || element.indexOf('.png') > -1 || element.indexOf('.gif') > -1) {
                return 'image';
            }
            if (element.indexOf('.svg') > -1) {
                return 'svg'
            }
            if (element.indexOf('http://') > -1 || element.indexOf('https://') > -1) {
                return 'url';
            }
            return 'string';
        } else {
            return typeof element
        }
    }
    function getDocument(url, callback) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                callback(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    return api;
}