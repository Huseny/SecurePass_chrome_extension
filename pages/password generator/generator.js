// import generatePassword from "./password-generator.min.js";
const generateBtn = document.getElementById("generateBtn");

// JavaScript code
const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {
  // Replace the URL with the desired target page
  window.location.replace("../navigator/navigator.html");
});

generateBtn.addEventListener("click", (e) => {
  console.log("clicked");
  const passLength = document.getElementById("length").value;
  const uppercase = document.getElementById("includeUppercase").checked;
  const lowercase = document.getElementById("includeLowercase").checked;
  const numbers = document.getElementById("includeNumbers").checked;
  const symbols = document.getElementById("includeSymbols").checked;
  const generatedPassword = document.getElementById("generatedPassword");

  var REGEX;
  if (uppercase && lowercase && numbers && symbols) {
    REGEX = /([A-Za-z\d\?\-])/g;
  } else if (uppercase && lowercase && numbers) {
    REGEX = /([A-Za-z\d])/g;
  } else if (uppercase && lowercase && symbols) {
    REGEX = /([A-Za-z\?\-])/g;
  } else if (uppercase && numbers && symbols) {
    REGEX = /([A-Z\d\?\-])/g;
  } else if (lowercase && numbers && symbols) {
    REGEX = /([a-z\d\?\-])/g;
  } else if (uppercase && lowercase) {
    REGEX = /([A-Za-z])/g;
  } else if (uppercase && numbers) {
    REGEX = /([A-Z\d])/g;
  } else if (uppercase && symbols) {
    REGEX = /([A-Z\?\-])/g;
  } else if (lowercase && numbers) {
    REGEX = /([a-z\d])/g;
  } else if (lowercase && symbols) {
    REGEX = /([a-z\?\-])/g;
  } else if (numbers && symbols) {
    REGEX = /([\d\?\-])/g;
  } else if (uppercase) {
    REGEX = /([A-Z])/g;
  } else if (lowercase) {
    REGEX = /([a-z])/g;
  } else if (numbers) {
    REGEX = /([\d])/g;
  } else if (symbols) {
    REGEX = /([\?\-])/g;
  } else {
    REGEX = /([a-z])/g;
    alert("Please select at least one option");
    return;
  }
  const password = generatePassword(passLength, false, REGEX);
  console.log(password);
  generatedPassword.value = password;

  const copyBtn = document.getElementById("copyBtn");

  copyBtn.addEventListener("click", () => {
    generatedPassword.select();
    document.execCommand("copy");
    copyBtn.innerHTML = "Copied!";
    setTimeout(() => {
        copyBtn.innerHTML = "Copy";
        }, 2000);
  });
});
