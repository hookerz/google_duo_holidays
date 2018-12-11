import {config} from './index'
export function setup() {
  console.log('FT Setup');
  config.dynamicDataRoot = dynamicSetup();
}
function dynamicSetup() {
  return myFT.instantAds;
}
export const exits = {
  catch_all: function catchAll() {
    console.log("catchAll FT");
    myFT.clickTag(1);
  },
  cta: function cta() {
    console.log("cta FT");
    myFT.clickTag(2);
  }
};