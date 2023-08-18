
import Scrollbox from './scrollbox';
import ButtonContainer from './buttonContainer';
import Overlay from './overlay';

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import ForceGraph3D from 'react-force-graph-3d'
import useKeypress from 'react-use-keypress';

import * as THREE from 'three';

import { useCallback, useEffect, useRef, useState } from 'react';

import './text.css'
import './App.css';

import './scrollbox.css'
import './datacontainer.css'
import './buttoncontainer.css'


const test3dNode = {
  "nodes": [
    {
      "id": "id1",
      "name": "name1",
      "val": 1,
      'text': ['whoa....', 'what do we have here?']
    },
    {
      "id": "id2",
      "name": "name2",
      "val": 10
    }
  ],
  "links": [
    {
      "source": "id1",
      "target": "id2"
    }
  ]
}




function App() {
  const css2renderGuy = [new CSS2DRenderer()];

  const [jsonObject, setJsonObject] = useState(test3dNode)
  const [currentNode, setNode] = useState(null)
  const [currentButtons, setButtons] = useState([])
  const [currentText, setText] = useState([])
  const [currentKeyPress, setKeypress] = useState(null)
  const [currentNodeName, setNodeName] = useState("")
  const [currentToggle, setToggle] = useState(true)
  const [currentNodeQueue,setNodeQueue] = useState(new Set())

  const colorMap = {
    default: '#e5e5e5',
    highlighted: '#00E5E5',
    connecting: '#00E553'
  }

  //keys
  const allowedKeys = ['n', 'c']

  function testUp() {
    setKeypress(null)
    
  }

  useKeypress(allowedKeys, (event) => {
    if (currentKeyPress != event.key) {
      setKeypress(event.key)
      console.log(event.key)
    }
  });

  //clicks
  const fgRef = useRef()

  //--Focus Node
  const handleRightClick = useCallback(node => {

    const distance = 100;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    const newPos = node.x || node.y || node.z
      ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
      : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

    fgRef.current.cameraPosition(
      newPos, node, 1000
    )


  })

  //--Inspect Node. Get Buttons/attributes. Show name in input field
  const handleClick = useCallback(node => {
    if (currentKeyPress === null) {
      setButtons(Object.keys(node))
      setNode(node)
      setNodeName(node.name)
    }
    if (currentKeyPress == 'c') {

      //change color, works but doesn't work at the same time
      console.log(node.color)
      console.log(node)
      node.color = '#61FF3E'
      jsonObject.nodes[node.index] = node
      setNode(node)
      setNodeName(node.name)
      
      //boilerplate to reload the nodes (look into solutions for this)
      var nodes = jsonObject.nodes
      var links = jsonObject.links
      var newNodes = nodes
      var newLinks = links
      setJsonObject({ nodes: newNodes, links: newLinks }) 
    }
  })

  function createNode(){}


  //pretty stuff
  useEffect(() => {
    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = 0.5;
    bloomPass.radius = 1;
    bloomPass.threshold = 0.1;
    fgRef.current.postProcessingComposer().addPass(bloomPass);
  }, []);

  function changeColor(node,newColor){
      var oldColor = node.color
      

  }


  function changeAttribute(node,attribute,value){
    
  }
    
  function createNode(jsonObject){
    var newIndex = jsonObject.nodes.length
      var newId = newIndex.toString()

      var newColor = colorMap.highlighted
      console.log(newColor)

      var newName = "New Node"
      var newLabel = newId + ": " + newName

    
      var newNode = {}
      newNode.color = newColor


      newNode.id = newId
      newNode.index = newIndex
      newNode.name = newName
      newNode.label = newLabel
      newNode.val = 4
    return newNode
  }

function resetNodeColor(){
  
}

function queueNode(node){
      var newQueue = currentNodeQueue.add(node.index)
      setNodeQueue(newQueue)

}

function dequeueNodes(){
  for (const element of currentNodeQueue.values()){
      var node = jsonObject.nodes[element]
      node.color = colorMap.default
      var newNodes = jsonObject.nodes
      newNodes[element] = node
      var newLinks = jsonObject.links
      setJsonObject({ nodes: newNodes, links: newLinks })
  }
}

function refreshGraph(){

}

  const handleNewNode = useCallback((event) => {
    if (currentKeyPress == 'n') {

      var newNode = createNode(jsonObject)
      var newQueue = currentNodeQueue.add(newNode.index)
      setNodeQueue(newQueue)

      var mousex = event.clientX
      var mousey = event.clientY

      var coordinates = fgRef.current.screen2GraphCoords(mousex, mousey)
      newNode.x = coordinates.x
      newNode.y = coordinates.y
      newNode.z = coordinates.z

      var nodes = jsonObject.nodes
      var links = jsonObject.links
      var newNodes = [...nodes, newNode]
      var newLinks = links

      setJsonObject({ nodes: newNodes, links: newLinks })

    }
  })

  const handleNotes = useCallback(() => {
    const node = currentNode
    setText([])
    if (node.notes) {
      const notesArray = node.notes.map(notes => notes.content)
      setText(notesArray)
    }
  })

  function toggleLabels() {
    if (currentToggle == true) {
      setToggle(false)
    } else {
      setToggle(true)
    }
  }


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      const jsonData = JSON.parse(fileContent);
      // Use the jsonData as needed in your app

      setJsonObject(jsonData)


    };

    
  

    reader.readAsText(file);
  };

  function handleDownload(data) {
      const jsonData = JSON.stringify(data);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

  //component

  return (
    <div className="root">

      <div className="maincontainer">
        <input type="file" accept='.json' onChange={handleFileUpload} />
        
        <button onClick={()=> handleDownload(jsonObject)}>Save File
          </button>
        <div className='datacontainer'>

          <div >
            <label for="myCheckbox" className='myCheckbox'>Hide labels?</label>
            <input type="checkbox" id="myCheckbox" name="myCheckbox" onChange={toggleLabels} />
          </div>
          <Overlay nodeName={currentNodeName} />
          <ButtonContainer buttonArray={currentButtons} buttonFunction={handleNotes} />
          <Scrollbox textEntries={currentText} />
        </div>
        <div className='graphicscontainer' tabIndex={1} onKeyUp={testUp}>
          <ForceGraph3D extraRenderers={css2renderGuy} ref={fgRef} graphData={jsonObject}

            onNodeRightClick={handleRightClick}
            onNodeClick={handleClick}
            onBackgroundClick={handleNewNode}

            nodeThreeObject={node => {
              const nodeEl = document.createElement('div');
              nodeEl.textContent = node.label;
              nodeEl.style.color = '#e5e5e5';
              nodeEl.style.size = 8;
              { currentToggle ? nodeEl.style.opacity = .65 : nodeEl.style.opacity = 0 }
              nodeEl.className = 'node-label';
              
              return new CSS2DObject(nodeEl);
            }}
            nodeThreeObjectExtend={true}
            
            backgroundColor='#000000'
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}

            nodeResolution={32}

            

          />

        </div>

      </div>

    </div>
  );
}

export default App;
