"""「最近在做」页的入口与收录回归校验。"""
import contextlib
import io
import json
import shutil
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

from bs4 import BeautifulSoup

from validate_site import validate

ROOT = Path(__file__).resolve().parents[1]


class NowPageTests(unittest.TestCase):
    def test_core_entries_and_page_metadata(self):
        for name in ['index.html', 'about.html', 'blog.html', 'now.html']:
            with self.subTest(page=name):
                soup = BeautifulSoup((ROOT / name).read_text(), 'html.parser')
                self.assertIsNotNone(soup.select_one('footer nav a[href="now.html"]'))
        about = BeautifulSoup((ROOT / 'about.html').read_text(), 'html.parser')
        self.assertIsNotNone(about.select_one('.life-timeline a[href="now.html"]'))
        now = BeautifulSoup((ROOT / 'now.html').read_text(), 'html.parser')
        self.assertEqual(now.h1.get_text(), '最近在做')
        self.assertEqual(now.select_one('link[rel="canonical"]')['href'],
                         'https://aikevin.dpdns.org/now.html')
        self.assertEqual(len(now.select('.now-content p')), 4)

    def test_search_and_sitemap_include_now(self):
        entries = json.loads((ROOT / 'search-index.json').read_text())
        entry = next(item for item in entries if item['url'] == 'now.html')
        self.assertEqual(entry['title'], '最近在做')
        for text in ['第二次上线批准', '做完并已上线', '已经上线', 'Pro→Pro+']:
            self.assertIn(text, entry['content'])
        urls = ET.parse(ROOT / 'sitemap.xml').getroot()
        now = next(item for item in urls if item.find('{*}loc').text.endswith('/now.html'))
        self.assertEqual(now.find('{*}priority').text, '0.8')
        self.assertEqual(sum('/projects/' in item.find('{*}loc').text for item in urls), 108)

    def test_validator_checks_now_page(self):
        # 让近况页缺少主标题，确认它确实进入 managed pages 校验。
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'data').mkdir()
            (root / 'data/articles.json').write_text('[]')
            for page in ROOT.glob('*.html'):
                shutil.copyfile(page, root / page.name)
            (root / 'now.html').write_text('<html><body><main></main></body></html>')
            with contextlib.redirect_stdout(io.StringIO()):
                errors = validate(root)
            self.assertIn('now.html: expected one page title', errors)


if __name__ == '__main__':
    unittest.main()
