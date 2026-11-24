"""全站质量防线回归：验证器覆盖率、重复资源拦截、共享外壳一致性与旅行统计检查。"""
import contextlib
import io
import tempfile
import unittest
from pathlib import Path

from scripts.sync_chrome import ROOT, chrome_updates
from update_travel_overview import update_overview
from validate_site import discover_pages, validate


class SiteGuardsTests(unittest.TestCase):
    def test_validator_covers_new_articles_weekly_and_404(self):
        pages = set(discover_pages(ROOT))
        for expected in [
            'energy-ai-market-cycles.html',
            'energy-like-tokens.html',
            'conventional-commits-cheatsheet.html',
            'weekly.html',
            'weekly-2026-w46.html',
            '404.html',
        ]:
            self.assertIn(expected, pages)
        # 已归档下线的旧咖啡列表页不再停留在根目录拦截 _redirects
        for archived_coffee in ['coffee-beans.html', 'coffee-notes.html', 'coffee-shops.html', 'coffee-equipment.html']:
            self.assertFalse((ROOT / archived_coffee).exists(), f'{archived_coffee} 应已迁出根目录让 _redirects 生效')

    def test_validator_catches_duplicate_scripts_and_broken_anchors(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / 'ok.js').write_text('// ok', encoding='utf-8')
            (root / 'page.html').write_text(
                '<!DOCTYPE html><html><head><title>T</title>'
                '<meta name="description" content="D">'
                '<link rel="canonical" href="https://aikevin.dpdns.org/page">'
                '</head><body><nav aria-label="主导航"></nav>'
                '<main><h1>H</h1><a href="#missing-id">x</a></main>'
                '<script src="ok.js"></script><script src="ok.js"></script>'
                '</body></html>',
                encoding='utf-8',
            )
            with contextlib.redirect_stdout(io.StringIO()):
                errors = validate(root)
            self.assertTrue(any('duplicate script ok.js' in e for e in errors), errors)
            self.assertTrue(any('broken local anchor #missing-id' in e for e in errors), errors)

    def test_shared_chrome_is_synced(self):
        for path, expected in chrome_updates(ROOT).items():
            self.assertEqual(expected, path.read_text(encoding='utf-8'), path.relative_to(ROOT))

    def test_travel_overview_is_synced(self):
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(update_overview(check=True), 0)

    def test_deployment_config_hygiene(self):
        wrangler = (ROOT / 'wrangler.toml').read_text(encoding='utf-8')
        self.assertIn('pages_build_output_dir = "."', wrangler)
        self.assertIn('GALLERY_BUCKET', wrangler)
        self.assertIn('SECOND_BRAIN_BUCKET', wrangler)
        for deprecated in ['VISITOR_COUNTER', 'GALLERY_META', 'kv_namespaces']:
            self.assertNotIn(deprecated, wrangler)
        self.assertTrue((ROOT / '_headers').is_file())
        self.assertTrue((ROOT / '.assetsignore').is_file())


if __name__ == '__main__':
    unittest.main()
