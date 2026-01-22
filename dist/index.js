'use strict';var react=require('react'),framerMotion=require('framer-motion'),goober=require('goober'),lucideReact=require('lucide-react'),jsxRuntime=require('react/jsx-runtime');// @ts-nocheck
var Ut=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function de(t,e={}){let o=e.keys||Ut;if(!t||typeof t!="object")return t;let s=Array.isArray(t)?[...t]:{...t},l=a=>{if(!a||typeof a!="object")return a;for(let n in a)if(Object.prototype.hasOwnProperty.call(a,n)){let c=n.toLowerCase();o.some(u=>c.includes(u.toLowerCase()))?a[n]="***REDACTED***":a[n]!==null&&typeof a[n]=="object"&&(a[n]=l(a[n]));}return a};return l(s)}function A(t){return t.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function ke(){if(typeof navigator>"u")return "unknown";let t=navigator.userAgent;return t.includes("Edg")?"edge":t.includes("Chrome")?"chrome":t.includes("Firefox")?"firefox":t.includes("Safari")?"safari":"unknown"}function Ze(t,e,o,s){if(typeof window>"u")return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:s,errorCount:0,networkErrorCount:0};let l=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",a=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:ke(),platform:navigator.platform,language:navigator.language,screenResolution:l,viewport:a,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:s,errorCount:0,networkErrorCount:0}}function et(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function F(t="json",e={},o={}){let{fileNameTemplate:s="{env}_{userId}_{sessionId}_{timestamp}",environment:l="development",userId:a="anonymous",sessionId:n="unknown"}=o,c=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],i=new Date().toISOString().split("T")[0],u=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),f=o.browser||ke(),p=o.platform||(typeof navigator<"u"?navigator.platform:"unknown"),m=(o.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",h=String(o.errorCount??e.errorCount??0),w=String(o.logCount??e.logCount??0),S=s.replace("{env}",A(l)).replace("{userId}",A(a??"anonymous")).replace("{sessionId}",A(n??"unknown")).replace("{timestamp}",c).replace("{date}",i).replace("{time}",u).replace(/\{errorCount\}/g,h).replace(/\{logCount\}/g,w).replace("{browser}",A(f)).replace("{platform}",A(p)).replace("{url}",A(m));for(let[U,E]of Object.entries(e))S=S.replace(`{${U}}`,String(E));return `${S}.${t}`}function Or(t,e="json"){let o=t.url.split("?")[0]||"unknown";return F(e,{},{environment:t.environment,userId:t.userId,sessionId:t.sessionId,browser:t.browser,platform:t.platform,url:o,errorCount:t.errorCount,logCount:t.logCount})}var At={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function tt(t){let e=parseFloat(t);return isNaN(e)?0:Math.round(e*1e6)}function qt(t){return At[t.toLowerCase()]||"info"}function Ce(t){return t.filter(e=>!e.ignored).slice(0,20)}function q(t){return {service:{environment:t.environment},user:t.userId?{id:t.userId}:void 0,host:{name:t.browser,type:t.platform}}}function N(t,e){let o={"@timestamp":t.time,event:{original:t,category:[]}},s=q(e);switch(Object.assign(o,s),t.type){case "CONSOLE":{o.log={level:qt(t.level)},o.message=t.data,o.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{o.http={request:{method:t.method}},o.url={full:t.url},o.event.category=["network","web"],o.event.action="request",o.event.id=t.id;break}case "FETCH_RES":case "XHR_RES":{o.http={response:{status_code:t.status}},o.url={full:t.url},o.event.duration=tt(t.duration),o.event.category=["network","web"],o.event.action="response",o.event.id=t.id;break}case "FETCH_ERR":case "XHR_ERR":{o.error={message:t.error},o.url={full:t.url},o.event.duration=tt(t.duration),o.event.category=["network","web"],o.event.action="error",o.event.id=t.id;let l=t;if(typeof l.body=="object"&&l.body!==null){let a=l.body;if(Array.isArray(a.frames)){let n=Ce(a.frames);o.error.stack_trace=n.map(c=>`  at ${c.functionName||"?"} (${c.filename||"?"}:${c.lineNumber||0}:${c.columnNumber||0})`).join(`
`);}}break}default:{o.message=JSON.stringify(t);break}}return o}var ue=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let o=this.originalConsole[e];console[e]=(...s)=>{this.callbacks.forEach(l=>{l(e,s);}),o(...s);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var pe=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o));}attach(){window.fetch=async(...e)=>{let[o,s]=e,l=o.toString();if(this.excludeUrls.some(n=>n.test(l)))return this.originalFetch(...e);let a=Date.now();this.onRequest.forEach(n=>n(l,s||{}));try{let n=await this.originalFetch(...e),c=Date.now()-a;return this.onResponse.forEach(i=>i(l,n.status,c)),n}catch(n){throw this.onError.forEach(c=>c(l,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var ge=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(o,s,l,a,n){let c=typeof s=="string"?s:s.href;if(e.requestTracker.set(this,{method:o,url:c,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(u=>u.test(c)))return e.originalOpen.call(this,o,s,l??true,a,n);let i=e.requestTracker.get(this);for(let u of e.onRequest)u(i);return e.originalOpen.call(this,o,s,l??true,a,n)},this.originalXHR.prototype.send=function(o){let s=e.requestTracker.get(this);if(s){s.body=o;let l=this.onload,a=this.onerror;this.onload=function(n){let c=Date.now()-s.startTime;for(let i of e.onResponse)i(s,this.status,c);l&&l.call(this,n);},this.onerror=function(n){for(let c of e.onError)c(s,new Error("XHR Error"));a&&a.call(this,n);};}return e.originalSend.call(this,o)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var Ee={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function ee(){return Math.random().toString(36).substring(7)}function Re(t,e){return de(t,{keys:e})}function rt(t,e,o,s){return {addLog:n=>{t.logsRef.current.push(n),t.logsRef.current.length>e.maxLogs&&t.logsRef.current.shift(),s(t.logsRef.current.length),n.type==="CONSOLE"?n.level==="ERROR"?t.errorCountRef.current++:t.errorCountRef.current=0:n.type==="FETCH_ERR"||n.type==="XHR_ERR"?t.errorCountRef.current++:t.errorCountRef.current=0;let c=e.uploadOnErrorCount??5;if(t.errorCountRef.current>=c&&e.uploadEndpoint){let i={metadata:{...t.metadataRef.current,logCount:t.logsRef.current.length},logs:t.logsRef.current,fileName:F("json",{},{fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.environment,userId:e.userId,sessionId:null})};fetch(e.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:o(i)}).catch(()=>{}),t.errorCountRef.current=0;}if(e.enablePersistence&&typeof window<"u")try{localStorage.setItem(e.persistenceKey,o(t.logsRef.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},updateMetadata:()=>{let n=t.logsRef.current.filter(i=>i.type==="CONSOLE").reduce((i,u)=>u.level==="ERROR"?i+1:i,0),c=t.logsRef.current.filter(i=>i.type==="FETCH_ERR"||i.type==="XHR_ERR").length;t.metadataRef.current={...t.metadataRef.current,logCount:t.logsRef.current.length,errorCount:n,networkErrorCount:c};}}}function ot(){return t=>{let e=new Set;return JSON.stringify(t,(o,s)=>{if(typeof s=="object"&&s!==null){if(e.has(s))return "[Circular]";e.add(s);}return s})}}function nt(t){return !t||t.length===0?"":t.map(e=>Xt(e)).join("")}function Xt(t){return JSON.stringify(t)+`
`}var X=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,o,s="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(o,{create:!0})).createWritable();await n.write(e),await n.close();}catch(l){if(l.name==="AbortError")return;throw l}}static download(e,o,s="application/json"){let l=new Blob([e],{type:s}),a=URL.createObjectURL(l),n=document.createElement("a");n.href=a,n.download=o,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(a);}static async downloadWithFallback(e,o,s="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,o,s);return}catch(l){if(l.name==="AbortError")return}this.download(e,o,s);}};X.supported=null;function st(t,e,o,s){return (l,a)=>{if(typeof window>"u")return null;s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},c=a||F(l,{},n),i,u;if(l==="json"){let f=e.current?{metadata:e.current,logs:t.current}:t.current;i=o(f),u="application/json";}else if(l==="jsonl"){let f=t.current.map(p=>N(p,e.current));i=nt(f),u="application/x-ndjson",c=a||F("jsonl",{},n);}else if(l==="ecs.json"){let f={metadata:q(e.current),logs:t.current.map(p=>N(p,e.current))};i=JSON.stringify(f,null,2),u="application/json",c=a||F("ecs-json",{},n);}else if(l==="ai.txt"){let f=e.current,p=`# METADATA
service.name=${f.environment||"unknown"}
user.id=${f.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,L=t.current.map(m=>{let h=N(m,f),w=h["@timestamp"],S=h.log?.level||"info",U=h.event?.category?.[0]||"unknown",E=`[${w}] ${S} ${U}`;return h.message&&(E+=` | message="${h.message}"`),h.http?.request?.method&&(E+=` | req.method=${h.http.request.method}`),h.url?.full&&(E+=` | url=${h.url.full}`),h.http?.response?.status_code&&(E+=` | res.status=${h.http.response.status_code}`),h.error?.message&&(E+=` | error="${h.error.message}"`),E});i=p+L.join(`
`),u="text/plain",c=a||F("ai-txt",{},n);}else i=(e.current?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${o(e.current)}
${"=".repeat(80)}

`:"")+t.current.map(p=>`[${p.time}] ${p.type}
${o(p)}
${"=".repeat(80)}`).join(`
`),u="text/plain";return X.downloadWithFallback(i,c,u),c}}function at(t,e,o,s){return async l=>{let a=l;if(!a)return {success:false,error:"No endpoint configured"};try{s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},c={metadata:e.current,logs:t.current,fileName:F("json",{},n)},i=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:o(c)});if(!i.ok)throw new Error(`Upload failed: ${i.status}`);return {success:!0,data:await i.json()}}catch(n){let c=n instanceof Error?n.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",n),{success:false,error:c}}}}function te(t={}){let e={...Ee,...t},o=react.useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});react.useEffect(()=>{o.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let s=react.useRef([]),l=react.useRef(e.sessionId||et()),a=react.useRef(Ze(l.current,e.environment,e.userId,0)),[n,c]=react.useState(0),i=react.useRef(0),u=react.useRef(false),f=react.useMemo(()=>ot(),[]),p=react.useMemo(()=>new ue,[]),L=react.useMemo(()=>new pe({excludeUrls:e.excludeUrls}),[e.excludeUrls]),m=react.useMemo(()=>new ge({excludeUrls:e.excludeUrls}),[e.excludeUrls]),h=react.useMemo(()=>rt({logsRef:s,metadataRef:a,errorCountRef:i},{maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount??5,sanitizeKeys:e.sanitizeKeys,environment:e.environment,userId:e.userId},f,c),[e,f,c]),w=h.addLog,S=h.updateMetadata,U=react.useMemo(()=>st(s,a,f,S),[f,S]),E=react.useMemo(()=>at(s,a,f,S),[f,S]);react.useEffect(()=>{if(typeof window>"u"||u.current)return;if(u.current=true,e.enablePersistence)try{let y=localStorage.getItem(e.persistenceKey);y&&(s.current=JSON.parse(y),c(s.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let O=[];if(e.captureConsole&&(p.attach(),p.onLog((y,x)=>{let b=x.map(v=>{if(typeof v=="object")try{return f(v)}catch{return String(v)}return String(v)}).join(" ");w({type:"CONSOLE",level:y.toUpperCase(),time:new Date().toISOString(),data:b.substring(0,5e3)});}),O.push(()=>p.detach())),e.captureFetch){let y=new Map;L.onFetchRequest((x,b)=>{let v=ee(),D=null;if(b?.body)try{D=typeof b.body=="string"?JSON.parse(b.body):b.body,D=de(D,{keys:e.sanitizeKeys});}catch{D=String(b.body).substring(0,1e3);}y.set(v,{url:x,method:b?.method||"GET",headers:Re(b?.headers,e.sanitizeKeys),body:D}),w({type:"FETCH_REQ",id:v,url:x,method:b?.method||"GET",headers:Re(b?.headers,e.sanitizeKeys),body:D,time:new Date().toISOString()});}),L.onFetchResponse((x,b,v)=>{for(let[D,Se]of y.entries())if(Se.url===x){y.delete(D),w({type:"FETCH_RES",id:D,url:x,status:b,statusText:"",duration:`${v}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),L.onFetchError((x,b)=>{for(let[v,D]of y.entries())if(D.url===x){y.delete(v),w({type:"FETCH_ERR",id:v,url:x,error:b.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),L.attach(),O.push(()=>L.detach());}return e.captureXHR&&(m.onXHRRequest(y=>{w({type:"XHR_REQ",id:ee(),url:y.url,method:y.method,headers:y.headers,body:y.body,time:new Date().toISOString()});}),m.onXHRResponse((y,x,b)=>{w({type:"XHR_RES",id:ee(),url:y.url,status:x,statusText:"",duration:`${b}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),m.onXHRError((y,x)=>{w({type:"XHR_ERR",id:ee(),url:y.url,error:x.message,duration:"[unknown]ms",time:new Date().toISOString()});}),m.attach(),O.push(()=>m.detach())),()=>{O.forEach(y=>y()),u.current=false;}},[e,w,f,p,L,m]);let G=react.useCallback(()=>{if(s.current=[],c(0),i.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),xe=react.useCallback(()=>[...s.current],[]),_=react.useCallback(()=>n,[n]),ve=react.useCallback(()=>(S(),{...a.current}),[S]);return {downloadLogs:U,uploadLogs:E,clearLogs:G,getLogs:xe,getLogCount:_,getMetadata:ve,sessionId:l.current}}function ut(){let[t,e]=react.useState(false),[o,s]=react.useState(false),l=react.useRef(t);l.current=t;let a=react.useRef(null);react.useEffect(()=>{s(X.isSupported());},[]);let n=react.useCallback(()=>{e(u=>!u);},[]),c=react.useCallback(()=>{e(true);},[]),i=react.useCallback(()=>{e(false);},[]);return react.useEffect(()=>{let u=p=>{p.ctrlKey&&p.shiftKey&&p.key==="D"&&(p.preventDefault(),n()),p.key==="Escape"&&l.current&&(p.preventDefault(),i());};document.addEventListener("keydown",u);let f=p=>{typeof p.detail?.visible=="boolean"&&(a.current&&clearTimeout(a.current),a.current=setTimeout(()=>{e(p.detail.visible);},10));};return window.addEventListener("glean-debug-toggle",f),()=>{document.removeEventListener("keydown",u),window.removeEventListener("glean-debug-toggle",f);}},[n,i]),{isOpen:t,toggle:n,open:c,close:i,supportsDirectoryPicker:o}}var pt="debug-panel-copy-format",Jt=["json","ecs.json","ai.txt"];function me(){let[t,e]=react.useState(()=>{if(typeof window<"u"){let o=localStorage.getItem(pt);if(o&&Jt.includes(o))return o}return "ecs.json"});return react.useEffect(()=>{localStorage.setItem(pt,t);},[t]),{copyFormat:t,setCopyFormat:e}}function gt(){let[t,e]=react.useState(null),[o,s]=react.useState(null),[l,a]=react.useState(null),[n,c]=react.useState(false);return react.useEffect(()=>{if(t){let i=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(i)}},[t]),react.useEffect(()=>{if(o){let i=setTimeout(()=>{s(null);},3e3);return ()=>clearTimeout(i)}},[o]),react.useEffect(()=>{if(l){let i=setTimeout(()=>{a(null);},3e3);return ()=>clearTimeout(i)}},[l]),{uploadStatus:t,setUploadStatus:e,directoryStatus:o,setDirectoryStatus:s,copyStatus:l,setCopyStatus:a,showSettings:n,setShowSettings:c}}var r={glassBg:"rgba(255, 255, 255, 0.75)",glassBorder:"rgba(255, 255, 255, 0.4)",glassShadow:"0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",colors:{primary:"#1a1a2e",secondary:"#4a5568",muted:"#a0aec0",border:"rgba(0, 0, 0, 0.06)",success:"#059669",successBg:"rgba(5, 150, 105, 0.08)",successBorder:"rgba(5, 150, 105, 0.2)",error:"#dc2626",errorBg:"rgba(220, 38, 38, 0.06)",errorBorder:"rgba(220, 38, 38, 0.15)",warning:"#d97706",accent:"#0ea5e9",accentBg:"rgba(14, 165, 233, 0.08)",accentBorder:"rgba(14, 165, 233, 0.2)"},fonts:{display:'-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',mono:'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'},space:{xs:"4px",sm:"8px",md:"12px",lg:"16px"},radius:{sm:"6px",md:"10px",lg:"16px",full:"9999px"},transitions:{fast:"0.15s ease",normal:"0.25s cubic-bezier(0.4, 0, 0.2, 1)"}},De=goober.css`
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
`,ft=goober.css`
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
`;var Te=goober.css`
  position: fixed;
  bottom: 90px;
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
`,Ie=goober.css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${r.space.lg};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
  border-bottom: 1px solid ${r.colors.border};
`,mt=goober.css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`,Oe=goober.css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${r.colors.primary};
  letter-spacing: -0.01em;
`,Fe=goober.css`
  margin: 0;
  font-size: 11px;
  color: ${r.colors.muted};
  font-family: ${r.fonts.mono};
  font-weight: 500;
`,re=goober.css`
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
  }
`,Ne=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: ${r.colors.border};
`,oe=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${r.space.lg};
  background: rgba(255, 255, 255, 0.6);
  gap: ${r.space.xs};
`,ne=goober.css`
  font-size: 28px;
  font-weight: 700;
  color: ${r.colors.primary};
  line-height: 1;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`,se=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`,bt=goober.css`
  color: ${r.colors.error};
`,yt=goober.css`
  color: ${r.colors.warning};
`,Me=goober.css`
  padding: ${r.space.md} ${r.space.lg};
  background: rgba(255, 255, 255, 0.4);
  border-bottom: 1px solid ${r.colors.border};
`,Pe=goober.css`
  display: flex;
  align-items: center;
  gap: ${r.space.sm};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: ${r.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  list-style: none;
  padding: ${r.space.sm} 0;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    color: ${r.colors.primary};
  }
`,He=goober.css`
  margin-top: ${r.space.md};
  padding: ${r.space.md};
  background: rgba(255, 255, 255, 0.5);
  border-radius: ${r.radius.md};
  font-size: 11px;
  color: ${r.colors.secondary};
  line-height: 1.7;

  & > div {
    display: flex;
    gap: ${r.space.sm};
    margin-bottom: ${r.space.xs};
  }

  strong {
    color: ${r.colors.primary};
    font-weight: 600;
    min-width: 70px;
  }
`,ze=goober.css`
  padding: ${r.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${r.space.lg};
  background: rgba(255, 255, 255, 0.3);
`,ye=goober.css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.sm};
`,ae=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;goober.css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${r.space.sm};
`;var he=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${r.space.sm};
`,ie=goober.css`
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;goober.css`
  ${ie}
`;var Vt=goober.css`
  ${ie}
  background: ${r.colors.accentBg};
  border-color: ${r.colors.accentBorder};
  color: ${r.colors.accent};

  &:hover:not(:disabled) {
    background: ${r.colors.accent};
    color: #ffffff;
    border-color: ${r.colors.accent};
  }
`,_e=goober.css`
  ${ie}
  background: ${r.colors.successBg};
  border-color: ${r.colors.successBorder};
  color: ${r.colors.success};

  &:hover:not(:disabled) {
    background: ${r.colors.success};
    color: #ffffff;
    border-color: ${r.colors.success};
  }
`,Wt=goober.css`
  ${ie}
  background: ${r.colors.errorBg};
  border-color: ${r.colors.errorBorder};
  color: ${r.colors.error};

  &:hover:not(:disabled) {
    background: ${r.colors.error};
    color: #ffffff;
    border-color: ${r.colors.error};
  }
`,M=goober.css`
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
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Yt=goober.css`
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
`,ht=goober.css`
  display: flex;
  flex-direction: column;
  gap: ${r.space.xs};
  padding: 0 ${r.space.lg} ${r.space.sm};
`,je=goober.css`
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
`,Ue=goober.css`
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
`,wt=goober.css`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,Ae=goober.css`
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
`,qe=goober.css`
  font-size: 11px;
  color: ${r.colors.muted};
`,Xe=goober.css`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${r.space.sm};
  min-width: 160px;
  background: ${r.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${r.glassBorder};
  border-radius: ${r.radius.md};
  box-shadow: ${r.glassShadow};
  z-index: 10000;
  overflow: hidden;
`,Be=goober.css`
  padding: ${r.space.sm} ${r.space.md};
  font-size: 10px;
  font-weight: 600;
  color: ${r.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid ${r.colors.border};
`,le=goober.css`
  display: flex;
  align-items: center;
  gap: ${r.space.sm};
  width: 100%;
  padding: ${r.space.sm} ${r.space.md};
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: ${r.colors.secondary};
  transition: all ${r.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`,Ke=goober.css`
  ${le}
  background: rgba(0, 0, 0, 0.04);
  color: ${r.colors.primary};
`;goober.css`
  @media (prefers-color-scheme: dark) {
    :root {
      --glass-bg: rgba(30, 30, 46, 0.85);
      --glass-border: rgba(255, 255, 255, 0.08);
    }

    ${Te} {
      background: rgba(30, 30, 46, 0.9);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    ${Ie} {
      background: linear-gradient(135deg, rgba(40, 40, 60, 0.8) 0%, rgba(30, 30, 46, 0.6) 100%);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Oe} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${Fe} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${re} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
    }

    ${Ne} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${oe} {
      background: rgba(40, 40, 60, 0.5);
    }

    ${ne} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${se} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Me} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Pe} {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${He} {
      background: rgba(40, 40, 60, 0.5);
      color: rgba(255, 255, 255, 0.6);

      strong {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    ${ze} {
      background: rgba(40, 40, 60, 0.3);
    }

    ${ae} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${ie} {
      background: rgba(50, 50, 70, 0.8);
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);

      &:hover:not(:disabled) {
        background: rgba(60, 60, 85, 0.9);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }

    ${Vt} {
      background: rgba(14, 165, 233, 0.15);
      border-color: rgba(14, 165, 233, 0.25);
      color: #38bdf8;

      &:hover:not(:disabled) {
        background: #0ea5e9;
        color: #ffffff;
        border-color: #0ea5e9;
      }
    }

    ${_e} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;

      &:hover:not(:disabled) {
        background: #059669;
        color: #ffffff;
        border-color: #059669;
      }
    }

    ${Wt},
    ${Yt} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;

      &:hover:not(:disabled) {
        background: #dc2626;
        color: #ffffff;
        border-color: #dc2626;
      }
    }

    ${je} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;
    }

    ${Ue} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;
    }

    ${Ae} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);

      kbd {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.5);
      }
    }

    ${qe} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${De} {
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

    ${Xe} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${Be} {
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${le} {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    ${Ke} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }
  }
`;var vt=react.forwardRef(function({sessionId:e,onClose:o,onSaveToDirectory:s,onClear:l},a){let{copyFormat:n,setCopyFormat:c}=me(),[i,u]=react.useState(false),f=react.useRef(null),p=["json","ecs.json","ai.txt"],L={json:jsxRuntime.jsx(lucideReact.FileJson,{size:14}),"ecs.json":jsxRuntime.jsx(lucideReact.FileText,{size:14}),"ai.txt":jsxRuntime.jsx(lucideReact.FileText,{size:14})};return react.useEffect(()=>{let m=h=>{f.current&&!f.current.contains(h.target)&&u(false);};return document.addEventListener("mousedown",m),()=>document.removeEventListener("mousedown",m)},[]),jsxRuntime.jsxs("div",{className:Ie,children:[jsxRuntime.jsxs("div",{className:mt,children:[jsxRuntime.jsx("h3",{className:Oe,children:"Debug"}),jsxRuntime.jsxs("p",{className:Fe,children:[e.substring(0,36),"..."]})]}),jsxRuntime.jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsxRuntime.jsx("button",{type:"button",onClick:l,className:re,"aria-label":"Clear all logs",title:"Clear logs",children:jsxRuntime.jsx(lucideReact.Trash2,{size:16})}),jsxRuntime.jsxs("div",{ref:f,style:{position:"relative"},children:[jsxRuntime.jsx("button",{type:"button",onClick:()=>u(!i),className:re,"aria-label":"Actions and settings","aria-expanded":i,title:"Actions and settings",children:jsxRuntime.jsx(lucideReact.Settings,{size:16})}),i&&jsxRuntime.jsxs("div",{className:Xe,style:{width:"200px"},children:[jsxRuntime.jsx("div",{className:Be,children:"Copy Format"}),p.map(m=>jsxRuntime.jsxs("button",{type:"button",onClick:()=>{c(m),u(false);},className:`${le} ${n===m?Ke:""}`,style:{gap:"8px"},children:[L[m],jsxRuntime.jsxs("span",{children:[m==="json"&&"JSON",m==="ecs.json"&&"ECS (AI)",m==="ai.txt"&&"AI-TXT"]}),n===m&&jsxRuntime.jsx("span",{style:{marginLeft:"auto"},children:"\u2713"})]},m)),jsxRuntime.jsx("div",{style:{borderTop:"1px solid var(--border-color, #f3f4f6)",margin:"8px 0"}}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>{s(),u(false);},className:le,style:{gap:"8px"},children:[jsxRuntime.jsx(lucideReact.Save,{size:14}),jsxRuntime.jsx("span",{children:"Save to Folder"})]})]})]}),jsxRuntime.jsx("button",{ref:a,type:"button",onClick:o,className:re,"aria-label":"Close debug panel",children:jsxRuntime.jsx(lucideReact.X,{size:18})})]})]})});function St({logCount:t,errorCount:e,networkErrorCount:o}){return jsxRuntime.jsxs("div",{className:Ne,children:[jsxRuntime.jsxs("div",{className:oe,children:[jsxRuntime.jsx("div",{className:ne,children:t.toLocaleString()}),jsxRuntime.jsx("div",{className:se,children:"Logs"})]}),jsxRuntime.jsxs("div",{className:oe,children:[jsxRuntime.jsx("div",{className:`${ne} ${bt}`,children:e.toLocaleString()}),jsxRuntime.jsx("div",{className:se,children:"Errors"})]}),jsxRuntime.jsxs("div",{className:oe,children:[jsxRuntime.jsx("div",{className:`${ne} ${yt}`,children:o.toLocaleString()}),jsxRuntime.jsx("div",{className:se,children:"Network"})]})]})}function Ct({logCount:t,hasUploadEndpoint:e,isUploading:o,getFilteredLogCount:s,onCopyFiltered:l,onDownload:a,onCopy:n,onUpload:c}){let i=t===0;return jsxRuntime.jsxs("div",{className:ze,children:[jsxRuntime.jsxs("div",{className:ye,children:[jsxRuntime.jsx("div",{className:ae,children:"Copy Filtered"}),jsxRuntime.jsxs("div",{className:he,children:[jsxRuntime.jsxs("button",{type:"button",onClick:()=>l("logs"),className:M,disabled:i||s("logs")===0,"aria-label":"Copy only console logs",children:[jsxRuntime.jsx(lucideReact.Terminal,{size:18}),"Logs"]}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>l("errors"),className:M,disabled:i||s("errors")===0,"aria-label":"Copy only errors",children:[jsxRuntime.jsx(lucideReact.AlertCircle,{size:18}),"Errors"]}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>l("network"),className:M,disabled:i||s("network")===0,"aria-label":"Copy only network requests",children:[jsxRuntime.jsx(lucideReact.Globe,{size:18}),"Network"]})]})]}),jsxRuntime.jsxs("div",{className:ye,children:[jsxRuntime.jsx("div",{className:ae,children:"Export"}),jsxRuntime.jsxs("div",{className:he,children:[jsxRuntime.jsxs("button",{type:"button",onClick:()=>a("json"),className:M,disabled:i,"aria-label":"Download as JSON",children:[jsxRuntime.jsx(lucideReact.FileJson,{size:18}),"JSON"]}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>a("txt"),className:M,disabled:i,"aria-label":"Download as TXT",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"TXT"]}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>a("jsonl"),className:M,disabled:i,"aria-label":"Download as JSONL",children:[jsxRuntime.jsx(lucideReact.Database,{size:18}),"JSONL"]})]})]}),jsxRuntime.jsxs("div",{className:ye,children:[jsxRuntime.jsx("div",{className:ae,children:"Actions"}),jsxRuntime.jsxs("div",{className:he,children:[jsxRuntime.jsxs("button",{type:"button",onClick:n,className:M,disabled:i,"aria-label":"Copy all to clipboard",children:[jsxRuntime.jsx(lucideReact.Copy,{size:18}),"Copy"]}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>a("ai.txt"),className:M,disabled:i,"aria-label":"Download AI-optimized format",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"AI-TXT"]}),e?jsxRuntime.jsxs("button",{type:"button",onClick:c,className:_e,disabled:o,"aria-label":"Upload logs to server",children:[jsxRuntime.jsx(lucideReact.CloudUpload,{size:18}),o?"Uploading...":"Upload"]}):jsxRuntime.jsx("div",{})]})]})]})}function Ge({status:t}){return jsxRuntime.jsxs("div",{"aria-live":"polite",className:t.type==="success"?je:Ue,children:[t.type==="success"?jsxRuntime.jsx(lucideReact.CheckCircle2,{size:14}):jsxRuntime.jsx(lucideReact.AlertCircle,{size:14}),jsxRuntime.jsx("span",{className:wt,children:t.message})]})}function Et({uploadStatus:t,directoryStatus:e,copyStatus:o}){return jsxRuntime.jsxs("div",{className:ht,children:[t&&jsxRuntime.jsx(Ge,{status:t}),e&&jsxRuntime.jsx(Ge,{status:e}),o&&jsxRuntime.jsx(Ge,{status:o})]})}function $t({metadata:t}){return jsxRuntime.jsxs("details",{className:Me,style:{borderTop:"1px solid var(--border-color, #f3f4f6)",borderRadius:0},children:[jsxRuntime.jsxs("summary",{className:Pe,children:[jsxRuntime.jsx(lucideReact.ChevronRight,{size:12}),jsxRuntime.jsx("span",{children:"Session Details"})]}),jsxRuntime.jsxs("div",{className:He,children:[jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"User"}),jsxRuntime.jsx("span",{children:t.userId||"Anonymous"})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Browser"}),jsxRuntime.jsxs("span",{children:[t.browser," (",t.platform,")"]})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Screen"}),jsxRuntime.jsx("span",{children:t.screenResolution})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Timezone"}),jsxRuntime.jsx("span",{children:t.timezone})]})]})]})}function Dt(){return jsxRuntime.jsx("div",{className:Ae,children:jsxRuntime.jsxs("div",{className:qe,children:["Press ",jsxRuntime.jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function Ot(t,e){switch(e){case "logs":return t.filter(o=>o.type==="CONSOLE");case "errors":return t.filter(o=>o.type==="CONSOLE"&&o.level==="error");case "network":return t.filter(o=>o.type==="FETCH_REQ"||o.type==="FETCH_RES"||o.type==="XHR_REQ"||o.type==="XHR_RES");case "networkErrors":return t.filter(o=>o.type==="FETCH_ERR"||o.type==="XHR_ERR");default:return t}}function We({user:t,environment:e="production",uploadEndpoint:o,fileNameTemplate:s="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:l=2e3,showInProduction:a=false}){let{isOpen:n,open:c,close:i}=ut(),{copyFormat:u}=me(),{uploadStatus:f,setUploadStatus:p,directoryStatus:L,setDirectoryStatus:m,copyStatus:h,setCopyStatus:w}=gt(),S=react.useRef(null),U=react.useRef(null),{downloadLogs:E,uploadLogs:G,clearLogs:xe,getLogs:_,getLogCount:ve,getMetadata:O,sessionId:y}=te({fileNameTemplate:s,environment:e,userId:t?.id||t?.email||"guest",includeMetadata:true,uploadEndpoint:o,maxLogs:l,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),x=ve(),b=O();react.useEffect(()=>{if(b.errorCount>=5&&o){let g=async()=>{try{await G();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",g),()=>window.removeEventListener("error",g)}},[b.errorCount,o,G]),react.useEffect(()=>{let g=k=>{let I=k.target;I.closest('[aria-label="Open debug panel"]')||I.closest('[aria-label="Close debug panel"]')||n&&S.current&&!S.current.contains(I)&&i();};return document.addEventListener("mousedown",g),()=>document.removeEventListener("mousedown",g)},[n,i]);let v=react.useCallback((g,k)=>{if(u==="json")return JSON.stringify({metadata:k,logs:g},null,2);if(u==="ecs.json"){let I=g.map(V=>N(V,k)),J={metadata:q(k),logs:I};return JSON.stringify(J,null,2)}else if(u==="ai.txt"){let I=`# METADATA
service.name=${k.environment||"unknown"}
user.id=${k.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,J=g.map(V=>{let R=N(V,k),Ye=R["@timestamp"],Qe=R["log.level"],jt=R["event.category"]?.[0]||"unknown",W=`[${Ye}] ${Qe} ${jt}`;return R.message&&(W+=` | message="${R.message}"`),R.http?.request?.method&&(W+=` | req.method=${R.http.request.method}`),R.url?.full&&(W+=` | url=${R.url.full}`),R.http?.response?.status_code&&(W+=` | res.status=${R.http.response.status_code}`),R.error?.message&&(W+=` | error="${R.error.message}"`),W});return I+J.join(`
`)}return JSON.stringify({metadata:k,logs:g},null,2)},[u]),D=react.useCallback(async()=>{p(null);try{let g=await G();g.success?(p({type:"success",message:`Uploaded successfully! ${g.data?JSON.stringify(g.data):""}`}),g.data&&typeof g.data=="object"&&"url"in g.data&&await navigator.clipboard.writeText(String(g.data.url))):p({type:"error",message:`Upload failed: ${g.error}`});}catch(g){p({type:"error",message:`Error: ${g instanceof Error?g.message:"Unknown error"}`});}},[G,p]),Se=react.useCallback(g=>{let k=E(g);k&&p({type:"success",message:`Downloaded: ${k}`});},[E,p]),Pt=react.useCallback(async()=>{m(null);try{await E("json",void 0,{showPicker:!0})&&m({type:"success",message:"Saved to directory"});}catch{m({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[E,m]),Ht=react.useCallback(async()=>{w(null);try{let g=_(),k=O(),I=v(g,k);await navigator.clipboard.writeText(I),w({type:"success",message:"Copied to clipboard!"});}catch{w({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[_,O,v,w]),zt=react.useCallback(async g=>{w(null);try{let k=_(),I=O(),J=Ot(k,g),V=J.length;if(V===0){w({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[g]});return}let R=v(J,I);await navigator.clipboard.writeText(R),w({type:"success",message:`Copied ${V} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[g]} to clipboard`});}catch{w({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[_,O,v,w]),_t=react.useCallback(g=>Ot(_(),g).length,[_]);return a||e==="development"||t?.role==="admin"?jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs(framerMotion.motion.button,{type:"button",onClick:g=>{g.stopPropagation(),n?i():c();},className:De,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",whileHover:{scale:1.02},whileTap:{scale:.98},layout:true,children:[jsxRuntime.jsx(lucideReact.Bug,{size:18}),b.errorCount>0&&jsxRuntime.jsx(framerMotion.motion.span,{className:ft,initial:{scale:0},animate:{scale:1}},`err-${b.errorCount}`)]}),jsxRuntime.jsx(framerMotion.AnimatePresence,{mode:"wait",children:n&&jsxRuntime.jsxs(framerMotion.motion.div,{ref:S,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:Te,initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:20,scale:.95},transition:{duration:.25,ease:[.4,0,.2,1]},children:[jsxRuntime.jsx(vt,{sessionId:y,onClose:i,onSaveToDirectory:Pt,onClear:()=>{confirm("Clear all logs?")&&xe();},ref:U}),jsxRuntime.jsx(St,{logCount:x,errorCount:b.errorCount,networkErrorCount:b.networkErrorCount}),jsxRuntime.jsx(Ct,{logCount:x,hasUploadEndpoint:!!o,isUploading:false,getFilteredLogCount:_t,onCopyFiltered:zt,onDownload:Se,onCopy:Ht,onUpload:D}),jsxRuntime.jsx(Et,{uploadStatus:f,directoryStatus:L,copyStatus:h}),jsxRuntime.jsx($t,{metadata:b}),jsxRuntime.jsx(Dt,{})]})})]}):null}function Sr({fileNameTemplate:t="debug_{timestamp}"}){let[e,o]=react.useState(false),{downloadLogs:s,clearLogs:l,getLogCount:a}=te({fileNameTemplate:t}),n=a();return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("button",{onClick:()=>o(c=>!c),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsxRuntime.jsx("span",{children:n})}),e&&jsxRuntime.jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsxRuntime.jsx("button",{onClick:()=>s("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsxRuntime.jsx("button",{onClick:()=>{confirm("Clear all logs?")&&l();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsxRuntime.jsx("button",{onClick:()=>o(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function Rr(t){return react.useMemo(()=>t.showInProduction||t.environment==="development"||t.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[t.showInProduction,t.environment,t.user])}function $r(){let t=react.useCallback(o=>{try{typeof window<"u"&&(o?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:o}})));}catch{}},[]),e=react.useMemo(()=>typeof process<"u"&&true,[]);react.useEffect(()=>{if(typeof window>"u")return;let o=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>t(true),hide:()=>t(false),toggle:()=>{try{let s=localStorage.getItem("glean-debug-enabled")==="true";t(!s);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=o,()=>{typeof window<"u"&&window.glean===o&&delete window.glean;}},[t,e]);}function Mt(t){let e=Rr(t);return $r(),e?jsxRuntime.jsx(We,{...t}):null}exports.DebugPanel=We;exports.DebugPanelMinimal=Sr;exports.GleanDebugger=Mt;exports.collectMetadata=Ze;exports.filterStackTrace=Ce;exports.generateExportFilename=Or;exports.generateFilename=F;exports.generateSessionId=et;exports.getBrowserInfo=ke;exports.sanitizeData=de;exports.sanitizeFilename=A;exports.transformMetadataToECS=q;exports.transformToECS=N;exports.useLogRecorder=te;