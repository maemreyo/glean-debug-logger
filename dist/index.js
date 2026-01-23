'use strict';var react=require('react'),framerMotion=require('framer-motion'),Q=require('@radix-ui/react-scroll-area'),goober=require('goober'),H=require('@radix-ui/react-dropdown-menu'),lucideReact=require('lucide-react'),jsxRuntime=require('react/jsx-runtime'),q=require('@radix-ui/react-tooltip');function _interopNamespace(e){if(e&&e.__esModule)return e;var n=Object.create(null);if(e){Object.keys(e).forEach(function(k){if(k!=='default'){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})}n.default=e;return Object.freeze(n)}var Q__namespace=/*#__PURE__*/_interopNamespace(Q);var H__namespace=/*#__PURE__*/_interopNamespace(H);var q__namespace=/*#__PURE__*/_interopNamespace(q);// @ts-nocheck
var ct=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function Re(o,e={}){let t=e.keys||ct;if(!o||typeof o!="object")return o;let s=Array.isArray(o)?[...o]:{...o},l=a=>{if(!a||typeof a!="object")return a;for(let n in a)if(Object.prototype.hasOwnProperty.call(a,n)){let d=n.toLowerCase();t.some(f=>d.includes(f.toLowerCase()))?a[n]="***REDACTED***":a[n]!==null&&typeof a[n]=="object"&&(a[n]=l(a[n]));}return a};return l(s)}function te(o){return o.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function qe(){if(typeof navigator>"u")return "unknown";let o=navigator.userAgent;return o.includes("Edg")?"edge":o.includes("Chrome")?"chrome":o.includes("Firefox")?"firefox":o.includes("Safari")?"safari":"unknown"}function bo(o,e,t,s){if(typeof window>"u")return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:s,errorCount:0,networkErrorCount:0};let l=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",a=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:qe(),platform:navigator.platform,language:navigator.language,screenResolution:l,viewport:a,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:s,errorCount:0,networkErrorCount:0}}function mo(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function U(o="json",e={},t={}){let{fileNameTemplate:s="{env}_{userId}_{sessionId}_{timestamp}",environment:l="development",userId:a="anonymous",sessionId:n="unknown"}=t,d=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],c=new Date().toISOString().split("T")[0],f=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),y=t.browser||qe(),g=t.platform||(typeof navigator<"u"?navigator.platform:"unknown"),z=(t.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",b=String(t.errorCount??e.errorCount??0),L=String(t.logCount??e.logCount??0),j=s.replace("{env}",te(l)).replace("{userId}",te(a??"anonymous")).replace("{sessionId}",te(n??"unknown")).replace("{timestamp}",d).replace("{date}",c).replace("{time}",f).replace(/\{errorCount\}/g,b).replace(/\{logCount\}/g,L).replace("{browser}",te(y)).replace("{platform}",te(g)).replace("{url}",te(z));for(let[Z,k]of Object.entries(e))j=j.replace(`{${Z}}`,String(k));return `${j}.${o}`}function fr(o,e="json"){let t=o.url.split("?")[0]||"unknown";return U(e,{},{environment:o.environment,userId:o.userId,sessionId:o.sessionId,browser:o.browser,platform:o.platform,url:t,errorCount:o.errorCount,logCount:o.logCount})}var dt={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function yo(o){let e=parseFloat(o);return isNaN(e)?0:Math.round(e*1e6)}function ut(o){return dt[o.toLowerCase()]||"info"}function ze(o){return o.filter(e=>!e.ignored).slice(0,20)}function re(o){return {service:{environment:o.environment},user:o.userId?{id:o.userId}:void 0,host:{name:o.browser,type:o.platform}}}function G(o,e){let t={"@timestamp":o.time,event:{original:o,category:[]}},s=re(e);switch(Object.assign(t,s),o.type){case "CONSOLE":{t.log={level:ut(o.level)},t.message=o.data,t.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{t.http={request:{method:o.method}},t.url={full:o.url},t.event.category=["network","web"],t.event.action="request",t.event.id=o.id;break}case "FETCH_RES":case "XHR_RES":{t.http={response:{status_code:o.status}},t.url={full:o.url},t.event.duration=yo(o.duration),t.event.category=["network","web"],t.event.action="response",t.event.id=o.id;break}case "FETCH_ERR":case "XHR_ERR":{t.error={message:o.error},t.url={full:o.url},t.event.duration=yo(o.duration),t.event.category=["network","web"],t.event.action="error",t.event.id=o.id;let l=o;if(typeof l.body=="object"&&l.body!==null){let a=l.body;if(Array.isArray(a.frames)){let n=ze(a.frames);t.error.stack_trace=n.map(d=>`  at ${d.functionName||"?"} (${d.filename||"?"}:${d.lineNumber||0}:${d.columnNumber||0})`).join(`
`);}}break}default:{t.message=JSON.stringify(o);break}}return t}var S=class S{constructor(){this.isAttached=false;S.instanceCount++,this.instanceId=S.instanceCount,this.originalLog=console.log.bind(console),this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[],S.isGloballyAttached&&(this.isAttached=true),S.instance=this,this.originalLog(`[ConsoleInterceptor#${this.instanceId}] \u2705 Created singleton instance (total: ${S.instanceCount})`);}static getInstance(){return S.instance||(S.instance=new S),S.instance}static createNew(){return new S}static resetInstance(){S.instance&&(S.instance.forceDetach(),S.instance=null);}debugLog(...e){this.originalLog(...e);}attach(){if(this.debugLog(`[ConsoleInterceptor#${this.instanceId}] attach() - isAttached=${this.isAttached}, callbacks=${this.callbacks.length}`),this.isAttached){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] ALREADY ATTACHED - skipping duplicate attach`);return}this.isAttached=true,S.isGloballyAttached=true,["log","error","warn","info","debug"].forEach(t=>{let s=this.originalConsole[t];console[t]=(...l)=>{this.debugLog(`[ConsoleInterceptor#${this.instanceId}] \u{1F525} ${t}() triggered (${this.callbacks.length} callbacks)`);for(let a of this.callbacks)a(t,l);s(...l);};});}detach(){if(!this.isAttached){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] ALREADY DETACHED - skipping duplicate detach`);return}this.forceDetach();}forceDetach(){if(!this.isAttached)return;this.isAttached=false,S.isGloballyAttached=false,["log","error","warn","info","debug"].forEach(t=>{console[t]=this.originalConsole[t];}),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] Force detached`);}onLog(e){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] onLog() - callback count before: ${this.callbacks.length}`),this.callbacks.push(e),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] onLog() - callback count after: ${this.callbacks.length}`);}removeLog(e){let t=this.callbacks.indexOf(e);this.debugLog(`[ConsoleInterceptor#${this.instanceId}] removeLog() - callback found at index: ${t}, total: ${this.callbacks.length}`),t>-1&&this.callbacks.splice(t,1),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] removeLog() - callback count after: ${this.callbacks.length}`);}};S.instance=null,S.isGloballyAttached=false,S.instanceCount=0;var $e=S;var N=class N{constructor(e={}){this.isAttached=false;this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t));}static getInstance(e){return N.instance?e?.excludeUrls&&(N.instance.excludeUrls=e.excludeUrls.map(t=>new RegExp(t))):N.instance=new N(e),N.instance}static resetInstance(){N.instance&&(window.fetch=N.instance.originalFetch,N.instance.isAttached=false,N.instance.onRequest=[],N.instance.onResponse=[],N.instance.onError=[]),N.instance=null;}attach(){this.isAttached||(this.isAttached=true,window.fetch=async(...e)=>{let[t,s]=e,l=t.toString();if(this.excludeUrls.some(n=>n.test(l)))return this.originalFetch(...e);let a=Date.now();this.onRequest.forEach(n=>n(l,s||{}));try{let n=await this.originalFetch(...e),d=Date.now()-a;return this.onResponse.forEach(c=>c(l,n.status,d)),n}catch(n){throw this.onError.forEach(d=>d(l,n)),n}});}detach(){if(this.onRequest.length===0&&this.onResponse.length===0&&this.onError.length===0){if(!this.isAttached)return;this.isAttached=false,window.fetch=this.originalFetch;}}onFetchRequest(e){this.onRequest.push(e);}removeFetchRequest(e){let t=this.onRequest.indexOf(e);t>-1&&this.onRequest.splice(t,1);}onFetchResponse(e){this.onResponse.push(e);}removeFetchResponse(e){let t=this.onResponse.indexOf(e);t>-1&&this.onResponse.splice(t,1);}onFetchError(e){this.onError.push(e);}removeFetchError(e){let t=this.onError.indexOf(e);t>-1&&this.onError.splice(t,1);}};N.instance=null;var ge=N;var $=class ${constructor(e={}){this.isAttached=false;this.requestIdCounter=0;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}generateRequestId(){return `xhr_${++this.requestIdCounter}_${Date.now()}_${Math.random().toString(36).substring(7)}`}static getInstance(e){return $.instance?e?.excludeUrls&&($.instance.excludeUrls=e.excludeUrls.map(t=>new RegExp(t))):$.instance=new $(e),$.instance}static resetInstance(){$.instance&&($.instance.originalXHR.prototype.open=$.instance.originalOpen,$.instance.originalXHR.prototype.send=$.instance.originalSend,$.instance.isAttached=false,$.instance.onRequest=[],$.instance.onResponse=[],$.instance.onError=[]),$.instance=null;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(t,s,l,a,n){let d=typeof s=="string"?s:s.href;if(e.requestTracker.set(this,{method:t,url:d,headers:{},body:null,startTime:Date.now(),requestId:e.generateRequestId()}),e.excludeUrls.some(f=>f.test(d)))return e.originalOpen.call(this,t,s,l??true,a,n);let c=e.requestTracker.get(this);for(let f of e.onRequest)f(c);return e.originalOpen.call(this,t,s,l??true,a,n)},this.originalXHR.prototype.send=function(t){let s=e.requestTracker.get(this);if(s){s.body=t;let l=false,a=false,n=this.onload,d=this.onerror,c=function(y){if(l){n&&n.call(this,y);return}l=true;let g=Date.now()-s.startTime;for(let v of e.onResponse)v(s,this.status,g);n&&n.call(this,y);},f=function(y){if(a){d&&d.call(this,y);return}a=true;for(let g of e.onError)g(s,new Error("XHR Error"));d&&d.call(this,y);};this.onload=c,this.onerror=f,this.addEventListener("load",c),this.addEventListener("error",f);}return e.originalSend.call(this,t)};}detach(){if(this.onRequest.length===0&&this.onResponse.length===0&&this.onError.length===0){if(!this.isAttached)return;this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend;}}onXHRRequest(e){this.onRequest.push(e);}removeXHRRequest(e){let t=this.onRequest.indexOf(e);t>-1&&this.onRequest.splice(t,1);}onXHRResponse(e){this.onResponse.push(e);}removeXHRResponse(e){let t=this.onResponse.indexOf(e);t>-1&&this.onResponse.splice(t,1);}onXHRError(e){this.onError.push(e);}removeXHRError(e){let t=this.onError.indexOf(e);t>-1&&this.onError.splice(t,1);}};$.instance=null;var fe=$;var Ue={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5,persistAcrossReloads:false};function ho(){return Math.random().toString(36).substring(7)}function Be(o,e){return Re(o,{keys:e})}function xo(o,e,t,s){return {addLog:n=>{o.logsRef.current.push(n),o.logsRef.current.length>e.maxLogs&&o.logsRef.current.shift(),s(o.logsRef.current.length),n.type==="CONSOLE"?n.level==="ERROR"&&o.errorCountRef.current++:(n.type==="FETCH_ERR"||n.type==="XHR_ERR")&&o.errorCountRef.current++;let d=e.uploadOnErrorCount??5;if(o.errorCountRef.current>=d&&e.uploadEndpoint){let c={metadata:{...o.metadataRef.current,logCount:o.logsRef.current.length},logs:o.logsRef.current,fileName:U("json",{},{fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.environment,userId:e.userId,sessionId:null})};fetch(e.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:t(c)}).catch(()=>{}),o.errorCountRef.current=0;}if(e.enablePersistence&&typeof window<"u")try{localStorage.setItem(e.persistenceKey,t(o.logsRef.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},updateMetadata:()=>{let n=o.logsRef.current.filter(c=>c.type==="CONSOLE").reduce((c,f)=>f.level==="ERROR"?c+1:c,0),d=o.logsRef.current.filter(c=>c.type==="FETCH_ERR"||c.type==="XHR_ERR").length;o.metadataRef.current={...o.metadataRef.current,logCount:o.logsRef.current.length,errorCount:n,networkErrorCount:d};}}}function wo(){return o=>{let e=new Set;return JSON.stringify(o,(t,s)=>{if(typeof s=="object"&&s!==null){if(e.has(s))return "[Circular]";e.add(s);}return s})}}function vo(o){return !o||o.length===0?"":o.map(e=>pt(e)).join("")}function pt(o){return JSON.stringify(o)+`
`}var ne=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,t,s="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(t,{create:!0})).createWritable();await n.write(e),await n.close();}catch(l){if(l.name==="AbortError")return;throw l}}static download(e,t,s="application/json"){let l=new Blob([e],{type:s}),a=URL.createObjectURL(l),n=document.createElement("a");n.href=a,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(a);}static async downloadWithFallback(e,t,s="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,t,s);return}catch(l){if(l.name==="AbortError")return}this.download(e,t,s);}};ne.supported=null;function So(o,e,t,s){return (l,a)=>{if(typeof window>"u")return null;s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d=a||U(l,{},n),c,f;if(l==="json"){let y=e.current?{metadata:e.current,logs:o.current}:o.current;c=t(y),f="application/json";}else if(l==="jsonl"){let y=o.current.map(g=>G(g,e.current));c=vo(y),f="application/x-ndjson",d=a||U("jsonl",{},n);}else if(l==="ecs.json"){let y={metadata:re(e.current),logs:o.current.map(g=>G(g,e.current))};c=JSON.stringify(y,null,2),f="application/json",d=a||U("ecs-json",{},n);}else if(l==="ai.txt"){let y=e.current,g=`# METADATA
service.name=${y.environment||"unknown"}
user.id=${y.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,v=o.current.map(z=>{let b=G(z,y),L=b["@timestamp"],j=b.log?.level||"info",Z=b.event?.category?.[0]||"unknown",k=`[${L}] ${j} ${Z}`;return b.message&&(k+=` | message="${b.message}"`),b.http?.request?.method&&(k+=` | req.method=${b.http.request.method}`),b.url?.full&&(k+=` | url=${b.url.full}`),b.http?.response?.status_code&&(k+=` | res.status=${b.http.response.status_code}`),b.error?.message&&(k+=` | error="${b.error.message}"`),k});c=g+v.join(`
`),f="text/plain",d=a||U("ai-txt",{},n);}else c=(e.current?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${t(e.current)}
${"=".repeat(80)}

`:"")+o.current.map(g=>`[${g.time}] ${g.type}
${t(g)}
${"=".repeat(80)}`).join(`
`),f="text/plain";return ne.downloadWithFallback(c,d,f),d}}function ko(o,e,t,s){return async l=>{let a=l;if(!a)return {success:false,error:"No endpoint configured"};try{s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d={metadata:e.current,logs:o.current,fileName:U("json",{},n)},c=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:t(d)});if(!c.ok)throw new Error(`Upload failed: ${c.status}`);return {success:!0,data:await c.json()}}catch(n){let d=n instanceof Error?n.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",n),{success:false,error:d}}}}function be(o={}){let e={...Ue,...o},t=react.useRef(e);t.current=e;let s=react.useRef([]),l=react.useRef(e.sessionId||mo()),a=react.useRef(bo(l.current,e.environment,e.userId,0)),[n,d]=react.useState(0),c=react.useRef(0),f=react.useMemo(()=>wo(),[]),y=react.useMemo(()=>$e.getInstance(),[]),g=react.useMemo(()=>ge.getInstance(),[]),v=react.useMemo(()=>fe.getInstance(),[]),z=react.useMemo(()=>xo({logsRef:s,metadataRef:a,errorCountRef:c},{maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount??5,sanitizeKeys:e.sanitizeKeys,environment:e.environment,userId:e.userId},f,d),[e,f]),b=z.updateMetadata,L=react.useRef(z.addLog);L.current=z.addLog;let j=react.useMemo(()=>So(s,a,f,b),[f,b]),Z=react.useMemo(()=>ko(s,a,f,b),[f,b]);react.useEffect(()=>{if(typeof window>"u")return;let w=t.current;if(ge.getInstance({excludeUrls:w.excludeUrls}),fe.getInstance({excludeUrls:w.excludeUrls}),w.enablePersistence)try{let h=localStorage.getItem(w.persistenceKey);h&&(s.current=JSON.parse(h),d(s.current.length));}catch{}let ee=[];if(w.captureConsole){y.attach();let h=(F,A)=>{let X=A.map(u=>{if(typeof u=="object")try{return f(u)}catch{return String(u)}return String(u)}).join(" ");L.current({type:"CONSOLE",level:F.toUpperCase(),time:new Date().toISOString(),data:X.substring(0,5e3)});};y.onLog(h),ee.push(()=>{y.removeLog(h),y.detach();});}if(w.captureFetch){let h=new Map,F=(u,x)=>{let D=ho(),R=null;if(x?.body)try{R=typeof x.body=="string"?JSON.parse(x.body):x.body,R=Re(R,{keys:w.sanitizeKeys});}catch{R=String(x.body).substring(0,1e3);}let P=window.setTimeout(()=>{h.delete(D);},3e4);h.set(D,{url:u,method:x?.method||"GET",headers:Be(x?.headers,w.sanitizeKeys),body:R,timeoutId:P}),L.current({type:"FETCH_REQ",id:D,url:u,method:x?.method||"GET",headers:Be(x?.headers,w.sanitizeKeys),body:R,time:new Date().toISOString()});},A=(u,x,D)=>{for(let[R,P]of h.entries())if(P.url===u){clearTimeout(P.timeoutId),h.delete(R),L.current({type:"FETCH_RES",id:R,url:u,status:x,statusText:"",duration:`${D}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}},X=(u,x)=>{for(let[D,R]of h.entries())if(R.url===u){clearTimeout(R.timeoutId),h.delete(D),L.current({type:"FETCH_ERR",id:D,url:u,error:x.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}};g.onFetchRequest(F),g.onFetchResponse(A),g.onFetchError(X),g.attach(),ee.push(()=>{h.forEach(u=>clearTimeout(u.timeoutId)),h.clear(),g.removeFetchRequest(F),g.removeFetchResponse(A),g.removeFetchError(X),g.detach();});}if(w.captureXHR){let h=new Map,F=u=>{let x=window.setTimeout(()=>{h.delete(u.requestId);},3e4);h.set(u.requestId,{url:u.url,method:u.method,headers:u.headers,body:u.body,timeoutId:x}),L.current({type:"XHR_REQ",id:u.requestId,url:u.url,method:u.method,headers:u.headers,body:u.body,time:new Date().toISOString()});},A=(u,x,D)=>{let R=h.get(u.requestId);R&&(clearTimeout(R.timeoutId),h.delete(u.requestId),L.current({type:"XHR_RES",id:u.requestId,url:u.url,status:x,statusText:"",duration:`${D}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()}));},X=(u,x)=>{let D=h.get(u.requestId);D&&(clearTimeout(D.timeoutId),h.delete(u.requestId),L.current({type:"XHR_ERR",id:u.requestId,url:u.url,error:x.message,duration:"[unknown]ms",time:new Date().toISOString()}));};v.onXHRRequest(F),v.onXHRResponse(A),v.onXHRError(X),v.attach(),ee.push(()=>{h.forEach(u=>clearTimeout(u.timeoutId)),h.clear(),v.removeXHRRequest(F),v.removeXHRResponse(A),v.removeXHRError(X),v.detach();});}if(w.enablePersistence&&w.persistAcrossReloads===false){let h=()=>{try{localStorage.removeItem(w.persistenceKey);}catch{}};window.addEventListener("beforeunload",h),ee.push(()=>window.removeEventListener("beforeunload",h));}return ()=>{ee.forEach(h=>h());}},[]);let k=react.useCallback(()=>{if(s.current=[],d(0),c.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{}},[e.enablePersistence,e.persistenceKey]),Pe=react.useCallback(()=>[...s.current],[]),ae=react.useCallback(()=>s.current.length,[]),He=react.useCallback(()=>(b(),{...a.current}),[b]);return {downloadLogs:j,uploadLogs:Z,clearLogs:k,getLogs:Pe,getLogCount:ae,getMetadata:He,sessionId:l.current,_logCount:n}}function Eo(){let[o,e]=react.useState(false),[t,s]=react.useState(false),l=react.useRef(o);l.current=o;let a=react.useRef(null);react.useEffect(()=>{s(ne.isSupported());},[]);let n=react.useCallback(()=>{e(f=>!f);},[]),d=react.useCallback(()=>{e(true);},[]),c=react.useCallback(()=>{e(false);},[]);return react.useEffect(()=>{let f=g=>{g.ctrlKey&&g.shiftKey&&g.key==="D"&&(g.preventDefault(),n()),g.key==="Escape"&&l.current&&(g.preventDefault(),c());};document.addEventListener("keydown",f);let y=g=>{typeof g.detail?.visible=="boolean"&&(a.current&&clearTimeout(a.current),a.current=setTimeout(()=>{e(g.detail.visible);},10));};return window.addEventListener("glean-debug-toggle",y),()=>{document.removeEventListener("keydown",f),window.removeEventListener("glean-debug-toggle",y);}},[n,c]),{isOpen:o,toggle:n,open:d,close:c,supportsDirectoryPicker:t}}var Io="debug-panel-copy-format",yt=["json","ecs.json","ai.txt"];function Ee(){let[o,e]=react.useState(()=>{if(typeof window<"u"){let t=localStorage.getItem(Io);if(t&&yt.includes(t))return t}return "ecs.json"});return react.useEffect(()=>{localStorage.setItem(Io,o);},[o]),{copyFormat:o,setCopyFormat:e}}function Lo(){let[o,e]=react.useState(null),[t,s]=react.useState(null),[l,a]=react.useState(null),[n,d]=react.useState(false);return react.useEffect(()=>{if(o){let c=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(c)}},[o]),react.useEffect(()=>{if(t){let c=setTimeout(()=>{s(null);},3e3);return ()=>clearTimeout(c)}},[t]),react.useEffect(()=>{if(l){let c=setTimeout(()=>{a(null);},3e3);return ()=>clearTimeout(c)}},[l]),{uploadStatus:o,setUploadStatus:e,directoryStatus:t,setDirectoryStatus:s,copyStatus:l,setCopyStatus:a,showSettings:n,setShowSettings:d}}function Do(){let[o,e]=react.useState(false),t=react.useCallback(()=>{e(true);},[]),s=react.useCallback(()=>{e(false);},[]),l=react.useCallback(()=>{e(a=>!a);},[]);return {isSettingsOpen:o,openSettings:t,closeSettings:s,toggleSettings:l}}var r={glassBg:"rgba(255, 255, 255, 0.75)",glassBorder:"rgba(255, 255, 255, 0.4)",glassShadow:"0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",colors:{primary:"#1a1a2e",secondary:"#4a5568",muted:"#a0aec0",border:"rgba(0, 0, 0, 0.06)",success:"#059669",successBg:"rgba(5, 150, 105, 0.08)",successBorder:"rgba(5, 150, 105, 0.2)",error:"#dc2626",errorBg:"rgba(220, 38, 38, 0.06)",errorBorder:"rgba(220, 38, 38, 0.15)",warning:"#d97706",accent:"#0ea5e9",accentBg:"rgba(14, 165, 233, 0.08)",accentBorder:"rgba(14, 165, 233, 0.2)"},fonts:{display:'-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',mono:'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'},space:{xs:"4px",sm:"8px",md:"12px",lg:"16px"},radius:{sm:"6px",md:"10px",lg:"16px",full:"9999px"},transitions:{fast:"0.15s ease",normal:"0.25s cubic-bezier(0.4, 0, 0.2, 1)",slow:"0.4s cubic-bezier(0.4, 0, 0.2, 1)"}},Ke=goober.css`
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
`,Mo=goober.css`
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
`;var Je=goober.css`
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
`,Ve=goober.css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${r.space.lg};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
  border-bottom: 1px solid ${r.colors.border};
`,Fo=goober.css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`,Ye=goober.css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${r.colors.primary};
  letter-spacing: -0.01em;
`,xt=goober.css`
  margin: 0;
  font-size: 11px;
  color: ${r.colors.muted};
  font-family: ${r.fonts.mono};
  font-weight: 500;
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
    background: rgba(0, 0, 0, 0.05);
    color: ${r.colors.secondary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
`,Qe=goober.css`
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
`,De=goober.css`
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
`,wt=goober.css`
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
`;var vt=goober.css`
  color: ${r.colors.muted};
  font-weight: 500;
`,St=goober.css`
  color: ${r.colors.primary};
  font-weight: 500;
  text-align: right;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,Ze=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: ${r.colors.border};
`,me=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${r.space.lg};
  background: rgba(255, 255, 255, 0.6);
  gap: ${r.space.xs};
`,ye=goober.css`
  font-size: 28px;
  font-weight: 700;
  color: ${r.colors.primary};
  line-height: 1;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`,he=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`,Ao=goober.css`
  color: ${r.colors.error};
`,Po=goober.css`
  color: ${r.colors.warning};
`,B={warmCream:"rgba(255, 252, 245, 0.85)",warmGray:"#4a4543",warmMuted:"#8a857f",copperAccent:"#c17f59",copperSubtle:"rgba(193, 127, 89, 0.12)"},To=goober.css`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Source+Sans+3:wght@400;500;600&display=swap');

  font-family: 'Source Sans 3', ${r.fonts.display};
  padding: ${r.space.md} ${r.space.lg};
  background: ${B.warmCream};
  border-bottom: 1px solid rgba(74, 69, 67, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
`,Le=goober.css`
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
  color: ${B.warmGray};
  text-transform: none;
  letter-spacing: 0.02em;
  transition: color ${r.transitions.normal};

  &:hover {
    color: ${B.copperAccent};
  }

  &:focus-visible {
    outline: 2px solid ${B.copperAccent};
    outline-offset: 2px;
    border-radius: 4px;
  }
`,kt=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${B.copperSubtle};
  border-radius: ${r.radius.sm};
  color: ${B.copperAccent};
  transition: all ${r.transitions.normal};

  ${Le}:hover & {
    background: ${B.copperAccent};
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
`;var Rt=goober.css`
  padding-top: ${r.space.md};
`;goober.css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${r.space.md};
  padding: ${r.space.xs} 0;
  font-size: 13px;
  line-height: 1.6;
`;var $t=goober.css`
  font-weight: 600;
  color: ${B.warmMuted};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-size: 13px;
  min-width: 100px;
`,Ct=goober.css`
  font-weight: 500;
  color: ${B.warmGray};
  text-align: right;
  flex: 1;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
`,Et=goober.css`
  font-weight: 500;
  color: ${B.warmGray};
  text-align: right;
  flex: 1;
  font-family: ${r.fonts.mono};
  font-size: 13px;
  background: rgba(0, 0, 0, 0.03);
  padding: 3px 8px;
  border-radius: 4px;
`,eo=goober.css`
  padding: ${r.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${r.space.lg};
  background: rgba(255, 255, 255, 0.3);
`,Te=goober.css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.sm};
`,xe=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;goober.css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${r.space.sm};
`;var Ne=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${r.space.sm};
`,we=goober.css`
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
  ${we}
`;var It=goober.css`
  ${we}
  background: ${r.colors.accentBg};
  border-color: ${r.colors.accentBorder};
  color: ${r.colors.accent};

  &:hover:not(:disabled) {
    background: ${r.colors.accent};
    color: #ffffff;
    border-color: ${r.colors.accent};
  }
`,oo=goober.css`
  ${we}
  background: ${r.colors.successBg};
  border-color: ${r.colors.successBorder};
  color: ${r.colors.success};

  &:hover:not(:disabled) {
    background: ${r.colors.success};
    color: #ffffff;
    border-color: ${r.colors.success};
  }
`,Lt=goober.css`
  ${we}
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
`,Dt=goober.css`
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
`,Ho=goober.css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.xs};
  padding: 0 ${r.space.lg} ${r.space.sm};
`,to=goober.css`
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
`,ro=goober.css`
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
`,qo=goober.css`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,no=goober.css`
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
`,so=goober.css`
  font-size: 11px;
  color: ${r.colors.muted};
`,zo=`
  0 0 0 1px rgba(0, 0, 0, 0.04),
  0 2px 8px rgba(0, 0, 0, 0.06),
  0 8px 24px rgba(0, 0, 0, 0.08)
`,Oe=goober.css`
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
`;var ve=goober.css`
  padding: 8px 10px 6px 0px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-family: ${r.fonts.display};
`,W=goober.css`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  line-height: 1.5;
`,K=goober.css`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;
  min-width: 70px;
  font-family: ${r.fonts.display};
`,J=goober.css`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  font-size: 12px;
  font-family: ${r.fonts.display};
`,ao=goober.css`
  ${J}
  font-family: ${r.fonts.mono};
  font-size: 11px;
  letter-spacing: -0.02em;
  color: rgba(0, 0, 0, 0.65);
`,Me=goober.css`
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
`,io=goober.css`
  margin-left: auto;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 600;
`,lo=goober.css`
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 8px 0;
  border-radius: 1px;
`,Tt=goober.css`
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
`,No=goober.css`
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
`,Oo=goober.css`
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

    ${Je} {
      background: rgba(30, 30, 46, 0.9);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    ${Ve} {
      background: linear-gradient(135deg, rgba(40, 40, 60, 0.8) 0%, rgba(30, 30, 46, 0.6) 100%);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Ye} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${xt} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${We} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
    }

    ${Qe} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(220, 38, 38, 0.2);
        color: #f87171;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
      }
    }

    ${De} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(14, 165, 233, 0.15);
        color: #38bdf8;
        box-shadow: 0 2px 8px rgba(14, 165, 233, 0.25);
      }
    }

    ${wt} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${vt} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${St} {
      color: rgba(255, 255, 255, 0.9);
    }

    ${Ze} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${me} {
      background: rgba(40, 40, 60, 0.5);
    }

    ${ye} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${he} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${To} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Le} {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${Rt} {
      background: rgba(40, 40, 60, 0.5);
      color: rgba(255, 255, 255, 0.6);

      strong {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    ${eo} {
      background: rgba(40, 40, 60, 0.3);
    }

    ${xe} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${we} {
      background: rgba(50, 50, 70, 0.8);
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);

      &:hover:not(:disabled) {
        background: rgba(60, 60, 85, 0.9);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }

    ${It} {
      background: rgba(14, 165, 233, 0.15);
      border-color: rgba(14, 165, 233, 0.25);
      color: #38bdf8;

      &:hover:not(:disabled) {
        background: #0ea5e9;
        color: #ffffff;
        border-color: #0ea5e9;
      }
    }

    ${oo} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;

      &:hover:not(:disabled) {
        background: #059669;
        color: #ffffff;
        border-color: #059669;
      }
    }

    ${Lt},
    ${Dt} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;

      &:hover:not(:disabled) {
        background: #dc2626;
        color: #ffffff;
        border-color: #dc2626;
      }
    }

    ${to} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;
    }

    ${ro} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;
    }

    ${no} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);

      kbd {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.5);
      }
    }

    ${so} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Ke} {
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

    ${Tt},
    ${Oe} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.3),
        0 12px 48px rgba(0, 0, 0, 0.4);
    }

    ${K} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${J} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${ao} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }

    ${ve},
    ${No} {
      color: rgba(255, 255, 255, 0.35);
      background: rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Me},
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

    ${Oo} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);

      & svg {
        opacity: 1;
      }
    }

    ${lo} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${io} {
      color: rgba(255, 255, 255, 0.5);
    }

    ${No} {
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

    ${Oo} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }

    ${To} {
      background: rgba(40, 40, 60, 0.5);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Le} {
      color: rgba(255, 255, 255, 0.75);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${kt} {
      background: rgba(193, 127, 89, 0.18);
      color: rgba(193, 127, 89, 0.9);

      ${Le}:hover & {
        background: rgba(193, 127, 89, 0.9);
        color: #ffffff;
      }
    }

    ${$t} {
      color: rgba(255, 255, 255, 0.5);
    }

    ${Ct} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${Et} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;function qt({metadata:o}){return jsxRuntime.jsxs("div",{className:Oe,children:[jsxRuntime.jsx("div",{className:ve,children:"Session Details"}),jsxRuntime.jsxs("div",{className:W,children:[jsxRuntime.jsx("span",{className:K,children:"User"}),jsxRuntime.jsx("span",{className:J,children:o.userId||"Anonymous"})]}),jsxRuntime.jsxs("div",{className:W,children:[jsxRuntime.jsx("span",{className:K,children:"Session ID"}),jsxRuntime.jsx("span",{className:ao,children:o.sessionId||"N/A"})]}),jsxRuntime.jsxs("div",{className:W,children:[jsxRuntime.jsx("span",{className:K,children:"Browser"}),jsxRuntime.jsxs("span",{className:J,children:[o.browser," \xB7 ",o.platform]})]}),jsxRuntime.jsxs("div",{className:W,children:[jsxRuntime.jsx("span",{className:K,children:"Screen"}),jsxRuntime.jsx("span",{className:J,children:o.screenResolution})]}),jsxRuntime.jsxs("div",{className:W,children:[jsxRuntime.jsx("span",{className:K,children:"Timezone"}),jsxRuntime.jsx("span",{className:J,children:o.timezone})]}),jsxRuntime.jsxs("div",{className:W,children:[jsxRuntime.jsx("span",{className:K,children:"Language"}),jsxRuntime.jsx("span",{className:J,children:o.language})]}),jsxRuntime.jsxs("div",{className:W,children:[jsxRuntime.jsx("span",{className:K,children:"Viewport"}),jsxRuntime.jsx("span",{className:J,children:o.viewport})]})]})}function zt({copyFormat:o,setCopyFormat:e,onSaveToDirectory:t,onCloseDropdown:s}){let l=["json","ecs.json","ai.txt"],a={json:jsxRuntime.jsx(lucideReact.FileJson,{size:14}),"ecs.json":jsxRuntime.jsx(lucideReact.FileText,{size:14}),"ai.txt":jsxRuntime.jsx(lucideReact.FileText,{size:14})};return jsxRuntime.jsxs("div",{className:Oe,children:[jsxRuntime.jsx("div",{className:ve,children:"Export format"}),jsxRuntime.jsx("div",{style:{display:"flex",flexDirection:"column",gap:2},children:l.map(n=>jsxRuntime.jsxs("button",{type:"button",className:Me,style:o===n?{background:"rgba(0, 0, 0, 0.06)",color:"rgba(0, 0, 0, 0.9)"}:void 0,onClick:()=>{e(n),s();},children:[a[n],jsxRuntime.jsxs("span",{style:{flex:1},children:[n==="json"&&"JSON",n==="ecs.json"&&"ECS (AI)",n==="ai.txt"&&"AI-TXT"]}),o===n&&jsxRuntime.jsx("span",{className:io,children:"\u2713"})]},n))}),jsxRuntime.jsx("div",{className:lo}),jsxRuntime.jsx("div",{className:ve,children:"Actions"}),jsxRuntime.jsxs("button",{type:"button",className:Me,onClick:()=>{t(),s();},children:[jsxRuntime.jsx(lucideReact.Save,{size:14}),jsxRuntime.jsx("span",{children:"Save to folder"})]})]})}var Bo=react.forwardRef(function({metadata:e,onClose:t,onSaveToDirectory:s,onClear:l,isSettingsOpen:a,openSettings:n,closeSettings:d,isSessionDetailsOpen:c,openSessionDetails:f,closeSessionDetails:y},g){let{copyFormat:v,setCopyFormat:z}=Ee();return jsxRuntime.jsx(jsxRuntime.Fragment,{children:jsxRuntime.jsxs("div",{className:Ve,children:[jsxRuntime.jsx("div",{className:Fo,children:jsxRuntime.jsx("h3",{className:Ye,children:"Debug"})}),jsxRuntime.jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsxRuntime.jsx("button",{type:"button",onClick:l,className:Qe,"aria-label":"Clear all logs",title:"Clear logs",children:jsxRuntime.jsx(lucideReact.Trash2,{size:16})}),jsxRuntime.jsxs(H__namespace.Root,{open:c,onOpenChange:b=>{b?f():y();},children:[jsxRuntime.jsx(H__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",className:De,"aria-label":"Session details",title:"Session details",children:jsxRuntime.jsx(lucideReact.Info,{size:16})})}),jsxRuntime.jsx(H__namespace.Portal,{children:jsxRuntime.jsx(H__namespace.Content,{sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:b=>{b.target.closest("#debug-panel")&&b.preventDefault();},children:jsxRuntime.jsx(qt,{metadata:e})})})]}),jsxRuntime.jsxs(H__namespace.Root,{open:a,onOpenChange:b=>{b?n():d();},children:[jsxRuntime.jsx(H__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",className:De,"aria-label":"Actions and settings",title:"Actions and settings","data-settings-trigger":"true",children:jsxRuntime.jsx(lucideReact.Settings,{size:16})})}),jsxRuntime.jsx(H__namespace.Portal,{children:jsxRuntime.jsx(H__namespace.Content,{"data-settings-dropdown":"true",sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:b=>{b.target.closest("#debug-panel")&&b.preventDefault();},children:jsxRuntime.jsx(zt,{copyFormat:v,setCopyFormat:z,onSaveToDirectory:s,onCloseDropdown:()=>d()})})})]}),jsxRuntime.jsx("button",{ref:g,type:"button",onClick:t,className:We,"aria-label":"Close debug panel",children:jsxRuntime.jsx(lucideReact.X,{size:18})})]})]})})});function jo({logCount:o,errorCount:e,networkErrorCount:t}){return jsxRuntime.jsxs("div",{className:Ze,children:[jsxRuntime.jsxs("div",{className:me,children:[jsxRuntime.jsx("div",{className:ye,children:o.toLocaleString()}),jsxRuntime.jsx("div",{className:he,children:"Logs"})]}),jsxRuntime.jsxs("div",{className:me,children:[jsxRuntime.jsx("div",{className:`${ye} ${Ao}`,children:e.toLocaleString()}),jsxRuntime.jsx("div",{className:he,children:"Errors"})]}),jsxRuntime.jsxs("div",{className:me,children:[jsxRuntime.jsx("div",{className:`${ye} ${Po}`,children:t.toLocaleString()}),jsxRuntime.jsx("div",{className:he,children:"Network"})]})]})}function V({children:o,content:e,disabled:t,...s}){return jsxRuntime.jsx(q__namespace.Provider,{delayDuration:200,skipDelayDuration:100,children:jsxRuntime.jsxs(q__namespace.Root,{children:[jsxRuntime.jsx(q__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",disabled:t,...s,children:o})}),!t&&jsxRuntime.jsx(q__namespace.Portal,{children:jsxRuntime.jsxs(q__namespace.Content,{side:"top",sideOffset:6,align:"center",style:{background:"var(--color-primary, #1a1a2e)",color:"white",padding:"6px 12px",borderRadius:"6px",fontSize:"11px",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",zIndex:1e5},children:[e,jsxRuntime.jsx(q__namespace.Arrow,{style:{fill:"var(--color-primary, #1a1a2e)"}})]})})]})})}function Go({logCount:o,hasUploadEndpoint:e,isUploading:t,getFilteredLogCount:s,onCopyFiltered:l,onDownload:a,onCopy:n,onUpload:d}){let c=o===0;return jsxRuntime.jsxs("div",{className:eo,children:[jsxRuntime.jsxs("div",{className:Te,children:[jsxRuntime.jsx("div",{className:xe,children:"Copy Filtered"}),jsxRuntime.jsxs("div",{className:Ne,children:[jsxRuntime.jsxs(V,{content:"Copy only console logs",disabled:c||s("logs")===0,onClick:()=>l("logs"),className:_,"aria-label":"Copy only console logs",children:[jsxRuntime.jsx(lucideReact.Terminal,{size:18}),"Logs"]}),jsxRuntime.jsxs(V,{content:"Copy only errors",disabled:c||s("errors")===0,onClick:()=>l("errors"),className:_,"aria-label":"Copy only errors",children:[jsxRuntime.jsx(lucideReact.AlertCircle,{size:18}),"Errors"]}),jsxRuntime.jsxs(V,{content:"Copy only network requests",disabled:c||s("network")===0,onClick:()=>l("network"),className:_,"aria-label":"Copy only network requests",children:[jsxRuntime.jsx(lucideReact.Globe,{size:18}),"Network"]})]})]}),jsxRuntime.jsxs("div",{className:Te,children:[jsxRuntime.jsx("div",{className:xe,children:"Export"}),jsxRuntime.jsxs("div",{className:Ne,children:[jsxRuntime.jsxs(V,{content:"Download as JSON",disabled:c,onClick:()=>a("json"),className:_,"aria-label":"Download as JSON",children:[jsxRuntime.jsx(lucideReact.FileJson,{size:18}),"JSON"]}),jsxRuntime.jsxs(V,{content:"Download as TXT",disabled:c,onClick:()=>a("txt"),className:_,"aria-label":"Download as TXT",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"TXT"]}),jsxRuntime.jsxs(V,{content:"Download as JSONL",disabled:c,onClick:()=>a("jsonl"),className:_,"aria-label":"Download as JSONL",children:[jsxRuntime.jsx(lucideReact.Database,{size:18}),"JSONL"]})]})]}),jsxRuntime.jsxs("div",{className:Te,children:[jsxRuntime.jsx("div",{className:xe,children:"Actions"}),jsxRuntime.jsxs("div",{className:Ne,children:[jsxRuntime.jsxs(V,{content:"Copy all to clipboard",disabled:c,onClick:n,className:_,"aria-label":"Copy all to clipboard",children:[jsxRuntime.jsx(lucideReact.Copy,{size:18}),"Copy"]}),jsxRuntime.jsxs(V,{content:"Download AI-optimized format",disabled:c,onClick:()=>a("ai.txt"),className:_,"aria-label":"Download AI-optimized format",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"AI-TXT"]}),e?jsxRuntime.jsxs(V,{content:"Upload logs to server",disabled:t,onClick:d,className:oo,"aria-label":"Upload logs to server",children:[jsxRuntime.jsx(lucideReact.CloudUpload,{size:18}),t?"Uploading...":"Upload"]}):jsxRuntime.jsx("div",{})]})]})]})}function co({status:o}){return jsxRuntime.jsxs("div",{"aria-live":"polite",className:o.type==="success"?to:ro,children:[o.type==="success"?jsxRuntime.jsx(lucideReact.CheckCircle2,{size:14}):jsxRuntime.jsx(lucideReact.AlertCircle,{size:14}),jsxRuntime.jsx("span",{className:qo,children:o.message})]})}function _o({uploadStatus:o,directoryStatus:e,copyStatus:t}){return jsxRuntime.jsxs("div",{className:Ho,children:[o&&jsxRuntime.jsx(co,{status:o}),e&&jsxRuntime.jsx(co,{status:e}),t&&jsxRuntime.jsx(co,{status:t})]})}function Vo(){return jsxRuntime.jsx("div",{className:no,children:jsxRuntime.jsxs("div",{className:so,children:["Press ",jsxRuntime.jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function Wo(o,e){switch(e){case "logs":return o.filter(t=>t.type==="CONSOLE");case "errors":return o.filter(t=>t.type==="CONSOLE"&&t.level==="error");case "network":return o.filter(t=>t.type==="FETCH_REQ"||t.type==="FETCH_RES"||t.type==="XHR_REQ"||t.type==="XHR_RES");case "networkErrors":return o.filter(t=>t.type==="FETCH_ERR"||t.type==="XHR_ERR");default:return o}}function po({user:o,environment:e="production",uploadEndpoint:t,fileNameTemplate:s="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:l=2e3,showInProduction:a=false}){let{isOpen:n,open:d,close:c}=Eo(),{isSettingsOpen:f,openSettings:y,closeSettings:g}=Do(),{copyFormat:v}=Ee(),[z,b]=react.useState(false),L=react.useCallback(()=>{b(true);},[]),j=react.useCallback(()=>{b(false);},[]),{uploadStatus:Z,setUploadStatus:k,directoryStatus:Pe,setDirectoryStatus:ae,copyStatus:He,setCopyStatus:w}=Lo(),ee=react.useRef(null),h=react.useRef(null),{downloadLogs:F,uploadLogs:A,clearLogs:X,getLogs:u,getMetadata:x,_logCount:D}=be({fileNameTemplate:s,environment:e,userId:o?.id||o?.email||"guest",includeMetadata:true,uploadEndpoint:t,maxLogs:l,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),R=D,P=x();react.useEffect(()=>{if(P.errorCount>=5&&t){let m=async()=>{try{await A();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",m),()=>window.removeEventListener("error",m)}},[P.errorCount,t,A]);let ke=react.useCallback((m,O)=>{if(v==="json")return JSON.stringify({metadata:O,logs:m},null,2);if(v==="ecs.json"){let oe=m.map(le=>G(le,O)),ie={metadata:re(O),logs:oe};return JSON.stringify(ie,null,2)}else if(v==="ai.txt"){let oe=`# METADATA
service.name=${O.environment||"unknown"}
user.id=${O.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,ie=m.map(le=>{let T=G(le,O),go=T["@timestamp"],fo=T["log.level"],lt=T["event.category"]?.[0]||"unknown",ce=`[${go}] ${fo} ${lt}`;return T.message&&(ce+=` | message="${T.message}"`),T.http?.request?.method&&(ce+=` | req.method=${T.http.request.method}`),T.url?.full&&(ce+=` | url=${T.url.full}`),T.http?.response?.status_code&&(ce+=` | res.status=${T.http.response.status_code}`),T.error?.message&&(ce+=` | error="${T.error.message}"`),ce});return oe+ie.join(`
`)}return JSON.stringify({metadata:O,logs:m},null,2)},[v]),tt=react.useCallback(async()=>{k(null);try{let m=await A();m.success?(k({type:"success",message:`Uploaded successfully! ${m.data?JSON.stringify(m.data):""}`}),m.data&&typeof m.data=="object"&&"url"in m.data&&await navigator.clipboard.writeText(String(m.data.url))):k({type:"error",message:`Upload failed: ${m.error}`});}catch(m){k({type:"error",message:`Error: ${m instanceof Error?m.message:"Unknown error"}`});}},[A,k]),rt=react.useCallback(m=>{let O=F(m);O&&k({type:"success",message:`Downloaded: ${O}`});},[F,k]),nt=react.useCallback(async()=>{ae(null);try{await F("json",void 0,{showPicker:!0})&&ae({type:"success",message:"Saved to directory"});}catch{ae({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[F,ae]),st=react.useCallback(async()=>{w(null);try{let m=u(),O=x(),oe=ke(m,O);await navigator.clipboard.writeText(oe),w({type:"success",message:"Copied to clipboard!"});}catch{w({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[u,x,ke,w]),at=react.useCallback(async m=>{w(null);try{let O=u(),oe=x(),ie=Wo(O,m),le=ie.length;if(le===0){w({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[m]});return}let T=ke(ie,oe);await navigator.clipboard.writeText(T),w({type:"success",message:`Copied ${le} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[m]} to clipboard`});}catch{w({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[u,x,ke,w]),it=react.useCallback(m=>Wo(u(),m).length,[u]);return a||e==="development"||o?.role==="admin"?jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs(framerMotion.motion.button,{type:"button",onClick:m=>{m.stopPropagation(),n?c():d();},className:Ke,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",whileHover:{scale:1.02},whileTap:{scale:.98},layout:true,children:[jsxRuntime.jsx(lucideReact.Bug,{size:18}),P.errorCount>0&&jsxRuntime.jsx(framerMotion.motion.span,{className:Mo,initial:{scale:0},animate:{scale:1}},`err-${P.errorCount}`)]}),jsxRuntime.jsx(framerMotion.AnimatePresence,{mode:"wait",children:n&&jsxRuntime.jsx(framerMotion.motion.div,{ref:ee,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:Je,initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:20,scale:.95},transition:{duration:.25,ease:[.4,0,.2,1]},children:jsxRuntime.jsxs(Q__namespace.Root,{className:"glean-scroll-area",style:{flex:1,overflow:"hidden"},children:[jsxRuntime.jsxs(Q__namespace.Viewport,{className:"glean-scroll-viewport",style:{width:"100%",height:"100%"},children:[jsxRuntime.jsx(Bo,{metadata:P,onClose:c,onSaveToDirectory:nt,onClear:()=>{confirm("Clear all logs?")&&X();},ref:h,isSettingsOpen:f,openSettings:y,closeSettings:g,isSessionDetailsOpen:z,openSessionDetails:L,closeSessionDetails:j}),jsxRuntime.jsx(jo,{logCount:R,errorCount:P.errorCount,networkErrorCount:P.networkErrorCount}),jsxRuntime.jsx("div",{style:{padding:"8px 16px",borderBottom:"1px solid var(--color-border, #e2e8f0)"},children:jsxRuntime.jsx("button",{type:"button",onClick:()=>{console.log("[TEST] Console log test message"),console.error("[TEST] Console error test message"),console.warn("[TEST] Console warn test message"),console.info("[TEST] Console info test message");},style:{background:"var(--color-primary, #6366f1)",color:"white",border:"none",padding:"6px 12px",borderRadius:"4px",cursor:"pointer",fontSize:"11px",fontWeight:500},children:"\u{1F9EA} Test Logs (4x)"})}),jsxRuntime.jsx(Go,{logCount:R,hasUploadEndpoint:!!t,isUploading:false,getFilteredLogCount:it,onCopyFiltered:at,onDownload:rt,onCopy:st,onUpload:tt}),jsxRuntime.jsx(_o,{uploadStatus:Z,directoryStatus:Pe,copyStatus:He}),jsxRuntime.jsx(Vo,{})]}),jsxRuntime.jsx(Q__namespace.Scrollbar,{className:"glean-scrollbar",orientation:"vertical",style:{display:"flex",width:"6px",userSelect:"none",touchAction:"none",padding:"2px",background:"transparent"},children:jsxRuntime.jsx(Q__namespace.Thumb,{className:"glean-scrollbar-thumb",style:{flex:1,background:"rgba(0, 0, 0, 0.15)",borderRadius:"3px",transition:"background 0.15s ease"}})})]})})})]}):null}function nr({fileNameTemplate:o="debug_{timestamp}"}){let[e,t]=react.useState(false),[s,l]=react.useState(0),{downloadLogs:a,clearLogs:n,getLogCount:d}=be({fileNameTemplate:o});return react.useEffect(()=>{l(d());let c=setInterval(()=>{l(d());},100);return ()=>clearInterval(c)},[d]),jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("button",{onClick:()=>t(c=>!c),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsxRuntime.jsx("span",{children:s})}),e&&jsxRuntime.jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsxRuntime.jsx("button",{onClick:()=>a("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsxRuntime.jsx("button",{onClick:()=>{confirm("Clear all logs?")&&n();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsxRuntime.jsx("button",{onClick:()=>t(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function lr(o){return react.useMemo(()=>o.showInProduction||o.environment==="development"||o.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[o.showInProduction,o.environment,o.user])}function cr(){let o=react.useCallback(t=>{try{typeof window<"u"&&(t?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:t}})));}catch{}},[]),e=react.useMemo(()=>typeof process<"u"&&true,[]);react.useEffect(()=>{if(typeof window>"u")return;let t=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>o(true),hide:()=>o(false),toggle:()=>{try{let s=localStorage.getItem("glean-debug-enabled")==="true";o(!s);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=t,()=>{typeof window<"u"&&window.glean===t&&delete window.glean;}},[o,e]);}function ot(o){console.log("[GleanDebugger] Mounting with props:",o);let e=lr(o);return console.log("[GleanDebugger] isActivated:",e),cr(),e?(console.log("[GleanDebugger] Rendering DebugPanel"),jsxRuntime.jsx(po,{...o})):(console.log("[GleanDebugger] Not activated, returning null"),null)}exports.DebugPanel=po;exports.DebugPanelMinimal=nr;exports.GleanDebugger=ot;exports.collectMetadata=bo;exports.filterStackTrace=ze;exports.generateExportFilename=fr;exports.generateFilename=U;exports.generateSessionId=mo;exports.getBrowserInfo=qe;exports.sanitizeData=Re;exports.sanitizeFilename=te;exports.transformMetadataToECS=re;exports.transformToECS=G;exports.useLogRecorder=be;