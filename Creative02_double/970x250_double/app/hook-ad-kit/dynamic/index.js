import DynamicTemplate from "./DynamicTemplate";
import DynamicAd from "./DynamicAd";
import DataManager from "./DataManager";
import DynamicBootLoader from "./DynamicBootLoader";
window.dynamicTemplate = DynamicTemplate();
window.dynamicAd = DynamicAd();
window.dataManager = DataManager();
let dynamicConfig = {
  downloadPreview://@echo dynamicPreviewerConfig.downloadPreview
  ,
  previewNumber: //@echo dynamicPreviewerConfig.previewNumber
  ,
  sheetId: //@echo dynamicPreviewerConfig.sheetId
  ,
  projectId: //@echo dynamicPreviewerConfig.projectId
};
console.log(dynamicConfig, typeof dynamicConfig);
let loader = DynamicBootLoader(dynamicConfig);
export default loader;