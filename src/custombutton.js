import React, {useState } from 'react'
import './buttons.css'

const CustomButton = ({ buttonName, buttonFunction, buttonHandler, isActive }) => {

       /*  const [isActive, setIsActive] = useState(true) */
    
        const toggler = () => {
            
           /*  setIsActive(prevState => !prevState) */
            isActive = !isActive
            return isActive
        }
    
        return (
            <button className={isActive ? 'button-toggled': 'custombutton'} id={buttonName} onClick={(event)=>{
            
            buttonHandler(event,toggler())
            buttonFunction()
            }}>
                {buttonName} 
            </button>
        )
    }

export default CustomButton;