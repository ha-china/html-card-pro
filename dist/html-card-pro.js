import{html,LitElement}from"https://unpkg.com/lit-element@2.4.0/lit-element.js?module";const HTML_PRO_CARD_VERSION="3.8";console.info("%cHTML Pro %c 3.8","color:#03a9f4;font-weight:600","color:#999");const _globalLoadedScripts=window._htmlProCardScripts||(window._htmlProCardScripts=new Set),_globalGetters={root:e=>e._rootElement,card:e=>e._rootElement,hass:e=>e._hass,config:e=>e._config,$:e=>t=>e._rootElement?.querySelector(t),$$:e=>t=>e._rootElement?.querySelectorAll(t)};if(Object.entries(_globalGetters).forEach(([e,t])=>{Object.getOwnPropertyDescriptor(window,e)||Object.defineProperty(window,e,{get(){const e=window.event;let o=e?.target||document.activeElement;for(;o;){if("html-pro-card"===o.localName)return t(o);o=o.parentElement||o.getRootNode()?.host}const n=document.querySelector("html-pro-card");if(n)return t(n)},configurable:!0})}),!document.getElementById("html-pro-card-overlay")){const e=document.createElement("div");e.id="html-pro-card-overlay",e.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;",document.body.appendChild(e)}if(window._htmlProCardOverlay=document.getElementById("html-pro-card-overlay"),!document.getElementById("html-pro-card-loading-styles")){const e=document.createElement("style");e.id="html-pro-card-loading-styles",e.textContent="\n    .html-pro-prerender-style-root {\n      transition: min-height 0.3s ease;\n    }\n    .html-pro-prerender-style-root.html-pro-loading {\n      position: relative !important;\n      pointer-events: none !important;\n      user-select: none !important;\n    }\n    .html-pro-prerender-style-root.html-pro-rendering {\n      position: relative !important;\n    }\n    .html-pro-prerender-style-root .html-pro-loading-skeleton {\n      display: none;\n    }\n    .html-pro-prerender-style-root.html-pro-loading {\n      min-height: 136px !important;\n    }\n    .html-pro-prerender-style-root.html-pro-loading > :not(style):not(.html-pro-loading-skeleton) {\n      opacity: 0 !important;\n    }\n    .html-pro-prerender-style-root.html-pro-loading .html-pro-loading-skeleton {\n      position: absolute !important;\n      inset: 0 !important;\n      display: flex !important;\n      flex-direction: column !important;\n      gap: 12px !important;\n      min-height: 136px !important;\n      padding: 18px !important;\n      border-radius: 10px !important;\n      background: var(--card-background-color, var(--ha-card-background, #fff)) !important;\n      box-sizing: border-box !important;\n      z-index: 3 !important;\n      overflow: hidden !important;\n    }\n    .html-pro-prerender-style-root.html-pro-rendering .html-pro-loading-skeleton {\n      position: absolute !important;\n      inset: 0 !important;\n      display: flex !important;\n      flex-direction: column !important;\n      gap: 12px !important;\n      padding: 18px !important;\n      border-radius: 10px !important;\n      background: rgba(245, 247, 250, 0.42) !important;\n      box-sizing: border-box !important;\n      z-index: 3 !important;\n      overflow: hidden !important;\n      opacity: 0.42 !important;\n      pointer-events: none !important;\n      transition: opacity 0.18s ease !important;\n    }\n    .html-pro-prerender-style-root.html-pro-rendering .html-pro-loading-skeleton-line.hero {\n      height: 38px !important;\n    }\n    .html-pro-prerender-style-root.html-pro-loading.editor-preview {\n      min-height: 180px !important;\n    }\n    .html-pro-prerender-style-root.html-pro-loading.editor-preview .html-pro-preview-wrapper {\n      min-height: 180px !important;\n    }\n    .html-pro-prerender-style-root.html-pro-loading.editor-preview .html-pro-loading-skeleton {\n      min-height: 180px !important;\n    }\n    .html-pro-loading-skeleton-line {\n      height: 12px !important;\n      border-radius: 7px !important;\n      background: linear-gradient(90deg,\n        rgba(142, 151, 164, 0.10) 0%,\n        rgba(142, 151, 164, 0.18) 45%,\n        rgba(255, 255, 255, 0.26) 55%,\n        rgba(142, 151, 164, 0.10) 100%\n      ) !important;\n      background-size: 200% 100% !important;\n      animation: html-pro-shimmer 2.2s infinite ease-in-out !important;\n    }\n    .html-pro-loading-skeleton-line.hero {\n      height: 52px !important;\n      width: 100% !important;\n      margin-bottom: 6px !important;\n    }\n    .html-pro-loading-skeleton-line.title {\n      width: 48% !important;\n      height: 16px !important;\n    }\n    .html-pro-loading-skeleton-line.body-1 {\n      width: 86% !important;\n    }\n    .html-pro-loading-skeleton-line.body-2 {\n      width: 72% !important;\n    }\n    .html-pro-loading-skeleton-line.body-3 {\n      width: 58% !important;\n    }\n    /* Soft targeted skeleton loader for images, icons, text, and buttons */\n    .html-pro-prerender-style-root.html-pro-loading img,\n    .html-pro-prerender-style-root.html-pro-loading svg,\n    .html-pro-prerender-style-root.html-pro-loading ha-icon,\n    .html-pro-prerender-style-root.html-pro-loading button,\n    .html-pro-prerender-style-root.html-pro-loading h1,\n    .html-pro-prerender-style-root.html-pro-loading h2,\n    .html-pro-prerender-style-root.html-pro-loading h3,\n    .html-pro-prerender-style-root.html-pro-loading h4,\n    .html-pro-prerender-style-root.html-pro-loading h5,\n    .html-pro-prerender-style-root.html-pro-loading h6,\n    .html-pro-prerender-style-root.html-pro-loading p,\n    .html-pro-prerender-style-root.html-pro-loading span,\n    .html-pro-prerender-style-root.html-pro-loading [data-skeleton] {\n      color: transparent !important;\n      background: linear-gradient(90deg,\n        rgba(142, 151, 164, 0.10) 0%,\n        rgba(142, 151, 164, 0.18) 45%,\n        rgba(255, 255, 255, 0.26) 55%,\n        rgba(142, 151, 164, 0.10) 100%\n      ) !important;\n      background-size: 200% 100% !important;\n      animation: html-pro-shimmer 2.2s infinite ease-in-out !important;\n      border-color: transparent !important;\n      border-radius: 8px !important;\n      box-shadow: inset 0 0 0 1px rgba(142, 151, 164, 0.06) !important;\n      text-shadow: none !important;\n      pointer-events: none !important;\n      opacity: 0.9 !important;\n    }\n    .html-pro-prerender-style-root.html-pro-loading img,\n    .html-pro-prerender-style-root.html-pro-loading svg {\n      filter: saturate(0.65) contrast(0.92) opacity(0.45) !important;\n    }\n    @keyframes html-pro-shimmer {\n      0% { background-position: 200% 0; }\n      100% { background-position: -200% 0; }\n    }\n    .html-pro-image-fallback {\n      display: inline-flex !important;\n      align-items: center !important;\n      justify-content: center !important;\n      width: var(--html-pro-fallback-width, 100%) !important;\n      height: var(--html-pro-fallback-height, 140px) !important;\n      min-height: 44px !important;\n      border-radius: inherit;\n      background:\n        radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.7), transparent 32%),\n        linear-gradient(135deg, rgba(238, 240, 243, 0.95), rgba(222, 226, 231, 0.9)) !important;\n      color: rgba(111, 119, 130, 0.45) !important;\n      box-shadow: inset 0 0 0 1px rgba(128, 138, 150, 0.12) !important;\n      overflow: hidden !important;\n      box-sizing: border-box !important;\n    }\n    .html-pro-image-fallback::before {\n      content: \"\";\n      width: min(34px, 36%);\n      height: min(34px, 36%);\n      opacity: 0.45;\n      background: currentColor;\n      -webkit-mask: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='black' d='M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 8A1.5 1.5 0 1 1 7 9.5 1.5 1.5 0 0 1 8.5 8Zm10 10h-13l4.1-5.2 2.9 3.5 3.7-4.8 2.3 2.9Z'/%3E%3C/svg%3E\") center / contain no-repeat;\n      mask: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='black' d='M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 8A1.5 1.5 0 1 1 7 9.5 1.5 1.5 0 0 1 8.5 8Zm10 10h-13l4.1-5.2 2.9 3.5 3.7-4.8 2.3 2.9Z'/%3E%3C/svg%3E\") center / contain no-repeat;\n    }\n  ",document.head.appendChild(e)}if(function(){const e=window._htmlProCardOverlay;if(!e)return;window.addEventListener("location-changed",()=>{e.innerHTML=""}),e.addEventListener("click",t=>{const o=t.target.closest("[data-action][data-entity]")||t.target.closest("[data-action]");if(!o)return;const n=o.dataset.entity||o.closest("[data-entity]")?.dataset.entity,r=o.dataset.action;if(!n||!r)return;const i=document.querySelector("home-assistant")?.hass;if(!i)return;const[s]=n.split(".");if("more-info"===r){const t=new Event("hass-more-info",{bubbles:!0,composed:!0});return t.detail={entityId:n},void e.dispatchEvent(t)}let a=r;if("toggle"===r){const e=i.states[n];if("lock"===s)a="locked"===e?.state?"unlock":"lock";else if("cover"===s)a="open"===e?.state||"opening"===e?.state?"close_cover":"open_cover";else if("button"===s||"input_button"===s)a="press";else if("scene"===s)a="turn_on";else{if("script"===s)return void i.callService("script",n.split(".")[1],{});e&&(a="on"===e.state?"turn_off":"turn_on")}}i.callService(s,a,{entity_id:n})})}(),!window._htmlProCardRoots){window._htmlProCardRoots=new Set;const e=document.getElementById.bind(document),t=document.querySelector.bind(document),o=document.querySelectorAll.bind(document);document.getElementById=function(t){for(const e of window._htmlProCardRoots){const o=e.querySelector("#"+t);if(o)return o}return e(t)},document.querySelector=function(e){for(const t of window._htmlProCardRoots){const o=t.querySelector(e);if(o)return o}return t(e)},document.querySelectorAll=function(e){const t=[];for(const o of window._htmlProCardRoots)t.push(...o.querySelectorAll(e));return t.length>0?t:o(e)}}const _pceLoaded={promise:null};function _loadPrismEditor(){return _pceLoaded.promise||(_pceLoaded.promise=new Promise(e=>{if(window.prismCodeEditor)return void e(window.prismCodeEditor);const t=document.createElement("script");t.type="module",t.textContent="\n      import { fullEditor, updateTheme } from 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/setups/index.js';\n      import 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/prism/languages/markup.js';\n      import 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/prism/languages/css.js';\n      import 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/prism/languages/javascript.js';\n      import 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/prism/languages/typescript.js';\n      window.prismCodeEditor = { fullEditor, updateTheme };\n      window.dispatchEvent(new Event('pce-ready'));\n    ",document.head.appendChild(t),window.addEventListener("pce-ready",()=>e(window.prismCodeEditor),{once:!0})})),_pceLoaded.promise}customElements.get("ha-htmlcard-textarea")||customElements.define("ha-htmlcard-textarea",class extends HTMLElement{constructor(){super(),this._value="",this._editorReady=!1,this._pendingValue=null}connectedCallback(){this._initialized||(this._initialized=!0,this.innerHTML='\n        <style>\n          .pce-container {\n            position: relative;\n            min-height: 400px;\n            border: 1px solid var(--divider-color, #e0e0e0);\n            border-radius: 10px;\n            overflow: hidden;\n            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(0, 0, 0, 0.02);\n            transition: border-color 0.2s ease, box-shadow 0.2s ease;\n          }\n          .pce-container:focus-within {\n            border-color: var(--primary-color, #03a9f4);\n            box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color, 3, 169, 244), 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.02);\n          }\n          .pce-container.loading {\n            height: 400px;\n          }\n          .pce-container .prism-code-editor {\n            height: 300px !important;\n            min-height: 350px !important;\n            font-size: 13px !important;\n          }\n          .pce-fallback {\n            width: 100%;\n            height: 400px;\n            padding: 14px 16px;\n            border: none;\n            background: var(--card-background-color, #fff);\n            color: var(--primary-text-color, #333);\n            font-family: \'SF Mono\', \'Consolas\', \'Monaco\', monospace;\n            font-size: 13px;\n            line-height: 1.6;\n            resize: vertical;\n            box-sizing: border-box;\n            outline: none;\n          }\n          .pce-container.loading .pce-fallback {\n            color: transparent;\n            caret-color: transparent;\n          }\n          .pce-skeleton {\n            position: absolute;\n            inset: 0;\n            min-height: 400px;\n            padding: 18px 16px;\n            background: var(--card-background-color, #fff);\n            pointer-events: none;\n            box-sizing: border-box;\n            z-index: 2;\n          }\n          .pce-container:not(.loading) .pce-skeleton {\n            display: none;\n          }\n          .pce-skeleton-line {\n            height: 12px;\n            margin-bottom: 12px;\n            border-radius: 7px;\n            background: linear-gradient(\n              90deg,\n              rgba(142, 151, 164, 0.10) 0%,\n              rgba(142, 151, 164, 0.18) 45%,\n              rgba(255, 255, 255, 0.26) 55%,\n              rgba(142, 151, 164, 0.10) 100%\n            );\n            background-size: 200% 100%;\n            animation: pce-skeleton-shimmer 2.2s infinite ease-in-out;\n          }\n          .pce-skeleton-line:nth-child(1) { width: 38%; }\n          .pce-skeleton-line:nth-child(2) { width: 82%; }\n          .pce-skeleton-line:nth-child(3) { width: 74%; margin-left: 18px; }\n          .pce-skeleton-line:nth-child(4) { width: 66%; margin-left: 36px; }\n          .pce-skeleton-line:nth-child(5) { width: 88%; margin-left: 18px; }\n          .pce-skeleton-line:nth-child(6) { width: 56%; }\n          .pce-skeleton-line:nth-child(7) { width: 78%; }\n          .pce-skeleton-line:nth-child(8) { width: 62%; margin-left: 18px; }\n          @keyframes pce-skeleton-shimmer {\n            0% { background-position: 200% 0; }\n            100% { background-position: -200% 0; }\n          }\n        </style>\n        <div class="pce-container loading">\n          <textarea class="pce-fallback" spellcheck="false"></textarea>\n          <div class="pce-skeleton" aria-hidden="true">\n            <div class="pce-skeleton-line"></div>\n            <div class="pce-skeleton-line"></div>\n            <div class="pce-skeleton-line"></div>\n            <div class="pce-skeleton-line"></div>\n            <div class="pce-skeleton-line"></div>\n            <div class="pce-skeleton-line"></div>\n            <div class="pce-skeleton-line"></div>\n            <div class="pce-skeleton-line"></div>\n          </div>\n        </div>\n      ',this._container=this.querySelector(".pce-container"),this._fallback=this.querySelector(".pce-fallback"),this._fallback.value=this._value,this._fallback.addEventListener("input",()=>{this._value=this._fallback.value,this.dispatchEvent(new CustomEvent("change",{detail:{value:this._value},bubbles:!0,composed:!0}))}),this._initEditor())}async _initEditor(){try{const e=await _loadPrismEditor();this._fallback.style.visibility="hidden";const t=null!==this._pendingValue?this._pendingValue:this._value,o=document.querySelector("home-assistant")?.hass?.themes,n=o?.darkMode||document.body.getAttribute("data-theme")?.includes("dark")||getComputedStyle(document.body).getPropertyValue("--primary-background-color")?.trim()?.match(/^#[0-3]/)||window.matchMedia("(prefers-color-scheme: dark)").matches?"vs-code-dark":"vs-code-light";this._editor=e.fullEditor(this._container,{language:"html",theme:n,value:t,lineNumbers:!0,wordWrap:!1,tabSize:2},()=>{this._editorReady=!0,this._fallback.style.display="none",this._container.classList.remove("loading"),this._value=t;const e=this._editor.scrollContainer.parentNode;if(e instanceof ShadowRoot){const t=document.createElement("style");t.textContent=".prism-code-editor { height: 400px !important; font-size: 11px !important; }",e.appendChild(t)}this._editor.addListener("update",e=>{this._value=e,this.dispatchEvent(new CustomEvent("change",{detail:{value:this._value},bubbles:!0,composed:!0}))})})}catch(e){this._container.classList.remove("loading"),this._fallback.style.visibility="visible",this._fallback.style.display="block"}}set value(e){const t=e||"";this._editorReady&&this._editor?this._editor.value!==t&&(this._editor.setOptions({value:t}),this._value=t):(this._pendingValue=t,this._value=t,this._fallback&&(this._fallback.value=t))}get value(){return this._value}}),customElements.get("ha-htmlcard-textfield")||customElements.define("ha-htmlcard-textfield",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n        <style>\n          :host {\n            display: block;\n          }\n          input {\n            width: 100%;\n            padding: 8px;\n            border: 1px solid var(--divider-color, #e0e0e0);\n            border-radius: 4px;\n            background: var(--card-background-color, #fff);\n            color: var(--primary-text-color, #000);\n          }\n        </style>\n        <input type="text" />\n      ',this._input=this.shadowRoot.querySelector("input"),this._input.addEventListener("input",()=>{this.dispatchEvent(new CustomEvent("change",{detail:{value:this._input.value},bubbles:!0,composed:!0}))})}set value(e){this._input.value=e}get value(){return this._input.value}set type(e){this._input.type=e}}),customElements.get("ha-htmlcard-switch")||customElements.define("ha-htmlcard-switch",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n        <style>\n          :host {\n            display: inline-block;\n          }\n          label {\n            position: relative;\n            display: inline-block;\n            width: 40px;\n            height: 24px;\n          }\n          input {\n            opacity: 0;\n            width: 0;\n            height: 0;\n          }\n          span {\n            position: absolute;\n            cursor: pointer;\n            top: 0;\n            left: 0;\n            right: 0;\n            bottom: 0;\n            background-color: #ccc;\n            transition: .4s;\n            border-radius: 24px;\n          }\n          span:before {\n            position: absolute;\n            content: "";\n            height: 16px;\n            width: 16px;\n            left: 4px;\n            bottom: 4px;\n            background-color: white;\n            transition: .4s;\n            border-radius: 50%;\n          }\n          input:checked + span {\n            background-color: var(--primary-color, #03a9f4);\n          }\n          input:checked + span:before {\n            transform: translateX(16px);\n          }\n        </style>\n        <label>\n          <input type="checkbox" />\n          <span></span>\n        </label>\n      ',this._input=this.shadowRoot.querySelector("input"),this._input.addEventListener("change",()=>{this.dispatchEvent(new CustomEvent("change",{detail:{checked:this._input.checked},bubbles:!0,composed:!0}))})}set checked(e){this._input.checked=e}get checked(){return this._input.checked}}),customElements.get("ha-htmlcard-formfield")||customElements.define("ha-htmlcard-formfield",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n        <style>\n          :host {\n            display: flex;\n            align-items: center;\n            padding: 4px 0;\n          }\n          label {\n            padding-left: 8px;\n            color: var(--primary-text-color, #000);\n          }\n        </style>\n        <slot></slot>\n        <label><slot name="label"></slot></label>\n      '}});const I18N={zh:{htmlContent:"HTML 内容",options:"选项设置",scripts:"外部脚本",store:"模块商店",disableParse:"纯HTML模式",disableParseDesc:"默认关闭(使用Jinja2)，开启后直接渲染HTML",updateInterval:"更新间隔 (ms)",updateIntervalDesc:"0 为禁用自动更新",ignoreLineBreaks:"忽略换行",ignoreLineBreaksDesc:"忽略HTML中的换行符",addScript:"添加",scriptPlaceholder:"输入脚本 URL",searchPlaceholder:"搜索模块...",import:"导入",delete:"删除",loading:"加载中...",noModules:"暂无模块",noCustomModules:"暂无自定义模块",confirmDelete:"确定删除此模块?",customModule:"自定义模块",headerDesc:"高级 HTML 卡片编辑器，支持 Jinja2 模板语法",headerDesc2:"可使用 Home Assistant 状态、属性和服务调用",realtime:"实时更新",extScripts:"外部脚本",customStyle:"自定义样式",yamlHint:"支持直接粘贴完整YAML配置",storeDesc:"从社区获取模块",version:"版本",by:"作者",supports:"支持",viewSource:"查看",slideToImport:"滑动导入 →",loadError:"加载失败，请稍后重试",refreshing:"刷新中..."},"zh-Hant":{htmlContent:"HTML 內容",options:"選項設置",scripts:"外部腳本",store:"模組商店",disableParse:"純HTML模式",disableParseDesc:"預設關閉(使用Jinja2)，開啟後直接渲染HTML",updateInterval:"更新間隔 (ms)",updateIntervalDesc:"0 為禁用自動更新",ignoreLineBreaks:"忽略換行",ignoreLineBreaksDesc:"忽略HTML中的換行符",addScript:"添加",scriptPlaceholder:"輸入腳本 URL",searchPlaceholder:"搜尋模組...",import:"導入",delete:"刪除",loading:"載入中...",noModules:"暫無模組",noCustomModules:"暫無自定義模組",confirmDelete:"確定刪除此模組?",customModule:"自定義模組",headerDesc:"高級 HTML 卡片編輯器，支持 Jinja2 模板語法",headerDesc2:"可使用 Home Assistant 狀態、屬性和服務調用",realtime:"即時更新",extScripts:"外部腳本",customStyle:"自定義樣式",yamlHint:"支持直接貼上完整YAML配置",storeDesc:"從社區獲取模組",version:"版本",by:"作者",supports:"支持",viewSource:"查看",slideToImport:"滑動導入 →",loadError:"載入失敗，請稍後重試",refreshing:"刷新中..."},ja:{htmlContent:"HTML コンテンツ",options:"オプション",scripts:"外部スクリプト",store:"モジュールストア",disableParse:"純粋HTMLモード",disableParseDesc:"デフォルトオフ(Jinja2使用)、オンでHTML直接レンダリング",updateInterval:"更新間隔 (ms)",updateIntervalDesc:"0で自動更新無効",ignoreLineBreaks:"改行を無視",ignoreLineBreaksDesc:"HTML内の改行を無視",addScript:"追加",scriptPlaceholder:"スクリプトURLを入力",searchPlaceholder:"モジュールを検索...",import:"インポート",delete:"削除",loading:"読み込み中...",noModules:"モジュールなし",noCustomModules:"カスタムモジュールなし",confirmDelete:"このモジュールを削除しますか？",customModule:"カスタムモジュール",headerDesc:"Jinja2テンプレート対応の高度なHTMLカードエディター",headerDesc2:"Home Assistantの状態、属性、サービスを使用可能",realtime:"リアルタイム",extScripts:"スクリプト",customStyle:"カスタムCSS",yamlHint:"完全なYAML設定を直接貼り付け可能",storeDesc:"コミュニティからモジュールを取得",version:"v",by:"作者",supports:"対応",viewSource:"表示",slideToImport:"スライドでインポート →",loadError:"読み込み失敗、後でもう一度お試しください",refreshing:"更新中..."},de:{htmlContent:"HTML-Inhalt",options:"Optionen",scripts:"Externe Skripte",store:"Modul-Store",disableParse:"Reiner HTML-Modus",disableParseDesc:"Standard aus (Jinja2), aktivieren für direktes HTML-Rendering",updateInterval:"Aktualisierungsintervall (ms)",updateIntervalDesc:"0 deaktiviert Auto-Update",ignoreLineBreaks:"Zeilenumbrüche ignorieren",ignoreLineBreaksDesc:"Zeilenumbrüche in HTML ignorieren",addScript:"Hinzufügen",scriptPlaceholder:"Skript-URL eingeben",searchPlaceholder:"Module suchen...",import:"Importieren",delete:"Löschen",loading:"Laden...",noModules:"Keine Module",noCustomModules:"Keine benutzerdefinierten Module",confirmDelete:"Dieses Modul löschen?",customModule:"Benutzerdefiniertes Modul",headerDesc:"Erweiterter HTML-Karten-Editor mit Jinja2-Vorlage",headerDesc2:"Home Assistant Zustände, Attribute und Dienste nutzen",realtime:"Echtzeit",extScripts:"Skripte",customStyle:"Benutzerdefiniertes CSS",yamlHint:"Vollständige YAML-Konfiguration direkt einfügen",storeDesc:"Module aus der Community abrufen",version:"v",by:"von",supports:"Unterstützt",viewSource:"Anzeigen",slideToImport:"Zum Importieren schieben →",loadError:"Laden fehlgeschlagen, bitte später erneut versuchen",refreshing:"Aktualisieren..."},en:{htmlContent:"HTML Content",options:"Options",scripts:"External Scripts",store:"Module Store",disableParse:"Pure HTML Mode",disableParseDesc:"Off by default (uses Jinja2), enable to render HTML directly",updateInterval:"Update Interval (ms)",updateIntervalDesc:"0 to disable auto update",ignoreLineBreaks:"Ignore Line Breaks",ignoreLineBreaksDesc:"Ignore line breaks in HTML",addScript:"Add",scriptPlaceholder:"Enter script URL",searchPlaceholder:"Search modules...",import:"Import",delete:"Delete",loading:"Loading...",noModules:"No modules",noCustomModules:"No custom modules",confirmDelete:"Delete this module?",customModule:"Custom Module",headerDesc:"Advanced HTML card editor with Jinja2 template",headerDesc2:"Use Home Assistant states, attributes and services",realtime:"Realtime",extScripts:"Scripts",customStyle:"Custom CSS",yamlHint:"Paste full YAML config directly",storeDesc:"Get modules from community",version:"v",by:"by",supports:"Supports",viewSource:"View",slideToImport:"Slide to Import →",loadError:"Failed to load, please try again",refreshing:"Refreshing..."}},MODULE_STORE_CONFIG={repo:"ha-china/html-card-pro",storeUrl:"https://cdn.jsdelivr.net/gh/ha-china/html-card-pro@main/store.json",rawBase:"https://cdn.jsdelivr.net/gh/ha-china/html-card-pro@main/",cacheKey:"html-pro-card-modules-cache",cacheTTL:6e5},_hasExecutableScript=e=>/<script\b/i.test(e)||/<script[^>]+type=["'](?:text|application)\/typescript["']/i.test(e)||/\$\{/.test(e);class HtmlTemplateCardEditor extends LitElement{static get properties(){return{_config:{type:Object},hass:{type:Object},_showStore:{type:Boolean},_showHtml:{type:Boolean},_showOptions:{type:Boolean},_showScripts:{type:Boolean},_storeModules:{type:Array},_savedModules:{type:Array},_storeLoading:{type:Boolean},_storeSearch:{type:String}}}get _lang(){const e=this.hass?.language||"";return"zh-Hant"===e||e.startsWith("zh-TW")||e.startsWith("zh-HK")?"zh-Hant":e.startsWith("zh")?"zh":e.startsWith("ja")?"ja":e.startsWith("de")?"de":"en"}_t(e){return I18N[this._lang]?.[e]||I18N.en[e]||e}constructor(){super(),this._showStore=!1,this._showHtml=!0,this._showOptions=!1,this._showScripts=!1,this._storeModules=[],this._savedModules=this._loadSavedModules(),this._storeLoading=!1,this._storeSearch=""}_loadSavedModules(){try{const e=localStorage.getItem("html-pro-card-modules");return e?JSON.parse(e):[]}catch{return[]}}_saveSavedModules(){localStorage.setItem("html-pro-card-modules",JSON.stringify(this._savedModules))}_getCachedModules(){try{const e=localStorage.getItem(MODULE_STORE_CONFIG.cacheKey);if(!e)return null;const{data:t,timestamp:o}=JSON.parse(e);return Date.now()-o>MODULE_STORE_CONFIG.cacheTTL?null:t}catch{return null}}_setCachedModules(e){try{localStorage.setItem(MODULE_STORE_CONFIG.cacheKey,JSON.stringify({data:e,timestamp:Date.now()}))}catch{}}_parseModuleFromMarkdown(e){const t=[],o=/```ya?ml\s*([\s\S]*?)```/gi;let n;for(;null!==(n=o.exec(e));){const o=n[1].trim();try{if(o.startsWith("type: custom:html-pro-card")||o.includes("\ntype: custom:html-pro-card")){const n=this._parseCardYaml(o);if(n&&n.content){const o=e.match(/\*\*([^*]+)\*\*/),r=e.match(/\*\*Author\*\*:\s*(\S+)/i)||e.match(/Author:\s*(\S+)/i),i=e.match(/\*\*Version\*\*:\s*(\S+)/i)||e.match(/Version:\s*(\S+)/i);t.push({name:o?o[1].trim():"Untitled Module",version:i?i[1]:"1.0",creator:r?r[1]:"Community",description:"",_cardConfig:n,code:n.content,scripts:n.scripts||[]})}}else{const e=this._parseModuleYaml(o);e&&e.name&&e.code&&t.push(e)}}catch{}}return t}_parseCardYaml(e){const t={},o=e.split("\n");let n=null,r=[],i=!1,s=0,a=!1,l=null,c=[];for(let e=0;e<o.length;e++){const d=o[e],p=d.trim();if(!p&&!i)continue;const h=d.search(/\S|$/);if(i){if(h>s||""===p){r.push(d.slice(s+2)||"");continue}t[n]=r.join("\n"),i=!1,r=[]}if(a){if(p.startsWith("- ")){c.push(this._cleanYamlScalar(p.slice(2).trim()));continue}if(!(h<=s))continue;t[l]=c,a=!1,c=[]}const u=p.match(/^([\w_-]+):\s*(.*)$/);if(u){const[,e,o]=u,d=o.trim();if(/^\|[-+]?$|^>[-+]?$/.test(d))n=e,s=h,i=!0,r=[];else if(""===d)l=e,s=h,a=!0,c=[];else if(d.startsWith('"')||d.startsWith("'"))t[e]=this._cleanYamlScalar(d);else{let o=this._cleanYamlScalar(d);"true"!==o&&"false"!==o||(o="true"===o),t[e]=o}}}i&&n&&(t[n]=r.join("\n")),a&&l&&(t[l]=c);for(const e of["do_not_parse","ignore_line_breaks"])void 0!==t[e]&&(t[e]=!0===t[e]||"true"===t[e]||1===t[e]||"1"===t[e]||"on"===t[e]);if(void 0!==t.update_interval){const e=parseInt(t.update_interval);t.update_interval=isNaN(e)?0:e}for(const e of["entities","scripts"])void 0!==t[e]&&(t[e]=this._normalizeYamlList(t[e]));return void 0!==t.content&&void 0===t.do_not_parse&&(t.do_not_parse=_hasExecutableScript(t.content||"")),t}_parseModuleYaml(e){const t=e.split("\n"),o={editor:[]};let n=null,r=0,i=[],s=!1,a=!1,l=null,c=!1,d={};for(let e=0;e<t.length;e++){const p=t[e],h=p.trim();if(!h)continue;const u=p.search(/\S/);if(s){if(u>r||""===h){i.push(p.slice(r+2)||"");continue}o[n]=i.join("\n"),s=!1,i=[]}if(0===u&&h.endsWith(":")&&!h.includes(" ")){const e=h.slice(0,-1);if("editor"===e){a=!0;continue}n=e;continue}if(a){if(0!==u||h.startsWith("-")){if(h.startsWith("- name:"))l&&o.editor.push(l),l={name:h.replace("- name:","").trim()},c=!1;else if(l&&u>=2){const e=h.match(/^([\w-]+):\s*(.*)$/);if(e){const[,t,o]=e;"selector"===t?(c=!0,d={}):c&&u>=4?"select"!==t&&"text"!==t&&"condition"!==t||(l.selector={type:t}):l[t]=o.replace(/^["']|["']$/g,"")}}}else a=!1;continue}const m=h.match(/^([\w-]+):\s*(.*)$/);if(m){const[,e,t]=m;"|"===t?(n=e,r=u,s=!0,i=[]):(t.startsWith('"')||t.startsWith("'"),o[e]=this._cleanYamlScalar(t))}}s&&n&&(o[n]=i.join("\n")),l&&o.editor.push(l);const p=Object.keys(o)[0];if(p&&"name"!==p&&!o.name){o.id=p;const t=this._parseNestedModule(e,p);if(t)return t}return o}_parseNestedModule(e,t){const o=e.split("\n"),n={id:t,editor:[]};let r=!1,i=null,s=[],a=!1,l=0;for(const e of o){const o=e.trim();if(!o)continue;const c=e.search(/\S/);if(o===t+":"){r=!0,l=c;continue}if(!r)continue;if(c<=l&&o.endsWith(":"))break;if(a){if(c>l+4||""===o){s.push(e.slice(l+6)||"");continue}n[i]=s.join("\n"),a=!1,s=[]}const d=o.match(/^([\w-]+):\s*(.*)$/);if(d&&c===l+4){const[,e,t]=d;"|"===t?(i=e,a=!0,s=[]):(t.startsWith('"')||t.startsWith("'"),n[e]=this._cleanYamlScalar(t))}}return a&&i&&(n[i]=s.join("\n")),n.name?n:null}setConfig(e){const t={...e};t.scripts&&Array.isArray(t.scripts)&&(t.scripts=t.scripts.filter(e=>null!=e)),this._config=t}render(){return this._config?html`
      <style>
        .card-config {
          padding: 16px;
        }
        .collapse-panel {
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 10px;
          margin-bottom: 12px;
          overflow: hidden;
          background: var(--card-background-color, #fff);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
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
          background: rgba(0, 0, 0, 0.015);
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
          color: var(--secondary-text-color);
          flex-shrink: 0;
          transition: color 0.2s ease;
        }
        .collapse-header:hover .collapse-icon {
          color: var(--primary-color);
        }
        .collapse-header.expanded .collapse-icon {
          color: var(--primary-color);
        }
        .collapse-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-text-color);
          letter-spacing: -0.2px;
        }
        .collapse-arrow {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--divider-color, #ddd);
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .collapse-arrow.expanded {
          background: var(--primary-color, #03a9f4);
          box-shadow: 0 0 0 3px rgba(var(--rgb-primary-color), 0.15);
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
          padding: 14px 16px;
          margin: 0 -16px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }
        .option-row:hover {
          background: rgba(var(--rgb-primary-color), 0.02);
        }
        .option-row:not(:last-child) {
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 0;
        }
        .option-row:first-child {
          border-radius: 8px 8px 0 0;
        }
        .option-row:last-child {
          border-radius: 0 0 8px 8px;
        }
        .option-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .option-desc {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 4px;
          line-height: 1.4;
        }
        .interval-input {
          width: 80px;
          height: 36px;
          padding: 0 12px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          transition: border-color 0.2s ease;
          -moz-appearance: textfield;
        }
        .interval-input::-webkit-outer-spin-button,
        .interval-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .interval-input:focus {
          outline: none;
          border-color: var(--primary-color);
        }
        ha-switch {
          --mdc-theme-secondary: var(--primary-color);
        }
        .script-input-container {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 12px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 10px;
          background: var(--card-background-color, #fff);
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }
        .script-input-container:focus-within {
          border-color: var(--primary-color, #03a9f4);
          box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color), 0.08);
        }
        .script-input-container input {
          flex: 1;
          padding: 10px 12px;
          font-size: 13px;
          border: none;
          background: transparent;
          color: var(--primary-text-color, #333);
          outline: none;
          box-sizing: border-box;
        }
        .script-input-container button {
          height: 38px;
          padding: 0 16px;
          font-size: 12px;
          font-weight: 500;
          border: none;
          background: var(--primary-color, #03a9f4);
          color: #fff;
          cursor: pointer;
          white-space: nowrap;
        }
        .script-input-container button:hover {
          opacity: 0.9;
        }
        .script-item {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 8px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 10px;
          background: var(--card-background-color, #fff);
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          transition: border-color 0.2s ease;
        }
        .script-item:focus-within {
          border-color: var(--primary-color, #03a9f4);
        }
        .script-item input {
          flex: 1;
          padding: 10px 12px;
          font-size: 12px;
          border: none;
          background: transparent;
          color: var(--primary-text-color, #333);
          outline: none;
          box-sizing: border-box;
        }
        .script-item button {
          height: 38px;
          width: 38px;
          padding: 0;
          border: none;
          background: transparent;
          color: var(--error-color, #e53935);
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .script-item button:hover {
          background: rgba(229, 57, 53, 0.1);
        }
        .store-search {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 12px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 10px;
          background: var(--card-background-color, #fff);
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }
        .store-search:focus-within {
          border-color: var(--primary-color, #03a9f4);
          box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color), 0.08);
        }
        .store-search input {
          flex: 1;
          padding: 10px 12px;
          border: none;
          font-size: 13px;
          box-sizing: border-box;
          background: transparent;
          color: var(--primary-text-color);
          outline: none;
        }
        .store-search-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--secondary-text-color);
          flex-shrink: 0;
        }
        .store-search-btn:hover {
          color: var(--primary-color);
          background: rgba(var(--rgb-primary-color), 0.05);
          border-radius: 6px;
        }
        .store-search-btn.loading {
          animation: spin 1s linear infinite;
        }
        .store-search-btn svg {
          width: 16px;
          height: 16px;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
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
          display: grid;
          grid-template-columns: 72px 1fr;
          border-radius: 10px;
          border: 1px solid var(--divider-color);
          margin-bottom: 10px;
          background: var(--card-background-color);
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          transition: border-color 0.2s ease;
        }
        .store-item:hover {
          border-color: var(--primary-color);
        }
        .store-item:last-child {
          margin-bottom: 0;
        }
        .store-skeleton {
          display: grid;
          grid-template-columns: 72px 1fr;
          border-radius: 10px;
          border: 1px solid rgba(142, 151, 164, 0.16);
          margin-bottom: 10px;
          background: var(--card-background-color);
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.025);
        }
        .store-skeleton-left {
          background: linear-gradient(
            135deg,
            rgba(238, 240, 243, 0.92),
            rgba(222, 226, 231, 0.82)
          );
          height: 100%;
          min-height: 100px;
          align-self: stretch;
          position: relative;
          overflow: hidden;
        }
        .store-skeleton-left::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.36),
            transparent
          );
          transform: translateX(-100%);
          animation: skeleton-sweep 2.4s infinite ease-in-out;
        }
        .store-skeleton-right {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .skeleton-line {
          height: 12px;
          background: linear-gradient(
            90deg,
            rgba(142, 151, 164, 0.10) 0%,
            rgba(142, 151, 164, 0.17) 48%,
            rgba(255, 255, 255, 0.26) 56%,
            rgba(142, 151, 164, 0.10) 100%
          );
          background-size: 200% 100%;
          animation: skeleton-shimmer 2.2s infinite ease-in-out;
          border-radius: 7px;
        }
        .skeleton-line.title {
          width: 50%;
          height: 16px;
        }
        .skeleton-line.desc {
          width: 90%;
        }
        .skeleton-line.desc2 {
          width: 70%;
        }
        .skeleton-line.btn {
          width: 100%;
          height: 32px;
          margin-top: 6px;
        }
        @keyframes skeleton-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        @keyframes skeleton-sweep {
          0% {
            transform: translateX(-100%);
          }
          60%,
          100% {
            transform: translateX(100%);
          }
        }
        .store-item-left {
          background: var(--secondary-background-color);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: default;
          min-height: 100px;
          align-self: stretch;
        }
        .store-item-left img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .store-item-left-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.7), transparent 32%),
            linear-gradient(135deg, rgba(238, 240, 243, 0.95), rgba(222, 226, 231, 0.9));
          box-shadow: inset 0 0 0 1px rgba(128, 138, 150, 0.12);
        }
        .store-item-left-placeholder svg {
          width: 28px;
          height: 28px;
          color: rgba(111, 119, 130, 0.45);
          opacity: 0.75;
        }
        .store-item-right {
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .store-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .store-item-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .store-item-title-group h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          letter-spacing: -0.2px;
        }
        .store-item-author {
          font-size: 12px;
          color: var(--primary-color);
          cursor: pointer;
          font-weight: 500;
          margin-left: 4px;
        }
        .store-item-author:hover {
          text-decoration: underline;
        }
        .store-item-version {
          font-size: 10px;
          padding: 2px 6px;
          color: var(--secondary-text-color);
          background: transparent;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          font-weight: 500;
        }
        .store-item-desc {
          margin: 0;
          font-size: 13px;
          color: var(--secondary-text-color);
          line-height: 1.6;
        }
        .store-item-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .store-item-tag {
          display: inline-block;
          font-size: 9px;
          font-weight: 600;
          color: var(--primary-color);
          background: rgba(var(--rgb-primary-color), 0.08);
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          cursor: pointer;
        }
        .store-item-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 6px;
        }
        .store-item-btn {
          height: 34px;
          padding: 0 14px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          background: var(--card-background-color);
          border: 1px solid var(--divider-color);
          color: var(--secondary-text-color);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.2s ease;
        }
        .store-item-btn:hover {
          color: var(--primary-color);
          border-color: var(--primary-color);
        }
        .store-item-btn svg {
          width: 15px;
          height: 15px;
        }
        .slide-track {
          flex: 1;
          height: 35px;
          border: 1px solid var(--divider-color);
          border-radius: 17px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }
        .slide-track.active {
          border-color: var(--primary-color);
        }
        .slide-hint {
          position: absolute;
          width: 100%;
          text-align: center;
          font-size: 11px;
          color: var(--secondary-text-color);
          font-weight: 500;
          letter-spacing: 0.3px;
          pointer-events: none;
          opacity: 0.5;
        }
        .slide-handle {
          width: 60px;
          height: 28px;
          background: var(--primary-color);
          border-radius: 14px;
          position: absolute;
          left: 3px;
          cursor: grab;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary-color, #fff);
          z-index: 2;
          transition: all 0.15s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }
        .slide-handle:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .slide-handle:active {
          cursor: grabbing;
          transform: scale(0.97);
        }
        .slide-handle svg {
          width: 14px;
          height: 14px;
        }
        .store-error {
          text-align: center;
          padding: 24px;
          color: var(--error-color, #e53935);
          font-size: 13px;
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
          background: rgba(0, 0, 0, 0.02);
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
            <a
              href="https://github.com/knoop7/html-card-pro"
              target="_blank"
              class="header-version"
              style="text-decoration:none;color:#fff;"
              >v${"3.8"}</a
            >
            <div class="header-logo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M13 2V3H12V9H11V10H9V11H8V12H7V13H5V12H4V11H3V9H2V15H3V16H4V17H5V18H6V22H8V21H7V20H8V19H9V18H10V19H11V22H13V21H12V17H13V16H14V15H15V12H16V13H17V11H15V9H20V8H17V7H22V3H21V2M14 3H15V4H14Z"
                />
              </svg>
            </div>
            <div class="header-desc">
              ${this._t("headerDesc")}<br />
              ${this._t("headerDesc2")}
            </div>
            <div class="header-features">
              <div class="header-feature">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                ${this._t("realtime")}
              </div>
              <div class="header-feature">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  ></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                ${this._t("extScripts")}
              </div>
              <div class="header-feature">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                ${this._t("customStyle")}
              </div>
            </div>
          </div>
          <!-- HTML 内容 -->
          <div class="collapse-panel">
            <div
              class="collapse-header ${this._showHtml?"expanded":""}"
              @click="${()=>{this._showHtml=!this._showHtml,this.requestUpdate()}}"
            >
              <div class="collapse-header-left">
                <svg
                  class="collapse-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <span class="collapse-title">${this._t("htmlContent")}</span>
              </div>
              <span
                class="collapse-arrow ${this._showHtml?"expanded":""}"
              ></span>
            </div>
            <div class="collapse-body ${this._showHtml?"expanded":""}">
              <div class="collapse-content">
                <div
                  style="font-size:11px;color:#999;margin:-8px 0 8px;text-align:center;"
                >
                  ${this._t("yamlHint")}
                </div>
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
            <div
              class="collapse-header ${this._showOptions?"expanded":""}"
              @click="${()=>{this._showOptions=!this._showOptions,this.requestUpdate()}}"
            >
              <div class="collapse-header-left">
                <svg
                  class="collapse-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                  ></path>
                </svg>
                <span class="collapse-title">${this._t("options")}</span>
              </div>
              <span
                class="collapse-arrow ${this._showOptions?"expanded":""}"
              ></span>
            </div>
            <div class="collapse-body ${this._showOptions?"expanded":""}">
              <div class="collapse-content">
                <div class="option-row">
                  <div>
                    <div class="option-label">${this._t("disableParse")}</div>
                    <div class="option-desc">
                      ${this._t("disableParseDesc")}
                    </div>
                  </div>
                  <ha-htmlcard-switch
                    .checked="${this._config.do_not_parse||!1}"
                    @change="${this._handleParseChange}"
                  ></ha-htmlcard-switch>
                </div>
                <div class="option-row">
                  <div>
                    <div class="option-label">
                      ${this._t("ignoreLineBreaks")}
                    </div>
                    <div class="option-desc">
                      ${this._t("ignoreLineBreaksDesc")}
                    </div>
                  </div>
                  <ha-htmlcard-switch
                    .checked="${this._config.ignore_line_breaks||!1}"
                    @change="${this._handleLineBreaksChange}"
                  ></ha-htmlcard-switch>
                </div>
                <div class="option-row">
                  <div>
                    <div class="option-label">${this._t("updateInterval")}</div>
                    <div class="option-desc">
                      ${this._t("updateIntervalDesc")}
                    </div>
                  </div>
                  <input
                    type="number"
                    class="interval-input"
                    .value="${this._config.update_interval||0}"
                    @change="${this._handleIntervalChange}"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 外部脚本 -->
          <div class="collapse-panel">
            <div
              class="collapse-header ${this._showScripts?"expanded":""}"
              @click="${()=>{this._showScripts=!this._showScripts,this.requestUpdate()}}"
            >
              <div class="collapse-header-left">
                <svg
                  class="collapse-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  ></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span class="collapse-title">${this._t("scripts")}</span>
              </div>
              <span
                class="collapse-arrow ${this._showScripts?"expanded":""}"
              ></span>
            </div>
            <div class="collapse-body ${this._showScripts?"expanded":""}">
              <div class="collapse-content">
                <div class="script-input-container">
                  <input
                    type="url"
                    placeholder="${this._t("scriptPlaceholder")}"
                    .value="${this._newScriptUrl||""}"
                    @change="${e=>this._newScriptUrl=e.target.value}"
                  />
                  <button @click="${this._addScript}">
                    ${this._t("addScript")}
                  </button>
                </div>
                ${(this._config.scripts||[]).map((e,t)=>html`
                    <div class="script-item">
                      <input
                        type="url"
                        .value="${e}"
                        @change="${e=>this._updateScript(t,e.target.value)}"
                      />
                      <button @click="${()=>this._removeScript(t)}">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          style="width:14px;height:14px"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          </div>

          <!-- 模块商店 -->
          <div class="collapse-panel">
            <div
              class="collapse-header ${this._showStore?"expanded":""}"
              @click="${this._toggleStore}"
            >
              <div class="collapse-header-left">
                <svg
                  class="collapse-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  ></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span class="collapse-title">${this._t("store")}</span>
              </div>
              <span
                class="collapse-arrow ${this._showStore?"expanded":""}"
              ></span>
            </div>
            <div class="collapse-body ${this._showStore?"expanded":""}">
              <div class="collapse-content">
                <div class="store-search">
                  <input
                    type="text"
                    placeholder="${this._t("searchPlaceholder")}"
                    .value="${this._storeSearch}"
                    @input="${e=>{this._storeSearch=e.target.value,this.requestUpdate()}}"
                  />
                  <button
                    class="store-search-btn ${this._storeLoading?"loading":""}"
                    @click="${()=>this._loadStoreModules()}"
                    title="${this._t("refresh")}"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M23 4v6h-6M1 20v-6h6" />
                      <path
                        d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
                      />
                    </svg>
                  </button>
                </div>
                <div class="store-list">
                  ${this._storeLoading?this._renderSkeleton():this._renderOnlineModules()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `:html``}_handleContentChange(e){if(!this._config)return;let t,o=e.detail.value||"";if(o=this._normalizeRadius(o),/\btype:\s*custom:html-pro-card\b/.test(o)&&/\bcontent:\s*/.test(o)){const e=this._parseYaml(o);t=void 0!==e.content?{...this._config,content:this._normalizeRadius(e.content||""),do_not_parse:void 0!==e.do_not_parse?e.do_not_parse:_hasExecutableScript(e.content||""),update_interval:void 0!==e.update_interval?e.update_interval:this._config.update_interval,ignore_line_breaks:void 0!==e.ignore_line_breaks?e.ignore_line_breaks:this._config.ignore_line_breaks,scripts:e.scripts||this._config.scripts,entities:e.entities||this._config.entities}:{...this._config,content:o}}else t={...this._config,content:o};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_normalizeRadius(e){return e.replace(/border-radius\s*:\s*([^;}\n]+)/gi,(e,t)=>{const o=t.trim().toLowerCase();if(o.includes("50%")||o.includes("100%")||o.includes("/"))return e;if(o.split(/\s+/).length>1)return e;const n=parseFloat(o);return!isNaN(n)&&n>10&&o.includes("px")?"border-radius: 10px":e})}_handleParseChange(e){this._valueChanged("do_not_parse",e.target.checked)}_handleLineBreaksChange(e){this._valueChanged("ignore_line_breaks",e.target.checked)}_handleIntervalChange(e){const t=parseInt(e.target.value)||0;this._valueChanged("update_interval",t)}_valueChanged(e,t){if(!this._config)return;const o={...this._config,[e]:t};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}_addScript(){if(!this._newScriptUrl)return;const e=[...this._config.scripts||[],this._newScriptUrl];this._valueChanged("scripts",e),this._newScriptUrl="",this.requestUpdate()}_updateScript(e,t){const o=[...this._config.scripts||[]];o[e]=t,this._valueChanged("scripts",o)}_removeScript(e){const t=[...this._config.scripts||[]];t.splice(e,1),this._valueChanged("scripts",t)}_toggleStore(){this._showStore=!this._showStore,this._showStore&&0===this._storeModules.length&&this._loadOnlineModules(),this.requestUpdate()}_switchTab(e){this._storeTab=e,"online"===e&&0===this._storeModules.length&&this._loadOnlineModules(),this.requestUpdate()}_parseYaml(e){const t=e.split("\n"),o={};let n=null,r=[],i=!1,s=!1,a=[],l=0;for(const e of t){const t=e.trim(),c=e.search(/\S|$/);if(i){if(c>l||""===t){r.push(e.slice(l+2)||"");continue}o[n]=r.join("\n"),i=!1,r=[]}if(s){const r=e.match(/^\s+-\s+(.+)$/);if(r){a.push(this._cleanYamlScalar(r[1].trim()));continue}t&&c<=l&&(o[n]=a,s=!1,a=[])}if(!i&&!s){const e=t.match(/^([\w_-]+):\s*(.*)$/);if(e){n=e[1];const t=e[2].trim();if(/^\|[-+]?$|^>[-+]?$/.test(t))i=!0,l=c,r=[];else if(""===t||""===t.trim())s=!0,l=c,a=[];else if("scripts"===n&&t.trim())o[n]=[this._cleanYamlScalar(t)];else{let e=this._cleanYamlScalar(t);"true"!==e&&"false"!==e||(e="true"===e),o[n]=e}}}}i&&n&&(o[n]=r.join("\n")),s&&n&&a.length>0&&(o[n]=a);for(const e of["do_not_parse","ignore_line_breaks"])void 0!==o[e]&&(o[e]=!0===o[e]||"true"===o[e]||1===o[e]||"1"===o[e]||"on"===o[e]);if(void 0!==o.update_interval){const e=parseInt(o.update_interval);o.update_interval=isNaN(e)?0:e}for(const e of["entities","scripts"])void 0!==o[e]&&(o[e]=this._normalizeYamlList(o[e]));return o}_normalizeYamlList(e){return(Array.isArray(e)?e:[e]).map(e=>this._cleanYamlScalar(e)).filter(Boolean)}_cleanYamlScalar(e){return null==e?"":String(e).trim().replace(/\s+#.*$/,"").replace(/^["']|["']$/g,"").trim()}_loadStoreModules(){return this._loadOnlineModules(!0)}async _loadOnlineModules(e=!1){if(!e){const e=this._getCachedModules();if(e&&e.length>0)return this._storeModules=e,this._storeLoading=!1,void this.requestUpdate()}this._storeLoading=!0,this._storeError=null,this.requestUpdate();try{const t=await this._fetchModulesFromDiscussions(e);t.length>0?(this._storeModules=t,this._setCachedModules(t)):this._storeModules=this._getBuiltinModules()}catch(e){console.error("[html-pro-card] Failed to load modules:",e),this._storeError=e.message,this._storeModules=this._getBuiltinModules()}this._storeLoading=!1,this.requestUpdate()}async _fetchModulesFromDiscussions(e=!1){const t=[];try{const o=e?`${MODULE_STORE_CONFIG.storeUrl}?_t=${Date.now()}`:MODULE_STORE_CONFIG.storeUrl,n=await fetch(o);if(!n.ok)throw new Error("Failed to fetch store.json");const r=await n.json();for(const o of r)try{const n=e?`${MODULE_STORE_CONFIG.rawBase}${o.file}?_t=${Date.now()}`:`${MODULE_STORE_CONFIG.rawBase}${o.file}`,r=await fetch(n);if(!r.ok)continue;const i=await r.text(),s={},a=i.split("\n");let l=0;for(let e=0;e<a.length;e++){const t=a[e];if(!t.startsWith("#")){l=e;break}const o=t.match(/^#\s*(\w+):\s*(.+)/);o&&(s[o[1].toLowerCase()]=o[2].trim())}const c=a.slice(l).join("\n").trim(),d={id:o.id||s.id||"",name:o.name||s.name||"Untitled",version:o.version||s.version||"1.0",creator:o.creator||s.author||"Community",description:o.description||s.description||"",image:o.image||s.image||"",link:o.link||s.link||"",tags:o.tags||(s.tags?s.tags.split(",").map(e=>e.trim()):[]),_yaml:c,_cardConfig:this._parseCardYaml(c)};d.code=d._cardConfig?.content||"",t.push(d)}catch(e){console.warn(`[html-pro-card] Failed to load ${o.file}:`,e)}}catch(e){console.warn("[html-pro-card] Failed to fetch store:",e)}if(0===t.length)return this._getBuiltinModules();t.sort((e,t)=>Number(t.id)-Number(e.id));const o=new Set;return t.filter(e=>{const t=e.name||e.id;return!o.has(t)&&(o.add(t),!0)})}_extractTagsFromTitle(e){const t=e.match(/^\[([^\]]+)\]/);return t?t[1].split(/[,，、]/).map(e=>e.trim()).filter(Boolean):[]}_getBuiltinModules(){return[{id:"clock",name:"Digital Clock",version:"1.0",creator:"knoop7",description:"A simple digital clock with customizable style",supported:["button","separator"],code:'<style>.clock{font-size:48px;font-family:monospace;text-align:center;padding:40px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:16px}</style><div class="clock" id="clock">00:00:00</div><script>setInterval(function(){$("#clock").textContent=new Date().toLocaleTimeString();},1000);<\/script>'},{id:"avatar-card",name:"Avatar Card",version:"1.0",creator:"knoop7",description:"User profile card with avatar and stats",supported:["button"],code:'<style>.avatar-card{padding:24px;background:#fff;border-radius:16px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.08)}.avatar-img{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff}.avatar-name{font-size:18px;font-weight:600;color:#333;margin-bottom:4px}.avatar-role{font-size:12px;color:#999}</style><div class="avatar-card"><div class="avatar-img">👤</div><div class="avatar-name">Smart Home</div><div class="avatar-role">Admin</div></div>'}]}_renderOnlineModules(){if(this._storeError)return html`<div class="store-error">
        ${this._t("loadError")}: ${this._storeError}
      </div>`;const e=this._storeModules.filter(e=>{if(!this._storeSearch)return!0;const t=this._storeSearch.toLowerCase().split(/\s+/).filter(e=>e),o=(e._tags||e.tags||[]).map(e=>e.toLowerCase()),n=(e.name||"").toLowerCase(),r=(e.description||e.desc||"").toLowerCase(),i=(e.creator||e.author||"").toLowerCase();return t.every(e=>{const t=e.startsWith("#")?e.slice(1):e;return!!o.some(e=>e.includes(t))||(!!n.includes(e)||(!!r.includes(e)||!!i.includes(e)))})});return 0===e.length?html`<div class="store-loading">${this._t("noModules")}</div>`:html`${e.map(e=>this._renderModuleCard(e))}`}_renderSkeleton(){return html`
      ${[1,2,3].map(()=>html`
          <div class="store-skeleton">
            <div class="store-skeleton-left"></div>
            <div class="store-skeleton-right">
              <div class="skeleton-line title"></div>
              <div class="skeleton-line desc"></div>
              <div class="skeleton-line desc2"></div>
              <div class="skeleton-line btn"></div>
            </div>
          </div>
        `)}
    `}_renderModuleCard(e){const t=e.version||"1.0",o=e.creator||e.author||"Community",n=e.description||e.desc||"",r=(e._tags||e.tags,e.link||""),i=e.image||"";return html`
      <div class="store-item">
        <div class="store-item-left">
          ${i?html`
                <img
                  src="${i}"
                  alt="${e.name}"
                  loading="lazy"
                  @error=${e=>this._replaceStoreImageFallback(e.currentTarget)}
                />
              `:html`
                <div class="store-item-left-placeholder">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              `}
        </div>
        <div class="store-item-right">
          <div class="store-item-header">
            <div class="store-item-title-group">
              <h4>${e.name}</h4>
            </div>
            <span class="store-item-version">v${t}</span>
          </div>
          <p class="store-item-desc">
            ${n?n.length>80?n.slice(0,80)+"...":n:""}
            <span
              class="store-item-author"
              @click="${e=>{e.stopPropagation(),window.open(`https://github.com/${o}`,"_blank")}}"
              >@${o}</span
            >
          </p>
          <div class="store-item-actions">
            ${r?html`<button
                  class="store-item-btn"
                  @click="${()=>window.open(r,"_blank")}"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  ${this._t("viewSource")}
                </button>`:""}
            <div class="slide-track" data-module-id="${e.id||e.name}">
              <span class="slide-hint">${this._t("slideToImport")}</span>
              <div
                class="slide-handle"
                @mousedown="${t=>this._startSlide(t,e)}"
                @touchstart="${t=>this._startSlide(t,e)}"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}_replaceStoreImageFallback(e){if(!e||e.dataset.htmlProFallbackApplied)return;e.dataset.htmlProFallbackApplied="true";const t=document.createElement("div");t.className="store-item-left-placeholder",t.innerHTML='\n      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">\n        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>\n        <circle cx="8.5" cy="8.5" r="1.5"></circle>\n        <polyline points="21 15 16 10 5 21"></polyline>\n      </svg>\n    ',e.replaceWith(t)}_previewImage(e){const t=document.createElement("div");t.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out",t.innerHTML=`<img src="${e}" style="max-width:90%;max-height:90%;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.5)"/>`,t.onclick=()=>t.remove(),document.body.appendChild(t)}_startSlide(e,t){e.preventDefault();const o=e.currentTarget,n=o.parentElement,r=n.querySelector(".slide-hint"),i=e.touches?e.touches[0].clientX:e.clientX,s=n.clientWidth-o.clientWidth-6;o.style.transition="none",n.classList.add("active");const a=e=>{let t=(e.touches?e.touches[0].clientX:e.clientX)-i;t<0&&(t=0),t>s&&(t=s),o.style.transform=`translateX(${t}px)`,r&&(r.style.opacity=String(1-t/s))},l=()=>{document.removeEventListener("mousemove",a),document.removeEventListener("mouseup",l),document.removeEventListener("touchmove",a),document.removeEventListener("touchend",l);const e=new WebKitCSSMatrix(getComputedStyle(o).transform).m41;o.style.transition="transform 0.3s ease",e>=.85*s?(o.style.transform=`translateX(${s}px)`,n.classList.add("active"),setTimeout(()=>{this._importModule(t),o.style.transform="translateX(0)",n.classList.remove("active"),r&&(r.style.opacity="0.7")},200)):(o.style.transform="translateX(0)",n.classList.remove("active"),r&&(r.style.opacity="0.7"))};document.addEventListener("mousemove",a),document.addEventListener("mouseup",l),document.addEventListener("touchmove",a,{passive:!0}),document.addEventListener("touchend",l)}_renderSavedModules(){const e=this._savedModules.filter(e=>!this._storeSearch||e.name.toLowerCase().includes(this._storeSearch.toLowerCase()));return 0===e.length?html`<div class="store-loading">
        ${this._t("noCustomModules")}
      </div>`:e.map((e,t)=>html`
        <div class="store-item">
          <div class="store-item-info">
            <h4>${e.name}</h4>
            <p>${e.desc||this._t("customModule")}</p>
          </div>
          <div class="store-item-actions">
            <button
              class="store-item-btn import"
              @click="${()=>this._importModule(e)}"
            >
              ${this._t("import")}
            </button>
            <button
              class="store-item-btn delete"
              @click="${()=>this._deleteModule(t)}"
            >
              ${this._t("delete")}
            </button>
          </div>
        </div>
      `)}async _importModule(e){if(!this._config)return;let t;if(e._cardConfig)t={...this._config,...e._cardConfig,type:"custom:html-pro-card"};else{const o=e.code||e.content||"";t={...this._config,content:o,do_not_parse:_hasExecutableScript(o),update_interval:this._config.update_interval||1e4,ignore_line_breaks:!0,scripts:e.scripts||this._config.scripts||[]}}e.editor&&Array.isArray(e.editor)&&(t._moduleEditor=e.editor,t._moduleName=e.name),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0})),this.requestUpdate(),setTimeout(()=>{this.shadowRoot&&(this.shadowRoot.activeElement?.blur(),document.activeElement?.blur())},50)}_deleteModule(e){confirm(this._t("confirmDelete"))&&(this._savedModules=this._savedModules.filter((t,o)=>o!==e),this._saveSavedModules(),this.requestUpdate())}}customElements.get("html-pro-card-editor")||customElements.define("html-pro-card-editor",HtmlTemplateCardEditor);class HtmlTemplateCard extends HTMLElement{static get properties(){return{hass:{type:Object},_config:{type:Object}}}static async getConfigElement(){return document.createElement("html-pro-card-editor")}static preProcessScripts(e){return"string"==typeof e.scripts&&(e.scripts=e.scripts.split("\n").filter(e=>""!==e.trim())),e}static getStubConfig(){return{content:"<style>\n.pro{padding:20px}\n.pro-h{display:flex;align-items:center;gap:16px;margin-bottom:12px}\n.pro-icon{width:36px;height:36px;color:var(--primary-color)}\n.pro-t{font-size:14px;font-weight:500;color:var(--primary-text-color)}\n.pro-sub{font-size:13px;color:var(--secondary-text-color);opacity:0.7}\n.pro-c{font-size:12px;color:var(--secondary-text-color);line-height:1.6}\n</style>\n<div class=\"pro\">\n<div class=\"pro-h\">\n<svg class=\"pro-icon\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M13 2V3H12V9H11V10H9V11H8V12H7V13H5V12H4V11H3V9H2V15H3V16H4V17H5V18H6V22H8V21H7V20H8V19H9V18H10V19H11V22H13V21H12V17H13V16H14V15H15V12H16V13H17V11H15V9H20V8H17V7H22V3H21V2M14 3H15V4H14Z\"/></svg>\n<div><span class=\"pro-t\">HTML Pro Card</span><div class=\"pro-sub\" id=\"pro-sub\"></div></div>\n</div>\n<div class=\"pro-c\" id=\"pro-desc\"></div>\n</div>\n<script>\nvar hass = document.querySelector('home-assistant')?.hass;\nvar lang = (hass?.language || navigator.language || '').toLowerCase();\nvar desc = {\n  'zh-cn': '是一款专为 Home Assistant 设计的高级 HTML 卡片组件。它支持完整的 Jinja2 模板语法，让您可以动态获取任意实体的状态、属性和历史数据。通过内置的服务调用接口，您可以直接在卡片中控制灯光、开关、空调等设备。卡片支持自定义 CSS 样式和外部 JavaScript 脚本，让您能够创建独一无二的交互式仪表盘。',\n  'zh-hk': '是一款專為 Home Assistant 設計的高級 HTML 卡片組件。它支持完整的 Jinja2 模板語法，讓您可以動態獲取任意實體的狀態、屬性和歷史數據。通過內置的服務調用接口，您可以直接在卡片中控制燈光、開關、空調等設備。卡片支持自定義 CSS 樣式和外部 JavaScript 腳本，讓您能夠創建獨一無二的交互式儀表盤。',\n  'ja': 'Home Assistant 向けに設計された高度な HTML カードコンポーネントです。完全な Jinja2 テンプレート構文をサポートし、任意のエンティティの状態、属性、履歴データを動的に取得できます。組み込みのサービス呼び出しにより、照明、スイッチ、エアコンなどのデバイスをカードから直接制御できます。カスタム CSS と外部 JavaScript により、ユニークなインタラクティブダッシュボードを作成できます。',\n  'de': 'ist eine erweiterte HTML-Kartenkomponente für Home Assistant. Sie unterstützt die vollständige Jinja2-Vorlagensyntax und ermöglicht den dynamischen Zugriff auf Entitätszustände, Attribute und Verlaufsdaten. Mit integrierten Serviceaufrufen können Sie Lichter, Schalter und Klimageräte direkt steuern. Benutzerdefiniertes CSS und externe JS-Skripte ermöglichen einzigartige interaktive Dashboards.',\n  'en': 'is an advanced HTML card component designed for Home Assistant. It supports full Jinja2 template syntax, allowing you to dynamically access any entity state, attributes and history. With built-in service calls, you can control lights, switches, climate devices directly. Custom CSS and external JS scripts enable unique interactive dashboards.'\n};\nvar text = desc[lang] || (lang.startsWith('zh-tw') || lang.startsWith('zh-hk') ? desc['zh-tw'] : lang.startsWith('zh') ? desc['zh-cn'] : lang.startsWith('ja') ? desc['ja'] : lang.startsWith('de') ? desc['de'] : desc['en']);\n$('#pro-sub').textContent = 'By knoop7';\n$('#pro-desc').textContent = text;\n<\/script>",update_interval:1e4,do_not_parse:!1,ignore_line_breaks:!0,scripts:[]}}connectedCallback(){this._instanceId||(this._instanceId="hpc_"+Math.random().toString(36).slice(2,9)),this._createRootElement(),this._setupEventListeners(),this._config&&this._hass&&this._processAndRender()}disconnectedCallback(){if(this._timeUpdateInterval&&(clearInterval(this._timeUpdateInterval),this._timeUpdateInterval=null),this._removeEventListeners(),this._templateSubscription){try{this._templateSubscription()}catch{}this._templateSubscription=null}const e=window._htmlProCardOverlay;if(e&&this._instanceId&&e.querySelectorAll(`[data-hpc-owner="${this._instanceId}"]`).forEach(e=>e.remove()),this._styleObservers&&(this._styleObservers.forEach(e=>e.disconnect()),this._styleObservers=[]),window._htmlProCardLightDOMContainer&&this._instanceId){const e=window._htmlProCardLightDOMContainer.querySelector(`[data-card-id="${this._instanceId}"]`);e&&e.remove()}}_createRootElement(){this._rootElement&&this.contains(this._rootElement)||(this._rootElement=document.createElement("ha-card"),this._rootElement.style.borderRadius="10px",this._rootElement.style.overflow="hidden",this.appendChild(this._rootElement))}_setupEventListeners(){this._rootElement&&(this._boundHandlers||(this._boundHandlers={touchStart:this._handleTouchStart.bind(this),touchEnd:this._handleTouchEnd.bind(this),mouseDown:this._handleMouseDown.bind(this),mouseUp:this._handleMouseUp.bind(this),click:this._handleClick.bind(this)},this._rootElement.addEventListener("touchstart",this._boundHandlers.touchStart,{passive:!0}),this._rootElement.addEventListener("touchend",this._boundHandlers.touchEnd),this._rootElement.addEventListener("touchcancel",this._boundHandlers.touchEnd),this._rootElement.addEventListener("mousedown",this._boundHandlers.mouseDown),this._rootElement.addEventListener("mouseup",this._boundHandlers.mouseUp),this._rootElement.addEventListener("click",this._boundHandlers.click)))}_removeEventListeners(){this._rootElement&&this._boundHandlers&&(this._rootElement.removeEventListener("touchstart",this._boundHandlers.touchStart),this._rootElement.removeEventListener("touchend",this._boundHandlers.touchEnd),this._rootElement.removeEventListener("touchcancel",this._boundHandlers.touchEnd),this._rootElement.removeEventListener("mousedown",this._boundHandlers.mouseDown),this._rootElement.removeEventListener("mouseup",this._boundHandlers.mouseUp),this._rootElement.removeEventListener("click",this._boundHandlers.click),this._boundHandlers=null)}_handleTouchStart(e){const t=e.target.closest("[data-long-press]");if(!t)return;const o=t.dataset.entity;o&&(this._longPressTimeout=setTimeout(()=>{this._showMoreInfo(o),this._longPressTimeout=null},500))}_handleTouchEnd(){this._longPressTimeout&&(clearTimeout(this._longPressTimeout),this._longPressTimeout=null)}_handleMouseDown(e){const t=e.target.closest("[data-long-press]");if(!t)return;const o=t.dataset.entity;o&&(this._longPressTimeout=setTimeout(()=>{this._showMoreInfo(o),this._longPressTimeout=null},500))}_handleMouseUp(){this._longPressTimeout&&(clearTimeout(this._longPressTimeout),this._longPressTimeout=null)}_handleClick(e){if(this._longPressTimeout)return clearTimeout(this._longPressTimeout),void(this._longPressTimeout=null);const t=e.target.closest("[data-action]");if(t){const e=t.dataset.entity||t.closest("[data-entity]")?.dataset.entity,o=t.dataset.action;if(!e||!o)return;if("toggle"===o)this._callService(e,"toggle");else if("turn_on"===o)this._callService(e,"turn_on");else if("turn_off"===o)this._callService(e,"turn_off");else if("more-info"===o)this._showMoreInfo(e);else{const[t]=e.split(".");this._hass?.callService(t,o,{entity_id:e})}return}}_showMoreInfo(e){if(!e)return;const t=new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0});this.dispatchEvent(t)}_toggle(e){if(!e||!this._hass?.states[e])return;const t=e.split(".")[0];["light","switch","fan","input_boolean","automation","script","cover","lock","media_player"].includes(t)?this._hass.callService(t,"toggle",{entity_id:e}):this._showMoreInfo(e)}set hass(e){const t=this._hass;if(this._hass=e,this._rootElement&&(this._rootElement.hass=e),!this._config)return;this._entities||this._calculateEntities();if(this._shouldUpdate(t)&&(this._config.do_not_parse?this._updateStates():this._processAndRender(),this._rootElement&&"function"==typeof this._rootElement._onHassUpdate))try{this._rootElement._onHassUpdate(e)}catch{}}_setupTimeUpdate(){if(this._timeUpdateInterval&&clearInterval(this._timeUpdateInterval),this._config.update_interval&&this._config.update_interval>0){const e=Math.max(this._config.update_interval,1e3);this._timeUpdateInterval=setInterval(()=>{this._config.do_not_parse?this._updateStates():this._processAndRender()},e)}}_processAndRender(){this._rootElement&&this._config&&this._hass&&(this._renderDebounce&&clearTimeout(this._renderDebounce),this._renderDebounce=setTimeout(()=>{try{this._renderContent()}catch{this._renderFallback()}},50))}_renderContent(){let e=this._config.content||"";if(this._config.ignore_line_breaks||(e=e.replace(/\r?\n|\r/g,"")),this._config.do_not_parse)this._render(e);else{if(this._templateSubscription){try{this._templateSubscription()}catch{}this._templateSubscription=null}try{this._hass.connection.subscribeMessage(e=>{try{this._render(e.result)}catch(e){this._renderError("Render error: "+(e.message||e))}},{type:"render_template",template:e}).then(e=>{this._templateSubscription=e}).catch(e=>{this._renderError("Template error: "+(e.message||e))})}catch(e){this._renderError("Template error: "+(e.message||e))}}}async _loadExternalScripts(e){const t=e.map(e=>this._loadScript(e));return Promise.all(t)}async _loadScript(e){_globalLoadedScripts.has(e)||(_globalLoadedScripts.add(e),await new Promise((t,o)=>{const n=document.createElement("script");n.async=!0,n.src=e,n.onload=t,n.onerror=()=>{_globalLoadedScripts.delete(e),o(new Error("Failed: "+e))},document.body.appendChild(n)}))}_isPrerenderScript(e){return/(?:tailwindcss|twcss|unocss|windi|twind)\b/i.test(e)}_getPrerenderScripts(){const e=this._config.scripts;return e&&Array.isArray(e)?e.filter(e=>this._isPrerenderScript(e)):[]}_getNonPrerenderScripts(){const e=this._config.scripts;return e&&Array.isArray(e)?e.filter(e=>!this._isPrerenderScript(e)):[]}_updateLightDOMShadow(e){if(!window._htmlProCardLightDOMContainer){const e=document.createElement("div");e.id="html-pro-card-light-dom-container",e.style.cssText="position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;pointer-events:none;",document.body.appendChild(e),window._htmlProCardLightDOMContainer=e}let t=window._htmlProCardLightDOMContainer.querySelector(`[data-card-id="${this._instanceId}"]`);t||(t=document.createElement("div"),t.setAttribute("data-card-id",this._instanceId),window._htmlProCardLightDOMContainer.appendChild(t)),t.innerHTML=e}_isPrerenderStyleTag(e){if(e.id&&/(?:tailwind|unocss|windi|twind)/i.test(e.id))return!0;if(e.hasAttribute("data-tailwind")||e.hasAttribute("data-unocss"))return!0;const t=e.textContent||"";if(/(?:--tw-|tailwind|unocss|windi|twind)/i.test(t))return!0;try{if(e.sheet&&e.sheet.cssRules)for(let t=0;t<Math.min(e.sheet.cssRules.length,10);t++){const o=e.sheet.cssRules[t].cssText||"";if(/(?:--tw-|tailwind|unocss|windi|twind)/i.test(o))return!0}}catch(e){}return!1}_clonePrerenderStylesToCard(){if(!this._rootElement)return;this._styleObservers||(this._styleObservers=[]),this._rootElement.classList.add("html-pro-prerender-style-root"),this._rootElement.querySelectorAll(".html-pro-prerender-style").forEach(e=>e.remove());const e=document.head.querySelectorAll("style");for(const t of e){if(!this._isPrerenderStyleTag(t))continue;const e=document.createElement("style");e.classList.add("html-pro-prerender-style"),this._rootElement.appendChild(e);const o=()=>{let o=t.textContent||"";if(!o&&t.sheet&&t.sheet.cssRules)try{const e=[];for(let o=0;o<t.sheet.cssRules.length;o++)e.push(t.sheet.cssRules[o].cssText);o=e.join("\n")}catch(e){}o&&(e.textContent=`.html-pro-prerender-style-root {\n${o}\n}`)},n=new MutationObserver(o);n.observe(t,{characterData:!0,childList:!0,subtree:!0}),this._styleObservers.push(n),o()}}_scheduleStyleSync(){this._clonePrerenderStylesToCard();[100,500,1e3,2e3].forEach(e=>{setTimeout(()=>{this._rootElement&&this._clonePrerenderStylesToCard()},e)})}_applyPreviewCompactStyles(){if(this._rootElement)if(this._rootElement.classList.add("html-pro-prerender-style-root"),this._isEditorPreview()){this._rootElement.classList.add("editor-preview");let e=this._rootElement.querySelector(".html-pro-preview-compact-style");e||(e=document.createElement("style"),e.classList.add("html-pro-preview-compact-style"),e.textContent="\n          .html-pro-prerender-style-root.editor-preview {\n            flex-shrink: 0 !important;\n            min-height: min-content !important;\n            max-height: none !important;\n            display: block !important;\n          }\n        ",this._rootElement.appendChild(e))}else{this._rootElement.classList.remove("editor-preview");const e=this._rootElement.querySelector(".html-pro-preview-compact-style");e&&e.remove()}}_render(e){if(!this._rootElement||!this._hass)return;if(this._lastContent===e&&this._rendered)return;this._lastContent=e;const t=this._getPrerenderScripts(),o='\n            <div class="html-pro-loading-skeleton" aria-hidden="true">\n              <div class="html-pro-loading-skeleton-line hero"></div>\n              <div class="html-pro-loading-skeleton-line title"></div>\n              <div class="html-pro-loading-skeleton-line body-1"></div>\n              <div class="html-pro-loading-skeleton-line body-2"></div>\n              <div class="html-pro-loading-skeleton-line body-3"></div>\n            </div>\n          ';t.length>0?(this._rootElement.classList.add("html-pro-loading"),this._rootElement.classList.remove("html-pro-rendering"),this._updateLightDOMShadow(e)):(this._rootElement.classList.remove("html-pro-loading"),this._rootElement.classList.add("html-pro-rendering"));const n=()=>{try{if(this._applyPreviewCompactStyles(),window.hassTemplateCard={hass:this._hass,config:this._config,root:this._rootElement},window._htmlProCardRoots.add(this._rootElement),this._isEditorPreview()?this._rootElement.innerHTML=`\n            <div class="html-pro-preview-wrapper" style="overflow: auto !important; display: block !important; width: 100%; box-sizing: border-box;">\n              ${e}\n            </div>\n            ${o}\n          `:this._rootElement.innerHTML=`\n            ${e}\n            ${o}\n          `,this._applyImageFallbacks(),this._setupClickHandlers(this._rootElement),t.length>0?(this._scheduleStyleSync(),setTimeout(()=>{this._rootElement&&(this._rootElement.classList.remove("html-pro-loading"),this._rootElement.querySelectorAll(".html-pro-loading-skeleton").forEach(e=>e.remove()))},350)):requestAnimationFrame(()=>{setTimeout(()=>{this._rootElement&&(this._rootElement.classList.remove("html-pro-rendering"),this._rootElement.querySelectorAll(".html-pro-loading-skeleton").forEach(e=>e.remove()))},180)}),!this._rendered){this._rendered=!0;const e=this._getNonPrerenderScripts();e.length>0?this._loadExternalScripts(e).then(()=>{setTimeout(()=>this._executeInlineScripts(),200)}).catch(()=>{setTimeout(()=>this._executeInlineScripts(),200)}):setTimeout(()=>this._executeInlineScripts(),0)}this._validateRendered(),this.dispatchEvent(new CustomEvent("content-rendered",{bubbles:!0,composed:!0,detail:{hass:this._hass,config:this._config}}))}catch(e){this._renderError("Render error: "+(e.message||e))}};!this._rendered&&t.length>0?this._loadExternalScripts(t).then(n).catch(n):n()}_applyImageFallbacks(){this._rootElement&&this._rootElement.querySelectorAll("img").forEach(e=>{e.dataset.htmlProImageFallbackBound||(e.dataset.htmlProImageFallbackBound="true",e.addEventListener("error",()=>this._replaceBrokenImage(e),{once:!0}),e.complete&&0===e.naturalWidth&&this._replaceBrokenImage(e))})}_replaceBrokenImage(e){if(!e||!e.parentElement||e.dataset.htmlProFallbackApplied)return;e.dataset.htmlProFallbackApplied="true";const t=e.getBoundingClientRect(),o=getComputedStyle(e),n=document.createElement("span");n.className="html-pro-image-fallback",n.setAttribute("role","img"),n.setAttribute("aria-label",e.alt||"Image unavailable");const r=t.width>0?`${t.width}px`:o.width||"100%",i=t.height>0?`${t.height}px`:o.height||"140px";n.style.setProperty("--html-pro-fallback-width",r),n.style.setProperty("--html-pro-fallback-height",i),n.style.borderRadius=o.borderRadius,n.style.margin=o.margin,"block"===o.display&&n.style.setProperty("display","flex","important"),e.replaceWith(n)}_isEditorPreview(){try{let e=this.parentElement;for(let t=0;t<5&&e;t++){if("hui-card"===e.localName&&e.hasAttribute("preview"))return!0;if("hui-card-preview"===e.localName)return!0;e=e.parentElement||e.getRootNode()?.host}}catch{}return!1}_renderError(e){this._rootElement&&this._isEditorPreview()&&(this._rootElement.innerHTML="",this._clearErrorBanners(),this.appendChild(this._createErrorCard(e,"error")),console.error("[html-pro-card]",e))}_validateRendered(){if(!this._rootElement||!this._hass||!this._entities)return;if(!this._isEditorPreview())return;this._clearErrorBanners();const e=[];for(const t of this._entities)this._hass.states[t]||e.push(t);0!==e.length&&this.appendChild(this._createErrorCard("Entity not found: "+e.join(", "),"warning"))}_clearErrorBanners(){this.querySelectorAll(":scope > .hpc-error-banner").forEach(e=>e.remove())}_createErrorCard(e,t){const o=document.createElement("div");o.className="hpc-error-banner",o.dataset.severity=t||"error";const n="warning"===t,r=n?"var(--warning-color,#ffa726)":"var(--error-color,#db4437)",i=n?'<path d="M1,21H23L12,2Zm12-3H11V16h2Zm0-4H11V10h2Z"/>':'<path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"/>';return o.style.cssText="position:relative;border-radius:var(--ha-card-border-radius,12px);overflow:hidden;margin:4px 0;",o.innerHTML='<div style="position:absolute;inset:0;background:'+r+';opacity:0.12;pointer-events:none;border-radius:inherit"></div><div style="display:flex;align-items:center;gap:8px;padding:12px 16px;position:relative"><svg viewBox="0 0 24 24" style="width:24px;height:24px;flex-shrink:0;fill:'+r+'">'+i+'</svg><span style="font-size:13px;font-weight:500;color:var(--primary-text-color,#212121);overflow:hidden;text-overflow:ellipsis;word-break:break-word;line-height:1.4">'+e.replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</span></div>",o}async _executeInlineScripts(){if(!this._rootElement)return;const e=Array.from(this._rootElement.querySelectorAll("script")),t=this._rootElement,o=this,n=window._htmlProCardOverlay,r=o._instanceId,i=new Proxy(n,{get(e,t){if("appendChild"===t||"append"===t||"prepend"===t)return(...o)=>(o.forEach(e=>{e?.setAttribute&&e.setAttribute("data-hpc-owner",r)}),e[t](...o));const o=e[t];return"function"==typeof o?o.bind(e):o}}),s=e.filter(e=>e.src).map(e=>e.src);if(s.length>0)try{await this._loadExternalScripts(s)}catch(e){console.warn("[html-pro-card] failed to load some inline content external scripts:",e)}e.forEach(e=>{if(e.src)return;const n=e.textContent.trim();n&&setTimeout(()=>{(async()=>{try{const r="text/typescript"===e.type||"application/typescript"===e.type?await window.claw.ts.transpile(n):n,s=new Function("root","card","$","$$","hass","config","overlay",r),a=new Proxy({},{get:(e,t)=>{const n=o._hass[t];return"function"==typeof n?n.bind(o._hass):n}});s(t,t,e=>t.querySelector(e),e=>t.querySelectorAll(e),a,o._config,i)}catch(e){console.error("[html-pro-card] script error:",e)}})()},100)})}_setupClickHandlers(e){const t=this;e.querySelectorAll("[data-entity]").forEach(e=>{const o=e.dataset.entity,[n]=o.split(".");e.querySelectorAll("[data-action]").forEach(e=>{e.onclick=r=>{r.stopPropagation();const i=e.dataset.action;"toggle"===i?t._callService(o,"toggle"):"turn_on"===i?t._callService(o,"turn_on"):"turn_off"===i?t._callService(o,"turn_off"):"more-info"===i?t._showMoreInfo(o):t._hass.callService(n,i,{entity_id:o})}}),e.querySelectorAll('input[type="range"]').forEach(e=>{e.oninput=e=>e.stopPropagation(),e.onchange=n=>{n.stopPropagation();const r=parseFloat(n.target.value);void 0!==e.dataset.brightness?t._hass.callService("light","turn_on",{entity_id:o,brightness:Math.round(255*r/100)}):void 0!==e.dataset.temperature?t._hass.callService("climate","set_temperature",{entity_id:o,temperature:r}):void 0!==e.dataset.volume?t._hass.callService("media_player","volume_set",{entity_id:o,volume_level:r/100}):void 0!==e.dataset.position?t._hass.callService("cover","set_cover_position",{entity_id:o,position:r}):void 0!==e.dataset.speed&&t._hass.callService("fan","set_percentage",{entity_id:o,percentage:r}),setTimeout(()=>t._updateStates(),100)}}),e.querySelectorAll("select[data-option]").forEach(e=>{e.onchange=e=>{e.stopPropagation(),t._hass.callService("input_select","select_option",{entity_id:o,option:e.target.value}),setTimeout(()=>t._updateStates(),100)}}),e.querySelectorAll('input[type="number"][data-value]').forEach(e=>{e.onchange=e=>{e.stopPropagation(),t._hass.callService("input_number","set_value",{entity_id:o,value:parseFloat(e.target.value)}),setTimeout(()=>t._updateStates(),100)}})})}_callService(e,t){if(!this._hass)return;const[o]=e.split("."),n=this._hass.states[e];let r=o,i=t;"button"===o?i="press":"script"===o?(r="script",i=e.split(".")[1]):"scene"===o?i="turn_on":"automation"===o?i="toggle"===t?"toggle":"turn_off"===t?"turn_off":"trigger":"input_button"===o?i="press":"lock"===o?i="toggle"===t?"locked"===n?.state?"unlock":"lock":t:"cover"===o?i="toggle"===t?"open"===n?.state||"opening"===n?.state?"close_cover":"open_cover":t:"toggle"===t&&n&&(i="on"===n.state?"turn_off":"turn_on"),"script"===o?this._hass.callService(r,i,{}):this._hass.callService(r,i,{entity_id:e}),setTimeout(()=>this._updateStates(),100)}_renderFallback(){if(!this._rootElement||!this._hass)return;const e=(this._entities||[]).map(e=>{const t=this._hass.states[e];return t?`<div class="entity" data-entity="${e}"><div class="entity-name">${t.attributes.friendly_name||e}</div><div class="state-text">${t.state}</div></div>`:""}).join("");this._rootElement.innerHTML=e,this._processStyles(),this._setupEventListeners()}_updateStates(){if(this._entities&&this._hass&&this._rootElement)try{this._entities.forEach(e=>{const t=this._hass.states[e];if(!t)return;this._rootElement.querySelectorAll(`[data-entity="${e}"]`).forEach(o=>{try{o.dataset.state=t.state,o.querySelectorAll("[data-state-text]").forEach(e=>{const o=e.dataset.map;if(o)try{e.textContent=JSON.parse(o)[t.state]||t.state}catch{e.textContent=t.state}else e.textContent=t.state}),o.querySelectorAll("[data-attr]").forEach(e=>{const o=e.dataset.attr;e.textContent=t.attributes[o]??""}),o.querySelectorAll("[data-brightness]").forEach(e=>{const o=t.attributes.brightness;"INPUT"===e.tagName?e.value=o?Math.round(100*o/255):0:e.textContent=o?Math.round(100*o/255)+"%":"0%"}),o.querySelectorAll("[data-temperature]").forEach(e=>{e.textContent=t.attributes.temperature??t.attributes.current_temperature??""}),o.querySelectorAll("[data-friendly-name]").forEach(o=>{o.textContent=t.attributes.friendly_name||e})}catch{}})})}catch{}}_resolveWatchList(){const e=this._rootElement._watchedEntities,t=[],o=Object.keys(this._hass.states);for(const n of e)if(n.endsWith("."))for(const e of o)e.startsWith(n)&&t.push(e);else t.push(n);this._resolvedWatch={src:e,ids:t,count:o.length}}_shouldUpdate(e){if(!this._rendered)return!0;if(!e)return!1;if(this._config.always_update)return!0;if(!this._entities||0===this._entities.length){if(this._hasScript&&this._rootElement?._watchedEntities){const t=Object.keys(this._hass.states).length;this._resolvedWatch&&this._resolvedWatch.src===this._rootElement._watchedEntities&&this._resolvedWatch.count===t||this._resolveWatchList();const o=this._resolvedWatch?.ids;return!(!o||0===o.length)&&o.some(t=>e.states[t]!==this._hass.states[t])}return!1}return this._entities.some(t=>{const o=e.states[t],n=this._hass.states[t];return!(!o||!n)&&(o.state!==n.state||JSON.stringify(o.attributes)!==JSON.stringify(n.attributes))})}setConfig(e){const t=this._config;if(e={content:"",update_interval:1e4,do_not_parse:!1,ignore_line_breaks:!0,scripts:[],...e},!(e=this.constructor.preProcessScripts(e)).content)throw new Error("Content must be defined");if(e.scripts&&!Array.isArray(e.scripts))throw new Error("Scripts must be an array");const o=!t||t.content!==e.content||t.do_not_parse!==e.do_not_parse;this._hasScript=e.content.includes("<script"),this._config=e,o&&(this._rendered=!1,this._lastContent=null),this._calculateEntities(),this._rootElement||this._createRootElement(),this._setupEventListeners(),this._setupTimeUpdate(),this._hass&&this._rootElement&&this._processAndRender()}_calculateEntities(){this._entities=new Set,this._config.entities?.length&&this._config.entities.forEach(e=>{const t=String(e||"").trim().replace(/^["']|["']$/g,"").trim();t&&this._entities.add(t)});(this._config.content.match(/\b(?:light|switch|sensor|binary_sensor|climate|media_player|fan|cover|input_boolean|input_number|input_select|input_text|input_button|button|scene|script|automation|person|zone|weather|camera|vacuum|lock|number|select|text|timer|counter|group|device_tracker|water_heater|humidifier|siren|update|event|image|lawn_mower|valve|todo|date|time|datetime|schedule|notify|tts|remote|alarm_control_panel)\.[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g)||[]).forEach(e=>this._entities.add(e)),this._entities=Array.from(this._entities)}_processStyles(){const e=document.createElement("style");e.textContent='[data-entity]{cursor:pointer;-webkit-tap-highlight-color:transparent}input[type="range"]{-webkit-appearance:none;width:100%;background:transparent}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none}',this._rootElement.insertBefore(e,this._rootElement.firstChild)}getCardSize(){return 1}}customElements.get("html-pro-card")||customElements.define("html-pro-card",HtmlTemplateCard),window.customCards=window.customCards||[],window.customCards.push({type:"html-pro-card",name:"HTML Pro Card",preview:!0,description:"Advanced HTML card with Jinja2 template support"}),function(){if(window.claw)return;const e=()=>document.querySelector("home-assistant")?.hass,t=(window._htmlProCardOverlay||(()=>{const e=document.createElement("div");e.id="html-pro-card-overlay",e.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;",document.body.appendChild(e)})(),{hass:()=>e(),callService:(t,o,n)=>{const r=e();if(!r)throw new Error("hass not available");return r.callService(t,o,n||{})},state:t=>{const o=e();return o?.states?.[t]||null},states:t=>{const o=e();if(!o?.states)return{};if(!t)return o.states;const n={};for(const[e,r]of Object.entries(o.states))(e.startsWith(t)||e.includes(t))&&(n[e]=r);return n},toggle:e=>{const o=t.state(e);if(!o)return;const[n]=e.split("."),r="on"===o.state?"turn_off":"turn_on";return t.callService(n,r,{entity_id:e})},press:e=>{const[o]=e.split(".");return"button"===o||"input_button"===o?t.callService(o,"press",{entity_id:e}):"scene"===o?t.callService("scene","turn_on",{entity_id:e}):"script"===o?t.callService("script",e.split(".")[1],{}):"automation"===o?t.callService("automation","trigger",{entity_id:e}):t.toggle(e)},navigate:e=>{history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed"))},moreInfo:e=>{const t=new Event("hass-more-info",{bubbles:!0,composed:!0});t.detail={entityId:e},document.querySelector("home-assistant")?.dispatchEvent(t)},fire:(t,o)=>{const n=e();n?.connection&&n.connection.sendMessage({type:"fire_event",event_type:t,event_data:o||{}})},ws:t=>{const o=e();if(!o?.connection)throw new Error("ws not available");return o.connection.sendMessagePromise(t)},el:(e,t,o)=>{const n=document.createElement(e);return"string"==typeof t?n.style.cssText=t:t&&Object.entries(t).forEach(([e,t])=>"style"===e?n.style.cssText=t:"text"===e?n.textContent=t:n.setAttribute(e,t)),o?o.appendChild(n):document.body.appendChild(n),n},remove:e=>{const t="string"==typeof e?document.getElementById(e):e;t&&t.remove()},inject:e=>{const t=document.createElement("style");return t.textContent=e,document.head.appendChild(t),{remove:()=>t.remove()}},wait:e=>new Promise(t=>setTimeout(t,e)),deepQuery:e=>{const t=o=>{if(!o)return null;let n=o.querySelector?.(e);if(n)return n;const r=o.querySelectorAll?.("*")||[];for(const e of r)if(e.shadowRoot&&(n=t(e.shadowRoot),n))return n;return null};return t(document)},deepQueryAll:e=>{const t=[],o=n=>{n&&(n.querySelectorAll?.(e)?.forEach(e=>t.push(e)),n.querySelectorAll?.("*")?.forEach(e=>{e.shadowRoot&&o(e.shadowRoot)}))};return o(document),t}}),o=(()=>{let e;return()=>window.ts?.transpileModule?Promise.resolve(window.ts):e||(e=new Promise((e,t)=>{const o=document.querySelector("script[data-html-pro-ts]");if(o)return o.addEventListener("load",()=>e(window.ts),{once:!0}),void o.addEventListener("error",t,{once:!0});const n=document.createElement("script");n.src="https://cdn.jsdelivr.net/npm/typescript@5.6.3/lib/typescript.js",n.async=!0,n.dataset.htmlProTs="1",n.onload=()=>window.ts?.transpileModule?e(window.ts):t(new Error("TypeScript compiler not available")),n.onerror=()=>t(new Error("Failed to load TypeScript compiler")),document.head.appendChild(n)}),e)})(),n=async(e,t={})=>{const n=await o(),r=n.transpileModule(e,{compilerOptions:{target:n.ScriptTarget.ES2020,module:n.ModuleKind.None,useDefineForClassFields:!1,importsNotUsedAsValues:n.ImportsNotUsedAsValues?.Remove,...t},reportDiagnostics:!0}),i=(r.diagnostics||[]).filter(e=>e.category===n.DiagnosticCategory.Error);if(i.length){const e=i.map(e=>n.flattenDiagnosticMessageText(e.messageText,"\n")).join("\n");throw new Error(e)}return r.outputText};t.options={list:async()=>e().callWS({type:"config_entries/get"}),async find(e){return(await this.list()).find(t=>t.domain===e||t.title===e||t.entry_id===e)},async dialog(o,n){const r="string"==typeof o?await this.find(o):o;if(!r)throw new Error("Entry not found: "+o);const i=document.querySelector("home-assistant"),s=e(),a=r.domain;await Promise.all([new Promise(e=>{if(customElements.get("dialog-data-entry-flow"))return void e();const o=customElements.define.bind(customElements);customElements.define=function(t,n,r){o(t,n,r),"dialog-data-entry-flow"===t&&(customElements.define=o,e())},t.navigate("/config/integrations"),setTimeout(()=>{customElements.define=o,e()},5e3)}),s.loadFragmentTranslation("config"),s.loadBackendTranslation("options",a),s.loadBackendTranslation("selector",a)]),((e,t,o)=>{const n=new Event(t,{bubbles:!0,cancelable:!1,composed:!0});n.detail=o||{},e.dispatchEvent(n)})(i,"show-dialog",{dialogTag:"dialog-data-entry-flow",dialogImport:()=>Promise.resolve(),dialogParams:{startFlowHandler:r.entry_id,domain:a,manifest:null,dialogClosedCallback:n,flowConfig:{flowType:"options_flow",showDevices:!1,createFlow:(e,t)=>e.callApi("POST","config/config_entries/options/flow",{handler:t}),fetchFlow:(e,t)=>e.callApi("GET",`config/config_entries/options/flow/${t}`),handleFlowStep:(e,t,o)=>e.callApi("POST",`config/config_entries/options/flow/${t}`,o),deleteFlow:(e,t)=>e.callApi("DELETE",`config/config_entries/options/flow/${t}`),renderAbortDescription:(e,t)=>e.localize(`component.${t.translation_domain||a}.options.abort.${t.reason}`,t.description_placeholders)||t.reason,renderShowFormStepHeader:(e,t)=>e.localize(`component.${t.translation_domain||a}.options.step.${t.step_id}.title`,t.description_placeholders)||e.localize("ui.dialogs.options_flow.form.header"),renderShowFormStepDescription:(e,t)=>e.localize(`component.${t.translation_domain||a}.options.step.${t.step_id}.description`,t.description_placeholders)||"",renderShowFormStepFieldLabel:(e,t,o,n)=>{const r=n?.path?.[0]?`sections.${n.path[0]}.`:"";return e.localize(`component.${a}.options.step.${t.step_id}.${r}data.${o.name}`,t.description_placeholders)||o.name},renderShowFormStepFieldHelper:(e,t,o,n)=>{const r=n?.path?.[0]?`sections.${n.path[0]}.`:"";return e.localize(`component.${t.translation_domain||a}.options.step.${t.step_id}.${r}data_description.${o.name}`,t.description_placeholders)||""},renderShowFormStepFieldError:(e,t,o)=>e.localize(`component.${t.translation_domain||a}.options.error.${o}`,t.description_placeholders)||o,renderShowFormStepFieldLocalizeValue:(e,t,o)=>e.localize(`component.${a}.selector.${o}`),renderShowFormStepSubmitButton:(e,t)=>e.localize(`component.${a}.options.step.${t.step_id}.submit`)||e.localize("ui.panel.config.integrations.config_flow."+(!1===t.last_step?"next":"submit")),renderExternalStepHeader:()=>"",renderExternalStepDescription:()=>"",renderCreateEntryDescription:e=>e.localize("ui.dialogs.options_flow.success.description"),renderShowFormProgressHeader:(e,t)=>e.localize(`component.${a}.options.step.${t.step_id}.title`)||e.localize(`component.${a}.title`),renderShowFormProgressDescription:(e,t)=>e.localize(`component.${t.translation_domain||a}.options.progress.${t.progress_action}`,t.description_placeholders)||"",renderMenuHeader:(e,t)=>e.localize(`component.${a}.options.step.${t.step_id}.title`)||e.localize(`component.${a}.title`),renderMenuDescription:(e,t)=>e.localize(`component.${t.translation_domain||a}.options.step.${t.step_id}.description`,t.description_placeholders)||"",renderMenuOption:(e,t,o)=>e.localize(`component.${t.translation_domain||a}.options.step.${t.step_id}.menu_options.${o}`,t.description_placeholders)||o,renderMenuOptionDescription:(e,t,o)=>e.localize(`component.${t.translation_domain||a}.options.step.${t.step_id}.menu_option_descriptions.${o}`,t.description_placeholders)||"",renderLoadingDescription:(e,t)=>e.localize(`component.${a}.options.loading`)||e.localize(`ui.dialogs.options_flow.loading.${t}`)||""}}})},async read(t){const o=e(),n=await o.callApi("POST","config/config_entries/options/flow",{handler:t});return await o.callApi("DELETE",`config/config_entries/options/flow/${n.flow_id}`),n},async update(t,o){const n=e(),r=await n.callApi("POST","config/config_entries/options/flow",{handler:t});return n.callApi("POST",`config/config_entries/options/flow/${r.flow_id}`,o)}};const r=o=>{const n=document.querySelector("home-assistant"),r={...e(),...o};n._updateHass?n._updateHass(o):n.hass=r;const i=t.deepQuery("ha-sidebar");i&&(i.hass=r,i.requestUpdate&&i.requestUpdate());const s=t.deepQuery("home-assistant-main");s&&(s.hass=r,s.requestUpdate&&s.requestUpdate())};t.sidebar={get:()=>e().panels,add(t,o){const n={...e().panels,[t]:{component_name:o.component||"iframe",config:o.config||{url:o.url},icon:o.icon||"mdi:application",title:o.title||t,url_path:t,show_in_sidebar:!1!==o.showInSidebar,require_admin:o.requireAdmin||!1}};return r({panels:n}),n[t]},remove(t){const o=e(),{[t]:n,...i}=o.panels;r({panels:i})},update(t,o){const n=e();if(!n.panels[t])return null;const i={...n.panels,[t]:{...n.panels[t],...o}};return r({panels:i}),i[t]},hide(e){return this.update(e,{show_in_sidebar:!1})},show(e){return this.update(e,{show_in_sidebar:!0})}},t.ui={get root(){return document.querySelector("home-assistant")},get main(){return t.deepQuery("home-assistant-main")},get sidebar(){return t.deepQuery("ha-sidebar")},get drawer(){return t.deepQuery("ha-drawer")},get appLayout(){return t.deepQuery("ha-app-layout")},get topBar(){return t.deepQuery("app-toolbar")||t.deepQuery("ha-top-app-bar-fixed")},get panel(){return t.deepQuery("[id^='panel-']")||t.deepQuery("partial-panel-resolver")},immersive(e=!0){const t=this.sidebar,o=this.topBar,n=this.drawer;e?(t&&(t.style.display="none"),o&&(o.style.display="none"),n&&n.setAttribute("narrow",""),document.body.style.setProperty("--ha-sidebar-width","0px")):(t&&(t.style.display=""),o&&(o.style.display=""),n&&n.removeAttribute("narrow"),document.body.style.removeProperty("--ha-sidebar-width"))},kiosk(e=!0){r({kioskMode:e})}},t.hook={_hooks:{},on(e,t){return this._hooks[e]||(this._hooks[e]=[]),this._hooks[e].push(t),()=>this.off(e,t)},off(e,t){this._hooks[e]&&(this._hooks[e]=this._hooks[e].filter(e=>e!==t))},emit(e,t){this._hooks[e]&&this._hooks[e].forEach(e=>e(t))},element(e,o){const n=customElements.define.bind(customElements);customElements.define=function(t,r,i){if(t===e){n(t,class extends r{connectedCallback(){super.connectedCallback?.(),o(this)}},i),customElements.define=n}else n(t,r,i)},customElements.get(e)&&t.deepQueryAll(e).forEach(e=>o(e))},hass(e){const t=document.querySelector("home-assistant");if(!t)return;let o=t.hass;Object.defineProperty(t,"hass",{get:()=>o,set(t){const n=o;o=t,e(t,n)},configurable:!0})}},t.ws={send:t=>e().connection.sendMessage(t),call:t=>e().connection.sendMessagePromise(t),subscribe:(t,o)=>e().connection.subscribeEvents(o,t),subscribeMessage:(t,o)=>e().connection.subscribeMessage(o,t)},t.api={get:t=>e().callApi("GET",t),post:(t,o)=>e().callApi("POST",t,o),put:(t,o)=>e().callApi("PUT",t,o),delete:t=>e().callApi("DELETE",t),fetch:(t,o)=>e().fetchWithAuth(t,o)},t.ts={load:()=>o(),transpile:(e,t)=>n(e,t),async run(o,r={}){const i=await n(o),s=Object.keys(r),a=s.map(e=>r[e]);return new Function("claw","hass",...s,i)(t,e(),...a)},async card(o,r={}){const i=await n(o);return new Function("root","card","$","$$","hass","config","overlay","claw",i)(r.root,r.card||r.root,r.$||(e=>r.root?.querySelector(e)),r.$$||(e=>r.root?.querySelectorAll(e)),r.hass||e(),r.config||{},r.overlay||window._htmlProCardOverlay,t)},async module(o,r={}){const i=await n(o,{module:window.ts.ModuleKind.ES2020}),s=new Blob([i],{type:"text/javascript"}),a=URL.createObjectURL(s);try{const o=await import(a);return"function"==typeof o.default?o.default({claw:t,hass:e(),...r}):o}finally{URL.revokeObjectURL(a)}}},t.config={entries:async t=>e().callWS({type:"config_entries/get",...t}),entry:async t=>(await e().callWS({type:"config_entries/get_single",entry_id:t})).config_entry,update:async(t,o)=>e().callWS({type:"config_entries/update",entry_id:t,...o}),delete:async e=>t.api.delete(`config/config_entries/entry/${e}`),reload:async e=>t.api.post(`config/config_entries/entry/${e}/reload`),disable:async t=>e().callWS({type:"config_entries/disable",entry_id:t,disabled_by:"user"}),enable:async t=>e().callWS({type:"config_entries/disable",entry_id:t,disabled_by:null}),subscribe:t=>e().connection.subscribeMessage(t,{type:"config_entries/subscribe"}),flow:{create:async(e,o)=>t.api.post("config/config_entries/flow",{handler:e,entry_id:o}),get:async e=>t.api.get(`config/config_entries/flow/${e}`),submit:async(e,o)=>t.api.post(`config/config_entries/flow/${e}`,o),delete:async e=>t.api.delete(`config/config_entries/flow/${e}`),progress:async()=>e().connection.sendMessagePromise({type:"config_entries/flow/progress"}),subscribe:t=>e().connection.subscribeMessage(t,{type:"config_entries/flow/subscribe"})},options:t.options},t.panels={get:async()=>e().connection.sendMessagePromise({type:"get_panels"}),subscribe(t){return e().connection.subscribeEvents(()=>{this.get().then(t)},"panels_updated")}},t.states={get:t=>t?e().states[t]:e().states,set:async(t,o,n)=>e().callApi("POST","states/"+t,{state:o,attributes:n}),subscribe:e=>t.hook.hass((t,o)=>{t.states!==o?.states&&e(t.states)})},t.services={get(t){const o=e().services;return t?o[t]:o},call:async(t,o,n,r)=>e().callService(t,o,n,r)},t.areas={get:async()=>e().callWS({type:"config/area_registry/list"}),create:async(t,o)=>e().callWS({type:"config/area_registry/create",name:t,...o}),update:async(t,o)=>e().callWS({type:"config/area_registry/update",area_id:t,...o}),delete:async t=>e().callWS({type:"config/area_registry/delete",area_id:t})},t.devices={get:async()=>e().callWS({type:"config/device_registry/list"}),update:async(t,o)=>e().callWS({type:"config/device_registry/update",device_id:t,...o})},t.entities={get:async()=>e().callWS({type:"config/entity_registry/list"}),getEntry:async t=>e().callWS({type:"config/entity_registry/get",entity_id:t}),update:async(t,o)=>e().callWS({type:"config/entity_registry/update",entity_id:t,...o}),remove:async t=>e().callWS({type:"config/entity_registry/remove",entity_id:t})},t.automations={get:async()=>t.api.get("config/automation/config"),getConfig:async e=>t.api.get(`config/automation/config/${e}`),create:async e=>t.api.post("config/automation/config",e),update:async(e,o)=>t.api.put(`config/automation/config/${e}`,o),delete:async e=>t.api.delete(`config/automation/config/${e}`),trigger:async e=>t.services.call("automation","trigger",{entity_id:e})},t.scripts={get:async()=>t.api.get("config/script/config"),getConfig:async e=>t.api.get(`config/script/config/${e}`),create:async e=>t.api.post("config/script/config",e),update:async(e,o)=>t.api.put(`config/script/config/${e}`,o),delete:async e=>t.api.delete(`config/script/config/${e}`),run:async(e,o)=>t.services.call("script",e.replace("script.",""),o)},t.scenes={get:async()=>t.api.get("config/scene/config"),create:async e=>t.api.post("config/scene/config",e),update:async(e,o)=>t.api.put(`config/scene/config/${e}`,o),delete:async e=>t.api.delete(`config/scene/config/${e}`),activate:async e=>t.services.call("scene","turn_on",{entity_id:e})},t.lovelace={getConfig:async()=>e().callWS({type:"lovelace/config"}),saveConfig:async t=>e().callWS({type:"lovelace/config/save",config:t}),getDashboards:async()=>e().callWS({type:"lovelace/dashboards/list"}),createDashboard:async t=>e().callWS({type:"lovelace/dashboards/create",...t}),updateDashboard:async(t,o)=>e().callWS({type:"lovelace/dashboards/update",dashboard_id:t,...o}),deleteDashboard:async t=>e().callWS({type:"lovelace/dashboards/delete",dashboard_id:t}),getResources:async()=>e().callWS({type:"lovelace/resources"}),createResource:async t=>e().callWS({type:"lovelace/resources/create",...t}),updateResource:async(t,o)=>e().callWS({type:"lovelace/resources/update",resource_id:t,...o}),deleteResource:async t=>e().callWS({type:"lovelace/resources/delete",resource_id:t})},t.users={get:async()=>e().callWS({type:"config/auth/list"}),create:async t=>e().callWS({type:"config/auth/create",...t}),delete:async t=>e().callWS({type:"config/auth/delete",user_id:t})},t.system={info:async()=>e().callWS({type:"config/core/info"}),restart:async()=>t.services.call("homeassistant","restart"),stop:async()=>t.services.call("homeassistant","stop"),checkConfig:async()=>t.services.call("homeassistant","check_config"),reloadCore:async()=>t.services.call("homeassistant","reload_core_config")},window.claw=t}();