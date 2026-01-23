import {forwardRef,useState,useEffect,useRef,useMemo,useCallback}from'react';import {motion,AnimatePresence}from'framer-motion';import*as V from'@radix-ui/react-scroll-area';import {css}from'goober';import*as F from'@radix-ui/react-dropdown-menu';import {Trash2,Info,Settings,X as X$1,FileText,FileJson,Save,Bug,Terminal,AlertCircle,Globe,Database,Copy,CloudUpload,CheckCircle2}from'lucide-react';import {jsx,Fragment,jsxs}from'react/jsx-runtime';import*as P from'@radix-ui/react-tooltip';// @ts-nocheck
var lt=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function ve(o,e={}){let t=e.keys||lt;if(!o||typeof o!="object")return o;let a=Array.isArray(o)?[...o]:{...o},s=l=>{if(!l||typeof l!="object")return l;for(let n in l)if(Object.prototype.hasOwnProperty.call(l,n)){let d=n.toLowerCase();t.some(b=>d.includes(b.toLowerCase()))?l[n]="***REDACTED***":l[n]!==null&&typeof l[n]=="object"&&(l[n]=s(l[n]));}return l};return s(a)}function Z(o){return o.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function He(){if(typeof navigator>"u")return "unknown";let o=navigator.userAgent;return o.includes("Edg")?"edge":o.includes("Chrome")?"chrome":o.includes("Firefox")?"firefox":o.includes("Safari")?"safari":"unknown"}function bo(o,e,t,a){if(typeof window>"u")return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:a,errorCount:0,networkErrorCount:0};let s=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",l=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:He(),platform:navigator.platform,language:navigator.language,screenResolution:s,viewport:l,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:a,errorCount:0,networkErrorCount:0}}function mo(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function H(o="json",e={},t={}){let{fileNameTemplate:a="{env}_{userId}_{sessionId}_{timestamp}",environment:s="development",userId:l="anonymous",sessionId:n="unknown"}=t,d=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],c=new Date().toISOString().split("T")[0],b=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),m=t.browser||He(),f=t.platform||(typeof navigator<"u"?navigator.platform:"unknown"),E=(t.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",g=String(t.errorCount??e.errorCount??0),L=String(t.logCount??e.logCount??0),I=a.replace("{env}",Z(s)).replace("{userId}",Z(l??"anonymous")).replace("{sessionId}",Z(n??"unknown")).replace("{timestamp}",d).replace("{date}",c).replace("{time}",b).replace(/\{errorCount\}/g,g).replace(/\{logCount\}/g,L).replace("{browser}",Z(m)).replace("{platform}",Z(f)).replace("{url}",Z(E));for(let[Y,S]of Object.entries(e))I=I.replace(`{${Y}}`,String(S));return `${I}.${o}`}function gr(o,e="json"){let t=o.url.split("?")[0]||"unknown";return H(e,{},{environment:o.environment,userId:o.userId,sessionId:o.sessionId,browser:o.browser,platform:o.platform,url:t,errorCount:o.errorCount,logCount:o.logCount})}var ct={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function yo(o){let e=parseFloat(o);return isNaN(e)?0:Math.round(e*1e6)}function dt(o){return ct[o.toLowerCase()]||"info"}function _e(o){return o.filter(e=>!e.ignored).slice(0,20)}function ee(o){return {service:{environment:o.environment},user:o.userId?{id:o.userId}:void 0,host:{name:o.browser,type:o.platform}}}function B(o,e){let t={"@timestamp":o.time,event:{original:o,category:[]}},a=ee(e);switch(Object.assign(t,a),o.type){case "CONSOLE":{t.log={level:dt(o.level)},t.message=o.data,t.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{t.http={request:{method:o.method}},t.url={full:o.url},t.event.category=["network","web"],t.event.action="request",t.event.id=o.id;break}case "FETCH_RES":case "XHR_RES":{t.http={response:{status_code:o.status}},t.url={full:o.url},t.event.duration=yo(o.duration),t.event.category=["network","web"],t.event.action="response",t.event.id=o.id;break}case "FETCH_ERR":case "XHR_ERR":{t.error={message:o.error},t.url={full:o.url},t.event.duration=yo(o.duration),t.event.category=["network","web"],t.event.action="error",t.event.id=o.id;let s=o;if(typeof s.body=="object"&&s.body!==null){let l=s.body;if(Array.isArray(l.frames)){let n=_e(l.frames);t.error.stack_trace=n.map(d=>`  at ${d.functionName||"?"} (${d.filename||"?"}:${d.lineNumber||0}:${d.columnNumber||0})`).join(`
`);}}break}default:{t.message=JSON.stringify(o);break}}return t}var Se=null,le=class le{constructor(){this.isAttached=false;if(le.instanceCount++,this.instanceId=le.instanceCount,this.originalLog=console.log.bind(console),this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[],Se){this.originalLog(`[ConsoleInterceptor#${this.instanceId}] \u26A0\uFE0F  Singleton violation - returning existing instance #${Se.instanceId}`);return}Se=this,this.originalLog(`[ConsoleInterceptor#${this.instanceId}] \u2705 Created singleton instance (total: ${le.instanceCount})`);}debugLog(...e){this.originalLog(...e);}attach(){if(this.debugLog(`[ConsoleInterceptor#${this.instanceId}] attach() - isAttached=${this.isAttached}, callbacks=${this.callbacks.length}`),this.isAttached){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] ALREADY ATTACHED - skipping duplicate attach`);return}this.isAttached=true,["log","error","warn","info","debug"].forEach(t=>{let a=this.originalConsole[t];console[t]=(...s)=>{this.debugLog(`[ConsoleInterceptor#${this.instanceId}] \u{1F525} ${t}() triggered (${this.callbacks.length} callbacks)`);for(let l of this.callbacks)l(t,s);a(...s);};});}detach(){if(Se=null,this.callbacks.length>0){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] detach() SKIPPED - ${this.callbacks.length} callbacks still active`);return}if(this.debugLog(`[ConsoleInterceptor#${this.instanceId}] detach() - isAttached=${this.isAttached}`),!this.isAttached){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] ALREADY DETACHED - skipping duplicate detach`);return}this.isAttached=false,["log","error","warn","info","debug"].forEach(t=>{console[t]=this.originalConsole[t];});}onLog(e){this.debugLog(`[ConsoleInterceptor#${this.instanceId}] onLog() - callback count before: ${this.callbacks.length}`),this.callbacks.push(e),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] onLog() - callback count after: ${this.callbacks.length}`);}removeLog(e){let t=this.callbacks.indexOf(e);this.debugLog(`[ConsoleInterceptor#${this.instanceId}] removeLog() - callback found at index: ${t}, total: ${this.callbacks.length}`),t>-1&&this.callbacks.splice(t,1),this.debugLog(`[ConsoleInterceptor#${this.instanceId}] removeLog() - callback count after: ${this.callbacks.length}`);}};le.instanceCount=0;var ke=le;var Ce=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t));}attach(){window.fetch=async(...e)=>{let[t,a]=e,s=t.toString();if(this.excludeUrls.some(n=>n.test(s)))return this.originalFetch(...e);let l=Date.now();this.onRequest.forEach(n=>n(s,a||{}));try{let n=await this.originalFetch(...e),d=Date.now()-l;return this.onResponse.forEach(c=>c(s,n.status,d)),n}catch(n){throw this.onError.forEach(d=>d(s,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}removeFetchRequest(e){let t=this.onRequest.indexOf(e);t>-1&&this.onRequest.splice(t,1);}onFetchResponse(e){this.onResponse.push(e);}removeFetchResponse(e){let t=this.onResponse.indexOf(e);t>-1&&this.onResponse.splice(t,1);}onFetchError(e){this.onError.push(e);}removeFetchError(e){let t=this.onError.indexOf(e);t>-1&&this.onError.splice(t,1);}};var $e=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(t,a,s,l,n){let d=typeof a=="string"?a:a.href;if(e.requestTracker.set(this,{method:t,url:d,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(b=>b.test(d)))return e.originalOpen.call(this,t,a,s??true,l,n);let c=e.requestTracker.get(this);for(let b of e.onRequest)b(c);return e.originalOpen.call(this,t,a,s??true,l,n)},this.originalXHR.prototype.send=function(t){let a=e.requestTracker.get(this);if(a){a.body=t;let s=this.onload,l=this.onerror;this.onload=function(n){let d=Date.now()-a.startTime;for(let c of e.onResponse)c(a,this.status,d);s&&s.call(this,n);},this.onerror=function(n){for(let d of e.onError)d(a,new Error("XHR Error"));l&&l.call(this,n);};}return e.originalSend.call(this,t)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}removeXHRRequest(e){let t=this.onRequest.indexOf(e);t>-1&&this.onRequest.splice(t,1);}onXHRResponse(e){this.onResponse.push(e);}removeXHRResponse(e){let t=this.onResponse.indexOf(e);t>-1&&this.onResponse.splice(t,1);}onXHRError(e){this.onError.push(e);}removeXHRError(e){let t=this.onError.indexOf(e);t>-1&&this.onError.splice(t,1);}};var qe={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5,persistAcrossReloads:false};function ue(){return Math.random().toString(36).substring(7)}function Be(o,e){return ve(o,{keys:e})}function ho(o,e,t,a){return {addLog:n=>{o.logsRef.current.push(n),o.logsRef.current.length>e.maxLogs&&o.logsRef.current.shift(),a(o.logsRef.current.length),n.type==="CONSOLE"?n.level==="ERROR"&&o.errorCountRef.current++:(n.type==="FETCH_ERR"||n.type==="XHR_ERR")&&o.errorCountRef.current++;let d=e.uploadOnErrorCount??5;if(o.errorCountRef.current>=d&&e.uploadEndpoint){let c={metadata:{...o.metadataRef.current,logCount:o.logsRef.current.length},logs:o.logsRef.current,fileName:H("json",{},{fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.environment,userId:e.userId,sessionId:null})};fetch(e.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:t(c)}).catch(()=>{}),o.errorCountRef.current=0;}if(e.enablePersistence&&typeof window<"u")try{localStorage.setItem(e.persistenceKey,t(o.logsRef.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},updateMetadata:()=>{let n=o.logsRef.current.filter(c=>c.type==="CONSOLE").reduce((c,b)=>b.level==="ERROR"?c+1:c,0),d=o.logsRef.current.filter(c=>c.type==="FETCH_ERR"||c.type==="XHR_ERR").length;o.metadataRef.current={...o.metadataRef.current,logCount:o.logsRef.current.length,errorCount:n,networkErrorCount:d};}}}function xo(){return o=>{let e=new Set;return JSON.stringify(o,(t,a)=>{if(typeof a=="object"&&a!==null){if(e.has(a))return "[Circular]";e.add(a);}return a})}}function wo(o){return !o||o.length===0?"":o.map(e=>pt(e)).join("")}function pt(o){return JSON.stringify(o)+`
`}var oe=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,t,a="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(t,{create:!0})).createWritable();await n.write(e),await n.close();}catch(s){if(s.name==="AbortError")return;throw s}}static download(e,t,a="application/json"){let s=new Blob([e],{type:a}),l=URL.createObjectURL(s),n=document.createElement("a");n.href=l,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(l);}static async downloadWithFallback(e,t,a="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,t,a);return}catch(s){if(s.name==="AbortError")return}this.download(e,t,a);}};oe.supported=null;function vo(o,e,t,a){return (s,l)=>{if(typeof window>"u")return null;a();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d=l||H(s,{},n),c,b;if(s==="json"){let m=e.current?{metadata:e.current,logs:o.current}:o.current;c=t(m),b="application/json";}else if(s==="jsonl"){let m=o.current.map(f=>B(f,e.current));c=wo(m),b="application/x-ndjson",d=l||H("jsonl",{},n);}else if(s==="ecs.json"){let m={metadata:ee(e.current),logs:o.current.map(f=>B(f,e.current))};c=JSON.stringify(m,null,2),b="application/json",d=l||H("ecs-json",{},n);}else if(s==="ai.txt"){let m=e.current,f=`# METADATA
service.name=${m.environment||"unknown"}
user.id=${m.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,v=o.current.map(E=>{let g=B(E,m),L=g["@timestamp"],I=g.log?.level||"info",Y=g.event?.category?.[0]||"unknown",S=`[${L}] ${I} ${Y}`;return g.message&&(S+=` | message="${g.message}"`),g.http?.request?.method&&(S+=` | req.method=${g.http.request.method}`),g.url?.full&&(S+=` | url=${g.url.full}`),g.http?.response?.status_code&&(S+=` | res.status=${g.http.response.status_code}`),g.error?.message&&(S+=` | error="${g.error.message}"`),S});c=f+v.join(`
`),b="text/plain",d=l||H("ai-txt",{},n);}else c=(e.current?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${t(e.current)}
${"=".repeat(80)}

`:"")+o.current.map(f=>`[${f.time}] ${f.type}
${t(f)}
${"=".repeat(80)}`).join(`
`),b="text/plain";return oe.downloadWithFallback(c,d,b),d}}function So(o,e,t,a){return async s=>{let l=s;if(!l)return {success:false,error:"No endpoint configured"};try{a();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d={metadata:e.current,logs:o.current,fileName:H("json",{},n)},c=await fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:t(d)});if(!c.ok)throw new Error(`Upload failed: ${c.status}`);return {success:!0,data:await c.json()}}catch(n){let d=n instanceof Error?n.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",n),{success:false,error:d}}}}function ge(o={}){let e={...qe,...o},t=useRef(e);t.current=e;let a=useRef(false),s=useRef([]),l=useRef(e.sessionId||mo()),n=useRef(bo(l.current,e.environment,e.userId,0)),[d,c]=useState(0),b=useRef(0),m=useMemo(()=>xo(),[]),f=useMemo(()=>new ke,[]),v=useMemo(()=>new Ce({excludeUrls:e.excludeUrls}),[e.excludeUrls]),E=useMemo(()=>new $e({excludeUrls:e.excludeUrls}),[e.excludeUrls]),g=useMemo(()=>ho({logsRef:s,metadataRef:n,errorCountRef:b},{maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount??5,sanitizeKeys:e.sanitizeKeys,environment:e.environment,userId:e.userId},m,c),[e,m]),L=g.addLog,I=g.updateMetadata,Y=useMemo(()=>vo(s,n,m,I),[m,I]),S=useMemo(()=>So(s,n,m,I),[m,I]);useEffect(()=>{if(typeof window>"u"||a.current)return;a.current=true;let N=t.current;if(N.enablePersistence)try{let y=localStorage.getItem(N.persistenceKey);y&&(s.current=JSON.parse(y),c(s.current.length));}catch{}let W=[];if(N.captureConsole){f.attach();let y=(M,q)=>{let x=q.map(h=>{if(typeof h=="object")try{return m(h)}catch{return String(h)}return String(h)}).join(" ");L({type:"CONSOLE",level:M.toUpperCase(),time:new Date().toISOString(),data:x.substring(0,5e3)});};f.onLog(y),W.push(()=>{f.removeLog(y),f.detach();});}if(N.captureFetch){let y=new Map,M=(h,$)=>{let z=ue(),w=null;if($?.body)try{w=typeof $.body=="string"?JSON.parse($.body):$.body,w=ve(w,{keys:N.sanitizeKeys});}catch{w=String($.body).substring(0,1e3);}y.set(z,{url:h,method:$?.method||"GET",headers:Be($?.headers,N.sanitizeKeys),body:w}),L({type:"FETCH_REQ",id:z,url:h,method:$?.method||"GET",headers:Be($?.headers,N.sanitizeKeys),body:w,time:new Date().toISOString()});},q=(h,$,z)=>{for(let[w,ne]of y.entries())if(ne.url===h){y.delete(w),L({type:"FETCH_RES",id:w,url:h,status:$,statusText:"",duration:`${z}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}},x=(h,$)=>{for(let[z,w]of y.entries())if(w.url===h){y.delete(z),L({type:"FETCH_ERR",id:z,url:h,error:$.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}};v.onFetchRequest(M),v.onFetchResponse(q),v.onFetchError(x),v.attach(),W.push(()=>{v.removeFetchRequest(M),v.removeFetchResponse(q),v.removeFetchError(x),v.detach();});}if(N.captureXHR){let y=x=>{L({type:"XHR_REQ",id:ue(),url:x.url,method:x.method,headers:x.headers,body:x.body,time:new Date().toISOString()});},M=(x,h,$)=>{L({type:"XHR_RES",id:ue(),url:x.url,status:h,statusText:"",duration:`${$}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});},q=(x,h)=>{L({type:"XHR_ERR",id:ue(),url:x.url,error:h.message,duration:"[unknown]ms",time:new Date().toISOString()});};E.onXHRRequest(y),E.onXHRResponse(M),E.onXHRError(q),E.attach(),W.push(()=>{E.removeXHRRequest(y),E.removeXHRResponse(M),E.removeXHRError(q),E.detach();});}if(N.enablePersistence&&N.persistAcrossReloads===false){let y=()=>{try{localStorage.removeItem(N.persistenceKey);}catch{}};window.addEventListener("beforeunload",y),W.push(()=>window.removeEventListener("beforeunload",y));}return ()=>{W.forEach(y=>y());}},[]);let Ae=useCallback(()=>{if(s.current=[],c(0),b.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{}},[e.enablePersistence,e.persistenceKey]),re=useCallback(()=>[...s.current],[]),ze=useCallback(()=>s.current.length,[]),A=useCallback(()=>(I(),{...n.current}),[I]);return {downloadLogs:Y,uploadLogs:S,clearLogs:Ae,getLogs:re,getLogCount:ze,getMetadata:A,sessionId:l.current,_logCount:d}}function Ro(){let[o,e]=useState(false),[t,a]=useState(false),s=useRef(o);s.current=o;let l=useRef(null);useEffect(()=>{a(oe.isSupported());},[]);let n=useCallback(()=>{e(b=>!b);},[]),d=useCallback(()=>{e(true);},[]),c=useCallback(()=>{e(false);},[]);return useEffect(()=>{let b=f=>{f.ctrlKey&&f.shiftKey&&f.key==="D"&&(f.preventDefault(),n()),f.key==="Escape"&&s.current&&(f.preventDefault(),c());};document.addEventListener("keydown",b);let m=f=>{typeof f.detail?.visible=="boolean"&&(l.current&&clearTimeout(l.current),l.current=setTimeout(()=>{e(f.detail.visible);},10));};return window.addEventListener("glean-debug-toggle",m),()=>{document.removeEventListener("keydown",b),window.removeEventListener("glean-debug-toggle",m);}},[n,c]),{isOpen:o,toggle:n,open:d,close:c,supportsDirectoryPicker:t}}var Eo="debug-panel-copy-format",mt=["json","ecs.json","ai.txt"];function Ee(){let[o,e]=useState(()=>{if(typeof window<"u"){let t=localStorage.getItem(Eo);if(t&&mt.includes(t))return t}return "ecs.json"});return useEffect(()=>{localStorage.setItem(Eo,o);},[o]),{copyFormat:o,setCopyFormat:e}}function Lo(){let[o,e]=useState(null),[t,a]=useState(null),[s,l]=useState(null),[n,d]=useState(false);return useEffect(()=>{if(o){let c=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(c)}},[o]),useEffect(()=>{if(t){let c=setTimeout(()=>{a(null);},3e3);return ()=>clearTimeout(c)}},[t]),useEffect(()=>{if(s){let c=setTimeout(()=>{l(null);},3e3);return ()=>clearTimeout(c)}},[s]),{uploadStatus:o,setUploadStatus:e,directoryStatus:t,setDirectoryStatus:a,copyStatus:s,setCopyStatus:l,showSettings:n,setShowSettings:d}}function Do(){let[o,e]=useState(false),t=useCallback(()=>{e(true);},[]),a=useCallback(()=>{e(false);},[]),s=useCallback(()=>{e(l=>!l);},[]);return {isSettingsOpen:o,openSettings:t,closeSettings:a,toggleSettings:s}}var r={glassBg:"rgba(255, 255, 255, 0.75)",glassBorder:"rgba(255, 255, 255, 0.4)",glassShadow:"0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",colors:{primary:"#1a1a2e",secondary:"#4a5568",muted:"#a0aec0",border:"rgba(0, 0, 0, 0.06)",success:"#059669",successBg:"rgba(5, 150, 105, 0.08)",successBorder:"rgba(5, 150, 105, 0.2)",error:"#dc2626",errorBg:"rgba(220, 38, 38, 0.06)",errorBorder:"rgba(220, 38, 38, 0.15)",warning:"#d97706",accent:"#0ea5e9",accentBg:"rgba(14, 165, 233, 0.08)",accentBorder:"rgba(14, 165, 233, 0.2)"},fonts:{display:'-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',mono:'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'},space:{xs:"4px",sm:"8px",md:"12px",lg:"16px"},radius:{sm:"6px",md:"10px",lg:"16px",full:"9999px"},transitions:{fast:"0.15s ease",normal:"0.25s cubic-bezier(0.4, 0, 0.2, 1)",slow:"0.4s cubic-bezier(0.4, 0, 0.2, 1)"}},Ke=css`
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
`,Oo=css`
  position: absolute;
  top: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  background: ${r.colors.error};
  border: 2px solid ${r.colors.primary};
  border-radius: ${r.radius.full};
  box-shadow: 0 1px 4px rgba(220, 38, 38, 0.4);
`;css`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${r.radius.full};
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(4px);
`;css`
  background: ${r.colors.error};
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${r.radius.full};
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
`;var Je=css`
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
`,Ve=css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${r.space.lg};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
  border-bottom: 1px solid ${r.colors.border};
`,Mo=css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`,Ye=css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${r.colors.primary};
  letter-spacing: -0.01em;
`,ht=css`
  margin: 0;
  font-size: 11px;
  color: ${r.colors.muted};
  font-family: ${r.fonts.mono};
  font-weight: 500;
`,We=css`
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
`,Qe=css`
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
`,Ie=css`
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
`,xt=css`
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
`;css`
  display: flex;
  justify-content: space-between;
  gap: ${r.space.md};
  padding: ${r.space.xs} 0;
  border-bottom: 1px solid ${r.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;var wt=css`
  color: ${r.colors.muted};
  font-weight: 500;
`,vt=css`
  color: ${r.colors.primary};
  font-weight: 500;
  text-align: right;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,Ze=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: ${r.colors.border};
`,fe=css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${r.space.lg};
  background: rgba(255, 255, 255, 0.6);
  gap: ${r.space.xs};
`,be=css`
  font-size: 28px;
  font-weight: 700;
  color: ${r.colors.primary};
  line-height: 1;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`,me=css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`,Fo=css`
  color: ${r.colors.error};
`,Po=css`
  color: ${r.colors.warning};
`,_={warmCream:"rgba(255, 252, 245, 0.85)",warmGray:"#4a4543",warmMuted:"#8a857f",copperAccent:"#c17f59",copperSubtle:"rgba(193, 127, 89, 0.12)"},Io=css`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Source+Sans+3:wght@400;500;600&display=swap');

  font-family: 'Source Sans 3', ${r.fonts.display};
  padding: ${r.space.md} ${r.space.lg};
  background: ${_.warmCream};
  border-bottom: 1px solid rgba(74, 69, 67, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
`,De=css`
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
  color: ${_.warmGray};
  text-transform: none;
  letter-spacing: 0.02em;
  transition: color ${r.transitions.normal};

  &:hover {
    color: ${_.copperAccent};
  }

  &:focus-visible {
    outline: 2px solid ${_.copperAccent};
    outline-offset: 2px;
    border-radius: 4px;
  }
`,St=css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${_.copperSubtle};
  border-radius: ${r.radius.sm};
  color: ${_.copperAccent};
  transition: all ${r.transitions.normal};

  ${De}:hover & {
    background: ${_.copperAccent};
    color: #ffffff;
  }
`;css`
  transition: transform ${r.transitions.slow};

  &.glean-open {
    transform: rotate(180deg);
  }
`;css`
  flex: 1;
`;css`
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
`;css`
  overflow: hidden;
  transition:
    height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s ease;
`;var kt=css`
  padding-top: ${r.space.md};
`;css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${r.space.md};
  padding: ${r.space.xs} 0;
  font-size: 13px;
  line-height: 1.6;
`;var Ct=css`
  font-weight: 600;
  color: ${_.warmMuted};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-size: 13px;
  min-width: 100px;
`,$t=css`
  font-weight: 500;
  color: ${_.warmGray};
  text-align: right;
  flex: 1;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
`,Rt=css`
  font-weight: 500;
  color: ${_.warmGray};
  text-align: right;
  flex: 1;
  font-family: ${r.fonts.mono};
  font-size: 13px;
  background: rgba(0, 0, 0, 0.03);
  padding: 3px 8px;
  border-radius: 4px;
`,eo=css`
  padding: ${r.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${r.space.lg};
  background: rgba(255, 255, 255, 0.3);
`,Te=css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.sm};
`,ye=css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${r.space.sm};
`;var Ne=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${r.space.sm};
`,he=css`
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
`;css`
  ${he}
`;var Et=css`
  ${he}
  background: ${r.colors.accentBg};
  border-color: ${r.colors.accentBorder};
  color: ${r.colors.accent};

  &:hover:not(:disabled) {
    background: ${r.colors.accent};
    color: #ffffff;
    border-color: ${r.colors.accent};
  }
`,oo=css`
  ${he}
  background: ${r.colors.successBg};
  border-color: ${r.colors.successBorder};
  color: ${r.colors.success};

  &:hover:not(:disabled) {
    background: ${r.colors.success};
    color: #ffffff;
    border-color: ${r.colors.success};
  }
`,Lt=css`
  ${he}
  background: ${r.colors.errorBg};
  border-color: ${r.colors.errorBorder};
  color: ${r.colors.error};

  &:hover:not(:disabled) {
    background: ${r.colors.error};
    color: #ffffff;
    border-color: ${r.colors.error};
  }
`,j=css`
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
`,Dt=css`
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
`,Ao=css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.xs};
  padding: 0 ${r.space.lg} ${r.space.sm};
`,to=css`
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
`,ro=css`
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
`,zo=css`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,no=css`
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
`,so=css`
  font-size: 11px;
  color: ${r.colors.muted};
`,Ho=`
  0 0 0 1px rgba(0, 0, 0, 0.04),
  0 2px 8px rgba(0, 0, 0, 0.06),
  0 8px 24px rgba(0, 0, 0, 0.08)
`,Oe=css`
  min-width: 200px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: ${Ho};
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
`;css`
  fill: rgba(255, 255, 255, 0.95);
  filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.06));
`;var xe=css`
  padding: 8px 10px 6px 0px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-family: ${r.fonts.display};
`,J=css`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  line-height: 1.5;
`,U=css`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;
  min-width: 70px;
  font-family: ${r.fonts.display};
`,X=css`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  font-size: 12px;
  font-family: ${r.fonts.display};
`,ao=css`
  ${X}
  font-family: ${r.fonts.mono};
  font-size: 11px;
  letter-spacing: -0.02em;
  color: rgba(0, 0, 0, 0.65);
`,Me=css`
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
`,io=css`
  margin-left: auto;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 600;
`,lo=css`
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 8px 0;
  border-radius: 1px;
`,It=css`
  min-width: 180px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: ${Ho};
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
`,To=css`
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
`,Ge=css`
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
`,No=css`
  ${Ge}
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.9);

  & svg {
    opacity: 1;
  }
`;css`
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

    ${ht} {
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

    ${Ie} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(14, 165, 233, 0.15);
        color: #38bdf8;
        box-shadow: 0 2px 8px rgba(14, 165, 233, 0.25);
      }
    }

    ${xt} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${wt} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${vt} {
      color: rgba(255, 255, 255, 0.9);
    }

    ${Ze} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${fe} {
      background: rgba(40, 40, 60, 0.5);
    }

    ${be} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${me} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Io} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${De} {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${kt} {
      background: rgba(40, 40, 60, 0.5);
      color: rgba(255, 255, 255, 0.6);

      strong {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    ${eo} {
      background: rgba(40, 40, 60, 0.3);
    }

    ${ye} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${he} {
      background: rgba(50, 50, 70, 0.8);
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);

      &:hover:not(:disabled) {
        background: rgba(60, 60, 85, 0.9);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }

    ${Et} {
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

    ${It},
    ${Oe} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.3),
        0 12px 48px rgba(0, 0, 0, 0.4);
    }

    ${U} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${X} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${ao} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }

    ${xe},
    ${To} {
      color: rgba(255, 255, 255, 0.35);
      background: rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Me},
    ${Ge} {
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

    ${No} {
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

    ${To} {
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Ge} {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    ${No} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }

    ${Io} {
      background: rgba(40, 40, 60, 0.5);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${De} {
      color: rgba(255, 255, 255, 0.75);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${St} {
      background: rgba(193, 127, 89, 0.18);
      color: rgba(193, 127, 89, 0.9);

      ${De}:hover & {
        background: rgba(193, 127, 89, 0.9);
        color: #ffffff;
      }
    }

    ${Ct} {
      color: rgba(255, 255, 255, 0.5);
    }

    ${$t} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${Rt} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;function zt({metadata:o}){return jsxs("div",{className:Oe,children:[jsx("div",{className:xe,children:"Session Details"}),jsxs("div",{className:J,children:[jsx("span",{className:U,children:"User"}),jsx("span",{className:X,children:o.userId||"Anonymous"})]}),jsxs("div",{className:J,children:[jsx("span",{className:U,children:"Session ID"}),jsx("span",{className:ao,children:o.sessionId||"N/A"})]}),jsxs("div",{className:J,children:[jsx("span",{className:U,children:"Browser"}),jsxs("span",{className:X,children:[o.browser," \xB7 ",o.platform]})]}),jsxs("div",{className:J,children:[jsx("span",{className:U,children:"Screen"}),jsx("span",{className:X,children:o.screenResolution})]}),jsxs("div",{className:J,children:[jsx("span",{className:U,children:"Timezone"}),jsx("span",{className:X,children:o.timezone})]}),jsxs("div",{className:J,children:[jsx("span",{className:U,children:"Language"}),jsx("span",{className:X,children:o.language})]}),jsxs("div",{className:J,children:[jsx("span",{className:U,children:"Viewport"}),jsx("span",{className:X,children:o.viewport})]})]})}function Ht({copyFormat:o,setCopyFormat:e,onSaveToDirectory:t,onCloseDropdown:a}){let s=["json","ecs.json","ai.txt"],l={json:jsx(FileJson,{size:14}),"ecs.json":jsx(FileText,{size:14}),"ai.txt":jsx(FileText,{size:14})};return jsxs("div",{className:Oe,children:[jsx("div",{className:xe,children:"Export format"}),jsx("div",{style:{display:"flex",flexDirection:"column",gap:2},children:s.map(n=>jsxs("button",{type:"button",className:Me,style:o===n?{background:"rgba(0, 0, 0, 0.06)",color:"rgba(0, 0, 0, 0.9)"}:void 0,onClick:()=>{e(n),a();},children:[l[n],jsxs("span",{style:{flex:1},children:[n==="json"&&"JSON",n==="ecs.json"&&"ECS (AI)",n==="ai.txt"&&"AI-TXT"]}),o===n&&jsx("span",{className:io,children:"\u2713"})]},n))}),jsx("div",{className:lo}),jsx("div",{className:xe,children:"Actions"}),jsxs("button",{type:"button",className:Me,onClick:()=>{t(),a();},children:[jsx(Save,{size:14}),jsx("span",{children:"Save to folder"})]})]})}var qo=forwardRef(function({metadata:e,onClose:t,onSaveToDirectory:a,onClear:s,isSettingsOpen:l,openSettings:n,closeSettings:d,isSessionDetailsOpen:c,openSessionDetails:b,closeSessionDetails:m},f){let{copyFormat:v,setCopyFormat:E}=Ee();return jsx(Fragment,{children:jsxs("div",{className:Ve,children:[jsx("div",{className:Mo,children:jsx("h3",{className:Ye,children:"Debug"})}),jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsx("button",{type:"button",onClick:s,className:Qe,"aria-label":"Clear all logs",title:"Clear logs",children:jsx(Trash2,{size:16})}),jsxs(F.Root,{open:c,onOpenChange:g=>{g?b():m();},children:[jsx(F.Trigger,{asChild:true,children:jsx("button",{type:"button",className:Ie,"aria-label":"Session details",title:"Session details",children:jsx(Info,{size:16})})}),jsx(F.Portal,{children:jsx(F.Content,{sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:g=>{g.target.closest("#debug-panel")&&g.preventDefault();},children:jsx(zt,{metadata:e})})})]}),jsxs(F.Root,{open:l,onOpenChange:g=>{g?n():d();},children:[jsx(F.Trigger,{asChild:true,children:jsx("button",{type:"button",className:Ie,"aria-label":"Actions and settings",title:"Actions and settings","data-settings-trigger":"true",children:jsx(Settings,{size:16})})}),jsx(F.Portal,{children:jsx(F.Content,{"data-settings-dropdown":"true",sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:g=>{g.target.closest("#debug-panel")&&g.preventDefault();},children:jsx(Ht,{copyFormat:v,setCopyFormat:E,onSaveToDirectory:a,onCloseDropdown:()=>d()})})})]}),jsx("button",{ref:f,type:"button",onClick:t,className:We,"aria-label":"Close debug panel",children:jsx(X$1,{size:18})})]})]})})});function Bo({logCount:o,errorCount:e,networkErrorCount:t}){return jsxs("div",{className:Ze,children:[jsxs("div",{className:fe,children:[jsx("div",{className:be,children:o.toLocaleString()}),jsx("div",{className:me,children:"Logs"})]}),jsxs("div",{className:fe,children:[jsx("div",{className:`${be} ${Fo}`,children:e.toLocaleString()}),jsx("div",{className:me,children:"Errors"})]}),jsxs("div",{className:fe,children:[jsx("div",{className:`${be} ${Po}`,children:t.toLocaleString()}),jsx("div",{className:me,children:"Network"})]})]})}function G({children:o,content:e,disabled:t,...a}){return jsx(P.Provider,{delayDuration:200,skipDelayDuration:100,children:jsxs(P.Root,{children:[jsx(P.Trigger,{asChild:true,children:jsx("button",{type:"button",disabled:t,...a,children:o})}),!t&&jsx(P.Portal,{children:jsxs(P.Content,{side:"top",sideOffset:6,align:"center",style:{background:"var(--color-primary, #1a1a2e)",color:"white",padding:"6px 12px",borderRadius:"6px",fontSize:"11px",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",zIndex:1e5},children:[e,jsx(P.Arrow,{style:{fill:"var(--color-primary, #1a1a2e)"}})]})})]})})}function Uo({logCount:o,hasUploadEndpoint:e,isUploading:t,getFilteredLogCount:a,onCopyFiltered:s,onDownload:l,onCopy:n,onUpload:d}){let c=o===0;return jsxs("div",{className:eo,children:[jsxs("div",{className:Te,children:[jsx("div",{className:ye,children:"Copy Filtered"}),jsxs("div",{className:Ne,children:[jsxs(G,{content:"Copy only console logs",disabled:c||a("logs")===0,onClick:()=>s("logs"),className:j,"aria-label":"Copy only console logs",children:[jsx(Terminal,{size:18}),"Logs"]}),jsxs(G,{content:"Copy only errors",disabled:c||a("errors")===0,onClick:()=>s("errors"),className:j,"aria-label":"Copy only errors",children:[jsx(AlertCircle,{size:18}),"Errors"]}),jsxs(G,{content:"Copy only network requests",disabled:c||a("network")===0,onClick:()=>s("network"),className:j,"aria-label":"Copy only network requests",children:[jsx(Globe,{size:18}),"Network"]})]})]}),jsxs("div",{className:Te,children:[jsx("div",{className:ye,children:"Export"}),jsxs("div",{className:Ne,children:[jsxs(G,{content:"Download as JSON",disabled:c,onClick:()=>l("json"),className:j,"aria-label":"Download as JSON",children:[jsx(FileJson,{size:18}),"JSON"]}),jsxs(G,{content:"Download as TXT",disabled:c,onClick:()=>l("txt"),className:j,"aria-label":"Download as TXT",children:[jsx(FileText,{size:18}),"TXT"]}),jsxs(G,{content:"Download as JSONL",disabled:c,onClick:()=>l("jsonl"),className:j,"aria-label":"Download as JSONL",children:[jsx(Database,{size:18}),"JSONL"]})]})]}),jsxs("div",{className:Te,children:[jsx("div",{className:ye,children:"Actions"}),jsxs("div",{className:Ne,children:[jsxs(G,{content:"Copy all to clipboard",disabled:c,onClick:n,className:j,"aria-label":"Copy all to clipboard",children:[jsx(Copy,{size:18}),"Copy"]}),jsxs(G,{content:"Download AI-optimized format",disabled:c,onClick:()=>l("ai.txt"),className:j,"aria-label":"Download AI-optimized format",children:[jsx(FileText,{size:18}),"AI-TXT"]}),e?jsxs(G,{content:"Upload logs to server",disabled:t,onClick:d,className:oo,"aria-label":"Upload logs to server",children:[jsx(CloudUpload,{size:18}),t?"Uploading...":"Upload"]}):jsx("div",{})]})]})]})}function co({status:o}){return jsxs("div",{"aria-live":"polite",className:o.type==="success"?to:ro,children:[o.type==="success"?jsx(CheckCircle2,{size:14}):jsx(AlertCircle,{size:14}),jsx("span",{className:zo,children:o.message})]})}function Xo({uploadStatus:o,directoryStatus:e,copyStatus:t}){return jsxs("div",{className:Ao,children:[o&&jsx(co,{status:o}),e&&jsx(co,{status:e}),t&&jsx(co,{status:t})]})}function Jo(){return jsx("div",{className:no,children:jsxs("div",{className:so,children:["Press ",jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function Yo(o,e){switch(e){case "logs":return o.filter(t=>t.type==="CONSOLE");case "errors":return o.filter(t=>t.type==="CONSOLE"&&t.level==="error");case "network":return o.filter(t=>t.type==="FETCH_REQ"||t.type==="FETCH_RES"||t.type==="XHR_REQ"||t.type==="XHR_RES");case "networkErrors":return o.filter(t=>t.type==="FETCH_ERR"||t.type==="XHR_ERR");default:return o}}function uo({user:o,environment:e="production",uploadEndpoint:t,fileNameTemplate:a="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:s=2e3,showInProduction:l=false}){let{isOpen:n,open:d,close:c}=Ro(),{isSettingsOpen:b,openSettings:m,closeSettings:f}=Do(),{copyFormat:v}=Ee(),[E,g]=useState(false),L=useCallback(()=>{g(true);},[]),I=useCallback(()=>{g(false);},[]),{uploadStatus:Y,setUploadStatus:S,directoryStatus:Ae,setDirectoryStatus:re,copyStatus:ze,setCopyStatus:A}=Lo(),N=useRef(null),W=useRef(null),{downloadLogs:y,uploadLogs:M,clearLogs:q,getLogs:x,getMetadata:h,_logCount:$}=ge({fileNameTemplate:a,environment:e,userId:o?.id||o?.email||"guest",includeMetadata:true,uploadEndpoint:t,maxLogs:s,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),z=$,w=h();useEffect(()=>{if(w.errorCount>=5&&t){let u=async()=>{try{await M();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",u),()=>window.removeEventListener("error",u)}},[w.errorCount,t,M]);let ne=useCallback((u,T)=>{if(v==="json")return JSON.stringify({metadata:T,logs:u},null,2);if(v==="ecs.json"){let Q=u.map(ae=>B(ae,T)),se={metadata:ee(T),logs:Q};return JSON.stringify(se,null,2)}else if(v==="ai.txt"){let Q=`# METADATA
service.name=${T.environment||"unknown"}
user.id=${T.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,se=u.map(ae=>{let D=B(ae,T),go=D["@timestamp"],fo=D["log.level"],it=D["event.category"]?.[0]||"unknown",ie=`[${go}] ${fo} ${it}`;return D.message&&(ie+=` | message="${D.message}"`),D.http?.request?.method&&(ie+=` | req.method=${D.http.request.method}`),D.url?.full&&(ie+=` | url=${D.url.full}`),D.http?.response?.status_code&&(ie+=` | res.status=${D.http.response.status_code}`),D.error?.message&&(ie+=` | error="${D.error.message}"`),ie});return Q+se.join(`
`)}return JSON.stringify({metadata:T,logs:u},null,2)},[v]),ot=useCallback(async()=>{S(null);try{let u=await M();u.success?(S({type:"success",message:`Uploaded successfully! ${u.data?JSON.stringify(u.data):""}`}),u.data&&typeof u.data=="object"&&"url"in u.data&&await navigator.clipboard.writeText(String(u.data.url))):S({type:"error",message:`Upload failed: ${u.error}`});}catch(u){S({type:"error",message:`Error: ${u instanceof Error?u.message:"Unknown error"}`});}},[M,S]),tt=useCallback(u=>{let T=y(u);T&&S({type:"success",message:`Downloaded: ${T}`});},[y,S]),rt=useCallback(async()=>{re(null);try{await y("json",void 0,{showPicker:!0})&&re({type:"success",message:"Saved to directory"});}catch{re({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[y,re]),nt=useCallback(async()=>{A(null);try{let u=x(),T=h(),Q=ne(u,T);await navigator.clipboard.writeText(Q),A({type:"success",message:"Copied to clipboard!"});}catch{A({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[x,h,ne,A]),st=useCallback(async u=>{A(null);try{let T=x(),Q=h(),se=Yo(T,u),ae=se.length;if(ae===0){A({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[u]});return}let D=ne(se,Q);await navigator.clipboard.writeText(D),A({type:"success",message:`Copied ${ae} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[u]} to clipboard`});}catch{A({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[x,h,ne,A]),at=useCallback(u=>Yo(x(),u).length,[x]);return l||e==="development"||o?.role==="admin"?jsxs(Fragment,{children:[jsxs(motion.button,{type:"button",onClick:u=>{u.stopPropagation(),n?c():d();},className:Ke,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",whileHover:{scale:1.02},whileTap:{scale:.98},layout:true,children:[jsx(Bug,{size:18}),w.errorCount>0&&jsx(motion.span,{className:Oo,initial:{scale:0},animate:{scale:1}},`err-${w.errorCount}`)]}),jsx(AnimatePresence,{mode:"wait",children:n&&jsx(motion.div,{ref:N,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:Je,initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:20,scale:.95},transition:{duration:.25,ease:[.4,0,.2,1]},children:jsxs(V.Root,{className:"glean-scroll-area",style:{flex:1,overflow:"hidden"},children:[jsxs(V.Viewport,{className:"glean-scroll-viewport",style:{width:"100%",height:"100%"},children:[jsx(qo,{metadata:w,onClose:c,onSaveToDirectory:rt,onClear:()=>{confirm("Clear all logs?")&&q();},ref:W,isSettingsOpen:b,openSettings:m,closeSettings:f,isSessionDetailsOpen:E,openSessionDetails:L,closeSessionDetails:I}),jsx(Bo,{logCount:z,errorCount:w.errorCount,networkErrorCount:w.networkErrorCount}),jsx("div",{style:{padding:"8px 16px",borderBottom:"1px solid var(--color-border, #e2e8f0)"},children:jsx("button",{type:"button",onClick:()=>{console.log("[TEST] Console log test message"),console.error("[TEST] Console error test message"),console.warn("[TEST] Console warn test message"),console.info("[TEST] Console info test message");},style:{background:"var(--color-primary, #6366f1)",color:"white",border:"none",padding:"6px 12px",borderRadius:"4px",cursor:"pointer",fontSize:"11px",fontWeight:500},children:"\u{1F9EA} Test Logs (4x)"})}),jsx(Uo,{logCount:z,hasUploadEndpoint:!!t,isUploading:false,getFilteredLogCount:at,onCopyFiltered:st,onDownload:tt,onCopy:nt,onUpload:ot}),jsx(Xo,{uploadStatus:Y,directoryStatus:Ae,copyStatus:ze}),jsx(Jo,{})]}),jsx(V.Scrollbar,{className:"glean-scrollbar",orientation:"vertical",style:{display:"flex",width:"6px",userSelect:"none",touchAction:"none",padding:"2px",background:"transparent"},children:jsx(V.Thumb,{className:"glean-scrollbar-thumb",style:{flex:1,background:"rgba(0, 0, 0, 0.15)",borderRadius:"3px",transition:"background 0.15s ease"}})})]})})})]}):null}function rr({fileNameTemplate:o="debug_{timestamp}"}){let[e,t]=useState(false),[a,s]=useState(0),{downloadLogs:l,clearLogs:n,getLogCount:d}=ge({fileNameTemplate:o});return useEffect(()=>{s(d());let c=setInterval(()=>{s(d());},100);return ()=>clearInterval(c)},[d]),jsxs(Fragment,{children:[jsx("button",{onClick:()=>t(c=>!c),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsx("span",{children:a})}),e&&jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsx("button",{onClick:()=>l("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsx("button",{onClick:()=>{confirm("Clear all logs?")&&n();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsx("button",{onClick:()=>t(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function ir(o){return useMemo(()=>o.showInProduction||o.environment==="development"||o.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[o.showInProduction,o.environment,o.user])}function lr(){let o=useCallback(t=>{try{typeof window<"u"&&(t?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:t}})));}catch{}},[]),e=useMemo(()=>typeof process<"u"&&true,[]);useEffect(()=>{if(typeof window>"u")return;let t=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>o(true),hide:()=>o(false),toggle:()=>{try{let a=localStorage.getItem("glean-debug-enabled")==="true";o(!a);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=t,()=>{typeof window<"u"&&window.glean===t&&delete window.glean;}},[o,e]);}function et(o){console.log("[GleanDebugger] Mounting with props:",o);let e=ir(o);return console.log("[GleanDebugger] isActivated:",e),lr(),e?(console.log("[GleanDebugger] Rendering DebugPanel"),jsx(uo,{...o})):(console.log("[GleanDebugger] Not activated, returning null"),null)}export{uo as DebugPanel,rr as DebugPanelMinimal,et as GleanDebugger,bo as collectMetadata,_e as filterStackTrace,gr as generateExportFilename,H as generateFilename,mo as generateSessionId,He as getBrowserInfo,ve as sanitizeData,Z as sanitizeFilename,ee as transformMetadataToECS,B as transformToECS,ge as useLogRecorder};