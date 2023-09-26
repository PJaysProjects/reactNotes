import React, { useEffect, useRef, useState } from 'react'
import './textNext.css'


const TextBox = ({ text, id, handler, isNew = false, handleDrag, handleDrop}) => {

    const [currentText, setText] = useState(text)
    const toggle = true

    const onCreationRef = useRef(null)
    
    useEffect(()=>{

        
    },[onCreationRef])

    useEffect(()=>{

    })
    function dragStart(event) {
        handleDrag(onCreationRef)
        
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {

        handleDrop(onCreationRef)

    }

    //identifier could be 'textbox-attribute'... the attribute is programmatically determined, I can use it to access the appropriate function and I can CSS style the entries dynamically

    //draggable={!isNew} onDragStart={dragStart} onDragOver={allowDrop} onDrop={drop} I am having issues with these functions

    const identifier = 'textbox' + id.toString()

    return (<div className="notebox" key={text +id.toString()} draggable={!isNew} onDragStart={dragStart} onDragOver={allowDrop} onDrop={drop}>
        {!isNew &&<div id={id} onKeyUp={!isNew ? handler : null}  ref={onCreationRef}>{currentText}</div>}
        {
            isNew && <div><textarea key={text +id.toString()} className='newnote' id={id} ></textarea>
            <button className='newentrybutton' onClick={() => {
                var newEntry = document.getElementById(id.toString())
                console.log(newEntry.value)

                handler(newEntry.value)
                newEntry.value = ""
            }}>add</button>
            </div>
        }

    </div >
    )
}

export default TextBox