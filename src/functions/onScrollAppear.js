import changeBgColor from "./changeBgColor";
window.onscroll = function() {onScrollAppear('Header', 'var(--header-bg)', 'var(--header-transp)')};

export default function onScrollAppear(elementID, bgColor, transpColor) {
    if (window.scrollY > 0) {
        changeBgColor(elementID, bgColor)
    } else {
        changeBgColor(elementID, transpColor)
    }
}