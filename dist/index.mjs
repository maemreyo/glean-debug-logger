import {useRef,useEffect,useState,useCallback,useMemo}from'react';import {css}from'goober';import {jsxs,Fragment,jsx}from'react/jsx-runtime';// @ts-nocheck
var nt=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function ie(t,e={}){let o=e.keys||nt;if(!t||typeof t!="object")return t;let r=Array.isArray(t)?[...t]:{...t},d=i=>{if(!i||typeof i!="object")return i;for(let s in i)if(Object.prototype.hasOwnProperty.call(i,s)){let g=s.toLowerCase();o.some(L=>g.includes(L.toLowerCase()))?i[s]="***REDACTED***":i[s]!==null&&typeof i[s]=="object"&&(i[s]=d(i[s]));}return i};return d(r)}function U(t){return t.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function ve(){if(typeof navigator>"u")return "unknown";let t=navigator.userAgent;return t.includes("Edg")?"edge":t.includes("Chrome")?"chrome":t.includes("Firefox")?"firefox":t.includes("Safari")?"safari":"unknown"}function Xe(t,e,o,r){if(typeof window>"u")return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:r,errorCount:0,networkErrorCount:0};let d=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",i=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:ve(),platform:navigator.platform,language:navigator.language,screenResolution:d,viewport:i,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:r,errorCount:0,networkErrorCount:0}}function Ae(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function z(t="json",e={},o={}){let{fileNameTemplate:r="{env}_{userId}_{sessionId}_{timestamp}",environment:d="development",userId:i="anonymous",sessionId:s="unknown"}=o,g=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],S=new Date().toISOString().split("T")[0],L=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),k=o.browser||ve(),O=o.platform||(typeof navigator<"u"?navigator.platform:"unknown"),N=(o.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",E=String(o.errorCount??e.errorCount??0),R=String(o.logCount??e.logCount??0),H=r.replace("{env}",U(d)).replace("{userId}",U(i??"anonymous")).replace("{sessionId}",U(s??"unknown")).replace("{timestamp}",g).replace("{date}",S).replace("{time}",L).replace(/\{errorCount\}/g,E).replace(/\{logCount\}/g,R).replace("{browser}",U(k)).replace("{platform}",U(O)).replace("{url}",U(N));for(let[q,D]of Object.entries(e))H=H.replace(`{${q}}`,String(D));return `${H}.${t}`}function Lt(t,e="json"){let o=t.url.split("?")[0]||"unknown";return z(e,{},{environment:t.environment,userId:t.userId,sessionId:t.sessionId,browser:t.browser,platform:t.platform,url:o,errorCount:t.errorCount,logCount:t.logCount})}var st={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function Ue(t){let e=parseFloat(t);return isNaN(e)?0:Math.round(e*1e6)}function at(t){return st[t.toLowerCase()]||"info"}function Se(t){return t.filter(e=>!e.ignored).slice(0,20)}function B(t){return {service:{environment:t.environment},user:t.userId?{id:t.userId}:void 0,host:{name:t.browser,type:t.platform}}}function M(t,e){let o={"@timestamp":t.time,event:{original:t,category:[]}},r=B(e);switch(Object.assign(o,r),t.type){case "CONSOLE":{o.log={level:at(t.level)},o.message=t.data,o.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{o.http={request:{method:t.method}},o.url={full:t.url},o.event.category=["network","web"],o.event.action="request",o.event.id=t.id;break}case "FETCH_RES":case "XHR_RES":{o.http={response:{status_code:t.status}},o.url={full:t.url},o.event.duration=Ue(t.duration),o.event.category=["network","web"],o.event.action="response",o.event.id=t.id;break}case "FETCH_ERR":case "XHR_ERR":{o.error={message:t.error},o.url={full:t.url},o.event.duration=Ue(t.duration),o.event.category=["network","web"],o.event.action="error",o.event.id=t.id;let d=t;if(typeof d.body=="object"&&d.body!==null){let i=d.body;if(Array.isArray(i.frames)){let s=Se(i.frames);o.error.stack_trace=s.map(g=>`  at ${g.functionName||"?"} (${g.filename||"?"}:${g.lineNumber||0}:${g.columnNumber||0})`).join(`
`);}}break}default:{o.message=JSON.stringify(t);break}}return o}function le(t){return !t||t.length===0?"":t.map(e=>it(e)).join("")}function it(t){return JSON.stringify(t)+`
`}var ce=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let o=this.originalConsole[e];console[e]=(...r)=>{this.callbacks.forEach(d=>{d(e,r);}),o(...r);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var de=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o));}attach(){window.fetch=async(...e)=>{let[o,r]=e,d=o.toString();if(this.excludeUrls.some(s=>s.test(d)))return this.originalFetch(...e);let i=Date.now();this.onRequest.forEach(s=>s(d,r||{}));try{let s=await this.originalFetch(...e),g=Date.now()-i;return this.onResponse.forEach(S=>S(d,s.status,g)),s}catch(s){throw this.onError.forEach(g=>g(d,s)),s}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var ue=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(o,r,d,i,s){let g=typeof r=="string"?r:r.href;if(e.requestTracker.set(this,{method:o,url:g,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(L=>L.test(g)))return e.originalOpen.call(this,o,r,d??true,i,s);let S=e.requestTracker.get(this);for(let L of e.onRequest)L(S);return e.originalOpen.call(this,o,r,d??true,i,s)},this.originalXHR.prototype.send=function(o){let r=e.requestTracker.get(this);if(r){r.body=o;let d=this.onload,i=this.onerror;this.onload=function(s){let g=Date.now()-r.startTime;for(let S of e.onResponse)S(r,this.status,g);d&&d.call(this,s);},this.onerror=function(s){for(let g of e.onError)g(r,new Error("XHR Error"));i&&i.call(this,s);};}return e.originalSend.call(this,o)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var ee=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,o,r="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let s=await(await(await window.showDirectoryPicker()).getFileHandle(o,{create:!0})).createWritable();await s.write(e),await s.close();}catch(d){if(d.name==="AbortError")return;throw d}}static download(e,o,r="application/json"){let d=new Blob([e],{type:r}),i=URL.createObjectURL(d),s=document.createElement("a");s.href=i,s.download=o,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(i);}static async downloadWithFallback(e,o,r="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,o,r);return}catch(d){if(d.name==="AbortError")return}this.download(e,o,r);}};ee.supported=null;var ct={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function te(t={}){let e={...ct,...t},o=useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});useEffect(()=>{o.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let r=useRef([]),d=useRef(e.sessionId||Ae()),i=useRef(Xe(d.current,e.environment,e.userId,0)),[s,g]=useState(0),S=useRef(0),L=useRef(false),k=useCallback(b=>{let a=new Set;return JSON.stringify(b,(p,l)=>{if(typeof l=="object"&&l!==null){if(a.has(l))return "[Circular]";a.add(l);}return l})},[]),O=useMemo(()=>new ce,[]),T=useMemo(()=>new de({excludeUrls:e.excludeUrls}),[e.excludeUrls]),N=useMemo(()=>new ue({excludeUrls:e.excludeUrls}),[e.excludeUrls]),E=useCallback(b=>{let a=o.current;r.current.push(b),r.current.length>a.maxLogs&&r.current.shift(),g(r.current.length),b.type==="CONSOLE"?b.level==="ERROR"?S.current++:S.current=0:b.type==="FETCH_ERR"||b.type==="XHR_ERR"?S.current++:S.current=0;let p=a.uploadOnErrorCount??5;if(S.current>=p&&a.uploadEndpoint){let l={metadata:{...i.current,logCount:r.current.length},logs:r.current,fileName:z("json",{},e)};fetch(a.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:k(l)}).catch(()=>{}),S.current=0;}if(a.enablePersistence&&typeof window<"u")try{localStorage.setItem(a.persistenceKey,k(r.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},[k]),R=useCallback(()=>{let b=r.current.filter(p=>p.type==="CONSOLE").reduce((p,l)=>l.level==="ERROR"?p+1:p,0),a=r.current.filter(p=>p.type==="FETCH_ERR"||p.type==="XHR_ERR").length;i.current={...i.current,logCount:r.current.length,errorCount:b,networkErrorCount:a};},[]);useEffect(()=>{if(typeof window>"u"||L.current)return;if(L.current=true,e.enablePersistence)try{let a=localStorage.getItem(e.persistenceKey);a&&(r.current=JSON.parse(a),g(r.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let b=[];if(e.captureConsole&&(O.attach(),O.onLog((a,p)=>{let l=p.map(m=>{if(typeof m=="object")try{return k(m)}catch{return String(m)}return String(m)}).join(" ");E({type:"CONSOLE",level:a.toUpperCase(),time:new Date().toISOString(),data:l.substring(0,5e3)});}),b.push(()=>O.detach())),e.captureFetch){let a=new Map;T.onFetchRequest((p,l)=>{let m=Math.random().toString(36).substring(7),w=null;if(l?.body)try{w=typeof l.body=="string"?JSON.parse(l.body):l.body,w=ie(w,{keys:e.sanitizeKeys});}catch{w=String(l.body).substring(0,1e3);}a.set(m,{url:p,method:l?.method||"GET",headers:ie(l?.headers,{keys:e.sanitizeKeys}),body:w}),E({type:"FETCH_REQ",id:m,url:p,method:l?.method||"GET",headers:ie(l?.headers,{keys:e.sanitizeKeys}),body:w,time:new Date().toISOString()});}),T.onFetchResponse((p,l,m)=>{for(let[w,v]of a.entries())if(v.url===p){a.delete(w),E({type:"FETCH_RES",id:w,url:p,status:l,statusText:"",duration:`${m}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),T.onFetchError((p,l)=>{for(let[m,w]of a.entries())if(w.url===p){a.delete(m),E({type:"FETCH_ERR",id:m,url:p,error:l.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),T.attach(),b.push(()=>T.detach());}return e.captureXHR&&(N.onXHRRequest(a=>{E({type:"XHR_REQ",id:Math.random().toString(36).substring(7),url:a.url,method:a.method,headers:a.headers,body:a.body,time:new Date().toISOString()});}),N.onXHRResponse((a,p,l)=>{E({type:"XHR_RES",id:Math.random().toString(36).substring(7),url:a.url,status:p,statusText:"",duration:`${l}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),N.onXHRError((a,p)=>{E({type:"XHR_ERR",id:Math.random().toString(36).substring(7),url:a.url,error:p.message,duration:"[unknown]ms",time:new Date().toISOString()});}),N.attach(),b.push(()=>N.detach())),()=>{b.forEach(a=>a()),L.current=false;}},[e,E,k,O,T,N]);let H=useCallback((b,a,p)=>{if(typeof window>"u")return null;R();let l=a||z(b,{},e),m,w;if(b==="json"){let v=e.includeMetadata?{metadata:i.current,logs:r.current}:r.current;m=k(v),w="application/json";}else if(b==="jsonl"){let v=r.current.map(F=>M(F,i.current));m=le(v),w="application/x-ndjson",l=a||z("jsonl",{},e);}else if(b==="ecs.json"){let v={metadata:B(i.current),logs:r.current.map(F=>M(F,i.current))};m=JSON.stringify(v,null,2),w="application/json",l=a||z("ecs-json",{},e);}else if(b==="ai.txt"){let v=i.current,F=`# METADATA
service.name=${v.environment||"unknown"}
user.id=${v.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,X=r.current.map(xe=>{let x=M(xe,v),I=x["@timestamp"],he=x.log?.level||"info",A=x.event?.category?.[0]||"unknown",j=`[${I}] ${he} ${A}`;return x.message&&(j+=` | message="${x.message}"`),x.http?.request?.method&&(j+=` | req.method=${x.http.request.method}`),x.url?.full&&(j+=` | url=${x.url.full}`),x.http?.response?.status_code&&(j+=` | res.status=${x.http.response.status_code}`),x.error?.message&&(j+=` | error="${x.error.message}"`),j});m=F+X.join(`
`),w="text/plain",l=a||z("ai-txt",{},e);}else m=(e.includeMetadata?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${k(i.current)}
${"=".repeat(80)}

`:"")+r.current.map(F=>`[${F.time}] ${F.type}
${k(F)}
${"=".repeat(80)}`).join(`
`),w="text/plain";return ee.downloadWithFallback(m,l,w),l},[e,k,R]),q=useCallback(async b=>{let a=b||e.uploadEndpoint;if(!a)return {success:false,error:"No endpoint configured"};try{R();let p={metadata:i.current,logs:r.current,fileName:z("json",{},e)},l=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:k(p)});if(!l.ok)throw new Error(`Upload failed: ${l.status}`);return {success:!0,data:await l.json()}}catch(p){let l=p instanceof Error?p.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",p),{success:false,error:l}}},[e.uploadEndpoint,k,R]),D=useCallback(()=>{if(r.current=[],g(0),S.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),ye=useCallback(()=>[...r.current],[]),Q=useCallback(()=>s,[s]),Z=useCallback(()=>(R(),{...i.current}),[R]);return {downloadLogs:H,uploadLogs:q,clearLogs:D,getLogs:ye,getLogCount:Q,getMetadata:Z,sessionId:d.current}}var Re=css`
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
`,pe=css`
  background: #e5e7eb;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,Ee=css`
  background: #fee2e2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,Ce=css`
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
`,Le=css`
  background: #fafafa;
  color: #374151;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`,Ke=css`
  display: flex;
  gap: 8px;
`,Ne=css`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`,Ie=css`
  margin: 2px 0 0;
  font-size: 11px;
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
`,ge=css`
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
`,Te=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 0;
  background: #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`,fe=css`
  text-align: center;
  background: #fff;
  padding: 10px 8px;
`,oe=css`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
`,be=css`
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`,Ge=css`
  color: #dc2626;
`,Je=css`
  color: #ea580c;
`,De=css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`,Oe=css`
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
`,$e=css`
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
`;css`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;var dt=css`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`;css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`;var ut=css`
  padding: 6px 8px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
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
`,pt=css`
  width: 100%;
  padding: 6px 8px;
  background: #f0f4ff;
  color: #4f46e5;
  border: 1px solid #e0e7ff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
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
`,gt=css`
  width: 100%;
  padding: 6px 8px;
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #dcfce7;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
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
`,ft=css`
  width: 100%;
  padding: 6px 8px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
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
`,re=css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
`,ne=css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
`,Fe=css`
  padding: 12px 16px;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #9ca3af;
`,Me=css`
  kbd {
    display: inline-block;
    padding: 2px 6px;
    background: #e5e7eb;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 11px;
    color: #6b7280;
  }
`,He=css`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  min-width: 180px;
  padding: 8px 0;
`,_e=css`
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f3f4f6;
`,me=css`
  display: block;
  width: 100%;
  padding: 6px 8px;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 11px;
  color: #374151;
  transition: background 0.15s ease;

  &:hover {
    background: #f3f4f6;
  }
`,Ve=css`
  background: #f3f4f6;
`,$=css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f8f9fa;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  &:active:not(:disabled) {
    background: #e5e7eb;
    transform: translateY(0);
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #f3f4f6;
  }
`,We=css`
  ${$}
  color: #dc2626;
  border-color: #fee2e2;
  background: #fef2f2;

  &:hover:not(:disabled) {
    background: #fee2e2;
    border-color: #fecaca;
  }

  &:active:not(:disabled) {
    background: #fecaca;
  }
`;css`
  @media (prefers-color-scheme: dark) {
    ${Ce} {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    ${Le} {
      background: #0f172a;
      border-color: #1e293b;
    }

    ${Ne} {
      color: #f1f5f9;
    }

    ${Ie} {
      color: #64748b;
    }

    ${ge} {
      color: #64748b;

      &:hover {
        background: #1e293b;
        color: #94a3b8;
      }
    }

    ${Te} {
      background: #0f172a;
      border-color: #334155;
    }

    ${oe} {
      color: #f1f5f9;
    }

    ${De} {
      background: #0f172a;
      border-color: #334155;
    }

    ${Oe} {
      color: #e2e8f0;
    }

    ${$e} {
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

    ${dt} {
      color: #94a3b8;
    }

    ${ut} {
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

    ${pt} {
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

    ${gt} {
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

    ${ft} {
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

    ${re} {
      background: #064e3b;
      color: #6ee7b7;
      border-color: #065f46;
    }

    ${ne} {
      background: #7f1d1d;
      color: #fca5a5;
      border-color: #991b1b;
    }

    ${Fe} {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

    ${Me} kbd {
      background: #334155;
      color: #e2e8f0;
    }

    ${Re} {
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &:hover {
        background: #334155;
        border-color: #475569;
      }
    }

    ${pe} {
      background: #334155;
      color: #94a3b8;
    }

    ${He} {
      background: #1e293b;
      border-color: #334155;
    }

    ${_e} {
      color: #64748b;
      border-color: #334155;
    }

    ${me} {
      color: #e2e8f0;

      &:hover {
        background: #334155;
      }
    }
  }
`;function Pe({user:t,environment:e="production",uploadEndpoint:o,fileNameTemplate:r="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:d=2e3,showInProduction:i=false}){let[s,g]=useState(false),[S,L]=useState(false),[k,O]=useState(null),[T,N]=useState(null),[E,R]=useState(null),[H,q]=useState(false),[D,ye]=useState(()=>{if(typeof window<"u"){let n=localStorage.getItem("debug-panel-copy-format");if(n&&["json","ecs.json","ai.txt"].includes(n))return n}return "ecs.json"});useEffect(()=>{localStorage.setItem("debug-panel-copy-format",D);},[D]);function Q(n,f){switch(f){case "logs":return n.filter(h=>h.type==="CONSOLE");case "errors":return n.filter(h=>h.type==="CONSOLE"&&h.level==="error");case "network":return n.filter(h=>h.type==="FETCH_REQ"||h.type==="FETCH_RES"||h.type==="XHR_REQ"||h.type==="XHR_RES");case "networkErrors":return n.filter(h=>h.type==="FETCH_ERR"||h.type==="XHR_ERR");default:return n}}function Z(n,f){return Q(n,f).length}let b=useRef(null),a=useRef(null),p=useRef(null),{downloadLogs:l,uploadLogs:m,clearLogs:w,getLogs:v,getLogCount:F,getMetadata:X,sessionId:xe}=te({fileNameTemplate:r,environment:e,userId:t?.id||t?.email||"guest",includeMetadata:true,uploadEndpoint:o,maxLogs:d,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),x=F(),I=X();useEffect(()=>{let n=f=>{f.ctrlKey&&f.shiftKey&&f.key==="D"&&(f.preventDefault(),g(h=>!h)),f.key==="Escape"&&s&&(f.preventDefault(),g(false),a.current?.focus());};return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)},[s]),useEffect(()=>{if(I.errorCount>=5&&o){let n=async()=>{try{await m();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",n),()=>window.removeEventListener("error",n)}},[I.errorCount,o,m]);let he=useCallback(async()=>{L(true),O(null);try{let n=await m();n.success?(O({type:"success",message:`Uploaded successfully! ${n.data?JSON.stringify(n.data):""}`}),n.data&&typeof n.data=="object"&&"url"in n.data&&await navigator.clipboard.writeText(String(n.data.url))):O({type:"error",message:`Upload failed: ${n.error}`});}catch(n){O({type:"error",message:`Error: ${n instanceof Error?n.message:"Unknown error"}`});}finally{L(false);}},[m]),A=useCallback(n=>{let f=l(n);f&&O({type:"success",message:`Downloaded: ${f}`});},[l]),j=useCallback(async()=>{N(null);try{if(!("showDirectoryPicker"in window)){N({type:"error",message:"Feature only supported in Chrome/Edge"});return}await l("json",void 0,{showPicker:!0})&&N({type:"success",message:"Saved to directory"});}catch{N({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[l]),ae=useCallback((n,f)=>{if(D==="json")return JSON.stringify({metadata:f,logs:n},null,2);if(D==="ecs.json"){let h=n.map(G=>M(G,f)),P={metadata:B(f),logs:h};return JSON.stringify(P,null,2)}else if(D==="ai.txt"){let h=`# METADATA
service.name=${f.environment||"unknown"}
user.id=${f.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,P=n.map(G=>{let C=M(G,f),ze=C["@timestamp"],qe=C["log.level"],rt=C["event.category"]?.[0]||"unknown",J=`[${ze}] ${qe} ${rt}`;return C.message&&(J+=` | message="${C.message}"`),C.http?.request?.method&&(J+=` | req.method=${C.http.request.method}`),C.url?.full&&(J+=` | url=${C.url.full}`),C.http?.response?.status_code&&(J+=` | res.status=${C.http.response.status_code}`),C.error?.message&&(J+=` | error="${C.error.message}"`),J});return h+P.join(`
`)}else if(D==="jsonl"){let h=n.map(P=>M(P,f));return le(h)}else return JSON.stringify({metadata:f,logs:n},null,2)},[D]),et=useCallback(async()=>{R(null);try{let n=v(),f=X(),h=ae(n,f);await navigator.clipboard.writeText(h),R({type:"success",message:"Copied to clipboard!"});}catch{R({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[v,X,ae]),we=useCallback(async n=>{R(null);try{let f=v(),h=X(),P=Q(f,n),G=P.length;if(G===0){R({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[n]});return}let C=ae(P,h);await navigator.clipboard.writeText(C),R({type:"success",message:`Copied ${G} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[n]} to clipboard`});}catch{R({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[v,X,ae,Q]);if(useEffect(()=>{if(T){let n=setTimeout(()=>{N(null);},3e3);return ()=>clearTimeout(n)}},[T]),useEffect(()=>{if(E){let n=setTimeout(()=>{R(null);},3e3);return ()=>clearTimeout(n)}},[E]),useEffect(()=>{let n=f=>{if(s&&b.current&&!b.current.contains(f.target)){if(a.current?.contains(f.target))return;g(false),a.current?.focus();}};return document.addEventListener("mousedown",n),()=>document.removeEventListener("mousedown",n)},[s]),!(i||e==="development"||t?.role==="admin"))return null;let tt=()=>{g(true);},ot=()=>{g(false),a.current?.focus();};return jsxs(Fragment,{children:[jsxs("button",{ref:a,type:"button",onClick:tt,className:Re,"aria-label":s?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":s,"aria-controls":"debug-panel",children:[jsx("span",{children:"Debug"}),jsx("span",{className:x>0?I.errorCount>0?Ee:pe:pe,children:x}),I.errorCount>0&&jsxs("span",{className:Ee,children:[I.errorCount," err"]})]}),s&&jsxs("div",{ref:b,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:Ce,children:[jsxs("div",{className:Le,children:[jsxs("div",{className:Ke,children:[jsx("h3",{className:Ne,children:"Debug"}),jsxs("p",{className:Ie,children:[xe.substring(0,36),"..."]})]}),jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsxs("div",{style:{position:"relative"},children:[jsx("button",{type:"button",onClick:()=>q(!H),className:ge,"aria-label":"Actions and settings","aria-expanded":H,title:"Actions and settings",children:"\u2699\uFE0F"}),H&&jsxs("div",{className:He,style:{width:"220px"},children:[jsx("div",{className:_e,children:"Copy Format"}),["json","ecs.json","ai.txt"].map(n=>jsxs("button",{type:"button",onClick:()=>{ye(n),q(false);},className:`${me} ${D===n?Ve:""}`,children:[D===n&&"\u2713 ",n==="json"&&"\u{1F4C4} JSON",n==="ecs.json"&&"\u{1F4CB} ECS (AI)",n==="ai.txt"&&"\u{1F916} AI-TXT"]},n)),jsx("div",{style:{borderTop:"1px solid #f3f4f6",margin:"8px 0"}}),jsx("button",{type:"button",onClick:()=>{j(),q(false);},className:me,disabled:!("showDirectoryPicker"in window),children:"\u{1F4C1} Save to Folder"})]})]}),jsx("button",{ref:p,type:"button",onClick:ot,className:ge,"aria-label":"Close debug panel",children:"\u2715"})]})]}),jsxs("div",{className:Te,children:[jsxs("div",{className:fe,children:[jsx("div",{className:oe,children:x}),jsx("div",{className:be,children:"Logs"})]}),jsxs("div",{className:fe,children:[jsx("div",{className:`${oe} ${Ge}`,children:I.errorCount}),jsx("div",{className:be,children:"Errors"})]}),jsxs("div",{className:fe,children:[jsx("div",{className:`${oe} ${Je}`,children:I.networkErrorCount}),jsx("div",{className:be,children:"Network"})]})]}),jsx("div",{style:{padding:"12px 16px"},children:jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"6px",marginBottom:"8px"},children:[jsx("button",{type:"button",onClick:()=>A("json"),className:$,children:"\u{1F4C4} JSON"}),jsx("button",{type:"button",onClick:()=>A("txt"),className:$,children:"\u{1F4DD} TXT"}),jsx("button",{type:"button",onClick:()=>A("jsonl"),className:$,disabled:x===0,children:"\u{1F4E6} JSONL"}),jsx("button",{type:"button",onClick:()=>A("ecs.json"),className:$,disabled:x===0,children:"\u{1F4CB} ECS"}),jsx("button",{type:"button",onClick:et,className:$,disabled:x===0,children:"\u{1F4CB} Copy"}),jsx("button",{type:"button",onClick:()=>A("ai.txt"),className:$,disabled:x===0,children:"\u{1F916} AI"}),jsx("button",{type:"button",onClick:()=>we("logs"),className:$,disabled:x===0||Z(v(),"logs")===0,"aria-label":"Copy only console logs",children:"\u{1F4CB} Logs"}),jsx("button",{type:"button",onClick:()=>we("errors"),className:$,disabled:x===0||Z(v(),"errors")===0,"aria-label":"Copy only errors",children:"\u26A0\uFE0F Errors"}),jsx("button",{type:"button",onClick:()=>we("network"),className:$,disabled:x===0||Z(v(),"network")===0,"aria-label":"Copy only network requests",children:"\u{1F310} Network"}),o?jsx("button",{type:"button",onClick:he,className:$,disabled:S,children:"\u2601\uFE0F Upload"}):jsx("div",{})]})}),jsxs("div",{style:{padding:"0 16px 12px"},children:[k&&jsx("div",{role:"status","aria-live":"polite",className:k.type==="success"?re:ne,children:k.message}),T&&jsx("div",{role:"status","aria-live":"polite",className:T.type==="success"?re:ne,children:T.message}),E&&jsx("div",{role:"status","aria-live":"polite",className:E.type==="success"?re:ne,children:E.message})]}),jsxs("details",{className:De,style:{borderTop:"1px solid #f3f4f6",borderRadius:0},children:[jsx("summary",{className:Oe,children:jsx("span",{children:"\u25B8 Session Details"})}),jsxs("div",{className:$e,children:[jsxs("div",{children:[jsx("strong",{children:"User"}),jsx("span",{children:I.userId||"Anonymous"})]}),jsxs("div",{children:[jsx("strong",{children:"Browser"}),jsxs("span",{children:[I.browser," (",I.platform,")"]})]}),jsxs("div",{children:[jsx("strong",{children:"Screen"}),jsx("span",{children:I.screenResolution})]}),jsxs("div",{children:[jsx("strong",{children:"Timezone"}),jsx("span",{children:I.timezone})]})]})]}),jsx("div",{style:{padding:"8px 16px",display:"flex",justifyContent:"flex-end"},children:!o&&jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs?")&&w();},className:We,children:"\u{1F5D1}\uFE0F Clear"})}),jsx("div",{className:Fe,children:jsxs("div",{className:Me,children:["Press ",jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})]})]})}function yt({fileNameTemplate:t="debug_{timestamp}"}){let[e,o]=useState(false),{downloadLogs:r,clearLogs:d,getLogCount:i}=te({fileNameTemplate:t}),s=i();return jsxs(Fragment,{children:[jsx("button",{onClick:()=>o(g=>!g),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsx("span",{children:s})}),e&&jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsx("button",{onClick:()=>r("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsx("button",{onClick:()=>{confirm("Clear all logs?")&&d();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsx("button",{onClick:()=>o(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function vt(t){return useMemo(()=>t.showInProduction||t.environment==="development"||t.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[t.showInProduction,t.environment,t.user])}function St(){let t=useCallback(o=>{try{typeof window<"u"&&(o?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:o}})));}catch{}},[]),e=useMemo(()=>typeof process<"u"&&true,[]);useEffect(()=>{if(typeof window>"u")return;let o=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>t(true),hide:()=>t(false),toggle:()=>{try{let r=localStorage.getItem("glean-debug-enabled")==="true";t(!r);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=o,()=>{typeof window<"u"&&window.glean===o&&delete window.glean;}},[t,e]);}function Ze(t){let e=vt(t);return St(),e?jsx(Pe,{...t}):null}export{Pe as DebugPanel,yt as DebugPanelMinimal,Ze as GleanDebugger,Xe as collectMetadata,Se as filterStackTrace,Lt as generateExportFilename,z as generateFilename,Ae as generateSessionId,ve as getBrowserInfo,ie as sanitizeData,U as sanitizeFilename,B as transformMetadataToECS,M as transformToECS,te as useLogRecorder};