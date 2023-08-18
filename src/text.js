import React, { useEffect,useState } from 'react'
import './text.css'


function TextBox({text, changeHandler}){

   


    return(
        <textarea  defaultValue={text} className="textbox" id='textbox' style={{height: '100px'}}/>
            
        
    )
}

export default TextBox