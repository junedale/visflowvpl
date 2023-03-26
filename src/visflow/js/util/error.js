

const toastEl = document.querySelector("#error-toast");
const toast = new bootstrap.Toast(toastEl);
const messageEl = document.querySelector("#error-message");

export function showError(type, message) {
    messageEl.innerHTML = "";
    message.forEach(msg => {
        messageEl.innerHTML += `<div>${msg}</div>`;
    });

    toastEl.classList.remove("bg-primary", "bg-danger", "bg-warning", "bg-success");

    if (type === 0) {
        toastEl.classList.add("bg-primary");
    } else if(type === 1) {
        toastEl.classList.add("bg-success");
    } else if (type === 2) {
        toastEl.classList.add("bg-warning");
    } else if (type === 3) {
        toastEl.classList.add("bg-danger");
    }

    toast.show();
}