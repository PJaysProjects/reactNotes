import React, { useEffect,useState } from 'react'
import './text.css'


const TextBox = ({text, id, handler}) => {

    //identifier could be 'textbox-attribute'... the attribute is programmatically determined, I can use it to access the appropriate function and I can CSS style the entries dynamically

    const identifier = 'textbox' + id.toString()

    return(
        <textarea  defaultValue={text} className="textbox" id={id} style={{height: '100px'}} onKeyUp={handler}/>
    )
}

export default TextBox