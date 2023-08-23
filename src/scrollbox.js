import TextBox from "./text";
import './text.css'

const Scrollbox = ({textEntries,editHandler,toggler}) => {
    
    var data = textEntries.map((text,index) => <TextBox text={text} key={index} id={index} handler={editHandler}/>)
    
    return (
        <div className="scrollbox">
           {toggler ? data : null}
        </div>
    )
}

export default Scrollbox;