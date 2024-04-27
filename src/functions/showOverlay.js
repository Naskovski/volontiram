export default function showOverlay(elementID, what) {
    let overlay = document.getElementById(elementID);
    if (overlay === null) {
        return;
    }
    if (what) {
        if (what === "show") {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }


    }
}