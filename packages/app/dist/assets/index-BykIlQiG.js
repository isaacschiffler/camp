(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var B,Ce;class lt extends Error{}lt.prototype.name="InvalidTokenError";function Js(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Zs(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Js(t)}catch{return atob(t)}}function ns(r,t){if(typeof r!="string")throw new lt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new lt(`Invalid token specified: missing part #${e+1}`);let i;try{i=Zs(s)}catch(n){throw new lt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new lt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Qs="mu:context",te=`${Qs}:change`;class Xs{constructor(t,e){this._proxy=ti(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class le extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Xs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(te,t),t}detach(t){this.removeEventListener(te,t)}}function ti(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(te,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function ei(r,t){const e=os(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function os(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return os(r,i.host)}class si extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function as(r="mu:message"){return(t,...e)=>t.dispatchEvent(new si(e,r))}class ce{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ii(r){return t=>({...t,...r})}const ee="mu:auth:jwt",ls=class cs extends ce{constructor(t,e){super((s,i)=>this.update(s,i),t,cs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ni(s)),Gt(i);case"auth/signout":return e(oi()),Gt(this._redirectForLogin);case"auth/redirect":return Gt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ls.EVENT_TYPE="auth:message";let hs=ls;const us=as(hs.EVENT_TYPE);function Gt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class ri extends le{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=K.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new hs(this.context,this.redirect).attach(this)}}class G{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ee),t}}class K extends G{constructor(t){super();const e=ns(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new K(t);return localStorage.setItem(ee,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ee);return t?K.authenticate(t):new G}}function ni(r){return ii({user:K.authenticate(r),token:r})}function oi(){return r=>{const t=r.user;return{user:t&&t.authenticated?G.deauthenticate(t):t,token:""}}}function ai(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function li(r){return r.authenticated?ns(r.token||""):{}}const dt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:K,Provider:ri,User:G,dispatch:us,headers:ai,payload:li},Symbol.toStringTag,{value:"Module"}));function kt(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function se(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const ds=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:se,relay:kt},Symbol.toStringTag,{value:"Module"}));function ps(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ci=new DOMParser;function I(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=ci.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Oe(a);case"bigint":case"boolean":case"number":case"symbol":return Oe(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Oe(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ht(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}B=class extends HTMLElement{constructor(){super(),this._state={},Ht(this).template(B.template).styles(B.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),kt(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},hi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},B.template=I`
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
  `,B.styles=ps`
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
  `;function hi(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const fs=class gs extends ce{constructor(t){super((e,s)=>this.update(e,s),t,gs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(di(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(pi(s,i));break}}}};fs.EVENT_TYPE="history:message";let he=fs;class Te extends le{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=ui(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ue(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new he(this.context).attach(this)}}function ui(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function di(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function pi(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const ue=as(he.EVENT_TYPE),fi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Te,Provider:Te,Service:he,dispatch:ue},Symbol.toStringTag,{value:"Module"}));class O{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Re(this._provider,t);this._effects.push(i),e(i)}else ei(this._target,this._contextLabel).then(i=>{const n=new Re(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Re{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ms=class vs extends HTMLElement{constructor(){super(),this._state={},this._user=new G,this._authObserver=new O(this,"blazing:auth"),Ht(this).template(vs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;gi(i,this._state,e,this.authorization).then(n=>rt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},rt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ue(this.src,this.authorization).then(e=>{this._state=e,rt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ue(this.src,this.authorization).then(i=>{this._state=i,rt(i,this)});break;case"new":s&&(this._state={},rt({},this));break}}};ms.observedAttributes=["src","new","action"];ms.template=I`
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
  `;function Ue(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function rt(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function gi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const ys=class _s extends ce{constructor(t,e){super(e,t,_s.EVENT_TYPE,!1)}};ys.EVENT_TYPE="mu:message";let bs=ys;class mi extends le{constructor(t,e,s){super(e),this._user=new G,this._updateFn=t,this._authObserver=new O(this,s)}connectedCallback(){const t=new bs(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const vi=Object.freeze(Object.defineProperty({__proto__:null,Provider:mi,Service:bs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,de=xt.ShadowRoot&&(xt.ShadyCSS===void 0||xt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),Ne=new WeakMap;let $s=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(de&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ne.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ne.set(e,t))}return t}toString(){return this.cssText}};const yi=r=>new $s(typeof r=="string"?r:r+"",void 0,pe),_i=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new $s(e,r,pe)},bi=(r,t)=>{if(de)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=xt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Le=de?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return yi(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$i,defineProperty:wi,getOwnPropertyDescriptor:Ai,getOwnPropertyNames:Ei,getOwnPropertySymbols:xi,getPrototypeOf:Si}=Object,J=globalThis,Me=J.trustedTypes,ki=Me?Me.emptyScript:"",je=J.reactiveElementPolyfillSupport,ct=(r,t)=>r,Pt={toAttribute(r,t){switch(t){case Boolean:r=r?ki:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},fe=(r,t)=>!$i(r,t),Ie={attribute:!0,type:String,converter:Pt,reflect:!1,hasChanged:fe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),J.litPropertyMetadata??(J.litPropertyMetadata=new WeakMap);let q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ie){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&wi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Ai(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ie}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=Si(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,s=[...Ei(e),...xi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Le(i))}else t!==void 0&&e.push(Le(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Pt).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Pt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??fe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};q.elementStyles=[],q.shadowRootOptions={mode:"open"},q[ct("elementProperties")]=new Map,q[ct("finalized")]=new Map,je==null||je({ReactiveElement:q}),(J.reactiveElementVersions??(J.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,Ot=Ct.trustedTypes,He=Ot?Ot.createPolicy("lit-html",{createHTML:r=>r}):void 0,ws="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,As="?"+k,Pi=`<${As}>`,H=document,pt=()=>H.createComment(""),ft=r=>r===null||typeof r!="object"&&typeof r!="function",ge=Array.isArray,Ci=r=>ge(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Kt=`[ 	
\f\r]`,nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ze=/-->/g,De=/>/g,N=RegExp(`>|${Kt}(?:([^\\s"'>=/]+)(${Kt}*=${Kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fe=/'/g,Be=/"/g,Es=/^(?:script|style|textarea|title)$/i,Oi=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),ot=Oi(1),Z=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ve=new WeakMap,M=H.createTreeWalker(H,129);function xs(r,t){if(!ge(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return He!==void 0?He.createHTML(t):t}const Ti=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=nt;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===nt?f[1]==="!--"?o=ze:f[1]!==void 0?o=De:f[2]!==void 0?(Es.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??nt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?Be:Fe):o===Be||o===Fe?o=N:o===ze||o===De?o=nt:(o=N,i=void 0);const h=o===N&&r[l+1].startsWith("/>")?" ":"";n+=o===nt?a+Pi:u>=0?(s.push(d),a.slice(0,u)+ws+a.slice(u)+k+h):a+k+(u===-2?l:h)}return[xs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ie=class Ss{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ti(t,e);if(this.el=Ss.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=M.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(ws)){const c=f[o++],h=i.getAttribute(u).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ui:p[1]==="?"?Ni:p[1]==="@"?Li:zt}),i.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Es.test(i.tagName)){const u=i.textContent.split(k),c=u.length-1;if(c>0){i.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],pt()),M.nextNode(),a.push({type:2,index:++n});i.append(u[c],pt())}}}else if(i.nodeType===8)if(i.data===As)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:n}),u+=k.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function Q(r,t,e=r,s){var i,n;if(t===Z)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=ft(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=Q(r,o._$AS(r,t.values),o,s)),t}class Ri{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??H).importNode(e,!0);M.currentNode=i;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new _t(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Mi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class _t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),ft(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==Z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ci(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ie.createElement(xs(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Ri(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ve.get(t.strings);return e===void 0&&Ve.set(t.strings,e=new ie(t)),e}k(t){ge(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new _t(this.O(pt()),this.O(pt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=Q(this,t,e,0),o=!ft(t)||t!==this._$AH&&t!==Z,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=Q(this,l[s+a],e,a),d===Z&&(d=this._$AH[a]),o||(o=!ft(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ui extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Ni extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Li extends zt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??_)===Z)return;const s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Mi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const qe=Ct.litHtmlPolyfillSupport;qe==null||qe(ie,_t),(Ct.litHtmlVersions??(Ct.litHtmlVersions=[])).push("3.2.0");const ji=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new _t(t.insertBefore(pt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let W=class extends q{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=ji(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Z}};W._$litElement$=!0,W.finalized=!0,(Ce=globalThis.litElementHydrateSupport)==null||Ce.call(globalThis,{LitElement:W});const Ye=globalThis.litElementPolyfillSupport;Ye==null||Ye({LitElement:W});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ii={attribute:!0,type:String,converter:Pt,reflect:!1,hasChanged:fe},Hi=(r=Ii,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function ks(r){return(t,e)=>typeof e=="object"?Hi(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ps(r){return ks({...r,state:!0,attribute:!1})}function zi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Di(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Cs={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,v,Bt){var A=v.length-1;switch(g){case 1:return new m.Root({},[v[A-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new m.Literal({value:v[A]});break;case 7:this.$=new m.Splat({name:v[A]});break;case 8:this.$=new m.Param({name:v[A]});break;case 9:this.$=new m.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],v=this.table,Bt="",A=0,Se=0,Ys=2,ke=1,Ws=g.slice.call(arguments,1),y=Object.create(this.lexer),R={yy:{}};for(var Vt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Vt)&&(R.yy[Vt]=this.yy[Vt]);y.setInput(c,R.yy),R.yy.lexer=y,R.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var qt=y.yylloc;g.push(qt);var Gs=y.options&&y.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ks=function(){var F;return F=y.lex()||ke,typeof F!="number"&&(F=h.symbols_[F]||F),F},w,U,E,Yt,D={},At,S,Pe,Et;;){if(U=p[p.length-1],this.defaultActions[U]?E=this.defaultActions[U]:((w===null||typeof w>"u")&&(w=Ks()),E=v[U]&&v[U][w]),typeof E>"u"||!E.length||!E[0]){var Wt="";Et=[];for(At in v[U])this.terminals_[At]&&At>Ys&&Et.push("'"+this.terminals_[At]+"'");y.showPosition?Wt="Parse error on line "+(A+1)+`:
`+y.showPosition()+`
Expecting `+Et.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Wt="Parse error on line "+(A+1)+": Unexpected "+(w==ke?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Wt,{text:y.match,token:this.terminals_[w]||w,line:y.yylineno,loc:qt,expected:Et})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+w);switch(E[0]){case 1:p.push(w),m.push(y.yytext),g.push(y.yylloc),p.push(E[1]),w=null,Se=y.yyleng,Bt=y.yytext,A=y.yylineno,qt=y.yylloc;break;case 2:if(S=this.productions_[E[1]][1],D.$=m[m.length-S],D._$={first_line:g[g.length-(S||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(S||1)].first_column,last_column:g[g.length-1].last_column},Gs&&(D._$.range=[g[g.length-(S||1)].range[0],g[g.length-1].range[1]]),Yt=this.performAction.apply(D,[Bt,Se,A,R.yy,E[1],m,g].concat(Ws)),typeof Yt<"u")return Yt;S&&(p=p.slice(0,-1*S*2),m=m.slice(0,-1*S),g=g.slice(0,-1*S)),p.push(this.productions_[E[1]][0]),m.push(D.$),g.push(D._$),Pe=v[p[p.length-2]][p[p.length-1]],p.push(Pe);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(p=this._input.match(this.rules[g[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=v,this.options.backtrack_lexer){if(c=this.test_match(p,g[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Di<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Cs);function V(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Os={Root:V("Root"),Concat:V("Concat"),Literal:V("Literal"),Splat:V("Splat"),Param:V("Param"),Optional:V("Optional")},Ts=Cs.parser;Ts.yy=Os;var Fi=Ts,Bi=Object.keys(Os);function Vi(r){return Bi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Rs=Vi,qi=Rs,Yi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Us(r){this.captures=r.captures,this.re=r.re}Us.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Wi=qi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Yi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Us({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Gi=Wi,Ki=Rs,Ji=Ki({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Zi=Ji,Qi=Fi,Xi=Gi,tr=Zi;bt.prototype=Object.create(null);bt.prototype.match=function(r){var t=Xi.visit(this.ast),e=t.match(r);return e||!1};bt.prototype.reverse=function(r){return tr.visit(this.ast,r)};function bt(r){var t;if(this?t=this:t=Object.create(bt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Qi.parse(r),t}var er=bt,sr=er,ir=sr;const rr=zi(ir);var nr=Object.defineProperty,Ns=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&nr(t,e,i),i};const Ls=class extends W{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ot` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new rr(i.path)})),this._historyObserver=new O(this,e),this._authObserver=new O(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ot` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(us(this,"auth/redirect"),ot` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ot` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ot` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){ue(this,"history/redirect",{href:t})}};Ls.styles=_i`
    :host,
    main {
      display: contents;
    }
  `;let Tt=Ls;Ns([Ps()],Tt.prototype,"_user");Ns([Ps()],Tt.prototype,"_match");const or=Object.freeze(Object.defineProperty({__proto__:null,Element:Tt,Switch:Tt},Symbol.toStringTag,{value:"Module"})),Ms=class js extends HTMLElement{constructor(){if(super(),Ht(this).template(js.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ms.template=I`
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
  `;let ar=Ms;const lr=Object.freeze(Object.defineProperty({__proto__:null,Element:ar},Symbol.toStringTag,{value:"Module"})),Is=class re extends HTMLElement{constructor(){super(),this._array=[],Ht(this).template(re.template).styles(re.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Hs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{se(t,"button.add")?kt(t,"input-array:add"):se(t,"button.remove")&&kt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],cr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Is.template=I`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Is.styles=ps`
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
  `;function cr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Hs(e)))}function Hs(r,t){const e=r===void 0?I`<input />`:I`<input value="${r}" />`;return I`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function $t(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var hr=Object.defineProperty,ur=Object.getOwnPropertyDescriptor,dr=(r,t,e,s)=>{for(var i=ur(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&hr(t,e,i),i};class zs extends W{constructor(t){super(),this._pending=[],this._observer=new O(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}dr([ks()],zs.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const St=globalThis,me=St.ShadowRoot&&(St.ShadyCSS===void 0||St.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ve=Symbol(),We=new WeakMap;let Ds=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ve)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(me&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=We.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&We.set(e,t))}return t}toString(){return this.cssText}};const pr=r=>new Ds(typeof r=="string"?r:r+"",void 0,ve),T=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Ds(e,r,ve)},fr=(r,t)=>{if(me)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=St.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Ge=me?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return pr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gr,defineProperty:mr,getOwnPropertyDescriptor:vr,getOwnPropertyNames:yr,getOwnPropertySymbols:_r,getPrototypeOf:br}=Object,C=globalThis,Ke=C.trustedTypes,$r=Ke?Ke.emptyScript:"",Jt=C.reactiveElementPolyfillSupport,ht=(r,t)=>r,Rt={toAttribute(r,t){switch(t){case Boolean:r=r?$r:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ye=(r,t)=>!gr(r,t),Je={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:ye};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);class Y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Je){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&mr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=vr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Je}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;const t=br(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){const e=this.properties,s=[...yr(e),..._r(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ge(i))}else t!==void 0&&e.push(Ge(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Rt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Rt;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ye)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ht("elementProperties")]=new Map,Y[ht("finalized")]=new Map,Jt==null||Jt({ReactiveElement:Y}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ut=globalThis,Ut=ut.trustedTypes,Ze=Ut?Ut.createPolicy("lit-html",{createHTML:r=>r}):void 0,Fs="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Bs="?"+P,wr=`<${Bs}>`,z=document,gt=()=>z.createComment(""),mt=r=>r===null||typeof r!="object"&&typeof r!="function",_e=Array.isArray,Ar=r=>_e(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Zt=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Qe=/-->/g,Xe=/>/g,L=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ts=/'/g,es=/"/g,Vs=/^(?:script|style|textarea|title)$/i,Er=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),$=Er(1),X=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ss=new WeakMap,j=z.createTreeWalker(z,129);function qs(r,t){if(!_e(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ze!==void 0?Ze.createHTML(t):t}const xr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=at;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===at?f[1]==="!--"?o=Qe:f[1]!==void 0?o=Xe:f[2]!==void 0?(Vs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=i??at,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?L:f[3]==='"'?es:ts):o===es||o===ts?o=L:o===Qe||o===Xe?o=at:(o=L,i=void 0);const h=o===L&&r[l+1].startsWith("/>")?" ":"";n+=o===at?a+wr:u>=0?(s.push(d),a.slice(0,u)+Fs+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[qs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class vt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=xr(t,e);if(this.el=vt.createElement(d,s),j.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=j.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Fs)){const c=f[o++],h=i.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?kr:p[1]==="?"?Pr:p[1]==="@"?Cr:Dt}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Vs.test(i.tagName)){const u=i.textContent.split(P),c=u.length-1;if(c>0){i.textContent=Ut?Ut.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],gt()),j.nextNode(),a.push({type:2,index:++n});i.append(u[c],gt())}}}else if(i.nodeType===8)if(i.data===Bs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function tt(r,t,e=r,s){var o,l;if(t===X)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=mt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=tt(r,i._$AS(r,t.values),i,s)),t}class Sr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??z).importNode(e,!0);j.currentNode=i;let n=j.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new wt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Or(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=j.nextNode(),o++)}return j.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),mt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ar(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=vt.createElement(qs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Sr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=ss.get(t.strings);return e===void 0&&ss.set(t.strings,e=new vt(t)),e}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new wt(this.O(gt()),this.O(gt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=tt(this,t,e,0),o=!mt(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=tt(this,l[s+a],e,a),d===X&&(d=this._$AH[a]),o||(o=!mt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class kr extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Pr extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Cr extends Dt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??b)===X)return;const s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Or{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const Qt=ut.litHtmlPolyfillSupport;Qt==null||Qt(vt,wt),(ut.litHtmlVersions??(ut.litHtmlVersions=[])).push("3.2.1");const Tr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new wt(t.insertBefore(gt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let x=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Tr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return X}};var rs;x._$litElement$=!0,x.finalized=!0,(rs=globalThis.litElementHydrateSupport)==null||rs.call(globalThis,{LitElement:x});const Xt=globalThis.litElementPolyfillSupport;Xt==null||Xt({LitElement:x});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const Rr={};function Ur(r,t,e){switch(r[0]){case"trip/select":Nr(r[1],e).then(i=>t(n=>({...n,trip:i})));break;case"trip/save":Lr(r[1],e);break;default:const s=r[0];throw new Error(`Unhandled Auth message ${s}`)}}function Nr(r,t){return fetch(`http://localhost:3000/api/itineraries/${r.tripId}`,{headers:dt.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("TRIP:",e),e})}function Lr(r,t){return!0}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mr={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:ye},jr=(r=Mr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Ft(r){return(t,e)=>typeof e=="object"?jr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function be(r){return Ft({...r,state:!0,attribute:!1})}const st=T`
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
`,it=T`
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
`;var Ir=Object.defineProperty,Hr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Ir(t,e,i),i};function zr(r){ds.relay(r,"auth:message",["auth/signout"])}function Dr(r){const e=r.target.checked;ds.relay(r,"darkmode",{checked:e})}const Mt=class Mt extends x{constructor(){super(...arguments),this.userid="camper",this._authObserver=new O(this,"backpack:auth")}render(){return $`
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
                <label @change=${Dr} class="dark-mode-switch">
                  <input type="checkbox" autocomplete="off" />
                  Dark Mode
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout" @click=${zr}>Sign Out</a>
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
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&t.username!==this.userid&&(this.userid=t.username)})}static initializeOnce(){function t(e,s){e.classList.toggle("darkmode",s)}document.body.addEventListener("darkmode",e=>{var s;return t(e.currentTarget,(s=e.detail)==null?void 0:s.checked)})}};Mt.uses=$t({"mu-dropdown":lr.Element}),Mt.styles=[st,it,T`
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
    `];let yt=Mt;Hr([be()],yt.prototype,"userid");var Fr=Object.defineProperty,Br=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Fr(t,e,i),i};const we=class we extends x{constructor(){super(...arguments),this.src="http://localhost:3000/api/itineraries/",this.tripIndex=new Array,this._authObserver=new O(this,"backpack:auth"),this._user=new dt.User}render(){const t=this.tripIndex.map(this.renderItem);return $`
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
    `}renderItem(t){return $`
      <li>
        <a href="app/itinerary/${t._id.toString()}">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#itinerary" />
          </svg>
          <h4>${t.title}</h4>
        </a>
      </li>
    `}hydrate(t){fetch(t,{headers:dt.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{this.tripIndex=e}).catch(e=>console.log("Failed to tour data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}};we.styles=[it,st,T`
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
    `];let Nt=we;Br([be()],Nt.prototype,"tripIndex");const jt=class jt extends x{render(){return $`
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
    `}};jt.uses=$t({}),jt.styles=[it,st,T`
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
    `];let ne=jt;var Vr=Object.defineProperty,qr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Vr(t,e,i),i};const Ae=class Ae extends x{render(){return $`
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
    `}connectedCallback(){super.connectedCallback(),console.log("Connected to DOM")}firstUpdated(){this.updateBackgroundImage()}updateBackgroundImage(){var e;console.log("Updating background image");const t=(e=this.shadowRoot)==null?void 0:e.querySelector("header.image");if(!t){console.error("Header element not found");return}this.image_url&&(console.log("Image URL:",this.image_url),t.style.backgroundImage=`url(${this.image_url})`)}};Ae.styles=[st,it,T`
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
    `];let Lt=Ae;qr([Ft({type:String})],Lt.prototype,"image_url");const It=class It extends x{constructor(){super(...arguments),this._authObserver=new O(this,"backpack:auth"),this._user=new dt.User}render(){return $`
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
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t)})}};It.uses=$t({"camp-site":Lt}),It.styles=[it,st,T`
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
    `];let oe=It;var Yr=Object.defineProperty,Wr=Object.getOwnPropertyDescriptor,$e=(r,t,e,s)=>{for(var i=s>1?void 0:s?Wr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Yr(t,e,i),i};function is(r){const t={month:"long",day:"numeric",timeZone:"UTC"},e=new Intl.DateTimeFormat("en-US",t).format(r);return Gr(e)}function Gr(r){const[t,e]=r.split(" "),s=parseInt(e,10);let i;return s===1||s===21||s===31?i="st":s===2||s===22?i="nd":s===3||s===23?i="rd":i="th",`${t} ${s}${i}`}const Ee=class Ee extends zs{constructor(){super("backpack:model"),this.mode="view"}get trip(){return this.model.trip}render(){var t;return this.trip?$`
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
            ${is(new Date(this.trip.startDate))} -
            ${is(new Date(this.trip.endDate))}
          </h5>
          <section class="four-sections">
            <section>
              <h2>Group:</h2>
              <ul>
                ${this.trip.members.map(e=>$`<li>${e.name}</li>`)}
              </ul>
            </section>
            <section>
              <h2>Location:</h2>
              <ul>
                <li>${this.trip.location.region}</li>
                ${this.trip.location.campsite.map(e=>$`<li>${e}</li>`)}
              </ul>
            </section>
            <section>
              <h2>Activities:</h2>
              <ul>
                ${(t=this.trip.activities)==null?void 0:t.map(e=>$`<li>${e}</li>`)}
              </ul>
            </section>
            <section class="gear-section">
              <h2>Gear:</h2>
              ${this.trip.gear.map(e=>$` <label key=${e.replace(/\s+/g,"_")}>
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
        <mu-form class="edit">
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
      `:$` <h1>TRIP NOT FOUND...</h1> `}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="tripid"&&e!==s&&s&&(console.log("dispatching trip/select"),this.dispatchMessage(["trip/select",{tripId:s}]))}};Ee.styles=[it,st,T`
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
    `];let et=Ee;$e([Ft()],et.prototype,"tripid",2);$e([Ft({reflect:!0})],et.prototype,"mode",2);$e([be()],et.prototype,"trip",1);const Kr=[{path:"/app/itinerary/:id",view:(r,t)=>$`
      <itinerary-view
        tripid=${r.id}
        mode=${t!=null&&t.has("edit")?"edit":t!=null&&t.has("new")?"new":"view"}
      >
      </itinerary-view>
    `},{path:"/app/step1",view:()=>$` <step1-view></step1-view>`},{path:"/app",view:()=>$` <home-view></home-view> `},{path:"/",redirect:"/app"}],xe=class xe extends x{render(){return $` <mu-switch></mu-switch> `}connectedCallback(){super.connectedCallback(),yt.initializeOnce()}};xe.uses=$t({"home-view":Nt,"login-view":ne,"step1-view":oe,"itinerary-view":et});let ae=xe;$t({"mu-auth":dt.Provider,"mu-history":fi.Provider,"mu-switch":class extends or.Element{constructor(){super(Kr,"backpack:history","backpack:auth")}},"mu-store":class extends vi.Provider{constructor(){super(Ur,Rr,"backpack:auth")}},"backpack-app":ae,"bp-header":yt});
