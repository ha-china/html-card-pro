# Minecraft Home Assistant Dashboard 接手文档

更新时间：2026-05-27 23:08

## 1. 项目定位

当前项目目录：

```text
C:\Users\dazhazhang\uoloproject\minecraft-dashboard
```

这个目录不是传统前端工程，也不是 Git 仓库。它现在是一套 Home Assistant Lovelace 自定义卡片模板包，核心目标是把 GitHub discussion 里的 Minecraft 风格 `custom:html-pro-card` 仪表盘，改造成更可复用、更容易配置的 Home Assistant 卡片集合。

参考 discussion：

```text
https://github.com/ha-china/html-card-pro/discussions/11
```

当前重点不是继续维护原始整段 YAML，而是维护本地的自定义卡片 JS：

```text
	minecraft-device-card.js
```

里面已经包含：

```text
custom:minecraft-dashboard-home-card
custom:minecraft-device-card
custom:minecraft-room-card
custom:minecraft-scene-card
custom:minecraft-sensor-card
custom:minecraft-climate-card
custom:minecraft-energy-card
custom:minecraft-lock-card
custom:minecraft-media-card
```

## 2. 远端部署状态

Home Assistant 主机：

```text
<HA_HOST>:8123
```

HA 配置目录：

```text
/opt/haconfig
```

前端资源目录：

```text
/opt/haconfig/www/minecraft-dashboard/
```

当前 Lovelace resource：

```text
/local/minecraft-dashboard/minecraft-device-card.js?v=20260527230506
```

测试仪表盘：

```text
http://<HA_HOST>:8123/minecraft-home-card-test/home
http://<HA_HOST>:8123/minecraft-html-pro
```

说明：

```text
明文 HA/SSH 密码没有写入本文档。新线程如果需要远端操作，让用户重新提供或从安全位置获取。
```

## 3. 关键本地文件

核心文件：

```text
mount: C:\Users\dazhazhang\uoloproject\minecraft-dashboard
js: minecraft-device-card.js
template: templates\home-dashboard.yaml
legacy-yaml: dashboard-public.yaml
handoff: HANDOFF.md
package: .deploy\minecraft-dashboard-template.zip
custom-card-summary: CUSTOM_CARD_DASHBOARD_SUMMARY.md
html-pro-summary: HTML_PRO_DASHBOARD_SUMMARY.md
next-plan: NEXT_OPTIMIZATION_PLAN.md
```

素材文件：

```text
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
```

重要验证截图：

```text
.deploy\ha-minecraft-home-floor-room-scenes.png
.deploy\ha-minecraft-home-devices-page.png
.deploy\ha-minecraft-home-nav-click.png
.deploy\ha-minecraft-card-pack-test-6cards-fixed.png
```

新增 html-pro-card 路线文件：

```text
templates\html-pro-dashboard.yaml
templates\html-pro-dashboard.generated.yaml
tools\html-pro-dashboard.entities.yaml
tools\generate-html-pro-dashboard.js
tools\html-pro-generator.html
.deploy\lovelace.minecraft-html-pro-dashboard
```

## 4. 已完成内容

### 4.1 小卡片包

已经做了一组独立可用的小卡片：

```text
设备卡
房间卡
场景卡
传感器卡
空调卡
能源卡
门锁卡
媒体卡
```

这些卡片的目标是像 HA 原生卡片一样可在 UI 里编辑，不需要用户每次去 JS/HTML 里手改名称、图片路径、区域文字等字段。

已经修过的问题：

```text
边角虚框 / outline
名称自动读取实体 friendly_name
显示名称、区域文字、图片路径、点击提示可编辑
编辑器输入框点一下失焦
卡片尺寸可调整
```

### 4.2 整屏首页卡

`custom:minecraft-dashboard-home-card` 已经从原始 discussion 的视觉风格做了复刻版：

```text
左侧 Minecraft 风格侧边栏
右侧大背景舞台
首页常用设备
房间入口
环境指标
能源指标
场景入口
```

当前侧边栏不是跳 HA 系统页面，而是在卡片内部切换页面：

```text
首页
设备
场景
自动化
房间
能源
日志
设置
```

内部导航实现位置：

```text
minecraft-device-card.js
_bindNavigation()
_navButton()
_renderStageContent()
```

### 4.3 设备 / 场景 / 自动化分组

最新完成的需求：

```text
设备、场景、自动化页面里的项目，按照楼层和房间分组。
楼层和房间入口放在第一排。
```

当前实现：

```text
第一排左侧：楼层入口
第一排右侧：房间入口
下面内容：楼层分段，每个楼层里再按房间分组
```

楼层识别规则：

