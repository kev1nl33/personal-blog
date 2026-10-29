"""局部同步的幂等性、目录数据来源与写入边界回归。"""
import shutil
import tempfile
import unittest
from pathlib import Path

from bs4 import BeautifulSoup

from update_reading_links import ROOT, SERIES_PAGES, reading_updates


class ReadingLinksTests(unittest.TestCase):
    def test_checked_in_pages_are_current(self):
        for path, source in reading_updates().items():
            self.assertEqual(source, path.read_text(encoding='utf-8'), path.name)

    def test_regeneration_uses_directory_and_preserves_body(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            (root / 'series').mkdir()
            for name in ('index.html', 'blog.html'):
                shutil.copyfile(ROOT / name, root / name)
            for slug in SERIES_PAGES:
                relative = Path('series') / f'{slug}.html'
                shutil.copyfile(ROOT / relative, root / relative)
                landing = BeautifulSoup((ROOT / relative).read_text(), 'html.parser')
                for link in landing.select('ol.series-list a'):
                    name = Path(link['href']).name
                    shutil.copyfile(ROOT / name, root / name)
            # 改目录顺序/标题，证明没有另抄成员顺序；番外仍不参与导航。
            path = root / 'series/leaving-the-system.html'
            landing = BeautifulSoup(path.read_text(), 'html.parser')
            ordered = landing.select_one('ol.series-list')
            first = ordered.select_one('li').extract()
            ordered.append(first)
            first.select_one('h3').string = '目录中的新标题 & 测试'
            path.write_text(str(landing), encoding='utf-8')
            before = {p: p.read_text(encoding='utf-8') for p in root.glob('*.html')}
            updates = reading_updates(root)
            for target, source in updates.items():
                old = BeautifulSoup(before[target], 'html.parser')
                new = BeautifulSoup(source, 'html.parser')
                if target.name == 'index.html':
                    old.select_one('#featured').decompose()
                    new.select_one('#featured').decompose()
                else:
                    old.select_one('.series-nav').decompose()
                    new.select_one('.series-nav').decompose()
                self.assertEqual(str(old), str(new), target.name)
                target.write_text(source, encoding='utf-8')
            first_page = BeautifulSoup(updates[root / 'career-transition.html'], 'html.parser')
            self.assertIsNone(first_page.select_one('.series-nav a[rel="prev"]'))
            last_page = BeautifulSoup(updates[root / 'resignation-decision-process.html'], 'html.parser')
            self.assertIsNone(last_page.select_one('.series-nav a[rel="next"]'))
            previous = BeautifulSoup(updates[root / 'borrowed-uniform.html'], 'html.parser')
            self.assertIn('目录中的新标题 & 测试', previous.select_one('.series-nav a[rel="next"]').text)
            for target, source in reading_updates(root).items():
                self.assertEqual(source, target.read_text(encoding='utf-8'))
