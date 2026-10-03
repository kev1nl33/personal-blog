# 生活内容板块实施与验收记录

对应方案：[咖啡角、看世界、回忆录升级计划](../plans/2026-10-03-lifestyle-sections-upgrade.md)。

## 已落地

- **咖啡角**：编辑式封面与产品图片来源说明、由同步内容生成的最近冲煮笔记、直达对应标签的链接、器具详情一致的标题和图片说明。
- **看世界**：目的地封面、三站路线导览、历史计划说明、按天查看的澳大利亚行程、可键盘操作的路线与折叠项、详情页图片来源说明；移除公开页面中的酒店确认编号。
- **回忆录**：档案式封面和原创 CSS 拼贴、真实空状态、加载失败状态、只有后端可用时才出现的管理工具；未把示意插画或资料图标为个人拍摄。
- **跨页动效**：开场只在同一会话完整播放一次，后续页面使用较短进入动效；悬浮卡片保留反馈，并避免卡片内部预览重复移动。

## 图片与内容边界

- 咖啡器具使用原有产品资料图；旅行图为目的地资料图，页面显式标注“非个人实拍”。
- 猎人谷路线图已替换为与地点匹配的[葡萄园照片](https://unsplash.com/photos/green-field-GqO1nskZeFY)，摄影者 Jennefer Zacarias；来源页标注 Hunter Valley, NSW。
- 回忆录目前没有已发布的个人照片，因此展示明确的空状态和原创图形。实际照片与游记文字须待内容源提供后填充。
- 曾尝试调用 ChatGPT 图片生成，但当前接口返回 404；本次没有使用生成的图片。

## 验收

- `npm run build`：生成 177 个页面。
- `python3 -m unittest discover -s tests -v`：14 项通过。
- `python3 validate_site.py`：40 个受管页面，0 个错误。
- `node --check`：咖啡角、回忆录和全站动效脚本语法检查通过。
- 浏览器核对桌面和 390px 手机宽度的三个板块与澳大利亚行程页；均无横向溢出。手机行程路线可横向浏览，起点默认显示墨尔本。
- 检查了最近冲煮笔记与标签跳转、行程锚点和展开状态、回忆录在零照片时的空状态及管理工具显隐。

## 预览图

- [咖啡角](screenshots/lifestyle-coffee-final.png)
- [看世界](screenshots/lifestyle-travel-final.png)
- [回忆录](screenshots/lifestyle-gallery-final.png)
- [旅行路线](screenshots/lifestyle-route-final.png)
- [手机行程详情](screenshots/lifestyle-route-mobile-final.png)

未执行线上发布。真实回忆录内容和旅行后的个人照片不属于本次可从现有仓库生成的材料。
