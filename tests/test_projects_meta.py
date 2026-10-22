"""Every projects/ page must ship complete, consistent metadata."""
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

from scripts.audit_projects_meta import (
    _visible_text,
    audit_page,
    canonical_url,
    project_pages,
    quote_balance_problems,
    sitemap_locs,
)

ROOT = Path(__file__).resolve().parents[1]


class ProjectMetaTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = project_pages(ROOT)

    def test_repository_contains_the_real_project_page_count(self):
        self.assertEqual(len(self.pages), 108)

    def test_every_project_page_has_complete_metadata(self):
        problems = []
        for page in self.pages:
            problems.extend(audit_page(page, ROOT))
        self.assertEqual(problems, [], '\n'.join(problems[:30]))

    def test_sitemap_lists_each_project_page_at_its_canonical_url(self):
        locs = sitemap_locs(ROOT / 'sitemap.xml')
        missing = []
        for page in self.pages:
            url = canonical_url(page, ROOT)
            if url not in locs:
                missing.append(url)
        self.assertEqual(missing, [])

    def test_sitemap_stays_well_formed(self):
        root = ET.parse(ROOT / 'sitemap.xml').getroot()
        self.assertTrue(root.tag.endswith('urlset'))

    def test_visible_text_strips_only_a_wrapping_quote_pair(self):
        # “…” 包裹的整句引言要剥；句中成对的引号不是包裹，必须原样保留。
        self.assertEqual(_visible_text('“你不是迷茫”'), '你不是迷茫')
        self.assertEqual(_visible_text('"Not low skill"'), 'Not low skill')
        self.assertEqual(_visible_text('35岁的“高薪穷人”'), '35岁的“高薪穷人”')
        self.assertEqual(_visible_text('“好学生”的困局'), '“好学生”的困局')
        # 不成对的单侧引号不能再被削掉。
        self.assertEqual(_visible_text('35岁的“高薪穷人'), '35岁的“高薪穷人')
        self.assertEqual(_visible_text('好学生”的困局'), '好学生”的困局')

    def test_metadata_quotes_must_come_in_pairs(self):
        problems = []
        for page in self.pages:
            problems.extend(quote_balance_problems(page, ROOT))
        self.assertEqual(problems, [], '\n'.join(problems[:30]))


if __name__ == '__main__':
    unittest.main()
