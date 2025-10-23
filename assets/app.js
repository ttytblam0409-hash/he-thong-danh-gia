// app.js

// Lấy tham chiếu form và canvas
const form = document.getElementById('vienChucForm');
const chartCanvas = document.getElementById('chartVienChuc');

// Hàm lưu dữ liệu viên chức vào Firestore và upload file
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const ten = document.getElementById('ten').value;
  const phongBan = document.getElementById('phongBan').value;
  const diem = Number(document.getElementById('diem').value);
  const file = document.getElementById('fileUpload').files[0];

  let fileURL = "";
  if(file){
    const storageRef = firebase.storage().ref('minh-chung/' + file.name);
    await storageRef.put(file);
    fileURL = await storageRef.getDownloadURL();
  }

  await firebase.firestore().collection('vienChuc').add({
    ten,
    phongBan,
    diem,
    fileURL,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Lưu dữ liệu thành công!");
  form.reset();
  loadChart();
});

// Hàm load dữ liệu và vẽ biểu đồ Chart.js
async function loadChart(){
  const snapshot = await firebase.firestore().collection('vienChuc').get();
  const data = {};

  snapshot.forEach(doc => {
    const item = doc.data();
    if(!data[item.phongBan]) data[item.phongBan] = [];
    data[item.phongBan].push(item.diem);
  });

  const labels = Object.keys(data);
  const diemTB = labels.map(phong => {
    const arr = data[phong];
    return arr.reduce((a,b)=>a+b,0)/arr.length;
  });

  // Xoá chart cũ nếu đã tồn tại
  if(window.myChart) window.myChart.destroy();

  window.myChart = new Chart(chartCanvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Điểm trung bình theo phòng ban',
        data: diemTB,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

// Load chart lần đầu
loadChart();
