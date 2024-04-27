import React, {useEffect, useContext, useState} from 'react';
import '../components.css';
import {auth, db, storage, userDocRef} from "../firebase";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {
    collection,
    doc,
    onSnapshot,
    getDoc,
    updateDoc,
    query,
    where,
    getDocs,
    orderBy,
    setDoc
} from "firebase/firestore";
import {DataContext} from "../DataContext";
import MenuBar from "./MenuBar";
import {signOut} from "firebase/auth";
import defaultUserPhoto from "../img/user.png"
import showOverlay from "../functions/showOverlay";
import MessageBox from "./MessageBox";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import Loading from "./Loading";
import EventCard from "./EventCard";

function Profile(){
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const {location, setLocation} = useContext(DataContext)
    const {userSkills, setUserSkills} = useContext(DataContext)
    const {name, setName} = useContext(DataContext)
    const [pPhotoURL, setPPhotoURL] = useState(defaultUserPhoto);
    const [uploadFinished, setUploadFinished] = useState(true);
    const [display, setDisplay] = useState("none");
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [declinedEvents, setDeclinedEvents] = useState([]);
    const [passedEvents, setPassedEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);

    const [newName, setNewName] = useState("");
    const [newLocation, setNewLocation] = useState(location);
    const [newSkills, setNewSkills] = useState(userSkills);

    const [showDec, setShowDec] = useState(false);
    const [showPsd, setShowPsd] = useState(false);
    const [showCrt, setShowCrt] = useState(false);

    const locArray  = [
        "Цела Македонија",
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



    const fetchPhoto = async () => {
        try {
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {
                const photoURL = docSnapshot.data().photoURL;

                if (photoURL) setPPhotoURL(photoURL);
                else setPPhotoURL(defaultUserPhoto);
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    };

    async function changeSkills(){
        setUserSkills(newSkills);
        let dbDoc = {
            skills: newSkills
        }
        await updateDoc(userDocRef, dbDoc);

        setDisplay('none');
    }
    async function changeName(){
        setName(newName);
        let dbDoc = {
            name: newName
        }
        await updateDoc(userDocRef, dbDoc);

        await updateDoc(doc(db, 'publicUserData', user.uid), {
            name: newName,
        });

        setDisplay('none');
    }
    async function changeLocation(){
        setLocation(newLocation);
        let dbDoc = {
            location: newLocation
        }
        await updateDoc(userDocRef, dbDoc);
        setDisplay('none');
    }


    const fetchEvents = async () => {
        if(!user) return;

        const currentDate = new Date();
        const q = query(collection(db, "eventData"));
        const querySnapshot = await getDocs(q);
        const upList = [];
        const decList = [];
        const psList = [];
        const crList = [];

        querySnapshot.forEach((doc) => {
            const joinedBy = doc.get('participants');
            const declinedBy = doc.get('declinedBy');
            const createdBy = doc.get('createdBy');
            const eventDate = new Date(doc.data().date);
            if(eventDate >= currentDate && Array.isArray(joinedBy) && joinedBy.includes(user.uid)){
                upList.push(doc.id);
            }
            if(eventDate < currentDate && Array.isArray(joinedBy) && joinedBy.includes(user.uid)){
                psList.push(doc.id);
            }
            if(eventDate >= currentDate && Array.isArray(declinedBy) && declinedBy.includes(user.uid)){
                decList.push(doc.id);
            }
            if(createdBy===user.uid){
                crList.push(doc.id);
            }
        });

        setUpcomingEvents(upList);
        setDeclinedEvents(decList);
        setPassedEvents(psList);
        setCreatedEvents(crList);

    };

    useEffect(() => {
        if(!user) navigate('/login')
    }, [user]);

    useEffect(() => {
        fetchPhoto();
        fetchEvents();
    }, []);

    useEffect(() => {
        if(!uploadFinished) showOverlay("Loading", 'show')
        else showOverlay("Loading", 'hide')
    }, [uploadFinished]);

    function handleLogout() {
        signOut(auth);
    }

    const handleFileUpload = async (event) => {

        const file = event.target.files[0];
        const stRef = ref(storage, `profileImages/${user.uid}`);
        setUploadFinished(false);
        try {
            const snapshot = await uploadBytes(stRef, file);
            const downloadURL = await getDownloadURL(stRef);
            setPPhotoURL(downloadURL);
            await setUploadFinished(true)
            setDisplay('none')
            await updateDoc(userDocRef, {
                photoURL: downloadURL,
            });
            await updateDoc(doc(db, 'publicUserData', user.uid), {
                photoURL: downloadURL,
            });
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };


    function cancelPhotoChange (){
        setDisplay('none')
    }
    function changePhoto (){
        setDisplay('changePhoto')
    }

    const handleSkillsChange = (event, skill) => {
        const isChecked = event.target.checked;

        setNewSkills((prevSkills) => {
            if (isChecked) {
                return [...prevSkills, skill];
            } else {
                return prevSkills.filter((selectedSkill) => selectedSkill !== skill);
            }
        });
    };




    return (
       <div id={'profile'} className={'flex_col'}>
           <Loading />
            <div id={'nameRow'} className={'flex_row'}>
                <h1>{name}</h1>
                <div
                    id="profilePhoto"
                    onClick={changePhoto}
                    style={{ backgroundImage: `url(${pPhotoURL})`, backgroundSize: 'cover' }}
                />

            </div>

            {display==='changePhoto' && <MessageBox type={'Cancel'} onCancel={cancelPhotoChange} ID={'confirmPhotoChange'}>
                <h1>Промена на профилна</h1>
                <input id={'profilePhotoFileInput'}
                       type="file"
                       onChange={handleFileUpload} />
            </MessageBox>}
           <hr style={{width: '100%', opacity: '0.2'}}/>
            <h3>Следни настани</h3>
           <section className={'horiz_gallery'}>
               {upcomingEvents.map((event) => (
                   <EventCard key={event} eventID={event}
                              swipe={false} partc={true}
                              chMind={'decline'} galleryRefresh={fetchEvents}/>
               ))}
               {upcomingEvents.length===0 && <p> Нема такви настани.</p>}
           </section>

           <hr style={{width: '100%', opacity: '0.2'}}/>

           <div className={'flex_col'}>
               <h3>Настани креирани од вас</h3>
               {!showCrt && <button className={'rec_button'}
                       onClick={()=>setShowCrt(true)}
               >Прикажи</button>}
               {showCrt && <button className={'rec_button'}
                       onClick={()=>setShowCrt(false)}
               >Затвори</button>}
           </div>
           {showCrt && <section className={'horiz_gallery'}>
               {createdEvents.map((event) => (
                   <EventCard key={event} eventID={event} swipe={false}/>
               ))}
               {createdEvents.length===0 && <p> Нема такви настани.</p>}
           </section>}

        <hr style={{width: '100%', opacity: '0.2'}}/>

           <div className={'flex_col'}>
               <h3>Одбиени Настани</h3>
               {!showDec && <button className={'rec_button'}
                       onClick={()=>setShowDec(true)}
               >Прикажи</button>}
               {showDec && <button className={'rec_button'}
                       onClick={()=>setShowDec(false)}
               >Затвори</button>}
           </div>
           {showDec && <section className={'horiz_gallery'}>
               {declinedEvents.map((event) => (
                   <EventCard key={event} eventID={event}
                              swipe={false} partc={false}
                              chMind={'join'} galleryRefresh={fetchEvents}/>
               ))}
               {declinedEvents.length===0 && <p> Нема такви настани.</p>}
           </section>}


           <hr style={{width: '100%', opacity: '0.2'}}/>

           <div className={'flex_col'} style={{maxWidth: '100%'}}>
               <h3>Завршени Настани</h3>
               {!showPsd && <button className={'rec_button'}
                       onClick={()=>setShowPsd(true)}
               >Прикажи</button>}
               {showPsd && <button className={'rec_button'}
                       onClick={()=>setShowPsd(false)}
               >Затвори</button>}
           </div>
           {showPsd && <section className={'horiz_gallery'}>
               {passedEvents.map((event) => (
                   <EventCard key={event} eventID={event} swipe={false} partc={true}  />
               ))}
               {passedEvents.length===0 && <p> Нема такви настани.</p>}
           </section>}

           <hr style={{width: '100%', opacity: '0.2'}}/>



           <button className={'rec_button huge_button '} onClick={()=>setDisplay('changeName')}>
                Промена на име
           </button>

           {display==='changeName' && <MessageBox type={'ConfirmCancel'}
                                                  onConfirm={changeName}
                                                  onCancel={()=>setDisplay('none')}
                                                  ID={'confirmLocationChange'}>
               <input
                   id={'changeNameInput'}
                   placeholder={'Ново Име'}
                   type={"text"}
                   value={newName}
                   onChange={(e) => setNewName(e.target.value)}/>
           </MessageBox>}

           <button className={'rec_button huge_button '} onClick={()=>setDisplay('changeLocation')}>
                Промена на локација
            </button>

           {display==='changeLocation' && <MessageBox type={'ConfirmCancel'}
                                                      onConfirm={changeLocation}
                                                      onCancel={()=>setDisplay('none')}
                                                      ID={'confirmLocationChange'}>
               <select id="location"
                       value={newLocation}
                       onChange={(e)=>setNewLocation(e.target.value)}
                       >
                   {locArray.map((location) => (
                       <option key={location} value={location}>{location}</option>
                   ))}
               </select>
           </MessageBox>}
           <button className={'rec_button huge_button '} onClick={()=>setDisplay('changeSkills')}>
                Додади или отстрани вештина
            </button>

           {display==='changeSkills' && <MessageBox type={'ConfirmCancel'}
                                                      onConfirm={changeSkills}
                                                      onCancel={()=>setDisplay('none')}
                                                      ID={'confirmSkillsChange'}>
               {skillsArray.map((skill)=>(
                   <div className="checkBT">
                       <input type="checkbox"
                              id={skill}
                              value={skill}
                              checked={newSkills.includes(skill)}
                              onChange={(e) => handleSkillsChange(e, skill)}
                       />

                       <div>
                                    <span>
                                    {skill}
                                    </span>
                       </div>
                   </div>
               ))}
           </MessageBox>}


           <button className={'rec_button huge_button accent'} onClick={handleLogout}>
               Одјава
           </button>

           <div className={'menuBarSpacer'}/>
            <MenuBar/>
        </div>

    );
}

export default Profile;