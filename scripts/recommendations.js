// 相关文章推荐系统
class ArticleRecommendations {
    constructor() {
        this.searchIndex = [];
        this.currentArticle = null;
        this.init();
    }

    async init() {
        // 加载搜索索引
        await this.loadSearchIndex();

        // 获取当前文章信息
        this.getCurrentArticleInfo();

        // 生成推荐
        if (this.currentArticle) {
            this.generateRecommendations();
        }
    }

    async loadSearchIndex() {
        try {
            const response = await fetch('search-index.json');
            this.searchIndex = await response.json();
        } catch (error) {
            console.error('加载搜索索引失败:', error);
        }
    }

    getCurrentArticleInfo() {
        // 从页面中提取当前文章信息
        const currentURL = window.location.pathname.split('/').pop();

        // 从页面标签提取分类
        const categoryTag = document.querySelector('.article-tag');
        const category = categoryTag ? categoryTag.textContent.trim() : '';

        // 从页面标题提取
        const titleElement = document.querySelector('.article-title');
        const title = titleElement ? titleElement.textContent.trim() : '';

        if (currentURL && currentURL.endsWith('.html')) {
            this.currentArticle = {
                url: currentURL,
                category: category,
                title: title
            };
        }
    }

    generateRecommendations() {
        const recommendations = this.findRelatedArticles();

        if (recommendations.length === 0) {
            return; // 没有推荐文章
        }

        this.createRecommendationsSection(recommendations);
    }

    findRelatedArticles() {
        if (!this.currentArticle || this.searchIndex.length === 0) {
            return [];
        }

        // 评分系统：根据相似度打分
        const scoredArticles = this.searchIndex
            .filter(article => article.url !== this.currentArticle.url) // 排除当前文章
            .map(article => {
                let score = 0;

                // 相同分类：+10分
                if (article.category === this.currentArticle.category) {
                    score += 10;
                }

                // 标题相似度（简单实现：共同关键词）
                const currentKeywords = this.extractKeywords(this.currentArticle.title);
                const articleKeywords = this.extractKeywords(article.title);
                const commonKeywords = currentKeywords.filter(k => articleKeywords.includes(k));
                score += commonKeywords.length * 3;

                // 关键词匹配
                if (article.keywords && this.currentArticle.category) {
                    if (article.keywords.toLowerCase().includes(this.currentArticle.category.toLowerCase())) {
                        score += 5;
                    }
                }

                return { ...article, score };
            })
            .filter(article => article.score > 0) // 只保留有分数的
            .sort((a, b) => b.score - a.score) // 按分数排序
            .slice(0, 3); // 最多3篇推荐

        return scoredArticles;
    }

    extractKeywords(text) {
        // 简单的关键词提取：分词 + 过滤停用词
        const stopWords = ['的', '了', '和', '是', '在', '有', '我', '你', '他', '她', '这', '那', '与', '：', '、'];
        return text
            .split(/[\s\-:：、]/)
            .filter(word => word.length > 1 && !stopWords.includes(word))
            .map(word => word.toLowerCase());
    }

    createRecommendationsSection(recommendations) {
        // 查找合适的插入位置（文章末尾）
        const articleContainer = document.querySelector('.article-container');
        if (!articleContainer) return;

        // 创建推荐区域
        const recommendationsHTML = `
            <section class="recommendations-section">
                <div class="container">
                    <h2 class="recommendations-title">📚 相关文章推荐</h2>
                    <div class="recommendations-grid">
                        ${recommendations.map(article => this.createRecommendationCard(article)).join('')}
                    </div>
                </div>
            </section>
        `;

        // 插入到页脚之前
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', recommendationsHTML);
        }

        // 添加样式
        this.addStyles();
    }

    createRecommendationCard(article) {
        return `
            <article class="recommendation-card">
                <a href="${article.url}" class="recommendation-link">
                    ${article.category ? `<div class="recommendation-category">${article.category}</div>` : ''}
                    <h3 class="recommendation-title">${article.title}</h3>
                    <p class="recommendation-description">${article.description}</p>
                    <div class="recommendation-footer">
                        <span class="recommendation-read-more">阅读文章 →</span>
                    </div>
                </a>
            </article>
        `;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .recommendations-section {
                padding: 4rem 0;
                background: var(--bg-secondary);
            }

            .recommendations-title {
                text-align: center;
                font-size: 2rem;
                margin-bottom: 2rem;
                color: var(--text-primary);
            }

            .recommendations-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }

            .recommendation-card {
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .recommendation-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 24px var(--shadow-color);
                border-color: var(--accent);
            }

            .recommendation-link {
                display: block;
                padding: 1.5rem;
                text-decoration: none;
                color: inherit;
                height: 100%;
            }

            .recommendation-category {
                display: inline-block;
                background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
                color: #fff;
                padding: 0.3rem 0.8rem;
                border-radius: 6px;
                font-size: 0.85rem;
                margin-bottom: 0.75rem;
            }

            .recommendation-title {
                font-size: 1.2rem;
                margin: 0 0 0.75rem 0;
                color: var(--text-primary);
                line-height: 1.4;
            }

            .recommendation-description {
                color: var(--text-secondary);
                font-size: 0.95rem;
                line-height: 1.6;
                margin: 0 0 1rem 0;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .recommendation-footer {
                display: flex;
                justify-content: flex-end;
            }

            .recommendation-read-more {
                color: var(--accent);
                font-weight: 500;
                font-size: 0.9rem;
                transition: all 0.2s;
            }

            .recommendation-card:hover .recommendation-read-more {
                transform: translateX(4px);
            }

            @media (max-width: 768px) {
                .recommendations-grid {
                    grid-template-columns: 1fr;
                }

                .recommendations-title {
                    font-size: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 初始化推荐系统（仅在文章页面）
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.article-content')) {
        new ArticleRecommendations();
    }
});
