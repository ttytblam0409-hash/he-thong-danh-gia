// storage.js
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-storage.js";
import { storage } from "./firebase-config.js";

/**
 * Upload file minh chứng
 * @param {File} file 
 * @param {string} staffId 
 * @returns {Promise<string>} URL file
 */
export async function uploadFile(file, staffId) {
  if (!file) return '';
  const timestamp = Date.now();
  const path = `tuDG/${staffId}_${timestamp}_${file.name}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
}
