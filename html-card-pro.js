import { html, LitElement } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";
const _globalLoadedScripts = window._htmlProCardScripts || (window._htmlProCardScripts = new Set());

if (!document.getElementById('html-pro-card-overlay')) {
  const overlay = document.createElement('div');
  overlay.id = 'html-pro-card-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;overflow:hidden;';
  document.body.appendChild(overlay);
}
window._htmlProCardOverlay = document.getElementById('html-pro-card-overlay');

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

if (!customElements.get('ha-htmlcard-textarea')) {
  customElements.define('ha-htmlcard-textarea', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._value = '';
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; }
          textarea {
            width: 100%;
            height: 400px;
            padding: 12px;
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 8px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color, #333);
            font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            line-height: 1.6;
            resize: vertical;
            box-sizing: border-box;
            tab-size: 2;
          }
          textarea:focus {
            outline: none;
            border-color: var(--primary-color, #03a9f4);
            box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.15);
          }
          textarea::-webkit-scrollbar { width: 8px; height: 8px; }
          textarea::-webkit-scrollbar-track { background: transparent; border-radius: 4px; }
          textarea::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 4px; }
          textarea::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); }
        </style>
        <textarea spellcheck="false"></textarea>
      `;
      this._input = this.shadowRoot.querySelector('textarea');
      this._input.addEventListener('input', () => {
        this._value = this._input.value;
        this.dispatchEvent(new CustomEvent('change', { detail: { value: this._value }, bubbles: true, composed: true }));
      });
      this._input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = this._input.selectionStart;
          const end = this._input.selectionEnd;
          this._input.value = this._input.value.substring(0, start) + '  ' + this._input.value.substring(end);
          this._input.selectionStart = this._input.selectionEnd = start + 2;
          this._value = this._input.value;
          this.dispatchEvent(new CustomEvent('change', { detail: { value: this._value }, bubbles: true, composed: true }));
        }
      });
    }
    set value(val) {
      this._value = val || '';
      if (this._input.value !== this._value) this._input.value = this._value;
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
          padding: 16px;
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
          max-height: 280px;
          overflow-y: auto;
        }
        .store-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 6px;
          margin-bottom: 8px;
          background: var(--card-background-color, #fff);
        }
        .store-item:hover {
          border-color: var(--primary-color, #03a9f4);
        }
        .store-item:last-child {
          margin-bottom: 0;
        }
        .store-item-info h4 {
          margin: 0;
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .store-item-info p {
          margin: 2px 0 0;
          font-size: 11px;
          color: var(--secondary-text-color);
        }
        .store-item-author {
          display: inline-block;
          margin-top: 4px;
          font-size: 10px;
          color: var(--secondary-text-color);
          font-style: italic;
        }
        .store-item-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          background: var(--primary-color, #03a9f4);
          color: #fff;
        }
        .store-item-btn:hover {
          opacity: 0.9;
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
          <span class="header-version">v2.9</span>
          <div class="header-logo">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2V3H12V9H11V10H9V11H8V12H7V13H5V12H4V11H3V9H2V15H3V16H4V17H5V18H6V22H8V21H7V20H8V19H9V18H10V19H11V22H13V21H12V17H13V16H14V15H15V12H16V13H17V11H15V9H20V8H17V7H22V3H21V2M14 3H15V4H14Z"/></svg>
          </div>
          <div class="header-desc">
            高级 HTML 卡片编辑器，支持 Jinja2 模板语法<br>
            可使用 Home Assistant 状态、属性和服务调用
          </div>
          <div class="header-features">
            <div class="header-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
              实时更新
            </div>
            <div class="header-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              外部脚本
            </div>
            <div class="header-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              自定义样式
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
              <span class="collapse-title">HTML 内容</span>
            </div>
            <span class="collapse-arrow ${this._showHtml ? 'expanded' : ''}"></span>
          </div>
          <div class="collapse-body ${this._showHtml ? 'expanded' : ''}">
            <div class="collapse-content">
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
              <span class="collapse-title">选项设置</span>
            </div>
            <span class="collapse-arrow ${this._showOptions ? 'expanded' : ''}"></span>
          </div>
          <div class="collapse-body ${this._showOptions ? 'expanded' : ''}">
            <div class="collapse-content">
              <div class="option-row">
                <div>
                  <div class="option-label">禁用模板解析</div>
                  <div class="option-desc">不使用模板功能可提高性能</div>
                </div>
                <ha-htmlcard-switch
                  .checked="${this._config.do_not_parse || false}"
                  @change="${this._handleParseChange}"
                ></ha-htmlcard-switch>
              </div>
              <div class="option-row">
                <div>
                  <div class="option-label">忽略换行</div>
                  <div class="option-desc">忽略HTML中的换行符</div>
                </div>
                <ha-htmlcard-switch
                  .checked="${this._config.ignore_line_breaks || false}"
                  @change="${this._handleLineBreaksChange}"
                ></ha-htmlcard-switch>
              </div>
              <div class="option-row">
                <div>
                  <div class="option-label">更新间隔 (ms)</div>
                  <div class="option-desc">0 为禁用自动更新</div>
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
              <span class="collapse-title">外部脚本</span>
            </div>
            <span class="collapse-arrow ${this._showScripts ? 'expanded' : ''}"></span>
          </div>
          <div class="collapse-body ${this._showScripts ? 'expanded' : ''}">
            <div class="collapse-content">
              <div class="script-input-container">
                <ha-textfield
                  type="url"
                  placeholder="输入脚本 URL"
                  .value="${this._newScriptUrl || ''}"
                  @change="${e => this._newScriptUrl = e.target.value}"
                ></ha-textfield>
                <mwc-button @click="${this._addScript}">添加</mwc-button>
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
              <span class="collapse-title">模块商店</span>
            </div>
            <span class="collapse-arrow ${this._showStore ? 'expanded' : ''}"></span>
          </div>
          <div class="collapse-body ${this._showStore ? 'expanded' : ''}">
            <div class="collapse-content">
              <div class="store-search">
                <input type="text" placeholder="搜索模块..." .value="${this._storeSearch}" @input="${e => { this._storeSearch = e.target.value; this.requestUpdate(); }}">
              </div>
              <div class="store-list">
                ${this._storeLoading ? html`<div class="store-loading">加载中...</div>` : this._renderOnlineModules()}
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
    
    const newConfig = {
      ...this._config,
      content: e.detail.value
    };
    
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    }));
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
      
      if (!inMultiline) {
        const match = line.match(/^(\w+):\s*(.*)$/);
        if (match) {
          currentKey = match[1];
          const value = match[2];
          if (value === '|') {
            inMultiline = true;
            multilineValue = [];
          } else {
            result[currentKey] = value.replace(/^["']|["']$/g, '');
          }
        }
      }
    }
    
    if (inMultiline && currentKey) {
      result[currentKey] = multilineValue.join('\n').trim();
    }
    
    return result;
  }

  async _loadOnlineModules() {
    this._storeLoading = true;
    this.requestUpdate();
    const baseUrl = 'https://raw.githubusercontent.com/knoop7/html-card-pro/main';
    try {
      const res = await fetch(`${baseUrl}/modules.json`);
      if (res.ok) {
        const index = await res.json();
        this._storeModules = index.map(m => ({
          ...m,
          _file: m.file,
          _baseUrl: baseUrl
        }));
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
      return html`<div class="store-loading">暂无模块</div>`;
    }
    return filtered.map(m => html`
      <div class="store-item">
        <div class="store-item-info">
          <h4>${m.name}</h4>
          <p>${m.desc}</p>
          ${m.author ? html`<span class="store-item-author">by ${m.author}</span>` : ''}
        </div>
        <div class="store-item-actions">
          <button class="store-item-btn import" @click="${() => this._importModule(m)}">导入</button>
        </div>
      </div>
    `);
  }

  _renderSavedModules() {
    const filtered = this._savedModules.filter(m => 
      !this._storeSearch || m.name.toLowerCase().includes(this._storeSearch.toLowerCase())
    );
    if (filtered.length === 0) {
      return html`<div class="store-loading">暂无自定义模块</div>`;
    }
    return filtered.map((m, i) => html`
      <div class="store-item">
        <div class="store-item-info">
          <h4>${m.name}</h4>
          <p>${m.desc || '自定义模块'}</p>
        </div>
        <div class="store-item-actions">
          <button class="store-item-btn import" @click="${() => this._importModule(m)}">导入</button>
          <button class="store-item-btn delete" @click="${() => this._deleteModule(i)}">删除</button>
        </div>
      </div>
    `);
  }

  async _importModule(m) {
    if (!this._config) return;
    
    let content = m.content;
    
    if (m._file && m._baseUrl) {
      try {
        const res = await fetch(`${m._baseUrl}/${m._file}`);
        if (res.ok) {
          const yamlText = await res.text();
          const parsed = this._parseYaml(yamlText);
          content = parsed.content || '';
        }
      } catch (e) {
        console.error('Failed to load module:', e);
        return;
      }
    }
    
    const newConfig = {
      ...this._config,
      content: content,
      do_not_parse: content.includes('<script>'),
      ignore_line_breaks: true
    };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    }));
    this._showStore = false;
    this.requestUpdate();
  }

  _deleteModule(index) {
    if (!confirm('确定删除此模块?')) return;
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

  static get editorSchema() {
    return {
      type: 'object',
      required: ['content'],
      properties: {
        content: {
          type: 'string',
          title: 'HTML内容',
          default: '<div class="grid p-4"><div class="entity" data-entity="light.example">示例实体</div></div>'
        },
        update_interval: {
          type: 'number',
          title: '更新间隔',
          default: 1000
        },
        do_not_parse: {
          type: 'boolean',
          title: '禁用模板解析',
          default: false
        },
        ignore_line_breaks: {
          type: 'boolean',
          title: '忽略换行',
          default: false
        },
        scripts: {
          type: 'array',
          title: '外部脚本',
          items: { type: 'string' },
          default: []
        }
      }
    };
  }

  static preProcessScripts(config) {
    if (typeof config.scripts === 'string') config.scripts = config.scripts.split('\n').filter(url => url.trim() !== '');
    return config;
  }

  static getStubConfig() {
    return {
      content: `<style>
