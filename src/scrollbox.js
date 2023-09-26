import TextBox from "./textNew";
import { useEffect, useState, useRef } from "react";
import './scrollbox.css'

const Scrollbox = ({ textEntries, editHandler, toggler, addHandler, dragUpdater}) => {
    const [currentDragged, setDragged] = useState(null)
    const [currentTextEntries, setTextEntries] = useState([])
    
   
    useEffect(()=>{
        setTextEntries(textEntries)
    },[textEntries])

    

    

    const handleDrag = (object) => {
        setDragged(object)
        
    }

    const handleDrop = (object) => { 
        const targetText = object.current.textContent
        const draggedText = currentDragged.current.textContent
        
        currentDragged.current.textContent = targetText
        object.current.textContent = draggedText

        dragUpdater(currentDragged)
        dragUpdater(object)
    }

    const renderData = () => {
        //rerenders 4 times

        //PERHAPS USE useRef TO REFERENCE THE SPECIFIC TEXTBOX
        const data = currentTextEntries.map((text, index) => <TextBox text={text} key={text + index.toString()} id={index} handler={editHandler} handleDrag={handleDrag} handleDrop={handleDrop}/>)

        data.push(<TextBox id={data.length + 1} handler={addHandler} key="newentry" isNew={true} />)
        
        return data
    }

    return (
        <div className="scrollbox">
            {toggler ? renderData() : null}
        </div>
    )
}

export default Scrollbox;