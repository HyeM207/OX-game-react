import React, { useEffect, useState, useRef } from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';
// import { ProgressBar } from 'react-bootstrap'
import '../css/quizRoom.css'
import '../css/bootstrap.css'


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
  const interval = useRef(null)
  const [outList, setOutList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [playerNum, setPlayerNum] = useState(0);
  const [leftPlayerNum, setLeftPlayerNum] = useState(0);
  const [manager, setManager] = useState("");
  const [limitedTime, setLimitedTime] = useState(0);

  const nickname = location.state.nickname;
  const room = location.state.room;
  // const playerNum = location.state.playerNum;

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
      setChoice("");
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

      setChoiceTrue(chTrue);
      setChoiceFalse(chFalse);
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

    socket.on("game_info", (data) => {  // 게임 플레이어 수, 게임 시간
      setPlayerNum(data.playerNum);
      setLimitedTime(data.limitedTime);
    })
  
    return () => {
      socket.off('quiz');
      socket.off('usersChoice');
      socket.off('playerList');
      socket.off('outList');
      socket.off('game_info');
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

      if (leftTime == limitedTime){
        console.log(limitedTime, "초마다 실행!");
        setLeftTime(0);
        if (manager == nickname){
          onSubmitAdmin();
        } else {
          onSubmit();

        }
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

    if(round == 1 && choice == ""){
      console.log("첫 라운드에 공백임! out!!");

      const result = {room: room, nickname: nickname, count: 0};

      socket.emit('outQuiz', result);
    } else if (quizList.problems[round - 1].answer != choice && choice != "") {  // 답이 틀린 경우
      console.log("you choice wrong answer!!!");
      setCount(count => round - 1);
      setButtonState(true);
      setChoice("");
      console.log("답이 틀림 count 틀린 문제 전 라운드로 : ", count);
      console.log("choice 제발 공백 : ", choice);

      const result = {room: room, nickname: nickname, count: count};

      socket.emit('outQuiz', result);

    } else if (quizList.problems[round-1].answer != choice) { // 공백인 경우
      console.log("you choice wrong answer!!!");
      setButtonState(true);
      setChoice("");
      // setCount(count => round);

      console.log("공백임 count 틀린 문제 전 라운드로 : ", count);
      console.log("choice 제발 공백 : ", choice);

      // const result = {room: room, nickname: nickname, count: count};

      // socket.emit('outQuiz', result);
    } else if (round == totalNum && quizList.problems[round-1].answer == choice) {
      setCount(count => totalNum);
      console.log("전부 정답임!! : ", count);

      const result = {room: room, nickname: nickname, count: totalNum};

      socket.emit('outQuiz', result);
    } else if (choice != "") {  // 답이 맞은 경우
      setCount(count => round);
      console.log("다 맞아서 다음 문제로! : ", count);
      console.log("My choice : ", choice);
      console.log("choices : ", choices);
    } 

    console.log("푼 결과에 따라 조건 적용 결과 : ", count);

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
    navigate('/dynamic-web_OXGame/quizResult', {state: {room: room, nickname : nickname, manager : manager, quizList : quizList, choices : choices, loadState: false, rankList: []}});
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
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
                <a class="navbar-brand">OX Survival Game</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
            </div>
        </nav>
        
        {/* 우측에 라운드 상황 및 탈락, 생존자 정리 */}
        <div className='roundState'>
          <div>
            라운드 : {round} / {totalNum} <br/>
            생존자 수 : {leftPlayerNum} / {playerNum}
            <br/><br/>

            {/* 추후에 오른쪽에 고정시켜 둬야 됨 */}
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

        <div class="quiz">
          <div class="progress">
            <div class="progress-bar" role="progressbar" style={{width: ((limitedTime - leftTime)/limitedTime*100) + "%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">{limitedTime - leftTime}</div>
          </div>
          <br/><h1>{quizTitle}</h1><br/>
          {/* <progress value={leftTime} max={limitedTime}></progress> */}

          <div class="problem_round">Q{round}. {quizProblem}</div>
        </div>

        <div class="player_choice_false">
          O 선택 <br/>
          {choiceTrue.map((player, index) => {
              return (<button  key={index}  type="button" disabled="false" class="btn btn-outline-dark" style={{ float: "left", margin : "5px"}}>{player}</button>);
          })}
        </div>

        <div class="player_choice_false">
          X 선택 <br/>
          {choiceFalse.map((player, index) => {
              return (<button  key={index}  type="button" disabled="false" class="btn btn-outline-dark" style={{ float: "left", margin : "5px"}}>{player}</button>);
          })}
        </div>
      </div>
    );
  }

  const playerPage = () => {
    console.log("!!!player page!!!");

    return (
      <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
                <a class="navbar-brand">OX Survival Game</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
            </div>
        </nav>


        <div class="progress">
          <div class="progress-bar" role="progressbar" style={{width: ((limitedTime - leftTime)/limitedTime*100) + "%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">{limitedTime - leftTime}</div>
        </div>
        <br/><h1>{quizTitle}</h1><br/>

        <p>Q{round}. {quizProblem}</p>

        <div class="answer-group">
          <input type="radio" value="true"  name="choice" id="btn_true" checked={choice == "true"} onChange={onChange} disabled={buttonState}/>
          <label for="btn_true">O</label>
          <input type="radio" value="false" name="choice" id="btn_false" checked={choice == "false"} onChange={onChange} disabled={buttonState}/>
          <label for="btn_false">X</label>
        </div>

        <div class="player_choice_true">
          O 선택 <br/>
          {choiceTrue.map((player, index) => {
              return (<button  key={index}  type="button" disabled="false" class="btn btn-outline-dark" style={{ float: "left", margin : "5px"}}>{player}</button>);
          })}
        </div>

        <div class="player_choice_false">
          X 선택 <br/>
          {choiceFalse.map((player, index) => {
              return (<button  key={index}  type="button" disabled="false" class="btn btn-outline-dark" style={{ float: "left", margin : "5px"}}>{player}</button>);
          })}
        </div>
          
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