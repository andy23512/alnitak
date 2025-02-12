"use strict";(self.webpackChunkalnitak=self.webpackChunkalnitak||[]).push([[193],{7193:(ht,g,a)=>{a.r(g),a.d(g,{ChordPageComponent:()=>at});var t=a(9590),v=a(8834),m=a(1801),P=a(3902),h=a(6138),I=a(2510);const K=(0,a(4019).A)(function(s,e){return Array.prototype.slice.call(e,0).sort(s)});var b=a(7508);function T(i,s){if(1&i&&t.EFF(0),2&i){const e=t.XpG().$implicit;t.SpI(" ",e.value," ")}}function B(i,s){if(1&i&&(t.j41(0,"mat-icon"),t.EFF(1),t.k0s()),2&i){const e=t.XpG().$implicit;t.R7$(),t.SpI(" ",e.value," ")}}function M(i,s){1&i&&(t.j41(0,"span"),t.EFF(1,"+"),t.k0s())}function $(i,s){if(1&i&&t.DNE(0,T,1,1)(1,B,2,1)(2,M,2,0,"span"),2&i){const o=s.$index,n=s.$count;t.vxM(0,"character"===s.$implicit.type?0:1),t.R7$(2),t.vxM(2,o!==n-1?2:-1)}}let G=(()=>{class i{constructor(){this.keys=t.hFB.required()}static#t=this.\u0275fac=function(o){return new(o||i)};static#e=this.\u0275cmp=t.VBU({type:i,selectors:[["app-chord-input-keys"]],inputs:{keys:[t.Mj6.SignalBased,"keys"]},standalone:!0,features:[t.aNF],decls:2,vars:0,template:function(o,n){1&o&&t.Z7z(0,$,3,2,null,null,t.Vm6),2&o&&t.Dyx(n.keys())},dependencies:[m.An],encapsulation:2,changeDetection:0})}return i})();function V(i,s){if(1&i&&(t.j41(0,"span"),t.EFF(1),t.k0s()),2&i){const e=t.XpG().$implicit;t.R7$(),t.JRh(e.value)}}function D(i,s){if(1&i&&(t.j41(0,"mat-icon",0),t.EFF(1),t.k0s()),2&i){const e=t.XpG().$implicit;t.Y8G("inline",!0),t.R7$(),t.JRh(e.value)}}function N(i,s){1&i&&t.DNE(0,V,2,1,"span")(1,D,2,2),2&i&&t.vxM(0,"character"===s.$implicit.type?0:1)}let F=(()=>{class i{constructor(){this.keys=t.hFB.required(),this.hostClasses=["inline-flex","align-center"]}static#t=this.\u0275fac=function(o){return new(o||i)};static#e=this.\u0275cmp=t.VBU({type:i,selectors:[["app-chord-output-keys"]],hostVars:2,hostBindings:function(o,n){2&o&&t.HbH(n.hostClasses)},inputs:{keys:[t.Mj6.SignalBased,"keys"]},standalone:!0,features:[t.aNF],decls:2,vars:0,consts:[[3,"inline"]],template:function(o,n){1&o&&t.Z7z(0,N,2,1,null,null,t.Vm6),2&o&&t.Dyx(n.keys())},dependencies:[m.An],encapsulation:2,changeDetection:0})}return i})();const R=["fileInput"],W=(i,s)=>s.id;function Q(i,s){if(1&i&&(t.j41(0,"mat-list-option",7),t.nrm(1,"app-chord-input-keys",9),t.EFF(2," -> "),t.nrm(3,"app-chord-output-keys",9),t.k0s()),2&i){const e=s.$implicit,o=t.XpG();t.Y8G("color","primary")("value",e)("togglePosition","before")("selected",o.selectedChordIds().has(e.id)),t.R7$(),t.Y8G("keys",e.inputKeys),t.R7$(2),t.Y8G("keys",e.outputKeys)}}const X=K((i,s)=>i-s);let w=(()=>{class i{constructor(){this.chordStore=(0,t.WQX)(b.C),this.chords=t.hFB.required(),this.selectedChordIds=t.hFB.required(),this.selectionChange=(0,t.CGW)(),this.startPractice=(0,t.CGW)(),this.classes="flex flex-col"}loadChordFile(){if(typeof FileReader>"u")return;const e=this.fileInput.nativeElement;if(null===e.files||0===e.files.length)return;const o=new FileReader;o.onload=n=>{if(!n.target?.result)return;const r=JSON.parse(n.target.result);if(!r)return;let c=null;c=r.history?r.history[0].find(l=>"chords"===l.type):r,c&&(0,h.M8)(this.chordStore,(0,I.a8)(c.chords.map(([l,p])=>{const d=l.filter(lt=>lt>0);return{id:X(d).join("_"),input:d,output:p}})))},o.readAsText(e.files[0])}onChordSelectionChange(e){this.selectionChange.emit(e)}static#t=this.\u0275fac=function(o){return new(o||i)};static#e=this.\u0275cmp=t.VBU({type:i,selectors:[["app-chord-practice-setting"]],viewQuery:function(o,n){if(1&o&&t.GBs(R,5),2&o){let r;t.mGM(r=t.lsd())&&(n.fileInput=r.first)}},hostVars:1,hostBindings:function(o,n){2&o&&t.Mr5("classes",n.classes)},inputs:{chords:[t.Mj6.SignalBased,"chords"],selectedChordIds:[t.Mj6.SignalBased,"selectedChordIds"]},outputs:{selectionChange:"selectionChange",startPractice:"startPractice"},standalone:!0,features:[t.aNF],decls:27,vars:3,consts:[["fileInput",""],[1,"flex","h-12","flex-none","items-center","bg-gray-700","px-5"],[1,"flex-1","list-inside","list-decimal","overflow-auto","p-5"],["href","https://charachorder.io/","target","_blank","rel","noopener",1,"underline"],["type","button","mat-flat-button","",1,"my-2",3,"click","color"],["hidden","","type","file","accept",".json","aria-label","file input for selecting a chord map file to load into this tool",3,"change"],[1,"!my-2","max-h-56","overflow-auto","rounded","border",3,"selectionChange"],[3,"color","value","togglePosition","selected"],["type","button","mat-flat-button","",1,"my-2",3,"click","color","disabled"],[3,"keys"]],template:function(o,n){if(1&o){const r=t.RV6();t.j41(0,"section",1),t.EFF(1," Chord - Practice Setting\n"),t.k0s(),t.j41(2,"ol",2)(3,"li"),t.EFF(4," Import your chord list file (the backup file from "),t.j41(5,"a",3),t.EFF(6,"CharaChorder Device Manager"),t.k0s(),t.EFF(7," website). (for first time usage or updating the chord list) "),t.nrm(8,"br"),t.j41(9,"button",4),t.bIt("click",function(){t.eBV(r);const l=t.sdS(14);return t.Njj(l.click())}),t.j41(10,"mat-icon"),t.EFF(11,"upload"),t.k0s(),t.EFF(12," Choose File "),t.k0s(),t.j41(13,"input",5,0),t.bIt("change",function(){return t.eBV(r),t.Njj(n.loadChordFile())}),t.k0s()(),t.j41(15,"li"),t.EFF(16," Select the chords you want to practice from the imported chord list below. "),t.j41(17,"mat-selection-list",6),t.bIt("selectionChange",function(l){return t.eBV(r),t.Njj(n.onChordSelectionChange(l))}),t.Z7z(18,Q,4,6,"mat-list-option",7,W),t.k0s()(),t.j41(20,"li"),t.EFF(21," Click the following button to start. "),t.nrm(22,"br"),t.j41(23,"button",8),t.bIt("click",function(){return t.eBV(r),t.Njj(n.startPractice.emit())}),t.j41(24,"mat-icon"),t.EFF(25,"play_arrow"),t.k0s(),t.EFF(26," Start "),t.k0s()()()}2&o&&(t.R7$(9),t.Y8G("color","primary"),t.R7$(9),t.Dyx(n.chords()),t.R7$(5),t.Y8G("color","primary")("disabled",0===n.selectedChordIds().size))},dependencies:[v.$z,m.An,P.p6,P.oh,G,F],encapsulation:2,changeDetection:0})}return i})();var L=a(1635),U=a(8954),k=a(9894),Y=a(605),A=a(6148),_=a(1380),O=a(1159),z=a(4796),y=a(6898);const S=(0,h.Eu)({providedIn:"root"},(0,z.JT)("chordPractice"),(0,h.Q2)({chords:null,queue:[],history:[],lastCorrectChordTime:null,chordIntervals:[],buffer:[]}),(0,h.RI)(i=>({setChords(s){(0,h.M8)(i,()=>({chords:s,queue:(0,y.q)(s,20),history:[],chordIntervals:[]}))},airType(){(0,h.M8)(i,({queue:s,chords:e,history:o,lastCorrectChordTime:n,chordIntervals:r})=>{if(!e)return{};const c=Date.now();return{queue:[...s.slice(1),(0,y.Q)(e)],history:[...o,s[0]].slice(-3),lastCorrectChordTime:c,chordIntervals:n?[...r,c-n]:[...r],buffer:[]}})},keyUp(s){(0,h.M8)(i,({buffer:e,queue:o,chords:n,history:r,lastCorrectChordTime:c,chordIntervals:l})=>{if(!n)return{};const p=Date.now(),d=[...e];return"Backspace"===s.code?d.pop():d.push(s.key),d.join("").trim()===o[0].outputText?{queue:[...o.slice(1),(0,y.Q)(n)],history:[...r,o[0]].slice(-3),lastCorrectChordTime:p,chordIntervals:c?[...l,p-c]:[...l],buffer:[]}:{buffer:d}})}})),(0,h.QO)(i=>({chpm:(0,t.EWP)(()=>{const s=i.chordIntervals(),e=s.reduce((n,r)=>n+r,0)/1e3/60;return 0===e?0:Math.floor(s.length/e)})})));var J=a(2999),j=a(7877),q=a(9263),u=a(2097),tt=a(5888),et=a(629);const ot=["input"];function it(i,s){1&i&&t.nrm(0,"app-chord-output-keys",5),2&i&&t.Y8G("keys",s.$implicit.outputKeys)}function nt(i,s){1&i&&t.nrm(0,"app-chord-output-keys",5),2&i&&t.Y8G("keys",s.$implicit.outputKeys)}function st(i,s){if(1&i&&t.nrm(0,"app-speedometer",15),2&i){const e=t.XpG();t.AVh("opacity-50",e.isFocus()),t.Y8G("speed",e.chordPracticeStore.chpm())("maxSpeed",100)("speedUnit","ChPM")}}let f=class C{constructor(){this.chordPracticeStore=(0,t.WQX)(S),this.visibilitySettingStore=(0,t.WQX)(q.e),this.hotkeys=(0,t.WQX)(U.dr),this.isFocus=(0,t.vPA)(!1),this.shortcuts={startPractice:"space",pausePractice:"escape"},this.classes="flex flex-col h-screen",this.keyboardLayout=(0,t.WQX)(j.h).selectedEntity,this.deviceLayout=(0,t.WQX)(J.G).selectedEntity,this.airModeSettingStore=(0,t.WQX)(O.$),this.practiceCharactersDevicePositionCodes=(0,t.EWP)(()=>{const s=this.chordPracticeStore.chords(),e=this.deviceLayout(),o=this.keyboardLayout();return[...new Set(s?.map(r=>r.input).flat())].map(r=>{const c=(0,u.VW)(r,o);return c?{c:c.value,characterDeviceKeys:(0,u.F0)({actionCode:r,shiftKey:!1,altGraphKey:!1},e)}:null})}),this.keyLabelMap=(0,t.EWP)(()=>{const s=this.practiceCharactersDevicePositionCodes();if(!s)return{};const e={};return s.forEach(o=>{o?.characterDeviceKeys?.forEach(({characterKeyPositionCode:n,layer:r,shiftKey:c,altGraphKey:l})=>{const p={type:_.g.String,c:o.c,layer:r,shiftKey:c,altGraphKey:l};e[n]?e[n].push(p):e[n]=[p]})}),e}),this.highlightChordKeyCombinationMap=(0,t.EWP)(()=>{const s=this.chordPracticeStore.chords(),e=this.deviceLayout();if(!this.practiceCharactersDevicePositionCodes())return{};const n={};return s?.forEach(r=>{n[r.id]={characterKeyPositionCode:-1,layer:_.W.Primary,shiftKey:!1,altGraphKey:!1,positionCodes:r.input.map(c=>(0,u.F0)({actionCode:c,shiftKey:!1,altGraphKey:!1},e)?.map(l=>l.characterKeyPositionCode)).flat(),score:0}}),n}),this.highlightKeyCombination=(0,t.EWP)(()=>{const s=this.chordPracticeStore.queue()[0];return this.highlightChordKeyCombinationMap()[s.id]})}onKeyUp(s){this.chordPracticeStore.keyUp(s)}startPractice(){if(this.input.nativeElement.focus(),this.airModeSettingStore.enabled()){const e=this.airModeSettingStore.chordSpeed();(0,Y.Y)(6e4/e).pipe((0,k.s)(this)).subscribe(()=>{this.chordPracticeStore.airType()})}}endPractice(){this.input.nativeElement.blur()}ngOnInit(){this.hotkeys.addShortcut({keys:this.shortcuts.startPractice}).subscribe(()=>{this.startPractice()}),this.hotkeys.addShortcut({keys:this.shortcuts.pausePractice,allowIn:["INPUT"]}).subscribe(()=>{this.endPractice()})}ngOnDestroy(){this.hotkeys.removeShortcuts([this.shortcuts.startPractice,this.shortcuts.pausePractice])}static#t=this.\u0275fac=function(e){return new(e||C)};static#e=this.\u0275cmp=t.VBU({type:C,selectors:[["app-chord-practice"]],viewQuery:function(e,o){if(1&e&&t.GBs(ot,7),2&e){let n;t.mGM(n=t.lsd())&&(o.input=n.first)}},hostVars:2,hostBindings:function(e,o){2&e&&t.HbH(o.classes)},standalone:!0,features:[t.aNF],decls:22,vars:7,consts:[["input",""],[1,"flex","h-12","flex-none","items-center","bg-gray-700","px-5"],[1,"flex-none"],[1,"relative","h-16","overflow-hidden"],[1,"history","absolute","top-2","space-x-1","whitespace-nowrap","text-gray-300"],[3,"keys"],[1,"absolute","left-24","top-2","space-x-1","whitespace-nowrap"],[1,"absolute","bottom-2","left-24","whitespace-nowrap","text-alnitak-300"],[1,"animate-ping","border-l","border-solid","border-alnitak-300"],["type","text","inputmode","none",1,"peer","h-0","w-0","opacity-0",3,"keyup","focus","blur"],[1,"absolute","inset-0","flex","cursor-pointer","items-center","justify-center","gap-2","bg-gray-500","text-white","peer-focus:pointer-events-none","peer-focus:opacity-0"],["mat-flat-button","",3,"click"],[1,"text-white"],[1,"box-border","block","flex-1","overflow-hidden","px-5","pb-5",3,"showThumb3Switch","keyLabelMap","highlightKeyCombination"],["class","absolute bottom-4 right-4 h-24 w-24 opacity-50",3,"opacity-50","speed","maxSpeed","speedUnit",4,"appVisible"],[1,"absolute","bottom-4","right-4","h-24","w-24","opacity-50",3,"speed","maxSpeed","speedUnit"]],template:function(e,o){if(1&e){const n=t.RV6();t.j41(0,"section",1),t.EFF(1," Chord - Practice\n"),t.k0s(),t.j41(2,"section",2)(3,"div",3)(4,"div",4),t.Z7z(5,it,1,1,"app-chord-output-keys",5,t.Vm6),t.k0s(),t.j41(7,"div",6),t.Z7z(8,nt,1,1,"app-chord-output-keys",5,t.Vm6),t.k0s(),t.j41(10,"div",7),t.EFF(11),t.nrm(12,"span",8),t.k0s(),t.j41(13,"input",9,0),t.bIt("keyup",function(c){return t.eBV(n),t.Njj(o.onKeyUp(c))})("focus",function(){return t.eBV(n),t.Njj(o.isFocus.set(!0))})("blur",function(){return t.eBV(n),t.Njj(o.isFocus.set(!1))}),t.k0s(),t.j41(15,"div",10)(16,"button",11),t.bIt("click",function(){return t.eBV(n),t.Njj(o.startPractice())}),t.j41(17,"mat-icon",12),t.EFF(18,"play_arrow"),t.k0s(),t.EFF(19," Start "),t.k0s()()()(),t.nrm(20,"app-layout",13),t.DNE(21,st,1,5,"app-speedometer",14)}2&e&&(t.R7$(4),t.xc7("right","calc(100% - 96px)"),t.R7$(),t.Dyx(o.chordPracticeStore.history()),t.R7$(3),t.Dyx(o.chordPracticeStore.queue()),t.R7$(3),t.SpI(" ",o.chordPracticeStore.buffer().join(""),""),t.R7$(9),t.Y8G("showThumb3Switch",o.visibilitySettingStore.layoutThumb3Switch())("keyLabelMap",o.keyLabelMap())("highlightKeyCombination",o.isFocus()?o.highlightKeyCombination():null),t.R7$(),t.Y8G("appVisible","speedometer"))},dependencies:[F,m.An,v.$z,tt.C,et.B,A.U],encapsulation:2,changeDetection:0})};function rt(i,s){if(1&i){const e=t.RV6();t.j41(0,"app-chord-practice-setting",0),t.bIt("selectionChange",function(n){t.eBV(e);const r=t.XpG();return t.Njj(r.onChordSelectionChange(n))})("startPractice",function(){t.eBV(e);const n=t.XpG();return t.Njj(n.startChordPractice())}),t.k0s()}if(2&i){const e=t.XpG();t.Y8G("chords",e.chords())("selectedChordIds",e.selectedChordIds())}}function ct(i,s){1&i&&t.nrm(0,"app-chord-practice")}f=(0,L.Cg)([(0,k.d)()],f);let at=(()=>{class i{constructor(){this.chordStore=(0,t.WQX)(b.C),this.keyboardLayout=(0,t.WQX)(j.h).selectedEntity,this.chordPracticeStore=(0,t.WQX)(S),this.selectedChordIds=(0,t.vPA)(new Set),this.stage=(0,t.vPA)("setting"),this.chords=(0,t.EWP)(()=>{const e=this.chordStore.entities(),o=this.keyboardLayout();return e.map(n=>{const r=n.output.map(c=>(0,u.VW)(c,o));return{...n,inputKeys:n.input.map(c=>(0,u.VW)(c,o)),outputKeys:r,outputText:r.filter(c=>"character"===c?.type).map(c=>c?.value).join("")}}).filter(n=>n.inputKeys.every(r=>null!==r)&&n.outputKeys.every(r=>null!==r))})}onChordSelectionChange({options:e}){let o=this.selectedChordIds();e.forEach(n=>{n.selected?o.add(n.value.id):o.delete(n.value.id)}),this.selectedChordIds.set(o)}startChordPractice(){this.chordPracticeStore.setChords(this.chords().filter(e=>this.selectedChordIds().has(e.id))),this.stage.set("practice")}static#t=this.\u0275fac=function(o){return new(o||i)};static#e=this.\u0275cmp=t.VBU({type:i,selectors:[["app-chord-page"]],standalone:!0,features:[t.aNF],decls:2,vars:1,consts:[[3,"selectionChange","startPractice","chords","selectedChordIds"]],template:function(o,n){if(1&o&&t.DNE(0,rt,1,2)(1,ct,1,0),2&o){let r;t.vxM(0,"setting"===(r=n.stage())?0:"practice"===r?1:-1)}},dependencies:[w,f],encapsulation:2,changeDetection:0})}return i})()}}]);