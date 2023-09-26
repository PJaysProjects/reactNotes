

function Overlay({ nodeName, searchFunction, renameFunction}) {
    
    const blurControl = (event)=>{
        event.target.value = null

    }

    return (
        <div className='overlay'>
            <div className="sidebyside">
                <input type='text' placeholder='search here...' className="searchbar" onKeyUp={(event) => {
                    searchFunction(event.target.value)
                }}>
                </input>
                {/* <button className="custombutton">Clear</button> */}
            </div>
            <input type='text' className="currentnode" value={nodeName} placeholder="selected node name..." onChange={renameFunction} />

            
        </div>
    )
}

export default Overlay;