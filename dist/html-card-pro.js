import { html, LitElement } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";
const HTML_PRO_CARD_VERSION = '3.3.0';
console.info(`%c HTML-PRO-CARD %c v${HTML_PRO_CARD_VERSION} `, 'background:#03a9f4;color:#fff;font-weight:bold;', 'background:#333;color:#fff;');
const _globalLoadedScripts = window._htmlProCardScripts || (window._htmlProCardScripts = new Set());

if (!document.getElementById('html-pro-card-overlay')) {
  const overlay = document.createElement('div');
  overlay.id = 'html-pro-card-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;overflow:hidden;';
  document.body.appendChild(overlay);
}
window._htmlProCardOverlay = document.getElementById('html-pro-card-overlay');

(function() {
  const _ov = window._htmlProCardOverlay;
  if (!_ov) return;
  const _clearAll = () => {
    _ov.innerHTML = '';
    document.querySelectorAll('[id^="claw-"]').forEach(el => el.remove());
    _btn.style.display = 'none';
  };
  window.addEventListener('location-changed', _clearAll);
  const _btn = document.createElement('div');
  _btn.id = 'claw-overlay-close';
  _btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:2147483647;width:40px;height:40px;border-radius:50%;background:var(--error-color,#e53935);color:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;pointer-events:auto;font-size:20px;line-height:1;box-shadow:0 2px 8px rgba(0,0,0,.3);';
  _btn.innerHTML = '✕';
  _btn.onclick = _clearAll;
  document.body.appendChild(_btn);
  new MutationObserver(() => {
    _btn.style.display = _ov.children.length ? 'flex' : 'none';
  }).observe(_ov, { childList: true });
})();

if (!window._htmlProCardRoots) {
  window._htmlProCardRoots = new Set();
  const origGetById = document.getElementById.bind(document);
  const origQS = document.querySelector.bind(document);
  const origQSA = document.querySelectorAll.bind(document);
  document.getElementById = function(id) {
    for (const root of window._htmlProCardRoots) {
      const el = root.querySelector('#' + id);
      if (el) return el;
    }
    return origGetById(id);
  };
  document.querySelector = function(sel) {
    for (const root of window._htmlProCardRoots) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return origQS(sel);
  };
  document.querySelectorAll = function(sel) {
    const results = [];
    for (const root of window._htmlProCardRoots) {
      results.push(...root.querySelectorAll(sel));
    }
    if (results.length > 0) return results;
    return origQSA(sel);
  };
}

const _pceLoaded = { promise: null };
function _loadPrismEditor() {
  if (_pceLoaded.promise) return _pceLoaded.promise;
  _pceLoaded.promise = new Promise((resolve) => {
    if (window.prismCodeEditor) { resolve(window.prismCodeEditor); return; }
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      import { fullEditor, updateTheme } from 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/setups/index.js';
      import 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/prism/languages/markup.js';
      import 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/prism/languages/css.js';
      import 'https://cdn.jsdelivr.net/npm/prism-code-editor@3/dist/prism/languages/javascript.js';
      window.prismCodeEditor = { fullEditor, updateTheme };
      window.dispatchEvent(new Event('pce-ready'));
    `;
    document.head.appendChild(script);
    window.addEventListener('pce-ready', () => resolve(window.prismCodeEditor), { once: true });
  });
  return _pceLoaded.promise;
}

if (!customElements.get('ha-htmlcard-textarea')) {
  customElements.define('ha-htmlcard-textarea', class extends HTMLElement {
    constructor() {
      super();
      this._value = '';
      this._editorReady = false;
      this._pendingValue = null;
    }
    connectedCallback() {
      if (this._initialized) return;
      this._initialized = true;
      this.innerHTML = `
        <style>
          .pce-container {
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 8px;
            overflow: hidden;
          }
          .pce-container .prism-code-editor {
            height: 400px !important;
            min-height: 400px !important;
            font-size: 13px !important;
          }
          .pce-fallback {
            width: 100%;
            height: 400px;
            padding: 12px;
            border: none;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color, #333);
            font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            resize: vertical;
            box-sizing: border-box;
          }
        </style>
        <div class="pce-container">
          <textarea class="pce-fallback" spellcheck="false"></textarea>
        </div>
      `;
      this._container = this.querySelector('.pce-container');
      this._fallback = this.querySelector('.pce-fallback');
      this._fallback.value = this._value;
      this._fallback.addEventListener('input', () => {
        this._value = this._fallback.value;
        this.dispatchEvent(new CustomEvent('change', { detail: { value: this._value }, bubbles: true, composed: true }));
      });
      this._initEditor();
    }
    async _initEditor() {
      try {
        const pce = await _loadPrismEditor();
        this._fallback.style.display = 'none';
        const initialValue = this._pendingValue !== null ? this._pendingValue : this._value;
        const haThemes = document.querySelector('home-assistant')?.hass?.themes;
        const isDark = haThemes?.darkMode || 
          document.body.getAttribute('data-theme')?.includes('dark') ||
          getComputedStyle(document.body).getPropertyValue('--primary-background-color')?.trim()?.match(/^#[0-3]/) ||
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = isDark ? 'vs-code-dark' : 'vs-code-light';
        this._editor = pce.fullEditor(this._container, {
          language: 'html',
          theme: theme,
          value: initialValue,
          lineNumbers: true,
          wordWrap: false,
          tabSize: 2
        }, () => {
          this._editorReady = true;
          this._value = initialValue;
          const shadow = this._editor.scrollContainer.parentNode;
          if (shadow instanceof ShadowRoot) {
            const style = document.createElement('style');
            style.textContent = `.prism-code-editor { height: 400px !important; font-size: 13px !important; }`;
            shadow.appendChild(style);
          }
          this._editor.addListener('update', (code) => {
            this._value = code;
            this.dispatchEvent(new CustomEvent('change', { detail: { value: this._value }, bubbles: true, composed: true }));
          });
        });
      } catch (e) {
        this._fallback.style.display = 'block';
      }
    }
    set value(val) {
      const newVal = val || '';
      if (this._editorReady && this._editor) {
        if (this._editor.value !== newVal) {
          this._editor.setOptions({ value: newVal });
          this._value = newVal;
        }
      } else {
        this._pendingValue = newVal;
        this._value = newVal;
        if (this._fallback) {
          this._fallback.value = newVal;
        }
      }
    }
    get value() { return this._value; }
  });
}

if (!customElements.get('ha-htmlcard-textfield')) {
  customElements.define('ha-htmlcard-textfield', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
          input {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 4px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color, #000);
          }
        </style>
        <input type="text" />
      `;
      this._input = this.shadowRoot.querySelector('input');
      this._input.addEventListener('input', () => {
        this.dispatchEvent(new CustomEvent('change', {
          detail: { value: this._input.value },
          bubbles: true,
          composed: true
        }));
      });
    }
    
    set value(val) {
      this._input.value = val;
    }
    
    get value() {
      return this._input.value;
    }
    
    set type(val) {
      this._input.type = val;
    }
  });
}

