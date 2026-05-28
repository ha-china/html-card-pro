# 自定义卡片版仪表盘总结

更新时间：2026-05-27 23:08

## 定位

自定义卡片版是当前项目里更适合长期产品化的一条路线。它把 Minecraft 风格仪表盘拆成 Home Assistant 可复用的 Lovelace 自定义卡片，而不是把所有 HTML/CSS/JS 都塞在一张 `html-pro-card` 里。

核心文件：

```text
项目目录：minecraft-dashboard
实际路径：C:\Users\dazhazhang\uoloproject\minecraft-dashboard
主 JS：minecraft-device-card.js
模板：templates\home-dashboard.yaml
远端资源：/opt/haconfig/www/minecraft-dashboard/minecraft-device-card.js
测试面板：/minecraft-home-card-test/home
```

当前已注册的卡片：

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

## 当前部署

访问地址：

```text
http://<HA_HOST>:8123/minecraft-home-card-test/home
```

Lovelace resource：

```text
/local/minecraft-dashboard/minecraft-device-card.js?v=20260527230506
```

storage 文件：

```text
/opt/haconfig/.storage/lovelace.minecraft-home-card-test
/opt/haconfig/.storage/lovelace_resources
/opt/haconfig/.storage/lovelace_dashboards
```

本地对应文件：

```text
.deploy\lovelace.minecraft-home-card-test
.deploy\lovelace_resources.restore-two
.deploy\lovelace_dashboards.restore-two
```

## 已完成能力

首页卡 `custom:minecraft-dashboard-home-card` 已经具备：

```text
Minecraft 风格左侧导航
首页大舞台布局
常用设备快捷控制
房间入口
环境指标
能源指标
场景入口
内部页面切换
```

内部页面：

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

设备、场景、自动化页已经支持：

```text
按楼层分组
按房间分组
顶部楼层入口
顶部房间入口
点击入口滚动定位
短暂高亮目标区域
```

楼层/房间识别支持两种方式：

```text
内置中文和拼音关键词
可配置 floor_keywords / room_keywords
```

编辑器能力：

```text
实体选择
名称配置
位置配置
图片路径配置
卡片宽度配置
是否显示位置
楼层关键词配置
房间关键词配置
```

## 技术边界

这一路线需要加载 `minecraft-device-card.js`，所以用户侧必须添加 Lovelace resource。

优势：

```text
可维护性更好
可视化编辑器能力更强
后续可以做成真正卡片包
代码可以复用、拆分和测试
适合长期功能迭代
```

弱点：

```text
用户需要安装/加载 JS 资源
HA 前端缓存需要通过 version 参数刷新
编辑器能力需要继续补
真实家庭实体命名不规范时仍要配置映射规则
```

## 下一阶段优化重点

功能优化：

```text
首页常用设备从固定 5 个升级为可配置列表
房间页升级为楼层 > 房间 > 设备结构
能源页按楼层/房间统计功率和用电
日志页按异常级别、楼层、房间分组
自动化页区分启用/禁用状态
场景执行增加确认和反馈状态
支持更多设备类型：窗帘、地暖、新风、净水、扫地机、摄像头
支持实体收藏和排序
```

交互优化：

```text
楼层/房间入口支持筛选模式，而不只是滚动定位
设备页增加搜索、楼层筛选、房间筛选、类型筛选
移动端导航改为底部或顶部横向分段控件
长列表虚拟化或折叠分组
点击设备后给出即时乐观状态反馈
不可控实体统一打开 more-info
危险操作增加二次确认
编辑器字段分组折叠，减少配置压力
```

视觉优化：

```text
继续压缩 CSS 区域，拆清结构
提升窄屏下的卡片密度和可读性
统一状态色体系
完善加载态、空态、离线态
减少背景图遮挡文字的场景
```

## 推荐后续工作方式

后续如果继续做长期模板包，优先在这一路线上投入。每次改动流程：

```powershell
node --check .\minecraft-device-card.js
```

然后：

```text
上传 minecraft-device-card.js
刷新 lovelace_resources 里的 ?v=yyyyMMddHHmmss
重启 HA
打开 /minecraft-home-card-test/home 验证
```

