"""相关阅读排序、范围、生成边界及幂等校验。"""
import re
import tempfile
import unittest
from pathlib import Path

from bs4 import BeautifulSoup

from update_related_reading import related_updates

ROOT = Path(__file__).resolve().parents[1]


def article(title, category='', tags=(), series='', order='', lang='zh'):
    metadata = {'type': 'essay', 'lang': lang, 'section': category,
                'series': series, 'series_order': order}
    head = ''.join(f'<meta property="article:{key}" content="{value}">'
                   for key, value in metadata.items())
    head += ''.join(f'<meta property="article:tag" content="{tag}">' for tag in tags)
    return (f'<html lang="{lang}"><head>{head}</head><body><article>'
            f'<h1>{title}</h1><div class="article-content"><p>原样正文 &amp; 标点。</p></div>'
            '<footer class="article-end"><p>保留回信和声明。</p></footer>'
            '</article></body></html>')


class RelatedReadingTests(unittest.TestCase):
    def test_ranking_scope_and_write_boundary(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            pages = {
                'self.html': article('本文', '投资', ['AI', '研究'], '系列', '2'),
                'series.html': article('同系列 & 标题', '其他', [], '系列', '1'),
                'tags.html': article('两标签', '其他', ['AI', '研究']),
                'category.html': article('同分类', '投资'),
                'unrelated.html': article('无关', '生活'),
                'english.html': article('English', '投资', ['AI'], lang='en'),
            }
            for name, source in pages.items():
                (root / name).write_text(source)
            updates = related_updates(root)
            self.assertNotIn(root / 'english.html', updates)
            soup = BeautifulSoup(updates[root / 'self.html'], 'html.parser')
            nav = soup.select_one('.article-end .related-reading')
            self.assertEqual(nav.h2.text, '相关阅读')
            self.assertEqual([a['href'] for a in nav.select('a')],
                             ['series.html', 'tags.html', 'category.html'])
            self.assertEqual(nav.select_one('a').text, '同系列 & 标题')
            self.assertIsNone(BeautifulSoup(updates[root / 'unrelated.html'], 'html.parser')
                              .select_one('.related-reading'))
            for path, source in updates.items():
                parsed = BeautifulSoup(source, 'html.parser')
                block = parsed.select_one('.related-reading')
                if block:
                    self.assertLessEqual(len(block.select('a')), 3)
                    self.assertNotIn(path.name, [a['href'] for a in block.select('a')])
                    # 局部区块之外逐字不变，HTML 不经整体序列化。
                    source_without_block = re.sub(r'<nav class="related-reading".*?</nav>', '', source)
                    self.assertEqual(source_without_block, pages[path.name])
                path.write_text(source)
            self.assertEqual(related_updates(root), updates)
            # 删除候选后，旧区块必须移除，不能遗留死链。
            for path in root.glob('*.html'):
                if path.name != 'self.html':
                    path.unlink()
            self.assertEqual(related_updates(root)[root / 'self.html'], pages['self.html'])

    def test_checked_in_chinese_articles_are_current(self):
        updates = related_updates(ROOT)
        self.assertEqual(len(updates), 39)
        for path, source in updates.items():
            self.assertEqual(source, path.read_text(), path.name)
            soup = BeautifulSoup(source, 'html.parser')
            links = soup.select('.related-reading a')
            self.assertTrue(links, path.name)
            self.assertLessEqual(len(links), 3)
            self.assertNotIn(path.name, [a['href'] for a in links])
            for link in links:
                self.assertTrue((ROOT / link['href']).is_file())
