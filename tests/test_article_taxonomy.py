"""验证文章分类、元数据、列表计数与首页阅读入口的不变量（不写死文章总数）。"""
import collections
import unittest
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]


def parse(name):
    return BeautifulSoup((ROOT / name).read_text(encoding='utf-8'), 'html.parser')


class ArticleTaxonomyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.archive = parse('blog.html')
        cls.cards = cls.archive.select('#blogGrid .blog-card')
        cls.pages = {card.select_one('h2 a')['href']: parse(card.select_one('h2 a')['href'])
                     for card in cls.cards}

    def test_metadata_and_category_counts(self):
        self.assertGreaterEqual(len(self.cards), 41)
        # 根目录中所有非札记的 article:type 页面都必须出现在文章档案中
        disk_articles = set()
        for path in sorted(ROOT.glob('*.html')):
            soup = parse(path.name)
            t = soup.select_one('meta[property="article:type"]')
            sec = soup.select_one('meta[property="article:section"]')
            if t and (not sec or sec.get('content', '').strip() != '札记'):
                disk_articles.add(path.name)
        self.assertEqual(set(self.pages.keys()), disk_articles)

        counts = collections.Counter()
        for card in self.cards:
            name = card.select_one('h2 a')['href']
            page = self.pages[name]
            meta = {m['property'][8:]: m.get('content', '')
                    for m in page.select('meta[property^="article:"]')}
            for field in ['section', 'type', 'lang', 'featured', 'series', 'series_order', 'updated']:
                self.assertIn(field, meta, name)
            self.assertIn(meta['type'], ['essay', 'note', 'cheatsheet'])
            self.assertEqual(card['data-type'], meta['type'])
            self.assertEqual(card.select_one('.card-tag').text, meta['section'])
            self.assertEqual(meta['lang'], 'en' if name == 'energy-like-tokens.html' else 'zh')
            self.assertTrue(page.html['lang'].startswith(meta['lang']))
            counts[card['data-category']] += 1

        # 校验页面上的分类计数徽章、总数文案与首页「全部 N 篇」与实际卡片一致
        all_pill = int(self.archive.select_one('.category-btn[data-category="all"] .count-pill').text)
        self.assertEqual(all_pill, len(self.cards))
        for cat, expected_count in counts.items():
            pill = int(self.archive.select_one(f'.category-btn[data-category="{cat}"] .count-pill').text)
            self.assertEqual(pill, expected_count, cat)
        self.assertEqual(self.archive.select_one('#searchCount').text, f'共 {len(self.cards)} 篇文章')
        home = parse('index.html')
        self.assertEqual(home.select_one('#featured .section-heading a.text-link').text, f'全部 {len(self.cards)} 篇 →')

    def test_tags_are_shared_and_consistent(self):
        counts = collections.Counter()
        for card in self.cards:
            page = self.pages[card.select_one('h2 a')['href']]
            tags = [m['content'] for m in page.select('meta[property="article:tag"]')]
            self.assertEqual(card['data-tags'].split(','), tags)
            self.assertTrue(1 <= len(tags) <= 3)
            counts.update(tags)
        self.assertLessEqual(len(counts), 12)
        self.assertEqual(counts['札记'], 0)
        self.assertGreaterEqual(min((count for tag, count in counts.items() if tag != '札记'), default=2), 2)
        self.assertEqual(len(self.archive.select('.tag-shortcuts > .tag-btn')), 8)
        self.assertEqual(len(self.archive.select('#moreTags .tag-btn')), len(counts) - 8)

    def test_homepage_reading_order(self):
        home = parse('index.html')
        sections = home.select('main > section')
        self.assertEqual(sections[1]['id'], 'start-here')
        selected = home.select('#start-here article')
        self.assertEqual(len(selected), 4)
        selected_links = [c.select_one('h2 a')['href'] for c in selected]
        for card in selected:
            self.assertLessEqual(len(card.select_one('.blog-card-excerpt').text), 20)
        featured = [name for name, page in self.pages.items()
                    if page.select_one('meta[property="article:featured"]')['content'] == 'true']
        self.assertEqual(set(featured), set(selected_links))
        recent = home.select('#featured article')
        self.assertEqual(len(recent), 4)
        self.assertTrue(all(card['data-type'] == 'essay' for card in recent))
        essays = [c.select_one('h2 a')['href'] for c in self.cards
                  if c['data-type'] == 'essay' and c.select_one('h2 a')['href'] not in selected_links]
        recent_links = [c.select_one('h2 a')['href'] for c in recent]
        self.assertEqual(recent_links, essays[:4])
        self.assertTrue(set(recent_links).isdisjoint(selected_links))
        self.assertEqual(len(set(recent_links)), 4)
