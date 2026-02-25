## What's New in v3.2

**1.** Integrated Prism Code Editor with full syntax highlighting for HTML, CSS, and JavaScript
**2.** Added VS Code Dark and Light themes with automatic Home Assistant dark mode detection
**3.** Built-in search and replace functionality with Ctrl+F and Ctrl+H shortcuts
**4.** Line numbers display for better code navigation
**5.** Module store now auto-detects YAML files from the modules directory
**6.** Removed dependency on modules.json - metadata is parsed directly from YAML files
**7.** Version badge now links directly to the GitHub repository
**8.** Automatic border-radius normalization to 20px when pasting content
**9.** Improved YAML parser with support for scripts array and single-line formats
**10.** Auto-fill editor fields when pasting complete YAML configurations
**11.** Fallback textarea for environments where Prism Code Editor cannot load
**12.** Optimized performance with lazy loading of editor components
**13.** Updated stub config with cleaner professional design
**14.** Full i18n support for Chinese and English interfaces
**15.** Tab key inserts spaces for consistent indentation

---

## Module Store Publishing Guide

To publish a module to the store, create a YAML file in the modules directory with the following format:

```yaml
id: your-module-id
name: Module Display Name
desc: Brief description of your module
author: your-name
---
type: custom:html-pro-card
content: |
  <your html content here>
update_interval: 10000
do_not_parse: false
ignore_line_breaks: true
scripts:
  - https://cdn.example.com/library.js
```

Add the filename to modules.txt and submit a pull request.
