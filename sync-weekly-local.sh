#!/bin/bash
# 本地同步周刊脚本

# 检查环境变量
if [ -z "$NOTION_TOKEN" ]; then
    echo "❌ 错误: 请设置 NOTION_TOKEN 环境变量"
    echo "使用方法: export NOTION_TOKEN='your_notion_token'"
    exit 1
fi

echo "🚀 开始同步周刊..."
export WEEKLY_DATABASE_ID="00402fa2099e4b20b8801b89cad83a8f"
node scripts/sync-weekly.js

if [ $? -eq 0 ]; then
    echo "✅ 同步成功！"
else
    echo "❌ 同步失败"
    exit 1
fi
