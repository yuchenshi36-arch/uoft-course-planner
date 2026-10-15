#!/bin/zsh
export PATH=/Applications/ChatGPT.app/Contents/Resources/cua_node/bin:$PATH
cd ~/Desktop/uoft-course-planner-migration/uoft-course-planner
echo "========================================"
echo "  多伦多大学选课辅助工具 - 启动器"
echo "========================================"
if [ ! -d .next ]; then
  echo "[1/2] 首次运行，正在构建网站（约 1-2 分钟）..."
  node node_modules/next/dist/bin/next build || { echo "构建失败"; read -k 1; exit 1; }
else
  echo "[1/2] 已构建过，跳过构建"
fi
echo "[2/2] 正在启动网站..."
echo "启动成功后请在浏览器打开： http://localhost:3000"
echo "关闭本窗口即可停止网站"
echo "========================================"
node node_modules/next/dist/bin/next start -p 3000
