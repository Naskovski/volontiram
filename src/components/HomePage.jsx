import React, { useEffect, useContext, useState } from 'react';
import '../components.css';
import {auth, userDocRef, db} from "../firebase";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {onSnapshot, collection, query, where, getDocs} from "firebase/firestore";
import {DataContext} from "../DataContext";
import MenuBar from "./MenuBar";
import EventCard from "./EventCard";
import {ReactComponent as LongLogo} from "../img/long_logo_nofill.svg";
import {ReactComponent as DogWalking} from "../img/dog-walking.svg";

function HomePage(){
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const {location, setLocation} = useContext(DataContext)
    const {name, setName} = useContext(DataContext)
    const {userSkills, setUserSkills} = useContext(DataContext)

    const unsub = onSnapshot(userDocRef, (doc) => {
        if(doc.get('location')!==undefined && doc.get('location')!==''){
            setLocation(doc.get('location'));
            setName(doc.get('name'));
            setUserSkills(doc.get('skills'));
        }else navigate('/finalize');
    });
    const [events, setEvents] = useState([]);
    
    const handleRemoveElement = () => {
      setEvents(events.slice(1));
    }

    useEffect(()=>{
        if(!user) navigate('/login')
    }, [user]);

    useEffect(() => {
        if(!user) return;
        const fetchEvents = async () => {
            const currentDate = new Date();
            let q = query(collection(db, "eventData"), where("location", "==", location));

            if(location==='Цела Македонија'){
                q = query(collection(db, "eventData"));
            }

            const querySnapshot = await getDocs(q);
            const eventList = [];
            querySnapshot.forEach((doc) => {
                const joinedBy = doc.get('participants');
                const declinedBy = doc.get('declinedBy');
                const evSkills = doc.get('eventSkills');
                const eventDate = new Date(doc.data().date);
                const hasMatchingSkills = !evSkills || evSkills?.length === 0 || userSkills.some(skill => evSkills.includes(skill));
                 if(eventDate >= currentDate
                    && (hasMatchingSkills)
                    && (!joinedBy || !joinedBy.includes(user.uid))
                    && (!declinedBy || !declinedBy.includes(user.uid))) {
                    eventList.push({ id: doc.id, ...doc.data() });
                }
            });
            setEvents(eventList);
        };

        fetchEvents();
    }, [location]);



    useEffect(()=>{
        return () =>{
            unsub();
        };
    });

     return (
        <div>
            {!user && <Navigate to={'/login'}/>}
            {user && <div id={"home"} className={'container'}>
                <div className={'flex_row'}>
                    <LongLogo className={'logoSVG'} />
                </div>

                <div id={'eventCardContainer'}>
                    {events?.length===0 && <div>
                        <DogWalking />
                        <p style={{textAlign: 'center'}}>Ги поминавте сите настани. Ве молиме, посетете не подоцна!</p>
                    </div>}

                    {events.map((event) => (
                        <EventCard key={event.id} 
                                   eventID={event.id}
                                   swipe={true}
                                   onRemoveElement={handleRemoveElement}
                                   {...event} />
                    ))}
                </div>


                <div className={'menuBarSpacer'}/>
                <MenuBar/>
            </div>}
        </div>
    );
}

export default HomePage;