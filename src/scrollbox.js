import TextBox from "./text";
import './text.css'

const Scrollbox = ({textEntries,editHandler,toggler}) => {
    console.log(textEntries)
    console.log('step 3')
    
    const data = textEntries.map((text,index) => <TextBox text={text} key={text} id={index} handler={editHandler}/>)

    
    
    return (
        <div className="scrollbox">
           {toggler ? data : null}
        </div>
    )
}

export default Scrollbox;