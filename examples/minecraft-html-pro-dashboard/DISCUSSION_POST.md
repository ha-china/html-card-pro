# Minecraft 风格 Home Assistant 仪表盘模板（html-pro-card + 网页实体生成器）

大家好，我整理了一套基于 `custom:html-pro-card` 的 Minecraft 风格 Home Assistant 仪表盘模板，重点是尽量不用手工改大段 YAML。

这套方案包含：

- 单张 `custom:html-pro-card` 全屏仪表盘模板。
- Minecraft 风格 UI：侧边栏、房间卡片、设备状态、环境数据、能耗、场景按钮。
- 网页端生成器：直接读取 HA 实体，选择实体后一键同步成新的 Lovelace 仪表盘。
- 本地 Node 生成器：通过 `html-pro-dashboard.entities.yaml` 维护实体映射，再生成完整 YAML / `.storage` JSON。
- 示例图片素材、截图、完整文件结构和安装说明。

## 推荐使用方式

把文件放到 HA：

```text
/config/www/minecraft-dashboard/html-pro-generator.html
/config/www/minecraft-dashboard/html-pro-dashboard.yaml
/config/www/minecraft-dashboard/*.jpg
```

然后打开：

```text
http://你的HA地址:8123/local/minecraft-dashboard/html-pro-generator.html
```

在页面里填 HA 地址和长期访问令牌，读取实体后选择需要的灯、空调、门锁、传感器、天气、场景等实体，最后点击一键同步到 HA 仪表盘。

生成器会使用 HA WebSocket API：

```text
lovelace/dashboards/list
lovelace/dashboards/create
lovelace/config/save
```

令牌只在浏览器页面里使用，不会写进模板文件。

## 文件

完整包我整理成了一个公开仓库，包含：

- `templates/html-pro-dashboard.yaml`：可直接复制到 Lovelace 的 html-pro-card 模板。
- `tools/html-pro-generator.html`：网页端实体读取和一键同步工具。
- `tools/html-pro-dashboard.entities.yaml`：实体映射文件。
- `tools/generate-html-pro-dashboard.js`：本地 Node 生成器。
- `storage/lovelace.minecraft-html-pro-dashboard.json`：HA storage 格式示例。
- `assets/`：示例图片素材。
- `screenshots/`：效果截图。
- `docs/handoff/`：给后续大模型或开发者接手的脱敏文档。
- `html-pro-minecraft-dashboard-share.zip`：包含上述文件的完整压缩包。

仓库地址：

https://github.com/xyiqq/html-pro-minecraft-dashboard

## 实体映射示例

```yaml
entities:
  livingLight: light.living_room_lights
  bedroomLight: light.bedroom_lights
  gardenLight: light.garden_light_strip
  kitchenSocket: switch.kitchen_socket
  climate: climate.living_room_ac
  media: media_player.living_room_speaker
  lock: lock.front_door
  door: binary_sensor.front_door_contact
  weather: weather.home
  sceneHome: scene.home_mode
```

如果不想用网页生成器，也可以只编辑 `tools/html-pro-dashboard.entities.yaml`，再运行：

```bash
node tools/generate-html-pro-dashboard.js
```

## 备注

- 图片默认目录是 `/config/www/minecraft-dashboard/`，模板访问路径是 `/local/minecraft-dashboard/`。
- 图片可以全部替换，只要文件名保持一致即可。
- 如果仪表盘路径是 `minecraft-html-pro`，HA 内部 storage 文件名可能变成 `lovelace.minecraft_html_pro`，属于正常的路径规范化。
- 如果页面空白，优先检查 html-pro-card 资源是否正确加载。

欢迎大家按自己的 HA 实体和房间结构继续改，也欢迎把更好看的交互和布局方案发出来一起迭代。
