"""Every projects/ page must ship complete, consistent metadata."""
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

from scripts.audit_projects_meta import (
    audit_page,
    canonical_url,
    project_pages,
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


if __name__ == '__main__':
    unittest.main()
