export default function toggleTheme(theme){
    let docRoot = document.querySelector(":root");
    if(theme===undefined){
        if(docRoot.classList.contains('light-mode')){
            docRoot.classList.remove('light-mode');
            localStorage.setItem('theme', 'light');
        }else{
            docRoot.classList.add('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    }else{
        if(theme==='dark'){
            docRoot.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }else if(theme==='light'){
            docRoot.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }else{

            localStorage.removeItem('theme');
            if (window.matchMedia) {
                var match = window.matchMedia('(prefers-color-scheme: dark)')
                if(match.matches){
                    docRoot.classList.remove('light-mode');
                }else{
                    docRoot.classList.add('light-mode');
                }
            }
        }
    }
}