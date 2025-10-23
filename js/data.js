import { db, storage } from './firebase.js';
import { collection, addDoc, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-storage.js";

// Demo staff map
export const staffMap = new Map([
  ['s1',{ten:'Nguyễn Văn A',phong:'KH-NV'}],
  ['s2',{ten:'Trần Thị B',phong:'Hành chính'}],
  ['s3',{ten:'Lê Văn C',phong:'Kế toán'}]
]);

export let tuDanhGia = [];    // {id, vienChucId, crit1, crit2, crit3, fileURL, createdAt}
export let quanLyDanhGia = [];
export let hoiDongDanhGia = [];

// Firestore collections
const tuCol = collection(db, 'tuDanhGia');
const qlCol = collection(db, 'quanLyDanhGia');
const hdCol = collection(db, 'hoiDongDanhGia');

// Upload file to Firebase Storage
export async function uploadFile(file, path){
  if(!file) return '';
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

// Add tự đánh giá
export async function addTuDanhGia(rec){
  // Upload file nếu có
  if(rec.file){
    rec.fileURL = await uploadFile(rec.file, `tuDG/${rec.vienChucId}/${rec.file.name}`);
    delete rec.file;
  }
  const docRef = await addDoc(tuCol, rec);
  rec.id = docRef.id;
  tuDanhGia.push(rec);
}

// Add quản lý đánh giá
export async function addQuanLyDanhGia(rec){
  const docRef = await addDoc(qlCol, rec);
  rec.id = docRef.id;
  quanLyDanhGia.push(rec);
}

// Add hội đồng đánh giá
export async function addHoiDongDanhGia(rec){
  const docRef = await addDoc(hdCol, rec);
  rec.id = docRef.id;
  hoiDongDanhGia.push(rec);
}

// Load all data from Firestore (demo)
export async function loadData(){
  const tuSnap = await getDocs(tuCol);
  tuSnap.forEach(d=>tuDanhGia.push({...d.data(), id:d.id}));
  
  const qlSnap = await getDocs(qlCol);
  qlSnap.forEach(d=>quanLyDanhGia.push({...d.data(), id:d.id}));
  
  const hdSnap = await getDocs(hdCol);
  hdSnap.forEach(d=>hoiDongDanhGia.push({...d.data(), id:d.id}));
}
