export default function DataManager(config) {
  let sheetId;
  let projectId;
  let sheetServerURL = 'https://us-central1-hook-ad-hub.cloudfunctions.net/GetSheetData/';
  let projectServerURL = 'https://adhub.hookfilez.com/projects/';
  let sheetLoadUrl = '';
  let imageLoadUrl = '';
  let adData = null;
  let self = {
    get data() {
      return adData
    },
    onready: function () {
    }
  };
  self.loaded = false;
  self.init = function (sheetId, projectId) {
    console.log('init', sheetId, projectId, sheetId && projectId);
    if (sheetId && projectId) {
      imageLoadUrl = projectServerURL + projectId + '/assets';
      sheetLoadUrl = sheetServerURL + '?sheetId=' + sheetId + '&tabName=Sheet1';
      loadJSON(sheetLoadUrl, start);
    }
  }
  function start(results) {
    console.log('results', results);
    self.loaded = true;
    let data = JSON.parse(results);
    let headers = [];
    for (let i in data[0]) {
      let headerName = data[0][i];
      if (!headerName) break;
      console.log(headerName);
      headers.push(headerName);
      // for(let r = 1; r < data.length; r++){
      // if(data[r][header] === '') break;
      // cdata[headerName].push(data[r][header]);
      // }
    }
    window.headers = headers;
    adData = [];
    data.splice(0, 1);
    for (let row in data) {
      let dataObj = {};
      for (let col in data[row]) {
        let headerName = headers[col];
        let value = data[row][col];
        if (!headerName) break;
        // if(headerName.indexOf('*') > -1) { // This column has an asterisk, so we should use it for our label.
        // if(!dataObj.label) dataObj.label = row + ' ' + value;
        // else dataObj.label = dataObj.label + ' ' + value;
        // }
        // headerName = headerName.replace('*', ''); // get rid of the asterisk.
        if (value.indexOf('.jpg') > -1 || value.indexOf('.png') > -1 || value.indexOf('.gif') > -1 || value.indexOf('.svg') > -1) {
          if (value[0] !== '/') value = '/' + value;
          value = imageLoadUrl + value;
        }
        dataObj[headerName] = value;
      }
      adData.push(dataObj);
    }
    window.adData = adData;
    self.onready();
  }
  function loadJSON(url, callback) {
    let xobj = new XMLHttpRequest();
    //xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
      if (xobj.readyState === 4 && xobj.status === 200) {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
    
        
        callback(xobj.responseText);
      } else {
        
        if (xobj.status !== 200) {
          console.warn('loadJSON err',xobj.readyState,xobj.status);
        }
        
       
      }
    };
    xobj.send(null);
  }
  function cleanArray(array, deleteValue) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === deleteValue) {
        array.splice(i, 1);
        i--;
      }
    }
    return array;
  }
  function checkDataLoaded(dataObject) {
    if (numSheets-- === 1) {
      self.onready();
    }
  }
  self.getSettings = function () {
    return settings;
  }
  self.getPreviewData = function () {
    return previewData;
  }
  self.getCSV = function () {
    let csv = generateCSV(exportData);
    return csv;
  }
  function loadData(dataObject, callback) {
    numSheets++;
    Papa.parse(dataObject.url, {
      download: true,
      complete: function (results) {
        console.log('data?', results);
        window.rawData = results.data;
        dataObject.raw = results;
        dataObject.data = getDataObject(results.data, dataObject.namesMap, dataObject.namesIndex);
        callback(dataObject);
      }
    });
  }
  function loadDataJSON(dataObject, callback) {
    numSheets++;
    loadJSON(dataObject.url, function (results) {
      window.rawData = results.data;
      dataObject.raw = JSON.parse(results);
      dataObject.data = getDataObject(dataObject.raw, dataObject.namesMap, dataObject.namesIndex);
      callback(dataObject);
    });
  }
  function loadCSV(file, callback) {
    let xobj = new XMLHttpRequest();
    //xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
      if (xobj.readyState === 4 && xobj.status === "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }
  function getDataObject(data, columnNamesMap, columnNameIndex) {
    let columnNames = data[columnNameIndex];
    let newData = [];
    newDataObject = {};
    columnNames = columnNamesMap;
    settings.ExportedColumns = ['Unique_ID', 'Reporting_Label']; // default columns populated programmatically
    for (let iRow = columnNameIndex; iRow < data.length; iRow++) {
      let rowObject = {};
      let rowData = data[iRow];
      rowObject.Reporting_Label = {value: '', type: 'text'};
      for (let iCol in rowData) {
        // get
      }
      let colNum = 0;
      for (let iCol in rowData) {
        let colData = rowData[iCol];
        let colType = settings.ExportType[iCol];
        let colName = settings.ExportNames[iCol];
        let colLabelNumber = settings.AddToLabel[iCol];
        try {
          let colDoExport = settings.ExportToDC[iCol].length !== 0;
          let doExport = colDoExport && colName !== '' && colName;
          let hasLabelNumber = colLabelNumber && colName !== '' && colName;
          //if(doExport || hasLabelNumber) {
          rowObject[colName] = {
            value: colData,
            id: colNum,
            type: colType,
            labelNumber: colLabelNumber
          };
          //}
        } catch (e) {
          //console.log(e);
        }
        colNum++;
      }
      newData.push(rowObject);
    }
    for (let i = 0; i < settings.ColumnNames.length; i++) {
      let colDoExport = settings.ExportToDC[i].length !== 0;
      let colName = settings.ExportNames[i];
      if (colDoExport) {
        settings.ExportedColumns.push(colName);
      }
    }
    function getColumnType(columnName) {
      for (let i in settings.ColumnNames) {
        let type = settings.ExportType[i];
        let name = settings.ColumnNames[i];
        if (name === columnName) {
          return type;
        }
      }
    }
    previewDataTransform(newData);
    exportDataTransform(newData);
  }
  function previewDataTransform(newData) {
    // get preview data
    previewData = [];
    for (let iRow in newData) {
      let rowObject = newData[iRow];
      let sizes = [];
      for (let iCol in rowObject) {
        // get sizes
        let colData = rowObject[iCol].value;
        let colType = rowObject[iCol].type;
        if (colType.indexOf('sizes') !== -1) {
          sizes = colData.split('\n');
        }
      }
      for (let iSize = 0; iSize < sizes.length; iSize++) {
        let rowData = {}
        let sizeName = sizes[iSize];
        rowData['Creative_Dimension'] = sizeName;
        let labelArray = new Array(100);
        for (let columnName in rowObject) {
          let colValue = rowObject[columnName].value;
          let colType = rowObject[columnName].type;
          let colLabelNumber = Number(rowObject[columnName].labelNumber) - 1;
          labelArray[colLabelNumber] = colValue;
          if (colType.indexOf('perSize') !== -1) {
            colValue = colValue.split('\n')[iSize];
          }
          if (colType.indexOf('url') !== -1) {
            rowData[columnName] = {Url: colValue};
          }
          if (colType.indexOf('image') !== -1) {
            rowData[columnName] = {
              Type: 'file',
              Url: imageFolderDC + colValue
            };
          }
          if (colType.indexOf('text') !== -1) {
            rowData[columnName] = colValue;
          }
        }
        labelString = cleanArray(labelArray).join('_');
        rowData['Reporting_Label'] = removeTags(labelString);
        previewData.push(rowData);
      }
    }
  }
  function exportDataTransform(newData) {
    // get export data
    exportData = [];
    let rowId = 0;
    allSites = [];
    let duplicatorData = {};
    for (let iRow in newData) {
      let rowObject = newData[iRow];
      let sizes = [];
      for (let iCol in rowObject) {
        // get sizes
        // console.log('site col num', colId);
        let colData = rowObject[iCol].value;
        let colType = rowObject[iCol].type;
        let colId = rowObject[iCol].id;
        if (colType.indexOf('sizes') !== -1) {
          sizes = colData.split('\n');
          delete rowObject[iCol];
        }
        if (colType.indexOf('site') !== -1) {
          // console.log('site col num', colId);
          allSiteNames.push(colData);
        }
      }
      for (let iSize = 0; iSize < sizes.length; iSize++) {
        let rowData = {};
        let sizeName = sizes[iSize];
        rowData['Creative_Dimension'] = sizeName;
        rowData['Unique_ID'] = rowId++;
        let labelArray = new Array(100);
        let duplicators = [];
        for (let columnName in rowObject) {
          let colValue = rowObject[columnName].value;
          let colType = rowObject[columnName].type;
          let colLabelNumber = Number(rowObject[columnName].labelNumber) - 1;
          labelArray[colLabelNumber] = colValue;
          if (colType.indexOf('perSize') !== -1) {
            colValue = colValue.split('\n')[iSize];
          }
          if (colType.indexOf('image') !== -1) {
            colValue = imageFolderDRM + colValue;
          }
          if (colType.indexOf('duplicator') !== -1) {
            console.log('duplicator colType', colType);
            let exp = /duplicator\((.*)\)/;
            let args = JSON.parse('[' + exp.exec(colType)[1] + ']'); // convert function statement with arguements to array of arguments. duplicator(['a','b'],['c','d']) into [['a','b'],['c','d']]
            let mergers = [];
            console.log('    dupe args', args);
            // get merge column values
            for (let a in args) {
              let sourceColumnName = args[a];
              let value = rowObject[sourceColumnName].value;
              let type = rowObject[sourceColumnName].type;
              let targetColumnName = JSON.parse(/replace\((.*)\)/.exec(type)[1]);
              if (type.indexOf('perSize') !== -1) {
                value = value.split('\n')[iSize];
              }
              console.log('\nsourceColumnName', sourceColumnName, '\ntargetColumnName', targetColumnName, '\nvalue', value, '\ntype', type);
              mergers.push({
                target: targetColumnName,
                value: value
              });
            }
            duplicators.push({
              args: args,
              name: colValue,
              mergers: mergers
            });
          }
          rowData[columnName] = colValue;
        }
        labelString = cleanArray(labelArray).filter(function (val) {
          return val;
        }).join('_');
        rowData['Reporting_Label'] = removeTags(labelString);
        exportData.push(rowData);
        for (let d in duplicators) {
          let dupe = duplicators[d];
          let dupeData = JSON.parse(JSON.stringify(rowData));
          for (let m in dupe.mergers) {
            let merger = dupe.mergers[m]
            //console.log('targetColumnName',targetColumnName,'sourceColumnName',sourceColumnName);
            dupeData[merger.target] = merger.value;
            console.log('merging', merger.value, 'into', merger.target);
          }
          dupeData['Reporting_Label'] = dupe.name + '_' + dupeData['Reporting_Label'];
          console.log(dupeData);
          if (duplicatorData.hasOwnProperty(dupe.name) === false) {
            duplicatorData[dupe.name] = [];
          }
          duplicatorData[dupe.name].push(dupeData);
        }
      }
    }
    for (let dupeName in duplicatorData) {
      let dupeData = duplicatorData[dupeName];
      for (let d in dupeData) {
        dupeData[d]['Unique_ID'] = rowId++;
        exportData.push(dupeData[d]);
      }
    }
  }
  function generateSiteRows(data) {
    let newData = [];
    data = JSON.parse(JSON.stringify(data));
    let numDefaultRows = 0;
    for (let row in allSiteNames) { // use this when using SITE COLUMNS
      let site = sitesData.data;
      let siteName = allSiteNames[row];
      for (let i in data) {
        let dataObject = JSON.parse(JSON.stringify(data[i])); // clone data to avoid modifying source data
        let utm = dataObject.meta.siteData[siteName].utm;
        let id = dataObject.meta.siteData[siteName].id;
        if (id.toLowerCase().indexOf('none') > -1) {
          id = '';
        }
        dataObject.Reporting_Label = siteName + '_' + dataObject.Reporting_Label;
        dataObject.Unique_ID = newData.length;
        dataObject.Exit_URL += '?' + utm;
        dataObject.DCM_Ad_ID = id;
        if (id.toLowerCase().indexOf('skip') === -1) {
          newData.push(dataObject);
        }
      }
    }
    return newData;
  }
  function checkImages(callback) {
    let convertedData = exportData;
    window.convertedData = convertedData;
    loadJSON(imagesListUrl, function (results) {
      let driveFileNames = [];
      let data = JSON.parse(results);
      window.images = data;
      for (let row in data) {
        let rowObject = data[row];
        driveFileNames.push(rowObject.name);
      }
      driveFileNames = getUniqueArray(driveFileNames);
      let dataFileNames = [];
      for (let row in convertedData) {
        let rowObject = convertedData[row];
        for (let col in rowObject) {
          let colObject = rowObject[col];
          console.log('colObject', colObject);
          if (colObject) {
            if (colObject.indexOf) {
              if (colObject.indexOf('.png') > -1 || colObject.indexOf('.gif') > -1 || colObject.indexOf('.jpg') > -1) {
                // console.log('url', colObject.Url);
                dataFileNames.push(getFileNameFromPath(colObject));
              }
            }
          }
        }
      }
      dataFileNames = getUniqueArray(dataFileNames);
      window.dataFileNames = dataFileNames;
      window.driveFileNames = driveFileNames;
      let matchedFiles = intersectArrays(driveFileNames, dataFileNames);
      let missing = [];
      for (let d in dataFileNames) {
        let dataName = dataFileNames[d]
        let found = false;
        for (let m in matchedFiles) {
          let matchedName = matchedFiles[m];
          if (matchedName === dataName) {
            found = true;
            ////console.log('found');
            break;
          }
        }
        if (found === false) missing.push(dataName);
      }
      callback({missing: missing, unused: null});
    });
  }
  function getFileNameFromPath(path) {
    let paths = path.split(settings.DRMFolder);
    return paths[paths.length - 1];
  }
  self.checkImages = checkImages;
  function generateCSV(data) {
    data = exportData;
    let delimiter = '	';
    let columnOrder = settings.ExportedColumns;
    let csvString = '';
    let sites = [];
    // generate top header label row
    for (let i in columnOrder) {
      csvString += columnOrder[i] + delimiter;
    }
    sites = [];
    for (let row in data) {
      let rowData = data[row];
      for (let col in rowData) {
        let colData = rowData[col];
      }
    }
    csvString += '\n';
    // generate the rest
    for (let row in data) {
      let rowString = '';
      let rowData = data[row];
      for (let k in columnOrder) {
        let key = columnOrder[k];
        rowString += rowData[key] + delimiter;
      }
      csvString += rowString + '\n';
    }
    //fs.writeFileSync(filePath + '.new.csv', csvString);
    return csvString;
  }
  function cleanData(data) {
    let newData = [];
    for (let r in data) {
      let rowObject = data[r];
      let image1Missing = rowObject.Product_Image_1.indexOf('undefined') > 0;
      let image2Missing = rowObject.Product_Image_2.indexOf('undefined') > 0;
      let image3Missing = rowObject.Product_Image_3.indexOf('undefined') > 0;
      let image4Missing = rowObject.Product_Image_4.indexOf('undefined') > 0;
      let brokenImages = false;
      if (image1Missing || image2Missing || image3Missing || image4Missing) {
        brokenImages = true;
      }
      if (brokenImages === false) {
        newData.push(rowObject);
      }
    }
    return newData;
  }
  function findKeyInArray(key, array) {
    // The variable results needs let in this case (without 'let' a global variable is created)
    let results = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].indexOf(key) === 0) {
        return (array[i]);
      }
    }
  }
  function getUniqueArray(a) {
    let prims = {"boolean": {}, "number": {}, "string": {}}, objs = [];
    return a.filter(function (item) {
      let type = typeof item;
      if (type in prims)
        return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
      else
        return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
  }
  function intersectArrays(a, b) {
    let sorted_a = a.concat().sort();
    let sorted_b = b.concat().sort();
    let common = [];
    let a_i = 0;
    let b_i = 0;
    while (a_i < a.length
    && b_i < b.length) {
      if (sorted_a[a_i] === sorted_b[b_i]) {
        common.push(sorted_a[a_i]);
        a_i++;
        b_i++;
      }
      else if (sorted_a[a_i] < sorted_b[b_i]) {
        a_i++;
      }
      else {
        b_i++;
      }
    }
    return common;
  }
  function removeTags(string) {
    return string.replace(/(<([^>]+)>)/ig, "");
  }
  return self;
}
