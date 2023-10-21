const sha512script = document.createElement("script");
sha512script.src = "../../node_modules/sha512.min.js";
document.head.appendChild(sha512script);

try {
  chrome.storage.local.get(["user"], function (result) {
    if (result.user != null) {
      window.location.replace("../login/login.html");
    }
  });
} catch (error) {
  const notSigned = document.getElementById("not-signed");
  notSigned.textContent = "you must first sign up to use the extension";
}
const submitBtn = document.getElementById("submitBtn");

function validatePassword(password) {
  const minLength = 8; // Minimum length requirement
  const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
  const lowercaseRegex = /[a-z]/; // At least one lowercase letter
  const digitRegex = /[0-9]/; // At least one digit
  const specialCharRegex = /[!@#$%^&*]/; // At least one special character

  // Check the length of the password
  if (password.length < minLength) {
    return "Password must be at least 8 characters long";
  }

  // Check if the password contains at least one uppercase letter
  if (!uppercaseRegex.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  // Check if the password contains at least one lowercase letter
  if (!lowercaseRegex.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  // Check if the password contains at least one digit
  if (!digitRegex.test(password)) {
    return "Password must contain at least one digit";
  }

  // Check if the password contains at least one special character
  if (!specialCharRegex.test(password)) {
    return "Password must contain at least one special character";
  }

  // Password meets all requirements
  return "Password is valid";
}

submitBtn.addEventListener("click", (e) => {
  const email = document.getElementById("email").value;
  const userName = document.getElementById("username").value;
  const plainPassword = document.getElementById("password").value;
  e.preventDefault();
  const res = validatePassword(plainPassword);

  if (res === "Password is valid") {
    const hashedpassword = sha512(plainPassword).toString();
    chrome.storage.local.set(
      { user: [userName, email, hashedpassword] },
      function () {
        window.location.replace("../login/login.html");
      }
    );
    console.log(hashedpassword);
  } else {
    const errorContainer = document.getElementById("error-msg");
    errorContainer.textContent = res;
  }
});
