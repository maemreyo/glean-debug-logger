'use strict';var react=require('react'),framerMotion=require('framer-motion'),Y=require('@radix-ui/react-scroll-area'),goober=require('goober'),P=require('@radix-ui/react-dropdown-menu'),lucideReact=require('lucide-react'),jsxRuntime=require('react/jsx-runtime'),A=require('@radix-ui/react-tooltip');function _interopNamespace(e){if(e&&e.__esModule)return e;var n=Object.create(null);if(e){Object.keys(e).forEach(function(k){if(k!=='default'){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})}n.default=e;return Object.freeze(n)}var Y__namespace=/*#__PURE__*/_interopNamespace(Y);var P__namespace=/*#__PURE__*/_interopNamespace(P);var A__namespace=/*#__PURE__*/_interopNamespace(A);// @ts-nocheck
var it=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function we(o,e={}){let t=e.keys||it;if(!o||typeof o!="object")return o;let s=Array.isArray(o)?[...o]:{...o},l=a=>{if(!a||typeof a!="object")return a;for(let n in a)if(Object.prototype.hasOwnProperty.call(a,n)){let d=n.toLowerCase();t.some(f=>d.includes(f.toLowerCase()))?a[n]="***REDACTED***":a[n]!==null&&typeof a[n]=="object"&&(a[n]=l(a[n]));}return a};return l(s)}function ee(o){return o.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function Ae(){if(typeof navigator>"u")return "unknown";let o=navigator.userAgent;return o.includes("Edg")?"edge":o.includes("Chrome")?"chrome":o.includes("Firefox")?"firefox":o.includes("Safari")?"safari":"unknown"}function go(o,e,t,s){if(typeof window>"u")return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:s,errorCount:0,networkErrorCount:0};let l=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",a=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:Ae(),platform:navigator.platform,language:navigator.language,screenResolution:l,viewport:a,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:s,errorCount:0,networkErrorCount:0}}function fo(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function H(o="json",e={},t={}){let{fileNameTemplate:s="{env}_{userId}_{sessionId}_{timestamp}",environment:l="development",userId:a="anonymous",sessionId:n="unknown"}=t,d=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],c=new Date().toISOString().split("T")[0],f=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),h=t.browser||Ae(),b=t.platform||(typeof navigator<"u"?navigator.platform:"unknown"),z=(t.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",g=String(t.errorCount??e.errorCount??0),D=String(t.logCount??e.logCount??0),B=s.replace("{env}",ee(l)).replace("{userId}",ee(a??"anonymous")).replace("{sessionId}",ee(n??"unknown")).replace("{timestamp}",d).replace("{date}",c).replace("{time}",f).replace(/\{errorCount\}/g,g).replace(/\{logCount\}/g,D).replace("{browser}",ee(h)).replace("{platform}",ee(b)).replace("{url}",ee(z));for(let[W,k]of Object.entries(e))B=B.replace(`{${W}}`,String(k));return `${B}.${o}`}function pr(o,e="json"){let t=o.url.split("?")[0]||"unknown";return H(e,{},{environment:o.environment,userId:o.userId,sessionId:o.sessionId,browser:o.browser,platform:o.platform,url:t,errorCount:o.errorCount,logCount:o.logCount})}var lt={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function bo(o){let e=parseFloat(o);return isNaN(e)?0:Math.round(e*1e6)}function ct(o){return lt[o.toLowerCase()]||"info"}function ze(o){return o.filter(e=>!e.ignored).slice(0,20)}function oe(o){return {service:{environment:o.environment},user:o.userId?{id:o.userId}:void 0,host:{name:o.browser,type:o.platform}}}function U(o,e){let t={"@timestamp":o.time,event:{original:o,category:[]}},s=oe(e);switch(Object.assign(t,s),o.type){case "CONSOLE":{t.log={level:ct(o.level)},t.message=o.data,t.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{t.http={request:{method:o.method}},t.url={full:o.url},t.event.category=["network","web"],t.event.action="request",t.event.id=o.id;break}case "FETCH_RES":case "XHR_RES":{t.http={response:{status_code:o.status}},t.url={full:o.url},t.event.duration=bo(o.duration),t.event.category=["network","web"],t.event.action="response",t.event.id=o.id;break}case "FETCH_ERR":case "XHR_ERR":{t.error={message:o.error},t.url={full:o.url},t.event.duration=bo(o.duration),t.event.category=["network","web"],t.event.action="error",t.event.id=o.id;let l=o;if(typeof l.body=="object"&&l.body!==null){let a=l.body;if(Array.isArray(a.frames)){let n=ze(a.frames);t.error.stack_trace=n.map(d=>`  at ${d.functionName||"?"} (${d.filename||"?"}:${d.lineNumber||0}:${d.columnNumber||0})`).join(`
`);}}break}default:{t.message=JSON.stringify(o);break}}return t}var v=class v{constructor(){this.isAttached=false;v.instanceCount++,this.instanceId=v.instanceCount,this.originalLog=console.log.bind(console),this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[],v.isGloballyAttached&&(this.isAttached=true),v.instance=this,this.originalLog(`[ConsoleInterceptor#${this.instanceId}] \u2705 Created singleton instance (total: ${v.instanceCount})`);}static getInstance(){return v.instance||(v.instance=new v),v.instance}static createNew(){return new v}static resetInstance(){v.instance&&(v.instance.forceDetach(),v.instance=null);}debugLog(...e){this.originalLog(...e);}attach(){if(this.debugLog(`[ConsoleInterceptor#${this.instanceId}] attach() - isAttached=${this.isAttached}, callbacks=${this.callbacks.length}`),this.isAttached){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] ALREADY ATTACHED - skipping duplicate attach`);return}this.isAttached=true,v.isGloballyAttached=true,["log","error","warn","info","debug"].forEach(t=>{let s=this.originalConsole[t];console[t]=(...l)=>{this.debugLog(`[ConsoleInterceptor#${this.instanceId}] \u{1F525} ${t}() triggered (${this.callbacks.length} callbacks)`);for(let a of this.callbacks)a(t,l);s(...l);};});}detach(){if(!this.isAttached){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] ALREADY DETACHED - skipping duplicate detach`);return}this.forceDetach();}forceDetach(){if(!this.isAttached)return;this.isAttached=false,v.isGloballyAttached=false,["log","error","warn","info","debug"].forEach(t=>{console[t]=this.originalConsole[t];}),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] Force detached`);}onLog(e){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] onLog() - callback count before: ${this.callbacks.length}`),this.callbacks.push(e),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] onLog() - callback count after: ${this.callbacks.length}`);}removeLog(e){let t=this.callbacks.indexOf(e);this.debugLog(`[ConsoleInterceptor#${this.instanceId}] removeLog() - callback found at index: ${t}, total: ${this.callbacks.length}`),t>-1&&this.callbacks.splice(t,1),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] removeLog() - callback count after: ${this.callbacks.length}`);}};v.instance=null,v.isGloballyAttached=false,v.instanceCount=0;var ve=v;var Se=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t));}attach(){window.fetch=async(...e)=>{let[t,s]=e,l=t.toString();if(this.excludeUrls.some(n=>n.test(l)))return this.originalFetch(...e);let a=Date.now();this.onRequest.forEach(n=>n(l,s||{}));try{let n=await this.originalFetch(...e),d=Date.now()-a;return this.onResponse.forEach(c=>c(l,n.status,d)),n}catch(n){throw this.onError.forEach(d=>d(l,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}removeFetchRequest(e){let t=this.onRequest.indexOf(e);t>-1&&this.onRequest.splice(t,1);}onFetchResponse(e){this.onResponse.push(e);}removeFetchResponse(e){let t=this.onResponse.indexOf(e);t>-1&&this.onResponse.splice(t,1);}onFetchError(e){this.onError.push(e);}removeFetchError(e){let t=this.onError.indexOf(e);t>-1&&this.onError.splice(t,1);}};var ke=class{constructor(e={}){this.isAttached=false;this.requestIdCounter=0;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}generateRequestId(){return `xhr_${++this.requestIdCounter}_${Date.now()}_${Math.random().toString(36).substring(7)}`}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(t,s,l,a,n){let d=typeof s=="string"?s:s.href;if(e.requestTracker.set(this,{method:t,url:d,headers:{},body:null,startTime:Date.now(),requestId:e.generateRequestId()}),e.excludeUrls.some(f=>f.test(d)))return e.originalOpen.call(this,t,s,l??true,a,n);let c=e.requestTracker.get(this);for(let f of e.onRequest)f(c);return e.originalOpen.call(this,t,s,l??true,a,n)},this.originalXHR.prototype.send=function(t){let s=e.requestTracker.get(this);if(s){s.body=t;let l=this.onload,a=this.onerror;this.onload=function(n){let d=Date.now()-s.startTime;for(let c of e.onResponse)c(s,this.status,d);l&&l.call(this,n);},this.onerror=function(n){for(let d of e.onError)d(s,new Error("XHR Error"));a&&a.call(this,n);};}return e.originalSend.call(this,t)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}removeXHRRequest(e){let t=this.onRequest.indexOf(e);t>-1&&this.onRequest.splice(t,1);}onXHRResponse(e){this.onResponse.push(e);}removeXHRResponse(e){let t=this.onResponse.indexOf(e);t>-1&&this.onResponse.splice(t,1);}onXHRError(e){this.onError.push(e);}removeXHRError(e){let t=this.onError.indexOf(e);t>-1&&this.onError.splice(t,1);}};var He={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5,persistAcrossReloads:false};function mo(){return Math.random().toString(36).substring(7)}function qe(o,e){return we(o,{keys:e})}function yo(o,e,t,s){return {addLog:n=>{o.logsRef.current.push(n),o.logsRef.current.length>e.maxLogs&&o.logsRef.current.shift(),s(o.logsRef.current.length),n.type==="CONSOLE"?n.level==="ERROR"&&o.errorCountRef.current++:(n.type==="FETCH_ERR"||n.type==="XHR_ERR")&&o.errorCountRef.current++;let d=e.uploadOnErrorCount??5;if(o.errorCountRef.current>=d&&e.uploadEndpoint){let c={metadata:{...o.metadataRef.current,logCount:o.logsRef.current.length},logs:o.logsRef.current,fileName:H("json",{},{fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.environment,userId:e.userId,sessionId:null})};fetch(e.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:t(c)}).catch(()=>{}),o.errorCountRef.current=0;}if(e.enablePersistence&&typeof window<"u")try{localStorage.setItem(e.persistenceKey,t(o.logsRef.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},updateMetadata:()=>{let n=o.logsRef.current.filter(c=>c.type==="CONSOLE").reduce((c,f)=>f.level==="ERROR"?c+1:c,0),d=o.logsRef.current.filter(c=>c.type==="FETCH_ERR"||c.type==="XHR_ERR").length;o.metadataRef.current={...o.metadataRef.current,logCount:o.logsRef.current.length,errorCount:n,networkErrorCount:d};}}}function ho(){return o=>{let e=new Set;return JSON.stringify(o,(t,s)=>{if(typeof s=="object"&&s!==null){if(e.has(s))return "[Circular]";e.add(s);}return s})}}function xo(o){return !o||o.length===0?"":o.map(e=>dt(e)).join("")}function dt(o){return JSON.stringify(o)+`
`}var te=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,t,s="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(t,{create:!0})).createWritable();await n.write(e),await n.close();}catch(l){if(l.name==="AbortError")return;throw l}}static download(e,t,s="application/json"){let l=new Blob([e],{type:s}),a=URL.createObjectURL(l),n=document.createElement("a");n.href=a,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(a);}static async downloadWithFallback(e,t,s="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,t,s);return}catch(l){if(l.name==="AbortError")return}this.download(e,t,s);}};te.supported=null;function wo(o,e,t,s){return (l,a)=>{if(typeof window>"u")return null;s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d=a||H(l,{},n),c,f;if(l==="json"){let h=e.current?{metadata:e.current,logs:o.current}:o.current;c=t(h),f="application/json";}else if(l==="jsonl"){let h=o.current.map(b=>U(b,e.current));c=xo(h),f="application/x-ndjson",d=a||H("jsonl",{},n);}else if(l==="ecs.json"){let h={metadata:oe(e.current),logs:o.current.map(b=>U(b,e.current))};c=JSON.stringify(h,null,2),f="application/json",d=a||H("ecs-json",{},n);}else if(l==="ai.txt"){let h=e.current,b=`# METADATA
service.name=${h.environment||"unknown"}
user.id=${h.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,S=o.current.map(z=>{let g=U(z,h),D=g["@timestamp"],B=g.log?.level||"info",W=g.event?.category?.[0]||"unknown",k=`[${D}] ${B} ${W}`;return g.message&&(k+=` | message="${g.message}"`),g.http?.request?.method&&(k+=` | req.method=${g.http.request.method}`),g.url?.full&&(k+=` | url=${g.url.full}`),g.http?.response?.status_code&&(k+=` | res.status=${g.http.response.status_code}`),g.error?.message&&(k+=` | error="${g.error.message}"`),k});c=b+S.join(`
`),f="text/plain",d=a||H("ai-txt",{},n);}else c=(e.current?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${t(e.current)}
${"=".repeat(80)}

`:"")+o.current.map(b=>`[${b.time}] ${b.type}
${t(b)}
${"=".repeat(80)}`).join(`
`),f="text/plain";return te.downloadWithFallback(c,d,f),d}}function vo(o,e,t,s){return async l=>{let a=l;if(!a)return {success:false,error:"No endpoint configured"};try{s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d={metadata:e.current,logs:o.current,fileName:H("json",{},n)},c=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:t(d)});if(!c.ok)throw new Error(`Upload failed: ${c.status}`);return {success:!0,data:await c.json()}}catch(n){let d=n instanceof Error?n.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",n),{success:false,error:d}}}}function ue(o={}){let e={...He,...o},t=react.useRef(e);t.current=e;let s=react.useRef([]),l=react.useRef(e.sessionId||fo()),a=react.useRef(go(l.current,e.environment,e.userId,0)),[n,d]=react.useState(0),c=react.useRef(0),f=react.useMemo(()=>ho(),[]),h=react.useMemo(()=>ve.getInstance(),[]),b=react.useMemo(()=>new Se({excludeUrls:e.excludeUrls}),[e.excludeUrls]),S=react.useMemo(()=>new ke({excludeUrls:e.excludeUrls}),[e.excludeUrls]),z=react.useMemo(()=>yo({logsRef:s,metadataRef:a,errorCountRef:c},{maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount??5,sanitizeKeys:e.sanitizeKeys,environment:e.environment,userId:e.userId},f,d),[e,f]),g=z.addLog,D=z.updateMetadata,B=react.useMemo(()=>wo(s,a,f,D),[f,D]),W=react.useMemo(()=>vo(s,a,f,D),[f,D]);react.useEffect(()=>{if(typeof window>"u")return;let w=t.current;if(w.enablePersistence)try{let y=localStorage.getItem(w.persistenceKey);y&&(s.current=JSON.parse(y),d(s.current.length));}catch{}let Q=[];if(w.captureConsole){h.attach();let y=(O,M)=>{let j=M.map(p=>{if(typeof p=="object")try{return f(p)}catch{return String(p)}return String(p)}).join(" ");g({type:"CONSOLE",level:O.toUpperCase(),time:new Date().toISOString(),data:j.substring(0,5e3)});};h.onLog(y),Q.push(()=>{h.removeLog(y),h.detach();});}if(w.captureFetch){let y=new Map,O=(p,x)=>{let I=mo(),$=null;if(x?.body)try{$=typeof x.body=="string"?JSON.parse(x.body):x.body,$=we($,{keys:w.sanitizeKeys});}catch{$=String(x.body).substring(0,1e3);}let F=window.setTimeout(()=>{y.delete(I);},3e4);y.set(I,{url:p,method:x?.method||"GET",headers:qe(x?.headers,w.sanitizeKeys),body:$,timeoutId:F}),g({type:"FETCH_REQ",id:I,url:p,method:x?.method||"GET",headers:qe(x?.headers,w.sanitizeKeys),body:$,time:new Date().toISOString()});},M=(p,x,I)=>{for(let[$,F]of y.entries())if(F.url===p){clearTimeout(F.timeoutId),y.delete($),g({type:"FETCH_RES",id:$,url:p,status:x,statusText:"",duration:`${I}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}},j=(p,x)=>{for(let[I,$]of y.entries())if($.url===p){clearTimeout($.timeoutId),y.delete(I),g({type:"FETCH_ERR",id:I,url:p,error:x.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}};b.onFetchRequest(O),b.onFetchResponse(M),b.onFetchError(j),b.attach(),Q.push(()=>{b.removeFetchRequest(O),b.removeFetchResponse(M),b.removeFetchError(j),b.detach();});}if(w.captureXHR){let y=new Map,O=p=>{let x=window.setTimeout(()=>{y.delete(p.requestId);},3e4);y.set(p.requestId,{url:p.url,method:p.method,headers:p.headers,body:p.body,timeoutId:x}),g({type:"XHR_REQ",id:p.requestId,url:p.url,method:p.method,headers:p.headers,body:p.body,time:new Date().toISOString()});},M=(p,x,I)=>{let $=y.get(p.requestId);$&&(clearTimeout($.timeoutId),y.delete(p.requestId),g({type:"XHR_RES",id:p.requestId,url:p.url,status:x,statusText:"",duration:`${I}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()}));},j=(p,x)=>{let I=y.get(p.requestId);I&&(clearTimeout(I.timeoutId),y.delete(p.requestId),g({type:"XHR_ERR",id:p.requestId,url:p.url,error:x.message,duration:"[unknown]ms",time:new Date().toISOString()}));};S.onXHRRequest(O),S.onXHRResponse(M),S.onXHRError(j),S.attach(),Q.push(()=>{S.removeXHRRequest(O),S.removeXHRResponse(M),S.removeXHRError(j),S.detach();});}if(w.enablePersistence&&w.persistAcrossReloads===false){let y=()=>{try{localStorage.removeItem(w.persistenceKey);}catch{}};window.addEventListener("beforeunload",y),Q.push(()=>window.removeEventListener("beforeunload",y));}return ()=>{Q.forEach(y=>y());}},[]);let k=react.useCallback(()=>{if(s.current=[],d(0),c.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{}},[e.enablePersistence,e.persistenceKey]),Fe=react.useCallback(()=>[...s.current],[]),ne=react.useCallback(()=>s.current.length,[]),Pe=react.useCallback(()=>(D(),{...a.current}),[D]);return {downloadLogs:B,uploadLogs:W,clearLogs:k,getLogs:Fe,getLogCount:ne,getMetadata:Pe,sessionId:l.current,_logCount:n}}function Co(){let[o,e]=react.useState(false),[t,s]=react.useState(false),l=react.useRef(o);l.current=o;let a=react.useRef(null);react.useEffect(()=>{s(te.isSupported());},[]);let n=react.useCallback(()=>{e(f=>!f);},[]),d=react.useCallback(()=>{e(true);},[]),c=react.useCallback(()=>{e(false);},[]);return react.useEffect(()=>{let f=b=>{b.ctrlKey&&b.shiftKey&&b.key==="D"&&(b.preventDefault(),n()),b.key==="Escape"&&l.current&&(b.preventDefault(),c());};document.addEventListener("keydown",f);let h=b=>{typeof b.detail?.visible=="boolean"&&(a.current&&clearTimeout(a.current),a.current=setTimeout(()=>{e(b.detail.visible);},10));};return window.addEventListener("glean-debug-toggle",h),()=>{document.removeEventListener("keydown",f),window.removeEventListener("glean-debug-toggle",h);}},[n,c]),{isOpen:o,toggle:n,open:d,close:c,supportsDirectoryPicker:t}}var Ro="debug-panel-copy-format",bt=["json","ecs.json","ai.txt"];function Ce(){let[o,e]=react.useState(()=>{if(typeof window<"u"){let t=localStorage.getItem(Ro);if(t&&bt.includes(t))return t}return "ecs.json"});return react.useEffect(()=>{localStorage.setItem(Ro,o);},[o]),{copyFormat:o,setCopyFormat:e}}function Eo(){let[o,e]=react.useState(null),[t,s]=react.useState(null),[l,a]=react.useState(null),[n,d]=react.useState(false);return react.useEffect(()=>{if(o){let c=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(c)}},[o]),react.useEffect(()=>{if(t){let c=setTimeout(()=>{s(null);},3e3);return ()=>clearTimeout(c)}},[t]),react.useEffect(()=>{if(l){let c=setTimeout(()=>{a(null);},3e3);return ()=>clearTimeout(c)}},[l]),{uploadStatus:o,setUploadStatus:e,directoryStatus:t,setDirectoryStatus:s,copyStatus:l,setCopyStatus:a,showSettings:n,setShowSettings:d}}function Io(){let[o,e]=react.useState(false),t=react.useCallback(()=>{e(true);},[]),s=react.useCallback(()=>{e(false);},[]),l=react.useCallback(()=>{e(a=>!a);},[]);return {isSettingsOpen:o,openSettings:t,closeSettings:s,toggleSettings:l}}var r={glassBg:"rgba(255, 255, 255, 0.75)",glassBorder:"rgba(255, 255, 255, 0.4)",glassShadow:"0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",colors:{primary:"#1a1a2e",secondary:"#4a5568",muted:"#a0aec0",border:"rgba(0, 0, 0, 0.06)",success:"#059669",successBg:"rgba(5, 150, 105, 0.08)",successBorder:"rgba(5, 150, 105, 0.2)",error:"#dc2626",errorBg:"rgba(220, 38, 38, 0.06)",errorBorder:"rgba(220, 38, 38, 0.15)",warning:"#d97706",accent:"#0ea5e9",accentBg:"rgba(14, 165, 233, 0.08)",accentBorder:"rgba(14, 165, 233, 0.2)"},fonts:{display:'-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',mono:'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'},space:{xs:"4px",sm:"8px",md:"12px",lg:"16px"},radius:{sm:"6px",md:"10px",lg:"16px",full:"9999px"},transitions:{fast:"0.15s ease",normal:"0.25s cubic-bezier(0.4, 0, 0.2, 1)",slow:"0.4s cubic-bezier(0.4, 0, 0.2, 1)"}},Xe=goober.css`
  position: fixed;
  bottom: ${r.space.lg};
  right: ${r.space.lg};
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${r.colors.primary};
  color: #ffffff;
  border: none;
  border-radius: ${r.radius.full};
  cursor: pointer;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all ${r.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.45),
      0 0 0 1px rgba(255, 255, 255, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      0 2px 10px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }
`,No=goober.css`
  position: absolute;
  top: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  background: ${r.colors.error};
  border: 2px solid ${r.colors.primary};
  border-radius: ${r.radius.full};
  box-shadow: 0 1px 4px rgba(220, 38, 38, 0.4);
`;goober.css`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${r.radius.full};
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(4px);
`;goober.css`
  background: ${r.colors.error};
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${r.radius.full};
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
`;var Ge=goober.css`
  position: fixed;
  bottom: 70px;
  right: ${r.space.lg};
  z-index: 9999;
  width: 380px;
  max-height: 520px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background: ${r.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: ${r.radius.lg};
  border: 1px solid ${r.glassBorder};
  box-shadow: ${r.glassShadow};
  font-family: ${r.fonts.display};
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`,Ke=goober.css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${r.space.lg};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
  border-bottom: 1px solid ${r.colors.border};
`,Oo=goober.css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`,Je=goober.css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${r.colors.primary};
  letter-spacing: -0.01em;
`,yt=goober.css`
  margin: 0;
  font-size: 11px;
  color: ${r.colors.muted};
  font-family: ${r.fonts.mono};
  font-weight: 500;
`,Ve=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: ${r.radius.sm};
  color: ${r.colors.muted};
  cursor: pointer;
  transition: all ${r.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${r.colors.secondary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
`,Ye=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: ${r.radius.sm};
  color: ${r.colors.muted};
  cursor: pointer;
  transition: all ${r.transitions.fast};

  &:hover {
    background: ${r.colors.errorBg};
    color: ${r.colors.error};
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
`,Ie=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: ${r.radius.sm};
  color: ${r.colors.muted};
  cursor: pointer;
  transition: all ${r.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${r.colors.accent};
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
`,ht=goober.css`
  position: fixed;
  top: auto;
  left: auto;
  margin-top: ${r.space.xs};
  min-width: 180px;
  max-width: 220px;
  padding: ${r.space.sm} ${r.space.md};
  background: ${r.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${r.glassBorder};
  border-radius: ${r.radius.md};
  box-shadow: ${r.glassShadow};
  z-index: 10000;
  font-size: 11px;
  line-height: 1.6;
  pointer-events: none;
`;goober.css`
  display: flex;
  justify-content: space-between;
  gap: ${r.space.md};
  padding: ${r.space.xs} 0;
  border-bottom: 1px solid ${r.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;var xt=goober.css`
  color: ${r.colors.muted};
  font-weight: 500;
`,wt=goober.css`
  color: ${r.colors.primary};
  font-weight: 500;
  text-align: right;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,We=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: ${r.colors.border};
`,pe=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${r.space.lg};
  background: rgba(255, 255, 255, 0.6);
  gap: ${r.space.xs};
`,ge=goober.css`
  font-size: 28px;
  font-weight: 700;
  color: ${r.colors.primary};
  line-height: 1;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`,fe=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`,Mo=goober.css`
  color: ${r.colors.error};
`,Fo=goober.css`
  color: ${r.colors.warning};
`,q={warmCream:"rgba(255, 252, 245, 0.85)",warmGray:"#4a4543",warmMuted:"#8a857f",copperAccent:"#c17f59",copperSubtle:"rgba(193, 127, 89, 0.12)"},Lo=goober.css`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Source+Sans+3:wght@400;500;600&display=swap');

  font-family: 'Source Sans 3', ${r.fonts.display};
  padding: ${r.space.md} ${r.space.lg};
  background: ${q.warmCream};
  border-bottom: 1px solid rgba(74, 69, 67, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
`,Ee=goober.css`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${r.space.sm};
  width: 100%;
  padding: ${r.space.sm} 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 600;
  color: ${q.warmGray};
  text-transform: none;
  letter-spacing: 0.02em;
  transition: color ${r.transitions.normal};

  &:hover {
    color: ${q.copperAccent};
  }

  &:focus-visible {
    outline: 2px solid ${q.copperAccent};
    outline-offset: 2px;
    border-radius: 4px;
  }
`,vt=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${q.copperSubtle};
  border-radius: ${r.radius.sm};
  color: ${q.copperAccent};
  transition: all ${r.transitions.normal};

  ${Ee}:hover & {
    background: ${q.copperAccent};
    color: #ffffff;
  }
`;goober.css`
  transition: transform ${r.transitions.slow};

  &.glean-open {
    transform: rotate(180deg);
  }
`;goober.css`
  flex: 1;
`;goober.css`
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(74, 69, 67, 0.15) 20%,
    rgba(74, 69, 67, 0.15) 80%,
    transparent 100%
  );
  margin-left: ${r.space.md};
  transition: opacity ${r.transitions.normal};
`;goober.css`
  overflow: hidden;
  transition:
    height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s ease;
`;var St=goober.css`
  padding-top: ${r.space.md};
`;goober.css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${r.space.md};
  padding: ${r.space.xs} 0;
  font-size: 13px;
  line-height: 1.6;
`;var kt=goober.css`
  font-weight: 600;
  color: ${q.warmMuted};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-size: 13px;
  min-width: 100px;
`,$t=goober.css`
  font-weight: 500;
  color: ${q.warmGray};
  text-align: right;
  flex: 1;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
`,Ct=goober.css`
  font-weight: 500;
  color: ${q.warmGray};
  text-align: right;
  flex: 1;
  font-family: ${r.fonts.mono};
  font-size: 13px;
  background: rgba(0, 0, 0, 0.03);
  padding: 3px 8px;
  border-radius: 4px;
`,Qe=goober.css`
  padding: ${r.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${r.space.lg};
  background: rgba(255, 255, 255, 0.3);
`,Le=goober.css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.sm};
`,be=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;goober.css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${r.space.sm};
`;var De=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${r.space.sm};
`,me=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${r.space.xs};
  padding: ${r.space.sm} ${r.space.md};
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid ${r.colors.border};
  border-radius: ${r.radius.md};
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  color: ${r.colors.secondary};
  transition: all ${r.transitions.fast};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(245, 245, 245, 0.8);
    border-color: ${r.colors.border};
  }
`;goober.css`
  ${me}
`;var Rt=goober.css`
  ${me}
  background: ${r.colors.accentBg};
  border-color: ${r.colors.accentBorder};
  color: ${r.colors.accent};

  &:hover:not(:disabled) {
    background: ${r.colors.accent};
    color: #ffffff;
    border-color: ${r.colors.accent};
  }
`,Ze=goober.css`
  ${me}
  background: ${r.colors.successBg};
  border-color: ${r.colors.successBorder};
  color: ${r.colors.success};

  &:hover:not(:disabled) {
    background: ${r.colors.success};
    color: #ffffff;
    border-color: ${r.colors.success};
  }
`,Et=goober.css`
  ${me}
  background: ${r.colors.errorBg};
  border-color: ${r.colors.errorBorder};
  color: ${r.colors.error};

  &:hover:not(:disabled) {
    background: ${r.colors.error};
    color: #ffffff;
    border-color: ${r.colors.error};
  }
`,_=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${r.space.md} ${r.space.sm};
  min-height: 52px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid ${r.colors.border};
  border-radius: ${r.radius.md};
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${r.colors.secondary};
  line-height: 1.2;
  transition: all ${r.transitions.fast};

  & svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    transition: transform ${r.transitions.fast};
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    & svg {
      transform: scale(1.1);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(245, 245, 245, 0.8);
    border-color: ${r.colors.border};
  }
`,It=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${r.space.md} ${r.space.sm};
  min-height: 52px;
  background: ${r.colors.errorBg};
  border: 1px solid ${r.colors.errorBorder};
  border-radius: ${r.radius.md};
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${r.colors.error};
  line-height: 1.2;
  transition: all ${r.transitions.fast};

  & svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    background: ${r.colors.error};
    color: #ffffff;
    border-color: ${r.colors.error};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Po=goober.css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.xs};
  padding: 0 ${r.space.lg} ${r.space.sm};
`,eo=goober.css`
  display: flex;
  align-items: center;
  gap: ${r.space.sm};
  padding: ${r.space.sm} ${r.space.md};
  background: ${r.colors.successBg};
  border: 1px solid ${r.colors.successBorder};
  border-radius: ${r.radius.md};
  font-size: 11px;
  color: ${r.colors.success};
  font-weight: 500;

  & svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`,oo=goober.css`
  display: flex;
  align-items: center;
  gap: ${r.space.sm};
  padding: ${r.space.sm} ${r.space.md};
  background: ${r.colors.errorBg};
  border: 1px solid ${r.colors.errorBorder};
  border-radius: ${r.radius.md};
  font-size: 11px;
  color: ${r.colors.error};
  font-weight: 500;

  & svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`,Ao=goober.css`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,to=goober.css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${r.space.md};
  background: rgba(255, 255, 255, 0.5);
  border-top: 1px solid ${r.colors.border};

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: ${r.radius.sm};
    font-family: ${r.fonts.mono};
    font-size: 10px;
    color: ${r.colors.muted};
    border: 1px solid ${r.colors.border};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }
`,ro=goober.css`
  font-size: 11px;
  color: ${r.colors.muted};
`,zo=`
  0 0 0 1px rgba(0, 0, 0, 0.04),
  0 2px 8px rgba(0, 0, 0, 0.06),
  0 8px 24px rgba(0, 0, 0, 0.08)
`,Te=goober.css`
  min-width: 200px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: ${zo};
  padding: 12px;
  animation: dropdownIn 0.2s cubic-bezier(0.2, 0.08, 0.15, 0.95);
  transform-origin: top right;

  @keyframes dropdownIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;goober.css`
  fill: rgba(255, 255, 255, 0.95);
  filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.06));
`;var ye=goober.css`
  padding: 8px 10px 6px 0px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-family: ${r.fonts.display};
`,V=goober.css`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  line-height: 1.5;
`,X=goober.css`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;
  min-width: 70px;
  font-family: ${r.fonts.display};
`,G=goober.css`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  font-size: 12px;
  font-family: ${r.fonts.display};
`,no=goober.css`
  ${G}
  font-family: ${r.fonts.mono};
  font-size: 11px;
  letter-spacing: -0.02em;
  color: rgba(0, 0, 0, 0.65);
`,Ne=goober.css`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  font-family: ${r.fonts.display};
  transition: all 0.12s ease;

  & svg {
    width: 14px;
    height: 14px;
    opacity: 0.4;
    transition: all 0.12s ease;
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: rgba(0, 0, 0, 0.85);

    & svg {
      opacity: 0.7;
    }
  }
`,so=goober.css`
  margin-left: auto;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 600;
`,ao=goober.css`
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 8px 0;
  border-radius: 1px;
`,Lt=goober.css`
  min-width: 180px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: ${zo};
  padding: 6px;
  animation: dropdownIn 0.2s cubic-bezier(0.2, 0.08, 0.15, 0.95);
  transform-origin: top right;

  @keyframes dropdownIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`,Do=goober.css`
  padding: 8px 10px 6px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-family: ${r.fonts.display};
  background: rgba(0, 0, 0, 0.02);
  margin: -6px -6px 6px -6px;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
`,_e=goober.css`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
  font-family: ${r.fonts.display};
  transition: all 0.15s ease;

  & svg {
    width: 14px;
    height: 14px;
    opacity: 0.6;
    transition: all 0.15s ease;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: rgba(0, 0, 0, 0.85);

    & svg {
      opacity: 1;
      transform: scale(1.05);
    }
  }
`,To=goober.css`
  ${_e}
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.9);

  & svg {
    opacity: 1;
  }
`;goober.css`
  @media (prefers-color-scheme: dark) {
    :root {
      --glass-bg: rgba(30, 30, 46, 0.85);
      --glass-border: rgba(255, 255, 255, 0.08);
    }

    ${Ge} {
      background: rgba(30, 30, 46, 0.9);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    ${Ke} {
      background: linear-gradient(135deg, rgba(40, 40, 60, 0.8) 0%, rgba(30, 30, 46, 0.6) 100%);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Je} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${yt} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Ve} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
    }

    ${Ye} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(220, 38, 38, 0.2);
        color: #f87171;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
      }
    }

    ${Ie} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(14, 165, 233, 0.15);
        color: #38bdf8;
        box-shadow: 0 2px 8px rgba(14, 165, 233, 0.25);
      }
    }

    ${ht} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${xt} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${wt} {
      color: rgba(255, 255, 255, 0.9);
    }

    ${We} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${pe} {
      background: rgba(40, 40, 60, 0.5);
    }

    ${ge} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${fe} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Lo} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Ee} {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${St} {
      background: rgba(40, 40, 60, 0.5);
      color: rgba(255, 255, 255, 0.6);

      strong {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    ${Qe} {
      background: rgba(40, 40, 60, 0.3);
    }

    ${be} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${me} {
      background: rgba(50, 50, 70, 0.8);
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);

      &:hover:not(:disabled) {
        background: rgba(60, 60, 85, 0.9);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }

    ${Rt} {
      background: rgba(14, 165, 233, 0.15);
      border-color: rgba(14, 165, 233, 0.25);
      color: #38bdf8;

      &:hover:not(:disabled) {
        background: #0ea5e9;
        color: #ffffff;
        border-color: #0ea5e9;
      }
    }

    ${Ze} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;

      &:hover:not(:disabled) {
        background: #059669;
        color: #ffffff;
        border-color: #059669;
      }
    }

    ${Et},
    ${It} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;

      &:hover:not(:disabled) {
        background: #dc2626;
        color: #ffffff;
        border-color: #dc2626;
      }
    }

    ${eo} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;
    }

    ${oo} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;
    }

    ${to} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);

      kbd {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.5);
      }
    }

    ${ro} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Xe} {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.05);

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        box-shadow:
          0 6px 20px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 255, 255, 0.08);
      }
    }

    ${Lt},
    ${Te} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.3),
        0 12px 48px rgba(0, 0, 0, 0.4);
    }

    ${X} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${G} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${no} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }

    ${ye},
    ${Do} {
      color: rgba(255, 255, 255, 0.35);
      background: rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Ne},
    ${_e} {
      color: rgba(255, 255, 255, 0.7);

      & svg {
        opacity: 0.5;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.95);

        & svg {
          opacity: 1;
        }
      }
    }

    ${To} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);

      & svg {
        opacity: 1;
      }
    }

    ${ao} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${so} {
      color: rgba(255, 255, 255, 0.5);
    }

    ${Do} {
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${_e} {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    ${To} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }

    ${Lo} {
      background: rgba(40, 40, 60, 0.5);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Ee} {
      color: rgba(255, 255, 255, 0.75);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${vt} {
      background: rgba(193, 127, 89, 0.18);
      color: rgba(193, 127, 89, 0.9);

      ${Ee}:hover & {
        background: rgba(193, 127, 89, 0.9);
        color: #ffffff;
      }
    }

    ${kt} {
      color: rgba(255, 255, 255, 0.5);
    }

    ${$t} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${Ct} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;function At({metadata:o}){return jsxRuntime.jsxs("div",{className:Te,children:[jsxRuntime.jsx("div",{className:ye,children:"Session Details"}),jsxRuntime.jsxs("div",{className:V,children:[jsxRuntime.jsx("span",{className:X,children:"User"}),jsxRuntime.jsx("span",{className:G,children:o.userId||"Anonymous"})]}),jsxRuntime.jsxs("div",{className:V,children:[jsxRuntime.jsx("span",{className:X,children:"Session ID"}),jsxRuntime.jsx("span",{className:no,children:o.sessionId||"N/A"})]}),jsxRuntime.jsxs("div",{className:V,children:[jsxRuntime.jsx("span",{className:X,children:"Browser"}),jsxRuntime.jsxs("span",{className:G,children:[o.browser," \xB7 ",o.platform]})]}),jsxRuntime.jsxs("div",{className:V,children:[jsxRuntime.jsx("span",{className:X,children:"Screen"}),jsxRuntime.jsx("span",{className:G,children:o.screenResolution})]}),jsxRuntime.jsxs("div",{className:V,children:[jsxRuntime.jsx("span",{className:X,children:"Timezone"}),jsxRuntime.jsx("span",{className:G,children:o.timezone})]}),jsxRuntime.jsxs("div",{className:V,children:[jsxRuntime.jsx("span",{className:X,children:"Language"}),jsxRuntime.jsx("span",{className:G,children:o.language})]}),jsxRuntime.jsxs("div",{className:V,children:[jsxRuntime.jsx("span",{className:X,children:"Viewport"}),jsxRuntime.jsx("span",{className:G,children:o.viewport})]})]})}function zt({copyFormat:o,setCopyFormat:e,onSaveToDirectory:t,onCloseDropdown:s}){let l=["json","ecs.json","ai.txt"],a={json:jsxRuntime.jsx(lucideReact.FileJson,{size:14}),"ecs.json":jsxRuntime.jsx(lucideReact.FileText,{size:14}),"ai.txt":jsxRuntime.jsx(lucideReact.FileText,{size:14})};return jsxRuntime.jsxs("div",{className:Te,children:[jsxRuntime.jsx("div",{className:ye,children:"Export format"}),jsxRuntime.jsx("div",{style:{display:"flex",flexDirection:"column",gap:2},children:l.map(n=>jsxRuntime.jsxs("button",{type:"button",className:Ne,style:o===n?{background:"rgba(0, 0, 0, 0.06)",color:"rgba(0, 0, 0, 0.9)"}:void 0,onClick:()=>{e(n),s();},children:[a[n],jsxRuntime.jsxs("span",{style:{flex:1},children:[n==="json"&&"JSON",n==="ecs.json"&&"ECS (AI)",n==="ai.txt"&&"AI-TXT"]}),o===n&&jsxRuntime.jsx("span",{className:so,children:"\u2713"})]},n))}),jsxRuntime.jsx("div",{className:ao}),jsxRuntime.jsx("div",{className:ye,children:"Actions"}),jsxRuntime.jsxs("button",{type:"button",className:Ne,onClick:()=>{t(),s();},children:[jsxRuntime.jsx(lucideReact.Save,{size:14}),jsxRuntime.jsx("span",{children:"Save to folder"})]})]})}var qo=react.forwardRef(function({metadata:e,onClose:t,onSaveToDirectory:s,onClear:l,isSettingsOpen:a,openSettings:n,closeSettings:d,isSessionDetailsOpen:c,openSessionDetails:f,closeSessionDetails:h},b){let{copyFormat:S,setCopyFormat:z}=Ce();return jsxRuntime.jsx(jsxRuntime.Fragment,{children:jsxRuntime.jsxs("div",{className:Ke,children:[jsxRuntime.jsx("div",{className:Oo,children:jsxRuntime.jsx("h3",{className:Je,children:"Debug"})}),jsxRuntime.jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsxRuntime.jsx("button",{type:"button",onClick:l,className:Ye,"aria-label":"Clear all logs",title:"Clear logs",children:jsxRuntime.jsx(lucideReact.Trash2,{size:16})}),jsxRuntime.jsxs(P__namespace.Root,{open:c,onOpenChange:g=>{g?f():h();},children:[jsxRuntime.jsx(P__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",className:Ie,"aria-label":"Session details",title:"Session details",children:jsxRuntime.jsx(lucideReact.Info,{size:16})})}),jsxRuntime.jsx(P__namespace.Portal,{children:jsxRuntime.jsx(P__namespace.Content,{sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:g=>{g.target.closest("#debug-panel")&&g.preventDefault();},children:jsxRuntime.jsx(At,{metadata:e})})})]}),jsxRuntime.jsxs(P__namespace.Root,{open:a,onOpenChange:g=>{g?n():d();},children:[jsxRuntime.jsx(P__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",className:Ie,"aria-label":"Actions and settings",title:"Actions and settings","data-settings-trigger":"true",children:jsxRuntime.jsx(lucideReact.Settings,{size:16})})}),jsxRuntime.jsx(P__namespace.Portal,{children:jsxRuntime.jsx(P__namespace.Content,{"data-settings-dropdown":"true",sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:g=>{g.target.closest("#debug-panel")&&g.preventDefault();},children:jsxRuntime.jsx(zt,{copyFormat:S,setCopyFormat:z,onSaveToDirectory:s,onCloseDropdown:()=>d()})})})]}),jsxRuntime.jsx("button",{ref:b,type:"button",onClick:t,className:Ve,"aria-label":"Close debug panel",children:jsxRuntime.jsx(lucideReact.X,{size:18})})]})]})})});function Bo({logCount:o,errorCount:e,networkErrorCount:t}){return jsxRuntime.jsxs("div",{className:We,children:[jsxRuntime.jsxs("div",{className:pe,children:[jsxRuntime.jsx("div",{className:ge,children:o.toLocaleString()}),jsxRuntime.jsx("div",{className:fe,children:"Logs"})]}),jsxRuntime.jsxs("div",{className:pe,children:[jsxRuntime.jsx("div",{className:`${ge} ${Mo}`,children:e.toLocaleString()}),jsxRuntime.jsx("div",{className:fe,children:"Errors"})]}),jsxRuntime.jsxs("div",{className:pe,children:[jsxRuntime.jsx("div",{className:`${ge} ${Fo}`,children:t.toLocaleString()}),jsxRuntime.jsx("div",{className:fe,children:"Network"})]})]})}function K({children:o,content:e,disabled:t,...s}){return jsxRuntime.jsx(A__namespace.Provider,{delayDuration:200,skipDelayDuration:100,children:jsxRuntime.jsxs(A__namespace.Root,{children:[jsxRuntime.jsx(A__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",disabled:t,...s,children:o})}),!t&&jsxRuntime.jsx(A__namespace.Portal,{children:jsxRuntime.jsxs(A__namespace.Content,{side:"top",sideOffset:6,align:"center",style:{background:"var(--color-primary, #1a1a2e)",color:"white",padding:"6px 12px",borderRadius:"6px",fontSize:"11px",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",zIndex:1e5},children:[e,jsxRuntime.jsx(A__namespace.Arrow,{style:{fill:"var(--color-primary, #1a1a2e)"}})]})})]})})}function Uo({logCount:o,hasUploadEndpoint:e,isUploading:t,getFilteredLogCount:s,onCopyFiltered:l,onDownload:a,onCopy:n,onUpload:d}){let c=o===0;return jsxRuntime.jsxs("div",{className:Qe,children:[jsxRuntime.jsxs("div",{className:Le,children:[jsxRuntime.jsx("div",{className:be,children:"Copy Filtered"}),jsxRuntime.jsxs("div",{className:De,children:[jsxRuntime.jsxs(K,{content:"Copy only console logs",disabled:c||s("logs")===0,onClick:()=>l("logs"),className:_,"aria-label":"Copy only console logs",children:[jsxRuntime.jsx(lucideReact.Terminal,{size:18}),"Logs"]}),jsxRuntime.jsxs(K,{content:"Copy only errors",disabled:c||s("errors")===0,onClick:()=>l("errors"),className:_,"aria-label":"Copy only errors",children:[jsxRuntime.jsx(lucideReact.AlertCircle,{size:18}),"Errors"]}),jsxRuntime.jsxs(K,{content:"Copy only network requests",disabled:c||s("network")===0,onClick:()=>l("network"),className:_,"aria-label":"Copy only network requests",children:[jsxRuntime.jsx(lucideReact.Globe,{size:18}),"Network"]})]})]}),jsxRuntime.jsxs("div",{className:Le,children:[jsxRuntime.jsx("div",{className:be,children:"Export"}),jsxRuntime.jsxs("div",{className:De,children:[jsxRuntime.jsxs(K,{content:"Download as JSON",disabled:c,onClick:()=>a("json"),className:_,"aria-label":"Download as JSON",children:[jsxRuntime.jsx(lucideReact.FileJson,{size:18}),"JSON"]}),jsxRuntime.jsxs(K,{content:"Download as TXT",disabled:c,onClick:()=>a("txt"),className:_,"aria-label":"Download as TXT",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"TXT"]}),jsxRuntime.jsxs(K,{content:"Download as JSONL",disabled:c,onClick:()=>a("jsonl"),className:_,"aria-label":"Download as JSONL",children:[jsxRuntime.jsx(lucideReact.Database,{size:18}),"JSONL"]})]})]}),jsxRuntime.jsxs("div",{className:Le,children:[jsxRuntime.jsx("div",{className:be,children:"Actions"}),jsxRuntime.jsxs("div",{className:De,children:[jsxRuntime.jsxs(K,{content:"Copy all to clipboard",disabled:c,onClick:n,className:_,"aria-label":"Copy all to clipboard",children:[jsxRuntime.jsx(lucideReact.Copy,{size:18}),"Copy"]}),jsxRuntime.jsxs(K,{content:"Download AI-optimized format",disabled:c,onClick:()=>a("ai.txt"),className:_,"aria-label":"Download AI-optimized format",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"AI-TXT"]}),e?jsxRuntime.jsxs(K,{content:"Upload logs to server",disabled:t,onClick:d,className:Ze,"aria-label":"Upload logs to server",children:[jsxRuntime.jsx(lucideReact.CloudUpload,{size:18}),t?"Uploading...":"Upload"]}):jsxRuntime.jsx("div",{})]})]})]})}function io({status:o}){return jsxRuntime.jsxs("div",{"aria-live":"polite",className:o.type==="success"?eo:oo,children:[o.type==="success"?jsxRuntime.jsx(lucideReact.CheckCircle2,{size:14}):jsxRuntime.jsx(lucideReact.AlertCircle,{size:14}),jsxRuntime.jsx("span",{className:Ao,children:o.message})]})}function _o({uploadStatus:o,directoryStatus:e,copyStatus:t}){return jsxRuntime.jsxs("div",{className:Po,children:[o&&jsxRuntime.jsx(io,{status:o}),e&&jsxRuntime.jsx(io,{status:e}),t&&jsxRuntime.jsx(io,{status:t})]})}function Ko(){return jsxRuntime.jsx("div",{className:to,children:jsxRuntime.jsxs("div",{className:ro,children:["Press ",jsxRuntime.jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function Vo(o,e){switch(e){case "logs":return o.filter(t=>t.type==="CONSOLE");case "errors":return o.filter(t=>t.type==="CONSOLE"&&t.level==="error");case "network":return o.filter(t=>t.type==="FETCH_REQ"||t.type==="FETCH_RES"||t.type==="XHR_REQ"||t.type==="XHR_RES");case "networkErrors":return o.filter(t=>t.type==="FETCH_ERR"||t.type==="XHR_ERR");default:return o}}function co({user:o,environment:e="production",uploadEndpoint:t,fileNameTemplate:s="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:l=2e3,showInProduction:a=false}){let{isOpen:n,open:d,close:c}=Co(),{isSettingsOpen:f,openSettings:h,closeSettings:b}=Io(),{copyFormat:S}=Ce(),[z,g]=react.useState(false),D=react.useCallback(()=>{g(true);},[]),B=react.useCallback(()=>{g(false);},[]),{uploadStatus:W,setUploadStatus:k,directoryStatus:Fe,setDirectoryStatus:ne,copyStatus:Pe,setCopyStatus:w}=Eo(),Q=react.useRef(null),y=react.useRef(null),{downloadLogs:O,uploadLogs:M,clearLogs:j,getLogs:p,getMetadata:x,_logCount:I}=ue({fileNameTemplate:s,environment:e,userId:o?.id||o?.email||"guest",includeMetadata:true,uploadEndpoint:t,maxLogs:l,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),$=I,F=x();react.useEffect(()=>{if(F.errorCount>=5&&t){let m=async()=>{try{await M();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",m),()=>window.removeEventListener("error",m)}},[F.errorCount,t,M]);let xe=react.useCallback((m,T)=>{if(S==="json")return JSON.stringify({metadata:T,logs:m},null,2);if(S==="ecs.json"){let Z=m.map(ae=>U(ae,T)),se={metadata:oe(T),logs:Z};return JSON.stringify(se,null,2)}else if(S==="ai.txt"){let Z=`# METADATA
service.name=${T.environment||"unknown"}
user.id=${T.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,se=m.map(ae=>{let L=U(ae,T),uo=L["@timestamp"],po=L["log.level"],at=L["event.category"]?.[0]||"unknown",ie=`[${uo}] ${po} ${at}`;return L.message&&(ie+=` | message="${L.message}"`),L.http?.request?.method&&(ie+=` | req.method=${L.http.request.method}`),L.url?.full&&(ie+=` | url=${L.url.full}`),L.http?.response?.status_code&&(ie+=` | res.status=${L.http.response.status_code}`),L.error?.message&&(ie+=` | error="${L.error.message}"`),ie});return Z+se.join(`
`)}return JSON.stringify({metadata:T,logs:m},null,2)},[S]),et=react.useCallback(async()=>{k(null);try{let m=await M();m.success?(k({type:"success",message:`Uploaded successfully! ${m.data?JSON.stringify(m.data):""}`}),m.data&&typeof m.data=="object"&&"url"in m.data&&await navigator.clipboard.writeText(String(m.data.url))):k({type:"error",message:`Upload failed: ${m.error}`});}catch(m){k({type:"error",message:`Error: ${m instanceof Error?m.message:"Unknown error"}`});}},[M,k]),ot=react.useCallback(m=>{let T=O(m);T&&k({type:"success",message:`Downloaded: ${T}`});},[O,k]),tt=react.useCallback(async()=>{ne(null);try{await O("json",void 0,{showPicker:!0})&&ne({type:"success",message:"Saved to directory"});}catch{ne({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[O,ne]),rt=react.useCallback(async()=>{w(null);try{let m=p(),T=x(),Z=xe(m,T);await navigator.clipboard.writeText(Z),w({type:"success",message:"Copied to clipboard!"});}catch{w({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[p,x,xe,w]),nt=react.useCallback(async m=>{w(null);try{let T=p(),Z=x(),se=Vo(T,m),ae=se.length;if(ae===0){w({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[m]});return}let L=xe(se,Z);await navigator.clipboard.writeText(L),w({type:"success",message:`Copied ${ae} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[m]} to clipboard`});}catch{w({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[p,x,xe,w]),st=react.useCallback(m=>Vo(p(),m).length,[p]);return a||e==="development"||o?.role==="admin"?jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs(framerMotion.motion.button,{type:"button",onClick:m=>{m.stopPropagation(),n?c():d();},className:Xe,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",whileHover:{scale:1.02},whileTap:{scale:.98},layout:true,children:[jsxRuntime.jsx(lucideReact.Bug,{size:18}),F.errorCount>0&&jsxRuntime.jsx(framerMotion.motion.span,{className:No,initial:{scale:0},animate:{scale:1}},`err-${F.errorCount}`)]}),jsxRuntime.jsx(framerMotion.AnimatePresence,{mode:"wait",children:n&&jsxRuntime.jsx(framerMotion.motion.div,{ref:Q,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:Ge,initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:20,scale:.95},transition:{duration:.25,ease:[.4,0,.2,1]},children:jsxRuntime.jsxs(Y__namespace.Root,{className:"glean-scroll-area",style:{flex:1,overflow:"hidden"},children:[jsxRuntime.jsxs(Y__namespace.Viewport,{className:"glean-scroll-viewport",style:{width:"100%",height:"100%"},children:[jsxRuntime.jsx(qo,{metadata:F,onClose:c,onSaveToDirectory:tt,onClear:()=>{confirm("Clear all logs?")&&j();},ref:y,isSettingsOpen:f,openSettings:h,closeSettings:b,isSessionDetailsOpen:z,openSessionDetails:D,closeSessionDetails:B}),jsxRuntime.jsx(Bo,{logCount:$,errorCount:F.errorCount,networkErrorCount:F.networkErrorCount}),jsxRuntime.jsx("div",{style:{padding:"8px 16px",borderBottom:"1px solid var(--color-border, #e2e8f0)"},children:jsxRuntime.jsx("button",{type:"button",onClick:()=>{console.log("[TEST] Console log test message"),console.error("[TEST] Console error test message"),console.warn("[TEST] Console warn test message"),console.info("[TEST] Console info test message");},style:{background:"var(--color-primary, #6366f1)",color:"white",border:"none",padding:"6px 12px",borderRadius:"4px",cursor:"pointer",fontSize:"11px",fontWeight:500},children:"\u{1F9EA} Test Logs (4x)"})}),jsxRuntime.jsx(Uo,{logCount:$,hasUploadEndpoint:!!t,isUploading:false,getFilteredLogCount:st,onCopyFiltered:nt,onDownload:ot,onCopy:rt,onUpload:et}),jsxRuntime.jsx(_o,{uploadStatus:W,directoryStatus:Fe,copyStatus:Pe}),jsxRuntime.jsx(Ko,{})]}),jsxRuntime.jsx(Y__namespace.Scrollbar,{className:"glean-scrollbar",orientation:"vertical",style:{display:"flex",width:"6px",userSelect:"none",touchAction:"none",padding:"2px",background:"transparent"},children:jsxRuntime.jsx(Y__namespace.Thumb,{className:"glean-scrollbar-thumb",style:{flex:1,background:"rgba(0, 0, 0, 0.15)",borderRadius:"3px",transition:"background 0.15s ease"}})})]})})})]}):null}function tr({fileNameTemplate:o="debug_{timestamp}"}){let[e,t]=react.useState(false),[s,l]=react.useState(0),{downloadLogs:a,clearLogs:n,getLogCount:d}=ue({fileNameTemplate:o});return react.useEffect(()=>{l(d());let c=setInterval(()=>{l(d());},100);return ()=>clearInterval(c)},[d]),jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("button",{onClick:()=>t(c=>!c),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsxRuntime.jsx("span",{children:s})}),e&&jsxRuntime.jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsxRuntime.jsx("button",{onClick:()=>a("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsxRuntime.jsx("button",{onClick:()=>{confirm("Clear all logs?")&&n();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsxRuntime.jsx("button",{onClick:()=>t(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function ar(o){return react.useMemo(()=>o.showInProduction||o.environment==="development"||o.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[o.showInProduction,o.environment,o.user])}function ir(){let o=react.useCallback(t=>{try{typeof window<"u"&&(t?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:t}})));}catch{}},[]),e=react.useMemo(()=>typeof process<"u"&&true,[]);react.useEffect(()=>{if(typeof window>"u")return;let t=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>o(true),hide:()=>o(false),toggle:()=>{try{let s=localStorage.getItem("glean-debug-enabled")==="true";o(!s);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=t,()=>{typeof window<"u"&&window.glean===t&&delete window.glean;}},[o,e]);}function Zo(o){console.log("[GleanDebugger] Mounting with props:",o);let e=ar(o);return console.log("[GleanDebugger] isActivated:",e),ir(),e?(console.log("[GleanDebugger] Rendering DebugPanel"),jsxRuntime.jsx(co,{...o})):(console.log("[GleanDebugger] Not activated, returning null"),null)}exports.DebugPanel=co;exports.DebugPanelMinimal=tr;exports.GleanDebugger=Zo;exports.collectMetadata=go;exports.filterStackTrace=ze;exports.generateExportFilename=pr;exports.generateFilename=H;exports.generateSessionId=fo;exports.getBrowserInfo=Ae;exports.sanitizeData=we;exports.sanitizeFilename=ee;exports.transformMetadataToECS=oe;exports.transformToECS=U;exports.useLogRecorder=ue;