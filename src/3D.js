import { CSS2DRenderer, CSS2DObject } from 'https://unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';
import ForceGraph3D from '3d-force-graph'


const Graph = ForceGraph3D({
    extraRenderers: [new CSS2DRenderer()],
    antialias: true
})
    (document.getElementById('3d-graph'));

Graph.jsonUrl('./output.json')
    .nodeAutoColorBy('group')
    .nodeThreeObject(node => {
        const nodeEl = document.createElement('div');
        nodeEl.textContent = node.label;
        nodeEl.style.color = '#61FF3E';
        nodeEl.className = 'node-label';
        return new CSS2DObject(nodeEl);
    })
    .nodeThreeObjectExtend(true).numDimensions(3).nodeColor('#ffffff')

Graph.linkDirectionalArrowLength(3.5).linkDirectionalArrowRelPos(1)



Graph.onNodeClick((node, event) => {
    //this fails if numDimensions(2)

    // Aim at node from outside it
    const distance = 100;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    const newPos = node.x || node.y || node.z
        ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
        : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

    Graph.cameraPosition(
        newPos, // new position
        node, // lookAt ({ x, y, z })
        1000  // ms transition duration
    );

    console.log(event)
})