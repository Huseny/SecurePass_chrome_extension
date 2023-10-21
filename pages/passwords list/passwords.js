const CryptoJSScript = document.createElement("script");
CryptoJSScript.src = "../../crypto-js.min.js";
document.head.appendChild(CryptoJSScript);

function decryptData(encryptedData, key) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  const decryptedData = JSON.parse(decryptedText);
  return decryptedData;
}

chrome.storage.local.get(["key"], function (result) {
  const key = result.key;

  chrome.storage.local.get(["passwords"], function (result) {
    const existingPasswords = result.passwords || [];
    const passwordList = document.getElementById("passwordList");

    renderPasswordList(existingPasswords, passwordList, key);

    const editButtons = document.querySelectorAll(".list-tile");
    var thisPassword;
    editButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        detailsPage({
          siteName: decryptData(existingPasswords[index].siteName, key),
          siteUrl: decryptData(existingPasswords[index].siteUrl, key),
          password: decryptData(existingPasswords[index].password, key),
        });
      });
    });

    const trashIcons = document.querySelectorAll(".fas.fa-trash-alt");
    trashIcons.forEach((icon) => {
      icon.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        removePassword(index, existingPasswords, passwordList, key);
      });
    });
  });
});

function renderPasswordList(passwords, passwordListElement, key) {
  var passwordListHtml = "";

  passwords.forEach((password, index) => {
    let decryptedSiteUrl, decryptedSiteName;

    try {
      decryptedSiteUrl = decryptData(password.siteUrl, key);
      decryptedSiteName = decryptData(password.siteName, key);
    } catch (error) {
      console.error("Error decrypting password data:", error);
      return; // Skip the current password entry
    }

    const truncatedUrl =
      decryptedSiteUrl.length > 20
        ? decryptedSiteUrl.substring(0, 20) + "..."
        : decryptedSiteUrl;

    passwordListHtml += `
      <div class="list-tile" style="display: flex; justify-content: space-between;">
        <div style="display: flex">
          <div>
            <div class="title">${decryptedSiteName}</div>
            <div class="url" style="max-width: 200px">${truncatedUrl}</div>
          </div>
        </div>
        <div>
          <div class="edit-button">
            <div>
            <i class="fas fa-trash-alt" data-index="${index}"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  passwordListElement.innerHTML = passwordListHtml;
}

function removePassword(index, passwords, passwordListElement, key) {
  if (index >= 0 && index < passwords.length) {
    passwords.splice(index, 1);

    chrome.storage.local.set({ passwords: passwords }, function () {
      refreshPasswordList(passwords, passwordListElement, key);
    });
  }
}

function refreshPasswordList(passwords, passwordListElement, key) {
  renderPasswordList(passwords, passwordListElement, key);
}

function detailsPage(password) {
  chrome.storage.local.set({ singlePassword: password }, function () {
    window.location.href = "../details page/details.html";
  });
}
