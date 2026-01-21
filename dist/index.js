'use strict';var react=require('react'),goober=require('goober'),jsxRuntime=require('react/jsx-runtime');// @ts-nocheck
var Xe=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function B(o,e={}){let t=e.keys||Xe;if(!o||typeof o!="object")return o;let r=Array.isArray(o)?[...o]:{...o},l=s=>{if(!s||typeof s!="object")return s;for(let n in s)if(Object.prototype.hasOwnProperty.call(s,n)){let p=n.toLowerCase();t.some(v=>p.includes(v.toLowerCase()))?s[n]="***REDACTED***":s[n]!==null&&typeof s[n]=="object"&&(s[n]=l(s[n]));}return s};return l(r)}function I(o){return o.replace(/[^a-z0-9_\-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function ne(){if(typeof navigator>"u")return "unknown";let o=navigator.userAgent;return o.includes("Edg")?"edge":o.includes("Chrome")?"chrome":o.includes("Firefox")?"firefox":o.includes("Safari")?"safari":"unknown"}function Ee(o,e,t,r){if(typeof window>"u")return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:r,errorCount:0,networkErrorCount:0};let l=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",s=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:o,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:ne(),platform:navigator.platform,language:navigator.language,screenResolution:l,viewport:s,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:r,errorCount:0,networkErrorCount:0}}function Ce(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function $(o="json",e={},t={}){let{fileNameTemplate:r="{env}_{userId}_{sessionId}_{timestamp}",environment:l="development",userId:s="anonymous",sessionId:n="unknown"}=t,p=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],h=new Date().toISOString().split("T")[0],v=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),x=t.browser||ne(),k=t.platform||(typeof navigator<"u"?navigator.platform:"unknown"),S=(t.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",w=String(t.errorCount??e.errorCount??0),E=String(t.logCount??e.logCount??0),T=r.replace("{env}",I(l)).replace("{userId}",I(s??"anonymous")).replace("{sessionId}",I(n??"unknown")).replace("{timestamp}",p).replace("{date}",h).replace("{time}",v).replace(/\{errorCount\}/g,w).replace(/\{logCount\}/g,E).replace("{browser}",I(x)).replace("{platform}",I(k)).replace("{url}",I(S));for(let[N,_]of Object.entries(e))T=T.replace(`{${N}}`,String(_));return `${T}.${o}`}function et(o,e="json"){let t=o.url.split("?")[0]||"unknown";return $(e,{},{environment:o.environment,userId:o.userId,sessionId:o.sessionId,browser:o.browser,platform:o.platform,url:t,errorCount:o.errorCount,logCount:o.logCount})}var qe={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function Le(o){let e=parseFloat(o);return isNaN(e)?0:Math.round(e*1e6)}function Pe(o){return qe[o.toLowerCase()]||"info"}function se(o){return o.filter(e=>!e.ignored).slice(0,20)}function ae(o){return {service:{environment:o.environment},user:o.userId?{id:o.userId}:void 0,host:{name:o.browser,type:o.platform}}}function Te(o,e){let t={"@timestamp":o.time,event:{original:o,category:[]}},r=ae(e);switch(Object.assign(t,r),o.type){case "CONSOLE":{t.log={level:Pe(o.level)},t.message=o.data,t.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{t.http={request:{method:o.method}},t.url={full:o.url},t.event.category=["network","web"],t.event.action="request",t.event.id=o.id;break}case "FETCH_RES":case "XHR_RES":{t.http={response:{status_code:o.status}},t.url={full:o.url},t.event.duration=Le(o.duration),t.event.category=["network","web"],t.event.action="response",t.event.id=o.id;break}case "FETCH_ERR":case "XHR_ERR":{t.error={message:o.error},t.url={full:o.url},t.event.duration=Le(o.duration),t.event.category=["network","web"],t.event.action="error",t.event.id=o.id;let l=o;if(typeof l.body=="object"&&l.body!==null){let s=l.body;if(Array.isArray(s.frames)){let n=se(s.frames);t.error.stack_trace=n.map(p=>`  at ${p.functionName||"?"} (${p.filename||"?"}:${p.lineNumber||0}:${p.columnNumber||0})`).join(`
`);}}break}default:{t.message=JSON.stringify(o);break}}return t}var W=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let t=this.originalConsole[e];console[e]=(...r)=>{this.callbacks.forEach(l=>{l(e,r);}),t(...r);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var Y=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t));}attach(){window.fetch=async(...e)=>{let[t,r]=e,l=t.toString();if(this.excludeUrls.some(n=>n.test(l)))return this.originalFetch(...e);let s=Date.now();this.onRequest.forEach(n=>n(l,r||{}));try{let n=await this.originalFetch(...e),p=Date.now()-s;return this.onResponse.forEach(h=>h(l,n.status,p)),n}catch(n){throw this.onError.forEach(p=>p(l,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var J=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(t,r,l,s,n){let p=typeof r=="string"?r:r.href;if(e.requestTracker.set(this,{method:t,url:p,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(v=>v.test(p)))return e.originalOpen.call(this,t,r,l??true,s,n);let h=e.requestTracker.get(this);for(let v of e.onRequest)v(h);return e.originalOpen.call(this,t,r,l??true,s,n)},this.originalXHR.prototype.send=function(t){let r=e.requestTracker.get(this);if(r){r.body=t;let l=this.onload,s=this.onerror;this.onload=function(n){let p=Date.now()-r.startTime;for(let h of e.onResponse)h(r,this.status,p);l&&l.call(this,n);},this.onerror=function(n){for(let p of e.onError)p(r,new Error("XHR Error"));s&&s.call(this,n);};}return e.originalSend.call(this,t)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var U=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,t,r="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(t,{create:!0})).createWritable();await n.write(e),await n.close();}catch(l){if(l.name==="AbortError")return;throw l}}static download(e,t,r="application/json"){let l=new Blob([e],{type:r}),s=URL.createObjectURL(l),n=document.createElement("a");n.href=s,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(s);}static async downloadWithFallback(e,t,r="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,t,r);return}catch(l){if(l.name==="AbortError")return}this.download(e,t,r);}};U.supported=null;var je={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function X(o={}){let e={...je,...o},t=react.useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});react.useEffect(()=>{t.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let r=react.useRef([]),l=react.useRef(e.sessionId||Ce()),s=react.useRef(Ee(l.current,e.environment,e.userId,0)),[n,p]=react.useState(0),h=react.useRef(0),v=react.useRef(false),x=react.useCallback(m=>{let a=new Set;return JSON.stringify(m,(c,i)=>{if(typeof i=="object"&&i!==null){if(a.has(i))return "[Circular]";a.add(i);}return i})},[]),k=react.useMemo(()=>new W,[]),R=react.useMemo(()=>new Y({excludeUrls:e.excludeUrls}),[e.excludeUrls]),S=react.useMemo(()=>new J({excludeUrls:e.excludeUrls}),[e.excludeUrls]),w=react.useCallback(m=>{let a=t.current;r.current.push(m),r.current.length>a.maxLogs&&r.current.shift(),p(r.current.length),m.type==="CONSOLE"?m.level==="ERROR"?h.current++:h.current=0:m.type==="FETCH_ERR"||m.type==="XHR_ERR"?h.current++:h.current=0;let c=a.uploadOnErrorCount??5;if(h.current>=c&&a.uploadEndpoint){let i={metadata:{...s.current,logCount:r.current.length},logs:r.current,fileName:$("json",{},e)};fetch(a.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:x(i)}).catch(()=>{}),h.current=0;}if(a.enablePersistence&&typeof window<"u")try{localStorage.setItem(a.persistenceKey,x(r.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},[x]),E=react.useCallback(()=>{let m=r.current.filter(c=>c.type==="CONSOLE").reduce((c,i)=>i.level==="ERROR"?c+1:c,0),a=r.current.filter(c=>c.type==="FETCH_ERR"||c.type==="XHR_ERR").length;s.current={...s.current,logCount:r.current.length,errorCount:m,networkErrorCount:a};},[]);react.useEffect(()=>{if(typeof window>"u"||v.current)return;if(v.current=true,e.enablePersistence)try{let a=localStorage.getItem(e.persistenceKey);a&&(r.current=JSON.parse(a),p(r.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let m=[];if(e.captureConsole&&(k.attach(),k.onLog((a,c)=>{let i=c.map(b=>{if(typeof b=="object")try{return x(b)}catch{return String(b)}return String(b)}).join(" ");w({type:"CONSOLE",level:a.toUpperCase(),time:new Date().toISOString(),data:i.substring(0,5e3)});}),m.push(()=>k.detach())),e.captureFetch){let a=new Map;R.onFetchRequest((c,i)=>{let b=Math.random().toString(36).substring(7),g=null;if(i?.body)try{g=typeof i.body=="string"?JSON.parse(i.body):i.body,g=B(g,{keys:e.sanitizeKeys});}catch{g=String(i.body).substring(0,1e3);}a.set(b,{url:c,method:i?.method||"GET",headers:B(i?.headers,{keys:e.sanitizeKeys}),body:g}),w({type:"FETCH_REQ",id:b,url:c,method:i?.method||"GET",headers:B(i?.headers,{keys:e.sanitizeKeys}),body:g,time:new Date().toISOString()});}),R.onFetchResponse((c,i,b)=>{for(let[g,F]of a.entries())if(F.url===c){a.delete(g),w({type:"FETCH_RES",id:g,url:c,status:i,statusText:"",duration:`${b}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),R.onFetchError((c,i)=>{for(let[b,g]of a.entries())if(g.url===c){a.delete(b),w({type:"FETCH_ERR",id:b,url:c,error:i.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),R.attach(),m.push(()=>R.detach());}return e.captureXHR&&(S.onXHRRequest(a=>{w({type:"XHR_REQ",id:Math.random().toString(36).substring(7),url:a.url,method:a.method,headers:a.headers,body:a.body,time:new Date().toISOString()});}),S.onXHRResponse((a,c,i)=>{w({type:"XHR_RES",id:Math.random().toString(36).substring(7),url:a.url,status:c,statusText:"",duration:`${i}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),S.onXHRError((a,c)=>{w({type:"XHR_ERR",id:Math.random().toString(36).substring(7),url:a.url,error:c.message,duration:"[unknown]ms",time:new Date().toISOString()});}),S.attach(),m.push(()=>S.detach())),()=>{m.forEach(a=>a()),v.current=false;}},[e,w,x,k,R,S]);let T=react.useCallback((m,a,c)=>{if(typeof window>"u")return null;E();let i=a||$(m,{},e),b,g;if(m==="json"){let F=e.includeMetadata?{metadata:s.current,logs:r.current}:r.current;b=x(F),g="application/json";}else b=(e.includeMetadata?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${x(s.current)}
${"=".repeat(80)}

`:"")+r.current.map(O=>`[${O.time}] ${O.type}
${x(O)}
${"=".repeat(80)}`).join(`
`),g="text/plain";return U.downloadWithFallback(b,i,g),i},[e,x,E]),N=react.useCallback(async m=>{let a=m||e.uploadEndpoint;if(!a)return {success:false,error:"No endpoint configured"};try{E();let c={metadata:s.current,logs:r.current,fileName:$("json",{},e)},i=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:x(c)});if(!i.ok)throw new Error(`Upload failed: ${i.status}`);return {success:!0,data:await i.json()}}catch(c){let i=c instanceof Error?c.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",c),{success:false,error:i}}},[e.uploadEndpoint,x,E]),_=react.useCallback(()=>{if(r.current=[],p(0),h.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),M=react.useCallback(()=>[...r.current],[]),D=react.useCallback(()=>n,[n]),oe=react.useCallback(()=>(E(),{...s.current}),[E]);return {downloadLogs:T,uploadLogs:N,clearLogs:_,getLogs:M,getLogCount:D,getMetadata:oe,sessionId:l.current}}var le=goober.css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9998;
  padding: 8px 14px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.15s ease;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0);
  }
`,V=goober.css`
  background: #e5e7eb;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,ce=goober.css`
  background: #fee2e2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,de=goober.css`
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 9999;
  background: #fff;
  border-radius: 10px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 360px;
  max-height: 580px;
  overflow: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`,ue=goober.css`
  background: #fafafa;
  color: #374151;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`,Ie=goober.css`
  display: flex;
  gap: 8px;
`,pe=goober.css`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`,ge=goober.css`
  margin: 2px 0 0;
  font-size: 11px;
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
`,fe=goober.css`
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
  line-height: 1;

  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
`,be=goober.css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 0;
  background: #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`,G=goober.css`
  text-align: center;
  background: #fff;
  padding: 10px 8px;
`,q=goober.css`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
`,Q=goober.css`
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`,Me=goober.css`
  color: #dc2626;
`,De=goober.css`
  color: #ea580c;
`,me=goober.css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`,ye=goober.css`
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  font-size: 11px;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &::-webkit-details-marker {
    display: none;
  }
`,he=goober.css`
  margin-top: 10px;
  font-size: 11px;
  color: #6b7280;
  line-height: 1.6;

  & > div {
    margin-bottom: 4px;
    display: flex;
    gap: 6px;
  }

  strong {
    color: #374151;
    font-weight: 600;
    min-width: 75px;
  }
`,Fe=goober.css`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`,Z=goober.css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,xe=goober.css`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,Oe=goober.css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`,z=goober.css`
  padding: 8px 12px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover:not(:disabled) {
    background: #e5e7eb;
    border-color: #d1d5db;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    background: #d1d5db;
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #f3f4f6;
  }
`,Ke=goober.css`
  width: 100%;
  padding: 9px 14px;
  background: #f0f4ff;
  color: #4f46e5;
  border: 1px solid #e0e7ff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #e0e7ff;
    border-color: #c7d2fe;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    background: #c7d2fe;
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #f3f4f6;
    opacity: 0.6;
  }
`,we=goober.css`
  width: 100%;
  padding: 9px 14px;
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #dcfce7;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #dcfce7;
    border-color: #bbf7d0;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    background: #bbf7d0;
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #f3f4f6;
  }
`,ve=goober.css`
  width: 100%;
  padding: 9px 14px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #fee2e2;
    border-color: #fecaca;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    background: #fecaca;
  }
`,P=goober.css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
`,A=goober.css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
`,Se=goober.css`
  padding: 12px 16px;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #9ca3af;
`,ke=goober.css`
  kbd {
    display: inline-block;
    padding: 2px 6px;
    background: #e5e7eb;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 11px;
    color: #6b7280;
  }
`;goober.css`
  @media (prefers-color-scheme: dark) {
    ${de} {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    ${ue} {
      background: #0f172a;
      border-color: #1e293b;
    }

    ${pe} {
      color: #f1f5f9;
    }

    ${ge} {
      color: #64748b;
    }

    ${fe} {
      color: #64748b;

      &:hover {
        background: #1e293b;
        color: #94a3b8;
      }
    }

    ${be} {
      background: #0f172a;
      border-color: #334155;
    }

    ${q} {
      color: #f1f5f9;
    }

    ${me} {
      background: #0f172a;
      border-color: #334155;
    }

    ${ye} {
      color: #e2e8f0;
    }

    ${he} {
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

    ${xe} {
      color: #94a3b8;
    }

    ${z} {
      background: #1e293b;
      color: #e2e8f0;
      border-color: #334155;

      &:hover:not(:disabled) {
        background: #334155;
        border-color: #475569;
      }

      &:active:not(:disabled) {
        background: #475569;
      }
    }

    ${Ke} {
      background: #1e293b;
      color: #818cf8;
      border-color: #334155;

      &:hover:not(:disabled) {
        background: #334155;
        border-color: #475569;
      }

      &:active:not(:disabled) {
        background: #475569;
      }
    }

    ${we} {
      background: #1e293b;
      color: #4ade80;
      border-color: #334155;

      &:hover:not(:disabled) {
        background: #334155;
        border-color: #475569;
      }

      &:active:not(:disabled) {
        background: #475569;
      }
    }

    ${ve} {
      background: #1e293b;
      color: #f87171;
      border-color: #334155;

      &:hover {
        background: #334155;
        border-color: #475569;
      }

      &:active {
        background: #475569;
      }
    }

    ${P} {
      background: #064e3b;
      color: #6ee7b7;
      border-color: #065f46;
    }

    ${A} {
      background: #7f1d1d;
      color: #fca5a5;
      border-color: #991b1b;
    }

    ${Se} {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

    ${ke} kbd {
      background: #334155;
      color: #e2e8f0;
    }

    ${le} {
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &:hover {
        background: #334155;
        border-color: #475569;
      }
    }

    ${V} {
      background: #334155;
      color: #94a3b8;
    }
  }
`;function Be({user:o,environment:e="production",uploadEndpoint:t,fileNameTemplate:r="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:l=2e3,showInProduction:s=false}){let[n,p]=react.useState(false),[h,v]=react.useState(false),[x,k]=react.useState(null),[R,S]=react.useState(null),[w,E]=react.useState(null),T=react.useRef(null),N=react.useRef(null),_=react.useRef(null),{downloadLogs:M,uploadLogs:D,clearLogs:oe,getLogs:m,getLogCount:a,getMetadata:c,sessionId:i}=X({fileNameTemplate:r,environment:e,userId:o?.id||o?.email||"guest",includeMetadata:true,uploadEndpoint:t,maxLogs:l,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),b=a(),g=c();react.useEffect(()=>{let f=C=>{C.ctrlKey&&C.shiftKey&&C.key==="D"&&(C.preventDefault(),p(re=>!re)),C.key==="Escape"&&n&&(C.preventDefault(),p(false),N.current?.focus());};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[n]),react.useEffect(()=>{if(g.errorCount>=5&&t){let f=async()=>{try{await D();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",f),()=>window.removeEventListener("error",f)}},[g.errorCount,t,D]);let F=react.useCallback(async()=>{v(true),k(null);try{let f=await D();f.success?(k({type:"success",message:`Uploaded successfully! ${f.data?JSON.stringify(f.data):""}`}),f.data&&typeof f.data=="object"&&"url"in f.data&&await navigator.clipboard.writeText(String(f.data.url))):k({type:"error",message:`Upload failed: ${f.error}`});}catch(f){k({type:"error",message:`Error: ${f instanceof Error?f.message:"Unknown error"}`});}finally{v(false);}},[D]),O=react.useCallback(f=>{let C=M(f);C&&k({type:"success",message:`Downloaded: ${C}`});},[M]),ze=react.useCallback(async()=>{S(null);try{if(!("showDirectoryPicker"in window)){S({type:"error",message:"Feature only supported in Chrome/Edge"});return}await M("json",void 0,{showPicker:!0})&&S({type:"success",message:"Saved to directory"});}catch{S({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[M]),_e=react.useCallback(async()=>{E(null);try{let f=m(),C=c(),re=JSON.stringify({metadata:C,logs:f},null,2);await navigator.clipboard.writeText(re),E({type:"success",message:"Copied to clipboard!"});}catch{E({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[m,c]);if(react.useEffect(()=>{if(R){let f=setTimeout(()=>{S(null);},3e3);return ()=>clearTimeout(f)}},[R]),react.useEffect(()=>{if(w){let f=setTimeout(()=>{E(null);},3e3);return ()=>clearTimeout(f)}},[w]),!(s||e==="development"||o?.role==="admin"))return null;let $e=()=>{p(true);},Ue=()=>{p(false),N.current?.focus();};return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs("button",{ref:N,type:"button",onClick:$e,className:le,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",children:[jsxRuntime.jsx("span",{children:"Debug"}),jsxRuntime.jsx("span",{className:b>0?g.errorCount>0?ce:V:V,children:b}),g.errorCount>0&&jsxRuntime.jsxs("span",{className:ce,children:[g.errorCount," err"]})]}),n&&jsxRuntime.jsxs("div",{ref:T,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:de,children:[jsxRuntime.jsxs("div",{className:ue,children:[jsxRuntime.jsxs("div",{className:Ie,children:[jsxRuntime.jsx("h3",{className:pe,children:"Debug"}),jsxRuntime.jsxs("p",{className:ge,children:[i.substring(0,36),"..."]})]}),jsxRuntime.jsx("button",{ref:_,type:"button",onClick:Ue,className:fe,"aria-label":"Close debug panel",children:"\u2715"})]}),jsxRuntime.jsxs("div",{className:be,children:[jsxRuntime.jsxs("div",{className:G,children:[jsxRuntime.jsx("div",{className:q,children:b}),jsxRuntime.jsx("div",{className:Q,children:"Logs"})]}),jsxRuntime.jsxs("div",{className:G,children:[jsxRuntime.jsx("div",{className:`${q} ${Me}`,children:g.errorCount}),jsxRuntime.jsx("div",{className:Q,children:"Errors"})]}),jsxRuntime.jsxs("div",{className:G,children:[jsxRuntime.jsx("div",{className:`${q} ${De}`,children:g.networkErrorCount}),jsxRuntime.jsx("div",{className:Q,children:"Network"})]})]}),jsxRuntime.jsxs("details",{className:me,children:[jsxRuntime.jsx("summary",{className:ye,role:"button","aria-expanded":"false",children:jsxRuntime.jsx("span",{children:"\u25B8 Session Details"})}),jsxRuntime.jsxs("div",{className:he,children:[jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"User"}),jsxRuntime.jsx("span",{children:g.userId||"Anonymous"})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Browser"}),jsxRuntime.jsxs("span",{children:[g.browser," (",g.platform,")"]})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Screen"}),jsxRuntime.jsx("span",{children:g.screenResolution})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Timezone"}),jsxRuntime.jsx("span",{children:g.timezone})]})]})]}),jsxRuntime.jsxs("div",{className:Fe,children:[jsxRuntime.jsx("div",{className:Z,children:jsxRuntime.jsxs("div",{className:Oe,children:[jsxRuntime.jsx("button",{type:"button",onClick:()=>O("json"),className:z,"aria-label":"Download logs as JSON",children:"\u{1F4C4} JSON"}),jsxRuntime.jsx("button",{type:"button",onClick:()=>O("txt"),className:z,"aria-label":"Download logs as text file",children:"\u{1F4DD} TXT"}),jsxRuntime.jsx("button",{type:"button",onClick:_e,disabled:b===0,className:z,"aria-label":"Copy logs to clipboard",title:"Copy logs as JSON to clipboard",children:"\u{1F4CB} Copy"}),jsxRuntime.jsx("button",{type:"button",onClick:ze,disabled:!("showDirectoryPicker"in window),className:z,"aria-label":"Save logs to directory",title:"showDirectoryPicker"in window?"Choose directory to save file":"Feature only supported in Chrome/Edge",children:"\u{1F4C1} Folder"})]})}),t&&jsxRuntime.jsxs("div",{className:Z,children:[jsxRuntime.jsx("span",{className:xe,children:"Upload"}),jsxRuntime.jsx("button",{type:"button",onClick:F,disabled:h,className:we,"aria-label":h?"Uploading logs...":"Upload logs to server","aria-busy":h,children:h?"\u23F3 Uploading...":"\u2601\uFE0F Upload to Server"})]}),x&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:x.type==="success"?P:A,children:x.message}),R&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:R.type==="success"?P:A,children:R.message}),w&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:w.type==="success"?P:A,children:w.message}),jsxRuntime.jsx("div",{className:Z,children:jsxRuntime.jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs? This cannot be undone.")&&(oe(),k(null));},className:ve,"aria-label":"Clear all logs",children:"\u{1F5D1}\uFE0F Clear All Logs"})})]}),jsxRuntime.jsx("div",{className:Se,children:jsxRuntime.jsxs("div",{className:ke,children:["Press ",jsxRuntime.jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})]})]})}function Je({fileNameTemplate:o="debug_{timestamp}"}){let[e,t]=react.useState(false),{downloadLogs:r,clearLogs:l,getLogCount:s}=X({fileNameTemplate:o}),n=s();return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("button",{onClick:()=>t(p=>!p),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsxRuntime.jsx("span",{children:n})}),e&&jsxRuntime.jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsxRuntime.jsx("button",{onClick:()=>r("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsxRuntime.jsx("button",{onClick:()=>{confirm("Clear all logs?")&&l();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsxRuntime.jsx("button",{onClick:()=>t(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}exports.DebugPanel=Be;exports.DebugPanelMinimal=Je;exports.collectMetadata=Ee;exports.filterStackTrace=se;exports.generateExportFilename=et;exports.generateFilename=$;exports.generateSessionId=Ce;exports.getBrowserInfo=ne;exports.sanitizeData=B;exports.sanitizeFilename=I;exports.transformMetadataToECS=ae;exports.transformToECS=Te;exports.useLogRecorder=X;