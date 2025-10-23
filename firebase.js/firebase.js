// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js";

// Điền config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDj8pL0mo2dB_yVrxtfQ0DoKdG80AZdwIA",
  authDomain: "danh-gia-3d2e4.firebaseapp.com",
  projectId: "danh-gia-3d2e4",
  storageBucket: "danh-gia-3d2e4.firebasestorage.app",
  messagingSenderId: "264661635391",
  appId: "1:264661635391:web:45374d8d36767c0f39438a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// -------------------- Viên chức --------------------
export async function addVienChuc(data) {
  const id = `vienchuc_${Date.now()}`; // ID mới → không ghi đè
  await setDoc(doc(db, "vienChuc", id), data);
  return { id, ...data };
}

export async function getAllVienChuc() {
  const snapshot = await getDocs(collection(db, "vienChuc"));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// -------------------- Công việc --------------------
export async function addCongViec(data) {
  const id = `congviec_${Date.now()}`; // ID mới → không ghi đè
  await setDoc(doc(db, "congViec", id), data);
  return { id, ...data };
}

export async function getAllCongViec() {
  const snapshot = await getDocs(collection(db, "congViec"));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// -------------------- Upload file --------------------
export async function uploadFile(file, folder = 'files') {
  const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}
