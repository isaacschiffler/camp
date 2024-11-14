(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var j,de;class tt extends Error{}tt.prototype.name="InvalidTokenError";function Os(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Ts(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Os(t)}catch{return atob(t)}}function ze(r,t){if(typeof r!="string")throw new tt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new tt(`Invalid token specified: missing part #${e+1}`);let i;try{i=Ts(s)}catch(n){throw new tt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new tt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Rs="mu:context",qt=`${Rs}:change`;class Us{constructor(t,e){this._proxy=Ls(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Ns extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Us(t,this),this.style.display="contents"}attach(t){return this.addEventListener(qt,t),t}detach(t){this.removeEventListener(qt,t)}}function Ls(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(qt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function Ms(r,t){const e=De(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function De(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return De(r,i.host)}class Hs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Ve(r="mu:message"){return(t,...e)=>t.dispatchEvent(new Hs(e,r))}class Zt{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Is(r){return t=>({...t,...r})}const Bt="mu:auth:jwt",Fe=class qe extends Zt{constructor(t,e){super((s,i)=>this.update(s,i),t,qe.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(zs(s)),It(i);case"auth/signout":return e(Ds()),It(this._redirectForLogin);case"auth/redirect":return It(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};Fe.EVENT_TYPE="auth:message";let Be=Fe;const We=Ve(Be.EVENT_TYPE);function It(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class js extends Ns{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:q.authenticateFromLocalStorage()})}connectedCallback(){new Be(this.context,this.redirect).attach(this)}}class rt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Bt),t}}class q extends rt{constructor(t){super();const e=ze(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new q(t);return localStorage.setItem(Bt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Bt);return t?q.authenticate(t):new rt}}function zs(r){return Is({user:q.authenticate(r),token:r})}function Ds(){return r=>{const t=r.user;return{user:t&&t.authenticated?rt.deauthenticate(t):t,token:""}}}function Vs(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function Fs(r){return r.authenticated?ze(r.token||""):{}}const Wt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:q,Provider:js,User:rt,dispatch:We,headers:Vs,payload:Fs},Symbol.toStringTag,{value:"Module"}));function vt(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function Yt(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const qs=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Yt,relay:vt},Symbol.toStringTag,{value:"Module"}));function Ye(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const Bs=new DOMParser;function ut(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=Bs.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(console.log("Processing parameter:",a),typeof a){case"string":return pe(a);case"bigint":case"boolean":case"number":case"symbol":return pe(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function pe(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ct(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}j=class extends HTMLElement{constructor(){super(),this._state={},Ct(this).template(j.template).styles(j.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),vt(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},Ws(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},j.template=ut`
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
  `,j.styles=Ye`
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
  `;function Ws(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const Ke=class Je extends Zt{constructor(t){super((e,s)=>this.update(e,s),t,Je.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(Ks(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(Js(s,i));break}}}};Ke.EVENT_TYPE="history:message";let Ys=Ke;function Ks(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function Js(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const Gs=Ve(Ys.EVENT_TYPE);class nt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new fe(this._provider,t);this._effects.push(i),e(i)}else Ms(this._target,this._contextLabel).then(i=>{const n=new fe(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class fe{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Ge=class Ze extends HTMLElement{constructor(){super(),this._state={},this._user=new rt,this._authObserver=new nt(this,"blazing:auth"),Ct(this).template(Ze.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Zs(i,this._state,e,this.authorization).then(n=>G(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},G(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&me(this.src,this.authorization).then(e=>{this._state=e,G(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&me(this.src,this.authorization).then(i=>{this._state=i,G(i,this)});break;case"new":s&&(this._state={},G({},this));break}}};Ge.observedAttributes=["src","new","action"];Ge.template=ut`
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
  `;function me(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function G(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function Zs(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const Qs=class Qe extends Zt{constructor(t,e){super(e,t,Qe.EVENT_TYPE,!1)}};Qs.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yt=globalThis,Qt=yt.ShadowRoot&&(yt.ShadyCSS===void 0||yt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Xt=Symbol(),ge=new WeakMap;let Xe=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Xt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Qt&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ge.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ge.set(e,t))}return t}toString(){return this.cssText}};const Xs=r=>new Xe(typeof r=="string"?r:r+"",void 0,Xt),ti=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Xe(e,r,Xt)},ei=(r,t)=>{if(Qt)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=yt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ye=Qt?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Xs(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:si,defineProperty:ii,getOwnPropertyDescriptor:ri,getOwnPropertyNames:ni,getOwnPropertySymbols:oi,getPrototypeOf:ai}=Object,B=globalThis,_e=B.trustedTypes,li=_e?_e.emptyScript:"",ve=B.reactiveElementPolyfillSupport,et=(r,t)=>r,$t={toAttribute(r,t){switch(t){case Boolean:r=r?li:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},te=(r,t)=>!si(r,t),$e={attribute:!0,type:String,converter:$t,reflect:!1,hasChanged:te};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),B.litPropertyMetadata??(B.litPropertyMetadata=new WeakMap);let D=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$e){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ii(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=ri(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$e}static _$Ei(){if(this.hasOwnProperty(et("elementProperties")))return;const t=ai(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(et("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(et("properties"))){const e=this.properties,s=[...ni(e),...oi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(ye(i))}else t!==void 0&&e.push(ye(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ei(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:$t).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:$t;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??te)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};D.elementStyles=[],D.shadowRootOptions={mode:"open"},D[et("elementProperties")]=new Map,D[et("finalized")]=new Map,ve==null||ve({ReactiveElement:D}),(B.reactiveElementVersions??(B.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=globalThis,At=bt.trustedTypes,be=At?At.createPolicy("lit-html",{createHTML:r=>r}):void 0,ts="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,es="?"+S,ci=`<${es}>`,L=document,ot=()=>L.createComment(""),at=r=>r===null||typeof r!="object"&&typeof r!="function",ee=Array.isArray,hi=r=>ee(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",jt=`[ 	
\f\r]`,Z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ae=/-->/g,Ee=/>/g,O=RegExp(`>|${jt}(?:([^\\s"'>=/]+)(${jt}*=${jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),we=/'/g,Se=/"/g,ss=/^(?:script|style|textarea|title)$/i,ui=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),Q=ui(1),W=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),xe=new WeakMap,R=L.createTreeWalker(L,129);function is(r,t){if(!ee(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return be!==void 0?be.createHTML(t):t}const di=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=Z;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===Z?f[1]==="!--"?o=Ae:f[1]!==void 0?o=Ee:f[2]!==void 0?(ss.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=O):f[3]!==void 0&&(o=O):o===O?f[0]===">"?(o=i??Z,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?O:f[3]==='"'?Se:we):o===Se||o===we?o=O:o===Ae||o===Ee?o=Z:(o=O,i=void 0);const h=o===O&&r[l+1].startsWith("/>")?" ":"";n+=o===Z?a+ci:u>=0?(s.push(d),a.slice(0,u)+ts+a.slice(u)+S+h):a+S+(u===-2?l:h)}return[is(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let Kt=class rs{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=di(t,e);if(this.el=rs.createElement(d,s),R.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=R.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(ts)){const c=f[o++],h=i.getAttribute(u).split(S),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?fi:p[1]==="?"?mi:p[1]==="@"?gi:Ot}),i.removeAttribute(u)}else u.startsWith(S)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(ss.test(i.tagName)){const u=i.textContent.split(S),c=u.length-1;if(c>0){i.textContent=At?At.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],ot()),R.nextNode(),a.push({type:2,index:++n});i.append(u[c],ot())}}}else if(i.nodeType===8)if(i.data===es)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(S,u+1))!==-1;)a.push({type:7,index:n}),u+=S.length-1}n++}}static createElement(t,e){const s=L.createElement("template");return s.innerHTML=t,s}};function Y(r,t,e=r,s){var i,n;if(t===W)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=at(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=Y(r,o._$AS(r,t.values),o,s)),t}class pi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??L).importNode(e,!0);R.currentNode=i;let n=R.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new dt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new yi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=R.nextNode(),o++)}return R.currentNode=L,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class dt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),at(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==W&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):hi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&at(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Kt.createElement(is(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new pi(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=xe.get(t.strings);return e===void 0&&xe.set(t.strings,e=new Kt(t)),e}k(t){ee(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new dt(this.O(ot()),this.O(ot()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Ot{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=Y(this,t,e,0),o=!at(t)||t!==this._$AH&&t!==W,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=Y(this,l[s+a],e,a),d===W&&(d=this._$AH[a]),o||(o=!at(d)||d!==this._$AH[a]),d===v?t=v:t!==v&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class fi extends Ot{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}}class mi extends Ot{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}}class gi extends Ot{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??v)===W)return;const s=this._$AH,i=t===v&&s!==v||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class yi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const Pe=bt.litHtmlPolyfillSupport;Pe==null||Pe(Kt,dt),(bt.litHtmlVersions??(bt.litHtmlVersions=[])).push("3.2.0");const _i=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new dt(t.insertBefore(ot(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let F=class extends D{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=_i(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return W}};F._$litElement$=!0,F.finalized=!0,(de=globalThis.litElementHydrateSupport)==null||de.call(globalThis,{LitElement:F});const ke=globalThis.litElementPolyfillSupport;ke==null||ke({LitElement:F});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vi={attribute:!0,type:String,converter:$t,reflect:!1,hasChanged:te},$i=(r=vi,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function ns(r){return(t,e)=>typeof e=="object"?$i(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function os(r){return ns({...r,state:!0,attribute:!1})}function bi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Ai(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var as={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,y,Ut){var A=y.length-1;switch(m){case 1:return new g.Root({},[y[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new g.Literal({value:y[A]});break;case 7:this.$=new g.Splat({name:y[A]});break;case 8:this.$=new g.Param({name:y[A]});break;case 9:this.$=new g.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],y=this.table,Ut="",A=0,ce=0,xs=2,he=1,Ps=m.slice.call(arguments,1),_=Object.create(this.lexer),k={yy:{}};for(var Nt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Nt)&&(k.yy[Nt]=this.yy[Nt]);_.setInput(c,k.yy),k.yy.lexer=_,k.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Lt=_.yylloc;m.push(Lt);var ks=_.options&&_.options.ranges;typeof k.yy.parseError=="function"?this.parseError=k.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Cs=function(){var I;return I=_.lex()||he,typeof I!="number"&&(I=h.symbols_[I]||I),I},b,C,E,Mt,H={},mt,w,ue,gt;;){if(C=p[p.length-1],this.defaultActions[C]?E=this.defaultActions[C]:((b===null||typeof b>"u")&&(b=Cs()),E=y[C]&&y[C][b]),typeof E>"u"||!E.length||!E[0]){var Ht="";gt=[];for(mt in y[C])this.terminals_[mt]&&mt>xs&&gt.push("'"+this.terminals_[mt]+"'");_.showPosition?Ht="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+gt.join(", ")+", got '"+(this.terminals_[b]||b)+"'":Ht="Parse error on line "+(A+1)+": Unexpected "+(b==he?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(Ht,{text:_.match,token:this.terminals_[b]||b,line:_.yylineno,loc:Lt,expected:gt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+C+", token: "+b);switch(E[0]){case 1:p.push(b),g.push(_.yytext),m.push(_.yylloc),p.push(E[1]),b=null,ce=_.yyleng,Ut=_.yytext,A=_.yylineno,Lt=_.yylloc;break;case 2:if(w=this.productions_[E[1]][1],H.$=g[g.length-w],H._$={first_line:m[m.length-(w||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(w||1)].first_column,last_column:m[m.length-1].last_column},ks&&(H._$.range=[m[m.length-(w||1)].range[0],m[m.length-1].range[1]]),Mt=this.performAction.apply(H,[Ut,ce,A,k.yy,E[1],g,m].concat(Ps)),typeof Mt<"u")return Mt;w&&(p=p.slice(0,-1*w*2),g=g.slice(0,-1*w),m=m.slice(0,-1*w)),p.push(this.productions_[E[1]][0]),g.push(H.$),m.push(H._$),ue=y[p[p.length-2]][p[p.length-1]],p.push(ue);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Ai<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(as);function z(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var ls={Root:z("Root"),Concat:z("Concat"),Literal:z("Literal"),Splat:z("Splat"),Param:z("Param"),Optional:z("Optional")},cs=as.parser;cs.yy=ls;var Ei=cs,wi=Object.keys(ls);function Si(r){return wi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var hs=Si,xi=hs,Pi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function us(r){this.captures=r.captures,this.re=r.re}us.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var ki=xi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Pi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new us({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Ci=ki,Oi=hs,Ti=Oi({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Ri=Ti,Ui=Ei,Ni=Ci,Li=Ri;pt.prototype=Object.create(null);pt.prototype.match=function(r){var t=Ni.visit(this.ast),e=t.match(r);return e||!1};pt.prototype.reverse=function(r){return Li.visit(this.ast,r)};function pt(r){var t;if(this?t=this:t=Object.create(pt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Ui.parse(r),t}var Mi=pt,Hi=Mi,Ii=Hi;const ji=bi(Ii);var zi=Object.defineProperty,ds=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&zi(t,e,i),i};const ps=class extends F{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>Q`
      <h1>Not Found</h1>
    `,this._cases=t.map(i=>({...i,route:new ji(i.path)})),this._historyObserver=new nt(this,e),this._authObserver=new nt(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),Q`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(We(this,"auth/redirect"),Q`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):Q`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),Q`
              <h1>Redirecting to ${s}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){Gs(this,"history/redirect",{href:t})}};ps.styles=ti`
    :host,
    main {
      display: contents;
    }
  `;let fs=ps;ds([os()],fs.prototype,"_user");ds([os()],fs.prototype,"_match");const ms=class gs extends HTMLElement{constructor(){if(super(),Ct(this).template(gs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ms.template=ut`
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
  `;let Di=ms;const Vi=Object.freeze(Object.defineProperty({__proto__:null,Element:Di},Symbol.toStringTag,{value:"Module"})),ys=class Jt extends HTMLElement{constructor(){super(),this._array=[],Ct(this).template(Jt.template).styles(Jt.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(_s("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Yt(t,"button.add")?vt(t,"input-array:add"):Yt(t,"button.remove")&&vt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Fi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};ys.template=ut`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;ys.styles=Ye`
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
  `;function Fi(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(_s(e)))}function _s(r,t){const e=r===void 0?"":`value="${r}"`;return ut`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function se(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var qi=Object.defineProperty,Bi=Object.getOwnPropertyDescriptor,Wi=(r,t,e,s)=>{for(var i=Bi(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&qi(t,e,i),i};class Yi extends F{constructor(t){super(),this._pending=[],this._observer=new nt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Wi([ns()],Yi.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _t=globalThis,ie=_t.ShadowRoot&&(_t.ShadyCSS===void 0||_t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,re=Symbol(),Ce=new WeakMap;let vs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==re)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ie&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ce.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ce.set(e,t))}return t}toString(){return this.cssText}};const Ki=r=>new vs(typeof r=="string"?r:r+"",void 0,re),Tt=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new vs(e,r,re)},Ji=(r,t)=>{if(ie)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=_t.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Oe=ie?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ki(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Gi,defineProperty:Zi,getOwnPropertyDescriptor:Qi,getOwnPropertyNames:Xi,getOwnPropertySymbols:tr,getPrototypeOf:er}=Object,P=globalThis,Te=P.trustedTypes,sr=Te?Te.emptyScript:"",zt=P.reactiveElementPolyfillSupport,st=(r,t)=>r,Et={toAttribute(r,t){switch(t){case Boolean:r=r?sr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ne=(r,t)=>!Gi(r,t),Re={attribute:!0,type:String,converter:Et,reflect:!1,hasChanged:ne};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),P.litPropertyMetadata??(P.litPropertyMetadata=new WeakMap);class V extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Re){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Zi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Qi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Re}static _$Ei(){if(this.hasOwnProperty(st("elementProperties")))return;const t=er(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(st("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(st("properties"))){const e=this.properties,s=[...Xi(e),...tr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Oe(i))}else t!==void 0&&e.push(Oe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ji(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Et).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Et;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ne)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[st("elementProperties")]=new Map,V[st("finalized")]=new Map,zt==null||zt({ReactiveElement:V}),(P.reactiveElementVersions??(P.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const it=globalThis,wt=it.trustedTypes,Ue=wt?wt.createPolicy("lit-html",{createHTML:r=>r}):void 0,$s="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,bs="?"+x,ir=`<${bs}>`,M=document,lt=()=>M.createComment(""),ct=r=>r===null||typeof r!="object"&&typeof r!="function",oe=Array.isArray,rr=r=>oe(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Dt=`[ 	
\f\r]`,X=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ne=/-->/g,Le=/>/g,T=RegExp(`>|${Dt}(?:([^\\s"'>=/]+)(${Dt}*=${Dt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Me=/'/g,He=/"/g,As=/^(?:script|style|textarea|title)$/i,nr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),St=nr(1),K=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ie=new WeakMap,U=M.createTreeWalker(M,129);function Es(r,t){if(!oe(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ue!==void 0?Ue.createHTML(t):t}const or=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=X;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===X?f[1]==="!--"?o=Ne:f[1]!==void 0?o=Le:f[2]!==void 0?(As.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=T):f[3]!==void 0&&(o=T):o===T?f[0]===">"?(o=i??X,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?T:f[3]==='"'?He:Me):o===He||o===Me?o=T:o===Ne||o===Le?o=X:(o=T,i=void 0);const h=o===T&&r[l+1].startsWith("/>")?" ":"";n+=o===X?a+ir:u>=0?(s.push(d),a.slice(0,u)+$s+a.slice(u)+x+h):a+x+(u===-2?l:h)}return[Es(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class ht{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=or(t,e);if(this.el=ht.createElement(d,s),U.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=U.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith($s)){const c=f[o++],h=i.getAttribute(u).split(x),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?lr:p[1]==="?"?cr:p[1]==="@"?hr:Rt}),i.removeAttribute(u)}else u.startsWith(x)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(As.test(i.tagName)){const u=i.textContent.split(x),c=u.length-1;if(c>0){i.textContent=wt?wt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],lt()),U.nextNode(),a.push({type:2,index:++n});i.append(u[c],lt())}}}else if(i.nodeType===8)if(i.data===bs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(x,u+1))!==-1;)a.push({type:7,index:n}),u+=x.length-1}n++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function J(r,t,e=r,s){var o,l;if(t===K)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=ct(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=J(r,i._$AS(r,t.values),i,s)),t}class ar{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??M).importNode(e,!0);U.currentNode=i;let n=U.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new ft(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new ur(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=U.nextNode(),o++)}return U.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class ft{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),ct(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==K&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):rr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&ct(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=ht.createElement(Es(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new ar(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Ie.get(t.strings);return e===void 0&&Ie.set(t.strings,e=new ht(t)),e}k(t){oe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new ft(this.O(lt()),this.O(lt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Rt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=J(this,t,e,0),o=!ct(t)||t!==this._$AH&&t!==K,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=J(this,l[s+a],e,a),d===K&&(d=this._$AH[a]),o||(o=!ct(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class lr extends Rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class cr extends Rt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class hr extends Rt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??$)===K)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ur{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const Vt=it.litHtmlPolyfillSupport;Vt==null||Vt(ht,ft),(it.litHtmlVersions??(it.litHtmlVersions=[])).push("3.2.1");const dr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new ft(t.insertBefore(lt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let N=class extends V{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=dr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return K}};var je;N._$litElement$=!0,N.finalized=!0,(je=globalThis.litElementHydrateSupport)==null||je.call(globalThis,{LitElement:N});const Ft=globalThis.litElementPolyfillSupport;Ft==null||Ft({LitElement:N});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const ws=Tt`
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
`,Ss=Tt`
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
`,kt=class kt extends N{render(){return St`
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
                  @click=${t=>qs.relay(t,"darkmode",{checked:t.target.checked})}
                  class="dark-mode-switch"
                >
                  <input type="checkbox" autocomplete="off" />
                  Dark Mode
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout">Sign Out</a>
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
    `}static initializeOnce(){function t(e,s){e.classList.toggle("darkmode",s)}document.body.addEventListener("darkmode",e=>{var s;return t(e.currentTarget,(s=e.detail)==null?void 0:s.checked)})}};kt.uses=se({"mu-dropdown":Vi.Element}),kt.styles=[ws,Ss,Tt`
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
    `];let xt=kt;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pr={attribute:!0,type:String,converter:Et,reflect:!1,hasChanged:ne},fr=(r=pr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function mr(r){return(t,e)=>typeof e=="object"?fr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function gr(r){return mr({...r,state:!0,attribute:!1})}var yr=Object.defineProperty,_r=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&yr(t,e,i),i};const ae=class ae extends N{constructor(){super(...arguments),this.src="http://localhost:3000/api/itineraries/",this.tourIndex=new Array,this._authObserver=new nt(this,"blazing:auth"),this._user=new Wt.User}render(){const t=this.tourIndex.map(this.renderItem);return St`
      <main class="page">
        <section class="landing">
          <section class="plan">
            <h2>Plan your trip now!</h2>
            <header
              class="gs-image"
              style="background-image: url('/images/2Y1.jpeg')"
            >
              <a href="step1.html" class="gs-link">
                <button class="get-started" href="step1.html">
                  Get Started!
                </button>
              </a>
              <p>Location: Yellowstone</p>
            </header>
            <section class="nav-bar">
              <ul class="nav">
                <li>
                  <a href="step1.html">
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
                  <h4>Trip to Yellowstone</h4>
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:3000/itinerary/6721180a91b98c720183ddfa"
                >
                  <svg class="page-icons">
                    <use href="/icons/sprite.svg#itinerary" />
                  </svg>
                  <h4>Trip to Glacier</h4>
                </a>
              </li>
            </ul>
            ${t}
          </section>
        </section>
      </main>
    `}renderItem(t){return St`
      <a href="/itinerary/123">
        <h1>${t.title}</h1>
      </a>
    `}hydrate(t){fetch(t,{headers:Wt.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{if(e){const{trips:s}=e;this.tourIndex=s}}).catch(e=>console.log("Failed to tour data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t)}),this.hydrate(this.src)}};ae.styles=[Ss,ws,Tt`
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
    `];let Pt=ae;_r([gr()],Pt.prototype,"tourIndex");const le=class le extends N{render(){return St` <home-view></home-view> `}connectedCallback(){super.connectedCallback(),xt.initializeOnce()}};le.uses=se({"home-view":Pt});let Gt=le;se({"mu-auth":Wt.Provider,"backpack-app":Gt,"bp-header":xt});
