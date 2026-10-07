

window.initModals = function() {
  
  const termsDialog = document.getElementById("terms-dialog");
  const footTermsLink = document.getElementById("footTermsLink");
  const termsClose = document.getElementById("termsClose");
  if (termsDialog && footTermsLink) {
    footTermsLink.addEventListener("click", e => {
      e.preventDefault();
      termsDialog.showModal();
    });
    if (termsClose) termsClose.addEventListener("click", () => termsDialog.close());
    termsDialog.addEventListener("click", e => {
      if (e.target === termsDialog) termsDialog.close();
    });
  }

  
  const privacyDialog = document.getElementById("privacy-dialog");
  const footPrivacyLink = document.getElementById("footPrivacyLink");
  const privacyClose = document.getElementById("privacyClose");
  if (privacyDialog && footPrivacyLink) {
    footPrivacyLink.addEventListener("click", e => {
      e.preventDefault();
      privacyDialog.showModal();
    });
    if (privacyClose) privacyClose.addEventListener("click", () => privacyDialog.close());
    privacyDialog.addEventListener("click", e => {
      if (e.target === privacyDialog) privacyDialog.close();
    });
  }

  
  const loginDialog = document.getElementById("login-dialog");
  const loginLinks = [...document.querySelectorAll(".js-login")];
  const loginClose = document.getElementById("loginClose");
  const loginForm = document.getElementById("loginForm");
  if (loginDialog && loginLinks.length) {
    loginLinks.forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      loginDialog.showModal();
    }));
    if (loginClose) loginClose.addEventListener("click", () => loginDialog.close());
    loginDialog.addEventListener("click", e => {
      if (e.target === loginDialog) loginDialog.close();
    });
    if (loginForm) loginForm.addEventListener("submit", e => {
      e.preventDefault();
      loginDialog.close();
    });
  }
};
