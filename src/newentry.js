import './text.css'

const NewEntry = ({id,addHandler}) => {

    //identifier could be 'textbox-attribute'... the attribute is programmatically determined, I can use it to access the appropriate function and I can CSS style the entries dynamically

    const identifier = 'textbox' + id.toString()

    return(
        <div className='newentry'>
        <textarea placeholder='new entry...' className="newentrybox" id={id} style={{height: '100px'}}/>
        <button className='newentrybutton' onClick={()=>{
            var newEntry = document.getElementById(id.toString())
            console.log(newEntry.value)
            
            addHandler(newEntry.value)
            newEntry.value = ""}}>add</button>
        </div>
    )
}

export default NewEntry