(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var W,Ne;class ht extends Error{}ht.prototype.name="InvalidTokenError";function es(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let i=e.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function is(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return es(t)}catch{return atob(t)}}function hi(r,t){if(typeof r!="string")throw new ht("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,i=r.split(".")[e];if(typeof i!="string")throw new ht(`Invalid token specified: missing part #${e+1}`);let s;try{s=is(i)}catch(n){throw new ht(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new ht(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const ss="mu:context",re=`${ss}:change`;class rs{constructor(t,e){this._proxy=ns(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class pe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new rs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(re,t),t}detach(t){this.removeEventListener(re,t)}}function ns(r,t){return new Proxy(r,{get:(i,s,n)=>{if(s==="then")return;const o=Reflect.get(i,s,n);return console.log(`Context['${s}'] => `,o),o},set:(i,s,n,o)=>{const l=r[s];console.log(`Context['${s.toString()}'] <= `,n);const a=Reflect.set(i,s,n,o);if(a){let d=new CustomEvent(re,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:s,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function os(r,t){const e=ui(t,r);return new Promise((i,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>i(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function ui(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const i=t.closest(e);if(i)return i;const s=t.getRootNode();if(s instanceof ShadowRoot)return ui(r,s.host)}class as extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function di(r="mu:message"){return(t,...e)=>t.dispatchEvent(new as(e,r))}class me{constructor(t,e,i="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=i,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const i=e.detail;this.consume(i)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ls(r){return t=>({...t,...r})}const ne="mu:auth:jwt",pi=class mi extends me{constructor(t,e){super((i,s)=>this.update(i,s),t,mi.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:i,redirect:s}=t[1];return e(hs(i)),Qt(s);case"auth/signout":return e(us()),Qt(this._redirectForLogin);case"auth/redirect":return Qt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};pi.EVENT_TYPE="auth:message";let gi=pi;const fi=di(gi.EVENT_TYPE);function Qt(r,t={}){if(!r)return;const e=window.location.href,i=new URL(r,e);return Object.entries(t).forEach(([s,n])=>i.searchParams.set(s,n)),()=>{console.log("Redirecting to ",r),window.location.assign(i)}}class cs extends pe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=X.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new gi(this.context,this.redirect).attach(this)}}class Q{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ne),t}}class X extends Q{constructor(t){super();const e=hi(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new X(t);return localStorage.setItem(ne,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ne);return t?X.authenticate(t):new Q}}function hs(r){return ls({user:X.authenticate(r),token:r})}function us(){return r=>{const t=r.user;return{user:t&&t.authenticated?Q.deauthenticate(t):t,token:""}}}function ds(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function ps(r){return r.authenticated?hi(r.token||""):{}}const C=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:X,Provider:cs,User:Q,dispatch:fi,headers:ds,payload:ps},Symbol.toStringTag,{value:"Module"}));function Pt(r,t,e){const i=r.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,s),i.dispatchEvent(s),r.stopPropagation()}function oe(r,t="*"){return r.composedPath().find(i=>{const s=i;return s.tagName&&s.matches(t)})}const vi=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:oe,relay:Pt},Symbol.toStringTag,{value:"Module"}));function yi(r,...t){const e=r.map((s,n)=>n?[t[n-1],s]:[s]).flat().join("");let i=new CSSStyleSheet;return i.replaceSync(e),i}const ms=new DOMParser;function z(r,...t){const e=t.map(l),i=r.map((a,d)=>{if(d===0)return[a];const m=e[d-1];return m instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[m,a]}).flat().join(""),s=ms.parseFromString(i,"text/html"),n=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const m=o.querySelector(`ins#mu-html-${d}`);if(m){const u=m.parentNode;u==null||u.replaceChild(a,m)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Me(a);case"bigint":case"boolean":case"number":case"symbol":return Me(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const m=new DocumentFragment,u=a.map(l);return m.replaceChildren(...u),m}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Me(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ft(r,t={mode:"open"}){const e=r.attachShadow(t),i={template:s,styles:n};return i;function s(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),i}function n(...o){e.adoptedStyleSheets=o}}let gs=(W=class extends HTMLElement{constructor(){super(),this._state={},Ft(this).template(W.template).styles(W.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,i=t.value;e&&(this._state[e]=i)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Pt(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},fs(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},W.template=z`
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
  `,W.styles=yi`
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
  `,W);function fs(r,t){const e=Object.entries(r);for(const[i,s]of e){const n=t.querySelector(`[name="${i}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;case"date":o.value=s.toISOString().substr(0,10);break;default:o.value=s;break}}}return r}const vs=Object.freeze(Object.defineProperty({__proto__:null,Element:gs},Symbol.toStringTag,{value:"Module"})),bi=class _i extends me{constructor(t){super((e,i)=>this.update(e,i),t,_i.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:i,state:s}=t[1];e(bs(i,s));break}case"history/redirect":{const{href:i,state:s}=t[1];e(_s(i,s));break}}}};bi.EVENT_TYPE="history:message";let ge=bi;class je extends pe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=ys(t);if(e){const i=new URL(e.href);i.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),fe(e,"history/navigate",{href:i.pathname+i.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ge(this.context).attach(this)}}function ys(r){const t=r.currentTarget,e=i=>i.tagName=="A"&&i.href;if(r.button===0)if(r.composed){const s=r.composedPath().find(e);return s||void 0}else{for(let i=r.target;i;i===t?null:i.parentElement)if(e(i))return i;return}}function bs(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function _s(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const fe=di(ge.EVENT_TYPE),$i=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:je,Provider:je,Service:ge,dispatch:fe},Symbol.toStringTag,{value:"Module"}));class k{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,i)=>{if(this._provider){const s=new Ie(this._provider,t);this._effects.push(s),e(s)}else os(this._target,this._contextLabel).then(s=>{const n=new Ie(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel}: ${s}`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ie{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const wi=class Ai extends HTMLElement{constructor(){super(),this._state={},this._user=new Q,this._authObserver=new k(this,"blazing:auth"),Ft(this).template(Ai.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",i=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;$s(s,this._state,e,this.authorization).then(n=>ot(n,this)).then(n=>{const o=`mu-rest-form:${i}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[i]:n,url:s}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,s=e.value;i&&(this._state[i]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ot(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Le(this.src,this.authorization).then(e=>{this._state=e,ot(e,this)}))})}attributeChangedCallback(t,e,i){switch(t){case"src":this.src&&i&&i!==e&&!this.isNew&&Le(this.src,this.authorization).then(s=>{this._state=s,ot(s,this)});break;case"new":i&&(this._state={},ot({},this));break}}};wi.observedAttributes=["src","new","action"];wi.template=z`
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
  `;function Le(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function ot(r,t){const e=Object.entries(r);for(const[i,s]of e){const n=t.querySelector(`[name="${i}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;default:o.value=s;break}}}return r}function $s(r,t,e="PUT",i={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...i},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const xi=class Ei extends me{constructor(t,e){super(e,t,Ei.EVENT_TYPE,!1)}};xi.EVENT_TYPE="mu:message";let ki=xi;class ws extends pe{constructor(t,e,i){super(e),this._user=new Q,this._updateFn=t,this._authObserver=new k(this,i)}connectedCallback(){const t=new ki(this.context,(e,i)=>this._updateFn(e,i,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const As=Object.freeze(Object.defineProperty({__proto__:null,Provider:ws,Service:ki},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,ve=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ye=Symbol(),He=new WeakMap;let Si=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==ye)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ve&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=He.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&He.set(e,t))}return t}toString(){return this.cssText}};const xs=r=>new Si(typeof r=="string"?r:r+"",void 0,ye),Es=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new Si(e,r,ye)},ks=(r,t)=>{if(ve)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=kt.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},De=ve?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return xs(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ss,defineProperty:Ps,getOwnPropertyDescriptor:Cs,getOwnPropertyNames:Os,getOwnPropertySymbols:Ts,getPrototypeOf:Rs}=Object,tt=globalThis,ze=tt.trustedTypes,Us=ze?ze.emptyScript:"",Fe=tt.reactiveElementPolyfillSupport,ut=(r,t)=>r,Ct={toAttribute(r,t){switch(t){case Boolean:r=r?Us:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},be=(r,t)=>!Ss(r,t),Be={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:be};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),tt.litPropertyMetadata??(tt.litPropertyMetadata=new WeakMap);let K=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Ps(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=Cs(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);n.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Be}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Rs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,i=[...Os(e),...Ts(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(De(s))}else t!==void 0&&e.push(De(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ks(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var i;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:Ct).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=s.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((i=o.converter)==null?void 0:i.fromAttribute)!==void 0?o.converter:Ct;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??be)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(i)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[ut("elementProperties")]=new Map,K[ut("finalized")]=new Map,Fe==null||Fe({ReactiveElement:K}),(tt.reactiveElementVersions??(tt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=globalThis,Tt=Ot.trustedTypes,Ve=Tt?Tt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Pi="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,Ci="?"+O,Ns=`<${Ci}>`,F=document,mt=()=>F.createComment(""),gt=r=>r===null||typeof r!="object"&&typeof r!="function",_e=Array.isArray,Ms=r=>_e(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Xt=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qe=/-->/g,Ye=/>/g,I=RegExp(`>|${Xt}(?:([^\\s"'>=/]+)(${Xt}*=${Xt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),We=/'/g,Ge=/"/g,Oi=/^(?:script|style|textarea|title)$/i,js=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),lt=js(1),et=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ke=new WeakMap,H=F.createTreeWalker(F,129);function Ti(r,t){if(!_e(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ve!==void 0?Ve.createHTML(t):t}const Is=(r,t)=>{const e=r.length-1,i=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=at;for(let l=0;l<e;l++){const a=r[l];let d,m,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,m=o.exec(a),m!==null);)c=o.lastIndex,o===at?m[1]==="!--"?o=qe:m[1]!==void 0?o=Ye:m[2]!==void 0?(Oi.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=I):m[3]!==void 0&&(o=I):o===I?m[0]===">"?(o=s??at,u=-1):m[1]===void 0?u=-2:(u=o.lastIndex-m[2].length,d=m[1],o=m[3]===void 0?I:m[3]==='"'?Ge:We):o===Ge||o===We?o=I:o===qe||o===Ye?o=at:(o=I,s=void 0);const h=o===I&&r[l+1].startsWith("/>")?" ":"";n+=o===at?a+Ns:u>=0?(i.push(d),a.slice(0,u)+Pi+a.slice(u)+O+h):a+O+(u===-2?l:h)}return[Ti(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};let ae=class Ri{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,m]=Is(t,e);if(this.el=Ri.createElement(d,i),H.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=H.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Pi)){const c=m[o++],h=s.getAttribute(u).split(O),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Hs:p[1]==="?"?Ds:p[1]==="@"?zs:Bt}),s.removeAttribute(u)}else u.startsWith(O)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(Oi.test(s.tagName)){const u=s.textContent.split(O),c=u.length-1;if(c>0){s.textContent=Tt?Tt.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],mt()),H.nextNode(),a.push({type:2,index:++n});s.append(u[c],mt())}}}else if(s.nodeType===8)if(s.data===Ci)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(O,u+1))!==-1;)a.push({type:7,index:n}),u+=O.length-1}n++}}static createElement(t,e){const i=F.createElement("template");return i.innerHTML=t,i}};function it(r,t,e=r,i){var s,n;if(t===et)return t;let o=i!==void 0?(s=e.o)==null?void 0:s[i]:e.l;const l=gt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,i)),i!==void 0?(e.o??(e.o=[]))[i]=o:e.l=o),o!==void 0&&(t=it(r,o._$AS(r,t.values),o,i)),t}class Ls{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??F).importNode(e,!0);H.currentNode=s;let n=H.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new _t(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Fs(n,this,t)),this._$AV.push(d),a=i[++l]}o!==(a==null?void 0:a.index)&&(n=H.nextNode(),o++)}return H.currentNode=F,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class _t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,i,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=it(this,t,e),gt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ms(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=ae.createElement(Ti(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(i);else{const o=new Ls(n,this),l=o.u(this.options);o.p(i),this.T(l),this._$AH=o}}_$AC(t){let e=Ke.get(t.strings);return e===void 0&&Ke.set(t.strings,e=new ae(t)),e}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new _t(this.O(mt()),this.O(mt()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Bt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=_}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(n===void 0)t=it(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=it(this,l[i+a],e,a),d===et&&(d=this._$AH[a]),o||(o=!gt(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Hs extends Bt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Ds extends Bt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class zs extends Bt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=it(this,t,e,0)??_)===et)return;const i=this._$AH,s=t===_&&i!==_||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==_&&(i===_||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Fs{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}}const Je=Ot.litHtmlPolyfillSupport;Je==null||Je(ae,_t),(Ot.litHtmlVersions??(Ot.litHtmlVersions=[])).push("3.2.0");const Bs=(r,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new _t(t.insertBefore(mt(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Z=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Bs(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return et}};Z._$litElement$=!0,Z.finalized=!0,(Ne=globalThis.litElementHydrateSupport)==null||Ne.call(globalThis,{LitElement:Z});const Ze=globalThis.litElementPolyfillSupport;Ze==null||Ze({LitElement:Z});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vs={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:be},qs=(r=Vs,t,e)=>{const{kind:i,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,r),i==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(i==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+i)};function Ui(r){return(t,e)=>typeof e=="object"?qs(r,t,e):((i,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?{...i,wrapped:!0}:i),o?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ni(r){return Ui({...r,state:!0,attribute:!1})}function Ys(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Ws(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Mi={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},i=[1,9],s=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,f,g,y,Wt){var A=y.length-1;switch(g){case 1:return new f.Root({},[y[A-1]]);case 2:return new f.Root({},[new f.Literal({value:""})]);case 3:this.$=new f.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new f.Literal({value:y[A]});break;case 7:this.$=new f.Splat({name:y[A]});break;case 8:this.$=new f.Param({name:y[A]});break;case 9:this.$=new f.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:i,12:[1,16],13:s,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(f,g){this.message=f,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],f=[null],g=[],y=this.table,Wt="",A=0,Te=0,Zi=2,Re=1,Qi=g.slice.call(arguments,1),b=Object.create(this.lexer),M={yy:{}};for(var Gt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Gt)&&(M.yy[Gt]=this.yy[Gt]);b.setInput(c,M.yy),M.yy.lexer=b,M.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var Kt=b.yylloc;g.push(Kt);var Xi=b.options&&b.options.ranges;typeof M.yy.parseError=="function"?this.parseError=M.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ts=function(){var Y;return Y=b.lex()||Re,typeof Y!="number"&&(Y=h.symbols_[Y]||Y),Y},w,j,x,Jt,q={},xt,P,Ue,Et;;){if(j=p[p.length-1],this.defaultActions[j]?x=this.defaultActions[j]:((w===null||typeof w>"u")&&(w=ts()),x=y[j]&&y[j][w]),typeof x>"u"||!x.length||!x[0]){var Zt="";Et=[];for(xt in y[j])this.terminals_[xt]&&xt>Zi&&Et.push("'"+this.terminals_[xt]+"'");b.showPosition?Zt="Parse error on line "+(A+1)+`:
`+b.showPosition()+`
Expecting `+Et.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Zt="Parse error on line "+(A+1)+": Unexpected "+(w==Re?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Zt,{text:b.match,token:this.terminals_[w]||w,line:b.yylineno,loc:Kt,expected:Et})}if(x[0]instanceof Array&&x.length>1)throw new Error("Parse Error: multiple actions possible at state: "+j+", token: "+w);switch(x[0]){case 1:p.push(w),f.push(b.yytext),g.push(b.yylloc),p.push(x[1]),w=null,Te=b.yyleng,Wt=b.yytext,A=b.yylineno,Kt=b.yylloc;break;case 2:if(P=this.productions_[x[1]][1],q.$=f[f.length-P],q._$={first_line:g[g.length-(P||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(P||1)].first_column,last_column:g[g.length-1].last_column},Xi&&(q._$.range=[g[g.length-(P||1)].range[0],g[g.length-1].range[1]]),Jt=this.performAction.apply(q,[Wt,Te,A,M.yy,x[1],f,g].concat(Qi)),typeof Jt<"u")return Jt;P&&(p=p.slice(0,-1*P*2),f=f.slice(0,-1*P),g=g.slice(0,-1*P)),p.push(this.productions_[x[1]][0]),f.push(q.$),g.push(q._$),Ue=y[p[p.length-2]][p[p.length-1]],p.push(Ue);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var f=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===f.length?this.yylloc.first_column:0)+f[f.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,f,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),f=c[0].match(/(?:\r\n?|\n).*/g),f&&(this.yylineno+=f.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:f?f[f.length-1].length-f[f.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,f;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(p=this._input.match(this.rules[g[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,f=y,this.options.backtrack_lexer){if(c=this.test_match(p,g[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[f]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,f,g){switch(f){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function m(){this.yy={}}return m.prototype=a,a.Parser=m,new m}();typeof Ws<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Mi);function G(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var ji={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},Ii=Mi.parser;Ii.yy=ji;var Gs=Ii,Ks=Object.keys(ji);function Js(r){return Ks.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Li=Js,Zs=Li,Qs=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Hi(r){this.captures=r.captures,this.re=r.re}Hi.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(i,s){typeof t[s+1]>"u"?e[i]=void 0:e[i]=decodeURIComponent(t[s+1])}),e};var Xs=Zs({Concat:function(r){return r.children.reduce((function(t,e){var i=this.visit(e);return{re:t.re+i.re,captures:t.captures.concat(i.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Qs,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Hi({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),tr=Xs,er=Li,ir=er({Concat:function(r,t){var e=r.children.map((function(i){return this.visit(i,t)}).bind(this));return e.some(function(i){return i===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),sr=ir,rr=Gs,nr=tr,or=sr;$t.prototype=Object.create(null);$t.prototype.match=function(r){var t=nr.visit(this.ast),e=t.match(r);return e||!1};$t.prototype.reverse=function(r){return or.visit(this.ast,r)};function $t(r){var t;if(this?t=this:t=Object.create($t.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=rr.parse(r),t}var ar=$t,lr=ar,cr=lr;const hr=Ys(cr);var ur=Object.defineProperty,Di=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&ur(t,e,s),s};const zi=class extends Z{constructor(t,e,i=""){super(),this._cases=[],this._fallback=()=>lt` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new hr(s.path)})),this._historyObserver=new k(this,e),this._authObserver=new k(this,i)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),lt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(fi(this,"auth/redirect"),lt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):lt` <h1>Authenticating</h1> `;if("redirect"in e){const i=e.redirect;if(typeof i=="string")return this.redirect(i),lt` <h1>Redirecting to ${i}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:i}=t,s=new URLSearchParams(e),n=i+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:i,params:l,query:s}}}redirect(t){fe(this,"history/redirect",{href:t})}};zi.styles=Es`
    :host,
    main {
      display: contents;
    }
  `;let Rt=zi;Di([Ni()],Rt.prototype,"_user");Di([Ni()],Rt.prototype,"_match");const dr=Object.freeze(Object.defineProperty({__proto__:null,Element:Rt,Switch:Rt},Symbol.toStringTag,{value:"Module"})),Fi=class Bi extends HTMLElement{constructor(){if(super(),Ft(this).template(Bi.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Fi.template=z`
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
  `;let pr=Fi;const mr=Object.freeze(Object.defineProperty({__proto__:null,Element:pr},Symbol.toStringTag,{value:"Module"})),$e=class le extends HTMLElement{constructor(){super(),this._array=[],Ft(this).template(le.template).styles(le.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Vi("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const i=new Event("change",{bubbles:!0}),s=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=s,this.dispatchEvent(i)}}}),this.addEventListener("click",t=>{oe(t,"button.add")?Pt(t,"input-array:add"):oe(t,"button.remove")&&Pt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],fr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const i=Array.from(this.children).indexOf(e);this._array.splice(i,1),e.remove()}}};$e.template=z`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;$e.styles=yi`
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
  `;let gr=$e;function fr(r,t){t.replaceChildren(),r.forEach((e,i)=>t.append(Vi(e)))}function Vi(r,t){const e=r===void 0?z`<input />`:z`<input value="${r}" />`;return z`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}const vr=Object.freeze(Object.defineProperty({__proto__:null,Element:gr},Symbol.toStringTag,{value:"Module"}));function nt(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var yr=Object.defineProperty,br=Object.getOwnPropertyDescriptor,_r=(r,t,e,i)=>{for(var s=br(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&yr(t,e,s),s};class qi extends Z{constructor(t){super(),this._pending=[],this._observer=new k(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([i,s])=>{console.log("Dispatching queued event",s,i),i.dispatchEvent(s)}),e.setEffect(()=>{var i;if(console.log("View effect",this,e,(i=this._context)==null?void 0:i.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const i=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",i),e.dispatchEvent(i)):(console.log("Queueing message event",i),this._pending.push([e,i]))}ref(t){return this.model?this.model[t]:void 0}}_r([Ui()],qi.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const St=globalThis,we=St.ShadowRoot&&(St.ShadyCSS===void 0||St.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ae=Symbol(),Qe=new WeakMap;let Yi=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==Ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(we&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Qe.set(e,t))}return t}toString(){return this.cssText}};const $r=r=>new Yi(typeof r=="string"?r:r+"",void 0,Ae),S=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new Yi(e,r,Ae)},wr=(r,t)=>{if(we)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=St.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},Xe=we?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return $r(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ar,defineProperty:xr,getOwnPropertyDescriptor:Er,getOwnPropertyNames:kr,getOwnPropertySymbols:Sr,getPrototypeOf:Pr}=Object,R=globalThis,ti=R.trustedTypes,Cr=ti?ti.emptyScript:"",te=R.reactiveElementPolyfillSupport,dt=(r,t)=>r,Ut={toAttribute(r,t){switch(t){case Boolean:r=r?Cr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},xe=(r,t)=>!Ar(r,t),ei={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:xe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),R.litPropertyMetadata??(R.litPropertyMetadata=new WeakMap);class J extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ei){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&xr(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=Er(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);n.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ei}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=Pr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,i=[...kr(e),...Sr(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(Xe(s))}else t!==void 0&&e.push(Xe(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var n;const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const o=(((n=i.converter)==null?void 0:n.toAttribute)!==void 0?i.converter:Ut).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){var n;const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const o=i.getPropertyOptions(s),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Ut;this._$Em=s,this[s]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??xe)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(e)):this._$EU()}catch(s){throw t=!1,this._$EU(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[dt("elementProperties")]=new Map,J[dt("finalized")]=new Map,te==null||te({ReactiveElement:J}),(R.reactiveElementVersions??(R.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt=globalThis,Nt=pt.trustedTypes,ii=Nt?Nt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Wi="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Gi="?"+T,Or=`<${Gi}>`,B=document,ft=()=>B.createComment(""),vt=r=>r===null||typeof r!="object"&&typeof r!="function",Ee=Array.isArray,Tr=r=>Ee(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",ee=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,si=/-->/g,ri=/>/g,L=RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ni=/'/g,oi=/"/g,Ki=/^(?:script|style|textarea|title)$/i,Rr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),v=Rr(1),st=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),ai=new WeakMap,D=B.createTreeWalker(B,129);function Ji(r,t){if(!Ee(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ii!==void 0?ii.createHTML(t):t}const Ur=(r,t)=>{const e=r.length-1,i=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ct;for(let l=0;l<e;l++){const a=r[l];let d,m,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,m=o.exec(a),m!==null);)c=o.lastIndex,o===ct?m[1]==="!--"?o=si:m[1]!==void 0?o=ri:m[2]!==void 0?(Ki.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=L):m[3]!==void 0&&(o=L):o===L?m[0]===">"?(o=s??ct,u=-1):m[1]===void 0?u=-2:(u=o.lastIndex-m[2].length,d=m[1],o=m[3]===void 0?L:m[3]==='"'?oi:ni):o===oi||o===ni?o=L:o===si||o===ri?o=ct:(o=L,s=void 0);const h=o===L&&r[l+1].startsWith("/>")?" ":"";n+=o===ct?a+Or:u>=0?(i.push(d),a.slice(0,u)+Wi+a.slice(u)+T+h):a+T+(u===-2?l:h)}return[Ji(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class yt{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,m]=Ur(t,e);if(this.el=yt.createElement(d,i),D.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=D.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Wi)){const c=m[o++],h=s.getAttribute(u).split(T),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Mr:p[1]==="?"?jr:p[1]==="@"?Ir:Vt}),s.removeAttribute(u)}else u.startsWith(T)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(Ki.test(s.tagName)){const u=s.textContent.split(T),c=u.length-1;if(c>0){s.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],ft()),D.nextNode(),a.push({type:2,index:++n});s.append(u[c],ft())}}}else if(s.nodeType===8)if(s.data===Gi)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(T,u+1))!==-1;)a.push({type:7,index:n}),u+=T.length-1}n++}}static createElement(t,e){const i=B.createElement("template");return i.innerHTML=t,i}}function rt(r,t,e=r,i){var o,l;if(t===st)return t;let s=i!==void 0?(o=e._$Co)==null?void 0:o[i]:e._$Cl;const n=vt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=s:e._$Cl=s),s!==void 0&&(t=rt(r,s._$AS(r,t.values),s,i)),t}class Nr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??B).importNode(e,!0);D.currentNode=s;let n=D.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new wt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Lr(n,this,t)),this._$AV.push(d),a=i[++l]}o!==(a==null?void 0:a.index)&&(n=D.nextNode(),o++)}return D.currentNode=B,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),vt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Tr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=yt.createElement(Ji(i.h,i.h[0]),this.options)),i);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(e);else{const o=new Nr(s,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=ai.get(t.strings);return e===void 0&&ai.set(t.strings,e=new yt(t)),e}k(t){Ee(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new wt(this.O(ft()),this.O(ft()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Vt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=$}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(n===void 0)t=rt(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==st,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=rt(this,l[i+a],e,a),d===st&&(d=this._$AH[a]),o||(o=!vt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Mr extends Vt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class jr extends Vt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Ir extends Vt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??$)===st)return;const i=this._$AH,s=t===$&&i!==$||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==$&&(i===$||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Lr{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}}const ie=pt.litHtmlPolyfillSupport;ie==null||ie(yt,wt),(pt.litHtmlVersions??(pt.litHtmlVersions=[])).push("3.2.1");const Hr=(r,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new wt(t.insertBefore(ft(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let E=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Hr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return st}};var ci;E._$litElement$=!0,E.finalized=!0,(ci=globalThis.litElementHydrateSupport)==null||ci.call(globalThis,{LitElement:E});const se=globalThis.litElementPolyfillSupport;se==null||se({LitElement:E});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const Dr={};function zr(r,t,e){switch(r[0]){case"trip/select":Fr(r[1],e).then(s=>t(n=>({...n,trip:s})));break;case"trip/save":Br(r[1],e).then(s=>t(n=>({...n,trip:s}))).then(()=>{const{onSuccess:s}=r[1];s&&s()}).catch(s=>{const{onFailure:n}=r[1];n&&n(s)});break;default:const i=r[0];throw new Error(`Unhandled Auth message ${i}`)}}function Fr(r,t){return fetch(`http://localhost:3000/api/itineraries/${r.tripId}`,{headers:C.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("TRIP:",e),e})}function Br(r,t){return fetch(`/api/itineraries/${r.tripId}`,{method:"PUT",headers:{"Content-Type":"application/json",...C.headers(t)},body:JSON.stringify(r.trip)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save profile for ${r.tripId}`)}).then(e=>{if(e)return e})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vr={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:xe},qr=(r=Vr,t,e)=>{const{kind:i,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,r),i==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(i==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+i)};function qt(r){return(t,e)=>typeof e=="object"?qr(r,t,e):((i,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?{...i,wrapped:!0}:i),o?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function At(r){return qt({...r,state:!0,attribute:!1})}const U=S`
  body {
    background-color: var(--color-background-page);
    color: var(--color-main-font);
    font-family: var(--font-family-body);
  }

  body.darkmode {
    --color-background-page: rgb(0, 28, 0);
    --color-background-bottom-header: rgb(0, 50, 0);
    --color-background-top-header: rgb(51, 117, 51);
    --color-background-image-title: rgba(0, 0, 0, 0.482);
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
`;var Yr=Object.defineProperty,Wr=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Yr(t,e,s),s};function Gr(r){vi.relay(r,"auth:message",["auth/signout"])}function Kr(r){const e=r.target.checked;vi.relay(r,"darkmode",{checked:e})}const Lt=class Lt extends E{constructor(){super(...arguments),this.userid="camper",this._authObserver=new k(this,"backpack:auth")}render(){return v`
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
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&t.username!==this.userid&&(this.userid=t.username)})}static initializeOnce(){function t(e,i){e.classList.toggle("darkmode",i)}document.body.addEventListener("darkmode",e=>{var i;return t(e.currentTarget,(i=e.detail)==null?void 0:i.checked)})}};Lt.uses=nt({"mu-dropdown":mr.Element}),Lt.styles=[U,N,S`
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
    `];let bt=Lt;Wr([At()],bt.prototype,"userid");var Jr=Object.defineProperty,Zr=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Jr(t,e,s),s};const ke=class ke extends E{constructor(){super(...arguments),this.src="http://localhost:3000/api/itineraries/",this.tripIndex=new Array,this._authObserver=new k(this,"backpack:auth"),this._user=new C.User}render(){const t=this.tripIndex.map(this.renderItem);return v`
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
                  <a href="app/step2">
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
              ${t}
            </ul>
          </section>
        </section>
      </main>
    `}renderItem(t){return v`
      <li>
        <a href="app/itinerary/${t._id.toString()}">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#itinerary" />
          </svg>
          <h4>${t.title}</h4>
        </a>
      </li>
    `}hydrate(t){fetch(t,{headers:C.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{this.tripIndex=e}).catch(e=>console.log("Failed to tour data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}};ke.styles=[N,U,S`
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
    `];let Mt=ke;Zr([At()],Mt.prototype,"tripIndex");const Ht=class Ht extends E{render(){return v`
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
    `}};Ht.uses=nt({}),Ht.styles=[N,U,S`
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
    `];let ce=Ht;var Qr=Object.defineProperty,Xr=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Qr(t,e,s),s};const Se=class Se extends E{render(){return v`
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
        background-color: var(--color-background-image-title);
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
    `];let jt=Se;Xr([qt({type:String})],jt.prototype,"image_url");const Dt=class Dt extends E{constructor(){super(...arguments),this._authObserver=new k(this,"backpack:auth"),this._user=new C.User}render(){return v`
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
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t)})}};Dt.uses=nt({"camp-site":jt}),Dt.styles=[N,U,S`
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
    `];let he=Dt;const Pe=class Pe extends E{constructor(){super(...arguments),this._authObserver=new k(this,"backpack:auth"),this._user=new C.User}render(){return v`
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
            <label for="lunch1">PB&J Tortillas + Sum Saus + Cheese</label><br />
            <input type="checkbox" id="lunch2" name="lunch2" value="lunch" />
            <label for="lunch2">Hamburger Helper</label><br />
            <input type="checkbox" id="lunch3" name="lunch3" value="lunch" />
            <label for="lunch3">Ham/Turkey + Cheese Sammies</label><br />
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
        gap: var(--margin-s);
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
    `];let ue=Pe;var tn=Object.defineProperty,en=Object.getOwnPropertyDescriptor,Yt=(r,t,e,i)=>{for(var s=i>1?void 0:i?en(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&tn(t,e,s),s};function li(r){const t={month:"long",day:"numeric",timeZone:"UTC"},e=new Intl.DateTimeFormat("en-US",t).format(r);return sn(e)}function sn(r){const[t,e]=r.split(" "),i=parseInt(e,10);let s;return i===1||i===21||i===31?s="st":i===2||i===22?s="nd":i===3||i===23?s="rd":s="th",`${t} ${i}${s}`}const zt=class zt extends qi{constructor(){super("backpack:model"),this.mode="view"}get trip(){return this.model.trip}get _trip(){if(this.trip)return{title:this.trip.title,startDate:new Date(this.trip.startDate),endDate:new Date(this.trip.endDate),region:this.trip.location.region,members:this.trip.members.map(t=>t.name),campsites:this.trip.location.campsite,activities:this.trip.activities,gear:this.trip.gear}}render(){var t;return this.trip?v`
        <section>
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
              ${li(new Date(this.trip.startDate))} -
              ${li(new Date(this.trip.endDate))}
            </h5>
            <section class="four-sections">
              <section>
                <h2>Group:</h2>
                <ul>
                  ${this.trip.members.map(e=>v`<li>${e.name}</li>`)}
                </ul>
              </section>
              <section>
                <h2>Location:</h2>
                <ul>
                  <li>${this.trip.location.region}</li>
                  ${this.trip.location.campsite.map(e=>v`<li>${e}</li>`)}
                </ul>
              </section>
              <section>
                <h2>Activities:</h2>
                <ul>
                  ${(t=this.trip.activities)==null?void 0:t.map(e=>v`<li>${e}</li>`)}
                </ul>
              </section>
              <section class="gear-section">
                <h2>Gear:</h2>
                ${this.trip.gear.map(e=>v` <label key=${e.replace(/\s+/g,"_")}>
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
          <mu-form
            class="edit"
            @mu-form:submit=${this._handleSubmit}
            .init=${this._trip}
          >
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
      `:v` <h1>TRIP NOT FOUND...</h1> `}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="tripid"&&e!==i&&i&&(console.log("dispatching trip/select"),this.dispatchMessage(["trip/select",{tripId:i}]))}_handleSubmit(t){if(console.log("Handling submit of mu-form"),!this.trip)throw new Error("Trip is undefined. Cannot format trip data.");const e=t.detail,i={_id:this.trip._id,title:e.title,startDate:e.startDate,endDate:e.endDate,members:e.members.map((s,n)=>({name:s,id:n})),location:{region:e.region,campsite:e.campsites},activities:e.activities,gear:e.gear,image_urls:this.trip.image_urls};console.log("TRIP ON SUBMIT:",i),this.dispatchMessage(["trip/save",{tripId:this.tripid?this.tripid:"",trip:i,onSuccess:()=>{$i.dispatch(this,"history/navigate",{href:`/app/itinerary/${this.tripid}`}),this.mode="view"},onFailure:s=>console.log("ERROR:",s)}])}};zt.uses=nt({"mu-form":vs.Element,"input-array":vr.Element}),zt.styles=[N,U,S`
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
    `];let V=zt;Yt([qt()],V.prototype,"tripid",2);Yt([qt({reflect:!0})],V.prototype,"mode",2);Yt([At()],V.prototype,"trip",1);Yt([At()],V.prototype,"_trip",1);var rn=Object.defineProperty,nn=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&rn(t,e,s),s};const Ce=class Ce extends E{constructor(){super(...arguments),this.src="http://localhost:3000/api/itineraries/",this.tripIndex=new Array,this._authObserver=new k(this,"backpack:auth"),this._user=new C.User}render(){const t=this.tripIndex.map(this.renderGear),e=this.tripIndex.map(this.renderTripImage);return v`
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
            ${e}
          </section>
          <section id="my-gear" class="my-gear">
            <h1>My Gear</h1>
            ${t}
          </section>
          <section id="request" class="request">
            <h1>Pending Invites</h1>
            <input type="checkbox" id="invite1" name="invite1" value="invite" />
            <label for="invite1">2025 Yosemite Trip</label><br />
          </section>
        </section>
      </main>
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:C.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{this.tripIndex=e}).catch(e=>console.log("Failed to tour data:",e))}renderGear(t){var e;return v`
      <section class="gear-list">
        <h2>${t.title}</h2>
        ${((e=t.gear)==null?void 0:e.map((i,s)=>v`
            <input
              type="checkbox"
              id="gear-${s}-${t._id.toString()}"
              name="gear-group-${s}"
              value="gear-${s}-${t._id.toString()}"
            />
            <label for="gear-${s}-${t._id.toString()}">${i}</label><br />
          `))??v`<p>All gear prepared.</p>`}
      </section>
    `}renderTripImage(t){return v`
      <a
        class="trip-link"
        href="/app/itinerary/${t._id.toString()}"
        style="text-decoration: none; color: inherit;"
      >
        <header
          class="trip-img"
          style="background-image: url(${t.image_urls[1]})"
        >
          <h2 class="title">${t.title}</h2>
        </header>
      </a>
    `}};Ce.styles=[N,U,S`
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
        margin-bottom: var(--margin-s);
      }

      .trip-link {
        display: block;
      }

      h2 {
        height: fit-content;
        padding: 10px;
      }

      h2.title {
        background-color: var(--color-background-image-title);
        width: 100%;
        text-align: center;
      }

      .gear-list {
        padding-bottom: var(--margin-s);
      }
    `];let It=Ce;nn([At()],It.prototype,"tripIndex");const on=[{path:"/app/itinerary/:id",view:(r,t)=>v`
      <itinerary-view
        tripid=${r.id}
        mode=${t!=null&&t.has("edit")?"edit":t!=null&&t.has("new")?"new":"view"}
      >
      </itinerary-view>
    `},{path:"/app/itinerary/edit/:id",view:(r,t)=>v`
      <itinerary-view
        tripid=${r.id}
        mode=${t!=null&&t.has("edit")?"edit":t!=null&&t.has("new")?"new":"view"}
      >
      </itinerary-view>
    `},{path:"/app/step1",view:()=>v` <step1-view></step1-view>`},{path:"/app/step2",view:()=>v` <step2-view></step2-view>`},{path:"/app/profile",view:()=>v` <profile-view></profile-view>`},{path:"/app",view:()=>v` <home-view></home-view> `},{path:"/",redirect:"/app"}],Oe=class Oe extends E{render(){return v` <mu-switch></mu-switch> `}connectedCallback(){super.connectedCallback(),bt.initializeOnce()}};Oe.uses=nt({"home-view":Mt,"login-view":ce,"step1-view":he,"step2-view":ue,"itinerary-view":V,"profile-view":It});let de=Oe;nt({"mu-auth":C.Provider,"mu-history":$i.Provider,"mu-switch":class extends dr.Element{constructor(){super(on,"backpack:history","backpack:auth")}},"mu-store":class extends As.Provider{constructor(){super(zr,Dr,"backpack:auth")}},"backpack-app":de,"bp-header":bt});
