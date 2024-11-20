(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var W,Ne;class ht extends Error{}ht.prototype.name="InvalidTokenError";function ei(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function si(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return ei(t)}catch{return atob(t)}}function hs(r,t){if(typeof r!="string")throw new ht("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new ht(`Invalid token specified: missing part #${e+1}`);let i;try{i=si(s)}catch(n){throw new ht(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new ht(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const ii="mu:context",ie=`${ii}:change`;class ri{constructor(t,e){this._proxy=ni(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class pe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ri(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ie,t),t}detach(t){this.removeEventListener(ie,t)}}function ni(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(ie,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function oi(r,t){const e=us(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function us(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return us(r,i.host)}class ai extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ds(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ai(e,r))}class ge{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function li(r){return t=>({...t,...r})}const re="mu:auth:jwt",ps=class gs extends ge{constructor(t,e){super((s,i)=>this.update(s,i),t,gs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(hi(s)),Zt(i);case"auth/signout":return e(ui()),Zt(this._redirectForLogin);case"auth/redirect":return Zt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ps.EVENT_TYPE="auth:message";let ms=ps;const fs=ds(ms.EVENT_TYPE);function Zt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class ci extends pe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=X.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ms(this.context,this.redirect).attach(this)}}class Q{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(re),t}}class X extends Q{constructor(t){super();const e=hs(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new X(t);return localStorage.setItem(re,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(re);return t?X.authenticate(t):new Q}}function hi(r){return li({user:X.authenticate(r),token:r})}function ui(){return r=>{const t=r.user;return{user:t&&t.authenticated?Q.deauthenticate(t):t,token:""}}}function di(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function pi(r){return r.authenticated?hs(r.token||""):{}}const R=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:X,Provider:ci,User:Q,dispatch:fs,headers:di,payload:pi},Symbol.toStringTag,{value:"Module"}));function St(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function ne(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const vs=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ne,relay:St},Symbol.toStringTag,{value:"Module"}));function ys(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const gi=new DOMParser;function D(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const g=e[d-1];return g instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[g,a]}).flat().join(""),i=gi.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const g=o.querySelector(`ins#mu-html-${d}`);if(g){const u=g.parentNode;u==null||u.replaceChild(a,g)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Me(a);case"bigint":case"boolean":case"number":case"symbol":return Me(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const g=new DocumentFragment,u=a.map(l);return g.replaceChildren(...u),g}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Me(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function zt(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let mi=(W=class extends HTMLElement{constructor(){super(),this._state={},zt(this).template(W.template).styles(W.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),St(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},fi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},W.template=D`
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
  `,W.styles=ys`
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
  `,W);function fi(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const vi=Object.freeze(Object.defineProperty({__proto__:null,Element:mi},Symbol.toStringTag,{value:"Module"})),bs=class _s extends ge{constructor(t){super((e,s)=>this.update(e,s),t,_s.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(bi(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(_i(s,i));break}}}};bs.EVENT_TYPE="history:message";let me=bs;class je extends pe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=yi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),fe(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new me(this.context).attach(this)}}function yi(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function bi(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function _i(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const fe=ds(me.EVENT_TYPE),$s=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:je,Provider:je,Service:me,dispatch:fe},Symbol.toStringTag,{value:"Module"}));class k{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Le(this._provider,t);this._effects.push(i),e(i)}else oi(this._target,this._contextLabel).then(i=>{const n=new Le(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Le{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ws=class As extends HTMLElement{constructor(){super(),this._state={},this._user=new Q,this._authObserver=new k(this,"blazing:auth"),zt(this).template(As.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;$i(i,this._state,e,this.authorization).then(n=>ot(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ot(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ie(this.src,this.authorization).then(e=>{this._state=e,ot(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ie(this.src,this.authorization).then(i=>{this._state=i,ot(i,this)});break;case"new":s&&(this._state={},ot({},this));break}}};ws.observedAttributes=["src","new","action"];ws.template=D`
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
  `;function Ie(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function ot(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function $i(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const xs=class Es extends ge{constructor(t,e){super(e,t,Es.EVENT_TYPE,!1)}};xs.EVENT_TYPE="mu:message";let ks=xs;class wi extends pe{constructor(t,e,s){super(e),this._user=new Q,this._updateFn=t,this._authObserver=new k(this,s)}connectedCallback(){const t=new ks(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Ai=Object.freeze(Object.defineProperty({__proto__:null,Provider:wi,Service:ks},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Et=globalThis,ve=Et.ShadowRoot&&(Et.ShadyCSS===void 0||Et.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ye=Symbol(),He=new WeakMap;let Ss=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ye)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ve&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=He.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&He.set(e,t))}return t}toString(){return this.cssText}};const xi=r=>new Ss(typeof r=="string"?r:r+"",void 0,ye),Ei=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Ss(e,r,ye)},ki=(r,t)=>{if(ve)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Et.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ze=ve?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return xi(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Si,defineProperty:Pi,getOwnPropertyDescriptor:Ci,getOwnPropertyNames:Oi,getOwnPropertySymbols:Ti,getPrototypeOf:Ri}=Object,tt=globalThis,De=tt.trustedTypes,Ui=De?De.emptyScript:"",Fe=tt.reactiveElementPolyfillSupport,ut=(r,t)=>r,Pt={toAttribute(r,t){switch(t){case Boolean:r=r?Ui:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},be=(r,t)=>!Si(r,t),Be={attribute:!0,type:String,converter:Pt,reflect:!1,hasChanged:be};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),tt.litPropertyMetadata??(tt.litPropertyMetadata=new WeakMap);let K=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Pi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Ci(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Be}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Ri(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...Oi(e),...Ti(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(ze(i))}else t!==void 0&&e.push(ze(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ki(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Pt).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Pt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??be)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[ut("elementProperties")]=new Map,K[ut("finalized")]=new Map,Fe==null||Fe({ReactiveElement:K}),(tt.reactiveElementVersions??(tt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,Ot=Ct.trustedTypes,qe=Ot?Ot.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ps="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Cs="?"+C,Ni=`<${Cs}>`,F=document,gt=()=>F.createComment(""),mt=r=>r===null||typeof r!="object"&&typeof r!="function",_e=Array.isArray,Mi=r=>_e(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Qt=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ye=/-->/g,Ve=/>/g,L=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),We=/'/g,Ge=/"/g,Os=/^(?:script|style|textarea|title)$/i,ji=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),lt=ji(1),et=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ke=new WeakMap,H=F.createTreeWalker(F,129);function Ts(r,t){if(!_e(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(t):t}const Li=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=at;for(let l=0;l<e;l++){const a=r[l];let d,g,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,g=o.exec(a),g!==null);)c=o.lastIndex,o===at?g[1]==="!--"?o=Ye:g[1]!==void 0?o=Ve:g[2]!==void 0?(Os.test(g[2])&&(i=RegExp("</"+g[2],"g")),o=L):g[3]!==void 0&&(o=L):o===L?g[0]===">"?(o=i??at,u=-1):g[1]===void 0?u=-2:(u=o.lastIndex-g[2].length,d=g[1],o=g[3]===void 0?L:g[3]==='"'?Ge:We):o===Ge||o===We?o=L:o===Ye||o===Ve?o=at:(o=L,i=void 0);const h=o===L&&r[l+1].startsWith("/>")?" ":"";n+=o===at?a+Ni:u>=0?(s.push(d),a.slice(0,u)+Ps+a.slice(u)+C+h):a+C+(u===-2?l:h)}return[Ts(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let oe=class Rs{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,g]=Li(t,e);if(this.el=Rs.createElement(d,s),H.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=H.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Ps)){const c=g[o++],h=i.getAttribute(u).split(C),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Hi:p[1]==="?"?zi:p[1]==="@"?Di:Dt}),i.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Os.test(i.tagName)){const u=i.textContent.split(C),c=u.length-1;if(c>0){i.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],gt()),H.nextNode(),a.push({type:2,index:++n});i.append(u[c],gt())}}}else if(i.nodeType===8)if(i.data===Cs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(t,e){const s=F.createElement("template");return s.innerHTML=t,s}};function st(r,t,e=r,s){var i,n;if(t===et)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=mt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=st(r,o._$AS(r,t.values),o,s)),t}class Ii{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??F).importNode(e,!0);H.currentNode=i;let n=H.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new _t(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Fi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=H.nextNode(),o++)}return H.currentNode=F,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class _t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=st(this,t,e),mt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Mi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=oe.createElement(Ts(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Ii(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ke.get(t.strings);return e===void 0&&Ke.set(t.strings,e=new oe(t)),e}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new _t(this.O(gt()),this.O(gt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=st(this,t,e,0),o=!mt(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=st(this,l[s+a],e,a),d===et&&(d=this._$AH[a]),o||(o=!mt(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Hi extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class zi extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Di extends Dt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=st(this,t,e,0)??_)===et)return;const s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Fi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const Je=Ct.litHtmlPolyfillSupport;Je==null||Je(oe,_t),(Ct.litHtmlVersions??(Ct.litHtmlVersions=[])).push("3.2.0");const Bi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new _t(t.insertBefore(gt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Z=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Bi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return et}};Z._$litElement$=!0,Z.finalized=!0,(Ne=globalThis.litElementHydrateSupport)==null||Ne.call(globalThis,{LitElement:Z});const Ze=globalThis.litElementPolyfillSupport;Ze==null||Ze({LitElement:Z});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qi={attribute:!0,type:String,converter:Pt,reflect:!1,hasChanged:be},Yi=(r=qi,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Us(r){return(t,e)=>typeof e=="object"?Yi(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ns(r){return Us({...r,state:!0,attribute:!1})}function Vi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Wi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ms={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,f,m,v,Vt){var A=v.length-1;switch(m){case 1:return new f.Root({},[v[A-1]]);case 2:return new f.Root({},[new f.Literal({value:""})]);case 3:this.$=new f.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new f.Literal({value:v[A]});break;case 7:this.$=new f.Splat({name:v[A]});break;case 8:this.$=new f.Param({name:v[A]});break;case 9:this.$=new f.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(f,m){this.message=f,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],f=[null],m=[],v=this.table,Vt="",A=0,Te=0,Zs=2,Re=1,Qs=m.slice.call(arguments,1),b=Object.create(this.lexer),M={yy:{}};for(var Wt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Wt)&&(M.yy[Wt]=this.yy[Wt]);b.setInput(c,M.yy),M.yy.lexer=b,M.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var Gt=b.yylloc;m.push(Gt);var Xs=b.options&&b.options.ranges;typeof M.yy.parseError=="function"?this.parseError=M.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ti=function(){var V;return V=b.lex()||Re,typeof V!="number"&&(V=h.symbols_[V]||V),V},w,j,x,Kt,Y={},At,P,Ue,xt;;){if(j=p[p.length-1],this.defaultActions[j]?x=this.defaultActions[j]:((w===null||typeof w>"u")&&(w=ti()),x=v[j]&&v[j][w]),typeof x>"u"||!x.length||!x[0]){var Jt="";xt=[];for(At in v[j])this.terminals_[At]&&At>Zs&&xt.push("'"+this.terminals_[At]+"'");b.showPosition?Jt="Parse error on line "+(A+1)+`:
`+b.showPosition()+`
Expecting `+xt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Jt="Parse error on line "+(A+1)+": Unexpected "+(w==Re?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Jt,{text:b.match,token:this.terminals_[w]||w,line:b.yylineno,loc:Gt,expected:xt})}if(x[0]instanceof Array&&x.length>1)throw new Error("Parse Error: multiple actions possible at state: "+j+", token: "+w);switch(x[0]){case 1:p.push(w),f.push(b.yytext),m.push(b.yylloc),p.push(x[1]),w=null,Te=b.yyleng,Vt=b.yytext,A=b.yylineno,Gt=b.yylloc;break;case 2:if(P=this.productions_[x[1]][1],Y.$=f[f.length-P],Y._$={first_line:m[m.length-(P||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(P||1)].first_column,last_column:m[m.length-1].last_column},Xs&&(Y._$.range=[m[m.length-(P||1)].range[0],m[m.length-1].range[1]]),Kt=this.performAction.apply(Y,[Vt,Te,A,M.yy,x[1],f,m].concat(Qs)),typeof Kt<"u")return Kt;P&&(p=p.slice(0,-1*P*2),f=f.slice(0,-1*P),m=m.slice(0,-1*P)),p.push(this.productions_[x[1]][0]),f.push(Y.$),m.push(Y._$),Ue=v[p[p.length-2]][p[p.length-1]],p.push(Ue);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var f=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===f.length?this.yylloc.first_column:0)+f[f.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,f,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),f=c[0].match(/(?:\r\n?|\n).*/g),f&&(this.yylineno+=f.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:f?f[f.length-1].length-f[f.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,f;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(p=this._input.match(this.rules[m[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,f=v,this.options.backtrack_lexer){if(c=this.test_match(p,m[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[f]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,f,m){switch(f){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function g(){this.yy={}}return g.prototype=a,a.Parser=g,new g}();typeof Wi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Ms);function G(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var js={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},Ls=Ms.parser;Ls.yy=js;var Gi=Ls,Ki=Object.keys(js);function Ji(r){return Ki.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Is=Ji,Zi=Is,Qi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Hs(r){this.captures=r.captures,this.re=r.re}Hs.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Xi=Zi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Qi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Hs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),tr=Xi,er=Is,sr=er({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),ir=sr,rr=Gi,nr=tr,or=ir;$t.prototype=Object.create(null);$t.prototype.match=function(r){var t=nr.visit(this.ast),e=t.match(r);return e||!1};$t.prototype.reverse=function(r){return or.visit(this.ast,r)};function $t(r){var t;if(this?t=this:t=Object.create($t.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=rr.parse(r),t}var ar=$t,lr=ar,cr=lr;const hr=Vi(cr);var ur=Object.defineProperty,zs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&ur(t,e,i),i};const Ds=class extends Z{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>lt` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new hr(i.path)})),this._historyObserver=new k(this,e),this._authObserver=new k(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),lt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(fs(this,"auth/redirect"),lt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):lt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),lt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){fe(this,"history/redirect",{href:t})}};Ds.styles=Ei`
    :host,
    main {
      display: contents;
    }
  `;let Tt=Ds;zs([Ns()],Tt.prototype,"_user");zs([Ns()],Tt.prototype,"_match");const dr=Object.freeze(Object.defineProperty({__proto__:null,Element:Tt,Switch:Tt},Symbol.toStringTag,{value:"Module"})),Fs=class Bs extends HTMLElement{constructor(){if(super(),zt(this).template(Bs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Fs.template=D`
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
  `;let pr=Fs;const gr=Object.freeze(Object.defineProperty({__proto__:null,Element:pr},Symbol.toStringTag,{value:"Module"})),$e=class ae extends HTMLElement{constructor(){super(),this._array=[],zt(this).template(ae.template).styles(ae.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(qs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ne(t,"button.add")?St(t,"input-array:add"):ne(t,"button.remove")&&St(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],fr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};$e.template=D`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;$e.styles=ys`
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
  `;let mr=$e;function fr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(qs(e)))}function qs(r,t){const e=r===void 0?D`<input />`:D`<input value="${r}" />`;return D`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}const vr=Object.freeze(Object.defineProperty({__proto__:null,Element:mr},Symbol.toStringTag,{value:"Module"}));function nt(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var yr=Object.defineProperty,br=Object.getOwnPropertyDescriptor,_r=(r,t,e,s)=>{for(var i=br(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&yr(t,e,i),i};class Ys extends Z{constructor(t){super(),this._pending=[],this._observer=new k(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}_r([Us()],Ys.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,we=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ae=Symbol(),Qe=new WeakMap;let Vs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(we&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Qe.set(e,t))}return t}toString(){return this.cssText}};const $r=r=>new Vs(typeof r=="string"?r:r+"",void 0,Ae),S=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Vs(e,r,Ae)},wr=(r,t)=>{if(we)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=kt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Xe=we?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return $r(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ar,defineProperty:xr,getOwnPropertyDescriptor:Er,getOwnPropertyNames:kr,getOwnPropertySymbols:Sr,getPrototypeOf:Pr}=Object,T=globalThis,ts=T.trustedTypes,Cr=ts?ts.emptyScript:"",Xt=T.reactiveElementPolyfillSupport,dt=(r,t)=>r,Rt={toAttribute(r,t){switch(t){case Boolean:r=r?Cr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},xe=(r,t)=>!Ar(r,t),es={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:xe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),T.litPropertyMetadata??(T.litPropertyMetadata=new WeakMap);class J extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=es){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&xr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Er(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??es}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=Pr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,s=[...kr(e),...Sr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Xe(i))}else t!==void 0&&e.push(Xe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Rt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Rt;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??xe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[dt("elementProperties")]=new Map,J[dt("finalized")]=new Map,Xt==null||Xt({ReactiveElement:J}),(T.reactiveElementVersions??(T.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt=globalThis,Ut=pt.trustedTypes,ss=Ut?Ut.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ws="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,Gs="?"+O,Or=`<${Gs}>`,B=document,ft=()=>B.createComment(""),vt=r=>r===null||typeof r!="object"&&typeof r!="function",Ee=Array.isArray,Tr=r=>Ee(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",te=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,is=/-->/g,rs=/>/g,I=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ns=/'/g,os=/"/g,Ks=/^(?:script|style|textarea|title)$/i,Rr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=Rr(1),it=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),as=new WeakMap,z=B.createTreeWalker(B,129);function Js(r,t){if(!Ee(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ss!==void 0?ss.createHTML(t):t}const Ur=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ct;for(let l=0;l<e;l++){const a=r[l];let d,g,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,g=o.exec(a),g!==null);)c=o.lastIndex,o===ct?g[1]==="!--"?o=is:g[1]!==void 0?o=rs:g[2]!==void 0?(Ks.test(g[2])&&(i=RegExp("</"+g[2],"g")),o=I):g[3]!==void 0&&(o=I):o===I?g[0]===">"?(o=i??ct,u=-1):g[1]===void 0?u=-2:(u=o.lastIndex-g[2].length,d=g[1],o=g[3]===void 0?I:g[3]==='"'?os:ns):o===os||o===ns?o=I:o===is||o===rs?o=ct:(o=I,i=void 0);const h=o===I&&r[l+1].startsWith("/>")?" ":"";n+=o===ct?a+Or:u>=0?(s.push(d),a.slice(0,u)+Ws+a.slice(u)+O+h):a+O+(u===-2?l:h)}return[Js(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class yt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,g]=Ur(t,e);if(this.el=yt.createElement(d,s),z.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=z.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Ws)){const c=g[o++],h=i.getAttribute(u).split(O),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Mr:p[1]==="?"?jr:p[1]==="@"?Lr:Ft}),i.removeAttribute(u)}else u.startsWith(O)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Ks.test(i.tagName)){const u=i.textContent.split(O),c=u.length-1;if(c>0){i.textContent=Ut?Ut.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],ft()),z.nextNode(),a.push({type:2,index:++n});i.append(u[c],ft())}}}else if(i.nodeType===8)if(i.data===Gs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(O,u+1))!==-1;)a.push({type:7,index:n}),u+=O.length-1}n++}}static createElement(t,e){const s=B.createElement("template");return s.innerHTML=t,s}}function rt(r,t,e=r,s){var o,l;if(t===it)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=vt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=rt(r,i._$AS(r,t.values),i,s)),t}class Nr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??B).importNode(e,!0);z.currentNode=i;let n=z.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new wt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Ir(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=z.nextNode(),o++)}return z.currentNode=B,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),vt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==it&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Tr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=yt.createElement(Js(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Nr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=as.get(t.strings);return e===void 0&&as.set(t.strings,e=new yt(t)),e}k(t){Ee(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new wt(this.O(ft()),this.O(ft()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Ft{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=rt(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==it,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=rt(this,l[s+a],e,a),d===it&&(d=this._$AH[a]),o||(o=!vt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Mr extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class jr extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Lr extends Ft{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??$)===it)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ir{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}}const ee=pt.litHtmlPolyfillSupport;ee==null||ee(yt,wt),(pt.litHtmlVersions??(pt.litHtmlVersions=[])).push("3.2.1");const Hr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new wt(t.insertBefore(ft(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let E=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Hr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return it}};var cs;E._$litElement$=!0,E.finalized=!0,(cs=globalThis.litElementHydrateSupport)==null||cs.call(globalThis,{LitElement:E});const se=globalThis.litElementPolyfillSupport;se==null||se({LitElement:E});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const zr={};function Dr(r,t,e){switch(r[0]){case"trip/select":Fr(r[1],e).then(i=>t(n=>({...n,trip:i})));break;case"trip/save":Br(r[1],e).then(i=>t(n=>({...n,trip:i}))).then(()=>{const{onSuccess:i}=r[1];i&&i()}).catch(i=>{const{onFailure:n}=r[1];n&&n(i)});break;default:const s=r[0];throw new Error(`Unhandled Auth message ${s}`)}}function Fr(r,t){return fetch(`http://localhost:3000/api/itineraries/${r.tripId}`,{headers:R.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("TRIP:",e),e})}function Br(r,t){return fetch(`/api/itineraries/${r.tripId}`,{method:"PUT",headers:{"Content-Type":"application/json",...R.headers(t)},body:JSON.stringify(r.trip)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save profile for ${r.tripId}`)}).then(e=>{if(e)return e})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qr={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:xe},Yr=(r=qr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Bt(r){return(t,e)=>typeof e=="object"?Yr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function qt(r){return Bt({...r,state:!0,attribute:!1})}const U=S`
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
    margin-top: var(--margin-s);
  }

  h1 {
    text-align: center;
    width: fit-content;
    margin-left: var(--header-offset);
    font-size: var(--size-type-large);
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
`,N=S`
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
`;var Vr=Object.defineProperty,Wr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Vr(t,e,i),i};function Gr(r){vs.relay(r,"auth:message",["auth/signout"])}function Kr(r){const e=r.target.checked;vs.relay(r,"darkmode",{checked:e})}const jt=class jt extends E{constructor(){super(...arguments),this.userid="camper",this._authObserver=new k(this,"backpack:auth")}render(){return y`
      <header>
        <a href="/">
          <h1 class="logo">Backpack</h1>
        </a>
        <nav>
          <mu-dropdown class="dropdown">
            <a slot="actuator">
              Hi,&nbsp
              <span id="userid">${this.userid}</span>
              !
            </a>
            <menu>
              <li>
                <label @change=${Kr} class="dark-mode-switch">
                  <input type="checkbox" autocomplete="off" />
                  Dark Mode
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout" @click=${Gr}>Sign Out</a>
              </li>
              <li class="when-signed-out">
                <a href="/login">Sign In</a>
              </li>
            </menu>
          </mu-dropdown>
        </nav>
        <a href="/app/profile">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#account" />
          </svg>
        </a>
      </header>
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&t.username!==this.userid&&(this.userid=t.username)})}static initializeOnce(){function t(e,s){e.classList.toggle("darkmode",s)}document.body.addEventListener("darkmode",e=>{var s;return t(e.currentTarget,(s=e.detail)==null?void 0:s.checked)})}};jt.uses=nt({"mu-dropdown":gr.Element}),jt.styles=[U,N,S`
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
    `];let bt=jt;Wr([qt()],bt.prototype,"userid");var Jr=Object.defineProperty,Zr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Jr(t,e,i),i};const ke=class ke extends E{constructor(){super(...arguments),this.src="http://localhost:3000/api/itineraries/",this.tripIndex=new Array,this._authObserver=new k(this,"backpack:auth"),this._user=new R.User}render(){const t=this.tripIndex.map(this.renderItem);return y`
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
                <a href="app/itinerary/671ff484e9de70a53a387f67">
                  <svg class="page-icons">
                    <use href="/icons/sprite.svg#itinerary" />
                  </svg>
                  <h4>STATIC: Trip to Yellowstone</h4>
                </a>
              </li>
              <li>
                <a href="app/itinerary/6721180a91b98c720183ddfa">
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
    `}renderItem(t){return y`
      <li>
        <a href="app/itinerary/${t._id.toString()}">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#itinerary" />
          </svg>
          <h4>${t.title}</h4>
        </a>
      </li>
    `}hydrate(t){fetch(t,{headers:R.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{this.tripIndex=e}).catch(e=>console.log("Failed to tour data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}};ke.styles=[N,U,S`
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
    `];let Nt=ke;Zr([qt()],Nt.prototype,"tripIndex");const Lt=class Lt extends E{render(){return y`
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
    `}};Lt.uses=nt({}),Lt.styles=[N,U,S`
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
    `];let le=Lt;var Qr=Object.defineProperty,Xr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Qr(t,e,i),i};const Se=class Se extends E{render(){return y`
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
    `}connectedCallback(){super.connectedCallback(),console.log("Connected to DOM")}firstUpdated(){this.updateBackgroundImage()}updateBackgroundImage(){var e;console.log("Updating background image");const t=(e=this.shadowRoot)==null?void 0:e.querySelector("header.image");if(!t){console.error("Header element not found");return}this.image_url&&(console.log("Image URL:",this.image_url),t.style.backgroundImage=`url(${this.image_url})`)}};Se.styles=[U,N,S`
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
    `];let Mt=Se;Xr([Bt({type:String})],Mt.prototype,"image_url");const It=class It extends E{constructor(){super(...arguments),this._authObserver=new k(this,"backpack:auth"),this._user=new R.User}render(){return y`
      <main class="page">
        <section class="thr-sections">
          <header class="nav">
            <a href="/app">
              <svg class="icon">
                <use href="/icons/sprite.svg#back" />
              </svg>
              <svg class="icon">
                <use href="/icons/sprite.svg#home" />
              </svg>
            </a>
            <a href="/app/step2">
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
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t)})}};It.uses=nt({"camp-site":Mt}),It.styles=[N,U,S`
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
    `];let ce=It;const Pe=class Pe extends E{constructor(){super(...arguments),this._authObserver=new k(this,"backpack:auth"),this._user=new R.User}render(){return y`
      <main class="page">
        <section class="thr-sections">
          <header class="nav">
            <a href="/app/step1">
              <svg class="icon">
                <use href="/icons/sprite.svg#back" />
              </svg>
              <svg class="icon">
                <use href="/icons/sprite.svg#campfire" />
              </svg>
            </a>
            <a href="/app">
              <svg class="icon">
                <use href="/icons/sprite.svg#check" />
              </svg>
            </a>
          </header>
          <section id="activity" class="activity">
            <header class="act-head">
              <h1>Activity: Fishing</h1>
              <button>ADD</button>
            </header>
            <dl>
              <dt>Extra gear:</dt>
              <dd>Fishing rod</dd>
              <dd>Tackle</dd>
              <dd>Fishing Liscense</dd>
            </dl>
            <img src="/images/fishing.jpeg" />
            <img src="/images/fishing2.jpeg" />
            <img src="/images/fishing3.jpeg" />
          </section>
          <section id="gear" class="gear">
            <h1>What to pack</h1>
            <h2>Group items</h2>
            <input type="checkbox" id="group1" name="group1" value="group" />
            <label for="group1">Medical supplies</label><br />
            <input type="checkbox" id="group2" name="group2" value="group" />
            <label for="group2">Tent</label><br />
            <input type="checkbox" id="group3" name="group3" value="group" />
            <label for="group3">Pots and pans</label><br />
            <input type="checkbox" id="group4" name="group4" value="group" />
            <label for="group4">Bug spray</label><br />
            <input type="checkbox" id="group5" name="group5" value="group" />
            <label for="group5">Bear spray</label><br />
            <input type="checkbox" id="group6" name="group6" value="group" />
            <label for="group6">Bear rope</label><br />
            <h2>Individual Items</h2>
            <input type="checkbox" id="item1" name="item1" value="item" />
            <label for="item1">Rain jacket and pants</label><br />
            <input type="checkbox" id="item2" name="item2" value="item" />
            <label for="item2">Pocket knife</label><br />
            <input type="checkbox" id="item3" name="item3" value="item" />
            <label for="item3">Water bottle</label><br />
            <input type="checkbox" id="item4" name="item4" value="item" />
            <label for="item4">Hat</label><br />
            <input type="checkbox" id="item5" name="item5" value="item" />
            <label for="item5">Clothing</label><br />
            <input type="checkbox" id="item6" name="item6" value="item" />
            <label for="item6">Hiking shoes</label><br />
          </section>
          <section id="food" class="food">
            <h1>Meals</h1>
            <h2>3 Breakfasts</h2>
            <input
              type="checkbox"
              id="breakfast1"
              name="breakfast1"
              value="breakfast"
            />
            <label for="breakfast1">Bagel and cream cheese</label><br />
            <input
              type="checkbox"
              id="breakfast2"
              name="breakfast2"
              value="breakfast"
            />
            <label for="breakfast2">Breakfast Tacos</label><br />
            <input
              type="checkbox"
              id="breakfast3"
              name="breakfast3"
              value="breakfast"
            />
            <label for="breakfast3">Oatmeal</label><br />
            <h2>3 Lunches</h2>
            <input type="checkbox" id="lunch1" name="lunch1" value="lunch" />
            <label for="lunch1">PB&J Tortillas + Summer Sausage + Cheese</label
            ><br />
            <input type="checkbox" id="lunch2" name="lunch2" value="lunch" />
            <label for="lunch2">Hamburger Helper</label><br />
            <input type="checkbox" id="lunch3" name="lunch3" value="lunch" />
            <label for="lunch3">Ham/Turkey and Cheese Sandwiches</label><br />
            <h2>3 Dinners</h2>
            <input type="checkbox" id="dinner1" name="dinner1" value="dinner" />
            <label for="dinner1">Steak and Mashed</label><br />
            <input type="checkbox" id="dinner2" name="dinner2" value="dinner" />
            <label for="dinner2">Ramen + Ground Beef</label><br />
            <input type="checkbox" id="dinner3" name="dinner3" value="dinner" />
            <label for="dinner3">Jumbolaya + Kielbasa</label><br />
            <h2>Misc.</h2>
            <input type="checkbox" id="misc1" name="misc1" value="misc" />
            <label for="misc1">Protein Bars</label><br />
            <input type="checkbox" id="misc2" name="misc2" value="misc" />
            <label for="misc2">Salt + Pepper</label><br />
            <input type="checkbox" id="misc3" name="misc3" value="misc" />
            <label for="misc3">Butter</label><br />
          </section>
        </section>
      </main>
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t)})}};Pe.styles=[N,U,S`
      .thr-sections {
        display: grid;
        grid-template-columns: [start] repeat(7, 1fr) [end];
        gap: 5px;
      }

      .thr-sections > header {
        grid-column: start / end;
      }

      .activity {
        grid-column: start / 4;
      }

      header.act-head {
        background-image: none;
        height: fit-content;
        padding-right: var(--margin-m);
      }

      .gear {
        grid-column: 4 / 6;
      }

      dl {
        margin-bottom: var(--margin-l);
        margin-top: var(--margin-m);
        margin-left: var(--margin-s);
      }

      dd {
        margin-top: var(--margin-s);
      }

      .food {
        grid-column: 6 / 8;
      }

      h2 {
        margin-top: var(--margin-l);
        margin-bottom: var(--margin-m);
        font-size: var(--size-type-ml);
      }
    `];let he=Pe;var tn=Object.defineProperty,en=Object.getOwnPropertyDescriptor,Yt=(r,t,e,s)=>{for(var i=s>1?void 0:s?en(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&tn(t,e,i),i};function ls(r){const t={month:"long",day:"numeric",timeZone:"UTC"},e=new Intl.DateTimeFormat("en-US",t).format(r);return sn(e)}function sn(r){const[t,e]=r.split(" "),s=parseInt(e,10);let i;return s===1||s===21||s===31?i="st":s===2||s===22?i="nd":s===3||s===23?i="rd":i="th",`${t} ${s}${i}`}const Ht=class Ht extends Ys{constructor(){super("backpack:model"),this.mode="view"}get trip(){return this.model.trip}get _trip(){if(this.trip)return{title:this.trip.title,startDate:new Date(this.trip.startDate),endDate:new Date(this.trip.endDate),region:this.trip.location.region,members:this.trip.members.map(t=>t.name),campsites:this.trip.location.campsite,activities:this.trip.activities,gear:this.trip.gear}}render(){var t;return this.trip?y`
        <section
          mu-form:submit=${e=>this._handleSubmit(e)}
        >
          <header class="nav">
            <a href="/app">
              <svg class="icon">
                <use href="/icons/sprite.svg#back" />
              </svg>
              <svg class="icon">
                <use href="/icons/sprite.svg#home" />
              </svg>
            </a>
          </header>
          <section class="view">
            <div class="trip-head">
              <h1>${this.trip.title}</h1>
              <button
                class="edit-btn"
                id="edit"
                @click=${()=>this.mode="edit"}
              >
                Edit
              </button>
            </div>
            <h5>
              ${ls(new Date(this.trip.startDate))} -
              ${ls(new Date(this.trip.endDate))}
            </h5>
            <section class="four-sections">
              <section>
                <h2>Group:</h2>
                <ul>
                  ${this.trip.members.map(e=>y`<li>${e.name}</li>`)}
                </ul>
              </section>
              <section>
                <h2>Location:</h2>
                <ul>
                  <li>${this.trip.location.region}</li>
                  ${this.trip.location.campsite.map(e=>y`<li>${e}</li>`)}
                </ul>
              </section>
              <section>
                <h2>Activities:</h2>
                <ul>
                  ${(t=this.trip.activities)==null?void 0:t.map(e=>y`<li>${e}</li>`)}
                </ul>
              </section>
              <section class="gear-section">
                <h2>Gear:</h2>
                ${this.trip.gear.map(e=>y` <label key=${e.replace(/\s+/g,"_")}>
                      <input type="checkbox" autocomplete="off" />
                      ${e}
                    </label>`)}
              </section>
            </section>
            <section class="images">
              <img class="outer-img" src="${this.trip.image_urls[0]}" />
              <img class="middle-img" src="${this.trip.image_urls[1]}" />
              <img class="outer-img" src="${this.trip.image_urls[2]}" />
            </section>
          </section>
          <mu-form class="edit" .init=${this._trip}>
            <label>
              <span>Title:</span>
              <input name="title" />
            </label>
            <label>
              <span>Start Date:</span>
              <input type="date" name="startDate" />
            </label>
            <label>
              <span>End Date:</span>
              <input type="date" name="endDate" />
            </label>
            <label>
              <span>Members: </span>
              <input-array name="members">
                <span slot="label-add">Add a member</span>
              </input-array>
            </label>
            <label>
              <span>Region</span>
              <input name="region" />
            </label>
            <label>
              <span>Campsites: </span>
              <input-array name="campsites">
                <span slot="label-add">Add a site</span>
              </input-array>
            </label>
            <label>
              <span>Activities: </span>
              <input-array name="activities">
                <span slot="label-add">Add an activity</span>
              </input-array>
            </label>
            <label>
              <span>Gear: </span>
              <input-array name="gear">
                <span slot="label-add">Add gear</span>
              </input-array>
            </label>
          </mu-form>
        </section>
      `:y` <h1>TRIP NOT FOUND...</h1> `}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="tripid"&&e!==s&&s&&(console.log("dispatching trip/select"),this.dispatchMessage(["trip/select",{tripId:s}]))}_handleSubmit(t){console.log("Handling submit of mu-form");const e=t.detail;console.log("TRIP ON SUBMIT:",e),this.dispatchMessage(["trip/save",{tripId:this.tripid?this.tripid:"",trip:e,onSuccess:()=>$s.dispatch(this,"history/navigate",{href:`/app/trip/${this.tripid}`}),onFailure:s=>console.log("ERROR:",s)}])}};Ht.uses=nt({"mu-form":vi.Element,"input-array":vr.Element}),Ht.styles=[N,U,S`
      :host {
        display: contents;
      }
      :host([mode="edit"]),
      :host([mode="new"]) {
        --display-view-none: none;
      }
      :host([mode="view"]) {
        --display-editor-none: none;
      }

      section.view {
        display: var(--display-view-none, grid);
      }
      mu-form.edit {
        display: var(--display-editor-none, grid);
      }

      .edit-btn {
        width: 100px;
        margin-right: var(--margin-s);
      }
      .trip-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: var(--margin-m);
      }

      .four-sections {
        display: grid;
        grid-template-columns: [start] repeat(4, 1fr) [end];
        gap: 5px;
        padding-left: var(--margin-m);
      }

      .thr-sections > header {
        grid-column: start / end;
      }

      h1 {
        font-size: var(--size-type-xl);
      }

      h2 {
        padding: var(--margin-m);
        text-align: left;
      }

      h5 {
        margin-left: var(--margin-l);
      }

      ul {
        list-style-type: none;
      }

      p {
        margin-top: var(--margin-s);
      }

      .gear-section {
        display: flex;
        flex-direction: column;
      }

      input {
        margin-right: var(--margin-s);
      }

      .images {
        display: grid;
        grid-template-columns: [start] repeat(7, 1fr) [end];
        margin-top: var(--margin-m);
        align-items: center;
      }

      .outer-img {
        grid-column: span 2;
      }

      .middle-img {
        grid-column: span 3;
      }

      mu-form.edit {
        display: var(--display-editor-none, grid);
        grid-column: 1/-1;
        grid-template-columns: subgrid;
      }

      mu-form > label,
      input-array {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        margin-bottom: var(--margin-m);
      }

      label > input {
        text-align: center;
      }
      button.submit {
        justify-self: center;
        width: 150px;
        margin-bottom: var(--margin-l);
        padding: var(--margin-s);
        font-size: var(--size-type-l);
        border-radius: var(--radius-med);
      }
    `];let q=Ht;Yt([Bt()],q.prototype,"tripid",2);Yt([Bt({reflect:!0})],q.prototype,"mode",2);Yt([qt()],q.prototype,"trip",1);Yt([qt()],q.prototype,"_trip",1);const Ce=class Ce extends E{constructor(){super(...arguments),this._authObserver=new k(this,"backpack:auth"),this._user=new R.User}render(){return y`
      <main class="page">
        <section class="thr-sections">
          <header class="nav">
            <a href="/app">
              <svg class="icon">
                <use href="/icons/sprite.svg#back" />
              </svg>
              <svg class="icon">
                <use href="/icons/sprite.svg#home" />
              </svg>
            </a>
          </header>
          <section id="trip" class="trip">
            <h1>My Trips</h1>
            <header
              class="trip-img"
              style="background-image: url('/images/2Y1.jpeg')"
            >
              <h2 class="title">Trip to Yellowstone</h2>
            </header>
          </section>
          <section id="my-gear" class="my-gear">
            <h1>My Gear</h1>
            <h2>Trip to Yellowstone</h2>
            <input type="checkbox" id="group1" name="group1" value="group" />
            <label for="group1">Medical supplies</label><br />
            <input type="checkbox" id="group2" name="group2" value="group" />
            <label for="group2">Tent</label><br />
            <input type="checkbox" id="group3" name="group3" value="group" />
            <label for="group3">Pots and pans</label><br />
            <input type="checkbox" id="group4" name="group4" value="group" />
            <label for="group4">Bug spray</label><br />
            <input type="checkbox" id="group5" name="group5" value="group" />
            <label for="group5">Bear spray</label><br />
            <input type="checkbox" id="group6" name="group6" value="group" />
            <label for="group6">Bear rope</label><br />
          </section>
          <section id="request" class="request">
            <h1>Pending Invites</h1>
            <input type="checkbox" id="invite1" name="invite1" value="invite" />
            <label for="invite1">2025 Yosemite Trip</label><br />
          </section>
        </section>
      </main>
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t)})}};Ce.styles=[N,U,S`
      .thr-sections {
        display: grid;
        grid-template-columns: [start] repeat(7, 1fr) [end];
        gap: var(--margin-s);
      }

      .thr-sections > header {
        grid-column: start / end;
      }

      .trip {
        grid-column: start / 4;
      }
      .trip > header {
        text-align: center;
      }

      .my-gear {
        grid-column: 4 / 6;
      }

      .request {
        grid-column: 6 / 8;
      }

      h1 {
        padding-bottom: var(--margin-m);
      }

      .trip-img {
        background-size: cover;
        background-position: center;
        height: 27.5vw;
        width: 100%;
        align-items: normal;
        justify-content: center;
        width: var(--width-scroll-image);
        max-width: 600px;
        max-height: 450px;
        padding: 0;
      }

      h2 {
        height: fit-content;
        padding: 10px;
      }

      h2.title {
        background-color: rgba(245, 245, 245, 0.482);
        width: 100%;
      }
    `];let ue=Ce;const rn=[{path:"/app/itinerary/:id",view:(r,t)=>y`
      <itinerary-view
        tripid=${r.id}
        mode=${t!=null&&t.has("edit")?"edit":t!=null&&t.has("new")?"new":"view"}
      >
      </itinerary-view>
    `},{path:"/app/step1",view:()=>y` <step1-view></step1-view>`},{path:"/app/step2",view:()=>y` <step2-view></step2-view>`},{path:"/app/profile",view:()=>y` <profile-view></profile-view>`},{path:"/app",view:()=>y` <home-view></home-view> `},{path:"/",redirect:"/app"}],Oe=class Oe extends E{render(){return y` <mu-switch></mu-switch> `}connectedCallback(){super.connectedCallback(),bt.initializeOnce()}};Oe.uses=nt({"home-view":Nt,"login-view":le,"step1-view":ce,"step2-view":he,"itinerary-view":q,"profile-view":ue});let de=Oe;nt({"mu-auth":R.Provider,"mu-history":$s.Provider,"mu-switch":class extends dr.Element{constructor(){super(rn,"backpack:history","backpack:auth")}},"mu-store":class extends Ai.Provider{constructor(){super(Dr,zr,"backpack:auth")}},"backpack-app":de,"bp-header":bt});
