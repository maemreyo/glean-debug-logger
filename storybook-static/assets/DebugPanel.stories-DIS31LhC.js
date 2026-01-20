import{j as e}from"./jsx-runtime-CDt2p4po.js";import{r as f}from"./index-GiUgBvb1.js";import{u as De}from"./useLogRecorder-DQDI5Qz3.js";let ze={data:""},Ie=r=>{if(typeof window=="object"){let t=(r?r.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(r||document.head).appendChild(t),t.firstChild}return r||ze},Pe=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Ue=/\/\*[^]*?\*\/|  +/g,F=/\n+/g,v=(r,t)=>{let i="",b="",p="";for(let n in r){let s=r[n];n[0]=="@"?n[1]=="i"?i=n+" "+s+";":b+=n[1]=="f"?v(s,n):n+"{"+v(s,n[1]=="k"?"":t)+"}":typeof s=="object"?b+=v(s,t?t.replace(/([^,])+/g,d=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,d):d?d+" "+l:l)):n):s!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),p+=v.p?v.p(n,s):n+":"+s+";")}return i+(t&&p?t+"{"+p+"}":p)+b},y={},ce=r=>{if(typeof r=="object"){let t="";for(let i in r)t+=i+ce(r[i]);return t}return r},$e=(r,t,i,b,p)=>{let n=ce(r),s=y[n]||(y[n]=(l=>{let u=0,c=11;for(;u<l.length;)c=101*c+l.charCodeAt(u++)>>>0;return"go"+c})(n));if(!y[s]){let l=n!==r?r:(u=>{let c,m,x=[{}];for(;c=Pe.exec(u.replace(Ue,""));)c[4]?x.shift():c[3]?(m=c[3].replace(F," ").trim(),x.unshift(x[0][m]=x[0][m]||{})):x[0][c[1]]=c[2].replace(F," ").trim();return x[0]})(r);y[s]=v(p?{["@keyframes "+s]:l}:l,i?"":"."+s)}let d=i&&y.g?y.g:null;return i&&(y.g=y[s]),((l,u,c,m)=>{m?u.data=u.data.replace(m,l):u.data.indexOf(l)===-1&&(u.data=c?l+u.data:u.data+l)})(y[s],t,b,d),s},Re=(r,t,i)=>r.reduce((b,p,n)=>{let s=t[n];if(s&&s.call){let d=s(i),l=d&&d.props&&d.props.className||/^go/.test(d)&&d;s=l?"."+l:d&&typeof d=="object"?d.props?"":v(d,""):d===!1?"":d}return b+p+(s??"")},"");function o(r){let t=this||{},i=r.call?r(t.p):r;return $e(i.unshift?i.raw?Re(i,[].slice.call(arguments,1),t.p):i.reduce((b,p)=>Object.assign(b,p&&p.call?p(t.p):p),{}):i,Ie(t.target),t.g,t.o,t.k)}o.bind({g:1});o.bind({k:1});const pe=o`
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
`,B=o`
  background: #374151;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`,O=o`
  background: #ef4444;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`,ue=o`
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
`,me=o`
  background: linear-gradient(to right, #1f2937, #111827);
  color: #fff;
  padding: 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,Fe=o`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`,Be=o`
  margin: 4px 0 0;
  font-size: 12px;
  opacity: 0.8;
`,Oe=o`
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
`,ge=o`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`,P=o`
  text-align: center;
`,E=o`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`,U=o`
  font-size: 12px;
  color: #6b7280;
`,qe=o`
  color: #dc2626;
`,Ye=o`
  color: #ea580c;
