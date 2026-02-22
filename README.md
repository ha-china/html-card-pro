# HTML Pro Card

Home Assistant 高级 HTML 卡片，支持 Jinja2 模板、实时状态更新、多语言界面。

## 特性

- **Jinja2 模板** - 完整支持 HA 模板语法
- **实时更新** - 状态变化自动刷新
- **多语言** - 自动适配中英文
- **多实体支持** - light/switch/climate/cover/fan/media_player/input_select/input_number
- **模块商店** - 内置模板库一键导入

## 安装

1. 下载 `html-card-pro.js`
2. 放入 `config/www/` 目录
3. 添加资源：
```yaml
url: /local/html-card-pro.js
type: module
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| content | string | 必填 | HTML/Jinja2 模板内容 |
| update_interval | number | 10000 | 更新间隔(ms)，0禁用 |
| do_not_parse | boolean | false | 纯HTML模式(禁用Jinja2) |
| ignore_line_breaks | boolean | true | 忽略换行符 |
| scripts | list | [] | 外部脚本URL列表 |

## 数据绑定

### 实体绑定
```html
<div data-entity="light.living_room">
  <span data-friendly-name></span>
  <span data-state-text></span>
  <span data-attr="brightness"></span>
</div>
```

### 属性绑定
| 属性 | 说明 |
|------|------|
| `data-entity` | 绑定实体ID |
| `data-state-text` | 显示状态文本 |
| `data-attr="xxx"` | 显示任意属性 |
| `data-friendly-name` | 显示友好名称 |
| `data-brightness` | 亮度值/滑块 |
| `data-temperature` | 温度值 |

### 动作绑定
```html
<button data-action="toggle">切换</button>
<button data-action="turn_on">开启</button>
<button data-action="turn_off">关闭</button>
<button data-action="more-info">详情</button>
```

### 滑块控制
```html
<!-- 灯光亮度 0-100 -->
<input type="range" min="0" max="100" data-brightness>

<!-- 空调温度 -->
<input type="range" min="16" max="30" data-temperature>

<!-- 媒体音量 0-100 -->
<input type="range" min="0" max="100" data-volume>

<!-- 窗帘位置 0-100 -->
<input type="range" min="0" max="100" data-position>

<!-- 风扇速度 0-100 -->
<input type="range" min="0" max="100" data-speed>
```

### 选择器
```html
<!-- input_select -->
<select data-option>
  <option>选项1</option>
  <option>选项2</option>
</select>

<!-- input_number -->
<input type="number" data-value>
```

## 示例

### 灯光卡片
```html
<style>
.light{padding:16px}
.light[data-state="on"]{background:var(--primary-color);color:#fff}
</style>
<div class="light" data-entity="light.living_room">
  <h3 data-friendly-name></h3>
  <p data-state-text></p>
  <input type="range" min="0" max="100" data-brightness>
  <button data-action="toggle">切换</button>
</div>
```

### Jinja2 模板
```html
<div class="sensor">
  温度: {{ states('sensor.temperature') }}°C
  湿度: {{ states('sensor.humidity') }}%
</div>

{% if is_state('light.living_room', 'on') %}
  <div class="on">灯已开启</div>
{% else %}
  <div class="off">灯已关闭</div>
{% endif %}
```

### CSS 变量
```css
.card {
  background: var(--card-background-color);
  color: var(--primary-text-color);
  border: 1px solid var(--divider-color);
}
.accent {
  color: var(--primary-color);
}
```

## 纯HTML模式

开启 `do_not_parse` 后禁用 Jinja2，使用数据绑定属性实现状态更新：

```yaml
type: custom:html-pro-card
do_not_parse: true
content: |
  <div data-entity="light.living_room">
    <span data-state-text></span>
    <button data-action="toggle">切换</button>
  </div>
```

## 外部脚本

```yaml
type: custom:html-pro-card
scripts:
  - /local/my-script.js
  - https://cdn.example.com/lib.js
content: |
  <div id="app"></div>
  <script>
    // 可访问: root, $, $$, hass, config
    $('#app').textContent = hass.states['sensor.temp'].state;
  </script>
```

## 故障排除

- **卡片空白** - 检查content是否有语法错误
- **状态不更新** - 确认实体ID正确，检查data-entity绑定
- **模板报错** - 检查Jinja2语法，或开启纯HTML模式

## 支持

- [GitHub Issues](https://github.com/knoop7/html-card-pro/issues)
- [Home Assistant 社区](https://community.home-assistant.io/)
