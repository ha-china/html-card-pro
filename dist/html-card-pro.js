import { html, LitElement } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";
const HTML_PRO_CARD_VERSION = '3.6';
console.info(`%cHTML Pro %c ${HTML_PRO_CARD_VERSION}`, 'color:#03a9f4;font-weight:600', 'color:#999');
const _globalLoadedScripts = window._htmlProCardScripts || (window._htmlProCardScripts = new Set());

if (!document.getElementById('html-pro-card-overlay')) {
  const overlay = document.createElement('div');
  overlay.id = 'html-pro-card-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;';
  document.body.appendChild(overlay);
}
window._htmlProCardOverlay = document.getElementById('html-pro-card-overlay');

(function() {
  const _ov = window._htmlProCardOverlay;
  if (!_ov) return;
  const _clearAll = () => {
    _ov.innerHTML = '';
  };
  window.addEventListener('location-changed', _clearAll);
  _ov.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action][data-entity]') || e.target.closest('[data-action]');
    if (!btn) return;
    const entity = btn.dataset.entity || btn.closest('[data-entity]')?.dataset.entity;
    const action = btn.dataset.action;
    if (!entity || !action) return;
    const hass = document.querySelector('home-assistant')?.hass;
    if (!hass) return;
    const [domain] = entity.split('.');
    if (action === 'more-info') {
      const ev = new Event('hass-more-info', { bubbles: true, composed: true });
      ev.detail = { entityId: entity };
      _ov.dispatchEvent(ev);
      return;
    }
    let service = action;
    if (action === 'toggle') {
      const st = hass.states[entity];
      if (domain === 'lock') service = st?.state === 'locked' ? 'unlock' : 'lock';
      else if (domain === 'cover') service = (st?.state === 'open' || st?.state === 'opening') ? 'close_cover' : 'open_cover';
      else if (domain === 'button' || domain === 'input_button') service = 'press';
      else if (domain === 'scene') service = 'turn_on';
      else if (domain === 'script') { hass.callService('script', entity.split('.')[1], {}); return; }
      else if (st) service = st.state === 'on' ? 'turn_off' : 'turn_on';
    }
    hass.callService(domain, service, { entity_id: entity });
  });
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
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(0, 0, 0, 0.02);
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }
          .pce-container:focus-within {
            border-color: var(--primary-color, #03a9f4);
            box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color, 3, 169, 244), 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.02);
          }
          .pce-container .prism-code-editor {
            height: 300px !important;
            min-height: 350px !important;
            font-size: 13px !important;
          }
          .pce-fallback {
            width: 100%;
            height: 400px;
            padding: 14px 16px;
            border: none;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color, #333);
            font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            line-height: 1.6;
            resize: vertical;
            box-sizing: border-box;
            outline: none;
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
    yamlHint: '支持直接粘贴完整YAML配置',
    storeDesc: '从社区获取模块',
    version: '版本',
    by: '作者',
    supports: '支持',
    viewSource: '查看',
    slideToImport: '滑动导入 →',
    loadError: '加载失败，请稍后重试',
    refreshing: '刷新中...'
  },
  'zh-Hant': {
    htmlContent: 'HTML 內容',
    options: '選項設置',
    scripts: '外部腳本',
    store: '模組商店',
    disableParse: '純HTML模式',
    disableParseDesc: '預設關閉(使用Jinja2)，開啟後直接渲染HTML',
    updateInterval: '更新間隔 (ms)',
    updateIntervalDesc: '0 為禁用自動更新',
    ignoreLineBreaks: '忽略換行',
    ignoreLineBreaksDesc: '忽略HTML中的換行符',
    addScript: '添加',
    scriptPlaceholder: '輸入腳本 URL',
    searchPlaceholder: '搜尋模組...',
    import: '導入',
    delete: '刪除',
    loading: '載入中...',
    noModules: '暫無模組',
    noCustomModules: '暫無自定義模組',
    confirmDelete: '確定刪除此模組?',
    customModule: '自定義模組',
    headerDesc: '高級 HTML 卡片編輯器，支持 Jinja2 模板語法',
    headerDesc2: '可使用 Home Assistant 狀態、屬性和服務調用',
    realtime: '即時更新',
    extScripts: '外部腳本',
    customStyle: '自定義樣式',
    yamlHint: '支持直接貼上完整YAML配置',
    storeDesc: '從社區獲取模組',
    version: '版本',
    by: '作者',
    supports: '支持',
    viewSource: '查看',
    slideToImport: '滑動導入 →',
    loadError: '載入失敗，請稍後重試',
    refreshing: '刷新中...'
  },
  ja: {
    htmlContent: 'HTML コンテンツ',
    options: 'オプション',
    scripts: '外部スクリプト',
    store: 'モジュールストア',
    disableParse: '純粋HTMLモード',
    disableParseDesc: 'デフォルトオフ(Jinja2使用)、オンでHTML直接レンダリング',
    updateInterval: '更新間隔 (ms)',
    updateIntervalDesc: '0で自動更新無効',
    ignoreLineBreaks: '改行を無視',
    ignoreLineBreaksDesc: 'HTML内の改行を無視',
    addScript: '追加',
    scriptPlaceholder: 'スクリプトURLを入力',
    searchPlaceholder: 'モジュールを検索...',
    import: 'インポート',
    delete: '削除',
    loading: '読み込み中...',
    noModules: 'モジュールなし',
    noCustomModules: 'カスタムモジュールなし',
    confirmDelete: 'このモジュールを削除しますか？',
    customModule: 'カスタムモジュール',
    headerDesc: 'Jinja2テンプレート対応の高度なHTMLカードエディター',
    headerDesc2: 'Home Assistantの状態、属性、サービスを使用可能',
    realtime: 'リアルタイム',
    extScripts: 'スクリプト',
    customStyle: 'カスタムCSS',
    yamlHint: '完全なYAML設定を直接貼り付け可能',
    storeDesc: 'コミュニティからモジュールを取得',
    version: 'v',
    by: '作者',
    supports: '対応',
    viewSource: '表示',
    slideToImport: 'スライドでインポート →',
    loadError: '読み込み失敗、後でもう一度お試しください',
    refreshing: '更新中...'
  },
  de: {
    htmlContent: 'HTML-Inhalt',
    options: 'Optionen',
    scripts: 'Externe Skripte',
    store: 'Modul-Store',
    disableParse: 'Reiner HTML-Modus',
    disableParseDesc: 'Standard aus (Jinja2), aktivieren für direktes HTML-Rendering',
    updateInterval: 'Aktualisierungsintervall (ms)',
    updateIntervalDesc: '0 deaktiviert Auto-Update',
    ignoreLineBreaks: 'Zeilenumbrüche ignorieren',
    ignoreLineBreaksDesc: 'Zeilenumbrüche in HTML ignorieren',
    addScript: 'Hinzufügen',
    scriptPlaceholder: 'Skript-URL eingeben',
    searchPlaceholder: 'Module suchen...',
    import: 'Importieren',
    delete: 'Löschen',
    loading: 'Laden...',
    noModules: 'Keine Module',
    noCustomModules: 'Keine benutzerdefinierten Module',
    confirmDelete: 'Dieses Modul löschen?',
    customModule: 'Benutzerdefiniertes Modul',
    headerDesc: 'Erweiterter HTML-Karten-Editor mit Jinja2-Vorlage',
    headerDesc2: 'Home Assistant Zustände, Attribute und Dienste nutzen',
    realtime: 'Echtzeit',
    extScripts: 'Skripte',
    customStyle: 'Benutzerdefiniertes CSS',
    yamlHint: 'Vollständige YAML-Konfiguration direkt einfügen',
    storeDesc: 'Module aus der Community abrufen',
    version: 'v',
    by: 'von',
    supports: 'Unterstützt',
    viewSource: 'Anzeigen',
    slideToImport: 'Zum Importieren schieben →',
    loadError: 'Laden fehlgeschlagen, bitte später erneut versuchen',
    refreshing: 'Aktualisieren...'
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
    yamlHint: 'Paste full YAML config directly',
    storeDesc: 'Get modules from community',
    version: 'v',
    by: 'by',
    supports: 'Supports',
    viewSource: 'View',
    slideToImport: 'Slide to Import →',
    loadError: 'Failed to load, please try again',
    refreshing: 'Refreshing...'
  }
};

