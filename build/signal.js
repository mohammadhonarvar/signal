globalThis.Alwatr==null&&(globalThis.Alwatr={registeredList:[]});try{_ALWATR_VERSION_}catch(e){globalThis._ALWATR_VERSION_="ERROR",console.warn("!! SCRIPTS LOADED OUTSIDE OF ALWATR BUILD ENVIRONMENT !!")}Alwatr.registeredList==null&&(Alwatr.registeredList=[]);var x=Alwatr;x.registeredList.push({name:"@alwatr/logger",version:_ALWATR_VERSION_});var b=typeof process!="undefined",A,S=b?process.env.ALWATR_DEBUG==="1":((A=globalThis.localStorage)==null?void 0:A.getItem("alwatrDebug"))==="1",y=b?["0;36","0;35","0;34","0;33","0;32"]:["#35b997","#f05561","#ee224a","#91c13e","#22af4b","#f0e995","#0fe995","#0f89ca","#08b9a5","#fee851","#ee573d","#f9df30","#1da2dc","#f05123","#ee2524"],m=0,_=()=>{let e=y[m];return m++,m>=y.length&&(m=0),e},i={scope:b?"\x1B[{{color}}m":"color: {{color}};",reset:b?"\x1B[0m":"color: inherit;"},T=b?"%s%s%s":"%c%s%c",C=e=>{e=e.trim();let n=e.charAt(0);return n!=="["&&n!=="{"&&n!=="<"&&(e="["+e+"]"),e},h=(e,n=S)=>{let t=_(),r=i.scope.replaceAll("{{color}}",t);e=C(e);let s={devMode:n,domain:e,accident:b?console.warn.bind(console,`${r}⚠️
%s\x1B[33m.%s() Accident \`%s\` %s!${i.reset}`,e):console.warn.bind(console,"%c%s%c.%s() Accident `%s` %s!",r,e,i.reset),error:b?console.error.bind(console,`${r}❌
%s\x1B[31m.%s() Error \`%s\`${i.reset}
`,e):console.error.bind(console,"%c%s%c.%s() Error `%s`\n",r,e,i.reset)};return n?{...s,logProperty:console.debug.bind(console,T+".%s = %o;",r,e,i.reset),logMethod:console.debug.bind(console,T+".%s();",r,e,i.reset),logModule:console.debug.bind(console,T+"/%s.js;",r,e,i.reset),logMethodArgs:console.debug.bind(console,T+".%s(%o);",r,e,i.reset),logMethodFull:console.debug.bind(console,T+".%s(%o) => %o",r,e,i.reset),logOther:console.debug.bind(console,T,r,e,i.reset),incident:b?console.log.bind(console,`${r}🚸
%s${i.reset}.%s() Incident \`%s\` %s!${i.reset}`,e):console.log.bind(console,"%c%s%c.%s() Incident `%s` %s!",r,e,"color: orange;"),time:o=>console.time(e+"."+o+" duration time"),timeEnd:o=>console.timeEnd(e+"."+o+" duration time")}:s};x.registeredList.push({name:"signal",version:"1.0.0"});var p=5,l={},u="eventTarget"in window?new EventTarget:document.createElement("span");function j(e,n=!1){let t=l[e];if(t!=null){for(let r of t.listenerList)u.removeEventListener(e,r.callback);if(n){delete l[e];return}t.listenerList.length=0}}function K(){let e=Object.keys(l);for(let n of e)j(n,!0)}var c=h("context-signal"),L=0,v=()=>e=>{let n=l[e];return n==null&&(n=l[e]={id:e,disabled:!1,debounced:!1,detail:void 0,listenerList:[],firstDispatchedDone:!1}),n},k=()=>(e,n,t=!1)=>{var s;(s=c.logMethodArgs)==null||s.call(c,"setContextSignalValue",{signalId:e,value:n,replaceAll:t});let r=v()(e);return r.detail===void 0||t?(r.detail=n,r):typeof r.detail=="object"&&!Array.isArray(r.detail)&&typeof n=="object"?(r.detail={...r.detail,...n},r):(r.detail=n,r)},B=()=>e=>v()(e).detail;function w(){return(e,n,t={})=>{var o,a,f,d;(o=t.debounce)!=null||(t.debounce="NextCycle"),(a=t.scopeName)!=null||(t.scopeName="unknown"),(f=t.replaceAll)!=null||(t.replaceAll=!1),(d=c.logMethodArgs)==null||d.call(c,"contextDispatch",{signalId:e,value:n,options:t});let r=k()(e,n,t.replaceAll);if(r.firstDispatchedDone=!0,r.disabled)return;let s=()=>{u.dispatchEvent(new CustomEvent(e,{detail:n}))};if(t.debounce==="No"){s();return}if(t.debounce==="NextCycle"){setTimeout(s,0);return}r.debounced!==!0&&(r.debounced=!0,t.debounce==="AnimationFrame"?requestAnimationFrame(s):setTimeout(s,p))}}function z(){return(e,n,t={})=>{var s;if((s=c.logMethodArgs)==null||s.call(c,"contextEditionDispatch",{signalId:e,value:n,options:t}),!v()(e).firstDispatchedDone){console.warn(`Use \`contextDispatch\` for ${e} , then this function can run`);return}w()(e,n,t)}}function N(){return(e,n,t={})=>{var o,a,f;(o=t.preserved)!=null||(t.preserved=!0),(a=c.logMethodArgs)==null||a.call(c,"onContextDispatch",{signalId:e,callback:n,options:t});let r=v()(e);if(r.disabled)return L;let s=d=>{try{n(d.detail)}catch(O){c.error("onContextDispatch","call_signal_callback_failed",O,{signalId:r.id})}};return r.listenerList.push({id:++L,signalId:r.id,once:(f=t.once)!=null?f:!1,callback:s}),u.addEventListener(e,d=>{t.runAsLatest?setTimeout(()=>{s(d)},0):s(d)},{once:t.once}),t.preserved&&setTimeout(n,0,r.detail),L}}function P(){return(e,n)=>{let t=l[e];if(t==null)return;let r=t.listenerList.findIndex(s=>s.id===n);r>-1&&u.removeEventListener(e,t.listenerList[r].callback)}}function G(){return(e,n)=>{let t=!1;return new Promise(r=>{let s=N()(e,o=>{typeof n=="function"?n(o)===!0&&(t=!0,r()):r(),t&&P()(e,s)})})}}var g=h("simple-signal"),E=0,D=e=>{let n=l[e];return n==null&&(n=l[e]={id:e,disabled:!1,debounced:!1,listenerList:[],firstDispatchedDone:!1}),n};function X(e,n={}){var s,o;(s=n.debounce)!=null||(n.debounce="NextCycle"),(o=g.logMethodArgs)==null||o.call(g,"dispatch",{signalId:e,options:n});let t=D(e);if(t.firstDispatchedDone=!0,t.disabled)return;let r=()=>{u.dispatchEvent(new CustomEvent(e))};if(n.debounce==="No"){r();return}if(n.debounce==="NextCycle"){setTimeout(r,0);return}t.debounced!==!0&&(t.debounced=!0,n.debounce==="AnimationFrame"?requestAnimationFrame(r):setTimeout(r,p))}function R(e,n,t={}){var o,a,f;(o=t.preserved)!=null||(t.preserved=!0),(a=g.logMethodArgs)==null||a.call(g,"onDispatch",{signalId:e,callback:n,options:t});let r=D(e);if(r.disabled)return E;let s=()=>{try{n()}catch(d){g.error("onContextDispatch","call_signal_callback_failed",d,{signalId:r.id})}};return r.listenerList.push({id:++E,signalId:r.id,once:(f=t.once)!=null?f:!1,callback:s}),u.addEventListener(e,()=>{t.runAsLatest?setTimeout(()=>{s()},0):s()},{once:t.once}),t.preserved&&setTimeout(n,0),E}function M(e,n){let t=l[e];if(t==null)return;let r=t.listenerList.findIndex(s=>s.id===n);r>-1&&u.removeEventListener(e,t.listenerList[r].callback)}function Y(e){return new Promise(n=>{let t=R(e,()=>{n(),M(e,t)})})}export{w as contextDispatch,z as contextEditionDispatch,X as dispatch,G as firstContextDispatch,Y as firstDispatch,B as getContextSignalValue,N as onContextDispatch,R as onDispatch,P as removeOnContextDispatch,M as removeOnDispatch,K as resetSignalObject,k as setContextSignalValue};
//# sourceMappingURL=signal.js.map
