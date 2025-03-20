const CryptoJS = require("crypto-js");

// ████████████████████████████████████████████████████████████████
// ██                                                            ██
// ██  🔒 ماذا تفعل هنا يا عبقري؟                              ██
// ██  📜 هذه الأكواد ليست لك ولا يمكنك استخدامها!              ██
// ██  🕵️‍♂️ هل تعتقد أنك ذكي؟ فكر مجددًا 🤡                      ██
// ██                                                            ██
// ██  🚪 غادر فورًا وركز على شغلك بدل التطفل.                 ██
// ██                                                            ██
// ████████████████████████████████████████████████████████████████

const secretKey =
  "a3f5d6e84f9e44fbcf3c8e3cbd2e3f7f12d7f6323b2a9f0eeb4e3a9f8cde6f8f4"; // 🤣😁😎🫣🫢

function encrypt(text) {
  try {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
}

function decrypt(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

export { encrypt, decrypt };
