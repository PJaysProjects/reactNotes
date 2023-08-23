import React, {useState } from 'react'
import CustomButton from './custombutton';
import './buttoncontainer.css'


//need a forloop for the buttoncontainer
const ButtonContainer = ({ buttonArray, buttonFunction, buttonHandler, isActive }) => {


    const buttons = buttonArray.map(name => <CustomButton buttonName={name} buttonFunction={buttonFunction } buttonHandler={buttonHandler} key={name} isActive={isActive.hasOwnProperty(name) ? isActive[name] : false}/>)

    return (
        <div className='buttoncontainer'>
            {buttons}
        </div>
    )
}

export default ButtonContainer;
