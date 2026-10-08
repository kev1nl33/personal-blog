"""Protect the problem index and its existing destinations."""
import json
import unittest
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]


class CognitiveIndexTests(unittest.TestCase):
    def test_every_original_tool_is_available_without_javascript(self):
        soup = BeautifulSoup((ROOT / 'visual-design.html').read_text(), 'html.parser')
        cards = soup.select('.tool-card')
        original = json.loads((ROOT / 'data/cognitive-weapons.json').read_text())
        self.assertEqual(len(cards), len(original))
        self.assertEqual({card['data-number'] for card in cards}, {item['number'] for item in original})
        self.assertEqual({card.select_one('.tool-source')['href'] for card in cards}, {item['url'] for item in original})
        for card in cards:
            self.assertTrue(card.select_one('.tool-question').get_text(strip=True))
            self.assertTrue(card.select_one('.tool-outcome').get_text(strip=True))
            self.assertTrue(card.select_one('details .tool-action').get_text(strip=True))
            self.assertFalse(card.has_attr('hidden'))
            self.assertTrue((ROOT / card.select_one('.tool-source')['href']).is_file())

    def test_search_has_real_model_names_and_topics(self):
        soup = BeautifulSoup((ROOT / 'visual-design.html').read_text(), 'html.parser')
        topics = {button['data-topic'] for button in soup.select('[data-topic]')}
        for card in soup.select('.tool-card'):
            self.assertTrue(set(card['data-topics'].split()) <= topics)
        self.assertIn('费曼', soup.select_one('[data-number="002"]').get_text())
        self.assertIn('职业锚', soup.select_one('[data-number="042"]').get_text())
        self.assertIn('决策树', soup.select_one('[data-number="065"]').get_text())


if __name__ == '__main__':
    unittest.main()
