import re
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def root_catchall(text):
    """Return a redirect or function route that would answer every missing path."""
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        source = stripped.split()[0]
        if source in {"/*", "/:splat", "/:path*", "/*path"}:
            return source
    return None


def function_routes(functions_dir):
    routes = []
    if not functions_dir.is_dir():
        return routes
    for path in functions_dir.rglob("*.js"):
        relative = path.relative_to(functions_dir)
        if any(part.startswith("_") or part.startswith(".") for part in relative.parts):
            continue
        segments = []
        for part in relative.with_suffix("").parts:
            if part.startswith("[[") and part.endswith("]]"):
                segments.append("*")
            elif part.startswith("[") and part.endswith("]"):
                segments.append("*")
            else:
                segments.append(part)
        routes.append("/" + "/".join(segments))
    return routes


def catches_unknown_html(routes):
    for route in routes:
        if route in {"/*", "/*/*"}:
            return route
        if re.fullmatch(r"/\*(\.html)?", route):
            return route
    return None


class NotFoundRoutingTests(unittest.TestCase):
    def test_custom_404_exists_and_nothing_swallows_it(self):
        page = ROOT / "404.html"
        self.assertTrue(page.is_file(), "404.html must exist so Cloudflare Pages can serve it")
        self.assertIn("页面不存在", page.read_text(encoding="utf-8"))

        redirects = (ROOT / "_redirects").read_text(encoding="utf-8")
        self.assertIsNone(root_catchall(redirects), "_redirects has a root catch-all")

        swallowed_by = catches_unknown_html(function_routes(ROOT / "functions"))
        self.assertIsNone(swallowed_by, f"{swallowed_by} would answer unknown pages before 404.html")


def sitemap_problems(sitemap_path, site_root):
    tree = ET.parse(sitemap_path)
    problems = []
    for loc in tree.findall(".//sm:loc", SITEMAP_NS):
        url = (loc.text or "").strip()
        path = url.split("://", 1)[-1].split("/", 1)[-1].split("#", 1)[0].split("?", 1)[0]
        path = unquote(path)
        if path.endswith(".html") or ".html" in url:
            problems.append(f"{url} contains .html")
            continue
        filename = "index.html" if path in {"", "/"} else f"{path}.html"
        if filename == "404.html" or path.rstrip("/") == "404":
            problems.append(f"{url} includes the 404 page")
            continue
        if not (site_root / filename).is_file():
            problems.append(f"{url} has no file {filename}")
    return problems


class SitemapTests(unittest.TestCase):
    def test_committed_sitemap_matches_real_pages(self):
        self.assertEqual(sitemap_problems(ROOT / "sitemap.xml", ROOT), [])

    def test_percent_encoded_spaces_match_real_page(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            page = root / "projects/108 Cognitive Weapons/001_The Learning Pyramid.html"
            page.parent.mkdir(parents=True)
            page.write_text("<html></html>", encoding="utf-8")
            sitemap = root / "sitemap.xml"
            sitemap.write_text(
                """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://aikevin.dpdns.org/projects/108%20Cognitive%20Weapons/001_The%20Learning%20Pyramid</loc></url>
</urlset>
""",
                encoding="utf-8",
            )
            self.assertEqual(sitemap_problems(sitemap, root), [])

    def test_html_extension_and_missing_page_are_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / "index.html").write_text("<html></html>", encoding="utf-8")
            sitemap = root / "sitemap.xml"
            sitemap.write_text(
                """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://aikevin.dpdns.org/index.html</loc></url>
  <url><loc>https://aikevin.dpdns.org/missing</loc></url>
  <url><loc>https://aikevin.dpdns.org/404</loc></url>
</urlset>
""",
                encoding="utf-8",
            )
            problems = sitemap_problems(sitemap, root)
            self.assertTrue(any(".html" in item for item in problems))
            self.assertTrue(any("missing" in item for item in problems))
            self.assertTrue(any("404" in item for item in problems))


if __name__ == "__main__":
    unittest.main()
