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
 * 生成TOC数据
 */
function generateTOC(contentHtml) {
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/g;
    const toc = [];
    let match;
    let index = 1;

    while ((match = h2Regex.exec(contentHtml)) !== null) {
        toc.push({
            id: `section-${index}`,
            title: match[1].replace(/<[^>]*>/g, ''), // 移除HTML标签
            level: 2
        });
        index++;
    }

    return toc;
}

/**
 * 为内容添加章节ID
 */
function addSectionIds(contentHtml) {
    let index = 1;
    return contentHtml.replace(/<h2([^>]*)>/g, () => {
        return `<h2 id="section-${index++}"$1>`;
    });
}

/**
 * 生成周刊详情页 HTML
 */
function generateWeeklyDetailHtml(weeklyData, prevWeekly, nextWeekly) {
    const tocData = generateTOC(weeklyData.content);
    const contentWithIds = addSectionIds(weeklyData.content);

    const tocHtml = tocData.map(item =>
        `<li><a href="#${item.id}">${item.title}</a></li>`
    ).join('\n                    ');

    const prevLink = prevWeekly ?
        `<a href="${prevWeekly.url}.html" class="nav-btn prev">
                    <span class="nav-label">← 上一期</span>
                    <span class="nav-title">${prevWeekly.title}</span>
                </a>` : '';

    const nextLink = nextWeekly ?
        `<a href="${nextWeekly.url}.html" class="nav-btn next">
                    <span class="nav-label">下一期 →</span>
                    <span class="nav-title">${nextWeekly.title}</span>
                </a>` : '';

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
                <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="菜单">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul class="nav-links" id="navLinks">
                    <li><a href="index.html">首页</a></li>
                    <li><a href="blog.html">文章</a></li>
                    <li><a href="weekly.html" class="active">周刊</a></li>
                    <li><a href="about.html">关于</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- 阅读进度条 -->
    <div class="reading-progress" id="readingProgress"></div>

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

            ${tocData.length > 0 ? `<!-- 文章目录 -->
            <aside class="toc-container" id="tocContainer">
                <div class="toc-title">
                    目录
                    <span class="toc-toggle" id="tocToggle">▼</span>
                </div>
                <ul class="toc-list" id="tocList">
                    ${tocHtml}
                </ul>
            </aside>` : ''}

            <div class="weekly-content">
                ${contentWithIds}
            </div>

            <div class="weekly-nav">
                ${prevLink}
                ${nextLink}
                <div class="back-to-list">
                    <a href="weekly.html" class="btn btn-secondary">返回周刊列表</a>
                </div>
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

    <script src="scripts/main.js"></script>
    <script>
        // 阅读进度条
        const readingProgress = document.getElementById('readingProgress');
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.scrollY;
            const progress = (scrollTop / documentHeight) * 100;
            readingProgress.style.width = progress + '%';
        });

        // TOC 折叠功能
        const tocToggle = document.getElementById('tocToggle');
        const tocContainer = document.getElementById('tocContainer');

        if (tocToggle && tocContainer) {
            tocToggle.addEventListener('click', () => {
                tocContainer.classList.toggle('collapsed');
                tocToggle.textContent = tocContainer.classList.contains('collapsed') ? '▶' : '▼';
            });
        }

        // TOC 高亮当前章节
        const sections = document.querySelectorAll('.weekly-content h2[id]');
        const tocLinks = document.querySelectorAll('.toc-list a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // 代码块添加复制按钮
        document.querySelectorAll('pre').forEach(pre => {
            const button = document.createElement('button');
            button.className = 'code-copy-btn';
            button.textContent = '复制';

            button.addEventListener('click', async () => {
                const code = pre.querySelector('code');
                const text = code ? code.textContent : pre.textContent;

                try {
                    await navigator.clipboard.writeText(text);
                    button.textContent = '已复制!';
                    button.classList.add('copied');

                    setTimeout(() => {
                        button.textContent = '复制';
                        button.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    button.textContent = '复制失败';
                    setTimeout(() => {
                        button.textContent = '复制';
                    }, 2000);
                }
            });

            pre.style.position = 'relative';
            pre.appendChild(button);
        });

        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    </script>
</body>
</html>`;
}

/**
 * 生成周刊列表页 HTML
 */
function generateWeeklyListHtml(weeklies) {
    // 区分编程周刊和成长周刊
    const weeklyCards = weeklies.map(weekly => {
        const type = weekly.title.includes('编程') ? 'programming' : 'growth';
        const badgeClass = type === 'programming' ? 'programming' : 'growth';

        return `
                <article class="weekly-card" data-type="${type}">
                    <div class="weekly-issue-badge ${badgeClass}">第 ${weekly.issue} 期</div>
                    <h2 class="weekly-card-title">${weekly.title}</h2>
                    <p class="weekly-excerpt">${weekly.excerpt || '点击查看详情...'}</p>
                    <div class="weekly-card-meta">
                        <span class="weekly-card-date">${weekly.date_short}</span>
                    </div>
                    <a href="${weekly.url}.html" class="read-more">阅读周刊 →</a>
                </article>`;
    }).join('\n');

    // 计算数量
    const programmingCount = weeklies.filter(w => w.title.includes('编程')).length;
    const growthCount = weeklies.filter(w => w.title.includes('成长')).length;

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
                <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="菜单">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul class="nav-links" id="navLinks">
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

            <!-- 筛选按钮 -->
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">
                    全部 <span class="filter-count">(${weeklies.length})</span>
                </button>
                <button class="filter-btn" data-filter="programming">
                    💻 编程周刊 <span class="filter-count">(${programmingCount})</span>
                </button>
                <button class="filter-btn" data-filter="growth">
                    🌱 成长周刊 <span class="filter-count">(${growthCount})</span>
                </button>
            </div>
        </div>
    </section>

    <!-- 周刊列表 -->
    <section class="weekly-list">
        <div class="container">
            <div class="weekly-grid" id="weeklyGrid">
${weeklyCards}
            </div>

            <!-- 空状态提示 -->
            <div class="empty-state" id="emptyState" style="display: none;">
                <div class="empty-icon">📭</div>
                <p class="empty-text">暂无周刊内容</p>
                <p class="empty-hint">敬请期待下一期精彩内容</p>
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

    <script src="scripts/main.js"></script>
    <script>
        // 筛选功能
        const filterButtons = document.querySelectorAll('.filter-btn');
        const weeklyCards = document.querySelectorAll('.weekly-card');
        const weeklyGrid = document.getElementById('weeklyGrid');
        const emptyState = document.getElementById('emptyState');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // 更新按钮激活状态
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // 筛选卡片
                let visibleCount = 0;
                weeklyCards.forEach(card => {
                    if (filter === 'all' || card.dataset.type === filter) {
                        card.style.display = 'flex';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // 显示/隐藏空状态
                if (visibleCount === 0) {
                    weeklyGrid.style.display = 'none';
                    emptyState.style.display = 'block';
                } else {
                    weeklyGrid.style.display = 'grid';
                    emptyState.style.display = 'none';
                }
            });
        });
    </script>
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

            } catch (error) {
                console.error(`  ❌ 处理周刊失败: ${error.message}`);
                continue;
            }
        }

        if (weeklies.length > 0) {
            // 生成周刊详情页（需要上一期和下一期信息）
            console.log('\n📝 生成周刊详情页...');
            for (let i = 0; i < weeklies.length; i++) {
                const weeklyData = weeklies[i];
                const prevWeekly = i < weeklies.length - 1 ? weeklies[i + 1] : null; // 前一期（期数更小）
                const nextWeekly = i > 0 ? weeklies[i - 1] : null; // 后一期（期数更大）

                const weeklyHtml = generateWeeklyDetailHtml(weeklyData, prevWeekly, nextWeekly);

                // 保存周刊文件
                const filename = `${weeklyData.url}.html`;
                fs.writeFileSync(filename, weeklyHtml, 'utf8');
                console.log(`  ✅ 已生成: ${filename}`);
            }

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
