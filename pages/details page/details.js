document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(["singlePassword"], function (result) {
    const res = result.singlePassword;
    const passwordDetails = {
      title: res.siteName,
      url: res.siteUrl,
      password: res.password,
    };
    // Set the values of the form fields
    document.getElementById("title").value = passwordDetails.title;
    document.getElementById("url").value = passwordDetails.url;
    document.getElementById("password").value = passwordDetails.password;
  });

  // Add event listener to the copy button
  var copyBtn = document.getElementById("copyPassword");

  copyBtn.addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    passwordField.select();
    passwordField.setSelectionRange(0, 99999); // For mobile devices

    document.execCommand("copy");
    copyBtn.innerHTML = "Copied!";
    setTimeout(() => {
      copyBtn.innerHTML = "Copy";
    }, 2000);
  });
});
