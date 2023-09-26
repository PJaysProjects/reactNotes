import React, { createContext, useContext, useState } from 'react';
//I could use this to set the standard formats for different things

const CommonVariablesContext = createContext([])

export function TextProvider({children}){

    const [currentText,setText] = useState([])

    const updateText = (newText)=>{
        setText(newText)
    }

    return (
        <CommonVariablesContext.Provider value ={{currentText, updateText}}>
            {children}
        </CommonVariablesContext.Provider>
    )
}

export function useCommonVariablesContext(){
    return useContext(CommonVariablesContext)
}