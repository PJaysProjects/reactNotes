import React, { useEffect,useState } from 'react'
import './text.css'


const TextBox = ({text, id, handler}) => {

    const identifier = 'textbox' + id.toString()

    return(
        <textarea  defaultValue={text} className="textbox" id={id} style={{height: '100px'}} onKeyUp={handler}/>
    )
}

export default TextBox