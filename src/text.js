import React, { useEffect, useRef, useState } from 'react'
import './textNext.css'


const TextBox = ({ text, id, handler, isNew = false, handleDrag, handleDrop }) => {

    const [currentText, setText] = useState(text)
    const toggle = true

    const onCreationRef = useRef(null)

    useEffect(() => {

        
    }, [onCreationRef])

    useEffect(() => {

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

    const reformatTextArea = (event) => {
        
        if (event.target.scrollHeight > 100){
            event.target.style.height = event.target.scrollHeight.toString() + 'px'
        }
    }

    //identifier could be 'textbox-attribute'... the attribute is programmatically determined, I can use it to access the appropriate function and I can CSS style the entries dynamically

    //draggable={!isNew} onDragStart={dragStart} onDragOver={allowDrop} onDrop={drop} I am having issues with these functions

    const identifier = 'textbox' + id.toString()

    return (<div className="notebox" key={text + id.toString()} draggable={!isNew} onDragStart={dragStart} onDragOver={allowDrop} onDrop={drop}>
        {<textarea defaultValue={currentText} className="newnote" id={id} placeholder='new entry..' ref={onCreationRef} onChange={!isNew ? (event) =>{handler(event)
        reformatTextArea(event)} : null} />}
        {
            isNew && <button className='newentrybutton' onClick={() => {
                var newEntry = document.getElementById(id.toString())
                console.log(newEntry.value)

                handler(newEntry.value)
                newEntry.value = ""
            }}>add</button>
        }

    </div >
    )
}

export default TextBox