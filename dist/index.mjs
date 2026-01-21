import {useRef,useEffect,useState,useCallback,useMemo}from'react';import {css}from'goober';import {jsxs,Fragment,jsx}from'react/jsx-runtime';// @ts-nocheck
var Fe=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function B(a,e={}){let t=e.keys||Fe;if(!a||typeof a!="object")return a;let r=Array.isArray(a)?[...a]:{...a},d=l=>{if(!l||typeof l!="object")return l;for(let o in l)if(Object.prototype.hasOwnProperty.call(l,o)){let p=o.toLowerCase();t.some(h=>p.includes(h.toLowerCase()))?l[o]="***REDACTED***":l[o]!==null&&typeof l[o]=="object"&&(l[o]=d(l[o]));}return l};return d(r)}function D(a){return a.replace(/[^a-z0-9_\-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function re(){if(typeof navigator>"u")return "unknown";let a=navigator.userAgent;return a.includes("Edg")?"edge":a.includes("Chrome")?"chrome":a.includes("Firefox")?"firefox":a.includes("Safari")?"safari":"unknown"}function Re(a,e,t,r){if(typeof window>"u")return {sessionId:a,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:r,errorCount:0,networkErrorCount:0};let d=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",l=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:a,environment:e,userId:t,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:re(),platform:navigator.platform,language:navigator.language,screenResolution:d,viewport:l,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:r,errorCount:0,networkErrorCount:0}}function Se(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function $(a="json",e={},t={}){let{fileNameTemplate:r="{env}_{userId}_{sessionId}_{timestamp}",environment:d="development",userId:l="anonymous",sessionId:o="unknown"}=t,p=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],b=new Date().toISOString().split("T")[0],h=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),w=t.browser||re(),R=t.platform||(typeof navigator<"u"?navigator.platform:"unknown"),k=(t.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",v=String(t.errorCount??e.errorCount??0),C=String(t.logCount??e.logCount??0),I=r.replace("{env}",D(d)).replace("{userId}",D(l??"anonymous")).replace("{sessionId}",D(o??"unknown")).replace("{timestamp}",p).replace("{date}",b).replace("{time}",h).replace(/\{errorCount\}/g,v).replace(/\{logCount\}/g,C).replace("{browser}",D(w)).replace("{platform}",D(R)).replace("{url}",D(k));for(let[N,F]of Object.entries(e))I=I.replace(`{${N}}`,String(F));return `${I}.${a}`}function We(a,e="json"){let t=a.url.split("?")[0]||"unknown";return $(e,{},{environment:a.environment,userId:a.userId,sessionId:a.sessionId,browser:a.browser,platform:a.platform,url:t,errorCount:a.errorCount,logCount:a.logCount})}var A=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let t=this.originalConsole[e];console[e]=(...r)=>{this.callbacks.forEach(d=>{d(e,r);}),t(...r);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var Y=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t));}attach(){window.fetch=async(...e)=>{let[t,r]=e,d=t.toString();if(this.excludeUrls.some(o=>o.test(d)))return this.originalFetch(...e);let l=Date.now();this.onRequest.forEach(o=>o(d,r||{}));try{let o=await this.originalFetch(...e),p=o.clone(),b=Date.now()-l,h;try{h=await p.text();}catch{h="[Unable to read response body]";}return this.onResponse.forEach(w=>w(d,o.status,b)),o}catch(o){throw this.onError.forEach(p=>p(d,o)),o}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var W=class{constructor(e={}){this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(t=>new RegExp(t));}attach(){let e=this.originalXHR,t=this,r=function(){let o=new e;return t.requestTracker.set(o,{method:"",url:"",headers:{},body:null,startTime:Date.now()}),o};r.prototype=Object.create(e.prototype),r.prototype.constructor=r;let d=e.prototype.open;r.prototype.open=function(o,p){let b=t.requestTracker.get(this);if(b){if(b.method=o,b.url=p,t.excludeUrls.some(h=>h.test(p)))return d.apply(this,[o,p]);for(let h of t.onRequest)h(b);}return d.apply(this,[o,p])};let l=e.prototype.send;r.prototype.send=function(o){let p=t.requestTracker.get(this);return p&&(p.body=o,this.onload=()=>{let b=Date.now()-p.startTime;for(let h of t.onResponse)h(p,this.status,b);},this.onerror=()=>{for(let b of t.onError)b(p,new Error("XHR Error"));}),l.apply(this,[o])},window.XMLHttpRequest=r;}detach(){window.XMLHttpRequest=this.originalXHR;}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var U=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,t,r="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let o=await(await(await window.showDirectoryPicker()).getFileHandle(t,{create:!0})).createWritable();await o.write(e),await o.close();}catch(d){if(d.name==="AbortError")return;throw d}}static download(e,t,r="application/json"){let d=new Blob([e],{type:r}),l=URL.createObjectURL(d),o=document.createElement("a");o.href=l,o.download=t,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(l);}static async downloadWithFallback(e,t,r="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,t,r);return}catch(d){if(d.name==="AbortError")return}this.download(e,t,r);}};U.supported=null;var Ue={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function q(a={}){let e={...Ue,...a},t=useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});useEffect(()=>{t.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let r=useRef([]),d=useRef(e.sessionId||Se()),l=useRef(Re(d.current,e.environment,e.userId,0)),[o,p]=useState(0),b=useRef(0),h=useRef(false),w=useCallback(y=>{let n=new Set;return JSON.stringify(y,(i,s)=>{if(typeof s=="object"&&s!==null){if(n.has(s))return "[Circular]";n.add(s);}return s})},[]),R=useMemo(()=>new A,[]),S=useMemo(()=>new Y({excludeUrls:e.excludeUrls}),[e.excludeUrls]),k=useMemo(()=>new W({excludeUrls:e.excludeUrls}),[e.excludeUrls]),v=useCallback(y=>{let n=t.current;r.current.push(y),r.current.length>n.maxLogs&&r.current.shift(),p(r.current.length),y.type==="CONSOLE"?y.level==="ERROR"?b.current++:b.current=0:y.type==="FETCH_ERR"||y.type==="XHR_ERR"?b.current++:b.current=0;let i=n.uploadOnErrorCount??5;if(b.current>=i&&n.uploadEndpoint){let s={metadata:{...l.current,logCount:r.current.length},logs:r.current,fileName:$("json",{},e)};fetch(n.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:w(s)}).catch(()=>{}),b.current=0;}if(n.enablePersistence&&typeof window<"u")try{localStorage.setItem(n.persistenceKey,w(r.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},[w]),C=useCallback(()=>{let y=r.current.filter(i=>i.type==="CONSOLE").reduce((i,s)=>s.level==="ERROR"?i+1:i,0),n=r.current.filter(i=>i.type==="FETCH_ERR"||i.type==="XHR_ERR").length;l.current={...l.current,logCount:r.current.length,errorCount:y,networkErrorCount:n};},[]);useEffect(()=>{if(typeof window>"u"||h.current)return;if(h.current=true,e.enablePersistence)try{let n=localStorage.getItem(e.persistenceKey);n&&(r.current=JSON.parse(n),p(r.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let y=[];if(e.captureConsole&&(R.attach(),R.onLog((n,i)=>{let s=i.map(m=>{if(typeof m=="object")try{return w(m)}catch{return String(m)}return String(m)}).join(" ");v({type:"CONSOLE",level:n.toUpperCase(),time:new Date().toISOString(),data:s.substring(0,5e3)});}),y.push(()=>R.detach())),e.captureFetch){let n=new Map;S.onFetchRequest((i,s)=>{let m=Math.random().toString(36).substring(7),g=null;if(s?.body)try{g=typeof s.body=="string"?JSON.parse(s.body):s.body,g=B(g,{keys:e.sanitizeKeys});}catch{g=String(s.body).substring(0,1e3);}n.set(m,{url:i,method:s?.method||"GET",headers:B(s?.headers,{keys:e.sanitizeKeys}),body:g}),v({type:"FETCH_REQ",id:m,url:i,method:s?.method||"GET",headers:B(s?.headers,{keys:e.sanitizeKeys}),body:g,time:new Date().toISOString()});}),S.onFetchResponse((i,s,m)=>{for(let[g,T]of n.entries())if(T.url===i){n.delete(g),v({type:"FETCH_RES",id:g,url:i,status:s,statusText:"",duration:`${m}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),S.onFetchError((i,s)=>{for(let[m,g]of n.entries())if(g.url===i){n.delete(m),v({type:"FETCH_ERR",id:m,url:i,error:s.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),S.attach(),y.push(()=>S.detach());}return e.captureXHR&&(k.onXHRRequest(n=>{v({type:"XHR_REQ",id:Math.random().toString(36).substring(7),url:n.url,method:n.method,headers:n.headers,body:n.body,time:new Date().toISOString()});}),k.onXHRResponse((n,i,s)=>{v({type:"XHR_RES",id:Math.random().toString(36).substring(7),url:n.url,status:i,statusText:"",duration:`${s}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),k.onXHRError((n,i)=>{v({type:"XHR_ERR",id:Math.random().toString(36).substring(7),url:n.url,error:i.message,duration:"[unknown]ms",time:new Date().toISOString()});}),k.attach(),y.push(()=>k.detach())),()=>{y.forEach(n=>n()),h.current=false;}},[e,v,w,R,S,k]);let I=useCallback((y="json",n)=>{if(typeof window>"u")return null;C();let i=n||$(y,{},e),s,m;if(y==="json"){let g=e.includeMetadata?{metadata:l.current,logs:r.current}:r.current;s=w(g),m="application/json";}else s=(e.includeMetadata?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${w(l.current)}
${"=".repeat(80)}

`:"")+r.current.map(T=>`[${T.time}] ${T.type}
${w(T)}
${"=".repeat(80)}`).join(`
`),m="text/plain";return U.downloadWithFallback(s,i,m),i},[e,w,C]),N=useCallback(async y=>{let n=y||e.uploadEndpoint;if(!n)return {success:false,error:"No endpoint configured"};try{C();let i={metadata:l.current,logs:r.current,fileName:$("json",{},e)},s=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:w(i)});if(!s.ok)throw new Error(`Upload failed: ${s.status}`);return {success:!0,data:await s.json()}}catch(i){let s=i instanceof Error?i.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",i),{success:false,error:s}}},[e.uploadEndpoint,w,C]),F=useCallback(()=>{if(r.current=[],p(0),b.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),M=useCallback(()=>[...r.current],[]),H=useCallback(()=>o,[o]),oe=useCallback(()=>(C(),{...l.current}),[C]);return {downloadLogs:I,uploadLogs:N,clearLogs:F,getLogs:M,getLogCount:H,getMetadata:oe,sessionId:d.current}}var se=css`
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
`,J=css`
  background: #e5e7eb;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,ae=css`
  background: #fee2e2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,ie=css`
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
`,le=css`
  background: #fafafa;
  color: #374151;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`,Ee=css`
  display: flex;
  gap: 8px;
`,ce=css`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`,de=css`
  margin: 2px 0 0;
  font-size: 11px;
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
`,ue=css`
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
`,pe=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 0;
  background: #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`,G=css`
  text-align: center;
  background: #fff;
  padding: 10px 8px;
`,P=css`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
`,V=css`
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`,Le=css`
  color: #dc2626;
`,Ie=css`
  color: #ea580c;
`,ge=css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`,fe=css`
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
`,be=css`
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
`,Ne=css`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`,Q=css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,me=css`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,Te=css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`,z=css`
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
`,qe=css`
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
`,ye=css`
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
`,xe=css`
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
`,X=css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
`,_=css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
`,he=css`
  padding: 12px 16px;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #9ca3af;
`,we=css`
  kbd {
    display: inline-block;
    padding: 2px 6px;
    background: #e5e7eb;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 11px;
    color: #6b7280;
  }
`;css`
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

    ${P} {
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

    ${qe} {
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

    ${xe} {
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

    ${he} {
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
`;function Pe({user:a,environment:e="production",uploadEndpoint:t,fileNameTemplate:r="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:d=2e3,showInProduction:l=false}){let[o,p]=useState(false),[b,h]=useState(false),[w,R]=useState(null),[S,k]=useState(null),[v,C]=useState(null),I=useRef(null),N=useRef(null),F=useRef(null),{downloadLogs:M,uploadLogs:H,clearLogs:oe,getLogs:y,getLogCount:n,getMetadata:i,sessionId:s}=q({fileNameTemplate:r,environment:e,userId:a?.id||a?.email||"guest",includeMetadata:true,uploadEndpoint:t,maxLogs:d,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),m=n(),g=i();useEffect(()=>{let f=E=>{E.ctrlKey&&E.shiftKey&&E.key==="D"&&(E.preventDefault(),p(te=>!te)),E.key==="Escape"&&o&&(E.preventDefault(),p(false),N.current?.focus());};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[o]),useEffect(()=>{if(g.errorCount>=5&&t){let f=async()=>{try{await H();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",f),()=>window.removeEventListener("error",f)}},[g.errorCount,t,H]);let T=useCallback(async()=>{h(true),R(null);try{let f=await H();f.success?(R({type:"success",message:`Uploaded successfully! ${f.data?JSON.stringify(f.data):""}`}),f.data&&typeof f.data=="object"&&"url"in f.data&&await navigator.clipboard.writeText(String(f.data.url))):R({type:"error",message:`Upload failed: ${f.error}`});}catch(f){R({type:"error",message:`Error: ${f instanceof Error?f.message:"Unknown error"}`});}finally{h(false);}},[H]),ke=useCallback(f=>{let E=M(f);E&&R({type:"success",message:`Downloaded: ${E}`});},[M]),Me=useCallback(async()=>{k(null);try{if(!("showDirectoryPicker"in window)){k({type:"error",message:"Feature only supported in Chrome/Edge"});return}await M("json",void 0,{showPicker:!0})&&k({type:"success",message:"Saved to directory"});}catch{k({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[M]),He=useCallback(async()=>{C(null);try{let f=y(),E=i(),te=JSON.stringify({metadata:E,logs:f},null,2);await navigator.clipboard.writeText(te),C({type:"success",message:"Copied to clipboard!"});}catch{C({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[y,i]);if(useEffect(()=>{if(S){let f=setTimeout(()=>{k(null);},3e3);return ()=>clearTimeout(f)}},[S]),useEffect(()=>{if(v){let f=setTimeout(()=>{C(null);},3e3);return ()=>clearTimeout(f)}},[v]),!(l||e==="development"||a?.role==="admin"))return null;let Oe=()=>{p(true);},ze=()=>{p(false),N.current?.focus();};return jsxs(Fragment,{children:[jsxs("button",{ref:N,type:"button",onClick:Oe,className:se,"aria-label":o?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":o,"aria-controls":"debug-panel",children:[jsx("span",{children:"Debug"}),jsx("span",{className:m>0?g.errorCount>0?ae:J:J,children:m}),g.errorCount>0&&jsxs("span",{className:ae,children:[g.errorCount," err"]})]}),o&&jsxs("div",{ref:I,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:ie,children:[jsxs("div",{className:le,children:[jsxs("div",{className:Ee,children:[jsx("h3",{className:ce,children:"Debug"}),jsxs("p",{className:de,children:[s.substring(0,36),"..."]})]}),jsx("button",{ref:F,type:"button",onClick:ze,className:ue,"aria-label":"Close debug panel",children:"\u2715"})]}),jsxs("div",{className:pe,children:[jsxs("div",{className:G,children:[jsx("div",{className:P,children:m}),jsx("div",{className:V,children:"Logs"})]}),jsxs("div",{className:G,children:[jsx("div",{className:`${P} ${Le}`,children:g.errorCount}),jsx("div",{className:V,children:"Errors"})]}),jsxs("div",{className:G,children:[jsx("div",{className:`${P} ${Ie}`,children:g.networkErrorCount}),jsx("div",{className:V,children:"Network"})]})]}),jsxs("details",{className:ge,children:[jsx("summary",{className:fe,role:"button","aria-expanded":"false",children:jsx("span",{children:"\u25B8 Session Details"})}),jsxs("div",{className:be,children:[jsxs("div",{children:[jsx("strong",{children:"User"}),jsx("span",{children:g.userId||"Anonymous"})]}),jsxs("div",{children:[jsx("strong",{children:"Browser"}),jsxs("span",{children:[g.browser," (",g.platform,")"]})]}),jsxs("div",{children:[jsx("strong",{children:"Screen"}),jsx("span",{children:g.screenResolution})]}),jsxs("div",{children:[jsx("strong",{children:"Timezone"}),jsx("span",{children:g.timezone})]})]})]}),jsxs("div",{className:Ne,children:[jsx("div",{className:Q,children:jsxs("div",{className:Te,children:[jsx("button",{type:"button",onClick:()=>ke("json"),className:z,"aria-label":"Download logs as JSON",children:"\u{1F4C4} JSON"}),jsx("button",{type:"button",onClick:()=>ke("txt"),className:z,"aria-label":"Download logs as text file",children:"\u{1F4DD} TXT"}),jsx("button",{type:"button",onClick:Me,disabled:!("showDirectoryPicker"in window),className:z,"aria-label":"Save logs to directory",title:"showDirectoryPicker"in window?"Choose directory to save file":"Feature only supported in Chrome/Edge",children:"\u{1F4C1} Folder"}),jsx("button",{type:"button",onClick:He,disabled:m===0,className:z,"aria-label":"Copy logs to clipboard",title:"Copy logs as JSON to clipboard",children:"\u{1F4CB} Copy"})]})}),t&&jsxs("div",{className:Q,children:[jsx("span",{className:me,children:"Upload"}),jsx("button",{type:"button",onClick:T,disabled:b,className:ye,"aria-label":b?"Uploading logs...":"Upload logs to server","aria-busy":b,children:b?"\u23F3 Uploading...":"\u2601\uFE0F Upload to Server"})]}),w&&jsx("div",{role:"status","aria-live":"polite",className:w.type==="success"?X:_,children:w.message}),S&&jsx("div",{role:"status","aria-live":"polite",className:S.type==="success"?X:_,children:S.message}),v&&jsx("div",{role:"status","aria-live":"polite",className:v.type==="success"?X:_,children:v.message}),jsx("div",{className:Q,children:jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs? This cannot be undone.")&&(oe(),R(null));},className:xe,"aria-label":"Clear all logs",children:"\u{1F5D1}\uFE0F Clear All Logs"})})]}),jsx("div",{className:he,children:jsxs("div",{className:we,children:["Press ",jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})]})]})}function je({fileNameTemplate:a="debug_{timestamp}"}){let[e,t]=useState(false),{downloadLogs:r,clearLogs:d,getLogCount:l}=q({fileNameTemplate:a}),o=l();return jsxs(Fragment,{children:[jsx("button",{onClick:()=>t(p=>!p),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsx("span",{children:o})}),e&&jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsx("button",{onClick:()=>r("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsx("button",{onClick:()=>{confirm("Clear all logs?")&&d();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsx("button",{onClick:()=>t(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}export{Pe as DebugPanel,je as DebugPanelMinimal,Re as collectMetadata,We as generateExportFilename,$ as generateFilename,Se as generateSessionId,re as getBrowserInfo,B as sanitizeData,D as sanitizeFilename,q as useLogRecorder};