import { staffMap, tuDanhGia, quanLyDanhGia, hoiDongDanhGia } from './data.js';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js';

export function scrollToElement(id){
  document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
}

// Render staff selects
export function refreshStaffSelects(loginStaff, tdgStaff, tdgPhong, qlStaff, qlPhong, hdStaff, filterStaff, filterDept){
  loginStaff.innerHTML='';
  tdgStaff.innerHTML='<option value="">--Chọn--</option>'; tdgPhong.innerHTML='<option value="">--Chọn--</option>';
  qlStaff.innerHTML='<option value="">--Chọn--</option>'; qlPhong.innerHTML='<option value="">--Chọn--</option>';
  hdStaff.innerHTML='';
  filterStaff.innerHTML='<option value="">Tất cả</option>'; filterDept.innerHTML='<option value="">Tất cả</option>';
  
  staffMap.forEach((s,id)=>{
    const opt = document.createElement('option'); opt.value=id; opt.textContent = s.ten + ' — ' + s.phong;
    loginStaff.appendChild(opt);
    tdgStaff.appendChild(opt.cloneNode(true));
    qlStaff.appendChild(opt.cloneNode(true));
    hdStaff.appendChild(opt.cloneNode(true));
    filterStaff.appendChild(opt.cloneNode(true));
  });

  // Depts
  const depts = new Set(); staffMap.forEach(s=>depts.add(s.phong));
  depts.forEach(d=>{
    const o = document.createElement('option'); o.value=d; o.textContent=d;
    tdgPhong.appendChild(o.cloneNode(true));
    qlPhong.appendChild(o.cloneNode(true));
    filterDept.appendChild(o.cloneNode(true));
  });
}

// Compute scores
export function computeScoresFor(vienChucId){
  const tu = tuDanhGia.filter(t=>t.vienChucId===vienChucId).slice(-1)[0] || null;
  const ql = quanLyDanhGia.filter(q=>q.vienChucId===vienChucId).slice(-1)[0] || null;
  const hd = hoiDongDanhGia.filter(h=>h.vienChucId===vienChucId).slice(-1)[0] || null;
  const tuAvg = tu ? Math.round(((tu.crit1||0)+(tu.crit2||0)+(tu.crit3||0))/3) : null;
  const qlPoint = ql ? ql.point : null;
  const hdPoint = hd ? hd.point : null;
  const arr = []; if (tuAvg!==null) arr.push(tuAvg); if(qlPoint!==null) arr.push(qlPoint); if(hdPoint!==null) arr.push(hdPoint);
  const finalAvg = arr.length? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : null;
  const rank = hd ? hd.rank : (finalAvg>=85?'A':finalAvg>=70?'B':finalAvg>=50?'C':'D');
  return {tu, ql, hd, tuAvg, qlPoint, hdPoint, finalAvg, rank};
}

// Render cards and charts
export function renderCards(cards, filterDept, filterStaff, barCtx, pieCtx){
  cards.innerHTML='';
  const byDept = {}; const rankCount = {A:0,B:0,C:0,D:0, unknown:0};
  staffMap.forEach((s,id)=>{
    const sc = computeScoresFor(id);
    if (!byDept[s.phong]) byDept[s.phong]=[];
    if (sc.finalAvg!==null) byDept[s.phong].push(sc.finalAvg);
    const r = sc.rank || 'unknown'; rankCount[r] = (rankCount[r]||0)+1;

    if(filterDept.value && s.phong!==filterDept.value) return;
    if(filterStaff.value && id!==filterStaff.value) return;

    const card = document.createElement('div');
    card.className = 'task-card ' + (sc.finalAvg===null? '': (sc.finalAvg<50?'status-red': sc.finalAvg>=80?'status-green':'status-yellow'));
    card.innerHTML = `
      <div class="task-title">${s.ten}</div>
      <div class="muted">${s.phong}</div>
      <div style="margin-top:8px">Tự đánh giá: ${sc.tuAvg!==null?sc.tuAvg+'': '—'}</div>
      <div>Quản lý: ${sc.qlPoint!==null?sc.qlPoint+'': '—'}</div>
      <div>Hội đồng: ${sc.hdPoint!==null?sc.hdPoint+'': '—'}</div>
      <div style="margin-top:8px;font-weight:600">Kết quả: ${sc.finalAvg!==null?sc.finalAvg+'': '—'} — ${sc.rank||'—'}</div>
    `;
    cards.appendChild(card);
  });

  // Charts
  const labels = Object.keys(byDept);
  const avgs = labels.map(l=> Math.round((byDept[l].reduce((a,b)=>a+b,0)/byDept[l].length)||0));

  window.barChart?.destroy();
  window.barChart = new Chart(barCtx, {type:'bar', data:{labels, datasets:[{label:'Điểm TB theo phòng', data:avgs, backgroundColor:'#1976d2'}]}, options:{responsive:true, scales:{y:{beginAtZero:true, max:100}}}});

  window.pieChart?.destroy();
  window.pieChart = new Chart(pieCtx, {type:'pie', data:{labels:['A','B','C','D'], datasets:[{data:[rankCount.A, rankCount.B, rankCount.C, rankCount.D], backgroundColor:['#16a34a','#60a5fa','#f59e0b','#ef4444']}]}});
}
