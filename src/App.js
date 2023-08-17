
import TextBox from './text';
import Scrollbox from './scrollbox';
import ButtonContainer from './buttonContainer';

import * as THREE from 'three'
import {CSS2DRenderer, CSS2DObject} from 'three-css2drender'

import ForceGraph3D from 'react-force-graph-3d'

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

  const css2dRenderer = new CSS2DRenderer();
  
  const [jsonObject, setJsonObject] = useState(test3dNode)
  const [currentNode, setNode] = useState(null)
  const [currentButtons, setButtons] = useState(testButtons)
  const [currentText, setText] = useState(testEntries)

  const fgRef = useRef()




  const handleRightClick = useCallback(node => {
    console.log('egg')
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
    


  })

  const handleNotes = useCallback(()=>{
    const node = currentNode
    console.log(node)
    if (node.notes) {
      const notesArray = node.notes.map(notes => notes.content )
      setText(notesArray)
      console.log(notesArray)

    } else {
      setText([])
    }
  })

  const testFunctions = [handleNotes, null, null, null, null]


  useEffect(()=>{

  },[currentText])

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

  /* useEffect(()=>{
  
    if(jsonObject){
      
    }
  }, [jsonObject]); */

  return (
    <div className="root">
      <div className="maincontainer">
        <input type="file" accept='.json' onChange={handleFileUpload} />
        <div className='datacontainer'>
          <ButtonContainer buttonArray={currentButtons} buttonFunction={handleNotes}/>
          <Scrollbox textEntries={currentText} />
        </div>
        <div className='graphicscontainer'>
          <ForceGraph3D ref={fgRef} graphData={jsonObject} onNodeRightClick={handleRightClick} onNodeClick={handleClick}
          
          />
          
        </div>

      </div>

    </div>
  );
}

export default App;
