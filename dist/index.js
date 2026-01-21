'use strict';var react=require('react'),goober=require('goober'),jsxRuntime=require('react/jsx-runtime');// @ts-nocheck
<<<<<<< HEAD
<<<<<<< HEAD
var Fe=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function K(a,e={}){let o=e.keys||Fe;if(!a||typeof a!="object")return a;let t=Array.isArray(a)?[...a]:{...a},c=i=>{if(!i||typeof i!="object")return i;for(let r in i)if(Object.prototype.hasOwnProperty.call(i,r)){let f=r.toLowerCase();o.some(v=>f.includes(v.toLowerCase()))?i[r]="***REDACTED***":i[r]!==null&&typeof i[r]=="object"&&(i[r]=c(i[r]));}return i};return c(t)}function O(a){return a.replace(/[^a-z0-9_\-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function re(){if(typeof navigator>"u")return "unknown";let a=navigator.userAgent;return a.includes("Edg")?"edge":a.includes("Chrome")?"chrome":a.includes("Firefox")?"firefox":a.includes("Safari")?"safari":"unknown"}function Se(a,e,o,t){if(typeof window>"u")return {sessionId:a,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:t,errorCount:0,networkErrorCount:0};let c=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",i=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:a,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:re(),platform:navigator.platform,language:navigator.language,screenResolution:c,viewport:i,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:t,errorCount:0,networkErrorCount:0}}function ke(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function U(a="json",e={},o={}){let{fileNameTemplate:t="{env}_{userId}_{sessionId}_{timestamp}",environment:c="development",userId:i="anonymous",sessionId:r="unknown"}=o,f=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],h=new Date().toISOString().split("T")[0],v=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),x=o.browser||re(),S=o.platform||(typeof navigator<"u"?navigator.platform:"unknown"),R=(o.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",w=String(o.errorCount??e.errorCount??0),C=String(o.logCount??e.logCount??0),I=t.replace("{env}",O(c)).replace("{userId}",O(i??"anonymous")).replace("{sessionId}",O(r??"unknown")).replace("{timestamp}",f).replace("{date}",h).replace("{time}",v).replace(/\{errorCount\}/g,w).replace(/\{logCount\}/g,C).replace("{browser}",O(x)).replace("{platform}",O(S)).replace("{url}",O(R));for(let[T,F]of Object.entries(e))I=I.replace(`{${T}}`,String(F));return `${I}.${a}`}function We(a,e="json"){let o=a.url.split("?")[0]||"unknown";return U(e,{},{environment:a.environment,userId:a.userId,sessionId:a.sessionId,browser:a.browser,platform:a.platform,url:o,errorCount:a.errorCount,logCount:a.logCount})}var B=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let o=this.originalConsole[e];console[e]=(...t)=>{this.callbacks.forEach(c=>{c(e,t);}),o(...t);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var Y=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o));}attach(){window.fetch=async(...e)=>{let[o,t]=e,c=o.toString();if(this.excludeUrls.some(r=>r.test(c)))return this.originalFetch(...e);let i=Date.now();this.onRequest.forEach(r=>r(c,t||{}));try{let r=await this.originalFetch(...e),f=Date.now()-i;return this.onResponse.forEach(h=>h(c,r.status,f)),r}catch(r){throw this.onError.forEach(f=>f(c,r)),r}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var W=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(o,t,c,i,r){let f=typeof t=="string"?t:t.href;if(e.requestTracker.set(this,{method:o,url:f,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(v=>v.test(f)))return e.originalOpen.call(this,o,t,c??true,i,r);let h=e.requestTracker.get(this);for(let v of e.onRequest)v(h);return e.originalOpen.call(this,o,t,c??true,i,r)},this.originalXHR.prototype.send=function(o){let t=e.requestTracker.get(this);if(t){t.body=o;let c=this.onload,i=this.onerror;this.onload=function(r){let f=Date.now()-t.startTime;for(let h of e.onResponse)h(t,this.status,f);c&&c.call(this,r);},this.onerror=function(r){for(let f of e.onError)f(t,new Error("XHR Error"));i&&i.call(this,r);};}return e.originalSend.call(this,o)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var $=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,o,t="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let r=await(await(await window.showDirectoryPicker()).getFileHandle(o,{create:!0})).createWritable();await r.write(e),await r.close();}catch(c){if(c.name==="AbortError")return;throw c}}static download(e,o,t="application/json"){let c=new Blob([e],{type:t}),i=URL.createObjectURL(c),r=document.createElement("a");r.href=i,r.download=o,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i);}static async downloadWithFallback(e,o,t="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,o,t);return}catch(c){if(c.name==="AbortError")return}this.download(e,o,t);}};$.supported=null;var $e={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function P(a={}){let e={...$e,...a},o=react.useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});react.useEffect(()=>{o.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let t=react.useRef([]),c=react.useRef(e.sessionId||ke()),i=react.useRef(Se(c.current,e.environment,e.userId,0)),[r,f]=react.useState(0),h=react.useRef(0),v=react.useRef(false),x=react.useCallback(m=>{let n=new Set;return JSON.stringify(m,(l,s)=>{if(typeof s=="object"&&s!==null){if(n.has(s))return "[Circular]";n.add(s);}return s})},[]),S=react.useMemo(()=>new B,[]),k=react.useMemo(()=>new Y({excludeUrls:e.excludeUrls}),[e.excludeUrls]),R=react.useMemo(()=>new W({excludeUrls:e.excludeUrls}),[e.excludeUrls]),w=react.useCallback(m=>{let n=o.current;t.current.push(m),t.current.length>n.maxLogs&&t.current.shift(),f(t.current.length),m.type==="CONSOLE"?m.level==="ERROR"?h.current++:h.current=0:m.type==="FETCH_ERR"||m.type==="XHR_ERR"?h.current++:h.current=0;let l=n.uploadOnErrorCount??5;if(h.current>=l&&n.uploadEndpoint){let s={metadata:{...i.current,logCount:t.current.length},logs:t.current,fileName:U("json",{},e)};fetch(n.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:x(s)}).catch(()=>{}),h.current=0;}if(n.enablePersistence&&typeof window<"u")try{localStorage.setItem(n.persistenceKey,x(t.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},[x]),C=react.useCallback(()=>{let m=t.current.filter(l=>l.type==="CONSOLE").reduce((l,s)=>s.level==="ERROR"?l+1:l,0),n=t.current.filter(l=>l.type==="FETCH_ERR"||l.type==="XHR_ERR").length;i.current={...i.current,logCount:t.current.length,errorCount:m,networkErrorCount:n};},[]);react.useEffect(()=>{if(typeof window>"u"||v.current)return;if(v.current=true,e.enablePersistence)try{let n=localStorage.getItem(e.persistenceKey);n&&(t.current=JSON.parse(n),f(t.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let m=[];if(e.captureConsole&&(S.attach(),S.onLog((n,l)=>{let s=l.map(b=>{if(typeof b=="object")try{return x(b)}catch{return String(b)}return String(b)}).join(" ");w({type:"CONSOLE",level:n.toUpperCase(),time:new Date().toISOString(),data:s.substring(0,5e3)});}),m.push(()=>S.detach())),e.captureFetch){let n=new Map;k.onFetchRequest((l,s)=>{let b=Math.random().toString(36).substring(7),p=null;if(s?.body)try{p=typeof s.body=="string"?JSON.parse(s.body):s.body,p=K(p,{keys:e.sanitizeKeys});}catch{p=String(s.body).substring(0,1e3);}n.set(b,{url:l,method:s?.method||"GET",headers:K(s?.headers,{keys:e.sanitizeKeys}),body:p}),w({type:"FETCH_REQ",id:b,url:l,method:s?.method||"GET",headers:K(s?.headers,{keys:e.sanitizeKeys}),body:p,time:new Date().toISOString()});}),k.onFetchResponse((l,s,b)=>{for(let[p,N]of n.entries())if(N.url===l){n.delete(p),w({type:"FETCH_RES",id:p,url:l,status:s,statusText:"",duration:`${b}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),k.onFetchError((l,s)=>{for(let[b,p]of n.entries())if(p.url===l){n.delete(b),w({type:"FETCH_ERR",id:b,url:l,error:s.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),k.attach(),m.push(()=>k.detach());}return e.captureXHR&&(R.onXHRRequest(n=>{w({type:"XHR_REQ",id:Math.random().toString(36).substring(7),url:n.url,method:n.method,headers:n.headers,body:n.body,time:new Date().toISOString()});}),R.onXHRResponse((n,l,s)=>{w({type:"XHR_RES",id:Math.random().toString(36).substring(7),url:n.url,status:l,statusText:"",duration:`${s}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),R.onXHRError((n,l)=>{w({type:"XHR_ERR",id:Math.random().toString(36).substring(7),url:n.url,error:l.message,duration:"[unknown]ms",time:new Date().toISOString()});}),R.attach(),m.push(()=>R.detach())),()=>{m.forEach(n=>n()),v.current=false;}},[e,w,x,S,k,R]);let I=react.useCallback((m="json",n)=>{if(typeof window>"u")return null;C();let l=n||U(m,{},e),s,b;if(m==="json"){let p=e.includeMetadata?{metadata:i.current,logs:t.current}:t.current;s=x(p),b="application/json";}else s=(e.includeMetadata?`${"=".repeat(80)}
METADATA
${"=".repeat(80)}
${x(i.current)}
${"=".repeat(80)}

`:"")+t.current.map(N=>`[${N.time}] ${N.type}
${x(N)}
${"=".repeat(80)}`).join(`
`),b="text/plain";return $.downloadWithFallback(s,l,b),l},[e,x,C]),T=react.useCallback(async m=>{let n=m||e.uploadEndpoint;if(!n)return {success:false,error:"No endpoint configured"};try{C();let l={metadata:i.current,logs:t.current,fileName:U("json",{},e)},s=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:x(l)});if(!s.ok)throw new Error(`Upload failed: ${s.status}`);return {success:!0,data:await s.json()}}catch(l){let s=l instanceof Error?l.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",l),{success:false,error:s}}},[e.uploadEndpoint,x,C]),F=react.useCallback(()=>{if(t.current=[],f(0),h.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),D=react.useCallback(()=>[...t.current],[]),H=react.useCallback(()=>r,[r]),te=react.useCallback(()=>(C(),{...i.current}),[C]);return {downloadLogs:I,uploadLogs:T,clearLogs:F,getLogs:D,getLogCount:H,getMetadata:te,sessionId:c.current}}var se=goober.css`
=======
var Pe=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function Y(t,e={}){let o=e.keys||Pe;if(!t||typeof t!="object")return t;let r=Array.isArray(t)?[...t]:{...t},l=s=>{if(!s||typeof s!="object")return s;for(let n in s)if(Object.prototype.hasOwnProperty.call(s,n)){let g=n.toLowerCase();o.some(k=>g.includes(k.toLowerCase()))?s[n]="***REDACTED***":s[n]!==null&&typeof s[n]=="object"&&(s[n]=l(s[n]));}return s};return l(r)}function H(t){return t.replace(/[^a-z0-9_\-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function ue(){if(typeof navigator>"u")return "unknown";let t=navigator.userAgent;return t.includes("Edg")?"edge":t.includes("Chrome")?"chrome":t.includes("Firefox")?"firefox":t.includes("Safari")?"safari":"unknown"}function Ie(t,e,o,r){if(typeof window>"u")return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:r,errorCount:0,networkErrorCount:0};let l=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",s=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:ue(),platform:navigator.platform,language:navigator.language,screenResolution:l,viewport:s,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:r,errorCount:0,networkErrorCount:0}}function De(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function D(t="json",e={},o={}){let{fileNameTemplate:r="{env}_{userId}_{sessionId}_{timestamp}",environment:l="development",userId:s="anonymous",sessionId:n="unknown"}=o,g=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],h=new Date().toISOString().split("T")[0],k=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),w=o.browser||ue(),L=o.platform||(typeof navigator<"u"?navigator.platform:"unknown"),R=(o.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",v=String(o.errorCount??e.errorCount??0),T=String(o.logCount??e.logCount??0),M=r.replace("{env}",H(l)).replace("{userId}",H(s??"anonymous")).replace("{sessionId}",H(n??"unknown")).replace("{timestamp}",g).replace("{date}",h).replace("{time}",k).replace(/\{errorCount\}/g,v).replace(/\{logCount\}/g,T).replace("{browser}",H(w)).replace("{platform}",H(L)).replace("{url}",H(R));for(let[F,q]of Object.entries(e))M=M.replace(`{${F}}`,String(q));return `${M}.${t}`}function ot(t,e="json"){let o=t.url.split("?")[0]||"unknown";return D(e,{},{environment:t.environment,userId:t.userId,sessionId:t.sessionId,browser:t.browser,platform:t.platform,url:o,errorCount:t.errorCount,logCount:t.logCount})}var je={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function Me(t){let e=parseFloat(t);return isNaN(e)?0:Math.round(e*1e6)}function Ae(t){return je[t.toLowerCase()]||"info"}function pe(t){return t.filter(e=>!e.ignored).slice(0,20)}function U(t){return {service:{environment:t.environment},user:t.userId?{id:t.userId}:void 0,host:{name:t.browser,type:t.platform}}}function z(t,e){let o={"@timestamp":t.time,event:{original:t,category:[]}},r=U(e);switch(Object.assign(o,r),t.type){case "CONSOLE":{o.log={level:Ae(t.level)},o.message=t.data,o.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{o.http={request:{method:t.method}},o.url={full:t.url},o.event.category=["network","web"],o.event.action="request",o.event.id=t.id;break}case "FETCH_RES":case "XHR_RES":{o.http={response:{status_code:t.status}},o.url={full:t.url},o.event.duration=Me(t.duration),o.event.category=["network","web"],o.event.action="response",o.event.id=t.id;break}case "FETCH_ERR":case "XHR_ERR":{o.error={message:t.error},o.url={full:t.url},o.event.duration=Me(t.duration),o.event.category=["network","web"],o.event.action="error",o.event.id=t.id;let l=t;if(typeof l.body=="object"&&l.body!==null){let s=l.body;if(Array.isArray(s.frames)){let n=pe(s.frames);o.error.stack_trace=n.map(g=>`  at ${g.functionName||"?"} (${g.filename||"?"}:${g.lineNumber||0}:${g.columnNumber||0})`).join(`
=======
var Pe=["password","token","apiKey","secret","authorization","creditCard","cardNumber","cvv","ssn"];function Y(t,e={}){let o=e.keys||Pe;if(!t||typeof t!="object")return t;let r=Array.isArray(t)?[...t]:{...t},l=s=>{if(!s||typeof s!="object")return s;for(let n in s)if(Object.prototype.hasOwnProperty.call(s,n)){let g=n.toLowerCase();o.some(k=>g.includes(k.toLowerCase()))?s[n]="***REDACTED***":s[n]!==null&&typeof s[n]=="object"&&(s[n]=l(s[n]));}return s};return l(r)}function H(t){return t.replace(/[^a-z0-9_-]/gi,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function ue(){if(typeof navigator>"u")return "unknown";let t=navigator.userAgent;return t.includes("Edg")?"edge":t.includes("Chrome")?"chrome":t.includes("Firefox")?"firefox":t.includes("Safari")?"safari":"unknown"}function Ie(t,e,o,r){if(typeof window>"u")return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:"",browser:"unknown",platform:"",language:"",screenResolution:"0x0",viewport:"0x0",url:"",referrer:"",timezone:"",logCount:r,errorCount:0,networkErrorCount:0};let l=typeof window.screen<"u"?`${window.screen.width}x${window.screen.height}`:"0x0",s=typeof window.innerWidth<"u"&&typeof window.innerHeight<"u"?`${window.innerWidth}x${window.innerHeight}`:"0x0";return {sessionId:t,environment:e,userId:o,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,browser:ue(),platform:navigator.platform,language:navigator.language,screenResolution:l,viewport:s,url:window.location.href,referrer:document.referrer,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,logCount:r,errorCount:0,networkErrorCount:0}}function De(){return `session_${Date.now()}_${Math.random().toString(36).substring(2,11)}`}function D(t="json",e={},o={}){let{fileNameTemplate:r="{env}_{userId}_{sessionId}_{timestamp}",environment:l="development",userId:s="anonymous",sessionId:n="unknown"}=o,g=new Date().toISOString().replace(/[:.]/g,"-").split(".")[0],h=new Date().toISOString().split("T")[0],k=new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,"-"),w=o.browser||ue(),L=o.platform||(typeof navigator<"u"?navigator.platform:"unknown"),R=(o.url||(typeof window<"u"?window.location.pathname.replace(/\//g,"_"):"unknown")).split("?")[0]||"unknown",v=String(o.errorCount??e.errorCount??0),T=String(o.logCount??e.logCount??0),M=r.replace("{env}",H(l)).replace("{userId}",H(s??"anonymous")).replace("{sessionId}",H(n??"unknown")).replace("{timestamp}",g).replace("{date}",h).replace("{time}",k).replace(/\{errorCount\}/g,v).replace(/\{logCount\}/g,T).replace("{browser}",H(w)).replace("{platform}",H(L)).replace("{url}",H(R));for(let[F,q]of Object.entries(e))M=M.replace(`{${F}}`,String(q));return `${M}.${t}`}function ot(t,e="json"){let o=t.url.split("?")[0]||"unknown";return D(e,{},{environment:t.environment,userId:t.userId,sessionId:t.sessionId,browser:t.browser,platform:t.platform,url:o,errorCount:t.errorCount,logCount:t.logCount})}var je={log:"info",info:"info",warn:"warn",error:"error",debug:"debug"};function Me(t){let e=parseFloat(t);return isNaN(e)?0:Math.round(e*1e6)}function Ae(t){return je[t.toLowerCase()]||"info"}function pe(t){return t.filter(e=>!e.ignored).slice(0,20)}function U(t){return {service:{environment:t.environment},user:t.userId?{id:t.userId}:void 0,host:{name:t.browser,type:t.platform}}}function z(t,e){let o={"@timestamp":t.time,event:{original:t,category:[]}},r=U(e);switch(Object.assign(o,r),t.type){case "CONSOLE":{o.log={level:Ae(t.level)},o.message=t.data,o.event.category=["console"];break}case "FETCH_REQ":case "XHR_REQ":{o.http={request:{method:t.method}},o.url={full:t.url},o.event.category=["network","web"],o.event.action="request",o.event.id=t.id;break}case "FETCH_RES":case "XHR_RES":{o.http={response:{status_code:t.status}},o.url={full:t.url},o.event.duration=Me(t.duration),o.event.category=["network","web"],o.event.action="response",o.event.id=t.id;break}case "FETCH_ERR":case "XHR_ERR":{o.error={message:t.error},o.url={full:t.url},o.event.duration=Me(t.duration),o.event.category=["network","web"],o.event.action="error",o.event.id=t.id;let l=t;if(typeof l.body=="object"&&l.body!==null){let s=l.body;if(Array.isArray(s.frames)){let n=pe(s.frames);o.error.stack_trace=n.map(g=>`  at ${g.functionName||"?"} (${g.filename||"?"}:${g.lineNumber||0}:${g.columnNumber||0})`).join(`
>>>>>>> b1cbfd9 (fix: correct regex pattern in sanitizeFilename function)
`);}}break}default:{o.message=JSON.stringify(t);break}}return o}function Fe(t){return !t||t.length===0?"":t.map(e=>Ke(e)).join("")}function Ke(t){return JSON.stringify(t)+`
`}var V=class{constructor(){this.originalConsole={log:console.log.bind(console),error:console.error.bind(console),warn:console.warn.bind(console),info:console.info.bind(console),debug:console.debug.bind(console)},this.callbacks=[];}attach(){Object.keys(this.originalConsole).forEach(e=>{let o=this.originalConsole[e];console[e]=(...r)=>{this.callbacks.forEach(l=>{l(e,r);}),o(...r);};});}detach(){Object.keys(this.originalConsole).forEach(e=>{console[e]=this.originalConsole[e];});}onLog(e){this.callbacks.push(e);}};var G=class{constructor(e={}){this.originalFetch=window.fetch.bind(window),this.onRequest=[],this.onResponse=[],this.onError=[],this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o));}attach(){window.fetch=async(...e)=>{let[o,r]=e,l=o.toString();if(this.excludeUrls.some(n=>n.test(l)))return this.originalFetch(...e);let s=Date.now();this.onRequest.forEach(n=>n(l,r||{}));try{let n=await this.originalFetch(...e),g=Date.now()-s;return this.onResponse.forEach(h=>h(l,n.status,g)),n}catch(n){throw this.onError.forEach(g=>g(l,n)),n}};}detach(){window.fetch=this.originalFetch;}onFetchRequest(e){this.onRequest.push(e);}onFetchResponse(e){this.onResponse.push(e);}onFetchError(e){this.onError.push(e);}};var Q=class{constructor(e={}){this.isAttached=false;this.originalXHR=window.XMLHttpRequest,this.onRequest=[],this.onResponse=[],this.onError=[],this.requestTracker=new WeakMap,this.excludeUrls=(e.excludeUrls||[]).map(o=>new RegExp(o)),this.originalOpen=this.originalXHR.prototype.open,this.originalSend=this.originalXHR.prototype.send;}attach(){if(this.isAttached)return;this.isAttached=true;let e=this;this.originalXHR.prototype.open=function(o,r,l,s,n){let g=typeof r=="string"?r:r.href;if(e.requestTracker.set(this,{method:o,url:g,headers:{},body:null,startTime:Date.now()}),e.excludeUrls.some(k=>k.test(g)))return e.originalOpen.call(this,o,r,l??true,s,n);let h=e.requestTracker.get(this);for(let k of e.onRequest)k(h);return e.originalOpen.call(this,o,r,l??true,s,n)},this.originalXHR.prototype.send=function(o){let r=e.requestTracker.get(this);if(r){r.body=o;let l=this.onload,s=this.onerror;this.onload=function(n){let g=Date.now()-r.startTime;for(let h of e.onResponse)h(r,this.status,g);l&&l.call(this,n);},this.onerror=function(n){for(let g of e.onError)g(r,new Error("XHR Error"));s&&s.call(this,n);};}return e.originalSend.call(this,o)};}detach(){this.isAttached&&(this.isAttached=false,this.originalXHR.prototype.open=this.originalOpen,this.originalXHR.prototype.send=this.originalSend);}onXHRRequest(e){this.onRequest.push(e);}onXHRResponse(e){this.onResponse.push(e);}onXHRError(e){this.onError.push(e);}};var P=class{static isSupported(){return this.supported===null&&(this.supported=typeof window<"u"&&"showDirectoryPicker"in window),this.supported}static async saveToDirectory(e,o,r="application/json"){if(!this.isSupported())throw new Error("File System Access API not supported");try{let n=await(await(await window.showDirectoryPicker()).getFileHandle(o,{create:!0})).createWritable();await n.write(e),await n.close();}catch(l){if(l.name==="AbortError")return;throw l}}static download(e,o,r="application/json"){let l=new Blob([e],{type:r}),s=URL.createObjectURL(l),n=document.createElement("a");n.href=s,n.download=o,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(s);}static async downloadWithFallback(e,o,r="application/json"){if(this.isSupported())try{await this.saveToDirectory(e,o,r);return}catch(l){if(l.name==="AbortError")return}this.download(e,o,r);}};P.supported=null;var Je={maxLogs:1e3,enablePersistence:true,persistenceKey:"debug_logs",captureConsole:true,captureFetch:true,captureXHR:true,enableDirectoryPicker:false,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:[],fileNameTemplate:"{env}_{userId}_{sessionId}_{timestamp}",environment:"development",userId:null,sessionId:null,includeMetadata:true,uploadEndpoint:null,uploadOnError:false,uploadOnErrorCount:5};function j(t={}){let e={...Je,...t},o=react.useRef({maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount});react.useEffect(()=>{o.current={maxLogs:e.maxLogs,enablePersistence:e.enablePersistence,persistenceKey:e.persistenceKey,captureConsole:e.captureConsole,captureFetch:e.captureFetch,captureXHR:e.captureXHR,sanitizeKeys:e.sanitizeKeys,includeMetadata:e.includeMetadata,uploadEndpoint:e.uploadEndpoint,uploadOnErrorCount:e.uploadOnErrorCount};},[e]);let r=react.useRef([]),l=react.useRef(e.sessionId||De()),s=react.useRef(Ie(l.current,e.environment,e.userId,0)),[n,g]=react.useState(0),h=react.useRef(0),k=react.useRef(false),w=react.useCallback(m=>{let a=new Set;return JSON.stringify(m,(c,i)=>{if(typeof i=="object"&&i!==null){if(a.has(i))return "[Circular]";a.add(i);}return i})},[]),L=react.useMemo(()=>new V,[]),N=react.useMemo(()=>new G({excludeUrls:e.excludeUrls}),[e.excludeUrls]),R=react.useMemo(()=>new Q({excludeUrls:e.excludeUrls}),[e.excludeUrls]),v=react.useCallback(m=>{let a=o.current;r.current.push(m),r.current.length>a.maxLogs&&r.current.shift(),g(r.current.length),m.type==="CONSOLE"?m.level==="ERROR"?h.current++:h.current=0:m.type==="FETCH_ERR"||m.type==="XHR_ERR"?h.current++:h.current=0;let c=a.uploadOnErrorCount??5;if(h.current>=c&&a.uploadEndpoint){let i={metadata:{...s.current,logCount:r.current.length},logs:r.current,fileName:D("json",{},e)};fetch(a.uploadEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:w(i)}).catch(()=>{}),h.current=0;}if(a.enablePersistence&&typeof window<"u")try{localStorage.setItem(a.persistenceKey,w(r.current));}catch{console.warn("[useLogRecorder] Failed to persist logs");}},[w]),T=react.useCallback(()=>{let m=r.current.filter(c=>c.type==="CONSOLE").reduce((c,i)=>i.level==="ERROR"?c+1:c,0),a=r.current.filter(c=>c.type==="FETCH_ERR"||c.type==="XHR_ERR").length;s.current={...s.current,logCount:r.current.length,errorCount:m,networkErrorCount:a};},[]);react.useEffect(()=>{if(typeof window>"u"||k.current)return;if(k.current=true,e.enablePersistence)try{let a=localStorage.getItem(e.persistenceKey);a&&(r.current=JSON.parse(a),g(r.current.length));}catch{console.warn("[useLogRecorder] Failed to load persisted logs");}let m=[];if(e.captureConsole&&(L.attach(),L.onLog((a,c)=>{let i=c.map(f=>{if(typeof f=="object")try{return w(f)}catch{return String(f)}return String(f)}).join(" ");v({type:"CONSOLE",level:a.toUpperCase(),time:new Date().toISOString(),data:i.substring(0,5e3)});}),m.push(()=>L.detach())),e.captureFetch){let a=new Map;N.onFetchRequest((c,i)=>{let f=Math.random().toString(36).substring(7),u=null;if(i?.body)try{u=typeof i.body=="string"?JSON.parse(i.body):i.body,u=Y(u,{keys:e.sanitizeKeys});}catch{u=String(i.body).substring(0,1e3);}a.set(f,{url:c,method:i?.method||"GET",headers:Y(i?.headers,{keys:e.sanitizeKeys}),body:u}),v({type:"FETCH_REQ",id:f,url:c,method:i?.method||"GET",headers:Y(i?.headers,{keys:e.sanitizeKeys}),body:u,time:new Date().toISOString()});}),N.onFetchResponse((c,i,f)=>{for(let[u,E]of a.entries())if(E.url===c){a.delete(u),v({type:"FETCH_RES",id:u,url:c,status:i,statusText:"",duration:`${f}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});break}}),N.onFetchError((c,i)=>{for(let[f,u]of a.entries())if(u.url===c){a.delete(f),v({type:"FETCH_ERR",id:f,url:c,error:i.toString(),duration:"[unknown]ms",time:new Date().toISOString()});break}}),N.attach(),m.push(()=>N.detach());}return e.captureXHR&&(R.onXHRRequest(a=>{v({type:"XHR_REQ",id:Math.random().toString(36).substring(7),url:a.url,method:a.method,headers:a.headers,body:a.body,time:new Date().toISOString()});}),R.onXHRResponse((a,c,i)=>{v({type:"XHR_RES",id:Math.random().toString(36).substring(7),url:a.url,status:c,statusText:"",duration:`${i}ms`,body:"[Response captured by interceptor]",time:new Date().toISOString()});}),R.onXHRError((a,c)=>{v({type:"XHR_ERR",id:Math.random().toString(36).substring(7),url:a.url,error:c.message,duration:"[unknown]ms",time:new Date().toISOString()});}),R.attach(),m.push(()=>R.detach())),()=>{m.forEach(a=>a()),k.current=false;}},[e,v,w,L,N,R]);let M=react.useCallback((m,a,c)=>{if(typeof window>"u")return null;T();let i=a||D(m,{},e),f,u;if(m==="json"){let E=e.includeMetadata?{metadata:s.current,logs:r.current}:r.current;f=w(E),u="application/json";}else if(m==="jsonl"){let E=r.current.map(S=>z(S,s.current));f=Fe(E),u="application/x-ndjson",i=a||D("jsonl",{},e);}else if(m==="ecs.json"){let E={metadata:U(s.current),logs:r.current.map(S=>z(S,s.current))};f=JSON.stringify(E,null,2),u="application/json",i=a||D("ecs-json",{},e);}else if(m==="ai.txt"){let E=s.current,S=`# METADATA
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
`),u="text/plain";return P.downloadWithFallback(f,i,u),i},[e,w,T]),F=react.useCallback(async m=>{let a=m||e.uploadEndpoint;if(!a)return {success:false,error:"No endpoint configured"};try{T();let c={metadata:s.current,logs:r.current,fileName:D("json",{},e)},i=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:w(c)});if(!i.ok)throw new Error(`Upload failed: ${i.status}`);return {success:!0,data:await i.json()}}catch(c){let i=c instanceof Error?c.message:"Unknown error";return console.error("[useLogRecorder] Failed to upload logs:",c),{success:false,error:i}}},[e.uploadEndpoint,w,T]),q=react.useCallback(()=>{if(r.current=[],g(0),h.current=0,e.enablePersistence&&typeof window<"u")try{localStorage.removeItem(e.persistenceKey);}catch{console.warn("[useLogRecorder] Failed to clear persisted logs");}},[e.enablePersistence,e.persistenceKey]),$=react.useCallback(()=>[...r.current],[]),_=react.useCallback(()=>n,[n]),se=react.useCallback(()=>(T(),{...s.current}),[T]);return {downloadLogs:M,uploadLogs:F,clearLogs:q,getLogs:$,getLogCount:_,getMetadata:se,sessionId:l.current}}var fe=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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
<<<<<<< HEAD
`,J=goober.css`
=======
`,Z=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  background: #e5e7eb;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
<<<<<<< HEAD
`,ae=goober.css`
=======
`,be=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  background: #fee2e2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
<<<<<<< HEAD
`,ie=goober.css`
=======
`,me=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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
<<<<<<< HEAD
`,le=goober.css`
=======
`,ye=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  background: #fafafa;
  color: #374151;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
<<<<<<< HEAD
`,Ee=goober.css`
  display: flex;
  gap: 8px;
`,ce=goober.css`
=======
`,$e=goober.css`
  display: flex;
  gap: 8px;
`,he=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
<<<<<<< HEAD
`,de=goober.css`
=======
`,xe=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  margin: 2px 0 0;
  font-size: 11px;
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
<<<<<<< HEAD
`,ue=goober.css`
=======
`,we=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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
<<<<<<< HEAD
`,pe=goober.css`
=======
`,ve=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 0;
  background: #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`,ee=goober.css`
  text-align: center;
  background: #fff;
  padding: 10px 8px;
`,A=goober.css`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
<<<<<<< HEAD
`,V=goober.css`
=======
`,te=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
<<<<<<< HEAD
`,Le=goober.css`
  color: #dc2626;
`,Ie=goober.css`
  color: #ea580c;
`,ge=goober.css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`,fe=goober.css`
=======
`,_e=goober.css`
  color: #dc2626;
`,ze=goober.css`
  color: #ea580c;
`,Se=goober.css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`,ke=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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
<<<<<<< HEAD
`,be=goober.css`
=======
`,Re=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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
<<<<<<< HEAD
`,Te=goober.css`
=======
`,Xe=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
<<<<<<< HEAD
`,Q=goober.css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,me=goober.css`
=======
`,oe=goober.css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,Ee=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
<<<<<<< HEAD
`,Ne=goober.css`
=======
`,qe=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`,I=goober.css`
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
<<<<<<< HEAD
`,Pe=goober.css`
=======
`,We=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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
<<<<<<< HEAD
`,ye=goober.css`
=======
`,Ce=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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
<<<<<<< HEAD
`,he=goober.css`
=======
`,Le=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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
<<<<<<< HEAD
`,X=goober.css`
=======
`,K=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
<<<<<<< HEAD
`,_=goober.css`
=======
`,B=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
<<<<<<< HEAD
`,xe=goober.css`
=======
`,Ne=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
  padding: 12px 16px;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #9ca3af;
<<<<<<< HEAD
`,we=goober.css`
=======
`,Te=goober.css`
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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
<<<<<<< HEAD
    ${ie} {
=======
    ${me} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

<<<<<<< HEAD
    ${le} {
=======
    ${ye} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      background: #0f172a;
      border-color: #1e293b;
    }

<<<<<<< HEAD
    ${ce} {
      color: #f1f5f9;
    }

    ${de} {
      color: #64748b;
    }

    ${ue} {
=======
    ${he} {
      color: #f1f5f9;
    }

    ${xe} {
      color: #64748b;
    }

    ${we} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      color: #64748b;

      &:hover {
        background: #1e293b;
        color: #94a3b8;
      }
    }

<<<<<<< HEAD
    ${pe} {
=======
    ${ve} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      background: #0f172a;
      border-color: #334155;
    }

    ${A} {
      color: #f1f5f9;
    }

<<<<<<< HEAD
    ${ge} {
=======
    ${Se} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      background: #0f172a;
      border-color: #334155;
    }

<<<<<<< HEAD
    ${fe} {
      color: #e2e8f0;
    }

    ${be} {
=======
    ${ke} {
      color: #e2e8f0;
    }

    ${Re} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

<<<<<<< HEAD
    ${me} {
=======
    ${Ee} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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

<<<<<<< HEAD
    ${Pe} {
=======
    ${We} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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

<<<<<<< HEAD
    ${ye} {
=======
    ${Ce} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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

<<<<<<< HEAD
    ${he} {
=======
    ${Le} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
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

<<<<<<< HEAD
    ${X} {
=======
    ${K} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      background: #064e3b;
      color: #6ee7b7;
      border-color: #065f46;
    }

<<<<<<< HEAD
    ${_} {
=======
    ${B} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      background: #7f1d1d;
      color: #fca5a5;
      border-color: #991b1b;
    }

<<<<<<< HEAD
    ${xe} {
=======
    ${Ne} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

<<<<<<< HEAD
    ${we} kbd {
=======
    ${Te} kbd {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      background: #334155;
      color: #e2e8f0;
    }

<<<<<<< HEAD
    ${se} {
=======
    ${fe} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &:hover {
        background: #334155;
        border-color: #475569;
      }
    }

<<<<<<< HEAD
    ${J} {
=======
    ${Z} {
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
      background: #334155;
      color: #94a3b8;
    }
  }
<<<<<<< HEAD
`;function qe({user:a,environment:e="production",uploadEndpoint:o,fileNameTemplate:t="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:c=2e3,showInProduction:i=false}){let[r,f]=react.useState(false),[h,v]=react.useState(false),[x,S]=react.useState(null),[k,R]=react.useState(null),[w,C]=react.useState(null),I=react.useRef(null),T=react.useRef(null),F=react.useRef(null),{downloadLogs:D,uploadLogs:H,clearLogs:te,getLogs:m,getLogCount:n,getMetadata:l,sessionId:s}=P({fileNameTemplate:t,environment:e,userId:a?.id||a?.email||"guest",includeMetadata:true,uploadEndpoint:o,maxLogs:c,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),b=n(),p=l();react.useEffect(()=>{let g=E=>{E.ctrlKey&&E.shiftKey&&E.key==="D"&&(E.preventDefault(),f(oe=>!oe)),E.key==="Escape"&&r&&(E.preventDefault(),f(false),T.current?.focus());};return window.addEventListener("keydown",g),()=>window.removeEventListener("keydown",g)},[r]),react.useEffect(()=>{if(p.errorCount>=5&&o){let g=async()=>{try{await H();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",g),()=>window.removeEventListener("error",g)}},[p.errorCount,o,H]);let N=react.useCallback(async()=>{v(true),S(null);try{let g=await H();g.success?(S({type:"success",message:`Uploaded successfully! ${g.data?JSON.stringify(g.data):""}`}),g.data&&typeof g.data=="object"&&"url"in g.data&&await navigator.clipboard.writeText(String(g.data.url))):S({type:"error",message:`Upload failed: ${g.error}`});}catch(g){S({type:"error",message:`Error: ${g instanceof Error?g.message:"Unknown error"}`});}finally{v(false);}},[H]),Re=react.useCallback(g=>{let E=D(g);E&&S({type:"success",message:`Downloaded: ${E}`});},[D]),De=react.useCallback(async()=>{R(null);try{if(!("showDirectoryPicker"in window)){R({type:"error",message:"Feature only supported in Chrome/Edge"});return}await D("json",void 0,{showPicker:!0})&&R({type:"success",message:"Saved to directory"});}catch{R({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[D]),He=react.useCallback(async()=>{C(null);try{let g=m(),E=l(),oe=JSON.stringify({metadata:E,logs:g},null,2);await navigator.clipboard.writeText(oe),C({type:"success",message:"Copied to clipboard!"});}catch{C({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[m,l]);if(react.useEffect(()=>{if(k){let g=setTimeout(()=>{R(null);},3e3);return ()=>clearTimeout(g)}},[k]),react.useEffect(()=>{if(w){let g=setTimeout(()=>{C(null);},3e3);return ()=>clearTimeout(g)}},[w]),!(i||e==="development"||a?.role==="admin"))return null;let Me=()=>{f(true);},ze=()=>{f(false),T.current?.focus();};return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs("button",{ref:T,type:"button",onClick:Me,className:se,"aria-label":r?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":r,"aria-controls":"debug-panel",children:[jsxRuntime.jsx("span",{children:"Debug"}),jsxRuntime.jsx("span",{className:b>0?p.errorCount>0?ae:J:J,children:b}),p.errorCount>0&&jsxRuntime.jsxs("span",{className:ae,children:[p.errorCount," err"]})]}),r&&jsxRuntime.jsxs("div",{ref:I,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:ie,children:[jsxRuntime.jsxs("div",{className:le,children:[jsxRuntime.jsxs("div",{className:Ee,children:[jsxRuntime.jsx("h3",{className:ce,children:"Debug"}),jsxRuntime.jsxs("p",{className:de,children:[s.substring(0,36),"..."]})]}),jsxRuntime.jsx("button",{ref:F,type:"button",onClick:ze,className:ue,"aria-label":"Close debug panel",children:"\u2715"})]}),jsxRuntime.jsxs("div",{className:pe,children:[jsxRuntime.jsxs("div",{className:G,children:[jsxRuntime.jsx("div",{className:q,children:b}),jsxRuntime.jsx("div",{className:V,children:"Logs"})]}),jsxRuntime.jsxs("div",{className:G,children:[jsxRuntime.jsx("div",{className:`${q} ${Le}`,children:p.errorCount}),jsxRuntime.jsx("div",{className:V,children:"Errors"})]}),jsxRuntime.jsxs("div",{className:G,children:[jsxRuntime.jsx("div",{className:`${q} ${Ie}`,children:p.networkErrorCount}),jsxRuntime.jsx("div",{className:V,children:"Network"})]})]}),jsxRuntime.jsxs("details",{className:ge,children:[jsxRuntime.jsx("summary",{className:fe,role:"button","aria-expanded":"false",children:jsxRuntime.jsx("span",{children:"\u25B8 Session Details"})}),jsxRuntime.jsxs("div",{className:be,children:[jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"User"}),jsxRuntime.jsx("span",{children:p.userId||"Anonymous"})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Browser"}),jsxRuntime.jsxs("span",{children:[p.browser," (",p.platform,")"]})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Screen"}),jsxRuntime.jsx("span",{children:p.screenResolution})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Timezone"}),jsxRuntime.jsx("span",{children:p.timezone})]})]})]}),jsxRuntime.jsxs("div",{className:Te,children:[jsxRuntime.jsx("div",{className:Q,children:jsxRuntime.jsxs("div",{className:Ne,children:[jsxRuntime.jsx("button",{type:"button",onClick:()=>Re("json"),className:z,"aria-label":"Download logs as JSON",children:"\u{1F4C4} JSON"}),jsxRuntime.jsx("button",{type:"button",onClick:()=>Re("txt"),className:z,"aria-label":"Download logs as text file",children:"\u{1F4DD} TXT"}),jsxRuntime.jsx("button",{type:"button",onClick:He,disabled:b===0,className:z,"aria-label":"Copy logs to clipboard",title:"Copy logs as JSON to clipboard",children:"\u{1F4CB} Copy"}),jsxRuntime.jsx("button",{type:"button",onClick:De,disabled:!("showDirectoryPicker"in window),className:z,"aria-label":"Save logs to directory",title:"showDirectoryPicker"in window?"Choose directory to save file":"Feature only supported in Chrome/Edge",children:"\u{1F4C1} Folder"})]})}),o&&jsxRuntime.jsxs("div",{className:Q,children:[jsxRuntime.jsx("span",{className:me,children:"Upload"}),jsxRuntime.jsx("button",{type:"button",onClick:N,disabled:h,className:ye,"aria-label":h?"Uploading logs...":"Upload logs to server","aria-busy":h,children:h?"\u23F3 Uploading...":"\u2601\uFE0F Upload to Server"})]}),x&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:x.type==="success"?X:_,children:x.message}),k&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:k.type==="success"?X:_,children:k.message}),w&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:w.type==="success"?X:_,children:w.message}),jsxRuntime.jsx("div",{className:Q,children:jsxRuntime.jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs? This cannot be undone.")&&(te(),S(null));},className:he,"aria-label":"Clear all logs",children:"\u{1F5D1}\uFE0F Clear All Logs"})})]}),jsxRuntime.jsx("div",{className:xe,children:jsxRuntime.jsxs("div",{className:we,children:["Press ",jsxRuntime.jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})]})]})}function je({fileNameTemplate:a="debug_{timestamp}"}){let[e,o]=react.useState(false),{downloadLogs:t,clearLogs:c,getLogCount:i}=P({fileNameTemplate:a}),r=i();return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("button",{onClick:()=>o(f=>!f),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsxRuntime.jsx("span",{children:r})}),e&&jsxRuntime.jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsxRuntime.jsx("button",{onClick:()=>t("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsxRuntime.jsx("button",{onClick:()=>{confirm("Clear all logs?")&&c();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsxRuntime.jsx("button",{onClick:()=>o(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}exports.DebugPanel=qe;exports.DebugPanelMinimal=je;exports.collectMetadata=Se;exports.generateExportFilename=We;exports.generateFilename=U;exports.generateSessionId=ke;exports.getBrowserInfo=re;exports.sanitizeData=K;exports.sanitizeFilename=O;exports.useLogRecorder=P;
=======
`;function Ye({user:t,environment:e="production",uploadEndpoint:o,fileNameTemplate:r="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:l=2e3,showInProduction:s=false}){let[n,g]=react.useState(false),[h,k]=react.useState(false),[w,L]=react.useState(null),[N,R]=react.useState(null),[v,T]=react.useState(null),M=react.useRef(null),F=react.useRef(null),q=react.useRef(null),{downloadLogs:$,uploadLogs:_,clearLogs:se,getLogs:m,getLogCount:a,getMetadata:c,sessionId:i}=j({fileNameTemplate:r,environment:e,userId:t?.id||t?.email||"guest",includeMetadata:true,uploadEndpoint:o,maxLogs:l,captureConsole:true,captureFetch:true,captureXHR:true,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),f=a(),u=c();react.useEffect(()=>{let b=x=>{x.ctrlKey&&x.shiftKey&&x.key==="D"&&(x.preventDefault(),g(de=>!de)),x.key==="Escape"&&n&&(x.preventDefault(),g(false),F.current?.focus());};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[n]),react.useEffect(()=>{if(u.errorCount>=5&&o){let b=async()=>{try{await _();}catch{console.warn("[DebugPanel] Failed to auto-upload logs");}};return window.addEventListener("error",b),()=>window.removeEventListener("error",b)}},[u.errorCount,o,_]);let E=react.useCallback(async()=>{k(true),L(null);try{let b=await _();b.success?(L({type:"success",message:`Uploaded successfully! ${b.data?JSON.stringify(b.data):""}`}),b.data&&typeof b.data=="object"&&"url"in b.data&&await navigator.clipboard.writeText(String(b.data.url))):L({type:"error",message:`Upload failed: ${b.error}`});}catch(b){L({type:"error",message:`Error: ${b instanceof Error?b.message:"Unknown error"}`});}finally{k(false);}},[_]),S=react.useCallback(b=>{let x=$(b);x&&L({type:"success",message:`Downloaded: ${x}`});},[$]),ae=react.useCallback(async()=>{R(null);try{if(!("showDirectoryPicker"in window)){R({type:"error",message:"Feature only supported in Chrome/Edge"});return}await $("json",void 0,{showPicker:!0})&&R({type:"success",message:"Saved to directory"});}catch{R({type:"error",message:"Unable to save. Please try again or choose a different location."});}},[$]),ie=react.useCallback(async()=>{T(null);try{let b=m(),x=c(),de=JSON.stringify({metadata:x,logs:b},null,2);await navigator.clipboard.writeText(de),T({type:"success",message:"Copied to clipboard!"});}catch{T({type:"error",message:"Failed to copy. Check clipboard permissions."});}},[m,c]);if(react.useEffect(()=>{if(N){let b=setTimeout(()=>{R(null);},3e3);return ()=>clearTimeout(b)}},[N]),react.useEffect(()=>{if(v){let b=setTimeout(()=>{T(null);},3e3);return ()=>clearTimeout(b)}},[v]),!(s||e==="development"||t?.role==="admin"))return null;let le=()=>{g(true);},ce=()=>{g(false),F.current?.focus();};return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsxs("button",{ref:F,type:"button",onClick:le,className:fe,"aria-label":n?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":n,"aria-controls":"debug-panel",children:[jsxRuntime.jsx("span",{children:"Debug"}),jsxRuntime.jsx("span",{className:f>0?u.errorCount>0?be:Z:Z,children:f}),u.errorCount>0&&jsxRuntime.jsxs("span",{className:be,children:[u.errorCount," err"]})]}),n&&jsxRuntime.jsxs("div",{ref:M,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:me,children:[jsxRuntime.jsxs("div",{className:ye,children:[jsxRuntime.jsxs("div",{className:$e,children:[jsxRuntime.jsx("h3",{className:he,children:"Debug"}),jsxRuntime.jsxs("p",{className:xe,children:[i.substring(0,36),"..."]})]}),jsxRuntime.jsx("button",{ref:q,type:"button",onClick:ce,className:we,"aria-label":"Close debug panel",children:"\u2715"})]}),jsxRuntime.jsxs("div",{className:ve,children:[jsxRuntime.jsxs("div",{className:ee,children:[jsxRuntime.jsx("div",{className:A,children:f}),jsxRuntime.jsx("div",{className:te,children:"Logs"})]}),jsxRuntime.jsxs("div",{className:ee,children:[jsxRuntime.jsx("div",{className:`${A} ${_e}`,children:u.errorCount}),jsxRuntime.jsx("div",{className:te,children:"Errors"})]}),jsxRuntime.jsxs("div",{className:ee,children:[jsxRuntime.jsx("div",{className:`${A} ${ze}`,children:u.networkErrorCount}),jsxRuntime.jsx("div",{className:te,children:"Network"})]})]}),jsxRuntime.jsxs("details",{className:Se,children:[jsxRuntime.jsx("summary",{className:ke,role:"button","aria-expanded":"false",children:jsxRuntime.jsx("span",{children:"\u25B8 Session Details"})}),jsxRuntime.jsxs("div",{className:Re,children:[jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"User"}),jsxRuntime.jsx("span",{children:u.userId||"Anonymous"})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Browser"}),jsxRuntime.jsxs("span",{children:[u.browser," (",u.platform,")"]})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Screen"}),jsxRuntime.jsx("span",{children:u.screenResolution})]}),jsxRuntime.jsxs("div",{children:[jsxRuntime.jsx("strong",{children:"Timezone"}),jsxRuntime.jsx("span",{children:u.timezone})]})]})]}),jsxRuntime.jsxs("div",{className:Xe,children:[jsxRuntime.jsx("div",{className:oe,children:jsxRuntime.jsxs("div",{className:qe,children:[jsxRuntime.jsx("button",{type:"button",onClick:()=>S("json"),className:I,"aria-label":"Download logs as JSON",children:"\u{1F4C4} JSON"}),jsxRuntime.jsx("button",{type:"button",onClick:()=>S("txt"),className:I,"aria-label":"Download logs as text file",children:"\u{1F4DD} TXT"}),jsxRuntime.jsx("button",{type:"button",onClick:ie,disabled:f===0,className:I,"aria-label":"Copy logs to clipboard",title:"Copy logs as JSON to clipboard",children:"\u{1F4CB} Copy"}),jsxRuntime.jsx("button",{type:"button",onClick:ae,disabled:!("showDirectoryPicker"in window),className:I,"aria-label":"Save logs to directory",title:"showDirectoryPicker"in window?"Choose directory to save file":"Feature only supported in Chrome/Edge",children:"\u{1F4C1} Folder"}),jsxRuntime.jsx("button",{type:"button",onClick:()=>S("jsonl"),disabled:f===0,className:I,"aria-label":"Download logs as JSONL (JSON Lines)",children:"\u{1F4E6} JSONL"}),jsxRuntime.jsx("button",{type:"button",onClick:()=>S("ecs.json"),disabled:f===0,className:I,"aria-label":"Download logs as ECS JSON (Elastic Common Schema)",children:"\u{1F4CB} ECS"}),jsxRuntime.jsx("button",{type:"button",onClick:()=>S("ai.txt"),disabled:f===0,className:I,"aria-label":"Download logs as AI-optimized TXT",children:"\u{1F916} AI-TXT"})]})}),o&&jsxRuntime.jsxs("div",{className:oe,children:[jsxRuntime.jsx("span",{className:Ee,children:"Upload"}),jsxRuntime.jsx("button",{type:"button",onClick:E,disabled:h,className:Ce,"aria-label":h?"Uploading logs...":"Upload logs to server","aria-busy":h,children:h?"\u23F3 Uploading...":"\u2601\uFE0F Upload to Server"})]}),w&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:w.type==="success"?K:B,children:w.message}),N&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:N.type==="success"?K:B,children:N.message}),v&&jsxRuntime.jsx("div",{role:"status","aria-live":"polite",className:v.type==="success"?K:B,children:v.message}),jsxRuntime.jsx("div",{className:oe,children:jsxRuntime.jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs? This cannot be undone.")&&(se(),L(null));},className:Le,"aria-label":"Clear all logs",children:"\u{1F5D1}\uFE0F Clear All Logs"})})]}),jsxRuntime.jsx("div",{className:Ne,children:jsxRuntime.jsxs("div",{className:Te,children:["Press ",jsxRuntime.jsx("kbd",{children:"Ctrl+Shift+D"})," to toggle"]})})]})]})}function Qe({fileNameTemplate:t="debug_{timestamp}"}){let[e,o]=react.useState(false),{downloadLogs:r,clearLogs:l,getLogCount:s}=j({fileNameTemplate:t}),n=s();return jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("button",{onClick:()=>o(g=>!g),style:{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,padding:"12px 20px",background:"#1f2937",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",gap:"8px"},children:jsxRuntime.jsx("span",{children:n})}),e&&jsxRuntime.jsxs("div",{style:{position:"fixed",bottom:"80px",right:"20px",zIndex:9999,background:"#fff",padding:"20px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)",width:"300px",display:"flex",flexDirection:"column",gap:"12px"},children:[jsxRuntime.jsx("button",{onClick:()=>r("json"),style:{width:"100%",padding:"10px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Download JSON"}),jsxRuntime.jsx("button",{onClick:()=>{confirm("Clear all logs?")&&l();},style:{width:"100%",padding:"10px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Clear Logs"}),jsxRuntime.jsx("button",{onClick:()=>o(false),style:{width:"100%",padding:"10px",background:"#6b7280",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px"},children:"Close"})]})]})}exports.DebugPanel=Ye;exports.DebugPanelMinimal=Qe;exports.collectMetadata=Ie;exports.filterStackTrace=pe;exports.generateExportFilename=ot;exports.generateFilename=D;exports.generateSessionId=De;exports.getBrowserInfo=ue;exports.sanitizeData=Y;exports.sanitizeFilename=H;exports.transformMetadataToECS=U;exports.transformToECS=z;exports.useLogRecorder=j;
>>>>>>> 0c41068 (feat(export): add AI-friendly log formats (JSONL, ECS JSON, AI-TXT))
