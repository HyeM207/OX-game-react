import React, { useEffect, useState, useRef } from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';


const QuizRoom = () => {
  console.log("QuizRoom에서 호출됨");
  const location = useLocation();
  const navigate = useNavigate();

  const [quizList, setQuizList] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizProblem, setQuizProblem] = useState("");
  const [round, setRound] = useState(0);
  const [totalNum, setTotalNum] = useState();
  const [choice, setChoice] = useState("");
  const [choices, setChoices] = useState([]);
  const [count, setCount] = useState(0);
  const [state, setState] = useState(true);
  const [buttonState, setButtonState] = useState(false);
  const [choiceTrue, setChoiceTrue] = useState([]);
  const [choiceFalse, setChoiceFalse] = useState([]);
  const [leftTime, setLeftTime] = useState(0);
  const [time] = useState(10);
  const interval = useRef(null)
  const [outList, setOutList] = useState([]);
  const [playerList, setPlayerList] = useState([]);

  
  const plzMsg = "send me problems";
  const nickname = location.state.nickname;
  const room = location.state.room;

  useEffect(async() => {
    console.log("room data : ", room);
    socket.emit("get quiz", plzMsg);

    socket.on("quiz", (data) => { // 서버로부터 데이터 받는 부분  서버에서는 socket.emit("server", data)형식으로 존재
      console.log("solve quiz!!", data);
      console.log("solve quiz title!!", data.title);
      console.log("solve quiz data.problems[round].question!!", data.problems[round].question);
      console.log("First Round : ", round);
      setQuizList(data);
      setQuizTitle(data.title);
      setQuizProblem(data.problems[round].question);
      setTotalNum(data.problems.length)
      setPlayerList(playerList.concat(nickname));
      console.log("nickname : ", nickname);
      console.log("problems length : ", data.problems.length);

      setRound(round+1);
    })

    socket.on("usersChoice", (data) => {
      console.log("user Choice : ", data);
      console.log("choice true : ", data.filter(v => v.choice == 'true').map(v => v.nickname));
      console.log("choice false : ", data.filter(v => v.choice == 'false').map(v => v.nickname));

      const chTrue = data.filter(v => v.choice == 'true').map(v => v.nickname);
      const chFalse = data.filter(v => v.choice == 'false').map(v => v.nickname)

      setChoiceTrue(chTrue.join(', '));
      setChoiceFalse(chFalse.join(', '));
    })

    return () => {
      socket.off('quiz');
      socket.off('usersChoice');
 };
  }, []);

  
  const onChange = e => {
    const { value } = e.target; // e.target 에서 name 과 value 를 추출

    // 해당 라운드에 선택한 정답
    setChoice(
      value
    );

    const cho = {
      room: room,
      nickname: nickname,
      round: round,
      choice: value
    };
    socket.emit('choiceAnswer', cho);
  }

  // useEffect(async() => {  
  //   interval.current = setInterval(() => {
  //     console.log("interval 10초마다 실행!");
  //     setLeftTime(0);
  //     onSubmit();
  //   }, 10000);

  //   return () => {
  //     clearInterval(interval.current);
  //   };
  // }, []);

  // useEffect(async() => {
  //   interval.current = setInterval(() => {
  //     console.log("interval 1초마다 실행!");
  //     console.log("left time : ", leftTime);
  //     setLeftTime(leftTime + 1);

  //     if (leftTime == 10){
  //       console.log("10초마다 실행!");
  //       setLeftTime(0);
  //       onsubmit();
  //     }
  //   }, 2000);

  //   return () => {
  //     clearInterval(interval.current);
  //   };
  // }, [leftTime]);

  // 다음 문제로 (player)
  const onSubmit = () => {
    console.log("Round : ", round);

    const cho = {
      round: round,
      choice: choice
    };
    setChoices(choices.concat(cho));

    if (quizList.problems[round-1].answer != choice && choice != "") {
      console.log("you choice wrong answer!!!");
      setCount(round - 1);
      setButtonState(true);
      setChoice("");
      console.log("count 틀린 문제 전 라운드로 : ", count);
      console.log("choice 제발 공백 : ", choice);

      // const result = {nickname: nickname, count: count};
      // socket.emit('outQuiz', result);

    } else if (choice != "") {
      setCount(quizList.problems.length);
      console.log("count 다 풀었으면 6 : ", count);
      console.log("My choice : ", choice);
      console.log("choices : ", choices);
    }

    if (quizList.problems.length <= round){
      console.log("quiz finish!!!!!!");
      setState(false);

      const result = {room: room, nickname: nickname, count: count};
      console.log("추가 전 탈락자 데이터", outList);
      console.log("삭제 전 데이터 : ", playerList);

      const idx = playerList.findIndex(function(prev) {return prev == nickname});
      console.log("삭제할 데이터 : ", idx);
      if (idx != -1) {
        console.log("outList 탈락자 데이터 추가 : ", idx);
        setOutList(outList.concat(idx));

        console.log("데이터 삭제하기");
        setPlayerList(playerList.filter((player) => player !== idx));
      }

      console.log("추가 후 탈락자 데이터", outList);
      console.log("삭제 후 데이터 : ", playerList);

      socket.emit('outQuiz', result);
      socket.emit('endQuiz', room);
    } else {
      console.log("not yet!!!");
      setRound(round+1);
      setQuizProblem(quizList.problems[round].question);
      console.log("Round Num : ", round);
      console.log("this round quiz", quizList.problems[round].question);
    }    
  };

  // 다음 문제로 (admin)
  const onSubmitAdmin = () => {
    console.log("Admin submit!!");
    console.log("Round : ", round);
    
    setRound(round+1);
    setQuizProblem(quizList.problems[round].question);
    console.log("Round Num : ", round);
    console.log("this round quiz", quizList.problems[round].question);
  };

  const enterResult = () => {
    console.log("quiz quizList : ", quizList);
    navigate('/dynamic-web_OXGame/quizResult', {state: {nickname : nickname, quizList : quizList, choices : choices, count : count}});
  }

  const quizSolve = () => {
    console.log("quizSolve() 호출!!!");

    return(
      <div>
        {
          nickname == "admin"
          ? adminPage()
          : playerPage()
        }
      </div>
    );
  }

  const adminPage = () => {
    console.log("!!!admin page!!!");

    return (
      <div>
          <h1>퀴즈 : {quizTitle}</h1>
          <h3>남은 시간 : {leftTime} / {time}</h3>

          <p>Q{round}. {quizProblem}</p>

          true : {choiceTrue} <br/>
          false : {choiceFalse}
          
          <br/><br/>
          <button onClick={onSubmitAdmin}>다음</button>

          <br/><br/>
          라운드 : {round} / {totalNum}
          <table border="1" style={{margin: 'auto'}}>
            <td>
              <tr>현재 현황</tr>
            </td>

            <td>
              <tr>
                생존자 : { "" + 
                  playerList.map((player, index) => ({player}))
                } <br/>
                탈락자 : { "" + 
                  outList.map((player, index) => ({player}))
                }
              </tr>
            </td>

          </table>
      </div>
    );
  }

  const playerPage = () => {
    console.log("!!!player page!!!");

    return (
      <div>
          <h1>퀴즈 : {quizTitle}</h1>
          <h3>남은 시간 : {leftTime} / {time}</h3>

          <p>Q{round}. {quizProblem}</p>
          
          true : {choiceTrue} <br/>
          false : {choiceFalse}
          <br/><br/>
  
          <input type="radio" value="true"  name="choice" checked={choice == "true"} onChange={onChange} disabled={buttonState} /> O
          &nbsp;&nbsp;&nbsp;
          <input type="radio" value="false" name="choice" checked={choice == "false"} onChange={onChange} disabled={buttonState} /> X
          <br/><br/>
          <button onClick={onSubmit}>다음</button>
      </div>
    );
  }

  return (
    <div>
      {
        state === true
        ? quizSolve()
        : enterResult()
      }
    </div>
  );
};

export default QuizRoom;