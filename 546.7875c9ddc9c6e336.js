"use strict";(self.webpackChunkalnitak=self.webpackChunkalnitak||[]).push([[546],{5546:(Y,y,i)=>{i.r(y),i.d(y,{LayoutViewerPageComponent:()=>$});var L=i(177),t=i(9590),p=i(9417),w=i(8617),V=i(5024),b=i(6600);const D=["button"],R=["*"];function F(n,u){if(1&n&&t.nrm(0,"mat-pseudo-checkbox",3),2&n){const e=t.XpG();t.Y8G("disabled",e.disabled)}}function A(n,u){if(1&n&&t.nrm(0,"mat-pseudo-checkbox",3),2&n){const e=t.XpG();t.Y8G("disabled",e.disabled)}}const v=new t.nKC("MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS",{providedIn:"root",factory:function K(){return{hideSingleSelectionIndicator:!1,hideMultipleSelectionIndicator:!1}}}),k=new t.nKC("MatButtonToggleGroup"),E={provide:p.kq,useExisting:(0,t.Rfq)(()=>M),multi:!0};let _=0;class T{constructor(u,e){this.source=u,this.value=e}}let M=(()=>{class n{get name(){return this._name}set name(e){this._name=e,this._markButtonsForCheck()}get value(){const e=this._selectionModel?this._selectionModel.selected:[];return this.multiple?e.map(a=>a.value):e[0]?e[0].value:void 0}set value(e){this._setSelectionByValue(e),this.valueChange.emit(this.value)}get selected(){const e=this._selectionModel?this._selectionModel.selected:[];return this.multiple?e:e[0]||null}get multiple(){return this._multiple}set multiple(e){this._multiple=e,this._markButtonsForCheck()}get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._markButtonsForCheck()}get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._markButtonsForCheck()}get hideMultipleSelectionIndicator(){return this._hideMultipleSelectionIndicator}set hideMultipleSelectionIndicator(e){this._hideMultipleSelectionIndicator=e,this._markButtonsForCheck()}constructor(e,a){this._changeDetector=e,this._multiple=!1,this._disabled=!1,this._controlValueAccessorChangeFn=()=>{},this._onTouched=()=>{},this._name="mat-button-toggle-group-"+_++,this.valueChange=new t.bkB,this.change=new t.bkB,this.appearance=a&&a.appearance?a.appearance:"standard",this.hideSingleSelectionIndicator=a?.hideSingleSelectionIndicator??!1,this.hideMultipleSelectionIndicator=a?.hideMultipleSelectionIndicator??!1}ngOnInit(){this._selectionModel=new V.CB(this.multiple,void 0,!1)}ngAfterContentInit(){this._selectionModel.select(...this._buttonToggles.filter(e=>e.checked))}writeValue(e){this.value=e,this._changeDetector.markForCheck()}registerOnChange(e){this._controlValueAccessorChangeFn=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e}_emitChangeEvent(e){const a=new T(e,this.value);this._rawValue=a.value,this._controlValueAccessorChangeFn(a.value),this.change.emit(a)}_syncButtonToggle(e,a,o=!1,l=!1){!this.multiple&&this.selected&&!e.checked&&(this.selected.checked=!1),this._selectionModel?a?this._selectionModel.select(e):this._selectionModel.deselect(e):l=!0,l?Promise.resolve().then(()=>this._updateModelValue(e,o)):this._updateModelValue(e,o)}_isSelected(e){return this._selectionModel&&this._selectionModel.isSelected(e)}_isPrechecked(e){return!(typeof this._rawValue>"u")&&(this.multiple&&Array.isArray(this._rawValue)?this._rawValue.some(a=>null!=e.value&&a===e.value):e.value===this._rawValue)}_setSelectionByValue(e){this._rawValue=e,this._buttonToggles&&(this.multiple&&e?(Array.isArray(e),this._clearSelection(),e.forEach(a=>this._selectValue(a))):(this._clearSelection(),this._selectValue(e)))}_clearSelection(){this._selectionModel.clear(),this._buttonToggles.forEach(e=>e.checked=!1)}_selectValue(e){const a=this._buttonToggles.find(o=>null!=o.value&&o.value===e);a&&(a.checked=!0,this._selectionModel.select(a))}_updateModelValue(e,a){a&&this._emitChangeEvent(e),this.valueChange.emit(this.value)}_markButtonsForCheck(){this._buttonToggles?.forEach(e=>e._markForCheck())}static#t=this.\u0275fac=function(a){return new(a||n)(t.rXU(t.gRc),t.rXU(v,8))};static#e=this.\u0275dir=t.FsC({type:n,selectors:[["mat-button-toggle-group"]],contentQueries:function(a,o,l){if(1&a&&t.wni(l,m,5),2&a){let r;t.mGM(r=t.lsd())&&(o._buttonToggles=r)}},hostAttrs:["role","group",1,"mat-button-toggle-group"],hostVars:5,hostBindings:function(a,o){2&a&&(t.BMQ("aria-disabled",o.disabled),t.AVh("mat-button-toggle-vertical",o.vertical)("mat-button-toggle-group-appearance-standard","standard"===o.appearance))},inputs:{appearance:"appearance",name:"name",vertical:[t.Mj6.HasDecoratorInputTransform,"vertical","vertical",t.L39],value:"value",multiple:[t.Mj6.HasDecoratorInputTransform,"multiple","multiple",t.L39],disabled:[t.Mj6.HasDecoratorInputTransform,"disabled","disabled",t.L39],hideSingleSelectionIndicator:[t.Mj6.HasDecoratorInputTransform,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",t.L39],hideMultipleSelectionIndicator:[t.Mj6.HasDecoratorInputTransform,"hideMultipleSelectionIndicator","hideMultipleSelectionIndicator",t.L39]},outputs:{valueChange:"valueChange",change:"change"},exportAs:["matButtonToggleGroup"],standalone:!0,features:[t.Jv_([E,{provide:k,useExisting:n}]),t.GFd]})}return n})(),m=(()=>{class n{get buttonId(){return`${this.id}-button`}get appearance(){return this.buttonToggleGroup?this.buttonToggleGroup.appearance:this._appearance}set appearance(e){this._appearance=e}get checked(){return this.buttonToggleGroup?this.buttonToggleGroup._isSelected(this):this._checked}set checked(e){e!==this._checked&&(this._checked=e,this.buttonToggleGroup&&this.buttonToggleGroup._syncButtonToggle(this,this._checked),this._changeDetectorRef.markForCheck())}get disabled(){return this._disabled||this.buttonToggleGroup&&this.buttonToggleGroup.disabled}set disabled(e){this._disabled=e}constructor(e,a,o,l,r,h){this._changeDetectorRef=a,this._elementRef=o,this._focusMonitor=l,this._checked=!1,this.ariaLabelledby=null,this._disabled=!1,this.change=new t.bkB;const c=Number(r);this.tabIndex=c||0===c?c:null,this.buttonToggleGroup=e,this.appearance=h&&h.appearance?h.appearance:"standard"}ngOnInit(){const e=this.buttonToggleGroup;this.id=this.id||"mat-button-toggle-"+_++,e&&(e._isPrechecked(this)?this.checked=!0:e._isSelected(this)!==this._checked&&e._syncButtonToggle(this,this._checked))}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0)}ngOnDestroy(){const e=this.buttonToggleGroup;this._focusMonitor.stopMonitoring(this._elementRef),e&&e._isSelected(this)&&e._syncButtonToggle(this,!1,!1,!0)}focus(e){this._buttonElement.nativeElement.focus(e)}_onButtonClick(){const e=!!this._isSingleSelector()||!this._checked;e!==this._checked&&(this._checked=e,this.buttonToggleGroup&&(this.buttonToggleGroup._syncButtonToggle(this,this._checked,!0),this.buttonToggleGroup._onTouched())),this.change.emit(new T(this,this.value))}_markForCheck(){this._changeDetectorRef.markForCheck()}_getButtonName(){return this._isSingleSelector()?this.buttonToggleGroup.name:this.name||null}_isSingleSelector(){return this.buttonToggleGroup&&!this.buttonToggleGroup.multiple}static#t=this.\u0275fac=function(a){return new(a||n)(t.rXU(k,8),t.rXU(t.gRc),t.rXU(t.aKT),t.rXU(w.FN),t.kS0("tabindex"),t.rXU(v,8))};static#e=this.\u0275cmp=t.VBU({type:n,selectors:[["mat-button-toggle"]],viewQuery:function(a,o){if(1&a&&t.GBs(D,5),2&a){let l;t.mGM(l=t.lsd())&&(o._buttonElement=l.first)}},hostAttrs:["role","presentation",1,"mat-button-toggle"],hostVars:12,hostBindings:function(a,o){1&a&&t.bIt("focus",function(){return o.focus()}),2&a&&(t.BMQ("aria-label",null)("aria-labelledby",null)("id",o.id)("name",null),t.AVh("mat-button-toggle-standalone",!o.buttonToggleGroup)("mat-button-toggle-checked",o.checked)("mat-button-toggle-disabled",o.disabled)("mat-button-toggle-appearance-standard","standard"===o.appearance))},inputs:{ariaLabel:[t.Mj6.None,"aria-label","ariaLabel"],ariaLabelledby:[t.Mj6.None,"aria-labelledby","ariaLabelledby"],id:"id",name:"name",value:"value",tabIndex:"tabIndex",disableRipple:[t.Mj6.HasDecoratorInputTransform,"disableRipple","disableRipple",t.L39],appearance:"appearance",checked:[t.Mj6.HasDecoratorInputTransform,"checked","checked",t.L39],disabled:[t.Mj6.HasDecoratorInputTransform,"disabled","disabled",t.L39]},outputs:{change:"change"},exportAs:["matButtonToggle"],standalone:!0,features:[t.GFd,t.aNF],ngContentSelectors:R,decls:8,vars:11,consts:[["button",""],["type","button",1,"mat-button-toggle-button","mat-focus-indicator",3,"click","id","disabled"],[1,"mat-button-toggle-label-content"],["state","checked","aria-hidden","true","appearance","minimal",1,"mat-mdc-option-pseudo-checkbox",3,"disabled"],[1,"mat-button-toggle-focus-overlay"],["matRipple","",1,"mat-button-toggle-ripple",3,"matRippleTrigger","matRippleDisabled"]],template:function(a,o){if(1&a){const l=t.RV6();t.NAR(),t.j41(0,"button",1,0),t.bIt("click",function(){return t.eBV(l),t.Njj(o._onButtonClick())}),t.j41(2,"span",2),t.DNE(3,F,1,1,"mat-pseudo-checkbox",3)(4,A,1,1,"mat-pseudo-checkbox",3),t.SdG(5),t.k0s()(),t.nrm(6,"span",4)(7,"span",5)}if(2&a){const l=t.sdS(1);t.Y8G("id",o.buttonId)("disabled",o.disabled||null),t.BMQ("tabindex",o.disabled?-1:o.tabIndex)("aria-pressed",o.checked)("name",o._getButtonName())("aria-label",o.ariaLabel)("aria-labelledby",o.ariaLabelledby),t.R7$(3),t.vxM(3,o.buttonToggleGroup&&o.checked&&!o.buttonToggleGroup.multiple&&!o.buttonToggleGroup.hideSingleSelectionIndicator?3:-1),t.R7$(),t.vxM(4,o.buttonToggleGroup&&o.checked&&o.buttonToggleGroup.multiple&&!o.buttonToggleGroup.hideMultipleSelectionIndicator?4:-1),t.R7$(3),t.Y8G("matRippleTrigger",l)("matRippleDisabled",o.disableRipple||o.disabled)}},dependencies:[b.r6,b.wg],styles:[".mat-button-toggle-standalone,.mat-button-toggle-group{position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0);transform:translateZ(0);border-radius:var(--mat-legacy-button-toggle-shape)}.mat-button-toggle-standalone:not([class*=mat-elevation-z]),.mat-button-toggle-group:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{border-radius:var(--mat-standard-button-toggle-shape);border:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox{--mat-minimal-pseudo-checkbox-selected-checkmark-color: var( --mat-standard-button-toggle-selected-state-text-color )}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]){box-shadow:none}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative;color:var(--mat-legacy-button-toggle-text-color);font-family:var(--mat-legacy-button-toggle-label-text-font);font-size:var(--mat-legacy-button-toggle-label-text-size);line-height:var(--mat-legacy-button-toggle-label-text-line-height);font-weight:var(--mat-legacy-button-toggle-label-text-weight);letter-spacing:var(--mat-legacy-button-toggle-label-text-tracking);--mat-minimal-pseudo-checkbox-selected-checkmark-color: var( --mat-legacy-button-toggle-selected-state-text-color )}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:var(--mat-legacy-button-toggle-focus-state-layer-opacity)}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle .mat-pseudo-checkbox{margin-right:12px}[dir=rtl] .mat-button-toggle .mat-pseudo-checkbox{margin-right:0;margin-left:12px}.mat-button-toggle-checked{color:var(--mat-legacy-button-toggle-selected-state-text-color);background-color:var(--mat-legacy-button-toggle-selected-state-background-color)}.mat-button-toggle-disabled{color:var(--mat-legacy-button-toggle-disabled-state-text-color);background-color:var(--mat-legacy-button-toggle-disabled-state-background-color);--mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: var( --mat-legacy-button-toggle-disabled-state-text-color )}.mat-button-toggle-disabled.mat-button-toggle-checked{background-color:var(--mat-legacy-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard{color:var(--mat-standard-button-toggle-text-color);background-color:var(--mat-standard-button-toggle-background-color);font-family:var(--mat-standard-button-toggle-label-text-font);font-size:var(--mat-standard-button-toggle-label-text-size);line-height:var(--mat-standard-button-toggle-label-text-line-height);font-weight:var(--mat-standard-button-toggle-label-text-weight);letter-spacing:var(--mat-standard-button-toggle-label-text-tracking)}.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:solid 1px var(--mat-standard-button-toggle-divider-color)}[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:none;border-top:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-selected-state-text-color);background-color:var(--mat-standard-button-toggle-selected-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled{color:var(--mat-standard-button-toggle-disabled-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox{--mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: var( --mat-standard-button-toggle-disabled-selected-state-text-color )}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-disabled-selected-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{background-color:var(--mat-standard-button-toggle-state-layer-color)}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-hover-state-layer-opacity)}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-focus-state-layer-opacity)}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;user-select:none;display:inline-block;padding:0 16px;line-height:var(--mat-legacy-button-toggle-height);position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{padding:0 12px;line-height:var(--mat-standard-button-toggle-height)}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;pointer-events:none;opacity:0;background-color:var(--mat-legacy-button-toggle-state-layer-color)}.cdk-high-contrast-active .mat-button-toggle-checked .mat-button-toggle-focus-overlay{border-bottom:solid 500px;opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay{opacity:.6}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 500px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard{--mat-focus-indicator-border-radius:var(--mat-standard-button-toggle-shape)}.mat-button-toggle-group-appearance-standard .mat-button-toggle:last-of-type .mat-button-toggle-button::before{border-top-right-radius:var(--mat-standard-button-toggle-shape);border-bottom-right-radius:var(--mat-standard-button-toggle-shape)}.mat-button-toggle-group-appearance-standard .mat-button-toggle:first-of-type .mat-button-toggle-button::before{border-top-left-radius:var(--mat-standard-button-toggle-shape);border-bottom-left-radius:var(--mat-standard-button-toggle-shape)}"],encapsulation:2,changeDetection:0})}return n})(),N=(()=>{class n{static#t=this.\u0275fac=function(a){return new(a||n)};static#e=this.\u0275mod=t.$C({type:n});static#o=this.\u0275inj=t.G2t({imports:[b.yE,b.pZ,m,b.yE]})}return n})();var S=i(2765),C=i(1801),G=i(3162),P=i(5888),x=i(140),B=i(6070),f=i(4739),g=i(1380),O=i(2999),U=i(1517),j=i(7877),H=i(9263);const X=()=>[],W=(n,u,e)=>({positionCodes:n,score:0,characterKeyPositionCode:0,layer:u,shiftKey:e,altGraphKey:!1});function Q(n,u){if(1&n&&(t.j41(0,"mat-button-toggle",2)(1,"mat-icon"),t.EFF(2),t.k0s()()),2&n){const e=u.$implicit;t.Y8G("value",e.value),t.R7$(2),t.JRh(e.icon)}}function z(n,u){if(1&n&&t.nrm(0,"app-layout",4),2&n){const e=t.XpG();t.Y8G("showThumb3Switch",e.visibilitySettingStore.layoutThumb3Switch())("keyLabelMap",u)("highlightKeyCombination",t.sMw(4,W,t.lJ4(3,X),e.currentLayer(),e.shiftKey()))}}let $=(()=>{class n{constructor(){this.classes="flex flex-col gap-2 h-screen",this.highlightSettingStore=(0,t.WQX)(U.M),this.visibilitySettingStore=(0,t.WQX)(H.e),this.keyboardLayout=(0,t.WQX)(j.h).selectedEntity,this.deviceLayout=(0,t.WQX)(O.G).selectedEntity,this.Layer=g.W,this.layers=[{value:g.W.Primary,icon:"abc"},{value:g.W.Secondary,icon:"123"},{value:g.W.Tertiary,icon:"function"}],this.currentLayer=(0,t.vPA)(g.W.Primary),this.shiftKey=(0,t.vPA)(!1),this.keyLabelMap=(0,t.EWP)(()=>{const e={},a=this.deviceLayout(),o=this.keyboardLayout();if(!a||!o)return null;for(const l of(0,G.A)(0,90)){const r=[];for(const h of(0,G.A)(0,3)){let c=g.W.Primary;1===h?c=g.W.Secondary:2===h&&(c=g.W.Tertiary);const I=a.layout[h][l],d=x.kl.find(s=>s.codeId===I);if(d?.type===f.X.WSK&&d.keyCode){const s=o.layout[d?.keyCode];d?.withShift?s?.withShift&&r.push({type:g.g.String,c:s.withShift,layer:c,shiftKey:!1,altGraphKey:!1},{type:g.g.String,c:s.withShift,layer:c,shiftKey:!0,altGraphKey:!1}):(s?.unmodified&&r.push({type:g.g.String,c:s.unmodified,layer:c,shiftKey:!1,altGraphKey:!1}),s?.withShift&&r.push({type:g.g.String,c:s.withShift,layer:c,shiftKey:!0,altGraphKey:!1}))}else if(d?.type===f.X.NonWSK&&d.keyCode){const s=B.Ud[d.keyCode];s&&r.push({...s,layer:c,shiftKey:!1,altGraphKey:!1})}else if(d?.type===f.X.NonKey&&d.actionName){const s=B.rK[d.actionName];s&&r.push({...s,layer:c,shiftKey:!1,altGraphKey:!1})}else if(x.bt.includes(I))continue}e[l]=r}return e})}static#t=this.\u0275fac=function(a){return new(a||n)};static#e=this.\u0275cmp=t.VBU({type:n,selectors:[["app-layout-viewer-page"]],hostVars:2,hostBindings:function(a,o){2&a&&t.HbH(o.classes)},standalone:!0,features:[t.aNF],decls:7,vars:3,consts:[[1,"flex","flex-none","items-center","gap-8","bg-gray-700"],[3,"ngModelChange","ngModel"],[3,"value"],["color","primary",3,"ngModelChange","ngModel"],[1,"block","flex-1","overflow-hidden","px-5","pb-5",3,"showThumb3Switch","keyLabelMap","highlightKeyCombination"]],template:function(a,o){if(1&a&&(t.j41(0,"section",0)(1,"mat-button-toggle-group",1),t.mxI("ngModelChange",function(r){return t.DH7(o.currentLayer,r)||(o.currentLayer=r),r}),t.Z7z(2,Q,3,2,"mat-button-toggle",2,t.Vm6),t.k0s(),t.j41(4,"mat-checkbox",3),t.mxI("ngModelChange",function(r){return t.DH7(o.shiftKey,r)||(o.shiftKey=r),r}),t.EFF(5,"Shift"),t.k0s()(),t.DNE(6,z,1,8,"app-layout",4)),2&a){let l;t.R7$(),t.R50("ngModel",o.currentLayer),t.R7$(),t.Dyx(o.layers),t.R7$(2),t.R50("ngModel",o.shiftKey),t.R7$(2),t.vxM(6,(l=o.keyLabelMap())?6:-1,l)}},dependencies:[L.MD,P.C,N,M,m,C.m_,C.An,S.g7,S.So,p.YN,p.BC,p.vS],encapsulation:2,changeDetection:0})}return n})()}}]);