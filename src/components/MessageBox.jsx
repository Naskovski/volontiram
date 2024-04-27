import React, { useEffect, useState, useContext } from 'react';
import '../components.css';
import showOverlay from "../functions/showOverlay";

export default function MessageBox(props){

    return (
        <div id={props.ID} className={"card flex_col"}>
        <section id={'question'}>
            {props.children}
        </section>

        {props.type==='YesNo' && <section id={'buttons'}>
            <button className={'rec_button'} onClick={props.onNo}>
                Не
            </button>
            <button className={'rec_button accent'} onClick={props.onYes}>
                Да
            </button>

        </section>}
        {props.type==='ConfirmCancel' && <section id={'buttons'}>
            <button className={'rec_button'} onClick={props.onCancel}>
                Откажи
            </button>
            <button className={'rec_button accent'} onClick={props.onConfirm}>
                Потврди
            </button>

        </section>}
        {props.type==='Cancel' && <section id={'buttons'}>
            <button className={'rec_button'} onClick={props.onCancel}>
                Откажи
            </button>
        </section>}


        </div>
    )

}