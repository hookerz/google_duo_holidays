module.exports = {
  template: 'DCM', // FT, DC DCM, AdWords, Sizmek
  polyfill: true,
  isStandard: true,
  useDynamicPreviewer:false,
  isAutoExpand: false,
  isExpando: false,
  collapsedWidth: 728,
  collapsedHeight: 90,
  expandedWidth: 970,
  expandedHeight: 500,
  standardOptions: {
    fileSize: 150,
    numFiles: 15,
    compression: 60, // compression of jpg spritesheets
    staticFileSize:40,
    spriteBackgroundColor: '#FFFFFF',
    staticLocation: {
      DCM: 'in.folder',
      FT: 'in.folder',
      DC: 'in.zip',
      AdWords: 'in.folder',
      Sizmek:'in.folder'
    },
    minifyHTML: {
      DCM: true,
      FT: true,
      DC: true,
      AdWords: true,
      Sizmek:false
    }
  },
  dynamicPreviewerConfig:{
    downloadPreview: true,
    previewNumber: 1,
    sheetId: "\"1BBtewG_J2ua-8jqqtoi85IZZuzs-eBMZWk9JBDO6yx0\"", // needs to be escaped to pass import
    projectId: "\"1351_ss_all_in_one_banners\""
  },
  base64LoadBGs: false,  // if true images used in background-image css in panels will be preloaded as base 64 and injected into css.
  sasspx: sasspx
};
// add any functions down here.
function sasspx() {
  let start = `${arguments[0]}px`;
  //console.log ('!!!!!!!!!!!!!!!!!!!',typeof start,start);
  start = start.replace(/ /g, '');
  return start;
}