`,fe=o`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`,xe=o`
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
`,be=o`
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
`,Ve=o`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`,q=o`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,Y=o`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`,Me=o`
  display: flex;
  gap: 8px;
`,V=o`
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
`,Ae=o`
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
`,We=o`
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
`,Ke=o`
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
`,M=o`
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
`,A=o`
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
`,he=o`
  padding: 12px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #6b7280;
`,D=o`
  margin-bottom: 4px;

  kbd {
    padding: 2px 6px;
    background: #e5e7eb;
    border-radius: 4px;
    font-family: monospace;
  }
`;o`
  @media (prefers-color-scheme: dark) {
    ${ue} {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    ${me} {
      background: linear-gradient(to right, #334155, #0f172a);
    }

    ${ge} {
      background: #0f172a;
      border-color: #334155;
    }

    ${E} {
      color: #f1f5f9;
    }

    ${fe} {
      background: #0f172a;
      border-color: #334155;
    }

    ${xe} {
      color: #e2e8f0;
    }

    ${be} {
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

    ${he} {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

    ${D} kbd {
      background: #334155;
      color: #e2e8f0;
    }

    ${pe} {
      background: #334155;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

      &:hover {
        background: #475569;
      }
    }
  }
`;function ye({user:r,environment:t="production",uploadEndpoint:i,fileNameTemplate:b="{env}_{date}_{time}_{userId}_{errorCount}errors",maxLogs:p=2e3,showInProduction:n=!1}){const[s,d]=f.useState(!1),[l,u]=f.useState(!1),[c,m]=f.useState(null),[x,w]=f.useState(null),ve=f.useRef(null),z=f.useRef(null),we=f.useRef(null),{downloadLogs:j,uploadLogs:k,clearLogs:je,getLogCount:ke,getMetadata:Se,sessionId:Ne}=De({fileNameTemplate:b,environment:t,userId:(r==null?void 0:r.id)||(r==null?void 0:r.email)||"guest",includeMetadata:!0,uploadEndpoint:i,maxLogs:p,captureConsole:!0,captureFetch:!0,captureXHR:!0,sanitizeKeys:["password","token","apiKey","secret","authorization","creditCard"],excludeUrls:["/api/analytics","google-analytics.com","facebook.com","vercel.com"]}),I=ke(),g=Se();f.useEffect(()=>{const a=h=>{var R;h.ctrlKey&&h.shiftKey&&h.key==="D"&&(h.preventDefault(),d(Ee=>!Ee)),h.key==="Escape"&&s&&(h.preventDefault(),d(!1),(R=z.current)==null||R.focus())};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[s]),f.useEffect(()=>{if(g.errorCount>=5&&i){const a=async()=>{try{await k()}catch{console.warn("[DebugPanel] Failed to auto-upload logs")}};return window.addEventListener("error",a),()=>window.removeEventListener("error",a)}},[g.errorCount,i,k]);const Ce=f.useCallback(async()=>{u(!0),m(null);try{const a=await k();a.success?(m({type:"success",message:`Uploaded successfully! ${a.data?JSON.stringify(a.data):""}`}),a.data&&typeof a.data=="object"&&"url"in a.data&&await navigator.clipboard.writeText(String(a.data.url))):m({type:"error",message:`Upload failed: ${a.error}`})}catch(a){m({type:"error",message:`Error: ${a instanceof Error?a.message:"Unknown error"}`})}finally{u(!1)}},[k]),$=f.useCallback(a=>{const h=j(a);h&&m({type:"success",message:`Downloaded: ${h}`})},[j]),_e=f.useCallback(async()=>{w(null);try{if(!("showDirectoryPicker"in window)){w({type:"error",message:"Tính năng chỉ hỗ trợ Chrome/Edge"});return}await j("json",void 0,{showPicker:!0})&&w({type:"success",message:"Đã lưu vào thư mục"})}catch{w({type:"error",message:"Không thể lưu. Vui lòng thử lại hoặc chọn vị trí khác."})}},[j]);if(f.useEffect(()=>{if(x){const a=setTimeout(()=>{w(null)},3e3);return()=>clearTimeout(a)}},[x]),!(n||t==="development"||(r==null?void 0:r.role)==="admin"))return null;const Le=()=>{d(!0)},Te=()=>{var a;d(!1),(a=z.current)==null||a.focus()};return e.jsxs(e.Fragment,{children:[e.jsxs("button",{ref:z,type:"button",onClick:Le,className:pe,"aria-label":s?"Close debug panel":"Open debug panel (Ctrl+Shift+D)","aria-expanded":s,"aria-controls":"debug-panel",children:[e.jsx("span",{children:"🐛 Debug"}),e.jsx("span",{className:I>0&&g.errorCount>0?O:B,children:I}),g.errorCount>0&&e.jsxs("span",{className:O,children:[g.errorCount," err"]})]}),s&&e.jsxs("div",{ref:ve,id:"debug-panel",role:"dialog","aria-modal":"true","aria-label":"Debug Logger Panel",className:ue,children:[e.jsxs("div",{className:me,children:[e.jsxs("div",{children:[e.jsx("h3",{className:Fe,children:"Debug Logger"}),e.jsxs("p",{className:Be,children:["Session: ",Ne.substring(0,20),"..."]})]}),e.jsx("button",{ref:we,type:"button",onClick:Te,className:Oe,"aria-label":"Close debug panel",children:"✕"})]}),e.jsxs("div",{className:ge,children:[e.jsxs("div",{className:P,children:[e.jsx("div",{className:E,children:I}),e.jsx("div",{className:U,children:"Total Logs"})]}),e.jsxs("div",{className:P,children:[e.jsx("div",{className:`${E} ${qe}`,children:g.errorCount}),e.jsx("div",{className:U,children:"Errors"})]}),e.jsxs("div",{className:P,children:[e.jsx("div",{className:`${E} ${Ye}`,children:g.networkErrorCount}),e.jsx("div",{className:U,children:"Net Errors"})]})]}),e.jsxs("details",{className:fe,children:[e.jsxs("summary",{className:xe,role:"button","aria-expanded":"false",children:[e.jsx("span",{children:"📊"})," Session Info"]}),e.jsxs("div",{className:be,children:[e.jsxs("div",{children:[e.jsx("strong",{children:"User:"})," ",g.userId||"Anonymous"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Browser:"})," ",g.browser," (",g.platform,")"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Resolution:"})," ",g.screenResolution]}),e.jsxs("div",{children:[e.jsx("strong",{children:"URL:"})," ",g.url]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Timezone:"})," ",g.timezone]})]})]}),e.jsxs("div",{className:Ve,children:[e.jsxs("div",{className:q,children:[e.jsx("span",{className:Y,children:"Download Logs"}),e.jsxs("div",{className:Me,children:[e.jsx("button",{type:"button",onClick:()=>$("json"),className:V,"aria-label":"Download logs as JSON",children:"📥 JSON"}),e.jsx("button",{type:"button",onClick:()=>$("txt"),className:V,"aria-label":"Download logs as text file",children:"📄 TXT"})]}),e.jsx("button",{type:"button",onClick:_e,disabled:!("showDirectoryPicker"in window),className:Ae,"aria-label":"Save logs to directory",title:"showDirectoryPicker"in window?"Chọn thư mục để lưu file":"Tính năng chỉ hỗ trợ Chrome/Edge",children:"📁 Lưu vào thư mục..."})]}),i&&e.jsxs("div",{className:q,children:[e.jsx("span",{className:Y,children:"Upload to Server"}),e.jsx("button",{type:"button",onClick:Ce,disabled:l,className:We,"aria-label":l?"Uploading logs...":"Upload logs to server","aria-busy":l,children:l?"⏳ Uploading...":"☁️ Upload Logs"})]}),c&&e.jsx("div",{role:"status","aria-live":"polite",className:c.type==="success"?M:A,children:c.message}),x&&e.jsx("div",{role:"status","aria-live":"polite",className:x.type==="success"?M:A,children:x.message}),e.jsx("button",{type:"button",onClick:()=>{confirm("Clear all logs? This cannot be undone.")&&(je(),m(null))},className:Ke,"aria-label":"Clear all logs",children:"🗑️ Clear All Logs"})]}),e.jsxs("div",{className:he,children:[e.jsxs("div",{className:D,children:[e.jsx("strong",{children:"💡 Tip:"})," Press"," ",e.jsx("kbd",{style:{padding:"2px 6px",background:"#e5e7eb",borderRadius:"4px",fontFamily:"monospace"},children:"Ctrl+Shift+D"})," ","to toggle"]}),e.jsxs("div",{className:D,children:[e.jsx("strong",{children:"💾 Auto-save:"})," Logs persist across page refreshes"]}),e.jsxs("div",{className:D,children:[e.jsx("strong",{children:"🔒 Security:"})," Sensitive data is auto-redacted"]})]})]})]})}ye.__docgenInfo={description:"",methods:[],displayName:"DebugPanel",props:{user:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  id?: string;
  email?: string;
  role?: string;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!1}},{key:"email",value:{name:"string",required:!1}},{key:"role",value:{name:"string",required:!1}}]}},description:""},environment:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"process.env.NODE_ENV || 'development'",computed:!1}},uploadEndpoint:{required:!1,tsType:{name:"string"},description:""},fileNameTemplate:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'{env}_{date}_{time}_{userId}_{errorCount}errors'",computed:!1}},maxLogs:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"2000",computed:!1}},showInProduction:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const Ze={title:"Components/DebugPanel",component:ye,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{environment:{control:"select",options:["development","production"]},showInProduction:{control:"boolean"},maxLogs:{control:"number"}},decorators:[r=>e.jsx("div",{style:{position:"relative",height:"100vh"},children:e.jsx(r,{})})]},S={args:{environment:"development",maxLogs:2e3,showInProduction:!1}},N={args:{user:{id:"user-123",email:"test@example.com",role:"admin"},environment:"development",maxLogs:2e3}},C={args:{uploadEndpoint:"https://api.example.com/logs/upload",environment:"development",fileNameTemplate:"{env}_{date}_{time}_{userId}_{errorCount}errors"}},_={args:{maxLogs:0,environment:"development"}},L={args:{environment:"production",showInProduction:!0,maxLogs:2e3}},T={args:{fileNameTemplate:"debug_{env}_{userId}_{timestamp}",environment:"development"}};var W,K,H;S.parameters={...S.parameters,docs:{...(W=S.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    environment: 'development',
    maxLogs: 2000,
    showInProduction: false
  }
}`,...(H=(K=S.parameters)==null?void 0:K.docs)==null?void 0:H.source}}};var J,G,X;N.parameters={...N.parameters,docs:{...(J=N.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    user: {
      id: 'user-123',
      email: 'test@example.com',
      role: 'admin'
    },
    environment: 'development',
    maxLogs: 2000
  }
}`,...(X=(G=N.parameters)==null?void 0:G.docs)==null?void 0:X.source}}};var Z,Q,ee;C.parameters={...C.parameters,docs:{...(Z=C.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    uploadEndpoint: 'https://api.example.com/logs/upload',
    environment: 'development',
    fileNameTemplate: '{env}_{date}_{time}_{userId}_{errorCount}errors'
  }
}`,...(ee=(Q=C.parameters)==null?void 0:Q.docs)==null?void 0:ee.source}}};var re,oe,se;_.parameters={..._.parameters,docs:{...(re=_.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    maxLogs: 0,
    environment: 'development'
  }
}`,...(se=(oe=_.parameters)==null?void 0:oe.docs)==null?void 0:se.source}}};var te,ae,ne;L.parameters={...L.parameters,docs:{...(te=L.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    environment: 'production',
    showInProduction: true,
    maxLogs: 2000
  }
}`,...(ne=(ae=L.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};var le,ie,de;T.parameters={...T.parameters,docs:{...(le=T.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    fileNameTemplate: 'debug_{env}_{userId}_{timestamp}',
    environment: 'development'
  }
}`,...(de=(ie=T.parameters)==null?void 0:ie.docs)==null?void 0:de.source}}};const Qe=["Default","WithUser","WithUploadEndpoint","EmptyState","ProductionMode","WithCustomFilename"];export{S as Default,_ as EmptyState,L as ProductionMode,T as WithCustomFilename,C as WithUploadEndpoint,N as WithUser,Qe as __namedExportsOrder,Ze as default};
