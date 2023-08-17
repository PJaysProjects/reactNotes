
function Overlay({nodeName}) {


    return(
        <div className='overlay'>
        <input className="searchbar">
        </input>
        <input type='text' className="currentnode" value={nodeName}>
            
        </input>
        </div>
    )
}

export default Overlay;