
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
      'notes': [{ content: 'whoa....' }, { content: 'what do we have here?' }, { content: "hopefully \n something \n cool" }]
    },
    {
      "id": "id2",
      "name": "name2",
      "val": 10,
      'notes': [{ content: "hello there" }]
    }
  ],
  "links": [
    {
      "source": "id1",
      "target": "id2"
    }
  ]
}




const App = () => {

  const css2renderGuy = [new CSS2DRenderer()];

  const queueObject = {
    'n': [],
    'c': [],
    'none': []

  }

  const buttonToggleObject = {

  }

  const [jsonObject, setJsonObject] = useState(test3dNode)
  const [currentNode, setNode] = useState(null)
  const [currentButtons, setButtons] = useState([])
  const [currentText, setText] = useState([])
  const [currentKeyPress, setKeypress] = useState(null)
  const [currentNodeName, setNodeName] = useState("")
  const [currentLabelToggle, setLabelToggle] = useState(true)
  const [currentContentToggle, setContentToggle] = useState(false)
  const [currentNodeQueue, setNodeQueue] = useState(queueObject)
  const [currentButtonToggles, setButtonToggles] = useState(buttonToggleObject)


  const colorMap = {
    default: '#e5e5e5',
    highlighted: '#00E5E5',
    connecting: '#00E553',
    sunny: '#FFEBB0',
    pale: '#e5e5e5'
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

    const cameraConfig = [newPos, node, 1000]

    var queueObject = currentNodeQueue
    queueObject['none'].push(cameraConfig)
    setNodeQueue(queueObject)

  })

  //--Inspect Node. Get Buttons/attributes. Show name in input field
  const handleClick = useCallback(node => {
    console.log("keypress")
    console.log(currentKeyPress)
    var queueObject = currentNodeQueue

    if (currentKeyPress === null) {

      setButtons(Object.keys(node))
      setNode(node)
      setNodeName(node.name)
      if (node !== null) {
        if (node.notes) {
          const notesArray = node.notes.map(notes => notes.content)
          setText(notesArray)
        }
      }
    }

    if (currentKeyPress === 'c') {

      if (queueObject['c'].length == 0) {

        //change color, works but doesn't work at the same time
        node.color = colorMap.connecting

        //and now I discover this node will change just like that

        queueObject['c'].push(node)
        setKeypress(null)

      } else if (queueObject['c'].length == 1) {

        node.color = colorMap.default
        var previousNode = queueObject['c'].shift()

        previousNode.color = colorMap.default

        if (node !== previousNode) {


          var newLink = { source: previousNode.id, target: node.id }

          var [newNodes, newLinks] = initialize(jsonObject)

          newNodes[node.index] = node

          var newLinks = [...newLinks, newLink]


          setJsonObject({ nodes: newNodes, links: newLinks })
          setKeypress(null)

        }
        setNodeQueue(queueObject)
      }


    }
  })

  //pretty stuff
  useEffect(() => {
    console.log("hi there")
    console.dir(<ForceGraph3D />)
    //console.log(document.getElementsByClassName('node-label'))
    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = 0.5;
    bloomPass.radius = 1;
    bloomPass.threshold = 0.1;
    fgRef.current.postProcessingComposer().addPass(bloomPass);
    refreshGraph()
  }, []);

  function initialize(jsonObject) {
    return [jsonObject.nodes, jsonObject.links]
  }

  function createNode(jsonObject) {
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

  function refreshGraph() {
    console.log('refreshing')
    const nodes = jsonObject.nodes
    const links = jsonObject.links
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].color = colorMap.default
    }
    setJsonObject({ nodes: nodes, links: links })
  }

  const handleNewNode = useCallback((event) => {
    var queueObject = currentNodeQueue

    if (currentKeyPress == 'n') {
      //this portion handles bookkeeping

      console.log(queueObject['n'].length)
      if (queueObject['n'].length > 0) {

        var previousNode = queueObject['n'].shift()
        previousNode.color = colorMap.default

        var [newNodes, newLinks] = initialize(jsonObject)

        newNodes[previousNode.index] = previousNode

        console.log('previousNode: ')
        console.log(previousNode)

        setJsonObject({ nodes: newNodes, links: newLinks })
        setNodeQueue(currentNodeQueue)
      }

      //this portion handles creation
      var newNode = createNode(jsonObject)


      var mousex = event.clientX
      var mousey = event.clientY

      var coordinates = fgRef.current.screen2GraphCoords(mousex, mousey)
      newNode.x = coordinates.x
      newNode.y = coordinates.y
      newNode.z = coordinates.z

      //how can I handle color updating
      var nodes = jsonObject.nodes
      var links = jsonObject.links
      var newNodes = [...nodes, newNode]
      var newLinks = links

      queueObject['n'].push(newNode)

      console.log(newLinks)

      setJsonObject({ nodes: newNodes, links: newLinks })
      setNodeQueue(currentNodeQueue)

    }
  })

  const handleNotes = (node = currentNode) => {
    //could I use a state in this function?
    //setText([])
    if (node !== null) {
      if (node.notes) {
        const notesArray = node.notes.map(notes => notes.content)
        setText(notesArray)
      }
    }
  }

  //this ensures the text is updated... I hope
  useEffect(() => {
    setText([])

  }, [currentNode])



  function toggleLabels() {
    if (currentLabelToggle == true) {
      setLabelToggle(false)
    } else {
      setLabelToggle(true)
    }
  }

  const handleTextareaChange = (event) => {
    console.log(event.target.value)
    console.log(event.target.id)
    var id = event.target.id
    var text = event.target.value
    var node = currentNode
    node.notes[id].content = text

  }

  const handleButtonToggle = (event, isActive) => {
    //this function recieves parameters from button object
    //callback for buttons

    console.log(event.target)
    console.log('isactive: ')
    console.log(isActive)
    var buttonQueue = currentButtonToggles
    buttonQueue[event.target.id] = isActive

    for (const key in buttonQueue) {
      if (buttonQueue.hasOwnProperty(key)) {
        if (key !== event.target.id && buttonQueue[key] === true) {
          buttonQueue[key] = false;
        }

      }
    }
    setContentToggle(buttonQueue[event.target.id])
    console.log('buttonQueue')
    console.log(buttonQueue)
    setButtonToggles(buttonQueue)


  }

  //files
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

        <button onClick={() => handleDownload(jsonObject)}>Save File
        </button>

        <div className='datacontainer'>

          <div >

            <label for="myCheckbox" className='myCheckbox'>Hide labels?</label>

            <input type="checkbox" id="myCheckbox" name="myCheckbox" onChange={toggleLabels} />

          </div>

          <Overlay nodeName={currentNodeName} />

          <ButtonContainer buttonArray={currentButtons} buttonFunction={handleNotes} buttonHandler={handleButtonToggle} isActive={currentButtonToggles} />

          <Scrollbox textEntries={currentText} editHandler={handleTextareaChange} toggler={currentContentToggle} />

        </div>

        <div className='graphicscontainer' tabIndex={1} onKeyUp={testUp}>

          <ForceGraph3D extraRenderers={css2renderGuy} ref={fgRef} graphData={jsonObject}

            onNodeRightClick={handleRightClick}
            onNodeClick={handleClick}
            onBackgroundClick={handleNewNode}


            numDimensions={3}

            nodeThreeObject={node => {
              const nodeEl = document.createElement('div');
              nodeEl.textContent = node.label;
              nodeEl.style.color = '#e5e5e5';
              nodeEl.style.size = 8;
              { currentLabelToggle ? nodeEl.style.opacity = .65 : nodeEl.style.opacity = 0 }
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
