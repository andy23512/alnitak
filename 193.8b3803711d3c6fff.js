"use strict";(self.webpackChunkalnitak=self.webpackChunkalnitak||[]).push([[193],{7193:(st,y,a)=>{a.r(y),a.d(y,{ChordPageComponent:()=>it});var t=a(9590),f=a(8834),m=a(1801),C=a(8011),d=a(6138),b=a(2510);const j=(0,a(4019).A)(function(r,e){return Array.prototype.slice.call(e,0).sort(r)});var g=a(7508);function I(o,r){if(1&o&&t.EFF(0),2&o){const e=t.XpG().$implicit;t.SpI(" ",e.value," ")}}function x(o,r){if(1&o&&(t.j41(0,"mat-icon"),t.EFF(1),t.k0s()),2&o){const e=t.XpG().$implicit;t.R7$(),t.SpI(" ",e.value," ")}}function E(o,r){1&o&&(t.j41(0,"span"),t.EFF(1,"+"),t.k0s())}function K(o,r){if(1&o&&t.DNE(0,I,1,1)(1,x,2,1)(2,E,2,0,"span"),2&o){const i=r.$index,n=r.$count;t.vxM(0,"character"===r.$implicit.type?0:1),t.R7$(2),t.vxM(2,i!==n-1?2:-1)}}let T=(()=>{class o{constructor(){this.keys=t.hFB.required()}static#t=this.\u0275fac=function(i){return new(i||o)};static#e=this.\u0275cmp=t.VBU({type:o,selectors:[["app-chord-input-keys"]],inputs:{keys:[t.Mj6.SignalBased,"keys"]},standalone:!0,features:[t.aNF],decls:2,vars:0,template:function(i,n){1&i&&t.Z7z(0,K,3,2,null,null,t.Vm6),2&i&&t.Dyx(n.keys())},dependencies:[m.An],encapsulation:2,changeDetection:0})}return o})();function B(o,r){if(1&o&&(t.j41(0,"span"),t.EFF(1),t.k0s()),2&o){const e=t.XpG().$implicit;t.R7$(),t.JRh(e.value)}}function G(o,r){if(1&o&&(t.j41(0,"mat-icon",0),t.EFF(1),t.k0s()),2&o){const e=t.XpG().$implicit;t.Y8G("inline",!0),t.R7$(),t.JRh(e.value)}}function V(o,r){1&o&&t.DNE(0,B,2,1,"span")(1,G,2,2),2&o&&t.vxM(0,"character"===r.$implicit.type?0:1)}let _=(()=>{class o{constructor(){this.keys=t.hFB.required(),this.hostClasses=["inline-flex","align-center"]}static#t=this.\u0275fac=function(i){return new(i||o)};static#e=this.\u0275cmp=t.VBU({type:o,selectors:[["app-chord-output-keys"]],hostVars:2,hostBindings:function(i,n){2&i&&t.HbH(n.hostClasses)},inputs:{keys:[t.Mj6.SignalBased,"keys"]},standalone:!0,features:[t.aNF],decls:2,vars:0,consts:[[3,"inline"]],template:function(i,n){1&i&&t.Z7z(0,V,2,1,null,null,t.Vm6),2&i&&t.Dyx(n.keys())},dependencies:[m.An],encapsulation:2,changeDetection:0})}return o})();const $=["fileInput"],M=(o,r)=>r.id;function D(o,r){if(1&o&&(t.j41(0,"mat-list-option",7),t.nrm(1,"app-chord-input-keys",9),t.EFF(2," -> "),t.nrm(3,"app-chord-output-keys",9),t.k0s()),2&o){const e=r.$implicit,i=t.XpG();t.Y8G("color","primary")("value",e)("togglePosition","before")("selected",i.selectedChordIds().has(e.id)),t.R7$(),t.Y8G("keys",e.inputKeys),t.R7$(2),t.Y8G("keys",e.outputKeys)}}const N=j((o,r)=>o-r);let R=(()=>{class o{constructor(){this.chordStore=(0,t.WQX)(g.C),this.chords=t.hFB.required(),this.selectedChordIds=t.hFB.required(),this.selectionChange=(0,t.CGW)(),this.startPractice=(0,t.CGW)(),this.classes="flex flex-col"}loadChordFile(){if(typeof FileReader>"u")return;const e=this.fileInput.nativeElement;if(null===e.files||0===e.files.length)return;const i=new FileReader;i.onload=n=>{if(!n.target?.result)return;const s=JSON.parse(n.target.result);if(!s)return;let c=null;c=s.history?s.history[0].find(l=>"chords"===l.type):s,c&&(0,d.M8)(this.chordStore,(0,b.a8)(c.chords.map(([l,p])=>{const h=l.filter(nt=>nt>0);return{id:N(h).join("_"),input:h,output:p}})))},i.readAsText(e.files[0])}onChordSelectionChange(e){this.selectionChange.emit(e)}static#t=this.\u0275fac=function(i){return new(i||o)};static#e=this.\u0275cmp=t.VBU({type:o,selectors:[["app-chord-practice-setting"]],viewQuery:function(i,n){if(1&i&&t.GBs($,5),2&i){let s;t.mGM(s=t.lsd())&&(n.fileInput=s.first)}},hostVars:1,hostBindings:function(i,n){2&i&&t.Mr5("classes",n.classes)},inputs:{chords:[t.Mj6.SignalBased,"chords"],selectedChordIds:[t.Mj6.SignalBased,"selectedChordIds"]},outputs:{selectionChange:"selectionChange",startPractice:"startPractice"},standalone:!0,features:[t.aNF],decls:27,vars:3,consts:[["fileInput",""],[1,"flex","h-12","flex-none","items-center","bg-gray-700","px-5"],[1,"flex-1","list-inside","list-decimal","overflow-auto","p-5"],["href","https://manager.charachorder.com/","target","_blank","rel","noopener",1,"underline"],["type","button","mat-flat-button","",1,"my-2",3,"click","color"],["hidden","","type","file","accept",".json","aria-label","file input for selecting a chord map file to load into this tool",3,"change"],[1,"!my-2","max-h-56","overflow-auto","rounded","border",3,"selectionChange"],[3,"color","value","togglePosition","selected"],["type","button","mat-flat-button","",1,"my-2",3,"click","color","disabled"],[3,"keys"]],template:function(i,n){if(1&i){const s=t.RV6();t.j41(0,"section",1),t.EFF(1," Chord - Practice Setting\n"),t.k0s(),t.j41(2,"ol",2)(3,"li"),t.EFF(4," Import your chord list file (the backup file from "),t.j41(5,"a",3),t.EFF(6,"CharaChorder Device Manager"),t.k0s(),t.EFF(7," website). (for first time usage or updating the chord list) "),t.nrm(8,"br"),t.j41(9,"button",4),t.bIt("click",function(){t.eBV(s);const l=t.sdS(14);return t.Njj(l.click())}),t.j41(10,"mat-icon"),t.EFF(11,"upload"),t.k0s(),t.EFF(12," Choose File "),t.k0s(),t.j41(13,"input",5,0),t.bIt("change",function(){return t.eBV(s),t.Njj(n.loadChordFile())}),t.k0s()(),t.j41(15,"li"),t.EFF(16," Select the chords you want to practice from the imported chord list below. "),t.j41(17,"mat-selection-list",6),t.bIt("selectionChange",function(l){return t.eBV(s),t.Njj(n.onChordSelectionChange(l))}),t.Z7z(18,D,4,6,"mat-list-option",7,M),t.k0s()(),t.j41(20,"li"),t.EFF(21," Click the following button to start. "),t.nrm(22,"br"),t.j41(23,"button",8),t.bIt("click",function(){return t.eBV(s),t.Njj(n.startPractice.emit())}),t.j41(24,"mat-icon"),t.EFF(25,"play_arrow"),t.k0s(),t.EFF(26," Start "),t.k0s()()()}2&i&&(t.R7$(9),t.Y8G("color","primary"),t.R7$(9),t.Dyx(n.chords()),t.R7$(5),t.Y8G("color","primary")("disabled",0===n.selectedChordIds().size))},dependencies:[f.$z,m.An,C.p6,C.oh,T,_],encapsulation:2,changeDetection:0})}return o})();var W=a(8954),w=a(6148),X=a(1380),L=a(4796),v=a(6898);const P=(0,d.Eu)({providedIn:"root"},(0,L.JT)("chordPractice"),(0,d.Q2)({chords:null,queue:[],history:[],lastCorrectChordTime:null,chordIntervals:[],buffer:[]}),(0,d.RI)(o=>({setChords(r){(0,d.M8)(o,()=>({chords:r,queue:(0,v.q)(r,20),history:[],chordIntervals:[]}))},keyUp(r){(0,d.M8)(o,({buffer:e,queue:i,chords:n,history:s,lastCorrectChordTime:c,chordIntervals:l})=>{if(!n)return{};const p=Date.now(),h=[...e];return"Backspace"===r.code?h.pop():h.push(r.key),h.join("").trim()===i[0].outputText?{queue:[...i.slice(1),(0,v.Q)(n)],history:[...s,i[0]].slice(-3),lastCorrectChordTime:p,chordIntervals:c?[...l,p-c]:[...l],buffer:[]}:{buffer:h}})}})),(0,d.QO)(o=>({chpm:(0,t.EWP)(()=>{const r=o.chordIntervals(),e=r.reduce((n,s)=>n+s,0)/1e3/60;return 0===e?0:Math.floor(r.length/e)})})));var Y=a(2999),k=a(7877),A=a(9263),u=a(2097),O=a(5888),z=a(8322);const H=["input"];function Z(o,r){1&o&&t.nrm(0,"app-chord-output-keys",5),2&o&&t.Y8G("keys",r.$implicit.outputKeys)}function J(o,r){1&o&&t.nrm(0,"app-chord-output-keys",5),2&o&&t.Y8G("keys",r.$implicit.outputKeys)}function q(o,r){if(1&o&&t.nrm(0,"app-speedometer",15),2&o){const e=t.XpG();t.AVh("opacity-50",e.isFocus()),t.Y8G("speed",e.chordPracticeStore.chpm())("maxSpeed",100)("speedUnit","ChPM")}}let tt=(()=>{class o{constructor(){this.chordPracticeStore=(0,t.WQX)(P),this.visibilitySettingStore=(0,t.WQX)(A.e),this.hotkeys=(0,t.WQX)(W.dr),this.isFocus=(0,t.vPA)(!1),this.shortcuts={startPractice:"space",pausePractice:"escape"},this.classes="flex flex-col h-screen",this.keyboardLayout=(0,t.WQX)(k.h).selectedEntity,this.characterKeyCodeMap=(0,t.EWP)(()=>(0,u.nx)(this.keyboardLayout())),this.deviceLayout=(0,t.WQX)(Y.G).selectedEntity,this.practiceCharactersDevicePositionCodes=(0,t.EWP)(()=>{const e=this.chordPracticeStore.chords(),i=this.deviceLayout(),n=this.keyboardLayout();return[...new Set(e?.map(c=>c.input).flat())].map(c=>{const l=(0,u.VW)(c,n);return l?{c:l.value,characterDeviceKeys:(0,u.F0)({actionCode:c,shiftKey:!1,altGraphKey:!1},i)}:null})}),this.keyLabelMap=(0,t.EWP)(()=>{const e=this.practiceCharactersDevicePositionCodes();if(!e)return{};const i={};return e.forEach(n=>{n?.characterDeviceKeys?.forEach(({characterKeyPositionCode:s,layer:c,shiftKey:l,altGraphKey:p})=>{const h={c:n.c,layer:c,shiftKey:l,altGraphKey:p};i[s]?i[s].push(h):i[s]=[h]})}),i}),this.highlightChordKeyCombinationMap=(0,t.EWP)(()=>{const e=this.chordPracticeStore.chords(),i=this.deviceLayout();if(!this.practiceCharactersDevicePositionCodes())return{};const s={};return e?.forEach(c=>{s[c.id]={characterKeyPositionCode:-1,layer:X.W.Primary,shiftKey:!1,altGraphKey:!1,positionCodes:c.input.map(l=>(0,u.F0)({actionCode:l,shiftKey:!1,altGraphKey:!1},i)?.map(p=>p.characterKeyPositionCode)).flat(),score:0}}),s}),this.highlightKeyCombination=(0,t.EWP)(()=>{const e=this.chordPracticeStore.queue()[0];return this.highlightChordKeyCombinationMap()[e.id]})}onKeyUp(e){this.chordPracticeStore.keyUp(e)}startPractice(){this.input.nativeElement.focus()}endPractice(){this.input.nativeElement.blur()}ngOnInit(){this.hotkeys.addShortcut({keys:this.shortcuts.startPractice}).subscribe(()=>{this.startPractice()}),this.hotkeys.addShortcut({keys:this.shortcuts.pausePractice,allowIn:["INPUT"]}).subscribe(()=>{this.endPractice()})}ngOnDestroy(){this.hotkeys.removeShortcuts([this.shortcuts.startPractice,this.shortcuts.pausePractice])}static#t=this.\u0275fac=function(i){return new(i||o)};static#e=this.\u0275cmp=t.VBU({type:o,selectors:[["app-chord-practice"]],viewQuery:function(i,n){if(1&i&&t.GBs(H,7),2&i){let s;t.mGM(s=t.lsd())&&(n.input=s.first)}},hostVars:2,hostBindings:function(i,n){2&i&&t.HbH(n.classes)},standalone:!0,features:[t.aNF],decls:22,vars:7,consts:[["input",""],[1,"flex","h-12","flex-none","items-center","bg-gray-700","px-5"],[1,"flex-none"],[1,"relative","h-16","overflow-hidden"],[1,"history","absolute","top-2","space-x-1","whitespace-nowrap","text-gray-300"],[3,"keys"],[1,"absolute","left-24","top-2","space-x-1","whitespace-nowrap"],[1,"absolute","bottom-2","left-24","whitespace-nowrap","text-alnitak-300"],[1,"animate-ping","border-l","border-solid","border-alnitak-300"],["type","text","inputmode","none",1,"peer","h-0","w-0","opacity-0",3,"keyup","focus","blur"],[1,"absolute","inset-0","flex","cursor-pointer","items-center","justify-center","gap-2","bg-gray-500","text-white","peer-focus:pointer-events-none","peer-focus:opacity-0"],["mat-flat-button","",3,"click"],[1,"text-white"],[1,"box-border","block","flex-1","overflow-hidden","px-5","pb-5",3,"showThumb3Switch","keyLabelMap","highlightKeyCombination"],["class","absolute bottom-4 right-4 h-24 w-24 opacity-50",3,"opacity-50","speed","maxSpeed","speedUnit",4,"appVisible"],[1,"absolute","bottom-4","right-4","h-24","w-24","opacity-50",3,"speed","maxSpeed","speedUnit"]],template:function(i,n){if(1&i){const s=t.RV6();t.j41(0,"section",1),t.EFF(1," Chord - Practice\n"),t.k0s(),t.j41(2,"section",2)(3,"div",3)(4,"div",4),t.Z7z(5,Z,1,1,"app-chord-output-keys",5,t.Vm6),t.k0s(),t.j41(7,"div",6),t.Z7z(8,J,1,1,"app-chord-output-keys",5,t.Vm6),t.k0s(),t.j41(10,"div",7),t.EFF(11),t.nrm(12,"span",8),t.k0s(),t.j41(13,"input",9,0),t.bIt("keyup",function(l){return t.eBV(s),t.Njj(n.onKeyUp(l))})("focus",function(){return t.eBV(s),t.Njj(n.isFocus.set(!0))})("blur",function(){return t.eBV(s),t.Njj(n.isFocus.set(!1))}),t.k0s(),t.j41(15,"div",10)(16,"button",11),t.bIt("click",function(){return t.eBV(s),t.Njj(n.startPractice())}),t.j41(17,"mat-icon",12),t.EFF(18,"play_arrow"),t.k0s(),t.EFF(19," Start "),t.k0s()()()(),t.nrm(20,"app-layout",13),t.DNE(21,q,1,5,"app-speedometer",14)}2&i&&(t.R7$(4),t.xc7("right","calc(100% - 96px)"),t.R7$(),t.Dyx(n.chordPracticeStore.history()),t.R7$(3),t.Dyx(n.chordPracticeStore.queue()),t.R7$(3),t.SpI(" ",n.chordPracticeStore.buffer().join(""),""),t.R7$(9),t.Y8G("showThumb3Switch",n.visibilitySettingStore.layoutThumb3Switch())("keyLabelMap",n.keyLabelMap())("highlightKeyCombination",n.isFocus()?n.highlightKeyCombination():null),t.R7$(),t.Y8G("appVisible","speedometer"))},dependencies:[_,m.An,f.$z,O.C,z.B,w.U],encapsulation:2,changeDetection:0})}return o})();function et(o,r){if(1&o){const e=t.RV6();t.j41(0,"app-chord-practice-setting",0),t.bIt("selectionChange",function(n){t.eBV(e);const s=t.XpG();return t.Njj(s.onChordSelectionChange(n))})("startPractice",function(){t.eBV(e);const n=t.XpG();return t.Njj(n.startChordPractice())}),t.k0s()}if(2&o){const e=t.XpG();t.Y8G("chords",e.chords())("selectedChordIds",e.selectedChordIds())}}function ot(o,r){1&o&&t.nrm(0,"app-chord-practice")}let it=(()=>{class o{constructor(){this.chordStore=(0,t.WQX)(g.C),this.keyboardLayout=(0,t.WQX)(k.h).selectedEntity,this.chordPracticeStore=(0,t.WQX)(P),this.selectedChordIds=(0,t.vPA)(new Set),this.stage=(0,t.vPA)("setting"),this.chords=(0,t.EWP)(()=>{const e=this.chordStore.entities(),i=this.keyboardLayout();return e.map(n=>{const s=n.output.map(c=>(0,u.VW)(c,i));return{...n,inputKeys:n.input.map(c=>(0,u.VW)(c,i)),outputKeys:s,outputText:s.filter(c=>"character"===c?.type).map(c=>c?.value).join("")}}).filter(n=>n.inputKeys.every(s=>null!==s)&&n.outputKeys.every(s=>null!==s))})}onChordSelectionChange({options:e}){let i=this.selectedChordIds();e.forEach(n=>{n.selected?i.add(n.value.id):i.delete(n.value.id)}),this.selectedChordIds.set(i)}startChordPractice(){this.chordPracticeStore.setChords(this.chords().filter(e=>this.selectedChordIds().has(e.id))),this.stage.set("practice")}static#t=this.\u0275fac=function(i){return new(i||o)};static#e=this.\u0275cmp=t.VBU({type:o,selectors:[["app-chord-page"]],standalone:!0,features:[t.aNF],decls:2,vars:1,consts:[[3,"selectionChange","startPractice","chords","selectedChordIds"]],template:function(i,n){if(1&i&&t.DNE(0,et,1,2)(1,ot,1,0),2&i){let s;t.vxM(0,"setting"===(s=n.stage())?0:"practice"===s?1:-1)}},dependencies:[R,tt],encapsulation:2,changeDetection:0})}return o})()}}]);