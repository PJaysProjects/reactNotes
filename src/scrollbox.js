import TextBox from "./text";
import NewEntry from "./newentry";
import './text.css'

const Scrollbox = ({textEntries,editHandler,toggler,addHandler}) => {
    
    
    const data = textEntries.map((text,index) => <TextBox text={text} key={text} id={index} handler={editHandler}/>)
    data.push(<NewEntry id={data.length + 1} addHandler={addHandler} key="newentry"/>)
    
    
    return (
        <div className="scrollbox">
           {toggler ? data : null}
        </div>
    )
}

export default Scrollbox;