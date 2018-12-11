import {config} from './index'
export function setup() {
  console.log('AdWords Setup');
  config.dynamicDataRoot = dynamicSetup();
}
function dynamicSetup() {
  return null;
}
export const exits = {
  catch_all: function catchAll() {
    return 'Handler is silent';
  },
  cta: function cta() {
    return 'Handler is silent';
  }
};