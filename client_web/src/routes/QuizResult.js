import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';

const QuizRoom = () => {
  console.log("QuizResult에서 호출됨");
  const location = useLocation();
  const navigate = useNavigate();
  
  const room = location.state.room;
  const nickname = location.state.nickname;
  const manager = location.state.manager;
  const quizList = location.state.quizList;
  const choices = location.state.choices;
  const count = location.state.count;
  // const playerNum = location.state.playerNum;
  const nav_loadState = location.state.loadState;
  const nav_rankList = location.state.rankList;
  console.log("loadState : ", nav_loadState);
  const [rankList, setRankList] = useState(nav_rankList);
  const [loadState, setLoadState] = useState(nav_loadState);
  const total = quizList.problems.length

  useEffect(async() => {
    socket.on("rankQuiz", (data) => { // 퀴즈 순위 리스트 {rank: int, nickname: string, count: int}
      setRankList(data);
      console.log("rank Quiz : ", data);
    })
  }, []);

  const enterAnswer = () => {
    console.log("quiz quizList : ", quizList);
    navigate('/dynamic-web_OXGame/quizAnswer', {state: {room: room, nickname : nickname, manager : manager, quizList : quizList, choices : choices, count : count, rankList: rankList}});
  }

  const enterHome = () => {
    console.log("quiz quizList : ", quizList);
    navigate('/dynamic-web_OXGame', {state: {nickname : nickname}});
  }

  const quizResult = () => {
    console.log("quiz result choices : ", choices);
    console.log("you sovle : ", choices.length);
    console.log("you solve count : ", count);
    console.log("ranklist : ", rankList);
    // console("load state : ", loadState);

    return(
      <div>
        <h1>퀴즈 결과</h1>
        <h3>닉네임 : {nickname}</h3>

        푼 문제 : {count} / {total}

        <br/><br/>

        <table border="1" style={{margin: 'auto'}}>
          <tr>
            <td>순위</td>
            <td>닉네임</td>
            <td>정답 개수</td>
          </tr>

          {
            rankList.map((rank, index) => (
              <tr>
                <td>{index}</td>
                <td>{rank.nickname}</td>
                <td>{rank.count}</td>
              </tr>
            ))
          }
        </table>

        <br/><br/>

        <button onClick={enterAnswer}>정답 보기</button>

        <br/><br/>
        <button onClick={enterHome}>홈으로 이동</button>
      </div>
    );
  }

  const loading = () => {
    // console.log("player num  : ", playerNum);
    console.log("rankList.length  : ", rankList.length);
    // console("load state : ", loadState);

    return(
      <div>
        <h1>퀴즈 결과</h1>
        <h3>닉네임 : {nickname}</h3>

        푼 문제 : {count} / {total}

        <br/><br/>

        로딩 중 . . .
      </div>
    );
  }

  return (
    <div>
      {
        quizResult()
        // rankList.length == (playerNum) || loadState
        // ? quizResult()
        // : loading() 
      }
    </div>
  );
};

export default QuizRoom;