'use strict';
let db;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=d=>d?.split('-').reverse().join('/');
const numeric=n=>new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(n);
const range=r=>r.low===r.high?numeric(r.low):`${numeric(r.low)} đến ${numeric(r.high)}`;
const source=id=>db.sources.find(s=>s.id===id);
const period=d=>$('grain').value==='year'?d.slice(0,4):$('grain').value==='month'?d.slice(0,7):d;
const periodLabel=d=>d.length===4?d:d.length===7?d.slice(5,7)+'/'+d.slice(0,4):date(d);
const classify=r=>r.evidence.includes('AI')?'ai':r.evidence==='Chỉ tiêu đề'?'title':'direct';
function filtered(){return db.observations.filter(r=>r.date>=$('from').value&&r.date<=$('to').value&&(!$('session').value||r.session===$('session').value)&&(!$('metric').value||r.metric===$('metric').value)&&(!$('evidence').value||classify(r)===$('evidence').value)&&($('forecast').checked||r.kind!=='Dự báo'));}
function coverage(){
 const days=new Set(db.observations.map(r=>r.date)).size;
 const sourced=new Set(db.sources.map(s=>s.date.slice(0,7)));
 const extracted=new Set(db.observations.map(r=>r.date.slice(0,7)));
 const total=Math.round((Date.parse(db.end)-Date.parse(db.start))/86400000)+1;
 $('coverageText').textContent=`Đã tìm thấy ${db.sources.length} video, trích một phần ${days} ngày có số liệu trong ${total} ngày của khoảng khảo sát. Chưa có chuỗi giá tuyệt đối hoặc sản lượng vùng trồng đủ điều kiện vẽ. Dữ liệu thiếu được giữ trống.`;
 const stats=[[db.sources.length,'Video đã tìm thấy'],[days,'Ngày có bản ghi đã trích'],[extracted.size+'/34','Tháng có bản ghi đã trích'],[0,'Chuỗi giá tuyệt đối đã chuẩn hóa']];
 $('stats').innerHTML=stats.map(([v,l])=>`<article class="stat"><strong>${v}</strong><span>${l}</span></article>`).join('');
 $('calendar').innerHTML=[2024,2025,2026].map(y=>`<div class="calendar-year"><b>${y}</b>${Array.from({length:12},(_,i)=>{let m=y+'-'+String(i+1).padStart(2,'0'),future=m>db.end.slice(0,7);let state=extracted.has(m)?'filled':sourced.has(m)?'pending':'';return `<a href="#records" class="month ${state} ${future?'disabled':''}" data-month="${m}" title="${m}: ${future?'Ngoài khoảng khảo sát':state==='filled'?'Có bản ghi trích một phần':state==='pending'?'Đã tìm thấy video, chưa trích số':'Chưa có nguồn trong bộ dữ liệu'}">${String(i+1).padStart(2,'0')}</a>`}).join('')}</div>`).join('');
 document.querySelectorAll('[data-month]').forEach(el=>el.addEventListener('click',()=>{const m=el.dataset.month;const [y,mo]=m.split('-').map(Number);const last=new Date(Date.UTC(y,mo,0)).toISOString().slice(0,10);$('from').value=m+'-01';$('to').value=last>db.end?db.end:last;render();}));
 $('updated').textContent='Cập nhật bộ dữ liệu: '+date(db.updated);
}
function chartFor(rows,unit){
 const W=540,H=205,L=48,R=22,T=24,B=38;
 const start=Date.parse($('from').value),end=Date.parse($('to').value),duration=Math.max(86400000,end-start);
 const max=Math.max(...rows.map(r=>r.high),1)*1.2;
 const x=d=>L+(Date.parse(d)-start)/duration*(W-L-R),y=n=>T+(1-n/max)*(H-T-B);
 let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(rows[0].metric)} theo thời gian, ${esc(unit)}"><text x="${L}" y="12" fill="#6b786e" font-size="9">${esc(unit)}</text>`;
 for(let i=0;i<4;i++){let n=max*i/3,yy=y(n);svg+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="#e2e8db"/><text x="${L-8}" y="${yy+3}" text-anchor="end" fill="#7a887a" font-size="9">${numeric(n)}</text>`;}
 const ticks=Array.from({length:4},(_,i)=>new Date(start+duration*i/3).toISOString().slice(0,10));
 for(const d of ticks){svg+=`<text x="${x(d)}" y="${H-13}" text-anchor="middle" fill="#7a887a" font-size="9">${d.slice(5,7)}/${d.slice(0,4)}</text>`;}
 rows.forEach((r,i)=>{let xx=x(r.date);const same=rows.filter(a=>a.date===r.date);if(same.length>1)xx+=(same.indexOf(r)-(same.length-1)/2)*13;const f=r.kind==='Dự báo';const detail=`${date(r.date)} · ${r.region} · ${range(r)} ${unit} · ${r.kind}${r.forecastPeriod?' cho '+periodLabel(r.forecastPeriod):''} · ${r.evidence}`;svg+=`<g><title>${esc(detail)}</title><circle cx="${xx}" cy="${y(r.high)}" r="6" fill="${f?'#fff':'#346b50'}" stroke="${f?'#b1843c':'#346b50'}" stroke-width="2"/><text x="${xx}" y="${y(r.high)-13}" text-anchor="middle" fill="${f?'#946b29':'#205d46'}" font-size="10">${numeric(r.high)}${f?' (dự báo)':''}</text></g>`;});
 return svg+'</svg>';
}
function charts(rows){
 const prices=rows.filter(r=>r.metric==='Giá tuyệt đối'&&/kg/.test(r.unit));
 if(!prices.length){$('priceChart').innerHTML='<div class="empty"><b>Chưa đủ số để vẽ giá tuyệt đối</b><span>Các mức tăng/giảm hiện có chưa rõ đơn vị.<br>Không chuyển thành giá NDT/kg hoặc vẽ đường giá giả.</span></div>';}
 else {const groups=Object.groupBy(prices,r=>[r.region,r.origin,r.variety,r.grade,r.unit].join(' · '));$('priceChart').innerHTML=Object.entries(groups).map(([k,a])=>`<div class="chart-caption">${esc(k)}</div>${chartFor(a,a[0].unit)}`).join('');}
 const volumes=rows.filter(r=>r.metric!=='Thay đổi giá'&&r.metric!=='Giá tuyệt đối'&&r.unit.startsWith('Container'));
 if(!volumes.length){$('volumeChart').innerHTML='<div class="empty"><b>Chưa có lượng hàng phù hợp</b><span>Dữ liệu thiếu không phải số 0.</span></div>';return;}
 const groups=Object.groupBy(volumes,r=>r.metric+' · '+r.unit);
 $('volumeChart').innerHTML=Object.entries(groups).map(([k,a])=>`<div class="chart-caption"><b>${esc(k)}</b></div>${chartFor(a,a[0].unit)}`).join('')+'<div class="chart-key"><span>Mức được kênh nêu</span><span>Vòng rỗng: dự báo</span></div>';
}
function render(){
 const invalid=$('from').value>$('to').value;
 const rows=invalid?[]:filtered().sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
 $('count').textContent=rows.length+' bản ghi';
 $('rows').innerHTML=rows.map(r=>{let s=source(r.source);return `<tr><td><strong>${esc(periodLabel(period(r.date)))}</strong>${$('grain').value!=='day'?`<small>Ngày gốc: ${date(r.date)}</small>`:''}${r.forecastPeriod?`<small>Dự báo cho ${periodLabel(r.forecastPeriod)}</small>`:''}</td><td>${esc(r.session)}<small>${esc(r.region)}</small><small>${esc(r.origin)}</small></td><td>${esc(r.metric)}<small>${esc(r.grade)}</small></td><td><strong>${range(r)}</strong><small>${esc(r.unit)}</small></td><td><span class="badge ${r.kind==='Dự báo'?'amber':''}">${esc(r.kind)}</span><small>${esc(r.evidence)}</small></td><td>${esc(r.note)}<small lang="zh">${esc(r.quote)}</small><a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(r.source.toUpperCase())} · Mở video ↗</a></td></tr>`}).join('');
 $('noRows').hidden=rows.length>0;$('noRows').textContent=invalid?'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.':'Chưa có bản ghi phù hợp. Dữ liệu thiếu không được thay bằng số 0.';
 if(invalid){$('priceChart').innerHTML='';$('volumeChart').innerHTML='';}else charts(rows);
 $('notes').innerHTML=db.notes.filter(n=>n.date>=$('from').value&&n.date<=$('to').value).map(n=>`<article class="note"><time>${date(n.date)}</time><p>${esc(n.text)}</p><span class="badge">${esc(n.status)}</span> <a class="source-link" href="${source(n.source).url}" target="_blank" rel="noopener">Video ↗</a></article>`).join('')||'<p class="muted">Chưa có nhận định được trích trong khoảng này.</p>';
}
function sources(){
 $('sourceList').innerHTML=db.sources.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(s=>`<article class="source"><div class="source-top"><span>${s.id.toUpperCase()} · ${date(s.date)}</span><span class="badge ${s.status==='Một phần'?'amber':''}">${s.status}</span></div><h3><a href="${esc(s.url)}" target="_blank" rel="noopener" lang="zh">${esc(s.title)} ↗</a></h3><p>${esc(s.note)}</p></article>`).join('');
}
function downloadCSV(){
 const cols=['Ngày số liệu','Năm','Tháng','Nhóm bản tin','Địa điểm','Xuất xứ','Giống','Hạng','Chỉ tiêu','Thấp','Cao','Đơn vị gốc','Tính chất','Kỳ dự báo','Mức kiểm tra','Trích gốc','Ghi chú','URL video'];
 const all=filtered().map(r=>[r.date,r.date.slice(0,4),r.date.slice(0,7),r.session,r.region,r.origin,r.variety,r.grade,r.metric,r.low,r.high,r.unit,r.kind,r.forecastPeriod||'',r.evidence,r.quote,r.note,source(r.source).url]);
 const cell=v=>{let s=String(v??'');if(/^[=+@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 const blob=new Blob(['\ufeff'+[cols,...all].map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`quang-duren-${$('from').value}-${$('to').value}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
fetch('data.json').then(r=>{if(!r.ok)throw Error('data');return r.json()}).then(data=>{db=data;coverage();sources();render();for(const id of ['from','to','session','metric','evidence','grain','forecast'])$(id).addEventListener('change',render);$('csv').addEventListener('click',downloadCSV);$('print').addEventListener('click',()=>window.print());$('reset').addEventListener('click',()=>{$('from').value=db.start;$('to').value=db.end;for(const id of ['session','metric','evidence'])$(id).value='';$('grain').value='day';$('forecast').checked=false;render();});}).catch(()=>{$('error').hidden=false;});