const MODULE_STORE_CONFIG = {
  repo: 'ha-china/html-card-pro',
  indexUrl: 'https://api.github.com/repos/ha-china/html-card-pro/contents/mods',
  rawBase: 'https://raw.githubusercontent.com/ha-china/html-card-pro/main/mods/',
  cacheKey: 'html-pro-card-modules-cache',
  cacheTTL: 5 * 60 * 1000
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
    const lang = this.hass?.language || '';
    if (lang === 'zh-Hant' || lang.startsWith('zh-TW') || lang.startsWith('zh-HK')) return 'zh-Hant';
    if (lang.startsWith('zh')) return 'zh';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('de')) return 'de';
    return 'en';
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

  _getCachedModules() {
    try {
      const cached = localStorage.getItem(MODULE_STORE_CONFIG.cacheKey);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > MODULE_STORE_CONFIG.cacheTTL) return null;
      return data;
    } catch { return null; }
  }

  _setCachedModules(data) {
    try {
      localStorage.setItem(MODULE_STORE_CONFIG.cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch {}
  }

  _parseModuleFromMarkdown(text) {
    const modules = [];
    const yamlBlockRegex = /```ya?ml\s*([\s\S]*?)```/gi;
    let match;
    
    while ((match = yamlBlockRegex.exec(text)) !== null) {
      const yamlContent = match[1].trim();
      try {
        if (yamlContent.startsWith('type: custom:html-pro-card') || yamlContent.includes('\ntype: custom:html-pro-card')) {
          const cardConfig = this._parseCardYaml(yamlContent);
          if (cardConfig && cardConfig.content) {
            const titleMatch = text.match(/\*\*([^*]+)\*\*/);
            const authorMatch = text.match(/\*\*Author\*\*:\s*(\S+)/i) || text.match(/Author:\s*(\S+)/i);
            const versionMatch = text.match(/\*\*Version\*\*:\s*(\S+)/i) || text.match(/Version:\s*(\S+)/i);
            
            modules.push({
              name: titleMatch ? titleMatch[1].trim() : 'Untitled Module',
              version: versionMatch ? versionMatch[1] : '1.0',
              creator: authorMatch ? authorMatch[1] : 'Community',
              description: '',
              _cardConfig: cardConfig,
              code: cardConfig.content,
              scripts: cardConfig.scripts || []
            });
          }
        } else {
          const module = this._parseModuleYaml(yamlContent);
          if (module && module.name && module.code) {
            modules.push(module);
          }
        }
      } catch {}
    }
    return modules;
  }

  _parseCardYaml(yamlText) {
    const result = {};
    const lines = yamlText.split('\n');
    let currentKey = null;
    let multilineValue = [];
    let inMultiline = false;
    let baseIndent = 0;
    let inArray = false;
    let arrayKey = null;
    let arrayValues = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      if (!trimmed && !inMultiline) continue;

      const indent = line.search(/\S|$/);

      if (inMultiline) {
        if (indent > baseIndent || trimmed === '') {
          multilineValue.push(line.slice(baseIndent + 2) || '');
          continue;
        } else {
          result[currentKey] = multilineValue.join('\n');
          inMultiline = false;
          multilineValue = [];
        }
      }

      if (inArray) {
        if (trimmed.startsWith('- ')) {
          arrayValues.push(trimmed.slice(2).trim());
          continue;
        } else if (indent <= baseIndent) {
          result[arrayKey] = arrayValues;
          inArray = false;
          arrayValues = [];
        } else {
          continue;
        }
      }

      const kvMatch = trimmed.match(/^([\w_-]+):\s*(.*)$/);
      if (kvMatch) {
        const [, key, value] = kvMatch;
        if (value === '|-' || value === '|') {
          currentKey = key;
          baseIndent = indent;
          inMultiline = true;
          multilineValue = [];
        } else if (value === '') {
          arrayKey = key;
          baseIndent = indent;
          inArray = true;
          arrayValues = [];
        } else if (value.startsWith('"') || value.startsWith("'")) {
          result[key] = value.slice(1, -1);
        } else {
          result[key] = value === 'true' ? true : value === 'false' ? false : value;
        }
      }
    }

    if (inMultiline && currentKey) {
      result[currentKey] = multilineValue.join('\n');
    }
    if (inArray && arrayKey) {
      result[arrayKey] = arrayValues;
    }

    return result;
  }

  _parseModuleYaml(yamlText) {
    const lines = yamlText.split('\n');
    const result = { editor: [] };
    let currentKey = null;
    let currentIndent = 0;
    let multilineValue = [];
    let inMultiline = false;
    let inEditor = false;
    let editorItem = null;
    let inSelector = false;
    let selectorData = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed) continue;

      const indent = line.search(/\S/);

      if (inMultiline) {
        if (indent > currentIndent || trimmed === '') {
          multilineValue.push(line.slice(currentIndent + 2) || '');
          continue;
        } else {
          result[currentKey] = multilineValue.join('\n');
          inMultiline = false;
          multilineValue = [];
        }
      }

      if (indent === 0 && trimmed.endsWith(':') && !trimmed.includes(' ')) {
        const key = trimmed.slice(0, -1);
        if (key === 'editor') {
          inEditor = true;
          continue;
        }
        currentKey = key;
        continue;
      }

      if (inEditor) {
        if (indent === 0 && !trimmed.startsWith('-')) {
          inEditor = false;
        } else if (trimmed.startsWith('- name:')) {
          if (editorItem) result.editor.push(editorItem);
          editorItem = { name: trimmed.replace('- name:', '').trim() };
          inSelector = false;
        } else if (editorItem && indent >= 2) {
          const kvMatch = trimmed.match(/^([\w-]+):\s*(.*)$/);
          if (kvMatch) {
            const [, k, v] = kvMatch;
            if (k === 'selector') {
              inSelector = true;
              selectorData = {};
            } else if (inSelector && indent >= 4) {
              if (k === 'select' || k === 'text' || k === 'condition') {
                editorItem.selector = { type: k };
              }
            } else {
              editorItem[k] = v.replace(/^["']|["']$/g, '');
            }
          }
        }
        continue;
      }

      const kvMatch = trimmed.match(/^([\w-]+):\s*(.*)$/);
      if (kvMatch) {
        const [, key, value] = kvMatch;
        if (value === '|') {
          currentKey = key;
          currentIndent = indent;
          inMultiline = true;
          multilineValue = [];
        } else if (value.startsWith('"') || value.startsWith("'")) {
          result[key] = value.slice(1, -1);
        } else {
          result[key] = value;
        }
      }
    }

    if (inMultiline && currentKey) {
      result[currentKey] = multilineValue.join('\n');
    }
    if (editorItem) result.editor.push(editorItem);

    const firstKey = Object.keys(result)[0];
    if (firstKey && firstKey !== 'name' && !result.name) {
      result.id = firstKey;
      const nested = this._parseNestedModule(yamlText, firstKey);
      if (nested) return nested;
    }

    return result;
  }

  _parseNestedModule(yamlText, rootKey) {
    const lines = yamlText.split('\n');
    const result = { id: rootKey, editor: [] };
    let inRoot = false;
    let currentKey = null;
    let multilineValue = [];
    let inMultiline = false;
    let baseIndent = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const indent = line.search(/\S/);

      if (trimmed === rootKey + ':') {
        inRoot = true;
        baseIndent = indent;
        continue;
      }

      if (!inRoot) continue;

      if (indent <= baseIndent && trimmed.endsWith(':')) {
        break;
      }

      if (inMultiline) {
        if (indent > baseIndent + 4 || trimmed === '') {
          multilineValue.push(line.slice(baseIndent + 6) || '');
          continue;
        } else {
          result[currentKey] = multilineValue.join('\n');
          inMultiline = false;
          multilineValue = [];
        }
      }

      const kvMatch = trimmed.match(/^([\w-]+):\s*(.*)$/);
      if (kvMatch && indent === baseIndent + 4) {
        const [, key, value] = kvMatch;
        if (value === '|') {
          currentKey = key;
          inMultiline = true;
          multilineValue = [];
        } else if (value.startsWith('"') || value.startsWith("'")) {
          result[key] = value.slice(1, -1);
        } else {
          result[key] = value;
        }
      }
    }

    if (inMultiline && currentKey) {
      result[currentKey] = multilineValue.join('\n');
    }

    return result.name ? result : null;
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
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
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
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
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
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
          border: 1px solid var(--divider-color);
          margin-bottom: 10px;
          background: var(--card-background-color);
          overflow: hidden;
        }
        .store-skeleton-left {
          background: var(--secondary-background-color);
          height: 100px;
        }
        .store-skeleton-right {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .skeleton-line {
          height: 12px;
          background: linear-gradient(90deg, var(--secondary-background-color) 25%, rgba(var(--rgb-primary-color), 0.05) 50%, var(--secondary-background-color) 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 4px;
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
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .store-item-left {
          background: var(--secondary-background-color);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: default;
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
          background: linear-gradient(135deg, var(--secondary-background-color) 0%, rgba(var(--rgb-primary-color), 0.05) 100%);
        }
        .store-item-left-placeholder svg {
          width: 28px;
          height: 28px;
          color: var(--secondary-text-color);
          opacity: 0.4;
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
                <input
                  type="number"
                  class="interval-input"
                  .value="${this._config.update_interval || 0}"
                  @change="${this._handleIntervalChange}"
                />
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
                <input
                  type="url"
                  placeholder="${this._t('scriptPlaceholder')}"
                  .value="${this._newScriptUrl || ''}"
                  @change="${e => this._newScriptUrl = e.target.value}"
                />
                <button @click="${this._addScript}">${this._t('addScript')}</button>
              </div>
              ${(this._config.scripts || []).map((script, index) => html`
                <div class="script-item">
                  <input
                    type="url"
                    .value="${script}"
                    @change="${e => this._updateScript(index, e.target.value)}"
                  />
                  <button @click="${() => this._removeScript(index)}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
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
                <button class="store-search-btn ${this._storeLoading ? 'loading' : ''}" @click="${() => this._loadStoreModules()}" title="${this._t('refresh')}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                  </svg>
                </button>
              </div>
              <div class="store-list">
                ${this._storeLoading ? this._renderSkeleton() : this._renderOnlineModules()}
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
    return text.replace(/border-radius\s*:\s*([^;}\n]+)/gi, (match, value) => {
      const v = value.trim().toLowerCase();
      if (v.includes('50%') || v.includes('100%') || v.includes('/')) return match;
      if (v.split(/\s+/).length > 1) return match;
      const num = parseFloat(v);
      if (!isNaN(num) && num > 10 && v.includes('px')) return 'border-radius: 10px';
      return match;
    });
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

  _loadStoreModules() {
    return this._loadOnlineModules(true);
  }

  async _loadOnlineModules(forceRefresh = false) {
    this._storeLoading = true;
    this._storeError = null;
    this.requestUpdate();

    if (!forceRefresh) {
      const cached = this._getCachedModules();
      if (cached && cached.length > 0) {
        this._storeModules = cached;
        this._storeLoading = false;
        this.requestUpdate();
        return;
      }
    }

    try {
      const modules = await this._fetchModulesFromDiscussions();
      if (modules.length > 0) {
        this._storeModules = modules;
        this._setCachedModules(modules);
      } else {
        this._storeModules = this._getBuiltinModules();
      }
    } catch (e) {
      console.error('[html-pro-card] Failed to load modules:', e);
      this._storeError = e.message;
      this._storeModules = this._getBuiltinModules();
    }

    this._storeLoading = false;
    this.requestUpdate();
  }

  async _fetchModulesFromDiscussions() {
    const modules = [];

    try {
      // Fetch file list from mods folder
      const indexRes = await fetch(MODULE_STORE_CONFIG.indexUrl);
      if (!indexRes.ok) throw new Error('Failed to fetch index');
      
      const files = await indexRes.json();
      const yamlFiles = files.filter(f => f.name.endsWith('.yaml') && f.name !== '.gitkeep');
      
      // Fetch each YAML file
      for (const file of yamlFiles) {
        try {
          const yamlRes = await fetch(MODULE_STORE_CONFIG.rawBase + file.name);
          if (!yamlRes.ok) continue;
          
          const yamlText = await yamlRes.text();
          
          // Parse metadata from YAML comments
          const meta = {};
          const lines = yamlText.split('\n');
          let contentStart = 0;
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line.startsWith('#')) {
              contentStart = i;
              break;
            }
            const match = line.match(/^#\s*(\w+):\s*(.+)/);
            if (match) {
              meta[match[1].toLowerCase()] = match[2].trim();
            }
          }
          
          // Extract card config (everything after metadata comments)
          const cardYaml = lines.slice(contentStart).join('\n').trim();
          
          const module = {
            id: meta.id || file.name.split('-')[0],
            name: meta.name || lines[0]?.replace(/^#\s*/, '') || 'Untitled',
            version: meta.version || '1.0',
            creator: meta.author || 'Community',
            description: meta.description || '',
            image: meta.image || '',
            link: meta.link || `https://github.com/${MODULE_STORE_CONFIG.repo}/discussions/${meta.id}`,
            _tags: meta.tags ? meta.tags.split(',').map(t => t.trim()) : [],
            _yaml: cardYaml,
            _cardConfig: this._parseCardYaml(cardYaml)
          };
          
          module.code = module._cardConfig?.content || '';
          modules.push(module);
        } catch (e) {
          console.warn(`[html-pro-card] Failed to load ${file.name}:`, e);
        }
      }
    } catch (e) {
      console.warn('[html-pro-card] Failed to fetch store:', e);
    }

    if (modules.length === 0) {
      return this._getBuiltinModules();
    }

    // Sort by id descending (newest first)
    modules.sort((a, b) => Number(b.id) - Number(a.id));

    const seen = new Set();
    return modules.filter(m => {
      const key = m.name || m.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  _extractTagsFromTitle(title) {
    const match = title.match(/^\[([^\]]+)\]/);
    if (match) {
      return match[1].split(/[,，、]/).map(t => t.trim()).filter(Boolean);
    }
    return [];
  }

  _getBuiltinModules() {
    return [
      {
        id: 'clock',
        name: 'Digital Clock',
        version: '1.0',
        creator: 'knoop7',
        description: 'A simple digital clock with customizable style',
        supported: ['button', 'separator'],
        code: `<style>.clock{font-size:48px;font-family:monospace;text-align:center;padding:40px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:16px}</style><div class="clock" id="clock">00:00:00</div><script>setInterval(function(){$("#clock").textContent=new Date().toLocaleTimeString();},1000);</script>`
      },
      {
        id: 'avatar-card',
        name: 'Avatar Card',
        version: '1.0',
        creator: 'knoop7',
        description: 'User profile card with avatar and stats',
        supported: ['button'],
        code: `<style>.avatar-card{padding:24px;background:#fff;border-radius:16px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.08)}.avatar-img{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff}.avatar-name{font-size:18px;font-weight:600;color:#333;margin-bottom:4px}.avatar-role{font-size:12px;color:#999}</style><div class="avatar-card"><div class="avatar-img">👤</div><div class="avatar-name">Smart Home</div><div class="avatar-role">Admin</div></div>`
      }
    ];
  }

  _renderOnlineModules() {
    if (this._storeError) {
      return html`<div class="store-error">${this._t('loadError')}: ${this._storeError}</div>`;
    }

    const filtered = this._storeModules.filter(m => {
      if (!this._storeSearch) return true;
      const searchTerms = this._storeSearch.toLowerCase().split(/\s+/).filter(t => t);
      const tags = (m._tags || m.tags || []).map(t => t.toLowerCase());
      const name = (m.name || '').toLowerCase();
      const desc = (m.description || m.desc || '').toLowerCase();
      const author = (m.creator || m.author || '').toLowerCase();
      
      // All search terms must match (AND logic)
      return searchTerms.every(term => {
        // Check if term matches tag (with or without # prefix)
        const tagTerm = term.startsWith('#') ? term.slice(1) : term;
        if (tags.some(t => t.includes(tagTerm))) return true;
        // Check name, description, author
        if (name.includes(term)) return true;
        if (desc.includes(term)) return true;
        if (author.includes(term)) return true;
        return false;
      });
    });

    if (filtered.length === 0) {
      return html`<div class="store-loading">${this._t('noModules')}</div>`;
    }

    return html`${filtered.map(m => this._renderModuleCard(m))}`;
  }

  _renderSkeleton() {
    return html`
      ${[1, 2, 3].map(() => html`
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
    `;
  }

  _renderModuleCard(m) {
    const version = m.version || '1.0';
    const creator = m.creator || m.author || 'Community';
    const description = m.description || m.desc || '';
    const tags = m._tags || m.tags || [];
    const link = m.link || '';
    const image = m.image || '';

    return html`
      <div class="store-item">
        <div class="store-item-left">
          ${image ? html`
            <img src="${image}" alt="${m.name}" loading="lazy" />
          ` : html`
            <div class="store-item-left-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          `}
        </div>
        <div class="store-item-right">
          <div class="store-item-header">
            <div class="store-item-title-group">
              <h4>${m.name}</h4>
            </div>
            <span class="store-item-version">v${version}</span>
          </div>
          <p class="store-item-desc">${description ? (description.length > 80 ? description.slice(0, 80) + '...' : description) : ''} <span class="store-item-author" @click="${(e) => { e.stopPropagation(); window.open(`https://github.com/${creator}`, '_blank'); }}">@${creator}</span></p>
          <div class="store-item-actions">
            ${link ? html`<button class="store-item-btn" @click="${() => window.open(link, '_blank')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
              ${this._t('viewSource')}
            </button>` : ''}
            <div class="slide-track" data-module-id="${m.id || m.name}">
              <span class="slide-hint">${this._t('slideToImport')}</span>
              <div class="slide-handle" @mousedown="${(e) => this._startSlide(e, m)}" @touchstart="${(e) => this._startSlide(e, m)}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _previewImage(url) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out';
    overlay.innerHTML = `<img src="${url}" style="max-width:90%;max-height:90%;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.5)"/>`;
    overlay.onclick = () => overlay.remove();
    document.body.appendChild(overlay);
  }

  _startSlide(e, module) {
    e.preventDefault();
    const handle = e.currentTarget;
    const track = handle.parentElement;
    const hint = track.querySelector('.slide-hint');
    const startX = e.touches ? e.touches[0].clientX : e.clientX;
    const maxDistance = track.clientWidth - handle.clientWidth - 6;
    
    handle.style.transition = 'none';
    track.classList.add('active');

    const onMove = (ev) => {
      const currentX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      let moveX = currentX - startX;
      if (moveX < 0) moveX = 0;
      if (moveX > maxDistance) moveX = maxDistance;
      handle.style.transform = `translateX(${moveX}px)`;
      if (hint) hint.style.opacity = String(1 - moveX / maxDistance);
    };

    const onEnd = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);

      const transform = new WebKitCSSMatrix(getComputedStyle(handle).transform);
      const finalX = transform.m41;
      
      handle.style.transition = 'transform 0.3s ease';
      
      if (finalX >= maxDistance * 0.85) {
        handle.style.transform = `translateX(${maxDistance}px)`;
        track.classList.add('active');
        setTimeout(() => {
          this._importModule(module);
          handle.style.transform = 'translateX(0)';
          track.classList.remove('active');
          if (hint) hint.style.opacity = '0.7';
        }, 200);
      } else {
        handle.style.transform = 'translateX(0)';
        track.classList.remove('active');
        if (hint) hint.style.opacity = '0.7';
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
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
    
    let newConfig;
    
    if (m._cardConfig) {
      newConfig = {
        ...this._config,
        ...m._cardConfig,
        type: 'custom:html-pro-card'
      };
    } else {
      const content = m.code || m.content || '';
      newConfig = {
        ...this._config,
        content: content,
        do_not_parse: content.includes('<script>') || content.includes('${'),
        update_interval: this._config.update_interval || 10000,
        ignore_line_breaks: true,
        scripts: m.scripts || this._config.scripts || []
      };
    }

    if (m.editor && Array.isArray(m.editor)) {
      newConfig._moduleEditor = m.editor;
      newConfig._moduleName = m.name;
    }

    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    }));
    
    this.requestUpdate();
    
    setTimeout(() => {
      if (this.shadowRoot) {
        this.shadowRoot.activeElement?.blur();
        document.activeElement?.blur();
      }
    }, 50);
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
.pro-t{font-size:14px;font-weight:500;color:var(--primary-text-color)}
.pro-sub{font-size:13px;color:var(--secondary-text-color);opacity:0.7}
.pro-c{font-size:12px;color:var(--secondary-text-color);line-height:1.6}
</style>
<div class="pro">
<div class="pro-h">
<svg class="pro-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2V3H12V9H11V10H9V11H8V12H7V13H5V12H4V11H3V9H2V15H3V16H4V17H5V18H6V22H8V21H7V20H8V19H9V18H10V19H11V22H13V21H12V17H13V16H14V15H15V12H16V13H17V11H15V9H20V8H17V7H22V3H21V2M14 3H15V4H14Z"/></svg>
<div><span class="pro-t">HTML Pro Card</span><div class="pro-sub" id="pro-sub"></div></div>
</div>
<div class="pro-c" id="pro-desc"></div>
</div>
<script>
var hass = document.querySelector('home-assistant')?.hass;
var lang = (hass?.language || navigator.language || '').toLowerCase();
var desc = {
  'zh-cn': '是一款专为 Home Assistant 设计的高级 HTML 卡片组件。它支持完整的 Jinja2 模板语法，让您可以动态获取任意实体的状态、属性和历史数据。通过内置的服务调用接口，您可以直接在卡片中控制灯光、开关、空调等设备。卡片支持自定义 CSS 样式和外部 JavaScript 脚本，让您能够创建独一无二的交互式仪表盘。',
  'zh-hk': '是一款專為 Home Assistant 設計的高級 HTML 卡片組件。它支持完整的 Jinja2 模板語法，讓您可以動態獲取任意實體的狀態、屬性和歷史數據。通過內置的服務調用接口，您可以直接在卡片中控制燈光、開關、空調等設備。卡片支持自定義 CSS 樣式和外部 JavaScript 腳本，讓您能夠創建獨一無二的交互式儀表盤。',
  'ja': 'Home Assistant 向けに設計された高度な HTML カードコンポーネントです。完全な Jinja2 テンプレート構文をサポートし、任意のエンティティの状態、属性、履歴データを動的に取得できます。組み込みのサービス呼び出しにより、照明、スイッチ、エアコンなどのデバイスをカードから直接制御できます。カスタム CSS と外部 JavaScript により、ユニークなインタラクティブダッシュボードを作成できます。',
  'de': 'ist eine erweiterte HTML-Kartenkomponente für Home Assistant. Sie unterstützt die vollständige Jinja2-Vorlagensyntax und ermöglicht den dynamischen Zugriff auf Entitätszustände, Attribute und Verlaufsdaten. Mit integrierten Serviceaufrufen können Sie Lichter, Schalter und Klimageräte direkt steuern. Benutzerdefiniertes CSS und externe JS-Skripte ermöglichen einzigartige interaktive Dashboards.',
  'en': 'is an advanced HTML card component designed for Home Assistant. It supports full Jinja2 template syntax, allowing you to dynamically access any entity state, attributes and history. With built-in service calls, you can control lights, switches, climate devices directly. Custom CSS and external JS scripts enable unique interactive dashboards.'
};
var text = desc[lang] || (lang.startsWith('zh-tw') || lang.startsWith('zh-hk') ? desc['zh-tw'] : lang.startsWith('zh') ? desc['zh-cn'] : lang.startsWith('ja') ? desc['ja'] : lang.startsWith('de') ? desc['de'] : desc['en']);
$('#pro-sub').textContent = 'By knoop7';
$('#pro-desc').textContent = text;
</script>`,
      update_interval: 10000,
      do_not_parse: false,
      ignore_line_breaks: true,
      scripts: []
    };
  }

  connectedCallback() {
    if (!this._instanceId) this._instanceId = 'hpc_' + Math.random().toString(36).slice(2, 9);
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
    if (ov && this._instanceId) {
      ov.querySelectorAll(`[data-hpc-owner="${this._instanceId}"]`).forEach(el => el.remove());
    }
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
    if (this._boundHandlers) return;
    this._boundHandlers = {
      touchStart: this._handleTouchStart.bind(this),
      touchEnd: this._handleTouchEnd.bind(this),
      mouseDown: this._handleMouseDown.bind(this),
      mouseUp: this._handleMouseUp.bind(this),
      click: this._handleClick.bind(this),
    };
    this._rootElement.addEventListener('touchstart', this._boundHandlers.touchStart, { passive: true });
    this._rootElement.addEventListener('touchend', this._boundHandlers.touchEnd);
    this._rootElement.addEventListener('touchcancel', this._boundHandlers.touchEnd);
    this._rootElement.addEventListener('mousedown', this._boundHandlers.mouseDown);
    this._rootElement.addEventListener('mouseup', this._boundHandlers.mouseUp);
    this._rootElement.addEventListener('click', this._boundHandlers.click);
  }

  _removeEventListeners() {
    if (!this._rootElement || !this._boundHandlers) return;
    this._rootElement.removeEventListener('touchstart', this._boundHandlers.touchStart);
    this._rootElement.removeEventListener('touchend', this._boundHandlers.touchEnd);
    this._rootElement.removeEventListener('touchcancel', this._boundHandlers.touchEnd);
    this._rootElement.removeEventListener('mousedown', this._boundHandlers.mouseDown);
    this._rootElement.removeEventListener('mouseup', this._boundHandlers.mouseUp);
    this._rootElement.removeEventListener('click', this._boundHandlers.click);
    this._boundHandlers = null;
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
    if (this._longPressTimeout) {
      clearTimeout(this._longPressTimeout);
      this._longPressTimeout = null;
      return;
    }
    const actionTarget = e.target.closest('[data-action]');
    if (actionTarget) {
      const entityId = actionTarget.dataset.entity || actionTarget.closest('[data-entity]')?.dataset.entity;
      const action = actionTarget.dataset.action;
      if (!entityId || !action) return;
      if (action === 'toggle') this._callService(entityId, 'toggle');
      else if (action === 'turn_on') this._callService(entityId, 'turn_on');
      else if (action === 'turn_off') this._callService(entityId, 'turn_off');
      else if (action === 'more-info') this._showMoreInfo(entityId);
      else {
        const [domain] = entityId.split('.');
        this._hass?.callService(domain, action, { entity_id: entityId });
      }
      return;
    }
  }

  _showMoreInfo(entityId) {
    if (!entityId) return;
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _toggle(entityId) {
    if (!entityId || !this._hass?.states[entityId]) return;
    const domain = entityId.split('.')[0];
    const toggleDomains = ['light', 'switch', 'fan', 'input_boolean', 'automation', 'script', 'cover', 'lock', 'media_player'];
    if (toggleDomains.includes(domain)) {
      this._hass.callService(domain, 'toggle', { entity_id: entityId });
    } else {
      this._showMoreInfo(entityId);
    }
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;
    if (this._rootElement) this._rootElement.hass = hass;
    if (!this._config) return;
    if (!this._entities) this._calculateEntities();
    const shouldUpdate = this._shouldUpdate(oldHass);
    if (shouldUpdate) {
      if (this._config.do_not_parse) {
        this._updateStates();
      } else {
        this._processAndRender();
      }
      if (this._rootElement && typeof this._rootElement._onHassUpdate === 'function') {
        try { this._rootElement._onHassUpdate(hass); } catch {}
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
          } catch(e) {
            this._renderError('Render error: ' + (e.message || e));
          }
        }, { type: "render_template", template: content }).then(unsub => {
          this._templateSubscription = unsub;
        }).catch((e) => {
          this._renderError('Template error: ' + (e.message || e));
        });
      } catch(e) {
        this._renderError('Template error: ' + (e.message || e));
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
      this._validateRendered();
      this.dispatchEvent(new CustomEvent('content-rendered', {
        bubbles: true,
        composed: true,
        detail: { hass: this._hass, config: this._config }
      }));
    } catch(e) {
      this._renderError('Render error: ' + (e.message || e));
    }
  }

  _isEditorPreview() {
    try {
      let el = this.parentElement;
      for (let i = 0; i < 5 && el; i++) {
        if (el.localName === 'hui-card' && el.hasAttribute('preview')) return true;
        if (el.localName === 'hui-card-preview') return true;
        el = el.parentElement || el.getRootNode()?.host;
      }
    } catch {} 
    return false;
  }

  _renderError(message) {
    if (!this._rootElement) return;
    if (!this._isEditorPreview()) return;
    this._rootElement.innerHTML = '';
    this._clearErrorBanners();
    this.appendChild(this._createErrorCard(message, 'error'));
    console.error('[html-pro-card]', message);
  }

  _validateRendered() {
    if (!this._rootElement || !this._hass || !this._entities) return;
    if (!this._isEditorPreview()) return;
    this._clearErrorBanners();
    const missing = [];
    for (const eid of this._entities) {
      if (!this._hass.states[eid]) missing.push(eid);
    }
    if (missing.length === 0) return;
    this.appendChild(this._createErrorCard('Entity not found: ' + missing.join(', '), 'warning'));
  }

  _clearErrorBanners() {
    this.querySelectorAll(':scope > .hpc-error-banner').forEach(el => el.remove());
  }

  _createErrorCard(message, severity) {
    const wrapper = document.createElement('div');
    wrapper.className = 'hpc-error-banner';
    wrapper.dataset.severity = severity || 'error';
    const isWarn = severity === 'warning';
    const color = isWarn ? 'var(--warning-color,#ffa726)' : 'var(--error-color,#db4437)';
    const icon = isWarn
      ? '<path d="M1,21H23L12,2Zm12-3H11V16h2Zm0-4H11V10h2Z"/>'
      : '<path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"/>';
    wrapper.style.cssText = 'position:relative;border-radius:var(--ha-card-border-radius,12px);overflow:hidden;margin:4px 0;';
    wrapper.innerHTML =
      '<div style="position:absolute;inset:0;background:' + color + ';opacity:0.12;pointer-events:none;border-radius:inherit"></div>' +
      '<div style="display:flex;align-items:center;gap:8px;padding:12px 16px;position:relative">' +
        '<svg viewBox="0 0 24 24" style="width:24px;height:24px;flex-shrink:0;fill:' + color + '">' + icon + '</svg>' +
        '<span style="font-size:13px;font-weight:500;color:var(--primary-text-color,#212121);overflow:hidden;text-overflow:ellipsis;word-break:break-word;line-height:1.4">' +
          message.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
        '</span>' +
      '</div>';
    return wrapper;
  }

  _executeInlineScripts() {
    if (!this._rootElement) return;
    const scripts = Array.from(this._rootElement.querySelectorAll('script'));
    const root = this._rootElement;
    const self = this;
    const _rawOverlay = window._htmlProCardOverlay;
    const _ownerId = self._instanceId;
    const overlay = new Proxy(_rawOverlay, {
      get(target, prop) {
        if (prop === 'appendChild' || prop === 'append' || prop === 'prepend') {
          return (...args) => {
            args.forEach(a => { if (a?.setAttribute) a.setAttribute('data-hpc-owner', _ownerId); });
            return target[prop](...args);
          };
        }
        const val = target[prop];
        return typeof val === 'function' ? val.bind(target) : val;
      }
    });
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
          const fn = new Function('root', 'card', '$', '$$', 'hass', 'config', 'overlay', code);
          const hassProxy = new Proxy({}, { get: (_, prop) => { const v = self._hass[prop]; return typeof v === 'function' ? v.bind(self._hass) : v; }});
          fn(root, root, s => root.querySelector(s), s => root.querySelectorAll(s), hassProxy, self._config, overlay);
        } catch(e) { console.error('[html-pro-card] script error:', e); }
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
    } else if (domain === 'lock') {
      if (action === 'toggle') service = state?.state === 'locked' ? 'unlock' : 'lock';
      else service = action;
    } else if (domain === 'cover') {
      if (action === 'toggle') service = (state?.state === 'open' || state?.state === 'opening') ? 'close_cover' : 'open_cover';
      else service = action;
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
            el.querySelectorAll('[data-state-text]').forEach(e => {
              const map = e.dataset.map;
              if (map) {
                try { e.textContent = JSON.parse(map)[stateObj.state] || stateObj.state; }
                catch { e.textContent = stateObj.state; }
              } else {
                e.textContent = stateObj.state;
              }
            });
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

  _resolveWatchList() {
    const patterns = this._rootElement._watchedEntities;
    const ids = [];
    const allIds = Object.keys(this._hass.states);
    for (const p of patterns) {
      if (p.endsWith('.')) {
        for (const id of allIds) { if (id.startsWith(p)) ids.push(id); }
      } else {
        ids.push(p);
      }
    }
    this._resolvedWatch = { src: patterns, ids, count: allIds.length };
  }

  _shouldUpdate(oldHass) {
    if (!this._rendered) return true;
    if (!oldHass) return false;
    if (this._config.always_update) return true;
    if (!this._entities || this._entities.length === 0) {
      if (this._hasScript && this._rootElement?._watchedEntities) {
        const stateCount = Object.keys(this._hass.states).length;
        if (!this._resolvedWatch || this._resolvedWatch.src !== this._rootElement._watchedEntities || this._resolvedWatch.count !== stateCount) {
          this._resolveWatchList();
        }
        const ids = this._resolvedWatch?.ids;
        if (!ids || ids.length === 0) return false;
        return ids.some(id => oldHass.states[id] !== this._hass.states[id]);
      }
      return false;
    }
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
    this._hasScript = config.content.includes('<script');
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
    const entityRegex = /\b(?:light|switch|sensor|binary_sensor|climate|media_player|fan|cover|input_boolean|input_number|input_select|input_text|input_button|button|scene|script|automation|person|zone|weather|camera|vacuum|lock|number|select|text|timer|counter|group|device_tracker|water_heater|humidifier|siren|update|event|image|lawn_mower|valve|todo|date|time|datetime|schedule|notify|tts|remote|alarm_control_panel)\.[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g;
    const matches = this._config.content.match(entityRegex) || [];
    matches.forEach(m => this._entities.add(m));
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
    o.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;';
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
