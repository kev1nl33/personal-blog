const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const data=JSON.parse(fs.readFileSync('data/memoir.json','utf8'));
const photos=data.photos;
const gallery=fs.readFileSync('gallery.html','utf8');
/* 每个心情展示全部命中照片（不再截断），和 scripts/memoir-cutout.js 的 pickFrames 保持一致。 */
const pool=mood=>photos.filter(photo=>photo.keywords.some(keyword=>mood.keywords.includes(keyword)));
const count=(mood,within=photos)=>pool(mood).filter(photo=>within.includes(photo)).length;

test('every mood maps onto keywords that already exist on photos',()=>{
 const known=new Set(photos.flatMap(photo=>photo.keywords));
 assert.equal(data.moods.length,5);
 for(const mood of data.moods){
  assert.ok(Array.isArray(mood.keywords)&&mood.keywords.length>0,`${mood.word} has no keywords`);
  for(const keyword of mood.keywords) assert.ok(known.has(keyword),`${mood.word} uses unknown keyword ${keyword}`);
  assert.equal(typeof mood.note,'string');
 }
});

test('every photo carries an optional note string',()=>{
 for(const photo of photos) assert.equal(typeof photo.note,'string',`${photo.src} is missing note`);
});

test('moods split the archive into distinct, non-empty sets',()=>{
 const counts=data.moods.map(mood=>count(mood));
 assert.equal(new Set(counts).size,data.moods.length,`counts repeat: ${counts}`);
 for(const n of counts) assert.ok(n>=3,`a mood only has ${n} photos`);
});

test('every photo is reachable from at least one mood',()=>{
 for(const photo of photos){
  const reachable=data.moods.some(mood=>photo.keywords.some(keyword=>mood.keywords.includes(keyword)));
  assert.ok(reachable,`${photo.title} belongs to no mood`);
 }
});

test('keyword filters keep mood counts different from each other',()=>{
 const tags=[...new Set(photos.flatMap(photo=>photo.keywords))];
 for(const tag of tags){
  const within=photos.filter(photo=>photo.keywords.includes(tag));
  const counts=data.moods.map(mood=>count(mood,within));
  assert.ok(new Set(counts).size>1,`${tag} gives every mood ${counts[0]} photos`);
 }
});

test('static fallback keeps its journal links',()=>{
 const list=gallery.match(/<section class="memoir-fallback"[\s\S]*?<\/section>/);
 assert.ok(list,'fallback section is gone');
 const links=[...list[0].matchAll(/<a href="(travel-[^"#]+\.html#[^"]+)"/g)].map(m=>m[1]);
 assert.equal(links.length,photos.length);
 for(const photo of photos) assert.ok(links.includes(photo.journal),`fallback is missing ${photo.journal}`);
});
