"""札记公开入口、元数据与内容边界。"""
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
        self.assertTrue(hub.select_one('ol.series-list').has_attr('reversed'))
        self.assertEqual([a['href'] for a in links],
                         ['weekly-2026-w44.html', 'weekly-2026-w43.html', 'weekly-2026-w42.html'])
        self.assertEqual(hub.select_one('.coordinate').get_text(), '系列 / 3 篇')
        page = parse(links[0]['href'])
        self.assertEqual(page.select_one('.series-nav a')['href'], 'weekly.html')
        self.assertEqual(page.select_one('.series-nav a[rel="prev"]')['href'],
                         'weekly-2026-w43.html')
        self.assertIsNone(page.select_one('.series-nav a[rel="next"]'))
        self.assertEqual(hub.h1.get_text(), '札记')
        self.assertEqual(page.select_one('.breadcrumb').get_text(), '← 札记')
        self.assertEqual(page.select_one('.series-nav')['aria-label'], '札记系列导航')
        self.assertEqual(page.select_one('.series-nav a').get_text(), '← 回到「札记」系列')
        self.assertEqual(page.select_one('meta[property="article:section"]')['content'], '札记')
        self.assertEqual(page.select_one('meta[property="article:tag"]')['content'], '札记')
        self.assertEqual(page.select_one('meta[property="article:series"]')['content'], '札记')
        self.assertEqual(page.select_one('meta[property="article:series_order"]')['content'], '202644')
        self.assertEqual(page.select_one('meta[property="article:published_time"]')['content'], '2026-10-30')
        self.assertEqual([h.get_text() for h in page.select('.article-content h2')],
                         ['一件具体的事', '这件事让我看见了什么', '一个没想透的问题'])
        self.assertEqual(page.h1.get_text(), '札记 · W44')
        self.assertEqual(page.title.get_text(), '札记 · W44')
        self.assertEqual(page.select_one('meta[property="og:title"]')['content'], '札记 · W44')
        figures = page.select('.article-content figure')
        self.assertEqual([figure.img['src'] for figure in figures], [
            'assets/weekly/w44-concert-stage.jpg',
            'assets/weekly/w44-mainline-timeline.png',
            'assets/weekly/w44-data-support.png',
        ])
        for figure in figures:
            self.assertTrue((ROOT / figure.img['src']).is_file())
            self.assertTrue(figure.img['alt'].strip())
            self.assertTrue(figure.figcaption.get_text().strip())
            self.assertGreater(int(figure.img['width']), 0)
            self.assertGreater(int(figure.img['height']), 0)
        text = page.select_one('.article-content').get_text()
        for private in ['素材来源', '[[', '现金所剩不多', '90-资料库', 'DeskPet', 'QQQ', 'SPY',
                        'FOMC', '+48%', '下周只盯什么', '学到什么']:
            self.assertNotIn(private, text)
        self.assertIn('But how？', text)
        excerpt = page.select_one('.article-content p').get_text()
        self.assertEqual(page.select_one('meta[name="description"]')['content'], excerpt)
        self.assertEqual(page.select_one('meta[property="og:description"]')['content'], excerpt)
        self.assertEqual(links[0].select_one('p').get_text(),
                         '本周我终于听见了自己要什么；也听见了自己还不会用。')
        self.assertEqual(links[0].h3.get_text(), page.h1.get_text())
        # 札记已脱离首页/文章列表；入口走桌面侧栏 + 手机汉堡（JS 注入）
        for name in ['index.html', 'blog.html']:
            self.assertIsNone(parse(name).select_one('h2 a[href="weekly-2026-w44.html"]'))

    def test_w42_w43_images_metadata_and_navigation(self):
        images = {
            42: ['w42-trim-at-high.jpg', 'w42-rules-notebook.jpg', 'w42-second-brain.jpg'],
            43: ['w43-writing-energy.jpg', 'w43-empty-device.jpg', 'w43-token-energy.jpg'],
        }
        entries = {entry['url']: entry for entry in build_index()}
        hub = parse('weekly.html')
        for week, names in images.items():
            with self.subTest(week=week):
                name = f'weekly-2026-w{week}.html'
                page = parse(name)
                self.assertEqual(page.h1.get_text(), f'札记 · W{week}')
                self.assertEqual(page.select_one('.coordinate').get_text(), f'札记 · 2026-W{week}')
                self.assertEqual(page.select_one('meta[property="article:series_order"]')['content'],
                                 f'2026{week}')
                date = f'2026-10-{16 if week == 42 else 23}'
                self.assertEqual(page.select_one('.article-meta time')['datetime'], date)
                self.assertEqual(page.select_one('meta[property="article:published_time"]')['content'], date)
                self.assertEqual(entries[name]['category'], '札记')
                self.assertEqual(page.select_one('link[rel="canonical"]')['href'],
                                 'https://aikevin.dpdns.org/' + name[:-5])
                figures = page.select('.article-content figure')
                self.assertEqual([f.img['src'] for f in figures],
                                 ['/assets/weekly/' + image for image in names])
                for figure in figures:
                    self.assertTrue((ROOT / figure.img['src'].lstrip('/')).is_file())
                    self.assertTrue(figure.img['alt'].strip())
                    self.assertTrue(figure.figcaption.get_text().strip())
                    self.assertGreater(int(figure.img['width']), 0)
                    self.assertGreater(int(figure.img['height']), 0)
                self.assertNotIn('[[', page.select_one('.article-content').get_text())
                excerpt = page.select_one('.article-content p').get_text()
                self.assertEqual(page.select_one('meta[name="description"]')['content'], excerpt)
                item = hub.select_one(f'.series-item[href="{name}"]')
                self.assertEqual(item.time['datetime'], date)
                self.assertEqual(item.h3.get_text(), page.h1.get_text())
                self.assertEqual(item.p.get_text(), excerpt)
                previous = page.select_one('.series-nav a[rel="prev"]')
                self.assertEqual(previous['href'] if previous else None,
                                 'weekly-2026-w42.html' if week == 43 else None)
                self.assertEqual(page.select_one('.series-nav a[rel="next"]')['href'],
                                 f'weekly-2026-w{week + 1}.html')
                for excluded in ['index.html', 'blog.html']:
                    self.assertIsNone(parse(excluded).select_one(f'a[href="{name}"]'))

    def test_discovery_and_theme(self):
        entries = {entry['url']: entry for entry in build_index()}
        self.assertIn('weekly.html', entries)
        self.assertEqual(entries['weekly-2026-w44.html']['category'], '札记')
        home = parse('index.html')
        self.assertIsNone(home.select_one('#featured h2 a[href="weekly-2026-w44.html"]'))
        self.assertNotEqual(home.select_one('#featured h2 a')['href'], 'weekly-2026-w44.html')
        self.assertEqual(len(home.select('#start-here article')), 4)
        main_js = (ROOT / 'scripts/main.js').read_text(encoding='utf-8')
        self.assertIn('weekly-rail inject', main_js)
        self.assertIn('nav-item-weekly', main_js)
        self.assertIn("rail.setAttribute('aria-label', '札记')", main_js)
        self.assertEqual(main_js.count('>札记</a>'), 2)
        for old_name in ['周报', '周记']:
            self.assertNotIn(old_name, main_js)
            for name in ['weekly.html', 'weekly-2026-w44.html']:
                self.assertNotIn(old_name, (ROOT / name).read_text(encoding='utf-8'))
        css = (ROOT / 'styles/main.css').read_text(encoding='utf-8')
        self.assertIn('weekly-rail', css)
        for name in ['weekly.html', 'weekly-2026-w44.html']:
            page = parse(name)
            self.assertIsNotNone(page.select_one('script[src^="scripts/theme-init.js"]'))
            self.assertIsNotNone(page.select_one('.theme-toggle'))
            # 顶栏静态 HTML 不加札记；手机项由 main.js 注入
            self.assertIsNone(page.select_one('#site-menu a[href="weekly.html"]'))
            self.assertEqual(page.select_one('link[rel="canonical"]')['href'],
                             'https://aikevin.dpdns.org/' + name[:-5])
