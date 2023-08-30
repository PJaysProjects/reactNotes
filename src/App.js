
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
      "id": "1",
      "name": "name1",
      'label': "1" + ": " + "name1",
      "val": 1,
      'notes': [{ content: 'whoa....' }, { content: 'what do we have here?' }, { content: "hopefully \n something \n cool" }]
    },
    {
      "id": "2",
      "name": "name2",
      'label': "2" + ": " + "name2",
      "val": 10,
      'notes': [{ content: "hello there" }],
      'links': []
    }
  ],
  "links": [
    {
      "source": "1",
      "target": "2"
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


  const defaultButtons = ['notes', 'links']
  const hiddenButtons = []




  const [currentAppState, setAppState] = useState(false)
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
  const [currentFoundList, setFoundList] = useState({})


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
      /* console.log(event.key) */
    }
  });

  //clicks

  //this persists between renders, and is defined in the Force3D component
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

  //when I use the "useCallback" hook, it makes me have to click twice
  const handleLeftClick = (node) => {
    /* console.log("keypress")
    console.log(currentKeyPress) */
    var queueObject = currentNodeQueue

    

    if (currentKeyPress === null) {

      var currentKeys = Object.keys(node)
      if(currentKeys.includes('notes')){
        var index = currentKeys.indexOf('notes')
        currentKeys.unshift(currentKeys.splice(index,1)[0])
      }
      
      
      
      setButtons(currentKeys)
      setNode(node)
      setNodeName(node.name)
      //oddly, if I just call the handle notes function, which has identical calls, it takes three clicks. This way takes two clicks
      handleNotes(node)
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
  }

  //pretty stuff
  useEffect(() => {
    /* console.log("hi there")
    console.dir(<ForceGraph3D />) */
    //console.log(document.getElementsByClassName('node-label'))
    if (!currentAppState) {
      const bloomPass = new UnrealBloomPass();
      bloomPass.strength = 0.5;
      bloomPass.radius = 1;
      bloomPass.threshold = 0.1;
      fgRef.current.postProcessingComposer().addPass(bloomPass);
      setAppState(true)

    }
    //console.log(fgRef.current)
    refreshGraph()
  }, []);


  function initialize(jsonObject) {
    return [jsonObject.nodes, jsonObject.links]
  }

  function createNode(jsonObject) {
    var newIndex = jsonObject.nodes.length
    var newId = newIndex.toString()
    var newColor = colorMap.highlighted
    /* console.log(newColor) */
    var newName = "New Node"

    //need this to be automatic somehow... i.e., if id or name change, the label will change
    var newLabel = newId + ": " + newName
    var newNode = {}
    newNode.color = newColor
    newNode.id = newId
    newNode.index = newIndex
    newNode.name = newName
    newNode.label = newLabel
    newNode.val = 4
    newNode.shape = 'dot'
    newNode.notes = []
    return newNode
  }

  function refreshGraph() {
    /* console.log('refreshing') */
    const nodes = jsonObject.nodes
    const links = jsonObject.links
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].color = colorMap.default
    }
    setJsonObject({ nodes: nodes, links: links })
  }

  const handleNewNode = (event) => {
    var queueObject = currentNodeQueue

    if (currentKeyPress == 'n') {
      //this portion handles bookkeeping

      console.log(queueObject['n'].length)
      if (queueObject['n'].length > 0) {

        var previousNode = queueObject['n'].shift()
        previousNode.color = colorMap.default

        var [newNodes, newLinks] = initialize(jsonObject)

        newNodes[previousNode.index] = previousNode

        /* console.log('previousNode: ')
        console.log(previousNode) */

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

      /* console.log(newLinks) */

      setJsonObject({ nodes: newNodes, links: newLinks })
      setNodeQueue(currentNodeQueue)

    }
  }

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

  const addHandler = (text)=> {
    var node = currentNode
    
    for (var key in currentButtonToggles) {
      if (currentButtonToggles.hasOwnProperty(key)) {
          if (!currentButtonToggles.key){
            
            node.notes.push({content: text,timestamp: 'now'})
            console.log(node.notes)
            /* console.log(node)
            const [nodes, links] = initialize(jsonObject)
            nodes[node.index] = node
            setJsonObject({ nodes: nodes, links: links }) */
            const notesArray = node.notes.map(notes => notes.content)
          

          setText(notesArray)
            
          }
      }
  }
  }

  //this makes me have to double click on a new node, but it ensures that the previous notes are cleared. Searching for a better method
  /*  useEffect(() => {
     setText([])
 
   }, [currentNode]) */


  //this works with the hide labels checkbox
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

  //this untoggles buttons when another button is clicked
  const handleButtonToggle = (event, isActive) => {
    //this function recieves parameters from button object
    //callback for buttons

    /* console.log(event.target)
    console.log('isactive: ')
    console.log(isActive) */
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
    /* console.log('buttonQueue')
    console.log(buttonQueue) */
    setButtonToggles(buttonQueue)


  }

  //files
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    try {
      reader.onload = (e) => {
        const fileContent = e.target.result;
        const jsonData = JSON.parse(fileContent);
        // Use the jsonData as needed in your app
        jsonData['edges'].forEach(element => {

          element['source'] = element['from']
          delete element['from']

          element['target'] = element['to']
          delete element['to']

        });

        jsonData['links'] = jsonData['edges']

        jsonData['nodes'].forEach(element => {
          element['val'] = 4
        });


        setJsonObject(jsonData)

      };
      reader.readAsText(file);
    } catch {
      //I'm sure something more productive could go here, but I am merely trying to protect from cancelling a file upload
    }

  };

  //this is really fucked up for some reason
  function handleDownload(data) {
    data['edges'] = data['links']
    data['edges'].forEach((element,index) => {
      
      data['edges'][index] = {
        'from': element['source'].id,
        'to': element['target'].id,
        'arrows': element['arrows'],
        'id': element['id']
      }
      
      

    });

    

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

  //button functions
  const buttonFunctionsObject = {
    'notes': handleNotes,
    'links': null
  }

  //custom functions

  //string matcher
  const findAndSetColor = (searchString) => {
    var foundNodes = currentFoundList
    for (const node of jsonObject.nodes) {
      node.color = colorMap.default
      node.val = 4
      
      foundNodes[node.id] = false
    }

    const filteredNodes = jsonObject.nodes.filter(node => node.label.toLowerCase().includes(searchString.toLowerCase()))
    if (searchString.length > 0) {
      for (const node of filteredNodes) {
        node.color = colorMap.highlighted
        node.val = 64
        
        foundNodes[node.id] = true
      }

    }

    //this is to trigger a re-render
    const [nodes, links] = initialize(jsonObject)
    setJsonObject({ nodes: nodes, links: links })
    setFoundList(foundNodes)
    console.log('search complete')
    console.log(currentFoundList)
  }

  //tree searcher for connectivity dependent properties
  const zIndexObject = {

  }

  const calculateZIndex = (node) => {
    console.log(jsonObject.links)

    var queue = new Set()

    //finding children
    for (let i = 0; i < jsonObject.links.length; i++) {
      if (jsonObject.links[i]['source'] === node.id) {
        var nextNodeId = jsonObject.links[i]['target']
      }
    }
  }

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

          <Overlay nodeName={currentNodeName} searchFunction={findAndSetColor} />

          <ButtonContainer buttonArray={currentButtons} buttonFunction={handleNotes} buttonHandler={handleButtonToggle} isActive={currentButtonToggles} />

          {/* <div>
            <button >Save changes</button>
          </div> */}

          <Scrollbox textEntries={currentText} editHandler={handleTextareaChange} addHandler={addHandler} toggler={currentContentToggle} />

        </div>

        <div className='graphicscontainer' tabIndex={1} onKeyUp={testUp}>

          <ForceGraph3D extraRenderers={css2renderGuy} ref={fgRef} graphData={jsonObject}

            onNodeRightClick={handleRightClick}
            onNodeClick={handleLeftClick}
            onBackgroundClick={handleNewNode}


            numDimensions={3}

            nodeThreeObject={node => {
              const nodeEl = document.createElement('div');
              nodeEl.textContent = node.label;
              nodeEl.style.color = '#e5e5e5';
              nodeEl.style.size = 30;
              { currentLabelToggle ? nodeEl.style.opacity = .65 : nodeEl.style.opacity = 0 }
              
              {currentFoundList[node.id] ? nodeEl.style.fontSize = '30px' : nodeEl.style.fontSize = '11px'}
              //console.log('triggered')
              nodeEl.className = 'node-label';
              nodeEl.id = node.id
              /* if (Math.random() > 0.5){
                nodeEl.style.color = '#FFF000';
                nodeEl.style.zIndex = 8
              } */
              //calculateZIndex(node)
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
