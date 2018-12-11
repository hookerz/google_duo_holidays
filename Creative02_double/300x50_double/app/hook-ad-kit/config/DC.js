import {config} from './index'

export function setup() {
  console.log('DC Setup');
  
  // @if isExpando=true
  
  Enabler.setStartExpanded(config.isAutoExpand);
  Enabler.setExpandingPixelOffsets(0, 0,
    /*@exclude*/
    1
    /*@endexclude*/
    /* @ifdef expandedWidth **
    //@echo expandedWidth
    /* @endif */,
    /*@exclude*/
    1
    /*@endexclude*/
    /* @ifdef expandedHeight **
    //@echo expandedHeight
    /* @endif */,
  ); // This needs to be hardcoded to work in DC, it can't run off config
  Enabler.setIsMultiDirectional(false);
  // @endif
  config.dynamicDataRoot = dynamicSetup();
}

function dynamicSetup() {
  
  /*

  Enabler.setProfileId(111111);
  let devDynamicContent = {};
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1 = [{}];
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0]._id = 0;
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].Unique_ID = 1;
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].Reporting_Label = "Default";
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].Language = "en";
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].Background_Image = {};
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].Background_Image.Type = "file";
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].Background_Image.Url = "";
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].YT_Video_ID = "";
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].Background_Exit_URL = {};
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].Background_Exit_URL.Url = "";
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].Default = true;
  devDynamicContent.YT_1170_watercooler_digital_BCE_US_Sheet1[0].Active = true;
  Enabler.setDevDynamicContent(devDynamicContent);
  return dynamicContent
  */
  return null;
}

export const exits = {
  catch_all: function catchAll() {
    Enabler.exit('catch_all', 'https://www.google.com');
  },
  cta: function cta() {
    Enabler.exit('cta',  'https://www.google.com');
  }
};