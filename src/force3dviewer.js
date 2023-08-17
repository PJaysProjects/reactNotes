import ForceGraph3D from 'react-force-graph-3d'


function Force3dViewer({fgRef,graphData,handleRightClick,handleClick,}) {

    return (<div>
    {initialSettings ? <ForceGraph3D ref={fgRef} graphData={graphData} onNodeRightClick={handleRightClick} onNodeClick={handleClick} /> : <ForceGraph3D ref={fgRef} graphData={jsonData} onNodeRightClick={handleRightClick} onNodeClick={handleClick} />}
    </div>
    )
}