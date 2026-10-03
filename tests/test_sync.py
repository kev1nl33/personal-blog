import json
import os
import shutil
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch
import sync_notion as sync
from site_builder import ROOT, commit_outputs

class SyncTests(unittest.TestCase):
    def test_pagination_and_successful_empty_are_distinct(self):
        first=Mock();first.json.return_value={'results':[{'id':'one'}],'has_more':True,'next_cursor':'next'}
        second=Mock();second.json.return_value={'results':[],'has_more':False}
        with patch.object(sync,'NOTION_TOKEN','test'),patch.object(sync.requests,'post',side_effect=[first,second]) as post:
            self.assertEqual(sync.notion_query('https://api.notion.com/test',{}),[{'id':'one'}])
            self.assertEqual(post.call_args.kwargs['json']['start_cursor'],'next')
            self.assertEqual(post.call_args.kwargs['timeout'],30)

    def test_unsafe_link_and_code_are_escaped(self):
        fragment=sync.rich_text_to_html([{'plain_text':'<hello>','href':'javascript:alert(1)','annotations':{}}])
        self.assertEqual(fragment,'<a href="#">&lt;hello&gt;</a>')
        code=sync.block_to_html({'type':'code','code':{'rich_text':[{'plain_text':'</code><script>bad</script>'}]}})
        self.assertNotIn('<script>',code)

    def test_missing_credentials_do_not_touch_outputs(self):
        with patch.object(sync,'NOTION_TOKEN',''):
            with self.assertRaises(RuntimeError): sync.sync_all()

    def test_module_failure_rolls_back_entire_sync(self):
        previous=Path.cwd()
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);(root/'data').mkdir();(root/'index.html').write_text('original')
            (root/'data/articles.json').write_text('[]')
            def changed_blog():
                Path('index.html').write_text('<!DOCTYPE html><html>changed</html>')
                return True
            try:
                os.chdir(root)
                with patch.object(sync,'NOTION_TOKEN','test'),patch.object(sync,'DATABASE_ID','test'),patch.object(sync,'main',changed_blog),patch.object(sync,'sync_coffee_beans',new=lambda:False):
                    with self.assertRaises(RuntimeError):sync.sync_all()
                self.assertEqual((root/'index.html').read_text(),'original')
            finally: os.chdir(previous)

    def test_commit_failure_restores_replaced_files(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);(root/'a.html').write_text('old-a');(root/'b.html').write_text('old-b')
            real_replace=os.replace
            def fail_second(source,target):
                if Path(target).name=='b.html':raise OSError('simulated disk failure')
                real_replace(source,target)
            with patch('site_builder.os.replace',side_effect=fail_second):
                with self.assertRaises(OSError):commit_outputs({'a.html':'<!DOCTYPE html><html>new</html>','b.html':'<!DOCTYPE html><html>new</html>'},root)
            self.assertEqual((root/'a.html').read_text(),'old-a')
            self.assertEqual((root/'b.html').read_text(),'old-b')

    def test_all_coffee_replacements_handle_successful_empty(self):
        previous=Path.cwd()
        with tempfile.TemporaryDirectory() as folder:
            for name in ['coffee-beans.html','coffee-shops.html','coffee-notes.html']:
                shutil.copy2(ROOT/name,Path(folder)/name)
            try:
                os.chdir(folder)
                self.assertTrue(sync.update_coffee_beans_html([]))
                self.assertTrue(sync.update_coffee_shops_html([]))
                self.assertTrue(sync.update_coffee_notes_html([]))
            finally:os.chdir(previous)

if __name__=='__main__':unittest.main()
