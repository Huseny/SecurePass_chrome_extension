var UPPERCASE_RE = /([A-Z])/g;
var LOWERCASE_RE = /([a-z])/g;
var NUMBER_RE = /([\d])/g;
var SPECIAL_CHAR_RE = /([\?\-])/g;
var NON_REPEATING_CHAR_RE = /([\W\w\d\?\-])\1{2,}/g;

function isStrongEnough(password) {
  var uc = password.match(UPPERCASE_RE);
  var lc = password.match(LOWERCASE_RE);
  var n = password.match(NUMBER_RE);
  var sc = password.match(SPECIAL_CHAR_RE);
  var nr = password.match(NON_REPEATING_CHAR_RE);
  var maxLength = 18;
  var minLength = 12;
  var uppercaseMinCount = 3;
  var lowercaseMinCount = 3;
  var numberMinCount = 2;
  var specialMinCount = 2;
  var strength = 0;
  if (uc) {
    strength += 1;
  }
  if (lc) {
    strength += 1;
  }
  if (n) {
    strength += 1;
  }
  if (sc) {
    strength += 1;
  }
  if (password.length >= 8) {
    strength += 1;
  }
  if (password.length >= 12) {
    strength += 2;
  }
  strength = (strength / 6.1) * 100;
  return [
    password.length >= minLength &&
      !nr &&
      uc &&
      uc.length >= uppercaseMinCount &&
      lc &&
      lc.length >= lowercaseMinCount &&
      n &&
      n.length >= numberMinCount &&
      sc &&
      sc.length >= specialMinCount,
    strength,
  ];
}
// Function to update the progress bar width
function updateProgressBar(strength) {
  const progressBar = document.getElementById("progressBar");
  const strengthText = document.getElementById("strengthText");
  progressBar.style.width = strength + "%";
  const percentage = Math.round(Number(strength)).toFixed(2);
  strengthText.innerHTML = percentage + "%";
  if (strength < 25) {
    progressBar.style.backgroundColor = "red";
  } else if (strength < 50) {
    progressBar.style.backgroundColor = "orange";
  } else if (strength < 75) {
    progressBar.style.backgroundColor = "yellow";
  } else {
    progressBar.style.backgroundColor = "green";
  }
  checkBtn.classList.toggle("btn-success");
}

const checkBtn = document.getElementById("checkBtn");
const progressBar = document.getElementById("progressBar");

checkBtn.addEventListener("click", () => {
  console.log("clicked");
  const password = document.getElementById("password").value;
  const res = isStrongEnough(password);
  updateProgressBar(res[1]);
});
