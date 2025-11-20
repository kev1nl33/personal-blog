#!/usr/bin/env node

/**
 * Notion 周刊同步脚本
 * 从 Notion Database 读取周刊并生成 HTML
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Notion API 配置
const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const WEEKLY_DATABASE_ID = process.env.WEEKLY_DATABASE_ID || '00402fa2099e4b20b8801b89cad83a8f';

const NOTION_VERSION = '2022-06-28';

/**
 * 发送 HTTPS 请求
 */
function httpsRequest(url, options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

/**
 * 查询 Notion 数据库获取所有已发布的周刊
 */
async function queryDatabase() {
    const url = `https://api.notion.com/v1/databases/${WEEKLY_DATABASE_ID}/query`;

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json'
        }
    };

    const payload = JSON.stringify({
        filter: {
            property: '已发布',
            checkbox: {
                equals: true
            }
        },
        sorts: [
            {
                property: '期数',
                direction: 'descending'
            }
        ]
    });

    const data = await httpsRequest(url, options, payload);
    return data.results;
}

/**
 * 获取页面内容（blocks）
 */
async function getPageContent(pageId) {
    const url = `https://api.notion.com/v1/blocks/${pageId}/children`;

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': NOTION_VERSION
        }
    };

    const data = await httpsRequest(url, options);
    return data.results;
}

/**
 * 将 Notion rich text 转换为 HTML
 */
function richTextToHtml(richText) {
    let html = '';
    for (const text of richText) {
        let content = text.plain_text;
        // HTML 转义
        content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const annotations = text.annotations || {};

        if (annotations.bold) content = `<strong>${content}</strong>`;
        if (annotations.italic) content = `<em>${content}</em>`;
        if (annotations.code) content = `<code>${content}</code>`;

        if (text.href) content = `<a href="${text.href}" target="_blank">${content}</a>`;

        html += content;
    }
    return html;
}

/**
 * 获取纯文本
 */
function plainText(richText) {
    return richText.map(text => text.plain_text).join('');
}

/**
 * 将 Notion block 转换为 HTML
 */
