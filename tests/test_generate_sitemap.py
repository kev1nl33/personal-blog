import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
BASE_URL = "https://aikevin.dpdns.org"


def entries(path):
    return [
        {child.tag.rsplit("}", 1)[-1]: child.text for child in url}
        for url in ET.parse(path).getroot()
    ]


def project_entries(items):
    return [item for item in items if urlsplit(item["loc"]).path.startswith("/projects/")]


class GenerateSitemapTests(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.addCleanup(self.folder.cleanup)
        self.root = Path(self.folder.name)
        for filename in ("index.html", "blog.html", "about.html", "weekly.html", "article.html", "404.html", "books.html", "article-backup-old.html"):
            (self.root / filename).write_text("<html></html>", encoding="utf-8")
        self.git("init", "-q")
        self.git("add", "--", "*.html")
        self.git("-c", "user.name=Sitemap Test", "-c", "user.email=sitemap@example.invalid", "-c", "commit.gpgsign=false", "commit", "-qm", "Add fixture pages")
        self.lastmod = self.git("log", "-1", "--format=%cs").strip()

    def git(self, *args):
        return subprocess.check_output(["git", *args], cwd=self.root, text=True)

    def run_script(self):
        return subprocess.run(
            [sys.executable, str(ROOT / "generate_sitemap.py")],
            cwd=self.root, capture_output=True, text=True,
        )

    def test_preserves_all_repository_projects_and_rebuilds_root_pages(self):
        sitemap = self.root / "sitemap.xml"
        sitemap.write_bytes((ROOT / "sitemap.xml").read_bytes())
        before = project_entries(entries(sitemap))
        self.assertGreaterEqual(len(before), 108)

        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        after = entries(sitemap)
        self.assertEqual(project_entries(after), before)
        roots = {item["loc"]: item for item in after if item not in project_entries(after)}
        self.assertEqual(set(roots), {
            f"{BASE_URL}/", f"{BASE_URL}/blog", f"{BASE_URL}/about",
            f"{BASE_URL}/weekly", f"{BASE_URL}/article",
        })
        self.assertEqual(roots[f"{BASE_URL}/"]["priority"], "1.0")
        self.assertEqual(roots[f"{BASE_URL}/blog"]["changefreq"], "daily")
        self.assertEqual(roots[f"{BASE_URL}/article"]["priority"], "0.7")
        self.assertTrue(all(item["lastmod"] == self.lastmod for item in roots.values()))
        first_run = sitemap.read_bytes()
        self.assertEqual(self.run_script().returncode, 0)
        self.assertEqual(sitemap.read_bytes(), first_run)

    def test_missing_sitemap_still_generates_root_pages(self):
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(entries(self.root / "sitemap.xml")), 5)

    def test_invalid_existing_sitemap_is_not_overwritten(self):
        sitemap = self.root / "sitemap.xml"
        original = b"<urlset><url><loc>https://aikevin.dpdns.org/projects/broken"
        sitemap.write_bytes(original)
        result = self.run_script()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(sitemap.read_bytes(), original)


if __name__ == "__main__":
    unittest.main()
