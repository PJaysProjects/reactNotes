import TextBox from "./text";
import { useEffect, useState } from "react";
import './scrollbox.css'

const Scrollbox = ({ textEntries, editHandler, toggler, addHandler }) => {
    const [currentDragged, setDragged] = useState(null)
    const [currentTextEntries, setTextEntries] = useState([])
   
    useEffect(()=>{
        setTextEntries(textEntries)
    },[textEntries])

    const handleDrag = (object) => {
        setDragged(object)
        
    }

    const handleDrop = (object) => { 
        
        let target = object.target
        if(target.tagName === 'TEXTAREA'){
            target = target.parentNode
        }
        const targetText = target.children[0].defaultValue
        const draggedText = currentDragged.children[0].defaultValue

        const targetId = target.children[0].id
        const draggedId = currentDragged.children[0].id

        var newTextEntries = currentTextEntries
        console.log(newTextEntries)

        newTextEntries[targetId] = draggedText
        newTextEntries[draggedId] = targetText

        setTextEntries(newTextEntries)
        setDragged(null)
        
    }

    const renderData = () => {
        //rerenders 4 times
        const data = currentTextEntries.map((text, index) => <TextBox text={text} key={text} id={index} handler={editHandler} handleDrag={handleDrag} handleDrop={handleDrop} />)

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