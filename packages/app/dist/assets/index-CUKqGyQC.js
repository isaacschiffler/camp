(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var D,we;class it extends Error{}it.prototype.name="InvalidTokenError";function Fs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Bs(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Fs(t)}catch{return atob(t)}}function Qe(r,t){if(typeof r!="string")throw new it("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new it(`Invalid token specified: missing part #${e+1}`);let i;try{i=Bs(s)}catch(n){throw new it(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new it(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Vs="mu:context",Qt=`${Vs}:change`;class qs{constructor(t,e){this._proxy=Ys(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Xe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new qs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Qt,t),t}detach(t){this.removeEventListener(Qt,t)}}function Ys(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(Qt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function Ws(r,t){const e=ts(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function ts(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return ts(r,i.host)}class Gs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function es(r="mu:message"){return(t,...e)=>t.dispatchEvent(new Gs(e,r))}class oe{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Ks(r){return t=>({...t,...r})}const Xt="mu:auth:jwt",ss=class is extends oe{constructor(t,e){super((s,i)=>this.update(s,i),t,is.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(Zs(s)),Yt(i);case"auth/signout":return e(Qs()),Yt(this._redirectForLogin);case"auth/redirect":return Yt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ss.EVENT_TYPE="auth:message";let rs=ss;const ns=es(rs.EVENT_TYPE);function Yt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class Js extends Xe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:Y.authenticateFromLocalStorage()})}connectedCallback(){new rs(this.context,this.redirect).attach(this)}}class at{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Xt),t}}class Y extends at{constructor(t){super();const e=Qe(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Y(t);return localStorage.setItem(Xt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Xt);return t?Y.authenticate(t):new at}}function Zs(r){return Ks({user:Y.authenticate(r),token:r})}function Qs(){return r=>{const t=r.user;return{user:t&&t.authenticated?at.deauthenticate(t):t,token:""}}}function Xs(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function ti(r){return r.authenticated?Qe(r.token||""):{}}const Et=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Y,Provider:Js,User:at,dispatch:ns,headers:Xs,payload:ti},Symbol.toStringTag,{value:"Module"}));function xt(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function te(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const os=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:te,relay:xt},Symbol.toStringTag,{value:"Module"}));function as(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ei=new DOMParser;function pt(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=ei.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(console.log("Processing parameter:",a),typeof a){case"string":return Ee(a);case"bigint":case"boolean":case"number":case"symbol":return Ee(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ee(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function It(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}D=class extends HTMLElement{constructor(){super(),this._state={},It(this).template(D.template).styles(D.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),xt(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},si(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},D.template=pt`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,D.styles=as`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function si(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const ls=class cs extends oe{constructor(t){super((e,s)=>this.update(e,s),t,cs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(ri(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(ni(s,i));break}}}};ls.EVENT_TYPE="history:message";let ae=ls;class xe extends Xe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=ii(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),le(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ae(this.context).attach(this)}}function ii(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ri(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function ni(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const le=es(ae.EVENT_TYPE),oi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:xe,Provider:xe,Service:ae,dispatch:le},Symbol.toStringTag,{value:"Module"}));class W{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Se(this._provider,t);this._effects.push(i),e(i)}else Ws(this._target,this._contextLabel).then(i=>{const n=new Se(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Se{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const hs=class us extends HTMLElement{constructor(){super(),this._state={},this._user=new at,this._authObserver=new W(this,"blazing:auth"),It(this).template(us.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;ai(i,this._state,e,this.authorization).then(n=>X(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},X(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ke(this.src,this.authorization).then(e=>{this._state=e,X(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&ke(this.src,this.authorization).then(i=>{this._state=i,X(i,this)});break;case"new":s&&(this._state={},X({},this));break}}};hs.observedAttributes=["src","new","action"];hs.template=pt`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function ke(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function X(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function ai(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const li=class ds extends oe{constructor(t,e){super(e,t,ds.EVENT_TYPE,!1)}};li.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const At=globalThis,ce=At.ShadowRoot&&(At.ShadyCSS===void 0||At.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),Pe=new WeakMap;let ps=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ce&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Pe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Pe.set(e,t))}return t}toString(){return this.cssText}};const ci=r=>new ps(typeof r=="string"?r:r+"",void 0,he),hi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ps(e,r,he)},ui=(r,t)=>{if(ce)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=At.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Ce=ce?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ci(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:di,defineProperty:pi,getOwnPropertyDescriptor:fi,getOwnPropertyNames:gi,getOwnPropertySymbols:mi,getPrototypeOf:vi}=Object,G=globalThis,Oe=G.trustedTypes,yi=Oe?Oe.emptyScript:"",Te=G.reactiveElementPolyfillSupport,rt=(r,t)=>r,St={toAttribute(r,t){switch(t){case Boolean:r=r?yi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ue=(r,t)=>!di(r,t),Re={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),G.litPropertyMetadata??(G.litPropertyMetadata=new WeakMap);let B=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Re){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&pi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=fi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Re}static _$Ei(){if(this.hasOwnProperty(rt("elementProperties")))return;const t=vi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(rt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(rt("properties"))){const e=this.properties,s=[...gi(e),...mi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ce(i))}else t!==void 0&&e.push(Ce(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ui(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:St).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:St;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ue)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[rt("elementProperties")]=new Map,B[rt("finalized")]=new Map,Te==null||Te({ReactiveElement:B}),(G.reactiveElementVersions??(G.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,Pt=kt.trustedTypes,Ue=Pt?Pt.createPolicy("lit-html",{createHTML:r=>r}):void 0,fs="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,gs="?"+k,_i=`<${gs}>`,M=document,lt=()=>M.createComment(""),ct=r=>r===null||typeof r!="object"&&typeof r!="function",de=Array.isArray,$i=r=>de(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Wt=`[ 	
\f\r]`,tt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ne=/-->/g,Le=/>/g,R=RegExp(`>|${Wt}(?:([^\\s"'>=/]+)(${Wt}*=${Wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Me=/'/g,je=/"/g,ms=/^(?:script|style|textarea|title)$/i,bi=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),et=bi(1),K=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ie=new WeakMap,N=M.createTreeWalker(M,129);function vs(r,t){if(!de(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ue!==void 0?Ue.createHTML(t):t}const Ai=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=tt;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===tt?f[1]==="!--"?o=Ne:f[1]!==void 0?o=Le:f[2]!==void 0?(ms.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=i??tt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?R:f[3]==='"'?je:Me):o===je||o===Me?o=R:o===Ne||o===Le?o=tt:(o=R,i=void 0);const h=o===R&&r[l+1].startsWith("/>")?" ":"";n+=o===tt?a+_i:u>=0?(s.push(d),a.slice(0,u)+fs+a.slice(u)+k+h):a+k+(u===-2?l:h)}return[vs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ee=class ys{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ai(t,e);if(this.el=ys.createElement(d,s),N.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=N.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(fs)){const c=f[o++],h=i.getAttribute(u).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ei:p[1]==="?"?xi:p[1]==="@"?Si:Ht}),i.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(ms.test(i.tagName)){const u=i.textContent.split(k),c=u.length-1;if(c>0){i.textContent=Pt?Pt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],lt()),N.nextNode(),a.push({type:2,index:++n});i.append(u[c],lt())}}}else if(i.nodeType===8)if(i.data===gs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:n}),u+=k.length-1}n++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}};function J(r,t,e=r,s){var i,n;if(t===K)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=ct(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=J(r,o._$AS(r,t.values),o,s)),t}class wi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??M).importNode(e,!0);N.currentNode=i;let n=N.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new ft(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new ki(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=N.nextNode(),o++)}return N.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class ft{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),ct(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==K&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):$i(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&ct(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ee.createElement(vs(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new wi(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ie.get(t.strings);return e===void 0&&Ie.set(t.strings,e=new ee(t)),e}k(t){de(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new ft(this.O(lt()),this.O(lt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Ht{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=J(this,t,e,0),o=!ct(t)||t!==this._$AH&&t!==K,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=J(this,l[s+a],e,a),d===K&&(d=this._$AH[a]),o||(o=!ct(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ei extends Ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class xi extends Ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Si extends Ht{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??_)===K)return;const s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ki{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const He=kt.litHtmlPolyfillSupport;He==null||He(ee,ft),(kt.litHtmlVersions??(kt.litHtmlVersions=[])).push("3.2.0");const Pi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new ft(t.insertBefore(lt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let q=class extends B{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Pi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return K}};q._$litElement$=!0,q.finalized=!0,(we=globalThis.litElementHydrateSupport)==null||we.call(globalThis,{LitElement:q});const ze=globalThis.litElementPolyfillSupport;ze==null||ze({LitElement:q});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ci={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:ue},Oi=(r=Ci,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function _s(r){return(t,e)=>typeof e=="object"?Oi(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $s(r){return _s({...r,state:!0,attribute:!1})}function Ti(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Ri(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var bs={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,v,Dt){var A=v.length-1;switch(g){case 1:return new m.Root({},[v[A-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new m.Literal({value:v[A]});break;case 7:this.$=new m.Splat({name:v[A]});break;case 8:this.$=new m.Param({name:v[A]});break;case 9:this.$=new m.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],v=this.table,Dt="",A=0,$e=0,Is=2,be=1,Hs=g.slice.call(arguments,1),y=Object.create(this.lexer),O={yy:{}};for(var Ft in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Ft)&&(O.yy[Ft]=this.yy[Ft]);y.setInput(c,O.yy),O.yy.lexer=y,O.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var Bt=y.yylloc;g.push(Bt);var zs=y.options&&y.options.ranges;typeof O.yy.parseError=="function"?this.parseError=O.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ds=function(){var z;return z=y.lex()||be,typeof z!="number"&&(z=h.symbols_[z]||z),z},b,T,w,Vt,H={},$t,S,Ae,bt;;){if(T=p[p.length-1],this.defaultActions[T]?w=this.defaultActions[T]:((b===null||typeof b>"u")&&(b=Ds()),w=v[T]&&v[T][b]),typeof w>"u"||!w.length||!w[0]){var qt="";bt=[];for($t in v[T])this.terminals_[$t]&&$t>Is&&bt.push("'"+this.terminals_[$t]+"'");y.showPosition?qt="Parse error on line "+(A+1)+`:
`+y.showPosition()+`
Expecting `+bt.join(", ")+", got '"+(this.terminals_[b]||b)+"'":qt="Parse error on line "+(A+1)+": Unexpected "+(b==be?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(qt,{text:y.match,token:this.terminals_[b]||b,line:y.yylineno,loc:Bt,expected:bt})}if(w[0]instanceof Array&&w.length>1)throw new Error("Parse Error: multiple actions possible at state: "+T+", token: "+b);switch(w[0]){case 1:p.push(b),m.push(y.yytext),g.push(y.yylloc),p.push(w[1]),b=null,$e=y.yyleng,Dt=y.yytext,A=y.yylineno,Bt=y.yylloc;break;case 2:if(S=this.productions_[w[1]][1],H.$=m[m.length-S],H._$={first_line:g[g.length-(S||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(S||1)].first_column,last_column:g[g.length-1].last_column},zs&&(H._$.range=[g[g.length-(S||1)].range[0],g[g.length-1].range[1]]),Vt=this.performAction.apply(H,[Dt,$e,A,O.yy,w[1],m,g].concat(Hs)),typeof Vt<"u")return Vt;S&&(p=p.slice(0,-1*S*2),m=m.slice(0,-1*S),g=g.slice(0,-1*S)),p.push(this.productions_[w[1]][0]),m.push(H.$),g.push(H._$),Ae=v[p[p.length-2]][p[p.length-1]],p.push(Ae);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(p=this._input.match(this.rules[g[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=v,this.options.backtrack_lexer){if(c=this.test_match(p,g[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Ri<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(bs);function F(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var As={Root:F("Root"),Concat:F("Concat"),Literal:F("Literal"),Splat:F("Splat"),Param:F("Param"),Optional:F("Optional")},ws=bs.parser;ws.yy=As;var Ui=ws,Ni=Object.keys(As);function Li(r){return Ni.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Es=Li,Mi=Es,ji=/[\-{}\[\]+?.,\\\^$|#\s]/g;function xs(r){this.captures=r.captures,this.re=r.re}xs.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Ii=Mi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(ji,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new xs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Hi=Ii,zi=Es,Di=zi({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Fi=Di,Bi=Ui,Vi=Hi,qi=Fi;gt.prototype=Object.create(null);gt.prototype.match=function(r){var t=Vi.visit(this.ast),e=t.match(r);return e||!1};gt.prototype.reverse=function(r){return qi.visit(this.ast,r)};function gt(r){var t;if(this?t=this:t=Object.create(gt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Bi.parse(r),t}var Yi=gt,Wi=Yi,Gi=Wi;const Ki=Ti(Gi);var Ji=Object.defineProperty,Ss=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Ji(t,e,i),i};const ks=class extends q{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>et`
      <h1>Not Found</h1>
    `,this._cases=t.map(i=>({...i,route:new Ki(i.path)})),this._historyObserver=new W(this,e),this._authObserver=new W(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),et`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ns(this,"auth/redirect"),et`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):et`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),et`
              <h1>Redirecting to ${s}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){le(this,"history/redirect",{href:t})}};ks.styles=hi`
    :host,
    main {
      display: contents;
    }
  `;let Ct=ks;Ss([$s()],Ct.prototype,"_user");Ss([$s()],Ct.prototype,"_match");const Zi=Object.freeze(Object.defineProperty({__proto__:null,Element:Ct,Switch:Ct},Symbol.toStringTag,{value:"Module"})),Ps=class Cs extends HTMLElement{constructor(){if(super(),It(this).template(Cs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ps.template=pt`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;let Qi=Ps;const Xi=Object.freeze(Object.defineProperty({__proto__:null,Element:Qi},Symbol.toStringTag,{value:"Module"})),Os=class se extends HTMLElement{constructor(){super(),this._array=[],It(this).template(se.template).styles(se.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ts("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{te(t,"button.add")?xt(t,"input-array:add"):te(t,"button.remove")&&xt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],tr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Os.template=pt`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Os.styles=as`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
    }
  `;function tr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Ts(e)))}function Ts(r,t){const e=r===void 0?"":`value="${r}"`;return pt`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function mt(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var er=Object.defineProperty,sr=Object.getOwnPropertyDescriptor,ir=(r,t,e,s)=>{for(var i=sr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&er(t,e,i),i};class rr extends q{constructor(t){super(),this._pending=[],this._observer=new W(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}ir([_s()],rr.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis,pe=wt.ShadowRoot&&(wt.ShadyCSS===void 0||wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),De=new WeakMap;let Rs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=De.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&De.set(e,t))}return t}toString(){return this.cssText}};const nr=r=>new Rs(typeof r=="string"?r:r+"",void 0,fe),I=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Rs(e,r,fe)},or=(r,t)=>{if(pe)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=wt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Fe=pe?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return nr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ar,defineProperty:lr,getOwnPropertyDescriptor:cr,getOwnPropertyNames:hr,getOwnPropertySymbols:ur,getPrototypeOf:dr}=Object,C=globalThis,Be=C.trustedTypes,pr=Be?Be.emptyScript:"",Gt=C.reactiveElementPolyfillSupport,nt=(r,t)=>r,Ot={toAttribute(r,t){switch(t){case Boolean:r=r?pr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ge=(r,t)=>!ar(r,t),Ve={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:ge};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);class V extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ve){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&lr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=cr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ve}static _$Ei(){if(this.hasOwnProperty(nt("elementProperties")))return;const t=dr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(nt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(nt("properties"))){const e=this.properties,s=[...hr(e),...ur(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Fe(i))}else t!==void 0&&e.push(Fe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return or(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Ot).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Ot;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ge)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[nt("elementProperties")]=new Map,V[nt("finalized")]=new Map,Gt==null||Gt({ReactiveElement:V}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ot=globalThis,Tt=ot.trustedTypes,qe=Tt?Tt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Us="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Ns="?"+P,fr=`<${Ns}>`,j=document,ht=()=>j.createComment(""),ut=r=>r===null||typeof r!="object"&&typeof r!="function",me=Array.isArray,gr=r=>me(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Kt=`[ 	
\f\r]`,st=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ye=/-->/g,We=/>/g,U=RegExp(`>|${Kt}(?:([^\\s"'>=/]+)(${Kt}*=${Kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,Ke=/"/g,Ls=/^(?:script|style|textarea|title)$/i,mr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),E=mr(1),Z=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Je=new WeakMap,L=j.createTreeWalker(j,129);function Ms(r,t){if(!me(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(t):t}const vr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=st;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===st?f[1]==="!--"?o=Ye:f[1]!==void 0?o=We:f[2]!==void 0?(Ls.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=i??st,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?U:f[3]==='"'?Ke:Ge):o===Ke||o===Ge?o=U:o===Ye||o===We?o=st:(o=U,i=void 0);const h=o===U&&r[l+1].startsWith("/>")?" ":"";n+=o===st?a+fr:u>=0?(s.push(d),a.slice(0,u)+Us+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[Ms(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class dt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=vr(t,e);if(this.el=dt.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=L.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Us)){const c=f[o++],h=i.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?_r:p[1]==="?"?$r:p[1]==="@"?br:zt}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Ls.test(i.tagName)){const u=i.textContent.split(P),c=u.length-1;if(c>0){i.textContent=Tt?Tt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],ht()),L.nextNode(),a.push({type:2,index:++n});i.append(u[c],ht())}}}else if(i.nodeType===8)if(i.data===Ns)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=j.createElement("template");return s.innerHTML=t,s}}function Q(r,t,e=r,s){var o,l;if(t===Z)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=ut(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=Q(r,i._$AS(r,t.values),i,s)),t}class yr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??j).importNode(e,!0);L.currentNode=i;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new vt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Ar(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=j,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class vt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),ut(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==Z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):gr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&ut(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=dt.createElement(Ms(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new yr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Je.get(t.strings);return e===void 0&&Je.set(t.strings,e=new dt(t)),e}k(t){me(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new vt(this.O(ht()),this.O(ht()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=Q(this,t,e,0),o=!ut(t)||t!==this._$AH&&t!==Z,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=Q(this,l[s+a],e,a),d===Z&&(d=this._$AH[a]),o||(o=!ut(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class _r extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class $r extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class br extends zt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??$)===Z)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ar{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const Jt=ot.litHtmlPolyfillSupport;Jt==null||Jt(dt,vt),(ot.litHtmlVersions??(ot.litHtmlVersions=[])).push("3.2.1");const wr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new vt(t.insertBefore(ht(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let x=class extends V{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=wr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Z}};var Ze;x._$litElement$=!0,x.finalized=!0,(Ze=globalThis.litElementHydrateSupport)==null||Ze.call(globalThis,{LitElement:x});const Zt=globalThis.litElementPolyfillSupport;Zt==null||Zt({LitElement:x});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const yt=I`
  body {
    background-color: var(--color-background-page);
    color: var(--color-main-font);
    font-family: var(--font-family-body);
  }

  body.darkmode {
    --color-background-page: rgb(0, 28, 0);
    --color-background-bottom-header: rgb(0, 50, 0);
    --color-background-top-header: rgb(51, 117, 51);
    --icon-fill: white;
    --color-accent: rgb(218, 255, 218);
    --color-main-font: rgb(248, 255, 248);
  }

  header {
    background-image: linear-gradient(
      to bottom,
      var(--color-background-top-header) 0%,
      var(--color-background-bottom-header) 80%,
      transparent 100%
    );
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4.5em;
    padding-left: var(--header-offset);
    padding-right: var(--header-offset);
    color: var(--color-main-font);
  }
  header a {
    display: flex;
    align-items: center;
  }
  header a:hover {
    text-decoration: none;
  }
  header.nav {
    background-color: var(--color-background-page);
    background-image: none;
    height: auto;
    margin-bottom: var(--margin-m);
  }

  h1 {
    text-align: center;
    width: fit-content;
    margin-left: var(--header-offset);
  }
  h1.logo {
    font-size: var(--size-type-xxl);
    margin-left: 0;
    padding-bottom: 10px;
  }

  h2 {
    color: var(--color-accent);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  a,
  button,
  input,
  select {
    font-family: var(--font-family-display);
  }

  a {
    color: currentColor;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  dt {
    color: var(--color-accent);
    font-size: var(--size-type-ml);
    padding: 10px;
  }

  ul {
    list-style-type: none;
  }

  li {
    margin-top: var(--margin-s);
  }

  img {
    max-width: var(--width-scroll-image);
    max-height: var(--width-scroll-image);
  }

  button {
    border-radius: var(--radius-small);
    padding: 5px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: var(--color-background-button);
    cursor: pointer;
    font-weight: bold;
  }

  input {
    background-color: var(--color-background-input);
    padding: 3px;
    padding-left: 5px;
    margin-left: 10px;
    border-width: 1px;
    border-radius: var(--radius-small);
    text-transform: uppercase;
  }

  select {
    text-transform: uppercase;
  }

  .total-cost {
    font-size: var(--font-size-important);
    border: var(--border-small) solid red;
    border-radius: var(--radius-small);
    width: max-content;
    padding: 5px;
  }

  .icon {
    display: inline;
    height: 1.5rem;
    width: 1.5rem;
    fill: currentColor;
  }

  .page-icons {
    display: inline;
    height: 3rem;
    width: 3rem;
    vertical-align: top;
    fill: currentColor;
  }

  header.image {
    background-size: cover;
    background-position: center;
    height: var(--height-scroll-image);
    width: calc(var(--width-scroll-image) + 100px);
    align-items: normal;
    justify-content: center;
    width: var(--width-scroll-image);
    max-width: 600px;
    max-height: 450px;
  }

  h1.image {
    background-color: rgb(255 255 255 /50%);
    height: max-content;
    margin: 0;
  }

  input {
    border-color: green;
    margin-top: var(--margin-s);
  }

  label {
    padding-left: var(--margin-s);
  }

  dt {
    padding-left: var(--margin-xs);
    /* margin-top: var(--margin-xs); */
  }
  dd {
    margin-left: var(--margin-l);
    margin-bottom: var(--margin-xs);
  }
`,_t=I`
  * {
    margin: 0;
    box-sizing: border-box;
  }
  img {
    max-width: 100%;
  }
  ul,
  menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
  }
`;function Er(r){os.relay(r,"auth:message",["auth/signout"])}const Lt=class Lt extends x{render(){return E`
      <header>
        <a href="/">
          <h1 class="logo">Backpack</h1>
        </a>
        <nav>
          <mu-dropdown class="dropdown">
            <a slot="actuator">
              Hi,&nbsp
              <span id="userid"></span>
              !
            </a>
            <menu>
              <li>
                <label
                  @click=${t=>os.relay(t,"darkmode",{checked:t.target.checked})}
                  class="dark-mode-switch"
                >
                  <input type="checkbox" autocomplete="off" />
                  Dark Mode
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout" @click=${Er}>Sign Out</a>
              </li>
              <li class="when-signed-out">
                <a href="/login">Sign In</a>
              </li>
            </menu>
          </mu-dropdown>
        </nav>
        <a href="profile.html">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#account" />
          </svg>
        </a>
      </header>
    `}static initializeOnce(){function t(e,s){e.classList.toggle("darkmode",s)}document.body.addEventListener("darkmode",e=>{var s;return t(e.currentTarget,(s=e.detail)==null?void 0:s.checked)})}};Lt.uses=mt({"mu-dropdown":Xi.Element}),Lt.styles=[yt,_t,I`
      nav {
        display: flex;
        flex-direction: column;
        flex-basis: max-content;
      }
      a[slot="actuator"] {
        color: var(--color-main-font);
        cursor: pointer;
      }
      #userid:empty::before {
        content: "camper";
      }
      menu {
        background-color: var(--color-background-bottom-header);
      }
      menu a {
        color: var(--color-link);
        cursor: pointer;
        text-decoration: underline;
      }
      a:has(#userid:empty) ~ menu > .when-signed-in,
      a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
        display: none;
      }
      li {
        display: grid;
      }
      li a {
        padding-left: var(--margin-s);
        padding-right: var(--margin-s);
        padding-bottom: var(--margin-s);
        justify-self: center;
      }
      li label {
        padding-left: 0;
        padding-right: var(--margin-s);
        justify-self: center;
      }
    `];let Rt=Lt;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xr={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:ge},Sr=(r=xr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function js(r){return(t,e)=>typeof e=="object"?Sr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function kr(r){return js({...r,state:!0,attribute:!1})}var Pr=Object.defineProperty,Cr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Pr(t,e,i),i};const ve=class ve extends x{constructor(){super(...arguments),this.src="http://localhost:3000/api/itineraries/",this.tripIndex=new Array,this._authObserver=new W(this,"backpack:auth"),this._user=new Et.User}render(){const t=this.tripIndex.map(this.renderItem);return E`
      <main class="page">
        <section class="landing">
          <section class="plan">
            <h2>Plan your trip now!</h2>
            <header
              class="gs-image"
              style="background-image: url('/images/2Y1.jpeg')"
            >
              <a href="app/step1" class="gs-link">
                <button class="get-started" href="app/step1">
                  Get Started!
                </button>
              </a>
              <p>Location: Yellowstone</p>
            </header>
            <section class="nav-bar">
              <ul class="nav">
                <li>
                  <a href="app/step1">
                    <svg class="page-icons">
                      <use href="/icons/sprite.svg#campfire" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="step2.html">
                    <svg class="page-icons">
                      <use href="/icons/sprite.svg#backpack" />
                    </svg>
                  </a>
                </li>
              </ul>
            </section>
          </section>
          <section class="itin">
            <h2>See a trip you've already planned:</h2>
            <ul class="itin">
              <li>
                <a
                  href="http://localhost:3000/itinerary/671ff484e9de70a53a387f67"
                >
                  <svg class="page-icons">
                    <use href="/icons/sprite.svg#itinerary" />
                  </svg>
                  <h4>STATIC: Trip to Yellowstone</h4>
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:3000/itinerary/6721180a91b98c720183ddfa"
                >
                  <svg class="page-icons">
                    <use href="/icons/sprite.svg#itinerary" />
                  </svg>
                  <h4>STATIC: Trip to Glacier</h4>
                </a>
              </li>
              ${t}
            </ul>
          </section>
        </section>
      </main>
    `}renderItem(t){return E`
      <li>
        <a href="/itinerary/${t._id.toString()}">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#itinerary" />
          </svg>
          <h4>${t.title}</h4>
        </a>
      </li>
    `}hydrate(t){fetch(t,{headers:Et.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{this.tripIndex=e}).catch(e=>console.log("Failed to tour data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}};ve.styles=[_t,yt,I`
      .landing {
        display: grid;
        grid-template-columns: [start] 1fr 1fr 1fr 1fr [end];
        gap: 5px;
      }

      .landing > header {
        grid-column: start / end;
      }

      h2 {
        text-align: center;
        margin-left: 10px;
      }

      .itin > h2 {
        padding-left: 10px;
        padding-right: 10px;
      }

      .landing > section.plan {
        grid-column: start / 4;
      }

      .itin {
        grid-column: 4 / end;
      }

      section.nav-bar {
        grid-column: start / 4;
        margin-top: var(--margin-m);
      }

      ul.nav {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        list-style-type: none;
        padding: 0;
      }
      li {
        margin: 0;
      }

      ul.itin {
        list-style-type: none;
        padding-top: var(--margin-m);
        padding-bottom: var(--margin-m);
        padding-left: var(--margin-s);
      }
      ul.itin > li > a {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .gs-image {
        background-size: cover;
        background-position: center;
        width: 100%;
        height: 50vw;
        max-height: 575px;
        align-items: center;
        justify-content: center;
        position: relative;
        margin-top: var(--margin-m);
        padding: 0;
      }

      .get-started {
        font-size: var(--size-type-large);
        justify-content: center;
        background-color: var(--color-background-button);
        border-radius: var(--radius-med);
      }

      .gs-link {
        height: fit-content;
        width: fit-content;
      }

      p {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }

      .color-toggle {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    `];let Ut=ve;Cr([kr()],Ut.prototype,"tripIndex");const Mt=class Mt extends x{render(){return E`
      <article>
        <main class="page">
          <login-form api="/auth/login">
            <h2 slot="title">Sign in and get outside!</h2>
          </login-form>
          <p class="register">
            <a href="/register"> Register as a new user!</a>
          </p>
        </main>
      </article>
    `}};Mt.uses=mt({}),Mt.styles=[_t,yt,I`
      article {
        display: flex;
        height: 70vh;
        align-items: center;
        justify-content: center;
      }
      h2 {
        margin-bottom: var(--margin-m);
      }
      p {
        display: flex;
        justify-content: center;
        margin-top: var(--margin-m);
      }
    `];let ie=Mt;var Or=Object.defineProperty,Tr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Or(t,e,i),i};const ye=class ye extends x{render(){return E`
      <header class="image">
        <h1 class="title"><slot name="name">Campsite Name</slot></h1>
      </header>
      <section class="cs-info">
        <div class="column">
          <h3>Features</h3>
          <ul>
            <slot name="features">
              <li>Default Feature 1</li>
              <li>Default Feature 2</li>
            </slot>
          </ul>
        </div>
        <div class="column">
          <h3>Amenities</h3>
          <ul class="list">
            <slot name="amenities">
              <li>Default Amenity 1</li>
              <li>Default Amenity 2</li>
            </slot>
          </ul>
        </div>
      </section>
    `}connectedCallback(){super.connectedCallback(),console.log("Connected to DOM")}firstUpdated(){console.log("First updated"),this.updateBackgroundImage()}updateBackgroundImage(){var e;console.log("Updating background image");const t=(e=this.shadowRoot)==null?void 0:e.querySelector("header.image");if(!t){console.error("Header element not found");return}this.image_url&&(console.log("Image URL:",this.image_url),t.style.backgroundImage=`url(${this.image_url})`)}};ye.styles=[yt,_t,I`
      h1 {
        font-family: var(--font-family-display);
        text-align: center;
        width: fit-content;
        font-size: var(--size-type-large);
        margin-left: 0;
      }
      .image {
        display: flex;
        background-size: cover;
        background-position: center;
        height: 37.5vw;
        width: 100%;
        align-items: normal;
        justify-content: center;
        width: var(--width-scroll-image);
        max-width: 600px;
        max-height: 450px;
        padding: 0;
      }

      h1.title {
        background-color: rgba(245, 245, 245, 0.482);
        width: 100%;
        height: fit-content;
        padding: 10px;
      }

      .cs-info {
        display: grid;
        grid-template-columns: 1fr 1fr; /* Two equal columns */
        gap: 20px; /* Adds space between the columns */
      }

      h3 {
        font-family: var(--font-family-body);
        color: var(--color-accent);
        margin-top: var(--margin-s);
        font-weight: normal;
        font-size: var(--size-type-ml);
      }
    `];let Nt=ye;Tr([js({type:String})],Nt.prototype,"image_url");const jt=class jt extends x{constructor(){super(...arguments),this._authObserver=new W(this,"backpack:auth"),this._user=new Et.User}render(){return E`
      <main class="page">
        <section class="thr-sections">
          <header class="nav">
            <a href="index.html">
              <svg class="icon">
                <use href="/icons/sprite.svg#back" />
              </svg>
              <svg class="icon">
                <use href="/icons/sprite.svg#home" />
              </svg>
            </a>
            <a href="step2.html">
              <svg class="icon">
                <use href="/icons/sprite.svg#backpack" />
              </svg>
              <svg class="icon">
                <use href="/icons/sprite.svg#next" />
              </svg>
            </a>
          </header>
          <section id="location" class="locations">
            <h1>Locations</h1>
            <dl>
              <dt>Yellowstone National Park</dt>
              <dd>Geysers</dd>
              <dd>Rivers</dd>
              <dd>Fishing</dd>
              <dd>Thermal Areas</dd>
              <dt>Glacier National Park</dt>
              <dd>High mountains</dd>
              <dd>Alpine Lakes</dd>
              <dd>Glaciers</dd>
              <dd>Big-horned sheep</dd>
              <dt>Yosemite National Park</dt>
              <dd>Half dome</dd>
              <dd>Waterfalls</dd>
              <dd>Sequoia Trees</dd>
            </dl>
          </section>
          <section id="campsite" class="campsite">
            <camp-site image_url="/images/2Y1.jpeg">
              <span slot="name">Campsite 2Y1: Agate Creek</span>
              <ul slot="features">
                <li>Yellowstone River</li>
                <li>Canyon</li>
                <li>Evergreen Forest</li>
                <li>Trout Fishing</li>
              </ul>
              <ul slot="amenities">
                <li>Bear Pole</li>
                <li>No Bathroom</li>
                <li>Fire Ring</li>
                <li>No Fire Grate</li>
              </ul>
            </camp-site>
          </section>
          <section id="group" class="group">
            <h1>Group members</h1>
            <ol class="">
              <li>
                <div class="input-cont">
                  <input type="text" value="person1" />
                </div>
              </li>
              <li>
                <div class="input-cont">
                  <input type="text" value="person2" />
                  <svg class="icon remove">
                    <use href="/icons/sprite.svg#trash" />
                  </svg>
                </div>
              </li>
              <li>
                <div class="input-cont">
                  <input type="text" value="person3" />
                  <svg class="icon remove">
                    <use href="/icons/sprite.svg#trash" />
                  </svg>
                </div>
              </li>
              <li>
                <div class="input-cont">
                  <input type="text" value="person4" />
                  <svg class="icon remove">
                    <use href="/icons/sprite.svg#trash" />
                  </svg>
                </div>
              </li>
              <li>
                <div class="input-cont">
                  <input type="text" value="person5" />
                  <svg class="icon remove">
                    <use href="/icons/sprite.svg#trash" />
                  </svg>
                </div>
              </li>
              <li>
                <div class="input-cont">
                  <input type="text" value="person6" />
                  <svg class="icon remove">
                    <use href="/icons/sprite.svg#trash" />
                  </svg>
                </div>
              </li>
              <li>
                <div class="input-cont">
                  <input type="text" value="person7" />
                  <svg class="icon remove">
                    <use href="/icons/sprite.svg#trash" />
                  </svg>
                </div>
              </li>
              <li>
                <div class="input-cont">
                  <input type="text" value="person8" />
                  <svg class="icon remove">
                    <use href="/icons/sprite.svg#trash" />
                  </svg>
                </div>
              </li>
              <li>
                <div class="input-cont">
                  <input type="text" value="person9" />
                  <svg class="icon remove">
                    <use href="/icons/sprite.svg#trash" />
                  </svg>
                </div>
              </li>
              <li>
                <div class="input-cont">
                  <input type="text" value="person10" />
                  <svg class="icon remove">
                    <use href="/icons/sprite.svg#trash" />
                  </svg>
                </div>
              </li>
            </ol>
            <button>ADD</button>
          </section>
        </section>
      </main>
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t)})}};jt.uses=mt({"camp-site":Nt}),jt.styles=[_t,yt,I`
      .thr-sections {
        display: grid;
        grid-template-columns: [start] repeat(8, 1fr) [end];
        gap: 5px;
      }

      .thr-sections > header {
        grid-column: start / end;
      }

      .locations {
        grid-column: start / 3;
        padding-left: var(--margin-s);
      }

      .locations > dl {
        margin-top: var(--margin-m);
      }

      .campsite {
        grid-column: 3 / 7;
      }

      .group {
        grid-column: 7 / end;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .group > button {
        margin-top: var(--margin-m);
        width: 50%;
      }

      .group > ol {
        margin-top: var(--margin-m);
      }

      .input-cont {
        /* align-items: baseline; */
        display: flex;
        align-items: center;
      }
      input {
        margin-top: 0;
      }

      .remove {
        cursor: pointer;
        fill: rgb(255, 0, 0);
        margin-left: var(--margin-s);
      }
    `];let re=jt;const Rr=[{path:"/app/itinerary/:id",view:r=>E`
      <!-- <tour-view tour-id=${r.id}></tour-view> -->
    `},{path:"/app/step1",view:()=>E` <step1-view></step1-view>`},{path:"/app",view:()=>E` <home-view></home-view> `},{path:"/",redirect:"/app"}],_e=class _e extends x{render(){return E` <mu-switch></mu-switch> `}connectedCallback(){super.connectedCallback(),Rt.initializeOnce()}};_e.uses=mt({"home-view":Ut,"login-view":ie,"step1-view":re});let ne=_e;mt({"mu-auth":Et.Provider,"mu-history":oi.Provider,"mu-switch":class extends Zi.Element{constructor(){super(Rr,"backpack:history","backpack:auth")}},"backpack-app":ne,"bp-header":Rt});