if (!customElements.get('ha-htmlcard-switch')) {
  customElements.define('ha-htmlcard-switch', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
          }
          label {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 24px;
          }
          input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          span {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
          }
          span:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + span {
            background-color: var(--primary-color, #03a9f4);
          }
          input:checked + span:before {
            transform: translateX(16px);
          }
        </style>
        <label>
          <input type="checkbox" />
          <span></span>
        </label>
      `;
      this._input = this.shadowRoot.querySelector('input');
      this._input.addEventListener('change', () => {
        this.dispatchEvent(new CustomEvent('change', {
          detail: { checked: this._input.checked },
          bubbles: true,
          composed: true
        }));
      });
    }
    
    set checked(val) {
      this._input.checked = val;
    }
    
    get checked() {
      return this._input.checked;
    }
  });
}

if (!customElements.get('ha-htmlcard-formfield')) {
  customElements.define('ha-htmlcard-formfield', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: flex;
            align-items: center;
            padding: 4px 0;
          }
          label {
            padding-left: 8px;
            color: var(--primary-text-color, #000);
          }
        </style>
        <slot></slot>
        <label><slot name="label"></slot></label>
      `;
    }
  });
}

const I18N = {
  zh: {
    htmlContent: 'HTML 内容',
    options: '选项设置',
    scripts: '外部脚本',
    store: '模块商店',
    disableParse: '纯HTML模式',
    disableParseDesc: '默认关闭(使用Jinja2)，开启后直接渲染HTML',
    updateInterval: '更新间隔 (ms)',
    updateIntervalDesc: '0 为禁用自动更新',
    ignoreLineBreaks: '忽略换行',
    ignoreLineBreaksDesc: '忽略HTML中的换行符',
    addScript: '添加',
    scriptPlaceholder: '输入脚本 URL',
    searchPlaceholder: '搜索模块...',
    import: '导入',
    delete: '删除',
    loading: '加载中...',
    noModules: '暂无模块',
    noCustomModules: '暂无自定义模块',
    confirmDelete: '确定删除此模块?',
    customModule: '自定义模块',
    headerDesc: '高级 HTML 卡片编辑器，支持 Jinja2 模板语法',
    headerDesc2: '可使用 Home Assistant 状态、属性和服务调用',
    realtime: '实时更新',
    extScripts: '外部脚本',
    customStyle: '自定义样式',
    yamlHint: '支持直接粘贴完整YAML配置'
  },
  en: {
    htmlContent: 'HTML Content',
    options: 'Options',
    scripts: 'External Scripts',
    store: 'Module Store',
    disableParse: 'Pure HTML Mode',
    disableParseDesc: 'Off by default (uses Jinja2), enable to render HTML directly',
    updateInterval: 'Update Interval (ms)',
    updateIntervalDesc: '0 to disable auto update',
    ignoreLineBreaks: 'Ignore Line Breaks',
    ignoreLineBreaksDesc: 'Ignore line breaks in HTML',
    addScript: 'Add',
    scriptPlaceholder: 'Enter script URL',
    searchPlaceholder: 'Search modules...',
    import: 'Import',
    delete: 'Delete',
    loading: 'Loading...',
    noModules: 'No modules',
    noCustomModules: 'No custom modules',
    confirmDelete: 'Delete this module?',
    customModule: 'Custom Module',
    headerDesc: 'Advanced HTML card editor with Jinja2 template',
    headerDesc2: 'Use Home Assistant states, attributes and services',
    realtime: 'Realtime',
    extScripts: 'Scripts',
    customStyle: 'Custom CSS',
    yamlHint: 'Paste full YAML config directly'
  }
};

class HtmlTemplateCardEditor extends LitElement {
  static get properties() {
    return {
      _config: { type: Object },
      hass: { type: Object },
      _showStore: { type: Boolean },
      _showHtml: { type: Boolean },
      _showOptions: { type: Boolean },
      _showScripts: { type: Boolean },
      _storeModules: { type: Array },
      _savedModules: { type: Array },
      _storeLoading: { type: Boolean },
      _storeSearch: { type: String }
    };
  }

  get _lang() {
    return this.hass?.language?.startsWith('zh') ? 'zh' : 'en';
  }

  _t(key) {
    return I18N[this._lang]?.[key] || I18N.en[key] || key;
  }

  constructor() {
    super();
    this._showStore = false;
    this._showHtml = true;
    this._showOptions = false;
    this._showScripts = false;
    this._storeModules = [];
    this._savedModules = this._loadSavedModules();
    this._storeLoading = false;
    this._storeSearch = '';
  }

