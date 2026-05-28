# Minecraft 风格 Home Assistant 仪表盘

这是一个基于 `custom:html-pro-card` 的 Home Assistant 全屏仪表盘模板。它把一个完整仪表盘放在单张 html-pro-card 里，包含侧边导航、设备状态、房间视图、环境/能耗信息和场景按钮。

仓库里同时提供两种使用方式：

1. 网页端生成器：直接读取 Home Assistant 实体，选择需要的实体后一键同步成新的 Lovelace 仪表盘。
2. 本地 Node 生成器：编辑实体映射 YAML，然后生成完整卡片 YAML 和 HA `.storage` JSON。

## 文件结构

```text
assets/
  avatar-steve.jpg
  base-texture.jpg
  decor-wolf-lantern.jpg
  icon-ac.jpg
  icon-garden-light.jpg
  icon-light.jpg
  icon-lock.jpg
  icon-speaker.jpg
  room-bedroom.jpg
  room-garden.jpg
  room-kitchen.jpg
  room-living.jpg
  stage-background.jpg

screenshots/
  ha-minecraft-dashboard.png
  ha-minecraft-dashboard-after-login.png

templates/
  html-pro-dashboard.yaml
  html-pro-dashboard.generated.yaml

tools/
  html-pro-generator.html
  html-pro-dashboard.entities.yaml
  generate-html-pro-dashboard.js

storage/
  lovelace.minecraft-html-pro-dashboard.json

docs/handoff/
  README.md
  HANDOFF.md
  HTML_PRO_DASHBOARD_SUMMARY.md
  CUSTOM_CARD_DASHBOARD_SUMMARY.md
  NEXT_OPTIMIZATION_PLAN.md

html-pro-minecraft-dashboard-share.zip
```

## 前置条件

- Home Assistant 已安装并启用 Lovelace。
- 已安装 `html-card-pro` / `html-pro-card` 自定义卡片。
- 已在 Lovelace 资源里加入 html-pro-card 的 JS 资源。
- 需要一个 Home Assistant 长期访问令牌，用于网页生成器读取实体和同步仪表盘。

## 推荐安装方式：网页生成器

把这些文件复制到 HA：

```text
/config/www/minecraft-dashboard/html-pro-generator.html
/config/www/minecraft-dashboard/html-pro-dashboard.yaml
/config/www/minecraft-dashboard/*.jpg
```

然后打开：

```text
http://你的HA地址:8123/local/minecraft-dashboard/html-pro-generator.html
```

使用步骤：

1. 填入 HA 地址，例如 `http://homeassistant.local:8123`。
2. 粘贴长期访问令牌。
3. 点击读取实体。
4. 在页面里选择灯、空调、门锁、温湿度、天气、场景等实体。
5. 设置仪表盘标题和路径。
6. 点击一键同步到 HA 仪表盘。

网页生成器会通过 Home Assistant WebSocket API 调用：

```text
lovelace/dashboards/list
lovelace/dashboards/create
lovelace/config/save
```

令牌只在浏览器页面里使用，不会写入模板文件。公开分享、截图或提交问题时不要包含自己的令牌。

## 手动 YAML 方式

如果不想使用网页生成器，可以直接使用：

```text
templates/html-pro-dashboard.yaml
```

需要替换两个位置：

1. 顶部 `entities:` 列表。
2. `content` 脚本里的实体常量映射。

保持图片目录为：

```text
/local/minecraft-dashboard/
```

也就是 HA 实际文件路径：

```text
/config/www/minecraft-dashboard/
```

## 本地 Node 生成方式

编辑：

```text
tools/html-pro-dashboard.entities.yaml
```

只需要把右侧实体 ID 改成自己的实体：

```yaml
entities:
  livingLight: light.living_room_lights
  bedroomLight: light.bedroom_lights
  gardenLight: light.garden_light_strip
  climate: climate.living_room_ac
  weather: weather.home
```

然后运行：

```bash
node tools/generate-html-pro-dashboard.js
```

会生成：

```text
templates/html-pro-dashboard.generated.yaml
.deploy/lovelace.minecraft-html-pro-dashboard
```

## 实体映射说明

| 键名 | 建议实体类型 | 作用 |
| --- | --- | --- |
| `livingLight` | `light.*` | 客厅灯 |
| `bedroomLight` | `light.*` | 卧室灯 |
| `gardenLight` | `light.*` | 花园/氛围灯 |
| `kitchenSocket` | `switch.*` | 厨房插座 |
| `climate` | `climate.*` | 空调 |
| `media` | `media_player.*` | 音箱/媒体播放器 |
| `lock` | `lock.*` | 门锁 |
| `door` | `binary_sensor.*` | 门磁 |
| `livingPresence` | `binary_sensor.*` | 客厅存在传感器 |
| `bedroomPresence` | `binary_sensor.*` | 卧室存在传感器 |
| `kitchenPresence` | `binary_sensor.*` | 厨房存在传感器 |
| `livingTemp` / `livingHum` | `sensor.*` | 客厅温湿度 |
| `bedroomTemp` / `bedroomHum` | `sensor.*` | 卧室温湿度 |
| `kitchenTemp` | `sensor.*` | 厨房温度 |
| `outdoorTemp` / `outdoorHum` | `sensor.*` | 室外温湿度 |
| `pm25` | `sensor.*` | PM2.5 |
| `power` | `sensor.*` | 当前功率 |
| `energyToday` / `energyMonth` | `sensor.*` | 今日/月度能耗或费用 |
| `weather` | `weather.*` | 天气 |
| `time` / `date` | `sensor.*` | 时间/日期 |
| `sceneHome` / `sceneNight` / `sceneWelcome` / `sceneAway` | `scene.*` | 场景按钮 |

## 图片素材

模板默认使用 `assets/` 下的 JPG。你可以直接替换图片，只要保持文件名不变即可。

## 接手文档

`docs/handoff/` 里保存了给后续大模型或开发者使用的公开脱敏版接手资料，包含完整交接文档、html-pro 版本总结、custom-card 版本总结和下一阶段优化计划。

如果只想一次性下载全部资料，可以直接下载仓库根目录的：

```text
html-pro-minecraft-dashboard-share.zip
```

## 注意事项

- 如果仪表盘路径是 `minecraft-html-pro`，HA 的内部 `.storage` 文件名可能会被规范化为 `lovelace.minecraft_html_pro`，这是正常现象。
- 如果卡片空白，优先检查 html-pro-card 资源是否正确加载。
- 如果图片不显示，检查 `/config/www/minecraft-dashboard/` 是否存在对应文件。
- 如果一键同步失败，检查令牌权限、HA 地址是否跨域可访问，以及浏览器控制台错误。
