import {forwardRef,useState,useEffect,useRef,useMemo,useCallback}from'react';import {motion,AnimatePresence}from'framer-motion';import*as X from'@radix-ui/react-scroll-area';import {css}from'goober';import*as I from'@radix-ui/react-dropdown-menu';import {Trash2,Info,Settings,X as X$1,FileText,FileJson,Save,Bug,Terminal,AlertCircle,Globe,Database,Copy,CloudUpload,CheckCircle2}from'lucide-react';import {jsx,Fragment,jsxs}from'react/jsx-runtime';import*as M from'@radix-ui/react-tooltip';// @ts-nocheck
var cr=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function we(o,e={}){let t=e.keys||cr;if(!o||typeof o!="object")return o;let s=Array.isArray(o)?[...o]:{...o},l=i=>{if(!i||typeof i!="object")return i;for(let n in i)if(Object.prototype.hasOwnProperty.call(i,n)){let d=n.toLowerCase();t.some(f=>d.includes(f.toLowerCase()))?i[n]="***REDACTED***":i[n]!==null&&typeof i[n]=="object"&&(i[n]=l(i[n]));}return i};return l(s)}function Y(o){return o.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function Pe(){if(typeof navigator>"u")return "unknown";let o=navigator.userAgent;return o.includes("Edg")?"edge":o.includes("Chrome")?"chrome":o.includes("Firefox")?"firefox":o.includes("Safari")?"safari":"unknown"}function go(o,e,t,s){if(typeof window>"u")return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:s,errorCount:0,networkErrorCount:0};let l=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",i=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:Pe(),platform:navigator.platform,language:navigator.language,screenResolution:l,viewport:i,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:s,errorCount:0,networkErrorCount:0}}function fo(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function P(o="json",e={},t={}){let{fileNameTemplate:s="{env}_{userId}_{sessionId}_{timestamp}",environment:l="development",userId:i="anonymous",sessionId:n="unknown"}=t,d=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],c=new Date().toISOString().split("T")[0],f=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),m=t.browser||Pe(),b=t.platform||(typeof navigator<"u"?navigator.platform:"unknown"),D=(t.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",g=String(t.errorCount??e.errorCount??0),R=String(t.logCount??e.logCount??0),T=s.replace("{env}",Y(l)).replace("{userId}",Y(i??"anonymous")).replace("{sessionId}",Y(n??"unknown")).replace("{timestamp}",d).replace("{date}",c).replace("{time}",f).replace(/\{errorCount\}/g,g).replace(/\{logCount\}/g,R).replace("{browser}",Y(m)).replace("{platform}",Y(b)).replace("{url}",Y(D));for(let[K,h]of Object.entries(e))T=T.replace(`{${K}}`,String(h));return `${T}.${o}`}function pt(o,e="json"){let t=o.url.split("?")[0]||"unknown";return P(e,{},{environment:o.environment,userId:o.userId,sessionId:o.sessionId,browser:o.browser,platform:o.platform,url:t,errorCount:o.errorCount,logCount:o.logCount})}var dr={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function bo(o){let e=parseFloat(o);return isNaN(e)?0:Math.round(e*1e6)}function pr(o){return dr[o.toLowerCase()]||"info"}function ze(o){return o.filter(e=>!e.ignored).slice(0,20)}function W(o){return {service:{environment:o.environment},user:o.userId?{id:o.userId}:void 0,host:{name:o.browser,type:o.platform}}}function H(o,e){let t={"@timestamp":o.time,event:{original:o,category:[]}},s=W(e);switch(Object.assign(t,s),o.type){case "CONSOLE":{t.log={level:pr(o.level)},t.message=o.data,t.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{t.http={request:{method:o.method}},t.url={full:o.url},t.event.category=["network","web"],t.event.action="request",t.event.id=o.id;break}case "FETCH_RES":case "XHR_RES":{t.http={response:{status_code:o.status}},t.url={full:o.url},t.event.duration=bo(o.duration),t.event.category=["network","web"],t.event.action="response",t.event.id=o.id;break}case "FETCH_ERR":case "XHR_ERR":{t.error={message:o.error},t.url={full:o.url},t.event.duration=bo(o.duration),t.event.category=["network","web"],t.event.action="error",t.event.id=o.id;let l=o;if(typeof l.body=="object"&&l.body!==null){let i=l.body;if(Array.isArray(i.frames)){let n=ze(i.frames);t.error.stack_trace=n.map(d=>`  at ${d.functionName||"?"} (${d.filename||"?"}:${d.lineNumber||0}:${d.columnNumber||0})`).join(`
`);}}break}default:{t.message=JSON.stringify(o);break}}return t}var he=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let t=this.originalConsole[e];console[e]=(...s)=>{this.callbacks.forEach(l=>{l(e,s);}),t(...s);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var Se=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t));}attach(){window.fetch=async(...e)=>{let[t,s]=e,l=t.toString();if(this.excludeUrls.some(n=>n.test(l)))return this.originalFetch(...e);let i=Date.now();this.onRequest.forEach(n=>n(l,s||{}));try{let n=await this.originalFetch(...e),d=Date.now()-i;return this.onResponse.forEach(c=>c(l,n.status,d)),n}catch(n){throw this.onError.forEach(d=>d(l,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var ve=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(t,s,l,i,n){let d=typeof s=="string"?s:s.href;if(e.requestTracker.set(this,{method:t,url:d,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(f=>f.test(d)))return e.originalOpen.call(this,t,s,l??true,i,n);let c=e.requestTracker.get(this);for(let f of e.onRequest)f(c);return e.originalOpen.call(this,t,s,l??true,i,n)},this.originalXHR.prototype.send=function(t){let s=e.requestTracker.get(this);if(s){s.body=t;let l=this.onload,i=this.onerror;this.onload=function(n){let d=Date.now()-s.startTime;for(let c of e.onResponse)c(s,this.status,d);l&&l.call(this,n);},this.onerror=function(n){for(let d of e.onError)d(s,new Error("XHR Error"));i&&i.call(this,n);};}return e.originalSend.call(this,t)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var He={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5,persistAcrossReloads:false};function le(){return Math.random().toString(36).substring(7)}function Ae(o,e){return we(o,{keys:e})}function mo(o,e,t,s){return {addLog:n=>{o.logsRef.current.push(n),o.logsRef.current.length>e.maxLogs&&o.logsRef.current.shift(),s(o.logsRef.current.length),n.type==="CONSOLE"?n.level==="ERROR"?o.errorCountRef.current++:o.errorCountRef.current=0:n.type==="FETCH_ERR"||n.type==="XHR_ERR"?o.errorCountRef.current++:o.errorCountRef.current=0;let d=e.uploadOnErrorCount??5;if(o.errorCountRef.current>=d&&e.uploadEndpoint){let c={metadata:{...o.metadataRef.current,logCount:o.logsRef.current.length},logs:o.logsRef.current,fileName:P("json",{},{fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.environment,userId:e.userId,sessionId:null})};fetch(e.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:t(c)}).catch(()=>{}),o.errorCountRef.current=0;}if(e.enablePersistence&&typeof window<"u")try{localStorage.setItem(e.persistenceKey,t(o.logsRef.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},updateMetadata:()=>{let n=o.logsRef.current.filter(c=>c.type==="CONSOLE").reduce((c,f)=>f.level==="ERROR"?c+1:c,0),d=o.logsRef.current.filter(c=>c.type==="FETCH_ERR"||c.type==="XHR_ERR").length;o.metadataRef.current={...o.metadataRef.current,logCount:o.logsRef.current.length,errorCount:n,networkErrorCount:d};}}}function yo(){return o=>{let e=new Set;return JSON.stringify(o,(t,s)=>{if(typeof s=="object"&&s!==null){if(e.has(s))return "[Circular]";e.add(s);}return s})}}function xo(o){return !o||o.length===0?"":o.map(e=>ur(e)).join("")}function ur(o){return JSON.stringify(o)+`
`}var Q=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,t,s="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(t,{create:!0})).createWritable();await n.write(e),await n.close();}catch(l){if(l.name==="AbortError")return;throw l}}static download(e,t,s="application/json"){let l=new Blob([e],{type:s}),i=URL.createObjectURL(l),n=document.createElement("a");n.href=i,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(i);}static async downloadWithFallback(e,t,s="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,t,s);return}catch(l){if(l.name==="AbortError")return}this.download(e,t,s);}};Q.supported=null;function wo(o,e,t,s){return (l,i)=>{if(typeof window>"u")return null;s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d=i||P(l,{},n),c,f;if(l==="json"){let m=e.current?{metadata:e.current,logs:o.current}:o.current;c=t(m),f="application/json";}else if(l==="jsonl"){let m=o.current.map(b=>H(b,e.current));c=xo(m),f="application/x-ndjson",d=i||P("jsonl",{},n);}else if(l==="ecs.json"){let m={metadata:W(e.current),logs:o.current.map(b=>H(b,e.current))};c=JSON.stringify(m,null,2),f="application/json",d=i||P("ecs-json",{},n);}else if(l==="ai.txt"){let m=e.current,b=`# METADATA
service.name=${m.environment||"unknown"}
user.id=${m.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,$=o.current.map(D=>{let g=H(D,m),R=g["@timestamp"],T=g.log?.level||"info",K=g.event?.category?.[0]||"unknown",h=`[${R}] ${T} ${K}`;return g.message&&(h+=` | message="${g.message}"`),g.http?.request?.method&&(h+=` | req.method=${g.http.request.method}`),g.url?.full&&(h+=` | url=${g.url.full}`),g.http?.response?.status_code&&(h+=` | res.status=${g.http.response.status_code}`),g.error?.message&&(h+=` | error="${g.error.message}"`),h});c=b+$.join(`
`),f="text/plain",d=i||P("ai-txt",{},n);}else c=(e.current?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${t(e.current)}
${"=".repeat(80)}

`:"")+o.current.map(b=>`[${b.time}] ${b.type}
${t(b)}
${"=".repeat(80)}`).join(`
`),f="text/plain";return Q.downloadWithFallback(c,d,f),d}}function ho(o,e,t,s){return async l=>{let i=l;if(!i)return {success:false,error:"No endpoint configured"};try{s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d={metadata:e.current,logs:o.current,fileName:P("json",{},n)},c=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:t(d)});if(!c.ok)throw new Error(`Upload failed: ${c.status}`);return {success:!0,data:await c.json()}}catch(n){let d=n instanceof Error?n.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",n),{success:false,error:d}}}}function ce(o={}){let e={...He,...o},t=useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount,persistAcrossReloads:e.persistAcrossReloads});useEffect(()=>{t.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount,persistAcrossReloads:e.persistAcrossReloads};},[e]);let s=useRef([]),l=useRef(e.sessionId||fo()),i=useRef(go(l.current,e.environment,e.userId,0)),[n,d]=useState(0),c=useRef(0),f=useRef(false),m=useMemo(()=>yo(),[]),b=useMemo(()=>new he,[]),$=useMemo(()=>new Se({excludeUrls:e.excludeUrls}),[e.excludeUrls]),D=useMemo(()=>new ve({excludeUrls:e.excludeUrls}),[e.excludeUrls]),g=useMemo(()=>mo({logsRef:s,metadataRef:i,errorCountRef:c},{maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount??5,sanitizeKeys:e.sanitizeKeys,environment:e.environment,userId:e.userId},m,d),[e,m,d]),R=g.addLog,T=g.updateMetadata,K=useMemo(()=>wo(s,i,m,T),[m,T]),h=useMemo(()=>ho(s,i,m,T),[m,T]);useEffect(()=>{if(typeof window>"u"||f.current)return;if(f.current=true,e.enablePersistence)try{let y=localStorage.getItem(e.persistenceKey);y&&(s.current=JSON.parse(y),d(s.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let G=[];if(e.captureConsole&&(b.attach(),b.onLog((y,w)=>{let x=w.map(N=>{if(typeof N=="object")try{return m(N)}catch{return String(N)}return String(N)}).join(" ");R({type:"CONSOLE",level:y.toUpperCase(),time:new Date().toISOString(),data:x.substring(0,5e3)});}),G.push(()=>b.detach())),e.captureFetch){let y=new Map;$.onFetchRequest((w,x)=>{let N=le(),S=null;if(x?.body)try{S=typeof x.body=="string"?JSON.parse(x.body):x.body,S=we(S,{keys:e.sanitizeKeys});}catch{S=String(x.body).substring(0,1e3);}y.set(N,{url:w,method:x?.method||"GET",headers:Ae(x?.headers,e.sanitizeKeys),body:S}),R({type:"FETCH_REQ",id:N,url:w,method:x?.method||"GET",headers:Ae(x?.headers,e.sanitizeKeys),body:S,time:new Date().toISOString()});}),$.onFetchResponse((w,x,N)=>{for(let[S,ye]of y.entries())if(ye.url===w){y.delete(S),R({type:"FETCH_RES",id:S,url:w,status:x,statusText:"",duration:`${N}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),$.onFetchError((w,x)=>{for(let[N,S]of y.entries())if(S.url===w){y.delete(N),R({type:"FETCH_ERR",id:N,url:w,error:x.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),$.attach(),G.push(()=>$.detach());}if(e.captureXHR&&(D.onXHRRequest(y=>{R({type:"XHR_REQ",id:le(),url:y.url,method:y.method,headers:y.headers,body:y.body,time:new Date().toISOString()});}),D.onXHRResponse((y,w,x)=>{R({type:"XHR_RES",id:le(),url:y.url,status:w,statusText:"",duration:`${x}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),D.onXHRError((y,w)=>{R({type:"XHR_ERR",id:le(),url:y.url,error:w.message,duration:"[unknown]ms",time:new Date().toISOString()});}),D.attach(),G.push(()=>D.detach())),e.enablePersistence&&e.persistAcrossReloads===false){let y=()=>{try{localStorage.removeItem(e.persistenceKey);}catch{}};window.addEventListener("beforeunload",y),G.push(()=>window.removeEventListener("beforeunload",y));}return ()=>{G.forEach(y=>y()),f.current=false;}},[e,R,m,b,$,D]);let Oe=useCallback(()=>{if(s.current=[],d(0),c.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),ee=useCallback(()=>[...s.current],[]),Fe=useCallback(()=>s.current.length,[]),O=useCallback(()=>(T(),{...i.current}),[T]);return {downloadLogs:K,uploadLogs:h,clearLogs:Oe,getLogs:ee,getLogCount:Fe,getMetadata:O,sessionId:l.current}}function $o(){let[o,e]=useState(false),[t,s]=useState(false),l=useRef(o);l.current=o;let i=useRef(null);useEffect(()=>{s(Q.isSupported());},[]);let n=useCallback(()=>{e(f=>!f);},[]),d=useCallback(()=>{e(true);},[]),c=useCallback(()=>{e(false);},[]);return useEffect(()=>{let f=b=>{b.ctrlKey&&b.shiftKey&&b.key==="D"&&(b.preventDefault(),n()),b.key==="Escape"&&l.current&&(b.preventDefault(),c());};document.addEventListener("keydown",f);let m=b=>{typeof b.detail?.visible=="boolean"&&(i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{e(b.detail.visible);},10));};return window.addEventListener("glean-debug-toggle",m),()=>{document.removeEventListener("keydown",f),window.removeEventListener("glean-debug-toggle",m);}},[n,c]),{isOpen:o,toggle:n,open:d,close:c,supportsDirectoryPicker:t}}var Ro="debug-panel-copy-format",mr=["json","ecs.json","ai.txt"];function Ce(){let[o,e]=useState(()=>{if(typeof window<"u"){let t=localStorage.getItem(Ro);if(t&&mr.includes(t))return t}return "ecs.json"});return useEffect(()=>{localStorage.setItem(Ro,o);},[o]),{copyFormat:o,setCopyFormat:e}}function Eo(){let[o,e]=useState(null),[t,s]=useState(null),[l,i]=useState(null),[n,d]=useState(false);return useEffect(()=>{if(o){let c=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(c)}},[o]),useEffect(()=>{if(t){let c=setTimeout(()=>{s(null);},3e3);return ()=>clearTimeout(c)}},[t]),useEffect(()=>{if(l){let c=setTimeout(()=>{i(null);},3e3);return ()=>clearTimeout(c)}},[l]),{uploadStatus:o,setUploadStatus:e,directoryStatus:t,setDirectoryStatus:s,copyStatus:l,setCopyStatus:i,showSettings:n,setShowSettings:d}}function Lo(){let[o,e]=useState(false),t=useCallback(()=>{e(true);},[]),s=useCallback(()=>{e(false);},[]),l=useCallback(()=>{e(i=>!i);},[]);return {isSettingsOpen:o,openSettings:t,closeSettings:s,toggleSettings:l}}var r={glassBg:"rgba(255, 255, 255, 0.75)",glassBorder:"rgba(255, 255, 255, 0.4)",glassShadow:"0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",colors:{primary:"#1a1a2e",secondary:"#4a5568",muted:"#a0aec0",border:"rgba(0, 0, 0, 0.06)",success:"#059669",successBg:"rgba(5, 150, 105, 0.08)",successBorder:"rgba(5, 150, 105, 0.2)",error:"#dc2626",errorBg:"rgba(220, 38, 38, 0.06)",errorBorder:"rgba(220, 38, 38, 0.15)",warning:"#d97706",accent:"#0ea5e9",accentBg:"rgba(14, 165, 233, 0.08)",accentBorder:"rgba(14, 165, 233, 0.2)"},fonts:{display:'-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',mono:'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'},space:{xs:"4px",sm:"8px",md:"12px",lg:"16px"},radius:{sm:"6px",md:"10px",lg:"16px",full:"9999px"},transitions:{fast:"0.15s ease",normal:"0.25s cubic-bezier(0.4, 0, 0.2, 1)",slow:"0.4s cubic-bezier(0.4, 0, 0.2, 1)"}},qe=css`
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
`,Io=css`
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
`;var Xe=css`
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
`,Ke=css`
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
`,Ge=css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${r.colors.primary};
  letter-spacing: -0.01em;
`,xr=css`
  margin: 0;
  font-size: 11px;
  color: ${r.colors.muted};
  font-family: ${r.fonts.mono};
  font-weight: 500;
`,Je=css`
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
`,Ve=css`
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
`,Ee=css`
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
`,wr=css`
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
`;var hr=css`
  color: ${r.colors.muted};
  font-weight: 500;
`,Sr=css`
  color: ${r.colors.primary};
  font-weight: 500;
  text-align: right;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,Ye=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: ${r.colors.border};
`,de=css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${r.space.lg};
  background: rgba(255, 255, 255, 0.6);
  gap: ${r.space.xs};
`,pe=css`
  font-size: 28px;
  font-weight: 700;
  color: ${r.colors.primary};
  line-height: 1;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`,ue=css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`,Oo=css`
  color: ${r.colors.error};
`,Fo=css`
  color: ${r.colors.warning};
`,z={warmCream:"rgba(255, 252, 245, 0.85)",warmGray:"#4a4543",warmMuted:"#8a857f",copperAccent:"#c17f59",copperSubtle:"rgba(193, 127, 89, 0.12)"},Do=css`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Source+Sans+3:wght@400;500;600&display=swap');

  font-family: 'Source Sans 3', ${r.fonts.display};
  padding: ${r.space.md} ${r.space.lg};
  background: ${z.warmCream};
  border-bottom: 1px solid rgba(74, 69, 67, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
`,Re=css`
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
  color: ${z.warmGray};
  text-transform: none;
  letter-spacing: 0.02em;
  transition: color ${r.transitions.normal};

  &:hover {
    color: ${z.copperAccent};
  }

  &:focus-visible {
    outline: 2px solid ${z.copperAccent};
    outline-offset: 2px;
    border-radius: 4px;
  }
`,vr=css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${z.copperSubtle};
  border-radius: ${r.radius.sm};
  color: ${z.copperAccent};
  transition: all ${r.transitions.normal};

  ${Re}:hover & {
    background: ${z.copperAccent};
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
`;var kr=css`
  padding-top: ${r.space.md};
`;css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${r.space.md};
  padding: ${r.space.xs} 0;
  font-size: 13px;
  line-height: 1.6;
`;var Cr=css`
  font-weight: 600;
  color: ${z.warmMuted};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-size: 13px;
  min-width: 100px;
`,$r=css`
  font-weight: 500;
  color: ${z.warmGray};
  text-align: right;
  flex: 1;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
`,Rr=css`
  font-weight: 500;
  color: ${z.warmGray};
  text-align: right;
  flex: 1;
  font-family: ${r.fonts.mono};
  font-size: 13px;
  background: rgba(0, 0, 0, 0.03);
  padding: 3px 8px;
  border-radius: 4px;
`,We=css`
  padding: ${r.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${r.space.lg};
  background: rgba(255, 255, 255, 0.3);
`,Le=css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.sm};
`,ge=css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${r.space.sm};
`;var De=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${r.space.sm};
`,fe=css`
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
  ${fe}
`;var Er=css`
  ${fe}
  background: ${r.colors.accentBg};
  border-color: ${r.colors.accentBorder};
  color: ${r.colors.accent};

  &:hover:not(:disabled) {
    background: ${r.colors.accent};
    color: #ffffff;
    border-color: ${r.colors.accent};
  }
`,Qe=css`
  ${fe}
  background: ${r.colors.successBg};
  border-color: ${r.colors.successBorder};
  color: ${r.colors.success};

  &:hover:not(:disabled) {
    background: ${r.colors.success};
    color: #ffffff;
    border-color: ${r.colors.success};
  }
`,Lr=css`
  ${fe}
  background: ${r.colors.errorBg};
  border-color: ${r.colors.errorBorder};
  color: ${r.colors.error};

  &:hover:not(:disabled) {
    background: ${r.colors.error};
    color: #ffffff;
    border-color: ${r.colors.error};
  }
`,A=css`
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
`,Dr=css`
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
`,Po=css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.xs};
  padding: 0 ${r.space.lg} ${r.space.sm};
`,Ze=css`
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
`,eo=css`
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
`,oo=css`
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
`,ro=css`
  font-size: 11px;
  color: ${r.colors.muted};
`,Ho=`
  0 0 0 1px rgba(0, 0, 0, 0.04),
  0 2px 8px rgba(0, 0, 0, 0.06),
  0 8px 24px rgba(0, 0, 0, 0.08)
`,Te=css`
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
`;var be=css`
  padding: 8px 10px 6px 0px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-family: ${r.fonts.display};
`,q=css`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  line-height: 1.5;
`,_=css`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;
  min-width: 70px;
  font-family: ${r.fonts.display};
`,j=css`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  font-size: 12px;
  font-family: ${r.fonts.display};
`,to=css`
  ${j}
  font-family: ${r.fonts.mono};
  font-size: 11px;
  letter-spacing: -0.02em;
  color: rgba(0, 0, 0, 0.65);
`,Ne=css`
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
`,no=css`
  margin-left: auto;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 600;
`,so=css`
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 8px 0;
  border-radius: 1px;
`,Tr=css`
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
`,Ue=css`
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
  ${Ue}
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

    ${Xe} {
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

    ${Ge} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${xr} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Je} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
    }

    ${Ve} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(220, 38, 38, 0.2);
        color: #f87171;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
      }
    }

    ${Ee} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(14, 165, 233, 0.15);
        color: #38bdf8;
        box-shadow: 0 2px 8px rgba(14, 165, 233, 0.25);
      }
    }

    ${wr} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${hr} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Sr} {
      color: rgba(255, 255, 255, 0.9);
    }

    ${Ye} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${de} {
      background: rgba(40, 40, 60, 0.5);
    }

    ${pe} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${ue} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Do} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Re} {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${kr} {
      background: rgba(40, 40, 60, 0.5);
      color: rgba(255, 255, 255, 0.6);

      strong {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    ${We} {
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

    ${Er} {
      background: rgba(14, 165, 233, 0.15);
      border-color: rgba(14, 165, 233, 0.25);
      color: #38bdf8;

      &:hover:not(:disabled) {
        background: #0ea5e9;
        color: #ffffff;
        border-color: #0ea5e9;
      }
    }

    ${Qe} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;

      &:hover:not(:disabled) {
        background: #059669;
        color: #ffffff;
        border-color: #059669;
      }
    }

    ${Lr},
    ${Dr} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;

      &:hover:not(:disabled) {
        background: #dc2626;
        color: #ffffff;
        border-color: #dc2626;
      }
    }

    ${Ze} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;
    }

    ${eo} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;
    }

    ${oo} {
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

    ${qe} {
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

    ${Tr},
    ${Te} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.3),
        0 12px 48px rgba(0, 0, 0, 0.4);
    }

    ${_} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${j} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${to} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }

    ${be},
    ${To} {
      color: rgba(255, 255, 255, 0.35);
      background: rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Ne},
    ${Ue} {
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

    ${so} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${no} {
      color: rgba(255, 255, 255, 0.5);
    }

    ${To} {
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Ue} {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    ${No} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }

    ${Do} {
      background: rgba(40, 40, 60, 0.5);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Re} {
      color: rgba(255, 255, 255, 0.75);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${vr} {
      background: rgba(193, 127, 89, 0.18);
      color: rgba(193, 127, 89, 0.9);

      ${Re}:hover & {
        background: rgba(193, 127, 89, 0.9);
        color: #ffffff;
      }
    }

    ${Cr} {
      color: rgba(255, 255, 255, 0.5);
    }

    ${$r} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${Rr} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;function Hr({metadata:o}){return jsxs("div",{className:Te,children:[jsx("div",{className:be,children:"Session Details"}),jsxs("div",{className:q,children:[jsx("span",{className:_,children:"User"}),jsx("span",{className:j,children:o.userId||"Anonymous"})]}),jsxs("div",{className:q,children:[jsx("span",{className:_,children:"Session ID"}),jsx("span",{className:to,children:o.sessionId||"N/A"})]}),jsxs("div",{className:q,children:[jsx("span",{className:_,children:"Browser"}),jsxs("span",{className:j,children:[o.browser," \xB7 ",o.platform]})]}),jsxs("div",{className:q,children:[jsx("span",{className:_,children:"Screen"}),jsx("span",{className:j,children:o.screenResolution})]}),jsxs("div",{className:q,children:[jsx("span",{className:_,children:"Timezone"}),jsx("span",{className:j,children:o.timezone})]}),jsxs("div",{className:q,children:[jsx("span",{className:_,children:"Language"}),jsx("span",{className:j,children:o.language})]}),jsxs("div",{className:q,children:[jsx("span",{className:_,children:"Viewport"}),jsx("span",{className:j,children:o.viewport})]})]})}function Ar({copyFormat:o,setCopyFormat:e,onSaveToDirectory:t,onCloseDropdown:s}){let l=["json","ecs.json","ai.txt"],i={json:jsx(FileJson,{size:14}),"ecs.json":jsx(FileText,{size:14}),"ai.txt":jsx(FileText,{size:14})};return jsxs("div",{className:Te,children:[jsx("div",{className:be,children:"Export format"}),jsx("div",{style:{display:"flex",flexDirection:"column",gap:2},children:l.map(n=>jsxs("button",{type:"button",className:Ne,style:o===n?{background:"rgba(0, 0, 0, 0.06)",color:"rgba(0, 0, 0, 0.9)"}:void 0,onClick:()=>{e(n),s();},children:[i[n],jsxs("span",{style:{flex:1},children:[n==="json"&&"JSON",n==="ecs.json"&&"ECS (AI)",n==="ai.txt"&&"AI-TXT"]}),o===n&&jsx("span",{className:no,children:"\u2713"})]},n))}),jsx("div",{className:so}),jsx("div",{className:be,children:"Actions"}),jsxs("button",{type:"button",className:Ne,onClick:()=>{t(),s();},children:[jsx(Save,{size:14}),jsx("span",{children:"Save to folder"})]})]})}var _o=forwardRef(function({metadata:e,onClose:t,onSaveToDirectory:s,onClear:l,isSettingsOpen:i,openSettings:n,closeSettings:d,isSessionDetailsOpen:c,openSessionDetails:f,closeSessionDetails:m},b){let{copyFormat:$,setCopyFormat:D}=Ce();return jsx(Fragment,{children:jsxs("div",{className:Ke,children:[jsx("div",{className:Mo,children:jsx("h3",{className:Ge,children:"Debug"})}),jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsx("button",{type:"button",onClick:l,className:Ve,"aria-label":"Clear all logs",title:"Clear logs",children:jsx(Trash2,{size:16})}),jsxs(I.Root,{open:c,onOpenChange:g=>{g?f():m();},children:[jsx(I.Trigger,{asChild:true,children:jsx("button",{type:"button",className:Ee,"aria-label":"Session details",title:"Session details",children:jsx(Info,{size:16})})}),jsx(I.Portal,{children:jsx(I.Content,{sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:g=>{g.target.closest("#debug-panel")&&g.preventDefault();},children:jsx(Hr,{metadata:e})})})]}),jsxs(I.Root,{open:i,onOpenChange:g=>{g?n():d();},children:[jsx(I.Trigger,{asChild:true,children:jsx("button",{type:"button",className:Ee,"aria-label":"Actions and settings",title:"Actions and settings","data-settings-trigger":"true",children:jsx(Settings,{size:16})})}),jsx(I.Portal,{children:jsx(I.Content,{"data-settings-dropdown":"true",sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:g=>{g.target.closest("#debug-panel")&&g.preventDefault();},children:jsx(Ar,{copyFormat:$,setCopyFormat:D,onSaveToDirectory:s,onCloseDropdown:()=>d()})})})]}),jsx("button",{ref:b,type:"button",onClick:t,className:Je,"aria-label":"Close debug panel",children:jsx(X$1,{size:18})})]})]})})});function jo({logCount:o,errorCount:e,networkErrorCount:t}){return jsxs("div",{className:Ye,children:[jsxs("div",{className:de,children:[jsx("div",{className:pe,children:o.toLocaleString()}),jsx("div",{className:ue,children:"Logs"})]}),jsxs("div",{className:de,children:[jsx("div",{className:`${pe} ${Oo}`,children:e.toLocaleString()}),jsx("div",{className:ue,children:"Errors"})]}),jsxs("div",{className:de,children:[jsx("div",{className:`${pe} ${Fo}`,children:t.toLocaleString()}),jsx("div",{className:ue,children:"Network"})]})]})}function B({children:o,content:e,disabled:t,...s}){return jsx(M.Provider,{delayDuration:200,skipDelayDuration:100,children:jsxs(M.Root,{children:[jsx(M.Trigger,{asChild:true,children:jsx("button",{type:"button",disabled:t,...s,children:o})}),!t&&jsx(M.Portal,{children:jsxs(M.Content,{side:"top",sideOffset:6,align:"center",style:{background:"var(--color-primary, #1a1a2e)",color:"white",padding:"6px 12px",borderRadius:"6px",fontSize:"11px",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",zIndex:1e5},children:[e,jsx(M.Arrow,{style:{fill:"var(--color-primary, #1a1a2e)"}})]})})]})})}function Uo({logCount:o,hasUploadEndpoint:e,isUploading:t,getFilteredLogCount:s,onCopyFiltered:l,onDownload:i,onCopy:n,onUpload:d}){let c=o===0;return jsxs("div",{className:We,children:[jsxs("div",{className:Le,children:[jsx("div",{className:ge,children:"Copy Filtered"}),jsxs("div",{className:De,children:[jsxs(B,{content:"Copy only console logs",disabled:c||s("logs")===0,onClick:()=>l("logs"),className:A,"aria-label":"Copy only console logs",children:[jsx(Terminal,{size:18}),"Logs"]}),jsxs(B,{content:"Copy only errors",disabled:c||s("errors")===0,onClick:()=>l("errors"),className:A,"aria-label":"Copy only errors",children:[jsx(AlertCircle,{size:18}),"Errors"]}),jsxs(B,{content:"Copy only network requests",disabled:c||s("network")===0,onClick:()=>l("network"),className:A,"aria-label":"Copy only network requests",children:[jsx(Globe,{size:18}),"Network"]})]})]}),jsxs("div",{className:Le,children:[jsx("div",{className:ge,children:"Export"}),jsxs("div",{className:De,children:[jsxs(B,{content:"Download as JSON",disabled:c,onClick:()=>i("json"),className:A,"aria-label":"Download as JSON",children:[jsx(FileJson,{size:18}),"JSON"]}),jsxs(B,{content:"Download as TXT",disabled:c,onClick:()=>i("txt"),className:A,"aria-label":"Download as TXT",children:[jsx(FileText,{size:18}),"TXT"]}),jsxs(B,{content:"Download as JSONL",disabled:c,onClick:()=>i("jsonl"),className:A,"aria-label":"Download as JSONL",children:[jsx(Database,{size:18}),"JSONL"]})]})]}),jsxs("div",{className:Le,children:[jsx("div",{className:ge,children:"Actions"}),jsxs("div",{className:De,children:[jsxs(B,{content:"Copy all to clipboard",disabled:c,onClick:n,className:A,"aria-label":"Copy all to clipboard",children:[jsx(Copy,{size:18}),"Copy"]}),jsxs(B,{content:"Download AI-optimized format",disabled:c,onClick:()=>i("ai.txt"),className:A,"aria-label":"Download AI-optimized format",children:[jsx(FileText,{size:18}),"AI-TXT"]}),e?jsxs(B,{content:"Upload logs to server",disabled:t,onClick:d,className:Qe,"aria-label":"Upload logs to server",children:[jsx(CloudUpload,{size:18}),t?"Uploading...":"Upload"]}):jsx("div",{})]})]})]})}function ao({status:o}){return jsxs("div",{"aria-live":"polite",className:o.type==="success"?Ze:eo,children:[o.type==="success"?jsx(CheckCircle2,{size:14}):jsx(AlertCircle,{size:14}),jsx("span",{className:zo,children:o.message})]})}function qo({uploadStatus:o,directoryStatus:e,copyStatus:t}){return jsxs("div",{className:Po,children:[o&&jsx(ao,{status:o}),e&&jsx(ao,{status:e}),t&&jsx(ao,{status:t})]})}function Go(){return jsx("div",{className:oo,children:jsxs("div",{className:ro,children:["Press ",jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function Wo(o,e){switch(e){case "logs":return o.filter(t=>t.type==="CONSOLE");case "errors":return o.filter(t=>t.type==="CONSOLE"&&t.level==="error");case "network":return o.filter(t=>t.type==="FETCH_REQ"||t.type==="FETCH_RES"||t.type==="XHR_REQ"||t.type==="XHR_RES");case "networkErrors":return o.filter(t=>t.type==="FETCH_ERR"||t.type==="XHR_ERR");default:return o}}function lo({user:o,environment:e="production",uploadEndpoint:t,fileNameTemplate:s="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:l=2e3,showInProduction:i=false}){let{isOpen:n,open:d,close:c}=$o(),{isSettingsOpen:f,openSettings:m,closeSettings:b}=Lo(),{copyFormat:$}=Ce(),[D,g]=useState(false),R=useCallback(()=>{g(true);},[]),T=useCallback(()=>{g(false);},[]),{uploadStatus:K,setUploadStatus:h,directoryStatus:Oe,setDirectoryStatus:ee,copyStatus:Fe,setCopyStatus:O}=Eo(),G=useRef(null),y=useRef(null),{downloadLogs:w,uploadLogs:x,clearLogs:N,getLogs:S,getLogCount:ye,getMetadata:ie}=ce({fileNameTemplate:s,environment:e,userId:o?.id||o?.email||"guest",includeMetadata:true,uploadEndpoint:t,maxLogs:l,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),[co,or]=useState(0);useEffect(()=>{let u=()=>or(ye());u();let E=setInterval(u,100);return ()=>clearInterval(E)},[ye]);let J=ie();useEffect(()=>{if(J.errorCount>=5&&t){let u=async()=>{try{await x();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",u),()=>window.removeEventListener("error",u)}},[J.errorCount,t,x]);let xe=useCallback((u,E)=>{if($==="json")return JSON.stringify({metadata:E,logs:u},null,2);if($==="ecs.json"){let V=u.map(re=>H(re,E)),oe={metadata:W(E),logs:V};return JSON.stringify(oe,null,2)}else if($==="ai.txt"){let V=`# METADATA
service.name=${E.environment||"unknown"}
user.id=${E.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,oe=u.map(re=>{let L=H(re,E),po=L["@timestamp"],uo=L["log.level"],lr=L["event.category"]?.[0]||"unknown",te=`[${po}] ${uo} ${lr}`;return L.message&&(te+=` | message="${L.message}"`),L.http?.request?.method&&(te+=` | req.method=${L.http.request.method}`),L.url?.full&&(te+=` | url=${L.url.full}`),L.http?.response?.status_code&&(te+=` | res.status=${L.http.response.status_code}`),L.error?.message&&(te+=` | error="${L.error.message}"`),te});return V+oe.join(`
`)}return JSON.stringify({metadata:E,logs:u},null,2)},[$]),rr=useCallback(async()=>{h(null);try{let u=await x();u.success?(h({type:"success",message:`Uploaded successfully! ${u.data?JSON.stringify(u.data):""}`}),u.data&&typeof u.data=="object"&&"url"in u.data&&await navigator.clipboard.writeText(String(u.data.url))):h({type:"error",message:`Upload failed: ${u.error}`});}catch(u){h({type:"error",message:`Error: ${u instanceof Error?u.message:"Unknown error"}`});}},[x,h]),tr=useCallback(u=>{let E=w(u);E&&h({type:"success",message:`Downloaded: ${E}`});},[w,h]),nr=useCallback(async()=>{ee(null);try{await w("json",void 0,{showPicker:!0})&&ee({type:"success",message:"Saved to directory"});}catch{ee({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[w,ee]),sr=useCallback(async()=>{O(null);try{let u=S(),E=ie(),V=xe(u,E);await navigator.clipboard.writeText(V),O({type:"success",message:"Copied to clipboard!"});}catch{O({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[S,ie,xe,O]),ar=useCallback(async u=>{O(null);try{let E=S(),V=ie(),oe=Wo(E,u),re=oe.length;if(re===0){O({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[u]});return}let L=xe(oe,V);await navigator.clipboard.writeText(L),O({type:"success",message:`Copied ${re} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[u]} to clipboard`});}catch{O({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[S,ie,xe,O]),ir=useCallback(u=>Wo(S(),u).length,[S]);return i||e==="development"||o?.role==="admin"?jsxs(Fragment,{children:[jsxs(motion.button,{type:"button",onClick:u=>{u.stopPropagation(),n?c():d();},className:qe,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",whileHover:{scale:1.02},whileTap:{scale:.98},layout:true,children:[jsx(Bug,{size:18}),J.errorCount>0&&jsx(motion.span,{className:Io,initial:{scale:0},animate:{scale:1}},`err-${J.errorCount}`)]}),jsx(AnimatePresence,{mode:"wait",children:n&&jsx(motion.div,{ref:G,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:Xe,initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:20,scale:.95},transition:{duration:.25,ease:[.4,0,.2,1]},children:jsxs(X.Root,{className:"glean-scroll-area",style:{flex:1,overflow:"hidden"},children:[jsxs(X.Viewport,{className:"glean-scroll-viewport",style:{width:"100%",height:"100%"},children:[jsx(_o,{metadata:J,onClose:c,onSaveToDirectory:nr,onClear:()=>{confirm("Clear all logs?")&&N();},ref:y,isSettingsOpen:f,openSettings:m,closeSettings:b,isSessionDetailsOpen:D,openSessionDetails:R,closeSessionDetails:T}),jsx(jo,{logCount:co,errorCount:J.errorCount,networkErrorCount:J.networkErrorCount}),jsx(Uo,{logCount:co,hasUploadEndpoint:!!t,isUploading:false,getFilteredLogCount:ir,onCopyFiltered:ar,onDownload:tr,onCopy:sr,onUpload:rr}),jsx(qo,{uploadStatus:K,directoryStatus:Oe,copyStatus:Fe}),jsx(Go,{})]}),jsx(X.Scrollbar,{className:"glean-scrollbar",orientation:"vertical",style:{display:"flex",width:"6px",userSelect:"none",touchAction:"none",padding:"2px",background:"transparent"},children:jsx(X.Thumb,{className:"glean-scrollbar-thumb",style:{flex:1,background:"rgba(0, 0, 0, 0.15)",borderRadius:"3px",transition:"background 0.15s ease"}})})]})})})]}):null}function ot({fileNameTemplate:o="debug_{timestamp}"}){let[e,t]=useState(false),{downloadLogs:s,clearLogs:l,getLogCount:i}=ce({fileNameTemplate:o}),n=i();return jsxs(Fragment,{children:[jsx("button",{onClick:()=>t(d=>!d),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsx("span",{children:n})}),e&&jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsx("button",{onClick:()=>s("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsx("button",{onClick:()=>{confirm("Clear all logs?")&&l();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsx("button",{onClick:()=>t(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function st(o){return useMemo(()=>o.showInProduction||o.environment==="development"||o.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[o.showInProduction,o.environment,o.user])}function at(){let o=useCallback(t=>{try{typeof window<"u"&&(t?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:t}})));}catch{}},[]),e=useMemo(()=>typeof process<"u"&&true,[]);useEffect(()=>{if(typeof window>"u")return;let t=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>o(true),hide:()=>o(false),toggle:()=>{try{let s=localStorage.getItem("glean-debug-enabled")==="true";o(!s);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=t,()=>{typeof window<"u"&&window.glean===t&&delete window.glean;}},[o,e]);}function er(o){let e=st(o);return at(),e?jsx(lo,{...o}):null}export{lo as DebugPanel,ot as DebugPanelMinimal,er as GleanDebugger,go as collectMetadata,ze as filterStackTrace,pt as generateExportFilename,P as generateFilename,fo as generateSessionId,Pe as getBrowserInfo,we as sanitizeData,Y as sanitizeFilename,W as transformMetadataToECS,H as transformToECS,ce as useLogRecorder};