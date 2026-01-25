"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const u=require("./functions.cea097b8.cjs");function c(n,e,t,i){var s=arguments.length,r=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(n,e,t,i);else for(var h=n.length-1;h>=0;h--)(a=n[h])&&(r=(s<3?a(r):s>3?a(e,t,r):a(e,t))||r);return s>3&&r&&Object.defineProperty(e,t,r),r}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Q=window,ee=Q.ShadowRoot&&(Q.ShadyCSS===void 0||Q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,te=Symbol(),re=new WeakMap;class ve{constructor(e,t,i){if(this._$cssResult$=!0,i!==te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ee&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=re.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&re.set(t,e))}return e}toString(){return this.cssText}}const qe=n=>new ve(typeof n=="string"?n:n+"",void 0,te),z=(n,...e)=>{const t=n.length===1?n[0]:e.reduce((i,s,r)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new ve(t,n,te)},Ee=(n,e)=>{ee?n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(t=>{const i=document.createElement("style"),s=Q.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,n.appendChild(i)})},ne=ee?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return qe(t)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var W;const L=window,ae=L.trustedTypes,Se=ae?ae.emptyScript:"",oe=L.reactiveElementPolyfillSupport,Z={toAttribute(n,e){switch(e){case Boolean:n=n?Se:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},me=(n,e)=>e!==n&&(e==e||n==n),Y={attribute:!0,type:String,converter:Z,reflect:!1,hasChanged:me};class E extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(e){var t;this.finalize(),((t=this.h)!==null&&t!==void 0?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach((t,i)=>{const s=this._$Ep(i,t);s!==void 0&&(this._$Ev.set(s,i),e.push(s))}),e}static createProperty(e,t=Y){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const i=typeof e=="symbol"?Symbol():"__"+e,s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Object.defineProperty(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(s){const r=this[e];this[t]=s,this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||Y}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const s of i)t.unshift(ne(s))}else e!==void 0&&t.push(ne(e));return t}static _$Ep(e,t){const i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}u(){var e;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach(t=>t(this))}addController(e){var t,i;((t=this._$ES)!==null&&t!==void 0?t:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((i=e.hostConnected)===null||i===void 0||i.call(e))}removeController(e){var t;(t=this._$ES)===null||t===void 0||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])})}createRenderRoot(){var e;const t=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return Ee(t,this.constructor.elementStyles),t}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach(t=>{var i;return(i=t.hostConnected)===null||i===void 0?void 0:i.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach(t=>{var i;return(i=t.hostDisconnected)===null||i===void 0?void 0:i.call(t)})}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EO(e,t,i=Y){var s;const r=this.constructor._$Ep(e,i);if(r!==void 0&&i.reflect===!0){const a=(((s=i.converter)===null||s===void 0?void 0:s.toAttribute)!==void 0?i.converter:Z).toAttribute(t,i.type);this._$El=e,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$El=null}}_$AK(e,t){var i;const s=this.constructor,r=s._$Ev.get(e);if(r!==void 0&&this._$El!==r){const a=s.getPropertyOptions(r),h=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)===null||i===void 0?void 0:i.fromAttribute)!==void 0?a.converter:Z;this._$El=r,this[r]=h.fromAttribute(t,a.type),this._$El=null}}requestUpdate(e,t,i){let s=!0;e!==void 0&&(((i=i||this.constructor.getPropertyOptions(e)).hasChanged||me)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),i.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((s,r)=>this[r]=s),this._$Ei=void 0);let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),(e=this._$ES)===null||e===void 0||e.forEach(s=>{var r;return(r=s.hostUpdate)===null||r===void 0?void 0:r.call(s)}),this.update(i)):this._$Ek()}catch(s){throw t=!1,this._$Ek(),s}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;(t=this._$ES)===null||t===void 0||t.forEach(i=>{var s;return(s=i.hostUpdated)===null||s===void 0?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach((t,i)=>this._$EO(i,this[i],t)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}}E.finalized=!0,E.elementProperties=new Map,E.elementStyles=[],E.shadowRootOptions={mode:"open"},oe==null||oe({ReactiveElement:E}),((W=L.reactiveElementVersions)!==null&&W!==void 0?W:L.reactiveElementVersions=[]).push("1.4.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var G;const V=window,F=V.trustedTypes,le=F?F.createPolicy("lit-html",{createHTML:n=>n}):void 0,w=`lit$${(Math.random()+"").slice(9)}$`,be="?"+w,Fe=`<${be}>`,C=document,P=(n="")=>C.createComment(n),T=n=>n===null||typeof n!="object"&&typeof n!="function",$e=Array.isArray,Ce=n=>$e(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,he=/-->/g,de=/>/g,_=RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ue=/'/g,pe=/"/g,xe=/^(?:script|style|textarea|title)$/i,we=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),m=we(1),ce=we(2),q=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),ge=new WeakMap,S=C.createTreeWalker(C,129,null,!1),Ie=(n,e)=>{const t=n.length-1,i=[];let s,r=e===2?"<svg>":"",a=k;for(let l=0;l<t;l++){const o=n[l];let p,d,g=-1,v=0;for(;v<o.length&&(a.lastIndex=v,d=a.exec(o),d!==null);)v=a.lastIndex,a===k?d[1]==="!--"?a=he:d[1]!==void 0?a=de:d[2]!==void 0?(xe.test(d[2])&&(s=RegExp("</"+d[2],"g")),a=_):d[3]!==void 0&&(a=_):a===_?d[0]===">"?(a=s!=null?s:k,g=-1):d[1]===void 0?g=-2:(g=a.lastIndex-d[2].length,p=d[1],a=d[3]===void 0?_:d[3]==='"'?pe:ue):a===pe||a===ue?a=_:a===he||a===de?a=k:(a=_,s=void 0);const B=a===_&&n[l+1].startsWith("/>")?" ":"";r+=a===k?o+Fe:g>=0?(i.push(p),o.slice(0,g)+"$lit$"+o.slice(g)+w+B):o+w+(g===-2?(i.push(void 0),l):B)}const h=r+(n[t]||"<?>")+(e===2?"</svg>":"");if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return[le!==void 0?le.createHTML(h):h,i]};class H{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,a=0;const h=e.length-1,l=this.parts,[o,p]=Ie(e,t);if(this.el=H.createElement(o,i),S.currentNode=this.el.content,t===2){const d=this.el.content,g=d.firstChild;g.remove(),d.append(...g.childNodes)}for(;(s=S.nextNode())!==null&&l.length<h;){if(s.nodeType===1){if(s.hasAttributes()){const d=[];for(const g of s.getAttributeNames())if(g.endsWith("$lit$")||g.startsWith(w)){const v=p[a++];if(d.push(g),v!==void 0){const B=s.getAttribute(v.toLowerCase()+"$lit$").split(w),M=/([.?@])?(.*)/.exec(v);l.push({type:1,index:r,name:M[2],strings:B,ctor:M[1]==="."?ke:M[1]==="?"?Te:M[1]==="@"?He:j})}else l.push({type:6,index:r})}for(const g of d)s.removeAttribute(g)}if(xe.test(s.tagName)){const d=s.textContent.split(w),g=d.length-1;if(g>0){s.textContent=F?F.emptyScript:"";for(let v=0;v<g;v++)s.append(d[v],P()),S.nextNode(),l.push({type:2,index:++r});s.append(d[g],P())}}}else if(s.nodeType===8)if(s.data===be)l.push({type:2,index:r});else{let d=-1;for(;(d=s.data.indexOf(w,d+1))!==-1;)l.push({type:7,index:r}),d+=w.length-1}r++}}static createElement(e,t){const i=C.createElement("template");return i.innerHTML=e,i}}function I(n,e,t=n,i){var s,r,a,h;if(e===q)return e;let l=i!==void 0?(s=t._$Co)===null||s===void 0?void 0:s[i]:t._$Cl;const o=T(e)?void 0:e._$litDirective$;return(l==null?void 0:l.constructor)!==o&&((r=l==null?void 0:l._$AO)===null||r===void 0||r.call(l,!1),o===void 0?l=void 0:(l=new o(n),l._$AT(n,t,i)),i!==void 0?((a=(h=t)._$Co)!==null&&a!==void 0?a:h._$Co=[])[i]=l:t._$Cl=l),l!==void 0&&(e=I(n,l._$AS(n,e.values),l,i)),e}class Re{constructor(e,t){this.u=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(e){var t;const{el:{content:i},parts:s}=this._$AD,r=((t=e==null?void 0:e.creationScope)!==null&&t!==void 0?t:C).importNode(i,!0);S.currentNode=r;let a=S.nextNode(),h=0,l=0,o=s[0];for(;o!==void 0;){if(h===o.index){let p;o.type===2?p=new D(a,a.nextSibling,this,e):o.type===1?p=new o.ctor(a,o.name,o.strings,this,e):o.type===6&&(p=new Ue(a,this,e)),this.u.push(p),o=s[++l]}h!==(o==null?void 0:o.index)&&(a=S.nextNode(),h++)}return r}p(e){let t=0;for(const i of this.u)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class D{constructor(e,t,i,s){var r;this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cm=(r=s==null?void 0:s.isConnected)===null||r===void 0||r}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cm}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=I(this,e,t),T(e)?e===f||e==null||e===""?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==q&&this.g(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ce(e)?this.k(e):this.g(e)}O(e,t=this._$AB){return this._$AA.parentNode.insertBefore(e,t)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}g(e){this._$AH!==f&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){var t;const{values:i,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=H.createElement(s.h,this.options)),s);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===r)this._$AH.p(i);else{const a=new Re(r,this),h=a.v(this.options);a.p(i),this.T(h),this._$AH=a}}_$AC(e){let t=ge.get(e.strings);return t===void 0&&ge.set(e.strings,t=new H(e)),t}k(e){$e(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new D(this.O(P()),this.O(P()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){var i;for((i=this._$AP)===null||i===void 0||i.call(this,!1,!0,t);e&&e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var t;this._$AM===void 0&&(this._$Cm=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}}class j{constructor(e,t,i,s,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,i,s){const r=this.strings;let a=!1;if(r===void 0)e=I(this,e,t,0),a=!T(e)||e!==this._$AH&&e!==q,a&&(this._$AH=e);else{const h=e;let l,o;for(e=r[0],l=0;l<r.length-1;l++)o=I(this,h[i+l],t,l),o===q&&(o=this._$AH[l]),a||(a=!T(o)||o!==this._$AH[l]),o===f?e=f:e!==f&&(e+=(o!=null?o:"")+r[l+1]),this._$AH[l]=o}a&&!s&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}}class ke extends j{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}}const Pe=F?F.emptyScript:"";class Te extends j{constructor(){super(...arguments),this.type=4}j(e){e&&e!==f?this.element.setAttribute(this.name,Pe):this.element.removeAttribute(this.name)}}class He extends j{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){var i;if((e=(i=I(this,e,t,0))!==null&&i!==void 0?i:f)===q)return;const s=this._$AH,r=e===f&&s!==f||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==f&&(s===f||r);r&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,i;typeof this._$AH=="function"?this._$AH.call((i=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&i!==void 0?i:this.element,e):this._$AH.handleEvent(e)}}class Ue{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){I(this,e)}}const fe=V.litHtmlPolyfillSupport;fe==null||fe(H,D),((G=V.litHtmlVersions)!==null&&G!==void 0?G:V.litHtmlVersions=[]).push("2.4.0");const Ne=(n,e,t)=>{var i,s;const r=(i=t==null?void 0:t.renderBefore)!==null&&i!==void 0?i:e;let a=r._$litPart$;if(a===void 0){const h=(s=t==null?void 0:t.renderBefore)!==null&&s!==void 0?s:null;r._$litPart$=a=new D(e.insertBefore(P(),h),h,void 0,t!=null?t:{})}return a._$AI(n),a};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var X,K;class A extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const i=super.createRenderRoot();return(e=(t=this.renderOptions).renderBefore)!==null&&e!==void 0||(t.renderBefore=i.firstChild),i}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ne(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!1)}render(){return q}}A.finalized=!0,A._$litElement$=!0,(X=globalThis.litElementHydrateSupport)===null||X===void 0||X.call(globalThis,{LitElement:A});const ye=globalThis.litElementPolyfillSupport;ye==null||ye({LitElement:A});((K=globalThis.litElementVersions)!==null&&K!==void 0?K:globalThis.litElementVersions=[]).push("3.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ie=n=>e=>typeof e=="function"?((t,i)=>(customElements.define(t,i),i))(n,e):((t,i)=>{const{kind:s,elements:r}=i;return{kind:s,elements:r,finisher(a){customElements.define(t,a)}}})(n,e);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oe=(n,e)=>e.kind==="method"&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(t){t.createProperty(e.key,n)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){typeof e.initializer=="function"&&(this[e.key]=e.initializer.call(this))},finisher(t){t.createProperty(e.key,n)}};function x(n){return(e,t)=>t!==void 0?((i,s,r)=>{s.constructor.createProperty(r,i)})(n,e,t):Oe(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(n){return x({...n,state:!0})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const De=({finisher:n,descriptor:e})=>(t,i)=>{var s;if(i===void 0){const r=(s=t.originalKey)!==null&&s!==void 0?s:t.key,a=e!=null?{kind:"method",placement:"prototype",key:r,descriptor:e(t.key)}:{...t,key:r};return n!=null&&(a.finisher=function(h){n(h,r)}),a}{const r=t.constructor;e!==void 0&&Object.defineProperty(t,i,e(i)),n==null||n(r,i)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _e(n,e){return De({descriptor:t=>{const i={get(){var s,r;return(r=(s=this.renderRoot)===null||s===void 0?void 0:s.querySelector(n))!==null&&r!==void 0?r:null},enumerable:!0,configurable:!0};if(e){const s=typeof t=="symbol"?Symbol():"__"+t;i.get=function(){var r,a;return this[s]===void 0&&(this[s]=(a=(r=this.renderRoot)===null||r===void 0?void 0:r.querySelector(n))!==null&&a!==void 0?a:null),this[s]}}return i}})}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var J;((J=window.HTMLSlotElement)===null||J===void 0?void 0:J.prototype.assignedElements)!=null;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Be={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Me=n=>(...e)=>({_$litDirective$:n,values:e});class Qe{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const y=Me(class extends Qe{constructor(n){var e;if(super(n),n.type!==Be.ATTRIBUTE||n.name!=="class"||((e=n.strings)===null||e===void 0?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(n){return" "+Object.keys(n).filter(e=>n[e]).join(" ")+" "}update(n,[e]){var t,i;if(this.nt===void 0){this.nt=new Set,n.strings!==void 0&&(this.st=new Set(n.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(const r in e)e[r]&&!(!((t=this.st)===null||t===void 0)&&t.has(r))&&this.nt.add(r);return this.render(e)}const s=n.element.classList;this.nt.forEach(r=>{r in e||(s.remove(r),this.nt.delete(r))});for(const r in e){const a=!!e[r];a===this.nt.has(r)||((i=this.st)===null||i===void 0?void 0:i.has(r))||(a?(s.add(r),this.nt.add(r)):(s.remove(r),this.nt.delete(r)))}return q}});class Le{constructor(e,t){this.runtime=e,this.canvas=t,this.disposed=!1,this.analyser=e.audioCtx.createAnalyser(),this.analyser.fftSize=8192,this.analyser.smoothingTimeConstant=.5,e.connect(this.analyser),this.analysisData=new Uint8Array(this.analyser.frequencyBinCount);let i=Math.log10(e.audioCtx.sampleRate/2)-1;this.canvas.width=this.canvas.offsetWidth*window.devicePixelRatio,this.canvas.height=this.canvas.offsetHeight*window.devicePixelRatio,this.analysisXs=this.calculateAnalysisXs(i),this.resizeObserver=new ResizeObserver(()=>{this.canvas.width=this.canvas.offsetWidth*window.devicePixelRatio,this.canvas.height=this.canvas.offsetHeight*window.devicePixelRatio,this.analysisXs=this.calculateAnalysisXs(i)}),this.resizeObserver.observe(this.canvas)}calculateAnalysisXs(e){return Array.from(this.analysisData).map((t,i)=>{let s=i/this.analysisData.length*(this.runtime.audioCtx.sampleRate/2);return Math.floor((Math.log10(s)-1)/e*this.canvas.width)})}analyse(){let e=()=>{this.disposed||(this.analyser.getByteFrequencyData(this.analysisData),this.draw(),requestAnimationFrame(e))};requestAnimationFrame(e)}draw(){let e=this.canvas.width,t=this.canvas.height,i=this.canvas.height/255,s=this.canvas.getContext("2d");if(!s)throw new Error("Could not get a canvas context!");s.clearRect(0,0,e,t);let r=new Path2D;r.moveTo(0,t);for(let a=0;a<this.analysisData.length;a++){let h=Math.floor(t-this.analysisData[a]*i);r.lineTo(this.analysisXs[a],h)}r.lineTo(e,t),s.fillStyle="rgba(30, 30, 60, 0.7)",s.fill(r),s.strokeStyle="rgb(155, 155, 255)",s.stroke(r)}dispose(){this.disposed=!0,this.analyser.disconnect(),this.resizeObserver.disconnect()}}class Ve{constructor(e,t){this.runtime=e,this.canvas=t,this.canvas.width=this.canvas.offsetWidth*window.devicePixelRatio,this.canvas.height=this.canvas.offsetHeight*window.devicePixelRatio,this.frequencies=this.calculateFrequencies(),this.filterMagResponse=new Float32Array(this.frequencies.length),this.filterPhaseResponse=new Float32Array(this.frequencies.length),this.frequencyResponse=new Float32Array(this.frequencies.length),this.resizeObserver=new ResizeObserver(()=>{this.canvas.width=this.canvas.offsetWidth*window.devicePixelRatio,this.canvas.height=this.canvas.offsetHeight*window.devicePixelRatio,this.frequencies=this.calculateFrequencies(),this.filterMagResponse=new Float32Array(this.frequencies.length),this.filterPhaseResponse=new Float32Array(this.frequencies.length),this.frequencyResponse=new Float32Array(this.frequencies.length),this.render()}),this.resizeObserver.observe(this.canvas)}dispose(){this.resizeObserver.disconnect()}render(){this.frequencyResponse.fill(1);for(let e=0;e<this.runtime.spec.length;e++)for(let t=0;t<u.getBiquadFilterOrder(this.runtime.spec[e].type);t++)if(this.runtime.getFrequencyResponse(e,t,this.frequencies,this.filterMagResponse,this.filterPhaseResponse))for(let s=0;s<this.frequencyResponse.length;s++)this.frequencyResponse[s]*=this.filterMagResponse[s];this.draw()}draw(){let e=this.canvas.getContext("2d"),t=this.canvas.width,i=this.canvas.height;if(!e)throw new Error("Could not get a canvas context!");e.clearRect(0,0,t,i),e.strokeStyle="white",e.lineWidth=2,e.lineJoin="round",e.lineCap="round",e.shadowBlur=15,e.shadowColor="rgba(168, 85, 247, 0.6)",e.beginPath();let s=13,r=-s;for(let a=0;a<this.frequencyResponse.length;a++){let h=this.frequencyResponse[a],l=20*Math.log10(h),o=i-(l-r)/(s-r)*i;a===0?e.moveTo(a,o):e.lineTo(a,o)}e.stroke(),e.shadowBlur=0,e.lineTo(t,i),e.lineTo(0,i),e.closePath(),e.fillStyle="rgba(168, 85, 247, 0.1)",e.fill()}calculateFrequencies(){let e=new Float32Array(this.canvas.width),t=this.runtime.audioCtx.sampleRate/2,i=1,s=Math.log10(t);for(let r=0;r<this.canvas.width;r++){let a=i+r/this.canvas.width*(s-i),h=Math.pow(10,a);e[r]=h}return e}}const se=z`
  @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&display=swap");

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :host {
    --weq8-font-stack: "Outfit", sans-serif;
    --weq8-font-size: 11px;
    --weq8-font-weight: 500;
    
    --weq8-bg: rgba(17, 24, 39, 0.4); /* gray-900 with opacity */
    --weq8-border: rgba(255, 255, 255, 0.1);
    --weq8-text: #f3f4f6;
    --weq8-text-dim: #9ca3af;
    --weq8-accent: linear-gradient(to right, #60a5fa, #a855f7);
    --weq8-accent-solid: #a855f7;
    --weq8-handle-shadow: 0 0 10px 2px rgba(168, 85, 247, 0.4);

    font-family: var(--weq8-font-stack);
    font-size: var(--weq8-font-size);
    font-weight: var(--weq8-font-weight);
    color: var(--weq8-text);
  }
`,Ae=[["noop","Add +"],["peaking12","Bell 12dB"],["peaking24","Bell 24dB"],["lowshelf12","Low Shelf 12dB"],["lowshelf24","Low Shelf 24dB"],["highshelf12","High Shelf 12dB"],["highshelf24","High Shelf 24dB"],["highpass12","Low Cut 12dB"],["highpass24","Low Cut 24dB"],["lowpass12","High Cut 12dB"],["lowpass24","High Cut 24dB"],["notch12","Notch 12dB"],["notch24","Notch 24dB"],["bandpass12","Band Pass 12dB"],["bandpass24","Band Pass 24dB"],["allpass12","All Pass 12dB"],["allpass24","All Pass 24dB"]];var U;let R=(U=class extends A{constructor(){super(),this.frequencyInputFocused=!1,this.dragStates={frequency:null,gain:null,Q:null},this.addEventListener("click",()=>this.dispatchEvent(new CustomEvent("select",{composed:!0,bubbles:!0})))}render(){if(!this.runtime||this.index===void 0)return;let e=Ae.filter(i=>this.runtime.supportedFilterTypes.includes(i[0])),t=this.runtime.spec[this.index];return m`
      <th>
        <div
          class=${y({chip:!0,disabled:!u.filterHasFrequency(t.type),bypassed:t.bypass})}
        >
          <div
            class=${y({filterNumber:!0,bypassed:t.bypass})}
            @click=${()=>this.toggleBypass()}
          >
            ${this.index+1}
          </div>
          <select
            class=${y({filterTypeSelect:!0,bypassed:t.bypass})}
            @change=${i=>this.setFilterType(i.target.value)}
          >
            ${e.map(([i,s])=>m`<option value=${i} ?selected=${t.type===i}>
                  ${s}
                </option>`)}
          </select>
        </div>
      </th>
      <td>
        <input
          class=${y({frequencyInput:!0,numberInput:!0,bypassed:t.bypass})}
          type="number"
          step="0.1"
          lang="en_EN"
          .value=${u.formatFrequency(t.frequency,this.frequencyInputFocused)}
          ?disabled=${!u.filterHasFrequency(t.type)}
          @focus=${()=>this.frequencyInputFocused=!0}
          @blur=${()=>{this.frequencyInputFocused=!1,this.setFilterFrequency(u.clamp(t.frequency,10,this.nyquist))}}
          @input=${i=>this.setFilterFrequency(i.target.valueAsNumber)}
          @pointerdown=${i=>this.startDraggingValue(i,"frequency")}
          @pointerup=${i=>this.stopDraggingValue(i,"frequency")}
          @pointermove=${i=>this.dragValue(i,"frequency")}
        />
        <span
          class=${y({frequencyUnit:!0,disabled:!u.filterHasFrequency(t.type),bypassed:t.bypass})}
          >${u.formatFrequencyUnit(t.frequency,this.frequencyInputFocused)}</span
        >
      </td>
      <td>
        <input
          class=${y({gainInput:!0,numberInput:!0,bypassed:t.bypass})}
          type="number"
          min="-15"
          max="15"
          step="0.1"
          lang="en_EN"
          .value=${t.gain.toFixed(1)}
          ?disabled=${!u.filterHasGain(t.type)}
          @input=${i=>this.setFilterGain(i.target.valueAsNumber)}
          @pointerdown=${i=>this.startDraggingValue(i,"gain")}
          @pointerup=${i=>this.stopDraggingValue(i,"gain")}
          @pointermove=${i=>this.dragValue(i,"gain")}
        />
        <span
          class=${y({gainUnit:!0,disabled:!u.filterHasGain(t.type),bypassed:t.bypass})}
          >dB</span
        >
      </td>
      <td>
        <input
          class=${y({qInput:!0,numberInput:!0,bypassed:t.bypass})}
          type="number"
          min="0.1"
          max="18"
          step="0.1"
          .value=${t.Q.toFixed(2)}
          ?disabled=${!u.filterHasQ(t.type)}
          @input=${i=>this.setFilterQ(i.target.valueAsNumber)}
          @pointerdown=${i=>this.startDraggingValue(i,"Q")}
          @pointerup=${i=>this.stopDraggingValue(i,"Q")}
          @pointermove=${i=>this.dragValue(i,"Q")}
        />
      </td>
    `}get nyquist(){var e,t;return((t=(e=this.runtime)==null?void 0:e.audioCtx.sampleRate)!=null?t:48e3)/2}toggleBypass(){!this.runtime||this.index===void 0||this.runtime.toggleBypass(this.index,!this.runtime.spec[this.index].bypass)}setFilterType(e){!this.runtime||this.index===void 0||this.runtime.setFilterType(this.index,e)}setFilterFrequency(e){!this.runtime||this.index===void 0||isNaN(e)||this.runtime.setFilterFrequency(this.index,e)}setFilterGain(e){!this.runtime||this.index===void 0||isNaN(e)||this.runtime.setFilterGain(this.index,e)}setFilterQ(e){!this.runtime||this.index===void 0||isNaN(e)||this.runtime.setFilterQ(this.index,e)}startDraggingValue(e,t){!this.runtime||this.index===void 0||(e.target.setPointerCapture(e.pointerId),this.dragStates={...this.dragStates,[t]:{pointer:e.pointerId,startY:e.clientY,startValue:this.runtime.spec[this.index][t]}})}stopDraggingValue(e,t){var i;!this.runtime||this.index===void 0||((i=this.dragStates[t])==null?void 0:i.pointer)===e.pointerId&&(e.target.releasePointerCapture(e.pointerId),this.dragStates={...this.dragStates,[t]:null})}dragValue(e,t){if(!this.runtime||this.index===void 0)return;let i=this.dragStates[t];if(i&&i.pointer===e.pointerId){let s=i.startY,a=-(e.clientY-s),h=u.clamp(a/150,-1,1);if(t==="frequency"){let l=10,o=this.runtime.audioCtx.sampleRate/2,p=u.toLog10(i.startValue,l,o),d=u.toLin(p+h,l,o);this.runtime.setFilterFrequency(this.index,d)}else if(t==="gain"){let l=h*15;this.runtime.setFilterGain(this.index,u.clamp(i.startValue+l,-15,15))}else if(t==="Q"){let l=.1,o=18,p=u.toLog10(i.startValue,l,o),d=u.toLin(p+h,l,o);this.runtime.setFilterQ(this.index,d)}e.target.blur()}}},(()=>{U.styles=[se,z`
      :host {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 60px 60px 50px 40px;
        align-items: center;
        gap: 4px;
        background-color: transparent;
        border-radius: 8px;
        transition: background-color 0.15s ease;
        padding: 4px 0;
      }
      :host(.selected) {
        background-color: rgba(255, 255, 255, 0.05);
      }
      input,
      select {
        padding: 0;
        border: 0;
        font-family: inherit;
        color: inherit;
        background: transparent;
      }
      input {
        border-bottom: 1px solid transparent;
        transition: all 0.2s ease;
        border-radius: 4px;
        padding: 2px 4px;
        text-align: right;
      }
      input:focus,
      input:active {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: var(--weq8-accent-solid);
        outline: none;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 24px;
        padding: 0 4px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.2s ease;
      }
      .chip:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.1);
      }
      :host(.selected) .chip .filterNumber {
        background: var(--weq8-accent);
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      .chip.disabled {
        opacity: 0.5;
        background: transparent;
        border-color: transparent;
      }
      .filterNumber {
        cursor: pointer;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: grid;
        place-content: center;
        background: var(--weq8-text);
        font-size: 10px;
        font-weight: 700;
        color: black;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      .chip.disabled .filterNumber {
        background: rgba(255, 255, 255, 0.1);
        color: var(--weq8-text-dim);
      }
      .chip.bypassed .filterNumber {
        background: var(--weq8-text-dim);
        color: rgba(0, 0, 0, 0.5);
      }
      .filterTypeSelect {
        width: 32px;
        appearance: none;
        outline: none;
        background-color: transparent;
        color: var(--weq8-text);
        cursor: pointer;
        text-align: center;
        font-size: 10px;
        font-weight: 600;
        border-radius: 4px;
      }
      .filterTypeSelect:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .filterTypeSelect.bypassed {
        color: var(--weq8-text-dim);
      }
      .frequencyInput {
        width: 40px;
      }
      .gainInput {
        width: 32px;
      }
      .qInput {
        width: 36px;
      }
      .numberInput {
        appearance: none;
        -moz-appearance: textfield;
        font-variant-numeric: tabular-nums;
        font-size: 11px;
      }
      .numberInput:disabled,
      .disabled {
        color: var(--weq8-text-dim);
        pointer-events: none;
      }
      .bypassed {
        color: var(--weq8-text-dim);
      }
      .numberInput::-webkit-inner-spin-button,
      .numberInput::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
        margin: 0 !important;
      }
    `]})(),U);c([x({attribute:!1})],R.prototype,"runtime",void 0);c([x()],R.prototype,"index",void 0);c([b()],R.prototype,"frequencyInputFocused",void 0);c([b()],R.prototype,"dragStates",void 0);R=c([ie("weq8-ui-filter-row")],R);var N;let $=(N=class extends A{constructor(){super(...arguments),this.x=0,this.y=0,this.frequencyInputFocused=!1,this.dragStates={frequency:null,gain:null,Q:null},this.posOnDragStart=null}render(){var r,a,h,l;if(!this.runtime||this.index===void 0)return;let e=Ae.filter(o=>this.runtime.supportedFilterTypes.includes(o[0])),t=this.runtime.spec[this.index],i=((a=(r=this.posOnDragStart)==null?void 0:r.x)!=null?a:this.x)-100,s=((l=(h=this.posOnDragStart)==null?void 0:h.y)!=null?l:this.y)+20;return console.log("hi",i,s),m`
      <div class="root" style="transform: translate(${i}px, ${s}px);">
        <div>
          <div
            class=${y({chip:!0,disabled:!u.filterHasFrequency(t.type),bypassed:t.bypass})}
          >
            <select
              class=${y({filterTypeSelect:!0,bypassed:t.bypass})}
              @change=${o=>this.setFilterType(o.target.value)}
            >
              ${e.map(([o,p])=>m`<option value=${o} ?selected=${t.type===o}>
                    ${p}
                  </option>`)}
            </select>
          </div>
        </div>
        <div>
          <input
            class=${y({frequencyInput:!0,numberInput:!0,bypassed:t.bypass})}
            type="number"
            step="0.1"
            lang="en_EN"
            .value=${u.formatFrequency(t.frequency,this.frequencyInputFocused)}
            ?disabled=${!u.filterHasFrequency(t.type)}
            @focus=${()=>this.frequencyInputFocused=!0}
            @blur=${()=>{this.frequencyInputFocused=!1,this.setFilterFrequency(u.clamp(t.frequency,10,this.nyquist))}}
            @input=${o=>this.setFilterFrequency(o.target.valueAsNumber)}
            @pointerdown=${o=>this.startDraggingValue(o,"frequency")}
            @pointerup=${o=>this.stopDraggingValue(o,"frequency")}
            @pointermove=${o=>this.dragValue(o,"frequency")}
          />
          <span
            class=${y({frequencyUnit:!0,disabled:!u.filterHasFrequency(t.type),bypassed:t.bypass})}
            >${u.formatFrequencyUnit(t.frequency,this.frequencyInputFocused)}</span
          >
        </div>
        <div>
          <input
            class=${y({gainInput:!0,numberInput:!0,bypassed:t.bypass})}
            type="number"
            min="-15"
            max="15"
            step="0.1"
            lang="en_EN"
            .value=${t.gain.toFixed(1)}
            ?disabled=${!u.filterHasGain(t.type)}
            @input=${o=>this.setFilterGain(o.target.valueAsNumber)}
            @pointerdown=${o=>this.startDraggingValue(o,"gain")}
            @pointerup=${o=>this.stopDraggingValue(o,"gain")}
            @pointermove=${o=>this.dragValue(o,"gain")}
          />
          <span
            class=${y({gainUnit:!0,disabled:!u.filterHasGain(t.type),bypassed:t.bypass})}
            >dB</span
          >
        </div>
        <div>
          <input
            class=${y({qInput:!0,numberInput:!0,bypassed:t.bypass})}
            type="number"
            min="0.1"
            max="18"
            step="0.1"
            .value=${t.Q.toFixed(2)}
            ?disabled=${!u.filterHasQ(t.type)}
            @input=${o=>this.setFilterQ(o.target.valueAsNumber)}
            @pointerdown=${o=>this.startDraggingValue(o,"Q")}
            @pointerup=${o=>this.stopDraggingValue(o,"Q")}
            @pointermove=${o=>this.dragValue(o,"Q")}
          />
        </div>
      </div>
    `}get nyquist(){var e,t;return((t=(e=this.runtime)==null?void 0:e.audioCtx.sampleRate)!=null?t:48e3)/2}setFilterType(e){!this.runtime||this.index===void 0||this.runtime.setFilterType(this.index,e)}setFilterFrequency(e){!this.runtime||this.index===void 0||isNaN(e)||this.runtime.setFilterFrequency(this.index,e)}setFilterGain(e){!this.runtime||this.index===void 0||isNaN(e)||this.runtime.setFilterGain(this.index,e)}setFilterQ(e){!this.runtime||this.index===void 0||isNaN(e)||this.runtime.setFilterQ(this.index,e)}startDraggingValue(e,t){!this.runtime||this.index===void 0||(e.target.setPointerCapture(e.pointerId),this.dragStates={...this.dragStates,[t]:{pointer:e.pointerId,startY:e.clientY,startValue:this.runtime.spec[this.index][t]}},this.posOnDragStart={x:this.x,y:this.y})}stopDraggingValue(e,t){var i;!this.runtime||this.index===void 0||(((i=this.dragStates[t])==null?void 0:i.pointer)===e.pointerId&&(e.target.releasePointerCapture(e.pointerId),this.dragStates={...this.dragStates,[t]:null}),this.dragStates.frequency===null&&this.dragStates.gain===null&&this.dragStates.Q===null&&(this.posOnDragStart=null))}dragValue(e,t){if(!this.runtime||this.index===void 0)return;let i=this.dragStates[t];if(i&&i.pointer===e.pointerId){let s=i.startY,a=-(e.clientY-s),h=u.clamp(a/150,-1,1);if(t==="frequency"){let l=10,o=this.runtime.audioCtx.sampleRate/2,p=u.toLog10(i.startValue,l,o),d=u.toLin(p+h,l,o);this.runtime.setFilterFrequency(this.index,d)}else if(t==="gain"){let l=h*15;this.runtime.setFilterGain(this.index,u.clamp(i.startValue+l,-15,15))}else if(t==="Q"){let l=.1,o=18,p=u.toLog10(i.startValue,l,o),d=u.toLin(p+h,l,o);this.runtime.setFilterQ(this.index,d)}e.target.blur()}}},(()=>{N.styles=[se,z`
      .root {
        position: absolute;
        display: grid;
        grid-auto-flow: column;
        width: 220px;
        grid-template-columns: 70px 60px 50px 40px;
        align-items: center;
        gap: 8px;
        background-color: rgba(17, 24, 39, 0.9);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 8px 12px;
        border-radius: 12px;
        border: 1px solid var(--weq8-border);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        transform: translateY(-100%);
        margin-top: -10px;
        z-index: 100;
      }
      .arrow {
         /* Optional arrow if we wanted to implement one */
      }
      input,
      select {
        padding: 0;
        border: 0;
        font-family: inherit;
        color: inherit;
        background: transparent;
      }
      input {
        border-bottom: 1px solid transparent;
        transition: all 0.2s ease;
        border-radius: 4px;
        padding: 2px 4px;
        text-align: right;
      }
      input:focus,
      input:active {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: var(--weq8-accent-solid);
        outline: none;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 24px;
        padding: 0 4px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.2s ease;
      }
      .chip.disabled:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      .filterTypeSelect {
        width: 100%;
        appearance: none;
        outline: none;
        background-color: transparent;
        color: var(--weq8-text);
        cursor: pointer;
        text-align: center;
        font-size: 11px;
        font-weight: 600;
      }
      .filterTypeSelect.bypassed {
        color: var(--weq8-text-dim);
      }
      .chip.disabled .filterTypeSelect {
        pointer-events: all;
      }
      .frequencyInput {
        width: 40px;
      }
      .gainInput {
        width: 32px;
      }
      .qInput {
        width: 36px;
      }
      .numberInput {
        appearance: none;
        -moz-appearance: textfield;
        font-variant-numeric: tabular-nums;
        font-size: 12px;
        font-weight: 500;
      }
      .numberInput:disabled,
      .disabled {
        color: var(--weq8-text-dim);
        pointer-events: none;
      }
      .bypassed {
        color: var(--weq8-text-dim);
      }
      .numberInput::-webkit-inner-spin-button,
      .numberInput::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
        margin: 0 !important;
      }
    `]})(),N);c([x({attribute:!1})],$.prototype,"runtime",void 0);c([x()],$.prototype,"index",void 0);c([x()],$.prototype,"x",void 0);c([x()],$.prototype,"y",void 0);c([b()],$.prototype,"frequencyInputFocused",void 0);c([b()],$.prototype,"dragStates",void 0);c([b()],$.prototype,"posOnDragStart",void 0);$=c([ie("weq8-ui-filter-hud")],$);var O;exports.WEQ8UIElement=(O=class extends A{constructor(){super(),this.view="allBands",this.gridXs=[],this.dragStates={},this.selectedFilterIdx=-1,this.addEventListener("click",e=>{e.composedPath()[0]===this&&(this.selectedFilterIdx=-1)})}updated(e){var t,i;if(e.has("runtime")&&((t=this.analyser)==null||t.dispose(),(i=this.frequencyResponse)==null||i.dispose(),this.runtime&&this.analyserCanvas&&this.frequencyResponseCanvas)){this.analyser=new Le(this.runtime,this.analyserCanvas),this.analyser.analyse(),this.frequencyResponse=new Ve(this.runtime,this.frequencyResponseCanvas),this.frequencyResponse.render();let s=[],r=this.runtime.audioCtx.sampleRate/2,a=Math.floor(Math.log10(r));for(let h=0;h<a;h++){let l=Math.pow(10,h+1);for(let o=1;o<10;o++){let p=l*o;if(p>r)break;s.push((Math.log10(p)-1)/(Math.log10(r)-1)*100)}}this.gridXs=s,this.runtime.on("filtersChanged",()=>{var h,l,o;(h=this.frequencyResponse)==null||h.render(),this.requestUpdate();for(let p of Array.from((o=(l=this.shadowRoot)==null?void 0:l.querySelectorAll("weq8-ui-filter-row"))!=null?o:[]))p.requestUpdate()})}e.has("view")&&this.requestUpdate()}render(){var e;return m`
      ${this.view==="allBands"?this.renderTable():null}
      <div class="visualisation">
        <svg
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          ${this.gridXs.map(this.renderGridX)}
          ${[12,6,0,-6,-12].map(this.renderGridY)}
        </svg>
        <canvas class="analyser"></canvas>
        <canvas
          class="frequencyResponse"
          @click=${()=>this.selectedFilterIdx=-1}
        ></canvas>
        ${(e=this.runtime)==null?void 0:e.spec.map((t,i)=>t.type==="noop"?void 0:this.renderFilterHandle(t,i))}
        ${this.view==="hud"&&this.selectedFilterIdx!==-1?this.renderFilterHUD():null}
      </div>
    `}renderTable(){return m` <table class="filters">
      <thead>
        <tr>
          <th class="headerFilter">Filter</th>
          <th>Freq</th>
          <th>Gain</th>
          <th>Q</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from({length:10}).map((e,t)=>m`<weq8-ui-filter-row
              class="${y({selected:this.selectedFilterIdx===t})}"
              .runtime=${this.runtime}
              .index=${t}
              @select=${i=>{var s;this.selectedFilterIdx=((s=this.runtime)==null?void 0:s.spec[t].type)==="noop"?-1:t,i.stopPropagation()}}
            />`)}
      </tbody>
    </table>`}renderFilterHUD(){var s;if(!this.runtime)return m``;let e=(s=this.runtime)==null?void 0:s.spec[this.selectedFilterIdx],[t,i]=this.getFilterPositionInVisualisation(e);return m`<weq8-ui-filter-hud
      .runtime=${this.runtime}
      .index=${this.selectedFilterIdx}
      .x=${t}
      .y=${i}
    />`}renderGridX(e){return ce`<line
      class="grid-x"
      x1=${e}
      y1="0"
      x2=${e}
      y2="10"
    />`}renderGridY(e){let i=(e+15)/30*10;return ce`<line
      class="grid-y"
      x1="0"
      y1=${i}
      x2="100"
      y2=${i}
    />`}renderFilterHandle(e,t){if(!this.runtime)return;let[i,s]=this.getFilterPositionInVisualisation(e);return m`<div
      class="filter-handle-positioner"
      style="transform: translate(${i}px,${s}px)"
      @pointerdown=${r=>this.startDraggingFilterHandle(r,t)}
      @pointerup=${r=>this.stopDraggingFilterHandle(r,t)}
      @pointermove=${r=>this.dragFilterHandle(r,t)}
    >
      <div
        class="${y({"filter-handle":!0,bypassed:e.bypass,selected:t===this.selectedFilterIdx})}"
      >
        ${t+1}
      </div>
    </div>`}getFilterPositionInVisualisation(e){var a,h,l,o;if(!this.runtime)return[0,0];let t=(h=(a=this.analyserCanvas)==null?void 0:a.offsetWidth)!=null?h:0,i=(o=(l=this.analyserCanvas)==null?void 0:l.offsetHeight)!=null?o:0,s=u.toLog10(e.frequency,10,this.runtime.audioCtx.sampleRate/2)*t,r=i-(e.gain+15)/30*i;return u.filterHasGain(e.type)||(r=i-u.toLog10(e.Q,.1,18)*i),[s,r]}startDraggingFilterHandle(e,t){e.target.setPointerCapture(e.pointerId),this.dragStates={...this.dragStates,[t]:e.pointerId},this.selectedFilterIdx=t,e.preventDefault()}stopDraggingFilterHandle(e,t){this.dragStates[t]===e.pointerId&&(e.target.releasePointerCapture(e.pointerId),this.dragStates={...this.dragStates,[t]:null})}dragFilterHandle(e,t){var i,s;if(this.runtime&&this.dragStates[t]===e.pointerId){let r=this.runtime.spec[t].type,a=(s=(i=this.frequencyResponseCanvas)==null?void 0:i.getBoundingClientRect())!=null?s:{left:0,top:0,width:0,height:0},h=e.clientX-a.left,l=e.clientY-a.top,o=u.toLin(h/a.width,10,this.runtime.audioCtx.sampleRate/2);this.runtime.setFilterFrequency(t,o);let p=1-l/a.height;if(u.filterHasGain(r)){let d=u.clamp(p*30-15,-15,15);this.runtime.setFilterGain(t,d)}else{let d=u.toLin(p,.1,18);this.runtime.setFilterQ(t,d)}}}},(()=>{O.styles=[se,z`
      :host {
        display: flex;
        flex-direction: column; /* Adaptive layout */
        align-items: stretch;
        gap: 10px;
        min-width: 300px;
        min-height: 200px;
        padding: 20px;
        border-radius: 16px;
        overflow: hidden;
        background: var(--weq8-bg);
        border: 1px solid var(--weq8-border);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      
      @media (min-width: 768px) {
        :host {
          flex-direction: row;
          overflow: visible;
        }
      }

      .filters {
        display: inline-grid;
        grid-auto-flow: row;
        gap: 4px;
        flex-shrink: 0;
      }
      .filters tbody,
      .filters tr {
        display: contents;
      }
      .filters thead {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 60px 60px 50px 40px;
        align-items: center;
        gap: 4px;
        margin-bottom: 8px;
        opacity: 0.7;
      }
      .filters thead th {
        display: grid;
        place-content: center;
        height: 20px;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 10px;
        letter-spacing: 0.1em;
        color: var(--weq8-text-dim);
        border: none;
      }
      .filters thead th.headerFilter {
        text-align: left;
        justify-content: start;
        padding-left: 18px;
      }
      .visualisation {
        flex: 1;
        position: relative;
        border: 1px solid var(--weq8-border);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.2);
        overflow: hidden;
        min-height: 200px;
      }
      canvas,
      svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      svg {
        overflow: visible;
      }
      .grid-x,
      .grid-y {
        stroke: var(--weq8-border);
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
        stroke-dasharray: 4 4;
        opacity: 0.5;
      }
      .filter-handle-positioner {
        position: absolute;
        top: 0;
        left: 0;
        width: 30px;
        height: 30px;
        touch-action: none;
        z-index: 10;
      }
      .filter-handle {
        position: absolute;
        top: 0;
        left: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--weq8-text);
        color: transparent;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        cursor: grab;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      .filter-handle:hover {
        transform: translate(-50%, -50%) scale(1.2);
        background: white;
      }
      .filter-handle.selected {
        background: var(--weq8-accent);
        box-shadow: var(--weq8-handle-shadow);
        z-index: 20;
        transform: translate(-50%, -50%) scale(1.3);
      }
      .filter-handle.bypassed {
        background: var(--weq8-text-dim);
        opacity: 0.5;
        box-shadow: none;
      }
    `]})(),O);c([x({attribute:!1})],exports.WEQ8UIElement.prototype,"runtime",void 0);c([x()],exports.WEQ8UIElement.prototype,"view",void 0);c([b()],exports.WEQ8UIElement.prototype,"analyser",void 0);c([b()],exports.WEQ8UIElement.prototype,"frequencyResponse",void 0);c([b()],exports.WEQ8UIElement.prototype,"gridXs",void 0);c([b()],exports.WEQ8UIElement.prototype,"dragStates",void 0);c([b()],exports.WEQ8UIElement.prototype,"selectedFilterIdx",void 0);c([_e(".analyser")],exports.WEQ8UIElement.prototype,"analyserCanvas",void 0);c([_e(".frequencyResponse")],exports.WEQ8UIElement.prototype,"frequencyResponseCanvas",void 0);exports.WEQ8UIElement=c([ie("weq8-ui")],exports.WEQ8UIElement);
