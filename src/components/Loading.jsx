import React from 'react';
import '../components.css';

export default function Loading(props){

    return (
        <div id={'Loading'}>
            <div id={'blurlayer'} className={'fullscreen blur'}/>
            <div id={'LoadingWheel'} className={"card square center"} style={{backgroundColor: 'var(--accent-color)'}}>
                <div className={'spinner'}>

                </div>
                {props.message===undefined && <h2>Loading...</h2>}
                {props.message}
            </div>
        </div>

    )

}