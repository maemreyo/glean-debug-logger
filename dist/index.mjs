import {useRef,useEffect,useState,useCallback,useMemo}from'react';import {css}from'goober';import {jsxs,Fragment,jsx}from'react/jsx-runtime';// @ts-nocheck
var ot=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function se(t,e={}){let o=e.keys||ot;if(!t||typeof t!="object")return t;let r=Array.isArray(t)?[...t]:{...t},d=s=>{if(!s||typeof s!="object")return s;for(let n in s)if(Object.prototype.hasOwnProperty.call(s,n)){let g=n.toLowerCase();o.some(R=>g.includes(R.toLowerCase()))?s[n]="***REDACTED***":s[n]!==null&&typeof s[n]=="object"&&(s[n]=d(s[n]));}return s};return d(r)}function U(t){return t.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function we(){if(typeof navigator>"u")return "unknown";let t=navigator.userAgent;return t.includes("Edg")?"edge":t.includes("Chrome")?"chrome":t.includes("Firefox")?"firefox":t.includes("Safari")?"safari":"unknown"}function Pe(t,e,o,r){if(typeof window>"u")return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:r,errorCount:0,networkErrorCount:0};let d=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",s=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:we(),platform:navigator.platform,language:navigator.language,screenResolution:d,viewport:s,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:r,errorCount:0,networkErrorCount:0}}function ze(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function P(t="json",e={},o={}){let{fileNameTemplate:r="{env}_{userId}_{sessionId}_{timestamp}",environment:d="development",userId:s="anonymous",sessionId:n="unknown"}=o,g=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],h=new Date().toISOString().split("T")[0],R=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),w=o.browser||we(),T=o.platform||(typeof navigator<"u"?navigator.platform:"unknown"),E=(o.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",v=String(o.errorCount??e.errorCount??0),I=String(o.logCount??e.logCount??0),M=r.replace("{env}",U(d)).replace("{userId}",U(s??"anonymous")).replace("{sessionId}",U(n??"unknown")).replace("{timestamp}",g).replace("{date}",h).replace("{time}",R).replace(/\{errorCount\}/g,v).replace(/\{logCount\}/g,I).replace("{browser}",U(w)).replace("{platform}",U(T)).replace("{url}",U(E));for(let[z,N]of Object.entries(e))M=M.replace(`{${z}}`,String(N));return `${M}.${t}`}function Rt(t,e="json"){let o=t.url.split("?")[0]||"unknown";return P(e,{},{environment:t.environment,userId:t.userId,sessionId:t.sessionId,browser:t.browser,platform:t.platform,url:o,errorCount:t.errorCount,logCount:t.logCount})}var rt={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function qe(t){let e=parseFloat(t);return isNaN(e)?0:Math.round(e*1e6)}function nt(t){return rt[t.toLowerCase()]||"info"}function ve(t){return t.filter(e=>!e.ignored).slice(0,20)}function B(t){return {service:{environment:t.environment},user:t.userId?{id:t.userId}:void 0,host:{name:t.browser,type:t.platform}}}function $(t,e){let o={"@timestamp":t.time,event:{original:t,category:[]}},r=B(e);switch(Object.assign(o,r),t.type){case "CONSOLE":{o.log={level:nt(t.level)},o.message=t.data,o.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{o.http={request:{method:t.method}},o.url={full:t.url},o.event.category=["network","web"],o.event.action="request",o.event.id=t.id;break}case "FETCH_RES":case "XHR_RES":{o.http={response:{status_code:t.status}},o.url={full:t.url},o.event.duration=qe(t.duration),o.event.category=["network","web"],o.event.action="response",o.event.id=t.id;break}case "FETCH_ERR":case "XHR_ERR":{o.error={message:t.error},o.url={full:t.url},o.event.duration=qe(t.duration),o.event.category=["network","web"],o.event.action="error",o.event.id=t.id;let d=t;if(typeof d.body=="object"&&d.body!==null){let s=d.body;if(Array.isArray(s.frames)){let n=ve(s.frames);o.error.stack_trace=n.map(g=>`  at ${g.functionName||"?"} (${g.filename||"?"}:${g.lineNumber||0}:${g.columnNumber||0})`).join(`
`);}}break}default:{o.message=JSON.stringify(t);break}}return o}function ae(t){return !t||t.length===0?"":t.map(e=>st(e)).join("")}function st(t){return JSON.stringify(t)+`
`}var ie=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let o=this.originalConsole[e];console[e]=(...r)=>{this.callbacks.forEach(d=>{d(e,r);}),o(...r);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var le=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o));}attach(){window.fetch=async(...e)=>{let[o,r]=e,d=o.toString();if(this.excludeUrls.some(n=>n.test(d)))return this.originalFetch(...e);let s=Date.now();this.onRequest.forEach(n=>n(d,r||{}));try{let n=await this.originalFetch(...e),g=Date.now()-s;return this.onResponse.forEach(h=>h(d,n.status,g)),n}catch(n){throw this.onError.forEach(g=>g(d,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var ce=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(o,r,d,s,n){let g=typeof r=="string"?r:r.href;if(e.requestTracker.set(this,{method:o,url:g,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(R=>R.test(g)))return e.originalOpen.call(this,o,r,d??true,s,n);let h=e.requestTracker.get(this);for(let R of e.onRequest)R(h);return e.originalOpen.call(this,o,r,d??true,s,n)},this.originalXHR.prototype.send=function(o){let r=e.requestTracker.get(this);if(r){r.body=o;let d=this.onload,s=this.onerror;this.onload=function(n){let g=Date.now()-r.startTime;for(let h of e.onResponse)h(r,this.status,g);d&&d.call(this,n);},this.onerror=function(n){for(let g of e.onError)g(r,new Error("XHR Error"));s&&s.call(this,n);};}return e.originalSend.call(this,o)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var Z=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,o,r="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(o,{create:!0})).createWritable();await n.write(e),await n.close();}catch(d){if(d.name==="AbortError")return;throw d}}static download(e,o,r="application/json"){let d=new Blob([e],{type:r}),s=URL.createObjectURL(d),n=document.createElement("a");n.href=s,n.download=o,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(s);}static async downloadWithFallback(e,o,r="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,o,r);return}catch(d){if(d.name==="AbortError")return}this.download(e,o,r);}};Z.supported=null;var it={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function ee(t={}){let e={...it,...t},o=useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});useEffect(()=>{o.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let r=useRef([]),d=useRef(e.sessionId||ze()),s=useRef(Pe(d.current,e.environment,e.userId,0)),[n,g]=useState(0),h=useRef(0),R=useRef(false),w=useCallback(b=>{let a=new Set;return JSON.stringify(b,(p,l)=>{if(typeof l=="object"&&l!==null){if(a.has(l))return "[Circular]";a.add(l);}return l})},[]),T=useMemo(()=>new ie,[]),L=useMemo(()=>new le({excludeUrls:e.excludeUrls}),[e.excludeUrls]),E=useMemo(()=>new ce({excludeUrls:e.excludeUrls}),[e.excludeUrls]),v=useCallback(b=>{let a=o.current;r.current.push(b),r.current.length>a.maxLogs&&r.current.shift(),g(r.current.length),b.type==="CONSOLE"?b.level==="ERROR"?h.current++:h.current=0:b.type==="FETCH_ERR"||b.type==="XHR_ERR"?h.current++:h.current=0;let p=a.uploadOnErrorCount??5;if(h.current>=p&&a.uploadEndpoint){let l={metadata:{...s.current,logCount:r.current.length},logs:r.current,fileName:P("json",{},e)};fetch(a.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:w(l)}).catch(()=>{}),h.current=0;}if(a.enablePersistence&&typeof window<"u")try{localStorage.setItem(a.persistenceKey,w(r.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},[w]),I=useCallback(()=>{let b=r.current.filter(p=>p.type==="CONSOLE").reduce((p,l)=>l.level==="ERROR"?p+1:p,0),a=r.current.filter(p=>p.type==="FETCH_ERR"||p.type==="XHR_ERR").length;s.current={...s.current,logCount:r.current.length,errorCount:b,networkErrorCount:a};},[]);useEffect(()=>{if(typeof window>"u"||R.current)return;if(R.current=true,e.enablePersistence)try{let a=localStorage.getItem(e.persistenceKey);a&&(r.current=JSON.parse(a),g(r.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let b=[];if(e.captureConsole&&(T.attach(),T.onLog((a,p)=>{let l=p.map(m=>{if(typeof m=="object")try{return w(m)}catch{return String(m)}return String(m)}).join(" ");v({type:"CONSOLE",level:a.toUpperCase(),time:new Date().toISOString(),data:l.substring(0,5e3)});}),b.push(()=>T.detach())),e.captureFetch){let a=new Map;L.onFetchRequest((p,l)=>{let m=Math.random().toString(36).substring(7),x=null;if(l?.body)try{x=typeof l.body=="string"?JSON.parse(l.body):l.body,x=se(x,{keys:e.sanitizeKeys});}catch{x=String(l.body).substring(0,1e3);}a.set(m,{url:p,method:l?.method||"GET",headers:se(l?.headers,{keys:e.sanitizeKeys}),body:x}),v({type:"FETCH_REQ",id:m,url:p,method:l?.method||"GET",headers:se(l?.headers,{keys:e.sanitizeKeys}),body:x,time:new Date().toISOString()});}),L.onFetchResponse((p,l,m)=>{for(let[x,S]of a.entries())if(S.url===p){a.delete(x),v({type:"FETCH_RES",id:x,url:p,status:l,statusText:"",duration:`${m}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),L.onFetchError((p,l)=>{for(let[m,x]of a.entries())if(x.url===p){a.delete(m),v({type:"FETCH_ERR",id:m,url:p,error:l.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),L.attach(),b.push(()=>L.detach());}return e.captureXHR&&(E.onXHRRequest(a=>{v({type:"XHR_REQ",id:Math.random().toString(36).substring(7),url:a.url,method:a.method,headers:a.headers,body:a.body,time:new Date().toISOString()});}),E.onXHRResponse((a,p,l)=>{v({type:"XHR_RES",id:Math.random().toString(36).substring(7),url:a.url,status:p,statusText:"",duration:`${l}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),E.onXHRError((a,p)=>{v({type:"XHR_ERR",id:Math.random().toString(36).substring(7),url:a.url,error:p.message,duration:"[unknown]ms",time:new Date().toISOString()});}),E.attach(),b.push(()=>E.detach())),()=>{b.forEach(a=>a()),R.current=false;}},[e,v,w,T,L,E]);let M=useCallback((b,a,p)=>{if(typeof window>"u")return null;I();let l=a||P(b,{},e),m,x;if(b==="json"){let S=e.includeMetadata?{metadata:s.current,logs:r.current}:r.current;m=w(S),x="application/json";}else if(b==="jsonl"){let S=r.current.map(O=>$(O,s.current));m=ae(S),x="application/x-ndjson",l=a||P("jsonl",{},e);}else if(b==="ecs.json"){let S={metadata:B(s.current),logs:r.current.map(O=>$(O,s.current))};m=JSON.stringify(S,null,2),x="application/json",l=a||P("ecs-json",{},e);}else if(b==="ai.txt"){let S=s.current,O=`# METADATA
service.name=${S.environment||"unknown"}
user.id=${S.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,F=r.current.map(C=>{let k=$(C,S),A=k["@timestamp"],ye=k.log?.level||"info",xe=k.event?.category?.[0]||"unknown",X=`[${A}] ${ye} ${xe}`;return k.message&&(X+=` | message="${k.message}"`),k.http?.request?.method&&(X+=` | req.method=${k.http.request.method}`),k.url?.full&&(X+=` | url=${k.url.full}`),k.http?.response?.status_code&&(X+=` | res.status=${k.http.response.status_code}`),k.error?.message&&(X+=` | error="${k.error.message}"`),X});m=O+F.join(`
`),x="text/plain",l=a||P("ai-txt",{},e);}else m=(e.includeMetadata?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${w(s.current)}
${"=".repeat(80)}

`:"")+r.current.map(O=>`[${O.time}] ${O.type}
${w(O)}
${"=".repeat(80)}`).join(`
`),x="text/plain";return Z.downloadWithFallback(m,l,x),l},[e,w,I]),z=useCallback(async b=>{let a=b||e.uploadEndpoint;if(!a)return {success:false,error:"No endpoint configured"};try{I();let p={metadata:s.current,logs:r.current,fileName:P("json",{},e)},l=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:w(p)});if(!l.ok)throw new Error(`Upload failed: ${l.status}`);return {success:!0,data:await l.json()}}catch(p){let l=p instanceof Error?p.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",p),{success:false,error:l}}},[e.uploadEndpoint,w,I]),N=useCallback(()=>{if(r.current=[],g(0),h.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),me=useCallback(()=>[...r.current],[]),W=useCallback(()=>n,[n]),q=useCallback(()=>(I(),{...s.current}),[I]);return {downloadLogs:M,uploadLogs:z,clearLogs:N,getLogs:me,getLogCount:W,getMetadata:q,sessionId:d.current}}var ke=css`
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
`,de=css`
  background: #e5e7eb;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,Re=css`
  background: #fee2e2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,Ee=css`
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
`,Ce=css`
  background: #fafafa;
  color: #374151;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`,Xe=css`
  display: flex;
  gap: 8px;
`,Le=css`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`,Ie=css`
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
`,Ne=css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 0;
  background: #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`,pe=css`
  text-align: center;
  background: #fff;
  padding: 10px 8px;
`,te=css`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
`,ge=css`
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`,Ue=css`
  color: #dc2626;
`,Be=css`
  color: #ea580c;
`,De=css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`,Te=css`
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
`,Oe=css`
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
`;var lt=css`
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
`;var ct=css`
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
`,dt=css`
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
`,ut=css`
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
`,pt=css`
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
`,$e=css`
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
`,Fe=css`
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
`,He=css`
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f3f4f6;
`,fe=css`
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
`,Ke=css`
  background: #f3f4f6;
`,j=css`
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
`,Ge=css`
  ${j}
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
    ${Ee} {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    ${Ce} {
      background: #0f172a;
      border-color: #1e293b;
    }

    ${Le} {
      color: #f1f5f9;
    }

    ${Ie} {
      color: #64748b;
    }

    ${ue} {
      color: #64748b;

      &:hover {
        background: #1e293b;
        color: #94a3b8;
      }
    }

    ${Ne} {
      background: #0f172a;
      border-color: #334155;
    }

    ${te} {
      color: #f1f5f9;
    }

    ${De} {
      background: #0f172a;
      border-color: #334155;
    }

    ${Te} {
      color: #e2e8f0;
    }

    ${Oe} {
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

    ${lt} {
      color: #94a3b8;
    }

    ${ct} {
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

    ${dt} {
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

    ${ut} {
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

    ${pt} {
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

    ${$e} {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

    ${Me} kbd {
      background: #334155;
      color: #e2e8f0;
    }

    ${ke} {
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &:hover {
        background: #334155;
        border-color: #475569;
      }
    }

    ${de} {
      background: #334155;
      color: #94a3b8;
    }

    ${Fe} {
      background: #1e293b;
      border-color: #334155;
    }

    ${He} {
      color: #64748b;
      border-color: #334155;
    }

    ${fe} {
      color: #e2e8f0;

      &:hover {
        background: #334155;
      }
    }
  }
`;function _e({user:t,environment:e="production",uploadEndpoint:o,fileNameTemplate:r="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:d=2e3,showInProduction:s=false}){let[n,g]=useState(false),[h,R]=useState(false),[w,T]=useState(null),[L,E]=useState(null),[v,I]=useState(null),[M,z]=useState(false),[N,me]=useState(()=>{if(typeof window<"u"){let i=localStorage.getItem("debug-panel-copy-format");if(i&&["json","ecs.json","ai.txt"].includes(i))return i}return "ecs.json"});useEffect(()=>{localStorage.setItem("debug-panel-copy-format",N);},[N]);let W=useRef(null),q=useRef(null),b=useRef(null),{downloadLogs:a,uploadLogs:p,clearLogs:l,getLogs:m,getLogCount:x,getMetadata:S,sessionId:O}=ee({fileNameTemplate:r,environment:e,userId:t?.id||t?.email||"guest",includeMetadata:true,uploadEndpoint:o,maxLogs:d,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),F=x(),C=S();useEffect(()=>{let i=y=>{y.ctrlKey&&y.shiftKey&&y.key==="D"&&(y.preventDefault(),g(_=>!_)),y.key==="Escape"&&n&&(y.preventDefault(),g(false),q.current?.focus());};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[n]),useEffect(()=>{if(C.errorCount>=5&&o){let i=async()=>{try{await p();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",i),()=>window.removeEventListener("error",i)}},[C.errorCount,o,p]);let k=useCallback(async()=>{R(true),T(null);try{let i=await p();i.success?(T({type:"success",message:`Uploaded successfully! ${i.data?JSON.stringify(i.data):""}`}),i.data&&typeof i.data=="object"&&"url"in i.data&&await navigator.clipboard.writeText(String(i.data.url))):T({type:"error",message:`Upload failed: ${i.error}`});}catch(i){T({type:"error",message:`Error: ${i instanceof Error?i.message:"Unknown error"}`});}finally{R(false);}},[p]),A=useCallback(i=>{let y=a(i);y&&T({type:"success",message:`Downloaded: ${y}`});},[a]),ye=useCallback(async()=>{E(null);try{if(!("showDirectoryPicker"in window)){E({type:"error",message:"Feature only supported in Chrome/Edge"});return}await a("json",void 0,{showPicker:!0})&&E({type:"success",message:"Saved to directory"});}catch{E({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[a]),xe=useCallback(async()=>{I(null);try{let i=m(),y=S(),_;if(N==="json")_=JSON.stringify({metadata:y,logs:i},null,2);else if(N==="ecs.json"){let Y=i.map(he=>$(he,y)),Q={metadata:B(y),logs:Y};_=JSON.stringify(Q,null,2);}else if(N==="ai.txt"){let Y=`# METADATA
service.name=${y.environment||"unknown"}
user.id=${y.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,Q=i.map(he=>{let D=$(he,y),Ze=D["@timestamp"],et=D["log.level"],tt=D["event.category"]?.[0]||"unknown",G=`[${Ze}] ${et} ${tt}`;return D.message&&(G+=` | message="${D.message}"`),D.http?.request?.method&&(G+=` | req.method=${D.http.request.method}`),D.url?.full&&(G+=` | url=${D.url.full}`),D.http?.response?.status_code&&(G+=` | res.status=${D.http.response.status_code}`),D.error?.message&&(G+=` | error="${D.error.message}"`),G});_=Y+Q.join(`
`);}else if(N==="jsonl"){let Y=i.map(Q=>$(Q,y));_=ae(Y);}else _=JSON.stringify({metadata:y,logs:i},null,2);await navigator.clipboard.writeText(_),I({type:"success",message:"Copied to clipboard!"});}catch{I({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[m,S,N]);if(useEffect(()=>{if(L){let i=setTimeout(()=>{E(null);},3e3);return ()=>clearTimeout(i)}},[L]),useEffect(()=>{if(v){let i=setTimeout(()=>{I(null);},3e3);return ()=>clearTimeout(i)}},[v]),useEffect(()=>{let i=y=>{if(n&&W.current&&!W.current.contains(y.target)){if(q.current?.contains(y.target))return;g(false),q.current?.focus();}};return document.addEventListener("mousedown",i),()=>document.removeEventListener("mousedown",i)},[n]),!(s||e==="development"||t?.role==="admin"))return null;let Ye=()=>{g(true);},Qe=()=>{g(false),q.current?.focus();};return jsxs(Fragment,{children:[jsxs("button",{ref:q,type:"button",onClick:Ye,className:ke,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",children:[jsx("span",{children:"Debug"}),jsx("span",{className:F>0?C.errorCount>0?Re:de:de,children:F}),C.errorCount>0&&jsxs("span",{className:Re,children:[C.errorCount," err"]})]}),n&&jsxs("div",{ref:W,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:Ee,children:[jsxs("div",{className:Ce,children:[jsxs("div",{className:Xe,children:[jsx("h3",{className:Le,children:"Debug"}),jsxs("p",{className:Ie,children:[O.substring(0,36),"..."]})]}),jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsxs("div",{style:{position:"relative"},children:[jsx("button",{type:"button",onClick:()=>z(!M),className:ue,"aria-label":"Actions and settings","aria-expanded":M,title:"Actions and settings",children:"\u2699\uFE0F"}),M&&jsxs("div",{className:Fe,style:{width:"220px"},children:[jsx("div",{className:He,children:"Copy Format"}),["json","ecs.json","ai.txt"].map(i=>jsxs("button",{type:"button",onClick:()=>{me(i),z(false);},className:`${fe} ${N===i?Ke:""}`,children:[N===i&&"\u2713 ",i==="json"&&"\u{1F4C4} JSON",i==="ecs.json"&&"\u{1F4CB} ECS (AI)",i==="ai.txt"&&"\u{1F916} AI-TXT"]},i)),jsx("div",{style:{borderTop:"1px solid #f3f4f6",margin:"8px 0"}}),jsx("button",{type:"button",onClick:()=>{ye(),z(false);},className:fe,disabled:!("showDirectoryPicker"in window),children:"\u{1F4C1} Save to Folder"})]})]}),jsx("button",{ref:b,type:"button",onClick:Qe,className:ue,"aria-label":"Close debug panel",children:"\u2715"})]})]}),jsxs("div",{className:Ne,children:[jsxs("div",{className:pe,children:[jsx("div",{className:te,children:F}),jsx("div",{className:ge,children:"Logs"})]}),jsxs("div",{className:pe,children:[jsx("div",{className:`${te} ${Ue}`,children:C.errorCount}),jsx("div",{className:ge,children:"Errors"})]}),jsxs("div",{className:pe,children:[jsx("div",{className:`${te} ${Be}`,children:C.networkErrorCount}),jsx("div",{className:ge,children:"Network"})]})]}),jsx("div",{style:{padding:"12px 16px"},children:jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"6px",marginBottom:"8px"},children:[jsx("button",{type:"button",onClick:()=>A("json"),className:j,children:"\u{1F4C4} JSON"}),jsx("button",{type:"button",onClick:()=>A("txt"),className:j,children:"\u{1F4DD} TXT"}),jsx("button",{type:"button",onClick:()=>A("jsonl"),className:j,disabled:F===0,children:"\u{1F4E6} JSONL"}),jsx("button",{type:"button",onClick:()=>A("ecs.json"),className:j,disabled:F===0,children:"\u{1F4CB} ECS"}),jsx("button",{type:"button",onClick:xe,className:j,disabled:F===0,children:"\u{1F4CB} Copy"}),jsx("button",{type:"button",onClick:()=>A("ai.txt"),className:j,disabled:F===0,children:"\u{1F916} AI"}),o?jsx("button",{type:"button",onClick:k,className:j,disabled:h,children:"\u2601\uFE0F Upload"}):jsx("div",{})]})}),jsxs("div",{style:{padding:"0 16px 12px"},children:[w&&jsx("div",{role:"status","aria-live":"polite",className:w.type==="success"?oe:re,children:w.message}),L&&jsx("div",{role:"status","aria-live":"polite",className:L.type==="success"?oe:re,children:L.message}),v&&jsx("div",{role:"status","aria-live":"polite",className:v.type==="success"?oe:re,children:v.message})]}),jsxs("details",{className:De,style:{borderTop:"1px solid #f3f4f6",borderRadius:0},children:[jsx("summary",{className:Te,children:jsx("span",{children:"\u25B8 Session Details"})}),jsxs("div",{className:Oe,children:[jsxs("div",{children:[jsx("strong",{children:"User"}),jsx("span",{children:C.userId||"Anonymous"})]}),jsxs("div",{children:[jsx("strong",{children:"Browser"}),jsxs("span",{children:[C.browser," (",C.platform,")"]})]}),jsxs("div",{children:[jsx("strong",{children:"Screen"}),jsx("span",{children:C.screenResolution})]}),jsxs("div",{children:[jsx("strong",{children:"Timezone"}),jsx("span",{children:C.timezone})]})]})]}),jsx("div",{style:{padding:"8px 16px",display:"flex",justifyContent:"flex-end"},children:!o&&jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs?")&&l();},className:Ge,children:"\u{1F5D1}\uFE0F Clear"})}),jsx("div",{className:$e,children:jsxs("div",{className:Me,children:["Press ",jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})]})]})}function bt({fileNameTemplate:t="debug_{timestamp}"}){let[e,o]=useState(false),{downloadLogs:r,clearLogs:d,getLogCount:s}=ee({fileNameTemplate:t}),n=s();return jsxs(Fragment,{children:[jsx("button",{onClick:()=>o(g=>!g),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsx("span",{children:n})}),e&&jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsx("button",{onClick:()=>r("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsx("button",{onClick:()=>{confirm("Clear all logs?")&&d();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsx("button",{onClick:()=>o(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function ht(t){return useMemo(()=>t.showInProduction||t.environment==="development"||t.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[t.showInProduction,t.environment,t.user])}function wt(){let t=useCallback(o=>{try{typeof window<"u"&&(o?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:o}})));}catch{}},[]),e=useMemo(()=>typeof process<"u"&&true,[]);useEffect(()=>{if(typeof window>"u")return;let o=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>t(true),hide:()=>t(false),toggle:()=>{try{let r=localStorage.getItem("glean-debug-enabled")==="true";t(!r);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=o,()=>{typeof window<"u"&&window.glean===o&&delete window.glean;}},[t,e]);}function We(t){let e=ht(t);return wt(),e?jsx(_e,{...t}):null}export{_e as DebugPanel,bt as DebugPanelMinimal,We as GleanDebugger,Pe as collectMetadata,ve as filterStackTrace,Rt as generateExportFilename,P as generateFilename,ze as generateSessionId,we as getBrowserInfo,se as sanitizeData,U as sanitizeFilename,B as transformMetadataToECS,$ as transformToECS,ee as useLogRecorder};