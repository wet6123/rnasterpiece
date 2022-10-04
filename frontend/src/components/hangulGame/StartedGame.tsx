import { Button, Box } from '@mui/material';
import React, { MouseEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import { putGameLog } from '../../_slice/GameSlice';
import correctMp3 from '../../audio/correct.mp3';
import oopsMp3 from '../../audio/oops.mp3';
import endMp3 from '../../audio/end.mp3';
import sadendMp3 from '../../audio/sadend.mp3';
import oneTicket from '../../img/ticket/one.png';
import twoTicket from '../../img/ticket/two.png';
import threeTicket from '../../img/ticket/three.png';
import fourTicket from '../../img/ticket/four.png';
import fiveTicket from '../../img/ticket/five.png';
import volume from '../../img/volume.png';

export default function StartedGame() {
  const dispatch = useDispatch();
  const gameId = useSelector((state: any) => state.game.gameId);
  const questionOption = useSelector((state: any) => state.game.questionOption);
  const questionAnswer = useSelector((state: any) => state.game.questionAnswer);
  const [qNum, setQNum] = useState(0);
  const [answer, setAnswer] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const [correct, setCorrect] = useState(false);
  const ticket = [oneTicket, twoTicket, threeTicket, fourTicket, fiveTicket];

  const correctAudio = new Audio(correctMp3);
  const oopsAudio = new Audio(oopsMp3);
  const endAudio = new Audio(endMp3);
  const sadendAudio = new Audio(sadendMp3);

  useEffect(() => {
    if (answer.length >= 5) {
      if (count > 0) {
        endAudio.play();
      } else {
        sadendAudio.play();
      }
      console.log('game log');
      const payload = {
        gameId,
        userSelect: answer,
      };
      dispatch(putGameLog(payload));
    }
  }, [answer]);

  const nextHandler = (e: MouseEvent<HTMLElement>) => {
    if (answer.length < 5) {
      setAnswer([...answer, 4]);
    }
    setQNum(qNum + 1);
    console.log(count);
    console.log(qNum);
  };

  const handler = (e: MouseEvent<HTMLElement>) => {
    const event = e.target as HTMLButtonElement;

    if (!showAns && qNum <= 4) {
      if (`${questionAnswer[qNum]}` === `${event.value}`) {
        // 맞았다는 화면
        setCount(count + 1);
        setCorrect(true);
        console.log('good');
        correctAudio.play();
      } else {
        // 틀렸다는 화면
        oopsAudio.play();
      }
      setAnswer([...answer, event.value]);
      setShowAns(true);
    }
  };

  const nextQuestion = (e: MouseEvent<HTMLElement>) => {
    setQNum(qNum + 1);
    setShowAns(false);
    setCorrect(false);
  };

  const tts = (lang: string, text: string) => {
    const msg = new SpeechSynthesisUtterance();
    msg.lang = lang;
    msg.text = text;
    window.speechSynthesis.speak(msg);
  };

  return (
    <div>
      {qNum < 5 ? (
        <>
          <div>{qNum + 1}/5</div>
          {showAns ? (
            <>
              {correct ? <div>correct</div> : <div>Oops!</div>}
              <div>The answer is</div>
              <div>{Object.values<Array<string>>(questionOption[qNum])[0][questionAnswer[qNum]]}</div>
              <div>
                {Object.values<Array<string>>(questionOption[qNum])[0].map((one: string, idx: Number) => (
                  <div>
                    {`${questionAnswer[qNum]}` === `${idx}` ? (
                      <Button color="success" variant="contained" value={`${idx}`} key={'ans' + `${idx}` + `${qNum}`}>
                        {one}
                      </Button>
                    ) : `${answer[qNum]}` === `${idx}` ? (
                      <Button color="error" variant="contained" value={`${idx}`} key={'ans' + `${idx}` + `${qNum}`}>
                        {one}
                      </Button>
                    ) : (
                      <Button variant="contained" value={`${idx}`} key={'ans' + `${idx}` + `${qNum}`}>
                        {one}
                      </Button>
                    )}
                    <Button onClick={() => tts('ko', one)}>
                      <VolumeDownIcon />
                    </Button>
                  </div>
                ))}
              </div>
              <div>
                <Button variant="contained" onClick={nextQuestion} key={'q' + `${qNum}`}>
                  Next Question
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <div>sound btn</div>
                <div>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ margin: 0, padding: 0, width: '100%', minHeight: 50 }}>
                    <Button
                      onClick={() =>
                        tts('ko', `${Object.values<Array<string>>(questionOption[qNum])[0][questionAnswer[qNum]]}`)
                      }>
                      <img src={volume} alt="sound" width={200} />
                    </Button>
                  </Box>
                </div>
              </div>
              <div>
                <div>options</div>
                {Object.values<Array<string>>(questionOption[qNum])[0].map((one: any, idx: any) => (
                  <Button variant="contained" value={`${idx}`} onClick={handler} key={'option' + `${idx}` + `${qNum}`}>
                    {one}
                  </Button>
                ))}
              </div>
              <div>
                <div>interface</div>
                <Button onClick={nextHandler}>next</Button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div>Game End</div>
          {count < 2 ? <div>You earned {count} ticket!</div> : <div>You earned {count} tickets!</div>}
          <img src={ticket[count - 1]} />
        </>
      )}
    </div>
  );
}