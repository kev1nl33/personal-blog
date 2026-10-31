"""验证阶段 1 的文章分类、元数据与首页阅读入口。"""
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
        cls.cards = parse('blog.html').select('#blogGrid .blog-card')
        cls.pages = {card.select_one('h2 a')['href']: parse(card.select_one('h2 a')['href'])
                     for card in cls.cards}

    def test_metadata_and_category_counts(self):
        self.assertEqual(len(self.cards), 41)
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
        self.assertEqual(counts, dict(career=7, ai=13, investment=4, personal=10, life=4, reading=2, weekly=1))

    def test_tags_are_shared_and_consistent(self):
        counts = collections.Counter()
        for card in self.cards:
            page = self.pages[card.select_one('h2 a')['href']]
            tags = [m['content'] for m in page.select('meta[property="article:tag"]')]
            self.assertEqual(card['data-tags'].split(','), tags)
            self.assertTrue(1 <= len(tags) <= 3)
            counts.update(tags)
        self.assertLessEqual(len(counts), 12)
        self.assertEqual(counts['周报'], 1)
        self.assertGreaterEqual(min(count for tag, count in counts.items() if tag != '周报'), 2)
        archive = parse('blog.html')
        self.assertEqual(len(archive.select('.tag-shortcuts > .tag-btn')), 8)
        self.assertEqual(len(archive.select('#moreTags .tag-btn')), len(counts) - 8)

    def test_homepage_reading_order(self):
        home = parse('index.html')
        sections = home.select('main > section')
        self.assertEqual(sections[1]['id'], 'start-here')
        expected = ['borrowed-uniform.html', 'seventy-posts-dead-silence.html',
                    'experience-ticket-1-two-weeks-of-magic-and-confusion.html', 'fable-mr-wei-kitchen.html']
        selected = home.select('#start-here article')
        self.assertEqual([c.select_one('h2 a')['href'] for c in selected], expected)
        for card in selected:
            self.assertLessEqual(len(card.select_one('.blog-card-excerpt').text), 20)
        featured = [name for name, page in self.pages.items()
                    if page.select_one('meta[property="article:featured"]')['content'] == 'true']
        self.assertEqual(set(featured), set(expected))
        recent = home.select('#featured article')
        self.assertEqual(len(recent), 4)
        self.assertTrue(all(card['data-type'] == 'essay' for card in recent))
        essays = [c.select_one('h2 a')['href'] for c in self.cards
                  if c['data-type'] == 'essay' and c.select_one('h2 a')['href'] not in expected]
        recent_links = [c.select_one('h2 a')['href'] for c in recent]
        self.assertEqual(recent_links, essays[:4])
        self.assertTrue(set(recent_links).isdisjoint(expected))
        self.assertEqual(len(set(recent_links)), 4)
