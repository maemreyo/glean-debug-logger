'use strict';var react=require('react'),framerMotion=require('framer-motion'),goober=require('goober'),lucideReact=require('lucide-react'),jsxRuntime=require('react/jsx-runtime');// @ts-nocheck
var _r=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function pe(r,e={}){let t=e.keys||_r;if(!r||typeof r!="object")return r;let s=Array.isArray(r)?[...r]:{...r},i=l=>{if(!l||typeof l!="object")return l;for(let n in l)if(Object.prototype.hasOwnProperty.call(l,n)){let c=n.toLowerCase();t.some(p=>c.includes(p.toLowerCase()))?l[n]="***REDACTED***":l[n]!==null&&typeof l[n]=="object"&&(l[n]=i(l[n]));}return l};return i(s)}function A(r){return r.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function Re(){if(typeof navigator>"u")return "unknown";let r=navigator.userAgent;return r.includes("Edg")?"edge":r.includes("Chrome")?"chrome":r.includes("Firefox")?"firefox":r.includes("Safari")?"safari":"unknown"}function or(r,e,t,s){if(typeof window>"u")return {sessionId:r,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:s,errorCount:0,networkErrorCount:0};let i=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",l=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:r,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:Re(),platform:navigator.platform,language:navigator.language,screenResolution:i,viewport:l,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:s,errorCount:0,networkErrorCount:0}}function tr(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function N(r="json",e={},t={}){let{fileNameTemplate:s="{env}_{userId}_{sessionId}_{timestamp}",environment:i="development",userId:l="anonymous",sessionId:n="unknown"}=t,c=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],a=new Date().toISOString().split("T")[0],p=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),g=t.browser||Re(),m=t.platform||(typeof navigator<"u"?navigator.platform:"unknown"),f=(t.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",h=String(t.errorCount??e.errorCount??0),x=String(t.logCount??e.logCount??0),k=s.replace("{env}",A(i)).replace("{userId}",A(l??"anonymous")).replace("{sessionId}",A(n??"unknown")).replace("{timestamp}",c).replace("{date}",a).replace("{time}",p).replace(/\{errorCount\}/g,h).replace(/\{logCount\}/g,x).replace("{browser}",A(g)).replace("{platform}",A(m)).replace("{url}",A(f));for(let[j,E]of Object.entries(e))k=k.replace(`{${j}}`,String(E));return `${k}.${r}`}function Do(r,e="json"){let t=r.url.split("?")[0]||"unknown";return N(e,{},{environment:r.environment,userId:r.userId,sessionId:r.sessionId,browser:r.browser,platform:r.platform,url:t,errorCount:r.errorCount,logCount:r.logCount})}var jr={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function nr(r){let e=parseFloat(r);return isNaN(e)?0:Math.round(e*1e6)}function Ur(r){return jr[r.toLowerCase()]||"info"}function $e(r){return r.filter(e=>!e.ignored).slice(0,20)}function q(r){return {service:{environment:r.environment},user:r.userId?{id:r.userId}:void 0,host:{name:r.browser,type:r.platform}}}function F(r,e){let t={"@timestamp":r.time,event:{original:r,category:[]}},s=q(e);switch(Object.assign(t,s),r.type){case "CONSOLE":{t.log={level:Ur(r.level)},t.message=r.data,t.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{t.http={request:{method:r.method}},t.url={full:r.url},t.event.category=["network","web"],t.event.action="request",t.event.id=r.id;break}case "FETCH_RES":case "XHR_RES":{t.http={response:{status_code:r.status}},t.url={full:r.url},t.event.duration=nr(r.duration),t.event.category=["network","web"],t.event.action="response",t.event.id=r.id;break}case "FETCH_ERR":case "XHR_ERR":{t.error={message:r.error},t.url={full:r.url},t.event.duration=nr(r.duration),t.event.category=["network","web"],t.event.action="error",t.event.id=r.id;let i=r;if(typeof i.body=="object"&&i.body!==null){let l=i.body;if(Array.isArray(l.frames)){let n=$e(l.frames);t.error.stack_trace=n.map(c=>`  at ${c.functionName||"?"} (${c.filename||"?"}:${c.lineNumber||0}:${c.columnNumber||0})`).join(`
`);}}break}default:{t.message=JSON.stringify(r);break}}return t}var ge=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let t=this.originalConsole[e];console[e]=(...s)=>{this.callbacks.forEach(i=>{i(e,s);}),t(...s);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var fe=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t));}attach(){window.fetch=async(...e)=>{let[t,s]=e,i=t.toString();if(this.excludeUrls.some(n=>n.test(i)))return this.originalFetch(...e);let l=Date.now();this.onRequest.forEach(n=>n(i,s||{}));try{let n=await this.originalFetch(...e),c=Date.now()-l;return this.onResponse.forEach(a=>a(i,n.status,c)),n}catch(n){throw this.onError.forEach(c=>c(i,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var me=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(t,s,i,l,n){let c=typeof s=="string"?s:s.href;if(e.requestTracker.set(this,{method:t,url:c,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(p=>p.test(c)))return e.originalOpen.call(this,t,s,i??true,l,n);let a=e.requestTracker.get(this);for(let p of e.onRequest)p(a);return e.originalOpen.call(this,t,s,i??true,l,n)},this.originalXHR.prototype.send=function(t){let s=e.requestTracker.get(this);if(s){s.body=t;let i=this.onload,l=this.onerror;this.onload=function(n){let c=Date.now()-s.startTime;for(let a of e.onResponse)a(s,this.status,c);i&&i.call(this,n);},this.onerror=function(n){for(let c of e.onError)c(s,new Error("XHR Error"));l&&l.call(this,n);};}return e.originalSend.call(this,t)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var Le={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function ee(){return Math.random().toString(36).substring(7)}function De(r,e){return pe(r,{keys:e})}function sr(r,e,t,s){return {addLog:n=>{r.logsRef.current.push(n),r.logsRef.current.length>e.maxLogs&&r.logsRef.current.shift(),s(r.logsRef.current.length),n.type==="CONSOLE"?n.level==="ERROR"?r.errorCountRef.current++:r.errorCountRef.current=0:n.type==="FETCH_ERR"||n.type==="XHR_ERR"?r.errorCountRef.current++:r.errorCountRef.current=0;let c=e.uploadOnErrorCount??5;if(r.errorCountRef.current>=c&&e.uploadEndpoint){let a={metadata:{...r.metadataRef.current,logCount:r.logsRef.current.length},logs:r.logsRef.current,fileName:N("json",{},{fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.environment,userId:e.userId,sessionId:null})};fetch(e.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:t(a)}).catch(()=>{}),r.errorCountRef.current=0;}if(e.enablePersistence&&typeof window<"u")try{localStorage.setItem(e.persistenceKey,t(r.logsRef.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},updateMetadata:()=>{let n=r.logsRef.current.filter(a=>a.type==="CONSOLE").reduce((a,p)=>p.level==="ERROR"?a+1:a,0),c=r.logsRef.current.filter(a=>a.type==="FETCH_ERR"||a.type==="XHR_ERR").length;r.metadataRef.current={...r.metadataRef.current,logCount:r.logsRef.current.length,errorCount:n,networkErrorCount:c};}}}function ar(){return r=>{let e=new Set;return JSON.stringify(r,(t,s)=>{if(typeof s=="object"&&s!==null){if(e.has(s))return "[Circular]";e.add(s);}return s})}}function ir(r){return !r||r.length===0?"":r.map(e=>Ar(e)).join("")}function Ar(r){return JSON.stringify(r)+`
`}var X=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,t,s="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(t,{create:!0})).createWritable();await n.write(e),await n.close();}catch(i){if(i.name==="AbortError")return;throw i}}static download(e,t,s="application/json"){let i=new Blob([e],{type:s}),l=URL.createObjectURL(i),n=document.createElement("a");n.href=l,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(l);}static async downloadWithFallback(e,t,s="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,t,s);return}catch(i){if(i.name==="AbortError")return}this.download(e,t,s);}};X.supported=null;function lr(r,e,t,s){return (i,l)=>{if(typeof window>"u")return null;s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},c=l||N(i,{},n),a,p;if(i==="json"){let g=e.current?{metadata:e.current,logs:r.current}:r.current;a=t(g),p="application/json";}else if(i==="jsonl"){let g=r.current.map(m=>F(m,e.current));a=ir(g),p="application/x-ndjson",c=l||N("jsonl",{},n);}else if(i==="ecs.json"){let g={metadata:q(e.current),logs:r.current.map(m=>F(m,e.current))};a=JSON.stringify(g,null,2),p="application/json",c=l||N("ecs-json",{},n);}else if(i==="ai.txt"){let g=e.current,m=`# METADATA
service.name=${g.environment||"unknown"}
user.id=${g.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,L=r.current.map(f=>{let h=F(f,g),x=h["@timestamp"],k=h.log?.level||"info",j=h.event?.category?.[0]||"unknown",E=`[${x}] ${k} ${j}`;return h.message&&(E+=` | message="${h.message}"`),h.http?.request?.method&&(E+=` | req.method=${h.http.request.method}`),h.url?.full&&(E+=` | url=${h.url.full}`),h.http?.response?.status_code&&(E+=` | res.status=${h.http.response.status_code}`),h.error?.message&&(E+=` | error="${h.error.message}"`),E});a=m+L.join(`
`),p="text/plain",c=l||N("ai-txt",{},n);}else a=(e.current?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${t(e.current)}
${"=".repeat(80)}

`:"")+r.current.map(m=>`[${m.time}] ${m.type}
${t(m)}
${"=".repeat(80)}`).join(`
`),p="text/plain";return X.downloadWithFallback(a,c,p),c}}function cr(r,e,t,s){return async i=>{let l=i;if(!l)return {success:false,error:"No endpoint configured"};try{s();let n={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},c={metadata:e.current,logs:r.current,fileName:N("json",{},n)},a=await fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:t(c)});if(!a.ok)throw new Error(`Upload failed: ${a.status}`);return {success:!0,data:await a.json()}}catch(n){let c=n instanceof Error?n.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",n),{success:false,error:c}}}}function re(r={}){let e={...Le,...r},t=react.useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});react.useEffect(()=>{t.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let s=react.useRef([]),i=react.useRef(e.sessionId||tr()),l=react.useRef(or(i.current,e.environment,e.userId,0)),[n,c]=react.useState(0),a=react.useRef(0),p=react.useRef(false),g=react.useMemo(()=>ar(),[]),m=react.useMemo(()=>new ge,[]),L=react.useMemo(()=>new fe({excludeUrls:e.excludeUrls}),[e.excludeUrls]),f=react.useMemo(()=>new me({excludeUrls:e.excludeUrls}),[e.excludeUrls]),h=react.useMemo(()=>sr({logsRef:s,metadataRef:l,errorCountRef:a},{maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount??5,sanitizeKeys:e.sanitizeKeys,environment:e.environment,userId:e.userId},g,c),[e,g,c]),x=h.addLog,k=h.updateMetadata,j=react.useMemo(()=>lr(s,l,g,k),[g,k]),E=react.useMemo(()=>cr(s,l,g,k),[g,k]);react.useEffect(()=>{if(typeof window>"u"||p.current)return;if(p.current=true,e.enablePersistence)try{let y=localStorage.getItem(e.persistenceKey);y&&(s.current=JSON.parse(y),c(s.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let T=[];if(e.captureConsole&&(m.attach(),m.onLog((y,v)=>{let b=v.map(S=>{if(typeof S=="object")try{return g(S)}catch{return String(S)}return String(S)}).join(" ");x({type:"CONSOLE",level:y.toUpperCase(),time:new Date().toISOString(),data:b.substring(0,5e3)});}),T.push(()=>m.detach())),e.captureFetch){let y=new Map;L.onFetchRequest((v,b)=>{let S=ee(),D=null;if(b?.body)try{D=typeof b.body=="string"?JSON.parse(b.body):b.body,D=pe(D,{keys:e.sanitizeKeys});}catch{D=String(b.body).substring(0,1e3);}y.set(S,{url:v,method:b?.method||"GET",headers:De(b?.headers,e.sanitizeKeys),body:D}),x({type:"FETCH_REQ",id:S,url:v,method:b?.method||"GET",headers:De(b?.headers,e.sanitizeKeys),body:D,time:new Date().toISOString()});}),L.onFetchResponse((v,b,S)=>{for(let[D,Ee]of y.entries())if(Ee.url===v){y.delete(D),x({type:"FETCH_RES",id:D,url:v,status:b,statusText:"",duration:`${S}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),L.onFetchError((v,b)=>{for(let[S,D]of y.entries())if(D.url===v){y.delete(S),x({type:"FETCH_ERR",id:S,url:v,error:b.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),L.attach(),T.push(()=>L.detach());}return e.captureXHR&&(f.onXHRRequest(y=>{x({type:"XHR_REQ",id:ee(),url:y.url,method:y.method,headers:y.headers,body:y.body,time:new Date().toISOString()});}),f.onXHRResponse((y,v,b)=>{x({type:"XHR_RES",id:ee(),url:y.url,status:v,statusText:"",duration:`${b}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),f.onXHRError((y,v)=>{x({type:"XHR_ERR",id:ee(),url:y.url,error:v.message,duration:"[unknown]ms",time:new Date().toISOString()});}),f.attach(),T.push(()=>f.detach())),()=>{T.forEach(y=>y()),p.current=false;}},[e,x,g,m,L,f]);let G=react.useCallback(()=>{if(s.current=[],c(0),a.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),ke=react.useCallback(()=>[...s.current],[]),H=react.useCallback(()=>n,[n]),Ce=react.useCallback(()=>(k(),{...l.current}),[k]);return {downloadLogs:j,uploadLogs:E,clearLogs:G,getLogs:ke,getLogCount:H,getMetadata:Ce,sessionId:i.current}}function gr(){let[r,e]=react.useState(false),[t,s]=react.useState(false);react.useEffect(()=>{s(X.isSupported());},[]);let i=react.useCallback(()=>{e(c=>!c);},[]),l=react.useCallback(()=>{e(true);},[]),n=react.useCallback(()=>{e(false);},[]);return react.useEffect(()=>{let c=a=>{a.ctrlKey&&a.shiftKey&&a.key==="D"&&(a.preventDefault(),i()),a.key==="Escape"&&r&&(a.preventDefault(),n());};return document.addEventListener("keydown",c),()=>document.removeEventListener("keydown",c)},[r,i,n]),{isOpen:r,toggle:i,open:l,close:n,supportsDirectoryPicker:t}}var fr="debug-panel-copy-format",Kr=["json","ecs.json","ai.txt"];function ye(){let[r,e]=react.useState(()=>{if(typeof window<"u"){let t=localStorage.getItem(fr);if(t&&Kr.includes(t))return t}return "ecs.json"});return react.useEffect(()=>{localStorage.setItem(fr,r);},[r]),{copyFormat:r,setCopyFormat:e}}function mr(){let[r,e]=react.useState(null),[t,s]=react.useState(null),[i,l]=react.useState(null),[n,c]=react.useState(false);return react.useEffect(()=>{if(r){let a=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(a)}},[r]),react.useEffect(()=>{if(t){let a=setTimeout(()=>{s(null);},3e3);return ()=>clearTimeout(a)}},[t]),react.useEffect(()=>{if(i){let a=setTimeout(()=>{l(null);},3e3);return ()=>clearTimeout(a)}},[i]),{uploadStatus:r,setUploadStatus:e,directoryStatus:t,setDirectoryStatus:s,copyStatus:i,setCopyStatus:l,showSettings:n,setShowSettings:c}}var o={glassBg:"rgba(255, 255, 255, 0.75)",glassBorder:"rgba(255, 255, 255, 0.4)",glassShadow:"0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",colors:{primary:"#1a1a2e",secondary:"#4a5568",muted:"#a0aec0",border:"rgba(0, 0, 0, 0.06)",success:"#059669",successBg:"rgba(5, 150, 105, 0.08)",successBorder:"rgba(5, 150, 105, 0.2)",error:"#dc2626",errorBg:"rgba(220, 38, 38, 0.06)",errorBorder:"rgba(220, 38, 38, 0.15)",warning:"#d97706",accent:"#0ea5e9",accentBg:"rgba(14, 165, 233, 0.08)",accentBorder:"rgba(14, 165, 233, 0.2)"},fonts:{display:'-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',mono:'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'},space:{xs:"4px",sm:"8px",md:"12px",lg:"16px"},radius:{sm:"6px",md:"10px",lg:"16px",full:"9999px"},transitions:{fast:"0.15s ease",normal:"0.25s cubic-bezier(0.4, 0, 0.2, 1)"}},Ne=goober.css`
  position: fixed;
  bottom: ${o.space.lg};
  right: ${o.space.lg};
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${o.colors.primary};
  color: #ffffff;
  border: none;
  border-radius: ${o.radius.full};
  cursor: pointer;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all ${o.transitions.normal};

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
`,br=goober.css`
  position: absolute;
  top: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  background: ${o.colors.error};
  border: 2px solid ${o.colors.primary};
  border-radius: ${o.radius.full};
  box-shadow: 0 1px 4px rgba(220, 38, 38, 0.4);
`;goober.css`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${o.radius.full};
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(4px);
`;goober.css`
  background: ${o.colors.error};
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${o.radius.full};
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
`;var Fe=goober.css`
  position: fixed;
  bottom: 90px;
  right: ${o.space.lg};
  z-index: 9999;
  width: 380px;
  max-height: 520px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background: ${o.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: ${o.radius.lg};
  border: 1px solid ${o.glassBorder};
  box-shadow: ${o.glassShadow};
  font-family: ${o.fonts.display};
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
`,Oe=goober.css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${o.space.lg};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
  border-bottom: 1px solid ${o.colors.border};
`,yr=goober.css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`,Me=goober.css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${o.colors.primary};
  letter-spacing: -0.01em;
`,Pe=goober.css`
  margin: 0;
  font-size: 11px;
  color: ${o.colors.muted};
  font-family: ${o.fonts.mono};
  font-weight: 500;
`,oe=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: ${o.radius.sm};
  color: ${o.colors.muted};
  cursor: pointer;
  transition: all ${o.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${o.colors.secondary};
  }
`,ze=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: ${o.colors.border};
`,te=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${o.space.lg};
  background: rgba(255, 255, 255, 0.6);
  gap: ${o.space.xs};
`,ne=goober.css`
  font-size: 28px;
  font-weight: 700;
  color: ${o.colors.primary};
  line-height: 1;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`,se=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${o.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`,hr=goober.css`
  color: ${o.colors.error};
`,xr=goober.css`
  color: ${o.colors.warning};
`,He=goober.css`
  padding: ${o.space.md} ${o.space.lg};
  background: rgba(255, 255, 255, 0.4);
  border-bottom: 1px solid ${o.colors.border};
`,_e=goober.css`
  display: flex;
  align-items: center;
  gap: ${o.space.sm};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: ${o.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  list-style: none;
  padding: ${o.space.sm} 0;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    color: ${o.colors.primary};
  }
`,je=goober.css`
  margin-top: ${o.space.md};
  padding: ${o.space.md};
  background: rgba(255, 255, 255, 0.5);
  border-radius: ${o.radius.md};
  font-size: 11px;
  color: ${o.colors.secondary};
  line-height: 1.7;

  & > div {
    display: flex;
    gap: ${o.space.sm};
    margin-bottom: ${o.space.xs};
  }

  strong {
    color: ${o.colors.primary};
    font-weight: 600;
    min-width: 70px;
  }
`,Ue=goober.css`
  padding: ${o.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${o.space.lg};
  background: rgba(255, 255, 255, 0.3);
`,xe=goober.css`
  display: flex;
  flex-direction: column;
  gap: ${o.space.sm};
`,ae=goober.css`
  font-size: 10px;
  font-weight: 600;
  color: ${o.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;goober.css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${o.space.sm};
`;var we=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${o.space.sm};
`,ie=goober.css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${o.space.xs};
  padding: ${o.space.sm} ${o.space.md};
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid ${o.colors.border};
  border-radius: ${o.radius.md};
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  color: ${o.colors.secondary};
  transition: all ${o.transitions.fast};

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
`;var Gr=goober.css`
  ${ie}
  background: ${o.colors.accentBg};
  border-color: ${o.colors.accentBorder};
  color: ${o.colors.accent};

  &:hover:not(:disabled) {
    background: ${o.colors.accent};
    color: #ffffff;
    border-color: ${o.colors.accent};
  }
`,Ae=goober.css`
  ${ie}
  background: ${o.colors.successBg};
  border-color: ${o.colors.successBorder};
  color: ${o.colors.success};

  &:hover:not(:disabled) {
    background: ${o.colors.success};
    color: #ffffff;
    border-color: ${o.colors.success};
  }
`,Jr=goober.css`
  ${ie}
  background: ${o.colors.errorBg};
  border-color: ${o.colors.errorBorder};
  color: ${o.colors.error};

  &:hover:not(:disabled) {
    background: ${o.colors.error};
    color: #ffffff;
    border-color: ${o.colors.error};
  }
`,O=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${o.space.md} ${o.space.sm};
  min-height: 52px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid ${o.colors.border};
  border-radius: ${o.radius.md};
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${o.colors.secondary};
  line-height: 1.2;
  transition: all ${o.transitions.fast};

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
`,Vr=goober.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${o.space.md} ${o.space.sm};
  min-height: 52px;
  background: ${o.colors.errorBg};
  border: 1px solid ${o.colors.errorBorder};
  border-radius: ${o.radius.md};
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${o.colors.error};
  line-height: 1.2;
  transition: all ${o.transitions.fast};

  & svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    background: ${o.colors.error};
    color: #ffffff;
    border-color: ${o.colors.error};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,le=goober.css`
  display: flex;
  align-items: center;
  gap: ${o.space.sm};
  padding: ${o.space.md};
  margin: 0 ${o.space.lg};
  background: ${o.colors.successBg};
  border: 1px solid ${o.colors.successBorder};
  border-radius: ${o.radius.md};
  font-size: 12px;
  color: ${o.colors.success};
  font-weight: 500;

  & svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`,ce=goober.css`
  display: flex;
  align-items: center;
  gap: ${o.space.sm};
  padding: ${o.space.md};
  margin: 0 ${o.space.lg};
  background: ${o.colors.errorBg};
  border: 1px solid ${o.colors.errorBorder};
  border-radius: ${o.radius.md};
  font-size: 12px;
  color: ${o.colors.error};
  font-weight: 500;

  & svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`,qe=goober.css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${o.space.md};
  background: rgba(255, 255, 255, 0.5);
  border-top: 1px solid ${o.colors.border};

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: ${o.radius.sm};
    font-family: ${o.fonts.mono};
    font-size: 10px;
    color: ${o.colors.muted};
    border: 1px solid ${o.colors.border};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }
`,Xe=goober.css`
  font-size: 11px;
  color: ${o.colors.muted};
`,Be=goober.css`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${o.space.sm};
  min-width: 160px;
  background: ${o.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${o.glassBorder};
  border-radius: ${o.radius.md};
  box-shadow: ${o.glassShadow};
  z-index: 10000;
  overflow: hidden;
`,Ke=goober.css`
  padding: ${o.space.sm} ${o.space.md};
  font-size: 10px;
  font-weight: 600;
  color: ${o.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid ${o.colors.border};
`,de=goober.css`
  display: flex;
  align-items: center;
  gap: ${o.space.sm};
  width: 100%;
  padding: ${o.space.sm} ${o.space.md};
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: ${o.colors.secondary};
  transition: all ${o.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`,Ge=goober.css`
  ${de}
  background: rgba(0, 0, 0, 0.04);
  color: ${o.colors.primary};
`;goober.css`
  @media (prefers-color-scheme: dark) {
    :root {
      --glass-bg: rgba(30, 30, 46, 0.85);
      --glass-border: rgba(255, 255, 255, 0.08);
    }

    ${Fe} {
      background: rgba(30, 30, 46, 0.9);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    ${Oe} {
      background: linear-gradient(135deg, rgba(40, 40, 60, 0.8) 0%, rgba(30, 30, 46, 0.6) 100%);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${Me} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${Pe} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${oe} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
    }

    ${ze} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${te} {
      background: rgba(40, 40, 60, 0.5);
    }

    ${ne} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${se} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${He} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${_e} {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${je} {
      background: rgba(40, 40, 60, 0.5);
      color: rgba(255, 255, 255, 0.6);

      strong {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    ${Ue} {
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

    ${Gr} {
      background: rgba(14, 165, 233, 0.15);
      border-color: rgba(14, 165, 233, 0.25);
      color: #38bdf8;

      &:hover:not(:disabled) {
        background: #0ea5e9;
        color: #ffffff;
        border-color: #0ea5e9;
      }
    }

    ${Ae} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;

      &:hover:not(:disabled) {
        background: #059669;
        color: #ffffff;
        border-color: #059669;
      }
    }

    ${Jr},
    ${Vr} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;

      &:hover:not(:disabled) {
        background: #dc2626;
        color: #ffffff;
        border-color: #dc2626;
      }
    }

    ${le} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;
    }

    ${ce} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;
    }

    ${qe} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);

      kbd {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.5);
      }
    }

    ${Xe} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${Ne} {
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

    ${Be} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${Ke} {
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${de} {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    ${Ge} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }
  }
`;var vr=react.forwardRef(function({sessionId:e,onClose:t,onSaveToDirectory:s,onClear:i},l){let{copyFormat:n,setCopyFormat:c}=ye(),[a,p]=react.useState(false),g=react.useRef(null),m=["json","ecs.json","ai.txt"],L={json:jsxRuntime.jsx(lucideReact.FileJson,{size:14}),"ecs.json":jsxRuntime.jsx(lucideReact.FileText,{size:14}),"ai.txt":jsxRuntime.jsx(lucideReact.FileText,{size:14})};return react.useEffect(()=>{let f=h=>{g.current&&!g.current.contains(h.target)&&p(false);};return document.addEventListener("mousedown",f),()=>document.removeEventListener("mousedown",f)},[]),jsxRuntime.jsxs("div",{className:Oe,children:[jsxRuntime.jsxs("div",{className:yr,children:[jsxRuntime.jsx("h3",{className:Me,children:"Debug"}),jsxRuntime.jsxs("p",{className:Pe,children:[e.substring(0,36),"..."]})]}),jsxRuntime.jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsxRuntime.jsx("button",{type:"button",onClick:i,className:oe,"aria-label":"Clear all logs",title:"Clear logs",children:jsxRuntime.jsx(lucideReact.Trash2,{size:16})}),jsxRuntime.jsxs("div",{ref:g,style:{position:"relative"},children:[jsxRuntime.jsx("button",{type:"button",onClick:()=>p(!a),className:oe,"aria-label":"Actions and settings","aria-expanded":a,title:"Actions and settings",children:jsxRuntime.jsx(lucideReact.Settings,{size:16})}),a&&jsxRuntime.jsxs("div",{className:Be,style:{width:"200px"},children:[jsxRuntime.jsx("div",{className:Ke,children:"Copy Format"}),m.map(f=>jsxRuntime.jsxs("button",{type:"button",onClick:()=>{c(f),p(false);},className:`${de} ${n===f?Ge:""}`,style:{gap:"8px"},children:[L[f],jsxRuntime.jsxs("span",{children:[f==="json"&&"JSON",f==="ecs.json"&&"ECS (AI)",f==="ai.txt"&&"AI-TXT"]}),n===f&&jsxRuntime.jsx("span",{style:{marginLeft:"auto"},children:"\u2713"})]},f)),jsxRuntime.jsx("div",{style:{borderTop:"1px solid var(--border-color, #f3f4f6)",margin:"8px 0"}}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>{s(),p(false);},className:de,style:{gap:"8px"},children:[jsxRuntime.jsx(lucideReact.Save,{size:14}),jsxRuntime.jsx("span",{children:"Save to Folder"})]})]})]}),jsxRuntime.jsx("button",{ref:l,type:"button",onClick:t,className:oe,"aria-label":"Close debug panel",children:jsxRuntime.jsx(lucideReact.X,{size:18})})]})]})});function Sr({logCount:r,errorCount:e,networkErrorCount:t}){return jsxRuntime.jsxs("div",{className:ze,children:[jsxRuntime.jsxs("div",{className:te,children:[jsxRuntime.jsx("div",{className:ne,children:r.toLocaleString()}),jsxRuntime.jsx("div",{className:se,children:"Logs"})]}),jsxRuntime.jsxs("div",{className:te,children:[jsxRuntime.jsx("div",{className:`${ne} ${hr}`,children:e.toLocaleString()}),jsxRuntime.jsx("div",{className:se,children:"Errors"})]}),jsxRuntime.jsxs("div",{className:te,children:[jsxRuntime.jsx("div",{className:`${ne} ${xr}`,children:t.toLocaleString()}),jsxRuntime.jsx("div",{className:se,children:"Network"})]})]})}function Cr({logCount:r,hasUploadEndpoint:e,isUploading:t,getFilteredLogCount:s,onCopyFiltered:i,onDownload:l,onCopy:n,onUpload:c}){let a=r===0;return jsxRuntime.jsxs("div",{className:Ue,children:[jsxRuntime.jsxs("div",{className:xe,children:[jsxRuntime.jsx("div",{className:ae,children:"Copy Filtered"}),jsxRuntime.jsxs("div",{className:we,children:[jsxRuntime.jsxs("button",{type:"button",onClick:()=>i("logs"),className:O,disabled:a||s("logs")===0,"aria-label":"Copy only console logs",children:[jsxRuntime.jsx(lucideReact.Terminal,{size:18}),"Logs"]}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>i("errors"),className:O,disabled:a||s("errors")===0,"aria-label":"Copy only errors",children:[jsxRuntime.jsx(lucideReact.AlertCircle,{size:18}),"Errors"]}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>i("network"),className:O,disabled:a||s("network")===0,"aria-label":"Copy only network requests",children:[jsxRuntime.jsx(lucideReact.Globe,{size:18}),"Network"]})]})]}),jsxRuntime.jsxs("div",{className:xe,children:[jsxRuntime.jsx("div",{className:ae,children:"Export"}),jsxRuntime.jsxs("div",{className:we,children:[jsxRuntime.jsxs("button",{type:"button",onClick:()=>l("json"),className:O,disabled:a,"aria-label":"Download as JSON",children:[jsxRuntime.jsx(lucideReact.FileJson,{size:18}),"JSON"]}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>l("txt"),className:O,disabled:a,"aria-label":"Download as TXT",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"TXT"]}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>l("jsonl"),className:O,disabled:a,"aria-label":"Download as JSONL",children:[jsxRuntime.jsx(lucideReact.Database,{size:18}),"JSONL"]})]})]}),jsxRuntime.jsxs("div",{className:xe,children:[jsxRuntime.jsx("div",{className:ae,children:"Actions"}),jsxRuntime.jsxs("div",{className:we,children:[jsxRuntime.jsxs("button",{type:"button",onClick:n,className:O,disabled:a,"aria-label":"Copy all to clipboard",children:[jsxRuntime.jsx(lucideReact.Copy,{size:18}),"Copy"]}),jsxRuntime.jsxs("button",{type:"button",onClick:()=>l("ai.txt"),className:O,disabled:a,"aria-label":"Download AI-optimized format",children:[jsxRuntime.jsx(lucideReact.FileText,{size:18}),"AI-TXT"]}),e?jsxRuntime.jsxs("button",{type:"button",onClick:c,className:Ae,disabled:t,"aria-label":"Upload logs to server",children:[jsxRuntime.jsx(lucideReact.CloudUpload,{size:18}),t?"Uploading...":"Upload"]}):jsxRuntime.jsx("div",{})]})]})]})}function Er({uploadStatus:r,directoryStatus:e,copyStatus:t}){return jsxRuntime.jsxs("div",{style:{padding:"0 16px 12px"},children:[r&&jsxRuntime.jsxs("div",{role:"status","aria-live":"polite",className:r.type==="success"?le:ce,children:[r.type==="success"?jsxRuntime.jsx(lucideReact.CheckCircle2,{size:16}):jsxRuntime.jsx(lucideReact.AlertCircle,{size:16}),r.message]}),e&&jsxRuntime.jsxs("div",{role:"status","aria-live":"polite",className:e.type==="success"?le:ce,children:[e.type==="success"?jsxRuntime.jsx(lucideReact.CheckCircle2,{size:16}):jsxRuntime.jsx(lucideReact.AlertCircle,{size:16}),e.message]}),t&&jsxRuntime.jsxs("div",{role:"status","aria-live":"polite",className:t.type==="success"?le:ce,children:[t.type==="success"?jsxRuntime.jsx(lucideReact.CheckCircle2,{size:16}):jsxRuntime.jsx(lucideReact.AlertCircle,{size:16}),t.message]})]})}function Rr({metadata:r}){return jsxRuntime.jsxs("details",{className:He,style:{borderTop:"1px solid var(--border-color, #f3f4f6)",borderRadius:0},children:[jsxRuntime.jsxs("summary",{className:_e,children:[jsxRuntime.jsx(lucideReact.ChevronRight,{size:12}),jsxRuntime.jsx("span",{children:"Session Details"})]}),jsxRuntime.jsxs("div",{className:je,children:[jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"User"}),jsxRuntime.jsx("span",{children:r.userId||"Anonymous"})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Browser"}),jsxRuntime.jsxs("span",{children:[r.browser," (",r.platform,")"]})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Screen"}),jsxRuntime.jsx("span",{children:r.screenResolution})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Timezone"}),jsxRuntime.jsx("span",{children:r.timezone})]})]})]})}function Lr(){return jsxRuntime.jsx("div",{className:qe,children:jsxRuntime.jsxs("div",{className:Xe,children:["Press ",jsxRuntime.jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function Ir(r,e){switch(e){case "logs":return r.filter(t=>t.type==="CONSOLE");case "errors":return r.filter(t=>t.type==="CONSOLE"&&t.level==="error");case "network":return r.filter(t=>t.type==="FETCH_REQ"||t.type==="FETCH_RES"||t.type==="XHR_REQ"||t.type==="XHR_RES");case "networkErrors":return r.filter(t=>t.type==="FETCH_ERR"||t.type==="XHR_ERR");default:return r}}function Ze({user:r,environment:e="production",uploadEndpoint:t,fileNameTemplate:s="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:i=2e3,showInProduction:l=false}){let{isOpen:n,open:c,close:a}=gr(),{copyFormat:p}=ye(),{uploadStatus:g,setUploadStatus:m,directoryStatus:L,setDirectoryStatus:f,copyStatus:h,setCopyStatus:x}=mr(),k=react.useRef(null),j=react.useRef(null),{downloadLogs:E,uploadLogs:G,clearLogs:ke,getLogs:H,getLogCount:Ce,getMetadata:T,sessionId:y}=re({fileNameTemplate:s,environment:e,userId:r?.id||r?.email||"guest",includeMetadata:true,uploadEndpoint:t,maxLogs:i,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),v=Ce(),b=T();react.useEffect(()=>{if(b.errorCount>=5&&t){let u=async()=>{try{await G();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",u),()=>window.removeEventListener("error",u)}},[b.errorCount,t,G]),react.useEffect(()=>{let u=w=>{n&&k.current&&!k.current.contains(w.target)&&a();};return document.addEventListener("mousedown",u),()=>document.removeEventListener("mousedown",u)},[n,a]),react.useEffect(()=>{let u=w=>{w.ctrlKey&&w.shiftKey&&w.key==="D"&&(w.preventDefault(),n?a():c());};return document.addEventListener("keydown",u),()=>document.removeEventListener("keydown",u)},[n,c,a]);let S=react.useCallback((u,w)=>{if(p==="json")return JSON.stringify({metadata:w,logs:u},null,2);if(p==="ecs.json"){let U=u.map(V=>F(V,w)),J={metadata:q(w),logs:U};return JSON.stringify(J,null,2)}else if(p==="ai.txt"){let U=`# METADATA
service.name=${w.environment||"unknown"}
user.id=${w.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,J=u.map(V=>{let R=F(V,w),er=R["@timestamp"],rr=R["log.level"],Hr=R["event.category"]?.[0]||"unknown",W=`[${er}] ${rr} ${Hr}`;return R.message&&(W+=` | message="${R.message}"`),R.http?.request?.method&&(W+=` | req.method=${R.http.request.method}`),R.url?.full&&(W+=` | url=${R.url.full}`),R.http?.response?.status_code&&(W+=` | res.status=${R.http.response.status_code}`),R.error?.message&&(W+=` | error="${R.error.message}"`),W});return U+J.join(`
`)}return JSON.stringify({metadata:w,logs:u},null,2)},[p]),D=react.useCallback(async()=>{m(null);try{let u=await G();u.success?(m({type:"success",message:`Uploaded successfully! ${u.data?JSON.stringify(u.data):""}`}),u.data&&typeof u.data=="object"&&"url"in u.data&&await navigator.clipboard.writeText(String(u.data.url))):m({type:"error",message:`Upload failed: ${u.error}`});}catch(u){m({type:"error",message:`Error: ${u instanceof Error?u.message:"Unknown error"}`});}},[G,m]),Ee=react.useCallback(u=>{let w=E(u);w&&m({type:"success",message:`Downloaded: ${w}`});},[E,m]),Or=react.useCallback(async()=>{f(null);try{await E("json",void 0,{showPicker:!0})&&f({type:"success",message:"Saved to directory"});}catch{f({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[E,f]),Mr=react.useCallback(async()=>{x(null);try{let u=H(),w=T(),U=S(u,w);await navigator.clipboard.writeText(U),x({type:"success",message:"Copied to clipboard!"});}catch{x({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[H,T,S,x]),Pr=react.useCallback(async u=>{x(null);try{let w=H(),U=T(),J=Ir(w,u),V=J.length;if(V===0){x({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[u]});return}let R=S(J,U);await navigator.clipboard.writeText(R),x({type:"success",message:`Copied ${V} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[u]} to clipboard`});}catch{x({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[H,T,S,x]),zr=react.useCallback(u=>Ir(H(),u).length,[H]);return l||e==="development"||r?.role==="admin"?jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs(framerMotion.motion.button,{type:"button",onClick:n?a:c,className:Ne,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",whileHover:{scale:1.02},whileTap:{scale:.98},layout:true,children:[jsxRuntime.jsx(lucideReact.Bug,{size:18}),b.errorCount>0&&jsxRuntime.jsx(framerMotion.motion.span,{className:br,initial:{scale:0},animate:{scale:1}},`err-${b.errorCount}`)]}),jsxRuntime.jsx(framerMotion.AnimatePresence,{children:n&&jsxRuntime.jsxs(framerMotion.motion.div,{ref:k,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:Fe,initial:{opacity:0,y:20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:20,scale:.95},transition:{duration:.25,ease:[.4,0,.2,1]},children:[jsxRuntime.jsx(vr,{sessionId:y,onClose:a,onSaveToDirectory:Or,onClear:()=>{confirm("Clear all logs?")&&ke();},ref:j}),jsxRuntime.jsx(Sr,{logCount:v,errorCount:b.errorCount,networkErrorCount:b.networkErrorCount}),jsxRuntime.jsx(Cr,{logCount:v,hasUploadEndpoint:!!t,isUploading:false,getFilteredLogCount:zr,onCopyFiltered:Pr,onDownload:Ee,onCopy:Mr,onUpload:D}),jsxRuntime.jsx(Er,{uploadStatus:g,directoryStatus:L,copyStatus:h}),jsxRuntime.jsx(Rr,{metadata:b}),jsxRuntime.jsx(Lr,{})]})})]}):null}function xo({fileNameTemplate:r="debug_{timestamp}"}){let[e,t]=react.useState(false),{downloadLogs:s,clearLogs:i,getLogCount:l}=re({fileNameTemplate:r}),n=l();return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("button",{onClick:()=>t(c=>!c),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsxRuntime.jsx("span",{children:n})}),e&&jsxRuntime.jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsxRuntime.jsx("button",{onClick:()=>s("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsxRuntime.jsx("button",{onClick:()=>{confirm("Clear all logs?")&&i();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsxRuntime.jsx("button",{onClick:()=>t(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function ko(r){return react.useMemo(()=>r.showInProduction||r.environment==="development"||r.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[r.showInProduction,r.environment,r.user])}function Co(){let r=react.useCallback(t=>{try{typeof window<"u"&&(t?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:t}})));}catch{}},[]),e=react.useMemo(()=>typeof process<"u"&&true,[]);react.useEffect(()=>{if(typeof window>"u")return;let t=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>r(true),hide:()=>r(false),toggle:()=>{try{let s=localStorage.getItem("glean-debug-enabled")==="true";r(!s);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=t,()=>{typeof window<"u"&&window.glean===t&&delete window.glean;}},[r,e]);}function Fr(r){let e=ko(r);return Co(),e?jsxRuntime.jsx(Ze,{...r}):null}exports.DebugPanel=Ze;exports.DebugPanelMinimal=xo;exports.GleanDebugger=Fr;exports.collectMetadata=or;exports.filterStackTrace=$e;exports.generateExportFilename=Do;exports.generateFilename=N;exports.generateSessionId=tr;exports.getBrowserInfo=Re;exports.sanitizeData=pe;exports.sanitizeFilename=A;exports.transformMetadataToECS=q;exports.transformToECS=F;exports.useLogRecorder=re;