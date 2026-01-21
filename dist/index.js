'use strict';var react=require('react'),goober=require('goober'),jsxRuntime=require('react/jsx-runtime');// @ts-nocheck
var Fe=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function K(a,e={}){let o=e.keys||Fe;if(!a||typeof a!="object")return a;let t=Array.isArray(a)?[...a]:{...a},c=i=>{if(!i||typeof i!="object")return i;for(let r in i)if(Object.prototype.hasOwnProperty.call(i,r)){let f=r.toLowerCase();o.some(v=>f.includes(v.toLowerCase()))?i[r]="***REDACTED***":i[r]!==null&&typeof i[r]=="object"&&(i[r]=c(i[r]));}return i};return c(t)}function O(a){return a.replace(/[^a-z0-9_\-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function re(){if(typeof navigator>"u")return "unknown";let a=navigator.userAgent;return a.includes("Edg")?"edge":a.includes("Chrome")?"chrome":a.includes("Firefox")?"firefox":a.includes("Safari")?"safari":"unknown"}function Se(a,e,o,t){if(typeof window>"u")return {sessionId:a,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:t,errorCount:0,networkErrorCount:0};let c=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",i=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:a,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:re(),platform:navigator.platform,language:navigator.language,screenResolution:c,viewport:i,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:t,errorCount:0,networkErrorCount:0}}function ke(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function U(a="json",e={},o={}){let{fileNameTemplate:t="{env}_{userId}_{sessionId}_{timestamp}",environment:c="development",userId:i="anonymous",sessionId:r="unknown"}=o,f=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],h=new Date().toISOString().split("T")[0],v=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),x=o.browser||re(),S=o.platform||(typeof navigator<"u"?navigator.platform:"unknown"),R=(o.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",w=String(o.errorCount??e.errorCount??0),C=String(o.logCount??e.logCount??0),I=t.replace("{env}",O(c)).replace("{userId}",O(i??"anonymous")).replace("{sessionId}",O(r??"unknown")).replace("{timestamp}",f).replace("{date}",h).replace("{time}",v).replace(/\{errorCount\}/g,w).replace(/\{logCount\}/g,C).replace("{browser}",O(x)).replace("{platform}",O(S)).replace("{url}",O(R));for(let[T,F]of Object.entries(e))I=I.replace(`{${T}}`,String(F));return `${I}.${a}`}function We(a,e="json"){let o=a.url.split("?")[0]||"unknown";return U(e,{},{environment:a.environment,userId:a.userId,sessionId:a.sessionId,browser:a.browser,platform:a.platform,url:o,errorCount:a.errorCount,logCount:a.logCount})}var B=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let o=this.originalConsole[e];console[e]=(...t)=>{this.callbacks.forEach(c=>{c(e,t);}),o(...t);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var Y=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o));}attach(){window.fetch=async(...e)=>{let[o,t]=e,c=o.toString();if(this.excludeUrls.some(r=>r.test(c)))return this.originalFetch(...e);let i=Date.now();this.onRequest.forEach(r=>r(c,t||{}));try{let r=await this.originalFetch(...e),f=Date.now()-i;return this.onResponse.forEach(h=>h(c,r.status,f)),r}catch(r){throw this.onError.forEach(f=>f(c,r)),r}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var W=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(o,t,c,i,r){let f=typeof t=="string"?t:t.href;if(e.requestTracker.set(this,{method:o,url:f,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(v=>v.test(f)))return e.originalOpen.call(this,o,t,c??true,i,r);let h=e.requestTracker.get(this);for(let v of e.onRequest)v(h);return e.originalOpen.call(this,o,t,c??true,i,r)},this.originalXHR.prototype.send=function(o){let t=e.requestTracker.get(this);if(t){t.body=o;let c=this.onload,i=this.onerror;this.onload=function(r){let f=Date.now()-t.startTime;for(let h of e.onResponse)h(t,this.status,f);c&&c.call(this,r);},this.onerror=function(r){for(let f of e.onError)f(t,new Error("XHR Error"));i&&i.call(this,r);};}return e.originalSend.call(this,o)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var $=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,o,t="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let r=await(await(await window.showDirectoryPicker()).getFileHandle(o,{create:!0})).createWritable();await r.write(e),await r.close();}catch(c){if(c.name==="AbortError")return;throw c}}static download(e,o,t="application/json"){let c=new Blob([e],{type:t}),i=URL.createObjectURL(c),r=document.createElement("a");r.href=i,r.download=o,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i);}static async downloadWithFallback(e,o,t="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,o,t);return}catch(c){if(c.name==="AbortError")return}this.download(e,o,t);}};$.supported=null;var $e={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function P(a={}){let e={...$e,...a},o=react.useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});react.useEffect(()=>{o.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let t=react.useRef([]),c=react.useRef(e.sessionId||ke()),i=react.useRef(Se(c.current,e.environment,e.userId,0)),[r,f]=react.useState(0),h=react.useRef(0),v=react.useRef(false),x=react.useCallback(m=>{let n=new Set;return JSON.stringify(m,(l,s)=>{if(typeof s=="object"&&s!==null){if(n.has(s))return "[Circular]";n.add(s);}return s})},[]),S=react.useMemo(()=>new B,[]),k=react.useMemo(()=>new Y({excludeUrls:e.excludeUrls}),[e.excludeUrls]),R=react.useMemo(()=>new W({excludeUrls:e.excludeUrls}),[e.excludeUrls]),w=react.useCallback(m=>{let n=o.current;t.current.push(m),t.current.length>n.maxLogs&&t.current.shift(),f(t.current.length),m.type==="CONSOLE"?m.level==="ERROR"?h.current++:h.current=0:m.type==="FETCH_ERR"||m.type==="XHR_ERR"?h.current++:h.current=0;let l=n.uploadOnErrorCount??5;if(h.current>=l&&n.uploadEndpoint){let s={metadata:{...i.current,logCount:t.current.length},logs:t.current,fileName:U("json",{},e)};fetch(n.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:x(s)}).catch(()=>{}),h.current=0;}if(n.enablePersistence&&typeof window<"u")try{localStorage.setItem(n.persistenceKey,x(t.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},[x]),C=react.useCallback(()=>{let m=t.current.filter(l=>l.type==="CONSOLE").reduce((l,s)=>s.level==="ERROR"?l+1:l,0),n=t.current.filter(l=>l.type==="FETCH_ERR"||l.type==="XHR_ERR").length;i.current={...i.current,logCount:t.current.length,errorCount:m,networkErrorCount:n};},[]);react.useEffect(()=>{if(typeof window>"u"||v.current)return;if(v.current=true,e.enablePersistence)try{let n=localStorage.getItem(e.persistenceKey);n&&(t.current=JSON.parse(n),f(t.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let m=[];if(e.captureConsole&&(S.attach(),S.onLog((n,l)=>{let s=l.map(b=>{if(typeof b=="object")try{return x(b)}catch{return String(b)}return String(b)}).join(" ");w({type:"CONSOLE",level:n.toUpperCase(),time:new Date().toISOString(),data:s.substring(0,5e3)});}),m.push(()=>S.detach())),e.captureFetch){let n=new Map;k.onFetchRequest((l,s)=>{let b=Math.random().toString(36).substring(7),p=null;if(s?.body)try{p=typeof s.body=="string"?JSON.parse(s.body):s.body,p=K(p,{keys:e.sanitizeKeys});}catch{p=String(s.body).substring(0,1e3);}n.set(b,{url:l,method:s?.method||"GET",headers:K(s?.headers,{keys:e.sanitizeKeys}),body:p}),w({type:"FETCH_REQ",id:b,url:l,method:s?.method||"GET",headers:K(s?.headers,{keys:e.sanitizeKeys}),body:p,time:new Date().toISOString()});}),k.onFetchResponse((l,s,b)=>{for(let[p,N]of n.entries())if(N.url===l){n.delete(p),w({type:"FETCH_RES",id:p,url:l,status:s,statusText:"",duration:`${b}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),k.onFetchError((l,s)=>{for(let[b,p]of n.entries())if(p.url===l){n.delete(b),w({type:"FETCH_ERR",id:b,url:l,error:s.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),k.attach(),m.push(()=>k.detach());}return e.captureXHR&&(R.onXHRRequest(n=>{w({type:"XHR_REQ",id:Math.random().toString(36).substring(7),url:n.url,method:n.method,headers:n.headers,body:n.body,time:new Date().toISOString()});}),R.onXHRResponse((n,l,s)=>{w({type:"XHR_RES",id:Math.random().toString(36).substring(7),url:n.url,status:l,statusText:"",duration:`${s}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),R.onXHRError((n,l)=>{w({type:"XHR_ERR",id:Math.random().toString(36).substring(7),url:n.url,error:l.message,duration:"[unknown]ms",time:new Date().toISOString()});}),R.attach(),m.push(()=>R.detach())),()=>{m.forEach(n=>n()),v.current=false;}},[e,w,x,S,k,R]);let I=react.useCallback((m="json",n)=>{if(typeof window>"u")return null;C();let l=n||U(m,{},e),s,b;if(m==="json"){let p=e.includeMetadata?{metadata:i.current,logs:t.current}:t.current;s=x(p),b="application/json";}else s=(e.includeMetadata?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${x(i.current)}
${"=".repeat(80)}

`:"")+t.current.map(N=>`[${N.time}] ${N.type}
${x(N)}
${"=".repeat(80)}`).join(`
`),b="text/plain";return $.downloadWithFallback(s,l,b),l},[e,x,C]),T=react.useCallback(async m=>{let n=m||e.uploadEndpoint;if(!n)return {success:false,error:"No endpoint configured"};try{C();let l={metadata:i.current,logs:t.current,fileName:U("json",{},e)},s=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:x(l)});if(!s.ok)throw new Error(`Upload failed: ${s.status}`);return {success:!0,data:await s.json()}}catch(l){let s=l instanceof Error?l.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",l),{success:false,error:s}}},[e.uploadEndpoint,x,C]),F=react.useCallback(()=>{if(t.current=[],f(0),h.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),D=react.useCallback(()=>[...t.current],[]),H=react.useCallback(()=>r,[r]),te=react.useCallback(()=>(C(),{...i.current}),[C]);return {downloadLogs:I,uploadLogs:T,clearLogs:F,getLogs:D,getLogCount:H,getMetadata:te,sessionId:c.current}}var se=goober.css`
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
`,J=goober.css`
  background: #e5e7eb;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,ae=goober.css`
  background: #fee2e2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,ie=goober.css`
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
`,le=goober.css`
  background: #fafafa;
  color: #374151;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`,Ee=goober.css`
  display: flex;
  gap: 8px;
`,ce=goober.css`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`,de=goober.css`
  margin: 2px 0 0;
  font-size: 11px;
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
`,ue=goober.css`
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
`,pe=goober.css`
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
`,V=goober.css`
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`,Le=goober.css`
  color: #dc2626;
`,Ie=goober.css`
  color: #ea580c;
`,ge=goober.css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`,fe=goober.css`
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
`,be=goober.css`
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
`,Te=goober.css`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`,Q=goober.css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,me=goober.css`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,Ne=goober.css`
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
`,Pe=goober.css`
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
`,ye=goober.css`
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
`,he=goober.css`
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
`,X=goober.css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
`,_=goober.css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
`,xe=goober.css`
  padding: 12px 16px;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #9ca3af;
`,we=goober.css`
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
    ${ie} {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    ${le} {
      background: #0f172a;
      border-color: #1e293b;
    }

    ${ce} {
      color: #f1f5f9;
    }

    ${de} {
      color: #64748b;
    }

    ${ue} {
      color: #64748b;

      &:hover {
        background: #1e293b;
        color: #94a3b8;
      }
    }

    ${pe} {
      background: #0f172a;
      border-color: #334155;
    }

    ${q} {
      color: #f1f5f9;
    }

    ${ge} {
      background: #0f172a;
      border-color: #334155;
    }

    ${fe} {
      color: #e2e8f0;
    }

    ${be} {
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

    ${me} {
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

    ${Pe} {
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

    ${ye} {
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

    ${he} {
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

    ${X} {
      background: #064e3b;
      color: #6ee7b7;
      border-color: #065f46;
    }

    ${_} {
      background: #7f1d1d;
      color: #fca5a5;
      border-color: #991b1b;
    }

    ${xe} {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

    ${we} kbd {
      background: #334155;
      color: #e2e8f0;
    }

    ${se} {
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &:hover {
        background: #334155;
        border-color: #475569;
      }
    }

    ${J} {
      background: #334155;
      color: #94a3b8;
    }
  }
`;function qe({user:a,environment:e="production",uploadEndpoint:o,fileNameTemplate:t="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:c=2e3,showInProduction:i=false}){let[r,f]=react.useState(false),[h,v]=react.useState(false),[x,S]=react.useState(null),[k,R]=react.useState(null),[w,C]=react.useState(null),I=react.useRef(null),T=react.useRef(null),F=react.useRef(null),{downloadLogs:D,uploadLogs:H,clearLogs:te,getLogs:m,getLogCount:n,getMetadata:l,sessionId:s}=P({fileNameTemplate:t,environment:e,userId:a?.id||a?.email||"guest",includeMetadata:true,uploadEndpoint:o,maxLogs:c,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),b=n(),p=l();react.useEffect(()=>{let g=E=>{E.ctrlKey&&E.shiftKey&&E.key==="D"&&(E.preventDefault(),f(oe=>!oe)),E.key==="Escape"&&r&&(E.preventDefault(),f(false),T.current?.focus());};return window.addEventListener("keydown",g),()=>window.removeEventListener("keydown",g)},[r]),react.useEffect(()=>{if(p.errorCount>=5&&o){let g=async()=>{try{await H();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",g),()=>window.removeEventListener("error",g)}},[p.errorCount,o,H]);let N=react.useCallback(async()=>{v(true),S(null);try{let g=await H();g.success?(S({type:"success",message:`Uploaded successfully! ${g.data?JSON.stringify(g.data):""}`}),g.data&&typeof g.data=="object"&&"url"in g.data&&await navigator.clipboard.writeText(String(g.data.url))):S({type:"error",message:`Upload failed: ${g.error}`});}catch(g){S({type:"error",message:`Error: ${g instanceof Error?g.message:"Unknown error"}`});}finally{v(false);}},[H]),Re=react.useCallback(g=>{let E=D(g);E&&S({type:"success",message:`Downloaded: ${E}`});},[D]),De=react.useCallback(async()=>{R(null);try{if(!("showDirectoryPicker"in window)){R({type:"error",message:"Feature only supported in Chrome/Edge"});return}await D("json",void 0,{showPicker:!0})&&R({type:"success",message:"Saved to directory"});}catch{R({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[D]),He=react.useCallback(async()=>{C(null);try{let g=m(),E=l(),oe=JSON.stringify({metadata:E,logs:g},null,2);await navigator.clipboard.writeText(oe),C({type:"success",message:"Copied to clipboard!"});}catch{C({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[m,l]);if(react.useEffect(()=>{if(k){let g=setTimeout(()=>{R(null);},3e3);return ()=>clearTimeout(g)}},[k]),react.useEffect(()=>{if(w){let g=setTimeout(()=>{C(null);},3e3);return ()=>clearTimeout(g)}},[w]),!(i||e==="development"||a?.role==="admin"))return null;let Me=()=>{f(true);},ze=()=>{f(false),T.current?.focus();};return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs("button",{ref:T,type:"button",onClick:Me,className:se,"aria-label":r?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":r,"aria-controls":"debug-panel",children:[jsxRuntime.jsx("span",{children:"Debug"}),jsxRuntime.jsx("span",{className:b>0?p.errorCount>0?ae:J:J,children:b}),p.errorCount>0&&jsxRuntime.jsxs("span",{className:ae,children:[p.errorCount," err"]})]}),r&&jsxRuntime.jsxs("div",{ref:I,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:ie,children:[jsxRuntime.jsxs("div",{className:le,children:[jsxRuntime.jsxs("div",{className:Ee,children:[jsxRuntime.jsx("h3",{className:ce,children:"Debug"}),jsxRuntime.jsxs("p",{className:de,children:[s.substring(0,36),"..."]})]}),jsxRuntime.jsx("button",{ref:F,type:"button",onClick:ze,className:ue,"aria-label":"Close debug panel",children:"\u2715"})]}),jsxRuntime.jsxs("div",{className:pe,children:[jsxRuntime.jsxs("div",{className:G,children:[jsxRuntime.jsx("div",{className:q,children:b}),jsxRuntime.jsx("div",{className:V,children:"Logs"})]}),jsxRuntime.jsxs("div",{className:G,children:[jsxRuntime.jsx("div",{className:`${q} ${Le}`,children:p.errorCount}),jsxRuntime.jsx("div",{className:V,children:"Errors"})]}),jsxRuntime.jsxs("div",{className:G,children:[jsxRuntime.jsx("div",{className:`${q} ${Ie}`,children:p.networkErrorCount}),jsxRuntime.jsx("div",{className:V,children:"Network"})]})]}),jsxRuntime.jsxs("details",{className:ge,children:[jsxRuntime.jsx("summary",{className:fe,role:"button","aria-expanded":"false",children:jsxRuntime.jsx("span",{children:"\u25B8 Session Details"})}),jsxRuntime.jsxs("div",{className:be,children:[jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"User"}),jsxRuntime.jsx("span",{children:p.userId||"Anonymous"})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Browser"}),jsxRuntime.jsxs("span",{children:[p.browser," (",p.platform,")"]})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Screen"}),jsxRuntime.jsx("span",{children:p.screenResolution})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Timezone"}),jsxRuntime.jsx("span",{children:p.timezone})]})]})]}),jsxRuntime.jsxs("div",{className:Te,children:[jsxRuntime.jsx("div",{className:Q,children:jsxRuntime.jsxs("div",{className:Ne,children:[jsxRuntime.jsx("button",{type:"button",onClick:()=>Re("json"),className:z,"aria-label":"Download logs as JSON",children:"\u{1F4C4} JSON"}),jsxRuntime.jsx("button",{type:"button",onClick:()=>Re("txt"),className:z,"aria-label":"Download logs as text file",children:"\u{1F4DD} TXT"}),jsxRuntime.jsx("button",{type:"button",onClick:He,disabled:b===0,className:z,"aria-label":"Copy logs to clipboard",title:"Copy logs as JSON to clipboard",children:"\u{1F4CB} Copy"}),jsxRuntime.jsx("button",{type:"button",onClick:De,disabled:!("showDirectoryPicker"in window),className:z,"aria-label":"Save logs to directory",title:"showDirectoryPicker"in window?"Choose directory to save file":"Feature only supported in Chrome/Edge",children:"\u{1F4C1} Folder"})]})}),o&&jsxRuntime.jsxs("div",{className:Q,children:[jsxRuntime.jsx("span",{className:me,children:"Upload"}),jsxRuntime.jsx("button",{type:"button",onClick:N,disabled:h,className:ye,"aria-label":h?"Uploading logs...":"Upload logs to server","aria-busy":h,children:h?"\u23F3 Uploading...":"\u2601\uFE0F Upload to Server"})]}),x&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:x.type==="success"?X:_,children:x.message}),k&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:k.type==="success"?X:_,children:k.message}),w&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:w.type==="success"?X:_,children:w.message}),jsxRuntime.jsx("div",{className:Q,children:jsxRuntime.jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs? This cannot be undone.")&&(te(),S(null));},className:he,"aria-label":"Clear all logs",children:"\u{1F5D1}\uFE0F Clear All Logs"})})]}),jsxRuntime.jsx("div",{className:xe,children:jsxRuntime.jsxs("div",{className:we,children:["Press ",jsxRuntime.jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})]})]})}function je({fileNameTemplate:a="debug_{timestamp}"}){let[e,o]=react.useState(false),{downloadLogs:t,clearLogs:c,getLogCount:i}=P({fileNameTemplate:a}),r=i();return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("button",{onClick:()=>o(f=>!f),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsxRuntime.jsx("span",{children:r})}),e&&jsxRuntime.jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsxRuntime.jsx("button",{onClick:()=>t("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsxRuntime.jsx("button",{onClick:()=>{confirm("Clear all logs?")&&c();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsxRuntime.jsx("button",{onClick:()=>o(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}exports.DebugPanel=qe;exports.DebugPanelMinimal=je;exports.collectMetadata=Se;exports.generateExportFilename=We;exports.generateFilename=U;exports.generateSessionId=ke;exports.getBrowserInfo=re;exports.sanitizeData=K;exports.sanitizeFilename=O;exports.useLogRecorder=P;