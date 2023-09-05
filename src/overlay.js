
function Overlay({ nodeName, searchFunction }) {


    return (
        <div className='overlay'>
            <div className="sidebyside">
                <input type='text' placeholder='search here...' className="searchbar" onKeyUp={(event) => {
                    searchFunction(event.target.value)
                }}>
                </input>
                {/* <button className="custombutton">Clear</button> */}
            </div>
            <input type='text' className="currentnode" value={nodeName} placeholder="selected node name...">

            </input>
        </div>
    )
}

export default Overlay;