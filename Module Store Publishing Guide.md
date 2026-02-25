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
