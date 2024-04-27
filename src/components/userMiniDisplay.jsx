import React, {useEffect, useState} from 'react';
import '../components.css';
import {db} from "../firebase";
import {doc, getDoc} from "firebase/firestore";
import defaultUserPhoto from "../img/user.png"


function UserMiniDisplay(props){

    const [pPhotoURL, setPPhotoURL] = useState(defaultUserPhoto);
    const [name, setName] = useState('');


    const fetchData = async () => {
        try {
            const docSnap = await getDoc(doc(db, 'publicUserData', props.userID));
            if (docSnap.exists()) {
                setName(docSnap.data().name);
                setPPhotoURL(docSnap.data().photoURL?docSnap.data().photoURL:defaultUserPhoto);
            }
        } catch (error) {
            // Handle any errors
            console.error(error);
        }
    };


    useEffect(() => {

        fetchData();
    }, []);

    return (
        <div id={'userDisplay'}>
            <div id={'smallDisplay'}
                 className={'flex_row'}>
                <div>{name}</div>
                <div
                    id="profilePhoto"
                    style={{ backgroundImage: `url(${pPhotoURL})`, backgroundSize: 'cover' }}
                />
            </div>
        </div>
    );
}

export default UserMiniDisplay;