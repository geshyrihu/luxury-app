import{b as f}from"./chunk-MZBZ45EI.js";import{B as l}from"./chunk-RBLK56XA.js";import{Zb as u,ab as c,da as s,kb as d,ma as r,na as a}from"./chunk-3JZBD3P2.js";var D=(()=>{class e{el;pFocusTrapDisabled=!1;constructor(n){this.el=n}onkeydown(n){if(this.pFocusTrapDisabled!==!0){n.preventDefault();let t=f.getNextFocusableElement(this.el.nativeElement,n.shiftKey);t&&(t.focus(),t.select?.())}}static \u0275fac=function(t){return new(t||e)(d(c))};static \u0275dir=a({type:e,selectors:[["","pFocusTrap",""]],hostAttrs:[1,"p-element"],hostBindings:function(t,i){t&1&&u("keydown.tab",function(o){return i.onkeydown(o)})("keydown.shift.tab",function(o){return i.onkeydown(o)})},inputs:{pFocusTrapDisabled:"pFocusTrapDisabled"}})}return e})(),g=(()=>{class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=r({type:e});static \u0275inj=s({imports:[l]})}return e})();export{D as a,g as b};
