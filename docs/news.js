'use strict';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let db;
const vn=d=>d.split('-').reverse().join('/');
const missing=s=>!s||/^(—|Chưa|Không dùng)/.test(s);
function body(s){
 const volume=s.rows.some(r=>!missing(r.volume));
 return '<div class="story-body"><div class="table-wrap"><table class="'+(volume?'with-volume':'price-only')+'"><thead><tr><th>Thị trường</th>'+(volume?'<th>Lượng hàng</th>':'')+'<th>'+esc(s.priceHeading||'Giá bán')+'</th><th>Diễn biến</th></tr></thead><tbody>'+s.rows.map(r=>'<tr><td>'+esc(r.market)+'<small>'+esc(r.asOf)+'</small></td>'+(volume?'<td>'+esc(r.volume||'—')+'</td>':'')+'<td class="price-cell">'+esc(r.price||'—')+'</td><td>'+esc(r.sales||'—')+'</td></tr>').join('')+'</tbody></table></div><div class="takeaway"><b>GÓC NHÌN</b><span>'+esc(s.takeaway)+'</span></div>'+(s.editorNote?'<p class="editor-note">'+esc(s.editorNote)+'</p>':'')+'<div class="actions"><button data-copy="'+esc(s.id)+'">Sao chép bản tin</button><span role="status" id="copy-'+esc(s.id)+'"></span></div></div>';
}
function plain(s){return 'QUANG DUREN NEWS · '+vn(s.date)+' · '+s.label+'\n'+s.headline+'\n\n'+s.summary+'\n\n'+s.rows.map(r=>r.market+' ('+r.asOf+'): '+(!missing(r.volume)?r.volume+' | ':'')+r.price+' | '+r.sales).join('\n')+'\n\nGóc nhìn: '+s.takeaway+(s.editorNote?'\n'+s.editorNote:'')+'\n\nQuang Duren · Tổng hợp từ Internet';}
function render(){
 const stories=[...db.stories].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)),s=stories[0];if(!s)throw Error('Empty');
 $('latestDate').textContent=vn(s.date);$('update').textContent=vn(s.date)+' · Bản tin '+s.label.toLowerCase();
 $('latest').innerHTML='<article class="bulletin"><div class="story-top"><div class="stamp"><span>THỊ TRƯỜNG · '+vn(s.date)+'</span><span class="pill">'+esc(s.tag||'ĐIỂM TIN')+'</span></div><h2>'+esc(s.headline)+'</h2><p>'+esc(s.summary)+'</p></div>'+body(s)+'</article>';
 const older=stories.slice(1).filter(x=>!$('day').value||x.date===$('day').value);
 $('older').innerHTML=older.map(x=>'<details><summary><small>'+vn(x.date)+' · '+esc(x.label)+'</small><strong>'+esc(x.headline)+'</strong></summary><p class="archive-lead">'+esc(x.summary)+'</p>'+body(x)+'</details>').join('')||'<p class="empty">Chưa có bản tin cho ngày đã chọn.</p>';
 document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const story=stories.find(x=>x.id===b.dataset.copy);try{await navigator.clipboard.writeText(plain(story));$('copy-'+story.id).textContent='Đã sao chép';}catch{$('copy-'+story.id).textContent='Chưa sao chép được. Vui lòng thử lại.';}}));
}
async function load(){const b=$('refresh');b.disabled=true;try{const r=await fetch('news.json',{cache:'no-store'});if(!r.ok)throw Error('Fetch');const next=await r.json();if(!Array.isArray(next.stories))throw Error('Schema');db=next;render();$('error').hidden=true;}catch{$('error').hidden=false;if(!db)$('update').textContent='Chưa tải được bản tin';}finally{b.disabled=false;}}
$('refresh').addEventListener('click',load);$('day').addEventListener('change',()=>db&&render());$('clear').addEventListener('click',()=>{$('day').value='';if(db)render();});load();
