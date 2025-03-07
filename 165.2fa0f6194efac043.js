"use strict";(self.webpackChunkalnitak=self.webpackChunkalnitak||[]).push([[165],{5165:(V,l,u)=>{u.r(l),u.d(l,{LayoutSchematicPageComponent:()=>D});var R=u(177),e=u(9590);function y(n,r){const o=!r?.manualCleanup;o&&!r?.injector&&(0,e.Af3)(y);const a=o?r?.injector?.get(e.abz)??(0,e.WQX)(e.abz):null;let t;t=(0,e.vPA)(r?.requireSync?{kind:0}:{kind:1,value:r?.initialValue});const s=n.subscribe({next:i=>t.set({kind:1,value:i}),error:i=>{if(r?.rejectErrors)throw i;t.set({kind:2,error:i})}});return a?.onDestroy(s.unsubscribe.bind(s)),(0,e.EWP)(()=>{const i=t();switch(i.kind){case 1:return i.value;case 2:throw i.error;case 0:throw new e.wOt(601,"`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.")}})}var h=u(2102),p=u(2798),F=u(1584),$=u(4165),c=u(1380),E=u(6600);const m=()=>({x:175,y:175}),g=()=>({c:0,e:1,s:2,w:3,n:4}),b=n=>[n],f=()=>[],v=(n,r)=>({characterKeyPositionCode:0,layer:n,shiftKey:!1,altGraphKey:!1,positionCodes:r,score:0});function C(n,r){if(1&n&&(e.j41(0,"mat-option",1),e.EFF(1),e.k0s()),2&n){const o=r.$implicit;e.Y8G("value",r.$index),e.R7$(),e.JRh(o.name)}}function j(n,r){if(1&n&&(e.j41(0,"mat-option",1),e.EFF(1),e.k0s()),2&n){const o=r.$implicit;e.Y8G("value",o.value),e.R7$(),e.JRh(o.name)}}function I(n,r){if(1&n&&(e.j41(0,"div",16),e.EFF(1),e.k0s()),2&n){const o=r.$implicit,a=r.$index,t=e.XpG();e.AVh("bg-alnitak-500",a===t.keyIndex()&&t.scancodeOn()),e.R7$(),e.SpI(" ",o," ")}}function x(n,r){if(1&n&&(e.j41(0,"div",17),e.EFF(1),e.k0s()),2&n){const o=r.$implicit,a=r.$index,t=e.XpG();e.AVh("bg-alnitak-500",a===t.keyIndex()&&t.osOn()),e.R7$(),e.SpI(" ",o," ")}}function P(n,r){if(1&n&&(e.j41(0,"div",17),e.EFF(1),e.k0s()),2&n){const o=r.$implicit,a=r.$index,t=e.XpG();e.AVh("bg-alnitak-500",a===t.keyIndex()&&t.osOn()),e.R7$(),e.SpI(" ",o," ")}}const O=[{name:"QWERTY",keys:["1","q","a","z"]},{name:"QWERTZ",keys:["1","q","a","y"]},{name:"JCUKEN",keys:["1","\u0439","\u0444","\u044f"]},{name:"Standard Bopomofo",keys:["\u3105","\u3106","\u3107","\u3108"],isBopomofo:!0},{name:"\u5927\u5343\u6ce8\u97f3",keys:["\u3105","\u3106","\u3107","\u3108"],isBopomofo:!0}],K={Keyboard:"Keyboard",Scancode:"Scancode",OSLayout:"OS Layout",DeviceLayout:"Device Layout",Output:"Output"},w={Keyboard:"\u9375\u76e4",Scancode:"\u6383\u63cf\u78bc",OSLayout:"\u4f5c\u696d\u7cfb\u7d71\u4f48\u5c40",DeviceLayout:"\u88dd\u7f6e\u4f48\u5c40",Output:"\u8f38\u51fa"};let D=(()=>{class n{constructor(){this.Layer=c.W,this.scancodes=["1E","14","04","1D"],this.keyLabelMap={1:[{type:c.g.String,c:"1",title:"Character: 1",layer:null,shiftKey:null,altGraphKey:null}],2:[{type:c.g.String,c:"q",title:"Character: q",layer:null,shiftKey:null,altGraphKey:null}],3:[{type:c.g.String,c:"a",title:"Character: a",layer:null,shiftKey:null,altGraphKey:null}],4:[{type:c.g.String,c:"z",title:"Character: z",layer:null,shiftKey:null,altGraphKey:null}]},this.scancodeLabelMap={1:[{type:c.g.String,c:"1E",title:"Scancode: 1E",layer:null,shiftKey:null,altGraphKey:null}],2:[{type:c.g.String,c:"14",title:"Scancode: 14",layer:null,shiftKey:null,altGraphKey:null}],3:[{type:c.g.String,c:"04",title:"Scancode: 04",layer:null,shiftKey:null,altGraphKey:null}],4:[{type:c.g.String,c:"1D",title:"Scancode: 1D",layer:null,shiftKey:null,altGraphKey:null}]},this.languages=[{name:"English",value:"en"},{name:"\u7e41\u9ad4\u4e2d\u6587",value:"zh_Hant"}],this.currentLanguage=(0,e.vPA)("en"),this.text=(0,e.EWP)(()=>"zh_Hant"===this.currentLanguage()?w:K),this.osLayouts=O,this.osLayoutIndex=(0,e.vPA)(0),this.osLayout=(0,e.EWP)(()=>O[this.osLayoutIndex()]),this.osLayoutName=(0,e.EWP)(()=>this.osLayout().name),this.osLayoutKeys=(0,e.EWP)(()=>this.osLayout().keys),this.timer=y((0,F.O)(0,750)),this.keyIndex=(0,e.EWP)(()=>Math.floor(this.timer()/4)%4),this.scancodeOn=(0,e.EWP)(()=>this.timer()%4>=1),this.scancodeOutputOn=(0,e.EWP)(()=>this.timer()%4>=1),this.osOn=(0,e.EWP)(()=>this.timer()%4>=2),this.osOutputOn=(0,e.EWP)(()=>this.timer()%4>=2),this.outputPrintOn=(0,e.EWP)(()=>this.timer()%4>=3),this.currentScancode=(0,e.EWP)(()=>this.scancodes[this.keyIndex()]),this.currentKey=(0,e.EWP)(()=>this.osLayoutKeys()[this.keyIndex()]),this.currentOutput=(0,e.EWP)(()=>{const{keys:o,isBopomofo:a}=this.osLayout(),t=this.outputPrintOn(),s=this.keyIndex();if(a){const S=t?s:s-1;return S<0?"":o[S]}return o.slice(0,t?s+1:s).join("")})}onOsLayoutIndexChange(o){this.osLayoutIndex.set(o)}onLanguageChange(o){this.currentLanguage.set(o)}static#e=this.\u0275fac=function(a){return new(a||n)};static#t=this.\u0275cmp=e.VBU({type:n,selectors:[["app-layout-schematic-page"]],standalone:!0,features:[e.aNF],decls:61,vars:70,consts:[[3,"valueChange","value"],[3,"value"],[1,"flex","gap-3","p-2"],[1,"flex","w-[130px]","flex-col","items-center","gap-1","rounded-sm","border","border-solid","border-gray-200","p-2","text-center"],[1,"size-8","content-center","rounded-md","border","border-solid","border-white","text-center",3,"bg-alnitak-500"],[1,"flex","h-[210px]","w-12","flex-col","items-center","justify-center","gap-1"],[1,"arrow"],[1,"opacity-0"],[1,"flex","flex-col","items-center","gap-1","rounded-sm","border","border-solid","border-gray-200","p-2","text-center"],[1,"size-8","content-center","rounded-md","border","border-solid","border-white","text-center","transition-colors",3,"bg-alnitak-500"],[1,"relative","flex","flex-col","items-center","gap-1","rounded-sm","border","border-solid","border-gray-200","p-2"],[1,"absolute","left-1/2","top-1/2","-translate-x-1/2","-translate-y-1/2","text-alnitak-200","underline-offset-2"],["viewBox","0 0 350 350","preserveAspectRatio","xMidYMid meet",1,"size-20"],["appSwitch","",3,"center","rotationDirection","positionCodeMap","highlightKeyCombination","keyLabelMap","highlightOpacity","strokeWidth","fontSize"],[1,"flex","flex-col","items-center","gap-1","self-start","rounded-sm","border","border-solid","border-gray-200","p-2","text-center"],[1,"relative","flex","h-[210px]","flex-col","items-center","gap-1","rounded-sm","border","border-solid","border-gray-200","p-2"],[1,"size-8","content-center","rounded-md","border","border-solid","border-white","text-center"],[1,"size-8","content-center","rounded-md","border","border-solid","border-white","text-center","transition-colors"]],template:function(a,t){1&a&&(e.j41(0,"mat-form-field")(1,"mat-select",0),e.bIt("valueChange",function(i){return t.onOsLayoutIndexChange(i)}),e.Z7z(2,C,2,2,"mat-option",1,e.Vm6),e.k0s()(),e.j41(4,"mat-form-field")(5,"mat-select",0),e.bIt("valueChange",function(i){return t.onLanguageChange(i)}),e.Z7z(6,j,2,2,"mat-option",1,e.Vm6),e.k0s()(),e.j41(8,"div",2)(9,"div",3),e.EFF(10),e.nrm(11,"br"),e.EFF(12),e.Z7z(13,I,2,3,"div",4,e.Vm6),e.k0s(),e.j41(15,"div",5),e.nrm(16,"div",6),e.j41(17,"span",7),e.EFF(18),e.k0s()(),e.j41(19,"div",8),e.EFF(20),e.nrm(21,"br"),e.EFF(22),e.Z7z(23,x,2,3,"div",9,e.Vm6),e.k0s(),e.j41(25,"div",5),e.nrm(26,"div",6),e.j41(27,"span",7),e.EFF(28),e.k0s()(),e.j41(29,"div",10),e.EFF(30),e.j41(31,"span",11),e.EFF(32),e.k0s()()(),e.j41(33,"div",2)(34,"div",3),e.EFF(35," CC1 / M4G "),e.nrm(36,"br"),e.EFF(37),e.qSk(),e.j41(38,"svg",12),e.nrm(39,"g",13),e.k0s(),e.EFF(40),e.j41(41,"svg",12),e.nrm(42,"g",13),e.k0s()(),e.joV(),e.j41(43,"div",5),e.nrm(44,"div",6),e.j41(45,"span",7),e.EFF(46),e.k0s()(),e.j41(47,"div",14),e.EFF(48),e.nrm(49,"br"),e.EFF(50),e.Z7z(51,P,2,3,"div",9,e.Vm6),e.k0s(),e.j41(53,"div",5),e.nrm(54,"div",6),e.j41(55,"span",7),e.EFF(56),e.k0s()(),e.j41(57,"div",15),e.EFF(58),e.j41(59,"span",11),e.EFF(60),e.k0s()()()),2&a&&(e.R7$(),e.Y8G("value",t.osLayoutIndex()),e.R7$(),e.Dyx(t.osLayouts),e.R7$(3),e.Y8G("value",t.currentLanguage()),e.R7$(),e.Dyx(t.languages),e.R7$(4),e.SpI(" ",t.text().Keyboard," "),e.R7$(2),e.SpI(" (",t.text().Scancode,") "),e.R7$(),e.Dyx(t.scancodes),e.R7$(3),e.AVh("bg-alnitak-200",t.scancodeOutputOn()),e.R7$(),e.AVh("!opacity-100",t.scancodeOutputOn()),e.R7$(),e.JRh(t.currentScancode()),e.R7$(2),e.SpI(" ",t.text().OSLayout," "),e.R7$(2),e.SpI(" ",t.osLayoutName()," "),e.R7$(),e.Dyx(t.osLayoutKeys()),e.R7$(3),e.AVh("bg-alnitak-200",t.osOutputOn()),e.R7$(),e.AVh("!opacity-100",t.osOutputOn()),e.R7$(),e.JRh(t.currentKey()),e.R7$(2),e.SpI(" ",t.text().Output," "),e.R7$(),e.AVh("underline",t.osLayout().isBopomofo),e.R7$(),e.JRh(t.currentOutput()),e.R7$(5),e.SpI(" (",t.text().DeviceLayout,") "),e.R7$(2),e.Y8G("center",e.lJ4(54,m))("rotationDirection","cw")("positionCodeMap",e.lJ4(55,g))("highlightKeyCombination",e.l_i(59,v,t.Layer.Primary,t.scancodeOn()?e.eq3(56,b,t.keyIndex()+1):e.lJ4(58,f)))("keyLabelMap",t.keyLabelMap)("highlightOpacity",1)("strokeWidth",4.375)("fontSize",70),e.R7$(),e.SpI(" (",t.text().Scancode,") "),e.R7$(2),e.Y8G("center",e.lJ4(62,m))("rotationDirection","cw")("positionCodeMap",e.lJ4(63,g))("highlightKeyCombination",e.l_i(67,v,t.Layer.Primary,t.scancodeOn()?e.eq3(64,b,t.keyIndex()+1):e.lJ4(66,f)))("keyLabelMap",t.scancodeLabelMap)("highlightOpacity",1)("strokeWidth",4.375)("fontSize",70),e.R7$(2),e.AVh("bg-alnitak-200",t.scancodeOutputOn()),e.R7$(),e.AVh("!opacity-100",t.scancodeOutputOn()),e.R7$(),e.JRh(t.currentScancode()),e.R7$(2),e.SpI(" ",t.text().OSLayout," "),e.R7$(2),e.SpI(" ",t.osLayoutName()," "),e.R7$(),e.Dyx(t.osLayoutKeys()),e.R7$(3),e.AVh("bg-alnitak-200",t.osOutputOn()),e.R7$(),e.AVh("!opacity-100",t.osOutputOn()),e.R7$(),e.JRh(t.currentKey()),e.R7$(2),e.SpI(" ",t.text().Output," "),e.R7$(),e.AVh("underline",t.osLayout().isBopomofo),e.R7$(),e.JRh(t.currentOutput()))},dependencies:[R.MD,h.RG,h.rl,p.Ve,p.VO,E.wT,$.c],styles:[".arrow[_ngcontent-%COMP%]{width:48px;height:31.1px;clip-path:polygon(0 32.3%,67.6% 32.3%,67.6% 0,100% 50%,67.6% 100%,67.6% 67.7%,0 67.7%)}"],changeDetection:0})}return n})()}}]);