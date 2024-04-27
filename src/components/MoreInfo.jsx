import React, { useEffect, useState, useContext } from 'react';
import '../components.css';
import {auth, userDocRef} from "../firebase";
import {onSnapshot, updateDoc} from "firebase/firestore";
import {DataContext} from "../DataContext";
import {useNavigate} from "react-router-dom";
import logo from '../img/Google__G__Logo.svg';
import {useAuthState} from "react-firebase-hooks/auth";

async function updateFirebase(location, skills){
    let dbDoc = {
        location: location,
        skills: skills
    }
    await updateDoc(userDocRef, dbDoc);
}

export default function MoreInfo(){
    const [user, loading] = useAuthState(auth);

    const [display, setDisplay] = useState('landing');
    const navigate = useNavigate();

    //const {name, setName} = useContext(DataContext);
    const {edit, setEdit} = useContext(DataContext);
    const {location, setLocation} = useContext(DataContext);
    const {userSkills, setUserSkills} = useContext(DataContext);

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


    const unsub = onSnapshot(userDocRef, (doc) => {
        if (doc.get('name') !== undefined && edit===false) {
            //setName( doc.get('name'));
            setLocation(doc.get('location'))
        }
    });

    useEffect(()=>{
        return () =>{
            unsub();
        };
    });

    useEffect(() => {
        if (loading) {
            return;
        }
        if (!user) navigate("/login");
    }, [user, loading]);

    function changeLocation(event) {
        const selectedLocation = event.target.value;
        setLocation(selectedLocation);
    }

    function startProcess() {
        setDisplay('location');
        setEdit(true);
    }


    function closePopUp(){
        updateFirebase(location, userSkills);
        navigate("/homepage")
        setEdit(false);
    }

    return (
        <div id={'MoreInfo'} className={'card bigCard center'}>

                {display==='landing' && <div className={'flex_col'} style={{width: '16rem'}}>
                    <img src={logo} alt={'small logo'}/>
                    <h1>Потребни ни се повеќе информации за вас</h1>
                    <p>Информациите ни се потребни за да ви дадеме порелевантни можности за вас</p>
                    <button onClick={startProcess}>Следно</button>
                </div>}

                {display==='location' && <div className={'flex_col'}>
                    Сакам да волонтирам во:
                    <select id="location" value={location} onChange={changeLocation}>
                        {locArray.map((location) => (
                            <option key={location} value={location}>{location}</option>

                        ))}

                    </select>
                    <p>Избрана локација: {location}</p>
                    <button onClick={() => setDisplay('skills')}>Следно</button>

                    <p className={'bottomCenter'}><b>.</b> . </p>
                </div>}

                {display==='skills' && <div className={'flex_col'}>
                    <h3>Вештини</h3>
                    <div className={'flex_gallery'}>
                        {skillsArray.map((skill)=>(
                            <div className="checkBT">
                                <input type="checkbox"
                                       id={skill}
                                       value={skill}
                                       onChange={(e) => {
                                           const isChecked = e.target.checked;
                                           setUserSkills((prevSkills) => {
                                               if (isChecked) {
                                                   return [...prevSkills, skill];
                                               } else {
                                                   return prevSkills.filter((selectedSkill) => selectedSkill !== skill);
                                               }
                                           });
                                       }}/>

                                <div>
                                    <span>
                                    {skill}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setDisplay('goodbye')}>Следно</button>
                    <p className={'bottomCenter'}><b>. .</b></p>
                </div>}

                {display==='goodbye' && <div className={'flex_col'}>
                    <img src={logo} alt={'big logo'}/>
                    <h1>Ајде да волонтираме!</h1>


                    <button onClick={closePopUp}>Затвори</button>
                </div>}
        </div>
    )

}