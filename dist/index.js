'use strict';var react=require('react'),framerMotion=require('framer-motion'),W=require('@radix-ui/react-scroll-area'),goober=require('goober'),z=require('@radix-ui/react-dropdown-menu'),lucideReact=require('lucide-react'),jsxRuntime=require('react/jsx-runtime'),H=require('@radix-ui/react-tooltip');function _interopNamespace(e){if(e&&e.__esModule)return e;var n=Object.create(null);if(e){Object.keys(e).forEach(function(k){if(k!=='default'){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})}n.default=e;return Object.freeze(n)}var W__namespace=/*#__PURE__*/_interopNamespace(W);var z__namespace=/*#__PURE__*/_interopNamespace(z);var H__namespace=/*#__PURE__*/_interopNamespace(H);// @ts-nocheck
var it=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function we(o,e={}){let t=e.keys||it;if(!o||typeof o!="object")return o;let a=Array.isArray(o)?[...o]:{...o},s=l=>{if(!l||typeof l!="object")return l;for(let n in l)if(Object.prototype.hasOwnProperty.call(l,n)){let d=n.toLowerCase();t.some(m=>d.includes(m.toLowerCase()))?l[n]="***REDACTED***":l[n]!==null&&typeof l[n]=="object"&&(l[n]=s(l[n]));}return l};return s(a)}function oe(o){return o.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function Ae(){if(typeof navigator>"u")return "unknown";let o=navigator.userAgent;return o.includes("Edg")?"edge":o.includes("Chrome")?"chrome":o.includes("Firefox")?"firefox":o.includes("Safari")?"safari":"unknown"}function fo(o,e,t,a){if(typeof window>"u")return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:a,errorCount:0,networkErrorCount:0};let s=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",l=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:Ae(),platform:navigator.platform,language:navigator.language,screenResolution:s,viewport:l,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:a,errorCount:0,networkErrorCount:0}}function bo(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function B(o="json",e={},t={}){let{fileNameTemplate:a="{env}_{userId}_{sessionId}_{timestamp}",environment:s="development",userId:l="anonymous",sessionId:n="unknown"}=t,d=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],c=new Date().toISOString().split("T")[0],m=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),y=t.browser||Ae(),b=t.platform||(typeof navigator<"u"?navigator.platform:"unknown"),R=(t.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",f=String(t.errorCount??e.errorCount??0),L=String(t.logCount??e.logCount??0),T=a.replace("{env}",oe(s)).replace("{userId}",oe(l??"anonymous")).replace("{sessionId}",oe(n??"unknown")).replace("{timestamp}",d).replace("{date}",c).replace("{time}",m).replace(/\{errorCount\}/g,f).replace(/\{logCount\}/g,L).replace("{browser}",oe(y)).replace("{platform}",oe(b)).replace("{url}",oe(R));for(let[Q,S]of Object.entries(e))T=T.replace(`{${Q}}`,String(S));return `${T}.${o}`}function ur(o,e="json"){let t=o.url.split("?")[0]||"unknown";return B(e,{},{environment:o.environment,userId:o.userId,sessionId:o.sessionId,browser:o.browser,platform:o.platform,url:t,errorCount:o.errorCount,logCount:o.logCount})}var lt={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function mo(o){let e=parseFloat(o);return isNaN(e)?0:Math.round(e*1e6)}function ct(o){return lt[o.toLowerCase()]||"info"}function ze(o){return o.filter(e=>!e.ignored).slice(0,20)}function te(o){return {service:{environment:o.environment},user:o.userId?{id:o.userId}:void 0,host:{name:o.browser,type:o.platform}}}function U(o,e){let t={"@timestamp":o.time,event:{original:o,category:[]}},a=te(e);switch(Object.assign(t,a),o.type){case "CONSOLE":{t.log={level:ct(o.level)},t.message=o.data,t.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{t.http={request:{method:o.method}},t.url={full:o.url},t.event.category=["network","web"],t.event.action="request",t.event.id=o.id;break}case "FETCH_RES":case "XHR_RES":{t.http={response:{status_code:o.status}},t.url={full:o.url},t.event.duration=mo(o.duration),t.event.category=["network","web"],t.event.action="response",t.event.id=o.id;break}case "FETCH_ERR":case "XHR_ERR":{t.error={message:o.error},t.url={full:o.url},t.event.duration=mo(o.duration),t.event.category=["network","web"],t.event.action="error",t.event.id=o.id;let s=o;if(typeof s.body=="object"&&s.body!==null){let l=s.body;if(Array.isArray(l.frames)){let n=ze(l.frames);t.error.stack_trace=n.map(d=>`  at ${d.functionName||"?"} (${d.filename||"?"}:${d.lineNumber||0}:${d.columnNumber||0})`).join(`
`);}}break}default:{t.message=JSON.stringify(o);break}}return t}var I=class I{constructor(){this.isAttached=false;I.instanceCount++,this.instanceId=I.instanceCount,this.originalLog=console.log.bind(console),this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[],I.instance=this,this.originalLog(`[ConsoleInterceptor#${this.instanceId}] \u2705 Created singleton instance (total: ${I.instanceCount})`);}static getInstance(){return I.instance||(I.instance=new I),I.instance}static resetInstance(){I.instance&&(I.instance.forceDetach(),I.instance=null);}debugLog(...e){this.originalLog(...e);}attach(){if(this.debugLog(`[ConsoleInterceptor#${this.instanceId}] attach() - isAttached=${this.isAttached}, callbacks=${this.callbacks.length}`),this.isAttached){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] ALREADY ATTACHED - skipping duplicate attach`);return}this.isAttached=true,["log","error","warn","info","debug"].forEach(t=>{let a=this.originalConsole[t];console[t]=(...s)=>{this.debugLog(`[ConsoleInterceptor#${this.instanceId}] \u{1F525} ${t}() triggered (${this.callbacks.length} callbacks)`);for(let l of this.callbacks)l(t,s);a(...s);};});}detach(){if(!this.isAttached){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] ALREADY DETACHED - skipping duplicate detach`);return}this.callbacks.length===0?this.forceDetach():this.debugLog(`[ConsoleInterceptor#${this.instanceId}] detach() SKIPPED - ${this.callbacks.length} callbacks still active`);}forceDetach(){if(!this.isAttached)return;this.isAttached=false,["log","error","warn","info","debug"].forEach(t=>{console[t]=this.originalConsole[t];}),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] Force detached`);}onLog(e){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] onLog() - callback count before: ${this.callbacks.length}`),this.callbacks.push(e),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] onLog() - callback count after: ${this.callbacks.length}`);}removeLog(e){let t=this.callbacks.indexOf(e);this.debugLog(`[ConsoleInterceptor#${this.instanceId}] removeLog() - callback found at index: ${t}, total: ${this.callbacks.length}`),t>-1&&this.callbacks.splice(t,1),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] removeLog() - callback count after: ${this.callbacks.length}`);}};I.instance=null,I.instanceCount=0;var ve=I;var Se=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t));}attach(){window.fetch=async(...e)=>{let[t,a]=e,s=t.toString();if(this.excludeUrls.some(n=>n.test(s)))return this.originalFetch(...e);let l=Date.now();this.onRequest.forEach(n=>n(s,a||{}));try{let n=await this.originalFetch(...e),d=Date.now()-l;return this.onResponse.forEach(c=>c(s,n.status,d)),n}catch(n){throw this.onError.forEach(d=>d(s,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}removeFetchRequest(e){let t=this.onRequest.indexOf(e);t>-1&&this.onRequest.splice(t,1);}onFetchResponse(e){this.onResponse.push(e);}removeFetchResponse(e){let t=this.onResponse.indexOf(e);t>-1&&this.onResponse.splice(t,1);}onFetchError(e){this.onError.push(e);}removeFetchError(e){let t=this.onError.indexOf(e);t>-1&&this.onError.splice(t,1);}};var ke=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(t,a,s,l,n){let d=typeof a=="string"?a:a.href;if(e.requestTracker.set(this,{method:t,url:d,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(m=>m.test(d)))return e.originalOpen.call(this,t,a,s??true,l,n);let c=e.requestTracker.get(this);for(let m of e.onRequest)m(c);return e.originalOpen.call(this,t,a,s??true,l,n)},this.originalXHR.prototype.send=function(t){let a=e.requestTracker.get(this);if(a){a.body=t;let s=this.onload,l=this.onerror;this.onload=function(n){let d=Date.now()-a.startTime;for(let c of e.onResponse)c(a,this.status,d);s&&s.call(this,n);},this.onerror=function(n){for(let d of e.onError)d(a,new Error("XHR Error"));l&&l.call(this,n);};}return e.originalSend.call(this,t)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}removeXHRRequest(e){let t=this.onRequest.indexOf(e);t>-1&&this.onRequest.splice(t,1);}onXHRResponse(e){this.onResponse.push(e);}removeXHRResponse(e){let t=this.onResponse.indexOf(e);t>-1&&this.onResponse.splice(t,1);}onXHRError(e){this.onError.push(e);}removeXHRError(e){let t=this.onError.indexOf(e);t>-1&&this.onError.splice(t,1);}};var He={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5,persistAcrossReloads:false};function qe(){return Math.random().toString(36).substring(7)}function Be(o,e){return we(o,{keys:e})}function yo(o,e,t,a){return {addLog:n=>{o.logsRef.current.push(n),o.logsRef.current.length>e.maxLogs&&o.logsRef.current.shift(),a(o.logsRef.current.length),n.type==="CONSOLE"?n.level==="ERROR"&&o.errorCountRef.current++:(n.type==="FETCH_ERR"||n.type==="XHR_ERR")&&o.errorCountRef.current++;let d=e.uploadOnErrorCount??5;if(o.errorCountRef.current>=d&&e.uploadEndpoint){let c={metadata:{...o.metadataRef.current,logCount:o.logsRef.current.length},logs:o.logsRef.current,fileName:B("json",{},{fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.environment,userId:e.userId,sessionId:null})};fetch(e.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:t(c)}).catch(()=>{}),o.errorCountRef.current=0;}if(e.enablePersistence&&typeof window<"u")try{localStorage.setItem(e.persistenceKey,t(o.logsRef.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},updateMetadata:()=>{let n=o.logsRef.current.filter(c=>c.type==="CONSOLE").reduce((c,m)=>m.level==="ERROR"?c+1:c,0),d=o.logsRef.current.filter(c=>c.type==="FETCH_ERR"||c.type==="XHR_ERR").length;o.metadataRef.current={...o.metadataRef.current,logCount:o.logsRef.current.length,errorCount:n,networkErrorCount:d};}}}function ho(){return o=>{let e=new Set;return JSON.stringify(o,(t,a)=>{if(typeof a=="object"&&a!==null){if(e.has(a))return "[Circular]";e.add(a);}return a})}}function xo(o){return !o||o.length===0?"":o.map(e=>dt(e)).join("")}function dt(o){return JSON.stringify(o)+`
`}var re=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,t,a="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(t,{create:!0})).createWritable();await n.write(e),await n.close();}catch(s){if(s.name==="AbortError")return;throw s}}static download(e,t,a="application/json"){let s=new Blob([e],{type:a}),l=URL.createObjectURL(s),n=document.createElement("a");n.href=l,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(l);}static async downloadWithFallback(e,t,a="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,t,a);return}catch(s){if(s.name==="AbortError")return}this.download(e,t,a);}};re.supported=null;function wo(o,e,t,a){return (s,l)=>{if(typeof window>"u")return null;a();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d=l||B(s,{},n),c,m;if(s==="json"){let y=e.current?{metadata:e.current,logs:o.current}:o.current;c=t(y),m="application/json";}else if(s==="jsonl"){let y=o.current.map(b=>U(b,e.current));c=xo(y),m="application/x-ndjson",d=l||B("jsonl",{},n);}else if(s==="ecs.json"){let y={metadata:te(e.current),logs:o.current.map(b=>U(b,e.current))};c=JSON.stringify(y,null,2),m="application/json",d=l||B("ecs-json",{},n);}else if(s==="ai.txt"){let y=e.current,b=`# METADATA
service.name=${y.environment||"unknown"}
user.id=${y.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,v=o.current.map(R=>{let f=U(R,y),L=f["@timestamp"],T=f.log?.level||"info",Q=f.event?.category?.[0]||"unknown",S=`[${L}] ${T} ${Q}`;return f.message&&(S+=` | message="${f.message}"`),f.http?.request?.method&&(S+=` | req.method=${f.http.request.method}`),f.url?.full&&(S+=` | url=${f.url.full}`),f.http?.response?.status_code&&(S+=` | res.status=${f.http.response.status_code}`),f.error?.message&&(S+=` | error="${f.error.message}"`),S});c=b+v.join(`
`),m="text/plain",d=l||B("ai-txt",{},n);}else c=(e.current?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${t(e.current)}
${"=".repeat(80)}

`:"")+o.current.map(b=>`[${b.time}] ${b.type}
${t(b)}
${"=".repeat(80)}`).join(`
`),m="text/plain";return re.downloadWithFallback(c,d,m),d}}function vo(o,e,t,a){return async s=>{let l=s;if(!l)return {success:false,error:"No endpoint configured"};try{a();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d={metadata:e.current,logs:o.current,fileName:B("json",{},n)},c=await fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:t(d)});if(!c.ok)throw new Error(`Upload failed: ${c.status}`);return {success:!0,data:await c.json()}}catch(n){let d=n instanceof Error?n.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",n),{success:false,error:d}}}}function ue(o={}){let e={...He,...o},t=react.useRef(e);t.current=e;let a=react.useRef(false),s=react.useRef([]),l=react.useRef(e.sessionId||bo()),n=react.useRef(fo(l.current,e.environment,e.userId,0)),[d,c]=react.useState(0),m=react.useRef(0),y=react.useMemo(()=>ho(),[]),b=react.useMemo(()=>ve.getInstance(),[]),v=react.useMemo(()=>new Se({excludeUrls:e.excludeUrls}),[e.excludeUrls]),R=react.useMemo(()=>new ke({excludeUrls:e.excludeUrls}),[e.excludeUrls]),f=react.useMemo(()=>yo({logsRef:s,metadataRef:n,errorCountRef:m},{maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount??5,sanitizeKeys:e.sanitizeKeys,environment:e.environment,userId:e.userId},y,c),[e,y]),L=f.addLog,T=f.updateMetadata,Q=react.useMemo(()=>wo(s,n,y,T),[y,T]),S=react.useMemo(()=>vo(s,n,y,T),[y,T]);react.useEffect(()=>{if(typeof window>"u"||a.current)return;a.current=true;let M=t.current;if(M.enablePersistence)try{let h=localStorage.getItem(M.persistenceKey);h&&(s.current=JSON.parse(h),c(s.current.length));}catch{}let Z=[];if(M.captureConsole){b.attach();let h=(P,_)=>{let N=_.map(u=>{if(typeof u=="object")try{return y(u)}catch{return String(u)}return String(u)}).join(" ");L({type:"CONSOLE",level:P.toUpperCase(),time:new Date().toISOString(),data:N.substring(0,5e3)});};b.onLog(h),Z.push(()=>{b.removeLog(h),b.detach();});}if(M.captureFetch){let h=new Map,P=(u,w)=>{let E=qe(),x=null;if(w?.body)try{x=typeof w.body=="string"?JSON.parse(w.body):w.body,x=we(x,{keys:M.sanitizeKeys});}catch{x=String(w.body).substring(0,1e3);}let A=window.setTimeout(()=>{h.delete(E);},3e4);h.set(E,{url:u,method:w?.method||"GET",headers:Be(w?.headers,M.sanitizeKeys),body:x,timeoutId:A}),L({type:"FETCH_REQ",id:E,url:u,method:w?.method||"GET",headers:Be(w?.headers,M.sanitizeKeys),body:x,time:new Date().toISOString()});},_=(u,w,E)=>{for(let[x,A]of h.entries())if(A.url===u){clearTimeout(A.timeoutId),h.delete(x),L({type:"FETCH_RES",id:x,url:u,status:w,statusText:"",duration:`${E}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}},N=(u,w)=>{for(let[E,x]of h.entries())if(x.url===u){clearTimeout(x.timeoutId),h.delete(E),L({type:"FETCH_ERR",id:E,url:u,error:w.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}};v.onFetchRequest(P),v.onFetchResponse(_),v.onFetchError(N),v.attach(),Z.push(()=>{v.removeFetchRequest(P),v.removeFetchResponse(_),v.removeFetchError(N),v.detach();});}if(M.captureXHR){let h=new Map,P=u=>{let w=qe();h.set(w,{url:u.url,method:u.method,headers:u.headers,body:u.body}),L({type:"XHR_REQ",id:w,url:u.url,method:u.method,headers:u.headers,body:u.body,time:new Date().toISOString()});},_=(u,w,E)=>{for(let[x,A]of h.entries())if(A.url===u.url&&A.method===u.method){h.delete(x),L({type:"XHR_RES",id:x,url:u.url,status:w,statusText:"",duration:`${E}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}},N=(u,w)=>{for(let[E,x]of h.entries())if(x.url===u.url&&x.method===u.method){h.delete(E),L({type:"XHR_ERR",id:E,url:u.url,error:w.message,duration:"[unknown]ms",time:new Date().toISOString()});break}};R.onXHRRequest(P),R.onXHRResponse(_),R.onXHRError(N),R.attach(),Z.push(()=>{R.removeXHRRequest(P),R.removeXHRResponse(_),R.removeXHRError(N),R.detach();});}if(M.enablePersistence&&M.persistAcrossReloads===false){let h=()=>{try{localStorage.removeItem(M.persistenceKey);}catch{}};window.addEventListener("beforeunload",h),Z.push(()=>window.removeEventListener("beforeunload",h));}return ()=>{Z.forEach(h=>h());}},[]);let Fe=react.useCallback(()=>{if(s.current=[],c(0),m.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{}},[e.enablePersistence,e.persistenceKey]),se=react.useCallback(()=>[...s.current],[]),Pe=react.useCallback(()=>s.current.length,[]),q=react.useCallback(()=>(T(),{...n.current}),[T]);return {downloadLogs:Q,uploadLogs:S,clearLogs:Fe,getLogs:se,getLogCount:Pe,getMetadata:q,sessionId:l.current,_logCount:d}}function $o(){let[o,e]=react.useState(false),[t,a]=react.useState(false),s=react.useRef(o);s.current=o;let l=react.useRef(null);react.useEffect(()=>{a(re.isSupported());},[]);let n=react.useCallback(()=>{e(m=>!m);},[]),d=react.useCallback(()=>{e(true);},[]),c=react.useCallback(()=>{e(false);},[]);return react.useEffect(()=>{let m=b=>{b.ctrlKey&&b.shiftKey&&b.key==="D"&&(b.preventDefault(),n()),b.key==="Escape"&&s.current&&(b.preventDefault(),c());};document.addEventListener("keydown",m);let y=b=>{typeof b.detail?.visible=="boolean"&&(l.current&&clearTimeout(l.current),l.current=setTimeout(()=>{e(b.detail.visible);},10));};return window.addEventListener("glean-debug-toggle",y),()=>{document.removeEventListener("keydown",m),window.removeEventListener("glean-debug-toggle",y);}},[n,c]),{isOpen:o,toggle:n,open:d,close:c,supportsDirectoryPicker:t}}var Ro="debug-panel-copy-format",bt=["json","ecs.json","ai.txt"];function $e(){let[o,e]=react.useState(()=>{if(typeof window<"u"){let t=localStorage.getItem(Ro);if(t&&bt.includes(t))return t}return "ecs.json"});return react.useEffect(()=>{localStorage.setItem(Ro,o);},[o]),{copyFormat:o,setCopyFormat:e}}function Eo(){let[o,e]=react.useState(null),[t,a]=react.useState(null),[s,l]=react.useState(null),[n,d]=react.useState(false);return react.useEffect(()=>{if(o){let c=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(c)}},[o]),react.useEffect(()=>{if(t){let c=setTimeout(()=>{a(null);},3e3);return ()=>clearTimeout(c)}},[t]),react.useEffect(()=>{if(s){let c=setTimeout(()=>{l(null);},3e3);return ()=>clearTimeout(c)}},[s]),{uploadStatus:o,setUploadStatus:e,directoryStatus:t,setDirectoryStatus:a,copyStatus:s,setCopyStatus:l,showSettings:n,setShowSettings:d}}function Lo(){let[o,e]=react.useState(false),t=react.useCallback(()=>{e(true);},[]),a=react.useCallback(()=>{e(false);},[]),s=react.useCallback(()=>{e(l=>!l);},[]);return {isSettingsOpen:o,openSettings:t,closeSettings:a,toggleSettings:s}}var r={glassBg:"rgba(255, 255, 255, 0.75)",glassBorder:"rgba(255, 255, 255, 0.4)",glassShadow:"0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",colors:{primary:"#1a1a2e",secondary:"#4a5568",muted:"#a0aec0",border:"rgba(0, 0, 0, 0.06)",success:"#059669",successBg:"rgba(5, 150, 105, 0.08)",successBorder:"rgba(5, 150, 105, 0.2)",error:"#dc2626",errorBg:"rgba(220, 38, 38, 0.06)",errorBorder:"rgba(220, 38, 38, 0.15)",warning:"#d97706",accent:"#0ea5e9",accentBg:"rgba(14, 165, 233, 0.08)",accentBorder:"rgba(14, 165, 233, 0.2)"},fonts:{display:'-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',mono:'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'},space:{xs:"4px",sm:"8px",md:"12px",lg:"16px"},radius:{sm:"6px",md:"10px",lg:"16px",full:"9999px"},transitions:{fast:"0.15s ease",normal:"0.25s cubic-bezier(0.4, 0, 0.2, 1)",slow:"0.4s cubic-bezier(0.4, 0, 0.2, 1)"}},Ge=goober.css`
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
`;var Ke=goober.css`
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
`,Je=goober.css`
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
`,Ve=goober.css`
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
    background: rgba(0, 0, 0, 0.05);
    color: ${r.colors.secondary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
`,We=goober.css`
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
`,Le=goober.css`
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
`,Qe=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: ${r.colors.border};
`,ge=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${r.space.lg};
  background: rgba(255, 255, 255, 0.6);
  gap: ${r.space.xs};
`,fe=goober.css`
  font-size: 28px;
  font-weight: 700;
  color: ${r.colors.primary};
  line-height: 1;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`,be=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`,Mo=goober.css`
  color: ${r.colors.error};
`,Fo=goober.css`
  color: ${r.colors.warning};
`,j={warmCream:"rgba(255, 252, 245, 0.85)",warmGray:"#4a4543",warmMuted:"#8a857f",copperAccent:"#c17f59",copperSubtle:"rgba(193, 127, 89, 0.12)"},Do=goober.css`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Source+Sans+3:wght@400;500;600&display=swap');

  font-family: 'Source Sans 3', ${r.fonts.display};
  padding: ${r.space.md} ${r.space.lg};
  background: ${j.warmCream};
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
  color: ${j.warmGray};
  text-transform: none;
  letter-spacing: 0.02em;
  transition: color ${r.transitions.normal};

  &:hover {
    color: ${j.copperAccent};
  }

  &:focus-visible {
    outline: 2px solid ${j.copperAccent};
    outline-offset: 2px;
    border-radius: 4px;
  }
`,vt=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${j.copperSubtle};
  border-radius: ${r.radius.sm};
  color: ${j.copperAccent};
  transition: all ${r.transitions.normal};

  ${Ee}:hover & {
    background: ${j.copperAccent};
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
  color: ${j.warmMuted};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-size: 13px;
  min-width: 100px;
`,Ct=goober.css`
  font-weight: 500;
  color: ${j.warmGray};
  text-align: right;
  flex: 1;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
`,$t=goober.css`
  font-weight: 500;
  color: ${j.warmGray};
  text-align: right;
  flex: 1;
  font-family: ${r.fonts.mono};
  font-size: 13px;
  background: rgba(0, 0, 0, 0.03);
  padding: 3px 8px;
  border-radius: 4px;
`,Ze=goober.css`
  padding: ${r.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${r.space.lg};
  background: rgba(255, 255, 255, 0.3);
`,De=goober.css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.sm};
`,me=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;goober.css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${r.space.sm};
`;var Ie=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${r.space.sm};
`,ye=goober.css`
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
  ${ye}
`;var Rt=goober.css`
  ${ye}
  background: ${r.colors.accentBg};
  border-color: ${r.colors.accentBorder};
  color: ${r.colors.accent};

  &:hover:not(:disabled) {
    background: ${r.colors.accent};
    color: #ffffff;
    border-color: ${r.colors.accent};
  }
`,eo=goober.css`
  ${ye}
  background: ${r.colors.successBg};
  border-color: ${r.colors.successBorder};
  color: ${r.colors.success};

  &:hover:not(:disabled) {
    background: ${r.colors.success};
    color: #ffffff;
    border-color: ${r.colors.success};
  }
`,Et=goober.css`
  ${ye}
  background: ${r.colors.errorBg};
  border-color: ${r.colors.errorBorder};
  color: ${r.colors.error};

  &:hover:not(:disabled) {
    background: ${r.colors.error};
    color: #ffffff;
    border-color: ${r.colors.error};
  }
`,X=goober.css`
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
`,Lt=goober.css`
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
`,oo=goober.css`
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
`,to=goober.css`
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
`,ro=goober.css`
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
`,no=goober.css`
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
`;var he=goober.css`
  padding: 8px 10px 6px 0px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-family: ${r.fonts.display};
`,Y=goober.css`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  line-height: 1.5;
`,G=goober.css`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;
  min-width: 70px;
  font-family: ${r.fonts.display};
`,K=goober.css`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  font-size: 12px;
  font-family: ${r.fonts.display};
`,so=goober.css`
  ${K}
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
`,ao=goober.css`
  margin-left: auto;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 600;
`,io=goober.css`
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 8px 0;
  border-radius: 1px;
`,Dt=goober.css`
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
`,Io=goober.css`
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
`,Xe=goober.css`
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
  ${Xe}
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

    ${Ke} {
      background: rgba(30, 30, 46, 0.9);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    ${Je} {
      background: linear-gradient(135deg, rgba(40, 40, 60, 0.8) 0%, rgba(30, 30, 46, 0.6) 100%);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Ve} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${yt} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Ye} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
    }

    ${We} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(220, 38, 38, 0.2);
        color: #f87171;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
      }
    }

    ${Le} {
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

    ${Qe} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${ge} {
      background: rgba(40, 40, 60, 0.5);
    }

    ${fe} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${be} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Do} {
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

    ${Ze} {
      background: rgba(40, 40, 60, 0.3);
    }

    ${me} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${ye} {
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

    ${eo} {
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
    ${Lt} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;

      &:hover:not(:disabled) {
        background: #dc2626;
        color: #ffffff;
        border-color: #dc2626;
      }
    }

    ${oo} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;
    }

    ${to} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;
    }

    ${ro} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);

      kbd {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.5);
      }
    }

    ${no} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Ge} {
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

    ${Dt},
    ${Te} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.3),
        0 12px 48px rgba(0, 0, 0, 0.4);
    }

    ${G} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${K} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${so} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }

    ${he},
    ${Io} {
      color: rgba(255, 255, 255, 0.35);
      background: rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Ne},
    ${Xe} {
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

    ${io} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${ao} {
      color: rgba(255, 255, 255, 0.5);
    }

    ${Io} {
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Xe} {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    ${To} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }

    ${Do} {
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

    ${Ct} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${$t} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;function At({metadata:o}){return jsxRuntime.jsxs("div",{className:Te,children:[jsxRuntime.jsx("div",{className:he,children:"Session Details"}),jsxRuntime.jsxs("div",{className:Y,children:[jsxRuntime.jsx("span",{className:G,children:"User"}),jsxRuntime.jsx("span",{className:K,children:o.userId||"Anonymous"})]}),jsxRuntime.jsxs("div",{className:Y,children:[jsxRuntime.jsx("span",{className:G,children:"Session ID"}),jsxRuntime.jsx("span",{className:so,children:o.sessionId||"N/A"})]}),jsxRuntime.jsxs("div",{className:Y,children:[jsxRuntime.jsx("span",{className:G,children:"Browser"}),jsxRuntime.jsxs("span",{className:K,children:[o.browser," \xB7 ",o.platform]})]}),jsxRuntime.jsxs("div",{className:Y,children:[jsxRuntime.jsx("span",{className:G,children:"Screen"}),jsxRuntime.jsx("span",{className:K,children:o.screenResolution})]}),jsxRuntime.jsxs("div",{className:Y,children:[jsxRuntime.jsx("span",{className:G,children:"Timezone"}),jsxRuntime.jsx("span",{className:K,children:o.timezone})]}),jsxRuntime.jsxs("div",{className:Y,children:[jsxRuntime.jsx("span",{className:G,children:"Language"}),jsxRuntime.jsx("span",{className:K,children:o.language})]}),jsxRuntime.jsxs("div",{className:Y,children:[jsxRuntime.jsx("span",{className:G,children:"Viewport"}),jsxRuntime.jsx("span",{className:K,children:o.viewport})]})]})}function zt({copyFormat:o,setCopyFormat:e,onSaveToDirectory:t,onCloseDropdown:a}){let s=["json","ecs.json","ai.txt"],l={json:jsxRuntime.jsx(lucideReact.FileJson,{size:14}),"ecs.json":jsxRuntime.jsx(lucideReact.FileText,{size:14}),"ai.txt":jsxRuntime.jsx(lucideReact.FileText,{size:14})};return jsxRuntime.jsxs("div",{className:Te,children:[jsxRuntime.jsx("div",{className:he,children:"Export format"}),jsxRuntime.jsx("div",{style:{display:"flex",flexDirection:"column",gap:2},children:s.map(n=>jsxRuntime.jsxs("button",{type:"button",className:Ne,style:o===n?{background:"rgba(0, 0, 0, 0.06)",color:"rgba(0, 0, 0, 0.9)"}:void 0,onClick:()=>{e(n),a();},children:[l[n],jsxRuntime.jsxs("span",{style:{flex:1},children:[n==="json"&&"JSON",n==="ecs.json"&&"ECS (AI)",n==="ai.txt"&&"AI-TXT"]}),o===n&&jsxRuntime.jsx("span",{className:ao,children:"\u2713"})]},n))}),jsxRuntime.jsx("div",{className:io}),jsxRuntime.jsx("div",{className:he,children:"Actions"}),jsxRuntime.jsxs("button",{type:"button",className:Ne,onClick:()=>{t(),a();},children:[jsxRuntime.jsx(lucideReact.Save,{size:14}),jsxRuntime.jsx("span",{children:"Save to folder"})]})]})}var qo=react.forwardRef(function({metadata:e,onClose:t,onSaveToDirectory:a,onClear:s,isSettingsOpen:l,openSettings:n,closeSettings:d,isSessionDetailsOpen:c,openSessionDetails:m,closeSessionDetails:y},b){let{copyFormat:v,setCopyFormat:R}=$e();return jsxRuntime.jsx(jsxRuntime.Fragment,{children:jsxRuntime.jsxs("div",{className:Je,children:[jsxRuntime.jsx("div",{className:Oo,children:jsxRuntime.jsx("h3",{className:Ve,children:"Debug"})}),jsxRuntime.jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsxRuntime.jsx("button",{type:"button",onClick:s,className:We,"aria-label":"Clear all logs",title:"Clear logs",children:jsxRuntime.jsx(lucideReact.Trash2,{size:16})}),jsxRuntime.jsxs(z__namespace.Root,{open:c,onOpenChange:f=>{f?m():y();},children:[jsxRuntime.jsx(z__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",className:Le,"aria-label":"Session details",title:"Session details",children:jsxRuntime.jsx(lucideReact.Info,{size:16})})}),jsxRuntime.jsx(z__namespace.Portal,{children:jsxRuntime.jsx(z__namespace.Content,{sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:f=>{f.target.closest("#debug-panel")&&f.preventDefault();},children:jsxRuntime.jsx(At,{metadata:e})})})]}),jsxRuntime.jsxs(z__namespace.Root,{open:l,onOpenChange:f=>{f?n():d();},children:[jsxRuntime.jsx(z__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",className:Le,"aria-label":"Actions and settings",title:"Actions and settings","data-settings-trigger":"true",children:jsxRuntime.jsx(lucideReact.Settings,{size:16})})}),jsxRuntime.jsx(z__namespace.Portal,{children:jsxRuntime.jsx(z__namespace.Content,{"data-settings-dropdown":"true",sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:f=>{f.target.closest("#debug-panel")&&f.preventDefault();},children:jsxRuntime.jsx(zt,{copyFormat:v,setCopyFormat:R,onSaveToDirectory:a,onCloseDropdown:()=>d()})})})]}),jsxRuntime.jsx("button",{ref:b,type:"button",onClick:t,className:Ye,"aria-label":"Close debug panel",children:jsxRuntime.jsx(lucideReact.X,{size:18})})]})]})})});function Bo({logCount:o,errorCount:e,networkErrorCount:t}){return jsxRuntime.jsxs("div",{className:Qe,children:[jsxRuntime.jsxs("div",{className:ge,children:[jsxRuntime.jsx("div",{className:fe,children:o.toLocaleString()}),jsxRuntime.jsx("div",{className:be,children:"Logs"})]}),jsxRuntime.jsxs("div",{className:ge,children:[jsxRuntime.jsx("div",{className:`${fe} ${Mo}`,children:e.toLocaleString()}),jsxRuntime.jsx("div",{className:be,children:"Errors"})]}),jsxRuntime.jsxs("div",{className:ge,children:[jsxRuntime.jsx("div",{className:`${fe} ${Fo}`,children:t.toLocaleString()}),jsxRuntime.jsx("div",{className:be,children:"Network"})]})]})}function J({children:o,content:e,disabled:t,...a}){return jsxRuntime.jsx(H__namespace.Provider,{delayDuration:200,skipDelayDuration:100,children:jsxRuntime.jsxs(H__namespace.Root,{children:[jsxRuntime.jsx(H__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",disabled:t,...a,children:o})}),!t&&jsxRuntime.jsx(H__namespace.Portal,{children:jsxRuntime.jsxs(H__namespace.Content,{side:"top",sideOffset:6,align:"center",style:{background:"var(--color-primary, #1a1a2e)",color:"white",padding:"6px 12px",borderRadius:"6px",fontSize:"11px",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",zIndex:1e5},children:[e,jsxRuntime.jsx(H__namespace.Arrow,{style:{fill:"var(--color-primary, #1a1a2e)"}})]})})]})})}function _o({logCount:o,hasUploadEndpoint:e,isUploading:t,getFilteredLogCount:a,onCopyFiltered:s,onDownload:l,onCopy:n,onUpload:d}){let c=o===0;return jsxRuntime.jsxs("div",{className:Ze,children:[jsxRuntime.jsxs("div",{className:De,children:[jsxRuntime.jsx("div",{className:me,children:"Copy Filtered"}),jsxRuntime.jsxs("div",{className:Ie,children:[jsxRuntime.jsxs(J,{content:"Copy only console logs",disabled:c||a("logs")===0,onClick:()=>s("logs"),className:X,"aria-label":"Copy only console logs",children:[jsxRuntime.jsx(lucideReact.Terminal,{size:18}),"Logs"]}),jsxRuntime.jsxs(J,{content:"Copy only errors",disabled:c||a("errors")===0,onClick:()=>s("errors"),className:X,"aria-label":"Copy only errors",children:[jsxRuntime.jsx(lucideReact.AlertCircle,{size:18}),"Errors"]}),jsxRuntime.jsxs(J,{content:"Copy only network requests",disabled:c||a("network")===0,onClick:()=>s("network"),className:X,"aria-label":"Copy only network requests",children:[jsxRuntime.jsx(lucideReact.Globe,{size:18}),"Network"]})]})]}),jsxRuntime.jsxs("div",{className:De,children:[jsxRuntime.jsx("div",{className:me,children:"Export"}),jsxRuntime.jsxs("div",{className:Ie,children:[jsxRuntime.jsxs(J,{content:"Download as JSON",disabled:c,onClick:()=>l("json"),className:X,"aria-label":"Download as JSON",children:[jsxRuntime.jsx(lucideReact.FileJson,{size:18}),"JSON"]}),jsxRuntime.jsxs(J,{content:"Download as TXT",disabled:c,onClick:()=>l("txt"),className:X,"aria-label":"Download as TXT",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"TXT"]}),jsxRuntime.jsxs(J,{content:"Download as JSONL",disabled:c,onClick:()=>l("jsonl"),className:X,"aria-label":"Download as JSONL",children:[jsxRuntime.jsx(lucideReact.Database,{size:18}),"JSONL"]})]})]}),jsxRuntime.jsxs("div",{className:De,children:[jsxRuntime.jsx("div",{className:me,children:"Actions"}),jsxRuntime.jsxs("div",{className:Ie,children:[jsxRuntime.jsxs(J,{content:"Copy all to clipboard",disabled:c,onClick:n,className:X,"aria-label":"Copy all to clipboard",children:[jsxRuntime.jsx(lucideReact.Copy,{size:18}),"Copy"]}),jsxRuntime.jsxs(J,{content:"Download AI-optimized format",disabled:c,onClick:()=>l("ai.txt"),className:X,"aria-label":"Download AI-optimized format",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"AI-TXT"]}),e?jsxRuntime.jsxs(J,{content:"Upload logs to server",disabled:t,onClick:d,className:eo,"aria-label":"Upload logs to server",children:[jsxRuntime.jsx(lucideReact.CloudUpload,{size:18}),t?"Uploading...":"Upload"]}):jsxRuntime.jsx("div",{})]})]})]})}function lo({status:o}){return jsxRuntime.jsxs("div",{"aria-live":"polite",className:o.type==="success"?oo:to,children:[o.type==="success"?jsxRuntime.jsx(lucideReact.CheckCircle2,{size:14}):jsxRuntime.jsx(lucideReact.AlertCircle,{size:14}),jsxRuntime.jsx("span",{className:Ao,children:o.message})]})}function Uo({uploadStatus:o,directoryStatus:e,copyStatus:t}){return jsxRuntime.jsxs("div",{className:Po,children:[o&&jsxRuntime.jsx(lo,{status:o}),e&&jsxRuntime.jsx(lo,{status:e}),t&&jsxRuntime.jsx(lo,{status:t})]})}function Ko(){return jsxRuntime.jsx("div",{className:ro,children:jsxRuntime.jsxs("div",{className:no,children:["Press ",jsxRuntime.jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function Vo(o,e){switch(e){case "logs":return o.filter(t=>t.type==="CONSOLE");case "errors":return o.filter(t=>t.type==="CONSOLE"&&t.level==="error");case "network":return o.filter(t=>t.type==="FETCH_REQ"||t.type==="FETCH_RES"||t.type==="XHR_REQ"||t.type==="XHR_RES");case "networkErrors":return o.filter(t=>t.type==="FETCH_ERR"||t.type==="XHR_ERR");default:return o}}function po({user:o,environment:e="production",uploadEndpoint:t,fileNameTemplate:a="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:s=2e3,showInProduction:l=false}){let{isOpen:n,open:d,close:c}=$o(),{isSettingsOpen:m,openSettings:y,closeSettings:b}=Lo(),{copyFormat:v}=$e(),[R,f]=react.useState(false),L=react.useCallback(()=>{f(true);},[]),T=react.useCallback(()=>{f(false);},[]),{uploadStatus:Q,setUploadStatus:S,directoryStatus:Fe,setDirectoryStatus:se,copyStatus:Pe,setCopyStatus:q}=Eo(),M=react.useRef(null),Z=react.useRef(null),{downloadLogs:h,uploadLogs:P,clearLogs:_,getLogs:N,getMetadata:u,_logCount:w}=ue({fileNameTemplate:a,environment:e,userId:o?.id||o?.email||"guest",includeMetadata:true,uploadEndpoint:t,maxLogs:s,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),E=w,x=u();react.useEffect(()=>{if(x.errorCount>=5&&t){let g=async()=>{try{await P();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",g),()=>window.removeEventListener("error",g)}},[x.errorCount,t,P]);let A=react.useCallback((g,O)=>{if(v==="json")return JSON.stringify({metadata:O,logs:g},null,2);if(v==="ecs.json"){let ee=g.map(ie=>U(ie,O)),ae={metadata:te(O),logs:ee};return JSON.stringify(ae,null,2)}else if(v==="ai.txt"){let ee=`# METADATA
service.name=${O.environment||"unknown"}
user.id=${O.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,ae=g.map(ie=>{let D=U(ie,O),uo=D["@timestamp"],go=D["log.level"],at=D["event.category"]?.[0]||"unknown",le=`[${uo}] ${go} ${at}`;return D.message&&(le+=` | message="${D.message}"`),D.http?.request?.method&&(le+=` | req.method=${D.http.request.method}`),D.url?.full&&(le+=` | url=${D.url.full}`),D.http?.response?.status_code&&(le+=` | res.status=${D.http.response.status_code}`),D.error?.message&&(le+=` | error="${D.error.message}"`),le});return ee+ae.join(`
`)}return JSON.stringify({metadata:O,logs:g},null,2)},[v]),et=react.useCallback(async()=>{S(null);try{let g=await P();g.success?(S({type:"success",message:`Uploaded successfully! ${g.data?JSON.stringify(g.data):""}`}),g.data&&typeof g.data=="object"&&"url"in g.data&&await navigator.clipboard.writeText(String(g.data.url))):S({type:"error",message:`Upload failed: ${g.error}`});}catch(g){S({type:"error",message:`Error: ${g instanceof Error?g.message:"Unknown error"}`});}},[P,S]),ot=react.useCallback(g=>{let O=h(g);O&&S({type:"success",message:`Downloaded: ${O}`});},[h,S]),tt=react.useCallback(async()=>{se(null);try{await h("json",void 0,{showPicker:!0})&&se({type:"success",message:"Saved to directory"});}catch{se({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[h,se]),rt=react.useCallback(async()=>{q(null);try{let g=N(),O=u(),ee=A(g,O);await navigator.clipboard.writeText(ee),q({type:"success",message:"Copied to clipboard!"});}catch{q({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[N,u,A,q]),nt=react.useCallback(async g=>{q(null);try{let O=N(),ee=u(),ae=Vo(O,g),ie=ae.length;if(ie===0){q({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[g]});return}let D=A(ae,ee);await navigator.clipboard.writeText(D),q({type:"success",message:`Copied ${ie} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[g]} to clipboard`});}catch{q({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[N,u,A,q]),st=react.useCallback(g=>Vo(N(),g).length,[N]);return l||e==="development"||o?.role==="admin"?jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs(framerMotion.motion.button,{type:"button",onClick:g=>{g.stopPropagation(),n?c():d();},className:Ge,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",whileHover:{scale:1.02},whileTap:{scale:.98},layout:true,children:[jsxRuntime.jsx(lucideReact.Bug,{size:18}),x.errorCount>0&&jsxRuntime.jsx(framerMotion.motion.span,{className:No,initial:{scale:0},animate:{scale:1}},`err-${x.errorCount}`)]}),jsxRuntime.jsx(framerMotion.AnimatePresence,{mode:"wait",children:n&&jsxRuntime.jsx(framerMotion.motion.div,{ref:M,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:Ke,initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:20,scale:.95},transition:{duration:.25,ease:[.4,0,.2,1]},children:jsxRuntime.jsxs(W__namespace.Root,{className:"glean-scroll-area",style:{flex:1,overflow:"hidden"},children:[jsxRuntime.jsxs(W__namespace.Viewport,{className:"glean-scroll-viewport",style:{width:"100%",height:"100%"},children:[jsxRuntime.jsx(qo,{metadata:x,onClose:c,onSaveToDirectory:tt,onClear:()=>{confirm("Clear all logs?")&&_();},ref:Z,isSettingsOpen:m,openSettings:y,closeSettings:b,isSessionDetailsOpen:R,openSessionDetails:L,closeSessionDetails:T}),jsxRuntime.jsx(Bo,{logCount:E,errorCount:x.errorCount,networkErrorCount:x.networkErrorCount}),jsxRuntime.jsx("div",{style:{padding:"8px 16px",borderBottom:"1px solid var(--color-border, #e2e8f0)"},children:jsxRuntime.jsx("button",{type:"button",onClick:()=>{console.log("[TEST] Console log test message"),console.error("[TEST] Console error test message"),console.warn("[TEST] Console warn test message"),console.info("[TEST] Console info test message");},style:{background:"var(--color-primary, #6366f1)",color:"white",border:"none",padding:"6px 12px",borderRadius:"4px",cursor:"pointer",fontSize:"11px",fontWeight:500},children:"\u{1F9EA} Test Logs (4x)"})}),jsxRuntime.jsx(_o,{logCount:E,hasUploadEndpoint:!!t,isUploading:false,getFilteredLogCount:st,onCopyFiltered:nt,onDownload:ot,onCopy:rt,onUpload:et}),jsxRuntime.jsx(Uo,{uploadStatus:Q,directoryStatus:Fe,copyStatus:Pe}),jsxRuntime.jsx(Ko,{})]}),jsxRuntime.jsx(W__namespace.Scrollbar,{className:"glean-scrollbar",orientation:"vertical",style:{display:"flex",width:"6px",userSelect:"none",touchAction:"none",padding:"2px",background:"transparent"},children:jsxRuntime.jsx(W__namespace.Thumb,{className:"glean-scrollbar-thumb",style:{flex:1,background:"rgba(0, 0, 0, 0.15)",borderRadius:"3px",transition:"background 0.15s ease"}})})]})})})]}):null}function tr({fileNameTemplate:o="debug_{timestamp}"}){let[e,t]=react.useState(false),[a,s]=react.useState(0),{downloadLogs:l,clearLogs:n,getLogCount:d}=ue({fileNameTemplate:o});return react.useEffect(()=>{s(d());let c=setInterval(()=>{s(d());},100);return ()=>clearInterval(c)},[d]),jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("button",{onClick:()=>t(c=>!c),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsxRuntime.jsx("span",{children:a})}),e&&jsxRuntime.jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsxRuntime.jsx("button",{onClick:()=>l("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsxRuntime.jsx("button",{onClick:()=>{confirm("Clear all logs?")&&n();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsxRuntime.jsx("button",{onClick:()=>t(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function ar(o){return react.useMemo(()=>o.showInProduction||o.environment==="development"||o.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[o.showInProduction,o.environment,o.user])}function ir(){let o=react.useCallback(t=>{try{typeof window<"u"&&(t?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:t}})));}catch{}},[]),e=react.useMemo(()=>typeof process<"u"&&true,[]);react.useEffect(()=>{if(typeof window>"u")return;let t=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>o(true),hide:()=>o(false),toggle:()=>{try{let a=localStorage.getItem("glean-debug-enabled")==="true";o(!a);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=t,()=>{typeof window<"u"&&window.glean===t&&delete window.glean;}},[o,e]);}function Zo(o){console.log("[GleanDebugger] Mounting with props:",o);let e=ar(o);return console.log("[GleanDebugger] isActivated:",e),ir(),e?(console.log("[GleanDebugger] Rendering DebugPanel"),jsxRuntime.jsx(po,{...o})):(console.log("[GleanDebugger] Not activated, returning null"),null)}exports.DebugPanel=po;exports.DebugPanelMinimal=tr;exports.GleanDebugger=Zo;exports.collectMetadata=fo;exports.filterStackTrace=ze;exports.generateExportFilename=ur;exports.generateFilename=B;exports.generateSessionId=bo;exports.getBrowserInfo=Ae;exports.sanitizeData=we;exports.sanitizeFilename=oe;exports.transformMetadataToECS=te;exports.transformToECS=U;exports.useLogRecorder=ue;