import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';


const QuizAnswer = () => {
  console.log("QuizAnswer에서 호출됨");
  const location = useLocation();
  const navigate = useNavigate();
  
  const room = location.state.room;
  const nickname = location.state.nickname;
  const quizList = location.state.quizList;
  const choices = location.state.choices;
  const count = location.state.count;
  const playerNum = location.state.playerNum;
  const rankList = location.state.rankList;
  const manager = location.state.manager;
  
  const quizTitle = useState(quizList.title);
  const [quizProblem, setQuizProblem] = useState(quizList.problems[0].question);
  const [quizAnswer, setQuizAnswer] = useState(quizList.problems[0].answer);
  const [prevState, setPrevState] = useState(false);
  const [nextState, setNextState] = useState(true);
  const [number, setNumber] = useState(0);

  console.log("nickname : ", nickname);
  console.log("quizList : ", quizList);

  const onPrevious = () =>{
    setNumber(number-1);
    setQuizProblem(quizList.problems[number-1].question);
    setQuizAnswer(quizList.problems[number-1].answer);
    setNextState(true);

    if (number == 1){
      setPrevState(false);
    }

    console.log("prev number : ", number+1);
    console.log("prev state : ", prevState);
  }

  const onNext = () =>{
    setNumber(number+1);
    setQuizProblem(quizList.problems[number+1].question);
    setQuizAnswer(quizList.problems[number+1].answer);
    setPrevState(true);

    if (number == (quizList.problems.length - 2)){
      setNextState(false);
    }

    console.log("next number : ", number+1);
    console.log("next state : ", nextState);
  }

  const onSubmit = () => {
    console.log("돌아가기!!");
    navigate('/dynamic-web_OXGame/quizResult', {state: {room: room, nickname : nickname, manager : manager, quizList : quizList, choices : choices, count : count, loadState: true, rankList: rankList}});
  }

  return (
    <div>

      <Menu />

      <br/><h1>Quiz Answer!!!</h1><br/>
      <h3>{quizTitle}</h3> <br/>
      
      Q{number+1}. {quizProblem}
      <br/><br/>
      정답 : {quizAnswer}
      <br/><br/><br/>

      {prevState &&
        <button onClick={onPrevious} class="btn btn-primary btn-sm" type="button"> 이전 </button>
      }
      &nbsp;&nbsp;&nbsp;

      {nextState && 
        <button onClick={onNext} class="btn btn-primary btn-sm" type="button"> 다음 </button>
      }

      <br/><br/><br/>
      <button onClick={onSubmit} class="btn btn-primary" type="button"> 돌아가기 </button>
        
    </div>
  );
};

export default QuizAnswer;