"""深色模式接入范围：公共页有主题脚本和按钮，咖啡角与 projects 不接入。"""
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {'test.html', 'article1.html', 'coffee-backup-20260109.html'}


def root_pages():
    return sorted(path for path in ROOT.glob('*.html'))


def in_scope(path):
    name = path.name
    if name.startswith('coffee') or name in EXCLUDED:
        return False
    return 'class="site-nav"' in path.read_text(encoding='utf-8')


class ThemeWiringTests(unittest.TestCase):
    def test_public_pages_include_theme_init_and_toggle(self):
        pages = [path for path in root_pages() if in_scope(path)]
        self.assertGreaterEqual(len(pages), 50)
        for path in pages:
            text = path.read_text(encoding='utf-8')
            with self.subTest(page=path.name):
                self.assertIn('theme-init.js', text)
                self.assertIn('class="theme-toggle"', text)
                self.assertLess(text.index('theme-init.js'), text.index('styles/main.css'))

    def test_coffee_projects_and_fixtures_stay_light(self):
        for path in root_pages():
            if path.name.startswith('coffee') or path.name in EXCLUDED:
                text = path.read_text(encoding='utf-8')
                with self.subTest(page=path.name):
                    self.assertNotIn('theme-init.js', text)
                    self.assertNotIn('theme-toggle', text)
        for path in (ROOT / 'projects').rglob('*.html'):
            text = path.read_text(encoding='utf-8', errors='replace')
            with self.subTest(page=str(path.relative_to(ROOT))):
                self.assertNotIn('theme-init.js', text)
                self.assertNotIn('theme-toggle', text)

    def test_dark_palette_and_photo_rule(self):
        css = (ROOT / 'styles/main.css').read_text(encoding='utf-8')
        start = css.index(':root[data-theme="dark"]')
        block = css[start:start + 700]
        for token in ['--paper:#121210', '--surface:#1c1c19', '--ink:#ecebe4', 'color-scheme:dark']:
            self.assertIn(token, block)
        self.assertIn(':root[data-theme="dark"]', css)
        self.assertNotIn('prefers-color-scheme:dark', css)
        self.assertNotIn('/scripts/theme.js', (ROOT / 'service-worker.js').read_text(encoding='utf-8'))
        self.assertIn('/scripts/theme-init.js', (ROOT / 'service-worker.js').read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
