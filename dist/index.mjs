import {useRef,useEffect,useState,useCallback,useMemo}from'react';import {css}from'goober';import {jsxs,Fragment,jsx}from'react/jsx-runtime';// @ts-nocheck
var Pe=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function Y(t,e={}){let o=e.keys||Pe;if(!t||typeof t!="object")return t;let r=Array.isArray(t)?[...t]:{...t},l=s=>{if(!s||typeof s!="object")return s;for(let n in s)if(Object.prototype.hasOwnProperty.call(s,n)){let g=n.toLowerCase();o.some(k=>g.includes(k.toLowerCase()))?s[n]="***REDACTED***":s[n]!==null&&typeof s[n]=="object"&&(s[n]=l(s[n]));}return s};return l(r)}function H(t){return t.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function ue(){if(typeof navigator>"u")return "unknown";let t=navigator.userAgent;return t.includes("Edg")?"edge":t.includes("Chrome")?"chrome":t.includes("Firefox")?"firefox":t.includes("Safari")?"safari":"unknown"}function Ie(t,e,o,r){if(typeof window>"u")return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:r,errorCount:0,networkErrorCount:0};let l=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",s=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:ue(),platform:navigator.platform,language:navigator.language,screenResolution:l,viewport:s,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:r,errorCount:0,networkErrorCount:0}}function De(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function D(t="json",e={},o={}){let{fileNameTemplate:r="{env}_{userId}_{sessionId}_{timestamp}",environment:l="development",userId:s="anonymous",sessionId:n="unknown"}=o,g=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],h=new Date().toISOString().split("T")[0],k=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),w=o.browser||ue(),L=o.platform||(typeof navigator<"u"?navigator.platform:"unknown"),R=(o.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",v=String(o.errorCount??e.errorCount??0),T=String(o.logCount??e.logCount??0),M=r.replace("{env}",H(l)).replace("{userId}",H(s??"anonymous")).replace("{sessionId}",H(n??"unknown")).replace("{timestamp}",g).replace("{date}",h).replace("{time}",k).replace(/\{errorCount\}/g,v).replace(/\{logCount\}/g,T).replace("{browser}",H(w)).replace("{platform}",H(L)).replace("{url}",H(R));for(let[F,q]of Object.entries(e))M=M.replace(`{${F}}`,String(q));return `${M}.${t}`}function ot(t,e="json"){let o=t.url.split("?")[0]||"unknown";return D(e,{},{environment:t.environment,userId:t.userId,sessionId:t.sessionId,browser:t.browser,platform:t.platform,url:o,errorCount:t.errorCount,logCount:t.logCount})}var je={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function Me(t){let e=parseFloat(t);return isNaN(e)?0:Math.round(e*1e6)}function Ae(t){return je[t.toLowerCase()]||"info"}function pe(t){return t.filter(e=>!e.ignored).slice(0,20)}function U(t){return {service:{environment:t.environment},user:t.userId?{id:t.userId}:void 0,host:{name:t.browser,type:t.platform}}}function z(t,e){let o={"@timestamp":t.time,event:{original:t,category:[]}},r=U(e);switch(Object.assign(o,r),t.type){case "CONSOLE":{o.log={level:Ae(t.level)},o.message=t.data,o.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{o.http={request:{method:t.method}},o.url={full:t.url},o.event.category=["network","web"],o.event.action="request",o.event.id=t.id;break}case "FETCH_RES":case "XHR_RES":{o.http={response:{status_code:t.status}},o.url={full:t.url},o.event.duration=Me(t.duration),o.event.category=["network","web"],o.event.action="response",o.event.id=t.id;break}case "FETCH_ERR":case "XHR_ERR":{o.error={message:t.error},o.url={full:t.url},o.event.duration=Me(t.duration),o.event.category=["network","web"],o.event.action="error",o.event.id=t.id;let l=t;if(typeof l.body=="object"&&l.body!==null){let s=l.body;if(Array.isArray(s.frames)){let n=pe(s.frames);o.error.stack_trace=n.map(g=>`  at ${g.functionName||"?"} (${g.filename||"?"}:${g.lineNumber||0}:${g.columnNumber||0})`).join(`
`);}}break}default:{o.message=JSON.stringify(t);break}}return o}function Fe(t){return !t||t.length===0?"":t.map(e=>Ke(e)).join("")}function Ke(t){return JSON.stringify(t)+`
`}var V=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let o=this.originalConsole[e];console[e]=(...r)=>{this.callbacks.forEach(l=>{l(e,r);}),o(...r);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var G=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o));}attach(){window.fetch=async(...e)=>{let[o,r]=e,l=o.toString();if(this.excludeUrls.some(n=>n.test(l)))return this.originalFetch(...e);let s=Date.now();this.onRequest.forEach(n=>n(l,r||{}));try{let n=await this.originalFetch(...e),g=Date.now()-s;return this.onResponse.forEach(h=>h(l,n.status,g)),n}catch(n){throw this.onError.forEach(g=>g(l,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var Q=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(o,r,l,s,n){let g=typeof r=="string"?r:r.href;if(e.requestTracker.set(this,{method:o,url:g,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(k=>k.test(g)))return e.originalOpen.call(this,o,r,l??true,s,n);let h=e.requestTracker.get(this);for(let k of e.onRequest)k(h);return e.originalOpen.call(this,o,r,l??true,s,n)},this.originalXHR.prototype.send=function(o){let r=e.requestTracker.get(this);if(r){r.body=o;let l=this.onload,s=this.onerror;this.onload=function(n){let g=Date.now()-r.startTime;for(let h of e.onResponse)h(r,this.status,g);l&&l.call(this,n);},this.onerror=function(n){for(let g of e.onError)g(r,new Error("XHR Error"));s&&s.call(this,n);};}return e.originalSend.call(this,o)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var P=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,o,r="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(o,{create:!0})).createWritable();await n.write(e),await n.close();}catch(l){if(l.name==="AbortError")return;throw l}}static download(e,o,r="application/json"){let l=new Blob([e],{type:r}),s=URL.createObjectURL(l),n=document.createElement("a");n.href=s,n.download=o,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(s);}static async downloadWithFallback(e,o,r="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,o,r);return}catch(l){if(l.name==="AbortError")return}this.download(e,o,r);}};P.supported=null;var Je={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function j(t={}){let e={...Je,...t},o=useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});useEffect(()=>{o.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let r=useRef([]),l=useRef(e.sessionId||De()),s=useRef(Ie(l.current,e.environment,e.userId,0)),[n,g]=useState(0),h=useRef(0),k=useRef(false),w=useCallback(m=>{let a=new Set;return JSON.stringify(m,(c,i)=>{if(typeof i=="object"&&i!==null){if(a.has(i))return "[Circular]";a.add(i);}return i})},[]),L=useMemo(()=>new V,[]),N=useMemo(()=>new G({excludeUrls:e.excludeUrls}),[e.excludeUrls]),R=useMemo(()=>new Q({excludeUrls:e.excludeUrls}),[e.excludeUrls]),v=useCallback(m=>{let a=o.current;r.current.push(m),r.current.length>a.maxLogs&&r.current.shift(),g(r.current.length),m.type==="CONSOLE"?m.level==="ERROR"?h.current++:h.current=0:m.type==="FETCH_ERR"||m.type==="XHR_ERR"?h.current++:h.current=0;let c=a.uploadOnErrorCount??5;if(h.current>=c&&a.uploadEndpoint){let i={metadata:{...s.current,logCount:r.current.length},logs:r.current,fileName:D("json",{},e)};fetch(a.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:w(i)}).catch(()=>{}),h.current=0;}if(a.enablePersistence&&typeof window<"u")try{localStorage.setItem(a.persistenceKey,w(r.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},[w]),T=useCallback(()=>{let m=r.current.filter(c=>c.type==="CONSOLE").reduce((c,i)=>i.level==="ERROR"?c+1:c,0),a=r.current.filter(c=>c.type==="FETCH_ERR"||c.type==="XHR_ERR").length;s.current={...s.current,logCount:r.current.length,errorCount:m,networkErrorCount:a};},[]);useEffect(()=>{if(typeof window>"u"||k.current)return;if(k.current=true,e.enablePersistence)try{let a=localStorage.getItem(e.persistenceKey);a&&(r.current=JSON.parse(a),g(r.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let m=[];if(e.captureConsole&&(L.attach(),L.onLog((a,c)=>{let i=c.map(f=>{if(typeof f=="object")try{return w(f)}catch{return String(f)}return String(f)}).join(" ");v({type:"CONSOLE",level:a.toUpperCase(),time:new Date().toISOString(),data:i.substring(0,5e3)});}),m.push(()=>L.detach())),e.captureFetch){let a=new Map;N.onFetchRequest((c,i)=>{let f=Math.random().toString(36).substring(7),u=null;if(i?.body)try{u=typeof i.body=="string"?JSON.parse(i.body):i.body,u=Y(u,{keys:e.sanitizeKeys});}catch{u=String(i.body).substring(0,1e3);}a.set(f,{url:c,method:i?.method||"GET",headers:Y(i?.headers,{keys:e.sanitizeKeys}),body:u}),v({type:"FETCH_REQ",id:f,url:c,method:i?.method||"GET",headers:Y(i?.headers,{keys:e.sanitizeKeys}),body:u,time:new Date().toISOString()});}),N.onFetchResponse((c,i,f)=>{for(let[u,E]of a.entries())if(E.url===c){a.delete(u),v({type:"FETCH_RES",id:u,url:c,status:i,statusText:"",duration:`${f}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),N.onFetchError((c,i)=>{for(let[f,u]of a.entries())if(u.url===c){a.delete(f),v({type:"FETCH_ERR",id:f,url:c,error:i.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),N.attach(),m.push(()=>N.detach());}return e.captureXHR&&(R.onXHRRequest(a=>{v({type:"XHR_REQ",id:Math.random().toString(36).substring(7),url:a.url,method:a.method,headers:a.headers,body:a.body,time:new Date().toISOString()});}),R.onXHRResponse((a,c,i)=>{v({type:"XHR_RES",id:Math.random().toString(36).substring(7),url:a.url,status:c,statusText:"",duration:`${i}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),R.onXHRError((a,c)=>{v({type:"XHR_ERR",id:Math.random().toString(36).substring(7),url:a.url,error:c.message,duration:"[unknown]ms",time:new Date().toISOString()});}),R.attach(),m.push(()=>R.detach())),()=>{m.forEach(a=>a()),k.current=false;}},[e,v,w,L,N,R]);let M=useCallback((m,a,c)=>{if(typeof window>"u")return null;T();let i=a||D(m,{},e),f,u;if(m==="json"){let E=e.includeMetadata?{metadata:s.current,logs:r.current}:r.current;f=w(E),u="application/json";}else if(m==="jsonl"){let E=r.current.map(S=>z(S,s.current));f=Fe(E),u="application/x-ndjson",i=a||D("jsonl",{},e);}else if(m==="ecs.json"){let E={metadata:U(s.current),logs:r.current.map(S=>z(S,s.current))};f=JSON.stringify(E,null,2),u="application/json",i=a||D("ecs-json",{},e);}else if(m==="ai.txt"){let E=s.current,S=`# METADATA
service.name=${E.environment||"unknown"}
user.id=${E.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,ae=r.current.map(ie=>{let C=z(ie,E),le=C["@timestamp"],ce=C.log?.level||"info",b=C.event?.category?.[0]||"unknown",x=`[${le}] ${ce} ${b}`;return C.message&&(x+=` | message="${C.message}"`),C.http?.request?.method&&(x+=` | req.method=${C.http.request.method}`),C.url?.full&&(x+=` | url=${C.url.full}`),C.http?.response?.status_code&&(x+=` | res.status=${C.http.response.status_code}`),C.error?.message&&(x+=` | error="${C.error.message}"`),x});f=S+ae.join(`
`),u="text/plain",i=a||D("ai-txt",{},e);}else f=(e.includeMetadata?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${w(s.current)}
${"=".repeat(80)}

`:"")+r.current.map(S=>`[${S.time}] ${S.type}
${w(S)}
${"=".repeat(80)}`).join(`
`),u="text/plain";return P.downloadWithFallback(f,i,u),i},[e,w,T]),F=useCallback(async m=>{let a=m||e.uploadEndpoint;if(!a)return {success:false,error:"No endpoint configured"};try{T();let c={metadata:s.current,logs:r.current,fileName:D("json",{},e)},i=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:w(c)});if(!i.ok)throw new Error(`Upload failed: ${i.status}`);return {success:!0,data:await i.json()}}catch(c){let i=c instanceof Error?c.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",c),{success:false,error:i}}},[e.uploadEndpoint,w,T]),q=useCallback(()=>{if(r.current=[],g(0),h.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),$=useCallback(()=>[...r.current],[]),_=useCallback(()=>n,[n]),se=useCallback(()=>(T(),{...s.current}),[T]);return {downloadLogs:M,uploadLogs:F,clearLogs:q,getLogs:$,getLogCount:_,getMetadata:se,sessionId:l.current}}var fe=css`
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
`,Z=css`
  background: #e5e7eb;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,be=css`
  background: #fee2e2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,me=css`
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
`,ye=css`
  background: #fafafa;
  color: #374151;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`,$e=css`
  display: flex;
  gap: 8px;
`,he=css`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`,xe=css`
  margin: 2px 0 0;
  font-size: 11px;
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
`,we=css`
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
`,ve=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 0;
  background: #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`,ee=css`
  text-align: center;
  background: #fff;
  padding: 10px 8px;
`,A=css`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
`,te=css`
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`,_e=css`
  color: #dc2626;
`,ze=css`
  color: #ea580c;
`,Se=css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`,ke=css`
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
`,Re=css`
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
`,Xe=css`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`,oe=css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,Ee=css`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,qe=css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`,I=css`
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
`,We=css`
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
`,Ce=css`
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
`,Le=css`
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
`,K=css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
`,B=css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
`,Ne=css`
  padding: 12px 16px;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #9ca3af;
`,Te=css`
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
    ${me} {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    ${ye} {
      background: #0f172a;
      border-color: #1e293b;
    }

    ${he} {
      color: #f1f5f9;
    }

    ${xe} {
      color: #64748b;
    }

    ${we} {
      color: #64748b;

      &:hover {
        background: #1e293b;
        color: #94a3b8;
      }
    }

    ${ve} {
      background: #0f172a;
      border-color: #334155;
    }

    ${A} {
      color: #f1f5f9;
    }

    ${Se} {
      background: #0f172a;
      border-color: #334155;
    }

    ${ke} {
      color: #e2e8f0;
    }

    ${Re} {
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

    ${Ee} {
      color: #94a3b8;
    }

    ${I} {
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

    ${We} {
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

    ${Ce} {
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

    ${Le} {
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

    ${K} {
      background: #064e3b;
      color: #6ee7b7;
      border-color: #065f46;
    }

    ${B} {
      background: #7f1d1d;
      color: #fca5a5;
      border-color: #991b1b;
    }

    ${Ne} {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

    ${Te} kbd {
      background: #334155;
      color: #e2e8f0;
    }

    ${fe} {
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &:hover {
        background: #334155;
        border-color: #475569;
      }
    }

    ${Z} {
      background: #334155;
      color: #94a3b8;
    }
  }
`;function Ye({user:t,environment:e="production",uploadEndpoint:o,fileNameTemplate:r="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:l=2e3,showInProduction:s=false}){let[n,g]=useState(false),[h,k]=useState(false),[w,L]=useState(null),[N,R]=useState(null),[v,T]=useState(null),M=useRef(null),F=useRef(null),q=useRef(null),{downloadLogs:$,uploadLogs:_,clearLogs:se,getLogs:m,getLogCount:a,getMetadata:c,sessionId:i}=j({fileNameTemplate:r,environment:e,userId:t?.id||t?.email||"guest",includeMetadata:true,uploadEndpoint:o,maxLogs:l,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),f=a(),u=c();useEffect(()=>{let b=x=>{x.ctrlKey&&x.shiftKey&&x.key==="D"&&(x.preventDefault(),g(de=>!de)),x.key==="Escape"&&n&&(x.preventDefault(),g(false),F.current?.focus());};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[n]),useEffect(()=>{if(u.errorCount>=5&&o){let b=async()=>{try{await _();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",b),()=>window.removeEventListener("error",b)}},[u.errorCount,o,_]);let E=useCallback(async()=>{k(true),L(null);try{let b=await _();b.success?(L({type:"success",message:`Uploaded successfully! ${b.data?JSON.stringify(b.data):""}`}),b.data&&typeof b.data=="object"&&"url"in b.data&&await navigator.clipboard.writeText(String(b.data.url))):L({type:"error",message:`Upload failed: ${b.error}`});}catch(b){L({type:"error",message:`Error: ${b instanceof Error?b.message:"Unknown error"}`});}finally{k(false);}},[_]),S=useCallback(b=>{let x=$(b);x&&L({type:"success",message:`Downloaded: ${x}`});},[$]),ae=useCallback(async()=>{R(null);try{if(!("showDirectoryPicker"in window)){R({type:"error",message:"Feature only supported in Chrome/Edge"});return}await $("json",void 0,{showPicker:!0})&&R({type:"success",message:"Saved to directory"});}catch{R({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[$]),ie=useCallback(async()=>{T(null);try{let b=m(),x=c(),de=JSON.stringify({metadata:x,logs:b},null,2);await navigator.clipboard.writeText(de),T({type:"success",message:"Copied to clipboard!"});}catch{T({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[m,c]);if(useEffect(()=>{if(N){let b=setTimeout(()=>{R(null);},3e3);return ()=>clearTimeout(b)}},[N]),useEffect(()=>{if(v){let b=setTimeout(()=>{T(null);},3e3);return ()=>clearTimeout(b)}},[v]),!(s||e==="development"||t?.role==="admin"))return null;let le=()=>{g(true);},ce=()=>{g(false),F.current?.focus();};return jsxs(Fragment,{children:[jsxs("button",{ref:F,type:"button",onClick:le,className:fe,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",children:[jsx("span",{children:"Debug"}),jsx("span",{className:f>0?u.errorCount>0?be:Z:Z,children:f}),u.errorCount>0&&jsxs("span",{className:be,children:[u.errorCount," err"]})]}),n&&jsxs("div",{ref:M,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:me,children:[jsxs("div",{className:ye,children:[jsxs("div",{className:$e,children:[jsx("h3",{className:he,children:"Debug"}),jsxs("p",{className:xe,children:[i.substring(0,36),"..."]})]}),jsx("button",{ref:q,type:"button",onClick:ce,className:we,"aria-label":"Close debug panel",children:"\u2715"})]}),jsxs("div",{className:ve,children:[jsxs("div",{className:ee,children:[jsx("div",{className:A,children:f}),jsx("div",{className:te,children:"Logs"})]}),jsxs("div",{className:ee,children:[jsx("div",{className:`${A} ${_e}`,children:u.errorCount}),jsx("div",{className:te,children:"Errors"})]}),jsxs("div",{className:ee,children:[jsx("div",{className:`${A} ${ze}`,children:u.networkErrorCount}),jsx("div",{className:te,children:"Network"})]})]}),jsxs("details",{className:Se,children:[jsx("summary",{className:ke,role:"button","aria-expanded":"false",children:jsx("span",{children:"\u25B8 Session Details"})}),jsxs("div",{className:Re,children:[jsxs("div",{children:[jsx("strong",{children:"User"}),jsx("span",{children:u.userId||"Anonymous"})]}),jsxs("div",{children:[jsx("strong",{children:"Browser"}),jsxs("span",{children:[u.browser," (",u.platform,")"]})]}),jsxs("div",{children:[jsx("strong",{children:"Screen"}),jsx("span",{children:u.screenResolution})]}),jsxs("div",{children:[jsx("strong",{children:"Timezone"}),jsx("span",{children:u.timezone})]})]})]}),jsxs("div",{className:Xe,children:[jsx("div",{className:oe,children:jsxs("div",{className:qe,children:[jsx("button",{type:"button",onClick:()=>S("json"),className:I,"aria-label":"Download logs as JSON",children:"\u{1F4C4} JSON"}),jsx("button",{type:"button",onClick:()=>S("txt"),className:I,"aria-label":"Download logs as text file",children:"\u{1F4DD} TXT"}),jsx("button",{type:"button",onClick:ie,disabled:f===0,className:I,"aria-label":"Copy logs to clipboard",title:"Copy logs as JSON to clipboard",children:"\u{1F4CB} Copy"}),jsx("button",{type:"button",onClick:ae,disabled:!("showDirectoryPicker"in window),className:I,"aria-label":"Save logs to directory",title:"showDirectoryPicker"in window?"Choose directory to save file":"Feature only supported in Chrome/Edge",children:"\u{1F4C1} Folder"}),jsx("button",{type:"button",onClick:()=>S("jsonl"),disabled:f===0,className:I,"aria-label":"Download logs as JSONL (JSON Lines)",children:"\u{1F4E6} JSONL"}),jsx("button",{type:"button",onClick:()=>S("ecs.json"),disabled:f===0,className:I,"aria-label":"Download logs as ECS JSON (Elastic Common Schema)",children:"\u{1F4CB} ECS"}),jsx("button",{type:"button",onClick:()=>S("ai.txt"),disabled:f===0,className:I,"aria-label":"Download logs as AI-optimized TXT",children:"\u{1F916} AI-TXT"})]})}),o&&jsxs("div",{className:oe,children:[jsx("span",{className:Ee,children:"Upload"}),jsx("button",{type:"button",onClick:E,disabled:h,className:Ce,"aria-label":h?"Uploading logs...":"Upload logs to server","aria-busy":h,children:h?"\u23F3 Uploading...":"\u2601\uFE0F Upload to Server"})]}),w&&jsx("div",{role:"status","aria-live":"polite",className:w.type==="success"?K:B,children:w.message}),N&&jsx("div",{role:"status","aria-live":"polite",className:N.type==="success"?K:B,children:N.message}),v&&jsx("div",{role:"status","aria-live":"polite",className:v.type==="success"?K:B,children:v.message}),jsx("div",{className:oe,children:jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs? This cannot be undone.")&&(se(),L(null));},className:Le,"aria-label":"Clear all logs",children:"\u{1F5D1}\uFE0F Clear All Logs"})})]}),jsx("div",{className:Ne,children:jsxs("div",{className:Te,children:["Press ",jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})]})]})}function Qe({fileNameTemplate:t="debug_{timestamp}"}){let[e,o]=useState(false),{downloadLogs:r,clearLogs:l,getLogCount:s}=j({fileNameTemplate:t}),n=s();return jsxs(Fragment,{children:[jsx("button",{onClick:()=>o(g=>!g),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsx("span",{children:n})}),e&&jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsx("button",{onClick:()=>r("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsx("button",{onClick:()=>{confirm("Clear all logs?")&&l();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsx("button",{onClick:()=>o(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}export{Ye as DebugPanel,Qe as DebugPanelMinimal,Ie as collectMetadata,pe as filterStackTrace,ot as generateExportFilename,D as generateFilename,De as generateSessionId,ue as getBrowserInfo,Y as sanitizeData,H as sanitizeFilename,U as transformMetadataToECS,z as transformToECS,j as useLogRecorder};