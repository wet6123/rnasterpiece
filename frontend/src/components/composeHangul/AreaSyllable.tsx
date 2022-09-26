import React from "react";
import { Container, Box, Button } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';

import { useSelectorHook, useDispatchHook } from '../../_hook/HangulMakerHook';
import { areaSentenceAction, areaSyllableAction } from "../../_slice/ComposeHangulSlice";
import DragAndDrop from "./DragAndDrop";
import { HangulComposeArea } from "../../_store/store";

export default function AreaSyllable(){
  const dispatch = useDispatchHook();
  const thisArea = HangulComposeArea.SYLLABLES;
  const syllableList:string[]= useSelectorHook(state => state.areaSyllable.value);

  const dragValueState:string = useSelectorHook(state => state.dragValue.value);
  const dragStartArea:HangulComposeArea = useSelectorHook(state => state.areaIndex.value);
  const dragStartElement:number = useSelectorHook(state => state.elementIndex.value);

  // 드래그 후 hover
  const dragOverFunction = (e:React.DragEvent, type:string) => {
    e.preventDefault();
    e.stopPropagation();
    const dropObject:HTMLDivElement = (e.target as HTMLDivElement);
    console.log(type);
  }
  // 드롭
  const dropFunction = (e:React.DragEvent, type:string) => {
    e.preventDefault();
    e.stopPropagation();
    const dropObject:HTMLDivElement = (e.target as HTMLDivElement);
    console.log(type);
    if(dragStartArea===HangulComposeArea.SENTENCE){
      if(dragValueState != "space" && dragValueState != "enter"){
        dispatch(areaSyllableAction.push(dragValueState));
      }
      dispatch(areaSentenceAction.delete({index:dragStartElement}));
    }
  }
  
  // 음절 버튼 단위크기
  const unit:number = 10;
  return (
    <Box display="flex" justifyContent="center" alignItems="center"
    style={{width:"100%", minHeight:200, backgroundColor:"#F8CECE", border:"1px dashed black"}}
    className="area"
    onDrop={event => dropFunction(event, 'drop')}
    onDragOver={event => dragOverFunction(event, 'dragOver')}
    // onMouseEnter={event => mouseEnterFunction(event, 'mouseEnter')}
    // onMouseLeave={event => mouseLeaveFunction(event, 'mouseLeave')}
    >
      <Container>
        {syllableList.map((syllable:string, index:number)=>(
          (syllable==="space") ? (<DragAndDrop key={`$AreaSyllable${syllable}`} element={<SpaceBarIcon/>} value={syllable} unit={unit} areaIndex={thisArea} elementIndex={index}/>)
          : (
            (syllable==="enter") ? (<DragAndDrop key={`$AreaSyllable${syllable}`} element={<KeyboardReturnIcon/>} value={syllable} unit={unit} areaIndex={thisArea} elementIndex={index}/>)
            : (
            <DragAndDrop key={`$AreaSyllable${syllable}`} element={syllable} value={syllable} unit={unit} areaIndex={thisArea} elementIndex={index}/>
          ))
        ))}
      </Container>
    </Box>
  );
}