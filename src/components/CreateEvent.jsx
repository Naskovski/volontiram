import React, { useEffect, useContext, useState } from 'react';
import '../components.css';
import {auth, db, userDocRef, storage, storageRef} from "../firebase";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {setDoc, doc, collection} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {DataContext} from "../DataContext";
import MenuBar from "./MenuBar";
import {ReactComponent as Logo} from "../img/logo.svg";
import Loading from "./Loading";
import showOverlay from "../functions/showOverlay";




function CreateEvent(){
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const {location} = useContext(DataContext)

    const [eventName, setEventName] = useState('');
    const [eventDesc, setEventDesc] = useState('');
    const [eventAddress, setEventAddress] = useState('');
    const [eventLocation, setEventLocation] = useState('kr');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventContact, setEventContact] = useState('');
    const [eventPhotoURL, setEventPhotoURL] = useState('');
    const [createdBy, setCreatedBy] = useState(user?user.uid:'');
    const [eventSkills, setEventSkills] = useState([]);

    const [uploadFinished, setUploadFinished] = useState(true);
    const [ready, setReady] = useState(false);

    const locArray  = [
        "Берово",
        "Битола",
        "Валандово",
        "Велес",
        "Виница",
        "Гевгелиjа",
        "Гостивар",
        "Дебар",
        "Делчево",
        "Демир Хисар",
        "Кавадарци",
        "Кичево",
        "Кочани",
        "Кратово",
        "Крива Паланка",
        "Крушево",
        "Куманово",
        "Македонски Брод",
        "Неготино",
        "Охрид",
        "Прилеп",
        "Пробиштип",
        "Радовиш",
        "Ресен",
        "Свети Николе",
        "Скопjе",
        "Струга",
        "Струмица",
        "Тетово",
        "Штип"
    ];

    const skillsArray = [
        "Столарија",
        "Водовод",
        "Електрична работа",
        "Шиење или кроење",
        "Готвење или подготовка на оброци",
        "Чистење или домаќинство",
        "Грижа за деца или чување деца",
        "Грижа за домашни миленици или ракување со животни",
        "Возење или превоз",
        "Фитнес или личен тренинг",
        "Спортско тренирање или судење",
        "Поставување или декорација на настан",
        "Фотографија или видео",
        "Сликарство или мурална уметност",
        "Уредување или градинарски дизајн",
        "Плетење или хеклање",
        "Поправка или одржување на велосипед",
        "Упатство за јога или медитација",
        "Фризерство или стајлинг",
        "Пишување резимеа или мотивациони писма",
        "Финансиско буџетирање или совет",
        "Направете сами поправки или реновирање на домови",
        "Шиење или поправање облека",
        "Јавен говор или презентациски вештини",
        "Подготвеност при катастрофи или одговор при итни случаи"
    ];

    useEffect(() => {
        if(!user) return;

        setCreatedBy(user.uid);
    }, [user]);

    useEffect(() => {
        if (location==='none') {
            navigate('/finalize');
        }
    }, [location]);

    const handleFileUpload = async (event) => {

        const file = event.target.files[0];
        const stRef = ref(storage, `eventImages/${Date.now()}`);
        setUploadFinished(false)
        try {
            const snapshot = await uploadBytes(stRef, file);
            const downloadURL = await getDownloadURL(stRef); // Get the download URL after the upload
            setEventPhotoURL(downloadURL); // Update the state with the download URL
            setUploadFinished(true);
            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
        }


    };

    async function addToFirebase(name, desc, address, location, date, time, contact, photoURL, createdBy){

        const eventDataRef = doc(collection(db, "eventData"));
        let dataDoc = {
            name: name,
            desc: desc,
            address: address,
            location: location,
            date: date,
            time: time,
            contact: contact,
            photoURL: photoURL,
            createdBy: createdBy,
            eventSkills: eventSkills
        }

        try {
            await setDoc(eventDataRef, dataDoc);
            console.log('Document successfully set in Firestore.');
            clearData();
        } catch (error) {
            console.error('Error setting document:', error);
        }
    }


    function clearData(){
        setEventName('');
        setEventDesc('');
        setEventAddress('');
        setEventLocation('');
        setEventDate('');
        setEventTime('');
        setEventContact('');
        setEventPhotoURL('');
        setEventSkills('')
    }

    function handleKeyUp(event, action, elementId){
        if (event.key === 'Enter') {
            if(action === 'Confirm'){
                setReady(true);
            }
            if(action === 'Next'){
                document.getElementById(elementId).focus();
            }
        }
    }

    useEffect(()=>{
        if(uploadFinished && ready){
            addToFirebase(eventName, eventDesc, eventAddress, eventLocation,
                eventDate, eventTime, eventContact, eventPhotoURL, createdBy)
        }
    }, [uploadFinished, ready]);

    useEffect(() => {
        if(!uploadFinished) showOverlay("Loading", 'show')
        else showOverlay("Loading", 'hide')
    }, [uploadFinished]);

    return (
        <div className={'container'}>
            <Loading/>
            {!user && <Navigate to={'/login'}/>}
            {user && <div id={'createEvent'}>
                <div id={'Header'}>
                    <Logo className="logoSVG"/>
                    <h1>креирај настан</h1>
                </div>


                <div id={'eventDataInput'}>
                    <input
                        id={'eventNameInput'}
                        placeholder={'Име на настанот'}
                        type={"text"}
                        value={eventName}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next', 'eventDescInput')}
                        onChange={(e) => setEventName(e.target.value)}/>
                    <input
                        id={'eventDescInput'}
                        placeholder={'Опис'}
                        type={"text"}
                        value={eventDesc}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next', 'eventAddressInput')}
                        onChange={(e) => setEventDesc(e.target.value)}/>
                    <input
                        id={'eventAddressInput'}
                        placeholder={'Адреса на настанот'}
                        type={"text"}
                        value={eventAddress}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next', 'eventLocationInput')}
                        onChange={(e) => setEventAddress(e.target.value)}/>
                    <div style={{padding: '0 0.5rem'}}>
                        Град:
                        <select id="eventLocationInput"
                                value={eventLocation}
                                onKeyUp={(e)=>handleKeyUp(e, 'Next', 'eventDateInput')}
                                onChange={(e) => setEventLocation(e.target.value)}>
                        {locArray.map((location) => (
                                <option key={location} value={location}>{location}</option>

                            ))}

                        </select>
                    </div>
                    <input
                        id={'eventDateInput'}
                        placeholder={'Датум на настанот'}
                        type={"date"}
                        value={eventDate}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next', 'eventTimeInput')}
                        onChange={(e) => setEventDate(e.target.value)}/>
                    <input
                        id={'eventTimeInput'}
                        placeholder={'Време на настанот'}
                        type={"time"}
                        value={eventTime}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next', 'eventContactInput')}
                        onChange={(e) => setEventTime(e.target.value)}/>
                    <input
                        id={'eventContactInput'}
                        placeholder={'контакт'}
                        type={"text"}
                        value={eventContact}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next', 'eventPhotoURLInput')}
                        onChange={(e) => setEventContact(e.target.value)}/>
                    <input id={'eventPhotoFileInput'}
                           type="file"
                           onChange={handleFileUpload} />
                    <div className={'horiz_gallery'} style={{height: 'min-content', overflowY: "hidden"}}>
                                {skillsArray.map((skill)=>(
                                    <div className="checkBT" style={{width: '15rem', height: "7.5rem"}}>
                                        <input type="checkbox"
                                               id={skill}
                                               value={skill}
                                               style={{width: '15rem', height: "7.5rem"}}
                                               onChange={(e) => {
                                                   const isChecked = e.target.checked;
                                                   setEventSkills((prevSkills) => {
                                                       if (isChecked) {
                                                           return [...prevSkills, skill];
                                                       } else {
                                                           return prevSkills.filter((selectedSkill) => selectedSkill !== skill);
                                                       }
                                                   });
                                               }}/>

                                        <div style={{width: '10rem', height: "7.5rem"}}>
                                    <span>
                                    {skill}
                                    </span>
                                        </div>
                                    </div>
                                ))}
                    </div>
                    <button
                        className='rec_button huge_button accent'
                        onClick={() => setReady(true)}
                    >Креирај</button>
                </div>



                <div className={'menuBarSpacer'}/>
                <MenuBar/>
            </div>}
        </div>
    );
}

export default CreateEvent;