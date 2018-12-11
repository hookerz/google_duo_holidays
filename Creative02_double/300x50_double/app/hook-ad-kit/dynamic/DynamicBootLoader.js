export default function (config) {
  console.log("DYNAMIC BOOT LOADER CALLED", config);
  return new Promise(resolve => {
   // console.log('DynamicBootloader 2', config);
    function loadData() {
      console.log('loadData');
      window.dynamicAd.onready = function () {
        resolve(true)
      };
      window.dynamicAd.init();
    }
    function loadPreview(rowNumber) {
      console.log("loadPreview");
      dataManager.onready = function () {
        console.log("loadPreview data loaded");
        window.previewData = window.dataManager.data[rowNumber - 1];
        loadData();
      };
      window.dataManager.init(config.sheetId, config.projectId);
    }
    if (config.downloadPreview) {
      loadPreview(config.previewNumber, loadData);
    } else if (window.previewData || window.dynamicContent) {
      loadData();
    } else {
      console.info ( 'Dynamics Engine Not Included, Proceed as standard');
      resolve(false);
    }
  });
}