  _loadSavedModules() {
    try {
      const saved = localStorage.getItem('html-pro-card-modules');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  }

  _saveSavedModules() {
    localStorage.setItem('html-pro-card-modules', JSON.stringify(this._savedModules));
  }

  setConfig(config) {
    this._config = config;
  }

  render() {
    if (!this._config) {
      return html``;
    }

    return html`
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
        .script-input-container ha-textfield {
          flex: 1;
        }
        .script-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .script-item ha-textfield {
          flex: 1;
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
          <a href="https://github.com/knoop7/html-card-pro" target="_blank" class="header-version" style="text-decoration:none;color:#fff;">v${HTML_PRO_CARD_VERSION}</a>
          <div class="header-logo">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2V3H12V9H11V10H9V11H8V12H7V13H5V12H4V11H3V9H2V15H3V16H4V17H5V18H6V22H8V21H7V20H8V19H9V18H10V19H11V22H13V21H12V17H13V16H14V15H15V12H16V13H17V11H15V9H20V8H17V7H22V3H21V2M14 3H15V4H14Z"/></svg>
          </div>
          <div class="header-desc">
            ${this._t('headerDesc')}<br>
            ${this._t('headerDesc2')}
          </div>
          <div class="header-features">
            <div class="header-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
              ${this._t('realtime')}
            </div>
            <div class="header-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              ${this._t('extScripts')}
            </div>
            <div class="header-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              ${this._t('customStyle')}
            </div>
          </div>
        </div>
        <!-- HTML 内容 -->
        <div class="collapse-panel">
          <div class="collapse-header ${this._showHtml ? 'expanded' : ''}" @click="${() => { this._showHtml = !this._showHtml; this.requestUpdate(); }}">
            <div class="collapse-header-left">
              <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <span class="collapse-title">${this._t('htmlContent')}</span>
            </div>
            <span class="collapse-arrow ${this._showHtml ? 'expanded' : ''}"></span>
          </div>
          <div class="collapse-body ${this._showHtml ? 'expanded' : ''}">
            <div class="collapse-content">
              <div style="font-size:11px;color:#999;margin:-8px 0 8px;text-align:center;">${this._t('yamlHint')}</div>
              <ha-htmlcard-textarea
                class="editor-control"
                .value="${this._config.content || ''}"
                @change="${this._handleContentChange}"
              ></ha-htmlcard-textarea>
            </div>
          </div>
        </div>

        <!-- 选项设置 -->
        <div class="collapse-panel">
          <div class="collapse-header ${this._showOptions ? 'expanded' : ''}" @click="${() => { this._showOptions = !this._showOptions; this.requestUpdate(); }}">
            <div class="collapse-header-left">
              <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span class="collapse-title">${this._t('options')}</span>
            </div>
            <span class="collapse-arrow ${this._showOptions ? 'expanded' : ''}"></span>
          </div>
          <div class="collapse-body ${this._showOptions ? 'expanded' : ''}">
            <div class="collapse-content">
              <div class="option-row">
                <div>
                  <div class="option-label">${this._t('disableParse')}</div>
                  <div class="option-desc">${this._t('disableParseDesc')}</div>
                </div>
                <ha-htmlcard-switch
                  .checked="${this._config.do_not_parse || false}"
                  @change="${this._handleParseChange}"
                ></ha-htmlcard-switch>
              </div>
              <div class="option-row">
                <div>
                  <div class="option-label">${this._t('ignoreLineBreaks')}</div>
                  <div class="option-desc">${this._t('ignoreLineBreaksDesc')}</div>
                </div>
                <ha-htmlcard-switch
                  .checked="${this._config.ignore_line_breaks || false}"
                  @change="${this._handleLineBreaksChange}"
                ></ha-htmlcard-switch>
              </div>
              <div class="option-row">
                <div>
                  <div class="option-label">${this._t('updateInterval')}</div>
                  <div class="option-desc">${this._t('updateIntervalDesc')}</div>
                </div>
                <ha-htmlcard-textfield
                  type="number"
                  class="interval-input"
                  .value="${this._config.update_interval || 0}"
                  @change="${this._handleIntervalChange}"
                ></ha-htmlcard-textfield>
              </div>
            </div>
          </div>
        </div>

        <!-- 外部脚本 -->
        <div class="collapse-panel">
          <div class="collapse-header ${this._showScripts ? 'expanded' : ''}" @click="${() => { this._showScripts = !this._showScripts; this.requestUpdate(); }}">
            <div class="collapse-header-left">
              <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span class="collapse-title">${this._t('scripts')}</span>
            </div>
            <span class="collapse-arrow ${this._showScripts ? 'expanded' : ''}"></span>
          </div>
          <div class="collapse-body ${this._showScripts ? 'expanded' : ''}">
            <div class="collapse-content">
              <div class="script-input-container">
                <ha-textfield
                  type="url"
                  placeholder="${this._t('scriptPlaceholder')}"
                  .value="${this._newScriptUrl || ''}"
                  @change="${e => this._newScriptUrl = e.target.value}"
                ></ha-textfield>
                <mwc-button @click="${this._addScript}">${this._t('addScript')}</mwc-button>
              </div>
              ${(this._config.scripts || []).map((script, index) => html`
                <div class="script-item">
                  <ha-textfield
                    type="url"
                    .value="${script}"
                    @change="${e => this._updateScript(index, e.target.value)}"
                  ></ha-textfield>
                  <mwc-icon-button @click="${() => this._removeScript(index)}">
                    <ha-icon icon="mdi:delete"></ha-icon>
                  </mwc-icon-button>
                </div>
              `)}
            </div>
          </div>
        </div>

        <!-- 模块商店 -->
        <div class="collapse-panel">
          <div class="collapse-header ${this._showStore ? 'expanded' : ''}" @click="${this._toggleStore}">
            <div class="collapse-header-left">
              <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <span class="collapse-title">${this._t('store')}</span>
            </div>
            <span class="collapse-arrow ${this._showStore ? 'expanded' : ''}"></span>
          </div>
          <div class="collapse-body ${this._showStore ? 'expanded' : ''}">
            <div class="collapse-content">
              <div class="store-search">
                <input type="text" placeholder="${this._t('searchPlaceholder')}" .value="${this._storeSearch}" @input="${e => { this._storeSearch = e.target.value; this.requestUpdate(); }}">
              </div>
              <div class="store-list">
                ${this._storeLoading ? html`<div class="store-loading">${this._t('loading')}</div>` : this._renderOnlineModules()}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    `;
  }

  _handleContentChange(e) {
    if (!this._config) return;
    
    let value = e.detail.value || '';
    value = this._normalizeRadius(value);
    let newConfig;
    
    if (value.trim().startsWith('type:') && value.includes('content:')) {
      const parsed = this._parseYaml(value);
      if (parsed.content !== undefined) {
        newConfig = {
          ...this._config,
          content: this._normalizeRadius(parsed.content || ''),
          do_not_parse: parsed.do_not_parse !== undefined ? parsed.do_not_parse : this._config.do_not_parse,
          update_interval: parsed.update_interval !== undefined ? parsed.update_interval : this._config.update_interval,
          ignore_line_breaks: parsed.ignore_line_breaks !== undefined ? parsed.ignore_line_breaks : this._config.ignore_line_breaks,
          scripts: parsed.scripts || this._config.scripts
        };
      } else {
        newConfig = { ...this._config, content: value };
      }
    } else {
      newConfig = { ...this._config, content: value };
    }
    
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    }));
  }

  _normalizeRadius(text) {
    return text.replace(/border-radius\s*:\s*\d+(\.\d+)?(px|em|rem|%)?/gi, 'border-radius: 10px');
  }

  _handleParseChange(e) {
    this._valueChanged('do_not_parse', e.target.checked);
  }

  _handleLineBreaksChange(e) {
    this._valueChanged('ignore_line_breaks', e.target.checked);
  }

  _handleIntervalChange(e) {
    const value = parseInt(e.target.value) || 0;
    this._valueChanged('update_interval', value);
  }

  _valueChanged(key, value) {
    if (!this._config) return;
    
    const newConfig = {
      ...this._config,
      [key]: value,
    };
    
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    }));
  }

  _addScript() {
    if (!this._newScriptUrl) return;
    
    const scripts = [...(this._config.scripts || []), this._newScriptUrl];
    this._valueChanged('scripts', scripts);
    this._newScriptUrl = '';
    this.requestUpdate();
  }

  _updateScript(index, value) {
    const scripts = [...(this._config.scripts || [])];
    scripts[index] = value;
    this._valueChanged('scripts', scripts);
  }

  _removeScript(index) {
    const scripts = [...(this._config.scripts || [])];
    scripts.splice(index, 1);
    this._valueChanged('scripts', scripts);
  }

  _toggleStore() {
    this._showStore = !this._showStore;
    if (this._showStore && this._storeModules.length === 0) {
      this._loadOnlineModules();
    }
    this.requestUpdate();
  }

  _switchTab(tab) {
    this._storeTab = tab;
    if (tab === 'online' && this._storeModules.length === 0) {
      this._loadOnlineModules();
    }
    this.requestUpdate();
  }

  _parseYaml(text) {
    const lines = text.split('\n');
    const result = {};
    let currentKey = null;
    let multilineValue = [];
    let inMultiline = false;
    let inArray = false;
    let arrayValue = [];
    
    for (const line of lines) {
      if (inMultiline) {
        if (line.startsWith('  ') || line.trim() === '') {
          multilineValue.push(line.slice(2) || '');
        } else {
          result[currentKey] = multilineValue.join('\n').trim();
          inMultiline = false;
          multilineValue = [];
        }
      }
      
      if (inArray) {
        const arrayMatch = line.match(/^\s+-\s+(.+)$/);
        if (arrayMatch) {
          arrayValue.push(arrayMatch[1].trim());
          continue;
        } else if (line.trim() && !line.startsWith(' ')) {
          result[currentKey] = arrayValue;
          inArray = false;
          arrayValue = [];
        }
      }
      
      if (!inMultiline && !inArray) {
        const match = line.match(/^(\w+):\s*(.*)$/);
        if (match) {
          currentKey = match[1];
          const value = match[2];
          if (value === '|') {
            inMultiline = true;
            multilineValue = [];
          } else if (value === '' || value.trim() === '') {
            inArray = true;
            arrayValue = [];
          } else if (currentKey === 'scripts' && value.trim()) {
            result[currentKey] = [value.trim()];
          } else {
            result[currentKey] = value.replace(/^["']|["']$/g, '');
          }
        }
      }
    }
    
    if (inMultiline && currentKey) {
      result[currentKey] = multilineValue.join('\n').trim();
    }
    if (inArray && currentKey && arrayValue.length > 0) {
      result[currentKey] = arrayValue;
    }
    
    return result;
  }

  async _loadOnlineModules() {
    this._storeLoading = true;
    this.requestUpdate();
    const baseUrl = 'https://raw.githubusercontent.com/knoop7/html-card-pro/main';
    try {
      const res = await fetch(`${baseUrl}/modules.txt`);
      if (res.ok) {
        const text = await res.text();
        const fileNames = text.trim().split('\n').filter(f => f.trim());
        const modules = await Promise.all(fileNames.map(async f => {
          try {
            const yamlRes = await fetch(`${baseUrl}/modules/${f}`);
            if (yamlRes.ok) {
              const yamlText = await yamlRes.text();
              const parts = yamlText.split(/^---$/m);
              const meta = this._parseYaml(parts[0] || '');
              return {
                id: meta.id || f.replace('.yaml', ''),
                name: meta.name || f.replace('.yaml', ''),
                desc: meta.desc || '',
                author: meta.author || 'knoop7',
                _file: `modules/${f}`,
                _baseUrl: baseUrl
              };
            }
          } catch {}
          return null;
        }));
        this._storeModules = modules.filter(m => m !== null);
      } else {
        this._storeModules = this._getBuiltinModules();
      }
    } catch {
      this._storeModules = this._getBuiltinModules();
    }
    this._storeLoading = false;
    this.requestUpdate();
  }

  _getBuiltinModules() {
    return [];
  }

  _renderOnlineModules() {
    const filtered = this._storeModules.filter(m => 
      !this._storeSearch || m.name.toLowerCase().includes(this._storeSearch.toLowerCase()) || m.desc.toLowerCase().includes(this._storeSearch.toLowerCase())
    );
    if (filtered.length === 0) {
      return html`<div class="store-loading">${this._t('noModules')}</div>`;
    }
    return filtered.map(m => html`
      <div class="store-item">
        <div class="store-item-info">
          <h4>${m.name}${m.author ? html`<span class="store-item-author">by ${m.author}</span>` : ''}</h4>
          <p>${m.desc}</p>
        </div>
        <button class="store-item-btn" @click="${() => this._importModule(m)}">${this._t('import')}</button>
      </div>
    `);
  }

  _renderSavedModules() {
    const filtered = this._savedModules.filter(m => 
      !this._storeSearch || m.name.toLowerCase().includes(this._storeSearch.toLowerCase())
    );
    if (filtered.length === 0) {
      return html`<div class="store-loading">${this._t('noCustomModules')}</div>`;
    }
    return filtered.map((m, i) => html`
      <div class="store-item">
        <div class="store-item-info">
          <h4>${m.name}</h4>
          <p>${m.desc || this._t('customModule')}</p>
        </div>
        <div class="store-item-actions">
          <button class="store-item-btn import" @click="${() => this._importModule(m)}">${this._t('import')}</button>
          <button class="store-item-btn delete" @click="${() => this._deleteModule(i)}">${this._t('delete')}</button>
        </div>
      </div>
    `);
  }

  async _importModule(m) {
    if (!this._config) return;
    
    let moduleConfig = { content: m.content || '' };
    
    if (m._file && m._baseUrl) {
      try {
        const res = await fetch(`${m._baseUrl}/${m._file}`);
        if (res.ok) {
          const yamlText = await res.text();
          const parts = yamlText.split(/^---$/m);
          const configYaml = parts.length > 1 ? parts[1].trim() : yamlText;
          const parsed = this._parseYaml(configYaml);
          moduleConfig = {
            content: parsed.content || '',
            do_not_parse: parsed.do_not_parse,
            update_interval: parsed.update_interval,
            ignore_line_breaks: parsed.ignore_line_breaks,
            scripts: parsed.scripts
          };
        }
      } catch (e) {
        console.error('Failed to load module:', e);
        return;
      }
    }
    
    const newConfig = {
      ...this._config,
      content: moduleConfig.content,
      do_not_parse: moduleConfig.do_not_parse !== undefined ? moduleConfig.do_not_parse : moduleConfig.content.includes('<script>'),
      update_interval: moduleConfig.update_interval !== undefined ? moduleConfig.update_interval : this._config.update_interval,
      ignore_line_breaks: moduleConfig.ignore_line_breaks !== undefined ? moduleConfig.ignore_line_breaks : true,
      scripts: moduleConfig.scripts || this._config.scripts
    };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    }));
    this.requestUpdate();
  }

  _deleteModule(index) {
    if (!confirm(this._t('confirmDelete'))) return;
    this._savedModules = this._savedModules.filter((_, i) => i !== index);
    this._saveSavedModules();
    this.requestUpdate();
  }
}

