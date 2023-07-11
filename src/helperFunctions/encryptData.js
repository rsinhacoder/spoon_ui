import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export const encryptDatas = (keyName, data) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  localStorage.setItem(keyName, encrypted);
};

export const decryptDatas = (keyName) => {
  if (localStorage.getItem(keyName) !== null) {
    const encrypted = localStorage.getItem(keyName);
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(decrypted);
  }
};