```text
优先从实体 friendly_name / 配置名称 / entity_id 里识别：
一层、二层、三层、四层...
yi_ceng、er_ceng、san_ceng、si_ceng...
floor_1、floor_2、1f、2f...
匹配不到进入：未分楼层
```

房间识别规则：

```text
优先读取模板中已配置的位置字段
其次从实体 friendly_name / 配置名称 / entity_id 里识别：
客厅、卧室、主卧、次卧、厨房、餐厅、书房、阳台、卫生间、浴室、玄关、门厅、花园、庭院、车库、走廊、地下室
以及 ke_ting、wo_shi、shu_fang 等拼音 token
匹配不到进入：其他
```

相关方法：

```text
_configuredNames()
_entitySearchText()
_knownFloors()
_floorForEntity()
_knownRooms()
_roomForEntity()
_groupEntitiesByFloorRoom()
_renderScopeRail()
_renderFloorRoomGroups()
```

### 4.4 点击与动效

侧边栏点击：

```text
不再使用 /config/... 外部跳转
只设置 this._activePage 并重绘当前卡片
保留 is-pressing 按压/滑光动效
```

楼层/房间入口点击：

```text
平滑滚动到对应楼层或房间
使用 mc-home-focus-flash 做短暂高亮
```

实体点击：

```text
可控制实体走 _toggleEntity()
不可直接控制的实体打开 hass-more-info
```

### 4.5 可配置楼层 / 房间关键词

已完成接手文档里建议的第一项长期优化：

```text
楼层和房间识别规则不再只能依赖内置硬编码。
首页卡新增 floor_keywords / room_keywords 配置。
Home Assistant 可视化编辑器里新增“楼层关键词 / 房间关键词”两个多行输入框。
```

配置格式：

```yaml
floor_keywords: |
  阁楼: ge_lou, attic
room_keywords: |
  影音室: ying_yin_shi, theater
```

兼容说明：

```text
已有默认识别规则仍保留。
配置值也兼容 YAML object / array 形态，方便后续扩展。
本地验证已覆盖默认规则和自定义关键词命中。
```

### 4.6 全新 html-pro-card 仪表盘

按 GitHub discussion #11 的原始路线，另做了一套不依赖 `minecraft-device-card.js` 自定义卡片的全新仪表盘：

```text
templates\html-pro-dashboard.yaml
```

特点：

```text
type: custom:html-pro-card
单卡全屏 Master Canvas
左侧 Minecraft 风格导航
首页 / 设备 / 场景 / 房间 / 能源 / 日志 内部页面切换
设备状态自动变色
天气 / 时间 / 环境 / 能源数据绑定
场景执行前二次确认
```

同时生成了 Home Assistant storage 格式测试面板：

```text
.deploy\lovelace.minecraft-html-pro-dashboard
```

面板路径：

```text
/minecraft-html-pro
```

实体替换不建议手改大段 YAML。当前新增了模板生成器：

```powershell
node tools\generate-html-pro-dashboard.js
```

日常只需要修改：

```text
tools\html-pro-dashboard.entities.yaml
```

生成器会同步替换：

```text
YAML 顶部 entities 列表
HTML 按钮 data-entity / data-scene
脚本里的 const ENTITY 对象
.deploy\lovelace.minecraft-html-pro-dashboard
```

新增网页端生成器：

```text
tools\html-pro-generator.html
```

远端部署到：

```text
/opt/haconfig/www/minecraft-dashboard/html-pro-generator.html
/opt/haconfig/www/minecraft-dashboard/html-pro-dashboard.yaml
```

访问地址：

```text
http://<HA_HOST>:8123/local/minecraft-dashboard/html-pro-generator.html
```

使用方式：

```text
在 HA 用户资料中创建长期访问令牌
粘贴到网页生成器
点击“读取实体”
点击“自动推荐”或手动选择映射
点击“生成文件”
点击“一键同步到 HA 仪表盘”
```

同步逻辑：

```text
浏览器通过 /api/websocket 连接 HA
先调用 lovelace/dashboards/list
如果 dashboard path 不存在，调用 lovelace/dashboards/create 创建 storage 仪表盘
然后调用 lovelace/config/save 写入生成后的 html-pro-card 配置
如果 dashboard path 已存在，则直接覆盖更新该 path 的配置
```

注意：

```text
长期访问令牌必须属于有管理员权限的 HA 用户。
dashboard path 必须包含连字符，例如 minecraft-html-pro-v2。
```

## 5. 实机验证记录

本地语法检查：

```powershell
node --check .\minecraft-device-card.js
```

结果：通过。

远端部署：

```text
HA_READY
VERSION=20260527230506
```

浏览器实测页面：

