"""验证系列顺序、首尾边界、评分占位及搜索收录。"""
import unittest
from pathlib import Path

from bs4 import BeautifulSoup

from generate_search_index import build_index

ROOT = Path(__file__).resolve().parents[1]
SERIES = {
    'experience-tickets': ('人生体验券', sorted(p.name for p in ROOT.glob('experience-ticket-*.html'))),
    'leaving-the-system': ('离开体制', [name + '.html' for name in [
        'resignation-decision-process', 'career-transition', 'freelance-first-year',
        '2025_Year_Report', 'borrowed-uniform']]),
}


def parse(name):
    return BeautifulSoup((ROOT / name).read_text(encoding='utf-8'), 'html.parser')


class SeriesTests(unittest.TestCase):
    def test_order_navigation_and_metadata(self):
        for slug, (title, members) in SERIES.items():
            landing = parse(f'series/{slug}.html')
            self.assertEqual([a['href'] for a in landing.select('ol.series-list a')],
                             ['../' + name for name in members])
            for index, name in enumerate(members):
                page = parse(name)
                self.assertEqual(page.select_one('meta[property="article:series"]')['content'], title)
                self.assertEqual(page.select_one('meta[property="article:series_order"]')['content'], str(index + 1))
                self.assertEqual(len(page.select('.series-nav')), 1)
                nav = page.select_one('.series-nav')
                self.assertEqual(nav.select_one('a')['href'], f'series/{slug}.html')
                for rel, offset in [('prev', -1), ('next', 1)]:
                    link = nav.select_one(f'a[rel="{rel}"]')
                    target = index + offset
                    if 0 <= target < len(members):
                        self.assertEqual(link['href'], members[target])
                        self.assertEqual(link.select_one('span').text, '上一篇' if rel == 'prev' else '下一篇')
                    else:
                        self.assertIsNone(link)
                self.assertIsNone(page.select_one('.article-content .series-nav'))

    def test_ticket_summary_and_extras(self):
        members = SERIES['experience-tickets'][1]
        for index, name in enumerate(members):
            box = parse(name).select_one('.ticket-summary')
            self.assertEqual([dt.text for dt in box.select('dt')],
                             ['周期', '投入', '一句话结果', '给生活打分'])
            self.assertTrue(all(dd.text.strip() for dd in box.select('dd')))
            self.assertEqual(box.select('dd')[-1].text, ['6/10', '5/10', '6/10', '7/10', '5/10', '8/10'][index])
        extras = parse('series/experience-tickets.html').select('ul.series-list a')
        self.assertEqual([a['href'] for a in extras], ['../' + name + '.html' for name in [
            'seventy-posts-dead-silence', 'ai-tools-without-illusions', 'five-iron-rules-naval']])

    def test_search_and_home_entries(self):
        entries = {entry['url']: entry for entry in build_index()}
        home = parse('index.html')
        for slug, (title, members) in SERIES.items():
            url = f'series/{slug}.html'
            self.assertIn(url, entries)
            self.assertIsNotNone(home.select_one(f'a[href="{url}"]'))
            for index, name in enumerate(members):
                self.assertEqual(entries[name]['series'], title)
                self.assertEqual(entries[name]['series_order'], index + 1)
