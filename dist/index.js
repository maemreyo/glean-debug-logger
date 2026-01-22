'use strict';var react=require('react'),framerMotion=require('framer-motion'),G=require('@radix-ui/react-scroll-area'),goober=require('goober'),reactDom=require('react-dom'),K=require('@radix-ui/react-dropdown-menu'),lucideReact=require('lucide-react'),jsxRuntime=require('react/jsx-runtime'),F=require('@radix-ui/react-tooltip');function _interopNamespace(e){if(e&&e.__esModule)return e;var n=Object.create(null);if(e){Object.keys(e).forEach(function(k){if(k!=='default'){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})}n.default=e;return Object.freeze(n)}var G__namespace=/*#__PURE__*/_interopNamespace(G);var K__namespace=/*#__PURE__*/_interopNamespace(K);var F__namespace=/*#__PURE__*/_interopNamespace(F);// @ts-nocheck
var Vo=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function ye(o,e={}){let r=e.keys||Vo;if(!o||typeof o!="object")return o;let s=Array.isArray(o)?[...o]:{...o},i=a=>{if(!a||typeof a!="object")return a;for(let n in a)if(Object.prototype.hasOwnProperty.call(a,n)){let c=n.toLowerCase();r.some(f=>c.includes(f.toLowerCase()))?a[n]="***REDACTED***":a[n]!==null&&typeof a[n]=="object"&&(a[n]=i(a[n]));}return a};return i(s)}function W(o){return o.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function Te(){if(typeof navigator>"u")return "unknown";let o=navigator.userAgent;return o.includes("Edg")?"edge":o.includes("Chrome")?"chrome":o.includes("Firefox")?"firefox":o.includes("Safari")?"safari":"unknown"}function oo(o,e,r,s){if(typeof window>"u")return {sessionId:o,environment:e,userId:r,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:s,errorCount:0,networkErrorCount:0};let i=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",a=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:o,environment:e,userId:r,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:Te(),platform:navigator.platform,language:navigator.language,screenResolution:i,viewport:a,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:s,errorCount:0,networkErrorCount:0}}function to(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function A(o="json",e={},r={}){let{fileNameTemplate:s="{env}_{userId}_{sessionId}_{timestamp}",environment:i="development",userId:a="anonymous",sessionId:n="unknown"}=r,c=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],l=new Date().toISOString().split("T")[0],f=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),b=r.browser||Te(),m=r.platform||(typeof navigator<"u"?navigator.platform:"unknown"),R=(r.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",y=String(r.errorCount??e.errorCount??0),T=String(r.logCount??e.logCount??0),v=s.replace("{env}",W(i)).replace("{userId}",W(a??"anonymous")).replace("{sessionId}",W(n??"unknown")).replace("{timestamp}",c).replace("{date}",l).replace("{time}",f).replace(/\{errorCount\}/g,y).replace(/\{logCount\}/g,T).replace("{browser}",W(b)).replace("{platform}",W(m)).replace("{url}",W(R));for(let[P,w]of Object.entries(e))v=v.replace(`{${P}}`,String(w));return `${v}.${o}`}function Vt(o,e="json"){let r=o.url.split("?")[0]||"unknown";return A(e,{},{environment:o.environment,userId:o.userId,sessionId:o.sessionId,browser:o.browser,platform:o.platform,url:r,errorCount:o.errorCount,logCount:o.logCount})}var Yo={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function ro(o){let e=parseFloat(o);return isNaN(e)?0:Math.round(e*1e6)}function Qo(o){return Yo[o.toLowerCase()]||"info"}function De(o){return o.filter(e=>!e.ignored).slice(0,20)}function V(o){return {service:{environment:o.environment},user:o.userId?{id:o.userId}:void 0,host:{name:o.browser,type:o.platform}}}function j(o,e){let r={"@timestamp":o.time,event:{original:o,category:[]}},s=V(e);switch(Object.assign(r,s),o.type){case "CONSOLE":{r.log={level:Qo(o.level)},r.message=o.data,r.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{r.http={request:{method:o.method}},r.url={full:o.url},r.event.category=["network","web"],r.event.action="request",r.event.id=o.id;break}case "FETCH_RES":case "XHR_RES":{r.http={response:{status_code:o.status}},r.url={full:o.url},r.event.duration=ro(o.duration),r.event.category=["network","web"],r.event.action="response",r.event.id=o.id;break}case "FETCH_ERR":case "XHR_ERR":{r.error={message:o.error},r.url={full:o.url},r.event.duration=ro(o.duration),r.event.category=["network","web"],r.event.action="error",r.event.id=o.id;let i=o;if(typeof i.body=="object"&&i.body!==null){let a=i.body;if(Array.isArray(a.frames)){let n=De(a.frames);r.error.stack_trace=n.map(c=>`  at ${c.functionName||"?"} (${c.filename||"?"}:${c.lineNumber||0}:${c.columnNumber||0})`).join(`
`);}}break}default:{r.message=JSON.stringify(o);break}}return r}var we=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let r=this.originalConsole[e];console[e]=(...s)=>{this.callbacks.forEach(i=>{i(e,s);}),r(...s);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var xe=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(r=>new RegExp(r));}attach(){window.fetch=async(...e)=>{let[r,s]=e,i=r.toString();if(this.excludeUrls.some(n=>n.test(i)))return this.originalFetch(...e);let a=Date.now();this.onRequest.forEach(n=>n(i,s||{}));try{let n=await this.originalFetch(...e),c=Date.now()-a;return this.onResponse.forEach(l=>l(i,n.status,c)),n}catch(n){throw this.onError.forEach(c=>c(i,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var he=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(r=>new RegExp(r)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(r,s,i,a,n){let c=typeof s=="string"?s:s.href;if(e.requestTracker.set(this,{method:r,url:c,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(f=>f.test(c)))return e.originalOpen.call(this,r,s,i??true,a,n);let l=e.requestTracker.get(this);for(let f of e.onRequest)f(l);return e.originalOpen.call(this,r,s,i??true,a,n)},this.originalXHR.prototype.send=function(r){let s=e.requestTracker.get(this);if(s){s.body=r;let i=this.onload,a=this.onerror;this.onload=function(n){let c=Date.now()-s.startTime;for(let l of e.onResponse)l(s,this.status,c);i&&i.call(this,n);},this.onerror=function(n){for(let c of e.onError)c(s,new Error("XHR Error"));a&&a.call(this,n);};}return e.originalSend.call(this,r)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var Ne={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function le(){return Math.random().toString(36).substring(7)}function Oe(o,e){return ye(o,{keys:e})}function no(o,e,r,s){return {addLog:n=>{o.logsRef.current.push(n),o.logsRef.current.length>e.maxLogs&&o.logsRef.current.shift(),s(o.logsRef.current.length),n.type==="CONSOLE"?n.level==="ERROR"?o.errorCountRef.current++:o.errorCountRef.current=0:n.type==="FETCH_ERR"||n.type==="XHR_ERR"?o.errorCountRef.current++:o.errorCountRef.current=0;let c=e.uploadOnErrorCount??5;if(o.errorCountRef.current>=c&&e.uploadEndpoint){let l={metadata:{...o.metadataRef.current,logCount:o.logsRef.current.length},logs:o.logsRef.current,fileName:A("json",{},{fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.environment,userId:e.userId,sessionId:null})};fetch(e.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:r(l)}).catch(()=>{}),o.errorCountRef.current=0;}if(e.enablePersistence&&typeof window<"u")try{localStorage.setItem(e.persistenceKey,r(o.logsRef.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},updateMetadata:()=>{let n=o.logsRef.current.filter(l=>l.type==="CONSOLE").reduce((l,f)=>f.level==="ERROR"?l+1:l,0),c=o.logsRef.current.filter(l=>l.type==="FETCH_ERR"||l.type==="XHR_ERR").length;o.metadataRef.current={...o.metadataRef.current,logCount:o.logsRef.current.length,errorCount:n,networkErrorCount:c};}}}function so(){return o=>{let e=new Set;return JSON.stringify(o,(r,s)=>{if(typeof s=="object"&&s!==null){if(e.has(s))return "[Circular]";e.add(s);}return s})}}function ao(o){return !o||o.length===0?"":o.map(e=>Zo(e)).join("")}function Zo(o){return JSON.stringify(o)+`
`}var Y=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,r,s="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(r,{create:!0})).createWritable();await n.write(e),await n.close();}catch(i){if(i.name==="AbortError")return;throw i}}static download(e,r,s="application/json"){let i=new Blob([e],{type:s}),a=URL.createObjectURL(i),n=document.createElement("a");n.href=a,n.download=r,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(a);}static async downloadWithFallback(e,r,s="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,r,s);return}catch(i){if(i.name==="AbortError")return}this.download(e,r,s);}};Y.supported=null;function io(o,e,r,s){return (i,a)=>{if(typeof window>"u")return null;s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},c=a||A(i,{},n),l,f;if(i==="json"){let b=e.current?{metadata:e.current,logs:o.current}:o.current;l=r(b),f="application/json";}else if(i==="jsonl"){let b=o.current.map(m=>j(m,e.current));l=ao(b),f="application/x-ndjson",c=a||A("jsonl",{},n);}else if(i==="ecs.json"){let b={metadata:V(e.current),logs:o.current.map(m=>j(m,e.current))};l=JSON.stringify(b,null,2),f="application/json",c=a||A("ecs-json",{},n);}else if(i==="ai.txt"){let b=e.current,m=`# METADATA
service.name=${b.environment||"unknown"}
user.id=${b.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,k=o.current.map(R=>{let y=j(R,b),T=y["@timestamp"],v=y.log?.level||"info",P=y.event?.category?.[0]||"unknown",w=`[${T}] ${v} ${P}`;return y.message&&(w+=` | message="${y.message}"`),y.http?.request?.method&&(w+=` | req.method=${y.http.request.method}`),y.url?.full&&(w+=` | url=${y.url.full}`),y.http?.response?.status_code&&(w+=` | res.status=${y.http.response.status_code}`),y.error?.message&&(w+=` | error="${y.error.message}"`),w});l=m+k.join(`
`),f="text/plain",c=a||A("ai-txt",{},n);}else l=(e.current?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${r(e.current)}
${"=".repeat(80)}

`:"")+o.current.map(m=>`[${m.time}] ${m.type}
${r(m)}
${"=".repeat(80)}`).join(`
`),f="text/plain";return Y.downloadWithFallback(l,c,f),c}}function lo(o,e,r,s){return async i=>{let a=i;if(!a)return {success:false,error:"No endpoint configured"};try{s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},c={metadata:e.current,logs:o.current,fileName:A("json",{},n)},l=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:r(c)});if(!l.ok)throw new Error(`Upload failed: ${l.status}`);return {success:!0,data:await l.json()}}catch(n){let c=n instanceof Error?n.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",n),{success:false,error:c}}}}function ce(o={}){let e={...Ne,...o},r=react.useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});react.useEffect(()=>{r.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let s=react.useRef([]),i=react.useRef(e.sessionId||to()),a=react.useRef(oo(i.current,e.environment,e.userId,0)),[n,c]=react.useState(0),l=react.useRef(0),f=react.useRef(false),b=react.useMemo(()=>so(),[]),m=react.useMemo(()=>new we,[]),k=react.useMemo(()=>new xe({excludeUrls:e.excludeUrls}),[e.excludeUrls]),R=react.useMemo(()=>new he({excludeUrls:e.excludeUrls}),[e.excludeUrls]),y=react.useMemo(()=>no({logsRef:s,metadataRef:a,errorCountRef:l},{maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount??5,sanitizeKeys:e.sanitizeKeys,environment:e.environment,userId:e.userId},b,c),[e,b,c]),T=y.addLog,v=y.updateMetadata,P=react.useMemo(()=>io(s,a,b,v),[b,v]),w=react.useMemo(()=>lo(s,a,b,v),[b,v]);react.useEffect(()=>{if(typeof window>"u"||f.current)return;if(f.current=true,e.enablePersistence)try{let p=localStorage.getItem(e.persistenceKey);p&&(s.current=JSON.parse(p),c(s.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let X=[];if(e.captureConsole&&(m.attach(),m.onLog((p,S)=>{let x=S.map(N=>{if(typeof N=="object")try{return b(N)}catch{return String(N)}return String(N)}).join(" ");T({type:"CONSOLE",level:p.toUpperCase(),time:new Date().toISOString(),data:x.substring(0,5e3)});}),X.push(()=>m.detach())),e.captureFetch){let p=new Map;k.onFetchRequest((S,x)=>{let N=le(),O=null;if(x?.body)try{O=typeof x.body=="string"?JSON.parse(x.body):x.body,O=ye(O,{keys:e.sanitizeKeys});}catch{O=String(x.body).substring(0,1e3);}p.set(N,{url:S,method:x?.method||"GET",headers:Oe(x?.headers,e.sanitizeKeys),body:O}),T({type:"FETCH_REQ",id:N,url:S,method:x?.method||"GET",headers:Oe(x?.headers,e.sanitizeKeys),body:O,time:new Date().toISOString()});}),k.onFetchResponse((S,x,N)=>{for(let[O,B]of p.entries())if(B.url===S){p.delete(O),T({type:"FETCH_RES",id:O,url:S,status:x,statusText:"",duration:`${N}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),k.onFetchError((S,x)=>{for(let[N,O]of p.entries())if(O.url===S){p.delete(N),T({type:"FETCH_ERR",id:N,url:S,error:x.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),k.attach(),X.push(()=>k.detach());}return e.captureXHR&&(R.onXHRRequest(p=>{T({type:"XHR_REQ",id:le(),url:p.url,method:p.method,headers:p.headers,body:p.body,time:new Date().toISOString()});}),R.onXHRResponse((p,S,x)=>{T({type:"XHR_RES",id:le(),url:p.url,status:S,statusText:"",duration:`${x}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),R.onXHRError((p,S)=>{T({type:"XHR_ERR",id:le(),url:p.url,error:S.message,duration:"[unknown]ms",time:new Date().toISOString()});}),R.attach(),X.push(()=>R.detach())),()=>{X.forEach(p=>p()),f.current=false;}},[e,T,b,m,k,R]);let J=react.useCallback(()=>{if(s.current=[],c(0),l.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),ie=react.useCallback(()=>[...s.current],[]),h=react.useCallback(()=>n,[n]),I=react.useCallback(()=>(v(),{...a.current}),[v]);return {downloadLogs:P,uploadLogs:w,clearLogs:J,getLogs:ie,getLogCount:h,getMetadata:I,sessionId:i.current}}function fo(){let[o,e]=react.useState(false),[r,s]=react.useState(false),i=react.useRef(o);i.current=o;let a=react.useRef(null);react.useEffect(()=>{s(Y.isSupported());},[]);let n=react.useCallback(()=>{e(f=>!f);},[]),c=react.useCallback(()=>{e(true);},[]),l=react.useCallback(()=>{e(false);},[]);return react.useEffect(()=>{let f=m=>{m.ctrlKey&&m.shiftKey&&m.key==="D"&&(m.preventDefault(),n()),m.key==="Escape"&&i.current&&(m.preventDefault(),l());};document.addEventListener("keydown",f);let b=m=>{typeof m.detail?.visible=="boolean"&&(a.current&&clearTimeout(a.current),a.current=setTimeout(()=>{e(m.detail.visible);},10));};return window.addEventListener("glean-debug-toggle",b),()=>{document.removeEventListener("keydown",f),window.removeEventListener("glean-debug-toggle",b);}},[n,l]),{isOpen:o,toggle:n,open:c,close:l,supportsDirectoryPicker:r}}var mo="debug-panel-copy-format",rt=["json","ecs.json","ai.txt"];function Se(){let[o,e]=react.useState(()=>{if(typeof window<"u"){let r=localStorage.getItem(mo);if(r&&rt.includes(r))return r}return "ecs.json"});return react.useEffect(()=>{localStorage.setItem(mo,o);},[o]),{copyFormat:o,setCopyFormat:e}}function bo(){let[o,e]=react.useState(null),[r,s]=react.useState(null),[i,a]=react.useState(null),[n,c]=react.useState(false);return react.useEffect(()=>{if(o){let l=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(l)}},[o]),react.useEffect(()=>{if(r){let l=setTimeout(()=>{s(null);},3e3);return ()=>clearTimeout(l)}},[r]),react.useEffect(()=>{if(i){let l=setTimeout(()=>{a(null);},3e3);return ()=>clearTimeout(l)}},[i]),{uploadStatus:o,setUploadStatus:e,directoryStatus:r,setDirectoryStatus:s,copyStatus:i,setCopyStatus:a,showSettings:n,setShowSettings:c}}function yo(){let[o,e]=react.useState(false),r=react.useCallback(()=>{e(true);},[]),s=react.useCallback(()=>{e(false);},[]),i=react.useCallback(()=>{e(a=>!a);},[]);return {isSettingsOpen:o,openSettings:r,closeSettings:s,toggleSettings:i}}var t={glassBg:"rgba(255, 255, 255, 0.75)",glassBorder:"rgba(255, 255, 255, 0.4)",glassShadow:"0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",colors:{primary:"#1a1a2e",secondary:"#4a5568",muted:"#a0aec0",border:"rgba(0, 0, 0, 0.06)",success:"#059669",successBg:"rgba(5, 150, 105, 0.08)",successBorder:"rgba(5, 150, 105, 0.2)",error:"#dc2626",errorBg:"rgba(220, 38, 38, 0.06)",errorBorder:"rgba(220, 38, 38, 0.15)",warning:"#d97706",accent:"#0ea5e9",accentBg:"rgba(14, 165, 233, 0.08)",accentBorder:"rgba(14, 165, 233, 0.2)"},fonts:{display:'-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',mono:'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'},space:{xs:"4px",sm:"8px",md:"12px",lg:"16px"},radius:{sm:"6px",md:"10px",lg:"16px",full:"9999px"},transitions:{fast:"0.15s ease",normal:"0.25s cubic-bezier(0.4, 0, 0.2, 1)"}},Pe=goober.css`
  position: fixed;
  bottom: ${t.space.lg};
  right: ${t.space.lg};
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${t.colors.primary};
  color: #ffffff;
  border: none;
  border-radius: ${t.radius.full};
  cursor: pointer;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all ${t.transitions.normal};

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
`,wo=goober.css`
  position: absolute;
  top: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  background: ${t.colors.error};
  border: 2px solid ${t.colors.primary};
  border-radius: ${t.radius.full};
  box-shadow: 0 1px 4px rgba(220, 38, 38, 0.4);
`;goober.css`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${t.radius.full};
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(4px);
`;goober.css`
  background: ${t.colors.error};
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${t.radius.full};
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
`;var He=goober.css`
  position: fixed;
  bottom: 70px;
  right: ${t.space.lg};
  z-index: 9999;
  width: 380px;
  max-height: 520px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background: ${t.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: ${t.radius.lg};
  border: 1px solid ${t.glassBorder};
  box-shadow: ${t.glassShadow};
  font-family: ${t.fonts.display};
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
`,ze=goober.css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${t.space.lg};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
  border-bottom: 1px solid ${t.colors.border};
`,xo=goober.css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`,_e=goober.css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${t.colors.primary};
  letter-spacing: -0.01em;
`,st=goober.css`
  margin: 0;
  font-size: 11px;
  color: ${t.colors.muted};
  font-family: ${t.fonts.mono};
  font-weight: 500;
`,Ce=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: ${t.radius.sm};
  color: ${t.colors.muted};
  cursor: pointer;
  transition: all ${t.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${t.colors.secondary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
`,Ae=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: ${t.radius.sm};
  color: ${t.colors.muted};
  cursor: pointer;
  transition: all ${t.transitions.fast};

  &:hover {
    background: ${t.colors.errorBg};
    color: ${t.colors.error};
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
`,Be=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: ${t.radius.sm};
  color: ${t.colors.muted};
  cursor: pointer;
  transition: all ${t.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${t.colors.accent};
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
`,je=goober.css`
  position: fixed;
  top: auto;
  left: auto;
  margin-top: ${t.space.xs};
  min-width: 180px;
  max-width: 220px;
  padding: ${t.space.sm} ${t.space.md};
  background: ${t.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${t.glassBorder};
  border-radius: ${t.radius.md};
  box-shadow: ${t.glassShadow};
  z-index: 10000;
  font-size: 11px;
  line-height: 1.6;
  pointer-events: none;
`,ne=goober.css`
  display: flex;
  justify-content: space-between;
  gap: ${t.space.md};
  padding: ${t.space.xs} 0;
  border-bottom: 1px solid ${t.colors.border};

  &:last-child {
    border-bottom: none;
  }
`,Z=goober.css`
  color: ${t.colors.muted};
  font-weight: 500;
`,ee=goober.css`
  color: ${t.colors.primary};
  font-weight: 500;
  text-align: right;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,Ue=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: ${t.colors.border};
`,de=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${t.space.lg};
  background: rgba(255, 255, 255, 0.6);
  gap: ${t.space.xs};
`,ue=goober.css`
  font-size: 28px;
  font-weight: 700;
  color: ${t.colors.primary};
  line-height: 1;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`,pe=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${t.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`,ho=goober.css`
  color: ${t.colors.error};
`,vo=goober.css`
  color: ${t.colors.warning};
`,at=goober.css`
  padding: ${t.space.md} ${t.space.lg};
  background: rgba(255, 255, 255, 0.4);
  border-bottom: 1px solid ${t.colors.border};
`,it=goober.css`
  display: flex;
  align-items: center;
  gap: ${t.space.sm};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: ${t.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  list-style: none;
  padding: ${t.space.sm} 0;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    color: ${t.colors.primary};
  }
`,lt=goober.css`
  margin-top: ${t.space.md};
  padding: ${t.space.md};
  background: rgba(255, 255, 255, 0.5);
  border-radius: ${t.radius.md};
  font-size: 11px;
  color: ${t.colors.secondary};
  line-height: 1.7;

  & > div {
    display: flex;
    gap: ${t.space.sm};
    margin-bottom: ${t.space.xs};
  }

  strong {
    color: ${t.colors.primary};
    font-weight: 600;
    min-width: 70px;
  }
`,qe=goober.css`
  padding: ${t.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${t.space.lg};
  background: rgba(255, 255, 255, 0.3);
`,Ee=goober.css`
  display: flex;
  flex-direction: column;
  gap: ${t.space.sm};
`,ge=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${t.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;goober.css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${t.space.sm};
`;var $e=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${t.space.sm};
`,fe=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${t.space.xs};
  padding: ${t.space.sm} ${t.space.md};
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid ${t.colors.border};
  border-radius: ${t.radius.md};
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  color: ${t.colors.secondary};
  transition: all ${t.transitions.fast};

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
    border-color: ${t.colors.border};
  }
`;goober.css`
  ${fe}
`;var ct=goober.css`
  ${fe}
  background: ${t.colors.accentBg};
  border-color: ${t.colors.accentBorder};
  color: ${t.colors.accent};

  &:hover:not(:disabled) {
    background: ${t.colors.accent};
    color: #ffffff;
    border-color: ${t.colors.accent};
  }
`,Xe=goober.css`
  ${fe}
  background: ${t.colors.successBg};
  border-color: ${t.colors.successBorder};
  color: ${t.colors.success};

  &:hover:not(:disabled) {
    background: ${t.colors.success};
    color: #ffffff;
    border-color: ${t.colors.success};
  }
`,dt=goober.css`
  ${fe}
  background: ${t.colors.errorBg};
  border-color: ${t.colors.errorBorder};
  color: ${t.colors.error};

  &:hover:not(:disabled) {
    background: ${t.colors.error};
    color: #ffffff;
    border-color: ${t.colors.error};
  }
`,U=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${t.space.md} ${t.space.sm};
  min-height: 52px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid ${t.colors.border};
  border-radius: ${t.radius.md};
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${t.colors.secondary};
  line-height: 1.2;
  transition: all ${t.transitions.fast};

  & svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    transition: transform ${t.transitions.fast};
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
    border-color: ${t.colors.border};
  }
`,ut=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${t.space.md} ${t.space.sm};
  min-height: 52px;
  background: ${t.colors.errorBg};
  border: 1px solid ${t.colors.errorBorder};
  border-radius: ${t.radius.md};
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${t.colors.error};
  line-height: 1.2;
  transition: all ${t.transitions.fast};

  & svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    background: ${t.colors.error};
    color: #ffffff;
    border-color: ${t.colors.error};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,So=goober.css`
  display: flex;
  flex-direction: column;
  gap: ${t.space.xs};
  padding: 0 ${t.space.lg} ${t.space.sm};
`,Ke=goober.css`
  display: flex;
  align-items: center;
  gap: ${t.space.sm};
  padding: ${t.space.sm} ${t.space.md};
  background: ${t.colors.successBg};
  border: 1px solid ${t.colors.successBorder};
  border-radius: ${t.radius.md};
  font-size: 11px;
  color: ${t.colors.success};
  font-weight: 500;

  & svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`,Ge=goober.css`
  display: flex;
  align-items: center;
  gap: ${t.space.sm};
  padding: ${t.space.sm} ${t.space.md};
  background: ${t.colors.errorBg};
  border: 1px solid ${t.colors.errorBorder};
  border-radius: ${t.radius.md};
  font-size: 11px;
  color: ${t.colors.error};
  font-weight: 500;

  & svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`,ko=goober.css`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,Je=goober.css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${t.space.md};
  background: rgba(255, 255, 255, 0.5);
  border-top: 1px solid ${t.colors.border};

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: ${t.radius.sm};
    font-family: ${t.fonts.mono};
    font-size: 10px;
    color: ${t.colors.muted};
    border: 1px solid ${t.colors.border};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }
`,We=goober.css`
  font-size: 11px;
  color: ${t.colors.muted};
`,pt=goober.css`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${t.space.sm};
  min-width: 160px;
  background: ${t.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${t.glassBorder};
  border-radius: ${t.radius.md};
  box-shadow: ${t.glassShadow};
  z-index: 10000;
  overflow: hidden;
`,gt=goober.css`
  padding: ${t.space.sm} ${t.space.md};
  font-size: 10px;
  font-weight: 600;
  color: ${t.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid ${t.colors.border};
`,Co=goober.css`
  display: flex;
  align-items: center;
  gap: ${t.space.sm};
  width: 100%;
  padding: ${t.space.sm} ${t.space.md};
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: ${t.colors.secondary};
  transition: all ${t.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`,ft=goober.css`
  ${Co}
  background: rgba(0, 0, 0, 0.04);
  color: ${t.colors.primary};
`;goober.css`
  @media (prefers-color-scheme: dark) {
    :root {
      --glass-bg: rgba(30, 30, 46, 0.85);
      --glass-border: rgba(255, 255, 255, 0.08);
    }

    ${He} {
      background: rgba(30, 30, 46, 0.9);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    ${ze} {
      background: linear-gradient(135deg, rgba(40, 40, 60, 0.8) 0%, rgba(30, 30, 46, 0.6) 100%);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${_e} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${st} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Ce} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
    }

    ${Ae} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(220, 38, 38, 0.2);
        color: #f87171;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
      }
    }

    ${Be} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(14, 165, 233, 0.15);
        color: #38bdf8;
        box-shadow: 0 2px 8px rgba(14, 165, 233, 0.25);
      }
    }

    ${je} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${Z} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${ee} {
      color: rgba(255, 255, 255, 0.9);
    }

    ${Ue} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${de} {
      background: rgba(40, 40, 60, 0.5);
    }

    ${ue} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${pe} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${at} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${it} {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${lt} {
      background: rgba(40, 40, 60, 0.5);
      color: rgba(255, 255, 255, 0.6);

      strong {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    ${qe} {
      background: rgba(40, 40, 60, 0.3);
    }

    ${ge} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${fe} {
      background: rgba(50, 50, 70, 0.8);
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);

      &:hover:not(:disabled) {
        background: rgba(60, 60, 85, 0.9);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }

    ${ct} {
      background: rgba(14, 165, 233, 0.15);
      border-color: rgba(14, 165, 233, 0.25);
      color: #38bdf8;

      &:hover:not(:disabled) {
        background: #0ea5e9;
        color: #ffffff;
        border-color: #0ea5e9;
      }
    }

    ${Xe} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;

      &:hover:not(:disabled) {
        background: #059669;
        color: #ffffff;
        border-color: #059669;
      }
    }

    ${dt},
    ${ut} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;

      &:hover:not(:disabled) {
        background: #dc2626;
        color: #ffffff;
        border-color: #dc2626;
      }
    }

    ${Ke} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;
    }

    ${Ge} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;
    }

    ${Je} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);

      kbd {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.5);
      }
    }

    ${We} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Pe} {
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

    ${pt} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${gt} {
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Co} {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    ${ft} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }
  }
`;function Ct({copyFormat:o,setCopyFormat:e,onSaveToDirectory:r,onCloseDropdown:s}){let i=["json","ecs.json","ai.txt"],a={json:jsxRuntime.jsx(lucideReact.FileJson,{size:14}),"ecs.json":jsxRuntime.jsx(lucideReact.FileText,{size:14}),"ai.txt":jsxRuntime.jsx(lucideReact.FileText,{size:14})};return jsxRuntime.jsxs("div",{style:{minWidth:180,background:"var(--glass-bg, rgba(255,255,255,0.95))",backdropFilter:"blur(20px)",borderRadius:10,padding:8,boxShadow:"0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",animation:"gleanDropdownIn 0.15s ease-out"},children:[jsxRuntime.jsx("div",{style:{padding:"8px 10px 6px",fontSize:10,fontWeight:600,color:"var(--muted, #a0aec0)",textTransform:"uppercase",letterSpacing:"0.08em"},children:"Copy Format"}),jsxRuntime.jsx("div",{style:{display:"flex",flexDirection:"column",gap:2},children:i.map(n=>jsxRuntime.jsxs("button",{type:"button",onClick:()=>{e(n),s();},style:{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",textAlign:"left",background:o===n?"var(--primary-bg, rgba(14,165,233,0.08))":"transparent",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,color:o===n?"var(--accent, #0ea5e9)":"var(--secondary, #4a5568)",transition:"all 0.12s ease"},children:[a[n],jsxRuntime.jsxs("span",{style:{flex:1},children:[n==="json"&&"JSON",n==="ecs.json"&&"ECS (AI)",n==="ai.txt"&&"AI-TXT"]}),o===n&&jsxRuntime.jsx("span",{children:"\u2713"})]},n))}),jsxRuntime.jsx("div",{style:{borderTop:"1px solid var(--border-color, rgba(0,0,0,0.06))",margin:"8px 0"}}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>{r(),s();},style:{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",textAlign:"left",background:"transparent",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,color:"var(--secondary, #4a5568)",transition:"all 0.12s ease"},children:[jsxRuntime.jsx(lucideReact.Save,{size:14}),jsxRuntime.jsx("span",{children:"Save to Folder"})]})]})}var To=react.forwardRef(function({sessionId:e,metadata:r,onClose:s,onSaveToDirectory:i,onClear:a,isSettingsOpen:n,openSettings:c,closeSettings:l},f){let{copyFormat:b,setCopyFormat:m}=Se(),[k,R]=react.useState(false),[y,T]=react.useState({top:0,left:0}),v=react.useRef(null),P=react.useRef(null),w=react.useCallback(()=>{if(P.current){let h=P.current.getBoundingClientRect(),I=200,X=140,p=h.right-I+20,S=h.top-X-8;p+I>window.innerWidth-10&&(p=window.innerWidth-I-10),p<10&&(p=10),S<10&&(S=h.bottom+8),T({top:S,left:p});}},[]);react.useEffect(()=>{let h=I=>{v.current&&!v.current.contains(I.target)&&R(false);};return document.addEventListener("mousedown",h),()=>document.removeEventListener("mousedown",h)},[]),react.useEffect(()=>{if(k)return w(),window.addEventListener("resize",w),window.addEventListener("scroll",w,true),()=>{window.removeEventListener("resize",w),window.removeEventListener("scroll",w,true);}},[k,w]);let J=e.length>16?`${e.substring(0,8)}...${e.substring(e.length-6)}`:e,ie=k?jsxRuntime.jsxs("div",{ref:v,className:je,style:{top:y.top,left:y.left},children:[jsxRuntime.jsxs("div",{className:ne,children:[jsxRuntime.jsx("span",{className:Z,children:"User"}),jsxRuntime.jsx("span",{className:ee,children:r.userId||"Anonymous"})]}),jsxRuntime.jsxs("div",{className:ne,children:[jsxRuntime.jsx("span",{className:Z,children:"Browser"}),jsxRuntime.jsx("span",{className:ee,children:r.browser})]}),jsxRuntime.jsxs("div",{className:ne,children:[jsxRuntime.jsx("span",{className:Z,children:"OS"}),jsxRuntime.jsx("span",{className:ee,children:r.platform})]}),jsxRuntime.jsxs("div",{className:ne,children:[jsxRuntime.jsx("span",{className:Z,children:"Screen"}),jsxRuntime.jsx("span",{className:ee,children:r.screenResolution})]}),jsxRuntime.jsxs("div",{className:ne,children:[jsxRuntime.jsx("span",{className:Z,children:"TZ"}),jsxRuntime.jsx("span",{className:ee,children:r.timezone})]})]}):null;return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs("div",{className:ze,children:[jsxRuntime.jsxs("div",{className:xo,children:[jsxRuntime.jsx("h3",{className:_e,children:"Debug"}),jsxRuntime.jsxs("div",{style:{position:"relative",display:"inline-flex",alignItems:"center",gap:"6px"},children:[jsxRuntime.jsx("span",{className:"font-mono text-[10px]",style:{color:"var(--muted, #a0aec0)"},children:J}),jsxRuntime.jsx("button",{ref:P,type:"button",onMouseEnter:()=>{R(true),w();},onMouseLeave:()=>R(false),onClick:()=>{R(!k),w();},className:Ce,"aria-label":"Session info",style:{width:"18px",height:"18px"},children:jsxRuntime.jsx(lucideReact.Info,{size:12})})]})]}),jsxRuntime.jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsxRuntime.jsx("button",{type:"button",onClick:a,className:Ae,"aria-label":"Clear all logs",title:"Clear logs",children:jsxRuntime.jsx(lucideReact.Trash2,{size:16})}),jsxRuntime.jsxs(K__namespace.Root,{open:n,onOpenChange:h=>{console.log("[DebugPanelHeader] Dropdown onOpenChange:",h),h||(console.log("[DebugPanelHeader] Dispatching dropdown-close event"),window.dispatchEvent(new CustomEvent("glean-dropdown-close",{detail:{timestamp:Date.now()}}))),h?c():l();},children:[jsxRuntime.jsx(K__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",className:Be,"aria-label":"Actions and settings",title:"Actions and settings","data-settings-trigger":"true",children:jsxRuntime.jsx(lucideReact.Settings,{size:16})})}),jsxRuntime.jsx(K__namespace.Portal,{children:jsxRuntime.jsx(K__namespace.Content,{"data-settings-dropdown":"true",sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:h=>{console.log("[DebugPanelHeader] Dropdown onPointerDownOutside:",h.target),h.target.closest("#debug-panel")&&(console.log("[DebugPanelHeader] Click inside debug panel - preventing dropdown close"),h.preventDefault());},onEscapeKeyDown:h=>{console.log("[DebugPanelHeader] Dropdown onEscapeKeyDown");},children:jsxRuntime.jsx(Ct,{copyFormat:b,setCopyFormat:m,onSaveToDirectory:i,onCloseDropdown:()=>l()})})})]}),jsxRuntime.jsx("button",{ref:f,type:"button",onClick:s,className:Ce,"aria-label":"Close debug panel",children:jsxRuntime.jsx(lucideReact.X,{size:18})})]})]}),typeof document<"u"&&reactDom.createPortal(ie,document.body)]})});function Do({logCount:o,errorCount:e,networkErrorCount:r}){return jsxRuntime.jsxs("div",{className:Ue,children:[jsxRuntime.jsxs("div",{className:de,children:[jsxRuntime.jsx("div",{className:ue,children:o.toLocaleString()}),jsxRuntime.jsx("div",{className:pe,children:"Logs"})]}),jsxRuntime.jsxs("div",{className:de,children:[jsxRuntime.jsx("div",{className:`${ue} ${ho}`,children:e.toLocaleString()}),jsxRuntime.jsx("div",{className:pe,children:"Errors"})]}),jsxRuntime.jsxs("div",{className:de,children:[jsxRuntime.jsx("div",{className:`${ue} ${vo}`,children:r.toLocaleString()}),jsxRuntime.jsx("div",{className:pe,children:"Network"})]})]})}function q({children:o,content:e,disabled:r,...s}){return jsxRuntime.jsx(F__namespace.Provider,{delayDuration:200,skipDelayDuration:100,children:jsxRuntime.jsxs(F__namespace.Root,{children:[jsxRuntime.jsx(F__namespace.Trigger,{asChild:true,children:jsxRuntime.jsx("button",{type:"button",disabled:r,...s,children:o})}),!r&&jsxRuntime.jsx(F__namespace.Portal,{children:jsxRuntime.jsxs(F__namespace.Content,{side:"top",sideOffset:6,align:"center",style:{background:"var(--color-primary, #1a1a2e)",color:"white",padding:"6px 12px",borderRadius:"6px",fontSize:"11px",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",zIndex:1e5},children:[e,jsxRuntime.jsx(F__namespace.Arrow,{style:{fill:"var(--color-primary, #1a1a2e)"}})]})})]})})}function Oo({logCount:o,hasUploadEndpoint:e,isUploading:r,getFilteredLogCount:s,onCopyFiltered:i,onDownload:a,onCopy:n,onUpload:c}){let l=o===0;return jsxRuntime.jsxs("div",{className:qe,children:[jsxRuntime.jsxs("div",{className:Ee,children:[jsxRuntime.jsx("div",{className:ge,children:"Copy Filtered"}),jsxRuntime.jsxs("div",{className:$e,children:[jsxRuntime.jsxs(q,{content:"Copy only console logs",disabled:l||s("logs")===0,onClick:()=>i("logs"),className:U,"aria-label":"Copy only console logs",children:[jsxRuntime.jsx(lucideReact.Terminal,{size:18}),"Logs"]}),jsxRuntime.jsxs(q,{content:"Copy only errors",disabled:l||s("errors")===0,onClick:()=>i("errors"),className:U,"aria-label":"Copy only errors",children:[jsxRuntime.jsx(lucideReact.AlertCircle,{size:18}),"Errors"]}),jsxRuntime.jsxs(q,{content:"Copy only network requests",disabled:l||s("network")===0,onClick:()=>i("network"),className:U,"aria-label":"Copy only network requests",children:[jsxRuntime.jsx(lucideReact.Globe,{size:18}),"Network"]})]})]}),jsxRuntime.jsxs("div",{className:Ee,children:[jsxRuntime.jsx("div",{className:ge,children:"Export"}),jsxRuntime.jsxs("div",{className:$e,children:[jsxRuntime.jsxs(q,{content:"Download as JSON",disabled:l,onClick:()=>a("json"),className:U,"aria-label":"Download as JSON",children:[jsxRuntime.jsx(lucideReact.FileJson,{size:18}),"JSON"]}),jsxRuntime.jsxs(q,{content:"Download as TXT",disabled:l,onClick:()=>a("txt"),className:U,"aria-label":"Download as TXT",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"TXT"]}),jsxRuntime.jsxs(q,{content:"Download as JSONL",disabled:l,onClick:()=>a("jsonl"),className:U,"aria-label":"Download as JSONL",children:[jsxRuntime.jsx(lucideReact.Database,{size:18}),"JSONL"]})]})]}),jsxRuntime.jsxs("div",{className:Ee,children:[jsxRuntime.jsx("div",{className:ge,children:"Actions"}),jsxRuntime.jsxs("div",{className:$e,children:[jsxRuntime.jsxs(q,{content:"Copy all to clipboard",disabled:l,onClick:n,className:U,"aria-label":"Copy all to clipboard",children:[jsxRuntime.jsx(lucideReact.Copy,{size:18}),"Copy"]}),jsxRuntime.jsxs(q,{content:"Download AI-optimized format",disabled:l,onClick:()=>a("ai.txt"),className:U,"aria-label":"Download AI-optimized format",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"AI-TXT"]}),e?jsxRuntime.jsxs(q,{content:"Upload logs to server",disabled:r,onClick:c,className:Xe,"aria-label":"Upload logs to server",children:[jsxRuntime.jsx(lucideReact.CloudUpload,{size:18}),r?"Uploading...":"Upload"]}):jsxRuntime.jsx("div",{})]})]})]})}function Ve({status:o}){return jsxRuntime.jsxs("div",{"aria-live":"polite",className:o.type==="success"?Ke:Ge,children:[o.type==="success"?jsxRuntime.jsx(lucideReact.CheckCircle2,{size:14}):jsxRuntime.jsx(lucideReact.AlertCircle,{size:14}),jsxRuntime.jsx("span",{className:ko,children:o.message})]})}function Io({uploadStatus:o,directoryStatus:e,copyStatus:r}){return jsxRuntime.jsxs("div",{className:So,children:[o&&jsxRuntime.jsx(Ve,{status:o}),e&&jsxRuntime.jsx(Ve,{status:e}),r&&jsxRuntime.jsx(Ve,{status:r})]})}function Po(){return jsxRuntime.jsx("div",{className:Je,children:jsxRuntime.jsxs("div",{className:We,children:["Press ",jsxRuntime.jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function _o(o,e){switch(e){case "logs":return o.filter(r=>r.type==="CONSOLE");case "errors":return o.filter(r=>r.type==="CONSOLE"&&r.level==="error");case "network":return o.filter(r=>r.type==="FETCH_REQ"||r.type==="FETCH_RES"||r.type==="XHR_REQ"||r.type==="XHR_RES");case "networkErrors":return o.filter(r=>r.type==="FETCH_ERR"||r.type==="XHR_ERR");default:return o}}function Qe({user:o,environment:e="production",uploadEndpoint:r,fileNameTemplate:s="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:i=2e3,showInProduction:a=false}){let{isOpen:n,open:c,close:l}=fo(),{isSettingsOpen:f,openSettings:b,closeSettings:m}=yo(),{copyFormat:k}=Se(),{uploadStatus:R,setUploadStatus:y,directoryStatus:T,setDirectoryStatus:v,copyStatus:P,setCopyStatus:w}=bo(),J=react.useRef(null),ie=react.useRef(null),{downloadLogs:h,uploadLogs:I,clearLogs:X,getLogs:p,getLogCount:S,getMetadata:x,sessionId:N}=ce({fileNameTemplate:s,environment:e,userId:o?.id||o?.email||"guest",includeMetadata:true,uploadEndpoint:r,maxLogs:i,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),O=S(),B=x();react.useEffect(()=>{if(B.errorCount>=5&&r){let u=async()=>{try{await I();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",u),()=>window.removeEventListener("error",u)}},[B.errorCount,r,I]),react.useEffect(()=>{let u=0,L=_=>{u=_.detail?.timestamp||Date.now(),console.log("[DebugPanel] Settings dropdown closed at:",u);};window.addEventListener("glean-dropdown-close",L);let z=_=>{let M=_.target;if(M.closest('[aria-label="Open debug panel"]')||M.closest('[aria-label="Close debug panel"]')||M.closest('[data-settings-trigger="true"]')){console.log("[DebugPanel] Click on toggle/close button - skip close");return}if(M.closest('[data-settings-dropdown="true"]')){console.log("[DebugPanel] Click within dropdown content - skip close");return}let C=Date.now()-u;if(C<200){console.log(`[DebugPanel] Settings dropdown closed ${C}ms ago - skip close`);return}if(f){console.log("[DebugPanel] Settings dropdown open - skip close");return}n&&J.current&&!J.current.contains(M)?(console.log("[DebugPanel] Click outside panel - closing panel"),l()):console.log("[DebugPanel] Click inside panel - skip close");};return document.addEventListener("mousedown",z),()=>{document.removeEventListener("mousedown",z),window.removeEventListener("glean-dropdown-close",L);}},[n,l,f]);let be=react.useCallback((u,L)=>{if(k==="json")return JSON.stringify({metadata:L,logs:u},null,2);if(k==="ecs.json"){let z=u.map(M=>j(M,L)),_={metadata:V(L),logs:z};return JSON.stringify(_,null,2)}else if(k==="ai.txt"){let z=`# METADATA
service.name=${L.environment||"unknown"}
user.id=${L.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,_=u.map(M=>{let C=j(M,L),Ze=C["@timestamp"],eo=C["log.level"],Wo=C["event.category"]?.[0]||"unknown",te=`[${Ze}] ${eo} ${Wo}`;return C.message&&(te+=` | message="${C.message}"`),C.http?.request?.method&&(te+=` | req.method=${C.http.request.method}`),C.url?.full&&(te+=` | url=${C.url.full}`),C.http?.response?.status_code&&(te+=` | res.status=${C.http.response.status_code}`),C.error?.message&&(te+=` | error="${C.error.message}"`),te});return z+_.join(`
`)}return JSON.stringify({metadata:L,logs:u},null,2)},[k]),Uo=react.useCallback(async()=>{y(null);try{let u=await I();u.success?(y({type:"success",message:`Uploaded successfully! ${u.data?JSON.stringify(u.data):""}`}),u.data&&typeof u.data=="object"&&"url"in u.data&&await navigator.clipboard.writeText(String(u.data.url))):y({type:"error",message:`Upload failed: ${u.error}`});}catch(u){y({type:"error",message:`Error: ${u instanceof Error?u.message:"Unknown error"}`});}},[I,y]),qo=react.useCallback(u=>{let L=h(u);L&&y({type:"success",message:`Downloaded: ${L}`});},[h,y]),Xo=react.useCallback(async()=>{v(null);try{await h("json",void 0,{showPicker:!0})&&v({type:"success",message:"Saved to directory"});}catch{v({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[h,v]),Ko=react.useCallback(async()=>{w(null);try{let u=p(),L=x(),z=be(u,L);await navigator.clipboard.writeText(z),w({type:"success",message:"Copied to clipboard!"});}catch{w({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[p,x,be,w]),Go=react.useCallback(async u=>{w(null);try{let L=p(),z=x(),_=_o(L,u),M=_.length;if(M===0){w({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[u]});return}let C=be(_,z);await navigator.clipboard.writeText(C),w({type:"success",message:`Copied ${M} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[u]} to clipboard`});}catch{w({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[p,x,be,w]),Jo=react.useCallback(u=>_o(p(),u).length,[p]);return a||e==="development"||o?.role==="admin"?jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs(framerMotion.motion.button,{type:"button",onClick:u=>{u.stopPropagation(),n?l():c();},className:Pe,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",whileHover:{scale:1.02},whileTap:{scale:.98},layout:true,children:[jsxRuntime.jsx(lucideReact.Bug,{size:18}),B.errorCount>0&&jsxRuntime.jsx(framerMotion.motion.span,{className:wo,initial:{scale:0},animate:{scale:1}},`err-${B.errorCount}`)]}),jsxRuntime.jsx(framerMotion.AnimatePresence,{mode:"wait",children:n&&jsxRuntime.jsx(framerMotion.motion.div,{ref:J,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:He,initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:20,scale:.95},transition:{duration:.25,ease:[.4,0,.2,1]},children:jsxRuntime.jsxs(G__namespace.Root,{className:"glean-scroll-area",style:{flex:1,overflow:"hidden"},children:[jsxRuntime.jsxs(G__namespace.Viewport,{className:"glean-scroll-viewport",style:{width:"100%",height:"100%"},children:[jsxRuntime.jsx(To,{sessionId:N,metadata:B,onClose:l,onSaveToDirectory:Xo,onClear:()=>{confirm("Clear all logs?")&&X();},ref:ie,isSettingsOpen:f,openSettings:b,closeSettings:m}),jsxRuntime.jsx(Do,{logCount:O,errorCount:B.errorCount,networkErrorCount:B.networkErrorCount}),jsxRuntime.jsx(Oo,{logCount:O,hasUploadEndpoint:!!r,isUploading:false,getFilteredLogCount:Jo,onCopyFiltered:Go,onDownload:qo,onCopy:Ko,onUpload:Uo}),jsxRuntime.jsx(Io,{uploadStatus:R,directoryStatus:T,copyStatus:P}),jsxRuntime.jsx(Po,{})]}),jsxRuntime.jsx(G__namespace.Scrollbar,{className:"glean-scrollbar",orientation:"vertical",style:{display:"flex",width:"6px",userSelect:"none",touchAction:"none",padding:"2px",background:"transparent"},children:jsxRuntime.jsx(G__namespace.Thumb,{className:"glean-scrollbar-thumb",style:{flex:1,background:"rgba(0, 0, 0, 0.15)",borderRadius:"3px",transition:"background 0.15s ease"}})})]})})})]}):null}function At({fileNameTemplate:o="debug_{timestamp}"}){let[e,r]=react.useState(false),{downloadLogs:s,clearLogs:i,getLogCount:a}=ce({fileNameTemplate:o}),n=a();return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("button",{onClick:()=>r(c=>!c),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsxRuntime.jsx("span",{children:n})}),e&&jsxRuntime.jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsxRuntime.jsx("button",{onClick:()=>s("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsxRuntime.jsx("button",{onClick:()=>{confirm("Clear all logs?")&&i();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsxRuntime.jsx("button",{onClick:()=>r(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function qt(o){return react.useMemo(()=>o.showInProduction||o.environment==="development"||o.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[o.showInProduction,o.environment,o.user])}function Xt(){let o=react.useCallback(r=>{try{typeof window<"u"&&(r?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:r}})));}catch{}},[]),e=react.useMemo(()=>typeof process<"u"&&true,[]);react.useEffect(()=>{if(typeof window>"u")return;let r=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>o(true),hide:()=>o(false),toggle:()=>{try{let s=localStorage.getItem("glean-debug-enabled")==="true";o(!s);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=r,()=>{typeof window<"u"&&window.glean===r&&delete window.glean;}},[o,e]);}function jo(o){let e=qt(o);return Xt(),e?jsxRuntime.jsx(Qe,{...o}):null}exports.DebugPanel=Qe;exports.DebugPanelMinimal=At;exports.GleanDebugger=jo;exports.collectMetadata=oo;exports.filterStackTrace=De;exports.generateExportFilename=Vt;exports.generateFilename=A;exports.generateSessionId=to;exports.getBrowserInfo=Te;exports.sanitizeData=ye;exports.sanitizeFilename=W;exports.transformMetadataToECS=V;exports.transformToECS=j;exports.useLogRecorder=ce;