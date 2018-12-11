import {config} from './index'
export function setup() {
  console.log('Sizmek Setup');
  config.dynamicDataRoot = dynamicSetup();
}
function dynamicSetup() {
  return null;
}
export const exits = {
  catch_all: function catchAll() {
  
    console.log('clickTag catchAll');
    EB.clickthrough();
  },
  cta: function cta() {
  
    console.log('clickTag cta');
    EB.clickthrough();
  }
};