
        // 武器分类映射数据
        const weaponMetadata = {
            scenarios: {
                'career': [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
                'business': [68, 69, 70, 71, 72, 73, 74, 75, 102, 103, 104, 105, 106, 107, 108],
                'growth': [1, 2, 3, 4, 5, 6, 7, 8, 23, 24, 25, 26, 27, 28, 29, 30, 76, 77, 78, 79, 80, 81, 82],
                'relationship': [31, 34, 35, 36, 37, 55, 56, 57, 58, 59, 96, 97, 98, 99, 100, 101],
                'efficiency': [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 61, 62, 63, 64, 65, 66, 67],
                'content': [68, 72, 73, 74, 90, 91, 92, 93, 94, 95]
            },
            quadrants: {
                'leader': [31, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 66, 67],
                'thinker': [23, 24, 25, 26, 27, 28, 29, 30, 55, 56, 57, 58, 59, 60, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
                'executor': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                'creator': [68, 69, 70, 71, 72, 73, 74, 75, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108]
            }
        };

        let allWeapons = [];
        let currentView = 'scenario';
        let currentScenario = 'all';

        // 动态加载108种认知武器
        document.addEventListener('DOMContentLoaded', async function() {
            try {
                // 加载JSON数据
                const response = await fetch('data/cognitive-weapons.json');
                allWeapons = await response.json();

                // 初始化所有视图
                renderGalleryView(allWeapons);
                renderScenarioView(allWeapons);
                renderQuadrantView(allWeapons);
                renderBauhausView(allWeapons);
                renderJournalView(allWeapons);

                switchView(currentView);
                document.querySelectorAll('.scenario-btn').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('active'))));
                // 绑定视图切换事件
                document.querySelectorAll('.view-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const view = this.dataset.view;
                        switchView(view);
                    });
                });

                // 绑定场景筛选事件
                document.querySelectorAll('.scenario-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const scenario = this.dataset.scenario;
                        filterByScenario(scenario);

                        // 更新按钮状态
                        document.querySelectorAll('.scenario-btn').forEach(b => {b.classList.remove('active');b.setAttribute('aria-pressed','false');});
                        this.classList.add('active');
                        this.setAttribute('aria-pressed','true');
                    });
                });

                console.log(`✅ 成功加载 ${allWeapons.length} 个认知武器`);
            } catch (error) {
                console.error('加载认知武器数据失败:', error);
            }
        });

        // 视图切换
        function switchView(view) {
            currentView = view;

            // 更新按钮状态
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === view);
                btn.setAttribute('aria-pressed', String(btn.dataset.view === view));
            });

            // 切换视图容器
            document.querySelectorAll('.view-container').forEach(container => {
                container.classList.remove('active');
            });

            document.getElementById(`${view}-view`).classList.add('active');
        }

        // 渲染场景视图
        function renderScenarioView(weapons) {
            const grid = document.getElementById('scenario-grid');
            grid.innerHTML = '';

            weapons.forEach((weapon, index) => {
                const card = createWeaponCard(weapon, index);
                grid.appendChild(card);
            });

            initRevealAnimation();
        }

        // 按场景筛选
        function filterByScenario(scenario) {
            currentScenario = scenario;

            if (scenario === 'all') {
                renderScenarioView(allWeapons);
            } else {
                const scenarioWeaponIds = weaponMetadata.scenarios[scenario] || [];
                const filteredWeapons = allWeapons.filter(w => {
                    const id = parseInt(w.number);
                    return scenarioWeaponIds.includes(id);
                });
                renderScenarioView(filteredWeapons);
            }
        }

        // 渲染象限视图
        function renderQuadrantView(weapons) {
            const quadrants = ['leader', 'thinker', 'executor', 'creator'];

            quadrants.forEach(quadrant => {
                const container = document.getElementById(`${quadrant}-weapons`);
                const quadrantWeaponIds = weaponMetadata.quadrants[quadrant] || [];

                const quadrantWeapons = weapons.filter(w => {
                    const id = parseInt(w.number);
                    return quadrantWeaponIds.includes(id);
                });

                container.innerHTML = '';
                quadrantWeapons.forEach(weapon => {
                    const item = document.createElement('a');
                    item.className = 'quadrant-weapon-item';
                    item.href = weapon.url;
                    item.innerHTML = `
                        <div class="quadrant-weapon-number">${weapon.number}</div>
                        <div class="quadrant-weapon-title">${weapon.cn_title}</div>
                    `;
                    container.appendChild(item);
                });

                // 更新数量
                const countEl = document.querySelector(`[data-quadrant="${quadrant}"] .quadrant-count`);
                if (countEl) {
                    countEl.textContent = `${quadrantWeapons.length} 个武器`;
                }
            });
        }

        // 创建武器卡片
        function createWeaponCard(weapon, index) {
            const card = document.createElement('article');
            card.className = 'project-card reveal';

            card.innerHTML = `
                <a href="${weapon.url}" class="project-link">
                    <div class="project-info">
                        <div class="project-number">${weapon.number}</div>
                        <h3 class="project-title">${weapon.cn_title}</h3>
                        <p class="project-description">${weapon.description}</p>
                    </div>
                </a>
            `;

            return card;
        }

        // 初始化滚动显示动画
        function initRevealAnimation() {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        entry.target.classList.add('is-visible');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.reveal').forEach(el => {
                observer.observe(el);
            });
        }

        // 渲染卡牌画廊视图
        function renderGalleryView(weapons) {
            const grid = document.getElementById('gallery-grid');
            grid.innerHTML = '';

            weapons.forEach((weapon, index) => {
                const card = document.createElement('div');
                card.className = 'gallery-card reveal';

                card.innerHTML = `
                    <div class="gallery-card-inner">
                        <div class="gallery-card-front">
                            <div class="gallery-number">${weapon.number}</div>
                            <h3 class="gallery-title">${weapon.cn_title}</h3>
                            <p class="gallery-subtitle">${weapon.en_title}</p>
                            <div class="gallery-hint">
                                <i class="ri-arrow-left-right-line"></i>
                                <span>点击翻转</span>
                            </div>
                        </div>
                        <div class="gallery-card-back">
                            <p class="gallery-description">${weapon.description}</p>
                            <a href="${weapon.url}" class="gallery-link">
                                查看详情 <i class="ri-arrow-right-line"></i>
                            </a>
                        </div>
                    </div>
                `;

                // 添加翻转事件
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });

                grid.appendChild(card);
            });

            initRevealAnimation();
        }

        // 渲染包豪斯进化视图
        function renderBauhausView(weapons) {
            const grid = document.getElementById('bauhaus-grid');
            grid.innerHTML = '';

            weapons.forEach((weapon, index) => {
                const card = document.createElement('article');
                card.className = 'bauhaus-card reveal';

                // 4色循环
                const colorIndex = index % 4;
                const colors = ['orange', 'blue', 'yellow', 'black'];
                card.setAttribute('data-color', colors[colorIndex]);

                card.innerHTML = `
                    <a href="${weapon.url}" class="bauhaus-link">
                        <div class="bauhaus-number">${weapon.number}</div>
                        <div class="bauhaus-content">
                            <h3 class="bauhaus-title">${weapon.cn_title}</h3>
                            <p class="bauhaus-description">${weapon.description}</p>
                        </div>
                        <div class="bauhaus-decoration"></div>
                    </a>
                `;

                grid.appendChild(card);
            });

            initRevealAnimation();
        }

        // 渲染学术期刊视图
        function renderJournalView(weapons) {
            const table = document.getElementById('journal-table');
            table.innerHTML = '';

            // 按象限分组
            const quadrants = {
                'executor': { name: '执行者象限', weapons: [] },
                'thinker': { name: '思想者象限', weapons: [] },
                'leader': { name: '领导者象限', weapons: [] },
                'creator': { name: '创造者象限', weapons: [] }
            };

            weapons.forEach(weapon => {
                const id = parseInt(weapon.number);
                for (const [key, data] of Object.entries(weaponMetadata.quadrants)) {
                    if (data.includes(id)) {
                        quadrants[key].weapons.push(weapon);
                        break;
                    }
                }
            });

            // 渲染每个象限的表格
            for (const [key, data] of Object.entries(quadrants)) {
                if (data.weapons.length === 0) continue;

                const section = document.createElement('div');
                section.className = 'journal-section reveal';

                section.innerHTML = `
                    <h3 class="journal-section-title">${data.name}</h3>
                    <table class="journal-table-content">
                        <thead>
                            <tr>
                                <th class="journal-col-number">No.</th>
                                <th class="journal-col-title">Title</th>
                                <th class="journal-col-description">Abstract</th>
                                <th class="journal-col-link">Citation</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.weapons.map(weapon => `
                                <tr class="journal-row">
                                    <td class="journal-cell-number">${weapon.number}</td>
                                    <td class="journal-cell-title">
                                        <div class="journal-title-cn">${weapon.cn_title}</div>
                                        <div class="journal-title-en">${weapon.en_title}</div>
                                    </td>
                                    <td class="journal-cell-description">${weapon.description}</td>
                                    <td class="journal-cell-link">
                                        <a href="${weapon.url}" class="journal-cite-link">
                                            [${weapon.number}]
                                        </a>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;

                table.appendChild(section);
            }

            initRevealAnimation();
        }
