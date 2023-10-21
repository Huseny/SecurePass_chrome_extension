const sha512script = document.createElement("script");
sha512script.src = "../../node_modules/sha512.min.js";
document.head.appendChild(sha512script);

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", (e) => {
  const input_email = document.getElementById("email").value;
  const plainPassword = document.getElementById("password").value;
  e.preventDefault();
  const hashedpassword = sha512(plainPassword);
  try {
    chrome.storage.local.get(["user"], function (result) {
      var email = result.user[1];
      var password = result.user[2];
      if (password == hashedpassword && email == input_email) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        window.location.replace("../navigator/navigator.html");
      } else {
        const loginFailed = document.getElementById("login-failure");
        loginFailed.textContent = "Incorrect email or password";
      }
    });
  } catch (error) {
    const loginFailed = document.getElementById("login-failure");
    loginFailed.textContent = "Incorrect email or password";
  }
});
