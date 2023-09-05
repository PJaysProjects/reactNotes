import React, { useEffect, useState } from 'react'
import './textNext.css'


const TextBox = ({ text, id, handler, isNew = false, handleDrag, handleDrop }) => {

    const [currentText, setText] = useState(text)

    const [currentDraggedElement, setDraggedElement] = useState(null)

    function dragStart(event) {
        handleDrag(event.target)
        
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        let target = event.target
        if (target.tagName === 'TEXTAREA') {
            target = target.parentNode
        }
        
        handleDrop(event)

    }

    //identifier could be 'textbox-attribute'... the attribute is programmatically determined, I can use it to access the appropriate function and I can CSS style the entries dynamically

    //draggable={!isNew} onDragStart={dragStart} onDragOver={allowDrop} onDrop={drop} I am having issues with these functions

    const identifier = 'textbox' + id.toString()

    return (<div className="notebox" key={text} draggable={!isNew} onDragStart={dragStart} onDragOver={allowDrop} onDrop={drop}>
        <textarea defaultValue={currentText} className="newnote" id={id} style={{ height: '100px' }} onKeyUp={!isNew ? handler : null} placeholder='new entry..' onDrop={handler}/>
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