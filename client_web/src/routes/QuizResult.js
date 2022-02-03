import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';


const QuizRoom = () => {
  console.log("QuizResult에서 호출됨");
  const location = useLocation();
  const navigate = useNavigate();
  
  const nickname = location.state.nickname;
  const quizList = location.state.quizList;
  const choices = location.state.choices;
  const count = location.state.count;
  const [rankList, setRankList] = useState([]);

  useEffect(async() => {
    socket.on("rankQuiz", (data) => { // 퀴즈 순위 리스트 {rank: int, nickname: string}
      setRankList(data);
      console.log("rank Quiz : ", data);
    })
  }, []);

  const enterAnswer = () => {
    console.log("quiz quizList : ", quizList);
    navigate('/dynamic-web_OXGame/quizAnswer', {state: {nickname : nickname, quizList : quizList, choices : choices, count : count}});
  }

  const quizResult = () => {
    console.log("quiz result choices : ", choices);
    console.log("you sovle : ", choices.length);
    console.log("you solve count : ", count);

    const solve = choices.length - 1;
    const total = quizList.problems.length;

    return(
      <div>
        {
          rankList.map((rank, index) => (
          <tr>
            <td>{index}</td>
            <td>{rank}</td>
          </tr>
          ))
        }

        <h1>퀴즈 결과</h1>
        <h3>닉네임 : {nickname}</h3>

        푼 문제 : {count} / {total}

        <br/><br/>

        <table>

        </table>

        <br/><br/>

        <button onClick={enterAnswer}>정답 보기</button>
      </div>
    );
  }

  return (
    <div>
      {
        quizResult()
      }
    </div>
  );
};

export default QuizRoom;