.mag{padding:24px;text-align:center}
.mag-icon{width:40px;height:40px;margin:0 auto 12px}
.mag-icon svg{width:100%;height:100%;stroke:#333}
.mag-t{font-size:18px;font-weight:700;letter-spacing:-0.5px;color:#222}
.mag-d{font-size:12px;color:#888;margin-top:4px}
</style>
<div class="mag">
<div class="mag-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
<div class="mag-t">Html Pro Card</div>
<div class="mag-d">Jinja2 · HA States · Custom JS</div>
</div>`,
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
  }

  _createRootElement() {
    if (this._rootElement) this.removeChild(this._rootElement);
    this._rootElement = document.createElement('ha-card');
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
    if (shouldUpdate) this._processAndRender();
  }

  _setupTimeUpdate() {
    if (this._timeUpdateInterval) clearInterval(this._timeUpdateInterval);
    if (this._config.update_interval && this._config.update_interval > 0 && !this._config.do_not_parse) {
      const interval = Math.max(this._config.update_interval, 1000);
      this._timeUpdateInterval = setInterval(() => this._processAndRender(), interval);
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
        this._templateSubscription();
        this._templateSubscription = null;
      }
      let firstRender = true;
      this._hass.connection.subscribeMessage(msg => {
        if (firstRender || this._config.always_update) {
          firstRender = false;
          try {
            this._render(msg.result);
          } catch {
            this._renderFallback();
          }
        }
      }, { type: "render_template", template: content }).then(unsub => {
        this._templateSubscription = unsub;
      }).catch(() => {
        this._renderFallback();
      });
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
    try {
      while (this._rootElement.lastChild) this._rootElement.removeChild(this._rootElement.lastChild);
      window.hassTemplateCard = { hass: this._hass, config: this._config, root: this._rootElement };
      window._htmlProCardRoots.add(this._rootElement);
      this._rootElement.innerHTML = content;
      this._rendered = true;
      this._setupClickHandlers(this._rootElement);
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
    const elements = card.querySelectorAll('[data-entity]');
    elements.forEach(element => {
      element.removeEventListener('click', this._onClick);
      element.removeEventListener('touchstart', this._onTouchStart);
      element.removeEventListener('touchend', this._onTouchEnd);
      element.removeEventListener('mousedown', this._onMouseDown);
      element.removeEventListener('mouseup', this._onMouseUp);
      element.addEventListener('click', this._onClick.bind(this));
      element.addEventListener('touchstart', this._onTouchStart.bind(this));
      element.addEventListener('touchend', this._onTouchEnd.bind(this));
      element.addEventListener('mousedown', this._onMouseDown.bind(this));
      element.addEventListener('mouseup', this._onMouseUp.bind(this));
    });
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
        const state = this._hass.states[entityId];
        if (!state) return;
        const elements = this._rootElement.querySelectorAll(`[data-entity="${entityId}"]`);
        elements.forEach(element => {
          try {
            const stateText = element.querySelector('.state-text');
            if (stateText) stateText.textContent = state.state;
            const toggleBtn = element.querySelector('.toggle-btn');
            if (toggleBtn) {
              toggleBtn.dataset.state = state.state;
              toggleBtn.textContent = state.state === 'on' ? '关闭' : '开启';
            }
            const slider = element.querySelector('input[type="range"]');
            if (slider) {
              const brightness = state.attributes.brightness;
              slider.value = brightness ? Math.round((brightness * 100) / 255) : (state.state === 'on' ? 100 : 0);
            }
          } catch { }
        });
      });
    } catch { }
  }

  _shouldUpdate(oldHass) {
    if (!this._rendered) return true;
    if (!oldHass) return false;
    if (this._config.do_not_parse) return false;
    if (this._config.always_update) return true;
    if (!this._entities || this._entities.length === 0) return false;
    return this._entities.some(entity => {
      const oldState = oldHass.states[entity];
      const newState = this._hass.states[entity];
      if (!oldState || !newState) return false;
      return oldState.state !== newState.state;
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
      if (this._hass && this._rootElement) {
        this._processAndRender();
      }
    }
    this._calculateEntities();
    if (!this._rootElement) this._createRootElement();
    this._setupEventListeners();
    this._setupTimeUpdate();
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
  description: "可自定义各类HTML内容的模板超强卡片"
});
