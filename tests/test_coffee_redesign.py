import unittest
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]


class CoffeeRedesignTests(unittest.TestCase):
    def test_content_and_relationships_work_without_tabs(self):
        soup = BeautifulSoup((ROOT / 'coffee.html').read_text(), 'html.parser')
        self.assertEqual(len(soup.select('.brew-entry')), 3)
        self.assertEqual(len(soup.select('.gear-card')), 5)
        self.assertEqual(len(soup.select('.bean-file')), 2)
        self.assertEqual(len(soup.select('.cafe-note')), 1)
        self.assertFalse(soup.select('[role="tab"], .tab-content, [data-coffee-tab]'))
        for link in soup.select('main a[href^="#"]'):
            self.assertIsNotNone(soup.find(id=link['href'][1:]), link['href'])
        for entry in soup.select('.brew-entry'):
            self.assertTrue(entry.select('a[href^="#bean-"]'))
            for link in entry.select('a[href^="#bean-"]'):
                target = soup.find(id=link['href'][1:])
                self.assertIsNotNone(target.select_one(f'a[href="#{entry["id"]}"]'))
        self.assertTrue(all(dd.get_text(strip=True) for dd in soup.select('dd')))
        self.assertEqual(len(soup.select('.gear-card details > summary')), 4)

    def test_redirects_and_sitemap_exclude_old_lists(self):
        redirects = (ROOT / '_redirects').read_text().splitlines()
        sitemap = (ROOT / 'sitemap.xml').read_text()
        for name, anchor in [('beans', 'beans'), ('notes', 'notes'), ('shops', 'cafes'), ('equipment', 'equipment')]:
            for extension in ['', '.html']:
                self.assertIn(f'/coffee-{name}{extension} /coffee#{anchor} 301', redirects)
            self.assertNotIn(f'<loc>https://aikevin.dpdns.org/coffee-{name}</loc>', sitemap)

    def test_details_keep_body_and_return_to_main(self):
        import subprocess
        for key in ['kd310gb', 'brikka', 'scale', 'heater']:
            name = f'coffee-equipment-{key}.html'
            soup = BeautifulSoup((ROOT / name).read_text(), 'html.parser')
            original = BeautifulSoup(subprocess.check_output(['git', 'show', f'73b3578:{name}'], cwd=ROOT, text=True), 'html.parser')
            self.assertTrue(soup.title.string.endswith(' - 咖啡角 | 计划李'))
            self.assertFalse(soup.select('a[href="coffee-equipment.html"]'))
            self.assertTrue(soup.select('a[href="coffee.html#equipment"]'))
            self.assertEqual(soup.select_one('.prose').get_text(), original.select_one('.prose').get_text())
