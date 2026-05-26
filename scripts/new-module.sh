#!/bin/bash
# 快速创建新模块讨论帖的脚本
# 用法: ./scripts/new-module.sh

# 配置
REPO="ha-china/html-card-pro"
TOKEN="${GITHUB_TOKEN:-}"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== HTML Pro Card 模块发布工具 ===${NC}\n"

# 检查 token
if [ -z "$TOKEN" ]; then
  echo -e "${YELLOW}请设置 GITHUB_TOKEN 环境变量${NC}"
  echo "export GITHUB_TOKEN=ghp_xxxxx"
  exit 1
fi

# 输入模块信息
read -p "模块名称 (英文): " NAME
read -p "分类标签 [Style/Appliance/Widget/Tool]: " TAG
read -p "版本号 [1.0]: " VERSION
VERSION=${VERSION:-1.0}
read -p "作者 GitHub 用户名: " AUTHOR
read -p "简短描述 (英文): " DESC
read -p "预览图片 URL (可选): " IMAGE
read -p "YAML 文件路径: " YAML_FILE

if [ ! -f "$YAML_FILE" ]; then
  echo -e "${RED}YAML 文件不存在: $YAML_FILE${NC}"
  exit 1
fi

YAML_CONTENT=$(cat "$YAML_FILE")

# 生成讨论帖内容
BODY="This module provides a **${NAME}** for HTML Pro Card. ${DESC}

**Author**: ${AUTHOR} | **Version**: ${VERSION}

---

<details>
<summary>🧩 Get this Module</summary>

> Copy the complete config below and paste into your dashboard.

---

\`\`\`yaml
${YAML_CONTENT}
\`\`\`

</details>

---

### Screenshot

![${NAME}](${IMAGE:-https://via.placeholder.com/400x200/667eea/fff?text=${NAME// /+}})"

# 创建讨论帖
echo -e "\n${YELLOW}正在创建讨论帖...${NC}"

TITLE="[${TAG}] ${NAME}"

# 获取 discussions category ID
CATEGORY_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.github.com/repos/${REPO}" | jq -r '.id')

echo -e "${GREEN}✓ 模块信息已准备好${NC}"
echo -e "\n标题: ${TITLE}"
echo -e "内容预览:\n${BODY:0:200}...\n"

read -p "确认发布? [y/N]: " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "已取消"
  exit 0
fi

# 保存到本地文件供手动发布
OUTPUT_FILE="module-${NAME// /-}.md"
echo "# ${TITLE}

${BODY}" > "$OUTPUT_FILE"

echo -e "${GREEN}✓ 已保存到 ${OUTPUT_FILE}${NC}"
echo -e "${YELLOW}请手动复制内容到 GitHub Discussions 发布${NC}"
echo -e "https://github.com/${REPO}/discussions/new?category=modules"
