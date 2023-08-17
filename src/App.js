
import Scrollbox from './scrollbox';
import ButtonContainer from './buttonContainer';
import Overlay from './overlay';

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import ForceGraph3D from 'react-force-graph-3d'
import useKeypress from 'react-use-keypress';

import { useCallback, useEffect, useRef, useState } from 'react';

import './text.css'
import './App.css';

import './scrollbox.css'
import './datacontainer.css'
import './buttoncontainer.css'



const testEntries = ["hello", "My", "name", "is", "Phillip", "How may I help you?"]

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
const testButtons = ["button1", "button2", "button3", 'button4', 'button5']



function App() {




  const css2renderGuy = [new CSS2DRenderer()];

  const [jsonObject, setJsonObject] = useState(test3dNode)
  const [currentNode, setNode] = useState(null)
  const [currentButtons, setButtons] = useState(testButtons)
  const [currentText, setText] = useState(testEntries)
  const [currentKeyPress, setKeypress] = useState(null)
  const [currentNodeName, setNodeName] = useState("")
  const [currentToggle, setToggle] = useState(true)

  const allowedKeys = ['n']

  useKeypress(allowedKeys, (event) => {
    if (currentKeyPress != event.key) { setKeypress(event.key) }


  });

  const fgRef = useRef()

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

  const handleClick = useCallback(node => {
    setButtons(Object.keys(node))
    setNode(node)
    setNodeName(node.name)
  })

  const handleNewNode = useCallback((event) => {
    if (currentKeyPress == 'n') {
      console.log(jsonObject.nodes)
    }
  })


  const handleNotes = useCallback(() => {
    const node = currentNode

    if (node.notes) {
      const notesArray = node.notes.map(notes => notes.content)
      setText(notesArray)
    } else {
      setText([])
    }
  })

  const testFunctions = [handleNotes, null, null, null, null]
  function testUp() {
    setKeypress(null)
  }

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


  return (
    <div className="root">

      <div className="maincontainer">
        <input type="file" accept='.json' onChange={handleFileUpload} />
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
              {currentToggle ? nodeEl.style.opacity = .9 : nodeEl.style.opacity = 0}
              nodeEl.className = 'node-label';
              return new CSS2DObject(nodeEl);
            }}
            nodeThreeObjectExtend={true}
            nodeColor={'#e5e5e5'}
            backgroundColor='#000000'
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}

          />

        </div>

      </div>

    </div>
  );
}

export default App;
