"use strict";(self.webpackChunkalnitak=self.webpackChunkalnitak||[]).push([[165],{5165:(K,l,c)=>{c.r(l),c.d(l,{LayoutSchematicPageComponent:()=>I});var k=c(177),e=c(9590);function d(n,o){const s=!o?.manualCleanup;s&&!o?.injector&&(0,e.Af3)(d);const r=s?o?.injector?.get(e.abz)??(0,e.WQX)(e.abz):null;let t;t=(0,e.vPA)(o?.requireSync?{kind:0}:{kind:1,value:o?.initialValue});const a=n.subscribe({next:i=>t.set({kind:1,value:i}),error:i=>{if(o?.rejectErrors)throw i;t.set({kind:2,error:i})}});return r?.onDestroy(a.unsubscribe.bind(a)),(0,e.EWP)(()=>{const i=t();switch(i.kind){case 1:return i.value;case 2:throw i.error;case 0:throw new e.wOt(601,"`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.")}})}var y=c(2102),h=c(2798),L=c(1584),$=c(4165),j=c(1380),E=c(6600);const p=()=>({x:175,y:175}),m=()=>({c:0,e:1,n:2,w:3,s:4}),b=n=>[n],f=()=>[],g=(n,o)=>({characterKeyPositionCode:0,layer:n,shiftKey:!1,altGraphKey:!1,positionCodes:o,score:0});function S(n,o){if(1&n&&(e.j41(0,"mat-option",1),e.EFF(1),e.k0s()),2&n){const s=o.$implicit;e.Y8G("value",o.$index),e.R7$(),e.JRh(s.name)}}function x(n,o){if(1&n&&(e.j41(0,"div",16),e.EFF(1),e.k0s()),2&n){const s=o.$implicit,r=o.$index,t=e.XpG();e.AVh("bg-alnitak-500",r===t.keyIndex()&&t.scancodeOn()),e.R7$(),e.SpI(" ",s," ")}}function C(n,o){if(1&n&&(e.j41(0,"div",17),e.EFF(1),e.k0s()),2&n){const s=o.$implicit,r=o.$index,t=e.XpG();e.AVh("bg-alnitak-500",r===t.keyIndex()&&t.osOn()),e.R7$(),e.SpI(" ",s," ")}}function w(n,o){if(1&n&&(e.j41(0,"div",17),e.EFF(1),e.k0s()),2&n){const s=o.$implicit,r=o.$index,t=e.XpG();e.AVh("bg-alnitak-500",r===t.keyIndex()&&t.osOn()),e.R7$(),e.SpI(" ",s," ")}}const v=[{name:"QWERTY",keys:["1","q","a","z"]},{name:"QWERTZ",keys:["1","q","a","y"]},{name:"JCUKEN",keys:["1","\u0439","\u0444","\u044f"]},{name:"Standard Bopomofo",keys:["\u3105","\u3106","\u3107","\u3108"],isBopomofo:!0},{name:"\u6a19\u6e96\u6ce8\u97f3",keys:["\u3105","\u3106","\u3107","\u3108"],isBopomofo:!0}];let I=(()=>{class n{constructor(){this.Layer=j.W,this.scancodes=["1E","14","04","1D"],this.keyLabelMap={1:[{c:"1",layer:null,shiftKey:null,altGraphKey:null}],2:[{c:"q",layer:null,shiftKey:null,altGraphKey:null}],3:[{c:"a",layer:null,shiftKey:null,altGraphKey:null}],4:[{c:"z",layer:null,shiftKey:null,altGraphKey:null}]},this.scancodeLabelMap={1:[{c:"1E",layer:null,shiftKey:null,altGraphKey:null}],2:[{c:"14",layer:null,shiftKey:null,altGraphKey:null}],3:[{c:"04",layer:null,shiftKey:null,altGraphKey:null}],4:[{c:"1D",layer:null,shiftKey:null,altGraphKey:null}]},this.osLayouts=v,this.osLayoutIndex=(0,e.vPA)(0),this.osLayout=(0,e.EWP)(()=>v[this.osLayoutIndex()]),this.osLayoutName=(0,e.EWP)(()=>this.osLayout().name),this.osLayoutKeys=(0,e.EWP)(()=>this.osLayout().keys),this.timer=d((0,L.O)(0,750)),this.keyIndex=(0,e.EWP)(()=>Math.floor(this.timer()/4)%4),this.scancodeOn=(0,e.EWP)(()=>this.timer()%4>=1),this.scancodeOutputOn=(0,e.EWP)(()=>this.timer()%4>=1),this.osOn=(0,e.EWP)(()=>this.timer()%4>=2),this.osOutputOn=(0,e.EWP)(()=>this.timer()%4>=2),this.outputPrintOn=(0,e.EWP)(()=>this.timer()%4>=3),this.currentScancode=(0,e.EWP)(()=>this.scancodes[this.keyIndex()]),this.currentKey=(0,e.EWP)(()=>this.osLayoutKeys()[this.keyIndex()]),this.currentOutput=(0,e.EWP)(()=>{const{keys:s,isBopomofo:r}=this.osLayout(),t=this.outputPrintOn(),a=this.keyIndex();if(r){const O=t?a:a-1;return O<0?"":s[O]}return s.slice(0,t?a+1:a).join("")})}onOsLayoutIndexChange(s){this.osLayoutIndex.set(s)}static#e=this.\u0275fac=function(r){return new(r||n)};static#t=this.\u0275cmp=e.VBU({type:n,selectors:[["app-layout-schematic-page"]],standalone:!0,features:[e.aNF],decls:57,vars:61,consts:[[3,"valueChange","value"],[3,"value"],[1,"flex","gap-3","p-2"],[1,"flex","w-[130px]","flex-col","items-center","gap-1","rounded-sm","border","border-solid","border-gray-200","p-2","text-center"],[1,"size-8","content-center","rounded-md","border","border-solid","border-white","text-center",3,"bg-alnitak-500"],[1,"flex","h-[210px]","w-12","flex-col","items-center","justify-center","gap-1"],[1,"arrow"],[1,"opacity-0"],[1,"flex","flex-col","items-center","gap-1","rounded-sm","border","border-solid","border-gray-200","p-2","text-center"],[1,"size-8","content-center","rounded-md","border","border-solid","border-white","text-center","transition-colors",3,"bg-alnitak-500"],[1,"relative","flex","flex-col","items-center","gap-1","rounded-sm","border","border-solid","border-gray-200","p-2"],[1,"absolute","left-1/2","top-1/2","-translate-x-1/2","-translate-y-1/2","text-alnitak-200","underline-offset-2"],["viewBox","0 0 350 350","preserveAspectRatio","xMidYMid meet",1,"size-20"],["appSwitch","",3,"center","rotationDirection","positionCodeMap","highlightKeyCombination","keyLabelMap","highlightOpacity","strokeWidth","fontSize"],[1,"flex","flex-col","items-center","gap-1","self-start","rounded-sm","border","border-solid","border-gray-200","p-2","text-center"],[1,"relative","flex","h-[210px]","flex-col","items-center","gap-1","rounded-sm","border","border-solid","border-gray-200","p-2"],[1,"size-8","content-center","rounded-md","border","border-solid","border-white","text-center"],[1,"size-8","content-center","rounded-md","border","border-solid","border-white","text-center","transition-colors"]],template:function(r,t){1&r&&(e.j41(0,"mat-form-field")(1,"mat-select",0),e.bIt("valueChange",function(i){return t.onOsLayoutIndexChange(i)}),e.Z7z(2,S,2,2,"mat-option",1,e.Vm6),e.k0s()(),e.j41(4,"div",2)(5,"div",3),e.EFF(6," Keyboard "),e.nrm(7,"br"),e.EFF(8," (Scancode) "),e.Z7z(9,x,2,3,"div",4,e.Vm6),e.k0s(),e.j41(11,"div",5),e.nrm(12,"div",6),e.j41(13,"span",7),e.EFF(14),e.k0s()(),e.j41(15,"div",8),e.EFF(16," OS Layout "),e.nrm(17,"br"),e.EFF(18),e.Z7z(19,C,2,3,"div",9,e.Vm6),e.k0s(),e.j41(21,"div",5),e.nrm(22,"div",6),e.j41(23,"span",7),e.EFF(24),e.k0s()(),e.j41(25,"div",10),e.EFF(26," Output "),e.j41(27,"span",11),e.EFF(28),e.k0s()()(),e.j41(29,"div",2)(30,"div",3),e.EFF(31," CC1 / M4G "),e.nrm(32,"br"),e.EFF(33," (Device Layout) "),e.qSk(),e.j41(34,"svg",12),e.nrm(35,"g",13),e.k0s(),e.EFF(36," (Scancode) "),e.j41(37,"svg",12),e.nrm(38,"g",13),e.k0s()(),e.joV(),e.j41(39,"div",5),e.nrm(40,"div",6),e.j41(41,"span",7),e.EFF(42),e.k0s()(),e.j41(43,"div",14),e.EFF(44," OS Layout "),e.nrm(45,"br"),e.EFF(46),e.Z7z(47,w,2,3,"div",9,e.Vm6),e.k0s(),e.j41(49,"div",5),e.nrm(50,"div",6),e.j41(51,"span",7),e.EFF(52),e.k0s()(),e.j41(53,"div",15),e.EFF(54," Output "),e.j41(55,"span",11),e.EFF(56),e.k0s()()()),2&r&&(e.R7$(),e.Y8G("value",t.osLayoutIndex()),e.R7$(),e.Dyx(t.osLayouts),e.R7$(7),e.Dyx(t.scancodes),e.R7$(3),e.AVh("bg-alnitak-200",t.scancodeOutputOn()),e.R7$(),e.AVh("!opacity-100",t.scancodeOutputOn()),e.R7$(),e.JRh(t.currentScancode()),e.R7$(4),e.SpI(" ",t.osLayoutName()," "),e.R7$(),e.Dyx(t.osLayoutKeys()),e.R7$(3),e.AVh("bg-alnitak-200",t.osOutputOn()),e.R7$(),e.AVh("!opacity-100",t.osOutputOn()),e.R7$(),e.JRh(t.currentKey()),e.R7$(3),e.AVh("underline",t.osLayout().isBopomofo),e.R7$(),e.JRh(t.currentOutput()),e.R7$(7),e.Y8G("center",e.lJ4(45,p))("rotationDirection","cw")("positionCodeMap",e.lJ4(46,m))("highlightKeyCombination",e.l_i(50,g,t.Layer.Primary,t.scancodeOn()?e.eq3(47,b,t.keyIndex()+1):e.lJ4(49,f)))("keyLabelMap",t.keyLabelMap)("highlightOpacity",1)("strokeWidth",4.375)("fontSize",70),e.R7$(3),e.Y8G("center",e.lJ4(53,p))("rotationDirection","cw")("positionCodeMap",e.lJ4(54,m))("highlightKeyCombination",e.l_i(58,g,t.Layer.Primary,t.scancodeOn()?e.eq3(55,b,t.keyIndex()+1):e.lJ4(57,f)))("keyLabelMap",t.scancodeLabelMap)("highlightOpacity",1)("strokeWidth",4.375)("fontSize",70),e.R7$(2),e.AVh("bg-alnitak-200",t.scancodeOutputOn()),e.R7$(),e.AVh("!opacity-100",t.scancodeOutputOn()),e.R7$(),e.JRh(t.currentScancode()),e.R7$(4),e.SpI(" ",t.osLayoutName()," "),e.R7$(),e.Dyx(t.osLayoutKeys()),e.R7$(3),e.AVh("bg-alnitak-200",t.osOutputOn()),e.R7$(),e.AVh("!opacity-100",t.osOutputOn()),e.R7$(),e.JRh(t.currentKey()),e.R7$(3),e.AVh("underline",t.osLayout().isBopomofo),e.R7$(),e.JRh(t.currentOutput()))},dependencies:[k.MD,y.RG,y.rl,h.Ve,h.VO,E.wT,$.c],styles:[".arrow[_ngcontent-%COMP%]{width:48px;height:31.1px;clip-path:polygon(0 32.3%,67.6% 32.3%,67.6% 0,100% 50%,67.6% 100%,67.6% 67.7%,0 67.7%)}"],changeDetection:0})}return n})()}}]);