customElements.define("html-pro-card-editor", HtmlTemplateCardEditor);

class HtmlTemplateCard extends HTMLElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }

  static async getConfigElement() {
    return document.createElement('html-pro-card-editor');
  }

  static preProcessScripts(config) {
    if (typeof config.scripts === 'string') config.scripts = config.scripts.split('\n').filter(url => url.trim() !== '');
    return config;
  }

  static getStubConfig() {
    return {
      content: `<style>
.pro{padding:20px}
.pro-h{display:flex;align-items:center;gap:16px;margin-bottom:12px}
.pro-icon{width:36px;height:36px;color:var(--primary-color)}
.pro-t{font-size:16px;font-weight:600;color:var(--primary-text-color)}
.pro-sub{font-size:13px;color:var(--secondary-text-color);opacity:0.7}
.pro-c{font-size:12px;color:var(--secondary-text-color);line-height:1.6}
</style>
<div class="pro">
<div class="pro-h">
<svg class="pro-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2V3H12V9H11V10H9V11H8V12H7V13H5V12H4V11H3V9H2V15H3V16H4V17H5V18H6V22H8V21H7V20H8V19H9V18H10V19H11V22H13V21H12V17H13V16H14V15H15V12H16V13H17V11H15V9H20V8H17V7H22V3H21V2M14 3H15V4H14Z"/></svg>
<div><span class="pro-t">Html Pro Card</span><div class="pro-sub" id="pro-sub"></div></div>
</div>
<div class="pro-c" id="pro-desc"></div>
</div>
<script>
var isZh = (navigator.language || '').startsWith('zh') || (document.documentElement.lang || '').startsWith('zh');
var desc = isZh ? '是一款专为 Home Assistant 设计的高级 HTML 卡片组件。它支持完整的 Jinja2 模板语法，让您可以动态获取任意实体的状态、属性和历史数据。通过内置的服务调用接口，您可以直接在卡片中控制灯光、开关、空调等设备。卡片支持自定义 CSS 样式和外部 JavaScript 脚本，让您能够创建独一无二的交互式仪表盘。' : 'is an advanced HTML card component designed for Home Assistant. It supports full Jinja2 template syntax, allowing you to dynamically access any entity state, attributes and history. With built-in service calls, you can control lights, switches, climate devices directly. Custom CSS and external JS scripts enable unique interactive dashboards.';
$('#pro-sub').textContent = 'By knoop7';
$('#pro-desc').textContent = desc;
</script>`,
      update_interval: 10000,
      do_not_parse: false,
      ignore_line_breaks: true,
      scripts: []
    };
  }

  connectedCallback() {
    this._createRootElement();
    this._setupEventListeners();
    if (this._config && this._hass) {
      this._processAndRender();
    }
  }

  disconnectedCallback() {
    if (this._timeUpdateInterval) {
      clearInterval(this._timeUpdateInterval);
      this._timeUpdateInterval = null;
    }
    this._removeEventListeners();
    if (this._templateSubscription) {
      try { this._templateSubscription(); } catch {}
      this._templateSubscription = null;
    }
    const ov = window._htmlProCardOverlay;
    if (ov) ov.innerHTML = '';
    document.querySelectorAll('[id^="claw-"]').forEach(el => el.remove());
  }

  _createRootElement() {
    if (this._rootElement && this.contains(this._rootElement)) return;
    this._rootElement = document.createElement('ha-card');
    this._rootElement.style.borderRadius = '10px';
    this._rootElement.style.overflow = 'hidden';
    this.appendChild(this._rootElement);
  }

  _setupEventListeners() {
    if (!this._rootElement) return;
    let pressTimer;
    let longPressTriggered = false;
    const elements = this._rootElement.querySelectorAll('.light-status');
    elements.forEach(element => {
      element.addEventListener('touchstart', e => {
        longPressTriggered = false;
        pressTimer = setTimeout(() => {
          longPressTriggered = true;
          const entityId = element.dataset.entity;
          if (entityId) this._showMoreInfo(entityId);
        }, 500);
      });
      element.addEventListener('touchend', () => {
        clearTimeout(pressTimer);
        if (!longPressTriggered) {
          const entityId = element.dataset.entity;
          if (entityId) this._toggle(entityId);
        }
      });
      element.addEventListener('touchmove', () => clearTimeout(pressTimer));
      element.addEventListener('mousedown', () => {
        longPressTriggered = false;
        pressTimer = setTimeout(() => {
          longPressTriggered = true;
          const entityId = element.dataset.entity;
          if (entityId) this._showMoreInfo(entityId);
        }, 500);
      });
      element.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
        if (!longPressTriggered) {
          const entityId = element.dataset.entity;
          if (entityId) this._toggle(entityId);
        }
      });
      element.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    });
    const brightnessSliders = this._rootElement.querySelectorAll('input[type="range"]');
    brightnessSliders.forEach(slider => {
      let timeoutId;
      slider.oninput = e => {
        e.stopPropagation();
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const entityId = slider.dataset.entity;
          if (entityId) {
            const brightness = Math.round((slider.value * 255) / 100);
            this._hass.callService('light', 'turn_on', { entity_id: entityId, brightness: brightness });
          }
        }, 150);
      };
    });
    this._rootElement.addEventListener('touchstart', this._handleTouchStart.bind(this), { passive: true });
    this._rootElement.addEventListener('touchend', this._handleTouchEnd.bind(this));
    this._rootElement.addEventListener('touchcancel', this._handleTouchEnd.bind(this));
    this._rootElement.addEventListener('mousedown', this._handleMouseDown.bind(this));
    this._rootElement.addEventListener('mouseup', this._handleMouseUp.bind(this));
    this._rootElement.addEventListener('click', this._handleClick.bind(this));
  }

  _removeEventListeners() {
    if (!this._rootElement) return;
    const elements = this._rootElement.querySelectorAll('.light-status');
    elements.forEach(element => element.replaceWith(element.cloneNode(true)));
    const sliders = this._rootElement.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => slider.oninput = null);
    this._rootElement.removeEventListener('touchstart', this._handleTouchStart.bind(this));
    this._rootElement.removeEventListener('touchend', this._handleTouchEnd.bind(this));
    this._rootElement.removeEventListener('touchcancel', this._handleTouchEnd.bind(this));
    this._rootElement.removeEventListener('mousedown', this._handleMouseDown.bind(this));
    this._rootElement.removeEventListener('mouseup', this._handleMouseUp.bind(this));
    this._rootElement.removeEventListener('click', this._handleClick.bind(this));
  }

  _handleTouchStart(e) {
    const target = e.target.closest('[data-long-press]');
    if (!target) return;
    const entityId = target.dataset.entity;
    if (!entityId) return;
    this._longPressTimeout = setTimeout(() => {
      this._showMoreInfo(entityId);
      this._longPressTimeout = null;
    }, 500);
  }

  _handleTouchEnd() {
    if (this._longPressTimeout) {
      clearTimeout(this._longPressTimeout);
      this._longPressTimeout = null;
    }
  }

  _handleMouseDown(e) {
    const target = e.target.closest('[data-long-press]');
    if (!target) return;
    const entityId = target.dataset.entity;
    if (!entityId) return;
    this._longPressTimeout = setTimeout(() => {
      this._showMoreInfo(entityId);
      this._longPressTimeout = null;
    }, 500);
  }

  _handleMouseUp() {
    if (this._longPressTimeout) {
      clearTimeout(this._longPressTimeout);
      this._longPressTimeout = null;
    }
  }

  _handleClick(e) {
    const actionTarget = e.target.closest('[data-action]');
    if (actionTarget) {
      const entityId = actionTarget.dataset.entity;
      const action = actionTarget.dataset.action;
      if (entityId && action === 'toggle') this._toggle(entityId);
      return;
    }
    if (this._longPressTimeout) {
      clearTimeout(this._longPressTimeout);
      this._longPressTimeout = null;
      return;
    }
  }

  _showMoreInfo(entityId) {
    if (!entityId || !this._hass.states[entityId]) return;
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _toggle(entityId) {
    if (!entityId || !this._hass.states[entityId]) return;
    const domain = entityId.split('.')[0];
    const toggleDomains = ['light', 'switch', 'fan', 'input_boolean', 'automation', 'script', 'cover', 'lock', 'media_player'];
    if (toggleDomains.includes(domain)) {
      this._hass.callService(domain, 'toggle', { entity_id: entityId });
    } else {
      this._fireMoreInfo(entityId);
    }
  }
  
  _fireMoreInfo(entityId) {
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId }
    });
    this.dispatchEvent(event);
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;
    if (!this._config) return;
    if (!this._entities) this._calculateEntities();
    const shouldUpdate = this._shouldUpdate(oldHass);
    if (shouldUpdate) {
      if (this._config.do_not_parse) {
        this._updateStates();
      } else {
        this._processAndRender();
      }
    }
  }

  _setupTimeUpdate() {
    if (this._timeUpdateInterval) clearInterval(this._timeUpdateInterval);
    if (this._config.update_interval && this._config.update_interval > 0) {
      const interval = Math.max(this._config.update_interval, 1000);
      this._timeUpdateInterval = setInterval(() => {
        if (this._config.do_not_parse) {
          this._updateStates();
        } else {
          this._processAndRender();
        }
      }, interval);
    }
  }

  _processAndRender() {
    if (!this._rootElement || !this._config || !this._hass) return;
    if (this._renderDebounce) clearTimeout(this._renderDebounce);
    this._renderDebounce = setTimeout(() => {
      try {
        this._renderContent();
      } catch {
        this._renderFallback();
      }
    }, 50);
  }

  _renderContent() {
    let content = this._config.content || '';
    if (!this._config.ignore_line_breaks) {
      content = content.replace(/\r?\n|\r/g, "");
    }
    if (this._config.do_not_parse) {
      this._render(content);
    } else {
      if (this._templateSubscription) {
        try { this._templateSubscription(); } catch {}
        this._templateSubscription = null;
      }
      try {
        this._hass.connection.subscribeMessage(msg => {
          try {
            this._render(msg.result);
          } catch {
            this._renderFallback();
          }
        }, { type: "render_template", template: content }).then(unsub => {
          this._templateSubscription = unsub;
        }).catch(() => {
          this._renderFallback();
        });
      } catch {
        this._renderFallback();
      }
    }
  }

  async _loadExternalScripts(scripts) {
    const promises = scripts.map(url => this._loadScript(url));
    return Promise.all(promises);
  }

  async _loadScript(url) {
    if (_globalLoadedScripts.has(url)) return;
    _globalLoadedScripts.add(url);
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = url;
      script.onload = resolve;
      script.onerror = () => {
        _globalLoadedScripts.delete(url);
        reject(new Error('Failed: ' + url));
      };
      document.body.appendChild(script);
    });
  }

  _render(content) {
    if (!this._rootElement || !this._hass) return;
    if (this._lastContent === content && this._rendered) return;
    this._lastContent = content;
    try {
      window.hassTemplateCard = { hass: this._hass, config: this._config, root: this._rootElement };
      window._htmlProCardRoots.add(this._rootElement);
      this._rootElement.innerHTML = content;
      this._setupClickHandlers(this._rootElement);
      if (!this._rendered) {
        this._rendered = true;
        const hasScripts = this._config.scripts && Array.isArray(this._config.scripts) && this._config.scripts.length > 0;
        if (hasScripts) {
          this._loadExternalScripts(this._config.scripts).then(() => {
            setTimeout(() => this._executeInlineScripts(), 200);
          }).catch(() => {
            setTimeout(() => this._executeInlineScripts(), 200);
          });
        } else {
          setTimeout(() => this._executeInlineScripts(), 0);
        }
      }
      this.dispatchEvent(new CustomEvent('content-rendered', {
        bubbles: true,
        composed: true,
        detail: { hass: this._hass, config: this._config }
      }));
    } catch {
      this._renderFallback();
    }
  }

  _executeInlineScripts() {
    if (!this._rootElement) return;
    const scripts = Array.from(this._rootElement.querySelectorAll('script'));
    const root = this._rootElement;
    const self = this;
    const overlay = window._htmlProCardOverlay;
    scripts.forEach(oldScript => {
      if (oldScript.src) {
        const s = document.createElement('script');
        s.src = oldScript.src;
        document.body.appendChild(s);
        return;
      }
      const code = oldScript.textContent.trim();
      if (!code) return;
      setTimeout(() => {
        try {
          const fn = new Function('root', '$', '$$', 'hass', 'config', 'overlay', code);
          fn(root, s => root.querySelector(s), s => root.querySelectorAll(s), self._hass, self._config, overlay);
        } catch(e) {}
      }, 100);
    });
  }

  _setupClickHandlers(card) {
    const self = this;
    card.querySelectorAll('[data-entity]').forEach(el => {
      const entityId = el.dataset.entity;
      const [domain] = entityId.split('.');
      el.querySelectorAll('[data-action]').forEach(btn => {
        btn.onclick = e => {
          e.stopPropagation();
          const action = btn.dataset.action;
          if (action === 'toggle') self._callService(entityId, 'toggle');
          else if (action === 'turn_on') self._callService(entityId, 'turn_on');
          else if (action === 'turn_off') self._callService(entityId, 'turn_off');
          else if (action === 'more-info') self._showMoreInfo(entityId);
          else self._hass.callService(domain, action, { entity_id: entityId });
        };
      });
      el.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.oninput = e => e.stopPropagation();
        slider.onchange = e => {
          e.stopPropagation();
          const val = parseFloat(e.target.value);
          if (slider.dataset.brightness !== undefined) {
            self._hass.callService('light', 'turn_on', { entity_id: entityId, brightness: Math.round(val * 255 / 100) });
          } else if (slider.dataset.temperature !== undefined) {
            self._hass.callService('climate', 'set_temperature', { entity_id: entityId, temperature: val });
          } else if (slider.dataset.volume !== undefined) {
            self._hass.callService('media_player', 'volume_set', { entity_id: entityId, volume_level: val / 100 });
          } else if (slider.dataset.position !== undefined) {
            self._hass.callService('cover', 'set_cover_position', { entity_id: entityId, position: val });
          } else if (slider.dataset.speed !== undefined) {
            self._hass.callService('fan', 'set_percentage', { entity_id: entityId, percentage: val });
          }
          setTimeout(() => self._updateStates(), 100);
        };
      });
      el.querySelectorAll('select[data-option]').forEach(select => {
        select.onchange = e => {
          e.stopPropagation();
          self._hass.callService('input_select', 'select_option', { entity_id: entityId, option: e.target.value });
          setTimeout(() => self._updateStates(), 100);
        };
      });
      el.querySelectorAll('input[type="number"][data-value]').forEach(input => {
        input.onchange = e => {
          e.stopPropagation();
          self._hass.callService('input_number', 'set_value', { entity_id: entityId, value: parseFloat(e.target.value) });
          setTimeout(() => self._updateStates(), 100);
        };
      });
    });
  }

  _callService(entityId, action) {
    if (!this._hass) return;
    const [domain] = entityId.split('.');
    const state = this._hass.states[entityId];
    let serviceDomain = domain;
    let service = action;
    
    if (domain === 'button') {
      service = 'press';
    } else if (domain === 'script') {
      serviceDomain = 'script';
      service = entityId.split('.')[1];
    } else if (domain === 'scene') {
      service = 'turn_on';
    } else if (domain === 'automation') {
      service = action === 'toggle' ? 'toggle' : (action === 'turn_off' ? 'turn_off' : 'trigger');
    } else if (domain === 'input_button') {
      service = 'press';
    } else if (action === 'toggle' && state) {
      service = state.state === 'on' ? 'turn_off' : 'turn_on';
    }
    
    if (domain === 'script') {
      this._hass.callService(serviceDomain, service, {});
    } else {
      this._hass.callService(serviceDomain, service, { entity_id: entityId });
    }
    setTimeout(() => this._updateStates(), 100);
  }

  _onClick(event) {
    event.stopPropagation();
    const entityId = event.currentTarget.dataset.entity;
    if (!entityId) return;
    const action = event.currentTarget.dataset.action;
    if (action === 'toggle') {
      this._toggle(entityId);
      return;
    }
    if (!this._longPressTimeout) this._toggle(entityId);
  }

  _onTouchStart(event) {
    const entityId = event.currentTarget.dataset.entity;
    if (!entityId) return;
    this._longPressTimeout = setTimeout(() => {
      this._showMoreInfo(entityId);
      this._longPressTimeout = null;
    }, 500);
  }

  _onTouchEnd() {
    if (this._longPressTimeout) {
      clearTimeout(this._longPressTimeout);
      this._longPressTimeout = null;
    }
  }

  _onMouseDown(event) {
    const entityId = event.currentTarget.dataset.entity;
    if (!entityId) return;
    this._longPressTimeout = setTimeout(() => {
      this._showMoreInfo(entityId);
      this._longPressTimeout = null;
    }, 500);
  }

  _onMouseUp() {
    if (this._longPressTimeout) {
      clearTimeout(this._longPressTimeout);
      this._longPressTimeout = null;
    }
  }

  _toggle(entityId) {
    if (!this._hass) return;
    const state = this._hass.states[entityId];
    if (!state) return;
    let service = 'toggle';
    if (state.state === 'on') service = 'turn_off';
    else if (state.state === 'off') service = 'turn_on';
    const [domain] = entityId.split('.');
    this._hass.callService(domain, service, { entity_id: entityId });
  }

  _showMoreInfo(entityId) {
    const event = new Event('hass-more-info', {
      bubbles: true,
      composed: true
    });
    event.detail = { entityId };
    this.dispatchEvent(event);
  }

  _renderFallback() {
    if (!this._rootElement || !this._hass) return;
    const entities = this._entities || [];
    const content = entities.map(entityId => {
      const state = this._hass.states[entityId];
      if (!state) return '';
      return `<div class="entity" data-entity="${entityId}"><div class="entity-name">${state.attributes.friendly_name || entityId}</div><div class="state-text">${state.state}</div></div>`;
    }).join('');
    this._rootElement.innerHTML = content;
    this._processStyles();
    this._setupEventListeners();
  }

  _updateStates() {
    if (!this._entities || !this._hass || !this._rootElement) return;
    try {
      this._entities.forEach(entityId => {
        const stateObj = this._hass.states[entityId];
        if (!stateObj) return;
        const elements = this._rootElement.querySelectorAll(`[data-entity="${entityId}"]`);
        elements.forEach(el => {
          try {
            el.dataset.state = stateObj.state;
            el.querySelectorAll('[data-state-text]').forEach(e => e.textContent = stateObj.state);
            el.querySelectorAll('[data-attr]').forEach(e => {
              const attr = e.dataset.attr;
              e.textContent = stateObj.attributes[attr] ?? '';
            });
            el.querySelectorAll('[data-brightness]').forEach(e => {
              const b = stateObj.attributes.brightness;
              if (e.tagName === 'INPUT') e.value = b ? Math.round(b * 100 / 255) : 0;
              else e.textContent = b ? Math.round(b * 100 / 255) + '%' : '0%';
            });
            el.querySelectorAll('[data-temperature]').forEach(e => {
              e.textContent = stateObj.attributes.temperature ?? stateObj.attributes.current_temperature ?? '';
            });
            el.querySelectorAll('[data-friendly-name]').forEach(e => {
              e.textContent = stateObj.attributes.friendly_name || entityId;
            });
          } catch { }
        });
      });
    } catch { }
  }

  _shouldUpdate(oldHass) {
    if (!this._rendered) return true;
    if (!oldHass) return false;
    if (this._config.always_update) return true;
    if (!this._entities || this._entities.length === 0) return false;
    return this._entities.some(entity => {
      const oldState = oldHass.states[entity];
      const newState = this._hass.states[entity];
      if (!oldState || !newState) return false;
      if (oldState.state !== newState.state) return true;
      if (JSON.stringify(oldState.attributes) !== JSON.stringify(newState.attributes)) return true;
      return false;
    });
  }

  setConfig(config) {
    const oldConfig = this._config;
    const defaultConfig = {
      content: '',
      update_interval: 10000,
      do_not_parse: false,
      ignore_line_breaks: true,
      scripts: []
    };
    config = { ...defaultConfig, ...config };
    config = this.constructor.preProcessScripts(config);
    if (!config.content) throw new Error("Content must be defined");
    if (config.scripts && !Array.isArray(config.scripts)) throw new Error("Scripts must be an array");
    const configChanged = !oldConfig || oldConfig.content !== config.content || oldConfig.do_not_parse !== config.do_not_parse;
    this._config = config;
    if (configChanged) {
      this._rendered = false;
      this._lastContent = null;
    }
    this._calculateEntities();
    if (!this._rootElement) this._createRootElement();
    this._setupEventListeners();
    this._setupTimeUpdate();
    if (this._hass && this._rootElement) {
      this._processAndRender();
    }
  }

  _calculateEntities() {
    this._entities = new Set();
    if (this._config.entities?.length) this._config.entities.forEach(entity => this._entities.add(entity));
    const entityRegex = /\b(?:light|switch|sensor|climate|media_player)\.[a-zA-Z0-9_]+\b/g;
    const matches = this._config.content.match(entityRegex) || [];
    matches.forEach(entity => this._entities.add(entity));
    this._entities = Array.from(this._entities);
  }

  _processStyles() {
    const style = document.createElement('style');
    style.textContent = '[data-entity]{cursor:pointer;-webkit-tap-highlight-color:transparent}input[type="range"]{-webkit-appearance:none;width:100%;background:transparent}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none}';
    this._rootElement.insertBefore(style, this._rootElement.firstChild);
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("html-pro-card", HtmlTemplateCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "html-pro-card",
  name: "HTML Pro Card",
  preview: true,
  description: "Advanced HTML card with Jinja2 template support"
});

