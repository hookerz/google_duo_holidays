/**
 *
 * @param imageArray array of image objects with format {url:string,css:Boolean} css will wrap the string for use as a css background image.
 * @return returns array of objects with this syntax {id:the original URL,img:the base64 image data}
 */





export default function (imageArray) {
  return new Promise(function (resolve, reject) {
    let count = 0;
    let returnArray = [];
    
    function run() {
      let sourceItem = imageArray[count];
      let prom = null;
      if (typeof window.FileReader !== 'undefined' && typeof window.File !== 'undefined' && typeof window.FileList !== 'undefined' && typeof window.Blob !== 'undefined') {
        
        console.log ('load base64 with file reader');
        
        prom=  convertImgToDataURLviaFileReader(sourceItem.url);
        
      } else {
        
        console.log ('load base64 with canvas');
        
        prom= convertImgToDataURLviaCanvas(sourceItem.url);
      }
      prom
        .then(function (dataURL) {
          let returnItem = {};
          returnItem.id = sourceItem.url;
          if (sourceItem.css === true) {
            returnItem.img = "url('" + dataURL + "')";
          } else {
            returnItem.img = dataURL;
          }
          returnArray.push(returnItem);
          count++;
          if (count === imageArray.length) {
            resolve(returnArray)
          } else {
            run()
          }
        })
    }
    
    run()
  })
}

function convertImgToDataURLviaFileReader(url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      let reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  })
}

function convertImgToDataURLviaCanvas(url) {
  return new Promise(function (resolve, reject) {
    let outputFormat = 'image/png';
    if (url.search('.jpg') !== -1) {
      outputFormat = 'image/jpg';
    }
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      let canvas = document.createElement('CANVAS');
      let ctx = canvas.getContext('2d');
      let dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      resolve(dataURL);
      canvas = null;
    };
    img.src = url;
  })
}