function decryptData(encryptedData, key) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  const decryptedData = JSON.parse(decryptedText);
  return decryptedData;
}

var inputs = document.getElementsByTagName("input");
var inputLength = inputs.length;
var isDuplicate = false;
var isClicked = false;

chrome.storage.local.get(["key"], function (result) {
  const key = result.key;

  for (var i = 0; i < inputLength; i++) {
    const input = inputs.item(i);
    if (input.type !== "password") continue;

    chrome.storage.local.get(["passwords"], function (result) {
      const existingPasswords = result.passwords || [];
      const currentTabUrl = window.location.href;

      existingPasswords.forEach((existingPassword) => {
        var siteUrl = decryptData(existingPassword.siteUrl, key);
        if (currentTabUrl === siteUrl) {
          isDuplicate = true;
          input.value = decryptData(existingPassword.password, key);
        }
      });
    });

    input.addEventListener("click", () => {
      if (!isDuplicate && !isClicked) {
        isClicked = true;
        const REGEX = /[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        const modalContent = `
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Generated Password</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Suggested password: <strong>${generatePassword(
                  10,
                  false,
                  REGEX
                )}</strong></p>
              </div>
              <div class="modal-footer">
                <button id="cancelButton" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        `;

        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);

        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        const closeBtn = document.getElementById("cancelButton");
        closeBtn.addEventListener("click", () => {
          modalInstance.hide();
          document.body.removeChild(modal);
        });
      }
    });
  }
});