(function() {
  if (window.claw) return;
  const _getHass = () => document.querySelector('home-assistant')?.hass;
  const _overlay = window._htmlProCardOverlay || (() => {
    const o = document.createElement('div');
    o.id = 'html-pro-card-overlay';
    o.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;overflow:hidden;';
    document.body.appendChild(o);
    return o;
  })();

  const claw = {};

  claw.hass = () => _getHass();

  claw.callService = (domain, service, data) => {
    const h = _getHass();
    if (!h) throw new Error('hass not available');
    return h.callService(domain, service, data || {});
  };

  claw.state = (entityId) => {
    const h = _getHass();
    return h?.states?.[entityId] || null;
  };

  claw.states = (filter) => {
    const h = _getHass();
    if (!h?.states) return {};
    if (!filter) return h.states;
    const out = {};
    for (const [k, v] of Object.entries(h.states)) {
      if (k.startsWith(filter) || k.includes(filter)) out[k] = v;
    }
    return out;
  };

  claw.toggle = (entityId) => {
    const s = claw.state(entityId);
    if (!s) return;
    const [domain] = entityId.split('.');
    const svc = s.state === 'on' ? 'turn_off' : 'turn_on';
    return claw.callService(domain, svc, { entity_id: entityId });
  };

  claw.press = (entityId) => {
    const [domain] = entityId.split('.');
    if (domain === 'button' || domain === 'input_button') return claw.callService(domain, 'press', { entity_id: entityId });
    if (domain === 'scene') return claw.callService('scene', 'turn_on', { entity_id: entityId });
    if (domain === 'script') return claw.callService('script', entityId.split('.')[1], {});
    if (domain === 'automation') return claw.callService('automation', 'trigger', { entity_id: entityId });
    return claw.toggle(entityId);
  };

  claw.navigate = (path) => {
    history.pushState(null, '', path);
    window.dispatchEvent(new CustomEvent('location-changed'));
  };

  claw.moreInfo = (entityId) => {
    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
    ev.detail = { entityId };
    document.querySelector('home-assistant')?.dispatchEvent(ev);
  };

  claw.fire = (type, detail) => {
    const h = _getHass();
    if (!h?.connection) return;
    h.connection.sendMessage({ type: 'fire_event', event_type: type, event_data: detail || {} });
  };

  claw.ws = (msg) => {
    const h = _getHass();
    if (!h?.connection) throw new Error('ws not available');
    return h.connection.sendMessagePromise(msg);
  };

  claw.el = (tag, attrs, parent) => {
    const e = document.createElement(tag);
    if (typeof attrs === 'string') e.style.cssText = attrs;
    else if (attrs) Object.entries(attrs).forEach(([k, v]) => k === 'style' ? e.style.cssText = v : k === 'text' ? e.textContent = v : e.setAttribute(k, v));
    if (parent) parent.appendChild(e);
    else document.body.appendChild(e);
    return e;
  };

  claw.remove = (idOrEl) => {
    const el = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
    if (el) el.remove();
  };

  claw.inject = (css) => {
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
    return { remove: () => s.remove() };
  };

  claw.wait = (ms) => new Promise(r => setTimeout(r, ms));

  claw.deepQuery = (selector) => {
    const walk = (root) => {
      if (!root) return null;
      let el = root.querySelector?.(selector);
      if (el) return el;
      const children = root.querySelectorAll?.('*') || [];
      for (const c of children) {
        if (c.shadowRoot) { el = walk(c.shadowRoot); if (el) return el; }
      }
      return null;
    };
    return walk(document);
  };

  claw.deepQueryAll = (selector) => {
    const results = [];
    const walk = (root) => {
      if (!root) return;
      root.querySelectorAll?.(selector)?.forEach(e => results.push(e));
      root.querySelectorAll?.('*')?.forEach(c => { if (c.shadowRoot) walk(c.shadowRoot); });
    };
    walk(document);
    return results;
  };

  window.claw = claw;
})();
