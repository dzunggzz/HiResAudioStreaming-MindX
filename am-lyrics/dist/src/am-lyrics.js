/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$4=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$4)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$3,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$3(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t=>t,s$1=t.trustedTypes,e$2=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$2?e$2.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$1=(e,t,c)=>(c.configurable=true,c.enumerable=true,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,c),c);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function e(e,r){return (n,s,i)=>{const o=t=>t.renderRoot?.querySelector(e)??null;return e$1(n,s,{get(){return o(this)}})}}

const VERSION = '0.6.4';
const INSTRUMENTAL_THRESHOLD_MS = 3000; // Show ellipsis for gaps >= 3s
const KPOE_SERVERS = [
    'https://lyricsplus.prjktla.workers.dev',
    'https://lyrics-plus-backend.vercel.app',
    'https://lyricsplus.onrender.com',
    'https://lyricsplus.prjktla.online',
];
const DEFAULT_KPOE_SOURCE_ORDER = 'apple,musixmatch,musixmatch-word,lyricsplus,spotify';
class AmLyrics extends i {
    constructor() {
        super();
        this.start = 0;
        this.lyrics = null;
        this.lines = [];
        this.activeLineIndex = -1;
        this.activeMainWordIndices = new Map();
        this.mainWordProgress = new Map();
        this.currentTime = 0;
        this.duration = 0;
        this.userScrolled = false;
        this.scrollTimeout = null;
        this.resizeObserver = null;
        this.isHovering = false;
        this.downloadFormat = 'auto';
        this.viewOffset = 0;
        this.alignmentMap = new Map(); 

        this.activeBackgroundWordIndices = new Map();
        this.backgroundWordProgress = new Map();
        this.lyricsSource = null;
        this.mainWordAnimations = new Map();
        this.backgroundWordAnimations = new Map();
        this.lastInstrumentalIndex = null;
        this.isUserScrolling = false;
        this.isProgrammaticScroll = false;
        

        this.romanizationEnabled = true; // Experiment state
        
        // Initialize Kuromoji
        this.tokenizer = null;
        if (window.kuromoji) {
            window.kuromoji.builder({ dicPath: "./kuromoji/dict/" }).build((err, tokenizer) => {
                if (err) {
                    console.error('Kuromoji error:', err);
                } else {
                    this.tokenizer = tokenizer;
                    if (this.lyrics) {
                        this.romanizeLyrics();
                    }
                }
            });
        }
    }
    
    static get properties() {
        return {
            lyrics: { attribute: false },
            currentTime: { type: Number },
            duration: { type: Number },
            romanizationEnabled: { type: Boolean }
        };
    }
    
    // translateLyrics removed

    romanizeLyrics() {
        if (!this.lyrics) return;
        
        // If Romanization is disabled, clear any existing translation/romanization on syllables
        if (!this.romanizationEnabled) {
            let cleared = false;
            this.lyrics.forEach(line => {
                if (line.text) {
                     line.text.forEach(syl => {
                         if (syl.romanization) {
                             syl.romanization = undefined;
                             cleared = true;
                         }
                     });
                }
            });
            if (cleared) this.requestUpdate();
            return;
        }

        if (!this.tokenizer) return; // Need tokenizer to proceed

        const JAPANESE_REGEX = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;

        let needsUpdate = false;
        
        // Iterate and mutate in place
        this.lyrics.forEach(line => {
             // Process each syllable/word individually
             if (line.text) {
                 line.text.forEach(syl => {
                     // Romanize if it has Japanese text and hasn't been romanized yet
                     if (syl.text && JAPANESE_REGEX.test(syl.text) && !syl.romanization) {
                         const path = this.tokenizer.tokenize(syl.text);
                         const romaji = path.map(token => {
                             return this.katakanaToRomaji(token.reading || token.surface_form);
                         }).join(' ');
                         
                         // Simple formatting: lowercase
                         if (romaji) {
                             syl.romanization = romaji.toLowerCase();
                             needsUpdate = true;
                         }
                     }
                 });
             }
             
             // Process background text as well
             if (line.backgroundText) {
                 line.backgroundText.forEach(syl => {
                     if (syl.text && JAPANESE_REGEX.test(syl.text) && !syl.romanization) {
                         const path = this.tokenizer.tokenize(syl.text);
                         const romaji = path.map(token => {
                             return this.katakanaToRomaji(token.reading || token.surface_form);
                         }).join(' ');
                         
                         if (romaji) {
                             syl.romanization = romaji.toLowerCase();
                             needsUpdate = true;
                         }
                     }
                 });
             }
        });
        
        if (needsUpdate) {
             this.requestUpdate();
        }
    }

