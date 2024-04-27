import toggleTheme from "./toggleTheme";

export default function autoDetectTheme(){
    let theme = localStorage.getItem("theme");

    if(theme==='light'){
        toggleTheme('light')
        localStorage.setItem('theme', 'light');
    }
    if(theme==='dark'){
        toggleTheme('dark')
        localStorage.setItem('theme', 'dark');
    }
    if(theme==='os' || theme===null){
        toggleTheme('os')
    }
}