const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {scoreTool}=require('../scripts/cognitive.js');
const html=fs.readFileSync('visual-design.html','utf8');
const records=[...html.matchAll(/<article class="tool-card" data-number="(\d+)"[^>]*>([\s\S]*?)<\/article>/g)].map(m=>({number:m[1],text:m[2].replace(/<[^>]+>/g,' '),model:(m[2].match(/<strong>(.*?)<\/strong>/)||[])[1]}));
const search=q=>records.map(r=>({...r,score:scoreTool(r,q)})).filter(r=>r.score>0).sort((a,b)=>b.score-a.score);
test('everyday problem descriptions retrieve useful starting points',()=>{
 assert.equal(search('事情太多，我总是拖延')[0].number,'012');
 assert.equal(search('几个选项让我选择困难')[0].number,'065');
 assert.equal(search('准备面试')[0].number,'033');
 assert.equal(search('学了就忘')[0].number,'008');
 assert.equal(search('我想跳槽')[0].number,'042');
});
test('model names, abbreviations and numbers remain searchable',()=>{
 assert.equal(search('费曼')[0].number,'002');
 assert.equal(search('STAR')[0].number,'033');
 assert.equal(search('065')[0].number,'065');
 assert.equal(search('第一性原理')[0].number,'025');
 assert.equal(search('逆向思维')[0].number,'023');
});
test('unmatched input does not turn into arbitrary results',()=>{
 assert.equal(search('xyzabc987').length,0);
 assert.equal(search('<script>alert(1)</script>').length,0);
});
