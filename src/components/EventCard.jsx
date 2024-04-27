import React, {useEffect, useContext, useState} from 'react';
import '../components.css';
import {auth, userDocRef, db} from "../firebase";
import {onSnapshot, updateDoc, doc, getDoc, arrayUnion, arrayRemove, collection} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {ReactComponent as CheckIcon} from "../ico/check_pin.svg";
import UserMiniDisplay from "./userMiniDisplay";


export default function EventCard(props){
    const [user] = useAuthState(auth);

    const [eventName, setEventName] = useState('');
    const [eventDesc, setEventDesc] = useState('');
    const [eventAddress, setEventAddress] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventContact, setEventContact] = useState('');
    const [eventPhotoURL, setEventPhotoURL] = useState('');
    const [participants, setParticipants] = useState('');
    const [participating, setParticipating] = useState(props.partc);
    const [createdBy, setCreatedBy] = useState("");
    const [evSkills, setEvSkills] = useState("");
    const [swipe, setSwipe] = useState(props.swipe)


    const [displayInfo, setDisplayInfo] = useState(false);

    let eventDoc = doc(db, 'eventData', props.eventID);

    const [startX, setStartX] = useState(0);
    const [cardStyle, setCardStyle] = useState({ transform: 'translateX(0)'});


    const handleTouchStart = (event) => {
        if(!swipe) return;

        setStartX(event.touches[0].clientX);
    };

    const handleTouchMove = (event) => {
        if(!swipe) return;
        if (!startX) return;

        const currentX = event.touches[0].clientX;
        const deltaX = currentX - startX;

        setCardStyle((prev) => ({
            ...prev,
            transform: `translateX(${deltaX}px)`
        }));


        if (Math.abs(deltaX) >= 0.4 * window.innerWidth) {
            if (deltaX < 0) {
                setCardStyle((prev) => ({
                    ...prev,
                    boxShadow: '#8b0000 0px 0px 8px 10px',
                }));
            } else {
                setCardStyle((prev) => ({
                    ...prev,
                    boxShadow: '#38c870 0px 0px 8px 10px',
                }));
            }
        }else{
            setCardStyle((prev) => ({
                ...prev,
                boxShadow: '#00000000 0 0 ',
            }));
        }



    };

    const handleTouchEnd = (event) => {
        if(!swipe) return;
        if (!startX) return;

        const deltaX = startX - event.changedTouches[0].clientX;

        if (Math.abs(deltaX) >= 0.3 * window.innerWidth) {
            if (deltaX > 0) {
                console.log('Swiped left, event declined')
                declineEvent()
                removeElement();
            } else {
                console.log('Swiped right, event joined');
                joinEvent()
                removeElement()
            }
        }
        else {
            setStartX(0);
            setCardStyle((prev) => ({
                ...prev,
                transform: `translateX(0)`
            }));
        }
    };

    const handleMouseDown = (event) => {
        if(!swipe) return;

        setStartX(event.clientX);
    };

    const handleMouseMove = (event) => {
        if(!swipe) return;
        if (!startX) return;

        const currentX = event.clientX;
        const deltaX = currentX - startX;

        setCardStyle((prev) => ({
            ...prev,
            transform: `translateX(${deltaX}px)`
        }));

        if (Math.abs(deltaX) >= 0.3 * window.innerWidth) {
            if (deltaX < 0) {
                setCardStyle((prev) => ({
                    ...prev,
                    boxShadow: '#8b0000 0px 0px 8px 10px',
                }));
            } else {
                setCardStyle((prev) => ({
                    ...prev,
                    boxShadow: '#38c870 0px 0px 8px 10px',
                }));
            }
        }else{
            setCardStyle((prev) => ({
                ...prev,
                boxShadow: '#00000000 0 0 ',
            }));
        }


    };

    const handleMouseUp = (event) => {
        if(!swipe) return;
        if (!startX) return;

        const deltaX = startX - event.clientX;

        if (Math.abs(deltaX) >= 0.3 * window.innerWidth) {
            if (deltaX > 0) {
                console.log('Swiped left, event declined')
                declineEvent()
                removeElement();
            } else {
                console.log('Swiped right, event joined');
                joinEvent()
                removeElement()
            }
        }
        else {
            setStartX(0);
            setCardStyle((prev) => ({
                ...prev,
                transform: `translateX(0)`
            }));
        }
    };

    const removeElement = () => {
        props.onRemoveElement();
    }





    const fetchData = async () => {
        try {
            const docSnap = await getDoc(eventDoc);
            if (docSnap.exists()) {
                const data = docSnap.data();

                setParticipants([]);
                setEventName(data.name);
                setEventDesc(data.desc);
                setEventAddress(data.address);
                setEventLocation(data.location);
                setEventDate(data.date);
                setEventTime(data.time);
                setEventContact(data.contact);
                setEventPhotoURL(data.photoURL);
                setCreatedBy(data.createdBy);
                setParticipants(data.participants);
                setEvSkills(data.eventSkills);
            }
        } catch (error) {
            // Handle any errors
            console.error(error);
        }
    };

    useEffect(()=>{



        fetchData();
    }, []);

    useEffect(()=>{
        if(eventPhotoURL===undefined || eventPhotoURL===''){
            setCardStyle((prev) => ({
                ...prev,
                backgroundImage: `url(https://unsplash.com/photos/lyiKExA4zQA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8aGVscHxlbnwwfHx8fDE2ODY5ODc4MDd8MA&force=true&w=640)`,
                backgroundSize: 'cover',
            }));
        }
        else{
            setCardStyle((prev) => ({
                ...prev,
                backgroundImage: `url(${eventPhotoURL})`,
                backgroundSize: 'cover',
            }));
        }

    }, [eventPhotoURL]);

    function toggleDisplay(){
        if(displayInfo === true){
            setDisplayInfo(false);
            document.getElementById(props.eventID+"Landing").classList.remove('disabled');
            document.getElementById(props.eventID+"Landing").classList.add('active');

            document.getElementById(props.eventID+"Info").classList.remove('active');
            document.getElementById(props.eventID+"Info").classList.add('disabled');

            document.getElementById(props.eventID+"Landing").addEventListener('click', toggleDisplay);
            document.getElementById(props.eventID+"Info").removeEventListener('click', toggleDisplay);

        }else{
            setDisplayInfo(true)
            document.getElementById(props.eventID+"Landing").classList.remove('active');
            document.getElementById(props.eventID+"Landing").classList.add('disabled');

            document.getElementById(props.eventID+"Info").classList.remove('disabled');
            document.getElementById(props.eventID+"Info").classList.add('active');

            document.getElementById(props.eventID+"Landing").removeEventListener('click', toggleDisplay);
            document.getElementById(props.eventID+"Info").addEventListener('click', toggleDisplay);
        }
    }

    async function joinEvent() {
        if(!user) return;
        try {
            await updateDoc(userDocRef, {
                joinedEvents: arrayUnion(props.eventID),
            });
            const eventDataRef = doc(db, "eventData/"+props.eventID);
            await updateDoc(eventDataRef, {
                participants: arrayUnion(user.uid),
            });
            console.log('Event joined successfully');
            return true; // za changeMind da raboti await
        } catch (error) {
            console.error('Error joining event:', error);
            return false;
        }
    }

    async function declineEvent() {
        if(!user) return;
        try {
            await updateDoc(userDocRef, {
                declinedEvents: arrayUnion(props.eventID),
            });
            const eventDataRef = doc(db, "eventData/"+props.eventID);
            await updateDoc(eventDataRef, {
                declinedBy: arrayUnion(user.uid),
            });
            console.log('Event declined successfully');
            return true; // za changeMind da raboti await
        } catch (error) {
            console.error('Error declining event:', error);
            return false;
        }
    }

    async function handleChangeMind(what){
        if(!user) return;
        setParticipants(Array(participants).filter(internal_uid => internal_uid!==user.uid));

        try {
            await updateDoc(userDocRef, {
                joinedEvents: arrayRemove(props.eventID),
                declinedEvents: arrayRemove(props.eventID),
            });

            const eventDataRef = doc(db, "eventData/"+props.eventID);
            await updateDoc(eventDataRef, {
                participants: arrayRemove(user.uid),
                declinedBy: arrayRemove(user.uid),
            });
            console.log('Event joined successfully');
        } catch (error) {
            console.error('Error joining event:', error);
        }

        await what==='join'?joinEvent():declineEvent();
        props.galleryRefresh();
    }

    return (
        <div id={props.eventID}
             className={'bigCard eventCard'}
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             style={cardStyle}>

            <h1>{eventName}</h1>

            {participating && <CheckIcon className={'participating'} />}

            <section id={props.eventID+"Landing"} className={'active'} onClick={toggleDisplay}>
                <h2>{eventLocation}</h2>
                <h3>{eventDate}</h3>
                <h4>{eventTime}</h4>
            </section>
            <section id={props.eventID+"Info"} className={'disabled info'} onClick={toggleDisplay}>

                {props.chMind==='join' && <button className={'rec_button'}
                                                  onClick={()=>handleChangeMind('join')}
                                                  style={{width: '10rem'}}
                > Придружи се</button>}

                {createdBy && <div className={'flex_col'}>
                    <span className={'tinyTxt'}>организирано од</span>
                    <UserMiniDisplay userID={createdBy}/>
                </div>}
                <p>{eventDesc}</p>

                {evSkills?.length===0?"Нема потребни вештини":<div className={'flex_col'}>
                    <b>Потребни вештини</b>
                    {evSkills?.map((skill)=>(<div>{skill}</div>))}
                </div>}
                <br/>
                <div className={'flex_col'}>
                    {participating && <div style={{padding: '1rem'}}>
                        контакт: {eventContact}<br/>
                        адреса: {eventAddress}
                    </div>}

                    {(participants && participants.length>0)?<div id={'participants'} className={'flex_col'}>
                            <div className={'tinyTxt'}>пријавени:</div>
                        {participants.map((usrID)=>(<UserMiniDisplay key={usrID} userID={usrID}/>))}
                    </div>
                        :<div>бидете првиот пријавен</div>
                    }

                </div>

                {props.chMind==='decline' && <button className={'rec_button'}
                                                     onClick={()=>handleChangeMind('decline')}
                                                     style={{marginBottom: '2rem', width: '10rem'}}
                > Откажи се</button>}



            </section>



        </div>
    )

}