import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';


const QuizRoom = () => {
  console.log("SolveQuiz에서 호출됨");
  const location = useLocation();
  const navigate = useNavigate();

  const [quizList, setQuizList] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizProblem, setQuizProblem] = useState("");
  const [round, setRound] = useState(0);
  const [choice, setchoice] = useState("");
  const [choices, setchoices] = useState([]);
  const [state, setState] = useState(true);
  
  const plzMsg = "send me problems";
  const nickname = location.state.nickname;

  useEffect(() => {
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
  }, []);

  
  const onChange = e => {
    const { value } = e.target; // e.target 에서 name 과 value 를 추출

    // 해당 라운드에 선택한 정답
    setchoice(
      value // name 키를 가진 값을 value 로 설정
    );
  }

    // 문제 추가 버튼 클릭 => List에 추가
  const onSubmit = () => {
    console.log("Round : ", round);

    const cho = {
      round: round,
      choice: choice
    };
    setchoices(choices.concat(cho));

    if (quizList.problems.length <= round){
      console.log("quiz finish!!!!!!");
      setState(false);
    } else if (quizList.problems[round-1].answer != choice) {
      console.log("you choice wrong answer!!!");
      setState(false);
    } else {
      setRound(round+1);
      setQuizProblem(quizList.problems[round].question);
      console.log("Round Num : ", round);
      console.log("this round quiz", quizList.problems[round].question);
      console.log("My choice : ", choice);
      console.log("choices : ", choices);
    }
  };

  const enterAnswer = () => {
    console.log("quiz quizList : ", quizList);
    navigate('/dynamic-web_OXGame/quizAnswer', {state: {nickname : nickname, quizList : quizList}});
  }

  const quizSolve = () => {
    return (
      <div>
          <h1>퀴즈 : {quizTitle}</h1>
          <p>Q{round}. {quizProblem}</p>
  
          <input type="radio" value="true"  name="choice" onChange={onChange} /> O
          <input type="radio" value="false" name="choice" onChange={onChange} /> X
  
          <button onClick={onSubmit}>다음</button>
      </div>
    );
  }

  const quizResult = () => {
    console.log("quiz result choices : ", choices);
    console.log("you sovle : ", choices.length);

    const solve = choices.length - 1;
    const total = quizList.problems.length;

    return(
      <div>
        <h1>퀴즈 결과</h1>
        <h3>닉네임 : {nickname}</h3>

        푼 문제 : {solve} / {total}

        <br/><br/>

        <button onClick={enterAnswer}>정답 보기</button>
      </div>
    );
  }

  return (
    <div>
      {
        state === true
        ? quizSolve()
        : quizResult()
      }
    </div>
  );
};

export default QuizRoom;