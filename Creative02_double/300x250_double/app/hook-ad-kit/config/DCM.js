import {config} from './index'
export function setup() {
  console.log('DCM Setup');
  config.dynamicDataRoot = dynamicSetup();
}
function dynamicSetup() {
  return null;
}
export const exits = {
  catch_all: function catchAll() {
    
    console.log (" catchAll");
    return 'Handler is silent';
  },
  cta: function cta() {
  
    console.log (" cta");
    return 'Handler is silent';
  }
};