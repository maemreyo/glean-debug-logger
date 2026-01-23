import {forwardRef,useState,useEffect,useRef,useMemo,useCallback}from'react';import {motion,AnimatePresence}from'framer-motion';import*as B from'@radix-ui/react-scroll-area';import {css}from'goober';import*as M from'@radix-ui/react-dropdown-menu';import {Trash2,Info,Settings,X,FileText,FileJson,Save,Bug,Terminal,AlertCircle,Globe,Database,Copy,CloudUpload,CheckCircle2}from'lucide-react';import {jsx,Fragment,jsxs}from'react/jsx-runtime';import*as O from'@radix-ui/react-tooltip';// @ts-nocheck
var Jo=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function fe(o,e={}){let r=e.keys||Jo;if(!o||typeof o!="object")return o;let s=Array.isArray(o)?[...o]:{...o},a=i=>{if(!i||typeof i!="object")return i;for(let n in i)if(Object.prototype.hasOwnProperty.call(i,n)){let d=n.toLowerCase();r.some(f=>d.includes(f.toLowerCase()))?i[n]="***REDACTED***":i[n]!==null&&typeof i[n]=="object"&&(i[n]=a(i[n]));}return i};return a(s)}function K(o){return o.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function Te(){if(typeof navigator>"u")return "unknown";let o=navigator.userAgent;return o.includes("Edg")?"edge":o.includes("Chrome")?"chrome":o.includes("Firefox")?"firefox":o.includes("Safari")?"safari":"unknown"}function to(o,e,r,s){if(typeof window>"u")return {sessionId:o,environment:e,userId:r,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:s,errorCount:0,networkErrorCount:0};let a=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",i=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:o,environment:e,userId:r,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:Te(),platform:navigator.platform,language:navigator.language,screenResolution:a,viewport:i,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:s,errorCount:0,networkErrorCount:0}}function ro(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function P(o="json",e={},r={}){let{fileNameTemplate:s="{env}_{userId}_{sessionId}_{timestamp}",environment:a="development",userId:i="anonymous",sessionId:n="unknown"}=r,d=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],l=new Date().toISOString().split("T")[0],f=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),m=r.browser||Te(),b=r.platform||(typeof navigator<"u"?navigator.platform:"unknown"),L=(r.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",u=String(r.errorCount??e.errorCount??0),R=String(r.logCount??e.logCount??0),D=s.replace("{env}",K(a)).replace("{userId}",K(i??"anonymous")).replace("{sessionId}",K(n??"unknown")).replace("{timestamp}",d).replace("{date}",l).replace("{time}",f).replace(/\{errorCount\}/g,u).replace(/\{logCount\}/g,R).replace("{browser}",K(m)).replace("{platform}",K(b)).replace("{url}",K(L));for(let[U,w]of Object.entries(e))D=D.replace(`{${U}}`,String(w));return `${D}.${o}`}function er(o,e="json"){let r=o.url.split("?")[0]||"unknown";return P(e,{},{environment:o.environment,userId:o.userId,sessionId:o.sessionId,browser:o.browser,platform:o.platform,url:r,errorCount:o.errorCount,logCount:o.logCount})}var Wo={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function no(o){let e=parseFloat(o);return isNaN(e)?0:Math.round(e*1e6)}function Vo(o){return Wo[o.toLowerCase()]||"info"}function Ie(o){return o.filter(e=>!e.ignored).slice(0,20)}function G(o){return {service:{environment:o.environment},user:o.userId?{id:o.userId}:void 0,host:{name:o.browser,type:o.platform}}}function H(o,e){let r={"@timestamp":o.time,event:{original:o,category:[]}},s=G(e);switch(Object.assign(r,s),o.type){case "CONSOLE":{r.log={level:Vo(o.level)},r.message=o.data,r.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{r.http={request:{method:o.method}},r.url={full:o.url},r.event.category=["network","web"],r.event.action="request",r.event.id=o.id;break}case "FETCH_RES":case "XHR_RES":{r.http={response:{status_code:o.status}},r.url={full:o.url},r.event.duration=no(o.duration),r.event.category=["network","web"],r.event.action="response",r.event.id=o.id;break}case "FETCH_ERR":case "XHR_ERR":{r.error={message:o.error},r.url={full:o.url},r.event.duration=no(o.duration),r.event.category=["network","web"],r.event.action="error",r.event.id=o.id;let a=o;if(typeof a.body=="object"&&a.body!==null){let i=a.body;if(Array.isArray(i.frames)){let n=Ie(i.frames);r.error.stack_trace=n.map(d=>`  at ${d.functionName||"?"} (${d.filename||"?"}:${d.lineNumber||0}:${d.columnNumber||0})`).join(`
`);}}break}default:{r.message=JSON.stringify(o);break}}return r}var be=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let r=this.originalConsole[e];console[e]=(...s)=>{this.callbacks.forEach(a=>{a(e,s);}),r(...s);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var me=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(r=>new RegExp(r));}attach(){window.fetch=async(...e)=>{let[r,s]=e,a=r.toString();if(this.excludeUrls.some(n=>n.test(a)))return this.originalFetch(...e);let i=Date.now();this.onRequest.forEach(n=>n(a,s||{}));try{let n=await this.originalFetch(...e),d=Date.now()-i;return this.onResponse.forEach(l=>l(a,n.status,d)),n}catch(n){throw this.onError.forEach(d=>d(a,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var ye=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(r=>new RegExp(r)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(r,s,a,i,n){let d=typeof s=="string"?s:s.href;if(e.requestTracker.set(this,{method:r,url:d,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(f=>f.test(d)))return e.originalOpen.call(this,r,s,a??true,i,n);let l=e.requestTracker.get(this);for(let f of e.onRequest)f(l);return e.originalOpen.call(this,r,s,a??true,i,n)},this.originalXHR.prototype.send=function(r){let s=e.requestTracker.get(this);if(s){s.body=r;let a=this.onload,i=this.onerror;this.onload=function(n){let d=Date.now()-s.startTime;for(let l of e.onResponse)l(s,this.status,d);a&&a.call(this,n);},this.onerror=function(n){for(let d of e.onError)d(s,new Error("XHR Error"));i&&i.call(this,n);};}return e.originalSend.call(this,r)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var Me={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function se(){return Math.random().toString(36).substring(7)}function Oe(o,e){return fe(o,{keys:e})}function so(o,e,r,s){return {addLog:n=>{o.logsRef.current.push(n),o.logsRef.current.length>e.maxLogs&&o.logsRef.current.shift(),s(o.logsRef.current.length),n.type==="CONSOLE"?n.level==="ERROR"?o.errorCountRef.current++:o.errorCountRef.current=0:n.type==="FETCH_ERR"||n.type==="XHR_ERR"?o.errorCountRef.current++:o.errorCountRef.current=0;let d=e.uploadOnErrorCount??5;if(o.errorCountRef.current>=d&&e.uploadEndpoint){let l={metadata:{...o.metadataRef.current,logCount:o.logsRef.current.length},logs:o.logsRef.current,fileName:P("json",{},{fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.environment,userId:e.userId,sessionId:null})};fetch(e.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:r(l)}).catch(()=>{}),o.errorCountRef.current=0;}if(e.enablePersistence&&typeof window<"u")try{localStorage.setItem(e.persistenceKey,r(o.logsRef.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},updateMetadata:()=>{let n=o.logsRef.current.filter(l=>l.type==="CONSOLE").reduce((l,f)=>f.level==="ERROR"?l+1:l,0),d=o.logsRef.current.filter(l=>l.type==="FETCH_ERR"||l.type==="XHR_ERR").length;o.metadataRef.current={...o.metadataRef.current,logCount:o.logsRef.current.length,errorCount:n,networkErrorCount:d};}}}function ao(){return o=>{let e=new Set;return JSON.stringify(o,(r,s)=>{if(typeof s=="object"&&s!==null){if(e.has(s))return "[Circular]";e.add(s);}return s})}}function io(o){return !o||o.length===0?"":o.map(e=>Yo(e)).join("")}function Yo(o){return JSON.stringify(o)+`
`}var J=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,r,s="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(r,{create:!0})).createWritable();await n.write(e),await n.close();}catch(a){if(a.name==="AbortError")return;throw a}}static download(e,r,s="application/json"){let a=new Blob([e],{type:s}),i=URL.createObjectURL(a),n=document.createElement("a");n.href=i,n.download=r,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(i);}static async downloadWithFallback(e,r,s="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,r,s);return}catch(a){if(a.name==="AbortError")return}this.download(e,r,s);}};J.supported=null;function lo(o,e,r,s){return (a,i)=>{if(typeof window>"u")return null;s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d=i||P(a,{},n),l,f;if(a==="json"){let m=e.current?{metadata:e.current,logs:o.current}:o.current;l=r(m),f="application/json";}else if(a==="jsonl"){let m=o.current.map(b=>H(b,e.current));l=io(m),f="application/x-ndjson",d=i||P("jsonl",{},n);}else if(a==="ecs.json"){let m={metadata:G(e.current),logs:o.current.map(b=>H(b,e.current))};l=JSON.stringify(m,null,2),f="application/json",d=i||P("ecs-json",{},n);}else if(a==="ai.txt"){let m=e.current,b=`# METADATA
service.name=${m.environment||"unknown"}
user.id=${m.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,$=o.current.map(L=>{let u=H(L,m),R=u["@timestamp"],D=u.log?.level||"info",U=u.event?.category?.[0]||"unknown",w=`[${R}] ${D} ${U}`;return u.message&&(w+=` | message="${u.message}"`),u.http?.request?.method&&(w+=` | req.method=${u.http.request.method}`),u.url?.full&&(w+=` | url=${u.url.full}`),u.http?.response?.status_code&&(w+=` | res.status=${u.http.response.status_code}`),u.error?.message&&(w+=` | error="${u.error.message}"`),w});l=b+$.join(`
`),f="text/plain",d=i||P("ai-txt",{},n);}else l=(e.current?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${r(e.current)}
${"=".repeat(80)}

`:"")+o.current.map(b=>`[${b.time}] ${b.type}
${r(b)}
${"=".repeat(80)}`).join(`
`),f="text/plain";return J.downloadWithFallback(l,d,f),d}}function co(o,e,r,s){return async a=>{let i=a;if(!i)return {success:false,error:"No endpoint configured"};try{s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},d={metadata:e.current,logs:o.current,fileName:P("json",{},n)},l=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:r(d)});if(!l.ok)throw new Error(`Upload failed: ${l.status}`);return {success:!0,data:await l.json()}}catch(n){let d=n instanceof Error?n.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",n),{success:false,error:d}}}}function ae(o={}){let e={...Me,...o},r=useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});useEffect(()=>{r.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let s=useRef([]),a=useRef(e.sessionId||ro()),i=useRef(to(a.current,e.environment,e.userId,0)),[n,d]=useState(0),l=useRef(0),f=useRef(false),m=useMemo(()=>ao(),[]),b=useMemo(()=>new be,[]),$=useMemo(()=>new me({excludeUrls:e.excludeUrls}),[e.excludeUrls]),L=useMemo(()=>new ye({excludeUrls:e.excludeUrls}),[e.excludeUrls]),u=useMemo(()=>so({logsRef:s,metadataRef:i,errorCountRef:l},{maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount??5,sanitizeKeys:e.sanitizeKeys,environment:e.environment,userId:e.userId},m,d),[e,m,d]),R=u.addLog,D=u.updateMetadata,U=useMemo(()=>lo(s,i,m,D),[m,D]),w=useMemo(()=>co(s,i,m,D),[m,D]);useEffect(()=>{if(typeof window>"u"||f.current)return;if(f.current=true,e.enablePersistence)try{let y=localStorage.getItem(e.persistenceKey);y&&(s.current=JSON.parse(y),d(s.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let Y=[];if(e.captureConsole&&(b.attach(),b.onLog((y,h)=>{let x=h.map(T=>{if(typeof T=="object")try{return m(T)}catch{return String(T)}return String(T)}).join(" ");R({type:"CONSOLE",level:y.toUpperCase(),time:new Date().toISOString(),data:x.substring(0,5e3)});}),Y.push(()=>b.detach())),e.captureFetch){let y=new Map;$.onFetchRequest((h,x)=>{let T=se(),S=null;if(x?.body)try{S=typeof x.body=="string"?JSON.parse(x.body):x.body,S=fe(S,{keys:e.sanitizeKeys});}catch{S=String(x.body).substring(0,1e3);}y.set(T,{url:h,method:x?.method||"GET",headers:Oe(x?.headers,e.sanitizeKeys),body:S}),R({type:"FETCH_REQ",id:T,url:h,method:x?.method||"GET",headers:Oe(x?.headers,e.sanitizeKeys),body:S,time:new Date().toISOString()});}),$.onFetchResponse((h,x,T)=>{for(let[S,De]of y.entries())if(De.url===h){y.delete(S),R({type:"FETCH_RES",id:S,url:h,status:x,statusText:"",duration:`${T}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),$.onFetchError((h,x)=>{for(let[T,S]of y.entries())if(S.url===h){y.delete(T),R({type:"FETCH_ERR",id:T,url:h,error:x.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),$.attach(),Y.push(()=>$.detach());}return e.captureXHR&&(L.onXHRRequest(y=>{R({type:"XHR_REQ",id:se(),url:y.url,method:y.method,headers:y.headers,body:y.body,time:new Date().toISOString()});}),L.onXHRResponse((y,h,x)=>{R({type:"XHR_RES",id:se(),url:y.url,status:h,statusText:"",duration:`${x}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),L.onXHRError((y,h)=>{R({type:"XHR_ERR",id:se(),url:y.url,error:h.message,duration:"[unknown]ms",time:new Date().toISOString()});}),L.attach(),Y.push(()=>L.detach())),()=>{Y.forEach(y=>y()),f.current=false;}},[e,R,m,b,$,L]);let Ee=useCallback(()=>{if(s.current=[],d(0),l.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),V=useCallback(()=>[...s.current],[]),Le=useCallback(()=>n,[n]),F=useCallback(()=>(D(),{...i.current}),[D]);return {downloadLogs:U,uploadLogs:w,clearLogs:Ee,getLogs:V,getLogCount:Le,getMetadata:F,sessionId:a.current}}function bo(){let[o,e]=useState(false),[r,s]=useState(false),a=useRef(o);a.current=o;let i=useRef(null);useEffect(()=>{s(J.isSupported());},[]);let n=useCallback(()=>{e(f=>!f);},[]),d=useCallback(()=>{e(true);},[]),l=useCallback(()=>{e(false);},[]);return useEffect(()=>{let f=b=>{b.ctrlKey&&b.shiftKey&&b.key==="D"&&(b.preventDefault(),n()),b.key==="Escape"&&a.current&&(b.preventDefault(),l());};document.addEventListener("keydown",f);let m=b=>{typeof b.detail?.visible=="boolean"&&(i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{e(b.detail.visible);},10));};return window.addEventListener("glean-debug-toggle",m),()=>{document.removeEventListener("keydown",f),window.removeEventListener("glean-debug-toggle",m);}},[n,l]),{isOpen:o,toggle:n,open:d,close:l,supportsDirectoryPicker:r}}var mo="debug-panel-copy-format",ot=["json","ecs.json","ai.txt"];function he(){let[o,e]=useState(()=>{if(typeof window<"u"){let r=localStorage.getItem(mo);if(r&&ot.includes(r))return r}return "ecs.json"});return useEffect(()=>{localStorage.setItem(mo,o);},[o]),{copyFormat:o,setCopyFormat:e}}function yo(){let[o,e]=useState(null),[r,s]=useState(null),[a,i]=useState(null),[n,d]=useState(false);return useEffect(()=>{if(o){let l=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(l)}},[o]),useEffect(()=>{if(r){let l=setTimeout(()=>{s(null);},3e3);return ()=>clearTimeout(l)}},[r]),useEffect(()=>{if(a){let l=setTimeout(()=>{i(null);},3e3);return ()=>clearTimeout(l)}},[a]),{uploadStatus:o,setUploadStatus:e,directoryStatus:r,setDirectoryStatus:s,copyStatus:a,setCopyStatus:i,showSettings:n,setShowSettings:d}}function xo(){let[o,e]=useState(false),r=useCallback(()=>{e(true);},[]),s=useCallback(()=>{e(false);},[]),a=useCallback(()=>{e(i=>!i);},[]);return {isSettingsOpen:o,openSettings:r,closeSettings:s,toggleSettings:a}}var t={glassBg:"rgba(255, 255, 255, 0.75)",glassBorder:"rgba(255, 255, 255, 0.4)",glassShadow:"0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",colors:{primary:"#1a1a2e",secondary:"#4a5568",muted:"#a0aec0",border:"rgba(0, 0, 0, 0.06)",success:"#059669",successBg:"rgba(5, 150, 105, 0.08)",successBorder:"rgba(5, 150, 105, 0.2)",error:"#dc2626",errorBg:"rgba(220, 38, 38, 0.06)",errorBorder:"rgba(220, 38, 38, 0.15)",warning:"#d97706",accent:"#0ea5e9",accentBg:"rgba(14, 165, 233, 0.08)",accentBorder:"rgba(14, 165, 233, 0.2)"},fonts:{display:'-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',mono:'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'},space:{xs:"4px",sm:"8px",md:"12px",lg:"16px"},radius:{sm:"6px",md:"10px",lg:"16px",full:"9999px"},transitions:{fast:"0.15s ease",normal:"0.25s cubic-bezier(0.4, 0, 0.2, 1)",slow:"0.4s cubic-bezier(0.4, 0, 0.2, 1)"}},ze=css`
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
`,wo=css`
  position: absolute;
  top: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  background: ${t.colors.error};
  border: 2px solid ${t.colors.primary};
  border-radius: ${t.radius.full};
  box-shadow: 0 1px 4px rgba(220, 38, 38, 0.4);
`;css`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${t.radius.full};
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(4px);
`;css`
  background: ${t.colors.error};
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${t.radius.full};
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
`;var He=css`
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
`,Ae=css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${t.space.lg};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
  border-bottom: 1px solid ${t.colors.border};
`,So=css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`,_e=css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${t.colors.primary};
  letter-spacing: -0.01em;
`,rt=css`
  margin: 0;
  font-size: 11px;
  color: ${t.colors.muted};
  font-family: ${t.fonts.mono};
  font-weight: 500;
`,je=css`
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
`,Be=css`
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
`,ve=css`
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
`,nt=css`
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
`;css`
  display: flex;
  justify-content: space-between;
  gap: ${t.space.md};
  padding: ${t.space.xs} 0;
  border-bottom: 1px solid ${t.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;var st=css`
  color: ${t.colors.muted};
  font-weight: 500;
`,at=css`
  color: ${t.colors.primary};
  font-weight: 500;
  text-align: right;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,Ue=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: ${t.colors.border};
`,ie=css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${t.space.lg};
  background: rgba(255, 255, 255, 0.6);
  gap: ${t.space.xs};
`,le=css`
  font-size: 28px;
  font-weight: 700;
  color: ${t.colors.primary};
  line-height: 1;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`,ce=css`
  font-size: 10px;
  font-weight: 600;
  color: ${t.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`,vo=css`
  color: ${t.colors.error};
`,ko=css`
  color: ${t.colors.warning};
`,z={warmCream:"rgba(255, 252, 245, 0.85)",warmGray:"#4a4543",warmMuted:"#8a857f",copperAccent:"#c17f59",copperSubtle:"rgba(193, 127, 89, 0.12)"},ho=css`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Source+Sans+3:wght@400;500;600&display=swap');

  font-family: 'Source Sans 3', ${t.fonts.display};
  padding: ${t.space.md} ${t.space.lg};
  background: ${z.warmCream};
  border-bottom: 1px solid rgba(74, 69, 67, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
`,Se=css`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${t.space.sm};
  width: 100%;
  padding: ${t.space.sm} 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 600;
  color: ${z.warmGray};
  text-transform: none;
  letter-spacing: 0.02em;
  transition: color ${t.transitions.normal};

  &:hover {
    color: ${z.copperAccent};
  }

  &:focus-visible {
    outline: 2px solid ${z.copperAccent};
    outline-offset: 2px;
    border-radius: 4px;
  }
`,it=css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${z.copperSubtle};
  border-radius: ${t.radius.sm};
  color: ${z.copperAccent};
  transition: all ${t.transitions.normal};

  ${Se}:hover & {
    background: ${z.copperAccent};
    color: #ffffff;
  }
`;css`
  transition: transform ${t.transitions.slow};

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
  margin-left: ${t.space.md};
  transition: opacity ${t.transitions.normal};
`;css`
  overflow: hidden;
  transition:
    height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s ease;
`;var lt=css`
  padding-top: ${t.space.md};
`;css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${t.space.md};
  padding: ${t.space.xs} 0;
  font-size: 13px;
  line-height: 1.6;
`;var ct=css`
  font-weight: 600;
  color: ${z.warmMuted};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-size: 13px;
  min-width: 100px;
`,dt=css`
  font-weight: 500;
  color: ${z.warmGray};
  text-align: right;
  flex: 1;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
`,pt=css`
  font-weight: 500;
  color: ${z.warmGray};
  text-align: right;
  flex: 1;
  font-family: ${t.fonts.mono};
  font-size: 13px;
  background: rgba(0, 0, 0, 0.03);
  padding: 3px 8px;
  border-radius: 4px;
`,qe=css`
  padding: ${t.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${t.space.lg};
  background: rgba(255, 255, 255, 0.3);
`,ke=css`
  display: flex;
  flex-direction: column;
  gap: ${t.space.sm};
`,de=css`
  font-size: 10px;
  font-weight: 600;
  color: ${t.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${t.space.sm};
`;var Ce=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${t.space.sm};
`,pe=css`
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
`;css`
  ${pe}
`;var ut=css`
  ${pe}
  background: ${t.colors.accentBg};
  border-color: ${t.colors.accentBorder};
  color: ${t.colors.accent};

  &:hover:not(:disabled) {
    background: ${t.colors.accent};
    color: #ffffff;
    border-color: ${t.colors.accent};
  }
`,Xe=css`
  ${pe}
  background: ${t.colors.successBg};
  border-color: ${t.colors.successBorder};
  color: ${t.colors.success};

  &:hover:not(:disabled) {
    background: ${t.colors.success};
    color: #ffffff;
    border-color: ${t.colors.success};
  }
`,gt=css`
  ${pe}
  background: ${t.colors.errorBg};
  border-color: ${t.colors.errorBorder};
  color: ${t.colors.error};

  &:hover:not(:disabled) {
    background: ${t.colors.error};
    color: #ffffff;
    border-color: ${t.colors.error};
  }
`,A=css`
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
`,ft=css`
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
`,Co=css`
  display: flex;
  flex-direction: column;
  gap: ${t.space.xs};
  padding: 0 ${t.space.lg} ${t.space.sm};
`,Ke=css`
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
`,Ge=css`
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
`,$o=css`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,Je=css`
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
`,We=css`
  font-size: 11px;
  color: ${t.colors.muted};
`,bt=css`
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
`,mt=css`
  padding: ${t.space.sm} ${t.space.md};
  font-size: 10px;
  font-weight: 600;
  color: ${t.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid ${t.colors.border};
`,Ro=css`
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
`,yt=css`
  ${Ro}
  background: rgba(0, 0, 0, 0.04);
  color: ${t.colors.primary};
`;css`
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

    ${Ae} {
      background: linear-gradient(135deg, rgba(40, 40, 60, 0.8) 0%, rgba(30, 30, 46, 0.6) 100%);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${_e} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${rt} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${je} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
    }

    ${Be} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(220, 38, 38, 0.2);
        color: #f87171;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
      }
    }

    ${ve} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(14, 165, 233, 0.15);
        color: #38bdf8;
        box-shadow: 0 2px 8px rgba(14, 165, 233, 0.25);
      }
    }

    ${nt} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${st} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${at} {
      color: rgba(255, 255, 255, 0.9);
    }

    ${Ue} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${ie} {
      background: rgba(40, 40, 60, 0.5);
    }

    ${le} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${ce} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${ho} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Se} {
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

    ${de} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${pe} {
      background: rgba(50, 50, 70, 0.8);
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);

      &:hover:not(:disabled) {
        background: rgba(60, 60, 85, 0.9);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }

    ${ut} {
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

    ${gt},
    ${ft} {
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

    ${ze} {
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

    ${bt} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${mt} {
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Ro} {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    ${yt} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }

    ${ho} {
      background: rgba(40, 40, 60, 0.5);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Se} {
      color: rgba(255, 255, 255, 0.75);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${it} {
      background: rgba(193, 127, 89, 0.18);
      color: rgba(193, 127, 89, 0.9);

      ${Se}:hover & {
        background: rgba(193, 127, 89, 0.9);
        color: #ffffff;
      }
    }

    ${ct} {
      color: rgba(255, 255, 255, 0.5);
    }

    ${dt} {
      color: rgba(255, 255, 255, 0.85);
    }

    ${pt} {
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;function $t({metadata:o}){let e={display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:"12px",padding:"4px 0",fontSize:13,lineHeight:1.6},r={fontWeight:600,color:"#8a857f",textTransform:"uppercase",letterSpacing:"0.3px",fontSize:13,minWidth:100},s={fontWeight:500,color:"#4a4543",textAlign:"right",flex:1,fontSize:14},a={fontWeight:500,color:"#4a4543",textAlign:"right",flex:1,fontFamily:'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',fontSize:13,background:"rgba(0, 0, 0, 0.03)",padding:"3px 8px",borderRadius:4};return jsxs("div",{style:{minWidth:220,background:"var(--glass-bg, rgba(255,255,255,0.95))",backdropFilter:"blur(20px)",borderRadius:10,padding:12,boxShadow:"0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",animation:"gleanDropdownIn 0.15s ease-out"},children:[jsx("div",{style:{padding:"6px 8px 8px",fontSize:10,fontWeight:600,color:"var(--muted, #a0aec0)",textTransform:"uppercase",letterSpacing:"0.08em"},children:"Session Details"}),jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[jsxs("div",{style:e,children:[jsx("span",{style:r,children:"User"}),jsx("span",{style:s,children:o.userId||"Anonymous"})]}),jsxs("div",{style:e,children:[jsx("span",{style:r,children:"Session ID"}),jsx("span",{style:a,children:o.sessionId||"N/A"})]}),jsxs("div",{style:e,children:[jsx("span",{style:r,children:"Browser"}),jsxs("span",{style:s,children:[o.browser," \xB7 ",o.platform]})]}),jsxs("div",{style:e,children:[jsx("span",{style:r,children:"Screen"}),jsx("span",{style:s,children:o.screenResolution})]}),jsxs("div",{style:e,children:[jsx("span",{style:r,children:"Timezone"}),jsx("span",{style:s,children:o.timezone})]}),jsxs("div",{style:e,children:[jsx("span",{style:r,children:"Language"}),jsx("span",{style:s,children:o.language})]}),jsxs("div",{style:e,children:[jsx("span",{style:r,children:"Viewport"}),jsx("span",{style:s,children:o.viewport})]})]})]})}function Rt({copyFormat:o,setCopyFormat:e,onSaveToDirectory:r,onCloseDropdown:s}){let a=["json","ecs.json","ai.txt"],i={json:jsx(FileJson,{size:14}),"ecs.json":jsx(FileText,{size:14}),"ai.txt":jsx(FileText,{size:14})};return jsxs("div",{style:{minWidth:180,background:"var(--glass-bg, rgba(255,255,255,0.95))",backdropFilter:"blur(20px)",borderRadius:10,padding:8,boxShadow:"0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",animation:"gleanDropdownIn 0.15s ease-out"},children:[jsx("div",{style:{padding:"8px 10px 6px",fontSize:10,fontWeight:600,color:"var(--muted, #a0aec0)",textTransform:"uppercase",letterSpacing:"0.08em"},children:"Copy Format"}),jsx("div",{style:{display:"flex",flexDirection:"column",gap:2},children:a.map(n=>jsxs("button",{type:"button",onClick:()=>{e(n),s();},style:{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",textAlign:"left",background:o===n?"var(--primary-bg, rgba(14,165,233,0.08))":"transparent",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,color:o===n?"var(--accent, #0ea5e9)":"var(--secondary, #4a5568)",transition:"all 0.12s ease"},children:[i[n],jsxs("span",{style:{flex:1},children:[n==="json"&&"JSON",n==="ecs.json"&&"ECS (AI)",n==="ai.txt"&&"AI-TXT"]}),o===n&&jsx("span",{children:"\u2713"})]},n))}),jsx("div",{style:{borderTop:"1px solid var(--border-color, rgba(0,0,0,0.06))",margin:"8px 0"}}),jsxs("button",{type:"button",onClick:()=>{r(),s();},style:{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",textAlign:"left",background:"transparent",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,color:"var(--secondary, #4a5568)",transition:"all 0.12s ease"},children:[jsx(Save,{size:14}),jsx("span",{children:"Save to Folder"})]})]})}var Lo=forwardRef(function({metadata:e,onClose:r,onSaveToDirectory:s,onClear:a,isSettingsOpen:i,openSettings:n,closeSettings:d,isSessionDetailsOpen:l,openSessionDetails:f,closeSessionDetails:m},b){let{copyFormat:$,setCopyFormat:L}=he();return jsx(Fragment,{children:jsxs("div",{className:Ae,children:[jsx("div",{className:So,children:jsx("h3",{className:_e,children:"Debug"})}),jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsx("button",{type:"button",onClick:a,className:Be,"aria-label":"Clear all logs",title:"Clear logs",children:jsx(Trash2,{size:16})}),jsxs(M.Root,{open:l,onOpenChange:u=>{u?f():m();},children:[jsx(M.Trigger,{asChild:true,children:jsx("button",{type:"button",className:ve,"aria-label":"Session details",title:"Session details",children:jsx(Info,{size:16})})}),jsx(M.Portal,{children:jsx(M.Content,{sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:u=>{u.target.closest("#debug-panel")&&u.preventDefault();},children:jsx($t,{metadata:e})})})]}),jsxs(M.Root,{open:i,onOpenChange:u=>{console.log("[DebugPanelHeader] Dropdown onOpenChange:",u),u?n():d();},children:[jsx(M.Trigger,{asChild:true,children:jsx("button",{type:"button",className:ve,"aria-label":"Actions and settings",title:"Actions and settings","data-settings-trigger":"true",children:jsx(Settings,{size:16})})}),jsx(M.Portal,{children:jsx(M.Content,{"data-settings-dropdown":"true",sideOffset:6,align:"end",style:{zIndex:1e5},onPointerDownOutside:u=>{u.target.closest("#debug-panel")&&u.preventDefault();},children:jsx(Rt,{copyFormat:$,setCopyFormat:L,onSaveToDirectory:s,onCloseDropdown:()=>d()})})})]}),jsx("button",{ref:b,type:"button",onClick:r,className:je,"aria-label":"Close debug panel",children:jsx(X,{size:18})})]})]})})});function Do({logCount:o,errorCount:e,networkErrorCount:r}){return jsxs("div",{className:Ue,children:[jsxs("div",{className:ie,children:[jsx("div",{className:le,children:o.toLocaleString()}),jsx("div",{className:ce,children:"Logs"})]}),jsxs("div",{className:ie,children:[jsx("div",{className:`${le} ${vo}`,children:e.toLocaleString()}),jsx("div",{className:ce,children:"Errors"})]}),jsxs("div",{className:ie,children:[jsx("div",{className:`${le} ${ko}`,children:r.toLocaleString()}),jsx("div",{className:ce,children:"Network"})]})]})}function _({children:o,content:e,disabled:r,...s}){return jsx(O.Provider,{delayDuration:200,skipDelayDuration:100,children:jsxs(O.Root,{children:[jsx(O.Trigger,{asChild:true,children:jsx("button",{type:"button",disabled:r,...s,children:o})}),!r&&jsx(O.Portal,{children:jsxs(O.Content,{side:"top",sideOffset:6,align:"center",style:{background:"var(--color-primary, #1a1a2e)",color:"white",padding:"6px 12px",borderRadius:"6px",fontSize:"11px",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",zIndex:1e5},children:[e,jsx(O.Arrow,{style:{fill:"var(--color-primary, #1a1a2e)"}})]})})]})})}function Io({logCount:o,hasUploadEndpoint:e,isUploading:r,getFilteredLogCount:s,onCopyFiltered:a,onDownload:i,onCopy:n,onUpload:d}){let l=o===0;return jsxs("div",{className:qe,children:[jsxs("div",{className:ke,children:[jsx("div",{className:de,children:"Copy Filtered"}),jsxs("div",{className:Ce,children:[jsxs(_,{content:"Copy only console logs",disabled:l||s("logs")===0,onClick:()=>a("logs"),className:A,"aria-label":"Copy only console logs",children:[jsx(Terminal,{size:18}),"Logs"]}),jsxs(_,{content:"Copy only errors",disabled:l||s("errors")===0,onClick:()=>a("errors"),className:A,"aria-label":"Copy only errors",children:[jsx(AlertCircle,{size:18}),"Errors"]}),jsxs(_,{content:"Copy only network requests",disabled:l||s("network")===0,onClick:()=>a("network"),className:A,"aria-label":"Copy only network requests",children:[jsx(Globe,{size:18}),"Network"]})]})]}),jsxs("div",{className:ke,children:[jsx("div",{className:de,children:"Export"}),jsxs("div",{className:Ce,children:[jsxs(_,{content:"Download as JSON",disabled:l,onClick:()=>i("json"),className:A,"aria-label":"Download as JSON",children:[jsx(FileJson,{size:18}),"JSON"]}),jsxs(_,{content:"Download as TXT",disabled:l,onClick:()=>i("txt"),className:A,"aria-label":"Download as TXT",children:[jsx(FileText,{size:18}),"TXT"]}),jsxs(_,{content:"Download as JSONL",disabled:l,onClick:()=>i("jsonl"),className:A,"aria-label":"Download as JSONL",children:[jsx(Database,{size:18}),"JSONL"]})]})]}),jsxs("div",{className:ke,children:[jsx("div",{className:de,children:"Actions"}),jsxs("div",{className:Ce,children:[jsxs(_,{content:"Copy all to clipboard",disabled:l,onClick:n,className:A,"aria-label":"Copy all to clipboard",children:[jsx(Copy,{size:18}),"Copy"]}),jsxs(_,{content:"Download AI-optimized format",disabled:l,onClick:()=>i("ai.txt"),className:A,"aria-label":"Download AI-optimized format",children:[jsx(FileText,{size:18}),"AI-TXT"]}),e?jsxs(_,{content:"Upload logs to server",disabled:r,onClick:d,className:Xe,"aria-label":"Upload logs to server",children:[jsx(CloudUpload,{size:18}),r?"Uploading...":"Upload"]}):jsx("div",{})]})]})]})}function Ve({status:o}){return jsxs("div",{"aria-live":"polite",className:o.type==="success"?Ke:Ge,children:[o.type==="success"?jsx(CheckCircle2,{size:14}):jsx(AlertCircle,{size:14}),jsx("span",{className:$o,children:o.message})]})}function Mo({uploadStatus:o,directoryStatus:e,copyStatus:r}){return jsxs("div",{className:Co,children:[o&&jsx(Ve,{status:o}),e&&jsx(Ve,{status:e}),r&&jsx(Ve,{status:r})]})}function No(){return jsx("div",{className:Je,children:jsxs("div",{className:We,children:["Press ",jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function zo(o,e){switch(e){case "logs":return o.filter(r=>r.type==="CONSOLE");case "errors":return o.filter(r=>r.type==="CONSOLE"&&r.level==="error");case "network":return o.filter(r=>r.type==="FETCH_REQ"||r.type==="FETCH_RES"||r.type==="XHR_REQ"||r.type==="XHR_RES");case "networkErrors":return o.filter(r=>r.type==="FETCH_ERR"||r.type==="XHR_ERR");default:return o}}function Qe({user:o,environment:e="production",uploadEndpoint:r,fileNameTemplate:s="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:a=2e3,showInProduction:i=false}){let{isOpen:n,open:d,close:l}=bo(),{isSettingsOpen:f,openSettings:m,closeSettings:b}=xo(),{copyFormat:$}=he(),[L,u]=useState(false),R=useCallback(()=>{u(true);},[]),D=useCallback(()=>{u(false);},[]),{uploadStatus:U,setUploadStatus:w,directoryStatus:Ee,setDirectoryStatus:V,copyStatus:Le,setCopyStatus:F}=yo(),Y=useRef(null),y=useRef(null),{downloadLogs:h,uploadLogs:x,clearLogs:T,getLogs:S,getLogCount:De,getMetadata:ne}=ae({fileNameTemplate:s,environment:e,userId:o?.id||o?.email||"guest",includeMetadata:true,uploadEndpoint:r,maxLogs:a,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),Ze=De(),q=ne();useEffect(()=>{if(q.errorCount>=5&&r){let g=async()=>{try{await x();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",g),()=>window.removeEventListener("error",g)}},[q.errorCount,r,x]);let ge=useCallback((g,I)=>{if($==="json")return JSON.stringify({metadata:I,logs:g},null,2);if($==="ecs.json"){let X=g.map(Z=>H(Z,I)),Q={metadata:G(I),logs:X};return JSON.stringify(Q,null,2)}else if($==="ai.txt"){let X=`# METADATA
service.name=${I.environment||"unknown"}
user.id=${I.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,Q=g.map(Z=>{let E=H(Z,I),eo=E["@timestamp"],oo=E["log.level"],Go=E["event.category"]?.[0]||"unknown",ee=`[${eo}] ${oo} ${Go}`;return E.message&&(ee+=` | message="${E.message}"`),E.http?.request?.method&&(ee+=` | req.method=${E.http.request.method}`),E.url?.full&&(ee+=` | url=${E.url.full}`),E.http?.response?.status_code&&(ee+=` | res.status=${E.http.response.status_code}`),E.error?.message&&(ee+=` | error="${E.error.message}"`),ee});return X+Q.join(`
`)}return JSON.stringify({metadata:I,logs:g},null,2)},[$]),jo=useCallback(async()=>{w(null);try{let g=await x();g.success?(w({type:"success",message:`Uploaded successfully! ${g.data?JSON.stringify(g.data):""}`}),g.data&&typeof g.data=="object"&&"url"in g.data&&await navigator.clipboard.writeText(String(g.data.url))):w({type:"error",message:`Upload failed: ${g.error}`});}catch(g){w({type:"error",message:`Error: ${g instanceof Error?g.message:"Unknown error"}`});}},[x,w]),Bo=useCallback(g=>{let I=h(g);I&&w({type:"success",message:`Downloaded: ${I}`});},[h,w]),Uo=useCallback(async()=>{V(null);try{await h("json",void 0,{showPicker:!0})&&V({type:"success",message:"Saved to directory"});}catch{V({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[h,V]),qo=useCallback(async()=>{F(null);try{let g=S(),I=ne(),X=ge(g,I);await navigator.clipboard.writeText(X),F({type:"success",message:"Copied to clipboard!"});}catch{F({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[S,ne,ge,F]),Xo=useCallback(async g=>{F(null);try{let I=S(),X=ne(),Q=zo(I,g),Z=Q.length;if(Z===0){F({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[g]});return}let E=ge(Q,X);await navigator.clipboard.writeText(E),F({type:"success",message:`Copied ${Z} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[g]} to clipboard`});}catch{F({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[S,ne,ge,F]),Ko=useCallback(g=>zo(S(),g).length,[S]);return i||e==="development"||o?.role==="admin"?jsxs(Fragment,{children:[jsxs(motion.button,{type:"button",onClick:g=>{g.stopPropagation(),n?l():d();},className:ze,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",whileHover:{scale:1.02},whileTap:{scale:.98},layout:true,children:[jsx(Bug,{size:18}),q.errorCount>0&&jsx(motion.span,{className:wo,initial:{scale:0},animate:{scale:1}},`err-${q.errorCount}`)]}),jsx(AnimatePresence,{mode:"wait",children:n&&jsx(motion.div,{ref:Y,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:He,initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:20,scale:.95},transition:{duration:.25,ease:[.4,0,.2,1]},children:jsxs(B.Root,{className:"glean-scroll-area",style:{flex:1,overflow:"hidden"},children:[jsxs(B.Viewport,{className:"glean-scroll-viewport",style:{width:"100%",height:"100%"},children:[jsx(Lo,{metadata:q,onClose:l,onSaveToDirectory:Uo,onClear:()=>{confirm("Clear all logs?")&&T();},ref:y,isSettingsOpen:f,openSettings:m,closeSettings:b,isSessionDetailsOpen:L,openSessionDetails:R,closeSessionDetails:D}),jsx(Do,{logCount:Ze,errorCount:q.errorCount,networkErrorCount:q.networkErrorCount}),jsx(Io,{logCount:Ze,hasUploadEndpoint:!!r,isUploading:false,getFilteredLogCount:Ko,onCopyFiltered:Xo,onDownload:Bo,onCopy:qo,onUpload:jo}),jsx(Mo,{uploadStatus:U,directoryStatus:Ee,copyStatus:Le}),jsx(No,{})]}),jsx(B.Scrollbar,{className:"glean-scrollbar",orientation:"vertical",style:{display:"flex",width:"6px",userSelect:"none",touchAction:"none",padding:"2px",background:"transparent"},children:jsx(B.Thumb,{className:"glean-scrollbar-thumb",style:{flex:1,background:"rgba(0, 0, 0, 0.15)",borderRadius:"3px",transition:"background 0.15s ease"}})})]})})})]}):null}function qt({fileNameTemplate:o="debug_{timestamp}"}){let[e,r]=useState(false),{downloadLogs:s,clearLogs:a,getLogCount:i}=ae({fileNameTemplate:o}),n=i();return jsxs(Fragment,{children:[jsx("button",{onClick:()=>r(d=>!d),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsx("span",{children:n})}),e&&jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsx("button",{onClick:()=>s("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsx("button",{onClick:()=>{confirm("Clear all logs?")&&a();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsx("button",{onClick:()=>r(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function Jt(o){return useMemo(()=>o.showInProduction||o.environment==="development"||o.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[o.showInProduction,o.environment,o.user])}function Wt(){let o=useCallback(r=>{try{typeof window<"u"&&(r?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:r}})));}catch{}},[]),e=useMemo(()=>typeof process<"u"&&true,[]);useEffect(()=>{if(typeof window>"u")return;let r=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>o(true),hide:()=>o(false),toggle:()=>{try{let s=localStorage.getItem("glean-debug-enabled")==="true";o(!s);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=r,()=>{typeof window<"u"&&window.glean===r&&delete window.glean;}},[o,e]);}function _o(o){let e=Jt(o);return Wt(),e?jsx(Qe,{...o}):null}export{Qe as DebugPanel,qt as DebugPanelMinimal,_o as GleanDebugger,to as collectMetadata,Ie as filterStackTrace,er as generateExportFilename,P as generateFilename,ro as generateSessionId,Te as getBrowserInfo,fe as sanitizeData,K as sanitizeFilename,G as transformMetadataToECS,H as transformToECS,ae as useLogRecorder};