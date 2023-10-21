const CryptoJSScript = document.createElement("script");
CryptoJSScript.src = "../../crypto-js.min.js";
document.head.appendChild(CryptoJSScript);

chrome.storage.local.set({ key: "password" }, function () {});

function decryptData(encryptedData, key) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  const decryptedData = JSON.parse(decryptedText);
  return decryptedData;
}
function togglePasswordVisibility() {
  var passwordInput = document.getElementById("password");
  var eyeIcon = document.getElementById("eyeIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}

function encryptData(data, key) {
  const textToEncrypt = JSON.stringify(data);
  console.log(textToEncrypt);
  const encryptedBytes = CryptoJS.AES.encrypt(textToEncrypt, key);
  const encryptedData = encryptedBytes.toString();
  return encryptedData;
}

const submitPassword = document.getElementById("submitPassword");
var currentTabUrl = "";
var currentSiteName = "";
if (chrome && chrome.tabs && chrome.tabs.query) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    currentTabUrl = tabs[0].url;
    currentSiteName = tabs[0].title;
  });
} else {
  currentTabUrl = "";
  alert("Browser extension API not supported.");
}
const REGEX = /[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
var password = generatePassword(10, false, REGEX);
setTimeout(function () {
  var siteUrl = document.getElementById("url");
  siteUrl.value = currentTabUrl;
  var siteName = document.getElementById("title");
  siteName.value = currentSiteName;
  var generatedPassword = document.getElementById("password");
  generatedPassword.value = password;
}, 1000);
const hidebtn = document.getElementById("togglePassword");
hidebtn.addEventListener("click", (e) => {
  e.preventDefault();
  togglePasswordVisibility();
});

const refreshBtn = document.getElementById("refreshBtn");
refreshBtn.addEventListener("click", (e) => {
  e.preventDefault();
  password = generatePassword(10, false, REGEX);
  var generatedPassword = document.getElementById("password");
  generatedPassword.value = password;
});

submitPassword.addEventListener("click", (e) => {
  e.preventDefault();

  chrome.storage.local.get(["key"], function (result) {
    const key = result.key;

    const password = encryptData(
      document.getElementById("password").value,
      key
    );
    const siteUrl = encryptData(document.getElementById("url").value, key);
    const siteName = encryptData(document.getElementById("title").value, key);

    chrome.storage.local.get(["passwords"], function (result) {
      const existingPasswords = result.passwords || [];

      // Check if the password already exists
      const isDuplicate = existingPasswords.some(
        (existingPassword) =>
          decryptData(existingPassword.siteUrl, key) ===
            decryptData(siteUrl, key) &&
          decryptData(existingPassword.siteName, key) ===
            decryptData(siteName, key)
      );

      if (isDuplicate) {
        alert("Password with the same site URL and name already exists.");
        return;
      }

      const newPassword = {
        password: password,
        siteUrl: siteUrl,
        siteName: siteName,
      };

      existingPasswords.push(newPassword);

      chrome.storage.local.set({ passwords: existingPasswords }, function () {
        alert("password successfully saved to storage.");
        window.location.replace("../passwords list/passwords.html");
      });
    });
  });
});
