import React, {useState } from 'react'
import CustomButton from './custombutton';
import './buttoncontainer.css'


//need a forloop for the buttoncontainer
function ButtonContainer({ buttonArray, buttonFunction }) {

    const buttons = buttonArray.map(name => <CustomButton buttonName={name} buttonFunction={buttonFunction } key={name} />)

    return (
        <div className='buttoncontainer'>
            {buttons}
        </div>
    )
}

export default ButtonContainer;
