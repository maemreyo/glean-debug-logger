import {useRef,useEffect,useState,useCallback,useMemo}from'react';import {css}from'goober';import {jsxs,Fragment,jsx}from'react/jsx-runtime';// @ts-nocheck
var Oe=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function X(i,e={}){let r=e.keys||Oe;if(!i||typeof i!="object")return i;let n=Array.isArray(i)?[...i]:{...i},c=l=>{if(!l||typeof l!="object")return l;for(let t in l)if(Object.prototype.hasOwnProperty.call(l,t)){let p=t.toLowerCase();r.some(h=>p.includes(h.toLowerCase()))?l[t]="***REDACTED***":l[t]!==null&&typeof l[t]=="object"&&(l[t]=c(l[t]));}return l};return c(n)}function D(i){return i.replace(/[^a-z0-9_\-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function G(){if(typeof navigator>"u")return "unknown";let i=navigator.userAgent;return i.includes("Edg")?"edge":i.includes("Chrome")?"chrome":i.includes("Firefox")?"firefox":i.includes("Safari")?"safari":"unknown"}function be(i,e,r,n){if(typeof window>"u")return {sessionId:i,environment:e,userId:r,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:n,errorCount:0,networkErrorCount:0};let c=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",l=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:i,environment:e,userId:r,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:G(),platform:navigator.platform,language:navigator.language,screenResolution:c,viewport:l,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:n,errorCount:0,networkErrorCount:0}}function ye(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function z(i="json",e={},r={}){let{fileNameTemplate:n="{env}_{userId}_{sessionId}_{timestamp}",environment:c="development",userId:l="anonymous",sessionId:t="unknown"}=r,p=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],g=new Date().toISOString().split("T")[0],h=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),x=r.browser||G(),R=r.platform||(typeof navigator<"u"?navigator.platform:"unknown"),v=(r.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",k=String(r.errorCount??e.errorCount??0),C=String(r.logCount??e.logCount??0),N=n.replace("{env}",D(c)).replace("{userId}",D(l??"anonymous")).replace("{sessionId}",D(t??"unknown")).replace("{timestamp}",p).replace("{date}",g).replace("{time}",h).replace(/\{errorCount\}/g,k).replace(/\{logCount\}/g,C).replace("{browser}",D(x)).replace("{platform}",D(R)).replace("{url}",D(v));for(let[I,T]of Object.entries(e))N=N.replace(`{${I}}`,String(T));return `${N}.${i}`}function je(i,e="json"){let r=i.url.split("?")[0]||"unknown";return z(e,{},{environment:i.environment,userId:i.userId,sessionId:i.sessionId,browser:i.browser,platform:i.platform,url:r,errorCount:i.errorCount,logCount:i.logCount})}var $=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let r=this.originalConsole[e];console[e]=(...n)=>{this.callbacks.forEach(c=>{c(e,n);}),r(...n);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var _=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(r=>new RegExp(r));}attach(){window.fetch=async(...e)=>{let[r,n]=e,c=r.toString();if(this.excludeUrls.some(t=>t.test(c)))return this.originalFetch(...e);let l=Date.now();this.onRequest.forEach(t=>t(c,n||{}));try{let t=await this.originalFetch(...e),p=t.clone(),g=Date.now()-l,h;try{h=await p.text();}catch{h="[Unable to read response body]";}return this.onResponse.forEach(x=>x(c,t.status,g)),t}catch(t){throw this.onError.forEach(p=>p(c,t)),t}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var j=class{constructor(e={}){this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(r=>new RegExp(r));}attach(){let e=this.originalXHR,r=this,n=function(){let t=new e;return r.requestTracker.set(t,{method:"",url:"",headers:{},body:null,startTime:Date.now()}),t};n.prototype=Object.create(e.prototype),n.prototype.constructor=n;let c=e.prototype.open;n.prototype.open=function(t,p){let g=r.requestTracker.get(this);if(g){if(g.method=t,g.url=p,r.excludeUrls.some(h=>h.test(p)))return c.apply(this,[t,p]);for(let h of r.onRequest)h(g);}return c.apply(this,[t,p])};let l=e.prototype.send;n.prototype.send=function(t){let p=r.requestTracker.get(this);return p&&(p.body=t,this.onload=()=>{let g=Date.now()-p.startTime;for(let h of r.onResponse)h(p,this.status,g);},this.onerror=()=>{for(let g of r.onError)g(p,new Error("XHR Error"));}),l.apply(this,[t])},window.XMLHttpRequest=n;}detach(){window.XMLHttpRequest=this.originalXHR;}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var M=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,r,n="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let t=await(await(await window.showDirectoryPicker()).getFileHandle(r,{create:!0})).createWritable();await t.write(e),await t.close();}catch(c){if(c.name==="AbortError")return;throw c}}static download(e,r,n="application/json"){let c=new Blob([e],{type:n}),l=URL.createObjectURL(c),t=document.createElement("a");t.href=l,t.download=r,document.body.appendChild(t),t.click(),document.body.removeChild(t),URL.revokeObjectURL(l);}static async downloadWithFallback(e,r,n="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,r,n);return}catch(c){if(c.name==="AbortError")return}this.download(e,r,n);}};M.supported=null;var Me={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function U(i={}){let e={...Me,...i},r=useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});useEffect(()=>{r.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let n=useRef([]),c=useRef(e.sessionId||ye()),l=useRef(be(c.current,e.environment,e.userId,0)),[t,p]=useState(0),g=useRef(0),h=useRef(false),x=useCallback(b=>{let s=new Set;return JSON.stringify(b,(o,a)=>{if(typeof a=="object"&&a!==null){if(s.has(a))return "[Circular]";s.add(a);}return a})},[]),R=useMemo(()=>new $,[]),S=useMemo(()=>new _({excludeUrls:e.excludeUrls}),[e.excludeUrls]),v=useMemo(()=>new j({excludeUrls:e.excludeUrls}),[e.excludeUrls]),k=useCallback(b=>{let s=r.current;n.current.push(b),n.current.length>s.maxLogs&&n.current.shift(),p(n.current.length),b.type==="CONSOLE"?b.level==="ERROR"?g.current++:g.current=0:b.type==="FETCH_ERR"||b.type==="XHR_ERR"?g.current++:g.current=0;let o=s.uploadOnErrorCount??5;if(g.current>=o&&s.uploadEndpoint){let a={metadata:{...l.current,logCount:n.current.length},logs:n.current,fileName:z("json",{},e)};fetch(s.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:x(a)}).catch(()=>{}),g.current=0;}if(s.enablePersistence&&typeof window<"u")try{localStorage.setItem(s.persistenceKey,x(n.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},[x]),C=useCallback(()=>{let b=n.current.filter(o=>o.type==="CONSOLE").reduce((o,a)=>a.level==="ERROR"?o+1:o,0),s=n.current.filter(o=>o.type==="FETCH_ERR"||o.type==="XHR_ERR").length;l.current={...l.current,logCount:n.current.length,errorCount:b,networkErrorCount:s};},[]);useEffect(()=>{if(typeof window>"u"||h.current)return;if(h.current=true,e.enablePersistence)try{let s=localStorage.getItem(e.persistenceKey);s&&(n.current=JSON.parse(s),p(n.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let b=[];if(e.captureConsole&&(R.attach(),R.onLog((s,o)=>{let a=o.map(y=>{if(typeof y=="object")try{return x(y)}catch{return String(y)}return String(y)}).join(" ");k({type:"CONSOLE",level:s.toUpperCase(),time:new Date().toISOString(),data:a.substring(0,5e3)});}),b.push(()=>R.detach())),e.captureFetch){let s=new Map;S.onFetchRequest((o,a)=>{let y=Math.random().toString(36).substring(7),w=null;if(a?.body)try{w=typeof a.body=="string"?JSON.parse(a.body):a.body,w=X(w,{keys:e.sanitizeKeys});}catch{w=String(a.body).substring(0,1e3);}s.set(y,{url:o,method:a?.method||"GET",headers:X(a?.headers,{keys:e.sanitizeKeys}),body:w}),k({type:"FETCH_REQ",id:y,url:o,method:a?.method||"GET",headers:X(a?.headers,{keys:e.sanitizeKeys}),body:w,time:new Date().toISOString()});}),S.onFetchResponse((o,a,y)=>{for(let[w,H]of s.entries())if(H.url===o){s.delete(w),k({type:"FETCH_RES",id:w,url:o,status:a,statusText:"",duration:`${y}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),S.onFetchError((o,a)=>{for(let[y,w]of s.entries())if(w.url===o){s.delete(y),k({type:"FETCH_ERR",id:y,url:o,error:a.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),S.attach(),b.push(()=>S.detach());}return e.captureXHR&&(v.onXHRRequest(s=>{k({type:"XHR_REQ",id:Math.random().toString(36).substring(7),url:s.url,method:s.method,headers:s.headers,body:s.body,time:new Date().toISOString()});}),v.onXHRResponse((s,o,a)=>{k({type:"XHR_RES",id:Math.random().toString(36).substring(7),url:s.url,status:o,statusText:"",duration:`${a}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),v.onXHRError((s,o)=>{k({type:"XHR_ERR",id:Math.random().toString(36).substring(7),url:s.url,error:o.message,duration:"[unknown]ms",time:new Date().toISOString()});}),v.attach(),b.push(()=>v.detach())),()=>{b.forEach(s=>s()),h.current=false;}},[e,k,x,R,S,v]);let N=useCallback((b="json",s)=>{if(typeof window>"u")return null;C();let o=s||z(b,{},e),a,y;if(b==="json"){let w=e.includeMetadata?{metadata:l.current,logs:n.current}:n.current;a=x(w),y="application/json";}else a=(e.includeMetadata?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${x(l.current)}
${"=".repeat(80)}

`:"")+n.current.map(H=>`[${H.time}] ${H.type}
${x(H)}
${"=".repeat(80)}`).join(`
`),y="text/plain";return M.downloadWithFallback(a,o,y),o},[e,x,C]),I=useCallback(async b=>{let s=b||e.uploadEndpoint;if(!s)return {success:false,error:"No endpoint configured"};try{C();let o={metadata:l.current,logs:n.current,fileName:z("json",{},e)},a=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:x(o)});if(!a.ok)throw new Error(`Upload failed: ${a.status}`);return {success:!0,data:await a.json()}}catch(o){let a=o instanceof Error?o.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",o),{success:false,error:a}}},[e.uploadEndpoint,x,C]),T=useCallback(()=>{if(n.current=[],p(0),g.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),Y=useCallback(()=>[...n.current],[]),V=useCallback(()=>t,[t]),W=useCallback(()=>(C(),{...l.current}),[C]);return {downloadLogs:N,uploadLogs:I,clearLogs:T,getLogs:Y,getLogCount:V,getMetadata:W,sessionId:c.current}}var Q=css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9998;
  padding: 12px 20px;
  background: #1f2937;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`,Z=css`
  background: #374151;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`,ee=css`
  background: #ef4444;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`,te=css`
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 9999;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 384px;
  max-height: 600px;
  overflow: auto;
  border: 1px solid #e5e7eb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`,oe=css`
  background: linear-gradient(to right, #1f2937, #111827);
  color: #fff;
  padding: 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,xe=css`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`,we=css`
  margin: 4px 0 0;
  font-size: 12px;
  opacity: 0.8;
`,ve=css`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`,re=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`,K=css`
  text-align: center;
`,F=css`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`,B=css`
  font-size: 12px;
  color: #6b7280;
`,Re=css`
  color: #dc2626;
`,Se=css`
  color: #ea580c;
`,ne=css`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`,se=css`
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &::-webkit-details-marker {
    display: none;
  }
`,ae=css`
  margin-top: 8px;
  font-size: 12px;
  color: #4b5563;
  line-height: 1.6;

  & > div {
    margin-bottom: 4px;
  }

  strong {
    color: #374151;
  }
`,ke=css`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`,ie=css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,le=css`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`,Ce=css`
  display: flex;
  gap: 8px;
`,ce=css`
  flex: 1;
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`,Ee=css`
  width: 100%;
  padding: 10px 16px;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #6d28d9;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }
`,Le=css`
  width: 100%;
  padding: 10px 16px;
  background: #16a34a;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #15803d;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`,Ie=css`
  width: 100%;
  padding: 10px 16px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`,de=css`
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
`,ue=css`
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
`,pe=css`
  padding: 12px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #6b7280;
`,q=css`
  margin-bottom: 4px;

  kbd {
    padding: 2px 6px;
    background: #e5e7eb;
    border-radius: 4px;
    font-family: monospace;
  }
`;css`
  @media (prefers-color-scheme: dark) {
    ${te} {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    ${oe} {
      background: linear-gradient(to right, #334155, #0f172a);
    }

    ${re} {
      background: #0f172a;
      border-color: #334155;
    }

    ${F} {
      color: #f1f5f9;
    }

    ${ne} {
      background: #0f172a;
      border-color: #334155;
    }

    ${se} {
      color: #e2e8f0;
    }

    ${ae} {
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

    ${pe} {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

    ${q} kbd {
      background: #334155;
      color: #e2e8f0;
    }

    ${Q} {
      background: #334155;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

      &:hover {
        background: #475569;
      }
    }
  }
`;function Ue({user:i,environment:e="production",uploadEndpoint:r,fileNameTemplate:n="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:c=2e3,showInProduction:l=false}){let[t,p]=useState(false),[g,h]=useState(false),[x,R]=useState(null),[S,v]=useState(null),k=useRef(null),C=useRef(null),N=useRef(null),{downloadLogs:I,uploadLogs:T,clearLogs:Y,getLogCount:V,getMetadata:W,sessionId:b}=U({fileNameTemplate:n,environment:e,userId:i?.id||i?.email||"guest",includeMetadata:true,uploadEndpoint:r,maxLogs:c,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),s=V(),o=W();useEffect(()=>{let m=E=>{E.ctrlKey&&E.shiftKey&&E.key==="D"&&(E.preventDefault(),p(He=>!He)),E.key==="Escape"&&t&&(E.preventDefault(),p(false),C.current?.focus());};return window.addEventListener("keydown",m),()=>window.removeEventListener("keydown",m)},[t]),useEffect(()=>{if(o.errorCount>=5&&r){let m=async()=>{try{await T();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",m),()=>window.removeEventListener("error",m)}},[o.errorCount,r,T]);let a=useCallback(async()=>{h(true),R(null);try{let m=await T();m.success?(R({type:"success",message:`Uploaded successfully! ${m.data?JSON.stringify(m.data):""}`}),m.data&&typeof m.data=="object"&&"url"in m.data&&await navigator.clipboard.writeText(String(m.data.url))):R({type:"error",message:`Upload failed: ${m.error}`});}catch(m){R({type:"error",message:`Error: ${m instanceof Error?m.message:"Unknown error"}`});}finally{h(false);}},[T]),y=useCallback(m=>{let E=I(m);E&&R({type:"success",message:`Downloaded: ${E}`});},[I]),w=useCallback(async()=>{v(null);try{if(!("showDirectoryPicker"in window)){v({type:"error",message:"T\xEDnh n\u0103ng ch\u1EC9 h\u1ED7 tr\u1EE3 Chrome/Edge"});return}await I("json",void 0,{showPicker:!0})&&v({type:"success",message:"\u0110\xE3 l\u01B0u v\xE0o th\u01B0 m\u1EE5c"});}catch{v({type:"error",message:"Kh\xF4ng th\u1EC3 l\u01B0u. Vui l\xF2ng th\u1EED l\u1EA1i ho\u1EB7c ch\u1ECDn v\u1ECB tr\xED kh\xE1c."});}},[I]);if(useEffect(()=>{if(S){let m=setTimeout(()=>{v(null);},3e3);return ()=>clearTimeout(m)}},[S]),!(l||e==="development"||i?.role==="admin"))return null;let Ne=()=>{p(true);},De=()=>{p(false),C.current?.focus();};return jsxs(Fragment,{children:[jsxs("button",{ref:C,type:"button",onClick:Ne,className:Q,"aria-label":t?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":t,"aria-controls":"debug-panel",children:[jsx("span",{children:"Debug"}),jsx("span",{className:s>0?o.errorCount>0?ee:Z:Z,children:s}),o.errorCount>0&&jsxs("span",{className:ee,children:[o.errorCount," err"]})]}),t&&jsxs("div",{ref:k,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:te,children:[jsxs("div",{className:oe,children:[jsxs("div",{children:[jsx("h3",{className:xe,children:"Debug Logger"}),jsxs("p",{className:we,children:["Session: ",b.substring(0,20),"..."]})]}),jsx("button",{ref:N,type:"button",onClick:De,className:ve,"aria-label":"Close debug panel",children:"\u2715"})]}),jsxs("div",{className:re,children:[jsxs("div",{className:K,children:[jsx("div",{className:F,children:s}),jsx("div",{className:B,children:"Total Logs"})]}),jsxs("div",{className:K,children:[jsx("div",{className:`${F} ${Re}`,children:o.errorCount}),jsx("div",{className:B,children:"Errors"})]}),jsxs("div",{className:K,children:[jsx("div",{className:`${F} ${Se}`,children:o.networkErrorCount}),jsx("div",{className:B,children:"Net Errors"})]})]}),jsxs("details",{className:ne,children:[jsx("summary",{className:se,role:"button","aria-expanded":"false",children:jsx("span",{children:"Session Info"})}),jsxs("div",{className:ae,children:[jsxs("div",{children:[jsx("strong",{children:"User:"})," ",o.userId||"Anonymous"]}),jsxs("div",{children:[jsx("strong",{children:"Browser:"})," ",o.browser," (",o.platform,")"]}),jsxs("div",{children:[jsx("strong",{children:"Resolution:"})," ",o.screenResolution]}),jsxs("div",{children:[jsx("strong",{children:"URL:"})," ",o.url]}),jsxs("div",{children:[jsx("strong",{children:"Timezone:"})," ",o.timezone]})]})]}),jsxs("div",{className:ke,children:[jsxs("div",{className:ie,children:[jsx("span",{className:le,children:"Download Logs"}),jsxs("div",{className:Ce,children:[jsx("button",{type:"button",onClick:()=>y("json"),className:ce,"aria-label":"Download logs as JSON",children:"JSON"}),jsx("button",{type:"button",onClick:()=>y("txt"),className:ce,"aria-label":"Download logs as text file",children:"TXT"})]}),jsx("button",{type:"button",onClick:w,disabled:!("showDirectoryPicker"in window),className:Ee,"aria-label":"Save logs to directory",title:"showDirectoryPicker"in window?"Ch\u1ECDn th\u01B0 m\u1EE5c \u0111\u1EC3 l\u01B0u file":"T\xEDnh n\u0103ng ch\u1EC9 h\u1ED7 tr\u1EE3 Chrome/Edge",children:"L\u01B0u v\xE0o th\u01B0 m\u1EE5c..."})]}),r&&jsxs("div",{className:ie,children:[jsx("span",{className:le,children:"Upload to Server"}),jsx("button",{type:"button",onClick:a,disabled:g,className:Le,"aria-label":g?"Uploading logs...":"Upload logs to server","aria-busy":g,children:g?"Uploading...":"Upload Logs"})]}),x&&jsx("div",{role:"status","aria-live":"polite",className:x.type==="success"?de:ue,children:x.message}),S&&jsx("div",{role:"status","aria-live":"polite",className:S.type==="success"?de:ue,children:S.message}),jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs? This cannot be undone.")&&(Y(),R(null));},className:Ie,"aria-label":"Clear all logs",children:"Clear All Logs"})]}),jsxs("div",{className:pe,children:[jsxs("div",{className:q,children:[jsx("strong",{children:"\u{1F4A1} Tip:"})," Press"," ",jsx("kbd",{style:{padding:"2px 6px",background:"#e5e7eb",borderRadius:"4px",fontFamily:"monospace"},children:"Ctrl+Shift+D"})," ","to toggle"]}),jsxs("div",{className:q,children:[jsx("strong",{children:"\u{1F4BE} Auto-save:"})," Logs persist across page refreshes"]}),jsxs("div",{className:q,children:[jsx("strong",{children:"\u{1F512} Security:"})," Sensitive data is auto-redacted"]})]})]})]})}function Pe({fileNameTemplate:i="debug_{timestamp}"}){let[e,r]=useState(false),{downloadLogs:n,clearLogs:c,getLogCount:l}=U({fileNameTemplate:i}),t=l();return jsxs(Fragment,{children:[jsx("button",{onClick:()=>r(p=>!p),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsx("span",{children:t})}),e&&jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsx("button",{onClick:()=>n("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsx("button",{onClick:()=>{confirm("Clear all logs?")&&c();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsx("button",{onClick:()=>r(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}export{Ue as DebugPanel,Pe as DebugPanelMinimal,be as collectMetadata,je as generateExportFilename,z as generateFilename,ye as generateSessionId,G as getBrowserInfo,X as sanitizeData,D as sanitizeFilename,U as useLogRecorder};