function blockToHtml(block) {
    const blockType = block.type;

    switch (blockType) {
        case 'paragraph':
            const text = richTextToHtml(block.paragraph.rich_text);
            return `<p>${text}</p>\n`;

        case 'heading_1':
            return `<h2>${richTextToHtml(block.heading_1.rich_text)}</h2>\n`;

        case 'heading_2':
            return `<h3>${richTextToHtml(block.heading_2.rich_text)}</h3>\n`;

        case 'heading_3':
            return `<h4>${richTextToHtml(block.heading_3.rich_text)}</h4>\n`;

        case 'bulleted_list_item':
            return `<li>${richTextToHtml(block.bulleted_list_item.rich_text)}</li>\n`;

        case 'numbered_list_item':
            return `<li>${richTextToHtml(block.numbered_list_item.rich_text)}</li>\n`;

        case 'quote':
            return `<blockquote><p>${richTextToHtml(block.quote.rich_text)}</p></blockquote>\n`;

        case 'code':
            return `<pre><code>${plainText(block.code.rich_text)}</code></pre>\n`;

        case 'video':
            const videoUrl = block.video.external?.url || block.video.file?.url;
            if (videoUrl) {
                // 如果是 YouTube 链接，转换为嵌入式播放器
                if (videoUrl.includes('youtu')) {
                    const videoId = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/)?.[1];
                    if (videoId) {
                        return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>\n`;
                    }
                }
                return `<video controls src="${videoUrl}"></video>\n`;
            }
            return '';

        default:
            return '';
    }
}

/**
 * 从 properties 中提取值
 */
function getPropertyValue(properties, propName) {
    const prop = properties[propName] || {};
    const propType = prop.type;

    switch (propType) {
        case 'title':
            return plainText(prop.title);
        case 'rich_text':
            return plainText(prop.rich_text);
        case 'select':
            return prop.select ? prop.select.name : '';
        case 'date':
            return prop.date ? prop.date.start : '';
        case 'number':
            return prop.number || 0;
        case 'checkbox':
            return prop.checkbox || false;
        default:
            return '';
    }
}

/**
 * 生成周刊详情页 HTML
 */
function generateWeeklyDetailHtml(weeklyData) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${weeklyData.title} - 计划李</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/weekly.css">
</head>
<body>
    <!-- 导航栏 -->
    <nav class="nav">
        <div class="container">
            <div class="nav-content">
                <a href="index.html" class="logo">计划李</a>
                <ul class="nav-links">
                    <li><a href="index.html">首页</a></li>
                    <li><a href="blog.html">文章</a></li>
                    <li><a href="weekly.html" class="active">周刊</a></li>
                    <li><a href="about.html">关于</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- 周刊内容 -->
    <article class="weekly-container">
        <div class="container">
            <div class="weekly-header">
                <div class="weekly-issue">第 ${weeklyData.issue} 期</div>
                <h1 class="weekly-title">${weeklyData.title}</h1>
                <div class="weekly-meta">
                    <span class="weekly-date">${weeklyData.date}</span>
                </div>
            </div>

            <div class="weekly-content">
                ${weeklyData.content}
            </div>

            <div class="weekly-nav">
                <a href="weekly.html" class="btn btn-secondary">返回周刊列表</a>
            </div>
        </div>
    </article>

    <!-- 页脚 -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <p>&copy; 2025 计划李. All rights reserved.</p>
                <div class="social-links">
                    <a href="https://zhihu.com" target="_blank">知乎</a>
                    <a href="https://github.com" target="_blank">GitHub</a>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

/**
 * 生成周刊列表页 HTML
 */
function generateWeeklyListHtml(weeklies) {
    const weeklyCards = weeklies.map(weekly => `
                <article class="weekly-card">
                    <div class="weekly-issue-badge">第 ${weekly.issue} 期</div>
                    <h2 class="weekly-card-title">${weekly.title}</h2>
                    <p class="weekly-excerpt">${weekly.excerpt || '点击查看详情...'}</p>
                    <div class="weekly-card-meta">
                        <span class="weekly-card-date">${weekly.date_short}</span>
                    </div>
                    <a href="${weekly.url}.html" class="read-more">阅读周刊 →</a>
                </article>
`).join('\n');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>周刊 - 计划李</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/weekly.css">
</head>
<body>
    <!-- 导航栏 -->
    <nav class="nav">
        <div class="container">
            <div class="nav-content">
                <a href="index.html" class="logo">计划李</a>
                <ul class="nav-links">
                    <li><a href="index.html">首页</a></li>
                    <li><a href="blog.html">文章</a></li>
                    <li><a href="weekly.html" class="active">周刊</a></li>
                    <li><a href="about.html">关于</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- 页面标题 -->
    <section class="page-header">
        <div class="container">
            <h1 class="page-title">周刊</h1>
            <p class="page-description">每周分享值得关注的内容和思考</p>
        </div>
    </section>

    <!-- 周刊列表 -->
    <section class="weekly-list">
        <div class="container">
            <div class="weekly-grid">
${weeklyCards}
            </div>
        </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <p>&copy; 2025 计划李. All rights reserved.</p>
                <div class="social-links">
                    <a href="https://zhihu.com" target="_blank">知乎</a>
                    <a href="https://github.com" target="_blank">GitHub</a>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

/**
 * 主函数
 */
async function main() {
    console.log('🚀 开始从 Notion 同步周刊...');

    try {
        // 查询数据库
        const pages = await queryDatabase();
        console.log(`📚 找到 ${pages.length} 期已发布周刊`);

        const weeklies = [];

        for (const page of pages) {
            try {
                // 提取周刊信息
                const properties = page.properties;
                const title = getPropertyValue(properties, '标题');
                const issue = getPropertyValue(properties, '期数');
                const date = getPropertyValue(properties, '发布日期');
                const excerpt = getPropertyValue(properties, '摘要');

                const url = `weekly-${issue}`;

                console.log(`📝 处理周刊: 第 ${issue} 期 - ${title}`);

                // 获取周刊内容
                const blocks = await getPageContent(page.id);
                let contentHtml = '';

                let inList = false;
                let listType = null;

                for (const block of blocks) {
                    const blockType = block.type;

                    // 处理列表
                    if (blockType === 'bulleted_list_item' || blockType === 'numbered_list_item') {
                        if (!inList) {
                            listType = blockType === 'bulleted_list_item' ? 'ul' : 'ol';
                            contentHtml += `<${listType}>\n`;
                            inList = true;
                        }
                        contentHtml += blockToHtml(block);
                    } else {
                        if (inList) {
                            contentHtml += `</${listType}>\n`;
                            inList = false;
                        }
                        contentHtml += blockToHtml(block);
                    }
                }

                if (inList) {
                    contentHtml += `</${listType}>\n`;
                }

                // 格式化日期
                let formattedDate, formattedDateShort;
                if (date) {
                    const dateObj = new Date(date);
                    formattedDate = dateObj.toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    formattedDateShort = date;
                } else {
                    const now = new Date();
                    formattedDate = now.toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    formattedDateShort = now.toISOString().split('T')[0];
                }

                // 准备周刊数据
                const weeklyData = {
                    title,
                    issue,
                    date: formattedDate,
                    date_short: formattedDateShort,
                    excerpt: excerpt || '',
                    url,
                    content: contentHtml
                };

                weeklies.push(weeklyData);

                // 生成周刊详情页
                const weeklyHtml = generateWeeklyDetailHtml(weeklyData);

                // 保存周刊文件
                const filename = `${url}.html`;
                fs.writeFileSync(filename, weeklyHtml, 'utf8');
                console.log(`  ✅ 已生成: ${filename}`);

            } catch (error) {
                console.error(`  ❌ 处理周刊失败: ${error.message}`);
                continue;
            }
        }

        if (weeklies.length > 0) {
            // 生成周刊列表页
            console.log('\n📋 生成周刊列表页...');
            const listHtml = generateWeeklyListHtml(weeklies);
            fs.writeFileSync('weekly.html', listHtml, 'utf8');
            console.log('✅ weekly.html 生成成功');

            console.log(`\n🎉 同步完成！共生成 ${weeklies.length} 期周刊`);
        } else {
            console.log('\n⚠️  没有周刊需要同步');
        }

    } catch (error) {
        console.error(`❌ 同步失败: ${error.message}`);
        process.exit(1);
    }
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = { main };
