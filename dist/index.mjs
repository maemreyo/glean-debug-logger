import {forwardRef,useState,useEffect,useRef,useMemo,useCallback}from'react';import {css}from'goober';import {jsxs,jsx,Fragment}from'react/jsx-runtime';// @ts-nocheck
var Lt=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function re(t,e={}){let o=e.keys||Lt;if(!t||typeof t!="object")return t;let n=Array.isArray(t)?[...t]:{...t},a=s=>{if(!s||typeof s!="object")return s;for(let r in s)if(Object.prototype.hasOwnProperty.call(s,r)){let i=r.toLowerCase();o.some(p=>i.includes(p.toLowerCase()))?s[r]="***REDACTED***":s[r]!==null&&typeof s[r]=="object"&&(s[r]=a(s[r]));}return s};return a(n)}function $(t){return t.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function we(){if(typeof navigator>"u")return "unknown";let t=navigator.userAgent;return t.includes("Edg")?"edge":t.includes("Chrome")?"chrome":t.includes("Firefox")?"firefox":t.includes("Safari")?"safari":"unknown"}function Xe(t,e,o,n){if(typeof window>"u")return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:n,errorCount:0,networkErrorCount:0};let a=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",s=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:we(),platform:navigator.platform,language:navigator.language,screenResolution:a,viewport:s,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:n,errorCount:0,networkErrorCount:0}}function Ke(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function F(t="json",e={},o={}){let{fileNameTemplate:n="{env}_{userId}_{sessionId}_{timestamp}",environment:a="development",userId:s="anonymous",sessionId:r="unknown"}=o,i=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],l=new Date().toISOString().split("T")[0],p=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),u=o.browser||we(),f=o.platform||(typeof navigator<"u"?navigator.platform:"unknown"),v=(o.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",y=String(o.errorCount??e.errorCount??0),b=String(o.logCount??e.logCount??0),w=n.replace("{env}",$(a)).replace("{userId}",$(s??"anonymous")).replace("{sessionId}",$(r??"unknown")).replace("{timestamp}",i).replace("{date}",l).replace("{time}",p).replace(/\{errorCount\}/g,y).replace(/\{logCount\}/g,b).replace("{browser}",$(u)).replace("{platform}",$(f)).replace("{url}",$(v));for(let[P,k]of Object.entries(e))w=w.replace(`{${P}}`,String(k));return `${w}.${t}`}function ro(t,e="json"){let o=t.url.split("?")[0]||"unknown";return F(e,{},{environment:t.environment,userId:t.userId,sessionId:t.sessionId,browser:t.browser,platform:t.platform,url:o,errorCount:t.errorCount,logCount:t.logCount})}var Dt={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function Be(t){let e=parseFloat(t);return isNaN(e)?0:Math.round(e*1e6)}function It(t){return Dt[t.toLowerCase()]||"info"}function Se(t){return t.filter(e=>!e.ignored).slice(0,20)}function _(t){return {service:{environment:t.environment},user:t.userId?{id:t.userId}:void 0,host:{name:t.browser,type:t.platform}}}function T(t,e){let o={"@timestamp":t.time,event:{original:t,category:[]}},n=_(e);switch(Object.assign(o,n),t.type){case "CONSOLE":{o.log={level:It(t.level)},o.message=t.data,o.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{o.http={request:{method:t.method}},o.url={full:t.url},o.event.category=["network","web"],o.event.action="request",o.event.id=t.id;break}case "FETCH_RES":case "XHR_RES":{o.http={response:{status_code:t.status}},o.url={full:t.url},o.event.duration=Be(t.duration),o.event.category=["network","web"],o.event.action="response",o.event.id=t.id;break}case "FETCH_ERR":case "XHR_ERR":{o.error={message:t.error},o.url={full:t.url},o.event.duration=Be(t.duration),o.event.category=["network","web"],o.event.action="error",o.event.id=t.id;let a=t;if(typeof a.body=="object"&&a.body!==null){let s=a.body;if(Array.isArray(s.frames)){let r=Se(s.frames);o.error.stack_trace=r.map(i=>`  at ${i.functionName||"?"} (${i.filename||"?"}:${i.lineNumber||0}:${i.columnNumber||0})`).join(`
`);}}break}default:{o.message=JSON.stringify(t);break}}return o}var ne=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let o=this.originalConsole[e];console[e]=(...n)=>{this.callbacks.forEach(a=>{a(e,n);}),o(...n);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var se=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o));}attach(){window.fetch=async(...e)=>{let[o,n]=e,a=o.toString();if(this.excludeUrls.some(r=>r.test(a)))return this.originalFetch(...e);let s=Date.now();this.onRequest.forEach(r=>r(a,n||{}));try{let r=await this.originalFetch(...e),i=Date.now()-s;return this.onResponse.forEach(l=>l(a,r.status,i)),r}catch(r){throw this.onError.forEach(i=>i(a,r)),r}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var ae=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(o,n,a,s,r){let i=typeof n=="string"?n:n.href;if(e.requestTracker.set(this,{method:o,url:i,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(p=>p.test(i)))return e.originalOpen.call(this,o,n,a??true,s,r);let l=e.requestTracker.get(this);for(let p of e.onRequest)p(l);return e.originalOpen.call(this,o,n,a??true,s,r)},this.originalXHR.prototype.send=function(o){let n=e.requestTracker.get(this);if(n){n.body=o;let a=this.onload,s=this.onerror;this.onload=function(r){let i=Date.now()-n.startTime;for(let l of e.onResponse)l(n,this.status,i);a&&a.call(this,r);},this.onerror=function(r){for(let i of e.onError)i(n,new Error("XHR Error"));s&&s.call(this,r);};}return e.originalSend.call(this,o)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var ve={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function W(){return Math.random().toString(36).substring(7)}function ke(t,e){return re(t,{keys:e})}function Ge(t,e,o,n){return {addLog:r=>{t.logsRef.current.push(r),t.logsRef.current.length>e.maxLogs&&t.logsRef.current.shift(),n(t.logsRef.current.length),r.type==="CONSOLE"?r.level==="ERROR"?t.errorCountRef.current++:t.errorCountRef.current=0:r.type==="FETCH_ERR"||r.type==="XHR_ERR"?t.errorCountRef.current++:t.errorCountRef.current=0;let i=e.uploadOnErrorCount??5;if(t.errorCountRef.current>=i&&e.uploadEndpoint){let l={metadata:{...t.metadataRef.current,logCount:t.logsRef.current.length},logs:t.logsRef.current,fileName:F("json",{},{fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.environment,userId:e.userId,sessionId:null})};fetch(e.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:o(l)}).catch(()=>{}),t.errorCountRef.current=0;}if(e.enablePersistence&&typeof window<"u")try{localStorage.setItem(e.persistenceKey,o(t.logsRef.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},updateMetadata:()=>{let r=t.logsRef.current.filter(l=>l.type==="CONSOLE").reduce((l,p)=>p.level==="ERROR"?l+1:l,0),i=t.logsRef.current.filter(l=>l.type==="FETCH_ERR"||l.type==="XHR_ERR").length;t.metadataRef.current={...t.metadataRef.current,logCount:t.logsRef.current.length,errorCount:r,networkErrorCount:i};}}}function Je(){return t=>{let e=new Set;return JSON.stringify(t,(o,n)=>{if(typeof n=="object"&&n!==null){if(e.has(n))return "[Circular]";e.add(n);}return n})}}function Ye(t){return !t||t.length===0?"":t.map(e=>Ft(e)).join("")}function Ft(t){return JSON.stringify(t)+`
`}var z=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,o,n="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let r=await(await(await window.showDirectoryPicker()).getFileHandle(o,{create:!0})).createWritable();await r.write(e),await r.close();}catch(a){if(a.name==="AbortError")return;throw a}}static download(e,o,n="application/json"){let a=new Blob([e],{type:n}),s=URL.createObjectURL(a),r=document.createElement("a");r.href=s,r.download=o,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(s);}static async downloadWithFallback(e,o,n="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,o,n);return}catch(a){if(a.name==="AbortError")return}this.download(e,o,n);}};z.supported=null;function Ve(t,e,o,n){return (a,s)=>{if(typeof window>"u")return null;n();let r={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},i=s||F(a,{},r),l,p;if(a==="json"){let u=e.current?{metadata:e.current,logs:t.current}:t.current;l=o(u),p="application/json";}else if(a==="jsonl"){let u=t.current.map(f=>T(f,e.current));l=Ye(u),p="application/x-ndjson",i=s||F("jsonl",{},r);}else if(a==="ecs.json"){let u={metadata:_(e.current),logs:t.current.map(f=>T(f,e.current))};l=JSON.stringify(u,null,2),p="application/json",i=s||F("ecs-json",{},r);}else if(a==="ai.txt"){let u=e.current,f=`# METADATA
service.name=${u.environment||"unknown"}
user.id=${u.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,D=t.current.map(v=>{let y=T(v,u),b=y["@timestamp"],w=y.log?.level||"info",P=y.event?.category?.[0]||"unknown",k=`[${b}] ${w} ${P}`;return y.message&&(k+=` | message="${y.message}"`),y.http?.request?.method&&(k+=` | req.method=${y.http.request.method}`),y.url?.full&&(k+=` | url=${y.url.full}`),y.http?.response?.status_code&&(k+=` | res.status=${y.http.response.status_code}`),y.error?.message&&(k+=` | error="${y.error.message}"`),k});l=f+D.join(`
`),p="text/plain",i=s||F("ai-txt",{},r);}else l=(e.current?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${o(e.current)}
${"=".repeat(80)}

`:"")+t.current.map(f=>`[${f.time}] ${f.type}
${o(f)}
${"=".repeat(80)}`).join(`
`),p="text/plain";return z.downloadWithFallback(l,i,p),i}}function We(t,e,o,n){return async a=>{let s=a;if(!s)return {success:false,error:"No endpoint configured"};try{n();let r={fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:e.current.environment||"unknown",userId:e.current.userId,sessionId:null},i={metadata:e.current,logs:t.current,fileName:F("json",{},r)},l=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:o(i)});if(!l.ok)throw new Error(`Upload failed: ${l.status}`);return {success:!0,data:await l.json()}}catch(r){let i=r instanceof Error?r.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",r),{success:false,error:i}}}}function Q(t={}){let e={...ve,...t},o=useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});useEffect(()=>{o.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let n=useRef([]),a=useRef(e.sessionId||Ke()),s=useRef(Xe(a.current,e.environment,e.userId,0)),[r,i]=useState(0),l=useRef(0),p=useRef(false),u=useMemo(()=>Je(),[]),f=useMemo(()=>new ne,[]),D=useMemo(()=>new se({excludeUrls:e.excludeUrls}),[e.excludeUrls]),v=useMemo(()=>new ae({excludeUrls:e.excludeUrls}),[e.excludeUrls]),y=useMemo(()=>Ge({logsRef:n,metadataRef:s,errorCountRef:l},{maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount??5,sanitizeKeys:e.sanitizeKeys,environment:e.environment,userId:e.userId},u,i),[e,u,i]),b=y.addLog,w=y.updateMetadata,P=useMemo(()=>Ve(n,s,u,w),[u,w]),k=useMemo(()=>We(n,s,u,w),[u,w]);useEffect(()=>{if(typeof window>"u"||p.current)return;if(p.current=true,e.enablePersistence)try{let m=localStorage.getItem(e.persistenceKey);m&&(n.current=JSON.parse(m),i(n.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let I=[];if(e.captureConsole&&(f.attach(),f.onLog((m,x)=>{let g=x.map(h=>{if(typeof h=="object")try{return u(h)}catch{return String(h)}return String(h)}).join(" ");b({type:"CONSOLE",level:m.toUpperCase(),time:new Date().toISOString(),data:g.substring(0,5e3)});}),I.push(()=>f.detach())),e.captureFetch){let m=new Map;D.onFetchRequest((x,g)=>{let h=W(),R=null;if(g?.body)try{R=typeof g.body=="string"?JSON.parse(g.body):g.body,R=re(R,{keys:e.sanitizeKeys});}catch{R=String(g.body).substring(0,1e3);}m.set(h,{url:x,method:g?.method||"GET",headers:ke(g?.headers,e.sanitizeKeys),body:R}),b({type:"FETCH_REQ",id:h,url:x,method:g?.method||"GET",headers:ke(g?.headers,e.sanitizeKeys),body:R,time:new Date().toISOString()});}),D.onFetchResponse((x,g,h)=>{for(let[R,he]of m.entries())if(he.url===x){m.delete(R),b({type:"FETCH_RES",id:R,url:x,status:g,statusText:"",duration:`${h}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),D.onFetchError((x,g)=>{for(let[h,R]of m.entries())if(R.url===x){m.delete(h),b({type:"FETCH_ERR",id:h,url:x,error:g.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),D.attach(),I.push(()=>D.detach());}return e.captureXHR&&(v.onXHRRequest(m=>{b({type:"XHR_REQ",id:W(),url:m.url,method:m.method,headers:m.headers,body:m.body,time:new Date().toISOString()});}),v.onXHRResponse((m,x,g)=>{b({type:"XHR_RES",id:W(),url:m.url,status:x,statusText:"",duration:`${g}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),v.onXHRError((m,x)=>{b({type:"XHR_ERR",id:W(),url:m.url,error:x.message,duration:"[unknown]ms",time:new Date().toISOString()});}),v.attach(),I.push(()=>v.detach())),()=>{I.forEach(m=>m()),p.current=false;}},[e,b,u,f,D,v]);let X=useCallback(()=>{if(n.current=[],i(0),l.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),ye=useCallback(()=>[...n.current],[]),N=useCallback(()=>r,[r]),xe=useCallback(()=>(w(),{...s.current}),[w]);return {downloadLogs:P,uploadLogs:k,clearLogs:X,getLogs:ye,getLogCount:N,getMetadata:xe,sessionId:a.current}}function tt(){let[t,e]=useState(false),[o,n]=useState(false);useEffect(()=>{n(z.isSupported());},[]);let a=useCallback(()=>{e(i=>!i);},[]),s=useCallback(()=>{e(true);},[]),r=useCallback(()=>{e(false);},[]);return useEffect(()=>{let i=l=>{l.ctrlKey&&l.shiftKey&&l.key==="D"&&(l.preventDefault(),a()),l.key==="Escape"&&t&&(l.preventDefault(),r());};return document.addEventListener("keydown",i),()=>document.removeEventListener("keydown",i)},[t,a,r]),{isOpen:t,toggle:a,open:s,close:r,supportsDirectoryPicker:o}}var ot="debug-panel-copy-format",Nt=["json","ecs.json","ai.txt"];function le(){let[t,e]=useState(()=>{if(typeof window<"u"){let o=localStorage.getItem(ot);if(o&&Nt.includes(o))return o}return "ecs.json"});return useEffect(()=>{localStorage.setItem(ot,t);},[t]),{copyFormat:t,setCopyFormat:e}}function rt(){let[t,e]=useState(null),[o,n]=useState(null),[a,s]=useState(null),[r,i]=useState(false);return useEffect(()=>{if(t){let l=setTimeout(()=>{e(null);},3e3);return ()=>clearTimeout(l)}},[t]),useEffect(()=>{if(o){let l=setTimeout(()=>{n(null);},3e3);return ()=>clearTimeout(l)}},[o]),useEffect(()=>{if(a){let l=setTimeout(()=>{s(null);},3e3);return ()=>clearTimeout(l)}},[a]),{uploadStatus:t,setUploadStatus:e,directoryStatus:o,setDirectoryStatus:n,copyStatus:a,setCopyStatus:s,showSettings:r,setShowSettings:i}}var Ee=css`
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
`,Le=css`
  background: #fee2e2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`,De=css`
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
`,Ie=css`
  background: #fafafa;
  color: #374151;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`,nt=css`
  display: flex;
  gap: 8px;
`,Fe=css`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`,Oe=css`
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
`,Te=css`
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
`,Z=css`
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
`,st=css`
  color: #dc2626;
`,at=css`
  color: #ea580c;
`,Me=css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`,Ne=css`
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
`,Pe=css`
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
`;var Pt=css`
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
`;var Ht=css`
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
`,$t=css`
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
`,_t=css`
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
`,zt=css`
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
`,ee=css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
`,te=css`
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
`,$e=css`
  kbd {
    display: inline-block;
    padding: 2px 6px;
    background: #e5e7eb;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 11px;
    color: #6b7280;
  }
`,_e=css`
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
`,ze=css`
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
`,it=css`
  background: #f3f4f6;
`,E=css`
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
`,lt=css`
  ${E}
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
    ${De} {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    ${Ie} {
      background: #0f172a;
      border-color: #1e293b;
    }

    ${Fe} {
      color: #f1f5f9;
    }

    ${Oe} {
      color: #64748b;
    }

    ${ue} {
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

    ${Z} {
      color: #f1f5f9;
    }

    ${Me} {
      background: #0f172a;
      border-color: #334155;
    }

    ${Ne} {
      color: #e2e8f0;
    }

    ${Pe} {
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

    ${Pt} {
      color: #94a3b8;
    }

    ${Ht} {
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

    ${$t} {
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

    ${_t} {
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

    ${zt} {
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

    ${ee} {
      background: #064e3b;
      color: #6ee7b7;
      border-color: #065f46;
    }

    ${te} {
      background: #7f1d1d;
      color: #fca5a5;
      border-color: #991b1b;
    }

    ${He} {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

    ${$e} kbd {
      background: #334155;
      color: #e2e8f0;
    }

    ${Ee} {
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

    ${_e} {
      background: #1e293b;
      border-color: #334155;
    }

    ${ze} {
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
`;var ct=forwardRef(function({sessionId:e,onClose:o,onSaveToDirectory:n},a){let{copyFormat:s,setCopyFormat:r}=le(),[i,l]=useState(false),p=["json","ecs.json","ai.txt"];return jsxs("div",{className:Ie,children:[jsxs("div",{className:nt,children:[jsx("h3",{className:Fe,children:"Debug"}),jsxs("p",{className:Oe,children:[e.substring(0,36),"..."]})]}),jsxs("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[jsxs("div",{style:{position:"relative"},children:[jsx("button",{type:"button",onClick:()=>l(!i),className:ue,"aria-label":"Actions and settings","aria-expanded":i,title:"Actions and settings",children:"\u2699\uFE0F"}),i&&jsxs("div",{className:_e,style:{width:"220px"},children:[jsx("div",{className:ze,children:"Copy Format"}),p.map(u=>jsxs("button",{type:"button",onClick:()=>{r(u),l(false);},className:`${fe} ${s===u?it:""}`,children:[s===u&&"\u2713 ",u==="json"&&"\u{1F4C4} JSON",u==="ecs.json"&&"\u{1F4CB} ECS (AI)",u==="ai.txt"&&"\u{1F916} AI-TXT"]},u)),jsx("div",{style:{borderTop:"1px solid #f3f4f6",margin:"8px 0"}}),jsx("button",{type:"button",onClick:()=>{n(),l(false);},className:fe,children:"\u{1F4C1} Save to Folder"})]})]}),jsx("button",{ref:a,type:"button",onClick:o,className:ue,"aria-label":"Close debug panel",children:"\u2715"})]})]})});function dt({logCount:t,errorCount:e,networkErrorCount:o}){return jsxs("div",{className:Te,children:[jsxs("div",{className:pe,children:[jsx("div",{className:Z,children:t}),jsx("div",{className:ge,children:"Logs"})]}),jsxs("div",{className:pe,children:[jsx("div",{className:`${Z} ${st}`,children:e}),jsx("div",{className:ge,children:"Errors"})]}),jsxs("div",{className:pe,children:[jsx("div",{className:`${Z} ${at}`,children:o}),jsx("div",{className:ge,children:"Network"})]})]})}function ut({logCount:t,hasUploadEndpoint:e,isUploading:o,getFilteredLogCount:n,onCopyFiltered:a,onDownload:s,onCopy:r,onUpload:i}){return jsx("div",{style:{padding:"12px 16px"},children:jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"6px"},children:[jsx("button",{type:"button",onClick:()=>a("logs"),className:E,disabled:t===0||n("logs")===0,"aria-label":"Copy only console logs",children:"\u{1F4CB} Logs"}),jsx("button",{type:"button",onClick:()=>a("errors"),className:E,disabled:t===0||n("errors")===0,"aria-label":"Copy only errors",children:"\u26A0\uFE0F Errors"}),jsx("button",{type:"button",onClick:()=>a("network"),className:E,disabled:t===0||n("network")===0,"aria-label":"Copy only network requests",children:"\u{1F310} Network"}),jsx("button",{type:"button",onClick:()=>s("json"),className:E,disabled:t===0,children:"\u{1F4C4} JSON"}),jsx("button",{type:"button",onClick:()=>s("txt"),className:E,disabled:t===0,children:"\u{1F4DD} TXT"}),jsx("button",{type:"button",onClick:()=>s("jsonl"),className:E,disabled:t===0,children:"\u{1F4E6} JSONL"}),jsx("button",{type:"button",onClick:()=>s("ecs.json"),className:E,disabled:t===0,children:"\u{1F4CB} ECS"}),jsx("button",{type:"button",onClick:r,className:E,disabled:t===0,children:"\u{1F4CB} Copy"}),jsx("button",{type:"button",onClick:()=>s("ai.txt"),className:E,disabled:t===0,children:"\u{1F916} AI"}),e?jsx("button",{type:"button",onClick:i,className:E,disabled:o,children:"\u2601\uFE0F Upload"}):jsx("div",{})]})})}function pt({uploadStatus:t,directoryStatus:e,copyStatus:o}){return jsxs("div",{style:{padding:"0 16px 12px"},children:[t&&jsx("div",{role:"status","aria-live":"polite",className:t.type==="success"?ee:te,children:t.message}),e&&jsx("div",{role:"status","aria-live":"polite",className:e.type==="success"?ee:te,children:e.message}),o&&jsx("div",{role:"status","aria-live":"polite",className:o.type==="success"?ee:te,children:o.message})]})}function gt({metadata:t}){return jsxs("details",{className:Me,style:{borderTop:"1px solid #f3f4f6",borderRadius:0},children:[jsx("summary",{className:Ne,children:jsx("span",{children:"\u25B8 Session Details"})}),jsxs("div",{className:Pe,children:[jsxs("div",{children:[jsx("strong",{children:"User"}),jsx("span",{children:t.userId||"Anonymous"})]}),jsxs("div",{children:[jsx("strong",{children:"Browser"}),jsxs("span",{children:[t.browser," (",t.platform,")"]})]}),jsxs("div",{children:[jsx("strong",{children:"Screen"}),jsx("span",{children:t.screenResolution})]}),jsxs("div",{children:[jsx("strong",{children:"Timezone"}),jsx("span",{children:t.timezone})]})]})]})}function mt(){return jsx("div",{className:He,children:jsxs("div",{className:$e,children:["Press ",jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})}function xt(t,e){switch(e){case "logs":return t.filter(o=>o.type==="CONSOLE");case "errors":return t.filter(o=>o.type==="CONSOLE"&&o.level==="error");case "network":return t.filter(o=>o.type==="FETCH_REQ"||o.type==="FETCH_RES"||o.type==="XHR_REQ"||o.type==="XHR_RES");case "networkErrors":return t.filter(o=>o.type==="FETCH_ERR"||o.type==="XHR_ERR");default:return t}}function Ue({user:t,environment:e="production",uploadEndpoint:o,fileNameTemplate:n="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:a=2e3,showInProduction:s=false}){let{isOpen:r,open:i,close:l}=tt(),{copyFormat:p}=le(),{uploadStatus:u,setUploadStatus:f,directoryStatus:D,setDirectoryStatus:v,copyStatus:y,setCopyStatus:b}=rt(),w=useRef(null),P=useRef(null),{downloadLogs:k,uploadLogs:X,clearLogs:ye,getLogs:N,getLogCount:xe,getMetadata:I,sessionId:m}=Q({fileNameTemplate:n,environment:e,userId:t?.id||t?.email||"guest",includeMetadata:true,uploadEndpoint:o,maxLogs:a,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),x=xe(),g=I();useEffect(()=>{if(g.errorCount>=5&&o){let d=async()=>{try{await X();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",d),()=>window.removeEventListener("error",d)}},[g.errorCount,o,X]),useEffect(()=>{let d=S=>{r&&w.current&&!w.current.contains(S.target)&&l();};return document.addEventListener("mousedown",d),()=>document.removeEventListener("mousedown",d)},[r,l]);let h=useCallback((d,S)=>{if(p==="json")return JSON.stringify({metadata:S,logs:d},null,2);if(p==="ecs.json"){let H=d.map(B=>T(B,S)),K={metadata:_(S),logs:H};return JSON.stringify(K,null,2)}else if(p==="ai.txt"){let H=`# METADATA
service.name=${S.environment||"unknown"}
user.id=${S.userId||"anonymous"}
timestamp=${new Date().toISOString()}

# LOGS
`,K=d.map(B=>{let C=T(B,S),Ae=C["@timestamp"],qe=C["log.level"],Et=C["event.category"]?.[0]||"unknown",G=`[${Ae}] ${qe} ${Et}`;return C.message&&(G+=` | message="${C.message}"`),C.http?.request?.method&&(G+=` | req.method=${C.http.request.method}`),C.url?.full&&(G+=` | url=${C.url.full}`),C.http?.response?.status_code&&(G+=` | res.status=${C.http.response.status_code}`),C.error?.message&&(G+=` | error="${C.error.message}"`),G});return H+K.join(`
`)}return JSON.stringify({metadata:S,logs:d},null,2)},[p]),R=useCallback(async()=>{f(null);try{let d=await X();d.success?(f({type:"success",message:`Uploaded successfully! ${d.data?JSON.stringify(d.data):""}`}),d.data&&typeof d.data=="object"&&"url"in d.data&&await navigator.clipboard.writeText(String(d.data.url))):f({type:"error",message:`Upload failed: ${d.error}`});}catch(d){f({type:"error",message:`Error: ${d instanceof Error?d.message:"Unknown error"}`});}},[X,f]),he=useCallback(d=>{let S=k(d);S&&f({type:"success",message:`Downloaded: ${S}`});},[k,f]),vt=useCallback(async()=>{v(null);try{await k("json",void 0,{showPicker:!0})&&v({type:"success",message:"Saved to directory"});}catch{v({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[k,v]),kt=useCallback(async()=>{b(null);try{let d=N(),S=I(),H=h(d,S);await navigator.clipboard.writeText(H),b({type:"success",message:"Copied to clipboard!"});}catch{b({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[N,I,h,b]),Ct=useCallback(async d=>{b(null);try{let S=N(),H=I(),K=xt(S,d),B=K.length;if(B===0){b({type:"error",message:{all:"No logs to copy",logs:"No logs to copy",errors:"No errors to copy",network:"No network requests to copy",networkErrors:"No network errors to copy"}[d]});return}let C=h(K,H);await navigator.clipboard.writeText(C),b({type:"success",message:`Copied ${B} ${{all:"all entries",logs:"logs",errors:"errors",network:"network requests",networkErrors:"network errors"}[d]} to clipboard`});}catch{b({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[N,I,h,b]),Rt=useCallback(d=>xt(N(),d).length,[N]);return s||e==="development"||t?.role==="admin"?jsxs(Fragment,{children:[jsxs("button",{type:"button",onClick:i,className:Ee,"aria-label":"Open debug panel (Ctrl+Shift+D)","aria-expanded":r,"aria-controls":"debug-panel",children:[jsx("span",{children:"Debug"}),jsx("span",{className:x>0?g.errorCount>0?Le:de:de,children:x}),g.errorCount>0&&jsxs("span",{className:Le,children:[g.errorCount," err"]})]}),r&&jsxs("div",{ref:w,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:De,children:[jsx(ct,{sessionId:m,onClose:l,onSaveToDirectory:vt,ref:P}),jsx(dt,{logCount:x,errorCount:g.errorCount,networkErrorCount:g.networkErrorCount}),jsx(ut,{logCount:x,hasUploadEndpoint:!!o,isUploading:false,getFilteredLogCount:Rt,onCopyFiltered:Ct,onDownload:he,onCopy:kt,onUpload:R}),jsx(pt,{uploadStatus:u,directoryStatus:D,copyStatus:y}),jsx(gt,{metadata:g}),jsx("div",{style:{padding:"8px 16px",display:"flex",justifyContent:"flex-end"},children:!o&&jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs?")&&ye();},className:lt,children:"\u{1F5D1}\uFE0F Clear"})}),jsx(mt,{})]})]}):null}function Gt({fileNameTemplate:t="debug_{timestamp}"}){let[e,o]=useState(false),{downloadLogs:n,clearLogs:a,getLogCount:s}=Q({fileNameTemplate:t}),r=s();return jsxs(Fragment,{children:[jsx("button",{onClick:()=>o(i=>!i),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsx("span",{children:r})}),e&&jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsx("button",{onClick:()=>n("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsx("button",{onClick:()=>{confirm("Clear all logs?")&&a();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsx("button",{onClick:()=>o(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}function Wt(t){return useMemo(()=>t.showInProduction||t.environment==="development"||t.user?.role==="admin"||(()=>{try{return typeof window<"u"?new URLSearchParams(window.location.search).get("debug")==="true":!1}catch{return  false}})()?true:(()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}})(),[t.showInProduction,t.environment,t.user])}function Qt(){let t=useCallback(o=>{try{typeof window<"u"&&(o?localStorage.setItem("glean-debug-enabled","true"):localStorage.removeItem("glean-debug-enabled"),window.dispatchEvent(new CustomEvent("glean-debug-toggle",{detail:{visible:o}})));}catch{}},[]),e=useMemo(()=>typeof process<"u"&&true,[]);useEffect(()=>{if(typeof window>"u")return;let o=e?{show:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),hide:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),toggle:()=>console.warn("[GleanDebugger] Debug mode is disabled in production"),isEnabled:()=>false}:{show:()=>t(true),hide:()=>t(false),toggle:()=>{try{let n=localStorage.getItem("glean-debug-enabled")==="true";t(!n);}catch{}},isEnabled:()=>{try{return typeof window<"u"?localStorage.getItem("glean-debug-enabled")==="true":!1}catch{return  false}}};if(window.glean!==void 0){console.warn("[GleanDebugger] window.glean already exists. Skipping registration.");return}return window.glean=o,()=>{typeof window<"u"&&window.glean===o&&delete window.glean;}},[t,e]);}function St(t){let e=Wt(t);return Qt(),e?jsx(Ue,{...t}):null}export{Ue as DebugPanel,Gt as DebugPanelMinimal,St as GleanDebugger,Xe as collectMetadata,Se as filterStackTrace,ro as generateExportFilename,F as generateFilename,Ke as generateSessionId,we as getBrowserInfo,re as sanitizeData,$ as sanitizeFilename,_ as transformMetadataToECS,T as transformToECS,Q as useLogRecorder};