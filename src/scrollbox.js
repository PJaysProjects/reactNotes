import TextBox from "./textNew";
import { useEffect, useState, useRef } from "react";
import './scrollbox.css'
import { useCommonVariablesContext, TextProvider } from "./commonVariables";

const Scrollbox = ({ text,editHandler, toggler, addHandler, dragUpdater}) => {
    const {currentText, updateText} = useCommonVariablesContext()
    
    const [currentDragged, setDragged] = useState(null)
    
    
   
    useEffect(()=>{
        
        updateText(text)
        
    },[text])

    

    

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
        const data = currentText.map((text, index) => <TextBox text={text} key={text + index.toString()} id={index} handler={editHandler} handleDrag={handleDrag} handleDrop={handleDrop}/>)

        data.push(<TextBox id={data.length + 1} handler={addHandler} key="newentry" isNew={true} />)
        
        return data
    }

    return (
        <TextProvider>
        <div className="scrollbox">
            {toggler ? renderData() : null}
        </div>
        </TextProvider>
    )
}

export default Scrollbox;