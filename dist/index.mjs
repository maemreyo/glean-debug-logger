import {forwardRef,useState,useEffect,useRef,useCallback,useMemo}from'react';import {css}from'goober';import {jsxs,jsx,Fragment}from'react/jsx-runtime';// @ts-nocheck
var St=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function se(t,e={}){let o=e.keys||St;if(!t||typeof t!="object")return t;let r=Array.isArray(t)?[...t]:{...t},a=n=>{if(!n||typeof n!="object")return n;for(let s in n)if(Object.prototype.hasOwnProperty.call(n,s)){let c=s.toLowerCase();o.some(h=>c.includes(h.toLowerCase()))?n[s]="***REDACTED***":n[s]!==null&&typeof n[s]=="object"&&(n[s]=a(n[s]));}return n};return a(r)}function A(t){return t.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function ve(){if(typeof navigator>"u")return "unknown";let t=navigator.userAgent;return t.includes("Edg")?"edge":t.includes("Chrome")?"chrome":t.includes("Firefox")?"firefox":t.includes("Safari")?"safari":"unknown"}function Be(t,e,o,r){if(typeof window>"u")return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:r,errorCount:0,networkErrorCount:0};let a=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",n=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:ve(),platform:navigator.platform,language:navigator.language,screenResolution:a,viewport:n,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:r,errorCount:0,networkErrorCount:0}}function Ge(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function _(t="json",e={},o={}){let{fileNameTemplate:r="{env}_{userId}_{sessionId}_{timestamp}",environment:a="development",userId:n="anonymous",sessionId:s="unknown"}=o,c=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],u=new Date().toISOString().split("T")[0],h=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),m=o.browser||ve(),k=o.platform||(typeof navigator<"u"?navigator.platform:"unknown"),R=(o.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",E=String(o.errorCount??e.errorCount??0),w=String(o.logCount??e.logCount??0),I=r.replace("{env}",A(a)).replace("{userId}",A(n??"anonymous")).replace("{sessionId}",A(s??"unknown")).replace("{timestamp}",c).replace("{date}",u).replace("{time}",h).replace(/\{errorCount\}/g,E).replace(/\{logCount\}/g,w).replace("{browser}",A(m)).replace("{platform}",A(k)).replace("{url}",A(R));for(let[Z,$]of Object.entries(e))I=I.replace(`{${Z}}`,String($));return `${I}.${t}`}function Wt(t,e="json"){let o=t.url.split("?")[0]||"unknown";return _(e,{},{environment:t.environment,userId:t.userId,sessionId:t.sessionId,browser:t.browser,platform:t.platform,url:o,errorCount:t.errorCount,logCount:t.logCount})}var vt={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function Je(t){let e=parseFloat(t);return isNaN(e)?0:Math.round(e*1e6)}function kt(t){return vt[t.toLowerCase()]||"info"}function ke(t){return t.filter(e=>!e.ignored).slice(0,20)}function q(t){return {service:{environment:t.environment},user:t.userId?{id:t.userId}:void 0,host:{name:t.browser,type:t.platform}}}function M(t,e){let o={"@timestamp":t.time,event:{original:t,category:[]}},r=q(e);switch(Object.assign(o,r),t.type){case "CONSOLE":{o.log={level:kt(t.level)},o.message=t.data,o.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{o.http={request:{method:t.method}},o.url={full:t.url},o.event.category=["network","web"],o.event.action="request",o.event.id=t.id;break}case "FETCH_RES":case "XHR_RES":{o.http={response:{status_code:t.status}},o.url={full:t.url},o.event.duration=Je(t.duration),o.event.category=["network","web"],o.event.action="response",o.event.id=t.id;break}case "FETCH_ERR":case "XHR_ERR":{o.error={message:t.error},o.url={full:t.url},o.event.duration=Je(t.duration),o.event.category=["network","web"],o.event.action="error",o.event.id=t.id;let a=t;if(typeof a.body=="object"&&a.body!==null){let n=a.body;if(Array.isArray(n.frames)){let s=ke(n.frames);o.error.stack_trace=s.map(c=>`  at ${c.functionName||"?"} (${c.filename||"?"}:${c.lineNumber||0}:${c.columnNumber||0})`).join(`
`);}}break}default:{o.message=JSON.stringify(t);break}}return o}function Ye(t){return !t||t.length===0?"":t.map(e=>Ct(e)).join("")}function Ct(t){return JSON.stringify(t)+`
`}var ae=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let o=this.originalConsole[e];console[e]=(...r)=>{this.callbacks.forEach(a=>{a(e,r);}),o(...r);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var ie=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o));}attach(){window.fetch=async(...e)=>{let[o,r]=e,a=o.toString();if(this.excludeUrls.some(s=>s.test(a)))return this.originalFetch(...e);let n=Date.now();this.onRequest.forEach(s=>s(a,r||{}));try{let s=await this.originalFetch(...e),c=Date.now()-n;return this.onResponse.forEach(u=>u(a,s.status,c)),s}catch(s){throw this.onError.forEach(c=>c(a,s)),s}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var le=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(o,r,a,n,s){let c=typeof r=="string"?r:r.href;if(e.requestTracker.set(this,{method:o,url:c,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(h=>h.test(c)))return e.originalOpen.call(this,o,r,a??true,n,s);let u=e.requestTracker.get(this);for(let h of e.onRequest)h(u);return e.originalOpen.call(this,o,r,a??true,n,s)},this.originalXHR.prototype.send=function(o){let r=e.requestTracker.get(this);if(r){r.body=o;let a=this.onload,n=this.onerror;this.onload=function(s){let c=Date.now()-r.startTime;for(let u of e.onResponse)u(r,this.status,c);a&&a.call(this,s);},this.onerror=function(s){for(let c of e.onError)c(r,new Error("XHR Error"));n&&n.call(this,s);};}return e.originalSend.call(this,o)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var U=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,o,r="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let s=await(await(await window.showDirectoryPicker()).getFileHandle(o,{create:!0})).createWritable();await s.write(e),await s.close();}catch(a){if(a.name==="AbortError")return;throw a}}static download(e,o,r="application/json"){let a=new Blob([e],{type:r}),n=URL.createObjectURL(a),s=document.createElement("a");s.href=n,s.download=o,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(n);}static async downloadWithFallback(e,o,r="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,o,r);return}catch(a){if(a.name==="AbortError")return}this.download(e,o,r);}};U.supported=null;var Et={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function ee(t={}){let e={...Et,...t},o=useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});useEffect(()=>{o.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let r=useRef([]),a=useRef(e.sessionId||Ge()),n=useRef(Be(a.current,e.environment,e.userId,0)),[s,c]=useState(0),u=useRef(0),h=useRef(false),m=useCallback(b=>{let i=new Set;return JSON.stringify(b,(g,l)=>{if(typeof l=="object"&&l!==null){if(i.has(l))return "[Circular]";i.add(l);}return l})},[]),k=useMemo(()=>new ae,[]),N=useMemo(()=>new ie({excludeUrls:e.excludeUrls}),[e.excludeUrls]),R=useMemo(()=>new le({excludeUrls:e.excludeUrls}),[e.excludeUrls]),E=useCallback(b=>{let i=o.current;r.current.push(b),r.current.length>i.maxLogs&&r.current.shift(),c(r.current.length),b.type==="CONSOLE"?b.level==="ERROR"?u.current++:u.current=0:b.type==="FETCH_ERR"||b.type==="XHR_ERR"?u.current++:u.current=0;let g=i.uploadOnErrorCount??5;if(u.current>=g&&i.uploadEndpoint){let l={metadata:{...n.current,logCount:r.current.length},logs:r.current,fileName:_("json",{},e)};fetch(i.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:m(l)}).catch(()=>{}),u.current=0;}if(i.enablePersistence&&typeof window<"u")try{localStorage.setItem(i.persistenceKey,m(r.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},[m]),w=useCallback(()=>{let b=r.current.filter(g=>g.type==="CONSOLE").reduce((g,l)=>l.level==="ERROR"?g+1:g,0),i=r.current.filter(g=>g.type==="FETCH_ERR"||g.type==="XHR_ERR").length;n.current={...n.current,logCount:r.current.length,errorCount:b,networkErrorCount:i};},[]);useEffect(()=>{if(typeof window>"u"||h.current)return;if(h.current=true,e.enablePersistence)try{let i=localStorage.getItem(e.persistenceKey);i&&(r.current=JSON.parse(i),c(r.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let b=[];if(e.captureConsole&&(k.attach(),k.onLog((i,g)=>{let l=g.map(f=>{if(typeof f=="object")try{return m(f)}catch{return String(f)}return String(f)}).join(" ");E({type:"CONSOLE",level:i.toUpperCase(),time:new Date().toISOString(),data:l.substring(0,5e3)});}),b.push(()=>k.detach())),e.captureFetch){let i=new Map;N.onFetchRequest((g,l)=>{let f=Math.random().toString(36).substring(7),y=null;if(l?.body)try{y=typeof l.body=="string"?JSON.parse(l.body):l.body,y=se(y,{keys:e.sanitizeKeys});}catch{y=String(l.body).substring(0,1e3);}i.set(f,{url:g,method:l?.method||"GET",headers:se(l?.headers,{keys:e.sanitizeKeys}),body:y}),E({type:"FETCH_REQ",id:f,url:g,method:l?.method||"GET",headers:se(l?.headers,{keys:e.sanitizeKeys}),body:y,time:new Date().toISOString()});}),N.onFetchResponse((g,l,f)=>{for(let[y,C]of i.entries())if(C.url===g){i.delete(y),E({type:"FETCH_RES",id:y,url:g,status:l,statusText:"",duration:`${f}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),N.onFetchError((g,l)=>{for(let[f,y]of i.entries())if(y.url===g){i.delete(f),E({type:"FETCH_ERR",id:f,url:g,error:l.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),N.attach(),b.push(()=>N.detach());}return e.captureXHR&&(R.onXHRRequest(i=>{E({type:"XHR_REQ",id:Math.random().toString(36).substring(7),url:i.url,method:i.method,headers:i.headers,body:i.body,time:new Date().toISOString()});}),R.onXHRResponse((i,g,l)=>{E({type:"XHR_RES",id:Math.random().toString(36).substring(7),url:i.url,status:g,statusText:"",duration:`${l}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),R.onXHRError((i,g)=>{E({type:"XHR_ERR",id:Math.random().toString(36).substring(7),url:i.url,error:g.message,duration:"[unknown]ms",time:new Date().toISOString()});}),R.attach(),b.push(()=>R.detach())),()=>{b.forEach(i=>i()),h.current=false;}},[e,E,m,k,N,R]);let I=useCallback((b,i,g)=>{if(typeof window>"u")return null;w();let l=i||_(b,{},e),f,y;if(b==="json"){let C=e.includeMetadata?{metadata:n.current,logs:r.current}:r.current;f=m(C),y="application/json";}else if(b==="jsonl"){let C=r.current.map(F=>M(F,n.current));f=Ye(C),y="application/x-ndjson",l=i||_("jsonl",{},e);}else if(b==="ecs.json"){let C={metadata:q(n.current),logs:r.current.map(F=>M(F,n.current))};f=JSON.stringify(C,null,2),y="application/json",l=i||_("ecs-json",{},e);}else if(b==="ai.txt"){let C=n.current,F=`# METADATA
service.name=${C.environment||"unknown"}
user.id=${C.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,he=r.current.map(we=>{let S=M(we,C),Se=S["@timestamp"],Xe=S.log?.level||"info",p=S.event?.category?.[0]||"unknown",x=`[${Se}] ${Xe} ${p}`;return S.message&&(x+=` | message="${S.message}"`),S.http?.request?.method&&(x+=` | req.method=${S.http.request.method}`),S.url?.full&&(x+=` | url=${S.url.full}`),S.http?.response?.status_code&&(x+=` | res.status=${S.http.response.status_code}`),S.error?.message&&(x+=` | error="${S.error.message}"`),x});f=F+he.join(`
`),y="text/plain",l=i||_("ai-txt",{},e);}else f=(e.includeMetadata?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${m(n.current)}
${"=".repeat(80)}

`:"")+r.current.map(F=>`[${F.time}] ${F.type}
${m(F)}
${"=".repeat(80)}`).join(`
`),y="text/plain";return U.downloadWithFallback(f,l,y),l},[e,m,w]),Z=useCallback(async b=>{let i=b||e.uploadEndpoint;if(!i)return {success:false,error:"No endpoint configured"};try{w();let g={metadata:n.current,logs:r.current,fileName:_("json",{},e)},l=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:m(g)});if(!l.ok)throw new Error(`Upload failed: ${l.status}`);return {success:!0,data:await l.json()}}catch(g){let l=g instanceof Error?g.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",g),{success:false,error:l}}},[e.uploadEndpoint,m,w]),$=useCallback(()=>{if(r.current=[],c(0),u.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),B=useCallback(()=>[...r.current],[]),xe=useCallback(()=>s,[s]),H=useCallback(()=>(w(),{...n.current}),[w]);return {downloadLogs:I,uploadLogs:Z,clearLogs:$,getLogs:B,getLogCount:xe,getMetadata:H,sessionId:a.current}}function Ze(){let[t,e]=useState(false),[o,r]=useState(false);useEffect(()=>{r(U.isSupported());},[]);let a=useCallback(()=>{e(c=>!c);},[]),n=useCallback(()=>{e(true);},[]),s=useCallback(()=>{e(false);},[]);return useEffect(()=>{let c=u=>{u.ctrlKey&&u.shiftKey&&u.key==="D"&&(u.preventDefault(),a()),u.key==="Escape"&&t&&(u.preventDefault(),s());};return document.addEventListener("keydown",c),()=>document.removeEventListener("keydown",c)},[t,a,s]),{isOpen:t,toggle:a,open:n,close:s,supportsDirectoryPicker:o}}var et="debug-panel-copy-format",Ft=["json","ecs.json","ai.txt"];function ce(){let[t,e]=useState(()=>{if(typeof window<"u"){let o=localStorage.getItem(et);if(o&&Ft.includes(o))return o}return "ecs.json"});return useEffect(()=>{localStorage.setItem(et,t);},[t]),{copyFormat:t,setCopyFormat:e}}function tt(){let[t,e]=useState(null),[o,r]=useState(null),[a,n]=useState(null),[s,c]=useState(false);return useEffect(()=>{if(t){let u=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(u)}},[t]),useEffect(()=>{if(o){let u=setTimeout(()=>{r(null);},3e3);return ()=>clearTimeout(u)}},[o]),useEffect(()=>{if(a){let u=setTimeout(()=>{n(null);},3e3);return ()=>clearTimeout(u)}},[a]),{uploadStatus:t,setUploadStatus:e,directoryStatus:o,setDirectoryStatus:r,copyStatus:a,setCopyStatus:n,showSettings:s,setShowSettings:c}}var Le=css`
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
`,ue=css`
  background: #e5e7eb;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,De=css`
  background: #fee2e2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,Fe=css`
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
`,Te=css`
  background: #fafafa;
  color: #374151;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`,ot=css`
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
`,pe=css`
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
`,Me=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 0;
  background: #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`,ge=css`
  text-align: center;
  background: #fff;
  padding: 10px 8px;
`,te=css`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
`,fe=css`
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`,rt=css`
  color: #dc2626;
`,nt=css`
  color: #ea580c;
`,Oe=css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`,Pe=css`
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
`;var Tt=css`
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
`;var Nt=css`
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
`,It=css`
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
`,Mt=css`
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
`,Ot=css`
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
`,oe=css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
`,re=css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
`,He=css`
  padding: 12px 16px;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #9ca3af;
`,_e=css`
  kbd {
    display: inline-block;
    padding: 2px 6px;
    background: #e5e7eb;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 11px;
    color: #6b7280;
  }
`,ze=css`
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
`,Ae=css`
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f3f4f6;
`,be=css`
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
`,st=css`
  background: #f3f4f6;
`,L=css`
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
`,at=css`
  ${L}
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
    ${Fe} {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    ${Te} {
      background: #0f172a;
      border-color: #1e293b;
    }

    ${Ne} {
      color: #f1f5f9;
    }

    ${Ie} {
      color: #64748b;
    }

    ${pe} {
      color: #64748b;

      &:hover {
        background: #1e293b;
        color: #94a3b8;
      }
    }

    ${Me} {
      background: #0f172a;
      border-color: #334155;
    }

    ${te} {
      color: #f1f5f9;
    }

    ${Oe} {
      background: #0f172a;
      border-color: #334155;
    }

    ${Pe} {
      color: #e2e8f0;
    }

    ${$e} {
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

    ${Tt} {
      color: #94a3b8;
    }

    ${Nt} {
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

    ${It} {
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

    ${Mt} {
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

    ${Ot} {
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

    ${oe} {
      background: #064e3b;
      color: #6ee7b7;
      border-color: #065f46;
    }

    ${re} {
      background: #7f1d1d;
      color: #fca5a5;
      border-color: #991b1b;
    }

    ${He} {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

    ${_e} kbd {
      background: #334155;
      color: #e2e8f0;
    }

    ${Le} {
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &:hover {
        background: #334155;
        border-color: #475569;
      }
    }

    ${ue} {
      background: #334155;
      color: #94a3b8;
    }

    ${ze} {
      background: #1e293b;
      border-color: #334155;
    }

    ${Ae} {
      color: #64748b;
      border-color: #334155;
    }

    ${be} {
      color: #e2e8f0;

      &:hover {
        background: #334155;
      }
    }
  }
`;var it=forwardRef(function({sessionId:e,onClose:o,onSaveToDirectory:r},a){let{copyFormat:n,setCopyFormat:s}=ce(),[c,u]=useState(false),h=["json","ecs.json","ai.txt"];return jsxs("div",{className:Te,children:[jsxs("div",{className:ot,children:[jsx("h3",{className:Ne,children:"Debug"}),jsxs("p",{className:Ie,children:[e.substring(0,36),"..."]})]}),jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsxs("div",{style:{position:"relative"},children:[jsx("button",{type:"button",onClick:()=>u(!c),className:pe,"aria-label":"Actions and settings","aria-expanded":c,title:"Actions and settings",children:"\u2699\uFE0F"}),c&&jsxs("div",{className:ze,style:{width:"220px"},children:[jsx("div",{className:Ae,children:"Copy Format"}),h.map(m=>jsxs("button",{type:"button",onClick:()=>{s(m),u(false);},className:`${be} ${n===m?st:""}`,children:[n===m&&"\u2713 ",m==="json"&&"\u{1F4C4} JSON",m==="ecs.json"&&"\u{1F4CB} ECS (AI)",m==="ai.txt"&&"\u{1F916} AI-TXT"]},m)),jsx("div",{style:{borderTop:"1px solid #f3f4f6",margin:"8px 0"}}),jsx("button",{type:"button",onClick:()=>{r(),u(false);},className:be,children:"\u{1F4C1} Save to Folder"})]})]}),jsx("button",{ref:a,type:"button",onClick:o,className:pe,"aria-label":"Close debug panel",children:"\u2715"})]})]})});function lt({logCount:t,errorCount:e,networkErrorCount:o}){return jsxs("div",{className:Me,children:[jsxs("div",{className:ge,children:[jsx("div",{className:te,children:t}),jsx("div",{className:fe,children:"Logs"})]}),jsxs("div",{className:ge,children:[jsx("div",{className:`${te} ${rt}`,children:e}),jsx("div",{className:fe,children:"Errors"})]}),jsxs("div",{className:ge,children:[jsx("div",{className:`${te} ${nt}`,children:o}),jsx("div",{className:fe,children:"Network"})]})]})}function ct({logCount:t,hasUploadEndpoint:e,isUploading:o,getFilteredLogCount:r,onCopyFiltered:a,onDownload:n,onCopy:s,onUpload:c}){return jsx("div",{style:{padding:"12px 16px"},children:jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"6px"},children:[jsx("button",{type:"button",onClick:()=>a("logs"),className:L,disabled:t===0||r("logs")===0,"aria-label":"Copy only console logs",children:"\u{1F4CB} Logs"}),jsx("button",{type:"button",onClick:()=>a("errors"),className:L,disabled:t===0||r("errors")===0,"aria-label":"Copy only errors",children:"\u26A0\uFE0F Errors"}),jsx("button",{type:"button",onClick:()=>a("network"),className:L,disabled:t===0||r("network")===0,"aria-label":"Copy only network requests",children:"\u{1F310} Network"}),jsx("button",{type:"button",onClick:()=>n("json"),className:L,disabled:t===0,children:"\u{1F4C4} JSON"}),jsx("button",{type:"button",onClick:()=>n("txt"),className:L,disabled:t===0,children:"\u{1F4DD} TXT"}),jsx("button",{type:"button",onClick:()=>n("jsonl"),className:L,disabled:t===0,children:"\u{1F4E6} JSONL"}),jsx("button",{type:"button",onClick:()=>n("ecs.json"),className:L,disabled:t===0,children:"\u{1F4CB} ECS"}),jsx("button",{type:"button",onClick:s,className:L,disabled:t===0,children:"\u{1F4CB} Copy"}),jsx("button",{type:"button",onClick:()=>n("ai.txt"),className:L,disabled:t===0,children:"\u{1F916} AI"}),e?jsx("button",{type:"button",onClick:c,className:L,disabled:o,children:"\u2601\uFE0F Upload"}):jsx("div",{})]})})}function dt({uploadStatus:t,directoryStatus:e,copyStatus:o}){return jsxs("div",{style:{padding:"0 16px 12px"},children:[t&&jsx("div",{role:"status","aria-live":"polite",className:t.type==="success"?oe:re,children:t.message}),e&&jsx("div",{role:"status","aria-live":"polite",className:e.type==="success"?oe:re,children:e.message}),o&&jsx("div",{role:"status","aria-live":"polite",className:o.type==="success"?oe:re,children:o.message})]})}function ut({metadata:t}){return jsxs("details",{className:Oe,style:{borderTop:"1px solid #f3f4f6",borderRadius:0},children:[jsx("summary",{className:Pe,children:jsx("span",{children:"\u25B8 Session Details"})}),jsxs("div",{className:$e,children:[jsxs("div",{children:[jsx("strong",{children:"User"}),jsx("span",{children:t.userId||"Anonymous"})]}),jsxs("div",{children:[jsx("strong",{children:"Browser"}),jsxs("span",{children:[t.browser," (",t.platform,")"]})]}),jsxs("div",{children:[jsx("strong",{children:"Screen"}),jsx("span",{children:t.screenResolution})]}),jsxs("div",{children:[jsx("strong",{children:"Timezone"}),jsx("span",{children:t.timezone})]})]})]})}function gt(){return jsx("div",{className:He,children:jsxs("div",{className:_e,children:["Press ",jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function mt(t,e){switch(e){case "logs":return t.filter(o=>o.type==="CONSOLE");case "errors":return t.filter(o=>o.type==="CONSOLE"&&o.level==="error");case "network":return t.filter(o=>o.type==="FETCH_REQ"||o.type==="FETCH_RES"||o.type==="XHR_REQ"||o.type==="XHR_RES");case "networkErrors":return t.filter(o=>o.type==="FETCH_ERR"||o.type==="XHR_ERR");default:return t}}function Ue({user:t,environment:e="production",uploadEndpoint:o,fileNameTemplate:r="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:a=2e3,showInProduction:n=false}){let{isOpen:s,open:c,close:u}=Ze(),{copyFormat:h}=ce(),{uploadStatus:m,setUploadStatus:k,directoryStatus:N,setDirectoryStatus:R,copyStatus:E,setCopyStatus:w}=tt(),I=useRef(null),Z=useRef(null),{downloadLogs:$,uploadLogs:B,clearLogs:xe,getLogs:H,getLogCount:b,getMetadata:i,sessionId:g}=ee({fileNameTemplate:r,environment:e,userId:t?.id||t?.email||"guest",includeMetadata:true,uploadEndpoint:o,maxLogs:a,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),l=b(),f=i();useEffect(()=>{if(f.errorCount>=5&&o){let p=async()=>{try{await B();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",p),()=>window.removeEventListener("error",p)}},[f.errorCount,o,B]),useEffect(()=>{let p=x=>{s&&I.current&&!I.current.contains(x.target)&&u();};return document.addEventListener("mousedown",p),()=>document.removeEventListener("mousedown",p)},[s,u]);let y=useCallback((p,x)=>{if(h==="json")return JSON.stringify({metadata:x,logs:p},null,2);if(h==="ecs.json"){let z=p.map(J=>M(J,x)),G={metadata:q(x),logs:z};return JSON.stringify(G,null,2)}else if(h==="ai.txt"){let z=`# METADATA
service.name=${x.environment||"unknown"}
user.id=${x.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,G=p.map(J=>{let v=M(J,x),je=v["@timestamp"],Ke=v["log.level"],wt=v["event.category"]?.[0]||"unknown",Y=`[${je}] ${Ke} ${wt}`;return v.message&&(Y+=` | message="${v.message}"`),v.http?.request?.method&&(Y+=` | req.method=${v.http.request.method}`),v.url?.full&&(Y+=` | url=${v.url.full}`),v.http?.response?.status_code&&(Y+=` | res.status=${v.http.response.status_code}`),v.error?.message&&(Y+=` | error="${v.error.message}"`),Y});return z+G.join(`
`)}return JSON.stringify({metadata:x,logs:p},null,2)},[h]),C=useCallback(async()=>{k(null);try{let p=await B();p.success?(k({type:"success",message:`Uploaded successfully! ${p.data?JSON.stringify(p.data):""}`}),p.data&&typeof p.data=="object"&&"url"in p.data&&await navigator.clipboard.writeText(String(p.data.url))):k({type:"error",message:`Upload failed: ${p.error}`});}catch(p){k({type:"error",message:`Error: ${p instanceof Error?p.message:"Unknown error"}`});}},[B,k]),F=useCallback(p=>{let x=$(p);x&&k({type:"success",message:`Downloaded: ${x}`});},[$,k]),he=useCallback(async()=>{R(null);try{await $("json",void 0,{showPicker:!0})&&R({type:"success",message:"Saved to directory"});}catch{R({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[$,R]),we=useCallback(async()=>{w(null);try{let p=H(),x=i(),z=y(p,x);await navigator.clipboard.writeText(z),w({type:"success",message:"Copied to clipboard!"});}catch{w({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[H,i,y,w]),S=useCallback(async p=>{w(null);try{let x=H(),z=i(),G=mt(x,p),J=G.length;if(J===0){w({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[p]});return}let v=y(G,z);await navigator.clipboard.writeText(v),w({type:"success",message:`Copied ${J} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[p]} to clipboard`});}catch{w({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[H,i,y,w]),Se=useCallback(p=>mt(H(),p).length,[H]);return n||e==="development"||t?.role==="admin"?jsxs(Fragment,{children:[jsxs("button",{type:"button",onClick:c,className:Le,"aria-label":"Open debug panel (Ctrl+Shift+D)","aria-expanded":s,"aria-controls":"debug-panel",children:[jsx("span",{children:"Debug"}),jsx("span",{className:l>0?f.errorCount>0?De:ue:ue,children:l}),f.errorCount>0&&jsxs("span",{className:De,children:[f.errorCount," err"]})]}),s&&jsxs("div",{ref:I,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:Fe,children:[jsx(it,{sessionId:g,onClose:u,onSaveToDirectory:he,ref:Z}),jsx(lt,{logCount:l,errorCount:f.errorCount,networkErrorCount:f.networkErrorCount}),jsx(ct,{logCount:l,hasUploadEndpoint:!!o,isUploading:false,getFilteredLogCount:Se,onCopyFiltered:S,onDownload:F,onCopy:we,onUpload:C}),jsx(dt,{uploadStatus:m,directoryStatus:N,copyStatus:E}),jsx(ut,{metadata:f}),jsx("div",{style:{padding:"8px 16px",display:"flex",justifyContent:"flex-end"},children:!o&&jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs?")&&xe();},className:at,children:"\u{1F5D1}\uFE0F Clear"})}),jsx(gt,{})]})]}):null}function Ut({fileNameTemplate:t="debug_{timestamp}"}){let[e,o]=useState(false),{downloadLogs:r,clearLogs:a,getLogCount:n}=ee({fileNameTemplate:t}),s=n();return jsxs(Fragment,{children:[jsx("button",{onClick:()=>o(c=>!c),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsx("span",{children:s})}),e&&jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsx("button",{onClick:()=>r("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsx("button",{onClick:()=>{confirm("Clear all logs?")&&a();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsx("button",{onClick:()=>o(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function Bt(t){return useMemo(()=>t.showInProduction||t.environment==="development"||t.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[t.showInProduction,t.environment,t.user])}function Gt(){let t=useCallback(o=>{try{typeof window<"u"&&(o?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:o}})));}catch{}},[]),e=useMemo(()=>typeof process<"u"&&true,[]);useEffect(()=>{if(typeof window>"u")return;let o=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>t(true),hide:()=>t(false),toggle:()=>{try{let r=localStorage.getItem("glean-debug-enabled")==="true";t(!r);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=o,()=>{typeof window<"u"&&window.glean===o&&delete window.glean;}},[t,e]);}function ht(t){let e=Bt(t);return Gt(),e?jsx(Ue,{...t}):null}export{Ue as DebugPanel,Ut as DebugPanelMinimal,ht as GleanDebugger,Be as collectMetadata,ke as filterStackTrace,Wt as generateExportFilename,_ as generateFilename,Ge as generateSessionId,ve as getBrowserInfo,se as sanitizeData,A as sanitizeFilename,q as transformMetadataToECS,M as transformToECS,ee as useLogRecorder};