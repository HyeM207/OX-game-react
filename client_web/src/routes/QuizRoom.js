import React, { useEffect, useState, useRef } from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';
// import { ProgressBar } from 'react-bootstrap'
import '../css/jj_quiz.css'


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
  // const [playerNum, setPlayerNum] = useState(0);
  const [leftPlayerNum, setLeftPlayerNum] = useState(0);
  const [manager, setManager] = useState("");

  const nickname = location.state.nickname;
  const room = location.state.room;
  const playerNum = location.state.playerNum;

  useEffect(async() => {
    console.log("room data : ", room);
    console.log("nickname : ", nickname);
    socket.emit("get quiz", {room: room, nickname: nickname});

    socket.on("quiz", (data) => { // 서버로부터 데이터 받는 부분  서버에서는 socket.emit("server", data)형식으로 존재
      console.log("solve quiz!!", data);
      console.log("solve quiz title!!", data.title);
      console.log("solve quiz manager!!", data.manager);
      console.log("solve quiz data.problems[round].question!!", data.problems[round].question);
      console.log("First Round : ", round);
      setQuizList(data);
      setQuizTitle(data.title);
      setManager(data.manager);
      setQuizProblem(data.problems[round].question);
      setTotalNum(data.problems.length);
      console.log("nickname : ", nickname);
      console.log("problems length : ", data.problems.length);

      setRound(round+1);
    })

    socket.on("usersChoice", (data) => {
      console.log("user Choice : ", data);
      console.log("choice true : ", data.filter(v => v.choice == 'true').map(v => v.nickname));
      console.log("choice false : ", data.filter(v => v.choice == 'false').map(v => v.nickname));

      const chTrue = data.filter(v => v.choice == 'true').map(v => v.nickname);
      const chFalse = data.filter(v => v.choice == 'false').map(v => v.nickname);

      setChoiceTrue(chTrue.join(', '));
      setChoiceFalse(chFalse.join(', '));
    })

    socket.on("playerList", (data) => {
      console.log("palyer lsit 소켓에서 받아 옴 : ", data);
      setPlayerList(data);
      setLeftPlayerNum(data.length);

      // 만약 생존자가 더 이상 없을 시 게임 종료 시키기
      if (data.length <= 0){
        console.log("생존 인원이 없어 게임 종료");
        socket.emit('endQuiz', room);
        setState(false);
      }
    })

    socket.on("outList", (data) => {
      console.log("out List 소켓에서 받아 옴 : ", data);
      setOutList(data);
    })

  
    return () => {
      socket.off('quiz');
      socket.off('usersChoice');
      socket.off('playerList');
      socket.off('outList');
 };
  }, []);

  
  const onChange = e => {
    const { value } = e.target; // e.target 에서 name 과 value 를 추출

    // 해당 라운드에 선택한 정답
    setChoice(value);

    const cho = {
      room: room,
      nickname: nickname,
      round: round,
      choice: value
    };
    socket.emit('choiceAnswer', cho);
  }


  useEffect(() => {
    interval.current = setInterval(() => {
      // console.log("interval 1초마다 실행!");
      // console.log("left time : ", leftTime);
      setLeftTime(leftTime => leftTime + 1);

      if (leftTime == 10){
        console.log("10초마다 실행!");
        setLeftTime(0);
        onSubmit();
        onSubmitAdmin();
      }
    }, 1000);

    return () => {
      clearInterval(interval.current);
    };
  }, [leftTime]);

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
      setCount(count => round - 1);
      setButtonState(true);
      setChoice("");
      console.log("count 틀린 문제 전 라운드로 : ", count);
      console.log("choice 제발 공백 : ", choice);

      const result = {room: room, nickname: nickname, count: count};

      socket.emit('outQuiz', result);

    } else if (quizList.problems[round-1].answer != choice) {
      console.log("you choice wrong answer!!!");
      setButtonState(true);
      setChoice("");
      console.log("count 틀린 문제 전 라운드로 : ", count);
      console.log("choice 제발 공백 : ", choice);

    } else if (choice != "") {
      setCount(round - 1);
      console.log("count 다 풀었으면 6 : ", count);
      console.log("My choice : ", choice);
      console.log("choices : ", choices);
    }

    if (quizList.problems.length <= round){
      console.log("quiz finish!!!!!!");
      setState(false);

      const result = {room: room, nickname: nickname, count: count};

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

    if (quizList.problems.length <= round){
      console.log("quiz finish!!!!!!");
      setState(false);

      socket.emit('endQuiz', room);
    } else {
      console.log("not yet!!!");
      setRound(round+1);
      setQuizProblem(quizList.problems[round].question);
      console.log("Round Num : ", round);
      console.log("this round quiz", quizList.problems[round].question);
    }
  };

  const enterResult = () => {
    console.log("quiz quizList : ", quizList);
    // loadState 지워야 됨
    navigate('/dynamic-web_OXGame/quizResult', {state: {room: room, nickname : nickname, manager : manager, quizList : quizList, choices : choices, count : count, loadState: false, rankList: []}});
  }

  const quizSolve = () => {
    console.log("quizSolve() 호출!!!");
    console.log("quizsolve() - manger", manager);

    return(
      <div>
        {
          manager == nickname
          ? adminPage()
          : playerPage()
        }
      </div>
    );
  }

  const adminPage = () => {
    console.log("!!!admin page!!!");
    console.log("playerList : ", playerList);

    return (
      
      <div>
        {/* 우측에 라운드 상황 및 탈락, 생존자 정리 */}
        <div className='roundState'>
          <div>
            라운드 : {round} / {totalNum}
            생존자 수 : {leftPlayerNum} / {playerNum}

            {/* 생존자 테이블 */}
            <table className='playerList'>
              {
                playerList.map((player, index) => (
                  <tr>
                    <td>{player}</td>
                    <td>생존</td>
                  </tr>
                ))
              }
            </table>

            {/* 탈락자 테이블 */}
            <table className='outList'>
              {
                outList.map((player, index) => (
                  <tr>
                    <td>{player}</td>
                    <td>탈락</td>
                  </tr>
                ))
              }
            </table>

          </div>
        </div>

        <div>
          <h1>퀴즈 : {quizTitle}</h1>
          <h3>남은 시간 : {leftTime} / {time}</h3>

          <p>Q{round}. {quizProblem}</p>

          true : {choiceTrue} <br/>
          false : {choiceFalse}
          
          {/* <br/><br/>
          <button onClick={onSubmitAdmin}>다음</button> */}

          <br/><br/>
          라운드 : {round} / {totalNum}
          <table border="1" style={{margin: 'auto'}}>
            <tr>
              <td>현재 현황</td>
            </tr>

            <tr>
              <td>
                생존자 : {playerList} <br/>
                탈락자 : {outList}
              </td>
            </tr>

          </table>
        </div>
        
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

          <table>
          {/* {
            choiceTrue.map((player, index) => (
              <tr>
                <td>{index}</td>
                <td>{rank.nickname}</td>
                <td>{rank.count}</td>
              </tr>
            ))
          } */}

          </table>

          <br/><br/>
  
          <input type="radio" value="true"  name="choice" checked={choice == "true"} onChange={onChange} disabled={buttonState} /> O
          &nbsp;&nbsp;&nbsp;
          <input type="radio" value="false" name="choice" checked={choice == "false"} onChange={onChange} disabled={buttonState} /> X
          {/* <br/><br/>
          <button onClick={onSubmit}>다음</button> */}
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