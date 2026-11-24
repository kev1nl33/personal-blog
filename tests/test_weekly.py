"""札记公开入口、元数据、链式导航与内容边界不变量（新增期数无需硬改测试）。"""
import re
import unittest
from pathlib import Path

from bs4 import BeautifulSoup

from generate_search_index import build_index

ROOT = Path(__file__).resolve().parents[1]


def parse(name):
    return BeautifulSoup((ROOT / name).read_text(encoding='utf-8'), 'html.parser')


class WeeklyTests(unittest.TestCase):
    def test_hub_and_article_navigation(self):
        hub = parse('weekly.html')
        links = hub.select('ol.series-list a.series-item')
        disk_weeklies = sorted((p.name for p in ROOT.glob('weekly-*.html')), reverse=True)
        self.assertGreaterEqual(len(disk_weeklies), 5)
        self.assertTrue(hub.select_one('ol.series-list').has_attr('reversed'))
        self.assertEqual([a['href'] for a in links], disk_weeklies)
        self.assertEqual(hub.select_one('.coordinate').get_text(), f'系列 / {len(disk_weeklies)} 篇')
        self.assertEqual(hub.h1.get_text(), '札记')

        # 校验倒序列表对应每期的元数据、前后期连续导航与首尾边界
        chronological = list(reversed(disk_weeklies))
        for idx, name in enumerate(chronological):
            with self.subTest(page=name):
                page = parse(name)
                self.assertEqual(page.select_one('.breadcrumb').get_text(), '← 札记')
                self.assertEqual(page.select_one('.series-nav')['aria-label'], '札记系列导航')
                self.assertEqual(page.select_one('.series-nav a')['href'], 'weekly.html')
                self.assertEqual(page.select_one('.series-nav a').get_text(), '← 回到「札记」系列')
                self.assertEqual(page.select_one('meta[property="article:section"]')['content'], '札记')
                self.assertEqual(page.select_one('meta[property="article:tag"]')['content'], '札记')
                self.assertEqual(page.select_one('meta[property="article:series"]')['content'], '札记')
                self.assertRegex(page.select_one('meta[property="article:series_order"]')['content'], r'^\d{6}$')
                self.assertEqual(
                    page.select_one('link[rel="canonical"]')['href'],
                    'https://aikevin.dpdns.org/' + name[:-5],
                )
                prev_link = page.select_one('.series-nav a[rel="prev"]')
                next_link = page.select_one('.series-nav a[rel="next"]')
                self.assertEqual(prev_link['href'] if prev_link else None,
                                 chronological[idx - 1] if idx > 0 else None)
                self.assertEqual(next_link['href'] if next_link else None,
                                 chronological[idx + 1] if idx + 1 < len(chronological) else None)

                # 首段即摘要，与 meta description 一致；目录页保留非空标题与导语
                excerpt = page.select_one('.article-content p').get_text()
                self.assertEqual(page.select_one('meta[name="description"]')['content'], excerpt)
                self.assertEqual(page.select_one('meta[property="og:description"]')['content'], excerpt)
                item = hub.select_one(f'.series-item[href="{name}"]')
                self.assertEqual(item.h3.get_text(), page.h1.get_text())
                self.assertTrue(item.p.get_text().strip())

                # 私密草稿标记不得泄漏到公开正文
                text = page.select_one('.article-content').get_text()
                for private in ['素材来源', '[[', '取材与核对', '本文件为公开骨架', '02-正在关注', '90-资料库']:
                    self.assertNotIn(private, text)

                # 配图真实存在且带 WebP <picture> 封装与尺寸
                figures = page.select('.article-content figure')
                self.assertTrue(figures)
                for figure in figures:
                    img = figure.img
                    self.assertTrue((ROOT / img['src'].lstrip('/')).is_file())
                    self.assertTrue(img['alt'].strip())
                    self.assertTrue(figure.figcaption.get_text().strip())
                    self.assertGreater(int(img['width']), 0)
                    self.assertGreater(int(img['height']), 0)
                    source = figure.select_one('picture > source[type="image/webp"]')
                    self.assertIsNotNone(source)
                    self.assertTrue((ROOT / source['srcset'].lstrip('/')).is_file())

                # 札记独立展示，不混入文章档案卡片与首页最近文章
                for excluded in ['index.html', 'blog.html']:
                    self.assertIsNone(parse(excluded).select_one(f'h2 a[href="{name}"]'))

    def test_discovery_and_theme(self):
        entries = {entry['url']: entry for entry in build_index()}
        self.assertIn('weekly.html', entries)
        for path in sorted(ROOT.glob('weekly-*.html')):
            self.assertEqual(entries[path.name]['category'], '札记')
        home = parse('index.html')
        self.assertIsNotNone(home.select_one('#site-menu a[href="weekly.html"]'))
        self.assertIsNotNone(home.select_one('#start-here a[href="weekly.html"]'))
        self.assertEqual(len(home.select('#start-here article')), 4)

        # 不再依赖运行时 JS 注入 .weekly-rail 造成桌面 64px 布局跳动
        main_js = (ROOT / 'scripts/main.js').read_text(encoding='utf-8')
        self.assertNotIn('weekly-rail', main_js)
        css = (ROOT / 'styles/main.css').read_text(encoding='utf-8')
        self.assertNotIn('has-weekly-rail', css)

        for name in ['weekly.html', 'weekly-2026-w46.html']:
            page = parse(name)
            self.assertIsNotNone(page.select_one('script[src^="scripts/theme-init.js"]'))
            self.assertIsNotNone(page.select_one('.theme-toggle'))
            weekly_nav = page.select_one('#site-menu a[href="weekly.html"]')
            self.assertIsNotNone(weekly_nav)
            self.assertEqual(weekly_nav.get('aria-current'), 'page')
            # 确保没有双 aria-current
            self.assertEqual(len(page.select('#site-menu a[aria-current="page"]')), 1)
            for old_name in ['周报', '周记']:
                self.assertNotIn(old_name, (ROOT / name).read_text(encoding='utf-8'))