```text
http://<HA_HOST>:8123/minecraft-home-card-test/home
```

关键验证结果：

```text
路径保持：/minecraft-home-card-test/home
无 hui-error-card
无 ha-alert
```

设备页：

```text
楼层分组：5
房间块：18
实体项目：186
楼层入口：一层 44个、二层 44个、三层 44个、四层 44个、未分楼层 10个
```

场景页：

```text
楼层分组：4
房间块：16
场景项目：48
```

自动化页：

```text
楼层分组：4
房间块：16
自动化项目：96
```

最新截图：

```text
C:\Users\dazhazhang\uoloproject\minecraft-dashboard\.deploy\ha-minecraft-home-floor-room-scenes.png
```

## 6. 当前部署流程

一般改完 `minecraft-device-card.js` 后：

1. 本地检查：

```powershell
node --check .\minecraft-device-card.js
```

2. 更新 `.deploy\lovelace_resources` 里的版本号：

```text
/local/minecraft-dashboard/minecraft-device-card.js?v=yyyyMMddHHmmss
```

3. 上传到远端：

```text
/opt/haconfig/www/minecraft-dashboard/minecraft-device-card.js
/opt/haconfig/.storage/lovelace_resources
```

4. 重启 HA 容器：

```bash
docker restart homeassistant
```

5. 等待：

```bash
curl -fsS http://127.0.0.1:8123/
```

返回可访问后，再打开浏览器验证。

注意：

```text
项目里使用过 Posh-SSH 上传。凭据不要写进代码或文档。
```

## 7. 下一线程建议继续做什么

建议下一线程从这里开始：

```text
1. 先阅读本 HANDOFF.md
2. 打开 minecraft-device-card.js
3. 如果继续自定义卡路线，部署当前 minecraft-device-card.js 并刷新 Lovelace resource 版本号
4. 如果继续 html-pro-card 路线，先改 tools\html-pro-dashboard.entities.yaml，再运行 node tools\generate-html-pro-dashboard.js
5. 部署 .deploy\lovelace.minecraft-html-pro-dashboard 为新测试面板
6. 打开测试页 /minecraft-home-card-test/home 或 /minecraft-html-pro
7. 视觉检查设备、场景、自动化三页，以及新增编辑器字段是否可正常保存
```

可继续优化方向：

```text
1. 楼层/房间入口做“筛选模式”，而不仅是滚动定位。
2. 房间页也升级为楼层 > 房间结构。
3. 日志页可按异常级别/楼层/房间分组。
4. 能源页可按楼层统计功率/能耗，如果有对应传感器。
5. 首页常用设备可支持用户在编辑器里配置 5 个以上快捷设备。
6. 自动化卡片可以区分启用/禁用状态，但仍保留楼层房间分组。
7. 场景执行可以增加确认/反馈提示，避免误触。
8. 把所有 CSS 进一步拆成更清晰的区域，降低后续维护成本。
```

## 8. 需要注意的坑

### 8.1 不要回到原始 html-pro-card 单 YAML 路线

原 discussion 的 `custom:html-pro-card` 适合研究视觉和布局，但现在主要实现已经转到：

```text
custom:minecraft-dashboard-home-card
```

继续改原始 `dashboard-public.yaml` 对当前 HA 页面不会产生主要影响。

### 8.2 不要把侧边栏改回 HA 系统跳转

用户已经明确要求：

```text
点击设备、场景、自动化等侧边栏项时，应切换到模板内部页面。
不能跳到 HA 系统实体页或配置页。
```

### 8.3 分组依赖命名

当前分组主要靠实体名和 entity_id 识别楼层房间。测试环境里实体命名很规整，例如：

```text
Climate 二层客厅空调1
Scene 一层客厅场景1
automation_xxx_yi_ceng_ke_ting_xxx
```

如果真实用户家里的命名不规整，就需要做可配置映射。

### 8.4 不要在文档中保存明文密码

远端凭据来自用户临时提供。本文档只记录主机和路径，不记录密码。

## 9. 当前文件包

最新模板包：

```text
C:\Users\dazhazhang\uoloproject\minecraft-dashboard\.deploy\minecraft-dashboard-template.zip
```

包内包含：

```text
minecraft-device-card.js
html-card-pro.js
dashboard-public.yaml
templates\
cards\
mods\
*.jpg
HANDOFF.md
```

## 10. 给下一位接手者的一句话

当前可用版本已经不是“只能复制 YAML 的视觉 demo”，而是一个可部署、可编辑、可内部导航的 Home Assistant Minecraft 风格卡片包。下一步最有价值的工作，是把“自动识别楼层房间”升级成“用户可配置楼层房间规则”，这样它才更像真正可分享的模板。

