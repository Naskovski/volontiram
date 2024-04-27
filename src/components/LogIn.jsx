import React, { useEffect, useState  } from 'react';
import '../components.css';
import {ReactComponent as Logo} from '../img/logo.svg';
import GoogleLogo from '../img/Google__G__Logo.svg';
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";


function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) {
            navigate("/");
        }
    }, [user, loading]);

    function handleKeyUp(event, action){
        if (event.key === 'Enter') {
            if(action === 'Confirm'){
                logInWithEmailAndPassword(email, password);
            }
            if(action === 'Next'){
                document.getElementById('loginPasswordInput').focus();
            }
        }
    }

    return (
        <div id={'loginWrapper'} className={'center'}>
            <div id={'login'} className={'login bigCard'}>
                <Logo id={'LoginLogo'} />
                <h1>Волонтирам</h1>
                <h2>Најава</h2>
                <div id={'inputFields'}>
                    <input
                        placeholder={'Email'}
                        type={"email"}
                        value={email}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next')}
                        onChange={(e) => setEmail(e.target.value)}/>
                    <input
                        id={'loginPasswordInput'}
                        placeholder={'Password'}
                        type={"password"}
                        value={password}
                        onKeyUp={(e)=>handleKeyUp(e, 'Confirm')}
                        onChange={(e) => setPassword(e.target.value)}/>
                    <button
                        className='rec_button accent'
                        onClick={() => logInWithEmailAndPassword(email, password)}
                    >Најава</button>
                </div>
                <hr style={{width: '80%', opacity: '0.2'}}/>
                <button  onClick={signInWithGoogle}>
                    <img src={GoogleLogo} alt={'Google Logo'} className={'button_logo'}/> Продолжете со Google
                </button>
            </div>
            <div>
                <a href="/reset">Заборавена лозинка?</a>
            </div>
            <div>
                Сеуште не сте член? <a href="/register">Придружете</a> се.
            </div>
        </div>
    )
}

export default Login;