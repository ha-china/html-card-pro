import{html,LitElement}from"https://unpkg.com/lit-element@2.4.0/lit-element.js?module";const HTML_PRO_CARD_VERSION="3.5";console.info("%c HTML-PRO-CARD %c v3.5 ","background:#03a9f4;color:#fff;font-weight:bold;","background:#333;color:#fff;");const _globalLoadedScripts=window._htmlProCardScripts||(window._htmlProCardScripts=new Set);if(!document.getElementById("html-pro-card-overlay")){const t=document.createElement("div");t.id="html-pro-card-overlay",t.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;",document.body.appendChild(t)}if(window._htmlProCardOverlay=document.getElementById("html-pro-card-overlay"),function(){const t=window._htmlProCardOverlay;if(!t)return;window.addEventListener("location-changed",()=>{t.innerHTML=""}),t.addEventListener("click",e=>{const s=e.target.closest("[data-action][data-entity]")||e.target.closest("[data-action]");if(!s)return;const o=s.dataset.entity||s.closest("[data-entity]")?.dataset.entity,i=s.dataset.action;if(!o||!i)return;const r=document.querySelector("home-assistant")?.hass;if(!r)return;const[n]=o.split(".");if("more-info"===i){const e=new Event("hass-more-info",{bubbles:!0,composed:!0});return e.detail={entityId:o},void t.dispatchEvent(e)}let a=i;if("toggle"===i){const t=r.states[o];if("lock"===n)a="locked"===t?.state?"unlock":"lock";else if("cover"===n)a="open"===t?.state||"opening"===t?.state?"close_cover":"open_cover";else if("button"===n||"input_button"===n)a="press";else if("scene"===n)a="turn_on";else{if("script"===n)return void r.callService("script",o.split(".")[1],{});t&&(a="on"===t.state?"turn_off":"turn_on")}}r.callService(n,a,{entity_id:o})})}(),!window._htmlProCardRoots){window._htmlProCardRoots=new Set;const t=document.getElementById.bind(document),e=document.querySelector.bind(document),s=document.querySelectorAll.bind(document);document.getElementById=function(e){for(const t of window._htmlProCardRoots){const s=t.querySelector("#"+e);if(s)return s}return t(e)},document.querySelector=function(t){for(const e of window._htmlProCardRoots){const s=e.querySelector(t);if(s)return s}return e(t)},document.querySelectorAll=function(t){const e=[];for(const s of window._htmlProCardRoots)e.push(...s.querySelectorAll(t));return e.length>0?e:s(t)}}const _pceLoaded={promise:null};function _loadPrismEditor(){return _pceLoaded.promise||(_pceLoaded.promise=new Promise(t=>{if(window.prismCodeEditor)return void t(window.prismCodeEditor);const e=document.createElement("script");e.type="module",e.textContent="\n      import { fullEditor, updateTheme } from 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/setups/index.js';\n      import 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/prism/languages/markup.js';\n      import 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/prism/languages/css.js';\n      import 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/prism/languages/javascript.js';\n      window.prismCodeEditor = { fullEditor, updateTheme };\n      window.dispatchEvent(new Event('pce-ready'));\n    ",document.head.appendChild(e),window.addEventListener("pce-ready",()=>t(window.prismCodeEditor),{once:!0})})),_pceLoaded.promise}customElements.get("ha-htmlcard-textarea")||customElements.define("ha-htmlcard-textarea",class extends HTMLElement{constructor(){super(),this._value="",this._editorReady=!1,this._pendingValue=null}connectedCallback(){this._initialized||(this._initialized=!0,this.innerHTML="\n        <style>\n          .pce-container {\n            border: 1px solid var(--divider-color, #e0e0e0);\n            border-radius: 8px;\n            overflow: hidden;\n          }\n          .pce-container .prism-code-editor {\n            height: 400px !important;\n            min-height: 400px !important;\n            font-size: 13px !important;\n          }\n          .pce-fallback {\n            width: 100%;\n            height: 400px;\n            padding: 12px;\n            border: none;\n            background: var(--card-background-color, #fff);\n            color: var(--primary-text-color, #333);\n            font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;\n            font-size: 13px;\n            resize: vertical;\n            box-sizing: border-box;\n          }\n        </style>\n        <div class=\"pce-container\">\n          <textarea class=\"pce-fallback\" spellcheck=\"false\"></textarea>\n        </div>\n      ",this._container=this.querySelector(".pce-container"),this._fallback=this.querySelector(".pce-fallback"),this._fallback.value=this._value,this._fallback.addEventListener("input",()=>{this._value=this._fallback.value,this.dispatchEvent(new CustomEvent("change",{detail:{value:this._value},bubbles:!0,composed:!0}))}),this._initEditor())}async _initEditor(){try{const t=await _loadPrismEditor();this._fallback.style.display="none";const e=null!==this._pendingValue?this._pendingValue:this._value,s=document.querySelector("home-assistant")?.hass?.themes,o=s?.darkMode||document.body.getAttribute("data-theme")?.includes("dark")||getComputedStyle(document.body).getPropertyValue("--primary-background-color")?.trim()?.match(/^#[0-3]/)||window.matchMedia("(prefers-color-scheme: dark)").matches?"vs-code-dark":"vs-code-light";this._editor=t.fullEditor(this._container,{language:"html",theme:o,value:e,lineNumbers:!0,wordWrap:!1,tabSize:2},()=>{this._editorReady=!0,this._value=e;const t=this._editor.scrollContainer.parentNode;if(t instanceof ShadowRoot){const e=document.createElement("style");e.textContent=".prism-code-editor { height: 400px !important; font-size: 13px !important; }",t.appendChild(e)}this._editor.addListener("update",t=>{this._value=t,this.dispatchEvent(new CustomEvent("change",{detail:{value:this._value},bubbles:!0,composed:!0}))})})}catch(t){this._fallback.style.display="block"}}set value(t){const e=t||"";this._editorReady&&this._editor?this._editor.value!==e&&(this._editor.setOptions({value:e}),this._value=e):(this._pendingValue=e,this._value=e,this._fallback&&(this._fallback.value=e))}get value(){return this._value}}),customElements.get("ha-htmlcard-textfield")||customElements.define("ha-htmlcard-textfield",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n        <style>\n          :host {\n            display: block;\n          }\n          input {\n            width: 100%;\n            padding: 8px;\n            border: 1px solid var(--divider-color, #e0e0e0);\n            border-radius: 4px;\n            background: var(--card-background-color, #fff);\n            color: var(--primary-text-color, #000);\n          }\n        </style>\n        <input type="text" />\n      ',this._input=this.shadowRoot.querySelector("input"),this._input.addEventListener("input",()=>{this.dispatchEvent(new CustomEvent("change",{detail:{value:this._input.value},bubbles:!0,composed:!0}))})}set value(t){this._input.value=t}get value(){return this._input.value}set type(t){this._input.type=t}}),customElements.get("ha-htmlcard-switch")||customElements.define("ha-htmlcard-switch",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n        <style>\n          :host {\n            display: inline-block;\n          }\n          label {\n            position: relative;\n            display: inline-block;\n            width: 40px;\n            height: 24px;\n          }\n          input {\n            opacity: 0;\n            width: 0;\n            height: 0;\n          }\n          span {\n            position: absolute;\n            cursor: pointer;\n            top: 0;\n            left: 0;\n            right: 0;\n            bottom: 0;\n            background-color: #ccc;\n            transition: .4s;\n            border-radius: 24px;\n          }\n          span:before {\n            position: absolute;\n            content: "";\n            height: 16px;\n            width: 16px;\n            left: 4px;\n            bottom: 4px;\n            background-color: white;\n            transition: .4s;\n            border-radius: 50%;\n          }\n          input:checked + span {\n            background-color: var(--primary-color, #03a9f4);\n          }\n          input:checked + span:before {\n            transform: translateX(16px);\n          }\n        </style>\n        <label>\n          <input type="checkbox" />\n          <span></span>\n        </label>\n      ',this._input=this.shadowRoot.querySelector("input"),this._input.addEventListener("change",()=>{this.dispatchEvent(new CustomEvent("change",{detail:{checked:this._input.checked},bubbles:!0,composed:!0}))})}set checked(t){this._input.checked=t}get checked(){return this._input.checked}}),customElements.get("ha-htmlcard-formfield")||customElements.define("ha-htmlcard-formfield",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n        <style>\n          :host {\n            display: flex;\n            align-items: center;\n            padding: 4px 0;\n          }\n          label {\n            padding-left: 8px;\n            color: var(--primary-text-color, #000);\n          }\n        </style>\n        <slot></slot>\n        <label><slot name="label"></slot></label>\n      '}});const I18N={zh:{htmlContent:"HTML 内容",options:"选项设置",scripts:"外部脚本",store:"模块商店",disableParse:"纯HTML模式",disableParseDesc:"默认关闭(使用Jinja2)，开启后直接渲染HTML",updateInterval:"更新间隔 (ms)",updateIntervalDesc:"0 为禁用自动更新",ignoreLineBreaks:"忽略换行",ignoreLineBreaksDesc:"忽略HTML中的换行符",addScript:"添加",scriptPlaceholder:"输入脚本 URL",searchPlaceholder:"搜索模块...",import:"导入",delete:"删除",loading:"加载中...",noModules:"暂无模块",noCustomModules:"暂无自定义模块",confirmDelete:"确定删除此模块?",customModule:"自定义模块",headerDesc:"高级 HTML 卡片编辑器，支持 Jinja2 模板语法",headerDesc2:"可使用 Home Assistant 状态、属性和服务调用",realtime:"实时更新",extScripts:"外部脚本",customStyle:"自定义样式",yamlHint:"支持直接粘贴完整YAML配置"},en:{htmlContent:"HTML Content",options:"Options",scripts:"External Scripts",store:"Module Store",disableParse:"Pure HTML Mode",disableParseDesc:"Off by default (uses Jinja2), enable to render HTML directly",updateInterval:"Update Interval (ms)",updateIntervalDesc:"0 to disable auto update",ignoreLineBreaks:"Ignore Line Breaks",ignoreLineBreaksDesc:"Ignore line breaks in HTML",addScript:"Add",scriptPlaceholder:"Enter script URL",searchPlaceholder:"Search modules...",import:"Import",delete:"Delete",loading:"Loading...",noModules:"No modules",noCustomModules:"No custom modules",confirmDelete:"Delete this module?",customModule:"Custom Module",headerDesc:"Advanced HTML card editor with Jinja2 template",headerDesc2:"Use Home Assistant states, attributes and services",realtime:"Realtime",extScripts:"Scripts",customStyle:"Custom CSS",yamlHint:"Paste full YAML config directly"}};class HtmlTemplateCardEditor extends LitElement{static get properties(){return{_config:{type:Object},hass:{type:Object},_showStore:{type:Boolean},_showHtml:{type:Boolean},_showOptions:{type:Boolean},_showScripts:{type:Boolean},_storeModules:{type:Array},_savedModules:{type:Array},_storeLoading:{type:Boolean},_storeSearch:{type:String}}}get _lang(){return this.hass?.language?.startsWith("zh")?"zh":"en"}_t(t){return I18N[this._lang]?.[t]||I18N.en[t]||t}constructor(){super(),this._showStore=!1,this._showHtml=!0,this._showOptions=!1,this._showScripts=!1,this._storeModules=[],this._savedModules=this._loadSavedModules(),this._storeLoading=!1,this._storeSearch=""}_loadSavedModules(){try{const t=localStorage.getItem("html-pro-card-modules");return t?JSON.parse(t):[]}catch{return[]}}_saveSavedModules(){localStorage.setItem("html-pro-card-modules",JSON.stringify(this._savedModules))}setConfig(t){this._config=t}render(){return this._config?html`
      <style>
        .card-config {
          padding: 16px;
        }
        .collapse-panel {
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 8px;
          margin-bottom: 12px;
          overflow: hidden;
          background: var(--card-background-color, #fff);
        }
        .collapse-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          background: transparent;
          user-select: none;
        }
        .collapse-header:hover {
          background: rgba(0,0,0,0.02);
        }
        .collapse-header.expanded {
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }
        .collapse-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .collapse-icon {
          width: 20px;
          height: 20px;
          color: var(--primary-text-color, #333);
          flex-shrink: 0;
        }
        .collapse-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .collapse-arrow {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--divider-color, #ddd);
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .collapse-arrow.expanded {
          background: var(--primary-color, #03a9f4);
        }
        .collapse-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.25s ease;
        }
        .collapse-body.expanded {
          max-height: 600px;
        }
        .collapse-content {
          padding: 16px 18px 18px;
        }
        .editor-control {
          width: 100%;
        }
        .option-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }
        .option-row:last-child {
          border-bottom: none;
        }
        .option-label {
          font-size: 13px;
          color: var(--primary-text-color);
        }
        .option-desc {
          font-size: 11px;
          color: var(--secondary-text-color);
          margin-top: 2px;
        }
        .interval-input {
          width: 80px;
          margin-right: 20px;
        }
        .script-input-container {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 12px;
        }
        .script-input-container input {
          flex: 1;
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 6px;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color, #333);
          outline: none;
          box-sizing: border-box;
        }
        .script-input-container input:focus {
          border-color: var(--primary-color, #03a9f4);
        }
        .script-input-container button {
          padding: 6px 14px;
          font-size: 12px;
          border: none;
          border-radius: 6px;
          background: var(--primary-color, #03a9f4);
          color: #fff;
          cursor: pointer;
          white-space: nowrap;
        }
        .script-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .script-item input {
          flex: 1;
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 6px;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color, #333);
          outline: none;
          box-sizing: border-box;
        }
        .script-item input:focus {
          border-color: var(--primary-color, #03a9f4);
        }
        .store-search {
          margin-bottom: 12px;
        }
        .store-search input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 6px;
          font-size: 13px;
          box-sizing: border-box;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color);
        }
        .store-search input:focus {
          outline: none;
          border-color: var(--primary-color, #03a9f4);
        }
        .store-list {
          max-height: 320px;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .store-list::-webkit-scrollbar {
          display: none;
        }
        .store-item {
          display: flex;
          align-items: center;
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid var(--divider-color);
          margin-bottom: 6px;
        }
        .store-item:last-child {
          margin-bottom: 0;
        }
        .store-item-info {
          flex: 1;
          min-width: 0;
        }
        .store-item-info h4 {
          margin: 0;
          font-size: 12px;
          font-weight: 500;
          color: var(--primary-text-color);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .store-item-info p {
          margin: 2px 0 0;
          font-size: 10px;
          color: var(--secondary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .store-item-author {
          font-size: 9px;
          opacity: 0.5;
        }
        .store-item-btn {
          padding: 4px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          background: var(--primary-color);
          color: #fff;
          flex-shrink: 0;
          margin-left: 10px;
        }
        .store-item-btn:hover {
          opacity: 0.85;
        }
        .store-loading {
          text-align: center;
          padding: 24px;
          color: var(--secondary-text-color);
          font-size: 13px;
        }
        .header-section {
          margin-bottom: 20px;
          padding: 20px;
          text-align: center;
          position: relative;
        }
        .panels-wrapper {
          background: rgba(0,0,0,0.02);
          border-radius: 12px;
          padding: 12px;
        }
        .header-version {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 10px;
          padding: 3px 8px;
          background: var(--primary-color, #03a9f4);
          color: #fff;
          border-radius: 10px;
          font-weight: 600;
        }
        .header-logo {
          width: 48px;
          height: 48px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-logo svg {
          width: 48px;
          height: 48px;
          color: var(--primary-color, #03a9f4);
        }
        .header-desc {
          font-size: 13px;
          color: var(--secondary-text-color);
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .header-features {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .header-feature {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--primary-text-color);
        }
        .header-feature svg {
          width: 14px;
          height: 14px;
          color: var(--primary-color, #03a9f4);
        }
      </style>

      <div class="card-config">
        <div class="panels-wrapper">
        <!-- Header -->
        <div class="header-section">
          <a href="https://github.com/knoop7/html-card-pro" target="_blank" class="header-version" style="text-decoration:none;color:#fff;">v${"3.5"}</a>
          <div class="header-logo">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2V3H12V9H11V10H9V11H8V12H7V13H5V12H4V11H3V9H2V15H3V16H4V17H5V18H6V22H8V21H7V20H8V19H9V18H10V19H11V22H13V21H12V17H13V16H14V15H15V12H16V13H17V11H15V9H20V8H17V7H22V3H21V2M14 3H15V4H14Z"/></svg>
          </div>
          <div class="header-desc">
            ${this._t("headerDesc")}<br>
            ${this._t("headerDesc2")}
          </div>
          <div class="header-features">
            <div class="header-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
              ${this._t("realtime")}
            </div>
            <div class="header-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              ${this._t("extScripts")}
            </div>
            <div class="header-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              ${this._t("customStyle")}
            </div>
          </div>
        </div>
        <!-- HTML 内容 -->
        <div class="collapse-panel">
          <div class="collapse-header ${this._showHtml?"expanded":""}" @click="${()=>{this._showHtml=!this._showHtml,this.requestUpdate()}}">
            <div class="collapse-header-left">
              <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <span class="collapse-title">${this._t("htmlContent")}</span>
            </div>
            <span class="collapse-arrow ${this._showHtml?"expanded":""}"></span>
          </div>
          <div class="collapse-body ${this._showHtml?"expanded":""}">
            <div class="collapse-content">
              <div style="font-size:11px;color:#999;margin:-8px 0 8px;text-align:center;">${this._t("yamlHint")}</div>
              <ha-htmlcard-textarea
                class="editor-control"
                .value="${this._config.content||""}"
                @change="${this._handleContentChange}"
              ></ha-htmlcard-textarea>
            </div>
          </div>
        </div>

        <!-- 选项设置 -->
        <div class="collapse-panel">
          <div class="collapse-header ${this._showOptions?"expanded":""}" @click="${()=>{this._showOptions=!this._showOptions,this.requestUpdate()}}">
            <div class="collapse-header-left">
              <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span class="collapse-title">${this._t("options")}</span>
            </div>
            <span class="collapse-arrow ${this._showOptions?"expanded":""}"></span>
          </div>
          <div class="collapse-body ${this._showOptions?"expanded":""}">
            <div class="collapse-content">
              <div class="option-row">
                <div>
                  <div class="option-label">${this._t("disableParse")}</div>
                  <div class="option-desc">${this._t("disableParseDesc")}</div>
                </div>
                <ha-htmlcard-switch
                  .checked="${this._config.do_not_parse||!1}"
                  @change="${this._handleParseChange}"
                ></ha-htmlcard-switch>
              </div>
              <div class="option-row">
                <div>
                  <div class="option-label">${this._t("ignoreLineBreaks")}</div>
                  <div class="option-desc">${this._t("ignoreLineBreaksDesc")}</div>
                </div>
                <ha-htmlcard-switch
                  .checked="${this._config.ignore_line_breaks||!1}"
                  @change="${this._handleLineBreaksChange}"
                ></ha-htmlcard-switch>
              </div>
              <div class="option-row">
                <div>
                  <div class="option-label">${this._t("updateInterval")}</div>
                  <div class="option-desc">${this._t("updateIntervalDesc")}</div>
                </div>
                <ha-htmlcard-textfield
                  type="number"
                  class="interval-input"
                  .value="${this._config.update_interval||0}"
                  @change="${this._handleIntervalChange}"
                ></ha-htmlcard-textfield>
              </div>
            </div>
          </div>
        </div>

        <!-- 外部脚本 -->
        <div class="collapse-panel">
          <div class="collapse-header ${this._showScripts?"expanded":""}" @click="${()=>{this._showScripts=!this._showScripts,this.requestUpdate()}}">
            <div class="collapse-header-left">
              <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span class="collapse-title">${this._t("scripts")}</span>
            </div>
            <span class="collapse-arrow ${this._showScripts?"expanded":""}"></span>
          </div>
          <div class="collapse-body ${this._showScripts?"expanded":""}">
            <div class="collapse-content">
              <div class="script-input-container">
                <input
                  type="url"
                  placeholder="${this._t("scriptPlaceholder")}"
                  .value="${this._newScriptUrl||""}"
                  @change="${t=>this._newScriptUrl=t.target.value}"
                />
                <button @click="${this._addScript}">${this._t("addScript")}</button>
              </div>
              ${(this._config.scripts||[]).map((t,e)=>html`
                <div class="script-item">
                  <input
                    type="url"
                    .value="${t}"
                    @change="${t=>this._updateScript(e,t.target.value)}"
                  />
                  <button style="padding:4px 8px;border:none;border-radius:4px;background:var(--error-color,#e53935);color:#fff;cursor:pointer;font-size:12px;" @click="${()=>this._removeScript(e)}">✕</button>
                </div>
              `)}
            </div>
          </div>
        </div>

        <!-- 模块商店 -->
        <div class="collapse-panel">
          <div class="collapse-header ${this._showStore?"expanded":""}" @click="${this._toggleStore}">
            <div class="collapse-header-left">
              <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <span class="collapse-title">${this._t("store")}</span>
            </div>
            <span class="collapse-arrow ${this._showStore?"expanded":""}"></span>
          </div>
          <div class="collapse-body ${this._showStore?"expanded":""}">
            <div class="collapse-content">
              <div class="store-search">
                <input type="text" placeholder="${this._t("searchPlaceholder")}" .value="${this._storeSearch}" @input="${t=>{this._storeSearch=t.target.value,this.requestUpdate()}}">
              </div>
              <div class="store-list">
                ${this._storeLoading?html`<div class="store-loading">${this._t("loading")}</div>`:this._renderOnlineModules()}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    `:html``}_handleContentChange(t){if(!this._config)return;let e,s=t.detail.value||"";if(s=this._normalizeRadius(s),s.trim().startsWith("type:")&&s.includes("content:")){const t=this._parseYaml(s);e=void 0!==t.content?{...this._config,content:this._normalizeRadius(t.content||""),do_not_parse:void 0!==t.do_not_parse?t.do_not_parse:this._config.do_not_parse,update_interval:void 0!==t.update_interval?t.update_interval:this._config.update_interval,ignore_line_breaks:void 0!==t.ignore_line_breaks?t.ignore_line_breaks:this._config.ignore_line_breaks,scripts:t.scripts||this._config.scripts}:{...this._config,content:s}}else e={...this._config,content:s};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_normalizeRadius(t){return t.replace(/border-radius\s*:\s*\d+(\.\d+)?(px|em|rem|%)?/gi,"border-radius: 10px")}_handleParseChange(t){this._valueChanged("do_not_parse",t.target.checked)}_handleLineBreaksChange(t){this._valueChanged("ignore_line_breaks",t.target.checked)}_handleIntervalChange(t){const e=parseInt(t.target.value)||0;this._valueChanged("update_interval",e)}_valueChanged(t,e){if(!this._config)return;const s={...this._config,[t]:e};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}_addScript(){if(!this._newScriptUrl)return;const t=[...this._config.scripts||[],this._newScriptUrl];this._valueChanged("scripts",t),this._newScriptUrl="",this.requestUpdate()}_updateScript(t,e){const s=[...this._config.scripts||[]];s[t]=e,this._valueChanged("scripts",s)}_removeScript(t){const e=[...this._config.scripts||[]];e.splice(t,1),this._valueChanged("scripts",e)}_toggleStore(){this._showStore=!this._showStore,this._showStore&&0===this._storeModules.length&&this._loadOnlineModules(),this.requestUpdate()}_switchTab(t){this._storeTab=t,"online"===t&&0===this._storeModules.length&&this._loadOnlineModules(),this.requestUpdate()}_parseYaml(t){const e=t.split("\n"),s={};let o=null,i=[],r=!1,n=!1,a=[];for(const t of e){if(r&&(t.startsWith("  ")||""===t.trim()?i.push(t.slice(2)||""):(s[o]=i.join("\n").trim(),r=!1,i=[])),n){const e=t.match(/^\s+-\s+(.+)$/);if(e){a.push(e[1].trim());continue}t.trim()&&!t.startsWith(" ")&&(s[o]=a,n=!1,a=[])}if(!r&&!n){const e=t.match(/^(\w+):\s*(.*)$/);if(e){o=e[1];const t=e[2];"|"===t?(r=!0,i=[]):""===t||""===t.trim()?(n=!0,a=[]):"scripts"===o&&t.trim()?s[o]=[t.trim()]:s[o]=t.replace(/^["']|["']$/g,"")}}}return r&&o&&(s[o]=i.join("\n").trim()),n&&o&&a.length>0&&(s[o]=a),s}async _loadOnlineModules(){this._storeLoading=!0,this.requestUpdate();const t="https://raw.githubusercontent.com/knoop7/html-card-pro/main";try{const e=await fetch(`${t}/modules.txt`);if(e.ok){const s=(await e.text()).trim().split("\n").filter(t=>t.trim()),o=await Promise.all(s.map(async e=>{try{const s=await fetch(`${t}/modules/${e}`);if(s.ok){const o=(await s.text()).split(/^---$/m),i=this._parseYaml(o[0]||"");return{id:i.id||e.replace(".yaml",""),name:i.name||e.replace(".yaml",""),desc:i.desc||"",author:i.author||"knoop7",_file:`modules/${e}`,_baseUrl:t}}}catch{}return null}));this._storeModules=o.filter(t=>null!==t)}else this._storeModules=this._getBuiltinModules()}catch{this._storeModules=this._getBuiltinModules()}this._storeLoading=!1,this.requestUpdate()}_getBuiltinModules(){return[]}_renderOnlineModules(){const t=this._storeModules.filter(t=>!this._storeSearch||t.name.toLowerCase().includes(this._storeSearch.toLowerCase())||t.desc.toLowerCase().includes(this._storeSearch.toLowerCase()));return 0===t.length?html`<div class="store-loading">${this._t("noModules")}</div>`:t.map(t=>html`
      <div class="store-item">
        <div class="store-item-info">
          <h4>${t.name}${t.author?html`<span class="store-item-author">by ${t.author}</span>`:""}</h4>
          <p>${t.desc}</p>
        </div>
        <button class="store-item-btn" @click="${()=>this._importModule(t)}">${this._t("import")}</button>
      </div>
    `)}_renderSavedModules(){const t=this._savedModules.filter(t=>!this._storeSearch||t.name.toLowerCase().includes(this._storeSearch.toLowerCase()));return 0===t.length?html`<div class="store-loading">${this._t("noCustomModules")}</div>`:t.map((t,e)=>html`
      <div class="store-item">
        <div class="store-item-info">
          <h4>${t.name}</h4>
          <p>${t.desc||this._t("customModule")}</p>
        </div>
        <div class="store-item-actions">
          <button class="store-item-btn import" @click="${()=>this._importModule(t)}">${this._t("import")}</button>
          <button class="store-item-btn delete" @click="${()=>this._deleteModule(e)}">${this._t("delete")}</button>
        </div>
      </div>
    `)}async _importModule(t){if(!this._config)return;let e={content:t.content||""};if(t._file&&t._baseUrl)try{const s=await fetch(`${t._baseUrl}/${t._file}`);if(s.ok){const t=await s.text(),o=t.split(/^---$/m),i=o.length>1?o[1].trim():t,r=this._parseYaml(i);e={content:r.content||"",do_not_parse:r.do_not_parse,update_interval:r.update_interval,ignore_line_breaks:r.ignore_line_breaks,scripts:r.scripts}}}catch(t){return void console.error("Failed to load module:",t)}const s={...this._config,content:e.content,do_not_parse:void 0!==e.do_not_parse?e.do_not_parse:e.content.includes("<script>"),update_interval:void 0!==e.update_interval?e.update_interval:this._config.update_interval,ignore_line_breaks:void 0===e.ignore_line_breaks||e.ignore_line_breaks,scripts:e.scripts||this._config.scripts};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0})),this.requestUpdate()}_deleteModule(t){confirm(this._t("confirmDelete"))&&(this._savedModules=this._savedModules.filter((e,s)=>s!==t),this._saveSavedModules(),this.requestUpdate())}}customElements.define("html-pro-card-editor",HtmlTemplateCardEditor);class HtmlTemplateCard extends HTMLElement{static get properties(){return{hass:{type:Object},_config:{type:Object}}}static async getConfigElement(){return document.createElement("html-pro-card-editor")}static preProcessScripts(t){return"string"==typeof t.scripts&&(t.scripts=t.scripts.split("\n").filter(t=>""!==t.trim())),t}static getStubConfig(){return{content:'<style>\n.pro{padding:20px}\n.pro-h{display:flex;align-items:center;gap:16px;margin-bottom:12px}\n.pro-icon{width:36px;height:36px;color:var(--primary-color)}\n.pro-t{font-size:16px;font-weight:600;color:var(--primary-text-color)}\n.pro-sub{font-size:13px;color:var(--secondary-text-color);opacity:0.7}\n.pro-c{font-size:12px;color:var(--secondary-text-color);line-height:1.6}\n</style>\n<div class="pro">\n<div class="pro-h">\n<svg class="pro-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2V3H12V9H11V10H9V11H8V12H7V13H5V12H4V11H3V9H2V15H3V16H4V17H5V18H6V22H8V21H7V20H8V19H9V18H10V19H11V22H13V21H12V17H13V16H14V15H15V12H16V13H17V11H15V9H20V8H17V7H22V3H21V2M14 3H15V4H14Z"/></svg>\n<div><span class="pro-t">Html Pro Card</span><div class="pro-sub" id="pro-sub"></div></div>\n</div>\n<div class="pro-c" id="pro-desc"></div>\n</div>\n<script>\nvar isZh = (navigator.language || \'\').startsWith(\'zh\') || (document.documentElement.lang || \'\').startsWith(\'zh\');\nvar desc = isZh ? \'是一款专为 Home Assistant 设计的高级 HTML 卡片组件。它支持完整的 Jinja2 模板语法，让您可以动态获取任意实体的状态、属性和历史数据。通过内置的服务调用接口，您可以直接在卡片中控制灯光、开关、空调等设备。卡片支持自定义 CSS 样式和外部 JavaScript 脚本，让您能够创建独一无二的交互式仪表盘。\' : \'is an advanced HTML card component designed for Home Assistant. It supports full Jinja2 template syntax, allowing you to dynamically access any entity state, attributes and history. With built-in service calls, you can control lights, switches, climate devices directly. Custom CSS and external JS scripts enable unique interactive dashboards.\';\n$(\'#pro-sub\').textContent = \'By knoop7\';\n$(\'#pro-desc\').textContent = desc;\n<\/script>',update_interval:1e4,do_not_parse:!1,ignore_line_breaks:!0,scripts:[]}}connectedCallback(){this._instanceId||(this._instanceId="hpc_"+Math.random().toString(36).slice(2,9)),this._createRootElement(),this._setupEventListeners(),this._config&&this._hass&&this._processAndRender()}disconnectedCallback(){if(this._timeUpdateInterval&&(clearInterval(this._timeUpdateInterval),this._timeUpdateInterval=null),this._removeEventListeners(),this._templateSubscription){try{this._templateSubscription()}catch{}this._templateSubscription=null}const t=window._htmlProCardOverlay;t&&this._instanceId&&t.querySelectorAll(`[data-hpc-owner="${this._instanceId}"]`).forEach(t=>t.remove())}_createRootElement(){this._rootElement&&this.contains(this._rootElement)||(this._rootElement=document.createElement("ha-card"),this._rootElement.style.borderRadius="10px",this._rootElement.style.overflow="hidden",this.appendChild(this._rootElement))}_setupEventListeners(){this._rootElement&&(this._boundHandlers||(this._boundHandlers={touchStart:this._handleTouchStart.bind(this),touchEnd:this._handleTouchEnd.bind(this),mouseDown:this._handleMouseDown.bind(this),mouseUp:this._handleMouseUp.bind(this),click:this._handleClick.bind(this)},this._rootElement.addEventListener("touchstart",this._boundHandlers.touchStart,{passive:!0}),this._rootElement.addEventListener("touchend",this._boundHandlers.touchEnd),this._rootElement.addEventListener("touchcancel",this._boundHandlers.touchEnd),this._rootElement.addEventListener("mousedown",this._boundHandlers.mouseDown),this._rootElement.addEventListener("mouseup",this._boundHandlers.mouseUp),this._rootElement.addEventListener("click",this._boundHandlers.click)))}_removeEventListeners(){this._rootElement&&this._boundHandlers&&(this._rootElement.removeEventListener("touchstart",this._boundHandlers.touchStart),this._rootElement.removeEventListener("touchend",this._boundHandlers.touchEnd),this._rootElement.removeEventListener("touchcancel",this._boundHandlers.touchEnd),this._rootElement.removeEventListener("mousedown",this._boundHandlers.mouseDown),this._rootElement.removeEventListener("mouseup",this._boundHandlers.mouseUp),this._rootElement.removeEventListener("click",this._boundHandlers.click),this._boundHandlers=null)}_handleTouchStart(t){const e=t.target.closest("[data-long-press]");if(!e)return;const s=e.dataset.entity;s&&(this._longPressTimeout=setTimeout(()=>{this._showMoreInfo(s),this._longPressTimeout=null},500))}_handleTouchEnd(){this._longPressTimeout&&(clearTimeout(this._longPressTimeout),this._longPressTimeout=null)}_handleMouseDown(t){const e=t.target.closest("[data-long-press]");if(!e)return;const s=e.dataset.entity;s&&(this._longPressTimeout=setTimeout(()=>{this._showMoreInfo(s),this._longPressTimeout=null},500))}_handleMouseUp(){this._longPressTimeout&&(clearTimeout(this._longPressTimeout),this._longPressTimeout=null)}_handleClick(t){if(this._longPressTimeout)return clearTimeout(this._longPressTimeout),void(this._longPressTimeout=null);const e=t.target.closest("[data-action]");if(e){const t=e.dataset.entity||e.closest("[data-entity]")?.dataset.entity,s=e.dataset.action;if(!t||!s)return;if("toggle"===s)this._callService(t,"toggle");else if("turn_on"===s)this._callService(t,"turn_on");else if("turn_off"===s)this._callService(t,"turn_off");else if("more-info"===s)this._showMoreInfo(t);else{const[e]=t.split(".");this._hass?.callService(e,s,{entity_id:t})}return}}_showMoreInfo(t){if(!t)return;const e=new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0});this.dispatchEvent(e)}_toggle(t){if(!t||!this._hass?.states[t])return;const e=t.split(".")[0];["light","switch","fan","input_boolean","automation","script","cover","lock","media_player"].includes(e)?this._hass.callService(e,"toggle",{entity_id:t}):this._showMoreInfo(t)}set hass(t){const e=this._hass;if(this._hass=t,this._rootElement&&(this._rootElement.hass=t),!this._config)return;this._entities||this._calculateEntities();if(this._shouldUpdate(e)&&(this._config.do_not_parse?this._updateStates():this._processAndRender(),this._rootElement&&"function"==typeof this._rootElement._onHassUpdate))try{this._rootElement._onHassUpdate(t)}catch{}}_setupTimeUpdate(){if(this._timeUpdateInterval&&clearInterval(this._timeUpdateInterval),this._config.update_interval&&this._config.update_interval>0){const t=Math.max(this._config.update_interval,1e3);this._timeUpdateInterval=setInterval(()=>{this._config.do_not_parse?this._updateStates():this._processAndRender()},t)}}_processAndRender(){this._rootElement&&this._config&&this._hass&&(this._renderDebounce&&clearTimeout(this._renderDebounce),this._renderDebounce=setTimeout(()=>{try{this._renderContent()}catch{this._renderFallback()}},50))}_renderContent(){let t=this._config.content||"";if(this._config.ignore_line_breaks||(t=t.replace(/\r?\n|\r/g,"")),this._config.do_not_parse)this._render(t);else{if(this._templateSubscription){try{this._templateSubscription()}catch{}this._templateSubscription=null}try{this._hass.connection.subscribeMessage(t=>{try{this._render(t.result)}catch(t){this._renderError("Render error: "+(t.message||t))}},{type:"render_template",template:t}).then(t=>{this._templateSubscription=t}).catch(t=>{this._renderError("Template error: "+(t.message||t))})}catch(t){this._renderError("Template error: "+(t.message||t))}}}async _loadExternalScripts(t){const e=t.map(t=>this._loadScript(t));return Promise.all(e)}async _loadScript(t){_globalLoadedScripts.has(t)||(_globalLoadedScripts.add(t),await new Promise((e,s)=>{const o=document.createElement("script");o.async=!0,o.src=t,o.onload=e,o.onerror=()=>{_globalLoadedScripts.delete(t),s(new Error("Failed: "+t))},document.body.appendChild(o)}))}_render(t){if(this._rootElement&&this._hass&&(this._lastContent!==t||!this._rendered)){this._lastContent=t;try{if(window.hassTemplateCard={hass:this._hass,config:this._config,root:this._rootElement},window._htmlProCardRoots.add(this._rootElement),this._rootElement.innerHTML=t,this._setupClickHandlers(this._rootElement),!this._rendered){this._rendered=!0;this._config.scripts&&Array.isArray(this._config.scripts)&&this._config.scripts.length>0?this._loadExternalScripts(this._config.scripts).then(()=>{setTimeout(()=>this._executeInlineScripts(),200)}).catch(()=>{setTimeout(()=>this._executeInlineScripts(),200)}):setTimeout(()=>this._executeInlineScripts(),0)}this._validateRendered(),this.dispatchEvent(new CustomEvent("content-rendered",{bubbles:!0,composed:!0,detail:{hass:this._hass,config:this._config}}))}catch(t){this._renderError("Render error: "+(t.message||t))}}}_isEditorPreview(){try{let t=this.parentElement;for(let e=0;e<5&&t;e++){if("hui-card"===t.localName&&t.hasAttribute("preview"))return!0;if("hui-card-preview"===t.localName)return!0;t=t.parentElement||t.getRootNode()?.host}}catch{}return!1}_renderError(t){this._rootElement&&this._isEditorPreview()&&(this._rootElement.innerHTML="",this._clearErrorBanners(),this.appendChild(this._createErrorCard(t,"error")),console.error("[html-pro-card]",t))}_validateRendered(){if(!this._rootElement||!this._hass||!this._entities)return;if(!this._isEditorPreview())return;this._clearErrorBanners();const t=[];for(const e of this._entities)this._hass.states[e]||t.push(e);0!==t.length&&this.appendChild(this._createErrorCard("Entity not found: "+t.join(", "),"warning"))}_clearErrorBanners(){this.querySelectorAll(":scope > .hpc-error-banner").forEach(t=>t.remove())}_createErrorCard(t,e){const s=document.createElement("div");s.className="hpc-error-banner",s.dataset.severity=e||"error";const o="warning"===e,i=o?"var(--warning-color,#ffa726)":"var(--error-color,#db4437)",r=o?'<path d="M1,21H23L12,2Zm12-3H11V16h2Zm0-4H11V10h2Z"/>':'<path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"/>';return s.style.cssText="position:relative;border-radius:var(--ha-card-border-radius,12px);overflow:hidden;margin:4px 0;",s.innerHTML='<div style="position:absolute;inset:0;background:'+i+';opacity:0.12;pointer-events:none;border-radius:inherit"></div><div style="display:flex;align-items:center;gap:8px;padding:12px 16px;position:relative"><svg viewBox="0 0 24 24" style="width:24px;height:24px;flex-shrink:0;fill:'+i+'">'+r+'</svg><span style="font-size:13px;font-weight:500;color:var(--primary-text-color,#212121);overflow:hidden;text-overflow:ellipsis;word-break:break-word;line-height:1.4">'+t.replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</span></div>",s}_executeInlineScripts(){if(!this._rootElement)return;const t=Array.from(this._rootElement.querySelectorAll("script")),e=this._rootElement,s=this,o=window._htmlProCardOverlay,i=s._instanceId,r=new Proxy(o,{get(t,e){if("appendChild"===e||"append"===e||"prepend"===e)return(...s)=>(s.forEach(t=>{t?.setAttribute&&t.setAttribute("data-hpc-owner",i)}),t[e](...s));const s=t[e];return"function"==typeof s?s.bind(t):s}});t.forEach(t=>{if(t.src){const e=document.createElement("script");return e.src=t.src,void document.body.appendChild(e)}const o=t.textContent.trim();o&&setTimeout(()=>{try{const t=new Function("root","card","$","$$","hass","config","overlay",o),i=new Proxy({},{get:(t,e)=>s._hass[e]});t(e,e,t=>e.querySelector(t),t=>e.querySelectorAll(t),i,s._config,r)}catch(t){console.error("[html-pro-card] script error:",t)}},100)})}_setupClickHandlers(t){const e=this;t.querySelectorAll("[data-entity]").forEach(t=>{const s=t.dataset.entity,[o]=s.split(".");t.querySelectorAll("[data-action]").forEach(t=>{t.onclick=i=>{i.stopPropagation();const r=t.dataset.action;"toggle"===r?e._callService(s,"toggle"):"turn_on"===r?e._callService(s,"turn_on"):"turn_off"===r?e._callService(s,"turn_off"):"more-info"===r?e._showMoreInfo(s):e._hass.callService(o,r,{entity_id:s})}}),t.querySelectorAll('input[type="range"]').forEach(t=>{t.oninput=t=>t.stopPropagation(),t.onchange=o=>{o.stopPropagation();const i=parseFloat(o.target.value);void 0!==t.dataset.brightness?e._hass.callService("light","turn_on",{entity_id:s,brightness:Math.round(255*i/100)}):void 0!==t.dataset.temperature?e._hass.callService("climate","set_temperature",{entity_id:s,temperature:i}):void 0!==t.dataset.volume?e._hass.callService("media_player","volume_set",{entity_id:s,volume_level:i/100}):void 0!==t.dataset.position?e._hass.callService("cover","set_cover_position",{entity_id:s,position:i}):void 0!==t.dataset.speed&&e._hass.callService("fan","set_percentage",{entity_id:s,percentage:i}),setTimeout(()=>e._updateStates(),100)}}),t.querySelectorAll("select[data-option]").forEach(t=>{t.onchange=t=>{t.stopPropagation(),e._hass.callService("input_select","select_option",{entity_id:s,option:t.target.value}),setTimeout(()=>e._updateStates(),100)}}),t.querySelectorAll('input[type="number"][data-value]').forEach(t=>{t.onchange=t=>{t.stopPropagation(),e._hass.callService("input_number","set_value",{entity_id:s,value:parseFloat(t.target.value)}),setTimeout(()=>e._updateStates(),100)}})})}_callService(t,e){if(!this._hass)return;const[s]=t.split("."),o=this._hass.states[t];let i=s,r=e;"button"===s?r="press":"script"===s?(i="script",r=t.split(".")[1]):"scene"===s?r="turn_on":"automation"===s?r="toggle"===e?"toggle":"turn_off"===e?"turn_off":"trigger":"input_button"===s?r="press":"lock"===s?r="toggle"===e?"locked"===o?.state?"unlock":"lock":e:"cover"===s?r="toggle"===e?"open"===o?.state||"opening"===o?.state?"close_cover":"open_cover":e:"toggle"===e&&o&&(r="on"===o.state?"turn_off":"turn_on"),"script"===s?this._hass.callService(i,r,{}):this._hass.callService(i,r,{entity_id:t}),setTimeout(()=>this._updateStates(),100)}_renderFallback(){if(!this._rootElement||!this._hass)return;const t=(this._entities||[]).map(t=>{const e=this._hass.states[t];return e?`<div class="entity" data-entity="${t}"><div class="entity-name">${e.attributes.friendly_name||t}</div><div class="state-text">${e.state}</div></div>`:""}).join("");this._rootElement.innerHTML=t,this._processStyles(),this._setupEventListeners()}_updateStates(){if(this._entities&&this._hass&&this._rootElement)try{this._entities.forEach(t=>{const e=this._hass.states[t];if(!e)return;this._rootElement.querySelectorAll(`[data-entity="${t}"]`).forEach(s=>{try{s.dataset.state=e.state,s.querySelectorAll("[data-state-text]").forEach(t=>{const s=t.dataset.map;if(s)try{t.textContent=JSON.parse(s)[e.state]||e.state}catch{t.textContent=e.state}else t.textContent=e.state}),s.querySelectorAll("[data-attr]").forEach(t=>{const s=t.dataset.attr;t.textContent=e.attributes[s]??""}),s.querySelectorAll("[data-brightness]").forEach(t=>{const s=e.attributes.brightness;"INPUT"===t.tagName?t.value=s?Math.round(100*s/255):0:t.textContent=s?Math.round(100*s/255)+"%":"0%"}),s.querySelectorAll("[data-temperature]").forEach(t=>{t.textContent=e.attributes.temperature??e.attributes.current_temperature??""}),s.querySelectorAll("[data-friendly-name]").forEach(s=>{s.textContent=e.attributes.friendly_name||t})}catch{}})})}catch{}}_resolveWatchList(){const t=this._rootElement._watchedEntities,e=[],s=Object.keys(this._hass.states);for(const o of t)if(o.endsWith("."))for(const t of s)t.startsWith(o)&&e.push(t);else e.push(o);this._resolvedWatch={src:t,ids:e,count:s.length}}_shouldUpdate(t){if(!this._rendered)return!0;if(!t)return!1;if(this._config.always_update)return!0;if(!this._entities||0===this._entities.length){if(this._hasScript&&this._rootElement?._watchedEntities){const e=Object.keys(this._hass.states).length;this._resolvedWatch&&this._resolvedWatch.src===this._rootElement._watchedEntities&&this._resolvedWatch.count===e||this._resolveWatchList();const s=this._resolvedWatch?.ids;return!(!s||0===s.length)&&s.some(e=>t.states[e]!==this._hass.states[e])}return!1}return this._entities.some(e=>{const s=t.states[e],o=this._hass.states[e];return!(!s||!o)&&(s.state!==o.state||JSON.stringify(s.attributes)!==JSON.stringify(o.attributes))})}setConfig(t){const e=this._config;if(t={content:"",update_interval:1e4,do_not_parse:!1,ignore_line_breaks:!0,scripts:[],...t},!(t=this.constructor.preProcessScripts(t)).content)throw new Error("Content must be defined");if(t.scripts&&!Array.isArray(t.scripts))throw new Error("Scripts must be an array");const s=!e||e.content!==t.content||e.do_not_parse!==t.do_not_parse;this._hasScript=t.content.includes("<script"),this._config=t,s&&(this._rendered=!1,this._lastContent=null),this._calculateEntities(),this._rootElement||this._createRootElement(),this._setupEventListeners(),this._setupTimeUpdate(),this._hass&&this._rootElement&&this._processAndRender()}_calculateEntities(){this._entities=new Set,this._config.entities?.length&&this._config.entities.forEach(t=>this._entities.add(t));(this._config.content.match(/\b(?:light|switch|sensor|binary_sensor|climate|media_player|fan|cover|input_boolean|input_number|input_select|input_text|input_button|button|scene|script|automation|person|zone|weather|camera|vacuum|lock|number|select|text|timer|counter|group|device_tracker|water_heater|humidifier|siren|update|event|image|lawn_mower|valve|todo|date|time|datetime|schedule|notify|tts|remote|alarm_control_panel)\.[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g)||[]).forEach(t=>this._entities.add(t)),this._entities=Array.from(this._entities)}_processStyles(){const t=document.createElement("style");t.textContent='[data-entity]{cursor:pointer;-webkit-tap-highlight-color:transparent}input[type="range"]{-webkit-appearance:none;width:100%;background:transparent}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none}',this._rootElement.insertBefore(t,this._rootElement.firstChild)}getCardSize(){return 1}}customElements.define("html-pro-card",HtmlTemplateCard),window.customCards=window.customCards||[],window.customCards.push({type:"html-pro-card",name:"HTML Pro Card",preview:!0,description:"Advanced HTML card with Jinja2 template support"}),function(){if(window.claw)return;const t=()=>document.querySelector("home-assistant")?.hass,e=(window._htmlProCardOverlay||(()=>{const t=document.createElement("div");t.id="html-pro-card-overlay",t.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;",document.body.appendChild(t)})(),{hass:()=>t(),callService:(e,s,o)=>{const i=t();if(!i)throw new Error("hass not available");return i.callService(e,s,o||{})},state:e=>{const s=t();return s?.states?.[e]||null},states:e=>{const s=t();if(!s?.states)return{};if(!e)return s.states;const o={};for(const[t,i]of Object.entries(s.states))(t.startsWith(e)||t.includes(e))&&(o[t]=i);return o},toggle:t=>{const s=e.state(t);if(!s)return;const[o]=t.split("."),i="on"===s.state?"turn_off":"turn_on";return e.callService(o,i,{entity_id:t})},press:t=>{const[s]=t.split(".");return"button"===s||"input_button"===s?e.callService(s,"press",{entity_id:t}):"scene"===s?e.callService("scene","turn_on",{entity_id:t}):"script"===s?e.callService("script",t.split(".")[1],{}):"automation"===s?e.callService("automation","trigger",{entity_id:t}):e.toggle(t)},navigate:t=>{history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed"))},moreInfo:t=>{const e=new Event("hass-more-info",{bubbles:!0,composed:!0});e.detail={entityId:t},document.querySelector("home-assistant")?.dispatchEvent(e)},fire:(e,s)=>{const o=t();o?.connection&&o.connection.sendMessage({type:"fire_event",event_type:e,event_data:s||{}})},ws:e=>{const s=t();if(!s?.connection)throw new Error("ws not available");return s.connection.sendMessagePromise(e)},el:(t,e,s)=>{const o=document.createElement(t);return"string"==typeof e?o.style.cssText=e:e&&Object.entries(e).forEach(([t,e])=>"style"===t?o.style.cssText=e:"text"===t?o.textContent=e:o.setAttribute(t,e)),s?s.appendChild(o):document.body.appendChild(o),o},remove:t=>{const e="string"==typeof t?document.getElementById(t):t;e&&e.remove()},inject:t=>{const e=document.createElement("style");return e.textContent=t,document.head.appendChild(e),{remove:()=>e.remove()}},wait:t=>new Promise(e=>setTimeout(e,t)),deepQuery:t=>{const e=s=>{if(!s)return null;let o=s.querySelector?.(t);if(o)return o;const i=s.querySelectorAll?.("*")||[];for(const t of i)if(t.shadowRoot&&(o=e(t.shadowRoot),o))return o;return null};return e(document)},deepQueryAll:t=>{const e=[],s=o=>{o&&(o.querySelectorAll?.(t)?.forEach(t=>e.push(t)),o.querySelectorAll?.("*")?.forEach(t=>{t.shadowRoot&&s(t.shadowRoot)}))};return s(document),e}});window.claw=e}();