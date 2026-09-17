/* ============================================================
   Dialog Modals & Video Switcher Handlers
   ============================================================ */
const termsDialog=document.getElementById("terms-dialog");
const footTermsLink=document.getElementById("footTermsLink");
if(termsDialog && footTermsLink){
    footTermsLink.addEventListener("click",e=>{
        e.preventDefault();
        termsDialog.showModal();
    });
    const termsClose = document.getElementById("termsClose");
    if(termsClose) termsClose.addEventListener("click",()=>termsDialog.close());
    termsDialog.addEventListener("click",e=>{ if(e.target===termsDialog) termsDialog.close(); });
}

const privacyDialog=document.getElementById("privacy-dialog");
const footPrivacyLink=document.getElementById("footPrivacyLink");
if(privacyDialog && footPrivacyLink){
    footPrivacyLink.addEventListener("click",e=>{
        e.preventDefault();
        privacyDialog.showModal();
    });
    const privacyClose = document.getElementById("privacyClose");
    if(privacyClose) privacyClose.addEventListener("click",()=>privacyDialog.close());
    privacyDialog.addEventListener("click",e=>{ if(e.target===privacyDialog) privacyDialog.close(); });
}

const loginDialog=document.getElementById("login-dialog");
const loginLinks=[...document.querySelectorAll(".js-login")];
if(loginDialog && loginLinks.length){
    loginLinks.forEach(a=>a.addEventListener("click",e=>{
        e.preventDefault();
        loginDialog.showModal();
    }));
    const loginClose = document.getElementById("loginClose");
    if(loginClose) loginClose.addEventListener("click",()=>loginDialog.close());
    loginDialog.addEventListener("click",e=>{ if(e.target===loginDialog) loginDialog.close(); });
    const loginForm=document.getElementById("loginForm");
    if(loginForm) loginForm.addEventListener("submit",e=>{ e.preventDefault(); loginDialog.close(); });
}