    katakanaToRomaji(katakana) {
        if (!katakana) return '';
        const kanaMap = {
            'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
            'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
            'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
            'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
            'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
            'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
            'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
            'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
            'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
            'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
            'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
            'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
            'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
            'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
            'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
            'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
            'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
            'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
            'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
            'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
            'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
            'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
            'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
            'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo',
            'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
            'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',
            'ッ': 't', // Sokuon - tricky, usually doubles next consonant
            'ー': '' // Long vowel mark - usually ignored or macron
        };
        
        let romaji = '';
        for (let i = 0; i < katakana.length; i++) {
            // Handle digraphs (ya, yu, yo small)
            if (i < katakana.length - 1 && ['ャ', 'ュ', 'ョ'].includes(katakana[i+1])) {
                const combo = katakana[i] + katakana[i+1];
                if (kanaMap[combo]) {
                    romaji += kanaMap[combo];
                    i++;
                    continue;
                }
            }
            // Handle Sokuon (tsu small) - doubles next char
            if (katakana[i] === 'ッ') {
                 // Look ahead
                 if (i < katakana.length - 1) {
                     const nextChar = katakana[i+1];
                     // Convert next char to get its first letter
                     // This is a rough approximation
                     const nextRomaji = this.katakanaToRomaji(nextChar);
                     if (nextRomaji) {
                         romaji += nextRomaji[0];
                     }
                 }
                 continue;
            }
            
            const char = katakana[i];
            if (kanaMap[char]) {
                romaji += kanaMap[char];
            } else {
                romaji += char; // Keep as is if not found (e.g. symbols)
            }
        }
        return romaji;
    }
    connectedCallback() {
        super.connectedCallback();
        this.fetchLyrics();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.userScrollTimeoutId) {
            clearTimeout(this.userScrollTimeoutId);
        }
    }
    async fetchLyrics() {
        this.isLoading = true;
        this.lyrics = undefined;
        this.lyricsSource = null;
        this.dispatchEvent(new CustomEvent('lyrics-loading', { bubbles: true, composed: true }));
        try {
            const resolvedMetadata = await this.resolveSongMetadata();
            const isMusicIdOnlyRequest = Boolean(this.musicId) &&
                !this.songTitle &&
                !this.songArtist &&
                !this.query;
            if (resolvedMetadata?.metadata && !isMusicIdOnlyRequest) {
                const youLyResult = await AmLyrics.fetchLyricsFromYouLyPlus(resolvedMetadata.metadata);
                if (youLyResult && youLyResult.lines.length > 0) {
                    this.lyrics = youLyResult.lines;
                    this.lyricsSource = youLyResult.source ?? 'LyricsPlus (KPoe)';
                    this.onLyricsLoaded();
                    this.dispatchEvent(new CustomEvent('lyrics-loaded', { bubbles: true, composed: true }));
                    return;
                }
            }
            this.lyrics = undefined;
            this.lyricsSource = null;
        }
        finally {
            this.isLoading = false;
            if (!this.lyrics) {
                this.dispatchEvent(new CustomEvent('lyrics-failed', { bubbles: true, composed: true }));
            }
        }
    }
    onLyricsLoaded() {
        this.activeLineIndices = [];
        this.activeMainWordIndices.clear();
        this.activeBackgroundWordIndices.clear();
        this.mainWordProgress.clear();
        this.backgroundWordProgress.clear();
        this.mainWordAnimations.clear();
        this.backgroundWordAnimations.clear();
        
        if (this.lyricsContainer) {
            this.isProgrammaticScroll = true;
            this.lyricsContainer.scrollTop = 0;
            window.setTimeout(() => {
                this.isProgrammaticScroll = false;
            }, 100);
        }
    }
    async resolveSongMetadata() {
        const metadata = {
            title: this.songTitle?.trim() ?? '',
            artist: this.songArtist?.trim() ?? '',
            album: this.songAlbum?.trim() || undefined,
            durationMs: undefined,
        };
        if (typeof this.songDurationMs === 'number' && this.songDurationMs > 0) {
            metadata.durationMs = this.songDurationMs;
        }
        else if (typeof this.duration === 'number' && this.duration > 0) {
            metadata.durationMs = this.duration;
        }
        const appleSong = null;
        let appleId = this.musicId;
        let catalogIsrc;
        if (this.query &&
            (!metadata.title || !metadata.artist || !metadata.album)) {
            const parsed = AmLyrics.parseQueryMetadata(this.query);
            if (parsed) {
                if (!metadata.title && parsed.title) {
                    metadata.title = parsed.title;
                }
                if (!metadata.artist && parsed.artist) {
                    metadata.artist = parsed.artist;
                }
                if (!metadata.album && parsed.album) {
                    metadata.album = parsed.album;
                }
            }
        }
        let catalogResult = null;
        if (this.query && (!metadata.title || !metadata.artist)) {
            catalogResult = await AmLyrics.searchLyricsPlusCatalog(this.query);
            if (catalogResult) {
                if (!metadata.title && catalogResult.title) {
                    metadata.title = catalogResult.title;
                }
                if (!metadata.artist && catalogResult.artist) {
                    metadata.artist = catalogResult.artist;
                }
                if (!metadata.album && catalogResult.album) {
                    metadata.album = catalogResult.album;
                }
                if (metadata.durationMs == null &&
                    typeof catalogResult.durationMs === 'number' &&
                    catalogResult.durationMs > 0) {
                    metadata.durationMs = catalogResult.durationMs;
                }
                if (!appleId && catalogResult.id?.appleMusic) {
                    appleId = catalogResult.id.appleMusic;
                }
                if (!catalogIsrc && catalogResult.isrc) {
                    catalogIsrc = catalogResult.isrc;
                }
            }
        }
        const trimmedTitle = metadata.title?.trim() ?? '';
        const trimmedArtist = metadata.artist?.trim() ?? '';
        const trimmedAlbum = metadata.album?.trim();
        const sanitizedDuration = typeof metadata.durationMs === 'number' &&
            Number.isFinite(metadata.durationMs) &&
            metadata.durationMs > 0
            ? Math.round(metadata.durationMs)
            : undefined;
        const finalMetadata = trimmedTitle && trimmedArtist
            ? {
                title: trimmedTitle,
                artist: trimmedArtist,
                album: trimmedAlbum || undefined,
                durationMs: sanitizedDuration,
            }
            : undefined;
        return {
            metadata: finalMetadata,
            appleId,
            appleSong,
            catalogIsrc,
        };
    }
    static parseQueryMetadata(rawQuery) {
        const trimmed = rawQuery?.trim();
        if (!trimmed)
            return null;
        const result = {};
        const hyphenSplit = trimmed.split(/\s[-–—]\s/);
        if (hyphenSplit.length >= 2) {
            const [rawTitle, ...rest] = hyphenSplit;
            const rawArtist = rest.join(' - ');
            const titleCandidate = rawTitle.trim();
            const artistCandidate = rawArtist.trim();
            if (titleCandidate && artistCandidate) {
                result.title = titleCandidate;
                result.artist = artistCandidate;
                return result;
            }
        }
        const bySplit = trimmed.split(/\s+[bB]y\s+/);
        if (bySplit.length === 2) {
            const [maybeTitle, maybeArtist] = bySplit.map(part => part.trim());
            if (maybeTitle && maybeArtist) {
                result.title = maybeTitle;
                result.artist = maybeArtist;
                return result;
            }
        }
        return null;
    }
    static async searchLyricsPlusCatalog(searchTerm) {
        const trimmedQuery = searchTerm?.trim();
        if (!trimmedQuery)
            return null;
        for (const base of KPOE_SERVERS) {
            const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
            const url = `${normalizedBase}/v1/songlist/search?q=${encodeURIComponent(trimmedQuery)}`;
            try {
                // eslint-disable-next-line no-await-in-loop
                const response = await fetch(url);
                if (response.ok) {
                    // eslint-disable-next-line no-await-in-loop
                    const payload = await response.json();
                    let results = [];
                    const typedPayload = payload;
                    if (Array.isArray(typedPayload?.results)) {
                        results = typedPayload.results;
                    }
                    else if (Array.isArray(payload)) {
                        results = payload;
                    }
                    if (results.length > 0) {
                        const primary = results.find((item) => item?.id && item.id.appleMusic);
                        return (primary ?? results[0]);
                    }
                }
            }
            catch (error) {
                // Ignore and try next server
            }
        }
        return null;
    }
    static async fetchLyricsFromYouLyPlus(metadata) {
        const title = metadata.title?.trim();
        const artist = metadata.artist?.trim();
        if (!title || !artist) {
            return null;
        }
        const params = new URLSearchParams({ title, artist });
        if (metadata.album) {
            params.append('album', metadata.album);
        }
        if (metadata.durationMs && metadata.durationMs > 0) {
            params.append('duration', Math.round(metadata.durationMs / 1000).toString());
        }
        params.append('source', DEFAULT_KPOE_SOURCE_ORDER);
        for (const base of KPOE_SERVERS) {
            const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
            const url = `${normalizedBase}/v2/lyrics/get?${params.toString()}`;
            let payload = null;
            try {
                // eslint-disable-next-line no-await-in-loop
                const response = await fetch(url);
                if (response.ok) {
                    // eslint-disable-next-line no-await-in-loop
                    payload = await response.json();
                }
            }
            catch (error) {
                payload = null;
            }
            if (payload) {
                const lines = AmLyrics.convertKPoeLyrics(payload);
                if (lines && lines.length > 0) {
                    const sourceLabel = payload?.metadata?.source ||
                        payload?.metadata?.provider ||
                        'LyricsPlus (KPoe)';
                    return { lines, source: sourceLabel };
                }
            }
        }
        return null;
    }
    static convertKPoeLyrics(payload) {
        if (!payload) {
            return null;
        }
        let rawLyrics = null;
        if (Array.isArray(payload?.lyrics)) {
            rawLyrics = payload.lyrics;
        }
        else if (Array.isArray(payload?.data?.lyrics)) {
            rawLyrics = payload.data.lyrics;
        }
        else if (Array.isArray(payload?.data)) {
            rawLyrics = payload.data;
        }
        if (!rawLyrics || rawLyrics.length === 0) {
            return null;
        }
        const sanitizedEntries = rawLyrics.filter((item) => Boolean(item));
        const lines = [];
        const isLineType = payload.type === 'Line';
        // Convert metadata.agents to alignment map
        const agents = payload.metadata?.agents ?? {};
        const agentEntries = Object.entries(agents);
        const singerAlignmentMap = {};
        if (agentEntries.length > 0) {
            agentEntries.sort((a, b) => a[0].localeCompare(b[0]));
            const personAgents = agentEntries.filter(([_, agentData]) => agentData.type === 'person');
            const personIndexMap = new Map();
            personAgents.forEach(([agentKey], personIndex) => {
                personIndexMap.set(agentKey, personIndex);
            });
            agentEntries.forEach(([agentKey, agentData]) => {
                if (agentData.type === 'group') {
                    singerAlignmentMap[agentKey] = 'start';
                }
                else if (agentData.type === 'other') {
                    singerAlignmentMap[agentKey] = 'end';
                }
                else if (agentData.type === 'person') {
                    const personIndex = personIndexMap.get(agentKey);
                    if (personIndex !== undefined) {
                        singerAlignmentMap[agentKey] =
                            personIndex % 2 === 0 ? 'start' : 'end';
                    }
                }
            });
        }
        for (const entry of sanitizedEntries) {
            const start = Number(entry.time);
            const duration = Number(entry.duration);
            // Determine alignment
            let alignment;
            const singerId = entry.element?.singer;
            if (singerId && singerAlignmentMap[singerId]) {
                alignment = singerAlignmentMap[singerId];
            }
            const lineText = typeof entry.text === 'string' ? entry.text : '';
            const lineStart = AmLyrics.toMilliseconds(entry.time);
            const lineDuration = AmLyrics.toMilliseconds(entry.duration);
            const explicitEnd = AmLyrics.toMilliseconds(entry.endTime);
            const lineEnd = explicitEnd || lineStart + (lineDuration || 0);
            const syllabus = Array.isArray(entry.syllabus)
                ? entry.syllabus.filter((s) => Boolean(s))
                : [];
            const mainSyllables = [];
            const backgroundSyllables = [];
            if (!isLineType && syllabus.length > 0) {
                for (const syl of syllabus) {
                    const sylStart = AmLyrics.toMilliseconds(syl.time, lineStart);
                    const sylDuration = AmLyrics.toMilliseconds(syl.duration);
                    const sylEnd = sylDuration > 0 ? sylStart + sylDuration : lineEnd;
                    const syllable = {
                        text: typeof syl.text === 'string' ? syl.text : '',
                        part: Boolean(syl.part),
                        timestamp: sylStart,
                        endtime: sylEnd,
                    };
                    if (syl.isBackground) {
                        backgroundSyllables.push(syllable);
                    }
                    else {
                        mainSyllables.push(syllable);
                    }
                }
            }
            if (mainSyllables.length === 0 && lineText) {
                mainSyllables.push({
                    text: lineText,
                    part: false,
                    timestamp: lineStart,
                    endtime: lineEnd || lineStart,
                });
            }
            const hasWordSync = mainSyllables.length > 0 || backgroundSyllables.length > 0;
            const lineResult = {
                text: mainSyllables,
                background: backgroundSyllables.length > 0,
                backgroundText: backgroundSyllables,
                translation: entry.translation, // Add translation support
                oppositeTurn: Array.isArray(entry.element)
                    ? entry.element.includes('opposite') ||
                        entry.element.includes('right')
                    : false,
                timestamp: lineStart,
                endtime: start + duration,
                isWordSynced: hasWordSync,
                alignment,
                songPart: entry.element?.songPart,
            };
            lines.push(lineResult);
        }
        return lines;
    }
    static toMilliseconds(value, fallback = 0) {
        const num = Number(value);
        if (!Number.isFinite(num) || Number.isNaN(num)) {
            return fallback;
        }
        if (!Number.isInteger(num)) {
            return Math.round(num * 1000);
        }
        return Math.max(0, Math.round(num));
    }
    firstUpdated() {
        // Set up scroll event listener for user scroll detection
        if (this.lyricsContainer) {
            this.lyricsContainer.addEventListener('scroll', this.handleUserScroll.bind(this), { passive: true });
        }
    }
    updated(changedProperties) {
        // Handle duration reset (-1 stops playback and resets currentTime to 0)
        if (changedProperties.has('duration') && this.duration === -1) {
            this.currentTime = 0;
            this.activeLineIndices = [];
            this.activeMainWordIndices.clear();
            this.activeBackgroundWordIndices.clear();
            this.mainWordProgress.clear();
            this.backgroundWordProgress.clear();
            this.mainWordAnimations.clear();
            this.backgroundWordAnimations.clear();
            this.isUserScrolling = false;
            // Cancel any running animations
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = undefined;
            }
            // Clear user scroll timeout
            if (this.userScrollTimeoutId) {
                clearTimeout(this.userScrollTimeoutId);
                this.userScrollTimeoutId = undefined;
            }
            // Scroll to top
            if (this.lyricsContainer) {
                this.lyricsContainer.scrollTop = 0;
            }
            return; // Exit early, don't process other changes
        }
        
        if (changedProperties.has('lyrics') || changedProperties.has('romanizationEnabled')) {
             this.romanizeLyrics();
        }
        if ((changedProperties.has('query') ||
            changedProperties.has('musicId') ||
            changedProperties.has('isrc') ||
            changedProperties.has('songTitle') ||
            changedProperties.has('songArtist') ||
            changedProperties.has('songAlbum') ||
            changedProperties.has('songDurationMs')) &&
            !changedProperties.has('currentTime')) {
            this.fetchLyrics();
        }
        if (changedProperties.has('currentTime') && this.lyrics) {
            const oldTime = changedProperties.get('currentTime') ?? 0;
            const timeDiff = Math.abs(this.currentTime - oldTime);
            const newActiveLines = this.findActiveLineIndices(this.currentTime);
            // Reset animation if active lines change or if we skip time.
            // A threshold of 0.5s (500ms) is used to detect a "skip".
            const linesChanged = !AmLyrics.arraysEqual(newActiveLines, this.activeLineIndices);
            if (linesChanged || timeDiff > 0.5) {
                this.startAnimationFromTime(this.currentTime);
            }
            // For small, continuous updates, we do nothing and let the animation loop handle it.
        }
        if (this.autoScroll &&
            !this.isUserScrolling &&
            changedProperties.has('activeLineIndices') &&
            this.activeLineIndices.length > 0) {
            this.scrollToActiveLine();
        }
        // Smoothly scroll to the indicator when entering a gap
        const instrumental = this.findInstrumentalGapAt(this.currentTime);
        const idx = instrumental ? instrumental.insertBeforeIndex : null;
        if (this.autoScroll && !this.isUserScrolling) {
            if (idx !== null && idx !== this.lastInstrumentalIndex) {
                this.scrollToInstrumental(idx);
                this.lastInstrumentalIndex = idx;
            }
            else if (idx === null && this.lastInstrumentalIndex !== null) {
                // Gap ended — gently scroll to the line that begins now
                this.scrollToInstrumental(this.lastInstrumentalIndex);
                this.lastInstrumentalIndex = null;
            }
        }
    }
    static arraysEqual(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }
    handleUserScroll() {
        // Ignore programmatic scrolls
        if (this.isProgrammaticScroll) {
            return;
        }
        // Mark that user is currently scrolling
        this.isUserScrolling = true;
        // Clear any existing timeout
        if (this.userScrollTimeoutId) {
            clearTimeout(this.userScrollTimeoutId);
        }
        // Set timeout to re-enable auto-scroll after 2 seconds of no scrolling
        this.userScrollTimeoutId = window.setTimeout(() => {
            this.isUserScrolling = false;
            this.userScrollTimeoutId = undefined;
            // Optionally scroll back to current active line when re-enabling auto-scroll
            if (this.activeLineIndices.length > 0) {
                this.scrollToActiveLine();
            }
        }, 2000);
    }
    findActiveLineIndices(time) {
        if (!this.lyrics)
            return [];
        const activeLines = [];
        for (let i = 0; i < this.lyrics.length; i += 1) {
            if (time >= this.lyrics[i].timestamp && time <= this.lyrics[i].endtime) {
                activeLines.push(i);
            }
        }
        return activeLines;
    }
    findInstrumentalGapAt(time) {
        if (!this.lyrics || this.lyrics.length === 0)
            return null;
        // Start-of-song gap: from 0 to first line timestamp
        const first = this.lyrics[0];
        if (time >= 0 && time < first.timestamp) {
            const gapStart = 0;
            const gapEnd = first.timestamp;
            if (gapEnd - gapStart >= INSTRUMENTAL_THRESHOLD_MS) {
                return { insertBeforeIndex: 0, gapStart, gapEnd };
            }
            return null;
        }
        // Find consecutive pair (i, i+1) that bounds the current time
        for (let i = 0; i < this.lyrics.length - 1; i += 1) {
            const curr = this.lyrics[i];
            const next = this.lyrics[i + 1];
            const gapStart = curr.endtime;
            const gapEnd = next.timestamp;
            if (time > gapStart && time < gapEnd) {
                if (gapEnd - gapStart >= INSTRUMENTAL_THRESHOLD_MS) {
                    return { insertBeforeIndex: i + 1, gapStart, gapEnd };
                }
                return null;
            }
        }
        return null;
    }
    startAnimationFromTime(time) {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = undefined;
        }
        if (!this.lyrics)
            return;
        const activeLineIndices = this.findActiveLineIndices(time);
        this.activeLineIndices = activeLineIndices;
        // Clear previous state
        this.activeMainWordIndices.clear();
        this.activeBackgroundWordIndices.clear();
        this.mainWordAnimations.clear();
        this.backgroundWordAnimations.clear();
        this.mainWordProgress.clear();
        this.backgroundWordProgress.clear();
        if (activeLineIndices.length === 0) {
            return;
        }
        // Set up animations for each active line
        for (const lineIndex of activeLineIndices) {
            const line = this.lyrics[lineIndex];
            // Find main word based on the reset time
            let mainWordIdx = -1;
            for (let i = 0; i < line.text.length; i += 1) {
                if (time >= line.text[i].timestamp && time <= line.text[i].endtime) {
                    mainWordIdx = i;
                    break;
                }
            }
            this.activeMainWordIndices.set(lineIndex, mainWordIdx);
            // Find background word based on the reset time
            let backWordIdx = -1;
            if (line.backgroundText) {
                for (let i = 0; i < line.backgroundText.length; i += 1) {
                    if (time >= line.backgroundText[i].timestamp &&
                        time <= line.backgroundText[i].endtime) {
                        backWordIdx = i;
                        break;
                    }
                }
            }
            this.activeBackgroundWordIndices.set(lineIndex, backWordIdx);
        }
        // With the state correctly set, configure the animation parameters
        this.setupAnimations();
        // Start the animation loop
        if (this.interpolate) {
            this.animateProgress();
        }
    }
    updateActiveLineAndWords() {
        if (!this.lyrics)
            return;
        const activeLineIndices = this.findActiveLineIndices(this.currentTime);
        this.activeLineIndices = activeLineIndices;
        // Clear previous state
        this.activeMainWordIndices.clear();
        this.activeBackgroundWordIndices.clear();
        for (const lineIdx of activeLineIndices) {
            const line = this.lyrics[lineIdx];
            let mainWordIdx = -1;
            for (let i = 0; i < line.text.length; i += 1) {
                if (this.currentTime >= line.text[i].timestamp &&
                    this.currentTime <= line.text[i].endtime) {
                    mainWordIdx = i;
                    break;
                }
            }
            this.activeMainWordIndices.set(lineIdx, mainWordIdx);
            let backWordIdx = -1;
            if (line.backgroundText) {
                for (let i = 0; i < line.backgroundText.length; i += 1) {
                    if (this.currentTime >= line.backgroundText[i].timestamp &&
                        this.currentTime <= line.backgroundText[i].endtime) {
                        backWordIdx = i;
                        break;
                    }
                }
            }
            this.activeBackgroundWordIndices.set(lineIdx, backWordIdx);
        }
    }
    setupAnimations() {
        if (this.activeLineIndices.length === 0 || !this.lyrics) {
            this.mainWordAnimations.clear();
            this.backgroundWordAnimations.clear();
            return;
        }
        for (const lineIndex of this.activeLineIndices) {
            const line = this.lyrics[lineIndex];
            const mainWordIndex = this.activeMainWordIndices.get(lineIndex) ?? -1;
            const backgroundWordIndex = this.activeBackgroundWordIndices.get(lineIndex) ?? -1;
            // Main word animation
            if (mainWordIndex !== -1) {
                const word = line.text[mainWordIndex];
                const wordDuration = word.endtime - word.timestamp;
                const elapsedInWord = this.currentTime - word.timestamp;
                this.mainWordAnimations.set(lineIndex, {
                    startTime: performance.now() - elapsedInWord,
                    duration: wordDuration,
                });
            }
            else {
                this.mainWordAnimations.set(lineIndex, { startTime: 0, duration: 0 });
            }
            // Background word animation
            if (backgroundWordIndex !== -1 && line.backgroundText) {
                const word = line.backgroundText[backgroundWordIndex];
                const wordDuration = word.endtime - word.timestamp;
                const elapsedInWord = this.currentTime - word.timestamp;
                this.backgroundWordAnimations.set(lineIndex, {
                    startTime: performance.now() - elapsedInWord,
                    duration: wordDuration,
                });
            }
            else {
                this.backgroundWordAnimations.set(lineIndex, {
                    startTime: 0,
                    duration: 0,
                });
            }
        }
    }
    handleLineClick(line) {
        const event = new CustomEvent('line-click', {
            detail: {
                timestamp: line.timestamp,
            },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
    static getBackgroundTextPlacement(line) {
        if (!line.backgroundText ||
            line.backgroundText.length === 0 ||
            line.text.length === 0) {
            return 'after'; // Default to after if no comparison is possible
        }
        // Compare the start times of the first syllables
        const mainTextStartTime = line.text[0].timestamp;
        const backgroundTextStartTime = line.backgroundText[0].timestamp;
        return backgroundTextStartTime < mainTextStartTime ? 'before' : 'after';
    }
    scrollToActiveLine() {
        if (!this.lyricsContainer || this.activeLineIndices.length === 0) {
            return;
        }
        // Scroll to the first active line
        const firstActiveLineIndex = Math.min(...this.activeLineIndices);
        const activeLineElement = this.lyricsContainer.querySelector(`.lyrics-line:nth-child(${firstActiveLineIndex + 1})`);
        if (activeLineElement) {
            const containerHeight = this.lyricsContainer.clientHeight;
            const lineTop = activeLineElement.offsetTop;
            const lineHeight = activeLineElement.clientHeight;
            // Check if the line has background text placed before the main text
            const hasBackgroundBefore = activeLineElement.querySelector('.background-text.before');
            // Calculate the offset to center the main text content, accounting for background text placement
            let offsetAdjustment = 0;
            if (hasBackgroundBefore) {
                const backgroundElement = hasBackgroundBefore;
                offsetAdjustment = backgroundElement.clientHeight / 2; // Adjust to focus on main content
            }
            const top = lineTop - containerHeight / 2 + lineHeight / 2 - offsetAdjustment;
            // Use requestAnimationFrame for smoother iOS performance
            requestAnimationFrame(() => {
                this.isProgrammaticScroll = true;
                this.lyricsContainer?.scrollTo({ top, behavior: 'smooth' });
                // Reset the flag after a short delay to allow the scroll to complete
                setTimeout(() => {
                    this.isProgrammaticScroll = false;
                }, 100);
            });
        }
    }
    scrollToInstrumental(insertBeforeIndex) {
        if (!this.lyricsContainer)
            return;
        const target = this.lyricsContainer.querySelector(`.lyrics-line:nth-child(${insertBeforeIndex + 1})`);
        if (target) {
            const containerHeight = this.lyricsContainer.clientHeight;
            const lineTop = target.offsetTop;
            const lineHeight = target.clientHeight;
            // Check if the target line has background text placed before the main text
            const hasBackgroundBefore = target.querySelector('.background-text.before');
            // Calculate the offset to center the main text content, accounting for background text placement
            let offsetAdjustment = 0;
            if (hasBackgroundBefore) {
                const backgroundElement = hasBackgroundBefore;
                offsetAdjustment = backgroundElement.clientHeight / 2; // Adjust to focus on main content
            }
            const top = lineTop - containerHeight / 2 + lineHeight / 2 - offsetAdjustment;
            // Use requestAnimationFrame for smoother iOS performance
            requestAnimationFrame(() => {
                this.isProgrammaticScroll = true;
                this.lyricsContainer?.scrollTo({ top, behavior: 'smooth' });
                // Reset the flag after a short delay to allow the scroll to complete
                setTimeout(() => {
                    this.isProgrammaticScroll = false;
                }, 100);
            });
        }
    }
    animateProgress() {
        const now = performance.now();
        let running = false;
        if (!this.lyrics || this.activeLineIndices.length === 0) {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = undefined;
            }
            return;
        }
        // Process each active line
        for (const lineIndex of this.activeLineIndices) {
            const line = this.lyrics[lineIndex];
            const mainWordAnimation = this.mainWordAnimations.get(lineIndex);
            // Main text animation
            if (mainWordAnimation && mainWordAnimation.duration > 0) {
                const elapsed = now - mainWordAnimation.startTime;
                if (elapsed >= 0) {
                    const progress = Math.min(1, elapsed / mainWordAnimation.duration);
                    this.mainWordProgress.set(lineIndex, progress);
                    if (progress < 1) {
                        running = true;
                    }
                    else {
                        // Word animation finished. Look for the next word in the same line.
                        const currentMainWordIndex = this.activeMainWordIndices.get(lineIndex) ?? -1;
                        const nextWordIndex = currentMainWordIndex + 1;
                        if (currentMainWordIndex !== -1 &&
                            nextWordIndex < line.text.length) {
                            const currentWord = line.text[currentMainWordIndex];
                            const nextWord = line.text[nextWordIndex];
                            this.activeMainWordIndices.set(lineIndex, nextWordIndex);
                            const gap = nextWord.timestamp - currentWord.endtime;
                            const nextWordDuration = nextWord.endtime - nextWord.timestamp;
                            this.mainWordAnimations.set(lineIndex, {
                                startTime: performance.now() + gap,
                                duration: nextWordDuration,
                            });
                            running = true;
                        }
                        else {
                            this.mainWordAnimations.set(lineIndex, {
                                startTime: 0,
                                duration: 0,
                            });
                        }
                    }
                }
                else {
                    // Waiting in a gap
                    this.mainWordProgress.set(lineIndex, 0);
                    running = true;
                }
            }
            // Background text animation
            const backgroundWordAnimation = this.backgroundWordAnimations.get(lineIndex);
            if (backgroundWordAnimation && backgroundWordAnimation.duration > 0) {
                const elapsed = now - backgroundWordAnimation.startTime;
                if (elapsed >= 0) {
                    const progress = Math.min(1, elapsed / backgroundWordAnimation.duration);
                    this.backgroundWordProgress.set(lineIndex, progress);
                    if (progress < 1) {
                        running = true;
                    }
                    else {
                        // Word animation finished. Look for the next word in the same line.
                        const currentBackgroundWordIndex = this.activeBackgroundWordIndices.get(lineIndex) ?? -1;
                        if (line.backgroundText &&
                            currentBackgroundWordIndex !== -1 &&
                            currentBackgroundWordIndex < line.backgroundText.length - 1) {
                            const nextWordIndex = currentBackgroundWordIndex + 1;
                            const currentWord = line.backgroundText[currentBackgroundWordIndex];
                            const nextWord = line.backgroundText[nextWordIndex];
                            this.activeBackgroundWordIndices.set(lineIndex, nextWordIndex);
                            const gap = nextWord.timestamp - currentWord.endtime;
                            const nextWordDuration = nextWord.endtime - nextWord.timestamp;
                            this.backgroundWordAnimations.set(lineIndex, {
                                startTime: performance.now() + gap,
                                duration: nextWordDuration,
                            });
                            running = true;
                        }
                        else {
                            this.backgroundWordAnimations.set(lineIndex, {
                                startTime: 0,
                                duration: 0,
                            });
                        }
                    }
                }
                else {
                    // Waiting in a gap
                    this.backgroundWordProgress.set(lineIndex, 0);
                    running = true;
                }
            }
        }
        if (running) {
            this.animationFrameId = requestAnimationFrame(this.animateProgress.bind(this));
        }
        else if (this.animationFrameId) {
            // Stop animation if no words are running
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = undefined;
        }
    }

    render() {
        if (this.fontFamily) {
            this.style.fontFamily = this.fontFamily;
        }
        // Set both old internal CSS variables (for backward compatibility)
        // and new public CSS variables (which take precedence)
        this.style.setProperty('--hover-background-color', this.hoverBackgroundColor);
        this.style.setProperty('--highlight-color', this.highlightColor);
        const sourceLabel = this.lyricsSource ?? 'Unavailable';
        const renderContent = () => {
            if (this.isLoading) {
                // Render stylized skeleton lines
                return b `
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
        `;
            }
            if (!this.lyrics || this.lyrics.length === 0) {
                return b `<div class="no-lyrics">No lyrics found.</div>`;
            }
            const instrumental = this.findInstrumentalGapAt(this.currentTime);
            return this.lyrics.map((line, lineIndex) => {
                const isLineActive = this.activeLineIndices.includes(lineIndex);
                const bgIsPlayingNow = line.backgroundText && line.backgroundText.length > 0
                    ? line.backgroundText.some(syl => this.currentTime >= syl.timestamp &&
                        this.currentTime <= syl.endtime)
                    : false;
                const backgroundPlacement = AmLyrics.getBackgroundTextPlacement(line);
                const shouldShowBackground = line.backgroundText &&
                    line.backgroundText.length > 0 &&
                    (isLineActive || bgIsPlayingNow);
                // Create background text element
                const backgroundTextElement = shouldShowBackground
                    ? b `<span class="background-text ${backgroundPlacement}">
              ${line.backgroundText.map((syllable, wordIndex) => {
                        const activeBackgroundWordIndex = this.activeBackgroundWordIndices.get(lineIndex) ?? -1;
                        const isWordActive = isLineActive && wordIndex === activeBackgroundWordIndex;
                        const isWordPassed = isLineActive &&
                            (wordIndex < activeBackgroundWordIndex ||
                                (activeBackgroundWordIndex === -1 &&
                                    this.currentTime > syllable.endtime));
                        let progress = 0;
                        if (isWordActive) {
                            progress = this.interpolate
                                ? (this.backgroundWordProgress.get(lineIndex) ?? 0)
                                : 1;
                        }
                        else if (isWordPassed) {
                            progress = 1;
                        }
                        const romanization = syllable.romanization 
                            ? b`<span class="romanization-word progress-text"
                                    style="--line-progress: ${progress * 100}%; --transition-style: ${isLineActive ? 'all' : 'color'}"
                                >${syllable.romanization}</span>` 
                            : '';

                        return b `<span class="word-column">
                  ${romanization}
                  <span
                  class="progress-text"
                  style="--line-progress: ${progress *
                            100}%; margin-right: 0; --transition-style: ${isLineActive
                            ? 'all'
                            : 'color'}"
                  >${syllable.text}</span
                ></span>`;
                    })}
            </span>`
                    : '';
                // Create main text element
                const mainTextElement = b `<span>
          ${line.text.map((syllable, wordIndex) => {
                    const activeMainWordIndex = this.activeMainWordIndices.get(lineIndex) ?? -1;
                    const isWordActive = isLineActive && wordIndex === activeMainWordIndex;
                    const isWordPassed = isLineActive &&
                        (wordIndex < activeMainWordIndex ||
                            (activeMainWordIndex === -1 &&
                                this.currentTime > syllable.endtime));
                    let progress = 0;
                    if (isWordActive) {
                        if (line.isWordSynced === false) {
                            progress = 1;
                        }
                        else {
                            progress = this.interpolate
                                ? (this.mainWordProgress.get(lineIndex) ?? 0)
                                : 1;
                        }
                    }
                    else if (isWordPassed) {
                        progress = 1;
                    }
                    
                    const romanization = syllable.romanization 
                        ? b`<span class="romanization-word progress-text"
                                style="--line-progress: ${progress * 100}%; --transition-style: ${isLineActive ? 'all' : 'color'}"
                            >${syllable.romanization}</span>` 
                        : '';
                        
                    return b `<span class="word-column">
              ${romanization}
              <span
              class="progress-text"
              style="--line-progress: ${progress *
                        100}%; margin-right: 0; --transition-style: ${isLineActive
                        ? 'all'
                        : 'color'}"
              >${syllable.text}</span
            ></span>`;
                })}
        </span>
        ${line.translation ? b`<div class="lyrics-translation">${line.translation}</div>` : ''}`;
                let maybeInstrumentalBlock = null;
                if (instrumental && instrumental.insertBeforeIndex === lineIndex) {
                    const remainingSeconds = Math.max(0, Math.ceil((instrumental.gapEnd - this.currentTime) / 1000));
                    if (remainingSeconds > 0) {
                        maybeInstrumentalBlock = b `<div
              class="instrumental-line"
              aria-label="Instrumental gap"
            >
              <div class="instrumental-bars">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
              </div>
              <span class="instrumental-duration">${remainingSeconds}s</span>
            </div>`;
                    }
                }
                const isPast = !isLineActive && line.endtime < this.currentTime;
                return b `
          ${maybeInstrumentalBlock}
          <div
            class="lyrics-line ${line.oppositeTurn
                    ? 'opposite-turn'
                    : ''} ${isLineActive ? 'active-line' : ''} ${isPast ? 'past-line' : ''} ${line.alignment ===
                    'end'
                    ? 'singer-right'
                    : 'singer-left'}"
            style="margin-right:0px;--alignment: ${line.alignment}; --delay: ${lineIndex * 0.05}s; animation-delay: var(--delay);"
            @click=${() => this.handleLineClick(line)}
            tabindex="0"
            @keydown=${(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        this.handleLineClick(line);
                    }
                }}
          >
            ${backgroundPlacement === 'before' ? backgroundTextElement : ''}
            ${mainTextElement}
            ${backgroundPlacement === 'after' ? backgroundTextElement : ''}
          </div>
        `;
            });
        };
        return b `
      <div class="lyrics-container">
        ${''}
        ${renderContent()}
        ${!this.isLoading
            ? b `
            <footer class="lyrics-footer">
              <div class="footer-content">
                <span class="source-info" style="opacity: 0.5;">Source: ${sourceLabel}</span>
                <span style="margin: 0 8px; opacity: 0.3;">•</span>
                <span class="version-info" style="opacity: 0.5;">v${VERSION}</span>
                <br>
                <a href="https://github.com/uimaxbai/apple-music-web-components" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 8px; font-size: 0.9em; opacity: 0.8;">Star uimaxbai on GitHub (GOATED)</a>
                <br><br>
              </div>
            </footer>
          `
            : ''}
      </div>
    `;
    }


}
    AmLyrics.styles = i$3 `
    :host {
      position: relative;
      display: block;
      font-family: var(--font-primary, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      background: transparent;
      height: 100%;
      overflow: hidden;
      --lyrics-padding: 20px;
    }

    .lyrics-container {
      padding: var(--lyrics-padding);
      padding-left: 0;
      padding-right: 0;
      width: 100%;
      height: 100%;
      max-height: 90vh;
      overflow-y: auto;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
      
      /* Hide scrollbar */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE/Edge */
    }
    
    .lyrics-container::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }

    .lyrics-line {
      scroll-snap-align: start;
      margin-bottom: 20px;
      margin-right: 0px;
      cursor: pointer;
      border-radius: 12px;
      padding: 10px 16px; 
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      transform-origin: left center;
      position: relative;
      /* Animation for entrance */
      animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
      font-size: 1.8em; /* Slightly adjusted base size */
      font-weight: 600; /* Bolder text */
      line-height: 1.3;
      
      color: rgba(255, 255, 255, 0.5); /* Transparent white for inactive */
      filter: blur(1px); /* Slight blur for depth */
      transform: scale(0.98);
      
      word-wrap: break-word;
      overflow-wrap: break-word;
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      contain: layout style paint;
    }

    /* Highlight Past Lines */
    .past-line {
      color: rgba(255, 255, 255, 1); /* Max visibility */
      filter: blur(0); /* Crisp */
      transform: scale(1); /* Full size */
    }

    /* Hover state for inactive lines */
    .lyrics-line:hover:not(.active-line) {
      color: rgba(255, 255, 255, 0.95);
      filter: blur(0);
      background-color: rgba(255, 255, 255, 0.05); /* very subtle hover bg */
    }

    .active-line {
      color: #fff; /* Bright white */
      filter: blur(0);
      transform: scale(1);
      transform-origin: left center;
      margin: 24px 0; /* More space around active line */
      text-shadow: 0 4px 24px rgba(0,0,0,0.5);
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
        .lyrics-line {
            font-size: 2.2em; /* Spotify-like large text */
            font-weight: 700; /* Bolder */
            margin: 16px 0;
            line-height: 1.4;
            color: rgba(255, 255, 255, 0.5); /* Dim future lines */
        }
        .active-line {
            margin: 24px 0;
            transform-origin: left center;
            color: #fff;
            transform: scale(1.02);
        }
        .past-line {
            color: #fff; /* Past lines fully white */
        }
    }

    .progress-text {
      position: relative;
      display: inline-block;
      
      /* Gradient Text for progress */
      background: linear-gradient(
        to right,
        var(--am-lyrics-highlight-color, #fff) 0%,
        var(--am-lyrics-highlight-color, #fff) var(--line-progress, 0%),
        rgba(255, 255, 255, 0.5) var(--line-progress, 0%),
        rgba(255, 255, 255, 0.5) 100%
      );
      
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      
      /* Fallback colour */
      color: rgba(255, 255, 255, 0.5);
      
      white-space: pre-wrap;
      transform: translate3d(0, 0, 0);
      will-change: background-size;
    }

    .active-line .progress-text {
        /* When line is active, the "future" text part is pure white (handled by gradient above) but we can ensure base state is distinct if needed */
    }

    .background-text {
      display: block;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.65em;
      font-weight: 500;
      line-height: 1.2;
    }

    .singer-right {
      text-align: left;
      align-items: flex-start; /* Flex alignment */
      display: flex;
      flex-direction: column;
      margin-right: 0%; /* Keep to left side */
    }

    .singer-left {
      text-align: left;
      align-items: flex-start; /* Flex alignment */
      display: flex;
      flex-direction: column;
      margin-right: 0%; /* Keep to left side */
    }

    /* Mobile adjustments for duets */
    @media (max-width: 768px) {
        .singer-right {
            margin-right: 10%;
        }
        .singer-left {
            margin-right: 10%;
        }
    }

    .translate-button {
      background: rgba(255,255,255,0.1); 
      border: none; 
      border-radius: 50%; 
      width: 36px;
      height: 36px;
      padding: 0;
      color: white; 
      cursor: pointer; 
      backdrop-filter: blur(5px); 
      display: flex; 
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .translate-button:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
    }
    .translate-button.active {
        background: #3b82f6; /* Blue active state */
        color: white;
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
    }

    /* Translation / Romanized Text */
    .word-column {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      margin-right: 4px; /* Space between words */
      vertical-align: bottom; /* Align bottom of columns */
    }
    
    .romanization-word {
      font-size: 0.5em; /* Smaller than original */
      margin-bottom: 2px;
      opacity: 0.8;
      line-height: 1.2;
    }

    .lyrics-translation {
      display: block;
      font-size: 0.55em; /* Small */
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 4px;
      font-style: italic;
      letter-spacing: 0.02em;
    }
    
    @media (max-width: 768px) {
        .lyrics-translation {
            font-size: 0.45em; /* Smaller on mobile */
        }
    }
    .lyrics-footer {
      text-align: center;
      font-size: 0.7em;
      color: rgba(255, 255, 255, 0.4);
      padding: 30px 0;
      margin-top: 20px;
      /* Border removed for cleaner look */
    }

    .lyrics-footer a {
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      transition: color 0.2s;
    }

    .lyrics-footer a:hover {
      color: #fff;
      text-decoration: underline;
    }

    /* Instrumental & Skeleton - keep similar but cleaner */
    .instrumental-line {
      display: inline-flex;
      align-items: center;
      gap: 12px; /* Increased gap */
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.9em;
      padding: 8px 12px;
      border-radius: 20px;
      margin: 10px 0;
    }

    .instrumental-bars {
        display: flex;
        align-items: flex-end;
        gap: 3px;
        height: 16px;
    }

    .instrumental-bars span {
        width: 3px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 2px;
        animation: music-bar 0.5s ease-in-out infinite alternate;
    }

    .instrumental-bars span:nth-child(1) { height: 60%; animation-delay: 0s; }
    .instrumental-bars span:nth-child(2) { height: 100%; animation-delay: 0.1s; }
    .instrumental-bars span:nth-child(3) { height: 80%; animation-delay: 0.2s; }
    .instrumental-bars span:nth-child(4) { height: 50%; animation-delay: 0.3s; }

    @keyframes music-bar {
        0% { height: 20%; opacity: 0.5; }
        100% { height: 100%; opacity: 1; }
    }
    
    .instrumental-duration {
      color: rgba(255,255,255,0.6);
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    
    .skeleton-line {
      height: 2em;
      margin: 24px 0;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.05);
      animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
    }
    
    @keyframes skeleton-pulse {
        from { opacity: 0.3; }
        to { opacity: 0.6; }
    }
  `;
