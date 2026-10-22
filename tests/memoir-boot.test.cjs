const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const gallery=fs.readFileSync('gallery.html','utf8');
const boot=gallery.match(/<script>([\s\S]*?)<\/script>/)[1];

function startBoot() {
 const classes=new Set();
 const warnings=[];
 const window=new EventTarget();
 const document={documentElement:{classList:{
  add:name=>classes.add(name),
  remove:name=>classes.delete(name),
  contains:name=>classes.has(name)
 }}};
 vm.runInNewContext(boot,{
  window,document,Date,
  setTimeout:()=>1,
  console:{warn:(...args)=>warnings.push(args)}
 });
 return {window,classes,warnings};
}

test('a rejected loading Promise releases the memoir boot fallback and warns',async()=>{
 const {window,classes,warnings}=startBoot();
 const reason=new Error('Memoir image loading failed');
 assert.ok(classes.has('memoir-pending'));
 // Node 没有浏览器的 PromiseRejectionEvent，将真实拒绝的原因转交给 window 事件。
 await Promise.reject(reason).catch(error=>{
  const event=new Event('unhandledrejection',{cancelable:true});
  event.reason=error;
  window.dispatchEvent(event);
 });
 assert.equal(classes.has('memoir-pending'),false,'rejected Promise must release the static fallback');
 assert.equal(warnings.length,1);
 assert.match(warnings[0][0],/回忆录.*静态/);
 assert.equal(warnings[0][1],reason);
});

for (const type of ['error','unhandledrejection']) {
 for (const completion of ['ready','fallback']) {
  test(`${type} keeps default reporting after memoir boot ${completion}`,()=>{
   const {window,classes,warnings}=startBoot();
   if (completion==='ready') classes.delete('memoir-pending');
   else window.memoirReleaseBoot();
   let releases=0;
   classes.delete=()=>{ releases++; return false; };
   const event=new Event(type,{cancelable:true});
   event.message='Later script error';
   event.reason=new Error('Later Promise rejection');
   window.dispatchEvent(event);
   assert.equal(event.defaultPrevented,false);
   assert.equal(warnings.length,0);
   assert.equal(releases,0,'completed boot must not release the fallback again');
  });
 }
}

test('synchronous script errors still release the memoir boot fallback',()=>{
 const {window,classes}=startBoot();
 const event=new Event('error');
 event.message='Memoir initialization failed';
 window.dispatchEvent(event);
 assert.equal(classes.has('memoir-pending'),false);
});
