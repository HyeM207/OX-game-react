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
  const [choice, setChoice] = useState("");
  const [choices, setChoices] = useState([]);
  const [count, setCount] = useState(0);
  const [state, setState] = useState(true);
  const [buttonState, setButtonState] = useState(false);
  const [choiceTrue, setChoiceTrue] = useState([]);
  const [choiceFalse, setChoiceFalse] = useState([]);
  const interval = useRef(null)
  
  const plzMsg = "send me problems";
  const nickname = location.state.nickname;
  const room = location.state.room;

  useEffect(async() => {
    socket.emit("get quiz", plzMsg);

    socket.on("quiz", (data) => { // 서버로부터 데이터 받는 부분  서버에서는 socket.emit("server", data)형식으로 존재
      console.log("solve quiz!!", data);
      console.log("solve quiz title!!", data.title);
      console.log("solve quiz data.problems[round].question!!", data.problems[round].question);
      console.log("First Round : ", round);
      setQuizList(data);
      setQuizTitle(data.title);
      setQuizProblem(data.problems[round].question);
      console.log("problems length : ", data.problems.length);

      setRound(round+1);
    })

    socket.on("usersChoice", (data) => {
      console.log("user Choice : ", data);
      console.log("choice true : ", data.filter(v => v.choice == 'true').map(v => v.nickname));
      console.log("choice false : ", data.filter(v => v.choice == 'false').map(v => v.nickname));

      const chTrue = data.filter(v => v.choice == 'true').map(v => v.nickname);
      const chFalse = data.filter(v => v.choice == 'false').map(v => v.nickname)

      setChoiceTrue(chTrue);
      setChoiceFalse(chFalse);
    })

    // interval.current = setInterval(() => {
    //   console.log("interval 실행!");
    //   onSubmit();
    // }, 3000);

    return () => {
      socket.off('quiz');
      socket.off('usersChoice');
      clearInterval(interval.current);
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

  interval.current = setInterval(() => {
    console.log("interval 실행!");
    onSubmit();
  }, 5000);

  // 문제 추가 버튼 클릭 => List에 추가
  const onSubmit = () => {
    console.log("Round : ", round);

    const cho = {
      round: round,
      choice: choice
    };
    setChoices(choices.concat(cho));

    if (quizList.problems[round-1].answer != choice && choice != "") {
      console.log("you choice wrong answer!!!");
      setCount(round);
      setButtonState(true);
      setChoice("");
      console.log("count 틀린 문제 전 라운드로 : ", count);
      console.log("choice 제발 공백 : ", choice);
      socket.emit('outQuiz', nickname);
    } else if (choice != "") {
      setRound(round+1);
      setQuizProblem(quizList.problems[round].question);
      setCount(round);
      console.log("count 다 풀었으면 6 : ", count);
      console.log("Round Num : ", round);
      console.log("this round quiz", quizList.problems[round].question);
      console.log("My choice : ", choice);
      console.log("choices : ", choices);
    } else if (choice == ""){
      setRound(round+1);
      setQuizProblem(quizList.problems[round].question);
      console.log("Round Num : ", round);
      console.log("this round quiz", quizList.problems[round].question);
    }

    if (quizList.problems.length <= round){
      console.log("quiz finish!!!!!!");
      setState(false);
      socket.emit('endQuiz', "quiz is over");
    } 
  };

  const enterResult = () => {
    console.log("quiz quizList : ", quizList);
    navigate('/dynamic-web_OXGame/quizResult', {state: {nickname : nickname, quizList : quizList, choices : choices, count : count}});
  }

  const quizSolve = () => {
    return (
      <div>
          <h1>퀴즈 : {quizTitle}</h1>
          <p>Q{round}. {quizProblem}</p>
  
          <input type="radio" value="true"  name="choice" checked={choice == "true"} onChange={onChange} disabled={buttonState} /> O
          &nbsp;&nbsp;&nbsp;
          <input type="radio" value="false" name="choice" checked={choice == "false"} onChange={onChange} disabled={buttonState} /> X
          <br/><br/>
          <button onClick={onSubmit}>다음</button>

          <br/><br/>
          true : {choiceTrue} <br/>
          false : {choiceFalse}
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