__decorate([
    n({ type: String })
], AmLyrics.prototype, "query", void 0);
__decorate([
    n({ type: String })
], AmLyrics.prototype, "musicId", void 0);
__decorate([
    n({ type: String })
], AmLyrics.prototype, "isrc", void 0);
__decorate([
    n({ type: String, attribute: 'song-title' })
], AmLyrics.prototype, "songTitle", void 0);

__decorate([
    n({ type: String, attribute: 'song-artist' })
], AmLyrics.prototype, "songArtist", void 0);
__decorate([
    n({ type: String, attribute: 'song-album' })
], AmLyrics.prototype, "songAlbum", void 0);
__decorate([
    n({ type: Number, attribute: 'song-duration' })
], AmLyrics.prototype, "songDurationMs", void 0);
__decorate([
    n({ type: String, attribute: 'highlight-color' })
], AmLyrics.prototype, "highlightColor", void 0);
__decorate([
    n({ type: String, attribute: 'hover-background-color' })
], AmLyrics.prototype, "hoverBackgroundColor", void 0);
__decorate([
    n({ type: String, attribute: 'font-family' })
], AmLyrics.prototype, "fontFamily", void 0);
__decorate([
    n({ type: Boolean })
], AmLyrics.prototype, "autoScroll", void 0);
__decorate([
    n({ type: Boolean })
], AmLyrics.prototype, "interpolate", void 0);
__decorate([
    n({ type: Number })
], AmLyrics.prototype, "duration", void 0);
__decorate([
    n({ type: Number })
], AmLyrics.prototype, "currentTime", void 0);
__decorate([
    r()
], AmLyrics.prototype, "isLoading", void 0);
__decorate([
    r()
], AmLyrics.prototype, "lyrics", void 0);
__decorate([
    r()
], AmLyrics.prototype, "activeLineIndices", void 0);
__decorate([
    r()
], AmLyrics.prototype, "activeMainWordIndices", void 0);
__decorate([
    r()
], AmLyrics.prototype, "activeBackgroundWordIndices", void 0);
__decorate([
    r()
], AmLyrics.prototype, "mainWordProgress", void 0);
__decorate([
    r()
], AmLyrics.prototype, "backgroundWordProgress", void 0);
__decorate([
    r()
], AmLyrics.prototype, "lyricsSource", void 0);
__decorate([
    e('.lyrics-container')
], AmLyrics.prototype, "lyricsContainer", void 0);
__decorate([
    r()
], AmLyrics.prototype, "isUserScrolling", void 0);


window.customElements.define('am-lyrics', AmLyrics);
//# sourceMappingURL=am-lyrics.js.map
