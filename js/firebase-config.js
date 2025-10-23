// firebase-config.js
// Cấu hình Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj8pL0mo2dB_yVrxtfQ0DoKdG80AZdwIA",
  authDomain: "danh-gia-3d2e4.firebaseapp.com",
  projectId: "danh-gia-3d2e4",
  storageBucket: "danh-gia-3d2e4.appspot.com",
  messagingSenderId: "264661635391",
  appId: "1:264661635391:web:45374d8d36767c0f39438a",
  measurementId: "G-TX0B4TLPP5"
};

// Khởi tạo Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
