# html-pro-card 版仪表盘和生成器总结

更新时间：2026-05-27 23:08

## 定位

html-pro-card 版保留 GitHub discussion 原始路线：一张 `custom:html-pro-card` 内包含完整 HTML/CSS/JS。它适合快速复制、快速生成和低门槛部署。

当前这条路线已经从“手改大 YAML”升级为“网页端读取 HA 实体并一键同步仪表盘”。

核心文件：

```text
templates\html-pro-dashboard.yaml
templates\html-pro-dashboard.generated.yaml
tools\html-pro-dashboard.entities.yaml
tools\generate-html-pro-dashboard.js
tools\html-pro-generator.html
.deploy\lovelace.minecraft-html-pro-dashboard
```

远端网页工具：

```text
http://<HA_HOST>:8123/local/minecraft-dashboard/html-pro-generator.html
```

当前 html-pro 仪表盘：

```text
http://<HA_HOST>:8123/minecraft-html-pro
```

## 当前能力

html-pro 仪表盘本体：

```text
单张 custom:html-pro-card
全屏 Minecraft 风格布局
左侧导航
首页 / 设备 / 场景 / 房间 / 能源 / 日志 内部页面
设备状态自动变色
天气 / 时间 / 环境 / 能源绑定
房间状态快照
场景执行二次确认
```

网页端生成器：

```text
读取 HA /api/states 实体
按 domain 和关键词自动推荐映射
支持手动搜索和选择实体
生成 html-pro-card YAML
生成 Lovelace storage JSON
生成实体映射 YAML
通过 /api/websocket 一键创建或更新 HA 仪表盘
```

一键同步逻辑：

```text
使用长期访问令牌连接 /api/websocket
调用 lovelace/dashboards/list
如果 dashboard path 不存在，调用 lovelace/dashboards/create
调用 lovelace/config/save 写入生成后的配置
```

## 当前部署

远端静态文件：

```text
/opt/haconfig/www/minecraft-dashboard/html-pro-generator.html
/opt/haconfig/www/minecraft-dashboard/html-pro-dashboard.yaml
```

远端 storage：

```text
/opt/haconfig/.storage/lovelace.minecraft_html_pro
/opt/haconfig/.storage/lovelace_dashboards
```

注意：

```text
用户通过网页生成器创建的 dashboard id 可能会由 HA 将路径里的 - 转成 _。
当前远端 html-pro storage 文件名是 lovelace.minecraft_html_pro。
```

## 使用方式

1. 打开网页生成器：

```text
http://<HA_HOST>:8123/local/minecraft-dashboard/html-pro-generator.html
```

2. 在 HA 用户资料里创建长期访问令牌。

3. 粘贴 token，点击“读取实体”。

4. 点击“自动推荐”，再手动检查关键实体。

5. 填写：

```text
仪表盘标题
页面标题
面板路径
```

路径必须包含连字符，例如：

```text
minecraft-html-pro-v2
```

6. 点击“一键同步到 HA 仪表盘”。

## 优势和边界

优势：

```text
不需要用户理解大段 YAML
可以直接读取真实 HA 实体
可以快速生成多套不同名字的仪表盘
非常适合现场调试和快速出效果
保持 custom:html-pro-card 路线
```

弱点：

```text
所有 UI 仍然在一张 html-pro-card 里，长期维护不如自定义卡片清晰
页面生成器需要管理员长期访问令牌
自动推荐依赖实体名称和 domain，仍需要人工检查
复杂交互都在内嵌 JS 中，后续代码会变大
```

## 下一阶段优化重点

生成器功能：

```text
支持保存多个映射方案到 localStorage
支持导入旧映射 YAML / JSON
支持从现有 dashboard 反向读取映射
支持“只更新当前 dashboard，不新建”
支持实体必填校验和缺失提醒
支持批量按房间推荐实体
支持预览生成后的 dashboard 缩略图
支持生成前检测 html-card-pro 资源是否已安装
```

仪表盘功能：

```text
设备列表从固定槽位升级为用户选择的动态列表
房间页支持按用户选择的房间动态生成
场景页支持动态场景列表和排序
能源页支持按用户选择的功率/电量传感器生成图表
日志页接入 HA 持久通知或异常实体
```

交互优化：

```text
生成器里为每个映射显示实体 friendly_name、state、last_changed
自动推荐分数可视化
选择实体后即时标记 domain 不匹配风险
一键同步完成后直接打开新仪表盘
同步前弹出覆盖确认
token 输入后支持“仅本页记住”，刷新即清
```

## 推荐后续工作方式

如果目标是“快速生成新的 Minecraft 风格 dashboard”，优先用 html-pro 生成器路线。

如果目标是“沉淀成可分享、可长期维护的 HA 卡片包”，优先回到自定义卡片版。


