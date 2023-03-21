
const mainToastEl = document.querySelector("#main-toast");
const mainToastMessageEl = document.querySelector("#main-toast-message");
const mainToast = new bootstrap.Toast(mainToastEl);
let bg = "text-bg-primary";

export function showToast(type, message) {
    mainToastEl.classList.toggle(bg, false);
    mainToastMessageEl.innerHTML = message;

    if(type === 0) {
        bg = "text-bg-success";
        mainToast.show();
    } else if(type === 1) {
        bg = "text-bg-warning";
        mainToast.show();
    } else {
        bg = "text-bg-danger";
        mainToast.show();
    }
    mainToastEl.classList.toggle(bg, true);
}