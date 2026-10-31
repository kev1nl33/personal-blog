"""周报公开入口、元数据与内容边界。"""
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
        self.assertEqual([a['href'] for a in links], ['weekly-2026-w44.html'])
        page = parse(links[0]['href'])
        self.assertEqual(page.select_one('.series-nav a')['href'], 'weekly.html')
        self.assertIsNone(page.select_one('.series-nav a[rel]'))
        self.assertEqual(page.select_one('meta[property="article:series"]')['content'], '周报')
        self.assertEqual(page.select_one('meta[property="article:series_order"]')['content'], '202644')
        self.assertEqual(page.select_one('meta[property="article:published_time"]')['content'], '2026-10-30')
        self.assertEqual(len(page.select('.article-content h2')), 5)
        self.assertEqual(len(page.select('.article-content ol li')), 6)
        text = page.select_one('.article-content').get_text()
        for private in ['素材来源', '[[', '现金所剩不多', '90-资料库']:
            self.assertNotIn(private, text)
        self.assertIn('But how？', text)

    def test_discovery_and_theme(self):
        entries = {entry['url']: entry for entry in build_index()}
        self.assertIn('weekly.html', entries)
        self.assertEqual(entries['weekly-2026-w44.html']['category'], '周报')
        home = parse('index.html')
        self.assertEqual(home.select_one('#featured h2 a')['href'], 'weekly-2026-w44.html')
        self.assertEqual(len(home.select('#start-here article')), 4)
        for name in ['weekly.html', 'weekly-2026-w44.html']:
            page = parse(name)
            self.assertIsNotNone(page.select_one('script[src^="scripts/theme-init.js"]'))
            self.assertIsNotNone(page.select_one('.theme-toggle'))
            self.assertIsNone(page.select_one('#site-menu a[href="weekly.html"]'))
            self.assertEqual(page.select_one('link[rel="canonical"]')['href'],
                             'https://aikevin.dpdns.org/' + name[:-5])
