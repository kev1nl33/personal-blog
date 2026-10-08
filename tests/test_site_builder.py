import tempfile
import unittest
from pathlib import Path
from site_builder import render_article, render_coffee, replace_region, safe_slug, commit_outputs, with_site_motion

class GenerationTests(unittest.TestCase):
    def test_coffee_latest_note_follows_local_content(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / 'coffee-beans.html').write_text('<article class="bean-card"><h3>耶加雪菲 果丁丁</h3></article>')
            (root / 'coffee-shops.html').write_text('<article class="shop-card">一间咖啡馆</article>')
            (root / 'coffee-notes.html').write_text('<article class="note-card"><h3>耶加雪菲新冲法</h3><div class="note-content"><p>今天调整了注水节奏。</p></div></article>')
            rendered = render_coffee(root)
            self.assertIn('耶加雪菲新冲法', rendered)
            self.assertIn('今天调整了注水节奏。', rendered)
            self.assertIn('查看相关豆子', rendered)

    def test_motion_paths_and_idempotence(self):
        source = '<!DOCTYPE html><html><head></head><body><h1>Title</h1></body></html>'
        once = with_site_motion(source, 'projects/tools/a.html')
        twice = with_site_motion(once, 'projects/tools/a.html')
        self.assertEqual(once, twice)
        self.assertEqual(twice.count('scripts/motion.js'), 1)
        self.assertEqual(twice.count('styles/motion.css'), 1)
        self.assertIn('../../scripts/motion.js', twice)
        self.assertIn('<h1>Title</h1>', twice)

    def test_missing_region_preserves_input(self):
        with self.assertRaises(ValueError):
            replace_region('<main>unchanged</main>', 'articles', 'replacement')

    def test_duplicate_region_rejected(self):
        marker = '<!-- articles:start -->old<!-- articles:end -->'
        with self.assertRaises(ValueError):
            replace_region(marker + marker, 'articles', 'new')

    def test_literal_backslashes_and_brackets(self):
        source = '<!-- articles:start -->old<!-- articles:end -->'
        self.assertIn(r'\1 <h2>x</h2>', replace_region(source, 'articles', r'\1 <h2>x</h2>'))

    def test_url_is_preserved_and_traversal_rejected(self):
        self.assertEqual(safe_slug('2025_Year_Report'), '2025_Year_Report')
        self.assertEqual(safe_slug('Product-thinking'), 'Product-thinking')
        for value in ('../secret', '/tmp/p', 'x.html/../../p', ''):
            with self.assertRaises(ValueError):
                safe_slug(value)

    def test_article_escapes_metadata_preserves_body(self):
        article = dict(title='<script>bad</script>', excerpt='"quoted" & text', url='safe',
                       content='<h2>真实正文</h2><p>原内容</p>', category='个人成长',
                       category_en='personal', date_short='2026-01-03', read_time=5, tags=[])
        result = render_article(article)
        self.assertIn('&lt;script&gt;bad&lt;/script&gt;', result)
        self.assertNotIn('<script>bad</script>', result)
        self.assertIn('<h2>真实正文</h2><p>原内容</p>', result)
        self.assertIn('safe.html', result)

    def test_invalid_batch_writes_nothing(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / 'a.html').write_text('old')
            with self.assertRaises(ValueError):
                commit_outputs({'a.html': '<!DOCTYPE html><html>new</html>', '../bad.html': 'bad'}, root)
            self.assertEqual((root / 'a.html').read_text(), 'old')

if __name__ == '__main__':
    unittest.main()
