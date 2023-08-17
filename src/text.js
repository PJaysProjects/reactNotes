import React, { useState } from 'react'
import './text.css'


function TextBox({text,changeHandler}){
    return(
        <textarea  defaultValue={text} className="textbox">
            
        </textarea>
    )
}

export default TextBox