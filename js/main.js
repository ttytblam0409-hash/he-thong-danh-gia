import { staffMap, addTuDanhGia, addQuanLyDanhGia, addHoiDongDanhGia } from './data.js';
import { refreshStaffSelects, renderCards, scrollToElement } from './ui.js';

// DOM
const roleSelect = document.getElementById('roleSelect');
const loginStaff = document.getElementById('loginStaff');
const btnLogin = document.getElementById('btnLogin');

const formTu = document.getElementById('formTuDG');
const tdgPhong = document.getElementById('tdgPhong');
const tdgStaff = document.getElementById('tdgStaff');
const tdgCrit1 = document.getElementById('tdgCrit1');
const tdgCrit2 = document.getElementById('tdgCrit2');
const tdgCrit3 = document.getElementById('tdgCrit3');
const tdgFile = document.getElementById('tdgFile');
const btnSubmitTuDG = document.getElementById('btnSubmitTuDG');

const formQL = document.getElementById('formQuanLy');
const qlPhong = document.getElementById('qlPhong');
const qlStaff = document.getElementById('qlStaff');
const qlPoint = document.getElementById('qlPoint');
const qlNote = document.getElementById('qlNote');
const btnSubmitQL = document.getElementById('btnSubmitQL');

const formHD = document.getElementById('formHoiDong');
const hdStaff = document.getElementById('hdStaff');
const hdPoint = document.getElementById('hdPoint');
const hdRank = document.getElementById('hdRank');
const btnSubmitHD = document.getElementById('btnSubmitHD');

const filterDept = document.getElementById('filterDept');
const filterStaff = document.getElementById('filterStaff');
const btnRefresh = document.getElementById('btnRefresh');
const cards = document.getElementById('cards');

const barCtx = document.getElementById('barChart').getContext('2d');
const pieCtx = document.getElementById('pieChart').getContext('2d');

refreshStaffSelects(loginStaff, tdgStaff, tdgPhong, qlStaff, qlPhong, hdStaff, filterStaff, filterDept);

// Role UI toggle
function showRoleUI(role){
  formTu.style.display = role==='vienChuc' ? 'block' : 'none';
  formQL.style.display = role==='quanLy' ? 'block' : 'none';
  formHD.style.display = role==='hoiDong' ? 'block' : 'none';
}

// Login demo
btnLogin.addEventListener('click', ()=>{
  const role = roleSelect.value;
  const staffId = loginStaff.value;
  if(!staffId) return alert('Chọn viên chức để demo login');
  tdgStaff.value = staffId; qlStaff.value = staffId; hdStaff.value = staffId;
  showRoleUI(role);
  alert('Bạn đã đăng nhập demo với vai trò: ' + (role==='vienChuc'?'Viên chức':role==='quanLy'?'Quản lý':'Hội đồng'));
  scrollToElement(role==='vienChuc'?'formTuDG':role==='quanLy'?'formQuanLy':'formHoiDong');
});

// Submit tự đánh giá
btnSubmitTuDG.addEventListener('click', async ()=>{
  const vid = tdgStaff.value; if(!vid) return alert('Chọn viên chức');
  const rec = {
    vienChucId:vid,
    crit1:Number(tdgCrit1.value||0),
    crit2:Number(tdgCrit2.value||0),
    crit3:Number(tdgCrit3.value||0),
    file: tdgFile.files[0],
    createdAt: new Date().toISOString()
  };
  await addTuDanhGia(rec);
  renderCards(cards, filterDept, filterStaff, barCtx, pieCtx);
  alert('Gửi tự đánh giá thành công!');
});

// Submit quản lý
btnSubmitQL.addEventListener('click', async ()=>{
  const vid = qlStaff.value; if(!vid) return alert('Chọn viên chức');
  const rec = {vienChucId:vid, point:Number(qlPoint.value||0), note: qlNote.value||'', createdAt:new Date().toISOString()};
  await addQuanLyDanhGia(rec);
  renderCards(cards, filterDept, filterStaff, barCtx, pieCtx);
  alert('Cập nhật đánh giá quản lý thành công!');
});

// Submit hội đồng
btnSubmitHD.addEventListener('click', async ()=>{
  const vid = hdStaff.value; if(!vid) return alert('Chọn viên chức');
  const rec = {vienChucId:vid, point:Number(hdPoint.value||0), rank:hdRank.value, createdAt:new Date().toISOString()};
  await addHoiDongDanhGia(rec);
  renderCards(cards, filterDept, filterStaff, barCtx, pieCtx);
  alert('Lưu kết quả hội đồng thành công!');
});

// Filters
filterDept.addEventListener('change', ()=>renderCards(cards, filterDept, filterStaff, barCtx, pieCtx));
filterStaff.addEventListener('change', ()=>renderCards(cards, filterDept, filterStaff, barCtx, pieCtx));
btnRefresh.addEventListener('click', ()=>renderCards(cards, filterDept, filterStaff, barCtx, pieCtx));

// Initial render
renderCards(cards, filterDept, filterStaff, barCtx, pieCtx);
