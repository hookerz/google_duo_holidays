// @if template='DC'
import {exits} from './DC';
import * as adKit from '../../hook-ad-kit/state/DC.js';
// @endif
// @if template='FT'
import {exits} from './FT';
import * as adKit from '../../hook-ad-kit/state/FT.js';
// @endif
// @if template='DCM'
import {exits} from './DCM';
import * as adKit from '../../hook-ad-kit/state/DCM.js';
// @endif
// @if template='AdWords'
import {exits} from './AdWords';
import * as adKit from '../../hook-ad-kit/state/AdWords.js';
// @endif
// @if template='Sizmek'
import {exits} from './Sizmek';
import * as adKit from '../../hook-ad-kit/state/Sizmek.js';
// @endif
export let config = {
  isAutoExpand:
  /*@exclude*/
    true
  /*@endexclude*/
  //@echo isAutoExpand
  ,
  isExpando:
  /*@exclude*/
    true
  /*@endexclude*/
  //@echo isExpando
  ,
  exits: exits,
  richBaseURL: null,
  dynamicDataRoot:null,
  base64LoadBGs:
  /*@exclude*/
    true
  /*@endexclude*/
  
  //@echo base64LoadBGs
  ,
};
// @if template='DC'
export {setup as setup} from './DC';
export {getRichBase as getRichBase} from '../../hook-ad-kit/loading/url/DC.js';
// @endif
// @if template='FT'
export {setup as setup} from './FT';
export {getRichBase as getRichBase} from '../../hook-ad-kit/loading/url/FT.js';
// @endif
// @if template='DCM'
export {setup as setup} from './DCM';
export {getRichBase as getRichBase} from '../../hook-ad-kit/loading/url/DCM.js';
// @endif
// @if template='AdWords'
export {setup as setup} from './AdWords';
export {getRichBase as getRichBase} from '../../hook-ad-kit/loading/url/AdWords.js';
// @endif
// @if template='Sizmek'
export {setup as setup} from './Sizmek';
export {getRichBase as getRichBase} from '../../hook-ad-kit/loading/url/Sizmek.js';
// @endif

export {adKit as adKit}