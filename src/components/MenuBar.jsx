import React, { useEffect, useState, useContext } from 'react';
import '../components.css';
import {auth, userDocRef} from "../firebase";

import {useNavigate} from "react-router-dom";
import {ReactComponent as HomeIcon} from "../ico/explore.svg";
import {ReactComponent as CreateIcon} from "../ico/add_box.svg";
import {ReactComponent as UserIcon} from "../ico/account_circle.svg";
import logo from '../img/Google__G__Logo.svg';
import {useAuthState} from "react-firebase-hooks/auth";



export default function MenuBar(){
    const [user, loading] = useAuthState(auth);

    const [display, setDisplay] = useState('landing');
    const navigate = useNavigate();



    return (
        <div id={'MenuBar'} className={"card"}>
            <button onClick={()=>navigate("/homepage")} className={'transp_button round_button'}>
                <HomeIcon className="menuIcon" />
            </button>
            <button onClick={()=>navigate("/createEvent")} className={'transp_button round_button'}>
                <CreateIcon className="menuIcon" />
            </button>
            <button onClick={()=>navigate("/profile")} className={'transp_button round_button'}>
                <UserIcon className="menuIcon" />
            </button>


        </div>
    )

}