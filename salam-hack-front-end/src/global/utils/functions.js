import { encrypt, decrypt } from "./crypto/offlineCrypto";

function logThemeToLocalStorage(theme) {
  try {
    const encryptedData = encrypt(theme);

    if (encryptedData) {
      localStorage.setItem("_s", encryptedData);
      return true;
    } else return false;
  } catch (error) {
    console.error("Error logging data to local storage:", error);
    return false;
  }
}

function getThemeFromLocalStorage() {
  try {
    // dark default theme is light.
    const encryptedData = localStorage.getItem("_s");

    if (encryptedData) {
      const decryptedData = decrypt(encryptedData);

      if (["light", "dark"].includes(decryptedData)) return decryptedData;
    }

    return "light";
  } catch (error) {
    console.error("Error retrieving data from local storage:", error);
    return "light";
  }
}

function logPageDetails(key, obj) {
  try {
    const currentDetails = getPageDetails() || {};

    const updatedDetails = {
      ...currentDetails,
      [key]: obj,
    };

    const encryptedData = encrypt(JSON.stringify(updatedDetails));

    if (encryptedData) {
      sessionStorage.setItem("_pd", encryptedData);
    }
  } catch (error) {
    console.error("Error logging data to session storage:", error);
  }
}

function getPageDetails() {
  try {
    const encryptedData = sessionStorage.getItem("_pd");

    if (encryptedData) {
      const decryptedData = decrypt(encryptedData);

      return JSON.parse(decryptedData) || null;
    }
  } catch (error) {
    console.error("Error retrieving data from local storage:", error);
    return null;
  }

  return null;
}

function onChangeHandler(field, newValue, state) {
  state((prevState) => ({
    ...prevState,
    [field]: newValue,
  }));
}

function isValidProfileImageExtension(file) {
  const allowedExtensions = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  return allowedExtensions.includes(file.type);
}

function isValidPDFExtension(file) {
  return file.type === "application/pdf";
}

function getFileExtension(fileName) {
  const extension = fileName.split(".").pop();
  return extension;
}

function generateUniqueFileName(userId, file) {
  const now = new Date();
  const dateString = now.toISOString().replace(/[^\w\s]/gi, "_");
  const fileExtension = getFileExtension(file.name);
  return `${userId}_${dateString}.${fileExtension}`;
}

export {
  logThemeToLocalStorage,
  getThemeFromLocalStorage,
  logPageDetails,
  getPageDetails,
  isValidProfileImageExtension,
  isValidPDFExtension,
  onChangeHandler,
  generateUniqueFileName,
};
