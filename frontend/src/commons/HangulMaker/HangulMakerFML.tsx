import React from "react";
import { Grid, Tab, Tabs, Typography, Box, Button, } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatchHook, useSelectorHook } from '../../_hook/HangulMakerHook';
import { tabAction, firstAction, middleAction, lastAction } from '../../_slice/HangulMakerSlice';
import { areaSyllableAction, areaSentenceAction } from '../../_slice/ComposeHangulSlice';
import HangulMakerInput from "./HangulMakerInput";
import composeHangul from "./ComposeHangul";

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function HangulMakerFML(){
  // 초중종 버튼 단위길이
  const unit = 20;
  // 초중종 버튼 가로
  const width = unit*3;
  // 초중종 버튼 세로
  const height = unit*4;

  const dispatch = useDispatchHook();

  // 초기화
  const[setting, setSetting] = React.useState(false);
  React.useEffect(()=>{
    if(setting){
      return;
    }
    dispatch(firstAction.change(-1));
    dispatch(middleAction.change(-1));
    dispatch(lastAction.change(0));
    setSetting(true);
  }, []);

  // 초성 중성 종성 index
  const first:number = useSelectorHook(state => state.first.value);
  const middle:number = useSelectorHook(state => state.middle.value);
  const last:number = useSelectorHook(state => state.last.value);

  // 초성 중성 중성 string
  const letter:string[] = [composeHangul(first, -1, 0), composeHangul(-1, middle, 0), composeHangul(-1, -1, last)];

  // 음절 미리보기
  const[syllable, setSyllable] = React.useState("");
  React.useEffect(()=>{
    setSyllable(composeHangul(first, middle, last));
  }, [first, middle, last]);

  // tab Value
  const [value, setValue] = React.useState(0);

  // tab 누를때 select 값 변경
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(tabAction.change(newValue));
    setValue(newValue);
  };

  // 자모음 할당취소
  const cancelButton = [() =>{
    dispatch(firstAction.change(-1));
  }, () =>{
    dispatch(middleAction.change(-1));
  }, () =>{
    dispatch(lastAction.change(0));
  }];

  // 음절 제작
  const makeSyllable = ()=>{
    console.log("MakeSyllable");
    if(first>=0 || middle>=0 || last>0){
      console.log("do");
      dispatch(areaSyllableAction.push(syllable));
      dispatch(firstAction.change(-1));
      dispatch(middleAction.change(-1));
      dispatch(lastAction.change(0));
    }
  };

  return (
    <Grid container item xs={12}>
      <Grid item xs={9} justifyContent="center" alignItems="center">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            {[0,1,2].map((i:number)=>(
              <Tab key={`tab${i}`} style={{maxWidth: width}} label={
                <Typography style={{fontSize:"30px"}}>
                  <Box sx={{width: {width}, height:{height}}} style={{position:"relative", margin:unit/2, backgroundColor:"#DDDDDD"}}>
                    {letter[i]}
                  </Box>
                  <CancelIcon style={{position:"absolute", top:0, right:0, color:"red"}}
                  onClick={cancelButton[i]}/>
                </Typography>
              } id={a11yProps(i).id} aria-controls={a11yProps(i)["aria-controls"]} /> 
            ))}
          </Tabs>
        </Box>
      </Grid>
      <Grid item xs={3} justifyContent="center" alignItems="center">
        <Box display="flex" justifyContent="center" alignItems="center"
        sx={{width: {width}, height:{height}}} style={{margin:unit/2, marginTop:unit, backgroundColor:"#DDDDDD"}}>
          <Typography style={{fontSize:"30px"}}>{syllable}</Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center"
        sx={{width: {width}}} style={{margin:unit/2, marginTop:unit, backgroundColor:"#DDDDDD"}}>
          <Button onClick={makeSyllable} style={{backgroundColor:"green", color:"white"}}>
            Done
          </Button>
        </Box>
      </Grid>
      <TabPanel value={value} index={0}>
        <HangulMakerInput/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HangulMakerInput/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <HangulMakerInput/>
      </TabPanel>
    </Grid>
  );
}